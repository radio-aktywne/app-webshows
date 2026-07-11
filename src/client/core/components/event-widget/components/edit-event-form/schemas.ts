import * as z from "zod";

export const Schemas = {
  Values: z.object({
    end: z
      .string()
      .pipe(z.transform((value) => value.replace(" ", "T")))
      .pipe(z.iso.datetime({ local: true })),
    recurrence: z.discriminatedUnion("recurring", [
      z.object({
        recurring: z.literal("no"),
      }),
      z.object({
        frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
        interval: z.number().int().positive(),
        recurring: z.literal("yes"),
        termination: z.discriminatedUnion("ends", [
          z.object({
            ends: z.literal("never"),
          }),
          z.object({
            date: z
              .string()
              .pipe(z.transform((value) => value.replace(" ", "T")))
              .pipe(z.iso.datetime({ local: true }))
              .nullish(),
            ends: z.literal("on"),
          }),
          z.object({
            ends: z.literal("after"),
            times: z.number().int().positive(),
          }),
        ]),
      }),
    ]),
    show: z.uuidv4().nullable(),
    start: z
      .string()
      .pipe(z.transform((value) => value.replace(" ", "T")))
      .pipe(z.iso.datetime({ local: true })),
    timezone: z.string().min(1),
    type: z.enum(["live", "prerecorded", "replay"]),
  }),
};
