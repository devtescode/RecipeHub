import { LANGUAGES } from "@/lib/api";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
}

const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  const selected = LANGUAGES.find((l) => l.code === value);

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[160px] bg-card border-border font-body">
          <SelectValue>
            {selected && `${selected.flag} ${selected.name}`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="font-body">
              {lang.flag} {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
