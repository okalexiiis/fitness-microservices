import { z } from "zod"
import { querySchema } from "../types/api.types"

// Constantes de categorías
export const ExerciseCategory = ["cardio", "strength"] as const
export type ExerciseCategoryType = (typeof ExerciseCategory)[number]

// Entidad base (para tu capa de dominio o base de datos)
export interface Exercise {
  id: number
  name: string
  description: string
  category: ExerciseCategoryType
  duration_minutes: number
  calories_burned: number
}

// Zod Schema base para validación
export const exerciseBaseSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
  category: z.enum(ExerciseCategory, { message: "Categoría inválida" }),
  duration_minutes: z.number().positive().max(300),
  calories_burned: z.number().positive(),
})

// DTO para creación
export const createExerciseSchema = exerciseBaseSchema
export type CreateExerciseDTO = z.infer<typeof createExerciseSchema>

// DTO para actualización (todos los campos opcionales)
export const updateExerciseSchema = exerciseBaseSchema.partial()
export type UpdateExerciseDTO = z.infer<typeof updateExerciseSchema>

// Filtros opcionales
export const exerciseFilterSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().optional(),
  category: z.enum(ExerciseCategory).optional(),
})
export type ExerciseFilters = z.infer<typeof exerciseFilterSchema>

export const exerciseQuerySchema = exerciseFilterSchema.and(querySchema)
export type ExerciseQuery = z.infer<typeof exerciseQuerySchema>
