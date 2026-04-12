#!/usr/bin/env bash
set -euo pipefail

###############################################################################
#  CorteX — Universal Setup Script
#
#  Supported platforms:
#    - macOS Apple Silicon (M1–M4) — Ollama native, Metal GPU
#    - macOS Intel — Ollama native, CPU
#    - Linux x86_64 NVIDIA GPU — auto-installs drivers + container toolkit
#    - Linux x86_64 AMD GPU — detects ROCm
#    - Linux x86_64 / aarch64 CPU-only
#    - Windows WSL2 — full support with Docker Desktop integration
#
#  Usage:
#    ./setup.sh                # Interactive (recommended)
#    ./setup.sh --yes          # Skip confirmations
#    ./setup.sh --skip-models  # Skip Ollama model downloads
#    ./setup.sh --dev          # Start dev servers after setup
###############################################################################

# ─── Colors & helpers ────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

LOG_FILE="$SCRIPT_DIR/.setup.log"
: > "$LOG_FILE"

step=0
total_steps=9

info()    { echo -e "${BLUE}ℹ${NC}  $*"; }
success() { echo -e "${GREEN}✔${NC}  $*"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $*"; }
fail()    { echo -e "${RED}✘${NC}  $*" >&2; }
header()  { step=$((step + 1)); echo -e "\n${BOLD}${CYAN}[$step/$total_steps]${NC} ${BOLD}$*${NC}"; }

log() { echo "[$(date '+%H:%M:%S')] $*" >> "$LOG_FILE"; }

# Silent run — output to log only
run() {
  log "RUN: $*"
  if ! "$@" >> "$LOG_FILE" 2>&1; then
    fail "Command failed: $*"
    fail "Check $LOG_FILE for details"
    return 1
  fi
}

# Visible run — shows stdout to user (for progress bars, downloads)
run_visible() {
  log "RUN (visible): $*"
  if ! "$@" 2>> "$LOG_FILE"; then
    fail "Command failed: $*"
    fail "Check $LOG_FILE for details"
    return 1
  fi
}

confirm() {
  if [ "$AUTO_YES" = true ]; then return 0; fi
  echo -en "${YELLOW}?${NC}  $* ${DIM}[Y/n]${NC} "
  read -r reply
  [[ -z "$reply" || "$reply" =~ ^[Yy] ]]
}

# Portable sed in-place (macOS vs Linux)
sed_inplace() {
  if [ "$OS" = "Darwin" ]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

# npm global install with sudo fallback on Linux
npm_global_install() {
  local pkg=$1
  if [ "$OS" = "Linux" ] || [ "$IS_WSL" = true ]; then
    if npm install -g "$pkg" >> "$LOG_FILE" 2>&1; then
      return 0
    else
      log "npm install -g failed without sudo, retrying with sudo"
      sudo npm install -g "$pkg" >> "$LOG_FILE" 2>&1
    fi
  else
    npm install -g "$pkg" >> "$LOG_FILE" 2>&1
  fi
}

# Docker compose command (handles old docker-compose fallback)
COMPOSE_CMD=""
detect_compose_cmd() {
  if docker compose version &>/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
  elif command -v docker-compose &>/dev/null; then
    COMPOSE_CMD="docker-compose"
  else
    COMPOSE_CMD=""
  fi
}

# ─── Parse arguments ─────────────────────────────────────────────────────────

AUTO_YES=false
SKIP_MODELS=false
START_DEV=false

for arg in "$@"; do
  case "$arg" in
    --yes|-y)        AUTO_YES=true ;;
    --skip-models)   SKIP_MODELS=true ;;
    --dev)           START_DEV=true ;;
    --help|-h)
      echo "Usage: ./setup.sh [--yes] [--skip-models] [--dev]"
      echo ""
      echo "  --yes, -y       Skip all confirmations"
      echo "  --skip-models   Skip Ollama model downloads"
      echo "  --dev           Start dev servers after setup"
      echo "  --help, -h      Show this help"
      exit 0
      ;;
    *) fail "Unknown argument: $arg"; exit 1 ;;
  esac
done

# ─── Platform detection ──────────────────────────────────────────────────────

OS="$(uname -s)"
ARCH="$(uname -m)"
HAS_NVIDIA=false
HAS_AMD=false
HAS_SYSTEMD=false
IS_WSL=false
DOCKER_PROFILE=""
PLATFORM=""
GPU_INFO=""

