import { msg } from "@lingui/core/macro";

import type { ErrorViewInput } from "../../../../../types";

import { RouteModal } from "../../../../../../isomorphic/generic/components/route-modal";
import { Localized } from "../../../../../../isomorphic/localization/components/localized";

export function ModalsErrorView({ reset }: ErrorViewInput) {
  return (
    <RouteModal
      fallback="/"
      title={<Localized message={msg({ message: "Something went wrong" })} />}
    />
  );
}
