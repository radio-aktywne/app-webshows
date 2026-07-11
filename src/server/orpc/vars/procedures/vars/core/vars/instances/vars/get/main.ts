import { mapValues } from "es-toolkit/object";
import { isJSONValue } from "es-toolkit/predicate";

import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const get = orpcServerRootBase.core.instances.get
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { eventId, start, ...query } = input;

    const {
      data: instancesEventidStartGetData,
      response: instancesEventidStartGetResponse,
    } = await state.current.apis.beaver.instancesEventidStartGet({
      path: { eventId: eventId, start: start },
      query: mapValues(query, (value) =>
        isJSONValue(value) ? JSON.stringify(value) : value,
      ),
    });

    if (instancesEventidStartGetData === undefined) {
      if (instancesEventidStartGetResponse.status === 404)
        throw errors.NOT_FOUND();
      throw errors.INTERNAL_SERVER_ERROR();
    }

    return instancesEventidStartGetData;
  });
