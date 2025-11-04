import { and, eq, gte, lte, desc, sql } from "drizzle-orm";
import { DailySummaryTable, db } from "../db";
import {
  createDailySummaryDTO,
  DailySummary,
  TDailySummaryFilters,
  TDailySummaryQuery,
  updateDailySummaryDTO,
} from "../models/DailySummary";

export class DailySummaryService {
  // Asumiendo la inyección de dependencias como en el ejemplo anterior
  constructor(private readonly _db = db) {}

  /**
   * Guarda el resumen diario.
   * Si el usuario ya tiene un registro ese día → actualiza.
   * Si no, crea uno nuevo.
   */
  public async save(dto: createDailySummaryDTO): Promise<DailySummary> {
    // 1. Formatear la fecha a ISO (YYYY-MM-DD) para la base de datos
    const dateISO = new Date(dto.date).toISOString().split("T")[0];

    // 2. Buscar el registro existente por user_id y date
    const existing = await this._db
      .select()
      .from(DailySummaryTable)
      .where(
        and(
          eq(DailySummaryTable.user_id, dto.user_id),
          eq(DailySummaryTable.date, dateISO)
        )
      );

    // 3. Si existe, actualizar
    if (existing.length > 0) {
      const existingLog = existing[0];

      // Construir el objeto de actualización sin el user_id ni la date (ya que no cambian)
      const updateData = {
        total_calories_consumed: dto.total_calories_consumed,
        total_calories_burned: dto.total_calories_burned,
        workouts_completed: dto.workouts_completed,
      };

      await this._db
        .update(DailySummaryTable)
        .set(updateData)
        .where(eq(DailySummaryTable.id, existingLog.id));

      // Devolver el objeto actualizado
      return {
        ...existingLog,
        ...updateData,
      };
    }

    // 4. Si no existe, crear uno nuevo
    const [inserted] = await this._db
      .insert(DailySummaryTable)
      .values({ ...dto, date: dateISO }) // Usar dateISO para la columna 'date'
      .returning();

    return inserted;
  }

  /**
   * Obtiene todos los resúmenes de un usuario con filtros de rango y paginación.
   */
  public async getAll({
    limit = 10,
    page = 1,
    ...filters
  }: TDailySummaryQuery): Promise<{ total: number; data: DailySummary[] }> {
    const offset = (page - 1) * limit;
    const conditions: any[] = [];

    // 1. Construir las condiciones de filtro
    if (filters.user_id) {
      conditions.push(eq(DailySummaryTable.user_id, filters.user_id));
    }

    // Filtro por fecha específica
    if (filters.date) {
      conditions.push(
        eq(
          DailySummaryTable.date,
          new Date(filters.date).toISOString().split("T")[0]
        )
      );
    }

    // Filtro por rango de fechas
    if (filters.date_range) {
      const [start, end] = resolveDateRange(filters.date_range);
      conditions.push(gte(DailySummaryTable.date, start));
      conditions.push(lte(DailySummaryTable.date, end));
    }

    const whereCondition = conditions.length ? and(...conditions) : undefined;

    // 2. Consulta de Conteo Total
    const [countResult] = await this._db
      .select({ total: sql<number>`count(*)` })
      .from(DailySummaryTable)
      .where(whereCondition);

    const total = countResult.total;

    // 3. Consulta de Datos Paginados
    const data = await this._db
      .select()
      .from(DailySummaryTable)
      .where(whereCondition)
      .orderBy(desc(DailySummaryTable.date))
      .limit(limit)
      .offset(offset);

    return {
      total,
      data: data as DailySummary[],
    };
  }

  /**
   * Obtiene un registro por id o por combinación user_id + date.
   */
  public async getOne({
    date,
    user_id,
    id,
  }: TDailySummaryFilters): Promise<DailySummary | undefined> {
    // Devolver undefined si no se encuentra

    if (user_id && date) {
      const dateISO = new Date(date).toISOString().split("T")[0];
      const [found] = await this._db
        .select()
        .from(DailySummaryTable)
        .where(
          and(
            eq(DailySummaryTable.user_id, user_id),
            eq(DailySummaryTable.date, dateISO)
          )
        );
      return found;
    }

    if (id) {
      const [found] = await this._db
        .select()
        .from(DailySummaryTable)
        .where(eq(DailySummaryTable.id, id));
      return found;
    }

    // Es buena práctica no lanzar un Error si solo no se encontraron filtros,
    // pero si se quiere forzar la provisión de filtros, se mantiene el throw.
    throw new Error(
      "Debe especificar id o user_id + date para obtener un registro."
    );
  }

  /**
   * Actualiza un registro existente por ID.
   */
  public async update(
    id: number,
    dto: updateDailySummaryDTO
  ): Promise<DailySummary> {
    // Preparar DTO para la actualización: manejar la fecha si existe
    const updatePayload: any = { ...dto };
    if (dto.date) {
      updatePayload.date = new Date(dto.date).toISOString().split("T")[0];
    }

    // 1. Realizar la actualización
    const [updated] = await this._db
      .update(DailySummaryTable)
      .set(updatePayload)
      .where(eq(DailySummaryTable.id, id))
      .returning(); // Usar returning() para evitar una segunda consulta de select

    // 2. Comprobar y devolver
    if (!updated) {
      throw new Error(`Registro con ID ${id} no encontrado para actualizar.`);
    }
    return updated;
  }

  /**
   * Elimina un registro definitivamente por ID.
   */
  public async delete(id: number): Promise<{ deleted: boolean }> {
    // Drizzle no devuelve el número de filas afectadas por defecto en todos los clientes,
    // pero se puede usar returning() o confiar en que la operación se completó.
    await this._db
      .delete(DailySummaryTable)
      .where(eq(DailySummaryTable.id, id));
    return { deleted: true };
  }
}
