import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/** GitHub repository URL — update to your repository. */
export const GITHUB_URL = "https://github.com/byigitt/spearkit";

/** Shared navbar/footer options for every layout. */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <SpearMark />
          <span className="font-semibold">spearkit</span>
        </>
      ),
    },
    githubUrl: GITHUB_URL,
  };
}

function SpearMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ color: "var(--color-fd-primary)" }}
    >
      <path d="M4 20 L20 4" />
      <path d="M14 4 L20 4 L20 10" />
      <path d="M9 15 l-3 3" />
    </svg>
  );
}
