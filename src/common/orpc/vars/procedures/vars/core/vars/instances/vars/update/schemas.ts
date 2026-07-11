import * as z from "zod";

import {
  InstancesEventidStartUpdateRequestSchema,
  InstancesEventidStartUpdateResponseSchema,
} from "../../../../../../../../../apis/beaver/schemas";

export const Schemas = {
  Input: z.object({
    ...InstancesEventidStartUpdateRequestSchema.shape.path.shape,
    ...InstancesEventidStartUpdateRequestSchema.shape.query.unwrap().shape,
    data: InstancesEventidStartUpdateRequestSchema.shape.body,
  }),
  Output: InstancesEventidStartUpdateResponseSchema,
};
