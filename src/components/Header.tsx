import React from "react";
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
import { ThemeSwitcher, LanguageSwitcher } from "@/components";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { language } = useAppStore();
  const { name, menuItems } = translations[language];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden cursor-pointer"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">{name}</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex gap-8 px-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item}>
            <Link color="foreground" href="#">
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
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              href="#"
              size="lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
