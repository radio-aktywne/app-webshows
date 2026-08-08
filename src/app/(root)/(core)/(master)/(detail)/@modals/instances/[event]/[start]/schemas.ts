import * as z from "zod";

export const Schemas = {
  Path: z.object({
    event: z.uuidv4(),
    start: z
      .string()
      .transform((val) => decodeURIComponent(val))
      .pipe(z.iso.datetime({ local: true })),
  }),
  Query: undefined as never,
};
