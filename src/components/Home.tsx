import { Typewriter } from "react-simple-typewriter";
import { Button, Spacer, Avatar, Link } from "@heroui/react";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";
import me from "@/assets/me.png";

export const Home = () => {
  const { language } = useAppStore();
  const { welcome, typewriter, location, hireMe } = translations[language];

  return (
    <div id="home">
      <div>
        <Spacer y={1} />
        <div>
          <Avatar className="h-40 w-40" src={me} color="success" isBordered />
        </div>
      </div>
      <div>
        <div>
          <Spacer y={1} />
          <h1>{welcome}</h1>
        </div>
      </div>
      <div>
        <div>
          <Spacer y={2} />
          <h2 className="font-bold">
            <Typewriter
              words={typewriter}
              loop={0}
              cursor={true}
              cursorColor="var(--color-accent)"
            />
          </h2>
        </div>
      </div>
      <div>
        <div>
          <Spacer y={2} />
          <h3 className="font-medium">{location}</h3>
          <Spacer y={2} />
        </div>
      </div>
      <div>
        <div>
          <Link href="#contactMe">
            <Button
              color="success"
              size="lg"
              radius="full"
              variant="ghost"
              className="text-accent data-[hover=true]:!text-white"
            >
              {hireMe}
            </Button>
          </Link>
        </div>
      </div>
      <Spacer y={1} />
    </div>
  );
};
