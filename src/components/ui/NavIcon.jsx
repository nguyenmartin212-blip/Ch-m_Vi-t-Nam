const paths = {
  explore: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m16 8-2.5 5.5L8 16l2.5-5.5Z" />
    </>
  ),
  map: (
    <>
      <path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Z" />
      <path d="M9 3v16M15 5v16" />
    </>
  ),
  graph: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="4" cy="5" r="2" />
      <circle cx="20" cy="5" r="2" />
      <circle cx="12" cy="21" r="2" />
      <path d="m6 7 4 3m4 0 4-3m-6 8v4" />
    </>
  ),
  saved: <path d="M19 21 12 17 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />,
  suggest: (
    <>
      <path d="M9 17h6M10 21h4M9 17v-2a6 6 0 1 1 6 0v2" />
    </>
  ),
  tools: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 3v4m8-4v4M4 11h16m-12 4h3m2 0h3m-8 3h3" />
    </>
  ),
};
export default function NavIcon({ name }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.explore}
    </svg>
  );
}
