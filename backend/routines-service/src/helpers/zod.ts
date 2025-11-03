import z from "zod";

export const strictBoolean = z
  .union([
    z.literal("true"),
    z.literal("false"),
    z.literal("1"),
    z.literal("0"),
    z.literal(1),
    z.literal(0),
    z.literal(true),
    z.literal(false),
  ])
  .transform((val) => {
    if (val === true || val === "true" || val === 1 || val === "1") return true;
    if (val === false || val === "false" || val === 0 || val === "0")
      return false;
  });
