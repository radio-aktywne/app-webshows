import { msg } from "@lingui/core/macro";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import type { PageViewInput } from "../../../../../../../types";
import type { Schemas } from "./schemas";

import { EventWidget } from "../../../../../../../../client/core/components/event-widget";
import { LoadingWidget } from "../../../../../../../../common/core/components/generic/loading-widget";
import { isOrpcDefinedError } from "../../../../../../../../common/orpc/lib/is-orpc-defined-error";
import { Hydrated } from "../../../../../../../../isomorphic/generic/components/hydrated";
import { RouteModal } from "../../../../../../../../isomorphic/generic/components/route-modal";
import { orpcServerSideQueryClient } from "../../../../../../../../server/orpc/vars/clients";
import { getQueryClient } from "../../../../../../../../server/query/lib/get-query-client";

export async function ModalsEventsIdPageView({
  pathParameters,
}: PageViewInput<typeof Schemas.Path, typeof Schemas.Query>) {
  const { queryClient } = getQueryClient();

  await (async () => {
    try {
      return await queryClient.fetchQuery(
        orpcServerSideQueryClient.core.events.get.queryOptions({
          input: {
            id: pathParameters.id,
          },
        }),
      );
    } catch (error) {
      if (isOrpcDefinedError(error) && error.code === "NOT_FOUND") notFound();
      throw error;
    }
  })();

  void queryClient.prefetchQuery(
    orpcServerSideQueryClient.core.shows.list.queryOptions({
      input: { limit: null },
    }),
  );

  return (
    <RouteModal fallback="/" title={msg({ message: "Edit event" })}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Hydrated fallback={<LoadingWidget />}>
          <EventWidget id={pathParameters.id} />
        </Hydrated>
      </HydrationBoundary>
    </RouteModal>
  );
}
