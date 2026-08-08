import { msg } from "@lingui/core/macro";
import { Button, Select } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { isString } from "es-toolkit/predicate";
import { useState } from "react";

import type { EditInstanceFormInput } from "./types";

import { dayjs } from "../../../../../../common/dates/vars/dayjs";
import { useForm } from "../../../../../../isomorphic/core/hooks/use-form";
import { useLocalization } from "../../../../../../isomorphic/localization/hooks/use-localization";
import { Schemas } from "./schemas";

export function EditInstanceForm({
  disabled,
  initialValues,
  instance,
  onError,
  onSubmit,
}: EditInstanceFormInput) {
  const [values, setValues] = useState(initialValues);

  const { localization } = useLocalization();

  const { form, handleFormSubmit, submitting } = useForm({
    initialValues: initialValues,
    inputSchema: Schemas.Input,
    onError: onError,
    onSubmit: onSubmit,
    onValuesChange: ({ current }) => setValues(current),
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
        disabled={true}
        label={localization.localize(msg({ message: "Type" }))}
        placeholder={localization.localize(msg({ message: "Select type" }))}
        required={true}
        value={instance.event.type}
      />
      <Select
        data={
          instance.event.show
            ? [
                {
                  label: instance.event.show.title,
                  value: instance.event.show.id,
                },
              ]
            : []
        }
        disabled={true}
        label={localization.localize(msg({ message: "Show" }))}
        placeholder={localization.localize(msg({ message: "Select show" }))}
        required={false}
        value={instance.event.show ? instance.event.show.id : undefined}
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
        disabled={true}
        dropdownType="modal"
        label={localization.localize(msg({ message: "End" }))}
        placeholder={localization.localize(
          msg({ message: "Select end date and time" }),
        )}
        required={true}
        value={dayjs
          .tz(values.start, instance.event.timezone)
          .add(dayjs.duration(instance.event.duration))
          .format("YYYY-MM-DD HH:mm:ss")}
        valueFormat="LLL"
      />
      <Button
        disabled={disabled}
        loading={submitting}
        mt="auto"
        style={{ flexShrink: 0 }}
        type="submit"
      >
        {localization.localize(msg({ message: "Save" }))}
      </Button>
    </form>
  );
}
