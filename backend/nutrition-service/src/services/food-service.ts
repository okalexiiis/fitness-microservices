import { applyFilters } from "../helpers";
import { eq, sql } from "drizzle-orm";
import { ApiResponsePaginated, FoodFilters } from "../interfaces/api-types";
import { db } from "../db";
import { CreateFoodDTO, Food } from "../models/Food";
import { foodTable } from "../db/schemas/food";

export function sanitizeFoodUpdates(
  updates: Partial<{
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  }>
) {
  const result: Partial<{
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  }> = {};

  if (updates.name !== undefined) result.name = updates.name;
  if (updates.calories !== undefined) result.calories = updates.calories;
  if (updates.proteins !== undefined) result.proteins = updates.proteins;
  if (updates.carbs !== undefined) result.carbs = updates.carbs;
  if (updates.fats !== undefined) result.fats = updates.fats;

  return result;
}


export class FoodService {
  private _db = db;

  // Guardar Comida
  public async Save(newFood: CreateFoodDTO): Promise<void> {
    await this._db.insert(foodTable).values(newFood);
  }

  // Obtener todos las Comidas con filtros y paginación
  public async GetAll(
    page: number = 1,
    limit: number = 10,
    filters?: FoodFilters
  ): Promise<{total: number, data: Food[]}> {
    const offset = (page - 1) * limit;

    let query = this._db.select().from(foodTable);
    query = applyFilters({ entity: foodTable, query, filters });

    const foods: Food[] = await query.limit(limit).offset(offset);

    let totalQuery = this._db
      .select({ total: sql<number>`COUNT(*)` })
      .from(foodTable);
    totalQuery = applyFilters({
      entity: foodTable,
      query: totalQuery,
      filters,
    });
    const totalResult = await totalQuery;
    const total = totalResult[0].total;

    return {total: total, data: foods}
  }

  // Obtener una comida por criterios
  public async GetOneBy(criteria: FoodFilters): Promise<Food | null> {
    let query = this._db.select().from(foodTable);
    query = applyFilters({ entity: foodTable, query, filters: criteria });
    const food: Food | undefined = await query.limit(1).then((res) => res[0]);
    return food || null;
  }

  // Actualizar comida por id
  public async update(id: number, updates: Partial<Food>): Promise<void> {
    const cleanUpdates = sanitizeFoodUpdates(updates);

    await this._db
      .update(foodTable)
      .set(cleanUpdates)
      .where(eq(foodTable.id, id));
  }

  // Eliminar comida por id
  public async delete(id: number): Promise<void> {
    await this._db.delete(foodTable).where(eq(foodTable.id, id));
  }
}
