import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import type { Language } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";

function getLangEmoji(lang: Language): string {
  return lang === "tr" ? "🇹🇷" : "🇬🇧";
}

function getLangLabel(lang: Language): string {
  return lang === "tr" ? "Türkçe" : "English";
}

export const LanguageSwitcher = () => {
  const language = useAppStore((s) => s.language);
  const { updateState } = useAppStore();

  const currentLabel = getLangLabel(language);

  return (
      <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          isIconOnly
          className="transition-transform will-change-transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
          aria-label={`Language: ${currentLabel}`}
        >
          <span aria-hidden className="text-xl">
            {getLangEmoji(language)}
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Select language"
        selectionMode="single"
        selectedKeys={new Set([language])}
        onAction={(key) => updateState({ language: key as Language })}
      >
        <DropdownItem key="en">🇬🇧 English</DropdownItem>
        <DropdownItem key="tr">🇹🇷 Türkçe</DropdownItem>
      </DropdownMenu>
      </Dropdown>
  );
};
