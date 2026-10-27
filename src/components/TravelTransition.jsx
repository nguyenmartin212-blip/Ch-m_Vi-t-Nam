import MotionButton from "./ui/MotionButton";
import { useEffect } from "react";
import { motion } from "motion/react";
import { useAppMotion } from "../lib/motionContext";

export default function TravelTransition({
  onComplete,
  countryName = "Việt Nam",
}) {
  const { shouldReduce } = useAppMotion();
  useEffect(() => {
    const t = setTimeout(onComplete, shouldReduce ? 150 : 2700);
    return () => clearTimeout(t);
  }, [onComplete, shouldReduce]);

  return (
    <div
      className="travel-transition travel-transition--globe motion-flight"
      aria-label={`Đang bay đến ${countryName}`}
    >
      <div className="sky-glow" />
      <motion.div
        className="transition-earth"
        aria-hidden="true"
        initial={shouldReduce ? false : { scale: 0.72, opacity: 0.86 }}
        animate={
          shouldReduce
            ? {}
            : { scale: [0.72, 1.08, 3.4], opacity: [0.86, 1, 0] }
        }
        transition={{
          duration: 2.7,
          times: [0, 0.7, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <span>🌏</span>
        <i />
      </motion.div>
      <div className="flight-path" aria-hidden="true" />
      {[2.2, 2.7, 1.9, 2.45].map((duration, i) => (
        <motion.div
          key={i}
          className={`cloud cloud--${i + 1}`}
          aria-hidden="true"
          initial={false}
          animate={shouldReduce ? {} : { x: "150vw" }}
          transition={{ duration, ease: "linear" }}
        >
          ☁
        </motion.div>
      ))}
      <motion.div
        className="flying-plane"
        aria-hidden="true"
        style={{ left: 0, top: "50%" }}
        initial={
          shouldReduce
            ? false
            : { x: "-15vw", y: "14vh", rotate: 8, scale: 0.72 }
        }
        animate={
          shouldReduce
            ? {}
            : {
                x: ["-15vw", "48vw", "83vw"],
                y: ["14vh", "-12vh", "-7vh"],
                rotate: [8, -8, -18],
                scale: [0.72, 1, 0.32],
                opacity: [1, 1, 0.2],
              }
        }
        transition={{
          duration: 2.55,
          times: [0, 0.5, 1],
          ease: [0.25, 0.06, 0.35, 0.98],
        }}
      >
        ✈
      </motion.div>
      <div className="travel-transition__text">
        <b>Đang bay đến {countryName}</b>
        <span>Chuẩn bị khám phá bản đồ tri thức...</span>
        <MotionButton className="btn" onClick={onComplete}>
          Vào khám phá →
        </MotionButton>
      </div>
    </div>
  );
}
