import { redirect } from "react-router";
import type { Route } from "./+types/legacy.redeem.$code";

// Permanent redirect from the old seat link (/redeem/:code), which is already
// shared with Students. Keeps the query string.
export function loader({ params, request }: Route.LoaderArgs) {
  const { search } = new URL(request.url);
  return redirect(`/claim/${encodeURIComponent(params.code)}${search}`, 301);
}
