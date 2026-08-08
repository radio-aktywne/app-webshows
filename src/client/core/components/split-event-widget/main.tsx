"use client";

import { msg } from "@lingui/core/macro";
import { Stack } from "@mantine/core";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDeepCompareMemo } from "use-deep-compare";

import type { SplitEventWidgetInput } from "./types";

import { dayjs } from "../../../../common/dates/vars/dayjs";
import { createUrl } from "../../../../common/generic/lib/create-url";
import { getValidationIssue } from "../../../../common/orpc/lib/get-validation-issue";
import { isOrpcDefinedError } from "../../../../common/orpc/lib/is-orpc-defined-error";
import { useHistory } from "../../../../isomorphic/generic/hooks/use-history";
import { useNotifications } from "../../../../isomorphic/notifications/hooks/use-notifications";
import { orpcClientSideQueryClient } from "../../../orpc/vars/clients";
import {
  SplitEventForm,
  type SplitEventFormSubmitInput,
} from "./components/split-event-form";

export function SplitEventWidget({ at, id }: SplitEventWidgetInput) {
  const [applying, setApplying] = useState(false);

  const router = useRouter();

  const { history } = useHistory();
  const { notifications } = useNotifications();

  const eventsGetQuery = useSuspenseQuery(
    orpcClientSideQueryClient.core.events.get.queryOptions({
      input: { id: id, include: { show: true } },
    }),
  );

  const eventsSplitMutation = useMutation(
    orpcClientSideQueryClient.core.events.split.mutationOptions({
      meta: {
        awaits: [
          orpcClientSideQueryClient.core.events.list.key(),
          orpcClientSideQueryClient.core.events.get.key(),
          orpcClientSideQueryClient.core.instances.list.key(),
          orpcClientSideQueryClient.core.instances.get.key(),
        ],
      },
    }),
  );

  const event = eventsGetQuery.data;

  const handleSave = useCallback(
    async ({ values }: SplitEventFormSubmitInput) => {
      if (applying) return;

      setApplying(true);

      try {
        const result = await eventsSplitMutation.mutateAsync({
          data: {
            at: at,
            update: {
              duration: dayjs
                .duration(
                  dayjs
                    .tz(values.end, values.timezone)
                    .diff(dayjs.tz(values.start, values.timezone)),
                )
                .toISOString(),
              start: values.start,
              timezone: values.timezone,
              type: values.type,
            },
          },
          id: event.id,
        });

        notifications.success({ message: msg({ message: "Event split" }) });

        if (history.entries.length > 1) {
          const target = history.entries[history.entries.length - 2]!;
          const { url } = createUrl({ path: target.path, query: target.query });
          router.push(url);
        } else {
          router.push("/");
        }

        return {
          values: {
            end: dayjs
              .tz(result.after.start, result.after.timezone)
              .add(dayjs.duration(result.after.duration))
              .format("YYYY-MM-DDTHH:mm:ss"),
            start: result.after.start,
            timezone: result.after.timezone,
            type: result.after.type,
          },
        };
      } catch (error) {
        if (isOrpcDefinedError(error)) {
          if (error.code === "BAD_REQUEST") {
            notifications.error({ message: msg({ message: "Invalid input" }) });

            return {
              errors: {
                start: getValidationIssue({
                  error: error,
                  path: "data.update.start",
                }).message,
                timezone: getValidationIssue({
                  error: error,
                  path: "data.update.timezone",
                }).message,
                type: getValidationIssue({
                  error: error,
                  path: "data.update.type",
                }).message,
              },
            };
          }

          if (error.code === "CONFLICT") {
            notifications.error({
              message: msg({ message: "Conflicting input" }),
            });

            return;
          }
        }

        notifications.error({
          message: msg({ message: "An unexpected error occurred" }),
        });

        throw error;
      } finally {
        setApplying(false);
      }
    },
    [
      applying,
      at,
      event,
      eventsSplitMutation.mutateAsync,
      history.entries.length,
      notifications.error,
      notifications.success,
      router,
    ],
  );

  const handleError = useCallback(() => {
    notifications.error({ message: msg({ message: "Invalid input" }) });
  }, [notifications.error]);

  const initialValues = useDeepCompareMemo(
    () => ({
      end: dayjs
        .tz(at, event.timezone)
        .add(dayjs.duration(event.duration))
        .format("YYYY-MM-DDTHH:mm:ss"),
      start: at,
      timezone: event.timezone,
      type: event.type,
    }),
    [event],
  );

  return (
    <Stack h="100%" w="100%">
      <SplitEventForm
        event={event}
        initialValues={initialValues}
        onError={handleError}
        onSubmit={handleSave}
      />
    </Stack>
  );
}
