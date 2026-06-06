import { mapValues } from "es-toolkit/object";
import { isJSONValue } from "es-toolkit/predicate";

import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const get = orpcServerRootBase.core.shows.get
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { id, ...query } = input;

    const { data: showsIdGetData, response: showsIdGetResponse } =
      await state.current.apis.beaver.showsIdGet({
        path: { id: id },
        query: mapValues(query, (value) =>
          isJSONValue(value) ? JSON.stringify(value) : value,
        ),
      });

    if (showsIdGetData === undefined) {
      if (showsIdGetResponse.status === 404) throw errors.NOT_FOUND();
      throw errors.INTERNAL_SERVER_ERROR();
    }

    return showsIdGetData;
  });
