import { msg } from "@lingui/core/macro";
import { Group } from "@mantine/core";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import type { PageViewInput } from "../../../../../../../../types";
import type { Schemas } from "./schemas";

import { InstanceControls } from "../../../../../../../../../client/core/components/instance-controls";
import { InstanceWidget } from "../../../../../../../../../client/core/components/instance-widget";
import { LoadingWidget } from "../../../../../../../../../common/core/components/generic/loading-widget";
import { isOrpcDefinedError } from "../../../../../../../../../common/orpc/lib/is-orpc-defined-error";
import { Click } from "../../../../../../../../../isomorphic/generic/components/click";
import { HistoryLink } from "../../../../../../../../../isomorphic/generic/components/history-link";
import { Hydrated } from "../../../../../../../../../isomorphic/generic/components/hydrated";
import { RouteModal } from "../../../../../../../../../isomorphic/generic/components/route-modal";
import { Localized } from "../../../../../../../../../isomorphic/localization/components/localized";
import { orpcServerSideQueryClient } from "../../../../../../../../../server/orpc/vars/clients";
import { getQueryClient } from "../../../../../../../../../server/query/lib/get-query-client";

export async function ModalsInstancesEventStartPageView({
  pathParameters,
}: PageViewInput<typeof Schemas.Path, typeof Schemas.Query>) {
  const { queryClient } = getQueryClient();

  const instance = await (async () => {
    try {
      return await queryClient.fetchQuery(
        orpcServerSideQueryClient.core.instances.get.queryOptions({
          input: {
            eventId: pathParameters.event,
            include: { event: { include: { show: true } } },
            start: pathParameters.start,
          },
        }),
      );
    } catch (error) {
      if (isOrpcDefinedError(error) && error.code === "NOT_FOUND") notFound();
      throw error;
    }
  })();

  if (!instance.event?.recurrence)
    return (
      <RouteModal fallback="/" withCloseButton={false}>
        <LoadingWidget />
        <Click
          actions={[{ type: "pop" }]}
          component={HistoryLink}
          href={`/events/${instance.eventId}`}
          style={{ display: "none" }}
        />
      </RouteModal>
    );

  return (
    <RouteModal
      fallback="/"
      styles={{ title: { flexGrow: 1 } }}
      title={
        <Group justify="space-between">
          <Localized message={msg({ message: "Edit instance" })} />
          <InstanceControls
            event={pathParameters.event}
            start={pathParameters.start}
          />
        </Group>
      }
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Hydrated fallback={<LoadingWidget />}>
          <InstanceWidget
            event={pathParameters.event}
            start={pathParameters.start}
          />
        </Hydrated>
      </HydrationBoundary>
    </RouteModal>
  );
}
