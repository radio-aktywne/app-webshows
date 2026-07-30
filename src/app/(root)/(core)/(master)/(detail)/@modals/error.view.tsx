import { msg } from "@lingui/core/macro";

import type { ErrorViewInput } from "../../../../../types";

import { RouteModal } from "../../../../../../isomorphic/generic/components/route-modal";

export function ModalsErrorView({ reset }: ErrorViewInput) {
  return (
    <RouteModal fallback="/" title={msg({ message: "Something went wrong" })} />
  );
}
