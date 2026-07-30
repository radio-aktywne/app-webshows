import type { DefaultViewInput } from "../../../../../types";
import type { Schemas } from "./schemas";

import { CalendarWidget } from "../../../../../../client/core/components/calendar-widget";
import { LoadingWidget } from "../../../../../../common/core/components/generic/loading-widget";
import { Hydrated } from "../../../../../../isomorphic/generic/components/hydrated";

export async function MainDefaultView({}: DefaultViewInput<
  typeof Schemas.Path
>) {
  return (
    <Hydrated fallback={<LoadingWidget />}>
      <CalendarWidget />
    </Hydrated>
  );
}
