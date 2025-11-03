import { db, workoutTable } from "../db";
import { eq, sql } from "drizzle-orm/sql";
import {
  createWorkoutDTO,
  Workout,
  updateWorkoutDTO,
  WorkoutFilters,
} from "../models/Workout";
import { applyFilters, sanitizeUpdates } from "../helpers";

export class WorkoutService {
  private _db = db;

  public async save(raw: createWorkoutDTO): Promise<void> {
    await this._db.insert(workoutTable).values(raw);
  }

  public async getAll(
    page: number = 1,
    limit: number = 10,
    filters?: WorkoutFilters
  ): Promise<{ total: number; data: Workout[] }> {
    const offset = (page - 1) * limit;

    let query = this._db.select().from(workoutTable);
    query = applyFilters({ entity: workoutTable, query, filters });
    const workouts: Workout[] = await query.limit(limit).offset(offset);

    let totalQuery = this._db
      .select({ total: sql<number>`COUNT(*)` })
      .from(workoutTable);
    totalQuery = applyFilters({
      entity: workoutTable,
      query: totalQuery,
      filters,
    });
    const totalResult = await totalQuery;
    const total = totalResult[0].total;
    console.log("Filters:", filters);
    console.log("SQL:", query.toSQL());
    console.log("RESULT DATA", workouts);
    console.log("RESULT DATA", totalResult);
    console.log("OFFSET", offset);
    console.log("limit", limit);
    return { total: total, data: workouts };
  }

  public async getOneBy(criteria: WorkoutFilters): Promise<Workout | null> {
    let query = this._db.select().from(workoutTable);
    query = applyFilters({ entity: workoutTable, query, filters: criteria });
    const workout: Workout | undefined = await query
      .limit(1)
      .then((res) => res[0]);
    return workout || null;
  }

  public async update(id: number, updates: updateWorkoutDTO): Promise<void> {
    const cleanUpdates = sanitizeUpdates(updates);

    if (!cleanUpdates)
      throw new Error("No values to update", { cause: { code: 100 } });

    await this._db
      .update(workoutTable)
      .set(cleanUpdates)
      .where(eq(workoutTable.id, id));
  }

  public async delete(id: number): Promise<void> {
    await this._db.delete(workoutTable).where(eq(workoutTable.id, id));
  }
}
