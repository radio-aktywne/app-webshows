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

export type CreateShowFormInputSchema = typeof Schemas.Input;

export type CreateShowFormOutputSchema = typeof Schemas.Output;

export type CreateShowFormInitialValues = UseFormInitialValues<
  z.output<CreateShowFormInputSchema>
>;

export type CreateShowFormErrorInput = UseFormErrorInput<
  z.output<CreateShowFormInputSchema>
>;

export type CreateShowFormOnError = UseFormOnError<
  z.output<CreateShowFormInputSchema>
>;

export type CreateShowFormSubmitInput = UseFormSubmitInput<
  z.output<CreateShowFormOutputSchema>
>;

export type CreateShowFormErrors = UseFormErrors<
  z.input<CreateShowFormInputSchema>
>;

export type CreateShowFormSubmitErrorOutput = UseFormSubmitErrorOutput<
  z.input<CreateShowFormInputSchema>
>;

export type CreateShowFormSubmitSuccessOutput = UseFormSubmitSuccessOutput<
  z.output<CreateShowFormInputSchema>
>;

export type CreateShowFormSubmitOutput = UseFormSubmitOutput<
  z.input<CreateShowFormInputSchema>,
  z.output<CreateShowFormInputSchema>
>;

export type CreateShowFormOnSubmit = UseFormOnSubmit<
  z.input<CreateShowFormInputSchema>,
  z.output<CreateShowFormInputSchema>,
  z.output<CreateShowFormOutputSchema>
>;

export type CreateShowFormInput = (HasRequiredKeys<
  z.output<CreateShowFormInputSchema>
> extends true
  ? { initialValues: CreateShowFormInitialValues }
  : { initialValues?: CreateShowFormInitialValues }) & {
  onError?: CreateShowFormOnError;
  onSubmit: CreateShowFormOnSubmit;
};
