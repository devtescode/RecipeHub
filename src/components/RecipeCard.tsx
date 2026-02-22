import { motion } from "framer-motion";
import type { Meal } from "@/lib/api";
import { Clock, MapPin, Tag } from "lucide-react";

interface RecipeCardProps {
  meal: Meal;
  index: number;
  onClick: () => void;
}

const RecipeCard = ({ meal, index, onClick }: RecipeCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group text-left bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border/50"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {meal.strArea && (
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-body font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {meal.strArea}
            </span>
          )}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {meal.strMeal}
        </h3>
        <div className="flex items-center gap-3 text-muted-foreground text-sm font-body">
          {meal.strCategory && (
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              {meal.strCategory}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {meal.ingredients.length} ingredients
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default RecipeCard;
