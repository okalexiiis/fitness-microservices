// --- Rutas GET ---

import { zValidator } from "@hono/zod-validator";
import { deleteDailySummaryController } from "../controllers/daily-summary/delete.controller";
import { updateDailySummaryController } from "../controllers/daily-summary/update.controller";
import {
  createDailySummarySchema,
  dailySummaryFiltersSchema,
  dailySummaryQuerySchema,
  updateDailySummarySchema,
} from "../models/DailySummary";
import z from "zod";
import { createDailySummaryController } from "../controllers/daily-summary/create.controller";
import { getAllDailySummariesController } from "../controllers/daily-summary/get-all.controller";
import { getDailySummaryController } from "../controllers/daily-summary/get-one";
import { Hono } from "hono";

const dailySummaryRouter = new Hono();
// 1. OBTENER UNO por user_id y date (Ruta Literal - MÁS ESPECÍFICA)
// Se usa solo .pick para requerir user_id y date, validando los queries.
dailySummaryRouter.get(
  "/find-by-date",
  zValidator(
    "query",
    dailySummaryFiltersSchema.pick({ user_id: true, date: true })
  ),
  getDailySummaryController
);

// 2. OBTENER UNO por ID (Parámetro de Ruta - GENÉRICA)
dailySummaryRouter.get(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  getDailySummaryController
);

// 3. OBTENER TODOS con filtros y paginación (Ruta Raíz - MÁS GENÉRICA)
dailySummaryRouter.get(
  "/",
  zValidator("query", dailySummaryQuerySchema),
  getAllDailySummariesController
);

// --- Rutas de Modificación ---

// 4. CREAR (JSON)
dailySummaryRouter.post(
  "/",
  zValidator("json", createDailySummarySchema),
  createDailySummaryController
);

// 5. ACTUALIZAR (PARAM + JSON)
dailySummaryRouter.patch(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  zValidator("json", updateDailySummarySchema),
  updateDailySummaryController
);

// 6. ELIMINAR (PARAM)
dailySummaryRouter.delete(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  deleteDailySummaryController
);

export default dailySummaryRouter;