import { Hono } from "hono";
import { GetAllFoods } from "../controllers/get-all-foods.controller";

const router = new Hono()

router.get('/', GetAllFoods)

export default router