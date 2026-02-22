export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  strTags: string | null;
  ingredients: { ingredient: string; measure: string }[];
}

function extractIngredients(meal: Record<string, string | null>): { ingredient: string; measure: string }[] {
  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient: ingredient.trim(), measure: measure?.trim() || '' });
    }
  }
  return ingredients;
}

export async function searchMeals(query: string): Promise<Meal[]> {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (!data.meals) return [];
  return data.meals.map((m: Record<string, string | null>) => ({
    idMeal: m.idMeal,
    strMeal: m.strMeal,
    strCategory: m.strCategory,
    strArea: m.strArea,
    strInstructions: m.strInstructions,
    strMealThumb: m.strMealThumb,
    strYoutube: m.strYoutube,
    strTags: m.strTags,
    ingredients: extractIngredients(m),
  }));
}

export function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (targetLang === 'en') return text;
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=en|${targetLang}`
    );
    const data = await res.json();
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    return text;
  } catch {
    return text;
  }
}

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];
