import { mapValues } from "es-toolkit/object";
import { isJSONValue } from "es-toolkit/predicate";

import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const create = orpcServerRootBase.core.shows.create
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { data, ...query } = input;

    const { data: showsCreateData, response: showsCreateResponse } =
      await state.current.apis.beaver.showsCreate({
        body: data,
        query: mapValues(query, (value) =>
          isJSONValue(value) ? JSON.stringify(value) : value,
        ),
      });

    if (showsCreateData === undefined) {
      if (showsCreateResponse.status === 409) throw errors.CONFLICT();
      throw errors.INTERNAL_SERVER_ERROR();
    }

    return showsCreateData;
  });
