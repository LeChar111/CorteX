import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeGitUrl, detectProject } from '../detector.js';

// Mock simple-git
vi.mock('simple-git', () => ({
  default: vi.fn(),
}));

import simpleGit from 'simple-git';

describe('normalizeGitUrl', () => {
  it('normalizes SSH git URLs', () => {
    expect(normalizeGitUrl('git@github.com:user/repo.git')).toBe('github.com/user/repo');
  });

  it('normalizes HTTPS URLs with .git suffix', () => {
    expect(normalizeGitUrl('https://github.com/user/repo.git')).toBe('github.com/user/repo');
  });

  it('normalizes HTTPS URLs without .git suffix', () => {
    expect(normalizeGitUrl('https://github.com/user/repo')).toBe('github.com/user/repo');
  });

  it('normalizes HTTP URLs', () => {
    expect(normalizeGitUrl('http://gitlab.example.com/org/project.git')).toBe(
      'gitlab.example.com/org/project',
    );
  });

  it('handles already-normalized URLs', () => {
    expect(normalizeGitUrl('github.com/user/repo')).toBe('github.com/user/repo');
  });

  it('normalizes SSH URLs without .git suffix', () => {
    expect(normalizeGitUrl('git@github.com:org/my-service')).toBe('github.com/org/my-service');
  });
});

describe('detectProject', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
    vi.mocked(simpleGit).mockReset();
  });

  it('returns null when there is no git remote origin', async () => {
    vi.mocked(simpleGit).mockReturnValue({
      getRemotes: vi.fn().mockResolvedValue([]),
    } as unknown as ReturnType<typeof simpleGit>);

    const result = await detectProject('/some/cwd', 'http://localhost:3100', 'key');

    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns null when origin has no fetch ref', async () => {
    vi.mocked(simpleGit).mockReturnValue({
      getRemotes: vi.fn().mockResolvedValue([
        { name: 'origin', refs: {} },
      ]),
    } as unknown as ReturnType<typeof simpleGit>);

    const result = await detectProject('/some/cwd', 'http://localhost:3100', 'key');

    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns null when the API projects call fails', async () => {
    vi.mocked(simpleGit).mockReturnValue({
      getRemotes: vi.fn().mockResolvedValue([
        { name: 'origin', refs: { fetch: 'git@github.com:org/repo.git' } },
      ]),
    } as unknown as ReturnType<typeof simpleGit>);

    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const result = await detectProject('/some/cwd', 'http://localhost:3100', 'key');

    expect(result).toBeNull();
  });

  it('matches repo by cloneUrl', async () => {
    vi.mocked(simpleGit).mockReturnValue({
      getRemotes: vi.fn().mockResolvedValue([
        { name: 'origin', refs: { fetch: 'git@github.com:org/my-repo.git' } },
      ]),
    } as unknown as ReturnType<typeof simpleGit>);

    // GET /api/projects
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 'proj-1', name: 'My Project' }]),
    });
    // GET /api/repos?projectId=proj-1
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 'repo-1',
            name: 'my-repo',
            slug: 'my-repo',
            cloneUrl: 'https://github.com/org/my-repo.git',
          },
        ]),
    });

    const result = await detectProject('/path/to/my-repo', 'http://localhost:3100', 'key');

    expect(result).toEqual({
      projectId: 'proj-1',
      repoId: 'repo-1',
      projectName: 'My Project',
      repoName: 'my-repo',
    });
  });

  it('falls back to directory name matching when cloneUrl does not match', async () => {
    vi.mocked(simpleGit).mockReturnValue({
      getRemotes: vi.fn().mockResolvedValue([
        { name: 'origin', refs: { fetch: 'git@github.com:org/no-match.git' } },
      ]),
    } as unknown as ReturnType<typeof simpleGit>);

    const projects = [{ id: 'proj-1', name: 'My Project' }];
    const repos = [{ id: 'repo-1', name: 'my-repo', slug: 'my-repo', cloneUrl: 'https://github.com/other/repo.git' }];

    // First pass: projects + repos (cloneUrl doesn't match)
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(projects) });
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(repos) });
    // Second pass (fallback): repos again
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(repos) });

    const result = await detectProject('/workspace/my-repo', 'http://localhost:3100', 'key');

    expect(result).toEqual({
      projectId: 'proj-1',
      repoId: 'repo-1',
      projectName: 'My Project',
      repoName: 'my-repo',
    });
  });

  it('returns null when simpleGit throws', async () => {
    vi.mocked(simpleGit).mockReturnValue({
      getRemotes: vi.fn().mockRejectedValue(new Error('not a git repo')),
    } as unknown as ReturnType<typeof simpleGit>);

    const result = await detectProject('/not/a/repo', 'http://localhost:3100', 'key');

    expect(result).toBeNull();
  });
});
