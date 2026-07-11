import { mapValues } from "es-toolkit/object";
import { isJSONValue } from "es-toolkit/predicate";

import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const update = orpcServerRootBase.core.events.update
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { data, id, ...query } = input;

    const { data: eventsIdUpdateData, response: eventsIdUpdateResponse } =
      await state.current.apis.beaver.eventsIdUpdate({
        body: data,
        path: { id: id },
        query: mapValues(query, (value) =>
          isJSONValue(value) ? JSON.stringify(value) : value,
        ),
      });

    if (eventsIdUpdateData === undefined) {
      if (eventsIdUpdateResponse.status === 404) throw errors.NOT_FOUND();
      if (eventsIdUpdateResponse.status === 409) throw errors.CONFLICT();
      throw errors.INTERNAL_SERVER_ERROR();
    }

    return eventsIdUpdateData;
  });
