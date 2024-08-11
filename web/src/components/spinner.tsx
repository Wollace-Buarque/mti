interface SpinnerProps {
  size?: number;
  color?: string;
}

const BARS = Array(12).fill(0);

export function Spinner({ size = 32, color = "hsl(0, 0%, 43.5%)" }: SpinnerProps) {
  return (
    <div style={{ width: size, height: size }}>
      <div
        className="relative top-1/2 left-1/2"
        style={{ width: size, height: size }}
      >
        {BARS.map((_, index) => (
          <div
            className="sonner-loading-bar"
            key={`spinner-bar-${index}`}
            style={{ backgroundColor: color}}
          />
        ))}
      </div>
    </div>
  );
}
