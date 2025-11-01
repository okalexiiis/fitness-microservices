import { db, exerciseTable } from "../db";
import { eq, sql } from "drizzle-orm/sql";
import {
  createExerciseDTO,
  Exercise,
  ExerciseFilters,
  updateExerciseDTO,
} from "../models/Exercise";
import { applyFilters, sanitizeUpdates } from "../helpers";

export class ExerciseService {
  private _db = db;

  public async save(raw: createExerciseDTO): Promise<void> {
    await this._db.insert(exerciseTable).values(raw);
  }

  public async getAll(
    page: number = 1,
    limit: number = 10,
    filters?: ExerciseFilters
  ): Promise<{ total: number; data: Exercise[] }> {
    const offset = (page - 1) * limit;

    let query = this._db.select().from(exerciseTable);
    query = applyFilters({ entity: exerciseTable, query, filters });

    const exercises: Exercise[] = await query.limit(limit).offset(offset);

    let totalQuery = this._db
      .select({ total: sql<number>`COUNT(*)` })
      .from(exerciseTable);
    totalQuery = applyFilters({
      entity: exerciseTable,
      query: totalQuery,
      filters,
    });
    const totalResult = await totalQuery;
    const total = totalResult[0].total;

    return { total: total, data: exercises };
  }

  public async getOneBy(criteria: ExerciseFilters): Promise<Exercise | null> {
    let query = this._db.select().from(exerciseTable);
    query = applyFilters({ entity: exerciseTable, query, filters: criteria });
    const exercise: Exercise | undefined = await query
      .limit(1)
      .then((res) => res[0]);
    return exercise || null;
  }

  public async update(id: number, updates: updateExerciseDTO): Promise<void> {
    const cleanUpdates = sanitizeUpdates(updates);

    if (!cleanUpdates)
      throw new Error("No values to update", { cause: { code: 100 } });

    await this._db
      .update(exerciseTable)
      .set(cleanUpdates)
      .where(eq(exerciseTable.id, id));
  }

  public async delete(id: number): Promise<void> {
    await this._db.delete(exerciseTable).where(eq(exerciseTable.id, id));
  }
}
