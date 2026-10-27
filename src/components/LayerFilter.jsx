import MotionButton from "./ui/MotionButton";
export default function LayerFilter({
  layers,
  active,
  onChange,
  counts,
  total,
}) {
  return (
    <div className="chips">
      <MotionButton
        className={`chip ${active === "all" ? "chip--active" : ""}`}
        onClick={() => onChange("all")}
      >
        Tất cả <span>{total}</span>
      </MotionButton>
      {layers.map((l) => (
        <MotionButton
          key={l.id}
          className={`chip ${active === l.id ? "chip--active" : ""}`}
          onClick={() => onChange(l.id)}
        >
          {l.name} <span>{counts[l.id] || 0}</span>
        </MotionButton>
      ))}
    </div>
  );
}
