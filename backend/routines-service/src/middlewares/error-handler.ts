import { ZodError } from "zod";

export function ErrorHandler(err: any) {
  if (err instanceof(ZodError)) {
    // do something
  }
  console.log(err)
}
