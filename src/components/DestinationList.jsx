import MotionButton from "./ui/MotionButton";
export default function DestinationList({
  destinations,
  selectedId,
  onSelect,
}) {
  return (
    <div>
      {destinations.map((d) => (
        <MotionButton
          key={d.id}
          className={`dest ${d.id === selectedId ? "dest--active" : ""}`}
          onClick={() => onSelect(d.id)}
        >
          <span className="dest__badge">{d.name.charAt(0)}</span>
          <span>
            <strong>{d.name}</strong>
            <br />
            <small>{d.region}</small>
          </span>
        </MotionButton>
      ))}
    </div>
  );
}
