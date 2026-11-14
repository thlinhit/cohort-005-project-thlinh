import { redirect } from "react-router";
import type { Route } from "./+types/legacy.signup";

// Permanent redirect from the old sign-up path. Keeps the query string.
export function loader({ request }: Route.LoaderArgs) {
  const { search } = new URL(request.url);
  return redirect(`/sign-up${search}`, 301);
}
