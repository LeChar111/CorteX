interface ConfigEntity {
  type: string;
  name: string;
  description: string;
  metadata: Record<string, unknown>;
}

export function extractConfig(content: string, filePath: string, language: string): ConfigEntity[] {
  const entities: ConfigEntity[] = [];
  const lowerPath = filePath.toLowerCase();
  const lowerLang = language.toLowerCase();

  // Dockerfile
  if (lowerPath.includes('dockerfile') || lowerLang === 'dockerfile') {
    const fromMatch = content.match(/^FROM\s+(\S+)/im);
    if (fromMatch) {
      entities.push({
        type: 'container_config',
        name: `docker:${fromMatch[1]}`,
        description: `Base image: ${fromMatch[1]}`,
        metadata: { baseImage: fromMatch[1] },
      });
    }

    const exposeMatches = content.matchAll(/^EXPOSE\s+(\d+)/gim);
    for (const m of exposeMatches) {
      entities.push({
        type: 'port',
        name: `port:${m[1]}`,
        description: `Exposed port ${m[1]}`,
        metadata: { port: Number(m[1]) },
      });
    }

    const envMatches = content.matchAll(/^ENV\s+(\w+)/gim);
    for (const m of envMatches) {
      entities.push({
        type: 'env_config',
        name: `env:${m[1]}`,
        description: `Environment variable ${m[1]}`,
        metadata: {},
      });
    }
  }

  // docker-compose.yml
  if (lowerPath.includes('docker-compose') || lowerPath.includes('compose.y')) {
    const serviceMatches = content.matchAll(/^  (\w[\w-]*):\s*$/gm);
    for (const m of serviceMatches) {
      entities.push({
        type: 'service_topology',
        name: `service:${m[1]}`,
        description: `Docker Compose service: ${m[1]}`,
        metadata: {},
      });
    }
  }

  // CI/CD files
  if (
    lowerPath.includes('bitbucket-pipelines') ||
    lowerPath.includes('.gitlab-ci') ||
    lowerPath.includes('.github/workflows')
  ) {
    const stageMatches = content.matchAll(/^\s{2}(\w[\w-]*):\s*$/gm);
    for (const m of stageMatches) {
      entities.push({
        type: 'pipeline',
        name: `stage:${m[1]}`,
        description: `CI/CD stage: ${m[1]}`,
        metadata: {},
      });
    }
  }

  // .env files (extract variable names only, never values)
  if (lowerPath.endsWith('.env') || lowerPath.endsWith('.env.example')) {
    const varMatches = content.matchAll(/^([A-Z_][A-Z0-9_]*)=/gm);
    for (const m of varMatches) {
      entities.push({
        type: 'env_config',
        name: `env:${m[1]}`,
        description: `Environment variable ${m[1]}`,
        metadata: {},
      });
    }
  }

  return entities;
}
