"use client";

import { msg } from "@lingui/core/macro";
import { Button, Stack } from "@mantine/core";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDeepCompareMemo } from "use-deep-compare";

import type { EventWidgetInput } from "./types";

import { dayjs } from "../../../../common/dates/vars/dayjs";
import { createUrl } from "../../../../common/generic/lib/create-url";
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
      input: { id: id, include: { show: true } },
    }),
  );

  const eventsUpdateMutation = useMutation(
    orpcClientSideQueryClient.core.events.update.mutationOptions({
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

  const event = eventsGetQuery.data;

  const handleSave = useCallback(
    async ({ values }: EditEventFormSubmitInput) => {
      if (saving || deleting) return;

      setSaving(true);

      try {
        const updatedEvent = await eventsUpdateMutation.mutateAsync({
          data: {
            duration: dayjs
              .duration(
                dayjs
                  .tz(values.end, values.timezone)
                  .diff(dayjs.tz(values.start, values.timezone)),
              )
              .toISOString(),
            exclude: values.exclude,
            include: values.include,
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
          id: event.id,
        });

        notifications.success({ message: msg({ message: "Event updated" }) });

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
              .tz(updatedEvent.start, updatedEvent.timezone)
              .add(dayjs.duration(updatedEvent.duration))
              .format("YYYY-MM-DDTHH:mm:ss"),
            exclude: updatedEvent.exclude,
            include: updatedEvent.include,
            recurrence:
              updatedEvent.recurrence &&
              (updatedEvent.recurrence.frequency == "daily" ||
                updatedEvent.recurrence.frequency == "weekly" ||
                updatedEvent.recurrence.frequency == "monthly" ||
                updatedEvent.recurrence.frequency == "yearly")
                ? {
                    frequency: updatedEvent.recurrence.frequency,
                    interval: updatedEvent.recurrence.interval ?? 1,
                    recurring: "yes" as const,
                    termination:
                      updatedEvent.recurrence.termination?.type === "count"
                        ? {
                            ends: "after" as const,
                            times: updatedEvent.recurrence.termination.count,
                          }
                        : updatedEvent.recurrence.termination?.type === "until"
                          ? {
                              date: updatedEvent.recurrence.termination.until,
                              ends: "on" as const,
                            }
                          : {
                              ends: "never" as const,
                            },
                  }
                : { recurring: "no" as const },
            start: updatedEvent.start,
            timezone: updatedEvent.timezone,
            type: updatedEvent.type,
          },
        };
      } catch (error) {
        if (isOrpcDefinedError(error)) {
          if (error.code === "BAD_REQUEST") {
            notifications.error({ message: msg({ message: "Invalid input" }) });

            return {
              errors: {
                ...Object.fromEntries(
                  (values.exclude ?? []).map((_, index) => [
                    `exclude.${index}.start`,
                    getValidationIssue({
                      error: error,
                      path: `data.exclude.${index}.start`,
                    }).message,
                  ]),
                ),
                ...Object.fromEntries(
                  (values.include ?? []).map((_, index) => [
                    `include.${index}.start`,
                    getValidationIssue({
                      error: error,
                      path: `data.include.${index}.start`,
                    }).message,
                  ]),
                ),
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
      event,
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
      await eventsDeleteMutation.mutateAsync({ id: event.id });
    } catch (error) {
      if (isOrpcDefinedError(error) && error.code === "NOT_FOUND") {
        notifications.warning({
          message: msg({ message: "Event already deleted" }),
        });

        if (history.entries.length > 1) {
          const target = history.entries[history.entries.length - 2]!;
          const { url } = createUrl({ path: target.path, query: target.query });
          router.push(url);
        } else {
          router.push("/");
        }

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

    if (history.entries.length > 1) {
      const target = history.entries[history.entries.length - 2]!;
      const { url } = createUrl({ path: target.path, query: target.query });
      router.push(url);
    } else {
      router.push("/");
    }
  }, [
    deleting,
    event,
    eventsDeleteMutation.mutateAsync,
    history.entries.length,
    notifications.success,
    notifications.warning,
    router,
    saving,
  ]);

  const initialValues = useDeepCompareMemo(
    () => ({
      end: dayjs
        .tz(event.start, event.timezone)
        .add(dayjs.duration(event.duration))
        .format("YYYY-MM-DDTHH:mm:ss"),
      exclude: event.exclude,
      include: event.include,
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
                        date: event.recurrence.termination.until,
                        ends: "on" as const,
                      }
                    : {
                        ends: "never" as const,
                      },
            }
          : { recurring: "no" as const },
      start: event.start,
      timezone: event.timezone,
      type: event.type,
    }),
    [event],
  );

  return (
    <Stack h="100%" w="100%">
      <EditEventForm
        disabled={deleting}
        event={event}
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
