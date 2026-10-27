import { createContext, useContext } from "react";
import { useReducedMotion } from "motion/react";

export const MotionPreferenceContext = createContext({
  reduced: false,
  setReduced: () => {},
});
export const DialogLayerContext = createContext(0);

export function useAppMotion() {
  const preference = useContext(MotionPreferenceContext);
  const systemReduced = useReducedMotion();
  return {
    ...preference,
    shouldReduce: preference.reduced || Boolean(systemReduced),
  };
}
