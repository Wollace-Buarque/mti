export default function Loading(props: {
  index?: boolean;
  login?: boolean;
  about?: boolean;
  account?: boolean;
}) {
  return (
    <>
      <div className="loader">
        <svg
          className="absolute inset-0 h-full w-full origin-center animate-spin-slow"
          viewBox="25 25 50 50"
        >
          <circle
            className="path stroke-button-base"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
    </>
  );
}
