import type { HasRequiredKeys, SetNonNullableDeep } from "type-fest";
import type * as z from "zod";

import type { Instance } from "../../../../../../common/apis/beaver/types";
import type {
  UseFormErrorInput,
  UseFormErrors,
  UseFormInitialValues,
  UseFormOnError,
  UseFormOnSubmit,
  UseFormSubmitErrorOutput,
  UseFormSubmitInput,
  UseFormSubmitOutput,
  UseFormSubmitSuccessOutput,
} from "../../../../../../isomorphic/core/hooks/use-form";
import type { Schemas } from "./schemas";

export type EditInstanceFormInputSchema = typeof Schemas.Input;

export type EditInstanceFormOutputSchema = typeof Schemas.Output;

export type EditInstanceFormInitialValues = UseFormInitialValues<
  z.output<EditInstanceFormInputSchema>
>;

export type EditInstanceFormDisabled = boolean;

export type EditInstanceFormInstance = SetNonNullableDeep<Instance, "event">;

export type EditInstanceFormErrorInput = UseFormErrorInput<
  z.output<EditInstanceFormInputSchema>
>;

export type EditInstanceFormOnError = UseFormOnError<
  z.output<EditInstanceFormInputSchema>
>;

export type EditInstanceFormSubmitInput = UseFormSubmitInput<
  z.output<EditInstanceFormOutputSchema>
>;

export type EditInstanceFormErrors = UseFormErrors<
  z.input<EditInstanceFormInputSchema>
>;

export type EditInstanceFormSubmitErrorOutput = UseFormSubmitErrorOutput<
  z.input<EditInstanceFormInputSchema>
>;

export type EditInstanceFormSubmitSuccessOutput = UseFormSubmitSuccessOutput<
  z.output<EditInstanceFormInputSchema>
>;

export type EditInstanceFormSubmitOutput = UseFormSubmitOutput<
  z.input<EditInstanceFormInputSchema>,
  z.output<EditInstanceFormInputSchema>
>;

export type EditInstanceFormOnSubmit = UseFormOnSubmit<
  z.input<EditInstanceFormInputSchema>,
  z.output<EditInstanceFormInputSchema>,
  z.output<EditInstanceFormOutputSchema>
>;

export type EditInstanceFormInput = (HasRequiredKeys<
  z.output<EditInstanceFormInputSchema>
> extends true
  ? { initialValues: EditInstanceFormInitialValues }
  : { initialValues?: EditInstanceFormInitialValues }) & {
  disabled?: EditInstanceFormDisabled;
  instance: EditInstanceFormInstance;
  onError?: EditInstanceFormOnError;
  onSubmit: EditInstanceFormOnSubmit;
};
