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

export type SplitEventFormInputSchema = typeof Schemas.Input;

export type SplitEventFormOutputSchema = typeof Schemas.Output;

export type SplitEventFormInitialValues = UseFormInitialValues<
  z.output<SplitEventFormInputSchema>
>;

export type SplitEventFormDisabled = boolean;

export type SplitEventFormEvent = EventsModelsEvent;

export type SplitEventFormErrorInput = UseFormErrorInput<
  z.output<SplitEventFormInputSchema>
>;

export type SplitEventFormOnError = UseFormOnError<
  z.output<SplitEventFormInputSchema>
>;

export type SplitEventFormSubmitInput = UseFormSubmitInput<
  z.output<SplitEventFormOutputSchema>
>;

export type SplitEventFormErrors = UseFormErrors<
  z.input<SplitEventFormInputSchema>
>;

export type SplitEventFormSubmitErrorOutput = UseFormSubmitErrorOutput<
  z.input<SplitEventFormInputSchema>
>;

export type SplitEventFormSubmitSuccessOutput = UseFormSubmitSuccessOutput<
  z.output<SplitEventFormInputSchema>
>;

export type SplitEventFormSubmitOutput = UseFormSubmitOutput<
  z.input<SplitEventFormInputSchema>,
  z.output<SplitEventFormInputSchema>
>;

export type SplitEventFormOnSubmit = UseFormOnSubmit<
  z.input<SplitEventFormInputSchema>,
  z.output<SplitEventFormInputSchema>,
  z.output<SplitEventFormOutputSchema>
>;

export type SplitEventFormInput = (HasRequiredKeys<
  z.output<SplitEventFormInputSchema>
> extends true
  ? { initialValues: SplitEventFormInitialValues }
  : { initialValues?: SplitEventFormInitialValues }) & {
  disabled?: SplitEventFormDisabled;
  event: SplitEventFormEvent;
  onError?: SplitEventFormOnError;
  onSubmit: SplitEventFormOnSubmit;
};
