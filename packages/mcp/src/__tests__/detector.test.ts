import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeGitUrl, detectProject } from '../detector.js';

// Mock simple-git
vi.mock('simple-git', () => ({
  simpleGit: vi.fn(),
}));

import { simpleGit } from 'simple-git';

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
  const mockedSimpleGit = vi.mocked(simpleGit);

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
    mockedSimpleGit.mockReset();
  });

  it('returns null when there is no git remote origin', async () => {
    mockedSimpleGit.mockReturnValue({
      getRemotes: vi.fn().mockResolvedValue([]),
      branch: vi.fn().mockResolvedValue({ current: 'main' }),
    } as unknown as ReturnType<typeof simpleGit>);

    const result = await detectProject('/some/cwd', 'http://localhost:3100', 'key');

    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns null when origin has no fetch ref', async () => {
    mockedSimpleGit.mockReturnValue({
      getRemotes: vi.fn().mockResolvedValue([
        { name: 'origin', refs: {} },
      ]),
      branch: vi.fn().mockResolvedValue({ current: 'main' }),
    } as unknown as ReturnType<typeof simpleGit>);

    const result = await detectProject('/some/cwd', 'http://localhost:3100', 'key');

    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns null when the API projects call fails', async () => {
    mockedSimpleGit.mockReturnValue({
      getRemotes: vi.fn().mockResolvedValue([
        { name: 'origin', refs: { fetch: 'git@github.com:org/repo.git' } },
      ]),
      branch: vi.fn().mockResolvedValue({ current: 'main' }),
    } as unknown as ReturnType<typeof simpleGit>);

    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const result = await detectProject('/some/cwd', 'http://localhost:3100', 'key');

    expect(result).toBeNull();
  });

  it('matches repo by cloneUrl', async () => {
    mockedSimpleGit.mockReturnValue({
      getRemotes: vi.fn().mockResolvedValue([
        { name: 'origin', refs: { fetch: 'git@github.com:org/my-repo.git' } },
      ]),
      branch: vi.fn().mockResolvedValue({ current: 'main' }),
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
      repoBranch: 'main',
    });
  });

  it('falls back to directory name matching when cloneUrl does not match', async () => {
    mockedSimpleGit.mockReturnValue({
      getRemotes: vi.fn().mockResolvedValue([
        { name: 'origin', refs: { fetch: 'git@github.com:org/no-match.git' } },
      ]),
      branch: vi.fn().mockResolvedValue({ current: 'develop' }),
    } as unknown as ReturnType<typeof simpleGit>);

    const projects = [{ id: 'proj-1', name: 'My Project' }];
    const repos = [{ id: 'repo-1', name: 'my-repo', slug: 'my-repo', cloneUrl: 'https://github.com/other/repo.git' }];

    // First pass: projects + repos (cloneUrl doesn't match)
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(projects) });
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(repos) });

    const result = await detectProject('/workspace/my-repo', 'http://localhost:3100', 'key');

    expect(result).toEqual({
      projectId: 'proj-1',
      repoId: 'repo-1',
      projectName: 'My Project',
      repoName: 'my-repo',
      repoBranch: 'develop',
    });
  });

  it('returns null when simpleGit throws', async () => {
    mockedSimpleGit.mockReturnValue({
      getRemotes: vi.fn().mockRejectedValue(new Error('not a git repo')),
      branch: vi.fn().mockRejectedValue(new Error('not a git repo')),
    } as unknown as ReturnType<typeof simpleGit>);

    const result = await detectProject('/not/a/repo', 'http://localhost:3100', 'key');

    expect(result).toBeNull();
  });
});