detect_platform() {
  header "Detecting platform"

  # ── Detect WSL ──
  if [ "$OS" = "Linux" ] && grep -qi microsoft /proc/version 2>/dev/null; then
    IS_WSL=true
  fi

  # ── Detect systemd ──
  if [ "$OS" = "Linux" ] && command -v systemctl &>/dev/null && systemctl is-system-running &>/dev/null 2>&1; then
    HAS_SYSTEMD=true
  fi

  # ── Reject native Windows (MSYS/Git Bash/Cygwin) ──
  case "$OS" in
    MINGW*|MSYS*|CYGWIN*)
      fail "Native Windows is not supported."
      fail "Please use WSL2 instead:"
      fail "  1. wsl --install"
      fail "  2. Open Ubuntu from Start menu"
      fail "  3. Clone the repo inside WSL and run ./setup.sh"
      exit 1
      ;;
  esac

  echo -e "  OS:   ${BOLD}$OS${NC}$([ "$IS_WSL" = true ] && echo -e " ${DIM}(WSL2)${NC}")"
  echo -e "  Arch: ${BOLD}$ARCH${NC}"

  if [ "$OS" = "Darwin" ]; then
    # ── macOS ──
    if [ "$ARCH" = "arm64" ]; then
      PLATFORM="macOS Apple Silicon"
      GPU_INFO=$(system_profiler SPDisplaysDataType 2>/dev/null | grep "Chipset Model" | head -1 | sed 's/.*: //' || echo "Apple GPU")
      echo -e "  GPU:  ${BOLD}$GPU_INFO${NC} (Metal)"
    else
      PLATFORM="macOS Intel"
      GPU_INFO="Intel integrated"
      echo -e "  GPU:  ${DIM}Intel integrated (CPU fallback)${NC}"
    fi
    local ram
    ram=$(sysctl -n hw.memsize 2>/dev/null | awk '{printf "%.0f", $1/1073741824}')
    echo -e "  RAM:  ${BOLD}${ram} GB${NC}"

  elif [ "$OS" = "Linux" ]; then
    # ── Linux / WSL2 ──
    local ram
    ram=$(free -g 2>/dev/null | awk '/^Mem:/{print $2}' || echo "?")
    echo -e "  RAM:  ${BOLD}${ram} GB${NC}"

    # Detect NVIDIA GPU
    if command -v nvidia-smi &>/dev/null; then
      GPU_INFO=$(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null | head -1 || echo "")
      if [ -n "$GPU_INFO" ]; then
        HAS_NVIDIA=true
        local vram
        vram=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits 2>/dev/null | head -1 || echo "?")
        echo -e "  GPU:  ${BOLD}$GPU_INFO${NC} (NVIDIA, ${vram} MB VRAM)"
        PLATFORM="Linux NVIDIA"
      fi
    elif lspci 2>/dev/null | grep -qi "nvidia"; then
      # GPU present but driver not installed
      GPU_INFO=$(lspci 2>/dev/null | grep -i nvidia | head -1 | sed 's/.*: //')
      echo -e "  GPU:  ${BOLD}$GPU_INFO${NC} ${YELLOW}(NVIDIA detected, driver missing)${NC}"
      HAS_NVIDIA=true
      PLATFORM="Linux NVIDIA (no driver)"
    fi

    # Detect AMD GPU (ROCm)
    if [ "$HAS_NVIDIA" = false ]; then
      if command -v rocm-smi &>/dev/null || lspci 2>/dev/null | grep -qi "amd.*radeon\|amd.*navi\|amd.*vega"; then
        HAS_AMD=true
        GPU_INFO=$(lspci 2>/dev/null | grep -i "amd.*vga\|radeon" | head -1 | sed 's/.*: //' || echo "AMD GPU")
        echo -e "  GPU:  ${BOLD}$GPU_INFO${NC} (AMD ROCm)"
        PLATFORM="Linux AMD"
      fi
    fi

    if [ "$HAS_NVIDIA" = false ] && [ "$HAS_AMD" = false ]; then
      PLATFORM="Linux CPU"
      echo -e "  GPU:  ${DIM}None detected (CPU mode)${NC}"
    fi

    if [ "$IS_WSL" = true ]; then
      PLATFORM="WSL2 — $PLATFORM"
    fi
  fi

  # ── Determine Docker compose profile ──
  if [ "$OS" = "Darwin" ]; then
    DOCKER_PROFILE=""  # Ollama native on macOS, not in Docker
  elif [ "$HAS_NVIDIA" = true ]; then
    DOCKER_PROFILE="nvidia"  # May be adjusted later if toolkit missing
  elif [ "$HAS_AMD" = true ]; then
    DOCKER_PROFILE="linux"  # ROCm support via native Ollama, not Docker
    warn "AMD ROCm: Ollama will run natively (Docker ROCm support is experimental)"
  else
    DOCKER_PROFILE="linux"
  fi

  success "Platform: ${BOLD}$PLATFORM${NC}"
  log "Platform: $PLATFORM | Arch: $ARCH | WSL: $IS_WSL | systemd: $HAS_SYSTEMD | Docker profile: ${DOCKER_PROFILE:-default}"
}

# ─── Step 2: Prerequisites ───────────────────────────────────────────────────

