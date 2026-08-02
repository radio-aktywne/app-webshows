import * as z from "zod";

export const Schemas = {
  Input: z.object({
    end: z.codec(
      z.string().nullable(),
      z.iso.datetime({ local: true }).optional(),
      {
        decode: (value) => value?.replace(" ", "T") ?? undefined,
        encode: (value) => value?.replace("T", " ") ?? null,
      },
    ),
    recurrence: z.discriminatedUnion("recurring", [
      z.object({
        recurring: z.literal("no"),
      }),
      z.object({
        frequency: z
          .string()
          .pipe(z.enum(["daily", "weekly", "monthly", "yearly"])),
        interval: z.number().pipe(z.number().int().positive()),
        recurring: z.literal("yes"),
        termination: z.discriminatedUnion("ends", [
          z.object({
            ends: z.literal("never"),
          }),
          z.object({
            date: z.codec(
              z.string().nullable(),
              z.iso.datetime({ local: true }).optional(),
              {
                decode: (value) => value?.replace(" ", "T") ?? undefined,
                encode: (value) => value?.replace("T", " ") ?? null,
              },
            ),
            ends: z.literal("on"),
          }),
          z.object({
            ends: z.literal("after"),
            times: z.number().pipe(z.number().int().positive()),
          }),
        ]),
      }),
    ]),
    show: z.string().nullable().pipe(z.uuidv4().nullable()),
    start: z.codec(
      z.string().nullable(),
      z.iso.datetime({ local: true }).optional(),
      {
        decode: (value) => value?.replace(" ", "T") ?? undefined,
        encode: (value) => value?.replace("T", " ") ?? null,
      },
    ),
    timezone: z.string().pipe(z.string().min(1)),
    type: z.string().pipe(z.enum(["live", "prerecorded", "replay"])),
  }),
  Output: z.object({
    end: z
      .string()
      .nullable()
      .pipe(
        z
          .string()
          .transform((value) => value.replace(" ", "T"))
          .pipe(z.iso.datetime({ local: true })),
      ),
    recurrence: z.discriminatedUnion("recurring", [
      z.object({
        recurring: z.literal("no"),
      }),
      z.object({
        frequency: z
          .string()
          .pipe(z.enum(["daily", "weekly", "monthly", "yearly"])),
        interval: z.number().pipe(z.number().int().positive()),
        recurring: z.literal("yes"),
        termination: z.discriminatedUnion("ends", [
          z.object({
            ends: z.literal("never"),
          }),
          z.object({
            date: z
              .string()
              .nullable()
              .pipe(
                z
                  .string()
                  .transform((value) => value.replace(" ", "T"))
                  .pipe(z.iso.datetime({ local: true })),
              ),
            ends: z.literal("on"),
          }),
          z.object({
            ends: z.literal("after"),
            times: z.number().pipe(z.number().int().positive()),
          }),
        ]),
      }),
    ]),
    show: z.string().nullable().pipe(z.uuidv4().nullable()),
    start: z
      .string()
      .nullable()
      .pipe(
        z
          .string()
          .transform((value) => value.replace(" ", "T"))
          .pipe(z.iso.datetime({ local: true })),
      ),
    timezone: z.string().pipe(z.string().min(1)),
    type: z.string().pipe(z.enum(["live", "prerecorded", "replay"])),
  }),
};
