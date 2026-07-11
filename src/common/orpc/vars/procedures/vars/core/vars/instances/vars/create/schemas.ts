import * as z from "zod";

import {
  InstancesCreateRequestSchema,
  InstancesCreateResponseSchema,
} from "../../../../../../../../../apis/beaver/schemas";

export const Schemas = {
  Input: z.object({
    ...InstancesCreateRequestSchema.shape.query.unwrap().shape,
    data: InstancesCreateRequestSchema.shape.body,
  }),
  Output: InstancesCreateResponseSchema,
};
