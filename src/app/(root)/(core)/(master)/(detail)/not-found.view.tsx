import type { NotFoundViewInput } from "../../../../types";

import { NotFoundWidget } from "../../../../../isomorphic/core/components/generic/not-found-widget";

export async function CoreDetailNotFoundView({}: NotFoundViewInput) {
  return <NotFoundWidget />;
}
