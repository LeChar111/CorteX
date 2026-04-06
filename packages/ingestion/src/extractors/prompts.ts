export const ENTITY_EXTRACTION_PROMPT = `You are a code analysis assistant. Analyze the following source code and extract entities and relationships for a knowledge graph.

Project: {project_name}
Repository: {repo_name}
File: {file_path}
Language: {language}
Tech Stack: {tech_stack}

Existing entities (for context):
{existing_entities}

Source code to analyze:
\`\`\`{language}
{code_chunk}
\`\`\`

Extract all significant code entities and their relationships. Return a JSON object with this exact structure:
{
  "entities": [
    {
      "type": "function|class|interface|type|variable|constant|module|service|endpoint|model",
      "name": "entity name",
      "qualified_name": "fully qualified name (e.g. filePath::name)",
      "description": "brief description of what this entity does",
      "metadata": {}
    }
  ],
  "relations": [
    {
      "source": "qualified name of source entity",
      "target": "qualified name of target entity",
      "type": "calls|imports|extends|implements|uses|defines|returns|accepts",
      "description": "brief description of the relationship",
      "confidence": 0.9
    }
  ]
}

Return only valid JSON. No markdown, no explanation outside the JSON.`;

export interface BuildExtractionPromptParams {
  project_name: string;
  repo_name: string;
  file_path: string;
  language: string;
  tech_stack: string;
  code_chunk: string;
  existing_entities: string;
}

export function buildExtractionPrompt(params: BuildExtractionPromptParams): string {
  return ENTITY_EXTRACTION_PROMPT
    .replace(/{project_name}/g, params.project_name)
    .replace(/{repo_name}/g, params.repo_name)
    .replace(/{file_path}/g, params.file_path)
    .replace(/{language}/g, params.language)
    .replace(/{tech_stack}/g, params.tech_stack)
    .replace(/{code_chunk}/g, params.code_chunk)
    .replace(/{existing_entities}/g, params.existing_entities);
}
