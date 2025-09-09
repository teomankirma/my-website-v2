// import { useAppStore } from "@/hooks/useAppStore";
import { PageSection } from "./common/PageSection";
// import { translations } from "@/i18n";
// TODO: Use react-slick for testimonials

export const Testimonial = () => {
  // const { language } = useAppStore();
  // const { testimonial, testimonialTitle } = translations[language];
  return (
    <PageSection menuIndex={4} header={"Testimonial"}>
      <div className="container mx-auto px-6 md:px-10">
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12"></div>
      </div>
    </PageSection>
  );
};
