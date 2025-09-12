import {
  Header,
  Home,
  KnowMeMore,
  Resume,
  Portfolio,
  Testimonial,
  ContactMe,
  Footer,
} from "@/components";
import { usePageMeta } from "@/hooks/usePageMeta";

export const App = () => {
  // Localize <title> and <html lang>
  usePageMeta();
  return (
    <>
      <Header />
      <Home />
      <KnowMeMore />
      <Resume />
      <Portfolio />
      <Testimonial />
      <ContactMe />
      <Footer />
    </>
  );
};

export default App;
