"use client";

import { msg } from "@lingui/core/macro";
import { Button, Stack, Title } from "@mantine/core";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDeepCompareMemo } from "use-deep-compare";

import type { EventWidgetInput } from "./types";

import { dayjs } from "../../../../common/dates/vars/dayjs";
import { getValidationIssue } from "../../../../common/orpc/lib/get-validation-issue";
import { isOrpcDefinedError } from "../../../../common/orpc/lib/is-orpc-defined-error";
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

  const { localization } = useLocalization();
  const { notifications } = useNotifications();

  const eventsGetQuery = useSuspenseQuery(
    orpcClientSideQueryClient.core.events.get.queryOptions({
      input: { id: id },
    }),
  );

  const eventsUpdateMutation = useMutation(
    orpcClientSideQueryClient.core.events.update.mutationOptions(),
  );

  const eventsDeleteMutation = useMutation(
    orpcClientSideQueryClient.core.events.delete.mutationOptions(),
  );

  const handleSave = useCallback(
    async ({ values }: EditEventFormSubmitInput) => {
      if (saving || deleting) return;

      if (
        values.recurrence.recurring === "yes" &&
        values.recurrence.termination.ends === "on" &&
        !values.recurrence.termination.date
      ) {
        notifications.error({ message: msg({ message: "Invalid input" }) });

        return {
          errors: {
            "recurrence.termination.date": msg({
              message: "Recurrence end date is required",
            }),
          },
        };
      }

      setSaving(true);

      try {
        const event = await eventsUpdateMutation.mutateAsync({
          data: {
            duration: dayjs
              .duration(
                dayjs
                  .tz(values.end.replace(" ", "T"), values.timezone)
                  .diff(
                    dayjs.tz(values.start.replace(" ", "T"), values.timezone),
                  ),
              )
              .toISOString(),
            recurrence:
              values.recurrence.recurring === "yes"
                ? {
                    frequency: values.recurrence.frequency,
                    interval: values.recurrence.interval,
                    termination:
                      values.recurrence.termination.ends === "after" &&
                      values.recurrence.termination.times
                        ? {
                            count: values.recurrence.termination.times,
                            type: "count" as const,
                          }
                        : values.recurrence.termination.ends === "on" &&
                            values.recurrence.termination.date
                          ? {
                              type: "until" as const,
                              until: values.recurrence.termination.date.replace(
                                " ",
                                "T",
                              ),
                            }
                          : null,
                  }
                : null,
            start: values.start.replace(" ", "T"),
            timezone: values.timezone,
            type: values.type,
          },
          id: eventsGetQuery.data.id,
        });

        notifications.success({ message: msg({ message: "Event updated" }) });

        router.push("/events");

        return {
          values: {
            end: dayjs(event.start)
              .add(dayjs.duration(event.duration))
              .toISOString()
              .replace("T", " "),
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
                              date: event.recurrence.termination.until.replace(
                                "T",
                                " ",
                              ),
                              ends: "on" as const,
                            }
                          : {
                              ends: "never" as const,
                            },
                  }
                : { recurring: "no" as const },
            show: event.showId,
            start: event.start.replace("T", " "),
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

        router.push("/events");
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
    router.push("/events");
  }, [
    deleting,
    eventsDeleteMutation.mutateAsync,
    eventsGetQuery.data.id,
    notifications.success,
    notifications.warning,
    router,
    saving,
  ]);

  const initialValues = useDeepCompareMemo(
    () => ({
      end: dayjs(eventsGetQuery.data.start)
        .add(dayjs.duration(eventsGetQuery.data.duration))
        .toISOString()
        .replace("T", " "),
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
                        date: eventsGetQuery.data.recurrence.termination.until.replace(
                          "T",
                          " ",
                        ),
                        ends: "on" as const,
                      }
                    : {
                        ends: "never" as const,
                      },
            }
          : { recurring: "no" as const },
      show: eventsGetQuery.data.showId,
      start: eventsGetQuery.data.start.replace("T", " "),
      timezone: eventsGetQuery.data.timezone,
      type: eventsGetQuery.data.type,
    }),
    [eventsGetQuery.data],
  );

  return (
    <Stack h="100%" w="100%">
      <Title ta="center">
        {localization.localize(msg({ message: "Edit event" }))}
      </Title>
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
      <Button
        color="gray"
        component={Link}
        disabled={saving || deleting}
        href="/events"
        style={{ flexShrink: 0 }}
        variant="light"
      >
        {localization.localize(msg({ message: "Back" }))}
      </Button>
    </Stack>
  );
}
