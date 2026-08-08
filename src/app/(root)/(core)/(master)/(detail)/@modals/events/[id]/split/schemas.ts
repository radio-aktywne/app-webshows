import * as z from "zod";

export const Schemas = {
  Path: z.object({
    id: z.uuidv4(),
  }),
  Query: z.object({
    at: z
      .string()
      .transform((val) => decodeURIComponent(val))
      .pipe(z.iso.datetime({ local: true })),
  }),
};
