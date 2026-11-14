import { data } from "react-router";
import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import {
  UserRole,
  users,
  courses,
  enrollments,
  purchases,
} from "~/db/schema";
import { getCurrentUserId } from "~/lib/session";
import { resolveCountry } from "~/lib/country.server";
import { checkPppAccess } from "~/lib/ppp";

function getUserById(id: number) {
  return db.select().from(users).where(eq(users.id, id)).get();
}

function getCourseById(id: number) {
  return db.select().from(courses).where(eq(courses.id, id)).get();
}

function findEnrollment(userId: number, courseId: number) {
  return db
    .select()
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
    )
    .get();
}

function isUserEnrolled(userId: number, courseId: number) {
  return !!findEnrollment(userId, courseId);
}

function findPurchase(userId: number, courseId: number) {
  return db
    .select()
    .from(purchases)
    .where(and(eq(purchases.userId, userId), eq(purchases.courseId, courseId)))
    .get();
}

// ─── Access Resolution ───
// One place that answers "who is this, and what may they do with this course?".
//
// getAccess never throws — the lesson page needs to render a paywall preview for
// signed-out and unenrolled visitors rather than erroring. The require* wrappers
// are built on it for the routes that should just reject.
//
// Uses positional parameters (project convention).

export type Access = {
  userId: number | null;
  user: ReturnType<typeof getUserById>;
  isPlatformAdmin: boolean;
  /** The Course owner: the instructor who owns this specific course. */
  isOwningInstructor: boolean;
  /** Course staff — the people who speak for the course. */
  isCourseStaff: boolean;
  enrolled: boolean;
  countryLocked: boolean;
  countryLockCountry: string | null;
  pppPurchaseCountry: string | null;
  /**
   * May they read the course's content (lesson bodies, comments)?
   * Staff always can. Students need an Enrollment that isn't under a Country lock.
   */
  canViewContent: boolean;
};

const SIGNED_OUT: Access = {
  userId: null,
  user: undefined,
  isPlatformAdmin: false,
  isOwningInstructor: false,
  isCourseStaff: false,
  enrolled: false,
  countryLocked: false,
  countryLockCountry: null,
  pppPurchaseCountry: null,
  canViewContent: false,
};

export async function getAccess(
  request: Request,
  courseId: number
): Promise<Access> {
  const userId = await getCurrentUserId(request);
  if (!userId) return SIGNED_OUT;

  const user = getUserById(userId);
  if (!user) return SIGNED_OUT;

  const course = getCourseById(courseId);
  const isPlatformAdmin = user.role === UserRole.PlatformAdmin;
  const isOwningInstructor = course?.instructorId === userId;
  const isCourseStaff = isPlatformAdmin || isOwningInstructor;
  const enrolled = isUserEnrolled(userId, courseId);

  // The Country lock only restricts Students who bought at a discount — Course staff are exempt.
  let ppp = {
    locked: false,
    lockedCountry: null as string | null,
    purchaseCountry: null as string | null,
  };

  if (enrolled && !isCourseStaff && course) {
    const purchase = findPurchase(userId, courseId);
    const currentCountry = await resolveCountry(request);
    ppp = checkPppAccess(
      course.price,
      course.pppEnabled,
      purchase?.country ?? null,
      currentCountry
    );
  }

  return {
    userId,
    user,
    isPlatformAdmin,
    isOwningInstructor,
    isCourseStaff,
    enrolled,
    countryLocked: ppp.locked,
    countryLockCountry: ppp.lockedCountry,
    pppPurchaseCountry: ppp.purchaseCountry,
    canViewContent: isCourseStaff || (enrolled && !ppp.locked),
  };
}

/**
 * Throws 401 unless someone is signed in. Returns their user id.
 */
export async function requireUserId(request: Request): Promise<number> {
  const userId = await getCurrentUserId(request);
  if (!userId) {
    throw data("Select a user from the DevUI panel.", { status: 401 });
  }
  return userId;
}

/**
 * Throws 401 when signed out, 403 when the user can't see the course's content.
 * Use in actions — loader guards don't protect actions.
 */
export async function requireContentAccess(
  request: Request,
  courseId: number
): Promise<Access> {
  const access = await getAccess(request, courseId);

  if (!access.userId) {
    throw data("Select a user from the DevUI panel.", { status: 401 });
  }

  if (!access.canViewContent) {
    throw data("You must be enrolled in this course.", { status: 403 });
  }

  return access;
}

/**
 * Throws unless the user is Course staff: the Course owner or a Platform admin.
 */
export async function requireCourseStaff(
  request: Request,
  courseId: number
): Promise<Access> {
  const access = await getAccess(request, courseId);

  if (!access.userId) {
    throw data("Select a user from the DevUI panel.", { status: 401 });
  }

  if (!access.isCourseStaff) {
    throw data("Only Course staff can do that.", { status: 403 });
  }

  return access;
}

/**
 * Throws unless the user is an instructor or a Platform admin, without tying them to a
 * particular course — for pages that span all of someone's courses.
 */
export async function requireInstructorOrPlatformAdmin(request: Request) {
  const userId = await requireUserId(request);
  const user = getUserById(userId);

  if (
    !user ||
    (user.role !== UserRole.Instructor && user.role !== UserRole.PlatformAdmin)
  ) {
    throw data("Only instructors can access this page.", { status: 403 });
  }

  return { userId, user, isPlatformAdmin: user.role === UserRole.PlatformAdmin };
}
