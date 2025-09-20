import { useTheme } from "@heroui/use-theme";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

function getIconClassName(theme?: string) {
  if (!theme || theme === "system") return "fa-solid fa-laptop";
  if (theme === "dark") return "fa-solid fa-moon";
  return "fa-solid fa-sun";
}

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme ?? "system";

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          isIconOnly
          className="transition-transform will-change-transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
          aria-label={`Theme: ${currentTheme}`}
        >
          <i
            className={`${getIconClassName(currentTheme)} text-lg`}
            aria-hidden
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Select theme"
        selectionMode="single"
        selectedKeys={new Set([currentTheme])}
        onAction={(key) => setTheme(String(key))}
      >
        <DropdownItem key="light">Light</DropdownItem>
        <DropdownItem key="dark">Dark</DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
