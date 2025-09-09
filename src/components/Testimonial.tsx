import { useState } from "react";
import { Card, Avatar, Button } from "@heroui/react";
import { PageSection } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

// Simple, dependency-free testimonial slider using HeroUI + Tailwind.
// Uses dummy data for now; translations can be wired later.

type TestimonialItem = {
  name: string;
  title: string;
  quote: string;
  rating: number; // 1..5
};

const DUMMY_TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Jay Shah",
    title: "Founder at Icomatic Pvt Ltd",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    rating: 5,
  },
  {
    name: "Ava Nguyen",
    title: "Product Manager at Lumio",
    quote:
      "Teoman delivered clean code and clear communication. Shipping felt smooth and predictable across sprints.",
    rating: 5,
  },
  {
    name: "Carlos Mendes",
    title: "CTO at Orbit Labs",
    quote:
      "Great attention to detail and thoughtful UX decisions. Would collaborate again without hesitation.",
    rating: 4,
  },
  {
    name: "Sara Yılmaz",
    title: "Engineering Lead at Nova",
    quote:
      "Reliable, responsive, and pragmatic. The result matched the spec and shipped on time.",
    rating: 5,
  },
];

export const Testimonial = () => {
  const { language } = useAppStore();
  const { menuItems } = translations[language];
  const headerLabel = menuItems[4];

  const [index, setIndex] = useState(0);
  const total = DUMMY_TESTIMONIALS.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <PageSection menuIndex={4} header={headerLabel}>
      <div className="container mx-auto px-6 md:px-10">
        <div
          className="relative mt-12 max-w-3xl md:max-w-4xl mx-auto"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
          }}
        >
          {/* Slider viewport */}
          <div className="relative overflow-x-hidden overflow-y-visible py-2">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {DUMMY_TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="min-w-full px-2 md:px-16 py-2">
                  <Card
                    shadow="sm"
                    className="p-6 md:p-8 rounded-2xl bg-content1 h-[260px] md:h-[280px] flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className="inline-flex rounded-full p-0.5 ring-2 ring-accent">
                        <Avatar
                          className="h-12 w-12 bg-content1"
                          // Using placeholder avatar, no real images
                          showFallback
                        />
                      </span>
                      <div>
                        <p className="text-lg font-semibold">{t.name}</p>
                        <p className="text-foreground-500 text-sm">{t.title}</p>
                      </div>
                    </div>

                    <p className="mt-4 md:mt-5 text-base leading-relaxed flex-1">{t.quote}</p>

                    <div
                      className="mt-3 text-yellow-400"
                      aria-label={`Rating: ${t.rating} out of 5`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={`fa-solid fa-star ${
                            i < t.rating ? "opacity-100" : "opacity-30"
                          }`}
                        />
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Prev / Next arrows */}
            <Button
              variant="light"
              isIconOnly
              radius="full"
              aria-label="Previous testimonial"
              onPress={prev}
              className="absolute -left-3 md:left-2 top-1/2 -translate-y-1/2 z-10 text-accent"
            >
              <i className="fa-solid fa-chevron-left text-lg md:text-xl" />
            </Button>
            <Button
              variant="light"
              isIconOnly
              radius="full"
              aria-label="Next testimonial"
              onPress={next}
              className="absolute -right-3 md:right-2 top-1/2 -translate-y-1/2 z-10 text-accent"
            >
              <i className="fa-solid fa-chevron-right text-lg md:text-xl" />
            </Button>
          </div>

          {/* Dots with HeroUI Buttons */}
          <div className="mt-4 flex items-center justify-center">
            {DUMMY_TESTIMONIALS.map((_, i) => (
              <Button
                key={i}
                isIconOnly
                variant="light"
                size="sm"
                radius="full"
                aria-label={`Go to slide ${i + 1}`}
                onPress={() => setIndex(i)}
                className="min-w-0"
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full ${
                    i === index ? "bg-accent" : "bg-foreground-300"
                  }`}
                />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </PageSection>
  );
};
