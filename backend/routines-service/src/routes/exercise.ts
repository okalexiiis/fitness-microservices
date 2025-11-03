import { Hono } from "hono";
import {
  DeleteExerciseController,
  GetAllExercisesController,
  GetExcersiceByID,
  SaveExerciseController,
  UpdateExercise,
} from "../controllers/exercise";
import { zValidator } from "@hono/zod-validator";
import {
  createExerciseSchema,
  exerciseQuerySchema,
  updateExerciseSchema,
} from "../models/Exercise";
import z from "zod";

const router = new Hono();

router.get(
  "/",
  zValidator("query", exerciseQuerySchema),
  GetAllExercisesController
);
router.post(
  "/",
  zValidator("json", createExerciseSchema),
  SaveExerciseController
);
router.patch(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  zValidator("json", updateExerciseSchema),
  UpdateExercise
);
router.delete("/:id",zValidator("param", z.object({ id: z.coerce.number() })), DeleteExerciseController);
router.get("/:id",zValidator("param", z.object({ id: z.coerce.number() })), GetExcersiceByID);

export default router;
