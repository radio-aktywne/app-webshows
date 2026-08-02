import { msg } from "@lingui/core/macro";
import { Button, TextInput } from "@mantine/core";
import { isString } from "es-toolkit/predicate";

import type { EditShowFormInput } from "./types";

import { useForm } from "../../../../../../../../isomorphic/core/hooks/use-form";
import { useLocalization } from "../../../../../../../../isomorphic/localization/hooks/use-localization";
import { Schemas } from "./schemas";

export function EditShowForm({
  initialValues,
  onError,
  onSubmit,
}: EditShowFormInput) {
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
      <TextInput
        errorProps={{
          title: [form.getInputProps("title").error].find(isString),
        }}
        key={form.key("title")}
        label={localization.localize(msg({ message: "Title" }))}
        placeholder={localization.localize(
          msg({ message: "Enter show title" }),
        )}
        required={true}
        {...form.getInputProps("title")}
      />
      <TextInput
        errorProps={{
          title: [form.getInputProps("description").error].find(isString),
        }}
        key={form.key("description")}
        label={localization.localize(msg({ message: "Description" }))}
        placeholder={localization.localize(
          msg({ message: "Enter show description" }),
        )}
        required={false}
        {...form.getInputProps("description")}
      />
      <Button
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
