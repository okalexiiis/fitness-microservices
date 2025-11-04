import type { Auth } from "@auth/types";
import { POST } from "@shared/api/api.base";
import * as Yup from "yup";

export const LoginSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("El email es requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
}).required();

export interface LoginDTO {
  password: string;
  email: string;
}

const LOGIN_ENDPOINT = "users/login";

export async function loginRequest(data: LoginDTO) {
  try {
    const res = await POST<Auth>(LOGIN_ENDPOINT, data);
    return res
  } catch (err: any) {
    if ("statusCode" in err) {
      console.error("❌ Error:", err.statusCode, err.message);
    } else {
      console.error("⚠️ Error desconocido:", err);
    }
    throw err;
  }
}
