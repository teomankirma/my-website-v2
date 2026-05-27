import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

if (typeof window !== "undefined") {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const applyReducedMotion = (reduced: boolean) => {
    gsap.defaults({ duration: reduced ? 0 : 0.6 });
    if (reduced) {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }
  };
  applyReducedMotion(mq.matches);
  mq.addEventListener("change", (e) => applyReducedMotion(e.matches));
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