install_prerequisites() {
  header "Checking prerequisites"

  local missing=()

  # ── curl (needed by everything else) ──
  if command -v curl &>/dev/null; then
    success "curl $(curl --version | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)"
  else
    missing+=("curl")
  fi

  # ── Git ──
  if command -v git &>/dev/null; then
    success "Git $(git --version | grep -oE '[0-9]+\.[0-9]+[.0-9]*')"
  else
    missing+=("git")
  fi

  # ── Node.js ──
  if command -v node &>/dev/null; then
    local node_ver node_major
    node_ver=$(node --version)
    node_major=$(echo "$node_ver" | sed 's/v//' | cut -d. -f1)
    if [ "$node_major" -ge 22 ]; then
      success "Node.js $node_ver"
    else
      warn "Node.js $node_ver found but >= 22 required"
      missing+=("node")
    fi
  else
    missing+=("node")
  fi

  # ── pnpm ──
  if command -v pnpm &>/dev/null; then
    local pnpm_ver pnpm_major
    pnpm_ver=$(pnpm --version)
    pnpm_major=$(echo "$pnpm_ver" | cut -d. -f1)
    if [ "$pnpm_major" -ge 9 ]; then
      success "pnpm $pnpm_ver"
    else
      warn "pnpm $pnpm_ver found but >= 9 required"
      missing+=("pnpm")
    fi
  else
    missing+=("pnpm")
  fi

  # ── Docker ──
  detect_compose_cmd
  if command -v docker &>/dev/null; then
    if docker info &>/dev/null 2>&1; then
      local docker_ver
      docker_ver=$(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
      success "Docker $docker_ver"
    else
      warn "Docker installed but daemon not accessible"
      if [ "$OS" = "Linux" ] && [ "$IS_WSL" = false ]; then
        warn "Try: sudo systemctl start docker && sudo usermod -aG docker \$USER"
      elif [ "$IS_WSL" = true ]; then
        warn "Ensure Docker Desktop is running with WSL2 integration enabled"
      fi
      missing+=("docker-access")
    fi
  else
    missing+=("docker")
  fi

  # ── Docker Compose ──
  if [ -n "$COMPOSE_CMD" ]; then
    local compose_ver
    compose_ver=$($COMPOSE_CMD version --short 2>/dev/null || echo "unknown")
    success "Docker Compose $compose_ver ($COMPOSE_CMD)"
  elif [ -z "${missing[*]:-}" ] || [[ ! " ${missing[*]} " =~ " docker " ]]; then
    missing+=("docker-compose")
  fi

  # ── Redis ──
  if command -v redis-cli &>/dev/null; then
    if redis-cli ping &>/dev/null 2>&1; then
      success "Redis $(redis-cli --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo 'running')"
    else
      warn "Redis installed but not running"
      missing+=("redis-running")
    fi
  else
    missing+=("redis")
  fi

  # ── NVIDIA driver + toolkit (Linux only) ──
  if [ "$HAS_NVIDIA" = true ] && [ "$OS" = "Linux" ]; then
    check_nvidia_stack
  fi

  # ── Install missing tools ──
  if [ ${#missing[@]} -gt 0 ]; then
    echo ""
    warn "Missing: ${missing[*]}"

    if ! confirm "Install missing prerequisites?"; then
      fail "Cannot continue without: ${missing[*]}"
      exit 1
    fi

    for tool in "${missing[@]}"; do
      install_tool "$tool"
    done

    # Re-detect compose command after installs
    detect_compose_cmd
  fi
}

# ── NVIDIA driver & container toolkit check ──────────────────────────────────

check_nvidia_stack() {
  local nvidia_missing=()

  # Check driver
  if ! command -v nvidia-smi &>/dev/null; then
    nvidia_missing+=("nvidia-driver")
    warn "NVIDIA GPU detected but driver not installed"
  else
    local driver_ver
    driver_ver=$(nvidia-smi --query-gpu=driver_version --format=csv,noheader 2>/dev/null | head -1 || echo "?")
    success "NVIDIA driver $driver_ver"
  fi

  # Check container toolkit
  if docker info 2>/dev/null | grep -qi nvidia; then
    success "NVIDIA Container Toolkit installed"
  else
    nvidia_missing+=("nvidia-container-toolkit")
    warn "nvidia-container-toolkit not installed (needed for GPU in Docker)"
  fi

  if [ ${#nvidia_missing[@]} -gt 0 ] && [ "$IS_WSL" = false ]; then
    echo ""
    if confirm "Install NVIDIA components? (${nvidia_missing[*]})"; then
      install_nvidia_stack "${nvidia_missing[@]}"
    else
      warn "Falling back to CPU mode for Docker"
      DOCKER_PROFILE="linux"
    fi
  elif [ ${#nvidia_missing[@]} -gt 0 ] && [ "$IS_WSL" = true ]; then
    warn "On WSL2, NVIDIA drivers are managed by Windows."
    warn "Install the latest NVIDIA GPU driver on Windows, then restart WSL."
    if [[ " ${nvidia_missing[*]} " =~ "nvidia-container-toolkit" ]]; then
      if confirm "Install nvidia-container-toolkit inside WSL2?"; then
        install_nvidia_container_toolkit
      else
        DOCKER_PROFILE="linux"
      fi
    fi
  fi
}

install_nvidia_stack() {
  for component in "$@"; do
    case "$component" in
      nvidia-driver)
        info "Installing NVIDIA driver..."
        if command -v apt-get &>/dev/null; then
          run sudo apt-get update
          # Install recommended driver
          if command -v ubuntu-drivers &>/dev/null; then
            info "Auto-detecting best driver with ubuntu-drivers..."
            run_visible sudo ubuntu-drivers install
          else
            run sudo apt-get install -y ubuntu-drivers-common
            run_visible sudo ubuntu-drivers install
          fi
          success "NVIDIA driver installed (reboot may be required)"
        elif command -v dnf &>/dev/null; then
          info "Installing NVIDIA driver via RPM Fusion..."
          run sudo dnf install -y akmod-nvidia xorg-x11-drv-nvidia-cuda
          success "NVIDIA driver installed (reboot may be required)"
        elif command -v pacman &>/dev/null; then
          run sudo pacman -S --noconfirm nvidia nvidia-utils
          success "NVIDIA driver installed (reboot may be required)"
        else
          fail "Cannot auto-install NVIDIA driver on this distro"
          fail "Install manually: https://www.nvidia.com/en-us/drivers/"
          DOCKER_PROFILE="linux"
        fi
        ;;
      nvidia-container-toolkit)
        install_nvidia_container_toolkit
        ;;
    esac
  done
}

install_nvidia_container_toolkit() {
  info "Installing nvidia-container-toolkit..."
  if command -v apt-get &>/dev/null; then
    # Official NVIDIA repository
    curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey \
      | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg >> "$LOG_FILE" 2>&1

    local distro
    distro=$(. /etc/os-release && echo "$ID$VERSION_ID" | sed 's/\.//g')
    curl -fsSL "https://nvidia.github.io/libnvidia-container/${distro}/libnvidia-container.list" \
      | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' \
      | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list >> "$LOG_FILE" 2>&1

    run sudo apt-get update
    run sudo apt-get install -y nvidia-container-toolkit
    run sudo nvidia-ctk runtime configure --runtime=docker
    run sudo systemctl restart docker
    success "nvidia-container-toolkit installed and configured"
  elif command -v dnf &>/dev/null; then
    curl -fsSL https://nvidia.github.io/libnvidia-container/stable/rpm/nvidia-container-toolkit.repo \
      | sudo tee /etc/yum.repos.d/nvidia-container-toolkit.repo >> "$LOG_FILE" 2>&1
    run sudo dnf install -y nvidia-container-toolkit
    run sudo nvidia-ctk runtime configure --runtime=docker
    run sudo systemctl restart docker
    success "nvidia-container-toolkit installed and configured"
  elif command -v pacman &>/dev/null; then
    run sudo pacman -S --noconfirm nvidia-container-toolkit
    run sudo nvidia-ctk runtime configure --runtime=docker
    run sudo systemctl restart docker
    success "nvidia-container-toolkit installed and configured"
  else
    fail "Cannot auto-install nvidia-container-toolkit on this distro"
    fail "See: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html"
    DOCKER_PROFILE="linux"
  fi
}

# ─── Tool installer ──────────────────────────────────────────────────────────

install_tool() {
  local tool=$1
  info "Installing $tool..."

  case "$OS" in
    Darwin)
      # ── macOS ──
      if ! command -v brew &>/dev/null; then
        fail "Homebrew is required on macOS. Install it from https://brew.sh"
        exit 1
      fi
      case "$tool" in
        curl)
          run brew install curl
          success "curl installed"
          ;;
        node)
          # Detect if nvm/asdf/volta manages Node
          if command -v nvm &>/dev/null || [ -d "$HOME/.nvm" ]; then
            info "nvm detected — installing Node 22 via nvm..."
            export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
            # shellcheck disable=SC1091
            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
            nvm install 22
            nvm use 22
          elif command -v volta &>/dev/null; then
            run volta install node@22
          else
            run brew install node@22
            brew link --overwrite node@22 >> "$LOG_FILE" 2>&1 || true
          fi
          success "Node.js installed"
          ;;
        pnpm)
          npm_global_install pnpm
          success "pnpm installed"
          ;;
        docker|docker-compose|docker-access)
          fail "Docker Desktop is required on macOS."
          fail "Download from https://www.docker.com/products/docker-desktop/"
          fail "After installing, start Docker Desktop and re-run this script."
          exit 1
          ;;
        git)
          run brew install git
          success "Git installed"
          ;;
        redis)
          run brew install redis
          run brew services start redis
          success "Redis installed and started"
          ;;
        redis-running)
          run brew services start redis
          success "Redis started"
          ;;
      esac
      ;;

    Linux)
      # ── Linux / WSL2 ──
      local pkg_mgr=""
      if command -v apt-get &>/dev/null; then pkg_mgr="apt"
      elif command -v dnf &>/dev/null; then pkg_mgr="dnf"
      elif command -v pacman &>/dev/null; then pkg_mgr="pacman"
      fi

      case "$tool" in
        curl)
          case "$pkg_mgr" in
            apt) run sudo apt-get update && run sudo apt-get install -y curl ;;
            dnf) run sudo dnf install -y curl ;;
            pacman) run sudo pacman -S --noconfirm curl ;;
            *) fail "Install curl manually"; exit 1 ;;
          esac
          success "curl installed"
          ;;
        node)
          if command -v nvm &>/dev/null || [ -d "$HOME/.nvm" ]; then
            info "nvm detected — installing Node 22 via nvm..."
            export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
            # shellcheck disable=SC1091
            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
            nvm install 22
            nvm use 22
          else
            case "$pkg_mgr" in
              apt)
                info "Installing Node.js 22 via NodeSource..."
                curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - >> "$LOG_FILE" 2>&1
                run sudo apt-get install -y nodejs
                ;;
              dnf)
                curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash - >> "$LOG_FILE" 2>&1
                run sudo dnf install -y nodejs
                ;;
              pacman)
                run sudo pacman -S --noconfirm nodejs npm
                ;;
              *)
                fail "Cannot auto-install Node.js. Install Node.js >= 22 manually."
                exit 1
                ;;
            esac
          fi
          success "Node.js installed"
          ;;
        pnpm)
          npm_global_install pnpm
          success "pnpm installed"
          ;;
        docker|docker-compose)
          if [ "$IS_WSL" = true ]; then
            fail "Docker should be provided by Docker Desktop (Windows)."
            fail "  1. Install Docker Desktop on Windows"
            fail "  2. Settings → Resources → WSL Integration → enable your distro"
            fail "  3. Restart WSL: wsl --shutdown (from PowerShell)"
            exit 1
          fi
          info "Installing Docker via official script..."
          curl -fsSL https://get.docker.com | sudo sh >> "$LOG_FILE" 2>&1
          sudo usermod -aG docker "$USER" 2>/dev/null || true
          # Start Docker daemon
          if [ "$HAS_SYSTEMD" = true ]; then
            run sudo systemctl enable --now docker
          fi
          success "Docker installed"
          # Try to apply group immediately
          if ! docker info &>/dev/null 2>&1; then
            warn "Docker group applied — trying newgrp..."
            if command -v newgrp &>/dev/null; then
              info "You may need to run: newgrp docker && ./setup.sh"
            fi
            warn "If Docker still fails, log out and back in, then re-run ./setup.sh"
          fi
          detect_compose_cmd
          ;;
        docker-access)
          if [ "$IS_WSL" = true ]; then
            fail "Docker not accessible. Ensure Docker Desktop is running with WSL2 integration."
            exit 1
          fi
          warn "Docker daemon not accessible. Attempting to fix..."
          if [ "$HAS_SYSTEMD" = true ]; then
            sudo systemctl start docker 2>/dev/null || true
          fi
          if ! groups | grep -q docker; then
            sudo usermod -aG docker "$USER" 2>/dev/null || true
            warn "Added $USER to docker group — you may need to re-login"
          fi
          if ! docker info &>/dev/null 2>&1; then
            fail "Still cannot access Docker. Try: sudo systemctl start docker"
            exit 1
          fi
          success "Docker access restored"
          ;;
        git)
          case "$pkg_mgr" in
            apt) run sudo apt-get install -y git ;;
            dnf) run sudo dnf install -y git ;;
            pacman) run sudo pacman -S --noconfirm git ;;
            *) fail "Install git manually"; exit 1 ;;
          esac
          success "Git installed"
          ;;
        redis)
          case "$pkg_mgr" in
            apt) run sudo apt-get install -y redis-server ;;
            dnf) run sudo dnf install -y redis ;;
            pacman) run sudo pacman -S --noconfirm redis ;;
            *) fail "Install Redis manually"; exit 1 ;;
          esac
          start_redis
          success "Redis installed and started"
          ;;
        redis-running)
          start_redis
          success "Redis started"
          ;;
      esac
      ;;
  esac
}

