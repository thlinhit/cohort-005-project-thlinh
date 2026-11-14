import { redirect } from "react-router";
import type { Route } from "./+types/legacy.login";

// Permanent redirect from the old sign-in path. Keeps the query string.
export function loader({ request }: Route.LoaderArgs) {
  const { search } = new URL(request.url);
  return redirect(`/sign-in${search}`, 301);
}
