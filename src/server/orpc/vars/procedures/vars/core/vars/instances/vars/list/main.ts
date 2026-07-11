import { mapValues } from "es-toolkit/object";
import { isJSONValue } from "es-toolkit/predicate";

import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const list = orpcServerRootBase.core.instances.list
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { data: instancesListData } =
      await state.current.apis.beaver.instancesList({
        query: mapValues(input ?? {}, (value) =>
          isJSONValue(value) ? JSON.stringify(value) : value,
        ),
      });

    if (instancesListData === undefined) throw errors.INTERNAL_SERVER_ERROR();

    return instancesListData;
  });
