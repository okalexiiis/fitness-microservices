export interface Food {
    id: number
    name: string
    calories: number // Decimal
    proteins: number // Decimal
    carbs: number // Decimal
    fats: number // Decimal
}

export interface CreateFoodDTO extends Omit<Food, "id"> {}