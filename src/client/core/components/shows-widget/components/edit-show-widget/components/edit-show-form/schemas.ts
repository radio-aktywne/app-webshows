import * as z from "zod";

export const Schemas = {
  Input: z.object({
    description: z.codec(z.string(), z.string().nullish(), {
      decode: (value) => value || null,
      encode: (value) => value ?? "",
    }),
    title: z.codec(z.string(), z.string().optional(), {
      decode: (value) => value || undefined,
      encode: (value) => value ?? "",
    }),
  }),
  Output: z.object({
    description: z
      .string()
      .pipe(z.string().transform((value) => value || null)),
    title: z.string().pipe(z.string().min(1)),
  }),
};