# ── Start Redis (handles systemd/non-systemd) ───────────────────────────────

start_redis() {
  if [ "$OS" = "Darwin" ]; then
    brew services start redis >> "$LOG_FILE" 2>&1 || true
    return
  fi

  if [ "$HAS_SYSTEMD" = true ]; then
    sudo systemctl enable --now redis-server 2>/dev/null \
      || sudo systemctl enable --now redis 2>/dev/null \
      || true
  else
    # WSL2 or non-systemd Linux — start manually
    if command -v redis-server &>/dev/null; then
      if ! redis-cli ping &>/dev/null 2>&1; then
        info "Starting Redis manually (no systemd)..."
        redis-server --daemonize yes >> "$LOG_FILE" 2>&1 || true
      fi
    fi
  fi
}

# ─── Step 3: Environment file ────────────────────────────────────────────────

setup_env() {
  header "Configuring environment"

  if [ -f .env ]; then
    success ".env already exists"
    # Fix OLLAMA_HOST if platform changed
    if [ "$OS" = "Darwin" ]; then
      if grep -q "OLLAMA_HOST=http://ollama:" .env 2>/dev/null; then
        warn "Fixing OLLAMA_HOST for macOS (native Ollama)"
        sed_inplace 's|OLLAMA_HOST=http://ollama:[0-9]*|OLLAMA_HOST=http://localhost:11434|' .env
      fi
    fi
  else
    info "Creating .env from .env.example..."
    cp .env.example .env

    # Platform-specific OLLAMA_HOST for docker-compose
    # .env OLLAMA_HOST = what the Node.js app uses (always localhost)
    # docker-compose.yml OLLAMA_HOST = what LightRAG container uses
    #   - macOS/WSL2 Docker Desktop: host.docker.internal (default in compose)
    #   - Linux Docker Ollama: http://ollama:11434 (Docker network)
    if [ "$OS" = "Linux" ] && [ "$IS_WSL" = false ] && [ -n "$DOCKER_PROFILE" ]; then
      # LightRAG in Docker needs to reach Ollama in Docker via service name
      # Add a compose-specific override
      if ! grep -q "COMPOSE_OLLAMA_HOST" .env 2>/dev/null; then
        echo "" >> .env
        echo "# Used by docker-compose for LightRAG → Ollama connectivity" >> .env
        echo "COMPOSE_OLLAMA_HOST=http://ollama:11434" >> .env
      fi
    fi

    success ".env created"
  fi
}

