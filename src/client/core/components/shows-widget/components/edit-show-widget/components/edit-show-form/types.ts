import type { HasRequiredKeys } from "type-fest";
import type * as z from "zod";

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
} from "../../../../../../../../isomorphic/core/hooks/use-form";
import type { Schemas } from "./schemas";

export type EditShowFormInputSchema = typeof Schemas.Input;

export type EditShowFormOutputSchema = typeof Schemas.Output;

export type EditShowFormInitialValues = UseFormInitialValues<
  z.output<EditShowFormInputSchema>
>;

export type EditShowFormErrorInput = UseFormErrorInput<
  z.output<EditShowFormInputSchema>
>;

export type EditShowFormOnError = UseFormOnError<
  z.output<EditShowFormInputSchema>
>;

export type EditShowFormSubmitInput = UseFormSubmitInput<
  z.output<EditShowFormOutputSchema>
>;

export type EditShowFormErrors = UseFormErrors<
  z.input<EditShowFormInputSchema>
>;

export type EditShowFormSubmitErrorOutput = UseFormSubmitErrorOutput<
  z.input<EditShowFormInputSchema>
>;

export type EditShowFormSubmitSuccessOutput = UseFormSubmitSuccessOutput<
  z.output<EditShowFormInputSchema>
>;

export type EditShowFormSubmitOutput = UseFormSubmitOutput<
  z.input<EditShowFormInputSchema>,
  z.output<EditShowFormInputSchema>
>;

export type EditShowFormOnSubmit = UseFormOnSubmit<
  z.input<EditShowFormInputSchema>,
  z.output<EditShowFormInputSchema>,
  z.output<EditShowFormOutputSchema>
>;

export type EditShowFormInput = (HasRequiredKeys<
  z.output<EditShowFormInputSchema>
> extends true
  ? { initialValues: EditShowFormInitialValues }
  : { initialValues?: EditShowFormInitialValues }) & {
  onError?: EditShowFormOnError;
  onSubmit: EditShowFormOnSubmit;
};
