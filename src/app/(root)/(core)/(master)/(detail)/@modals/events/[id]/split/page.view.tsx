import { msg } from "@lingui/core/macro";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import type { PageViewInput } from "../../../../../../../../types";
import type { Schemas } from "./schemas";

import { SplitEventWidget } from "../../../../../../../../../client/core/components/split-event-widget";
import { LoadingWidget } from "../../../../../../../../../common/core/components/generic/loading-widget";
import { isOrpcDefinedError } from "../../../../../../../../../common/orpc/lib/is-orpc-defined-error";
import { Hydrated } from "../../../../../../../../../isomorphic/generic/components/hydrated";
import { RouteModal } from "../../../../../../../../../isomorphic/generic/components/route-modal";
import { Localized } from "../../../../../../../../../isomorphic/localization/components/localized";
import { orpcServerSideQueryClient } from "../../../../../../../../../server/orpc/vars/clients";
import { getQueryClient } from "../../../../../../../../../server/query/lib/get-query-client";

export async function ModalsEventsIdSplitPageView({
  pathParameters,
  queryParameters,
}: PageViewInput<typeof Schemas.Path, typeof Schemas.Query>) {
  const { queryClient } = getQueryClient();

  await (async () => {
    try {
      return await queryClient.fetchQuery(
        orpcServerSideQueryClient.core.events.get.queryOptions({
          input: {
            id: pathParameters.id,
            include: { show: true },
          },
        }),
      );
    } catch (error) {
      if (isOrpcDefinedError(error) && error.code === "NOT_FOUND") notFound();
      throw error;
    }
  })();

  return (
    <RouteModal
      fallback="/"
      title={<Localized message={msg({ message: "Split event" })} />}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Hydrated fallback={<LoadingWidget />}>
          <SplitEventWidget at={queryParameters.at} id={pathParameters.id} />
        </Hydrated>
      </HydrationBoundary>
    </RouteModal>
  );
}
