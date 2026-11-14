# Cadence

An online course platform where instructors publish courses and students buy them, individually or through a team purchase of seats.

## People

**Student**:
A person with an Enrollment in a Course. Instructors and admins who enroll are Students too.
_Avoid_: Learner, Customer, Member

**Buyer**:
A person who made a Purchase. A Buyer is not always a Student: a team Buyer is not enrolled by the Purchase, and a Student who claims a Seat never made a Purchase.
_Avoid_: Purchaser, Spender

**Instructor**:
A person with the instructor role, who can create and teach Courses. Being an Instructor does not give any power over a Course the person does not own.
_Avoid_: Teacher, Author (for a Course), Creator, Seller

**Course owner**:
The person a given Course belongs to. Usually an Instructor, but a Platform admin can own a Course too.
_Avoid_: Instructor (when ownership is meant)

**Course staff**:
The Platform admin or the Course owner, for one Course. They can moderate its discussion and are exempt from the Country lock.
_Avoid_: Staff (unqualified), Instructor (when staff is meant)

**Platform admin**:
A person with the platform-wide admin role. Resolves Refunds.
_Avoid_: Admin (unqualified)

**Team admin**:
The Buyer who owns a Team and manages its Seats.
_Avoid_: Admin (unqualified), Manager

**Team buyer**:
A Buyer who made a Team purchase. Making one makes the Buyer the Team admin of their Team.
_Avoid_: Manager

**Cadence staff**:
The people at Cadence who work on the platform's behalf, for example when a message is signed off.
_Avoid_: The Cadence team, Support team

## Buying and access

**Purchase**:
The record of a Buyer paying for a Course, either for themselves or for a Team's Seats.
_Avoid_: Order, Transaction

**Individual purchase**:
A Purchase a Buyer makes for themselves. It gives the Buyer an Enrollment immediately.

**Team purchase**:
A Purchase of several Seats for one Course. It does not enroll the Buyer. It makes the Buyer a Team admin and creates one Unclaimed Seat per unit bought.

**Enrollment**:
A Student's access to one Course.
_Avoid_: Enrolment (spelling), Subscription

**List price**:
The price an instructor sets for a Course, before any country adjustment.
_Avoid_: Sticker price, Base price

**PPP discount**:
The percentage taken off the List price for a Buyer's country tier, based on Purchasing Power Parity. It applies only to Courses with PPP enabled.
_Avoid_: Parity, Regional discount, Coupon

**Effective price**:
What a Buyer pays for a Course: the List price minus the PPP discount for their country. It equals the List price when no discount applies.
_Avoid_: PPP price, Cost, Price paid

**Amount paid**:
The Effective price at the moment of Purchase, kept on the Purchase. For a Team purchase it is the total for all Seats. Later List price changes do not alter it.
_Avoid_: Spend, Total

**Country lock**:
The rule that a Purchase made at a PPP discount can only be used from the country it was bought in. Course staff are exempt.
_Avoid_: Region restriction, PPP block, Access Restricted

**Team**:
The group that owns Seats bought in a team Purchase. A Team is a purchasing group only.
_Avoid_: Team licence, Organisation

**Seat**:
One paid slot in a team Purchase that a Student can claim to get an Enrollment.
_Avoid_: Coupon, Licence, Invite, Voucher

**Seat link**:
The URL a Team admin shares so one person can claim a Seat.
_Avoid_: Coupon link, Redemption link, Code

**Unclaimed / Claimed**:
The two states of a Seat. A Seat is Claimed once a Student has used its Seat link to enroll.
_Avoid_: Redeemed, Used, Unused, Unredeemed

## Refunds

**Refund**:
A Student's request to get the Amount paid back for a Purchase, and the outcome of that request. Cadence reviews every Refund by hand.
_Avoid_: Cancellation, Cancel my purchase, Reversal, Chargeback, Money back

**Requested / Approved / Declined**:
The three states of a Refund. A Refund starts Requested and is resolved by a Platform admin as Approved or Declined.
_Avoid_: Pending, Raised, Open request

**Refund window**:
The 14 calendar days after a Purchase, counting the whole of the 14th day, during which a Refund can be requested.
_Avoid_: Cancel window

**Refund eligibility**:
A Purchase can be refunded only when all hold: it is inside the Refund window, less than 2 hours of Watched time, less than half the Lessons completed, it is not a Claimed Seat, and it has no Requested Refund.

**Refund amount**:
Always the Amount paid on the Purchase, never the current List price.
_Avoid_: Refundable amount

## Course structure

**Course**:
A product an instructor publishes, made of Modules.

**Module**:
An ordered group of Lessons within a Course.

**Lesson**:
One unit of learning within a Module, with a body, optional video and optional quiz.

**Curriculum**:
The ordered Modules and Lessons of a Course.
_Avoid_: Course Content, Content tab, Section, Chapter

**Lesson body**:
The written (markdown) material of a Lesson.
_Avoid_: Lesson content

**Sales copy**:
The long pitch shown on a Course's sales page.

**Description**:
The short blurb that summarises a Course.

**Student view**:
An instructor's preview of a Course as a Student sees it.
_Avoid_: Preview

**Draft / Published / Archived**:
The three statuses of a Course. Draft is not yet offered, Published is offered for sale, Archived is no longer offered for sale but existing Students keep access.
_Avoid_: Live, Unpublished, Hidden

## Learning

**Started**:
A Lesson a Student has opened but not completed.
_Avoid_: Reached, Opened, Stopped, In progress (for a Lesson)

**Furthest lesson**:
The latest Lesson, in Curriculum order, that a Student has opened. A Student has got as far as every Lesson up to their Furthest lesson, even ones they skipped. A Student drops off at their Furthest lesson.
_Avoid_: Reached, Stopped (for how far a Student got)

**Lesson completion**:
A Lesson marked Completed by a Student.
_Avoid_: Finished

**Course progress**:
The percentage of a Course's Lessons that a Student has completed.

**Course completion**:
Every Lesson in a Course is completed. It is derived from Lesson completions, never stored separately.
_Avoid_: Finished the course

**Watched time**:
How far into each Lesson's video a Student has played, summed across the Course. It is separate from progress.
_Avoid_: Video progress

## Discussion

**Comment**:
Any post a person makes on a Lesson.

**Reply**:
A Comment made under a top-level Comment. Replies go one level deep only.
_Avoid_: Answer (for a Reply)

**Question**:
A top-level Comment by someone who is not Course staff.

**Unanswered question**:
A Question with no Reply from Course staff. A Reply from another Student does not count.

**Quiz question / Quiz answer**:
Parts of a Lesson's quiz. Always written with the "Quiz" prefix to keep them apart from Questions and Replies.
_Avoid_: Question or Answer on their own, when a quiz is meant

**Rating**:
A Student's whole-star score from 1 to 5 for a Course they are enrolled in.
_Avoid_: Review (no written reviews exist)

## Money

**Gross revenue**:
The sum of the Amounts paid on Purchases.
_Avoid_: Revenue (unqualified), Sales

**Platform fee**:
The share of Gross revenue that Cadence keeps.
_Avoid_: Cut, Commission

**Net earnings**:
Gross revenue minus the Platform fee. This is what an instructor earns.
_Avoid_: Revenue (for the net figure), Earnings (for the gross figure)

## Account

**Sign in / Sign out / Sign up**:
The three ways a person starts, ends and creates a session.
_Avoid_: Log in, Log out, Register
