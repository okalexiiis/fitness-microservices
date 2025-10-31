import { Hono } from "hono";
import {
  CreateMealControlles,
  GetAllMealsControllers,
  DeleteMealController,
  GetMealByID,
  UpdateMealController,
} from "../controllers/meal";

const router = new Hono();

router.get("/", GetAllMealsControllers);
router.post("/", CreateMealControlles);
router.get("/:id", GetMealByID);
router.patch("/:id", UpdateMealController);
router.delete("/:id", DeleteMealController);

export default router;
