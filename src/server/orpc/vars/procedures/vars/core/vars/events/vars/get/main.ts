import { mapValues } from "es-toolkit/object";
import { isJSONValue } from "es-toolkit/predicate";

import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const get = orpcServerRootBase.core.events.get
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { id, ...query } = input;

    const { data: eventsIdGetData, response: eventsIdGetResponse } =
      await state.current.apis.beaver.eventsIdGet({
        path: { id: id },
        query: mapValues(query, (value) =>
          isJSONValue(value) ? JSON.stringify(value) : value,
        ),
      });

    if (eventsIdGetData === undefined) {
      if (eventsIdGetResponse.status === 404) throw errors.NOT_FOUND();
      throw errors.INTERNAL_SERVER_ERROR();
    }

    return eventsIdGetData;
  });