# ─── Step 4: Install dependencies ────────────────────────────────────────────

install_deps() {
  header "Installing Node.js dependencies"

  info "Running pnpm install..."
  run_visible pnpm install
  success "Dependencies installed"
}

# ─── Step 5: Ollama ──────────────────────────────────────────────────────────

setup_ollama() {
  header "Setting up Ollama"

  if [ "$OS" = "Darwin" ]; then
    # ── macOS: native Ollama for Metal/CPU ──
    if ! command -v ollama &>/dev/null; then
      info "Installing Ollama via Homebrew..."
      run brew install ollama
      success "Ollama installed"
    else
      success "Ollama $(ollama --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+[.0-9]*' || echo 'installed')"
    fi
    start_native_ollama
    if [ "$ARCH" = "arm64" ]; then
      success "Ollama running (Metal GPU acceleration)"
    else
      success "Ollama running (CPU mode)"
    fi

  elif [ "$HAS_AMD" = true ]; then
    # ── Linux AMD: native Ollama for ROCm ──
    if ! command -v ollama &>/dev/null; then
      info "Installing Ollama natively for AMD ROCm..."
      curl -fsSL https://ollama.com/install.sh | sh >> "$LOG_FILE" 2>&1
      success "Ollama installed (ROCm)"
    else
      success "Ollama $(ollama --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+[.0-9]*' || echo 'installed')"
    fi
    start_native_ollama
    success "Ollama running (AMD ROCm)"

  elif [ "$IS_WSL" = true ]; then
    # ── WSL2: native Ollama (accesses Windows GPU via WSL2 GPU passthrough) ──
    if ! command -v ollama &>/dev/null; then
      info "Installing Ollama natively in WSL2..."
      curl -fsSL https://ollama.com/install.sh | sh >> "$LOG_FILE" 2>&1
      success "Ollama installed"
    else
      success "Ollama $(ollama --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+[.0-9]*' || echo 'installed')"
    fi
    start_native_ollama
    if [ "$HAS_NVIDIA" = true ]; then
      success "Ollama running (NVIDIA GPU via WSL2 passthrough)"
    else
      success "Ollama running (CPU mode)"
    fi

  else
    # ── Linux: Docker Ollama (started in next step) ──
    info "Ollama will run in Docker (profile: $DOCKER_PROFILE)"
  fi
}

