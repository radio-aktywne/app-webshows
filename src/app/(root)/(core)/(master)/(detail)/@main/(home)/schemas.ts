import * as z from "zod";

export const Schemas = {
  Path: undefined as never,
  Query: z.object({
    date: z.iso.date().optional(),
  }),
};
