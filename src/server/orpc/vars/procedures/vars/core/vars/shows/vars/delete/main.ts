import { state } from "../../../../../../../../../state/vars/state";
import { orpcServerRootBase } from "../../../../../../../bases/root";
import { authenticatedMiddleware } from "../../../../../../../middleware/authenticated";

export const delete_ = orpcServerRootBase.core.shows.delete
  .use(authenticatedMiddleware)
  .handler(async ({ errors, input }) => {
    const { id } = input;

    const { data: showsIdDeleteData, response: showsIdDeleteResponse } =
      await state.current.apis.beaver.showsIdDelete({ path: { id: id } });

    if (showsIdDeleteData === undefined) {
      if (showsIdDeleteResponse.status === 404) throw errors.NOT_FOUND();
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
