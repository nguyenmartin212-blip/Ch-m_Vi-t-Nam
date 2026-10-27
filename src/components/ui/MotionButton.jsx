import { Button } from "@animate-ui/react/primitives/buttons/button";

const pressTransition = {
  type: "tween",
  duration: 0.16,
  ease: [0.16, 1, 0.3, 1],
};

export default function MotionButton({ className = "", ...props }) {
  return (
    <Button
      type="button"
      className={className}
      hoverScale={1}
      tapScale={0.97}
      transition={pressTransition}
      {...props}
    />
  );
}
