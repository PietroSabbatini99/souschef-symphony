
import { calorieGuidelines } from "./config.ts";

// Get the OpenAI API key from environment variables
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Generate a recipe prompt for OpenAI based on user preferences
export function generateRecipePrompt(
  mealType: string, 
  styleDescription: string,
  promptIngredients: string, 
  dietaryConstraints: string,
  servings: number = 2
) {
  // Get calorie guidelines for the meal type
  const calorieGuideline = calorieGuidelines[mealType] || 
    "Aim for a realistic calorie count based on ingredients and portion size";

  return `You are a professional chef specialized in creating ${styleDescription} recipes. Generate a ${mealType} recipe ${promptIngredients} for ${servings} ${servings === 1 ? 'person' : 'persons'}.${dietaryConstraints}

For the recipe name:
- If cuisine level is "street": Create a catchy, simple name
- If cuisine level is "home": Create a straightforward, approachable name
- If cuisine level is "gourmet": Create an elegant, sophisticated name

IMPORTANT NUTRITION GUIDELINES: ${calorieGuideline}. Calculate calories based on standard nutritional values of ingredients. Be precise and realistic with calorie calculations - do not underestimate or overestimate.

Provide the following JSON structure:
{
  "title": "Recipe Title",
  "description": "Brief appetizing description of the dish",
  "ingredients": ["Ingredient 1 with amount", "Ingredient 2 with amount"],
  "instructions": "Step by step cooking instructions",
  "cooking_time": cooking time in minutes (number only),
  "difficulty": "easy", "medium", or "hard" based on complexity,
  "image_prompt": "A detailed description for generating an image of this dish",
  "meal_type": "${mealType}",
  "calories_per_serving": realistic calories per serving (number only),
  "servings": ${servings}
}`;
}

// Call OpenAI API to generate recipe
export async function generateRecipeWithOpenAI(
  systemPrompt: string,
  userPrompt: string,
  mealType: string
) {
  console.log(`Sending request to OpenAI for ${mealType} recipe`);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(`OpenAI API error for ${mealType}:`, errorData);
    throw new Error(`OpenAI API error for ${mealType}: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  console.log(`OpenAI response received for ${mealType}:`, content.substring(0, 100) + "...");
  
  return content;
}
