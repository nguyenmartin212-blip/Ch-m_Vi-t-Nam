import AnimatedDialog from "./AnimatedDialog";
import MotionButton from "./MotionButton";
export default function AnimatedSheet({ title, onClose, children }) {
  return (
    <AnimatedDialog
      title={title}
      onClose={onClose}
      className="cv-sheet cv-animated-sheet"
    >
      {({ close }) => (
        <div className="cv-sheet-inner">
          <header>
            <h2 className="cv-sheet-title">CHẠM VIỆT / {title}</h2>
            <MotionButton aria-label="Đóng chi tiết" onClick={close}>
              ×
            </MotionButton>
          </header>
          {children}
        </div>
      )}
    </AnimatedDialog>
  );
}
