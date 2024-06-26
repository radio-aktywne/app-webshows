"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { CreateEventProps, createEvent } from "../../../actions";
import { labels } from "../../../config/labels";
import { useToasts } from "../../../hooks";
import { EventForm, EventFormData } from "./EventForm";
import { NewEventWidgetProps } from "./NewEventWidget.types";

export function NewEventWidget({}: NewEventWidgetProps) {
  const router = useRouter();

  const { success, error } = useToasts();

  const handleNormalizedCreate = useCallback(
    async (data: CreateEventProps) => {
      const { data: event, error: message } = await createEvent(data);

      if (message !== undefined) {
        error(labels.widgets.newEvent.toasts.create.error);
        return message;
      }

      success(labels.widgets.newEvent.toasts.create.success(event.id));
      router.push(`/events/${event.id}`);
    },
    [error, success, router],
  );

  const handleCreate = useCallback(
    async (data: EventFormData) => {
      if (data.type === undefined || data.type === "")
        return {
          type: labels.widgets.newEvent.form.fields.type.errors.missing,
        };

      if (
        data.type !== "live" &&
        data.type !== "replay" &&
        data.type !== "prerecorded"
      )
        return {
          type: labels.widgets.newEvent.form.fields.type.errors.invalid,
        };

      if (data.show === undefined || data.show === "")
        return {
          show: labels.widgets.newEvent.form.fields.show.errors.missing,
        };

      if (data.start === undefined)
        return {
          start: labels.widgets.newEvent.form.fields.start.errors.missing,
        };

      if (data.end === undefined)
        return { end: labels.widgets.newEvent.form.fields.end.errors.missing };

      if (data.timezone === undefined || data.timezone === "")
        return {
          timezone: labels.widgets.newEvent.form.fields.timezone.errors.missing,
        };

      if (data.recurring !== "no" && data.recurring !== "yes")
        return {
          recurring:
            labels.widgets.newEvent.form.fields.recurrence.recurring.errors
              .invalid,
        };

      if (data.recurring === "yes") {
        if (data.interval === undefined)
          return {
            interval:
              labels.widgets.newEvent.form.fields.recurrence.repeat.interval
                .errors.missing,
          };

        if (data.frequency === undefined || data.frequency === "")
          return {
            frequency:
              labels.widgets.newEvent.form.fields.recurrence.repeat.frequency
                .errors.missing,
          };

        if (
          data.frequency !== "daily" &&
          data.frequency !== "weekly" &&
          data.frequency !== "monthly" &&
          data.frequency !== "yearly"
        )
          return {
            frequency:
              labels.widgets.newEvent.form.fields.recurrence.repeat.frequency
                .errors.invalid,
          };

        if (data.ends === undefined || data.ends === "")
          return {
            ends: labels.widgets.newEvent.form.fields.recurrence.ends.ends
              .errors.missing,
          };

        if (
          data.ends !== "never" &&
          data.ends !== "after" &&
          data.ends !== "on"
        )
          return {
            ends: labels.widgets.newEvent.form.fields.recurrence.ends.ends
              .errors.invalid,
          };

        if (data.ends === "after") {
          if (data.count === undefined)
            return {
              count:
                labels.widgets.newEvent.form.fields.recurrence.ends.count.count
                  .errors.missing,
            };
        }

        if (data.ends === "on") {
          if (data.until === undefined)
            return {
              until:
                labels.widgets.newEvent.form.fields.recurrence.ends.until.errors
                  .missing,
            };
        }
      }

      const message = await handleNormalizedCreate({
        type: data.type,
        show: data.show,
        start: data.start,
        end: data.end,
        timezone: data.timezone,
        recurrence: {
          rule:
            data.recurring === "no"
              ? null
              : {
                  frequency: data.frequency as
                    | "daily"
                    | "weekly"
                    | "monthly"
                    | "yearly",
                  interval: data.interval,
                  count: data.ends === "after" ? data.count : null,
                  until: data.ends === "on" ? data.until : null,
                },
        },
      });

      return message
        ? {
            type: message,
            show: message,
            start: message,
            end: message,
            timezone: message,
            recurring: message,
            interval: message,
            frequency: message,
            ends: message,
            count: message,
            until: message,
          }
        : null;
    },
    [handleNormalizedCreate],
  );

  return (
    <EventForm labels={labels.widgets.newEvent.form} onCreate={handleCreate} />
  );
}
