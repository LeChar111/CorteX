import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

dotenv.config({ path: resolve(import.meta.dirname, '../.env') });

import {
  getDb,
  getPool,
  closePool,
  createProject,
  createRepo,
} from '../packages/db/src/index.js';

interface RepoConfig {
  name: string;
  slug: string;
  provider: string;
  cloneUrl: string;
  techStack?: string[];
  defaultBranch: string;
  trackedBranches?: string[];
}

interface ProjectConfig {
  name: string;
  description?: string;
  repos: RepoConfig[];
}

interface ProjectsFile {
  projects: ProjectConfig[];
}

async function seed() {
  const db = getDb();
  const pool = getPool();

  // Load projects from config
  const configPath = resolve(import.meta.dirname, '../config/projects.json');
  const config: ProjectsFile = JSON.parse(readFileSync(configPath, 'utf-8'));

  // Check if data exists and skip truncate unless --force is passed
  const { rows } = await pool.query('SELECT count(*)::int as c FROM projects');
  const existingCount = rows[0].c;
  if (existingCount > 0 && !process.argv.includes('--force')) {
    console.log(`${existingCount} project(s) already exist. Use --force to re-seed.`);
    await closePool();
    return;
  }

  console.log('Cleaning existing data...');
  await pool.query('TRUNCATE projects CASCADE');
  await pool.query('TRUNCATE events');
  await pool.query('TRUNCATE scan_jobs');

  console.log(`Seeding ${config.projects.length} projects from config/projects.json...`);

  let totalRepos = 0;

  for (const projectConfig of config.projects) {
    const project = await createProject(db, {
      name: projectConfig.name,
      description: projectConfig.description,
    });
    console.log(`  Project: ${project.name} (${project.id})`);

    for (const repoConfig of projectConfig.repos) {
      await createRepo(db, {
        projectId: project.id,
        name: repoConfig.name,
        slug: repoConfig.slug,
        cloneUrl: repoConfig.cloneUrl,
        provider: repoConfig.provider,
        techStack: repoConfig.techStack ?? [],
        defaultBranch: repoConfig.defaultBranch,
        trackedBranches: repoConfig.trackedBranches ?? null,
        metadata: null,
      });
      console.log(`    Repo: ${repoConfig.name} (${repoConfig.slug})`);
      totalRepos++;
    }
  }

  console.log(`\nSeed complete: ${config.projects.length} projects, ${totalRepos} repos`);
  await closePool();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
