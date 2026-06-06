import { mapValues } from "es-toolkit/object";
import { isJSONValue } from "es-toolkit/predicate";

import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const list = orpcServerRootBase.core.schedule.list
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { data: scheduleListData } =
      await state.current.apis.beaver.scheduleList({
        query: mapValues(input ?? {}, (value) =>
          isJSONValue(value) ? JSON.stringify(value) : value,
        ),
      });

    if (scheduleListData === undefined) throw errors.INTERNAL_SERVER_ERROR();

    return scheduleListData;
  });
