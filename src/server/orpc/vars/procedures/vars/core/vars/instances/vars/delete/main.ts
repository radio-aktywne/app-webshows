import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const delete_ = orpcServerRootBase.core.instances.delete
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { eventId, start } = input;

    const {
      data: instancesEventidStartDeleteData,
      response: instancesEventidStartDeleteResponse,
    } = await state.current.apis.beaver.instancesEventidStartDelete({
      path: { eventId: eventId, start: start },
    });

    if (instancesEventidStartDeleteData === undefined) {
      if (instancesEventidStartDeleteResponse.status === 404)
        throw errors.NOT_FOUND();
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
