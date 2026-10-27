import { motion } from "motion/react";
import { Fade } from "@animate-ui/react/primitives/effects/fade";
import { Collapsible } from "@animate-ui/react/primitives/base-ui/collapsible";
import { useAppMotion } from "../../lib/motionContext";

export function MotionSwap({ children, className, as = "div", ...props }) {
  const { shouldReduce } = useAppMotion();
  const Component =
    {
      section: motion.section,
      article: motion.article,
      aside: motion.aside,
      main: motion.main,
    }[as] || motion.div;
  return (
    <Component
      className={className}
      initial={shouldReduce ? false : { opacity: 0.65, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduce ? 0 : 0.18,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Reveal({ children }) {
  return (
    <Fade
      asChild
      inView
      inViewOnce
      initialOpacity={0.65}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Fade>
  );
}

export function MotionDisclosure({ open, id, children }) {
  return (
    <Collapsible.Root open={open} className="motion-disclosure">
      <Collapsible.Panel
        id={id}
        transition={{ duration: 0 }}
        exitTransition={{ duration: 0 }}
      >
        <MotionSwap>{children}</MotionSwap>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
