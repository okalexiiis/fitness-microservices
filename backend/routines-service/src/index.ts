import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import ExerciseRouter from "./routes/exercise";
import WorkoutRouter from "./routes/workout";
import { PostgresError } from "postgres";
import { ZodError } from "zod";
const app = new Hono();

// Middleware para logs bonitos
app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "routines",
    timestamp: new Date().toISOString(),
  });
});

app.route("/exercise", ExerciseRouter);
app.route("/workout", WorkoutRouter);

app.onError((err: any, c: Context) => {
  console.error("[Error Handler]", err);

  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        message: "Validation Error",
        errors: err._zod.def.map((e: any) => ({
          path: e.path.join("."),
          message: e.message,
          code: e.code,
        })),
      },
      400
    );
  }

  if (err instanceof Error) {
    return c.json(
      {
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      500
    );
  }

  // 🔹 4️⃣ Fallback general
  return c.json(
    {
      success: false,
      message: "Internal Server Error",
      error: String(err),
    },
    500
  );
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

const port = process.env.PORT || 4000;

console.log(`🚀 Routines Service running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
