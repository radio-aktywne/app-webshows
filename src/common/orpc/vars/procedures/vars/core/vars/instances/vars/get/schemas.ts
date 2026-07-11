import * as z from "zod";

import {
  InstancesEventidStartGetRequestSchema,
  InstancesEventidStartGetResponseSchema,
} from "../../../../../../../../../apis/beaver/schemas";

export const Schemas = {
  Input: z.object({
    ...InstancesEventidStartGetRequestSchema.shape.path.shape,
    ...InstancesEventidStartGetRequestSchema.shape.query.unwrap().shape,
  }),
  Output: InstancesEventidStartGetResponseSchema,
};
