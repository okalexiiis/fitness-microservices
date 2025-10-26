import { applyFilters, sanitizeUpdates } from "../Helpers";
import { eq, sql } from "drizzle-orm";
import { ApiResponsePaginated, UserFilters } from "../Interfaces/ApiTypes";
import { db } from "../Database";
import { User } from "../Models/user";
import { usersTable } from "../Database/schemas/user";

export class UserService {
  private _db = db;

  // Guardar usuario
  public async Save(newUser: User): Promise<void> {
    await this._db.insert(usersTable).values({
      email: newUser.email,
      name: newUser.name,
      password_hash: newUser.password_hash,
      age: newUser.age,
      height: newUser.height,
      weight: newUser.weight,
      goal: newUser.goal,
    });
  }

  // Obtener todos los usuarios con filtros y paginación
  public async GetAll(
    page: number = 1,
    limit: number = 10,
    filters?: UserFilters
  ): Promise<ApiResponsePaginated<User>> {
    const offset = (page - 1) * limit;

    let query = this._db.select().from(usersTable);
    query = applyFilters(query, filters);

    const users: User[] = await query.limit(limit).offset(offset);

    let totalQuery = this._db.select({ total: sql<number>`COUNT(*)` }).from(usersTable);
    totalQuery = applyFilters(totalQuery, filters);
    const totalResult = await totalQuery;
    const total = totalResult[0].total;

    return {
      data: users,
      ok: true,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Obtener un usuario por criterios
  public async GetOneBy(criteria: UserFilters): Promise<User | null> {
    let query = this._db.select().from(usersTable);
    query = applyFilters(query, criteria);

    const user: User | undefined = await query.limit(1).then((res) => res[0]);
    return user || null;
  }

  // Actualizar usuario por id
  public async update(id: number, updates: Partial<User>): Promise<void> {
    await this._db
      .update(usersTable)
      .set(sanitizeUpdates(updates))
      .where(eq(usersTable.id, id));
  }

  // Eliminar usuario por id
  public async delete(id: number): Promise<void> {
    await this._db.delete(usersTable).where(eq(usersTable.id, id));
  }
}
