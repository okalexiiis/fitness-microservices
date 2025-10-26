// Cantidad de salt rounds
const SALT_ROUNDS = 10;

/**
 * Hashea un string (por ejemplo, contraseña) y devuelve el hash
 */
export async function hash(password: string): Promise<string> {
  return await Bun.password.hash(password, {algorithm: "bcrypt", cost: SALT_ROUNDS});
}

/**
 * Compara un string plano con un hash y devuelve true/false
 */
export async function compareHash(password: string, hashed: string): Promise<boolean> {
  return await Bun.password.verify(password, hashed);
}
