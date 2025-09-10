import { PageSection } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";
import { Button, Input, Textarea, Image, Link } from "@heroui/react";
import hi from "@/assets/hi.gif";

export const ContactMe = () => {
  const { language, email } = useAppStore();
  const { menuItems } = translations[language];
  const headerLabel = menuItems[5];

  // TODO: add zod integration with RHF, and implement EmailJS integration

  return (
    <PageSection menuIndex={5} header={headerLabel}>
      <div className="container mx-auto px-6 md:px-10">
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left column: static contact info */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold">Contact</h3>
            <Image
              src={hi}
              alt="Hello gif"
              radius="lg"
              shadow="sm"
              className="w-full h-56 object-cover"
            />

            <div className="flex items-center gap-3">
              <i className="fa-solid fa-envelope text-accent text-lg md:text-xl" />
              <Link
                href={`mailto:${email}`}
                className="text-base md:text-lg font-bold text-decoration-none"
              >
                {email}
              </Link>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4">
                Follow Me
              </h3>
              <div className="flex items-center gap-4 text-xl text-foreground-600">
                <Link
                  href="https://x.com/teomankirma"
                  target="_blank"
                  aria-label="X"
                  className="text-inherit hover:text-accent"
                >
                  <i className="fa-brands fa-x-twitter text-2xl" />
                </Link>
                <Link
                  href="https://github.com/teomankirma"
                  target="_blank"
                  aria-label="GitHub"
                  className="text-inherit hover:text-accent text-2xl"
                >
                  <i className="fa-brands fa-github" />
                </Link>
                <Link
                  href="https://linkedin.com/in/teomankirma/"
                  target="_blank"
                  aria-label="LinkedIn"
                  className="text-inherit hover:text-accent text-2xl"
                >
                  <i className="fa-brands fa-linkedin" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right column: send a note form (UI only) */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold">
              Send Me A Note
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Your Name"
                variant="bordered"
                radius="lg"
                size="lg"
              />
              <Input
                label="Email"
                type="email"
                variant="bordered"
                radius="lg"
                size="lg"
              />
            </div>

            <Textarea
              label="Message"
              variant="bordered"
              radius="lg"
              placeholder="Please write your message here..."
              minRows={6}
              size="lg"
            />

            <div className="flex justify-center">
              <Button
                color="success"
                size="lg"
                radius="full"
                className="text-white px-8"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
};
