import { msg } from "@lingui/core/macro";

import type { NotFoundViewInput } from "../../../../../../../types";

import { RouteModal } from "../../../../../../../../isomorphic/generic/components/route-modal";

export async function ModalsEventsIdNotFoundView({}: NotFoundViewInput) {
  return (
    <RouteModal fallback="/" title={msg({ message: "Event not found" })} />
  );
}
