import type { CalendarItemInput } from "@radio-aktywne/ui";
import type { SetNonNullableDeep } from "type-fest";

import type { Instance } from "../../../../../../common/apis/beaver/types";

export type InstanceItemInput = Omit<CalendarItemInput, "end" | "start"> & {
  instance: SetNonNullableDeep<Instance, "event">;
};
