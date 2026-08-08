import { msg } from "@lingui/core/macro";
import { Button, Select } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { isString } from "es-toolkit/predicate";
import { useMemo } from "react";

import type { SplitEventFormInput } from "./types";

import { useForm } from "../../../../../../isomorphic/core/hooks/use-form";
import { useLocalization } from "../../../../../../isomorphic/localization/hooks/use-localization";
import { Schemas } from "./schemas";

export function SplitEventForm({
  disabled,
  event,
  initialValues,
  onError,
  onSubmit,
}: SplitEventFormInput) {
  const timezones = useMemo(() => Intl.supportedValuesOf("timeZone"), []);

  const { localization } = useLocalization();

  const { form, handleFormSubmit, submitting } = useForm({
    initialValues: initialValues,
    inputSchema: Schemas.Input,
    onError: onError,
    onSubmit: onSubmit,
    outputSchema: Schemas.Output,
  });

  return (
    <form onSubmit={handleFormSubmit} style={{ display: "contents" }}>
      <Select
        data={[
          {
            label: localization.localize(msg({ message: "Live" })),
            value: "live",
          },
          {
            label: localization.localize(msg({ message: "Prerecorded" })),
            value: "prerecorded",
          },
          {
            label: localization.localize(msg({ message: "Replay" })),
            value: "replay",
          },
        ]}
        errorProps={{
          title: [form.getInputProps("type").error].find(isString),
        }}
        key={form.key("type")}
        label={localization.localize(msg({ message: "Type" }))}
        placeholder={localization.localize(msg({ message: "Select type" }))}
        required={true}
        {...form.getInputProps("type")}
      />
      <Select
        data={
          event.show
            ? [
                {
                  label: event.show.title,
                  value: event.show.id,
                },
              ]
            : []
        }
        disabled={true}
        label={localization.localize(msg({ message: "Show" }))}
        placeholder={localization.localize(msg({ message: "Select show" }))}
        required={false}
        value={event.show ? event.show.id : undefined}
      />
      <Select
        data={timezones.map((timezone) => ({
          label: timezone,
          value: timezone,
        }))}
        errorProps={{
          title: [form.getInputProps("timezone").error].find(isString),
        }}
        key={form.key("timezone")}
        label={localization.localize(msg({ message: "Timezone" }))}
        placeholder={localization.localize(msg({ message: "Select timezone" }))}
        required={true}
        {...form.getInputProps("timezone")}
      />
      <DateTimePicker
        dropdownType="modal"
        errorProps={{
          title: [form.getInputProps("start").error].find(isString),
        }}
        key={form.key("start")}
        label={localization.localize(msg({ message: "Start" }))}
        placeholder={localization.localize(
          msg({ message: "Select start date and time" }),
        )}
        required={true}
        valueFormat="LLL"
        {...form.getInputProps("start")}
      />
      <DateTimePicker
        dropdownType="modal"
        errorProps={{
          title: [form.getInputProps("end").error].find(isString),
        }}
        key={form.key("end")}
        label={localization.localize(msg({ message: "End" }))}
        placeholder={localization.localize(
          msg({ message: "Select end date and time" }),
        )}
        required={true}
        valueFormat="LLL"
        {...form.getInputProps("end")}
      />
      <Button
        disabled={disabled}
        loading={submitting}
        mt="auto"
        style={{ flexShrink: 0 }}
        type="submit"
      >
        {localization.localize(msg({ message: "Apply" }))}
      </Button>
    </form>
  );
}
