import * as z from "zod";

import {
  EventsIdSplitSplitRequestSchema,
  EventsIdSplitSplitResponseSchema,
} from "../../../../../../../../../apis/beaver/schemas";

export const Schemas = {
  Input: z.object({
    ...EventsIdSplitSplitRequestSchema.shape.path.shape,
    ...EventsIdSplitSplitRequestSchema.shape.query.unwrap().shape,
    data: EventsIdSplitSplitRequestSchema.shape.body,
  }),
  Output: EventsIdSplitSplitResponseSchema,
};
