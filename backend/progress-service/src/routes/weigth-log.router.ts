import { Hono } from "hono";
import { getAllWeightLogsController } from "../controllers/weight-log/get-all.controller";
import { zValidator } from "@hono/zod-validator";
import {
  createWeightLogSchema,
  updateWeightLogSchema,
  weightLogFiltersSchema,
  weightLogQuerySchema,
} from "../models/WeightLog";
import { createWeightLogController } from "../controllers/weight-log/create.controller";
import { updateWeightLogController } from "../controllers/weight-log/update.controller";
import z from "zod";
import { deleteWeightLogController } from "../controllers/weight-log/delete.controller";
import { getWeightLogController } from "../controllers/weight-log/get-one.controller";

const router = new Hono();

router.get(
  "/",
  zValidator("query", weightLogQuerySchema),
  getAllWeightLogsController
);
router.get(
  "/find-by-date",
  zValidator(
    "query",
    weightLogFiltersSchema.pick({ user_id: true, date: true })
  ),
  getWeightLogController
);
router.get(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  getWeightLogController
);
router.post(
  "/",
  zValidator("json", createWeightLogSchema),
  createWeightLogController
);
router.patch(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  zValidator("json", updateWeightLogSchema),
  updateWeightLogController
);
router.delete(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  deleteWeightLogController
);

export default router;
