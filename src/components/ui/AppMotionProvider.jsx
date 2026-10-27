import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { AnimateUIProvider } from "@animate-ui/react/provider";
import useLocal from "../../hooks/useLocal";
import { MotionPreferenceContext } from "../../lib/motionContext";
import "./motion.css";

export default function AppMotionProvider({ children }) {
  const [reduced, setReduced] = useLocal("cham-viet.reduce-motion", false);
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduced);
  }, [reduced]);
  return (
    <MotionPreferenceContext.Provider value={{ reduced, setReduced }}>
      <MotionConfig
        reducedMotion={reduced ? "always" : "user"}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimateUIProvider
          reducedMotion={reduced ? "always" : undefined}
          tempo={0.8}
        >
          {children}
        </AnimateUIProvider>
      </MotionConfig>
    </MotionPreferenceContext.Provider>
  );
}
