"use client";

import type { SetNonNullableDeep } from "type-fest";

import { msg } from "@lingui/core/macro";
import { Box, Button, Stack } from "@mantine/core";
import { Calendar } from "@radio-aktywne/ui";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo } from "react";

import type { CalendarWidgetInput } from "./types";

import { LoadingWidget } from "../../../../common/core/components/generic/loading-widget";
import { dayjs } from "../../../../common/dates/vars/dayjs";
import { useLocalization } from "../../../../isomorphic/localization/hooks/use-localization";
import { useNow } from "../../../generic/hooks/use-now";
import { orpcClientSideQueryClient } from "../../../orpc/vars/clients";
import { Controls } from "./components/controls";
import { InstanceItem } from "./components/instance-item";

export function CalendarWidget({ date }: CalendarWidgetInput) {
  const parsedDate = useMemo(
    () => (date ? dayjs(date, "YYYY-MM-DD") : dayjs()),
    [date],
  );

  const { localization } = useLocalization();
  const { timestamp } = useNow();

  const now = useMemo(
    () => dayjs.unix(timestamp).locale(localization.locale).local(),
    [localization.locale, timestamp],
  );

  const localDate = useMemo(
    () => parsedDate.locale(localization.locale).local(),
    [localization.locale, parsedDate],
  );

  const instancesListInput = useMemo(
    () => ({
      end: localDate
        .startOf("week")
        .add(1, "week")
        .add(1, "week")
        .add(26, "hours")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss[Z]"),
      include: { event: { include: { show: true } } },
      start: localDate
        .startOf("week")
        .subtract(1, "week")
        .subtract(26, "hours")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss[Z]"),
    }),
    [localDate],
  );

  const instancesListQuery = useQuery(
    orpcClientSideQueryClient.core.instances.list.queryOptions({
      input: instancesListInput,
    }),
  );

  const instancesList = instancesListQuery.data as SetNonNullableDeep<
    typeof instancesListQuery.data,
    "instances.0.event"
  >;

  return (
    <Stack align="center" h="100%" justify="space-between" w="100%">
      <Controls date={localDate} />
      <Box style={{ overflow: "auto" }} w="100%">
        {instancesList ? (
          <Calendar current={localDate} now={now}>
            {instancesList.instances.map((instance) => (
              <InstanceItem
                current={localDate}
                instance={instance}
                key={`${instance.event.id}-${instance.start}`}
              />
            ))}
          </Calendar>
        ) : (
          <LoadingWidget />
        )}
      </Box>
      <Button
        component={Link}
        fullWidth
        href="/events/new"
        style={{ flexShrink: 0 }}
      >
        {localization.localize(msg({ message: "Create" }))}
      </Button>
    </Stack>
  );
}