start_native_ollama() {
  if curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; then
    info "Ollama already running"
    return 0
  fi

  info "Starting Ollama..."
  ollama serve >> "$LOG_FILE" 2>&1 &
  local pid=$!
  log "Started Ollama with PID $pid"

  local retries=0
  while ! curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; do
    retries=$((retries + 1))
    if [ "$retries" -ge 30 ]; then
      fail "Ollama failed to start after 30 seconds"
      fail "Try starting manually: ollama serve"
      exit 1
    fi
    sleep 1
  done
}

# ─── Step 6: Docker services ─────────────────────────────────────────────────

start_docker() {
  header "Starting Docker services"

  local compose_cmd="$COMPOSE_CMD"

  if [ -n "$DOCKER_PROFILE" ]; then
    compose_cmd="$compose_cmd --profile $DOCKER_PROFILE"
    info "Using profile: $DOCKER_PROFILE"
  else
    info "Default profile (macOS/WSL2 — no Ollama container)"
  fi

  # Stop & remove existing containers to avoid name conflicts (e.g. switching profiles)
  info "Stopping existing containers..."
  $COMPOSE_CMD --profile nvidia --profile linux down --remove-orphans >> "$LOG_FILE" 2>&1 || true
  # Force-remove any leftover containers with conflicting names
  local leftover
  leftover=$(docker ps -aq --filter "name=cortex-")
  [ -n "$leftover" ] && docker rm -f $leftover 2>/dev/null || true

  info "Pulling images..."
  $compose_cmd pull --ignore-buildable >> "$LOG_FILE" 2>&1 || true

  info "Building custom images (LightRAG)..."
  run_visible $compose_cmd build

  info "Starting containers..."
  run $compose_cmd up -d

  # Wait for PostgreSQL
  info "Waiting for PostgreSQL..."
  local retries=0
  while ! $COMPOSE_CMD exec -T postgres pg_isready -U cortex -d cortex > /dev/null 2>&1; do
    retries=$((retries + 1))
    if [ "$retries" -ge 30 ]; then
      fail "PostgreSQL failed to start"
      fail "Check: $COMPOSE_CMD logs postgres"
      exit 1
    fi
    sleep 1
  done
  success "PostgreSQL ready"

  # On Linux (non-WSL), wait for Docker Ollama
  if [ -n "$DOCKER_PROFILE" ] && [ "$IS_WSL" = false ] && [ "$HAS_AMD" = false ]; then
    info "Waiting for Ollama container..."
    retries=0
    while ! curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; do
      retries=$((retries + 1))
      if [ "$retries" -ge 60 ]; then
        fail "Ollama container failed to start"
        fail "Check: $COMPOSE_CMD logs ollama"
        exit 1
      fi
      sleep 1
    done
    success "Ollama container ready"
  fi

  # LightRAG
  info "Waiting for LightRAG..."
  retries=0
  while ! curl -sf http://localhost:9621/health > /dev/null 2>&1; do
    retries=$((retries + 1))
    if [ "$retries" -ge 60 ]; then
      warn "LightRAG not responding yet — it may need Ollama models first"
      break
    fi
    sleep 1
  done
  if [ "$retries" -lt 60 ]; then
    success "LightRAG ready"
  fi
}

