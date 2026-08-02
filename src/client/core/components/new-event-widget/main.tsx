"use client";

import { msg } from "@lingui/core/macro";
import { Stack } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import type { NewEventWidgetInput } from "./types";

import { dayjs } from "../../../../common/dates/vars/dayjs";
import { getValidationIssue } from "../../../../common/orpc/lib/get-validation-issue";
import { isOrpcDefinedError } from "../../../../common/orpc/lib/is-orpc-defined-error";
import { useHistory } from "../../../../isomorphic/generic/hooks/use-history";
import { useNotifications } from "../../../../isomorphic/notifications/hooks/use-notifications";
import { orpcClientSideQueryClient } from "../../../orpc/vars/clients";
import {
  CreateEventForm,
  type CreateEventFormSubmitInput,
} from "./components/create-event-form";

export function NewEventWidget({}: NewEventWidgetInput) {
  const [creating, setCreating] = useState(false);

  const router = useRouter();

  const { history } = useHistory();
  const { notifications } = useNotifications();

  const eventsCreateMutation = useMutation(
    orpcClientSideQueryClient.core.events.create.mutationOptions({
      meta: {
        awaits: [
          orpcClientSideQueryClient.core.events.list.key(),
          orpcClientSideQueryClient.core.instances.list.key(),
        ],
      },
    }),
  );

  const handleCreate = useCallback(
    async ({ values }: CreateEventFormSubmitInput) => {
      if (creating) return;

      setCreating(true);

      try {
        const event = await eventsCreateMutation.mutateAsync({
          data: {
            duration: dayjs
              .duration(
                dayjs
                  .tz(values.end, values.timezone)
                  .diff(dayjs.tz(values.start, values.timezone)),
              )
              .toISOString(),
            recurrence:
              values.recurrence.recurring === "yes"
                ? {
                    frequency: values.recurrence.frequency,
                    interval: values.recurrence.interval,
                    termination:
                      values.recurrence.termination.ends === "after"
                        ? {
                            count: values.recurrence.termination.times,
                            type: "count" as const,
                          }
                        : values.recurrence.termination.ends === "on"
                          ? {
                              type: "until" as const,
                              until: values.recurrence.termination.date,
                            }
                          : null,
                  }
                : null,
            showId: values.show,
            start: values.start,
            timezone: values.timezone,
            type: values.type,
          },
        });

        notifications.success({
          message: msg({ message: "Event created" }),
        });

        if (history.entries.length > 1) router.back();
        else router.push("/");

        return {
          values: {
            end: dayjs
              .tz(event.start, event.timezone)
              .add(dayjs.duration(event.duration))
              .format("YYYY-MM-DDTHH:mm:ss"),
            recurrence:
              event.recurrence &&
              (event.recurrence.frequency == "daily" ||
                event.recurrence.frequency == "weekly" ||
                event.recurrence.frequency == "monthly" ||
                event.recurrence.frequency == "yearly")
                ? {
                    frequency: event.recurrence.frequency,
                    interval: event.recurrence.interval ?? 1,
                    recurring: "yes" as const,
                    termination:
                      event.recurrence.termination?.type === "count"
                        ? {
                            ends: "after" as const,
                            times: event.recurrence.termination.count,
                          }
                        : event.recurrence.termination?.type === "until"
                          ? {
                              date: dayjs
                                .tz(
                                  event.recurrence.termination.until,
                                  event.timezone,
                                )
                                .format("YYYY-MM-DDTHH:mm:ss"),
                              ends: "on" as const,
                            }
                          : {
                              ends: "never" as const,
                            },
                  }
                : { recurring: "no" as const },
            show: event.showId,
            start: dayjs
              .tz(event.start, event.timezone)
              .format("YYYY-MM-DDTHH:mm:ss"),
            timezone: event.timezone,
            type: event.type,
          },
        };
      } catch (error) {
        if (isOrpcDefinedError(error)) {
          if (error.code === "BAD_REQUEST") {
            notifications.error({ message: msg({ message: "Invalid input" }) });

            return {
              errors: {
                "recurrence.frequency": getValidationIssue({
                  error: error,
                  path: "data.recurrence.frequency",
                }).message,
                "recurrence.interval": getValidationIssue({
                  error: error,
                  path: "data.recurrence.interval",
                }).message,
                "recurrence.termination.date": getValidationIssue({
                  error: error,
                  path: "data.recurrence.termination.until",
                }).message,
                "recurrence.termination.times": getValidationIssue({
                  error: error,
                  path: "data.recurrence.termination.count",
                }).message,
                show: getValidationIssue({
                  error: error,
                  path: "data.showId",
                }).message,
                start: getValidationIssue({
                  error: error,
                  path: "data.start",
                }).message,
                timezone: getValidationIssue({
                  error: error,
                  path: "data.timezone",
                }).message,
                type: getValidationIssue({
                  error: error,
                  path: "data.type",
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
        setCreating(false);
      }
    },
    [
      creating,
      eventsCreateMutation.mutateAsync,
      history.entries.length,
      notifications.error,
      notifications.success,
      router,
    ],
  );

  const handleError = useCallback(() => {
    notifications.error({ message: msg({ message: "Invalid input" }) });
  }, [notifications.error]);

  const initialValues = useMemo(
    () => ({
      recurrence: { recurring: "no" as const },
      show: null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      type: "live" as const,
    }),
    [],
  );

  return (
    <Stack h="100%" w="100%">
      <CreateEventForm
        initialValues={initialValues}
        onError={handleError}
        onSubmit={handleCreate}
      />
    </Stack>
  );
}
