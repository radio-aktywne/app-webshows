import { msg } from "@lingui/core/macro";

import type { NotFoundViewInput } from "../../../../../../../types";

import { RouteModal } from "../../../../../../../../isomorphic/generic/components/route-modal";
import { Localized } from "../../../../../../../../isomorphic/localization/components/localized";

export async function ModalsEventsIdNotFoundView({}: NotFoundViewInput) {
  return (
    <RouteModal
      fallback="/"
      title={<Localized message={msg({ message: "Event not found" })} />}
    />
  );
}