# ─── Step 7: Pull AI models ──────────────────────────────────────────────────

pull_models() {
  header "Pulling AI models"

  if [ "$SKIP_MODELS" = true ]; then
    warn "Skipping model downloads (--skip-models)"
    warn "Run ./scripts/init-ollama.sh later to pull models"
    return 0
  fi

  # Source .env for model names (contained scope)
  local OLLAMA_LLM_MODEL OLLAMA_CHAT_MODEL OLLAMA_EMBEDDING_MODEL
  if [ -f .env ]; then
    OLLAMA_LLM_MODEL=$(grep '^OLLAMA_LLM_MODEL=' .env 2>/dev/null | cut -d= -f2 || true)
    OLLAMA_CHAT_MODEL=$(grep '^OLLAMA_CHAT_MODEL=' .env 2>/dev/null | cut -d= -f2 || true)
    OLLAMA_EMBEDDING_MODEL=$(grep '^OLLAMA_EMBEDDING_MODEL=' .env 2>/dev/null | cut -d= -f2 || true)
  fi
  OLLAMA_LLM_MODEL=${OLLAMA_LLM_MODEL:-qwen2.5:7b}
  OLLAMA_CHAT_MODEL=${OLLAMA_CHAT_MODEL:-qwen3.5:9b}
  OLLAMA_EMBEDDING_MODEL=${OLLAMA_EMBEDDING_MODEL:-nomic-embed-text}

  info "Models to pull:"
  echo -e "    Embedding: ${BOLD}$OLLAMA_EMBEDDING_MODEL${NC}"
  echo -e "    LLM (RAG): ${BOLD}$OLLAMA_LLM_MODEL${NC}"
  echo -e "    Chat:      ${BOLD}$OLLAMA_CHAT_MODEL${NC}"
  echo ""

  if ! confirm "Download models now? (several GB)"; then
    warn "Skipped. Run ./scripts/init-ollama.sh later."
    return 0
  fi

  local use_docker=false
  local ollama_container=""

  # Determine if we pull via Docker or native
  if [ "$OS" = "Linux" ] && [ "$IS_WSL" = false ] && [ "$HAS_AMD" = false ] && [ -n "$DOCKER_PROFILE" ]; then
    ollama_container=$($COMPOSE_CMD ps --format '{{.Names}}' 2>/dev/null | grep ollama | head -1 || echo "")
    if [ -n "$ollama_container" ]; then
      use_docker=true
    fi
  fi

  pull_one() {
    local model=$1 label=$2
    info "Pulling $label: $model..."
    if [ "$use_docker" = true ]; then
      run_visible docker exec "$ollama_container" ollama pull "$model"
    else
      run_visible ollama pull "$model"
    fi
    success "$label ready"
  }

  pull_one "$OLLAMA_EMBEDDING_MODEL" "Embedding model"
  pull_one "$OLLAMA_LLM_MODEL" "LLM model"
  pull_one "$OLLAMA_CHAT_MODEL" "Chat model"

  success "All models pulled"
}

