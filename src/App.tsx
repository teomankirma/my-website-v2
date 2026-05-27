import { ThemeSwitcher, LanguageSwitcher } from "@/components/common";
import { usePageMeta } from "@/hooks/usePageMeta";

export const App = () => {
  usePageMeta();
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-6 md:px-10">
          <span className="font-mono text-sm">
            <span className="text-primary">●</span> Teoman Kirma
          </span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 md:px-10 py-32 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Migrating…
        </h1>
        <p className="mt-4 text-muted-foreground">
          The site is being rebuilt with shadcn/ui and GSAP.
        </p>
      </main>
    </>
  );
};

export default App;
