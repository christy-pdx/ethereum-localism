import { execSync } from "child_process";
import path from "path";

/** Derive owner/repo from git remote.origin.url, e.g. christy-pdx/ethereum-localism */
function getRepoFromGit(): string | null {
  try {
    const url = execSync("git config --get remote.origin.url", { encoding: "utf-8" }).trim();
    // https://github.com/owner/repo.git or git@github.com:owner/repo.git
    const match = url.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (match) return `${match[1]}/${match[2]}`;
  } catch {
    // git not available or no remote
  }
  return null;
}

export const GITHUB_REPO =
  process.env.GITHUB_REPO ?? getRepoFromGit() ?? "ethereumlocalism/ethereum-localism";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

/**
 * Build the GitHub "Edit" URL for a file. Clicking it opens the file in edit mode;
 * GitHub prompts non-collaborators to fork and create a PR when they save.
 */
export function getEditOnGitHubUrl(filePath: string): string {
  const repoPath = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
  return `https://github.com/${GITHUB_REPO}/edit/${GITHUB_BRANCH}/${encodeURI(repoPath)}`;
}

/** URL to create a new file in a given path (used for "New Note" flow). */
export function getNewFileOnGitHubUrl(filename: string): string {
  return `https://github.com/${GITHUB_REPO}/new/${GITHUB_BRANCH}?filename=${encodeURIComponent(filename)}`;
}
