#!/bin/bash
set -e

OLLAMA_HOST=${OLLAMA_HOST:-http://localhost:11434}
OLLAMA_LLM_MODEL=${OLLAMA_LLM_MODEL:-qwen2.5:7b}
OLLAMA_CHAT_MODEL=${OLLAMA_CHAT_MODEL:-qwen3.5:9b}
OLLAMA_EMBEDDING_MODEL=${OLLAMA_EMBEDDING_MODEL:-nomic-embed-text}

echo "Waiting for Ollama to be ready..."
until curl -sf "$OLLAMA_HOST/api/tags" > /dev/null 2>&1; do
  sleep 2
done

echo "Pulling embedding model: $OLLAMA_EMBEDDING_MODEL"
curl -sf "$OLLAMA_HOST/api/pull" -d "{\"name\": \"$OLLAMA_EMBEDDING_MODEL\"}" | tail -1

echo "Pulling LLM model (LightRAG): $OLLAMA_LLM_MODEL"
curl -sf "$OLLAMA_HOST/api/pull" -d "{\"name\": \"$OLLAMA_LLM_MODEL\"}" | tail -1

echo "Pulling chat model: $OLLAMA_CHAT_MODEL"
curl -sf "$OLLAMA_HOST/api/pull" -d "{\"name\": \"$OLLAMA_CHAT_MODEL\"}" | tail -1

echo "All models ready."
