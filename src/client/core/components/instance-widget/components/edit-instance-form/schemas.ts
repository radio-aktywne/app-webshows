import * as z from "zod";

export const Schemas = {
  Input: z.object({
    start: z.codec(z.string(), z.iso.datetime({ local: true }), {
      decode: (value) => value.replace(" ", "T"),
      encode: (value) => value.replace("T", " "),
    }),
  }),
  Output: z.object({
    start: z.string().pipe(
      z
        .string()
        .transform((value) => value.replace(" ", "T"))
        .pipe(z.iso.datetime({ local: true })),
    ),
  }),
};
