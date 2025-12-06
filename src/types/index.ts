import { Dish } from '@/lib/supabase'

export type Category = 'voor' | 'hoofd' | 'na'

export interface DishWithScore extends Dish {
  score: number
}

export interface SwipeState {
  currentDishIndex: number
  dishes: DishWithScore[]
  category: Category
}

export interface CategoryResult {
  category: Category
  winner: Dish
  top3: Dish[]
}

export interface FinalMenu {
  voor: Dish
  hoofd: Dish
  na: Dish
}

export interface SwipeDirection {
  direction: 'left' | 'right' | 'up'
  score: number
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'voor', label: 'Voorgerecht' },
  { value: 'hoofd', label: 'Hoofdgerecht' },
  { value: 'na', label: 'Nagerecht' },
]

export const SWIPE_DIRECTIONS: SwipeDirection[] = [
  { direction: 'left', score: 0 },
  { direction: 'right', score: 1 },
  { direction: 'up', score: 2 },
]