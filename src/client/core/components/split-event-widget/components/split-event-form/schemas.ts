import * as z from "zod";

export const Schemas = {
  Input: z.object({
    end: z.codec(z.string(), z.iso.datetime({ local: true }), {
      decode: (value) => value.replace(" ", "T"),
      encode: (value) => value.replace("T", " "),
    }),
    start: z.codec(z.string(), z.iso.datetime({ local: true }), {
      decode: (value) => value.replace(" ", "T"),
      encode: (value) => value.replace("T", " "),
    }),
    timezone: z.string().pipe(z.string().min(1)),
    type: z.string().pipe(z.enum(["live", "prerecorded", "replay"])),
  }),
  Output: z.object({
    end: z.string().pipe(
      z
        .string()
        .transform((value) => value.replace(" ", "T"))
        .pipe(z.iso.datetime({ local: true })),
    ),
    start: z.string().pipe(
      z
        .string()
        .transform((value) => value.replace(" ", "T"))
        .pipe(z.iso.datetime({ local: true })),
    ),
    timezone: z.string().pipe(z.string().min(1)),
    type: z.string().pipe(z.enum(["live", "prerecorded", "replay"])),
  }),
};
