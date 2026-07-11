import {
  InstancesListRequestSchema,
  InstancesListResponseSchema,
} from "../../../../../../../../../apis/beaver/schemas";

export const Schemas = {
  Input: InstancesListRequestSchema.shape.query,
  Output: InstancesListResponseSchema,
};
