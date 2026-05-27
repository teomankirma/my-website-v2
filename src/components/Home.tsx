import { Typewriter } from "react-simple-typewriter";
import { Button, Avatar, Link } from "@heroui/react";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";
import { toSectionHref } from "@/utils";
import me from "@/assets/me.png";
import { Stagger, Item, Hover } from "@/components/common";

export const Home = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const homeId = toSectionHref(t.menuItems[0]).slice(1);
  const contactHref = toSectionHref(t.menuItems[5]);

  return (
    <section
      id={homeId}
      className="home section flex min-h-[80svh] items-center justify-center"
    >
      <Stagger className="flex flex-col items-center text-center gap-12 mt-8 md:mt-0">
        <Item>
          <Avatar className="h-64 w-64" src={me} color="success" isBordered />
        </Item>

        <Item>
          <h1 className="text-3xl md:text-4xl font-bold">{t.home.welcome}</h1>
        </Item>

        <Item>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            <Typewriter
              words={t.home.typewriter}
              loop={0}
              cursor={true}
              cursorColor="var(--color-accent)"
            />
          </h2>
        </Item>

        <Item>
          <p className="text-lg md:text-2xl text-foreground/80">
            {t.home.location}
          </p>
        </Item>

        <Item>
          <Hover>
            <Link href={contactHref} className="inline-flex">
              <Button
                color="success"
                size="lg"
                radius="full"
                variant="ghost"
                className="text-accent data-[hover=true]:!text-white font-semibold"
              >
                {t.home.hireMe}
              </Button>
            </Link>
          </Hover>
        </Item>
      </Stagger>
    </section>
  );
};
