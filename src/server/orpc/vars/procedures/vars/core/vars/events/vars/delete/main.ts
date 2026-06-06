import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const delete_ = orpcServerRootBase.core.events.delete
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { id } = input;

    const { data: eventsIdDeleteData, response: eventsIdDeleteResponse } =
      await state.current.apis.beaver.eventsIdDelete({ path: { id: id } });

    if (eventsIdDeleteData === undefined) {
      if (eventsIdDeleteResponse.status === 404) throw errors.NOT_FOUND();
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
