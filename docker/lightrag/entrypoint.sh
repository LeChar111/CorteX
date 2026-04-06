#!/bin/bash
set -e

echo "Starting LightRAG API server..."

# Binding type
export LLM_BINDING="${LLM_BINDING:-ollama}"
export EMBEDDING_BINDING="${EMBEDDING_BINDING:-ollama}"

# LightRAG reads these env vars for Ollama connectivity
export LLM_BINDING_HOST="${OLLAMA_HOST:-http://ollama:11434}"
export LLM_MODEL="${LLM_MODEL:-qwen2.5:7b}"
export EMBEDDING_BINDING_HOST="${OLLAMA_HOST:-http://ollama:11434}"
export EMBEDDING_MODEL="${EMBEDDING_MODEL:-nomic-embed-text}"

echo "LLM host: $LLM_BINDING_HOST | model: $LLM_MODEL"
echo "Embedding host: $EMBEDDING_BINDING_HOST | model: $EMBEDDING_MODEL"

# Performance tuning — env vars picked up by LightRAG core
export MAX_PARALLEL_INSERT="${MAX_PARALLEL_INSERT:-8}"
export MAX_ASYNC="${MAX_ASYNC:-16}"
export EMBEDDING_FUNC_MAX_ASYNC="${EMBEDDING_FUNC_MAX_ASYNC:-16}"
export EMBEDDING_BATCH_NUM="${EMBEDDING_BATCH_NUM:-32}"

# Force Ollama to use GPU
export OLLAMA_NUM_GPU="${OLLAMA_NUM_GPU:-99}"

echo "Perf: parallel_insert=$MAX_PARALLEL_INSERT async=$MAX_ASYNC emb_async=$EMBEDDING_FUNC_MAX_ASYNC emb_batch=$EMBEDDING_BATCH_NUM"

exec lightrag-server \
  --host 0.0.0.0 \
  --port 9621 \
  --working-dir /data/lightrag \
  --llm-binding "$LLM_BINDING" \
  --embedding-binding "$EMBEDDING_BINDING" \
  --max-async "${MAX_ASYNC}" \
  --log-level INFO
