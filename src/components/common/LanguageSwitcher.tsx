import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Language } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";

function getLangEmoji(lang: Language) {
  return lang === "tr" ? "🇹🇷" : "🇬🇧";
}

function getLangLabel(lang: Language) {
  return lang === "tr" ? "Türkçe" : "English";
}

export function LanguageSwitcher() {
  const language = useAppStore((s) => s.language);
  const updateState = useAppStore((s) => s.updateState);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Language: ${getLangLabel(language)}`}
          className="transition-transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
        >
          <span aria-hidden className="text-lg">
            {getLangEmoji(language)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => updateState({ language: Language.EN })}>
          🇬🇧 English
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => updateState({ language: Language.TR })}>
          🇹🇷 Türkçe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
