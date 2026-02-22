import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PlayCircle, ChefHat, ListOrdered } from "lucide-react";
import type { Meal } from "@/lib/api";
import { getYoutubeEmbedUrl, translateText } from "@/lib/api";
import LanguageSelector from "./LanguageSelector";

interface RecipeDetailProps {
  meal: Meal;
  onBack: () => void;
}

const RecipeDetail = ({ meal, onBack }: RecipeDetailProps) => {
  const [language, setLanguage] = useState("en");
  const [translatedInstructions, setTranslatedInstructions] = useState(meal.strInstructions);
  const [isTranslating, setIsTranslating] = useState(false);

  const embedUrl = getYoutubeEmbedUrl(meal.strYoutube);

  useEffect(() => {
    if (language === "en") {
      setTranslatedInstructions(meal.strInstructions);
      setIsTranslating(false);
      return;
    }

    let cancelled = false;
    setIsTranslating(true);

    // Translate in chunks for better results - in parallel for speed
    const chunks = meal.strInstructions.match(/[^.!?\n]+[.!?\n]+/g) || [meal.strInstructions];
    const translateAll = async () => {
      try {
        // Translate all chunks in parallel for maximum speed
        const results = await Promise.all(
          chunks.map(chunk => translateText(chunk.trim(), language))
        );
        if (!cancelled) {
          setTranslatedInstructions(results.join(" "));
          setIsTranslating(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Translation error:", error);
          setTranslatedInstructions(meal.strInstructions);
          setIsTranslating(false);
        }
      }
    };

    translateAll();
    return () => { cancelled = true; };
  }, [language, meal.strInstructions]);

  const steps = translatedInstructions
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      {/* Back button + language */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to results
        </button>
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>

      {/* Header */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full rounded-2xl shadow-lg object-cover aspect-square"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-3">
            {meal.strArea && (
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold font-body">
                {meal.strArea}
              </span>
            )}
            {meal.strCategory && (
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold font-body">
                {meal.strCategory}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            {meal.strMeal}
          </h1>
          {meal.strTags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {meal.strTags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-body"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Ingredients */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h2 className="flex items-center gap-2 text-lg font-display font-semibold text-foreground mb-4">
              <ChefHat className="w-5 h-5 text-primary" />
              Ingredients
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meal.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm font-body text-foreground"
                >
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                  <span className="text-muted-foreground">{ing.measure}</span>{" "}
                  {ing.ingredient}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Video */}
      {embedUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="flex items-center gap-2 text-2xl font-display font-semibold text-foreground mb-4">
            <PlayCircle className="w-6 h-6 text-secondary" />
            Watch How to Cook
          </h2>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-border/50">
            <iframe
              src={embedUrl}
              title={`How to make ${meal.strMeal}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="flex items-center gap-2 text-2xl font-display font-semibold text-foreground mb-6">
          <ListOrdered className="w-6 h-6 text-primary" />
          Step-by-Step Instructions
          {isTranslating && (
            <span className="text-sm font-body text-muted-foreground animate-pulse-soft ml-2">
              Translating...
            </span>
          )}
        </h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex gap-4 p-4 rounded-xl bg-card border border-border/50"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0 font-body">
                {i + 1}
              </span>
              <p className="text-foreground font-body leading-relaxed pt-1">
                {step}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecipeDetail;
