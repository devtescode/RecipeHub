import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const HeroSearch = ({ onSearch, isLoading }: HeroSearchProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // If input is cleared, show default 6 recipes
    if (value.trim() === "" && query.trim() !== "") {
      onSearch("");
    }
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="Fresh cooking ingredients on rustic table"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-display font-bold text-primary-foreground mb-4 leading-tight"
        >
          What's Cooking <span className="italic text-secondary">Today?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-primary-foreground/80 mb-10 font-body"
        >
          Enter any dish and get step-by-step recipes with video guides in your language.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="flex items-center max-w-xl mx-auto bg-background/95 backdrop-blur-sm rounded-full shadow-2xl overflow-hidden border border-border/50"
        >
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for a recipe... e.g. Chicken Curry"
            className="flex-1 px-6 py-4 md:py-5 bg-transparent text-foreground placeholder:text-muted-foreground font-body text-base md:text-lg outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="m-2 p-3 md:p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {["Pasta", "Sushi", "Tacos", "Curry", "Pizza"].map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); onSearch(s); }}
              className="px-4 py-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground/90 text-sm font-body hover:bg-primary-foreground/25 transition-colors backdrop-blur-sm border border-primary-foreground/10"
            >
              {s}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSearch;
