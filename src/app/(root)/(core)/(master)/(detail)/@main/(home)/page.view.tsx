import type { PageViewInput } from "../../../../../../types";
import type { Schemas } from "./schemas";

import { CalendarWidget } from "../../../../../../../client/core/components/calendar-widget";
import { LoadingWidget } from "../../../../../../../common/core/components/generic/loading-widget";
import { Hydrated } from "../../../../../../../isomorphic/generic/components/hydrated";

export async function MainHomePageView({
  queryParameters,
}: PageViewInput<typeof Schemas.Path, typeof Schemas.Query>) {
  return (
    <Hydrated fallback={<LoadingWidget />}>
      <CalendarWidget date={queryParameters.date} />
    </Hydrated>
  );
}
