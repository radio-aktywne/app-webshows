import { msg, plural } from "@lingui/core/macro";
import {
  Button,
  Group,
  InputWrapper,
  NumberInput,
  Select,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useSuspenseQuery } from "@tanstack/react-query";
import { isString } from "es-toolkit/predicate";
import { useState } from "react";

import type { EditEventFormInput } from "./types";

import { useForm } from "../../../../../../isomorphic/core/hooks/use-form";
import { useLocalization } from "../../../../../../isomorphic/localization/hooks/use-localization";
import { orpcClientSideQueryClient } from "../../../../../orpc/vars/clients";
import { Schemas } from "./schemas";

export function EditEventForm({
  disabled,
  initialValues,
  onError,
  onSubmit,
}: EditEventFormInput) {
  const [values, setValues] = useState(initialValues);

  const { localization } = useLocalization();

  const showsListQuery = useSuspenseQuery(
    orpcClientSideQueryClient.core.shows.list.queryOptions({
      input: { limit: null },
    }),
  );

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
        data={showsListQuery.data.shows.map((show) => ({
          label: show.title,
          value: show.id,
        }))}
        disabled={true}
        errorProps={{
          title: [form.getInputProps("show").error].find(isString),
        }}
        key={form.key("show")}
        label={localization.localize(msg({ message: "Show" }))}
        placeholder={localization.localize(msg({ message: "Select show" }))}
        required={false}
        {...form.getInputProps("show")}
      />
      <Select
        data={Intl.supportedValuesOf("timeZone").map((timezone) => ({
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
      <Select
        data={[
          {
            label: localization.localize(msg({ message: "Yes" })),
            value: "yes",
          },
          {
            label: localization.localize(msg({ message: "No" })),
            value: "no",
          },
        ]}
        errorProps={{
          title: [form.getInputProps("recurrence.recurring").error].find(
            isString,
          ),
        }}
        key={form.key("recurrence.recurring")}
        label={localization.localize(msg({ message: "Recurring" }))}
        placeholder={localization.localize(
          msg({ message: "Select if the event is recurring" }),
        )}
        required={true}
        {...form.getInputProps("recurrence.recurring")}
        onChange={(value) => {
          const values = form.getValues();

          if (value === values.recurrence.recurring) return;

          switch (value) {
            case "no":
              form.setFieldValue("recurrence", { recurring: "no" });
              return;
            case "yes":
              form.setFieldValue("recurrence", {
                frequency: "daily",
                interval: 1,
                recurring: "yes",
                termination: { ends: "never" },
              });
              return;
          }
        }}
      />
      {values.recurrence.recurring === "yes" && (
        <>
          <InputWrapper
            label={localization.localize(msg({ message: "Repeat every" }))}
            required={true}
          >
            <Group align="start">
              <NumberInput
                errorProps={{
                  title: [form.getInputProps("recurrence.interval").error].find(
                    isString,
                  ),
                }}
                inputSize="5"
                key={form.key("recurrence.interval")}
                min={1}
                required={true}
                style={{ flexGrow: 1 }}
                {...form.getInputProps("recurrence.interval")}
              />
              <Select
                data={[
                  {
                    label: localization.localize(
                      msg({
                        message: plural(values.recurrence.interval ?? 1, {
                          one: "day",
                          other: "days",
                        }),
                      }),
                    ),
                    value: "daily",
                  },
                  {
                    label: localization.localize(
                      msg({
                        message: plural(values.recurrence.interval ?? 1, {
                          one: "week",
                          other: "weeks",
                        }),
                      }),
                    ),
                    value: "weekly",
                  },
                  {
                    label: localization.localize(
                      msg({
                        message: plural(values.recurrence.interval ?? 1, {
                          one: "month",
                          other: "months",
                        }),
                      }),
                    ),
                    value: "monthly",
                  },
                  {
                    label: localization.localize(
                      msg({
                        message: plural(values.recurrence.interval ?? 1, {
                          one: "year",
                          other: "years",
                        }),
                      }),
                    ),
                    value: "yearly",
                  },
                ]}
                errorProps={{
                  title: [
                    form.getInputProps("recurrence.frequency").error,
                  ].find(isString),
                }}
                key={form.key("recurrence.frequency")}
                placeholder={localization.localize(
                  msg({ message: "Select frequency" }),
                )}
                required={true}
                style={{ flexGrow: 1 }}
                {...form.getInputProps("recurrence.frequency")}
              />
            </Group>
          </InputWrapper>
          <InputWrapper
            label={localization.localize(msg({ message: "Ends" }))}
            required={true}
          >
            <Group align="start">
              <Select
                data={[
                  {
                    label: localization.localize(msg({ message: "Never" })),
                    value: "never",
                  },
                  {
                    label: localization.localize(msg({ message: "On" })),
                    value: "on",
                  },
                  {
                    label: localization.localize(msg({ message: "After" })),
                    value: "after",
                  },
                ]}
                errorProps={{
                  title: [
                    form.getInputProps("recurrence.termination.ends").error,
                  ].find(isString),
                }}
                key={form.key("recurrence.termination.ends")}
                placeholder={localization.localize(
                  msg({ message: "Select ending condition" }),
                )}
                required={true}
                style={{ flexGrow: 1 }}
                {...form.getInputProps("recurrence.termination.ends")}
                onChange={(value) => {
                  const values = form.getValues();

                  if (
                    values.recurrence.recurring === "no" ||
                    value === values.recurrence.termination.ends
                  )
                    return;

                  switch (value) {
                    case "after":
                      form.setFieldValue("recurrence.termination", {
                        ends: "after",
                        times: 1,
                      });
                      return;
                    case "never":
                      form.setFieldValue("recurrence.termination", {
                        ends: "never",
                      });
                      return;
                    case "on":
                      form.setFieldValue("recurrence.termination", {
                        date: null,
                        ends: "on",
                      });
                      return;
                  }
                }}
              />
              {values.recurrence.termination?.ends === "on" && (
                <DateTimePicker
                  dropdownType="modal"
                  errorProps={{
                    title: [
                      form.getInputProps("recurrence.termination.date").error,
                    ].find(isString),
                  }}
                  key={form.key("recurrence.termination.date")}
                  placeholder={localization.localize(
                    msg({ message: "Select recurrence end date and time" }),
                  )}
                  required={true}
                  style={{ flexGrow: 1 }}
                  valueFormat="LLL"
                  {...form.getInputProps("recurrence.termination.date")}
                />
              )}
              {values.recurrence.termination?.ends === "after" && (
                <SimpleGrid cols={2} style={{ alignItems: "center" }}>
                  <NumberInput
                    errorProps={{
                      title: [
                        form.getInputProps("recurrence.termination.times")
                          .error,
                      ].find(isString),
                    }}
                    inputSize="5"
                    key={form.key("recurrence.termination.times")}
                    min={1}
                    required={true}
                    style={{ flexGrow: 1 }}
                    {...form.getInputProps("recurrence.termination.times")}
                  />
                  <Text>
                    {localization.localize(
                      msg({
                        message: plural(
                          values.recurrence.termination?.times ?? 1,
                          {
                            one: "time",
                            other: "times",
                          },
                        ),
                      }),
                    )}
                  </Text>
                </SimpleGrid>
              )}
            </Group>
          </InputWrapper>
        </>
      )}
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
