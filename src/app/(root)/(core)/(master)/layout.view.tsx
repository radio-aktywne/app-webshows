import {
  MasterDetailLayout,
  MasterDetailLayoutMasterPanel,
} from "@radio-aktywne/ui";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import type { LayoutViewInput } from "../../../types";
import type { Schemas } from "./schemas";
import type { Keys } from "./types";

import { ShowsWidget } from "../../../../client/core/components/shows-widget";
import { LoadingWidget } from "../../../../common/core/components/generic/loading-widget";
import { Hydrated } from "../../../../isomorphic/generic/components/hydrated";
import { orpcServerSideQueryClient } from "../../../../server/orpc/vars/clients";
import { getQueryClient } from "../../../../server/query/lib/get-query-client";

export async function CoreMasterLayoutView({
  children,
}: LayoutViewInput<typeof Schemas.Path, Keys.Slots>) {
  const { queryClient } = getQueryClient();

  const limit = 10 as const;
  const order = { title: "asc" } as const;

  void queryClient.prefetchQuery(
    orpcServerSideQueryClient.core.shows.list.queryOptions({
      input: { limit: limit, offset: 0, order: order },
    }),
  );

  return (
    <MasterDetailLayout>
      <MasterDetailLayoutMasterPanel span={3}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Hydrated fallback={<LoadingWidget />}>
            <ShowsWidget limit={limit} order={order} />
          </Hydrated>
        </HydrationBoundary>
      </MasterDetailLayoutMasterPanel>
      {children}
    </MasterDetailLayout>
  );
}
