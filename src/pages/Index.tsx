import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchMeals, type Meal } from "@/lib/api";
import HeroSearch from "@/components/HeroSearch";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetail from "@/components/RecipeDetail";
import { UtensilsCrossed } from "lucide-react";

const Index = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [latestMeals, setLatestMeals] = useState<Meal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch latest recipes on page load
  useEffect(() => {
    const fetchLatestMeals = async () => {
      try {
        const results = await searchMeals("a"); // default query to get multiple recipes
        setLatestMeals(results.slice(0, 6)); // show first 6 recipes
      } catch {
        setLatestMeals([]);
      }
    };

    fetchLatestMeals();
  }, []);

  // Track search input and fetch search results
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setSelectedMeal(null);
    setHasSearched(true);
    try {
      if (query.trim()) {
        // If there's a search query, fetch those results
        const results = await searchMeals(query);
        setMeals(results);
      } else {
        // If query is empty, show latest 6 recipes
        setMeals(latestMeals);
      }
    } catch {
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              Recipe<span className="text-secondary">Hub</span>
            </span>
          </div>
          <p className="hidden sm:block text-sm text-muted-foreground font-body">
            Discover recipes in any language
          </p>
        </div>
      </header>

      <main className="pt-16">
        <AnimatePresence mode="wait">
          {selectedMeal ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RecipeDetail
                meal={selectedMeal}
                onBack={() => setSelectedMeal(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Search */}
              <HeroSearch onSearch={handleSearch} isLoading={isLoading} />

              {/* Recipes Section */}
              <section className="max-w-7xl mx-auto px-4 py-12">
                {/* Loading Spinner */}
                {isLoading && (
                  <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
                  </div>
                )}

                {/* Show latest recipes when input is empty */}
                {!isLoading && !hasSearched && latestMeals.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                      Latest Recipes
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {latestMeals.map((meal, i) => (
                        <RecipeCard
                          key={meal.idMeal}
                          meal={meal}
                          index={i}
                          onClick={() => {
                            setSelectedMeal(meal);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Show results when searched with empty query or search results */}
                {!isLoading && hasSearched && searchQuery.trim() === "" && meals.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                      Latest Recipes
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {meals.map((meal, i) => (
                        <RecipeCard
                          key={meal.idMeal}
                          meal={meal}
                          index={i}
                          onClick={() => {
                            setSelectedMeal(meal);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Show no results message */}
                {!isLoading && hasSearched && searchQuery.trim() !== "" && meals.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <p className="text-xl text-muted-foreground font-body">
                      No recipes found. Try a different search!
                    </p>
                  </motion.div>
                )}

                {/* Show search results */}
                {!isLoading && hasSearched && searchQuery.trim() !== "" && meals.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                      Found {meals.length} recipe{meals.length > 1 ? "s" : ""}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {meals.map((meal, i) => (
                        <RecipeCard
                          key={meal.idMeal}
                          meal={meal}
                          index={i}
                          onClick={() => {
                            setSelectedMeal(meal);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {/* <footer className="border-t border-border/50 py-8 text-center">
        <p className="text-sm text-muted-foreground font-body">
          Powered by TheMealDB • Recipes in 10+ languages
        </p>
      </footer> */}
    </div>
  );
};

export default Index;