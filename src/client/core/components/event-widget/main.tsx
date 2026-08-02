"use client";

import { msg } from "@lingui/core/macro";
import { Button, Stack } from "@mantine/core";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDeepCompareMemo } from "use-deep-compare";

import type { EventWidgetInput } from "./types";

import { dayjs } from "../../../../common/dates/vars/dayjs";
import { getValidationIssue } from "../../../../common/orpc/lib/get-validation-issue";
import { isOrpcDefinedError } from "../../../../common/orpc/lib/is-orpc-defined-error";
import { useHistory } from "../../../../isomorphic/generic/hooks/use-history";
import { useLocalization } from "../../../../isomorphic/localization/hooks/use-localization";
import { useNotifications } from "../../../../isomorphic/notifications/hooks/use-notifications";
import { orpcClientSideQueryClient } from "../../../orpc/vars/clients";
import {
  EditEventForm,
  type EditEventFormSubmitInput,
} from "./components/edit-event-form";

export function EventWidget({ id }: EventWidgetInput) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();

  const { history } = useHistory();
  const { localization } = useLocalization();
  const { notifications } = useNotifications();

  const eventsGetQuery = useSuspenseQuery(
    orpcClientSideQueryClient.core.events.get.queryOptions({
      input: { id: id },
    }),
  );

  const eventsUpdateMutation = useMutation(
    orpcClientSideQueryClient.core.events.update.mutationOptions({
      meta: {
        awaits: [
          orpcClientSideQueryClient.core.events.list.key(),
          orpcClientSideQueryClient.core.events.get.key({
            input: { id: id },
          }),
          orpcClientSideQueryClient.core.instances.list.key(),
          orpcClientSideQueryClient.core.instances.get.key({
            input: { eventId: id },
          }),
        ],
      },
    }),
  );

  const eventsDeleteMutation = useMutation(
    orpcClientSideQueryClient.core.events.delete.mutationOptions({
      meta: {
        awaits: [
          orpcClientSideQueryClient.core.events.list.key(),
          orpcClientSideQueryClient.core.instances.list.key(),
        ],
      },
    }),
  );

  const handleSave = useCallback(
    async ({ values }: EditEventFormSubmitInput) => {
      if (saving || deleting) return;

      setSaving(true);

      try {
        const event = await eventsUpdateMutation.mutateAsync({
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
            start: values.start,
            timezone: values.timezone,
            type: values.type,
          },
          id: eventsGetQuery.data.id,
        });

        notifications.success({ message: msg({ message: "Event updated" }) });

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
        setSaving(false);
      }
    },
    [
      deleting,
      eventsUpdateMutation.mutateAsync,
      history.entries.length,
      notifications.error,
      notifications.success,
      router,
      saving,
    ],
  );

  const handleError = useCallback(() => {
    notifications.error({ message: msg({ message: "Invalid input" }) });
  }, [notifications.error]);

  const handleDelete = useCallback(async () => {
    if (saving || deleting) return;

    setDeleting(true);

    try {
      await eventsDeleteMutation.mutateAsync({ id: eventsGetQuery.data.id });
    } catch (error) {
      if (isOrpcDefinedError(error) && error.code === "NOT_FOUND") {
        notifications.warning({
          message: msg({ message: "Event already deleted" }),
        });

        if (history.entries.length > 1) router.back();
        else router.push("/");

        return;
      }

      notifications.error({
        message: msg({ message: "An unexpected error occurred" }),
      });

      throw error;
    } finally {
      setDeleting(false);
    }

    notifications.success({ message: msg({ message: "Event deleted" }) });

    if (history.entries.length > 1) router.back();
    else router.push("/");
  }, [
    deleting,
    eventsDeleteMutation.mutateAsync,
    eventsGetQuery.data.id,
    history.entries.length,
    notifications.success,
    notifications.warning,
    router,
    saving,
  ]);

  const initialValues = useDeepCompareMemo(
    () => ({
      end: dayjs
        .tz(eventsGetQuery.data.start, eventsGetQuery.data.timezone)
        .add(dayjs.duration(eventsGetQuery.data.duration))
        .format("YYYY-MM-DDTHH:mm:ss"),
      recurrence:
        eventsGetQuery.data.recurrence &&
        (eventsGetQuery.data.recurrence.frequency == "daily" ||
          eventsGetQuery.data.recurrence.frequency == "weekly" ||
          eventsGetQuery.data.recurrence.frequency == "monthly" ||
          eventsGetQuery.data.recurrence.frequency == "yearly")
          ? {
              frequency: eventsGetQuery.data.recurrence.frequency,
              interval: eventsGetQuery.data.recurrence.interval ?? 1,
              recurring: "yes" as const,
              termination:
                eventsGetQuery.data.recurrence.termination?.type === "count"
                  ? {
                      ends: "after" as const,
                      times: eventsGetQuery.data.recurrence.termination.count,
                    }
                  : eventsGetQuery.data.recurrence.termination?.type === "until"
                    ? {
                        date: dayjs
                          .tz(
                            eventsGetQuery.data.recurrence.termination.until,
                            eventsGetQuery.data.timezone,
                          )
                          .format("YYYY-MM-DDTHH:mm:ss"),
                        ends: "on" as const,
                      }
                    : {
                        ends: "never" as const,
                      },
            }
          : { recurring: "no" as const },
      show: eventsGetQuery.data.showId,
      start: dayjs
        .tz(eventsGetQuery.data.start, eventsGetQuery.data.timezone)
        .format("YYYY-MM-DDTHH:mm:ss"),
      timezone: eventsGetQuery.data.timezone,
      type: eventsGetQuery.data.type,
    }),
    [eventsGetQuery.data],
  );

  return (
    <Stack h="100%" w="100%">
      <EditEventForm
        disabled={deleting}
        initialValues={initialValues}
        onError={handleError}
        onSubmit={handleSave}
      />
      <Button
        color="ra-red"
        disabled={saving}
        loading={deleting}
        onClick={handleDelete}
        style={{ flexShrink: 0 }}
      >
        {localization.localize(msg({ message: "Delete" }))}
      </Button>
    </Stack>
  );
}
