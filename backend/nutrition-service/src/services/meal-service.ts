import { db } from "../db";
import { mealTable } from "../db/schemas/meal";
import { MealFilters } from "../interfaces/api-types";
import { CreateMealDTO, Meal } from "../models/Meal";
import { applyFilters, sanitizeUpdates } from "../helpers";
import { eq, sql } from "drizzle-orm/sql";

export class MealService {
  private _db = db;

  // Guardar Comida
  public async Save(newMeal: CreateMealDTO): Promise<void> {
    await this._db.insert(mealTable).values(newMeal);
  }

  // Obtener todos las Comidas con filtros y paginación
  public async GetAll(
    page: number = 1,
    limit: number = 10,
    filters?: MealFilters
  ): Promise<{ total: number; data: Meal[] }> {
    const offset = (page - 1) * limit;

    let query = this._db.select().from(mealTable);
    query = applyFilters({ entity: mealTable, query, filters });

    const meals: Meal[] = await query.limit(limit).offset(offset);

    let totalQuery = this._db
      .select({ total: sql<number>`COUNT(*)` })
      .from(mealTable);
    totalQuery = applyFilters({
      entity: mealTable,
      query: totalQuery,
      filters,
    });
    const totalResult = await totalQuery;
    const total = totalResult[0].total;

    return { total: total, data: meals };
  }

  // Obtener una comida por criterios
  public async GetOneBy(criteria: MealFilters): Promise<Meal | null> {
    let query = this._db.select().from(mealTable);
    query = applyFilters({ entity: mealTable, query, filters: criteria });
    const meal: Meal | undefined = await query.limit(1).then((res) => res[0]);
    return meal || null;
  }

  // Actualizar Comida por id
  public async update(id: number, updates: Partial<CreateMealDTO>): Promise<void> {
    const cleanUpdates = sanitizeUpdates(updates);

    if (!cleanUpdates)
      throw new Error("No values to update", { cause: { code: 100 } });

    await this._db
      .update(mealTable)
      .set(cleanUpdates)
      .where(eq(mealTable.id, id));
  }

  // Eliminar comida por id
  public async delete(id: number): Promise<void> {
    await this._db.delete(mealTable).where(eq(mealTable.id, id));
  }
}
