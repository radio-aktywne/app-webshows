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
} from "../../../../../../isomorphic/core/hooks/use-form";
import type { Schemas } from "./schemas";

export type CreateEventFormInputSchema = typeof Schemas.Input;

export type CreateEventFormOutputSchema = typeof Schemas.Output;

export type CreateEventFormInitialValues = UseFormInitialValues<
  z.output<CreateEventFormInputSchema>
>;

export type CreateEventFormErrorInput = UseFormErrorInput<
  z.output<CreateEventFormInputSchema>
>;

export type CreateEventFormOnError = UseFormOnError<
  z.output<CreateEventFormInputSchema>
>;

export type CreateEventFormSubmitInput = UseFormSubmitInput<
  z.output<CreateEventFormOutputSchema>
>;

export type CreateEventFormErrors = UseFormErrors<
  z.input<CreateEventFormInputSchema>
>;

export type CreateEventFormSubmitErrorOutput = UseFormSubmitErrorOutput<
  z.input<CreateEventFormInputSchema>
>;

export type CreateEventFormSubmitSuccessOutput = UseFormSubmitSuccessOutput<
  z.output<CreateEventFormInputSchema>
>;

export type CreateEventFormSubmitOutput = UseFormSubmitOutput<
  z.input<CreateEventFormInputSchema>,
  z.output<CreateEventFormInputSchema>
>;

export type CreateEventFormOnSubmit = UseFormOnSubmit<
  z.input<CreateEventFormInputSchema>,
  z.output<CreateEventFormInputSchema>,
  z.output<CreateEventFormOutputSchema>
>;

export type CreateEventFormInput = (HasRequiredKeys<
  z.output<CreateEventFormInputSchema>
> extends true
  ? { initialValues: CreateEventFormInitialValues }
  : { initialValues?: CreateEventFormInitialValues }) & {
  onError?: CreateEventFormOnError;
  onSubmit: CreateEventFormOnSubmit;
};
