import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
import { db, WeightLogTable } from "../db";
import {
  createWeightLogDTO,
  TWeightLogFilters,
  TWeightLogQuery,
  updateWeightLogDTO,
  WeightLog,
} from "../models/WeightLog";

export class WeightLogService {
  constructor(private readonly _db = db) {}

  /**
   * Guarda el peso del día.
   * Si el usuario ya tiene un registro ese día → actualiza.
   * Si no, crea uno nuevo.
   */
  public async save(dto: createWeightLogDTO): Promise<WeightLog> {
    // Asegurarse de que el DTO esté usando un formato de fecha válido
    const dateISO = new Date(dto.date).toISOString().split("T")[0];

    // 1. Buscar el registro existente
    const existing = await this._db
      .select()
      .from(WeightLogTable)
      .where(
        and(
          eq(WeightLogTable.user_id, dto.user_id),
          eq(WeightLogTable.date, dateISO)
        )
      );

    // 2. Verificar si el arreglo de resultados tiene elementos
    if (existing.length > 0) {
      const existingLog = existing[0]; // **CORRECCIÓN: Obtener el objeto específico**

      // 3. Actualizar el registro
      await this._db
        .update(WeightLogTable)
        .set({ weight: dto.weight })
        .where(eq(WeightLogTable.id, existingLog.id));

      // 4. Devolver el objeto actualizado (sin tener que volver a consultarlo)
      // El tipo debe ser WeightLog. Se usa el spread operator en el objeto, no en el array.
      return {
        ...existingLog,
        weight: dto.weight,
      };
    }

    // Si no existe, crear uno nuevo
    const [inserted] = await this._db
      .insert(WeightLogTable)
      .values({ ...dto, date: dateISO.toString() })
      .returning();

    return { ...inserted };
  }

  /**
   * Obtiene todos los registros de un usuario con filtros de rango o fecha específica,
   * incluyendo paginación.
   */
  public async getAll({
    limit = 10, // Valor por defecto
    page = 1, // Valor por defecto
    ...filters
  }: TWeightLogQuery): Promise<{ total: number; data: WeightLog[] }> {
    // <-- CORRECCIÓN DE LA FIRMA

    // 1. Calcular el offset
    const offset = (page - 1) * limit;
    const conditions: any[] = [];

    // 2. Construir las condiciones de filtro
    if (filters.user_id) {
      conditions.push(eq(WeightLogTable.user_id, filters.user_id));
    }

    if (filters.date) {
      conditions.push(
        eq(
          WeightLogTable.date,
          new Date(filters.date).toISOString().split("T")[0]
        )
      );
    }

    if (filters.date_range) {
      // Asumiendo que resolveDateRange existe y es correcta
      const [start, end] = resolveDateRange(filters.date_range);
      conditions.push(gte(WeightLogTable.date, start));
      conditions.push(lte(WeightLogTable.date, end));
    }

    const whereCondition = conditions.length ? and(...conditions) : undefined;

    // --- Lógica de Paginación ---

    // 3. Consulta para obtener el CONTEO TOTAL
    // Esto se necesita para calcular el número de páginas total.
    const [countResult] = await this._db
      .select({ total: sql<number>`count(*)` })
      .from(WeightLogTable)
      .where(whereCondition);

    const total = countResult.total;

    // 4. Consulta para obtener los DATOS PAGINADOS
    const data = await this._db
      .select()
      .from(WeightLogTable)
      .where(whereCondition) // Aplicar las mismas condiciones
      .orderBy(desc(WeightLogTable.date)) // Mejor ordenar por fecha descendente
      .limit(limit) // Aplicar el límite de registros por página
      .offset(offset); // Aplicar el desplazamiento

    // 5. Retornar la respuesta con el total y los datos
    return {
      total,
      data: data as WeightLog[],
    };
  }

  /**
   * Obtiene un registro por id o por combinación user_id + date
   */
  public async getOne({
    date,
    user_id,
    id,
  }: TWeightLogFilters): Promise<WeightLog> {
    if (user_id && date) {
      const dateISO = new Date(date).toISOString().split("T")[0];
      const [found] = await this._db
        .select()
        .from(WeightLogTable)
        .where(
          and(
            eq(WeightLogTable.user_id, user_id),
            eq(WeightLogTable.date, dateISO)
          )
        );
      return found;
    }

    if (id) {
      const [found] = await this._db
        .select()
        .from(WeightLogTable)
        .where(eq(WeightLogTable.id, id));
      return found;
    }

    throw new Error("Debe especificar id o user_id + date");
  }

  /**
   * Actualiza un registro existente.
   */
  public async update(id: number, dto: updateWeightLogDTO): Promise<WeightLog> {
    await this._db
      .update(WeightLogTable)
      .set(dto)
      .where(eq(WeightLogTable.id, id));
    const [updated] = await this._db
      .select()
      .from(WeightLogTable)
      .where(eq(WeightLogTable.id, id));
    return updated;
  }

  /**
   * Elimina un registro definitivamente.
   * (Podrías cambiarlo por un soft delete en el futuro)
   */
  public async delete(id: number): Promise<{ deleted: boolean }> {
    await this._db.delete(WeightLogTable).where(eq(WeightLogTable.id, id));
    return { deleted: true };
  }
}