# ─── Step 8: Database ────────────────────────────────────────────────────────

setup_database() {
  header "Setting up database"

  # drizzle-kit doesn't auto-load .env — export DATABASE_URL explicitly
  if [ -f .env ]; then
    local db_url
    db_url=$(grep '^DATABASE_URL=' .env | cut -d= -f2-)
    if [ -n "$db_url" ]; then
      export DATABASE_URL="$db_url"
    fi
  fi

  info "Running migrations..."
  run pnpm -w run migrate
  success "Migrations applied"

  info "Seeding data from config/projects.json..."
  if pnpm -w run seed >> "$LOG_FILE" 2>&1; then
    success "Database seeded"
  else
    warn "Seed skipped (data may already exist — use 'pnpm -w run seed --force' to re-seed)"
  fi
}

# ─── Step 9: Validation ──────────────────────────────────────────────────────

validate() {
  header "Validating setup"

  local all_ok=true

  # PostgreSQL
  if $COMPOSE_CMD exec -T postgres pg_isready -U cortex -d cortex > /dev/null 2>&1; then
    success "PostgreSQL    :5432"
  else
    fail "PostgreSQL    not responding"
    all_ok=false
  fi

  # Redis
  if redis-cli ping > /dev/null 2>&1; then
    success "Redis         :6379"
  else
    warn "Redis         not responding (workers need this)"
    all_ok=false
  fi

  # Ollama
  if curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; then
    local gpu_label="CPU"
    if [ "$OS" = "Darwin" ] && [ "$ARCH" = "arm64" ]; then gpu_label="Metal GPU"
    elif [ "$HAS_NVIDIA" = true ]; then gpu_label="NVIDIA GPU"
    elif [ "$HAS_AMD" = true ]; then gpu_label="AMD ROCm"
    fi
    success "Ollama        :11434 ($gpu_label)"
  else
    warn "Ollama        not responding"
    all_ok=false
  fi

  # LightRAG
  if curl -sf http://localhost:9621/health > /dev/null 2>&1; then
    success "LightRAG      :9621"
  else
    warn "LightRAG      starting (may need models pulled first)"
  fi

  # Summary
  echo ""
  if [ "$all_ok" = true ]; then
    echo -e "${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}${BOLD}  CorteX setup complete!${NC}"
    echo -e "${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  else
    echo -e "${YELLOW}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}${BOLD}  CorteX setup complete (with warnings)${NC}"
    echo -e "${YELLOW}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  fi

  echo ""
  echo -e "  ${BOLD}Platform:${NC}  $PLATFORM ($ARCH)"
  echo -e "  ${BOLD}Log file:${NC}  $LOG_FILE"
  echo ""
  echo -e "  ${BOLD}Start dev servers:${NC}"
  echo -e "    ${CYAN}pnpm dev${NC}"
  echo ""
  echo -e "  ${BOLD}Access:${NC}"
  echo -e "    Dashboard:  ${CYAN}http://localhost:5173${NC}"
  echo -e "    API:        ${CYAN}http://localhost:3100${NC}"
  echo ""
  echo -e "  ${BOLD}MCP (Claude Code):${NC}"
  echo -e "    ${DIM}claude mcp add cortex --transport stdio --scope user -- pnpm --filter @cortex/mcp run start${NC}"
  echo ""
}

# ─── Main ─────────────────────────────────────────────────────────────────────

main() {
  echo ""
  echo -e "${BOLD}${CYAN}╔═══════════════════════════════════════════════╗${NC}"
  echo -e "${BOLD}${CYAN}║           CorteX — Setup Script               ║${NC}"
  echo -e "${BOLD}${CYAN}║     Knowledge Hub for AI Teams                ║${NC}"
  echo -e "${BOLD}${CYAN}╚═══════════════════════════════════════════════╝${NC}"
  echo ""

  detect_platform        # 1 — OS, arch, GPU, WSL2
  install_prerequisites  # 2 — Node, pnpm, Docker, Git, Redis, NVIDIA
  setup_env              # 3 — .env from .env.example
  install_deps           # 4 — pnpm install
  setup_ollama           # 5 — native or Docker Ollama
  start_docker           # 6 — postgres + lightrag + (ollama on Linux)
  pull_models            # 7 — download AI models
  setup_database         # 8 — migrations + seed
  validate               # 9 — verify all services

  if [ "$START_DEV" = true ]; then
    echo ""
    info "Starting dev servers..."
    exec pnpm dev
  fi
}

main "$@"
