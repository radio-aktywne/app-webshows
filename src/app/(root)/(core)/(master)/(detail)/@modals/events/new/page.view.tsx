import { msg } from "@lingui/core/macro";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import type { PageViewInput } from "../../../../../../../types";
import type { Schemas } from "./schemas";

import { NewEventWidget } from "../../../../../../../../client/core/components/new-event-widget";
import { LoadingWidget } from "../../../../../../../../common/core/components/generic/loading-widget";
import { Hydrated } from "../../../../../../../../isomorphic/generic/components/hydrated";
import { RouteModal } from "../../../../../../../../isomorphic/generic/components/route-modal";
import { Localized } from "../../../../../../../../isomorphic/localization/components/localized";
import { orpcServerSideQueryClient } from "../../../../../../../../server/orpc/vars/clients";
import { getQueryClient } from "../../../../../../../../server/query/lib/get-query-client";

export async function ModalsEventsNewPageView({}: PageViewInput<
  typeof Schemas.Path,
  typeof Schemas.Query
>) {
  const { queryClient } = getQueryClient();

  void queryClient.prefetchQuery(
    orpcServerSideQueryClient.core.shows.list.queryOptions({
      input: { limit: null },
    }),
  );

  return (
    <RouteModal
      fallback="/"
      title={<Localized message={msg({ message: "Create event" })} />}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Hydrated fallback={<LoadingWidget />}>
          <NewEventWidget />
        </Hydrated>
      </HydrationBoundary>
    </RouteModal>
  );
}
