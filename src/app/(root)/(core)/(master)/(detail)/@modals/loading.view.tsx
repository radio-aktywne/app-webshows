import type { LoadingViewInput } from "../../../../../types";

import { LoadingWidget } from "../../../../../../common/core/components/generic/loading-widget";
import { RouteModal } from "../../../../../../isomorphic/generic/components/route-modal";

export async function ModalsLoadingView({}: LoadingViewInput) {
  return (
    <RouteModal fallback="/" withCloseButton={false}>
      <LoadingWidget />
    </RouteModal>
  );
}
