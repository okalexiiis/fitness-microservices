import { Hono } from "hono";
import {
  GetAllFoods,
  CreateFoodController,
  getOneByIDController,
  UpdateFoodController,
  deleteFoodController,
} from "../controllers/food";

const router = new Hono();

router.get("/", GetAllFoods);
router.get("/:id", getOneByIDController);
router.post("/", CreateFoodController);
router.patch("/:id", UpdateFoodController);
router.delete("/:id", deleteFoodController);

export default router;
