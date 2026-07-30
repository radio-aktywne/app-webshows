import { MasterDetailLayoutDetailPanel } from "@radio-aktywne/ui";
import { Suspense } from "react";

import type { LayoutViewInput } from "../../../../types";
import type { Schemas } from "./schemas";
import type { Keys } from "./types";

import { LoadingWidget } from "../../../../../common/core/components/generic/loading-widget";

export async function CoreDetailLayoutView({
  main,
  modals,
}: LayoutViewInput<typeof Schemas.Path, Keys.Slots>) {
  return (
    <MasterDetailLayoutDetailPanel span={9}>
      <Suspense fallback={<LoadingWidget />}>
        {main}
        {modals}
      </Suspense>
    </MasterDetailLayoutDetailPanel>
  );
}
