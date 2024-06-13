import { GetEventProps } from "../../actions";
import { components } from "../../api/emishows";

export type Event = components["schemas"]["emishows_events_models_Event"];

export type UseEventProps = GetEventProps & {
  interval?: number;
};
