
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cooking_time: number;
  difficulty: string;
  cuisine: string;
  ingredients: Record<string, any> | string | any[];
  instructions: string;
  created_at: string;
}
