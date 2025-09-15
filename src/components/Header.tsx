import type React from "react";
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
import { ThemeSwitcher, LanguageSwitcher, Hover } from "@/components/common";
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

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={handleMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden cursor-pointer"
        />
        <NavbarBrand>
          <Hover>
            <Link
              href={toSectionHref(t.menuItems[0])}
              onClick={scrollToTop}
              color="foreground"
              className="font-bold text-inherit"
            >
              {t.name}
            </Link>
          </Hover>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex gap-8 pl-8" justify="center">
        {t.menuItems.map((item) => (
          <NavbarItem key={item}>
            <Hover>
              <Link
                color="foreground"
                className="font-semibold"
                href={toSectionHref(item)}
              >
                {item}
              </Link>
            </Hover>
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
            <Hover className="w-full">
              <Link
                className="w-full font-semibold"
                href={toSectionHref(item)}
                size="lg"
                color="foreground"
                onClick={handleMenuClose}
              >
                {item}
              </Link>
            </Hover>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
