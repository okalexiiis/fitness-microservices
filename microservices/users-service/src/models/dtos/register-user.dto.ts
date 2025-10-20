export interface RegisterUserDTO {
    nombre: string
    email: string
    password: string
    edad: number
    sexo: "M" | "F"
    altura_cm: number
    peso_kg: number
}