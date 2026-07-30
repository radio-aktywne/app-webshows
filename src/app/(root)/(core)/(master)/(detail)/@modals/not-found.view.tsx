import { msg } from "@lingui/core/macro";

import type { NotFoundViewInput } from "../../../../../types";

import { RouteModal } from "../../../../../../isomorphic/generic/components/route-modal";

export async function ModalsNotFoundView({}: NotFoundViewInput) {
  return <RouteModal fallback="/" title={msg({ message: "Page not found" })} />;
}
