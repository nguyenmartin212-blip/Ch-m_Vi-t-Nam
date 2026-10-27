import { useContext, useEffect, useState } from "react";
import { Dialog } from "@animate-ui/react/primitives/base-ui/dialog";
import { AlertDialog } from "@animate-ui/react/primitives/base-ui/alert-dialog";
import { DialogLayerContext, useAppMotion } from "../../lib/motionContext";

const enter = { duration: 0.22, ease: [0.16, 1, 0.3, 1] };
const exit = { duration: 0.16, ease: [0.16, 1, 0.3, 1] };

export default function AnimatedDialog({
  title,
  onClose,
  onClosing,
  children,
  variant = "sheet",
  className = "",
  style,
  alert = false,
}) {
  const [open, setOpen] = useState(true);
  const [returnFocus] = useState(() => document.activeElement);
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 800px)").matches,
  );
  const { shouldReduce } = useAppMotion();
  const depth = useContext(DialogLayerContext);
  const Primitive = alert ? AlertDialog : Dialog;
  useEffect(() => {
    const query = window.matchMedia("(max-width: 800px)");
    const update = (event) => setMobile(event.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(
      onClose,
      shouldReduce ? 0 : exit.duration * 1000 + 40,
    );
    return () => window.clearTimeout(timer);
  }, [open, onClose, shouldReduce]);
  const close = () => {
    onClosing?.();
    setOpen(false);
  };
  return (
    <DialogLayerContext.Provider value={depth + 1}>
      <Primitive.Root
        open={open}
        onOpenChange={(next) => {
          if (next) setOpen(true);
          else close();
        }}
      >
        <Primitive.Portal>
          <Primitive.Backdrop
            className="cv-sheet-backdrop"
            style={{ zIndex: 3100 + depth * 10 }}
            transition={enter}
            exitTransition={exit}
          />
          <Primitive.Viewport
            className={`cv-sheet-viewport cv-dialog-viewport cv-${variant}-viewport`}
            style={{ zIndex: 3101 + depth * 10 }}
          >
            <Primitive.Popup
              className={className}
              style={style}
              data-side={variant === "sheet" && mobile ? "bottom" : undefined}
              from="bottom"
              transition={enter}
              exitTransition={exit}
              finalFocus={() =>
                returnFocus instanceof HTMLElement ? returnFocus : false
              }
            >
              <Primitive.Title className="cv-sr">{title}</Primitive.Title>
              {typeof children === "function" ? children({ close }) : children}
            </Primitive.Popup>
          </Primitive.Viewport>
        </Primitive.Portal>
      </Primitive.Root>
    </DialogLayerContext.Provider>
  );
}
