import { Context } from "hono";
import { FoodService } from "../../services/food-service";
import { ApiMapper } from "../../helpers/api-mapper";
import { Food } from "../../models/Food";

export async function getOneByIDController(c:Context) {
    const service = new FoodService()
    try {
        const id = c.req.param("id")
        let res = {}
        if(isNaN(Number(id))) {
            res = ApiMapper.ApiResponse<null>(null, 400, "The requested ID is not a number")
            return c.json(res, 400)
        }

        const food = await service.GetOneBy({id: Number(id) })

        if (!food) {
            res = ApiMapper.ApiResponse<null>(null, 404, "Food Not Found")
            return c.json(res, 404)
        }

        res = ApiMapper.ApiResponse<Food>(food, 200, "Food Found")
        return c.json(res)

    } catch (error) {
        let res
        console.log(error)

        // Buscar error

        // Si no hay error
        res = ApiMapper.ApiResponse<any>(error, 505, "Something Wrong Happened")
        return c.json(res)
    }
}