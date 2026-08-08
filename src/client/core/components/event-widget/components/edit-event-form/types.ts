import type { HasRequiredKeys } from "type-fest";
import type * as z from "zod";

import type { EventsModelsEvent } from "../../../../../../common/apis/beaver/types";
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

export type EditEventFormInputSchema = typeof Schemas.Input;

export type EditEventFormOutputSchema = typeof Schemas.Output;

export type EditEventFormInitialValues = UseFormInitialValues<
  z.output<EditEventFormInputSchema>
>;

export type EditEventFormDisabled = boolean;

export type EditEventFormEvent = EventsModelsEvent;

export type EditEventFormErrorInput = UseFormErrorInput<
  z.output<EditEventFormInputSchema>
>;

export type EditEventFormOnError = UseFormOnError<
  z.output<EditEventFormInputSchema>
>;

export type EditEventFormSubmitInput = UseFormSubmitInput<
  z.output<EditEventFormOutputSchema>
>;

export type EditEventFormErrors = UseFormErrors<
  z.input<EditEventFormInputSchema>
>;

export type EditEventFormSubmitErrorOutput = UseFormSubmitErrorOutput<
  z.input<EditEventFormInputSchema>
>;

export type EditEventFormSubmitSuccessOutput = UseFormSubmitSuccessOutput<
  z.output<EditEventFormInputSchema>
>;

export type EditEventFormSubmitOutput = UseFormSubmitOutput<
  z.input<EditEventFormInputSchema>,
  z.output<EditEventFormInputSchema>
>;

export type EditEventFormOnSubmit = UseFormOnSubmit<
  z.input<EditEventFormInputSchema>,
  z.output<EditEventFormInputSchema>,
  z.output<EditEventFormOutputSchema>
>;

export type EditEventFormInput = (HasRequiredKeys<
  z.output<EditEventFormInputSchema>
> extends true
  ? { initialValues: EditEventFormInitialValues }
  : { initialValues?: EditEventFormInitialValues }) & {
  disabled?: EditEventFormDisabled;
  event: EditEventFormEvent;
  onError?: EditEventFormOnError;
  onSubmit: EditEventFormOnSubmit;
};
