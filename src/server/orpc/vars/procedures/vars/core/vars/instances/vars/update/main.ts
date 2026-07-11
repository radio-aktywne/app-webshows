import { mapValues } from "es-toolkit/object";
import { isJSONValue } from "es-toolkit/predicate";

import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const update = orpcServerRootBase.core.instances.update
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { data, eventId, start, ...query } = input;

    const {
      data: instancesEventidStartUpdateData,
      response: instancesEventidStartUpdateResponse,
    } = await state.current.apis.beaver.instancesEventidStartUpdate({
      body: data,
      path: { eventId: eventId, start: start },
      query: mapValues(query, (value) =>
        isJSONValue(value) ? JSON.stringify(value) : value,
      ),
    });

    if (instancesEventidStartUpdateData === undefined) {
      if (instancesEventidStartUpdateResponse.status === 404)
        throw errors.NOT_FOUND();
      if (instancesEventidStartUpdateResponse.status === 409)
        throw errors.CONFLICT();
      throw errors.INTERNAL_SERVER_ERROR();
    }

    return instancesEventidStartUpdateData;
  });
