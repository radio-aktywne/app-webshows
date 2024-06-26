"use client";

import { Button, Stack } from "@mantine/core";
import { useCallback } from "react";
import { useShowForm } from "../../../../hooks";
import { TextField } from "../../../fields/TextField";
import { TextareaField } from "../../../fields/TextareaField";
import { ShowFormData, ShowFormProps } from "./ShowForm.types";

export function ShowForm({ labels, validate, onCreate }: ShowFormProps) {
  const { form } = useShowForm({ validate });

  const formSetErrors = form.setErrors;

  const handleCreate = useCallback(
    async (data: ShowFormData) => {
      const errors = await onCreate?.(data);
      if (errors != null) formSetErrors(errors);
    },
    [onCreate, formSetErrors],
  );

  return (
    <form onSubmit={form.onSubmit(handleCreate)}>
      <Stack>
        <TextField
          title={labels.fields.title.title}
          required={true}
          {...form.getInputProps("title")}
        />
        <TextareaField
          title={labels.fields.description.title}
          {...form.getInputProps("description")}
        />
        <Button type="submit">{labels.buttons.create.label}</Button>
      </Stack>
    </form>
  );
}
