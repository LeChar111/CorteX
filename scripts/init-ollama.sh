#!/usr/bin/env bash
set -e

#################################################################
# init-ollama.sh — Pull required models (works on any OS)
#
# Detects whether Ollama runs natively or in Docker and adapts.
# On macOS: expects native Ollama (brew install ollama)
# On Linux:  tries Docker container first, falls back to native
#################################################################

OLLAMA_LLM_MODEL=${OLLAMA_LLM_MODEL:-qwen2.5:7b}
OLLAMA_CHAT_MODEL=${OLLAMA_CHAT_MODEL:-qwen3.5:9b}
OLLAMA_EMBEDDING_MODEL=${OLLAMA_EMBEDDING_MODEL:-nomic-embed-text}

# Detect OS
OS="$(uname -s)"
ARCH="$(uname -m)"
echo "Platform: $OS / $ARCH"

# Determine how to talk to Ollama
if [ "$OS" = "Darwin" ]; then
  # macOS — Ollama should run natively for Metal GPU access
  OLLAMA_HOST=${OLLAMA_HOST:-http://localhost:11434}

  if ! command -v ollama &>/dev/null; then
    echo "Ollama not found. Installing via Homebrew..."
    if command -v brew &>/dev/null; then
      brew install ollama
    else
      echo "ERROR: Homebrew not found. Install Ollama manually: https://ollama.com/download"
      exit 1
    fi
  fi

  # Check if Ollama is running
  if ! curl -sf "$OLLAMA_HOST/api/tags" > /dev/null 2>&1; then
    echo "Starting Ollama in background..."
    ollama serve &>/dev/null &
    sleep 3
  fi

  echo "Using native Ollama (Metal GPU) at $OLLAMA_HOST"
else
  # Linux — prefer Docker container, fall back to native
  OLLAMA_HOST=${OLLAMA_HOST:-http://localhost:11434}

  if docker ps --format '{{.Names}}' 2>/dev/null | grep -q 'ollama'; then
    OLLAMA_CONTAINER=$(docker ps --format '{{.Names}}' | grep 'ollama' | head -1)
    echo "Using Docker Ollama container: $OLLAMA_CONTAINER"
    USE_DOCKER=true
  elif curl -sf "$OLLAMA_HOST/api/tags" > /dev/null 2>&1; then
    echo "Using native Ollama at $OLLAMA_HOST"
  else
    echo "ERROR: Ollama is not running. Start it with:"
    echo "  Docker:  docker compose --profile linux up -d  (CPU)"
    echo "           docker compose --profile nvidia up -d (NVIDIA GPU)"
    echo "  Native:  ollama serve"
    exit 1
  fi
fi

# Wait for Ollama to be ready
echo "Waiting for Ollama to be ready..."
until curl -sf "$OLLAMA_HOST/api/tags" > /dev/null 2>&1; do
  sleep 2
done
echo "Ollama is ready."

# Pull models
pull_model() {
  local model=$1
  local label=$2
  echo ""
  echo "Pulling $label: $model"
  if [ "$USE_DOCKER" = true ]; then
    docker exec "$OLLAMA_CONTAINER" ollama pull "$model"
  else
    ollama pull "$model"
  fi
}

pull_model "$OLLAMA_EMBEDDING_MODEL" "embedding model"
pull_model "$OLLAMA_LLM_MODEL" "LLM model"
pull_model "$OLLAMA_CHAT_MODEL" "chat model"

echo ""
echo "All models ready."

# Show GPU info
echo ""
if [ "$OS" = "Darwin" ]; then
  echo "GPU: Apple Silicon (Metal) — hardware acceleration enabled natively"
elif [ "$USE_DOCKER" = true ]; then
  echo "GPU status:"
  docker exec "$OLLAMA_CONTAINER" ollama ps 2>/dev/null || echo "  (no models loaded yet)"
else
  echo "GPU status:"
  ollama ps 2>/dev/null || echo "  (no models loaded yet)"
fi
