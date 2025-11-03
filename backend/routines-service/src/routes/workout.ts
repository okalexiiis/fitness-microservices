import { Env, Hono } from "hono";
import {
  createWorkoutController,
  deleteWorkoutController,
  getAllWorkoutsController,
  getOneWOrkoutByIDController,
  updateWorkoutController,
} from "../controllers/workout";
import { zValidator } from "@hono/zod-validator";
import {
  createWorkoutSchema,
  updateWorkoutSchema,
  workoutQuerySchema,
} from "../models/Workout";
import z from "zod";

const router = new Hono<Env>();

router.get(
  "/",
  zValidator("query", workoutQuerySchema),
  getAllWorkoutsController
);
router.post(
  "/",
  zValidator("json", createWorkoutSchema),
  createWorkoutController
);
router.patch(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  zValidator("json", updateWorkoutSchema),
  updateWorkoutController
);
router.delete(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  deleteWorkoutController
);
router.get(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  getOneWOrkoutByIDController
);

export default router;
