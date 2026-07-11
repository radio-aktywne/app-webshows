import { mapValues } from "es-toolkit/object";
import { isJSONValue } from "es-toolkit/predicate";

import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const create = orpcServerRootBase.core.instances.create
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { data, ...query } = input;

    const { data: instancesCreateData, response: instancesCreateResponse } =
      await state.current.apis.beaver.instancesCreate({
        body: data,
        query: mapValues(query, (value) =>
          isJSONValue(value) ? JSON.stringify(value) : value,
        ),
      });

    if (instancesCreateData === undefined) {
      if (instancesCreateResponse.status === 409) throw errors.CONFLICT();
      throw errors.INTERNAL_SERVER_ERROR();
    }

    return instancesCreateData;
  });
