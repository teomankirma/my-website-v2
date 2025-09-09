import { useState } from "react";
import { Card, Avatar } from "@heroui/react";
import { PageSection } from "./common/PageSection";

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
  const [index, setIndex] = useState(0);
  const total = DUMMY_TESTIMONIALS.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <PageSection menuIndex={4} header={"Client Speak"}>
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
                    className="p-6 md:p-8 rounded-2xl bg-content1 min-h-[220px] md:min-h-[260px]"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        className="h-16 w-16"
                        isBordered
                        // Using placeholder avatar, no real images
                        showFallback
                      />
                      <div>
                        <p className="text-lg font-semibold">{t.name}</p>
                        <p className="text-foreground-500 text-sm">{t.title}</p>
                      </div>
                    </div>

                    <p className="mt-8 text-base leading-relaxed">{t.quote}</p>

                    <div
                      className="mt-6 text-yellow-400"
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
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-accent/80 hover:text-accent focus:outline-none z-10"
              aria-label="Previous testimonial"
            >
              <i className="fa-solid fa-chevron-left text-2xl" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-accent/80 hover:text-accent focus:outline-none z-10"
              aria-label="Next testimonial"
            >
              <i className="fa-solid fa-chevron-right text-2xl" />
            </button>
          </div>

          {/* Default dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {DUMMY_TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === index ? "bg-accent" : "bg-foreground-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </PageSection>
  );
};
