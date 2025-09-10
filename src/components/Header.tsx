import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@heroui/react";
import { ThemeSwitcher, LanguageSwitcher } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";
import { toSectionHref } from "@/utils";

export const Header = () => {
  const { language, isMenuOpen, updateState } = useAppStore();
  const t = translations[language];

  const handleMenuOpen = (open: boolean) => {
    updateState({ isMenuOpen: open });
  };

  const handleMenuClose = () => {
    updateState({ isMenuOpen: false });
  };

  return (
    <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={handleMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden cursor-pointer"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">{t.name}</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex gap-8 pl-8" justify="center">
        {t.menuItems.map((item) => (
          <NavbarItem key={item}>
            <Link color="foreground" href={toSectionHref(item)}>
              {item}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <LanguageSwitcher />
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {t.menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              href={toSectionHref(item)}
              size="lg"
              color="foreground"
              onClick={handleMenuClose}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
