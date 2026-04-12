import {
  require_shim
} from "./chunk-4XUR72XU.js";
import {
  AssistantCloud,
  AssistantMessageAccumulator,
  AssistantProviderBase,
  AssistantRuntimeImpl,
  AssistantTransportDecoder,
  AuiIf,
  AuiProvider,
  BaseAssistantRuntimeCore,
  ChainOfThoughtByIndicesProvider,
  ChainOfThoughtClient,
  ChainOfThoughtPrimitiveParts,
  CloudFileAttachmentAdapter,
  ComposerAttachmentByIndexProvider,
  ComposerPrimitiveAttachmentByIndex,
  ComposerPrimitiveAttachments,
  ComposerPrimitiveIf,
  ComposerPrimitiveQueue,
  CompositeAttachmentAdapter,
  CompositeContextProvider,
  DataRenderers,
  DataStreamDecoder,
  DefaultThreadComposerRuntimeCore,
  Derived,
  ExportedMessageRepository,
  InMemoryThreadListAdapter,
  Interactables,
  MessageAttachmentByIndexProvider,
  MessageByIndexProvider,
  MessagePrimitiveAttachmentByIndex,
  MessagePrimitiveAttachments,
  MessagePrimitivePartByIndex,
  MessagePrimitiveParts,
  MessagePrimitiveQuote,
  MessageRepository,
  ModelContext,
  PartByIndexProvider,
  PartPrimitiveMessages,
  ReadonlyThreadProvider,
  RuntimeAdapterProvider,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
  SuggestionByIndexProvider,
  Suggestions,
  TextMessagePartProvider,
  ThreadListItemByIndexProvider,
  ThreadListItemPrimitiveTitle,
  ThreadListItemRuntimeProvider,
  ThreadListPrimitiveItemByIndex,
  ThreadListPrimitiveItems,
  ThreadMessageClient,
  ThreadPrimitiveMessageByIndex,
  ThreadPrimitiveMessages,
  ThreadPrimitiveSuggestionByIndex,
  ThreadPrimitiveSuggestions,
  ThreadRuntimeImpl,
  Tools,
  asAsyncIterableStream,
  attachTransformScopes,
  bindExternalStoreMessage,
  convertExternalMessages,
  create,
  createInitialMessage,
  createMessageConverter,
  defaultComponents,
  flushResourcesSync,
  fromThreadMessageLike,
  generateId,
  getAutoStatus,
  getExternalStoreMessage,
  getExternalStoreMessages,
  getMessageQuote,
  makeAssistantDataUI,
  makeAssistantTool,
  makeAssistantToolUI,
  mergeModelContexts,
  resource,
  splitLocalRuntimeOptions,
  tapClientLookup,
  tapClientResource,
  tapEffect,
  tapEffectEvent,
  tapMemo,
  tapRef,
  tapState,
  toJSONSchema,
  toToolsJSONSchema,
  useActionBarCopy,
  useActionBarEdit,
  useActionBarFeedbackNegative,
  useActionBarFeedbackPositive,
  useActionBarReload,
  useActionBarSpeak,
  useActionBarStopSpeaking,
  useAssistantContext,
  useAssistantDataUI,
  useAssistantInstructions,
  useAssistantInteractable,
  useAssistantTool,
  useAssistantToolUI,
  useAui,
  useAuiEvent,
  useAuiState,
  useBranchPickerNext,
  useBranchPickerPrevious,
  useCloudThreadListAdapter,
  useComposerAddAttachment,
  useComposerCancel,
  useComposerDictate,
  useComposerSend,
  useExternalMessageConverter,
  useExternalStoreRuntime,
  useInlineRender,
  useInteractableState,
  useLocalRuntime,
  useMessageError,
  useRemoteThreadListRuntime,
  useResource,
  useRuntimeAdapters,
  useSuggestionTrigger,
  useThreadListItemArchive,
  useThreadListItemDelete,
  useThreadListItemTrigger,
  useThreadListItemUnarchive,
  useThreadListNew,
  useToolArgsStatus,
  useToolInvocations,
  useVoiceControls,
  useVoiceState,
  useVoiceVolume,
  withKey
} from "./chunk-EZOGSO4P.js";
import {
  require_jsx_runtime
} from "./chunk-EWUVWUVW.js";
import {
  require_react_dom
} from "./chunk-DKM36WT5.js";
import {
  require_react
} from "./chunk-YAJ64PPY.js";
import {
  __export,
  __privateAdd,
  __privateGet,
  __privateSet,
  __publicField,
  __toESM
} from "./chunk-DP4XHQAG.js";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/cloud/useCloudThreadListRuntime.js
function useCloudThreadListRuntime({ runtimeHook, ...adapterOptions }) {
  const adapter = useCloudThreadListAdapter(adapterOptions);
  return useRemoteThreadListRuntime({
    runtimeHook,
    adapter,
    allowNesting: true
  });
}

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/model-context/tool.js
function tool(tool2) {
  return tool2;
}

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/model-context/registry.js
var ModelContextRegistry = class {
  constructor() {
    __publicField(this, "_tools", /* @__PURE__ */ new Map());
    __publicField(this, "_instructions", /* @__PURE__ */ new Map());
    __publicField(this, "_providers", /* @__PURE__ */ new Map());
    __publicField(this, "_subscribers", /* @__PURE__ */ new Set());
    __publicField(this, "_providerUnsubscribes", /* @__PURE__ */ new Map());
  }
  getModelContext() {
    const instructions = Array.from(this._instructions.values()).filter(Boolean);
    const system = instructions.length > 0 ? instructions.join("\n\n") : void 0;
    const tools = {};
    for (const toolProps of this._tools.values()) {
      const { toolName, render, ...tool2 } = toolProps;
      tools[toolName] = tool2;
    }
    const providerContexts = mergeModelContexts(new Set(this._providers.values()));
    const context = {
      system,
      tools: Object.keys(tools).length > 0 ? tools : void 0
    };
    if (providerContexts.system) {
      context.system = context.system ? `${context.system}

${providerContexts.system}` : providerContexts.system;
    }
    if (providerContexts.tools) {
      context.tools = { ...context.tools || {}, ...providerContexts.tools };
    }
    if (providerContexts.callSettings) {
      context.callSettings = providerContexts.callSettings;
    }
    if (providerContexts.config) {
      context.config = providerContexts.config;
    }
    return context;
  }
  subscribe(callback) {
    this._subscribers.add(callback);
    return () => this._subscribers.delete(callback);
  }
  notifySubscribers() {
    for (const callback of this._subscribers) {
      callback();
    }
  }
  addTool(tool2) {
    const id = Symbol();
    this._tools.set(id, tool2);
    this.notifySubscribers();
    return {
      update: (newTool) => {
        if (this._tools.has(id)) {
          this._tools.set(id, newTool);
          this.notifySubscribers();
        }
      },
      remove: () => {
        this._tools.delete(id);
        this.notifySubscribers();
      }
    };
  }
  addInstruction(config) {
    const id = Symbol();
    const instruction = typeof config === "string" ? config : config.instruction;
    const disabled = typeof config === "object" ? config.disabled : false;
    if (!disabled) {
      this._instructions.set(id, instruction);
      this.notifySubscribers();
    }
    return {
      update: (newConfig) => {
        const newInstruction = typeof newConfig === "string" ? newConfig : newConfig.instruction;
        const newDisabled = typeof newConfig === "object" ? newConfig.disabled : false;
        if (newDisabled) {
          this._instructions.delete(id);
        } else {
          this._instructions.set(id, newInstruction);
        }
        this.notifySubscribers();
      },
      remove: () => {
        this._instructions.delete(id);
        this.notifySubscribers();
      }
    };
  }
  addProvider(provider) {
    var _a2;
    const id = Symbol();
    this._providers.set(id, provider);
    const unsubscribe = (_a2 = provider.subscribe) == null ? void 0 : _a2.call(provider, () => {
      this.notifySubscribers();
    });
    this._providerUnsubscribes.set(id, unsubscribe);
    this.notifySubscribers();
    return {
      remove: () => {
        this._providers.delete(id);
        const unsubscribe2 = this._providerUnsubscribes.get(id);
        unsubscribe2 == null ? void 0 : unsubscribe2();
        this._providerUnsubscribes.delete(id);
        this.notifySubscribers();
      }
    };
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/model-context/frame/types.js
var FRAME_MESSAGE_CHANNEL = "assistant-ui-frame";

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/model-context/frame/host.js
var deserializeTool = (serializedTool) => ({
  parameters: serializedTool.parameters,
  ...serializedTool.description && {
    description: serializedTool.description
  },
  ...serializedTool.disabled !== void 0 && {
    disabled: serializedTool.disabled
  },
  ...serializedTool.type && { type: serializedTool.type }
});
var deserializeModelContext = (serialized) => ({
  ...serialized.system !== void 0 && { system: serialized.system },
  ...serialized.tools && {
    tools: Object.fromEntries(Object.entries(serialized.tools).map(([name, tool2]) => [
      name,
      deserializeTool(tool2)
    ]))
  }
});
var AssistantFrameHost = class {
  constructor(iframeWindow, targetOrigin = "*") {
    __publicField(this, "_context", {});
    __publicField(this, "_subscribers", /* @__PURE__ */ new Set());
    __publicField(this, "_pendingRequests", /* @__PURE__ */ new Map());
    __publicField(this, "_requestCounter", 0);
    __publicField(this, "_iframeWindow");
    __publicField(this, "_targetOrigin");
    this._iframeWindow = iframeWindow;
    this._targetOrigin = targetOrigin;
    this.handleMessage = this.handleMessage.bind(this);
    window.addEventListener("message", this.handleMessage);
    this.requestContext();
  }
  handleMessage(event) {
    var _a2;
    if (this._targetOrigin !== "*" && event.origin !== this._targetOrigin)
      return;
    if (event.source !== this._iframeWindow)
      return;
    if (((_a2 = event.data) == null ? void 0 : _a2.channel) !== FRAME_MESSAGE_CHANNEL)
      return;
    const message = event.data.message;
    switch (message.type) {
      case "model-context-update": {
        this.updateContext(message.context);
        break;
      }
      case "tool-result": {
        const pending = this._pendingRequests.get(message.id);
        if (pending) {
          if (message.error) {
            pending.reject(new Error(message.error));
          } else {
            pending.resolve(message.result);
          }
          this._pendingRequests.delete(message.id);
        }
        break;
      }
    }
  }
  updateContext(serializedContext) {
    const context = deserializeModelContext(serializedContext);
    this._context = {
      ...context,
      tools: context.tools && Object.fromEntries(Object.entries(context.tools).map(([name, tool2]) => [
        name,
        {
          ...tool2,
          execute: (args) => this.callTool(name, args)
        }
      ]))
    };
    this.notifySubscribers();
  }
  callTool(toolName, args) {
    return this.sendRequest({
      type: "tool-call",
      id: `tool-${this._requestCounter++}`,
      toolName,
      args
    }, 3e4, `Tool call "${toolName}" timed out`);
  }
  sendRequest(message, timeout = 3e4, timeoutMessage = "Request timed out") {
    return new Promise((resolve, reject) => {
      this._pendingRequests.set(message.id, { resolve, reject });
      this._iframeWindow.postMessage({ channel: FRAME_MESSAGE_CHANNEL, message }, this._targetOrigin);
      const timeoutId = setTimeout(() => {
        const pending = this._pendingRequests.get(message.id);
        if (pending) {
          pending.reject(new Error(timeoutMessage));
          this._pendingRequests.delete(message.id);
        }
      }, timeout);
      const originalResolve = this._pendingRequests.get(message.id).resolve;
      const originalReject = this._pendingRequests.get(message.id).reject;
      this._pendingRequests.set(message.id, {
        resolve: (value) => {
          clearTimeout(timeoutId);
          originalResolve(value);
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          originalReject(error);
        }
      });
    });
  }
  requestContext() {
    this._iframeWindow.postMessage({
      channel: FRAME_MESSAGE_CHANNEL,
      message: {
        type: "model-context-request"
      }
    }, this._targetOrigin);
  }
  notifySubscribers() {
    this._subscribers.forEach((callback) => callback());
  }
  getModelContext() {
    return this._context;
  }
  subscribe(callback) {
    this._subscribers.add(callback);
    return () => this._subscribers.delete(callback);
  }
  dispose() {
    window.removeEventListener("message", this.handleMessage);
    this._subscribers.clear();
    this._pendingRequests.clear();
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/model-context/frame/provider.js
var serializeTool = (tool2) => ({
  ...tool2.description && { description: tool2.description },
  parameters: tool2.parameters ? toJSONSchema(tool2.parameters) : void 0,
  ...tool2.disabled !== void 0 && { disabled: tool2.disabled },
  ...tool2.type && { type: tool2.type }
});
var serializeModelContext = (context) => ({
  ...context.system !== void 0 && { system: context.system },
  ...context.tools && {
    tools: Object.fromEntries(Object.entries(context.tools).map(([name, tool2]) => [
      name,
      serializeTool(tool2)
    ]))
  }
});
var _AssistantFrameProvider = class _AssistantFrameProvider {
  constructor(targetOrigin = "*") {
    __publicField(this, "_providers", /* @__PURE__ */ new Set());
    __publicField(this, "_providerUnsubscribes", /* @__PURE__ */ new Map());
    __publicField(this, "_targetOrigin");
    this._targetOrigin = targetOrigin;
    this.handleMessage = this.handleMessage.bind(this);
    window.addEventListener("message", this.handleMessage);
    setTimeout(() => this.broadcastUpdate(), 0);
  }
  static getInstance(targetOrigin) {
    if (!_AssistantFrameProvider._instance) {
      _AssistantFrameProvider._instance = new _AssistantFrameProvider(targetOrigin);
    }
    return _AssistantFrameProvider._instance;
  }
  handleMessage(event) {
    var _a2;
    if (this._targetOrigin !== "*" && event.origin !== this._targetOrigin)
      return;
    if (((_a2 = event.data) == null ? void 0 : _a2.channel) !== FRAME_MESSAGE_CHANNEL)
      return;
    const message = event.data.message;
    switch (message.type) {
      case "model-context-request":
        this.sendMessage(event, {
          type: "model-context-update",
          context: serializeModelContext(this.getModelContext())
        });
        break;
      case "tool-call":
        this.handleToolCall(message, event);
        break;
    }
  }
  async handleToolCall(message, event) {
    var _a2;
    const tool2 = (_a2 = this.getModelContext().tools) == null ? void 0 : _a2[message.toolName];
    let result;
    let error;
    if (!tool2) {
      error = `Tool "${message.toolName}" not found`;
    } else {
      try {
        result = tool2.execute ? await tool2.execute(message.args, {
          toolCallId: message.id,
          abortSignal: new AbortController().signal,
          human: async () => {
            throw new Error("Tool human input is not supported in frame context");
          }
        }) : void 0;
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
      }
    }
    this.sendMessage(event, {
      type: "tool-result",
      id: message.id,
      ...error ? { error } : { result }
    });
  }
  sendMessage(event, message) {
    var _a2;
    (_a2 = event.source) == null ? void 0 : _a2.postMessage({ channel: FRAME_MESSAGE_CHANNEL, message }, { targetOrigin: event.origin });
  }
  getModelContext() {
    const contexts = Array.from(this._providers).map((p) => p.getModelContext());
    return contexts.reduce((merged, context) => ({
      system: context.system ? merged.system ? `${merged.system}

${context.system}` : context.system : merged.system,
      tools: { ...merged.tools || {}, ...context.tools || {} }
    }), {});
  }
  broadcastUpdate() {
    if (window.parent && window.parent !== window) {
      const updateMessage = {
        type: "model-context-update",
        context: serializeModelContext(this.getModelContext())
      };
      window.parent.postMessage({ channel: FRAME_MESSAGE_CHANNEL, message: updateMessage }, this._targetOrigin);
    }
  }
  static addModelContextProvider(provider, targetOrigin) {
    var _a2;
    const instance = _AssistantFrameProvider.getInstance(targetOrigin);
    instance._providers.add(provider);
    const unsubscribe = (_a2 = provider.subscribe) == null ? void 0 : _a2.call(provider, () => instance.broadcastUpdate());
    if (unsubscribe) {
      instance._providerUnsubscribes.set(provider, unsubscribe);
    }
    instance.broadcastUpdate();
    return () => {
      var _a3;
      instance._providers.delete(provider);
      (_a3 = instance._providerUnsubscribes.get(provider)) == null ? void 0 : _a3();
      instance._providerUnsubscribes.delete(provider);
      instance.broadcastUpdate();
    };
  }
  static dispose() {
    if (_AssistantFrameProvider._instance) {
      const instance = _AssistantFrameProvider._instance;
      window.removeEventListener("message", instance.handleMessage);
      instance._providerUnsubscribes.forEach((unsubscribe) => unsubscribe == null ? void 0 : unsubscribe());
      instance._providerUnsubscribes.clear();
      instance._providers.clear();
      _AssistantFrameProvider._instance = null;
    }
  }
};
__publicField(_AssistantFrameProvider, "_instance", null);
var AssistantFrameProvider = _AssistantFrameProvider;

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/adapters/speech.js
var WebSpeechSynthesisAdapter = class {
  speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const subscribers = /* @__PURE__ */ new Set();
    const handleEnd = (reason, error) => {
      if (res.status.type === "ended")
        return;
      res.status = { type: "ended", reason, error };
      subscribers.forEach((handler) => handler());
    };
    utterance.addEventListener("end", () => handleEnd("finished"));
    utterance.addEventListener("error", (e) => handleEnd("error", e.error));
    window.speechSynthesis.speak(utterance);
    const res = {
      status: { type: "running" },
      cancel: () => {
        window.speechSynthesis.cancel();
        handleEnd("cancelled");
      },
      subscribe: (callback) => {
        if (res.status.type === "ended") {
          let cancelled = false;
          queueMicrotask(() => {
            if (!cancelled)
              callback();
          });
          return () => {
            cancelled = true;
          };
        } else {
          subscribers.add(callback);
          return () => {
            subscribers.delete(callback);
          };
        }
      }
    };
    return res;
  }
};
var getSpeechRecognitionAPI = () => {
  if (typeof window === "undefined")
    return void 0;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
};
var WebSpeechDictationAdapter = class {
  constructor(options = {}) {
    __publicField(this, "_language");
    __publicField(this, "_continuous");
    __publicField(this, "_interimResults");
    const defaultLanguage = typeof navigator !== "undefined" && navigator.language ? navigator.language : "en-US";
    this._language = options.language ?? defaultLanguage;
    this._continuous = options.continuous ?? true;
    this._interimResults = options.interimResults ?? true;
  }
  static isSupported() {
    return getSpeechRecognitionAPI() !== void 0;
  }
  listen() {
    const SpeechRecognitionAPI = getSpeechRecognitionAPI();
    if (!SpeechRecognitionAPI) {
      throw new Error("SpeechRecognition is not supported in this browser. Try using Chrome, Edge, or Safari.");
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = this._language;
    recognition.continuous = this._continuous;
    recognition.interimResults = this._interimResults;
    const speechStartCallbacks = /* @__PURE__ */ new Set();
    const speechEndCallbacks = /* @__PURE__ */ new Set();
    const speechCallbacks = /* @__PURE__ */ new Set();
    let finalTranscript = "";
    const session = {
      status: { type: "starting" },
      stop: async () => {
        recognition.stop();
        return new Promise((resolve) => {
          const checkEnded = () => {
            if (session.status.type === "ended") {
              resolve();
            } else {
              setTimeout(checkEnded, 50);
            }
          };
          checkEnded();
        });
      },
      cancel: () => {
        recognition.abort();
      },
      onSpeechStart: (callback) => {
        speechStartCallbacks.add(callback);
        return () => {
          speechStartCallbacks.delete(callback);
        };
      },
      onSpeechEnd: (callback) => {
        speechEndCallbacks.add(callback);
        return () => {
          speechEndCallbacks.delete(callback);
        };
      },
      onSpeech: (callback) => {
        speechCallbacks.add(callback);
        return () => {
          speechCallbacks.delete(callback);
        };
      }
    };
    const updateStatus = (newStatus) => {
      session.status = newStatus;
    };
    recognition.addEventListener("speechstart", () => {
      for (const cb of speechStartCallbacks)
        cb();
    });
    recognition.addEventListener("start", () => {
      updateStatus({ type: "running" });
    });
    recognition.addEventListener("result", (event) => {
      var _a2;
      const speechEvent = event;
      for (let i = speechEvent.resultIndex; i < speechEvent.results.length; i++) {
        const result = speechEvent.results[i];
        if (!result)
          continue;
        const transcript = ((_a2 = result[0]) == null ? void 0 : _a2.transcript) ?? "";
        if (result.isFinal) {
          finalTranscript += transcript;
          for (const cb of speechCallbacks)
            cb({ transcript, isFinal: true });
        } else {
          for (const cb of speechCallbacks)
            cb({ transcript, isFinal: false });
        }
      }
    });
    recognition.addEventListener("speechend", () => {
    });
    recognition.addEventListener("end", () => {
      const currentStatus = session.status;
      if (currentStatus.type !== "ended") {
        updateStatus({ type: "ended", reason: "stopped" });
      }
      if (finalTranscript) {
        for (const cb of speechEndCallbacks)
          cb({ transcript: finalTranscript });
        finalTranscript = "";
      }
    });
    recognition.addEventListener("error", (event) => {
      const errorEvent = event;
      if (errorEvent.error === "aborted") {
        updateStatus({ type: "ended", reason: "cancelled" });
      } else {
        updateStatus({ type: "ended", reason: "error" });
        console.error("Dictation error:", errorEvent.error, errorEvent.message);
      }
    });
    try {
      recognition.start();
    } catch (error) {
      updateStatus({ type: "ended", reason: "error" });
      throw error;
    }
    return session;
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/adapters/voice.js
function createVoiceSession(options, setup) {
  const statusCbs = /* @__PURE__ */ new Set();
  const transcriptCbs = /* @__PURE__ */ new Set();
  const modeCbs = /* @__PURE__ */ new Set();
  const volumeCbs = /* @__PURE__ */ new Set();
  let currentStatus = { type: "starting" };
  let isMuted = false;
  let disposed = false;
  let controls = null;
  const cleanup = () => {
    disposed = true;
    statusCbs.clear();
    transcriptCbs.clear();
    modeCbs.clear();
    volumeCbs.clear();
  };
  const helpers = {
    setStatus: (status) => {
      if (disposed)
        return;
      currentStatus = status;
      for (const cb of statusCbs)
        cb(status);
    },
    end: (reason, error) => {
      if (disposed)
        return;
      currentStatus = { type: "ended", reason, error };
      for (const cb of statusCbs)
        cb(currentStatus);
      cleanup();
    },
    emitTranscript: (item) => {
      if (disposed)
        return;
      for (const cb of transcriptCbs)
        cb(item);
    },
    emitMode: (mode) => {
      if (disposed)
        return;
      for (const cb of modeCbs)
        cb(mode);
    },
    emitVolume: (volume) => {
      if (disposed)
        return;
      for (const cb of volumeCbs)
        cb(volume);
    },
    isDisposed: () => disposed
  };
  const session = {
    get status() {
      return currentStatus;
    },
    get isMuted() {
      return isMuted;
    },
    disconnect: () => {
      controls == null ? void 0 : controls.disconnect();
      cleanup();
    },
    mute: () => {
      controls == null ? void 0 : controls.mute();
      isMuted = true;
    },
    unmute: () => {
      controls == null ? void 0 : controls.unmute();
      isMuted = false;
    },
    onStatusChange: (cb) => {
      statusCbs.add(cb);
      return () => statusCbs.delete(cb);
    },
    onTranscript: (cb) => {
      transcriptCbs.add(cb);
      return () => transcriptCbs.delete(cb);
    },
    onModeChange: (cb) => {
      modeCbs.add(cb);
      return () => modeCbs.delete(cb);
    },
    onVolumeChange: (cb) => {
      volumeCbs.add(cb);
      return () => volumeCbs.delete(cb);
    }
  };
  if (options.abortSignal) {
    options.abortSignal.addEventListener("abort", () => session.disconnect(), {
      once: true
    });
  }
  const doSetup = async () => {
    try {
      if (disposed)
        return;
      controls = await setup(helpers);
      if (disposed)
        controls.disconnect();
    } catch (error) {
      helpers.end("error", error);
    }
  };
  doSetup();
  return session;
}

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/adapters/mention.js
var DIRECTIVE_RE = /:([\w-]+)\[([^\]]+)\](?:\{name=([^}]+)\})?/g;
var unstable_defaultDirectiveFormatter = {
  serialize(item) {
    const attrs = item.id !== item.label ? `{name=${item.id}}` : "";
    return `:${item.type}[${item.label}]${attrs}`;
  },
  parse(text) {
    const segments = [];
    let lastIndex = 0;
    DIRECTIVE_RE.lastIndex = 0;
    let match;
    while ((match = DIRECTIVE_RE.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          kind: "text",
          text: text.slice(lastIndex, match.index)
        });
      }
      const label = match[2];
      segments.push({
        kind: "mention",
        type: match[1],
        label,
        id: match[3] ?? label
      });
      lastIndex = DIRECTIVE_RE.lastIndex;
    }
    if (lastIndex < text.length) {
      segments.push({ kind: "text", text: text.slice(lastIndex) });
    }
    return segments;
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/assistant-transport/utils.js
async function createRequestHeaders(headersValue) {
  const resolvedHeaders = typeof headersValue === "function" ? await headersValue() : headersValue;
  const headers = new Headers(resolvedHeaders);
  headers.set("Content-Type", "application/json");
  return headers;
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/runtime-cores/assistant-transport/useAssistantTransportRuntime.js
var import_react10 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/runtime-cores/assistant-transport/commandQueue.js
var import_react5 = __toESM(require_react(), 1);
var createInitialQueueState = () => ({
  queued: [],
  inTransit: []
});
var useCommandQueue = (opts) => {
  const onQueueRef = (0, import_react5.useRef)(opts.onQueue);
  (0, import_react5.useEffect)(() => {
    onQueueRef.current = opts.onQueue;
  });
  const [, rerender] = (0, import_react5.useState)(0);
  const queueStateRef = (0, import_react5.useRef)(createInitialQueueState());
  const enqueue = (command) => {
    queueStateRef.current = {
      queued: [...queueStateRef.current.queued, command],
      inTransit: queueStateRef.current.inTransit
    };
    rerender((prev) => prev + 1);
    onQueueRef.current();
  };
  const flush = () => {
    if (queueStateRef.current.queued.length === 0)
      return [];
    const queued = queueStateRef.current.queued;
    queueStateRef.current = {
      queued: [],
      inTransit: [...queueStateRef.current.inTransit, ...queued]
    };
    rerender((prev) => prev + 1);
    return queued;
  };
  const markDelivered = () => {
    queueStateRef.current = { ...queueStateRef.current, inTransit: [] };
    rerender((prev) => prev + 1);
  };
  const reset = (0, import_react5.useCallback)(() => {
    queueStateRef.current = createInitialQueueState();
    rerender((prev) => prev + 1);
  }, []);
  return {
    state: queueStateRef.current,
    enqueue,
    flush,
    markDelivered,
    reset
  };
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/runtime-cores/assistant-transport/runManager.js
var import_react7 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/runtime-cores/assistant-transport/useLatestRef.js
var import_react6 = __toESM(require_react(), 1);
function useLatestRef(value) {
  const ref = (0, import_react6.useRef)(value);
  (0, import_react6.useEffect)(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/runtime-cores/assistant-transport/runManager.js
function useRunManager(config) {
  const [isRunning, setIsRunning] = (0, import_react7.useState)(false);
  const stateRef = (0, import_react7.useRef)({
    pending: false,
    abortController: null
  });
  const onRunRef = useLatestRef(config.onRun);
  const onFinishRef = useLatestRef(config.onFinish);
  const onCancelRef = useLatestRef(config.onCancel);
  const onErrorRef = useLatestRef(config.onError);
  const startRun = (0, import_react7.useCallback)(() => {
    setIsRunning(true);
    stateRef.current.pending = false;
    const ac = new AbortController();
    stateRef.current.abortController = ac;
    queueMicrotask(async () => {
      var _a2, _b, _c;
      try {
        await onRunRef.current(ac.signal);
      } catch (error) {
        stateRef.current.pending = false;
        if (ac.signal.aborted) {
          (_a2 = onCancelRef.current) == null ? void 0 : _a2.call(onCancelRef);
        } else {
          await ((_b = onErrorRef.current) == null ? void 0 : _b.call(onErrorRef, error));
        }
      } finally {
        (_c = onFinishRef.current) == null ? void 0 : _c.call(onFinishRef);
        if (stateRef.current.pending) {
          startRun();
        } else {
          setIsRunning(false);
          stateRef.current.abortController = null;
        }
      }
    });
  }, [onRunRef, onFinishRef, onErrorRef, onCancelRef]);
  const schedule = (0, import_react7.useCallback)(() => {
    if (stateRef.current.abortController) {
      stateRef.current.pending = true;
      return;
    }
    startRun();
  }, [startRun]);
  const cancel = (0, import_react7.useCallback)(() => {
    var _a2;
    stateRef.current.pending = false;
    (_a2 = stateRef.current.abortController) == null ? void 0 : _a2.abort();
  }, []);
  return {
    isRunning,
    schedule,
    cancel
  };
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/runtime-cores/assistant-transport/useConvertedState.js
var import_react8 = __toESM(require_react(), 1);
function useConvertedState(converter, agentState, pendingCommands, isSending, toolStatuses) {
  return (0, import_react8.useMemo)(() => converter(agentState, { pendingCommands, isSending, toolStatuses }), [converter, agentState, pendingCommands, isSending, toolStatuses]);
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/runtime-cores/assistant-transport/useAssistantTransportRuntime.js
var convertAppendMessageToCommand = (message) => {
  var _a2;
  if (message.role !== "user")
    throw new Error("Only user messages are supported");
  const parts = [];
  const content = [
    ...message.content,
    ...((_a2 = message.attachments) == null ? void 0 : _a2.flatMap((a) => a.content)) ?? []
  ];
  for (const contentPart of content) {
    if (contentPart.type === "text") {
      parts.push({ type: "text", text: contentPart.text });
    } else if (contentPart.type === "image") {
      parts.push({ type: "image", image: contentPart.image });
    }
  }
  return {
    type: "add-message",
    message: {
      role: "user",
      parts
    },
    parentId: message.parentId,
    sourceId: message.sourceId
  };
};
var symbolAssistantTransportExtras = Symbol("assistant-transport-extras");
var asAssistantTransportExtras = (extras) => {
  if (typeof extras !== "object" || extras == null || !(symbolAssistantTransportExtras in extras))
    throw new Error("This method can only be called when you are using useAssistantTransportRuntime");
  return extras;
};
var useAssistantTransportSendCommand = () => {
  const aui = useAui();
  return (command) => {
    const extras = aui.thread().getState().extras;
    const transportExtras = asAssistantTransportExtras(extras);
    transportExtras.sendCommand(command);
  };
};
function useAssistantTransportState(selector = (t) => t) {
  return useAuiState((s) => selector(asAssistantTransportExtras(s.thread.extras).state));
}
var useAssistantTransportThreadRuntime = (options) => {
  var _a2;
  const agentStateRef = (0, import_react10.useRef)(options.initialState);
  const [, rerender] = (0, import_react10.useState)(0);
  const resumeFlagRef = (0, import_react10.useRef)(false);
  const parentIdRef = (0, import_react10.useRef)(void 0);
  const commandQueue = useCommandQueue({
    onQueue: () => runManager.schedule()
  });
  const threadId = useAuiState((s) => s.threadListItem.remoteId);
  const runManager = useRunManager({
    onRun: async (signal) => {
      var _a3;
      const isResume = resumeFlagRef.current;
      resumeFlagRef.current = false;
      const commands = isResume ? [] : commandQueue.flush();
      if (commands.length === 0 && !isResume)
        throw new Error("No commands to send");
      const headers = await createRequestHeaders(options.headers);
      const bodyValue = typeof options.body === "function" ? await options.body() : options.body;
      const context = runtime.thread.getModelContext();
      let requestBody = {
        commands,
        state: agentStateRef.current,
        system: context.system,
        tools: context.tools ? toToolsJSONSchema(context.tools) : void 0,
        threadId,
        ...parentIdRef.current !== void 0 && {
          parentId: parentIdRef.current
        },
        // nested (new format, aligned with AssistantChatTransport)
        callSettings: context.callSettings,
        config: context.config,
        // @deprecated spread at top level — use nested `callSettings`/`config` instead. Will be removed in a future version.
        ...context.callSettings,
        ...context.config,
        ...bodyValue ?? {}
      };
      if (options.prepareSendCommandsRequest) {
        requestBody = await options.prepareSendCommandsRequest(requestBody);
      }
      const response = await fetch(isResume ? options.resumeApi : options.api, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
        signal
      });
      (_a3 = options.onResponse) == null ? void 0 : _a3.call(options, response);
      if (!response.ok) {
        throw new Error(`Status ${response.status}: ${await response.text()}`);
      }
      if (!response.body) {
        throw new Error("Response body is null");
      }
      const protocol = options.protocol ?? "data-stream";
      const decoder = protocol === "assistant-transport" ? new AssistantTransportDecoder() : new DataStreamDecoder();
      let err;
      const stream = response.body.pipeThrough(decoder).pipeThrough(new AssistantMessageAccumulator({
        initialMessage: createInitialMessage({
          unstable_state: agentStateRef.current ?? null
        }),
        throttle: isResume,
        onError: (error) => {
          err = error;
        }
      }));
      let markedDelivered = false;
      for await (const chunk of asAsyncIterableStream(stream)) {
        if (chunk.metadata.unstable_state === agentStateRef.current)
          continue;
        if (!markedDelivered) {
          commandQueue.markDelivered();
          markedDelivered = true;
        }
        agentStateRef.current = chunk.metadata.unstable_state;
        rerender((prev) => prev + 1);
      }
      if (err) {
        throw new Error(err);
      }
    },
    onFinish: options.onFinish,
    onCancel: () => {
      var _a3;
      const cmds = [
        ...commandQueue.state.inTransit,
        ...commandQueue.state.queued
      ];
      commandQueue.reset();
      (_a3 = options.onCancel) == null ? void 0 : _a3.call(options, {
        commands: cmds,
        updateState: (updater) => {
          agentStateRef.current = updater(agentStateRef.current);
          rerender((prev) => prev + 1);
        }
      });
    },
    onError: async (error) => {
      var _a3, _b;
      const inTransitCmds = [...commandQueue.state.inTransit];
      const queuedCmds = [...commandQueue.state.queued];
      commandQueue.reset();
      try {
        await ((_a3 = options.onError) == null ? void 0 : _a3.call(options, error, {
          commands: inTransitCmds,
          updateState: (updater) => {
            agentStateRef.current = updater(agentStateRef.current);
            rerender((prev) => prev + 1);
          }
        }));
      } finally {
        (_b = options.onCancel) == null ? void 0 : _b.call(options, {
          commands: queuedCmds,
          updateState: (updater) => {
            agentStateRef.current = updater(agentStateRef.current);
            rerender((prev) => prev + 1);
          },
          error
        });
      }
    }
  });
  const [toolStatuses, setToolStatuses] = (0, import_react10.useState)({});
  const pendingCommands = (0, import_react10.useMemo)(() => [...commandQueue.state.inTransit, ...commandQueue.state.queued], [commandQueue.state]);
  const converted = useConvertedState(options.converter, agentStateRef.current, pendingCommands, runManager.isRunning, toolStatuses);
  const runtime = useExternalStoreRuntime({
    messages: converted.messages,
    state: converted.state,
    isRunning: converted.isRunning,
    adapters: options.adapters,
    extras: {
      [symbolAssistantTransportExtras]: true,
      sendCommand: (command) => {
        commandQueue.enqueue(command);
      },
      state: agentStateRef.current
    },
    onNew: async (message) => {
      parentIdRef.current = message.parentId;
      const command = convertAppendMessageToCommand(message);
      commandQueue.enqueue(command);
    },
    ...((_a2 = options.capabilities) == null ? void 0 : _a2.edit) && {
      onEdit: async (message) => {
        parentIdRef.current = message.parentId;
        const command = convertAppendMessageToCommand(message);
        commandQueue.enqueue(command);
      }
    },
    onCancel: async () => {
      runManager.cancel();
      await toolInvocations.abort();
    },
    onResume: async () => {
      if (!options.resumeApi)
        throw new Error("Must pass resumeApi to options to resume runs");
      resumeFlagRef.current = true;
      runManager.schedule();
    },
    onAddToolResult: async (toolOptions) => {
      const command = {
        type: "add-tool-result",
        toolCallId: toolOptions.toolCallId,
        result: toolOptions.result,
        toolName: toolOptions.toolName,
        isError: toolOptions.isError,
        ...toolOptions.artifact && { artifact: toolOptions.artifact }
      };
      commandQueue.enqueue(command);
    },
    onLoadExternalState: async (state) => {
      agentStateRef.current = state;
      toolInvocations.reset();
      rerender((prev) => prev + 1);
    }
  });
  const toolInvocations = useToolInvocations({
    state: converted,
    getTools: () => runtime.thread.getModelContext().tools,
    onResult: commandQueue.enqueue,
    setToolStatuses
  });
  return runtime;
};
var useAssistantTransportRuntime = (options) => {
  const runtime = useRemoteThreadListRuntime({
    runtimeHook: function RuntimeHook() {
      return useAssistantTransportThreadRuntime(options);
    },
    adapter: new InMemoryThreadListAdapter(),
    allowNesting: true
  });
  return runtime;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/AssistantRuntimeProvider.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var import_react17 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/providers/ThreadViewportProvider.js
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var import_react16 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/stores/ThreadViewport.js
var createSizeRegistry = (onChange) => {
  const entries = /* @__PURE__ */ new Map();
  const recalculate = () => {
    let total = 0;
    for (const height of entries.values()) {
      total += height;
    }
    onChange(total);
  };
  return {
    register: () => {
      const id = Symbol();
      entries.set(id, 0);
      return {
        setHeight: (height) => {
          if (entries.get(id) !== height) {
            entries.set(id, height);
            recalculate();
          }
        },
        unregister: () => {
          entries.delete(id);
          recalculate();
        }
      };
    }
  };
};
var makeThreadViewportStore = (options = {}) => {
  const scrollToBottomListeners = /* @__PURE__ */ new Set();
  const viewportRegistry = createSizeRegistry((total) => {
    store.setState({
      height: {
        ...store.getState().height,
        viewport: total
      }
    });
  });
  const insetRegistry = createSizeRegistry((total) => {
    store.setState({
      height: {
        ...store.getState().height,
        inset: total
      }
    });
  });
  const userMessageRegistry = createSizeRegistry((total) => {
    store.setState({
      height: {
        ...store.getState().height,
        userMessage: total
      }
    });
  });
  const store = create(() => ({
    isAtBottom: true,
    scrollToBottom: ({ behavior = "auto" } = {}) => {
      for (const listener of scrollToBottomListeners) {
        listener({ behavior });
      }
    },
    onScrollToBottom: (callback) => {
      scrollToBottomListeners.add(callback);
      return () => {
        scrollToBottomListeners.delete(callback);
      };
    },
    turnAnchor: options.turnAnchor ?? "bottom",
    height: {
      viewport: 0,
      inset: 0,
      userMessage: 0
    },
    registerViewport: viewportRegistry.register,
    registerContentInset: insetRegistry.register,
    registerUserMessageHeight: userMessageRegistry.register
  }));
  return store;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/react/ThreadViewportContext.js
var import_react15 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/react/utils/createContextHook.js
var import_react14 = __toESM(require_react(), 1);
function createContextHook(context, providerName) {
  function useContextHook(options) {
    const contextValue = (0, import_react14.useContext)(context);
    if (!(options == null ? void 0 : options.optional) && !contextValue) {
      throw new Error(`This component must be used within ${providerName}.`);
    }
    return contextValue;
  }
  return useContextHook;
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/react/utils/createContextStoreHook.js
function createContextStoreHook(contextHook, contextKey) {
  function useStoreStoreHook(options) {
    const context = contextHook(options);
    if (!context)
      return null;
    return context[contextKey];
  }
  function useStoreHook(param) {
    let optional = false;
    let selector;
    if (typeof param === "function") {
      selector = param;
    } else if (param && typeof param === "object") {
      optional = !!param.optional;
      selector = param.selector;
    }
    const store = useStoreStoreHook({
      optional
    });
    if (!store)
      return null;
    return selector ? store(selector) : store();
  }
  return {
    [contextKey]: useStoreHook,
    [`${contextKey}Store`]: useStoreStoreHook
  };
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/react/ThreadViewportContext.js
var ThreadViewportContext = (0, import_react15.createContext)(null);
var useThreadViewportContext = createContextHook(ThreadViewportContext, "ThreadPrimitive.Viewport");
var { useThreadViewport, useThreadViewportStore } = createContextStoreHook(useThreadViewportContext, "useThreadViewport");

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/ReadonlyStore.js
var writableStore = (store) => {
  return store;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/providers/ThreadViewportProvider.js
var useThreadViewportStoreValue = (options) => {
  const outerViewport = useThreadViewportStore({ optional: true });
  const [store] = (0, import_react16.useState)(() => makeThreadViewportStore(options));
  (0, import_react16.useEffect)(() => {
    return outerViewport == null ? void 0 : outerViewport.getState().onScrollToBottom(() => {
      store.getState().scrollToBottom();
    });
  }, [outerViewport, store]);
  (0, import_react16.useEffect)(() => {
    if (!outerViewport)
      return;
    return store.subscribe((state) => {
      if (outerViewport.getState().isAtBottom !== state.isAtBottom) {
        writableStore(outerViewport).setState({ isAtBottom: state.isAtBottom });
      }
    });
  }, [store, outerViewport]);
  (0, import_react16.useEffect)(() => {
    const nextState = {
      turnAnchor: options.turnAnchor ?? "bottom"
    };
    const currentState = store.getState();
    if (currentState.turnAnchor !== nextState.turnAnchor) {
      writableStore(store).setState(nextState);
    }
  }, [store, options.turnAnchor]);
  return store;
};
var ThreadPrimitiveViewportProvider = ({ children, options = {} }) => {
  const useThreadViewport2 = useThreadViewportStoreValue(options);
  const [context] = (0, import_react16.useState)(() => {
    return {
      useThreadViewport: useThreadViewport2
    };
  });
  return (0, import_jsx_runtime.jsx)(ThreadViewportContext.Provider, { value: context, children });
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/devtools/DevToolsHooks.js
var cachedHook;
var getHook = () => {
  if (cachedHook) {
    return cachedHook;
  }
  const createHook = () => ({
    apis: /* @__PURE__ */ new Map(),
    nextId: 0,
    listeners: /* @__PURE__ */ new Set()
  });
  if (typeof window === "undefined") {
    cachedHook = createHook();
    return cachedHook;
  }
  const existingHook = window.__ASSISTANT_UI_DEVTOOLS_HOOK__;
  if (existingHook) {
    cachedHook = existingHook;
    return existingHook;
  }
  const newHook = createHook();
  window.__ASSISTANT_UI_DEVTOOLS_HOOK__ = newHook;
  cachedHook = newHook;
  return newHook;
};
var DevToolsHooks = class _DevToolsHooks {
  static subscribe(listener) {
    const hook = getHook();
    hook.listeners.add(listener);
    return () => {
      hook.listeners.delete(listener);
    };
  }
  static clearEventLogs(apiId) {
    const hook = getHook();
    const entry = hook.apis.get(apiId);
    if (!entry)
      return;
    entry.logs = [];
    _DevToolsHooks.notifyListeners(apiId);
  }
  static getApis() {
    return getHook().apis;
  }
  static notifyListeners(apiId) {
    const hook = getHook();
    hook.listeners.forEach((listener) => listener(apiId));
  }
};
var _DevToolsProviderApi = class _DevToolsProviderApi {
  static register(aui) {
    var _a2, _b;
    const hook = getHook();
    for (const entry2 of hook.apis.values()) {
      if (entry2.api === aui) {
        return () => {
        };
      }
    }
    const apiId = hook.nextId++;
    const entry = {
      api: aui,
      logs: []
    };
    const eventUnsubscribe = (_a2 = aui.on) == null ? void 0 : _a2.call(aui, "*", (e) => {
      const entry2 = hook.apis.get(apiId);
      if (!entry2)
        return;
      entry2.logs.push({
        time: /* @__PURE__ */ new Date(),
        event: e.event,
        data: e.payload
      });
      if (entry2.logs.length > _DevToolsProviderApi.MAX_EVENT_LOGS_PER_API) {
        entry2.logs = entry2.logs.slice(-_DevToolsProviderApi.MAX_EVENT_LOGS_PER_API);
      }
      _DevToolsProviderApi.notifyListeners(apiId);
    });
    const stateUnsubscribe = (_b = aui.subscribe) == null ? void 0 : _b.call(aui, () => {
      _DevToolsProviderApi.notifyListeners(apiId);
    });
    hook.apis.set(apiId, entry);
    _DevToolsProviderApi.notifyListeners(apiId);
    return () => {
      const hook2 = getHook();
      const entry2 = hook2.apis.get(apiId);
      if (!entry2)
        return;
      eventUnsubscribe == null ? void 0 : eventUnsubscribe();
      stateUnsubscribe == null ? void 0 : stateUnsubscribe();
      hook2.apis.delete(apiId);
      _DevToolsProviderApi.notifyListeners(apiId);
    };
  }
  static notifyListeners(apiId) {
    const hook = getHook();
    hook.listeners.forEach((listener) => listener(apiId));
  }
};
__publicField(_DevToolsProviderApi, "MAX_EVENT_LOGS_PER_API", 200);
var DevToolsProviderApi = _DevToolsProviderApi;

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/AssistantRuntimeProvider.js
var DevToolsRegistration = () => {
  const aui = useAui();
  (0, import_react17.useEffect)(() => {
    if (typeof process === "undefined" || false)
      return;
    return DevToolsProviderApi.register(aui);
  }, [aui]);
  return null;
};
var AssistantRuntimeProviderImpl = ({ children, aui, runtime }) => {
  return (0, import_jsx_runtime2.jsxs)(AssistantProviderBase, { runtime, aui: aui ?? null, children: [(0, import_jsx_runtime2.jsx)(DevToolsRegistration, {}), (0, import_jsx_runtime2.jsx)(ThreadPrimitiveViewportProvider, { children })] });
};
var AssistantRuntimeProvider = (0, import_react17.memo)(AssistantRuntimeProviderImpl);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/providers/MessageProvider.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var MessageProvider = ({ children, ...props }) => {
  const aui = useAui({
    message: ThreadMessageClient(props)
  });
  return (0, import_jsx_runtime3.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/react/utils/useRuntimeState.js
var import_react26 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/react/utils/ensureBinding.js
var debugVerifyPrototype = (runtime, prototype) => {
  const unboundMethods = Object.getOwnPropertyNames(prototype).filter((methodStr) => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, methodStr);
    const isMethod = descriptor && typeof descriptor.value === "function";
    if (!isMethod)
      return false;
    const methodName = methodStr;
    return isMethod && !methodName.startsWith("_") && methodName !== "constructor" && prototype[methodName] === runtime[methodName];
  });
  if (unboundMethods.length > 0) {
    throw new Error(`The following methods are not bound: ${JSON.stringify(unboundMethods)}`);
  }
  const prototypePrototype = Object.getPrototypeOf(prototype);
  if (prototypePrototype && prototypePrototype !== Object.prototype) {
    debugVerifyPrototype(runtime, prototypePrototype);
  }
};
var ensureBinding = (r) => {
  var _a2;
  const runtime = r;
  if (runtime.__isBound)
    return;
  (_a2 = runtime.__internal_bindMethods) == null ? void 0 : _a2.call(runtime);
  runtime.__isBound = true;
  if (true) {
    debugVerifyPrototype(runtime, Object.getPrototypeOf(runtime));
  }
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/react/utils/useRuntimeState.js
function useRuntimeStateInternal(runtime, selector = identity) {
  ensureBinding(runtime);
  const slice = (0, import_react26.useSyncExternalStore)(runtime.subscribe, () => selector(runtime.getState()), () => selector(runtime.getState()));
  (0, import_react26.useDebugValue)(slice);
  return slice;
}
var identity = (arg) => arg;

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/context/react/utils/createStateHookForRuntime.js
function createStateHookForRuntime(useRuntime) {
  function useStoreHook(param) {
    let optional = false;
    let selector;
    if (typeof param === "function") {
      selector = param;
    } else if (param) {
      optional = !!param.optional;
      selector = param.selector;
    }
    const store = useRuntime({ optional });
    if (!store)
      return null;
    return useRuntimeStateInternal(store, selector);
  }
  return useStoreHook;
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/hooks/AssistantContext.js
function useAssistantRuntime(options) {
  var _a2, _b;
  const aui = useAui();
  const runtime = ((_b = (_a2 = aui.threads()).__internal_getAssistantRuntime) == null ? void 0 : _b.call(_a2)) ?? null;
  if (!runtime && !(options == null ? void 0 : options.optional)) {
    throw new Error("AssistantRuntime is not available");
  }
  return runtime;
}
var useThreadListRuntime = (opt) => {
  var _a2;
  return ((_a2 = useAssistantRuntime(opt)) == null ? void 0 : _a2.threads) ?? null;
};
var useThreadList = createStateHookForRuntime(useThreadListRuntime);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/hooks/AttachmentContext.js
function useAttachmentRuntime(options) {
  const aui = useAui();
  const runtime = useAuiState(() => {
    var _a2, _b;
    return aui.attachment.source ? ((_b = (_a2 = aui.attachment()).__internal_getRuntime) == null ? void 0 : _b.call(_a2)) ?? null : null;
  });
  if (!runtime && !(options == null ? void 0 : options.optional)) {
    throw new Error("AttachmentRuntime is not available");
  }
  return runtime;
}
function useThreadComposerAttachmentRuntime(options) {
  const attachmentRuntime = useAttachmentRuntime(options);
  if (!attachmentRuntime)
    return null;
  if (attachmentRuntime.source !== "thread-composer")
    throw new Error("This component must be used within a thread's ComposerPrimitive.Attachments component.");
  return attachmentRuntime;
}
function useEditComposerAttachmentRuntime(options) {
  const attachmentRuntime = useAttachmentRuntime(options);
  if (!attachmentRuntime)
    return null;
  if (attachmentRuntime.source !== "edit-composer")
    throw new Error("This component must be used within a message's ComposerPrimitive.Attachments component.");
  return attachmentRuntime;
}
function useMessageAttachmentRuntime(options) {
  const attachmentRuntime = useAttachmentRuntime(options);
  if (!attachmentRuntime)
    return null;
  if (attachmentRuntime.source !== "message")
    throw new Error("This component must be used within a MessagePrimitive.Attachments component.");
  return attachmentRuntime;
}
var useAttachment = createStateHookForRuntime(useAttachmentRuntime);
var useThreadComposerAttachment = createStateHookForRuntime(useThreadComposerAttachmentRuntime);
var useEditComposerAttachment = createStateHookForRuntime(useEditComposerAttachmentRuntime);
var useMessageAttachment = createStateHookForRuntime(useMessageAttachmentRuntime);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/hooks/ComposerContext.js
function useComposerRuntime(options) {
  const aui = useAui();
  const runtime = useAuiState(() => {
    var _a2, _b;
    return aui.composer.source ? ((_b = (_a2 = aui.composer()).__internal_getRuntime) == null ? void 0 : _b.call(_a2)) ?? null : null;
  });
  if (!runtime && !(options == null ? void 0 : options.optional)) {
    throw new Error("ComposerRuntime is not available");
  }
  return runtime;
}
var useComposer = createStateHookForRuntime(useComposerRuntime);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/hooks/MessageContext.js
function useMessageRuntime(options) {
  const aui = useAui();
  const runtime = useAuiState(() => {
    var _a2, _b;
    return aui.message.source ? ((_b = (_a2 = aui.message()).__internal_getRuntime) == null ? void 0 : _b.call(_a2)) ?? null : null;
  });
  if (!runtime && !(options == null ? void 0 : options.optional)) {
    throw new Error("MessageRuntime is not available");
  }
  return runtime;
}
var useMessage = createStateHookForRuntime(useMessageRuntime);
var useEditComposerRuntime = (opt) => {
  var _a2;
  return ((_a2 = useMessageRuntime(opt)) == null ? void 0 : _a2.composer) ?? null;
};
var useEditComposer = createStateHookForRuntime(useEditComposerRuntime);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/hooks/MessagePartContext.js
function useMessagePartRuntime(options) {
  const aui = useAui();
  const runtime = useAuiState(() => {
    var _a2, _b;
    return aui.part.source ? ((_b = (_a2 = aui.part()).__internal_getRuntime) == null ? void 0 : _b.call(_a2)) ?? null : null;
  });
  if (!runtime && !(options == null ? void 0 : options.optional)) {
    throw new Error("MessagePartRuntime is not available");
  }
  return runtime;
}
var useMessagePart = createStateHookForRuntime(useMessagePartRuntime);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/hooks/ThreadContext.js
var import_react27 = __toESM(require_react(), 1);
function useThreadRuntime(options) {
  const aui = useAui();
  const runtime = useAuiState(() => {
    var _a2, _b;
    return aui.thread.source ? ((_b = (_a2 = aui.thread()).__internal_getRuntime) == null ? void 0 : _b.call(_a2)) ?? null : null;
  });
  if (!runtime && !(options == null ? void 0 : options.optional)) {
    throw new Error("ThreadRuntime is not available");
  }
  return runtime;
}
var useThread = createStateHookForRuntime(useThreadRuntime);
var useThreadComposerRuntime = (opt) => {
  var _a2;
  return ((_a2 = useThreadRuntime(opt)) == null ? void 0 : _a2.composer) ?? null;
};
var useThreadComposer = createStateHookForRuntime(useThreadComposerRuntime);
function useThreadModelContext(options) {
  const [, rerender] = (0, import_react27.useState)({});
  const runtime = useThreadRuntime(options);
  useAuiEvent("thread.modelContextUpdate", () => rerender({}));
  if (!runtime)
    return null;
  return runtime == null ? void 0 : runtime.getModelContext();
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/legacy-runtime/hooks/ThreadListItemContext.js
function useThreadListItemRuntime(options) {
  const aui = useAui();
  const runtime = useAuiState(() => {
    var _a2, _b;
    return aui.threadListItem.source ? ((_b = (_a2 = aui.threadListItem()).__internal_getRuntime) == null ? void 0 : _b.call(_a2)) ?? null : null;
  });
  if (!runtime && !(options == null ? void 0 : options.optional)) {
    throw new Error("ThreadListItemRuntime is not available");
  }
  return runtime;
}
var useThreadListItem = createStateHookForRuntime(useThreadListItemRuntime);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/model-context/makeAssistantVisible.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var import_react29 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
var React = __toESM(require_react(), 1);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return React.useCallback(composeRefs(...refs), refs);
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/model-context/makeAssistantVisible.js
var click = tool({
  parameters: {
    type: "object",
    properties: {
      clickId: {
        type: "string"
      }
    },
    required: ["clickId"]
  },
  execute: async ({ clickId }) => {
    const escapedClickId = CSS.escape(clickId);
    const el = document.querySelector(`[data-click-id='${escapedClickId}']`);
    if (el instanceof HTMLElement) {
      el.click();
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      return {};
    } else {
      return "Element not found";
    }
  }
});
var edit = tool({
  parameters: {
    type: "object",
    properties: {
      editId: {
        type: "string"
      },
      value: {
        type: "string"
      }
    },
    required: ["editId", "value"]
  },
  execute: async ({ editId, value }) => {
    const escapedEditId = CSS.escape(editId);
    const el = document.querySelector(`[data-edit-id='${escapedEditId}']`);
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      return {};
    } else {
      return "Element not found";
    }
  }
});
var ReadableContext = (0, import_react29.createContext)(false);
var makeAssistantVisible = (Component, config) => {
  const ReadableComponent = (0, import_react29.forwardRef)((props, outerRef) => {
    const isNestedReadable = (0, import_react29.useContext)(ReadableContext);
    const clickId = (0, import_react29.useId)();
    const componentRef = (0, import_react29.useRef)(null);
    const aui = useAui();
    const { clickable, editable } = config ?? {};
    (0, import_react29.useEffect)(() => {
      return aui.modelContext().register({
        getModelContext: () => {
          var _a2;
          return {
            tools: {
              ...clickable ? { click } : {},
              ...editable ? { edit } : {}
            },
            system: !isNestedReadable ? (_a2 = componentRef.current) == null ? void 0 : _a2.outerHTML : void 0
          };
        }
      });
    }, [isNestedReadable, aui, clickable, editable]);
    const ref = useComposedRefs(componentRef, outerRef);
    return (0, import_jsx_runtime4.jsx)(ReadableContext.Provider, { value: true, children: (0, import_jsx_runtime4.jsx)(Component, { ...props, ...(config == null ? void 0 : config.clickable) ? { "data-click-id": clickId } : {}, ...(config == null ? void 0 : config.editable) ? { "data-edit-id": clickId } : {}, ref }) });
  });
  ReadableComponent.displayName = Component.displayName;
  return ReadableComponent;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/model-context/frame/useAssistantFrameHost.js
var import_react30 = __toESM(require_react(), 1);
var useAssistantFrameHost = ({ iframeRef, targetOrigin = "*", register }) => {
  (0, import_react30.useEffect)(() => {
    var _a2;
    const iframeWindow = (_a2 = iframeRef.current) == null ? void 0 : _a2.contentWindow;
    if (!iframeWindow)
      return;
    const frameHost = new AssistantFrameHost(iframeWindow, targetOrigin);
    const unsubscribe = register(frameHost);
    return () => {
      frameHost.dispose();
      unsubscribe();
    };
  }, [iframeRef, targetOrigin, register]);
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar.js
var actionBar_exports = {};
__export(actionBar_exports, {
  Copy: () => ActionBarPrimitiveCopy,
  Edit: () => ActionBarPrimitiveEdit,
  ExportMarkdown: () => ActionBarPrimitiveExportMarkdown,
  FeedbackNegative: () => ActionBarPrimitiveFeedbackNegative,
  FeedbackPositive: () => ActionBarPrimitiveFeedbackPositive,
  Reload: () => ActionBarPrimitiveReload,
  Root: () => ActionBarPrimitiveRoot,
  Speak: () => ActionBarPrimitiveSpeak,
  StopSpeaking: () => ActionBarPrimitiveStopSpeaking
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarRoot.js
var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/utils/Primitive.js
var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
var import_react31 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.14__@types+re_0243fb2db8a1fb85ca77b8d9e5c2d650/node_modules/@radix-ui/react-primitive/dist/index.mjs
var React3 = __toESM(require_react(), 1);
var ReactDOM = __toESM(require_react_dom(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-slot/dist/index.mjs
var React2 = __toESM(require_react(), 1);
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use = React2[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
function createSlot(ownerName) {
  const SlotClone = createSlotClone(ownerName);
  const Slot22 = React2.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = React2.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (React2.Children.count(newElement) > 1) return React2.Children.only(null);
          return React2.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return (0, import_jsx_runtime5.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children: React2.isValidElement(newElement) ? React2.cloneElement(newElement, void 0, newChildren) : null });
    }
    return (0, import_jsx_runtime5.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot22.displayName = `${ownerName}.Slot`;
  return Slot22;
}
var Slot = createSlot("Slot");
function createSlotClone(ownerName) {
  const SlotClone = React2.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (React2.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== React2.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return React2.cloneElement(children, props2);
    }
    return React2.Children.count(children) > 1 ? React2.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function createSlottable(ownerName) {
  const Slottable22 = ({ children }) => {
    return (0, import_jsx_runtime5.jsx)(import_jsx_runtime5.Fragment, { children });
  };
  Slottable22.displayName = `${ownerName}.Slottable`;
  Slottable22.__radixId = SLOTTABLE_IDENTIFIER;
  return Slottable22;
}
var Slottable = createSlottable("Slottable");
function isSlottable(child) {
  return React2.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a2, _b;
  let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

// ../../node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.14__@types+re_0243fb2db8a1fb85ca77b8d9e5c2d650/node_modules/@radix-ui/react-primitive/dist/index.mjs
var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot7 = createSlot(`Primitive.${node}`);
  const Node2 = React3.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot7 : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return (0, import_jsx_runtime6.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node2.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node2 };
}, {});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/utils/Primitive.js
var NODES2 = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
function createPrimitive(node) {
  const RadixComp = Primitive[node];
  const Component = (0, import_react31.forwardRef)(({ render, asChild, children, ...props }, ref) => {
    if (render && (0, import_react31.isValidElement)(render)) {
      const renderChildren = children !== void 0 ? children : render.props.children;
      return (0, import_jsx_runtime7.jsx)(RadixComp, { asChild: true, ...props, ref, children: (0, import_react31.cloneElement)(render, void 0, renderChildren) });
    }
    return (0, import_jsx_runtime7.jsx)(RadixComp, { asChild, ...props, ref, children });
  });
  Component.displayName = `Primitive.${node}`;
  return Component;
}
var Primitive2 = NODES2.reduce((acc, node) => {
  acc[node] = createPrimitive(node);
  return acc;
}, {});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarRoot.js
var import_react33 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/useActionBarFloatStatus.js
var HideAndFloatStatus;
(function(HideAndFloatStatus2) {
  HideAndFloatStatus2["Hidden"] = "hidden";
  HideAndFloatStatus2["Floating"] = "floating";
  HideAndFloatStatus2["Normal"] = "normal";
})(HideAndFloatStatus || (HideAndFloatStatus = {}));
var useActionBarFloatStatus = ({ hideWhenRunning, autohide, autohideFloat, forceVisible }) => {
  return useAuiState((s) => {
    if (hideWhenRunning && s.thread.isRunning)
      return HideAndFloatStatus.Hidden;
    const autohideEnabled = autohide === "always" || autohide === "not-last" && !s.message.isLast;
    const isVisibleByInteraction = forceVisible || s.message.isHovering;
    if (!autohideEnabled)
      return HideAndFloatStatus.Normal;
    if (!isVisibleByInteraction)
      return HideAndFloatStatus.Hidden;
    if (autohideFloat === "always" || autohideFloat === "single-branch" && s.message.branchCount <= 1)
      return HideAndFloatStatus.Floating;
    return HideAndFloatStatus.Normal;
  });
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarInteractionContext.js
var import_react32 = __toESM(require_react(), 1);
var ActionBarInteractionContext = (0, import_react32.createContext)(null);
var useActionBarInteractionContext = () => (0, import_react32.useContext)(ActionBarInteractionContext);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarRoot.js
var ActionBarPrimitiveRoot = (0, import_react33.forwardRef)(({ hideWhenRunning, autohide, autohideFloat, ...rest }, ref) => {
  const [interactionCount, setInteractionCount] = (0, import_react33.useState)(0);
  const acquireInteractionLock = (0, import_react33.useCallback)(() => {
    let released = false;
    setInteractionCount((count3) => count3 + 1);
    return () => {
      if (released)
        return;
      released = true;
      setInteractionCount((count3) => Math.max(0, count3 - 1));
    };
  }, []);
  const interactionContext = (0, import_react33.useMemo)(() => ({ acquireInteractionLock }), [acquireInteractionLock]);
  const hideAndfloatStatus = useActionBarFloatStatus({
    hideWhenRunning,
    autohide,
    autohideFloat,
    forceVisible: interactionCount > 0
  });
  if (hideAndfloatStatus === HideAndFloatStatus.Hidden)
    return null;
  return (0, import_jsx_runtime8.jsx)(ActionBarInteractionContext.Provider, { value: interactionContext, children: (0, import_jsx_runtime8.jsx)(Primitive2.div, { ...hideAndfloatStatus === HideAndFloatStatus.Floating ? { "data-floating": "true" } : null, ...rest, ref }) });
});
ActionBarPrimitiveRoot.displayName = "ActionBarPrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarCopy.js
var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
var import_react34 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler == null ? void 0 : originalEventHandler(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler == null ? void 0 : ourEventHandler(event);
    }
  };
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarCopy.js
var useActionBarPrimitiveCopy = ({ copiedDuration = 3e3 } = {}) => {
  const { copy, disabled } = useActionBarCopy({
    copiedDuration,
    copyToClipboard: (text) => navigator.clipboard.writeText(text)
  });
  if (disabled)
    return null;
  return copy;
};
var ActionBarPrimitiveCopy = (0, import_react34.forwardRef)(({ copiedDuration, onClick, disabled, ...props }, forwardedRef) => {
  const isCopied = useAuiState((s) => s.message.isCopied);
  const callback = useActionBarPrimitiveCopy({ copiedDuration });
  return (0, import_jsx_runtime9.jsx)(Primitive2.button, { type: "button", ...isCopied ? { "data-copied": "true" } : {}, ...props, ref: forwardedRef, disabled: disabled || !callback, onClick: composeEventHandlers(onClick, () => {
    callback == null ? void 0 : callback();
  }) });
});
ActionBarPrimitiveCopy.displayName = "ActionBarPrimitive.Copy";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/utils/createActionButton.js
var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
var import_react36 = __toESM(require_react(), 1);
var createActionButton = (displayName, useActionButton, forwardProps = []) => {
  const ActionButton = (0, import_react36.forwardRef)((props, forwardedRef) => {
    const forwardedProps = {};
    const primitiveProps = {};
    Object.keys(props).forEach((key) => {
      if (forwardProps.includes(key)) {
        forwardedProps[key] = props[key];
      } else {
        primitiveProps[key] = props[key];
      }
    });
    const callback = useActionButton(forwardedProps) ?? void 0;
    return (0, import_jsx_runtime10.jsx)(Primitive2.button, { ...primitiveProps, type: "button", ref: forwardedRef, disabled: primitiveProps.disabled || !callback, onClick: composeEventHandlers(primitiveProps.onClick, callback) });
  });
  ActionButton.displayName = displayName;
  return ActionButton;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarReload.js
var useActionBarReload2 = () => {
  const { disabled, reload } = useActionBarReload();
  if (disabled)
    return null;
  return reload;
};
var ActionBarPrimitiveReload = createActionButton("ActionBarPrimitive.Reload", useActionBarReload2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarEdit.js
var useActionBarEdit2 = () => {
  const { disabled, edit: edit2 } = useActionBarEdit();
  if (disabled)
    return null;
  return edit2;
};
var ActionBarPrimitiveEdit = createActionButton("ActionBarPrimitive.Edit", useActionBarEdit2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarSpeak.js
var useActionBarSpeak2 = () => {
  const { disabled, speak } = useActionBarSpeak();
  if (disabled)
    return null;
  return speak;
};
var ActionBarPrimitiveSpeak = createActionButton("ActionBarPrimitive.Speak", useActionBarSpeak2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarStopSpeaking.js
var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);
var import_react40 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-use-escape-keydown@1.1.1_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs
var React5 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var React4 = __toESM(require_react(), 1);
function useCallbackRef(callback) {
  const callbackRef = React4.useRef(callback);
  React4.useEffect(() => {
    callbackRef.current = callback;
  });
  return React4.useMemo(() => (...args) => {
    var _a2;
    return (_a2 = callbackRef.current) == null ? void 0 : _a2.call(callbackRef, ...args);
  }, []);
}

// ../../node_modules/.pnpm/@radix-ui+react-use-escape-keydown@1.1.1_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs
function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis == null ? void 0 : globalThis.document) {
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);
  React5.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscapeKeyDown(event);
      }
    };
    ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [onEscapeKeyDown, ownerDocument]);
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarStopSpeaking.js
var useActionBarStopSpeaking2 = () => {
  const { disabled, stopSpeaking } = useActionBarStopSpeaking();
  if (disabled)
    return null;
  return stopSpeaking;
};
var ActionBarPrimitiveStopSpeaking = (0, import_react40.forwardRef)((props, ref) => {
  const callback = useActionBarStopSpeaking2();
  useEscapeKeydown((e) => {
    if (callback) {
      e.preventDefault();
      callback();
    }
  });
  return (0, import_jsx_runtime11.jsx)(Primitive2.button, { type: "button", disabled: !callback, ...props, ref, onClick: composeEventHandlers(props.onClick, () => {
    callback == null ? void 0 : callback();
  }) });
});
ActionBarPrimitiveStopSpeaking.displayName = "ActionBarPrimitive.StopSpeaking";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarFeedbackPositive.js
var import_jsx_runtime12 = __toESM(require_jsx_runtime(), 1);
var import_react42 = __toESM(require_react(), 1);
var useActionBarFeedbackPositive2 = () => {
  const { submit } = useActionBarFeedbackPositive();
  return submit;
};
var ActionBarPrimitiveFeedbackPositive = (0, import_react42.forwardRef)(({ onClick, disabled, ...props }, forwardedRef) => {
  const isSubmitted = useAuiState((s) => {
    var _a2;
    return ((_a2 = s.message.metadata.submittedFeedback) == null ? void 0 : _a2.type) === "positive";
  });
  const callback = useActionBarFeedbackPositive2();
  return (0, import_jsx_runtime12.jsx)(Primitive2.button, { type: "button", ...isSubmitted ? { "data-submitted": "true" } : {}, ...props, ref: forwardedRef, disabled: disabled || !callback, onClick: composeEventHandlers(onClick, () => {
    callback == null ? void 0 : callback();
  }) });
});
ActionBarPrimitiveFeedbackPositive.displayName = "ActionBarPrimitive.FeedbackPositive";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarFeedbackNegative.js
var import_jsx_runtime13 = __toESM(require_jsx_runtime(), 1);
var import_react44 = __toESM(require_react(), 1);
var useActionBarFeedbackNegative2 = () => {
  const { submit } = useActionBarFeedbackNegative();
  return submit;
};
var ActionBarPrimitiveFeedbackNegative = (0, import_react44.forwardRef)(({ onClick, disabled, ...props }, forwardedRef) => {
  const isSubmitted = useAuiState((s) => {
    var _a2;
    return ((_a2 = s.message.metadata.submittedFeedback) == null ? void 0 : _a2.type) === "negative";
  });
  const callback = useActionBarFeedbackNegative2();
  return (0, import_jsx_runtime13.jsx)(Primitive2.button, { type: "button", ...isSubmitted ? { "data-submitted": "true" } : {}, ...props, ref: forwardedRef, disabled: disabled || !callback, onClick: composeEventHandlers(onClick, () => {
    callback == null ? void 0 : callback();
  }) });
});
ActionBarPrimitiveFeedbackNegative.displayName = "ActionBarPrimitive.FeedbackNegative";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBar/ActionBarExportMarkdown.js
var import_jsx_runtime14 = __toESM(require_jsx_runtime(), 1);
var import_react46 = __toESM(require_react(), 1);
var useActionBarExportMarkdown = ({ filename, onExport } = {}) => {
  const aui = useAui();
  const hasExportableContent = useAuiState((s) => {
    var _a2;
    return (s.message.role !== "assistant" || ((_a2 = s.message.status) == null ? void 0 : _a2.type) !== "running") && s.message.parts.some((c) => c.type === "text" && c.text.length > 0);
  });
  const callback = (0, import_react46.useCallback)(async () => {
    const content = aui.message().getCopyText();
    if (!content)
      return;
    if (onExport) {
      await onExport(content);
      return;
    }
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? `message-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [aui, filename, onExport]);
  if (!hasExportableContent)
    return null;
  return callback;
};
var ActionBarPrimitiveExportMarkdown = (0, import_react46.forwardRef)(({ filename, onExport, onClick, disabled, ...props }, forwardedRef) => {
  const callback = useActionBarExportMarkdown({ filename, onExport });
  return (0, import_jsx_runtime14.jsx)(Primitive2.button, { type: "button", ...props, ref: forwardedRef, disabled: disabled || !callback, onClick: composeEventHandlers(onClick, () => {
    callback == null ? void 0 : callback();
  }) });
});
ActionBarPrimitiveExportMarkdown.displayName = "ActionBarPrimitive.ExportMarkdown";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBarMore.js
var actionBarMore_exports = {};
__export(actionBarMore_exports, {
  Content: () => ActionBarMorePrimitiveContent,
  Item: () => ActionBarMorePrimitiveItem,
  Root: () => ActionBarMorePrimitiveRoot,
  Separator: () => ActionBarMorePrimitiveSeparator,
  Trigger: () => ActionBarMorePrimitiveTrigger
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBarMore/ActionBarMoreRoot.js
var import_jsx_runtime61 = __toESM(require_jsx_runtime(), 1);
var import_react55 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-accessible-icon@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@ty_d82538e2dc1c85e81d10c78e4650fbee/node_modules/@radix-ui/react-accessible-icon/dist/index.mjs
var React9 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-visually-hidden@1.2.3_@types+react-dom@19.2.3_@types+react@19.2.14__@ty_fa89646d7248b32d1762bf88948f6339/node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
var React8 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-primitive@2.1.3_@types+react-dom@19.2.3_@types+react@19.2.14__@types+re_1181ea5061ec9212248424669240e4ec/node_modules/@radix-ui/react-primitive/dist/index.mjs
var React7 = __toESM(require_react(), 1);
var ReactDOM2 = __toESM(require_react_dom(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-slot@1.2.3_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-slot/dist/index.mjs
var dist_exports = {};
__export(dist_exports, {
  Root: () => Slot2,
  Slot: () => Slot2,
  Slottable: () => Slottable2,
  createSlot: () => createSlot2,
  createSlottable: () => createSlottable2
});
var React6 = __toESM(require_react(), 1);
var import_jsx_runtime15 = __toESM(require_jsx_runtime(), 1);
function createSlot2(ownerName) {
  const SlotClone = createSlotClone2(ownerName);
  const Slot22 = React6.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = React6.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable2);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (React6.Children.count(newElement) > 1) return React6.Children.only(null);
          return React6.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return (0, import_jsx_runtime15.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children: React6.isValidElement(newElement) ? React6.cloneElement(newElement, void 0, newChildren) : null });
    }
    return (0, import_jsx_runtime15.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot22.displayName = `${ownerName}.Slot`;
  return Slot22;
}
var Slot2 = createSlot2("Slot");
function createSlotClone2(ownerName) {
  const SlotClone = React6.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (React6.isValidElement(children)) {
      const childrenRef = getElementRef2(children);
      const props2 = mergeProps2(slotProps, children.props);
      if (children.type !== React6.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return React6.cloneElement(children, props2);
    }
    return React6.Children.count(children) > 1 ? React6.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER2 = Symbol("radix.slottable");
function createSlottable2(ownerName) {
  const Slottable22 = ({ children }) => {
    return (0, import_jsx_runtime15.jsx)(import_jsx_runtime15.Fragment, { children });
  };
  Slottable22.displayName = `${ownerName}.Slottable`;
  Slottable22.__radixId = SLOTTABLE_IDENTIFIER2;
  return Slottable22;
}
var Slottable2 = createSlottable2("Slottable");
function isSlottable2(child) {
  return React6.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER2;
}
function mergeProps2(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef2(element) {
  var _a2, _b;
  let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

// ../../node_modules/.pnpm/@radix-ui+react-primitive@2.1.3_@types+react-dom@19.2.3_@types+react@19.2.14__@types+re_1181ea5061ec9212248424669240e4ec/node_modules/@radix-ui/react-primitive/dist/index.mjs
var import_jsx_runtime16 = __toESM(require_jsx_runtime(), 1);
var NODES3 = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive3 = NODES3.reduce((primitive, node) => {
  const Slot7 = createSlot2(`Primitive.${node}`);
  const Node2 = React7.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot7 : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return (0, import_jsx_runtime16.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node2.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node2 };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) ReactDOM2.flushSync(() => target.dispatchEvent(event));
}
var Root = Primitive3;

// ../../node_modules/.pnpm/@radix-ui+react-visually-hidden@1.2.3_@types+react-dom@19.2.3_@types+react@19.2.14__@ty_fa89646d7248b32d1762bf88948f6339/node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
var import_jsx_runtime17 = __toESM(require_jsx_runtime(), 1);
var VISUALLY_HIDDEN_STYLES = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
});
var NAME = "VisuallyHidden";
var VisuallyHidden = React8.forwardRef(
  (props, forwardedRef) => {
    return (0, import_jsx_runtime17.jsx)(
      Primitive3.span,
      {
        ...props,
        ref: forwardedRef,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style }
      }
    );
  }
);
VisuallyHidden.displayName = NAME;
var Root2 = VisuallyHidden;

// ../../node_modules/.pnpm/@radix-ui+react-accessible-icon@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@ty_d82538e2dc1c85e81d10c78e4650fbee/node_modules/@radix-ui/react-accessible-icon/dist/index.mjs
var import_jsx_runtime18 = __toESM(require_jsx_runtime(), 1);
var NAME2 = "AccessibleIcon";
var AccessibleIcon = ({ children, label }) => {
  const child = React9.Children.only(children);
  return (0, import_jsx_runtime18.jsxs)(import_jsx_runtime18.Fragment, { children: [
    React9.cloneElement(child, {
      // accessibility
      "aria-hidden": "true",
      focusable: "false"
      // See: https://allyjs.io/tutorials/focusing-in-svg.html#making-svg-elements-focusable
    }),
    (0, import_jsx_runtime18.jsx)(Root2, { children: label })
  ] });
};
AccessibleIcon.displayName = NAME2;

// ../../node_modules/.pnpm/@radix-ui+react-accordion@1.2.12_@types+react-dom@19.2.3_@types+react@19.2.14__@types+r_8b3df72274e0fa0cff1629993ef7cc33/node_modules/@radix-ui/react-accordion/dist/index.mjs
var import_react49 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-context@1.1.2_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-context/dist/index.mjs
var React10 = __toESM(require_react(), 1);
var import_jsx_runtime19 = __toESM(require_jsx_runtime(), 1);
function createContext22(rootComponentName, defaultContext) {
  const Context = React10.createContext(defaultContext);
  const Provider = (props) => {
    const { children, ...context } = props;
    const value = React10.useMemo(() => context, Object.values(context));
    return (0, import_jsx_runtime19.jsx)(Context.Provider, { value, children });
  };
  Provider.displayName = rootComponentName + "Provider";
  function useContext22(consumerName) {
    const context = React10.useContext(Context);
    if (context) return context;
    if (defaultContext !== void 0) return defaultContext;
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  }
  return [Provider, useContext22];
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext32(rootComponentName, defaultContext) {
    const BaseContext = React10.createContext(defaultContext);
    const index4 = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      var _a2;
      const { scope, children, ...context } = props;
      const Context = ((_a2 = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a2[index4]) || BaseContext;
      const value = React10.useMemo(() => context, Object.values(context));
      return (0, import_jsx_runtime19.jsx)(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext22(consumerName, scope) {
      var _a2;
      const Context = ((_a2 = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a2[index4]) || BaseContext;
      const context = React10.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext22];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return React10.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
      return React10.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext32, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return React10.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

// ../../node_modules/.pnpm/@radix-ui+react-collection@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types+r_161926fa2509d0b7370b60b8bb4eb8b0/node_modules/@radix-ui/react-collection/dist/index.mjs
var import_react47 = __toESM(require_react(), 1);
var import_jsx_runtime20 = __toESM(require_jsx_runtime(), 1);
var import_react48 = __toESM(require_react(), 1);
var import_jsx_runtime21 = __toESM(require_jsx_runtime(), 1);
function createCollection(name) {
  const PROVIDER_NAME3 = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope10] = createContextScope(PROVIDER_NAME3);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME3,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  );
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = import_react47.default.useRef(null);
    const itemMap = import_react47.default.useRef(/* @__PURE__ */ new Map()).current;
    return (0, import_jsx_runtime20.jsx)(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
  };
  CollectionProvider.displayName = PROVIDER_NAME3;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot2(COLLECTION_SLOT_NAME);
  const CollectionSlot = import_react47.default.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return (0, import_jsx_runtime20.jsx)(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot2(ITEM_SLOT_NAME);
  const CollectionItemSlot = import_react47.default.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = import_react47.default.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      import_react47.default.useEffect(() => {
        context.itemMap.set(ref, { ref, ...itemData });
        return () => void context.itemMap.delete(ref);
      });
      return (0, import_jsx_runtime20.jsx)(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection10(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = import_react47.default.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection10,
    createCollectionScope10
  ];
}
var __instanciated = /* @__PURE__ */ new WeakMap();
var _keys, _a;
var OrderedDict = (_a = class extends Map {
  constructor(entries) {
    super(entries);
    __privateAdd(this, _keys);
    __privateSet(this, _keys, [...super.keys()]);
    __instanciated.set(this, true);
  }
  set(key, value) {
    if (__instanciated.get(this)) {
      if (this.has(key)) {
        __privateGet(this, _keys)[__privateGet(this, _keys).indexOf(key)] = key;
      } else {
        __privateGet(this, _keys).push(key);
      }
    }
    super.set(key, value);
    return this;
  }
  insert(index4, key, value) {
    const has = this.has(key);
    const length = __privateGet(this, _keys).length;
    const relativeIndex = toSafeInteger(index4);
    let actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
    const safeIndex = actualIndex < 0 || actualIndex >= length ? -1 : actualIndex;
    if (safeIndex === this.size || has && safeIndex === this.size - 1 || safeIndex === -1) {
      this.set(key, value);
      return this;
    }
    const size4 = this.size + (has ? 0 : 1);
    if (relativeIndex < 0) {
      actualIndex++;
    }
    const keys = [...__privateGet(this, _keys)];
    let nextValue;
    let shouldSkip = false;
    for (let i = actualIndex; i < size4; i++) {
      if (actualIndex === i) {
        let nextKey = keys[i];
        if (keys[i] === key) {
          nextKey = keys[i + 1];
        }
        if (has) {
          this.delete(key);
        }
        nextValue = this.get(nextKey);
        this.set(key, value);
      } else {
        if (!shouldSkip && keys[i - 1] === key) {
          shouldSkip = true;
        }
        const currentKey = keys[shouldSkip ? i : i - 1];
        const currentValue = nextValue;
        nextValue = this.get(currentKey);
        this.delete(currentKey);
        this.set(currentKey, currentValue);
      }
    }
    return this;
  }
  with(index4, key, value) {
    const copy = new _a(this);
    copy.insert(index4, key, value);
    return copy;
  }
  before(key) {
    const index4 = __privateGet(this, _keys).indexOf(key) - 1;
    if (index4 < 0) {
      return void 0;
    }
    return this.entryAt(index4);
  }
  /**
   * Sets a new key-value pair at the position before the given key.
   */
  setBefore(key, newKey, value) {
    const index4 = __privateGet(this, _keys).indexOf(key);
    if (index4 === -1) {
      return this;
    }
    return this.insert(index4, newKey, value);
  }
  after(key) {
    let index4 = __privateGet(this, _keys).indexOf(key);
    index4 = index4 === -1 || index4 === this.size - 1 ? -1 : index4 + 1;
    if (index4 === -1) {
      return void 0;
    }
    return this.entryAt(index4);
  }
  /**
   * Sets a new key-value pair at the position after the given key.
   */
  setAfter(key, newKey, value) {
    const index4 = __privateGet(this, _keys).indexOf(key);
    if (index4 === -1) {
      return this;
    }
    return this.insert(index4 + 1, newKey, value);
  }
  first() {
    return this.entryAt(0);
  }
  last() {
    return this.entryAt(-1);
  }
  clear() {
    __privateSet(this, _keys, []);
    return super.clear();
  }
  delete(key) {
    const deleted = super.delete(key);
    if (deleted) {
      __privateGet(this, _keys).splice(__privateGet(this, _keys).indexOf(key), 1);
    }
    return deleted;
  }
  deleteAt(index4) {
    const key = this.keyAt(index4);
    if (key !== void 0) {
      return this.delete(key);
    }
    return false;
  }
  at(index4) {
    const key = at(__privateGet(this, _keys), index4);
    if (key !== void 0) {
      return this.get(key);
    }
  }
  entryAt(index4) {
    const key = at(__privateGet(this, _keys), index4);
    if (key !== void 0) {
      return [key, this.get(key)];
    }
  }
  indexOf(key) {
    return __privateGet(this, _keys).indexOf(key);
  }
  keyAt(index4) {
    return at(__privateGet(this, _keys), index4);
  }
  from(key, offset4) {
    const index4 = this.indexOf(key);
    if (index4 === -1) {
      return void 0;
    }
    let dest = index4 + offset4;
    if (dest < 0) dest = 0;
    if (dest >= this.size) dest = this.size - 1;
    return this.at(dest);
  }
  keyFrom(key, offset4) {
    const index4 = this.indexOf(key);
    if (index4 === -1) {
      return void 0;
    }
    let dest = index4 + offset4;
    if (dest < 0) dest = 0;
    if (dest >= this.size) dest = this.size - 1;
    return this.keyAt(dest);
  }
  find(predicate, thisArg) {
    let index4 = 0;
    for (const entry of this) {
      if (Reflect.apply(predicate, thisArg, [entry, index4, this])) {
        return entry;
      }
      index4++;
    }
    return void 0;
  }
  findIndex(predicate, thisArg) {
    let index4 = 0;
    for (const entry of this) {
      if (Reflect.apply(predicate, thisArg, [entry, index4, this])) {
        return index4;
      }
      index4++;
    }
    return -1;
  }
  filter(predicate, thisArg) {
    const entries = [];
    let index4 = 0;
    for (const entry of this) {
      if (Reflect.apply(predicate, thisArg, [entry, index4, this])) {
        entries.push(entry);
      }
      index4++;
    }
    return new _a(entries);
  }
  map(callbackfn, thisArg) {
    const entries = [];
    let index4 = 0;
    for (const entry of this) {
      entries.push([entry[0], Reflect.apply(callbackfn, thisArg, [entry, index4, this])]);
      index4++;
    }
    return new _a(entries);
  }
  reduce(...args) {
    const [callbackfn, initialValue] = args;
    let index4 = 0;
    let accumulator = initialValue ?? this.at(0);
    for (const entry of this) {
      if (index4 === 0 && args.length === 1) {
        accumulator = entry;
      } else {
        accumulator = Reflect.apply(callbackfn, this, [accumulator, entry, index4, this]);
      }
      index4++;
    }
    return accumulator;
  }
  reduceRight(...args) {
    const [callbackfn, initialValue] = args;
    let accumulator = initialValue ?? this.at(-1);
    for (let index4 = this.size - 1; index4 >= 0; index4--) {
      const entry = this.at(index4);
      if (index4 === this.size - 1 && args.length === 1) {
        accumulator = entry;
      } else {
        accumulator = Reflect.apply(callbackfn, this, [accumulator, entry, index4, this]);
      }
    }
    return accumulator;
  }
  toSorted(compareFn) {
    const entries = [...this.entries()].sort(compareFn);
    return new _a(entries);
  }
  toReversed() {
    const reversed = new _a();
    for (let index4 = this.size - 1; index4 >= 0; index4--) {
      const key = this.keyAt(index4);
      const element = this.get(key);
      reversed.set(key, element);
    }
    return reversed;
  }
  toSpliced(...args) {
    const entries = [...this.entries()];
    entries.splice(...args);
    return new _a(entries);
  }
  slice(start, end) {
    const result = new _a();
    let stop = this.size - 1;
    if (start === void 0) {
      return result;
    }
    if (start < 0) {
      start = start + this.size;
    }
    if (end !== void 0 && end > 0) {
      stop = end - 1;
    }
    for (let index4 = start; index4 <= stop; index4++) {
      const key = this.keyAt(index4);
      const element = this.get(key);
      result.set(key, element);
    }
    return result;
  }
  every(predicate, thisArg) {
    let index4 = 0;
    for (const entry of this) {
      if (!Reflect.apply(predicate, thisArg, [entry, index4, this])) {
        return false;
      }
      index4++;
    }
    return true;
  }
  some(predicate, thisArg) {
    let index4 = 0;
    for (const entry of this) {
      if (Reflect.apply(predicate, thisArg, [entry, index4, this])) {
        return true;
      }
      index4++;
    }
    return false;
  }
}, _keys = new WeakMap(), _a);
function at(array, index4) {
  if ("at" in Array.prototype) {
    return Array.prototype.at.call(array, index4);
  }
  const actualIndex = toSafeIndex(array, index4);
  return actualIndex === -1 ? void 0 : array[actualIndex];
}
function toSafeIndex(array, index4) {
  const length = array.length;
  const relativeIndex = toSafeInteger(index4);
  const actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
  return actualIndex < 0 || actualIndex >= length ? -1 : actualIndex;
}
function toSafeInteger(number) {
  return number !== number || number === 0 ? 0 : Math.trunc(number);
}
function createCollection2(name) {
  const PROVIDER_NAME3 = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope10] = createContextScope(PROVIDER_NAME3);
  const [CollectionContextProvider, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME3,
    {
      collectionElement: null,
      collectionRef: { current: null },
      collectionRefObject: { current: null },
      itemMap: new OrderedDict(),
      setItemMap: () => void 0
    }
  );
  const CollectionProvider = ({ state, ...props }) => {
    return state ? (0, import_jsx_runtime21.jsx)(CollectionProviderImpl, { ...props, state }) : (0, import_jsx_runtime21.jsx)(CollectionInit, { ...props });
  };
  CollectionProvider.displayName = PROVIDER_NAME3;
  const CollectionInit = (props) => {
    const state = useInitCollection2();
    return (0, import_jsx_runtime21.jsx)(CollectionProviderImpl, { ...props, state });
  };
  CollectionInit.displayName = PROVIDER_NAME3 + "Init";
  const CollectionProviderImpl = (props) => {
    const { scope, children, state } = props;
    const ref = import_react48.default.useRef(null);
    const [collectionElement, setCollectionElement] = import_react48.default.useState(
      null
    );
    const composeRefs2 = useComposedRefs(ref, setCollectionElement);
    const [itemMap, setItemMap] = state;
    import_react48.default.useEffect(() => {
      if (!collectionElement) return;
      const observer = getChildListObserver(() => {
      });
      observer.observe(collectionElement, {
        childList: true,
        subtree: true
      });
      return () => {
        observer.disconnect();
      };
    }, [collectionElement]);
    return (0, import_jsx_runtime21.jsx)(
      CollectionContextProvider,
      {
        scope,
        itemMap,
        setItemMap,
        collectionRef: composeRefs2,
        collectionRefObject: ref,
        collectionElement,
        children
      }
    );
  };
  CollectionProviderImpl.displayName = PROVIDER_NAME3 + "Impl";
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot2(COLLECTION_SLOT_NAME);
  const CollectionSlot = import_react48.default.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return (0, import_jsx_runtime21.jsx)(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot2(ITEM_SLOT_NAME);
  const CollectionItemSlot = import_react48.default.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = import_react48.default.useRef(null);
      const [element, setElement] = import_react48.default.useState(null);
      const composedRefs = useComposedRefs(forwardedRef, ref, setElement);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      const { setItemMap } = context;
      const itemDataRef = import_react48.default.useRef(itemData);
      if (!shallowEqual(itemDataRef.current, itemData)) {
        itemDataRef.current = itemData;
      }
      const memoizedItemData = itemDataRef.current;
      import_react48.default.useEffect(() => {
        const itemData2 = memoizedItemData;
        setItemMap((map) => {
          if (!element) {
            return map;
          }
          if (!map.has(element)) {
            map.set(element, { ...itemData2, element });
            return map.toSorted(sortByDocumentPosition);
          }
          return map.set(element, { ...itemData2, element }).toSorted(sortByDocumentPosition);
        });
        return () => {
          setItemMap((map) => {
            if (!element || !map.has(element)) {
              return map;
            }
            map.delete(element);
            return new OrderedDict(map);
          });
        };
      }, [element, memoizedItemData, setItemMap]);
      return (0, import_jsx_runtime21.jsx)(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useInitCollection2() {
    return import_react48.default.useState(new OrderedDict());
  }
  function useCollection10(scope) {
    const { itemMap } = useCollectionContext(name + "CollectionConsumer", scope);
    return itemMap;
  }
  const functions = {
    createCollectionScope: createCollectionScope10,
    useCollection: useCollection10,
    useInitCollection: useInitCollection2
  };
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    functions
  ];
}
function shallowEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (a == null || b == null) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (a[key] !== b[key]) return false;
  }
  return true;
}
function isElementPreceding(a, b) {
  return !!(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}
function sortByDocumentPosition(a, b) {
  return !a[1].element || !b[1].element ? 0 : isElementPreceding(a[1].element, b[1].element) ? -1 : 1;
}
function getChildListObserver(callback) {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        callback();
        return;
      }
    }
  });
  return observer;
}

// ../../node_modules/.pnpm/@radix-ui+react-use-controllable-state@1.2.2_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var React14 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.1.1_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var React12 = __toESM(require_react(), 1);
var useLayoutEffect2 = (globalThis == null ? void 0 : globalThis.document) ? React12.useLayoutEffect : () => {
};

// ../../node_modules/.pnpm/@radix-ui+react-use-controllable-state@1.2.2_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var React23 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-use-effect-event@0.0.2_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-use-effect-event/dist/index.mjs
var React13 = __toESM(require_react(), 1);
var useReactEffectEvent = React13[" useEffectEvent ".trim().toString()];
var useReactInsertionEffect = React13[" useInsertionEffect ".trim().toString()];
function useEffectEvent(callback) {
  if (typeof useReactEffectEvent === "function") {
    return useReactEffectEvent(callback);
  }
  const ref = React13.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  if (typeof useReactInsertionEffect === "function") {
    useReactInsertionEffect(() => {
      ref.current = callback;
    });
  } else {
    useLayoutEffect2(() => {
      ref.current = callback;
    });
  }
  return React13.useMemo(() => (...args) => {
    var _a2;
    return (_a2 = ref.current) == null ? void 0 : _a2.call(ref, ...args);
  }, []);
}

// ../../node_modules/.pnpm/@radix-ui+react-use-controllable-state@1.2.2_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var useInsertionEffect = React14[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({
  prop,
  defaultProp,
  onChange = () => {
  },
  caller
}) {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
    defaultProp,
    onChange
  });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  if (true) {
    const isControlledRef = React14.useRef(prop !== void 0);
    React14.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? "controlled" : "uncontrolled";
        const to = isControlled ? "controlled" : "uncontrolled";
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }
  const setValue = React14.useCallback(
    (nextValue) => {
      var _a2;
      if (isControlled) {
        const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
        if (value2 !== prop) {
          (_a2 = onChangeRef.current) == null ? void 0 : _a2.call(onChangeRef, value2);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef]
  );
  return [value, setValue];
}
function useUncontrolledState({
  defaultProp,
  onChange
}) {
  const [value, setValue] = React14.useState(defaultProp);
  const prevValueRef = React14.useRef(value);
  const onChangeRef = React14.useRef(onChange);
  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  React14.useEffect(() => {
    var _a2;
    if (prevValueRef.current !== value) {
      (_a2 = onChangeRef.current) == null ? void 0 : _a2.call(onChangeRef, value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef]);
  return [value, setValue, onChangeRef];
}
function isFunction(value) {
  return typeof value === "function";
}
var SYNC_STATE = Symbol("RADIX:SYNC_STATE");

// ../../node_modules/.pnpm/@radix-ui+react-collapsible@1.1.12_@types+react-dom@19.2.3_@types+react@19.2.14__@types_10a2c6d0ac3bcc7422bd3020fe61e076/node_modules/@radix-ui/react-collapsible/dist/index.mjs
var React17 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-presence@1.1.5_@types+react-dom@19.2.3_@types+react@19.2.14__@types+rea_c01c26c80b5ab5e3ecefbda6eca51ad1/node_modules/@radix-ui/react-presence/dist/index.mjs
var React24 = __toESM(require_react(), 1);
var React15 = __toESM(require_react(), 1);
function useStateMachine(initialState, machine) {
  return React15.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child = typeof children === "function" ? children({ present: presence.isPresent }) : React24.Children.only(children);
  const ref = useComposedRefs(presence.ref, getElementRef3(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? React24.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = React24.useState();
  const stylesRef = React24.useRef(null);
  const prevPresentRef = React24.useRef(present);
  const prevAnimationNameRef = React24.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  React24.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  useLayoutEffect2(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || (styles == null ? void 0 : styles.display) === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  useLayoutEffect2(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: React24.useCallback((node2) => {
      stylesRef.current = node2 ? getComputedStyle(node2) : null;
      setNode(node2);
    }, [])
  };
}
function getAnimationName(styles) {
  return (styles == null ? void 0 : styles.animationName) || "none";
}
function getElementRef3(element) {
  var _a2, _b;
  let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

// ../../node_modules/.pnpm/@radix-ui+react-id@1.1.1_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-id/dist/index.mjs
var React16 = __toESM(require_react(), 1);
var useReactId = React16[" useId ".trim().toString()] || (() => void 0);
var count = 0;
function useId2(deterministicId) {
  const [id, setId] = React16.useState(useReactId());
  useLayoutEffect2(() => {
    if (!deterministicId) setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return deterministicId || (id ? `radix-${id}` : "");
}

// ../../node_modules/.pnpm/@radix-ui+react-collapsible@1.1.12_@types+react-dom@19.2.3_@types+react@19.2.14__@types_10a2c6d0ac3bcc7422bd3020fe61e076/node_modules/@radix-ui/react-collapsible/dist/index.mjs
var import_jsx_runtime22 = __toESM(require_jsx_runtime(), 1);
var COLLAPSIBLE_NAME = "Collapsible";
var [createCollapsibleContext, createCollapsibleScope] = createContextScope(COLLAPSIBLE_NAME);
var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME);
var Collapsible = React17.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCollapsible,
      open: openProp,
      defaultOpen,
      disabled,
      onOpenChange,
      ...collapsibleProps
    } = props;
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: COLLAPSIBLE_NAME
    });
    return (0, import_jsx_runtime22.jsx)(
      CollapsibleProvider,
      {
        scope: __scopeCollapsible,
        disabled,
        contentId: useId2(),
        open,
        onOpenToggle: React17.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        children: (0, import_jsx_runtime22.jsx)(
          Primitive3.div,
          {
            "data-state": getState(open),
            "data-disabled": disabled ? "" : void 0,
            ...collapsibleProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Collapsible.displayName = COLLAPSIBLE_NAME;
var TRIGGER_NAME = "CollapsibleTrigger";
var CollapsibleTrigger = React17.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCollapsible, ...triggerProps } = props;
    const context = useCollapsibleContext(TRIGGER_NAME, __scopeCollapsible);
    return (0, import_jsx_runtime22.jsx)(
      Primitive3.button,
      {
        type: "button",
        "aria-controls": context.contentId,
        "aria-expanded": context.open || false,
        "data-state": getState(context.open),
        "data-disabled": context.disabled ? "" : void 0,
        disabled: context.disabled,
        ...triggerProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
CollapsibleTrigger.displayName = TRIGGER_NAME;
var CONTENT_NAME = "CollapsibleContent";
var CollapsibleContent = React17.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useCollapsibleContext(CONTENT_NAME, props.__scopeCollapsible);
    return (0, import_jsx_runtime22.jsx)(Presence, { present: forceMount || context.open, children: ({ present }) => (0, import_jsx_runtime22.jsx)(CollapsibleContentImpl, { ...contentProps, ref: forwardedRef, present }) });
  }
);
CollapsibleContent.displayName = CONTENT_NAME;
var CollapsibleContentImpl = React17.forwardRef((props, forwardedRef) => {
  const { __scopeCollapsible, present, children, ...contentProps } = props;
  const context = useCollapsibleContext(CONTENT_NAME, __scopeCollapsible);
  const [isPresent, setIsPresent] = React17.useState(present);
  const ref = React17.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const heightRef = React17.useRef(0);
  const height = heightRef.current;
  const widthRef = React17.useRef(0);
  const width = widthRef.current;
  const isOpen = context.open || isPresent;
  const isMountAnimationPreventedRef = React17.useRef(isOpen);
  const originalStylesRef = React17.useRef(void 0);
  React17.useEffect(() => {
    const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
    return () => cancelAnimationFrame(rAF);
  }, []);
  useLayoutEffect2(() => {
    const node = ref.current;
    if (node) {
      originalStylesRef.current = originalStylesRef.current || {
        transitionDuration: node.style.transitionDuration,
        animationName: node.style.animationName
      };
      node.style.transitionDuration = "0s";
      node.style.animationName = "none";
      const rect = node.getBoundingClientRect();
      heightRef.current = rect.height;
      widthRef.current = rect.width;
      if (!isMountAnimationPreventedRef.current) {
        node.style.transitionDuration = originalStylesRef.current.transitionDuration;
        node.style.animationName = originalStylesRef.current.animationName;
      }
      setIsPresent(present);
    }
  }, [context.open, present]);
  return (0, import_jsx_runtime22.jsx)(
    Primitive3.div,
    {
      "data-state": getState(context.open),
      "data-disabled": context.disabled ? "" : void 0,
      id: context.contentId,
      hidden: !isOpen,
      ...contentProps,
      ref: composedRefs,
      style: {
        [`--radix-collapsible-content-height`]: height ? `${height}px` : void 0,
        [`--radix-collapsible-content-width`]: width ? `${width}px` : void 0,
        ...props.style
      },
      children: isOpen && children
    }
  );
});
function getState(open) {
  return open ? "open" : "closed";
}
var Root3 = Collapsible;
var Trigger = CollapsibleTrigger;
var Content = CollapsibleContent;

// ../../node_modules/.pnpm/@radix-ui+react-direction@1.1.1_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-direction/dist/index.mjs
var React18 = __toESM(require_react(), 1);
var import_jsx_runtime23 = __toESM(require_jsx_runtime(), 1);
var DirectionContext = React18.createContext(void 0);
function useDirection(localDir) {
  const globalDir = React18.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}

// ../../node_modules/.pnpm/@radix-ui+react-accordion@1.2.12_@types+react-dom@19.2.3_@types+react@19.2.14__@types+r_8b3df72274e0fa0cff1629993ef7cc33/node_modules/@radix-ui/react-accordion/dist/index.mjs
var import_jsx_runtime24 = __toESM(require_jsx_runtime(), 1);
var ACCORDION_NAME = "Accordion";
var ACCORDION_KEYS = ["Home", "End", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
var [Collection, useCollection, createCollectionScope] = createCollection(ACCORDION_NAME);
var [createAccordionContext, createAccordionScope] = createContextScope(ACCORDION_NAME, [
  createCollectionScope,
  createCollapsibleScope
]);
var useCollapsibleScope = createCollapsibleScope();
var Accordion = import_react49.default.forwardRef(
  (props, forwardedRef) => {
    const { type, ...accordionProps } = props;
    const singleProps = accordionProps;
    const multipleProps = accordionProps;
    return (0, import_jsx_runtime24.jsx)(Collection.Provider, { scope: props.__scopeAccordion, children: type === "multiple" ? (0, import_jsx_runtime24.jsx)(AccordionImplMultiple, { ...multipleProps, ref: forwardedRef }) : (0, import_jsx_runtime24.jsx)(AccordionImplSingle, { ...singleProps, ref: forwardedRef }) });
  }
);
Accordion.displayName = ACCORDION_NAME;
var [AccordionValueProvider, useAccordionValueContext] = createAccordionContext(ACCORDION_NAME);
var [AccordionCollapsibleProvider, useAccordionCollapsibleContext] = createAccordionContext(
  ACCORDION_NAME,
  { collapsible: false }
);
var AccordionImplSingle = import_react49.default.forwardRef(
  (props, forwardedRef) => {
    const {
      value: valueProp,
      defaultValue,
      onValueChange = () => {
      },
      collapsible = false,
      ...accordionSingleProps
    } = props;
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? "",
      onChange: onValueChange,
      caller: ACCORDION_NAME
    });
    return (0, import_jsx_runtime24.jsx)(
      AccordionValueProvider,
      {
        scope: props.__scopeAccordion,
        value: import_react49.default.useMemo(() => value ? [value] : [], [value]),
        onItemOpen: setValue,
        onItemClose: import_react49.default.useCallback(() => collapsible && setValue(""), [collapsible, setValue]),
        children: (0, import_jsx_runtime24.jsx)(AccordionCollapsibleProvider, { scope: props.__scopeAccordion, collapsible, children: (0, import_jsx_runtime24.jsx)(AccordionImpl, { ...accordionSingleProps, ref: forwardedRef }) })
      }
    );
  }
);
var AccordionImplMultiple = import_react49.default.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {
    },
    ...accordionMultipleProps
  } = props;
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
    caller: ACCORDION_NAME
  });
  const handleItemOpen = import_react49.default.useCallback(
    (itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue]
  );
  const handleItemClose = import_react49.default.useCallback(
    (itemValue) => setValue((prevValue = []) => prevValue.filter((value2) => value2 !== itemValue)),
    [setValue]
  );
  return (0, import_jsx_runtime24.jsx)(
    AccordionValueProvider,
    {
      scope: props.__scopeAccordion,
      value,
      onItemOpen: handleItemOpen,
      onItemClose: handleItemClose,
      children: (0, import_jsx_runtime24.jsx)(AccordionCollapsibleProvider, { scope: props.__scopeAccordion, collapsible: true, children: (0, import_jsx_runtime24.jsx)(AccordionImpl, { ...accordionMultipleProps, ref: forwardedRef }) })
    }
  );
});
var [AccordionImplProvider, useAccordionContext] = createAccordionContext(ACCORDION_NAME);
var AccordionImpl = import_react49.default.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, disabled, dir, orientation = "vertical", ...accordionProps } = props;
    const accordionRef = import_react49.default.useRef(null);
    const composedRefs = useComposedRefs(accordionRef, forwardedRef);
    const getItems = useCollection(__scopeAccordion);
    const direction = useDirection(dir);
    const isDirectionLTR = direction === "ltr";
    const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
      var _a2;
      if (!ACCORDION_KEYS.includes(event.key)) return;
      const target = event.target;
      const triggerCollection = getItems().filter((item) => {
        var _a3;
        return !((_a3 = item.ref.current) == null ? void 0 : _a3.disabled);
      });
      const triggerIndex = triggerCollection.findIndex((item) => item.ref.current === target);
      const triggerCount = triggerCollection.length;
      if (triggerIndex === -1) return;
      event.preventDefault();
      let nextIndex = triggerIndex;
      const homeIndex = 0;
      const endIndex = triggerCount - 1;
      const moveNext = () => {
        nextIndex = triggerIndex + 1;
        if (nextIndex > endIndex) {
          nextIndex = homeIndex;
        }
      };
      const movePrev = () => {
        nextIndex = triggerIndex - 1;
        if (nextIndex < homeIndex) {
          nextIndex = endIndex;
        }
      };
      switch (event.key) {
        case "Home":
          nextIndex = homeIndex;
          break;
        case "End":
          nextIndex = endIndex;
          break;
        case "ArrowRight":
          if (orientation === "horizontal") {
            if (isDirectionLTR) {
              moveNext();
            } else {
              movePrev();
            }
          }
          break;
        case "ArrowDown":
          if (orientation === "vertical") {
            moveNext();
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal") {
            if (isDirectionLTR) {
              movePrev();
            } else {
              moveNext();
            }
          }
          break;
        case "ArrowUp":
          if (orientation === "vertical") {
            movePrev();
          }
          break;
      }
      const clampedIndex = nextIndex % triggerCount;
      (_a2 = triggerCollection[clampedIndex].ref.current) == null ? void 0 : _a2.focus();
    });
    return (0, import_jsx_runtime24.jsx)(
      AccordionImplProvider,
      {
        scope: __scopeAccordion,
        disabled,
        direction: dir,
        orientation,
        children: (0, import_jsx_runtime24.jsx)(Collection.Slot, { scope: __scopeAccordion, children: (0, import_jsx_runtime24.jsx)(
          Primitive3.div,
          {
            ...accordionProps,
            "data-orientation": orientation,
            ref: composedRefs,
            onKeyDown: disabled ? void 0 : handleKeyDown
          }
        ) })
      }
    );
  }
);
var ITEM_NAME = "AccordionItem";
var [AccordionItemProvider, useAccordionItemContext] = createAccordionContext(ITEM_NAME);
var AccordionItem = import_react49.default.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, value, ...accordionItemProps } = props;
    const accordionContext = useAccordionContext(ITEM_NAME, __scopeAccordion);
    const valueContext = useAccordionValueContext(ITEM_NAME, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    const triggerId = useId2();
    const open = value && valueContext.value.includes(value) || false;
    const disabled = accordionContext.disabled || props.disabled;
    return (0, import_jsx_runtime24.jsx)(
      AccordionItemProvider,
      {
        scope: __scopeAccordion,
        open,
        disabled,
        triggerId,
        children: (0, import_jsx_runtime24.jsx)(
          Root3,
          {
            "data-orientation": accordionContext.orientation,
            "data-state": getState2(open),
            ...collapsibleScope,
            ...accordionItemProps,
            ref: forwardedRef,
            disabled,
            open,
            onOpenChange: (open2) => {
              if (open2) {
                valueContext.onItemOpen(value);
              } else {
                valueContext.onItemClose(value);
              }
            }
          }
        )
      }
    );
  }
);
AccordionItem.displayName = ITEM_NAME;
var HEADER_NAME = "AccordionHeader";
var AccordionHeader = import_react49.default.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...headerProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(HEADER_NAME, __scopeAccordion);
    return (0, import_jsx_runtime24.jsx)(
      Primitive3.h3,
      {
        "data-orientation": accordionContext.orientation,
        "data-state": getState2(itemContext.open),
        "data-disabled": itemContext.disabled ? "" : void 0,
        ...headerProps,
        ref: forwardedRef
      }
    );
  }
);
AccordionHeader.displayName = HEADER_NAME;
var TRIGGER_NAME2 = "AccordionTrigger";
var AccordionTrigger = import_react49.default.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...triggerProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(TRIGGER_NAME2, __scopeAccordion);
    const collapsibleContext = useAccordionCollapsibleContext(TRIGGER_NAME2, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    return (0, import_jsx_runtime24.jsx)(Collection.ItemSlot, { scope: __scopeAccordion, children: (0, import_jsx_runtime24.jsx)(
      Trigger,
      {
        "aria-disabled": itemContext.open && !collapsibleContext.collapsible || void 0,
        "data-orientation": accordionContext.orientation,
        id: itemContext.triggerId,
        ...collapsibleScope,
        ...triggerProps,
        ref: forwardedRef
      }
    ) });
  }
);
AccordionTrigger.displayName = TRIGGER_NAME2;
var CONTENT_NAME2 = "AccordionContent";
var AccordionContent = import_react49.default.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...contentProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(CONTENT_NAME2, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    return (0, import_jsx_runtime24.jsx)(
      Content,
      {
        role: "region",
        "aria-labelledby": itemContext.triggerId,
        "data-orientation": accordionContext.orientation,
        ...collapsibleScope,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ["--radix-accordion-content-height"]: "var(--radix-collapsible-content-height)",
          ["--radix-accordion-content-width"]: "var(--radix-collapsible-content-width)",
          ...props.style
        }
      }
    );
  }
);
AccordionContent.displayName = CONTENT_NAME2;
function getState2(open) {
  return open ? "open" : "closed";
}

// ../../node_modules/.pnpm/@radix-ui+react-alert-dialog@1.1.15_@types+react-dom@19.2.3_@types+react@19.2.14__@type_d492cfbed6c88f7a3980b921a627d48d/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs
var React37 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-dialog@1.1.15_@types+react-dom@19.2.3_@types+react@19.2.14__@types+reac_779045218dc2799d336e7197abef9d38/node_modules/@radix-ui/react-dialog/dist/index.mjs
var React36 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-dismissable-layer@1.1.11_@types+react-dom@19.2.3_@types+react@19.2.14___3d3960154a4c07d09bb90cb341135fc5/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
var React20 = __toESM(require_react(), 1);
var import_jsx_runtime25 = __toESM(require_jsx_runtime(), 1);
var DISMISSABLE_LAYER_NAME = "DismissableLayer";
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = React20.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
});
var DismissableLayer = React20.forwardRef(
  (props, forwardedRef) => {
    const {
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      ...layerProps
    } = props;
    const context = React20.useContext(DismissableLayerContext);
    const [node, setNode] = React20.useState(null);
    const ownerDocument = (node == null ? void 0 : node.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document);
    const [, force] = React20.useState({});
    const composedRefs = useComposedRefs(forwardedRef, (node2) => setNode(node2));
    const layers = Array.from(context.layers);
    const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
    const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
    const index4 = node ? layers.indexOf(node) : -1;
    const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
    const isPointerEventsEnabled = index4 >= highestLayerWithOutsidePointerEventsDisabledIndex;
    const pointerDownOutside = usePointerDownOutside((event) => {
      const target = event.target;
      const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
      if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
      onPointerDownOutside == null ? void 0 : onPointerDownOutside(event);
      onInteractOutside == null ? void 0 : onInteractOutside(event);
      if (!event.defaultPrevented) onDismiss == null ? void 0 : onDismiss();
    }, ownerDocument);
    const focusOutside = useFocusOutside((event) => {
      const target = event.target;
      const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
      if (isFocusInBranch) return;
      onFocusOutside == null ? void 0 : onFocusOutside(event);
      onInteractOutside == null ? void 0 : onInteractOutside(event);
      if (!event.defaultPrevented) onDismiss == null ? void 0 : onDismiss();
    }, ownerDocument);
    useEscapeKeydown((event) => {
      const isHighestLayer = index4 === context.layers.size - 1;
      if (!isHighestLayer) return;
      onEscapeKeyDown == null ? void 0 : onEscapeKeyDown(event);
      if (!event.defaultPrevented && onDismiss) {
        event.preventDefault();
        onDismiss();
      }
    }, ownerDocument);
    React20.useEffect(() => {
      if (!node) return;
      if (disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
          ownerDocument.body.style.pointerEvents = "none";
        }
        context.layersWithOutsidePointerEventsDisabled.add(node);
      }
      context.layers.add(node);
      dispatchUpdate();
      return () => {
        if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
        }
      };
    }, [node, ownerDocument, disableOutsidePointerEvents, context]);
    React20.useEffect(() => {
      return () => {
        if (!node) return;
        context.layers.delete(node);
        context.layersWithOutsidePointerEventsDisabled.delete(node);
        dispatchUpdate();
      };
    }, [node, context]);
    React20.useEffect(() => {
      const handleUpdate = () => force({});
      document.addEventListener(CONTEXT_UPDATE, handleUpdate);
      return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
    }, []);
    return (0, import_jsx_runtime25.jsx)(
      Primitive3.div,
      {
        ...layerProps,
        ref: composedRefs,
        style: {
          pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
          ...props.style
        },
        onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
        onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
        onPointerDownCapture: composeEventHandlers(
          props.onPointerDownCapture,
          pointerDownOutside.onPointerDownCapture
        )
      }
    );
  }
);
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
var BRANCH_NAME = "DismissableLayerBranch";
var DismissableLayerBranch = React20.forwardRef((props, forwardedRef) => {
  const context = React20.useContext(DismissableLayerContext);
  const ref = React20.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  React20.useEffect(() => {
    const node = ref.current;
    if (node) {
      context.branches.add(node);
      return () => {
        context.branches.delete(node);
      };
    }
  }, [context.branches]);
  return (0, import_jsx_runtime25.jsx)(Primitive3.div, { ...props, ref: composedRefs });
});
DismissableLayerBranch.displayName = BRANCH_NAME;
function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis == null ? void 0 : globalThis.document) {
  const handlePointerDownOutside = useCallbackRef(onPointerDownOutside);
  const isPointerInsideReactTreeRef = React20.useRef(false);
  const handleClickRef = React20.useRef(() => {
  });
  React20.useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        let handleAndDispatchPointerDownOutsideEvent2 = function() {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            handlePointerDownOutside,
            eventDetail,
            { discrete: true }
          );
        };
        var handleAndDispatchPointerDownOutsideEvent = handleAndDispatchPointerDownOutsideEvent2;
        const eventDetail = { originalEvent: event };
        if (event.pointerType === "touch") {
          ownerDocument.removeEventListener("click", handleClickRef.current);
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
          ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
        } else {
          handleAndDispatchPointerDownOutsideEvent2();
        }
      } else {
        ownerDocument.removeEventListener("click", handleClickRef.current);
      }
      isPointerInsideReactTreeRef.current = false;
    };
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.current);
    };
  }, [ownerDocument, handlePointerDownOutside]);
  return {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
  };
}
function useFocusOutside(onFocusOutside, ownerDocument = globalThis == null ? void 0 : globalThis.document) {
  const handleFocusOutside = useCallbackRef(onFocusOutside);
  const isFocusInsideReactTreeRef = React20.useRef(false);
  React20.useEffect(() => {
    const handleFocus = (event) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event };
        handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
          discrete: false
        });
      }
    };
    ownerDocument.addEventListener("focusin", handleFocus);
    return () => ownerDocument.removeEventListener("focusin", handleFocus);
  }, [ownerDocument, handleFocusOutside]);
  return {
    onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
    onBlurCapture: () => isFocusInsideReactTreeRef.current = false
  };
}
function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE);
  document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
  const target = detail.originalEvent.target;
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
  if (handler) target.addEventListener(name, handler, { once: true });
  if (discrete) {
    dispatchDiscreteCustomEvent(target, event);
  } else {
    target.dispatchEvent(event);
  }
}
var Root4 = DismissableLayer;
var Branch = DismissableLayerBranch;

// ../../node_modules/.pnpm/@radix-ui+react-focus-scope@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types+_f62f3af4ca2ba305a7aecf04c8534604/node_modules/@radix-ui/react-focus-scope/dist/index.mjs
var React21 = __toESM(require_react(), 1);
var import_jsx_runtime26 = __toESM(require_jsx_runtime(), 1);
var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var FOCUS_SCOPE_NAME = "FocusScope";
var FocusScope = React21.forwardRef((props, forwardedRef) => {
  const {
    loop = false,
    trapped = false,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    ...scopeProps
  } = props;
  const [container, setContainer] = React21.useState(null);
  const onMountAutoFocus = useCallbackRef(onMountAutoFocusProp);
  const onUnmountAutoFocus = useCallbackRef(onUnmountAutoFocusProp);
  const lastFocusedElementRef = React21.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContainer(node));
  const focusScope = React21.useRef({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    }
  }).current;
  React21.useEffect(() => {
    if (trapped) {
      let handleFocusIn2 = function(event) {
        if (focusScope.paused || !container) return;
        const target = event.target;
        if (container.contains(target)) {
          lastFocusedElementRef.current = target;
        } else {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }, handleFocusOut2 = function(event) {
        if (focusScope.paused || !container) return;
        const relatedTarget = event.relatedTarget;
        if (relatedTarget === null) return;
        if (!container.contains(relatedTarget)) {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }, handleMutations2 = function(mutations) {
        const focusedElement = document.activeElement;
        if (focusedElement !== document.body) return;
        for (const mutation of mutations) {
          if (mutation.removedNodes.length > 0) focus(container);
        }
      };
      var handleFocusIn = handleFocusIn2, handleFocusOut = handleFocusOut2, handleMutations = handleMutations2;
      document.addEventListener("focusin", handleFocusIn2);
      document.addEventListener("focusout", handleFocusOut2);
      const mutationObserver = new MutationObserver(handleMutations2);
      if (container) mutationObserver.observe(container, { childList: true, subtree: true });
      return () => {
        document.removeEventListener("focusin", handleFocusIn2);
        document.removeEventListener("focusout", handleFocusOut2);
        mutationObserver.disconnect();
      };
    }
  }, [trapped, container, focusScope.paused]);
  React21.useEffect(() => {
    if (container) {
      focusScopesStack.add(focusScope);
      const previouslyFocusedElement = document.activeElement;
      const hasFocusedCandidate = container.contains(previouslyFocusedElement);
      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
        container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        container.dispatchEvent(mountEvent);
        if (!mountEvent.defaultPrevented) {
          focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
          if (document.activeElement === previouslyFocusedElement) {
            focus(container);
          }
        }
      }
      return () => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        setTimeout(() => {
          const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
          container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          container.dispatchEvent(unmountEvent);
          if (!unmountEvent.defaultPrevented) {
            focus(previouslyFocusedElement ?? document.body, { select: true });
          }
          container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          focusScopesStack.remove(focusScope);
        }, 0);
      };
    }
  }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);
  const handleKeyDown = React21.useCallback(
    (event) => {
      if (!loop && !trapped) return;
      if (focusScope.paused) return;
      const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
      const focusedElement = document.activeElement;
      if (isTabKey && focusedElement) {
        const container2 = event.currentTarget;
        const [first, last] = getTabbableEdges(container2);
        const hasTabbableElementsInside = first && last;
        if (!hasTabbableElementsInside) {
          if (focusedElement === container2) event.preventDefault();
        } else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault();
            if (loop) focus(first, { select: true });
          } else if (event.shiftKey && focusedElement === first) {
            event.preventDefault();
            if (loop) focus(last, { select: true });
          }
        }
      }
    },
    [loop, trapped, focusScope.paused]
  );
  return (0, import_jsx_runtime26.jsx)(Primitive3.div, { tabIndex: -1, ...scopeProps, ref: composedRefs, onKeyDown: handleKeyDown });
});
FocusScope.displayName = FOCUS_SCOPE_NAME;
function focusFirst(candidates, { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement;
  for (const candidate of candidates) {
    focus(candidate, { select });
    if (document.activeElement !== previouslyFocusedElement) return;
  }
}
function getTabbableEdges(container) {
  const candidates = getTabbableCandidates(container);
  const first = findVisible(candidates, container);
  const last = findVisible(candidates.reverse(), container);
  return [first, last];
}
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function findVisible(elements, container) {
  for (const element of elements) {
    if (!isHidden(element, { upTo: container })) return element;
  }
}
function isHidden(node, { upTo }) {
  if (getComputedStyle(node).visibility === "hidden") return true;
  while (node) {
    if (upTo !== void 0 && node === upTo) return false;
    if (getComputedStyle(node).display === "none") return true;
    node = node.parentElement;
  }
  return false;
}
function isSelectableInput(element) {
  return element instanceof HTMLInputElement && "select" in element;
}
function focus(element, { select = false } = {}) {
  if (element && element.focus) {
    const previouslyFocusedElement = document.activeElement;
    element.focus({ preventScroll: true });
    if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
      element.select();
  }
}
var focusScopesStack = createFocusScopesStack();
function createFocusScopesStack() {
  let stack = [];
  return {
    add(focusScope) {
      const activeFocusScope = stack[0];
      if (focusScope !== activeFocusScope) {
        activeFocusScope == null ? void 0 : activeFocusScope.pause();
      }
      stack = arrayRemove(stack, focusScope);
      stack.unshift(focusScope);
    },
    remove(focusScope) {
      var _a2;
      stack = arrayRemove(stack, focusScope);
      (_a2 = stack[0]) == null ? void 0 : _a2.resume();
    }
  };
}
function arrayRemove(array, item) {
  const updatedArray = [...array];
  const index4 = updatedArray.indexOf(item);
  if (index4 !== -1) {
    updatedArray.splice(index4, 1);
  }
  return updatedArray;
}
function removeLinks(items) {
  return items.filter((item) => item.tagName !== "A");
}

// ../../node_modules/.pnpm/@radix-ui+react-portal@1.1.9_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react_7668895bec2444446faa4e0f4eb5244b/node_modules/@radix-ui/react-portal/dist/index.mjs
var React25 = __toESM(require_react(), 1);
var import_react_dom = __toESM(require_react_dom(), 1);
var import_jsx_runtime27 = __toESM(require_jsx_runtime(), 1);
var PORTAL_NAME = "Portal";
var Portal = React25.forwardRef((props, forwardedRef) => {
  var _a2;
  const { container: containerProp, ...portalProps } = props;
  const [mounted, setMounted] = React25.useState(false);
  useLayoutEffect2(() => setMounted(true), []);
  const container = containerProp || mounted && ((_a2 = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : _a2.body);
  return container ? import_react_dom.default.createPortal((0, import_jsx_runtime27.jsx)(Primitive3.div, { ...portalProps, ref: forwardedRef }), container) : null;
});
Portal.displayName = PORTAL_NAME;

// ../../node_modules/.pnpm/@radix-ui+react-focus-guards@1.1.3_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-focus-guards/dist/index.mjs
var React26 = __toESM(require_react(), 1);
var count2 = 0;
function useFocusGuards() {
  React26.useEffect(() => {
    const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
    document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
    count2++;
    return () => {
      if (count2 === 1) {
        document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
      }
      count2--;
    };
  }, []);
}
function createFocusGuard() {
  const element = document.createElement("span");
  element.setAttribute("data-radix-focus-guard", "");
  element.tabIndex = 0;
  element.style.outline = "none";
  element.style.opacity = "0";
  element.style.position = "fixed";
  element.style.pointerEvents = "none";
  return element;
}

// ../../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

// ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll/dist/es2015/Combination.js
var React35 = __toESM(require_react());

// ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll/dist/es2015/UI.js
var React31 = __toESM(require_react());

// ../../node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var zeroRightClassName = "right-scroll-bar-position";
var fullWidthClassName = "width-before-scroll-bar";
var noScrollbarsClassName = "with-scroll-bars-hidden";
var removedBarSizeVariable = "--removed-body-scroll-bar-size";

// ../../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.14_react@19.2.4/node_modules/use-callback-ref/dist/es2015/assignRef.js
function assignRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
  return ref;
}

// ../../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.14_react@19.2.4/node_modules/use-callback-ref/dist/es2015/useRef.js
var import_react50 = __toESM(require_react());
function useCallbackRef2(initialValue, callback) {
  var ref = (0, import_react50.useState)(function() {
    return {
      // value
      value: initialValue,
      // last callback
      callback,
      // "memoized" public interface
      facade: {
        get current() {
          return ref.value;
        },
        set current(value) {
          var last = ref.value;
          if (last !== value) {
            ref.value = value;
            ref.callback(value, last);
          }
        }
      }
    };
  })[0];
  ref.callback = callback;
  return ref.facade;
}

// ../../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.14_react@19.2.4/node_modules/use-callback-ref/dist/es2015/useMergeRef.js
var React27 = __toESM(require_react());
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React27.useLayoutEffect : React27.useEffect;
var currentValues = /* @__PURE__ */ new WeakMap();
function useMergeRefs(refs, defaultValue) {
  var callbackRef = useCallbackRef2(defaultValue || null, function(newValue) {
    return refs.forEach(function(ref) {
      return assignRef(ref, newValue);
    });
  });
  useIsomorphicLayoutEffect(function() {
    var oldValue = currentValues.get(callbackRef);
    if (oldValue) {
      var prevRefs_1 = new Set(oldValue);
      var nextRefs_1 = new Set(refs);
      var current_1 = callbackRef.current;
      prevRefs_1.forEach(function(ref) {
        if (!nextRefs_1.has(ref)) {
          assignRef(ref, null);
        }
      });
      nextRefs_1.forEach(function(ref) {
        if (!prevRefs_1.has(ref)) {
          assignRef(ref, current_1);
        }
      });
    }
    currentValues.set(callbackRef, refs);
  }, [refs]);
  return callbackRef;
}

// ../../node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.14_react@19.2.4/node_modules/use-sidecar/dist/es2015/hoc.js
var React28 = __toESM(require_react());

// ../../node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.14_react@19.2.4/node_modules/use-sidecar/dist/es2015/hook.js
var import_react51 = __toESM(require_react());

// ../../node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.14_react@19.2.4/node_modules/use-sidecar/dist/es2015/medium.js
function ItoI(a) {
  return a;
}
function innerCreateMedium(defaults, middleware) {
  if (middleware === void 0) {
    middleware = ItoI;
  }
  var buffer = [];
  var assigned = false;
  var medium = {
    read: function() {
      if (assigned) {
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      }
      if (buffer.length) {
        return buffer[buffer.length - 1];
      }
      return defaults;
    },
    useMedium: function(data) {
      var item = middleware(data, assigned);
      buffer.push(item);
      return function() {
        buffer = buffer.filter(function(x) {
          return x !== item;
        });
      };
    },
    assignSyncMedium: function(cb) {
      assigned = true;
      while (buffer.length) {
        var cbs = buffer;
        buffer = [];
        cbs.forEach(cb);
      }
      buffer = {
        push: function(x) {
          return cb(x);
        },
        filter: function() {
          return buffer;
        }
      };
    },
    assignMedium: function(cb) {
      assigned = true;
      var pendingQueue = [];
      if (buffer.length) {
        var cbs = buffer;
        buffer = [];
        cbs.forEach(cb);
        pendingQueue = buffer;
      }
      var executeQueue = function() {
        var cbs2 = pendingQueue;
        pendingQueue = [];
        cbs2.forEach(cb);
      };
      var cycle = function() {
        return Promise.resolve().then(executeQueue);
      };
      cycle();
      buffer = {
        push: function(x) {
          pendingQueue.push(x);
          cycle();
        },
        filter: function(filter) {
          pendingQueue = pendingQueue.filter(filter);
          return buffer;
        }
      };
    }
  };
  return medium;
}
function createSidecarMedium(options) {
  if (options === void 0) {
    options = {};
  }
  var medium = innerCreateMedium(null);
  medium.options = __assign({ async: true, ssr: false }, options);
  return medium;
}

// ../../node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.14_react@19.2.4/node_modules/use-sidecar/dist/es2015/renderProp.js
var React29 = __toESM(require_react());
var import_react52 = __toESM(require_react());

// ../../node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.14_react@19.2.4/node_modules/use-sidecar/dist/es2015/exports.js
var React30 = __toESM(require_react());
var SideCar = function(_a2) {
  var sideCar = _a2.sideCar, rest = __rest(_a2, ["sideCar"]);
  if (!sideCar) {
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  }
  var Target = sideCar.read();
  if (!Target) {
    throw new Error("Sidecar medium not found");
  }
  return React30.createElement(Target, __assign({}, rest));
};
SideCar.isSideCarExport = true;
function exportSidecar(medium, exported) {
  medium.useMedium(exported);
  return SideCar;
}

// ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll/dist/es2015/medium.js
var effectCar = createSidecarMedium();

// ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll/dist/es2015/UI.js
var nothing = function() {
  return;
};
var RemoveScroll = React31.forwardRef(function(props, parentRef) {
  var ref = React31.useRef(null);
  var _a2 = React31.useState({
    onScrollCapture: nothing,
    onWheelCapture: nothing,
    onTouchMoveCapture: nothing
  }), callbacks = _a2[0], setCallbacks = _a2[1];
  var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
  var SideCar2 = sideCar;
  var containerRef = useMergeRefs([ref, parentRef]);
  var containerProps = __assign(__assign({}, rest), callbacks);
  return React31.createElement(
    React31.Fragment,
    null,
    enabled && React31.createElement(SideCar2, { sideCar: effectCar, removeScrollBar, shards, noRelative, noIsolation, inert, setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode }),
    forwardProps ? React31.cloneElement(React31.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : React31.createElement(Container, __assign({}, containerProps, { className, ref: containerRef }), children)
  );
});
RemoveScroll.defaultProps = {
  enabled: true,
  removeScrollBar: true,
  inert: false
};
RemoveScroll.classNames = {
  fullWidth: fullWidthClassName,
  zeroRight: zeroRightClassName
};

// ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll/dist/es2015/SideEffect.js
var React34 = __toESM(require_react());

// ../../node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll-bar/dist/es2015/component.js
var React33 = __toESM(require_react());

// ../../node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@19.2.14_react@19.2.4/node_modules/react-style-singleton/dist/es2015/hook.js
var React32 = __toESM(require_react());

// ../../node_modules/.pnpm/get-nonce@1.0.1/node_modules/get-nonce/dist/es2015/index.js
var currentNonce;
var getNonce = function() {
  if (currentNonce) {
    return currentNonce;
  }
  if (typeof __webpack_nonce__ !== "undefined") {
    return __webpack_nonce__;
  }
  return void 0;
};

// ../../node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@19.2.14_react@19.2.4/node_modules/react-style-singleton/dist/es2015/singleton.js
function makeStyleTag() {
  if (!document)
    return null;
  var tag = document.createElement("style");
  tag.type = "text/css";
  var nonce = getNonce();
  if (nonce) {
    tag.setAttribute("nonce", nonce);
  }
  return tag;
}
function injectStyles(tag, css) {
  if (tag.styleSheet) {
    tag.styleSheet.cssText = css;
  } else {
    tag.appendChild(document.createTextNode(css));
  }
}
function insertStyleTag(tag) {
  var head = document.head || document.getElementsByTagName("head")[0];
  head.appendChild(tag);
}
var stylesheetSingleton = function() {
  var counter = 0;
  var stylesheet = null;
  return {
    add: function(style) {
      if (counter == 0) {
        if (stylesheet = makeStyleTag()) {
          injectStyles(stylesheet, style);
          insertStyleTag(stylesheet);
        }
      }
      counter++;
    },
    remove: function() {
      counter--;
      if (!counter && stylesheet) {
        stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
        stylesheet = null;
      }
    }
  };
};

// ../../node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@19.2.14_react@19.2.4/node_modules/react-style-singleton/dist/es2015/hook.js
var styleHookSingleton = function() {
  var sheet = stylesheetSingleton();
  return function(styles, isDynamic) {
    React32.useEffect(function() {
      sheet.add(styles);
      return function() {
        sheet.remove();
      };
    }, [styles && isDynamic]);
  };
};

// ../../node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@19.2.14_react@19.2.4/node_modules/react-style-singleton/dist/es2015/component.js
var styleSingleton = function() {
  var useStyle = styleHookSingleton();
  var Sheet = function(_a2) {
    var styles = _a2.styles, dynamic = _a2.dynamic;
    useStyle(styles, dynamic);
    return null;
  };
  return Sheet;
};

// ../../node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll-bar/dist/es2015/utils.js
var zeroGap = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
};
var parse = function(x) {
  return parseInt(x || "", 10) || 0;
};
var getOffset = function(gapMode) {
  var cs = window.getComputedStyle(document.body);
  var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
  var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
  var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
  return [parse(left), parse(top), parse(right)];
};
var getGapWidth = function(gapMode) {
  if (gapMode === void 0) {
    gapMode = "margin";
  }
  if (typeof window === "undefined") {
    return zeroGap;
  }
  var offsets = getOffset(gapMode);
  var documentWidth = document.documentElement.clientWidth;
  var windowWidth = window.innerWidth;
  return {
    left: offsets[0],
    top: offsets[1],
    right: offsets[2],
    gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
  };
};

// ../../node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll-bar/dist/es2015/component.js
var Style = styleSingleton();
var lockAttribute = "data-scroll-locked";
var getStyles = function(_a2, allowRelative, gapMode, important) {
  var left = _a2.left, top = _a2.top, right = _a2.right, gap = _a2.gap;
  if (gapMode === void 0) {
    gapMode = "margin";
  }
  return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
    allowRelative && "position: relative ".concat(important, ";"),
    gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
    gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
  ].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function() {
  var counter = parseInt(document.body.getAttribute(lockAttribute) || "0", 10);
  return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function() {
  React33.useEffect(function() {
    document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
    return function() {
      var newCounter = getCurrentUseCounter() - 1;
      if (newCounter <= 0) {
        document.body.removeAttribute(lockAttribute);
      } else {
        document.body.setAttribute(lockAttribute, newCounter.toString());
      }
    };
  }, []);
};
var RemoveScrollBar = function(_a2) {
  var noRelative = _a2.noRelative, noImportant = _a2.noImportant, _b = _a2.gapMode, gapMode = _b === void 0 ? "margin" : _b;
  useLockAttribute();
  var gap = React33.useMemo(function() {
    return getGapWidth(gapMode);
  }, [gapMode]);
  return React33.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
};

// ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
var passiveSupported = false;
if (typeof window !== "undefined") {
  try {
    options = Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
        return true;
      }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (err) {
    passiveSupported = false;
  }
}
var options;
var nonPassive = passiveSupported ? { passive: false } : false;

// ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll/dist/es2015/handleScroll.js
var alwaysContainsScroll = function(node) {
  return node.tagName === "TEXTAREA";
};
var elementCanBeScrolled = function(node, overflow) {
  if (!(node instanceof Element)) {
    return false;
  }
  var styles = window.getComputedStyle(node);
  return (
    // not-not-scrollable
    styles[overflow] !== "hidden" && // contains scroll inside self
    !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible")
  );
};
var elementCouldBeVScrolled = function(node) {
  return elementCanBeScrolled(node, "overflowY");
};
var elementCouldBeHScrolled = function(node) {
  return elementCanBeScrolled(node, "overflowX");
};
var locationCouldBeScrolled = function(axis, node) {
  var ownerDocument = node.ownerDocument;
  var current = node;
  do {
    if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) {
      current = current.host;
    }
    var isScrollable = elementCouldBeScrolled(axis, current);
    if (isScrollable) {
      var _a2 = getScrollVariables(axis, current), scrollHeight = _a2[1], clientHeight = _a2[2];
      if (scrollHeight > clientHeight) {
        return true;
      }
    }
    current = current.parentNode;
  } while (current && current !== ownerDocument.body);
  return false;
};
var getVScrollVariables = function(_a2) {
  var scrollTop = _a2.scrollTop, scrollHeight = _a2.scrollHeight, clientHeight = _a2.clientHeight;
  return [
    scrollTop,
    scrollHeight,
    clientHeight
  ];
};
var getHScrollVariables = function(_a2) {
  var scrollLeft = _a2.scrollLeft, scrollWidth = _a2.scrollWidth, clientWidth = _a2.clientWidth;
  return [
    scrollLeft,
    scrollWidth,
    clientWidth
  ];
};
var elementCouldBeScrolled = function(axis, node) {
  return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function(axis, node) {
  return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function(axis, direction) {
  return axis === "h" && direction === "rtl" ? -1 : 1;
};
var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
  var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
  var delta = directionFactor * sourceDelta;
  var target = event.target;
  var targetInLock = endTarget.contains(target);
  var shouldCancelScroll = false;
  var isDeltaPositive = delta > 0;
  var availableScroll = 0;
  var availableScrollTop = 0;
  do {
    if (!target) {
      break;
    }
    var _a2 = getScrollVariables(axis, target), position = _a2[0], scroll_1 = _a2[1], capacity = _a2[2];
    var elementScroll = scroll_1 - capacity - directionFactor * position;
    if (position || elementScroll) {
      if (elementCouldBeScrolled(axis, target)) {
        availableScroll += elementScroll;
        availableScrollTop += position;
      }
    }
    var parent_1 = target.parentNode;
    target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
  } while (
    // portaled content
    !targetInLock && target !== document.body || // self content
    targetInLock && (endTarget.contains(target) || endTarget === target)
  );
  if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) {
    shouldCancelScroll = true;
  } else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) {
    shouldCancelScroll = true;
  }
  return shouldCancelScroll;
};

// ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll/dist/es2015/SideEffect.js
var getTouchXY = function(event) {
  return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
};
var getDeltaXY = function(event) {
  return [event.deltaX, event.deltaY];
};
var extractRef = function(ref) {
  return ref && "current" in ref ? ref.current : ref;
};
var deltaCompare = function(x, y) {
  return x[0] === y[0] && x[1] === y[1];
};
var generateStyle = function(id) {
  return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
};
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
  var shouldPreventQueue = React34.useRef([]);
  var touchStartRef = React34.useRef([0, 0]);
  var activeAxis = React34.useRef();
  var id = React34.useState(idCounter++)[0];
  var Style2 = React34.useState(styleSingleton)[0];
  var lastProps = React34.useRef(props);
  React34.useEffect(function() {
    lastProps.current = props;
  }, [props]);
  React34.useEffect(function() {
    if (props.inert) {
      document.body.classList.add("block-interactivity-".concat(id));
      var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
      allow_1.forEach(function(el) {
        return el.classList.add("allow-interactivity-".concat(id));
      });
      return function() {
        document.body.classList.remove("block-interactivity-".concat(id));
        allow_1.forEach(function(el) {
          return el.classList.remove("allow-interactivity-".concat(id));
        });
      };
    }
    return;
  }, [props.inert, props.lockRef.current, props.shards]);
  var shouldCancelEvent = React34.useCallback(function(event, parent) {
    if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) {
      return !lastProps.current.allowPinchZoom;
    }
    var touch = getTouchXY(event);
    var touchStart = touchStartRef.current;
    var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
    var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
    var currentAxis;
    var target = event.target;
    var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
    if ("touches" in event && moveDirection === "h" && target.type === "range") {
      return false;
    }
    var selection = window.getSelection();
    var anchorNode = selection && selection.anchorNode;
    var isTouchingSelection = anchorNode ? anchorNode === target || anchorNode.contains(target) : false;
    if (isTouchingSelection) {
      return false;
    }
    var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
    if (!canBeScrolledInMainDirection) {
      return true;
    }
    if (canBeScrolledInMainDirection) {
      currentAxis = moveDirection;
    } else {
      currentAxis = moveDirection === "v" ? "h" : "v";
      canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
    }
    if (!canBeScrolledInMainDirection) {
      return false;
    }
    if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) {
      activeAxis.current = currentAxis;
    }
    if (!currentAxis) {
      return true;
    }
    var cancelingAxis = activeAxis.current || currentAxis;
    return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
  }, []);
  var shouldPrevent = React34.useCallback(function(_event) {
    var event = _event;
    if (!lockStack.length || lockStack[lockStack.length - 1] !== Style2) {
      return;
    }
    var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
    var sourceEvent = shouldPreventQueue.current.filter(function(e) {
      return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
    })[0];
    if (sourceEvent && sourceEvent.should) {
      if (event.cancelable) {
        event.preventDefault();
      }
      return;
    }
    if (!sourceEvent) {
      var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
        return node.contains(event.target);
      });
      var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
      if (shouldStop) {
        if (event.cancelable) {
          event.preventDefault();
        }
      }
    }
  }, []);
  var shouldCancel = React34.useCallback(function(name, delta, target, should) {
    var event = { name, delta, target, should, shadowParent: getOutermostShadowParent(target) };
    shouldPreventQueue.current.push(event);
    setTimeout(function() {
      shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
        return e !== event;
      });
    }, 1);
  }, []);
  var scrollTouchStart = React34.useCallback(function(event) {
    touchStartRef.current = getTouchXY(event);
    activeAxis.current = void 0;
  }, []);
  var scrollWheel = React34.useCallback(function(event) {
    shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
  }, []);
  var scrollTouchMove = React34.useCallback(function(event) {
    shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
  }, []);
  React34.useEffect(function() {
    lockStack.push(Style2);
    props.setCallbacks({
      onScrollCapture: scrollWheel,
      onWheelCapture: scrollWheel,
      onTouchMoveCapture: scrollTouchMove
    });
    document.addEventListener("wheel", shouldPrevent, nonPassive);
    document.addEventListener("touchmove", shouldPrevent, nonPassive);
    document.addEventListener("touchstart", scrollTouchStart, nonPassive);
    return function() {
      lockStack = lockStack.filter(function(inst) {
        return inst !== Style2;
      });
      document.removeEventListener("wheel", shouldPrevent, nonPassive);
      document.removeEventListener("touchmove", shouldPrevent, nonPassive);
      document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
    };
  }, []);
  var removeScrollBar = props.removeScrollBar, inert = props.inert;
  return React34.createElement(
    React34.Fragment,
    null,
    inert ? React34.createElement(Style2, { styles: generateStyle(id) }) : null,
    removeScrollBar ? React34.createElement(RemoveScrollBar, { noRelative: props.noRelative, gapMode: props.gapMode }) : null
  );
}
function getOutermostShadowParent(node) {
  var shadowParent = null;
  while (node !== null) {
    if (node instanceof ShadowRoot) {
      shadowParent = node.host;
      node = node.host;
    }
    node = node.parentNode;
  }
  return shadowParent;
}

// ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll/dist/es2015/sidecar.js
var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);

// ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.4/node_modules/react-remove-scroll/dist/es2015/Combination.js
var ReactRemoveScroll = React35.forwardRef(function(props, ref) {
  return React35.createElement(RemoveScroll, __assign({}, props, { ref, sideCar: sidecar_default }));
});
ReactRemoveScroll.classNames = RemoveScroll.classNames;
var Combination_default = ReactRemoveScroll;

// ../../node_modules/.pnpm/aria-hidden@1.2.6/node_modules/aria-hidden/dist/es2015/index.js
var getDefaultParent = function(originalTarget) {
  if (typeof document === "undefined") {
    return null;
  }
  var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
  return sampleTarget.ownerDocument.body;
};
var counterMap = /* @__PURE__ */ new WeakMap();
var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function(node) {
  return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function(parent, targets) {
  return targets.map(function(target) {
    if (parent.contains(target)) {
      return target;
    }
    var correctedTarget = unwrapHost(target);
    if (correctedTarget && parent.contains(correctedTarget)) {
      return correctedTarget;
    }
    console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
    return null;
  }).filter(function(x) {
    return Boolean(x);
  });
};
var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
  var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
  if (!markerMap[markerName]) {
    markerMap[markerName] = /* @__PURE__ */ new WeakMap();
  }
  var markerCounter = markerMap[markerName];
  var hiddenNodes = [];
  var elementsToKeep = /* @__PURE__ */ new Set();
  var elementsToStop = new Set(targets);
  var keep = function(el) {
    if (!el || elementsToKeep.has(el)) {
      return;
    }
    elementsToKeep.add(el);
    keep(el.parentNode);
  };
  targets.forEach(keep);
  var deep = function(parent) {
    if (!parent || elementsToStop.has(parent)) {
      return;
    }
    Array.prototype.forEach.call(parent.children, function(node) {
      if (elementsToKeep.has(node)) {
        deep(node);
      } else {
        try {
          var attr = node.getAttribute(controlAttribute);
          var alreadyHidden = attr !== null && attr !== "false";
          var counterValue = (counterMap.get(node) || 0) + 1;
          var markerValue = (markerCounter.get(node) || 0) + 1;
          counterMap.set(node, counterValue);
          markerCounter.set(node, markerValue);
          hiddenNodes.push(node);
          if (counterValue === 1 && alreadyHidden) {
            uncontrolledNodes.set(node, true);
          }
          if (markerValue === 1) {
            node.setAttribute(markerName, "true");
          }
          if (!alreadyHidden) {
            node.setAttribute(controlAttribute, "true");
          }
        } catch (e) {
          console.error("aria-hidden: cannot operate on ", node, e);
        }
      }
    });
  };
  deep(parentNode);
  elementsToKeep.clear();
  lockCount++;
  return function() {
    hiddenNodes.forEach(function(node) {
      var counterValue = counterMap.get(node) - 1;
      var markerValue = markerCounter.get(node) - 1;
      counterMap.set(node, counterValue);
      markerCounter.set(node, markerValue);
      if (!counterValue) {
        if (!uncontrolledNodes.has(node)) {
          node.removeAttribute(controlAttribute);
        }
        uncontrolledNodes.delete(node);
      }
      if (!markerValue) {
        node.removeAttribute(markerName);
      }
    });
    lockCount--;
    if (!lockCount) {
      counterMap = /* @__PURE__ */ new WeakMap();
      counterMap = /* @__PURE__ */ new WeakMap();
      uncontrolledNodes = /* @__PURE__ */ new WeakMap();
      markerMap = {};
    }
  };
};
var hideOthers = function(originalTarget, parentNode, markerName) {
  if (markerName === void 0) {
    markerName = "data-aria-hidden";
  }
  var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
  var activeParentNode = parentNode || getDefaultParent(originalTarget);
  if (!activeParentNode) {
    return function() {
      return null;
    };
  }
  targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
  return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
};

// ../../node_modules/.pnpm/@radix-ui+react-dialog@1.1.15_@types+react-dom@19.2.3_@types+react@19.2.14__@types+reac_779045218dc2799d336e7197abef9d38/node_modules/@radix-ui/react-dialog/dist/index.mjs
var import_jsx_runtime28 = __toESM(require_jsx_runtime(), 1);
var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = (props) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const triggerRef = React36.useRef(null);
  const contentRef = React36.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME
  });
  return (0, import_jsx_runtime28.jsx)(
    DialogProvider,
    {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: useId2(),
      titleId: useId2(),
      descriptionId: useId2(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: React36.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children
    }
  );
};
Dialog.displayName = DIALOG_NAME;
var TRIGGER_NAME3 = "DialogTrigger";
var DialogTrigger = React36.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME3, __scopeDialog);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    return (0, import_jsx_runtime28.jsx)(
      Primitive3.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState3(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
DialogTrigger.displayName = TRIGGER_NAME3;
var PORTAL_NAME2 = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME2, {
  forceMount: void 0
});
var DialogPortal = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME2, __scopeDialog);
  return (0, import_jsx_runtime28.jsx)(PortalProvider, { scope: __scopeDialog, forceMount, children: React36.Children.map(children, (child) => (0, import_jsx_runtime28.jsx)(Presence, { present: forceMount || context.open, children: (0, import_jsx_runtime28.jsx)(Portal, { asChild: true, container, children: child }) })) });
};
DialogPortal.displayName = PORTAL_NAME2;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = React36.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? (0, import_jsx_runtime28.jsx)(Presence, { present: forceMount || context.open, children: (0, import_jsx_runtime28.jsx)(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
  }
);
DialogOverlay.displayName = OVERLAY_NAME;
var Slot3 = createSlot2("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = React36.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      (0, import_jsx_runtime28.jsx)(Combination_default, { as: Slot3, allowPinchZoom: true, shards: [context.contentRef], children: (0, import_jsx_runtime28.jsx)(
        Primitive3.div,
        {
          "data-state": getState3(context.open),
          ...overlayProps,
          ref: forwardedRef,
          style: { pointerEvents: "auto", ...overlayProps.style }
        }
      ) })
    );
  }
);
var CONTENT_NAME3 = "DialogContent";
var DialogContent = React36.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME3, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME3, props.__scopeDialog);
    return (0, import_jsx_runtime28.jsx)(Presence, { present: forceMount || context.open, children: context.modal ? (0, import_jsx_runtime28.jsx)(DialogContentModal, { ...contentProps, ref: forwardedRef }) : (0, import_jsx_runtime28.jsx)(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
DialogContent.displayName = CONTENT_NAME3;
var DialogContentModal = React36.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME3, props.__scopeDialog);
    const contentRef = React36.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
    React36.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return (0, import_jsx_runtime28.jsx)(
      DialogContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          var _a2;
          event.preventDefault();
          (_a2 = context.triggerRef.current) == null ? void 0 : _a2.focus();
        }),
        onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault()
        )
      }
    );
  }
);
var DialogContentNonModal = React36.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME3, props.__scopeDialog);
    const hasInteractedOutsideRef = React36.useRef(false);
    const hasPointerDownOutsideRef = React36.useRef(false);
    return (0, import_jsx_runtime28.jsx)(
      DialogContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          var _a2, _b;
          (_a2 = props.onCloseAutoFocus) == null ? void 0 : _a2.call(props, event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) (_b = context.triggerRef.current) == null ? void 0 : _b.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          var _a2, _b;
          (_a2 = props.onInteractOutside) == null ? void 0 : _a2.call(props, event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = (_b = context.triggerRef.current) == null ? void 0 : _b.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var DialogContentImpl = React36.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME3, __scopeDialog);
    const contentRef = React36.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    useFocusGuards();
    return (0, import_jsx_runtime28.jsxs)(import_jsx_runtime28.Fragment, { children: [
      (0, import_jsx_runtime28.jsx)(
        FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: (0, import_jsx_runtime28.jsx)(
            DismissableLayer,
            {
              role: "dialog",
              id: context.contentId,
              "aria-describedby": context.descriptionId,
              "aria-labelledby": context.titleId,
              "data-state": getState3(context.open),
              ...contentProps,
              ref: composedRefs,
              onDismiss: () => context.onOpenChange(false)
            }
          )
        }
      ),
      (0, import_jsx_runtime28.jsxs)(import_jsx_runtime28.Fragment, { children: [
        (0, import_jsx_runtime28.jsx)(TitleWarning, { titleId: context.titleId }),
        (0, import_jsx_runtime28.jsx)(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
      ] })
    ] });
  }
);
var TITLE_NAME = "DialogTitle";
var DialogTitle = React36.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return (0, import_jsx_runtime28.jsx)(Primitive3.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
  }
);
DialogTitle.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription = React36.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return (0, import_jsx_runtime28.jsx)(Primitive3.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
  }
);
DialogDescription.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose = React36.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return (0, import_jsx_runtime28.jsx)(
      Primitive3.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
DialogClose.displayName = CLOSE_NAME;
function getState3(open) {
  return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext22(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME3,
  titleName: TITLE_NAME,
  docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
  React36.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) console.error(MESSAGE);
    }
  }, [MESSAGE, titleId]);
  return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
  React36.useEffect(() => {
    var _a2;
    const describedById = (_a2 = contentRef.current) == null ? void 0 : _a2.getAttribute("aria-describedby");
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);
  return null;
};
var Root5 = Dialog;
var Trigger2 = DialogTrigger;
var Portal2 = DialogPortal;
var Overlay = DialogOverlay;
var Content2 = DialogContent;
var Title = DialogTitle;
var Description = DialogDescription;
var Close = DialogClose;

// ../../node_modules/.pnpm/@radix-ui+react-alert-dialog@1.1.15_@types+react-dom@19.2.3_@types+react@19.2.14__@type_d492cfbed6c88f7a3980b921a627d48d/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs
var import_jsx_runtime29 = __toESM(require_jsx_runtime(), 1);
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext, createAlertDialogScope] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return (0, import_jsx_runtime29.jsx)(Root5, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog.displayName = ROOT_NAME;
var TRIGGER_NAME4 = "AlertDialogTrigger";
var AlertDialogTrigger = React37.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return (0, import_jsx_runtime29.jsx)(Trigger2, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger.displayName = TRIGGER_NAME4;
var PORTAL_NAME3 = "AlertDialogPortal";
var AlertDialogPortal = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return (0, import_jsx_runtime29.jsx)(Portal2, { ...dialogScope, ...portalProps });
};
AlertDialogPortal.displayName = PORTAL_NAME3;
var OVERLAY_NAME2 = "AlertDialogOverlay";
var AlertDialogOverlay = React37.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return (0, import_jsx_runtime29.jsx)(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay.displayName = OVERLAY_NAME2;
var CONTENT_NAME4 = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME4);
var Slottable3 = createSlottable2("AlertDialogContent");
var AlertDialogContent = React37.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = React37.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = React37.useRef(null);
    return (0, import_jsx_runtime29.jsx)(
      WarningProvider,
      {
        contentName: CONTENT_NAME4,
        titleName: TITLE_NAME2,
        docsSlug: "alert-dialog",
        children: (0, import_jsx_runtime29.jsx)(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: (0, import_jsx_runtime29.jsxs)(
          Content2,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a2;
              event.preventDefault();
              (_a2 = cancelRef.current) == null ? void 0 : _a2.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              (0, import_jsx_runtime29.jsx)(Slottable3, { children }),
              (0, import_jsx_runtime29.jsx)(DescriptionWarning2, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent.displayName = CONTENT_NAME4;
var TITLE_NAME2 = "AlertDialogTitle";
var AlertDialogTitle = React37.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return (0, import_jsx_runtime29.jsx)(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle.displayName = TITLE_NAME2;
var DESCRIPTION_NAME2 = "AlertDialogDescription";
var AlertDialogDescription = React37.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return (0, import_jsx_runtime29.jsx)(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription.displayName = DESCRIPTION_NAME2;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction = React37.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return (0, import_jsx_runtime29.jsx)(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel = React37.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return (0, import_jsx_runtime29.jsx)(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel.displayName = CANCEL_NAME;
var DescriptionWarning2 = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME4}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME4}\` by passing a \`${DESCRIPTION_NAME2}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME4}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  React37.useEffect(() => {
    var _a2;
    const hasDescription = document.getElementById(
      (_a2 = contentRef.current) == null ? void 0 : _a2.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};

// ../../node_modules/.pnpm/@radix-ui+react-aspect-ratio@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types_96bcec06796fd925f9bce26c5b0bc695/node_modules/@radix-ui/react-aspect-ratio/dist/index.mjs
var React38 = __toESM(require_react(), 1);
var import_jsx_runtime30 = __toESM(require_jsx_runtime(), 1);
var NAME3 = "AspectRatio";
var AspectRatio = React38.forwardRef(
  (props, forwardedRef) => {
    const { ratio = 1 / 1, style, ...aspectRatioProps } = props;
    return (0, import_jsx_runtime30.jsx)(
      "div",
      {
        style: {
          // ensures inner element is contained
          position: "relative",
          // ensures padding bottom trick maths works
          width: "100%",
          paddingBottom: `${100 / ratio}%`
        },
        "data-radix-aspect-ratio-wrapper": "",
        children: (0, import_jsx_runtime30.jsx)(
          Primitive3.div,
          {
            ...aspectRatioProps,
            ref: forwardedRef,
            style: {
              ...style,
              // ensures children expand in ratio
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          }
        )
      }
    );
  }
);
AspectRatio.displayName = NAME3;

// ../../node_modules/.pnpm/@radix-ui+react-avatar@1.1.10_@types+react-dom@19.2.3_@types+react@19.2.14__@types+reac_06c5a164da4523571d3e9cd55d04eddf/node_modules/@radix-ui/react-avatar/dist/index.mjs
var React39 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-use-is-hydrated@0.1.0_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-use-is-hydrated/dist/index.mjs
var import_shim = __toESM(require_shim(), 1);
function useIsHydrated() {
  return (0, import_shim.useSyncExternalStore)(
    subscribe,
    () => true,
    () => false
  );
}
function subscribe() {
  return () => {
  };
}

// ../../node_modules/.pnpm/@radix-ui+react-avatar@1.1.10_@types+react-dom@19.2.3_@types+react@19.2.14__@types+reac_06c5a164da4523571d3e9cd55d04eddf/node_modules/@radix-ui/react-avatar/dist/index.mjs
var import_jsx_runtime31 = __toESM(require_jsx_runtime(), 1);
var AVATAR_NAME = "Avatar";
var [createAvatarContext, createAvatarScope] = createContextScope(AVATAR_NAME);
var [AvatarProvider, useAvatarContext] = createAvatarContext(AVATAR_NAME);
var Avatar = React39.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAvatar, ...avatarProps } = props;
    const [imageLoadingStatus, setImageLoadingStatus] = React39.useState("idle");
    return (0, import_jsx_runtime31.jsx)(
      AvatarProvider,
      {
        scope: __scopeAvatar,
        imageLoadingStatus,
        onImageLoadingStatusChange: setImageLoadingStatus,
        children: (0, import_jsx_runtime31.jsx)(Primitive3.span, { ...avatarProps, ref: forwardedRef })
      }
    );
  }
);
Avatar.displayName = AVATAR_NAME;
var IMAGE_NAME = "AvatarImage";
var AvatarImage = React39.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAvatar, src, onLoadingStatusChange = () => {
    }, ...imageProps } = props;
    const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);
    const imageLoadingStatus = useImageLoadingStatus(src, imageProps);
    const handleLoadingStatusChange = useCallbackRef((status) => {
      onLoadingStatusChange(status);
      context.onImageLoadingStatusChange(status);
    });
    useLayoutEffect2(() => {
      if (imageLoadingStatus !== "idle") {
        handleLoadingStatusChange(imageLoadingStatus);
      }
    }, [imageLoadingStatus, handleLoadingStatusChange]);
    return imageLoadingStatus === "loaded" ? (0, import_jsx_runtime31.jsx)(Primitive3.img, { ...imageProps, ref: forwardedRef, src }) : null;
  }
);
AvatarImage.displayName = IMAGE_NAME;
var FALLBACK_NAME = "AvatarFallback";
var AvatarFallback = React39.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAvatar, delayMs, ...fallbackProps } = props;
    const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar);
    const [canRender, setCanRender] = React39.useState(delayMs === void 0);
    React39.useEffect(() => {
      if (delayMs !== void 0) {
        const timerId = window.setTimeout(() => setCanRender(true), delayMs);
        return () => window.clearTimeout(timerId);
      }
    }, [delayMs]);
    return canRender && context.imageLoadingStatus !== "loaded" ? (0, import_jsx_runtime31.jsx)(Primitive3.span, { ...fallbackProps, ref: forwardedRef }) : null;
  }
);
AvatarFallback.displayName = FALLBACK_NAME;
function resolveLoadingStatus(image, src) {
  if (!image) {
    return "idle";
  }
  if (!src) {
    return "error";
  }
  if (image.src !== src) {
    image.src = src;
  }
  return image.complete && image.naturalWidth > 0 ? "loaded" : "loading";
}
function useImageLoadingStatus(src, { referrerPolicy, crossOrigin }) {
  const isHydrated = useIsHydrated();
  const imageRef = React39.useRef(null);
  const image = (() => {
    if (!isHydrated) return null;
    if (!imageRef.current) {
      imageRef.current = new window.Image();
    }
    return imageRef.current;
  })();
  const [loadingStatus, setLoadingStatus] = React39.useState(
    () => resolveLoadingStatus(image, src)
  );
  useLayoutEffect2(() => {
    setLoadingStatus(resolveLoadingStatus(image, src));
  }, [image, src]);
  useLayoutEffect2(() => {
    const updateStatus = (status) => () => {
      setLoadingStatus(status);
    };
    if (!image) return;
    const handleLoad = updateStatus("loaded");
    const handleError = updateStatus("error");
    image.addEventListener("load", handleLoad);
    image.addEventListener("error", handleError);
    if (referrerPolicy) {
      image.referrerPolicy = referrerPolicy;
    }
    if (typeof crossOrigin === "string") {
      image.crossOrigin = crossOrigin;
    }
    return () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };
  }, [image, crossOrigin, referrerPolicy]);
  return loadingStatus;
}

// ../../node_modules/.pnpm/@radix-ui+react-checkbox@1.3.3_@types+react-dom@19.2.3_@types+react@19.2.14__@types+rea_a9bfe74df417688e01ae6068318bf0dd/node_modules/@radix-ui/react-checkbox/dist/index.mjs
var React42 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-use-previous@1.1.1_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-use-previous/dist/index.mjs
var React40 = __toESM(require_react(), 1);
function usePrevious(value) {
  const ref = React40.useRef({ value, previous: value });
  return React40.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}

// ../../node_modules/.pnpm/@radix-ui+react-use-size@1.1.1_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-use-size/dist/index.mjs
var React41 = __toESM(require_react(), 1);
function useSize(element) {
  const [size4, setSize] = React41.useState(void 0);
  useLayoutEffect2(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (!entries.length) {
          return;
        }
        const entry = entries[0];
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSizeEntry = entry["borderBoxSize"];
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize["inlineSize"];
          height = borderSize["blockSize"];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }
        setSize({ width, height });
      });
      resizeObserver.observe(element, { box: "border-box" });
      return () => resizeObserver.unobserve(element);
    } else {
      setSize(void 0);
    }
  }, [element]);
  return size4;
}

// ../../node_modules/.pnpm/@radix-ui+react-checkbox@1.3.3_@types+react-dom@19.2.3_@types+react@19.2.14__@types+rea_a9bfe74df417688e01ae6068318bf0dd/node_modules/@radix-ui/react-checkbox/dist/index.mjs
var import_jsx_runtime32 = __toESM(require_jsx_runtime(), 1);
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = React42.useState(null);
  const [bubbleInput, setBubbleInput] = React42.useState(null);
  const hasConsumerStoppedPropagationRef = React42.useRef(false);
  const isFormControl2 = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl: isFormControl2,
    bubbleInput,
    setBubbleInput
  };
  return (0, import_jsx_runtime32.jsx)(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction2(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME5 = "CheckboxTrigger";
var CheckboxTrigger = React42.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl: isFormControl2,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME5, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = React42.useRef(checked);
    React42.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return (0, import_jsx_runtime32.jsx)(
      Primitive3.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState4(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl2) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME5;
var Checkbox = React42.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return (0, import_jsx_runtime32.jsx)(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl: isFormControl2 }) => (0, import_jsx_runtime32.jsxs)(import_jsx_runtime32.Fragment, { children: [
          (0, import_jsx_runtime32.jsx)(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl2 && (0, import_jsx_runtime32.jsx)(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = React42.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return (0, import_jsx_runtime32.jsx)(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: (0, import_jsx_runtime32.jsx)(
          Primitive3.span,
          {
            "data-state": getState4(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = React42.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    React42.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = React42.useRef(isIndeterminate(checked) ? false : checked);
    return (0, import_jsx_runtime32.jsx)(
      Primitive3.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction2(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState4(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}

// ../../node_modules/.pnpm/@radix-ui+react-context-menu@2.2.16_@types+react-dom@19.2.3_@types+react@19.2.14__@type_7ddebea395c65d3c4d3683b445765102/node_modules/@radix-ui/react-context-menu/dist/index.mjs
var React48 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_73ff7391b7be14d4dbff03af4dbac090/node_modules/@radix-ui/react-menu/dist/index.mjs
var React47 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-popper@1.2.8_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react_13e0521d8aea7ebfbfb8bee1fb615c05/node_modules/@radix-ui/react-popper/dist/index.mjs
var React45 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var sides = ["top", "right", "bottom", "left"];
var alignments = ["start", "end"];
var placements = sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
var min = Math.min;
var max = Math.max;
var round = Math.round;
var floor = Math.floor;
var createCoords = (v) => ({
  x: v,
  y: v
});
var oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  const firstChar = placement[0];
  return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
var lrPlacement = ["left", "right"];
var rlPlacement = ["right", "left"];
var tbPlacement = ["top", "bottom"];
var btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case "left":
    case "right":
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  const side = getSide(placement);
  return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}

// ../../node_modules/.pnpm/@floating-ui+core@1.7.5/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
var MAX_RESET_COUNT = 50;
var computePosition = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const platformWithDetectOverflow = platform2.detectOverflow ? platform2 : {
    ...platform2,
    detectOverflow
  };
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let resetCount = 0;
  const middlewareData = {};
  for (let i = 0; i < middleware.length; i++) {
    const currentMiddleware = middleware[i];
    if (!currentMiddleware) {
      continue;
    }
    const {
      name,
      fn
    } = currentMiddleware;
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platformWithDetectOverflow,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData[name] = {
      ...middlewareData[name],
      ...data
    };
    if (reset && resetCount < MAX_RESET_COUNT) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
var arrow = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state;
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset4 = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset4 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset4,
        centerOffset: center - offset4 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
var flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements2 = [initialPlacement, ...fallbackPlacements];
      const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides2 = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements2[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some((side) => overflow[side] >= 0);
}
var hide = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "hide",
    options,
    async fn(state) {
      const {
        rects,
        platform: platform2
      } = state;
      const {
        strategy = "referenceHidden",
        ...detectOverflowOptions
      } = evaluate(options, state);
      switch (strategy) {
        case "referenceHidden": {
          const overflow = await platform2.detectOverflow(state, {
            ...detectOverflowOptions,
            elementContext: "reference"
          });
          const offsets = getSideOffsets(overflow, rects.reference);
          return {
            data: {
              referenceHiddenOffsets: offsets,
              referenceHidden: isAnySideFullyClipped(offsets)
            }
          };
        }
        case "escaped": {
          const overflow = await platform2.detectOverflow(state, {
            ...detectOverflowOptions,
            altBoundary: true
          });
          const offsets = getSideOffsets(overflow, rects.floating);
          return {
            data: {
              escapedOffsets: offsets,
              escaped: isAnySideFullyClipped(offsets)
            }
          };
        }
        default: {
          return {};
        }
      }
    }
  };
};
var originSides = /* @__PURE__ */ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
var offset = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
var shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        platform: platform2
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
var limitShift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset: offset4 = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset4, state);
      const computedOffset = typeof rawOffset === "number" ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === "y" ? "height" : "width";
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === "y" ? "width" : "height";
        const isOriginSide = originSides.has(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};
var size = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "size",
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform: platform2,
        elements
      } = state;
      const {
        apply = () => {
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === "y";
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === "top" || side === "bottom") {
        heightSide = side;
        widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
      } else {
        widthSide = side;
        heightSide = alignment === "end" ? "top" : "bottom";
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform2.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};

// ../../node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode2(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode2(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode2(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle2(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
  return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
  try {
    if (element.matches(":popover-open")) {
      return true;
    }
  } catch (_e) {
  }
  try {
    return element.matches(":modal");
  } catch (_e) {
    return false;
  }
}
var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
var containRe = /paint|layout|strict|content/;
var isNotNone = (value) => !!value && value !== "none";
var isWebKitValue;
function isContainingBlock(elementOrCss) {
  const css = isElement(elementOrCss) ? getComputedStyle2(elementOrCss) : elementOrCss;
  return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (isWebKitValue == null) {
    isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
  }
  return isWebKitValue;
}
function isLastTraversableNode(node) {
  return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle2(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  } else {
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}

// ../../node_modules/.pnpm/@floating-ui+dom@1.7.6/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
  const css = getComputedStyle2(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
var noOffsets = createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle2(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle2(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
var SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
      width -= clippingStableScrollbarWidth;
    }
  } else if (windowScrollbarX <= SCROLLBAR_MAX) {
    width += windowScrollbarX;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle2(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle2(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle2(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && (currentContainingBlockComputedStyle.position === "absolute" || currentContainingBlockComputedStyle.position === "fixed") || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
  let top = firstRect.top;
  let right = firstRect.right;
  let bottom = firstRect.bottom;
  let left = firstRect.left;
  for (let i = 1; i < clippingAncestors.length; i++) {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
    top = max(rect.top, top);
    right = min(rect.right, right);
    bottom = min(rect.bottom, bottom);
    left = max(rect.left, left);
  }
  return {
    width: right - left,
    height: bottom - top,
    x: left,
    y: top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle2(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
var getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle2(element).direction === "rtl";
}
var platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        refresh();
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    if (floating) {
      resizeObserver.observe(floating);
    }
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
var offset2 = offset;
var shift2 = shift;
var flip2 = flip;
var size2 = size;
var hide2 = hide;
var arrow2 = arrow;
var limitShift2 = limitShift;
var computePosition2 = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

// ../../node_modules/.pnpm/@floating-ui+react-dom@2.1.8_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs
var React43 = __toESM(require_react(), 1);
var import_react53 = __toESM(require_react(), 1);
var ReactDOM4 = __toESM(require_react_dom(), 1);
var isClient = typeof document !== "undefined";
var noop = function noop2() {
};
var index = isClient ? import_react53.useLayoutEffect : noop;
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === "function" && a.toString() === b.toString()) {
    return true;
  }
  let length;
  let i;
  let keys;
  if (a && b && typeof a === "object") {
    if (Array.isArray(a)) {
      length = a.length;
      if (length !== b.length) return false;
      for (i = length; i-- !== 0; ) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) {
      return false;
    }
    for (i = length; i-- !== 0; ) {
      if (!{}.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }
    for (i = length; i-- !== 0; ) {
      const key = keys[i];
      if (key === "_owner" && a.$$typeof) {
        continue;
      }
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a !== a && b !== b;
}
function getDPR(element) {
  if (typeof window === "undefined") {
    return 1;
  }
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}
function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}
function useLatestRef2(value) {
  const ref = React43.useRef(value);
  index(() => {
    ref.current = value;
  });
  return ref;
}
function useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2,
    elements: {
      reference: externalReference,
      floating: externalFloating
    } = {},
    transform = true,
    whileElementsMounted,
    open
  } = options;
  const [data, setData] = React43.useState({
    x: 0,
    y: 0,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false
  });
  const [latestMiddleware, setLatestMiddleware] = React43.useState(middleware);
  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }
  const [_reference, _setReference] = React43.useState(null);
  const [_floating, _setFloating] = React43.useState(null);
  const setReference = React43.useCallback((node) => {
    if (node !== referenceRef.current) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);
  const setFloating = React43.useCallback((node) => {
    if (node !== floatingRef.current) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);
  const referenceEl = externalReference || _reference;
  const floatingEl = externalFloating || _floating;
  const referenceRef = React43.useRef(null);
  const floatingRef = React43.useRef(null);
  const dataRef = React43.useRef(data);
  const hasWhileElementsMounted = whileElementsMounted != null;
  const whileElementsMountedRef = useLatestRef2(whileElementsMounted);
  const platformRef = useLatestRef2(platform2);
  const openRef = useLatestRef2(open);
  const update = React43.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }
    const config = {
      placement,
      strategy,
      middleware: latestMiddleware
    };
    if (platformRef.current) {
      config.platform = platformRef.current;
    }
    computePosition2(referenceRef.current, floatingRef.current, config).then((data2) => {
      const fullData = {
        ...data2,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: openRef.current !== false
      };
      if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
        dataRef.current = fullData;
        ReactDOM4.flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, platformRef, openRef]);
  index(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData((data2) => ({
        ...data2,
        isPositioned: false
      }));
    }
  }, [open]);
  const isMountedRef = React43.useRef(false);
  index(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  index(() => {
    if (referenceEl) referenceRef.current = referenceEl;
    if (floatingEl) floatingRef.current = floatingEl;
    if (referenceEl && floatingEl) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(referenceEl, floatingEl, update);
      }
      update();
    }
  }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
  const refs = React43.useMemo(() => ({
    reference: referenceRef,
    floating: floatingRef,
    setReference,
    setFloating
  }), [setReference, setFloating]);
  const elements = React43.useMemo(() => ({
    reference: referenceEl,
    floating: floatingEl
  }), [referenceEl, floatingEl]);
  const floatingStyles = React43.useMemo(() => {
    const initialStyles = {
      position: strategy,
      left: 0,
      top: 0
    };
    if (!elements.floating) {
      return initialStyles;
    }
    const x = roundByDPR(elements.floating, data.x);
    const y = roundByDPR(elements.floating, data.y);
    if (transform) {
      return {
        ...initialStyles,
        transform: "translate(" + x + "px, " + y + "px)",
        ...getDPR(elements.floating) >= 1.5 && {
          willChange: "transform"
        }
      };
    }
    return {
      position: strategy,
      left: x,
      top: y
    };
  }, [strategy, transform, elements.floating, data.x, data.y]);
  return React43.useMemo(() => ({
    ...data,
    update,
    refs,
    elements,
    floatingStyles
  }), [data, update, refs, elements, floatingStyles]);
}
var arrow$1 = (options) => {
  function isRef(value) {
    return {}.hasOwnProperty.call(value, "current");
  }
  return {
    name: "arrow",
    options,
    fn(state) {
      const {
        element,
        padding
      } = typeof options === "function" ? options(state) : options;
      if (element && isRef(element)) {
        if (element.current != null) {
          return arrow2({
            element: element.current,
            padding
          }).fn(state);
        }
        return {};
      }
      if (element) {
        return arrow2({
          element,
          padding
        }).fn(state);
      }
      return {};
    }
  };
};
var offset3 = (options, deps) => {
  const result = offset2(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
var shift3 = (options, deps) => {
  const result = shift2(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
var limitShift3 = (options, deps) => {
  const result = limitShift2(options);
  return {
    fn: result.fn,
    options: [options, deps]
  };
};
var flip3 = (options, deps) => {
  const result = flip2(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
var size3 = (options, deps) => {
  const result = size2(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
var hide3 = (options, deps) => {
  const result = hide2(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
var arrow3 = (options, deps) => {
  const result = arrow$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};

// ../../node_modules/.pnpm/@radix-ui+react-arrow@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_e05f2c19a58a99fddf374207b5e3778c/node_modules/@radix-ui/react-arrow/dist/index.mjs
var React44 = __toESM(require_react(), 1);
var import_jsx_runtime33 = __toESM(require_jsx_runtime(), 1);
var NAME4 = "Arrow";
var Arrow = React44.forwardRef((props, forwardedRef) => {
  const { children, width = 10, height = 5, ...arrowProps } = props;
  return (0, import_jsx_runtime33.jsx)(
    Primitive3.svg,
    {
      ...arrowProps,
      ref: forwardedRef,
      width,
      height,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: props.asChild ? children : (0, import_jsx_runtime33.jsx)("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Arrow.displayName = NAME4;
var Root6 = Arrow;

// ../../node_modules/.pnpm/@radix-ui+react-popper@1.2.8_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react_13e0521d8aea7ebfbfb8bee1fb615c05/node_modules/@radix-ui/react-popper/dist/index.mjs
var import_jsx_runtime34 = __toESM(require_jsx_runtime(), 1);
var POPPER_NAME = "Popper";
var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
var Popper = (props) => {
  const { __scopePopper, children } = props;
  const [anchor, setAnchor] = React45.useState(null);
  return (0, import_jsx_runtime34.jsx)(PopperProvider, { scope: __scopePopper, anchor, onAnchorChange: setAnchor, children });
};
Popper.displayName = POPPER_NAME;
var ANCHOR_NAME = "PopperAnchor";
var PopperAnchor = React45.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props;
    const context = usePopperContext(ANCHOR_NAME, __scopePopper);
    const ref = React45.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const anchorRef = React45.useRef(null);
    React45.useEffect(() => {
      const previousAnchor = anchorRef.current;
      anchorRef.current = (virtualRef == null ? void 0 : virtualRef.current) || ref.current;
      if (previousAnchor !== anchorRef.current) {
        context.onAnchorChange(anchorRef.current);
      }
    });
    return virtualRef ? null : (0, import_jsx_runtime34.jsx)(Primitive3.div, { ...anchorProps, ref: composedRefs });
  }
);
PopperAnchor.displayName = ANCHOR_NAME;
var CONTENT_NAME5 = "PopperContent";
var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME5);
var PopperContent = React45.forwardRef(
  (props, forwardedRef) => {
    var _a2, _b, _c, _d, _e, _f;
    const {
      __scopePopper,
      side = "bottom",
      sideOffset = 0,
      align = "center",
      alignOffset = 0,
      arrowPadding = 0,
      avoidCollisions = true,
      collisionBoundary = [],
      collisionPadding: collisionPaddingProp = 0,
      sticky = "partial",
      hideWhenDetached = false,
      updatePositionStrategy = "optimized",
      onPlaced,
      ...contentProps
    } = props;
    const context = usePopperContext(CONTENT_NAME5, __scopePopper);
    const [content, setContent] = React45.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [arrow4, setArrow] = React45.useState(null);
    const arrowSize = useSize(arrow4);
    const arrowWidth = (arrowSize == null ? void 0 : arrowSize.width) ?? 0;
    const arrowHeight = (arrowSize == null ? void 0 : arrowSize.height) ?? 0;
    const desiredPlacement = side + (align !== "center" ? "-" + align : "");
    const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
    const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
    const hasExplicitBoundaries = boundary.length > 0;
    const detectOverflowOptions = {
      padding: collisionPadding,
      boundary: boundary.filter(isNotNull),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: hasExplicitBoundaries
    };
    const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: desiredPlacement,
      whileElementsMounted: (...args) => {
        const cleanup = autoUpdate(...args, {
          animationFrame: updatePositionStrategy === "always"
        });
        return cleanup;
      },
      elements: {
        reference: context.anchor
      },
      middleware: [
        offset3({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
        avoidCollisions && shift3({
          mainAxis: true,
          crossAxis: false,
          limiter: sticky === "partial" ? limitShift3() : void 0,
          ...detectOverflowOptions
        }),
        avoidCollisions && flip3({ ...detectOverflowOptions }),
        size3({
          ...detectOverflowOptions,
          apply: ({ elements, rects, availableWidth, availableHeight }) => {
            const { width: anchorWidth, height: anchorHeight } = rects.reference;
            const contentStyle = elements.floating.style;
            contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
            contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
            contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
            contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
          }
        }),
        arrow4 && arrow3({ element: arrow4, padding: arrowPadding }),
        transformOrigin({ arrowWidth, arrowHeight }),
        hideWhenDetached && hide3({ strategy: "referenceHidden", ...detectOverflowOptions })
      ]
    });
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const handlePlaced = useCallbackRef(onPlaced);
    useLayoutEffect2(() => {
      if (isPositioned) {
        handlePlaced == null ? void 0 : handlePlaced();
      }
    }, [isPositioned, handlePlaced]);
    const arrowX = (_a2 = middlewareData.arrow) == null ? void 0 : _a2.x;
    const arrowY = (_b = middlewareData.arrow) == null ? void 0 : _b.y;
    const cannotCenterArrow = ((_c = middlewareData.arrow) == null ? void 0 : _c.centerOffset) !== 0;
    const [contentZIndex, setContentZIndex] = React45.useState();
    useLayoutEffect2(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);
    return (0, import_jsx_runtime34.jsx)(
      "div",
      {
        ref: refs.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...floatingStyles,
          transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: contentZIndex,
          ["--radix-popper-transform-origin"]: [
            (_d = middlewareData.transformOrigin) == null ? void 0 : _d.x,
            (_e = middlewareData.transformOrigin) == null ? void 0 : _e.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((_f = middlewareData.hide) == null ? void 0 : _f.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: props.dir,
        children: (0, import_jsx_runtime34.jsx)(
          PopperContentProvider,
          {
            scope: __scopePopper,
            placedSide,
            onArrowChange: setArrow,
            arrowX,
            arrowY,
            shouldHideArrow: cannotCenterArrow,
            children: (0, import_jsx_runtime34.jsx)(
              Primitive3.div,
              {
                "data-side": placedSide,
                "data-align": placedAlign,
                ...contentProps,
                ref: composedRefs,
                style: {
                  ...contentProps.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: !isPositioned ? "none" : void 0
                }
              }
            )
          }
        )
      }
    );
  }
);
PopperContent.displayName = CONTENT_NAME5;
var ARROW_NAME = "PopperArrow";
var OPPOSITE_SIDE = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
var PopperArrow = React45.forwardRef(function PopperArrow2(props, forwardedRef) {
  const { __scopePopper, ...arrowProps } = props;
  const contentContext = useContentContext(ARROW_NAME, __scopePopper);
  const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    (0, import_jsx_runtime34.jsx)(
      "span",
      {
        ref: contentContext.onArrowChange,
        style: {
          position: "absolute",
          left: contentContext.arrowX,
          top: contentContext.arrowY,
          [baseSide]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[contentContext.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: `rotate(180deg)`,
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[contentContext.placedSide],
          visibility: contentContext.shouldHideArrow ? "hidden" : void 0
        },
        children: (0, import_jsx_runtime34.jsx)(
          Root6,
          {
            ...arrowProps,
            ref: forwardedRef,
            style: {
              ...arrowProps.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
PopperArrow.displayName = ARROW_NAME;
function isNotNull(value) {
  return value !== null;
}
var transformOrigin = (options) => ({
  name: "transformOrigin",
  options,
  fn(data) {
    var _a2, _b, _c;
    const { placement, rects, middlewareData } = data;
    const cannotCenterArrow = ((_a2 = middlewareData.arrow) == null ? void 0 : _a2.centerOffset) !== 0;
    const isArrowHidden = cannotCenterArrow;
    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
    const arrowXCenter = (((_b = middlewareData.arrow) == null ? void 0 : _b.x) ?? 0) + arrowWidth / 2;
    const arrowYCenter = (((_c = middlewareData.arrow) == null ? void 0 : _c.y) ?? 0) + arrowHeight / 2;
    let x = "";
    let y = "";
    if (placedSide === "bottom") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${-arrowHeight}px`;
    } else if (placedSide === "top") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${rects.floating.height + arrowHeight}px`;
    } else if (placedSide === "right") {
      x = `${-arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    } else if (placedSide === "left") {
      x = `${rects.floating.width + arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    }
    return { data: { x, y } };
  }
});
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
var Root22 = Popper;
var Anchor = PopperAnchor;
var Content3 = PopperContent;
var Arrow2 = PopperArrow;

// ../../node_modules/.pnpm/@radix-ui+react-roving-focus@1.1.11_@types+react-dom@19.2.3_@types+react@19.2.14__@type_4eeb29c998b846c35358e2f929e7490e/node_modules/@radix-ui/react-roving-focus/dist/index.mjs
var React46 = __toESM(require_react(), 1);
var import_jsx_runtime35 = __toESM(require_jsx_runtime(), 1);
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS2 = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection2, useCollection2, createCollectionScope2] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope2]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = React46.forwardRef(
  (props, forwardedRef) => {
    return (0, import_jsx_runtime35.jsx)(Collection2.Provider, { scope: props.__scopeRovingFocusGroup, children: (0, import_jsx_runtime35.jsx)(Collection2.Slot, { scope: props.__scopeRovingFocusGroup, children: (0, import_jsx_runtime35.jsx)(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = React46.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = React46.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = React46.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection2(__scopeRovingFocusGroup);
  const isClickFocusRef = React46.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = React46.useState(0);
  React46.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return (0, import_jsx_runtime35.jsx)(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: React46.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: React46.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: React46.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: React46.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: (0, import_jsx_runtime35.jsx)(
        Primitive3.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS2);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst2(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME2 = "RovingFocusGroupItem";
var RovingFocusGroupItem = React46.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId2();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME2, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection2(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    React46.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return (0, import_jsx_runtime35.jsx)(
      Collection2.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: (0, import_jsx_runtime35.jsx)(
          Primitive3.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst2(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME2;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst2(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index4) => array[(startIndex + index4) % array.length]);
}
var Root7 = RovingFocusGroup;
var Item = RovingFocusGroupItem;

// ../../node_modules/.pnpm/@radix-ui+react-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_73ff7391b7be14d4dbff03af4dbac090/node_modules/@radix-ui/react-menu/dist/index.mjs
var import_jsx_runtime36 = __toESM(require_jsx_runtime(), 1);
var SELECTION_KEYS = ["Enter", " "];
var FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
var LAST_KEYS = ["ArrowUp", "PageDown", "End"];
var FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
var SUB_OPEN_KEYS = {
  ltr: [...SELECTION_KEYS, "ArrowRight"],
  rtl: [...SELECTION_KEYS, "ArrowLeft"]
};
var SUB_CLOSE_KEYS = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
};
var MENU_NAME = "Menu";
var [Collection3, useCollection3, createCollectionScope3] = createCollection(MENU_NAME);
var [createMenuContext, createMenuScope] = createContextScope(MENU_NAME, [
  createCollectionScope3,
  createPopperScope,
  createRovingFocusGroupScope
]);
var usePopperScope = createPopperScope();
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [MenuProvider, useMenuContext] = createMenuContext(MENU_NAME);
var [MenuRootProvider, useMenuRootContext] = createMenuContext(MENU_NAME);
var Menu = (props) => {
  const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props;
  const popperScope = usePopperScope(__scopeMenu);
  const [content, setContent] = React47.useState(null);
  const isUsingKeyboardRef = React47.useRef(false);
  const handleOpenChange = useCallbackRef(onOpenChange);
  const direction = useDirection(dir);
  React47.useEffect(() => {
    const handleKeyDown = () => {
      isUsingKeyboardRef.current = true;
      document.addEventListener("pointerdown", handlePointer, { capture: true, once: true });
      document.addEventListener("pointermove", handlePointer, { capture: true, once: true });
    };
    const handlePointer = () => isUsingKeyboardRef.current = false;
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("pointerdown", handlePointer, { capture: true });
      document.removeEventListener("pointermove", handlePointer, { capture: true });
    };
  }, []);
  return (0, import_jsx_runtime36.jsx)(Root22, { ...popperScope, children: (0, import_jsx_runtime36.jsx)(
    MenuProvider,
    {
      scope: __scopeMenu,
      open,
      onOpenChange: handleOpenChange,
      content,
      onContentChange: setContent,
      children: (0, import_jsx_runtime36.jsx)(
        MenuRootProvider,
        {
          scope: __scopeMenu,
          onClose: React47.useCallback(() => handleOpenChange(false), [handleOpenChange]),
          isUsingKeyboardRef,
          dir: direction,
          modal,
          children
        }
      )
    }
  ) });
};
Menu.displayName = MENU_NAME;
var ANCHOR_NAME2 = "MenuAnchor";
var MenuAnchor = React47.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...anchorProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return (0, import_jsx_runtime36.jsx)(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
  }
);
MenuAnchor.displayName = ANCHOR_NAME2;
var PORTAL_NAME4 = "MenuPortal";
var [PortalProvider2, usePortalContext2] = createMenuContext(PORTAL_NAME4, {
  forceMount: void 0
});
var MenuPortal = (props) => {
  const { __scopeMenu, forceMount, children, container } = props;
  const context = useMenuContext(PORTAL_NAME4, __scopeMenu);
  return (0, import_jsx_runtime36.jsx)(PortalProvider2, { scope: __scopeMenu, forceMount, children: (0, import_jsx_runtime36.jsx)(Presence, { present: forceMount || context.open, children: (0, import_jsx_runtime36.jsx)(Portal, { asChild: true, container, children }) }) });
};
MenuPortal.displayName = PORTAL_NAME4;
var CONTENT_NAME6 = "MenuContent";
var [MenuContentProvider, useMenuContentContext] = createMenuContext(CONTENT_NAME6);
var MenuContent = React47.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext2(CONTENT_NAME6, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useMenuContext(CONTENT_NAME6, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME6, props.__scopeMenu);
    return (0, import_jsx_runtime36.jsx)(Collection3.Provider, { scope: props.__scopeMenu, children: (0, import_jsx_runtime36.jsx)(Presence, { present: forceMount || context.open, children: (0, import_jsx_runtime36.jsx)(Collection3.Slot, { scope: props.__scopeMenu, children: rootContext.modal ? (0, import_jsx_runtime36.jsx)(MenuRootContentModal, { ...contentProps, ref: forwardedRef }) : (0, import_jsx_runtime36.jsx)(MenuRootContentNonModal, { ...contentProps, ref: forwardedRef }) }) }) });
  }
);
var MenuRootContentModal = React47.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME6, props.__scopeMenu);
    const ref = React47.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    React47.useEffect(() => {
      const content = ref.current;
      if (content) return hideOthers(content);
    }, []);
    return (0, import_jsx_runtime36.jsx)(
      MenuContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: context.open,
        disableOutsideScroll: true,
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault(),
          { checkForDefaultPrevented: false }
        ),
        onDismiss: () => context.onOpenChange(false)
      }
    );
  }
);
var MenuRootContentNonModal = React47.forwardRef((props, forwardedRef) => {
  const context = useMenuContext(CONTENT_NAME6, props.__scopeMenu);
  return (0, import_jsx_runtime36.jsx)(
    MenuContentImpl,
    {
      ...props,
      ref: forwardedRef,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      disableOutsideScroll: false,
      onDismiss: () => context.onOpenChange(false)
    }
  );
});
var Slot4 = createSlot2("MenuContent.ScrollLock");
var MenuContentImpl = React47.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeMenu,
      loop = false,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEntryFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      disableOutsideScroll,
      ...contentProps
    } = props;
    const context = useMenuContext(CONTENT_NAME6, __scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME6, __scopeMenu);
    const popperScope = usePopperScope(__scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
    const getItems = useCollection3(__scopeMenu);
    const [currentItemId, setCurrentItemId] = React47.useState(null);
    const contentRef = React47.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef, context.onContentChange);
    const timerRef = React47.useRef(0);
    const searchRef = React47.useRef("");
    const pointerGraceTimerRef = React47.useRef(0);
    const pointerGraceIntentRef = React47.useRef(null);
    const pointerDirRef = React47.useRef("right");
    const lastPointerXRef = React47.useRef(0);
    const ScrollLockWrapper = disableOutsideScroll ? Combination_default : React47.Fragment;
    const scrollLockWrapperProps = disableOutsideScroll ? { as: Slot4, allowPinchZoom: true } : void 0;
    const handleTypeaheadSearch = (key) => {
      var _a2, _b;
      const search = searchRef.current + key;
      const items = getItems().filter((item) => !item.disabled);
      const currentItem = document.activeElement;
      const currentMatch = (_a2 = items.find((item) => item.ref.current === currentItem)) == null ? void 0 : _a2.textValue;
      const values = items.map((item) => item.textValue);
      const nextMatch = getNextMatch(values, search, currentMatch);
      const newItem = (_b = items.find((item) => item.textValue === nextMatch)) == null ? void 0 : _b.ref.current;
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
      })(search);
      if (newItem) {
        setTimeout(() => newItem.focus());
      }
    };
    React47.useEffect(() => {
      return () => window.clearTimeout(timerRef.current);
    }, []);
    useFocusGuards();
    const isPointerMovingToSubmenu = React47.useCallback((event) => {
      var _a2, _b;
      const isMovingTowards = pointerDirRef.current === ((_a2 = pointerGraceIntentRef.current) == null ? void 0 : _a2.side);
      return isMovingTowards && isPointerInGraceArea(event, (_b = pointerGraceIntentRef.current) == null ? void 0 : _b.area);
    }, []);
    return (0, import_jsx_runtime36.jsx)(
      MenuContentProvider,
      {
        scope: __scopeMenu,
        searchRef,
        onItemEnter: React47.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        onItemLeave: React47.useCallback(
          (event) => {
            var _a2;
            if (isPointerMovingToSubmenu(event)) return;
            (_a2 = contentRef.current) == null ? void 0 : _a2.focus();
            setCurrentItemId(null);
          },
          [isPointerMovingToSubmenu]
        ),
        onTriggerLeave: React47.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        pointerGraceTimerRef,
        onPointerGraceIntentChange: React47.useCallback((intent) => {
          pointerGraceIntentRef.current = intent;
        }, []),
        children: (0, import_jsx_runtime36.jsx)(ScrollLockWrapper, { ...scrollLockWrapperProps, children: (0, import_jsx_runtime36.jsx)(
          FocusScope,
          {
            asChild: true,
            trapped: trapFocus,
            onMountAutoFocus: composeEventHandlers(onOpenAutoFocus, (event) => {
              var _a2;
              event.preventDefault();
              (_a2 = contentRef.current) == null ? void 0 : _a2.focus({ preventScroll: true });
            }),
            onUnmountAutoFocus: onCloseAutoFocus,
            children: (0, import_jsx_runtime36.jsx)(
              DismissableLayer,
              {
                asChild: true,
                disableOutsidePointerEvents,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside,
                onInteractOutside,
                onDismiss,
                children: (0, import_jsx_runtime36.jsx)(
                  Root7,
                  {
                    asChild: true,
                    ...rovingFocusGroupScope,
                    dir: rootContext.dir,
                    orientation: "vertical",
                    loop,
                    currentTabStopId: currentItemId,
                    onCurrentTabStopIdChange: setCurrentItemId,
                    onEntryFocus: composeEventHandlers(onEntryFocus, (event) => {
                      if (!rootContext.isUsingKeyboardRef.current) event.preventDefault();
                    }),
                    preventScrollOnEntryFocus: true,
                    children: (0, import_jsx_runtime36.jsx)(
                      Content3,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": getOpenState(context.open),
                        "data-radix-menu-content": "",
                        dir: rootContext.dir,
                        ...popperScope,
                        ...contentProps,
                        ref: composedRefs,
                        style: { outline: "none", ...contentProps.style },
                        onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                          const target = event.target;
                          const isKeyDownInside = target.closest("[data-radix-menu-content]") === event.currentTarget;
                          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                          const isCharacterKey = event.key.length === 1;
                          if (isKeyDownInside) {
                            if (event.key === "Tab") event.preventDefault();
                            if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key);
                          }
                          const content = contentRef.current;
                          if (event.target !== content) return;
                          if (!FIRST_LAST_KEYS.includes(event.key)) return;
                          event.preventDefault();
                          const items = getItems().filter((item) => !item.disabled);
                          const candidateNodes = items.map((item) => item.ref.current);
                          if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
                          focusFirst3(candidateNodes);
                        }),
                        onBlur: composeEventHandlers(props.onBlur, (event) => {
                          if (!event.currentTarget.contains(event.target)) {
                            window.clearTimeout(timerRef.current);
                            searchRef.current = "";
                          }
                        }),
                        onPointerMove: composeEventHandlers(
                          props.onPointerMove,
                          whenMouse((event) => {
                            const target = event.target;
                            const pointerXHasChanged = lastPointerXRef.current !== event.clientX;
                            if (event.currentTarget.contains(target) && pointerXHasChanged) {
                              const newDir = event.clientX > lastPointerXRef.current ? "right" : "left";
                              pointerDirRef.current = newDir;
                              lastPointerXRef.current = event.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
MenuContent.displayName = CONTENT_NAME6;
var GROUP_NAME2 = "MenuGroup";
var MenuGroup = React47.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...groupProps } = props;
    return (0, import_jsx_runtime36.jsx)(Primitive3.div, { role: "group", ...groupProps, ref: forwardedRef });
  }
);
MenuGroup.displayName = GROUP_NAME2;
var LABEL_NAME = "MenuLabel";
var MenuLabel = React47.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...labelProps } = props;
    return (0, import_jsx_runtime36.jsx)(Primitive3.div, { ...labelProps, ref: forwardedRef });
  }
);
MenuLabel.displayName = LABEL_NAME;
var ITEM_NAME3 = "MenuItem";
var ITEM_SELECT = "menu.itemSelect";
var MenuItem = React47.forwardRef(
  (props, forwardedRef) => {
    const { disabled = false, onSelect, ...itemProps } = props;
    const ref = React47.useRef(null);
    const rootContext = useMenuRootContext(ITEM_NAME3, props.__scopeMenu);
    const contentContext = useMenuContentContext(ITEM_NAME3, props.__scopeMenu);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const isPointerDownRef = React47.useRef(false);
    const handleSelect = () => {
      const menuItem = ref.current;
      if (!disabled && menuItem) {
        const itemSelectEvent = new CustomEvent(ITEM_SELECT, { bubbles: true, cancelable: true });
        menuItem.addEventListener(ITEM_SELECT, (event) => onSelect == null ? void 0 : onSelect(event), { once: true });
        dispatchDiscreteCustomEvent(menuItem, itemSelectEvent);
        if (itemSelectEvent.defaultPrevented) {
          isPointerDownRef.current = false;
        } else {
          rootContext.onClose();
        }
      }
    };
    return (0, import_jsx_runtime36.jsx)(
      MenuItemImpl,
      {
        ...itemProps,
        ref: composedRefs,
        disabled,
        onClick: composeEventHandlers(props.onClick, handleSelect),
        onPointerDown: (event) => {
          var _a2;
          (_a2 = props.onPointerDown) == null ? void 0 : _a2.call(props, event);
          isPointerDownRef.current = true;
        },
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          var _a2;
          if (!isPointerDownRef.current) (_a2 = event.currentTarget) == null ? void 0 : _a2.click();
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isTypingAhead = contentContext.searchRef.current !== "";
          if (disabled || isTypingAhead && event.key === " ") return;
          if (SELECTION_KEYS.includes(event.key)) {
            event.currentTarget.click();
            event.preventDefault();
          }
        })
      }
    );
  }
);
MenuItem.displayName = ITEM_NAME3;
var MenuItemImpl = React47.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, disabled = false, textValue, ...itemProps } = props;
    const contentContext = useMenuContentContext(ITEM_NAME3, __scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
    const ref = React47.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const [isFocused, setIsFocused] = React47.useState(false);
    const [textContent, setTextContent] = React47.useState("");
    React47.useEffect(() => {
      const menuItem = ref.current;
      if (menuItem) {
        setTextContent((menuItem.textContent ?? "").trim());
      }
    }, [itemProps.children]);
    return (0, import_jsx_runtime36.jsx)(
      Collection3.ItemSlot,
      {
        scope: __scopeMenu,
        disabled,
        textValue: textValue ?? textContent,
        children: (0, import_jsx_runtime36.jsx)(Item, { asChild: true, ...rovingFocusGroupScope, focusable: !disabled, children: (0, import_jsx_runtime36.jsx)(
          Primitive3.div,
          {
            role: "menuitem",
            "data-highlighted": isFocused ? "" : void 0,
            "aria-disabled": disabled || void 0,
            "data-disabled": disabled ? "" : void 0,
            ...itemProps,
            ref: composedRefs,
            onPointerMove: composeEventHandlers(
              props.onPointerMove,
              whenMouse((event) => {
                if (disabled) {
                  contentContext.onItemLeave(event);
                } else {
                  contentContext.onItemEnter(event);
                  if (!event.defaultPrevented) {
                    const item = event.currentTarget;
                    item.focus({ preventScroll: true });
                  }
                }
              })
            ),
            onPointerLeave: composeEventHandlers(
              props.onPointerLeave,
              whenMouse((event) => contentContext.onItemLeave(event))
            ),
            onFocus: composeEventHandlers(props.onFocus, () => setIsFocused(true)),
            onBlur: composeEventHandlers(props.onBlur, () => setIsFocused(false))
          }
        ) })
      }
    );
  }
);
var CHECKBOX_ITEM_NAME = "MenuCheckboxItem";
var MenuCheckboxItem = React47.forwardRef(
  (props, forwardedRef) => {
    const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
    return (0, import_jsx_runtime36.jsx)(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: (0, import_jsx_runtime36.jsx)(
      MenuItem,
      {
        role: "menuitemcheckbox",
        "aria-checked": isIndeterminate2(checked) ? "mixed" : checked,
        ...checkboxItemProps,
        ref: forwardedRef,
        "data-state": getCheckedState(checked),
        onSelect: composeEventHandlers(
          checkboxItemProps.onSelect,
          () => onCheckedChange == null ? void 0 : onCheckedChange(isIndeterminate2(checked) ? true : !checked),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME;
var RADIO_GROUP_NAME = "MenuRadioGroup";
var [RadioGroupProvider, useRadioGroupContext] = createMenuContext(
  RADIO_GROUP_NAME,
  { value: void 0, onValueChange: () => {
  } }
);
var MenuRadioGroup = React47.forwardRef(
  (props, forwardedRef) => {
    const { value, onValueChange, ...groupProps } = props;
    const handleValueChange = useCallbackRef(onValueChange);
    return (0, import_jsx_runtime36.jsx)(RadioGroupProvider, { scope: props.__scopeMenu, value, onValueChange: handleValueChange, children: (0, import_jsx_runtime36.jsx)(MenuGroup, { ...groupProps, ref: forwardedRef }) });
  }
);
MenuRadioGroup.displayName = RADIO_GROUP_NAME;
var RADIO_ITEM_NAME = "MenuRadioItem";
var MenuRadioItem = React47.forwardRef(
  (props, forwardedRef) => {
    const { value, ...radioItemProps } = props;
    const context = useRadioGroupContext(RADIO_ITEM_NAME, props.__scopeMenu);
    const checked = value === context.value;
    return (0, import_jsx_runtime36.jsx)(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: (0, import_jsx_runtime36.jsx)(
      MenuItem,
      {
        role: "menuitemradio",
        "aria-checked": checked,
        ...radioItemProps,
        ref: forwardedRef,
        "data-state": getCheckedState(checked),
        onSelect: composeEventHandlers(
          radioItemProps.onSelect,
          () => {
            var _a2;
            return (_a2 = context.onValueChange) == null ? void 0 : _a2.call(context, value);
          },
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
MenuRadioItem.displayName = RADIO_ITEM_NAME;
var ITEM_INDICATOR_NAME = "MenuItemIndicator";
var [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext(
  ITEM_INDICATOR_NAME,
  { checked: false }
);
var MenuItemIndicator = React47.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, forceMount, ...itemIndicatorProps } = props;
    const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME, __scopeMenu);
    return (0, import_jsx_runtime36.jsx)(
      Presence,
      {
        present: forceMount || isIndeterminate2(indicatorContext.checked) || indicatorContext.checked === true,
        children: (0, import_jsx_runtime36.jsx)(
          Primitive3.span,
          {
            ...itemIndicatorProps,
            ref: forwardedRef,
            "data-state": getCheckedState(indicatorContext.checked)
          }
        )
      }
    );
  }
);
MenuItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SEPARATOR_NAME = "MenuSeparator";
var MenuSeparator = React47.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...separatorProps } = props;
    return (0, import_jsx_runtime36.jsx)(
      Primitive3.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...separatorProps,
        ref: forwardedRef
      }
    );
  }
);
MenuSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME2 = "MenuArrow";
var MenuArrow = React47.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return (0, import_jsx_runtime36.jsx)(Arrow2, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
MenuArrow.displayName = ARROW_NAME2;
var SUB_NAME = "MenuSub";
var [MenuSubProvider, useMenuSubContext] = createMenuContext(SUB_NAME);
var MenuSub = (props) => {
  const { __scopeMenu, children, open = false, onOpenChange } = props;
  const parentMenuContext = useMenuContext(SUB_NAME, __scopeMenu);
  const popperScope = usePopperScope(__scopeMenu);
  const [trigger, setTrigger] = React47.useState(null);
  const [content, setContent] = React47.useState(null);
  const handleOpenChange = useCallbackRef(onOpenChange);
  React47.useEffect(() => {
    if (parentMenuContext.open === false) handleOpenChange(false);
    return () => handleOpenChange(false);
  }, [parentMenuContext.open, handleOpenChange]);
  return (0, import_jsx_runtime36.jsx)(Root22, { ...popperScope, children: (0, import_jsx_runtime36.jsx)(
    MenuProvider,
    {
      scope: __scopeMenu,
      open,
      onOpenChange: handleOpenChange,
      content,
      onContentChange: setContent,
      children: (0, import_jsx_runtime36.jsx)(
        MenuSubProvider,
        {
          scope: __scopeMenu,
          contentId: useId2(),
          triggerId: useId2(),
          trigger,
          onTriggerChange: setTrigger,
          children
        }
      )
    }
  ) });
};
MenuSub.displayName = SUB_NAME;
var SUB_TRIGGER_NAME = "MenuSubTrigger";
var MenuSubTrigger = React47.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(SUB_TRIGGER_NAME, props.__scopeMenu);
    const rootContext = useMenuRootContext(SUB_TRIGGER_NAME, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_TRIGGER_NAME, props.__scopeMenu);
    const contentContext = useMenuContentContext(SUB_TRIGGER_NAME, props.__scopeMenu);
    const openTimerRef = React47.useRef(null);
    const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;
    const scope = { __scopeMenu: props.__scopeMenu };
    const clearOpenTimer = React47.useCallback(() => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }, []);
    React47.useEffect(() => clearOpenTimer, [clearOpenTimer]);
    React47.useEffect(() => {
      const pointerGraceTimer = pointerGraceTimerRef.current;
      return () => {
        window.clearTimeout(pointerGraceTimer);
        onPointerGraceIntentChange(null);
      };
    }, [pointerGraceTimerRef, onPointerGraceIntentChange]);
    return (0, import_jsx_runtime36.jsx)(MenuAnchor, { asChild: true, ...scope, children: (0, import_jsx_runtime36.jsx)(
      MenuItemImpl,
      {
        id: subContext.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": context.open,
        "aria-controls": subContext.contentId,
        "data-state": getOpenState(context.open),
        ...props,
        ref: composeRefs(forwardedRef, subContext.onTriggerChange),
        onClick: (event) => {
          var _a2;
          (_a2 = props.onClick) == null ? void 0 : _a2.call(props, event);
          if (props.disabled || event.defaultPrevented) return;
          event.currentTarget.focus();
          if (!context.open) context.onOpenChange(true);
        },
        onPointerMove: composeEventHandlers(
          props.onPointerMove,
          whenMouse((event) => {
            contentContext.onItemEnter(event);
            if (event.defaultPrevented) return;
            if (!props.disabled && !context.open && !openTimerRef.current) {
              contentContext.onPointerGraceIntentChange(null);
              openTimerRef.current = window.setTimeout(() => {
                context.onOpenChange(true);
                clearOpenTimer();
              }, 100);
            }
          })
        ),
        onPointerLeave: composeEventHandlers(
          props.onPointerLeave,
          whenMouse((event) => {
            var _a2, _b;
            clearOpenTimer();
            const contentRect = (_a2 = context.content) == null ? void 0 : _a2.getBoundingClientRect();
            if (contentRect) {
              const side = (_b = context.content) == null ? void 0 : _b.dataset.side;
              const rightSide = side === "right";
              const bleed = rightSide ? -5 : 5;
              const contentNearEdge = contentRect[rightSide ? "left" : "right"];
              const contentFarEdge = contentRect[rightSide ? "right" : "left"];
              contentContext.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: event.clientX + bleed, y: event.clientY },
                  { x: contentNearEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.bottom },
                  { x: contentNearEdge, y: contentRect.bottom }
                ],
                side
              });
              window.clearTimeout(pointerGraceTimerRef.current);
              pointerGraceTimerRef.current = window.setTimeout(
                () => contentContext.onPointerGraceIntentChange(null),
                300
              );
            } else {
              contentContext.onTriggerLeave(event);
              if (event.defaultPrevented) return;
              contentContext.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          var _a2;
          const isTypingAhead = contentContext.searchRef.current !== "";
          if (props.disabled || isTypingAhead && event.key === " ") return;
          if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
            context.onOpenChange(true);
            (_a2 = context.content) == null ? void 0 : _a2.focus();
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
MenuSubTrigger.displayName = SUB_TRIGGER_NAME;
var SUB_CONTENT_NAME = "MenuSubContent";
var MenuSubContent = React47.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext2(CONTENT_NAME6, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...subContentProps } = props;
    const context = useMenuContext(CONTENT_NAME6, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME6, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_CONTENT_NAME, props.__scopeMenu);
    const ref = React47.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    return (0, import_jsx_runtime36.jsx)(Collection3.Provider, { scope: props.__scopeMenu, children: (0, import_jsx_runtime36.jsx)(Presence, { present: forceMount || context.open, children: (0, import_jsx_runtime36.jsx)(Collection3.Slot, { scope: props.__scopeMenu, children: (0, import_jsx_runtime36.jsx)(
      MenuContentImpl,
      {
        id: subContext.contentId,
        "aria-labelledby": subContext.triggerId,
        ...subContentProps,
        ref: composedRefs,
        align: "start",
        side: rootContext.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: false,
        disableOutsideScroll: false,
        trapFocus: false,
        onOpenAutoFocus: (event) => {
          var _a2;
          if (rootContext.isUsingKeyboardRef.current) (_a2 = ref.current) == null ? void 0 : _a2.focus();
          event.preventDefault();
        },
        onCloseAutoFocus: (event) => event.preventDefault(),
        onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
          if (event.target !== subContext.trigger) context.onOpenChange(false);
        }),
        onEscapeKeyDown: composeEventHandlers(props.onEscapeKeyDown, (event) => {
          rootContext.onClose();
          event.preventDefault();
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          var _a2;
          const isKeyDownInside = event.currentTarget.contains(event.target);
          const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir].includes(event.key);
          if (isKeyDownInside && isCloseKey) {
            context.onOpenChange(false);
            (_a2 = subContext.trigger) == null ? void 0 : _a2.focus();
            event.preventDefault();
          }
        })
      }
    ) }) }) });
  }
);
MenuSubContent.displayName = SUB_CONTENT_NAME;
function getOpenState(open) {
  return open ? "open" : "closed";
}
function isIndeterminate2(checked) {
  return checked === "indeterminate";
}
function getCheckedState(checked) {
  return isIndeterminate2(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function focusFirst3(candidates) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus();
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray2(array, startIndex) {
  return array.map((_, index4) => array[(startIndex + index4) % array.length]);
}
function getNextMatch(values, search, currentMatch) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
  let wrappedValues = wrapArray2(values, Math.max(currentMatchIndex, 0));
  const excludeCurrentMatch = normalizedSearch.length === 1;
  if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
  const nextMatch = wrappedValues.find(
    (value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextMatch !== currentMatch ? nextMatch : void 0;
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const ii = polygon[i];
    const jj = polygon[j];
    const xi = ii.x;
    const yi = ii.y;
    const xj = jj.x;
    const yj = jj.y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function isPointerInGraceArea(event, area) {
  if (!area) return false;
  const cursorPos = { x: event.clientX, y: event.clientY };
  return isPointInPolygon(cursorPos, area);
}
function whenMouse(handler) {
  return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
var Root32 = Menu;
var Anchor2 = MenuAnchor;
var Portal3 = MenuPortal;
var Content22 = MenuContent;
var Group = MenuGroup;
var Label = MenuLabel;
var Item2 = MenuItem;
var CheckboxItem = MenuCheckboxItem;
var RadioGroup = MenuRadioGroup;
var RadioItem = MenuRadioItem;
var ItemIndicator = MenuItemIndicator;
var Separator = MenuSeparator;
var Arrow22 = MenuArrow;
var Sub = MenuSub;
var SubTrigger = MenuSubTrigger;
var SubContent = MenuSubContent;

// ../../node_modules/.pnpm/@radix-ui+react-context-menu@2.2.16_@types+react-dom@19.2.3_@types+react@19.2.14__@type_7ddebea395c65d3c4d3683b445765102/node_modules/@radix-ui/react-context-menu/dist/index.mjs
var import_jsx_runtime37 = __toESM(require_jsx_runtime(), 1);
var CONTEXT_MENU_NAME = "ContextMenu";
var [createContextMenuContext, createContextMenuScope] = createContextScope(CONTEXT_MENU_NAME, [
  createMenuScope
]);
var useMenuScope = createMenuScope();
var [ContextMenuProvider, useContextMenuContext] = createContextMenuContext(CONTEXT_MENU_NAME);
var ContextMenu = (props) => {
  const { __scopeContextMenu, children, onOpenChange, dir, modal = true } = props;
  const [open, setOpen] = React48.useState(false);
  const menuScope = useMenuScope(__scopeContextMenu);
  const handleOpenChangeProp = useCallbackRef(onOpenChange);
  const handleOpenChange = React48.useCallback(
    (open2) => {
      setOpen(open2);
      handleOpenChangeProp(open2);
    },
    [handleOpenChangeProp]
  );
  return (0, import_jsx_runtime37.jsx)(
    ContextMenuProvider,
    {
      scope: __scopeContextMenu,
      open,
      onOpenChange: handleOpenChange,
      modal,
      children: (0, import_jsx_runtime37.jsx)(
        Root32,
        {
          ...menuScope,
          dir,
          open,
          onOpenChange: handleOpenChange,
          modal,
          children
        }
      )
    }
  );
};
ContextMenu.displayName = CONTEXT_MENU_NAME;
var TRIGGER_NAME6 = "ContextMenuTrigger";
var ContextMenuTrigger = React48.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, disabled = false, ...triggerProps } = props;
    const context = useContextMenuContext(TRIGGER_NAME6, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);
    const pointRef = React48.useRef({ x: 0, y: 0 });
    const virtualRef = React48.useRef({
      getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current })
    });
    const longPressTimerRef = React48.useRef(0);
    const clearLongPress = React48.useCallback(
      () => window.clearTimeout(longPressTimerRef.current),
      []
    );
    const handleOpen = (event) => {
      pointRef.current = { x: event.clientX, y: event.clientY };
      context.onOpenChange(true);
    };
    React48.useEffect(() => clearLongPress, [clearLongPress]);
    React48.useEffect(() => void (disabled && clearLongPress()), [disabled, clearLongPress]);
    return (0, import_jsx_runtime37.jsxs)(import_jsx_runtime37.Fragment, { children: [
      (0, import_jsx_runtime37.jsx)(Anchor2, { ...menuScope, virtualRef }),
      (0, import_jsx_runtime37.jsx)(
        Primitive3.span,
        {
          "data-state": context.open ? "open" : "closed",
          "data-disabled": disabled ? "" : void 0,
          ...triggerProps,
          ref: forwardedRef,
          style: { WebkitTouchCallout: "none", ...props.style },
          onContextMenu: disabled ? props.onContextMenu : composeEventHandlers(props.onContextMenu, (event) => {
            clearLongPress();
            handleOpen(event);
            event.preventDefault();
          }),
          onPointerDown: disabled ? props.onPointerDown : composeEventHandlers(
            props.onPointerDown,
            whenTouchOrPen((event) => {
              clearLongPress();
              longPressTimerRef.current = window.setTimeout(() => handleOpen(event), 700);
            })
          ),
          onPointerMove: disabled ? props.onPointerMove : composeEventHandlers(props.onPointerMove, whenTouchOrPen(clearLongPress)),
          onPointerCancel: disabled ? props.onPointerCancel : composeEventHandlers(props.onPointerCancel, whenTouchOrPen(clearLongPress)),
          onPointerUp: disabled ? props.onPointerUp : composeEventHandlers(props.onPointerUp, whenTouchOrPen(clearLongPress))
        }
      )
    ] });
  }
);
ContextMenuTrigger.displayName = TRIGGER_NAME6;
var PORTAL_NAME5 = "ContextMenuPortal";
var ContextMenuPortal = (props) => {
  const { __scopeContextMenu, ...portalProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return (0, import_jsx_runtime37.jsx)(Portal3, { ...menuScope, ...portalProps });
};
ContextMenuPortal.displayName = PORTAL_NAME5;
var CONTENT_NAME7 = "ContextMenuContent";
var ContextMenuContent = React48.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...contentProps } = props;
    const context = useContextMenuContext(CONTENT_NAME7, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);
    const hasInteractedOutsideRef = React48.useRef(false);
    return (0, import_jsx_runtime37.jsx)(
      Content22,
      {
        ...menuScope,
        ...contentProps,
        ref: forwardedRef,
        side: "right",
        sideOffset: 2,
        align: "start",
        onCloseAutoFocus: (event) => {
          var _a2;
          (_a2 = props.onCloseAutoFocus) == null ? void 0 : _a2.call(props, event);
          if (!event.defaultPrevented && hasInteractedOutsideRef.current) {
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          var _a2;
          (_a2 = props.onInteractOutside) == null ? void 0 : _a2.call(props, event);
          if (!event.defaultPrevented && !context.modal) hasInteractedOutsideRef.current = true;
        },
        style: {
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
            "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
            "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  }
);
ContextMenuContent.displayName = CONTENT_NAME7;
var GROUP_NAME3 = "ContextMenuGroup";
var ContextMenuGroup = React48.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return (0, import_jsx_runtime37.jsx)(Group, { ...menuScope, ...groupProps, ref: forwardedRef });
  }
);
ContextMenuGroup.displayName = GROUP_NAME3;
var LABEL_NAME2 = "ContextMenuLabel";
var ContextMenuLabel = React48.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return (0, import_jsx_runtime37.jsx)(Label, { ...menuScope, ...labelProps, ref: forwardedRef });
  }
);
ContextMenuLabel.displayName = LABEL_NAME2;
var ITEM_NAME4 = "ContextMenuItem";
var ContextMenuItem = React48.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return (0, import_jsx_runtime37.jsx)(Item2, { ...menuScope, ...itemProps, ref: forwardedRef });
  }
);
ContextMenuItem.displayName = ITEM_NAME4;
var CHECKBOX_ITEM_NAME2 = "ContextMenuCheckboxItem";
var ContextMenuCheckboxItem = React48.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...checkboxItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return (0, import_jsx_runtime37.jsx)(CheckboxItem, { ...menuScope, ...checkboxItemProps, ref: forwardedRef });
});
ContextMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME2;
var RADIO_GROUP_NAME2 = "ContextMenuRadioGroup";
var ContextMenuRadioGroup = React48.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...radioGroupProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return (0, import_jsx_runtime37.jsx)(RadioGroup, { ...menuScope, ...radioGroupProps, ref: forwardedRef });
});
ContextMenuRadioGroup.displayName = RADIO_GROUP_NAME2;
var RADIO_ITEM_NAME2 = "ContextMenuRadioItem";
var ContextMenuRadioItem = React48.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...radioItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return (0, import_jsx_runtime37.jsx)(RadioItem, { ...menuScope, ...radioItemProps, ref: forwardedRef });
});
ContextMenuRadioItem.displayName = RADIO_ITEM_NAME2;
var INDICATOR_NAME2 = "ContextMenuItemIndicator";
var ContextMenuItemIndicator = React48.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return (0, import_jsx_runtime37.jsx)(ItemIndicator, { ...menuScope, ...itemIndicatorProps, ref: forwardedRef });
});
ContextMenuItemIndicator.displayName = INDICATOR_NAME2;
var SEPARATOR_NAME2 = "ContextMenuSeparator";
var ContextMenuSeparator = React48.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...separatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return (0, import_jsx_runtime37.jsx)(Separator, { ...menuScope, ...separatorProps, ref: forwardedRef });
});
ContextMenuSeparator.displayName = SEPARATOR_NAME2;
var ARROW_NAME3 = "ContextMenuArrow";
var ContextMenuArrow = React48.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return (0, import_jsx_runtime37.jsx)(Arrow22, { ...menuScope, ...arrowProps, ref: forwardedRef });
  }
);
ContextMenuArrow.displayName = ARROW_NAME3;
var SUB_NAME2 = "ContextMenuSub";
var ContextMenuSub = (props) => {
  const { __scopeContextMenu, children, onOpenChange, open: openProp, defaultOpen } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SUB_NAME2
  });
  return (0, import_jsx_runtime37.jsx)(Sub, { ...menuScope, open, onOpenChange: setOpen, children });
};
ContextMenuSub.displayName = SUB_NAME2;
var SUB_TRIGGER_NAME2 = "ContextMenuSubTrigger";
var ContextMenuSubTrigger = React48.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...triggerItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return (0, import_jsx_runtime37.jsx)(SubTrigger, { ...menuScope, ...triggerItemProps, ref: forwardedRef });
});
ContextMenuSubTrigger.displayName = SUB_TRIGGER_NAME2;
var SUB_CONTENT_NAME2 = "ContextMenuSubContent";
var ContextMenuSubContent = React48.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...subContentProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return (0, import_jsx_runtime37.jsx)(
    SubContent,
    {
      ...menuScope,
      ...subContentProps,
      ref: forwardedRef,
      style: {
        ...props.style,
        // re-namespace exposed content custom properties
        ...{
          "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    }
  );
});
ContextMenuSubContent.displayName = SUB_CONTENT_NAME2;
function whenTouchOrPen(handler) {
  return (event) => event.pointerType !== "mouse" ? handler(event) : void 0;
}

// ../../node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.14__@typ_73af8346b6b2e99f5d79f55f5dac0b34/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs
var dist_exports9 = {};
__export(dist_exports9, {
  Arrow: () => Arrow23,
  CheckboxItem: () => CheckboxItem2,
  Content: () => Content23,
  DropdownMenu: () => DropdownMenu,
  DropdownMenuArrow: () => DropdownMenuArrow,
  DropdownMenuCheckboxItem: () => DropdownMenuCheckboxItem,
  DropdownMenuContent: () => DropdownMenuContent,
  DropdownMenuGroup: () => DropdownMenuGroup,
  DropdownMenuItem: () => DropdownMenuItem,
  DropdownMenuItemIndicator: () => DropdownMenuItemIndicator,
  DropdownMenuLabel: () => DropdownMenuLabel,
  DropdownMenuPortal: () => DropdownMenuPortal,
  DropdownMenuRadioGroup: () => DropdownMenuRadioGroup,
  DropdownMenuRadioItem: () => DropdownMenuRadioItem,
  DropdownMenuSeparator: () => DropdownMenuSeparator,
  DropdownMenuSub: () => DropdownMenuSub,
  DropdownMenuSubContent: () => DropdownMenuSubContent,
  DropdownMenuSubTrigger: () => DropdownMenuSubTrigger,
  DropdownMenuTrigger: () => DropdownMenuTrigger,
  Group: () => Group2,
  Item: () => Item22,
  ItemIndicator: () => ItemIndicator2,
  Label: () => Label2,
  Portal: () => Portal22,
  RadioGroup: () => RadioGroup2,
  RadioItem: () => RadioItem2,
  Root: () => Root23,
  Separator: () => Separator2,
  Sub: () => Sub2,
  SubContent: () => SubContent2,
  SubTrigger: () => SubTrigger2,
  Trigger: () => Trigger3,
  createDropdownMenuScope: () => createDropdownMenuScope
});
var React49 = __toESM(require_react(), 1);
var import_jsx_runtime38 = __toESM(require_jsx_runtime(), 1);
var DROPDOWN_MENU_NAME = "DropdownMenu";
var [createDropdownMenuContext, createDropdownMenuScope] = createContextScope(
  DROPDOWN_MENU_NAME,
  [createMenuScope]
);
var useMenuScope2 = createMenuScope();
var [DropdownMenuProvider, useDropdownMenuContext] = createDropdownMenuContext(DROPDOWN_MENU_NAME);
var DropdownMenu = (props) => {
  const {
    __scopeDropdownMenu,
    children,
    dir,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const menuScope = useMenuScope2(__scopeDropdownMenu);
  const triggerRef = React49.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DROPDOWN_MENU_NAME
  });
  return (0, import_jsx_runtime38.jsx)(
    DropdownMenuProvider,
    {
      scope: __scopeDropdownMenu,
      triggerId: useId2(),
      triggerRef,
      contentId: useId2(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: React49.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children: (0, import_jsx_runtime38.jsx)(Root32, { ...menuScope, open, onOpenChange: setOpen, dir, modal, children })
    }
  );
};
DropdownMenu.displayName = DROPDOWN_MENU_NAME;
var TRIGGER_NAME7 = "DropdownMenuTrigger";
var DropdownMenuTrigger = React49.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, disabled = false, ...triggerProps } = props;
    const context = useDropdownMenuContext(TRIGGER_NAME7, __scopeDropdownMenu);
    const menuScope = useMenuScope2(__scopeDropdownMenu);
    return (0, import_jsx_runtime38.jsx)(Anchor2, { asChild: true, ...menuScope, children: (0, import_jsx_runtime38.jsx)(
      Primitive3.button,
      {
        type: "button",
        id: context.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": context.open,
        "aria-controls": context.open ? context.contentId : void 0,
        "data-state": context.open ? "open" : "closed",
        "data-disabled": disabled ? "" : void 0,
        disabled,
        ...triggerProps,
        ref: composeRefs(forwardedRef, context.triggerRef),
        onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
          if (!disabled && event.button === 0 && event.ctrlKey === false) {
            context.onOpenToggle();
            if (!context.open) event.preventDefault();
          }
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          if (disabled) return;
          if (["Enter", " "].includes(event.key)) context.onOpenToggle();
          if (event.key === "ArrowDown") context.onOpenChange(true);
          if (["Enter", " ", "ArrowDown"].includes(event.key)) event.preventDefault();
        })
      }
    ) });
  }
);
DropdownMenuTrigger.displayName = TRIGGER_NAME7;
var PORTAL_NAME6 = "DropdownMenuPortal";
var DropdownMenuPortal = (props) => {
  const { __scopeDropdownMenu, ...portalProps } = props;
  const menuScope = useMenuScope2(__scopeDropdownMenu);
  return (0, import_jsx_runtime38.jsx)(Portal3, { ...menuScope, ...portalProps });
};
DropdownMenuPortal.displayName = PORTAL_NAME6;
var CONTENT_NAME8 = "DropdownMenuContent";
var DropdownMenuContent = React49.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, ...contentProps } = props;
    const context = useDropdownMenuContext(CONTENT_NAME8, __scopeDropdownMenu);
    const menuScope = useMenuScope2(__scopeDropdownMenu);
    const hasInteractedOutsideRef = React49.useRef(false);
    return (0, import_jsx_runtime38.jsx)(
      Content22,
      {
        id: context.contentId,
        "aria-labelledby": context.triggerId,
        ...menuScope,
        ...contentProps,
        ref: forwardedRef,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          var _a2;
          if (!hasInteractedOutsideRef.current) (_a2 = context.triggerRef.current) == null ? void 0 : _a2.focus();
          hasInteractedOutsideRef.current = false;
          event.preventDefault();
        }),
        onInteractOutside: composeEventHandlers(props.onInteractOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (!context.modal || isRightClick) hasInteractedOutsideRef.current = true;
        }),
        style: {
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
            "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
            "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  }
);
DropdownMenuContent.displayName = CONTENT_NAME8;
var GROUP_NAME4 = "DropdownMenuGroup";
var DropdownMenuGroup = React49.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, ...groupProps } = props;
    const menuScope = useMenuScope2(__scopeDropdownMenu);
    return (0, import_jsx_runtime38.jsx)(Group, { ...menuScope, ...groupProps, ref: forwardedRef });
  }
);
DropdownMenuGroup.displayName = GROUP_NAME4;
var LABEL_NAME3 = "DropdownMenuLabel";
var DropdownMenuLabel = React49.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, ...labelProps } = props;
    const menuScope = useMenuScope2(__scopeDropdownMenu);
    return (0, import_jsx_runtime38.jsx)(Label, { ...menuScope, ...labelProps, ref: forwardedRef });
  }
);
DropdownMenuLabel.displayName = LABEL_NAME3;
var ITEM_NAME5 = "DropdownMenuItem";
var DropdownMenuItem = React49.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, ...itemProps } = props;
    const menuScope = useMenuScope2(__scopeDropdownMenu);
    return (0, import_jsx_runtime38.jsx)(Item2, { ...menuScope, ...itemProps, ref: forwardedRef });
  }
);
DropdownMenuItem.displayName = ITEM_NAME5;
var CHECKBOX_ITEM_NAME3 = "DropdownMenuCheckboxItem";
var DropdownMenuCheckboxItem = React49.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...checkboxItemProps } = props;
  const menuScope = useMenuScope2(__scopeDropdownMenu);
  return (0, import_jsx_runtime38.jsx)(CheckboxItem, { ...menuScope, ...checkboxItemProps, ref: forwardedRef });
});
DropdownMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME3;
var RADIO_GROUP_NAME3 = "DropdownMenuRadioGroup";
var DropdownMenuRadioGroup = React49.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...radioGroupProps } = props;
  const menuScope = useMenuScope2(__scopeDropdownMenu);
  return (0, import_jsx_runtime38.jsx)(RadioGroup, { ...menuScope, ...radioGroupProps, ref: forwardedRef });
});
DropdownMenuRadioGroup.displayName = RADIO_GROUP_NAME3;
var RADIO_ITEM_NAME3 = "DropdownMenuRadioItem";
var DropdownMenuRadioItem = React49.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...radioItemProps } = props;
  const menuScope = useMenuScope2(__scopeDropdownMenu);
  return (0, import_jsx_runtime38.jsx)(RadioItem, { ...menuScope, ...radioItemProps, ref: forwardedRef });
});
DropdownMenuRadioItem.displayName = RADIO_ITEM_NAME3;
var INDICATOR_NAME3 = "DropdownMenuItemIndicator";
var DropdownMenuItemIndicator = React49.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope2(__scopeDropdownMenu);
  return (0, import_jsx_runtime38.jsx)(ItemIndicator, { ...menuScope, ...itemIndicatorProps, ref: forwardedRef });
});
DropdownMenuItemIndicator.displayName = INDICATOR_NAME3;
var SEPARATOR_NAME3 = "DropdownMenuSeparator";
var DropdownMenuSeparator = React49.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...separatorProps } = props;
  const menuScope = useMenuScope2(__scopeDropdownMenu);
  return (0, import_jsx_runtime38.jsx)(Separator, { ...menuScope, ...separatorProps, ref: forwardedRef });
});
DropdownMenuSeparator.displayName = SEPARATOR_NAME3;
var ARROW_NAME4 = "DropdownMenuArrow";
var DropdownMenuArrow = React49.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDropdownMenu, ...arrowProps } = props;
    const menuScope = useMenuScope2(__scopeDropdownMenu);
    return (0, import_jsx_runtime38.jsx)(Arrow22, { ...menuScope, ...arrowProps, ref: forwardedRef });
  }
);
DropdownMenuArrow.displayName = ARROW_NAME4;
var DropdownMenuSub = (props) => {
  const { __scopeDropdownMenu, children, open: openProp, onOpenChange, defaultOpen } = props;
  const menuScope = useMenuScope2(__scopeDropdownMenu);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: "DropdownMenuSub"
  });
  return (0, import_jsx_runtime38.jsx)(Sub, { ...menuScope, open, onOpenChange: setOpen, children });
};
var SUB_TRIGGER_NAME3 = "DropdownMenuSubTrigger";
var DropdownMenuSubTrigger = React49.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...subTriggerProps } = props;
  const menuScope = useMenuScope2(__scopeDropdownMenu);
  return (0, import_jsx_runtime38.jsx)(SubTrigger, { ...menuScope, ...subTriggerProps, ref: forwardedRef });
});
DropdownMenuSubTrigger.displayName = SUB_TRIGGER_NAME3;
var SUB_CONTENT_NAME3 = "DropdownMenuSubContent";
var DropdownMenuSubContent = React49.forwardRef((props, forwardedRef) => {
  const { __scopeDropdownMenu, ...subContentProps } = props;
  const menuScope = useMenuScope2(__scopeDropdownMenu);
  return (0, import_jsx_runtime38.jsx)(
    SubContent,
    {
      ...menuScope,
      ...subContentProps,
      ref: forwardedRef,
      style: {
        ...props.style,
        // re-namespace exposed content custom properties
        ...{
          "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    }
  );
});
DropdownMenuSubContent.displayName = SUB_CONTENT_NAME3;
var Root23 = DropdownMenu;
var Trigger3 = DropdownMenuTrigger;
var Portal22 = DropdownMenuPortal;
var Content23 = DropdownMenuContent;
var Group2 = DropdownMenuGroup;
var Label2 = DropdownMenuLabel;
var Item22 = DropdownMenuItem;
var CheckboxItem2 = DropdownMenuCheckboxItem;
var RadioGroup2 = DropdownMenuRadioGroup;
var RadioItem2 = DropdownMenuRadioItem;
var ItemIndicator2 = DropdownMenuItemIndicator;
var Separator2 = DropdownMenuSeparator;
var Arrow23 = DropdownMenuArrow;
var Sub2 = DropdownMenuSub;
var SubTrigger2 = DropdownMenuSubTrigger;
var SubContent2 = DropdownMenuSubContent;

// ../../node_modules/.pnpm/@radix-ui+react-form@0.1.8_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@1_ac782b7f287a9ebe6066a603dfc1b780/node_modules/@radix-ui/react-form/dist/index.mjs
var React51 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@radix-ui+react-label@2.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_0e34a2d9c9cbbbf963013b9dd979f6f1/node_modules/@radix-ui/react-label/dist/index.mjs
var React50 = __toESM(require_react(), 1);
var import_jsx_runtime39 = __toESM(require_jsx_runtime(), 1);
var NAME5 = "Label";
var Label3 = React50.forwardRef((props, forwardedRef) => {
  return (0, import_jsx_runtime39.jsx)(
    Primitive3.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a2;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a2 = props.onMouseDown) == null ? void 0 : _a2.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label3.displayName = NAME5;

// ../../node_modules/.pnpm/@radix-ui+react-form@0.1.8_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@1_ac782b7f287a9ebe6066a603dfc1b780/node_modules/@radix-ui/react-form/dist/index.mjs
var import_jsx_runtime40 = __toESM(require_jsx_runtime(), 1);
var [createFormContext, createFormScope] = createContextScope("Form");
var FORM_NAME = "Form";
var [ValidationProvider, useValidationContext] = createFormContext(FORM_NAME);
var [AriaDescriptionProvider, useAriaDescriptionContext] = createFormContext(FORM_NAME);
var Form = React51.forwardRef(
  (props, forwardedRef) => {
    const { __scopeForm, onClearServerErrors = () => {
    }, ...rootProps } = props;
    const formRef = React51.useRef(null);
    const composedFormRef = useComposedRefs(forwardedRef, formRef);
    const [validityMap, setValidityMap] = React51.useState({});
    const getFieldValidity = React51.useCallback(
      (fieldName) => validityMap[fieldName],
      [validityMap]
    );
    const handleFieldValidityChange = React51.useCallback(
      (fieldName, validity) => setValidityMap((prevValidityMap) => ({
        ...prevValidityMap,
        [fieldName]: { ...prevValidityMap[fieldName] ?? {}, ...validity }
      })),
      []
    );
    const handleFieldValiditionClear = React51.useCallback((fieldName) => {
      setValidityMap((prevValidityMap) => ({ ...prevValidityMap, [fieldName]: void 0 }));
      setCustomErrorsMap((prevCustomErrorsMap) => ({ ...prevCustomErrorsMap, [fieldName]: {} }));
    }, []);
    const [customMatcherEntriesMap, setCustomMatcherEntriesMap] = React51.useState({});
    const getFieldCustomMatcherEntries = React51.useCallback(
      (fieldName) => customMatcherEntriesMap[fieldName] ?? [],
      [customMatcherEntriesMap]
    );
    const handleFieldCustomMatcherAdd = React51.useCallback((fieldName, matcherEntry) => {
      setCustomMatcherEntriesMap((prevCustomMatcherEntriesMap) => ({
        ...prevCustomMatcherEntriesMap,
        [fieldName]: [...prevCustomMatcherEntriesMap[fieldName] ?? [], matcherEntry]
      }));
    }, []);
    const handleFieldCustomMatcherRemove = React51.useCallback((fieldName, matcherEntryId) => {
      setCustomMatcherEntriesMap((prevCustomMatcherEntriesMap) => ({
        ...prevCustomMatcherEntriesMap,
        [fieldName]: (prevCustomMatcherEntriesMap[fieldName] ?? []).filter(
          (matcherEntry) => matcherEntry.id !== matcherEntryId
        )
      }));
    }, []);
    const [customErrorsMap, setCustomErrorsMap] = React51.useState({});
    const getFieldCustomErrors = React51.useCallback(
      (fieldName) => customErrorsMap[fieldName] ?? {},
      [customErrorsMap]
    );
    const handleFieldCustomErrorsChange = React51.useCallback((fieldName, customErrors) => {
      setCustomErrorsMap((prevCustomErrorsMap) => ({
        ...prevCustomErrorsMap,
        [fieldName]: { ...prevCustomErrorsMap[fieldName] ?? {}, ...customErrors }
      }));
    }, []);
    const [messageIdsMap, setMessageIdsMap] = React51.useState({});
    const handleFieldMessageIdAdd = React51.useCallback((fieldName, id) => {
      setMessageIdsMap((prevMessageIdsMap) => {
        const fieldDescriptionIds = new Set(prevMessageIdsMap[fieldName]).add(id);
        return { ...prevMessageIdsMap, [fieldName]: fieldDescriptionIds };
      });
    }, []);
    const handleFieldMessageIdRemove = React51.useCallback((fieldName, id) => {
      setMessageIdsMap((prevMessageIdsMap) => {
        const fieldDescriptionIds = new Set(prevMessageIdsMap[fieldName]);
        fieldDescriptionIds.delete(id);
        return { ...prevMessageIdsMap, [fieldName]: fieldDescriptionIds };
      });
    }, []);
    const getFieldDescription = React51.useCallback(
      (fieldName) => Array.from(messageIdsMap[fieldName] ?? []).join(" ") || void 0,
      [messageIdsMap]
    );
    return (0, import_jsx_runtime40.jsx)(
      ValidationProvider,
      {
        scope: __scopeForm,
        getFieldValidity,
        onFieldValidityChange: handleFieldValidityChange,
        getFieldCustomMatcherEntries,
        onFieldCustomMatcherEntryAdd: handleFieldCustomMatcherAdd,
        onFieldCustomMatcherEntryRemove: handleFieldCustomMatcherRemove,
        getFieldCustomErrors,
        onFieldCustomErrorsChange: handleFieldCustomErrorsChange,
        onFieldValiditionClear: handleFieldValiditionClear,
        children: (0, import_jsx_runtime40.jsx)(
          AriaDescriptionProvider,
          {
            scope: __scopeForm,
            onFieldMessageIdAdd: handleFieldMessageIdAdd,
            onFieldMessageIdRemove: handleFieldMessageIdRemove,
            getFieldDescription,
            children: (0, import_jsx_runtime40.jsx)(
              Primitive3.form,
              {
                ...rootProps,
                ref: composedFormRef,
                onInvalid: composeEventHandlers(props.onInvalid, (event) => {
                  const firstInvalidControl = getFirstInvalidControl(event.currentTarget);
                  if (firstInvalidControl === event.target) firstInvalidControl.focus();
                  event.preventDefault();
                }),
                onSubmit: composeEventHandlers(props.onSubmit, onClearServerErrors, {
                  checkForDefaultPrevented: false
                }),
                onReset: composeEventHandlers(props.onReset, onClearServerErrors)
              }
            )
          }
        )
      }
    );
  }
);
Form.displayName = FORM_NAME;
var FIELD_NAME = "FormField";
var [FormFieldProvider, useFormFieldContext] = createFormContext(FIELD_NAME);
var FormField = React51.forwardRef(
  (props, forwardedRef) => {
    const { __scopeForm, name, serverInvalid = false, ...fieldProps } = props;
    const validationContext = useValidationContext(FIELD_NAME, __scopeForm);
    const validity = validationContext.getFieldValidity(name);
    const id = useId2();
    return (0, import_jsx_runtime40.jsx)(FormFieldProvider, { scope: __scopeForm, id, name, serverInvalid, children: (0, import_jsx_runtime40.jsx)(
      Primitive3.div,
      {
        "data-valid": getValidAttribute(validity, serverInvalid),
        "data-invalid": getInvalidAttribute(validity, serverInvalid),
        ...fieldProps,
        ref: forwardedRef
      }
    ) });
  }
);
FormField.displayName = FIELD_NAME;
var LABEL_NAME4 = "FormLabel";
var FormLabel = React51.forwardRef(
  (props, forwardedRef) => {
    const { __scopeForm, ...labelProps } = props;
    const validationContext = useValidationContext(LABEL_NAME4, __scopeForm);
    const fieldContext = useFormFieldContext(LABEL_NAME4, __scopeForm);
    const htmlFor = labelProps.htmlFor || fieldContext.id;
    const validity = validationContext.getFieldValidity(fieldContext.name);
    return (0, import_jsx_runtime40.jsx)(
      Label3,
      {
        "data-valid": getValidAttribute(validity, fieldContext.serverInvalid),
        "data-invalid": getInvalidAttribute(validity, fieldContext.serverInvalid),
        ...labelProps,
        ref: forwardedRef,
        htmlFor
      }
    );
  }
);
FormLabel.displayName = LABEL_NAME4;
var CONTROL_NAME = "FormControl";
var FormControl = React51.forwardRef(
  (props, forwardedRef) => {
    const { __scopeForm, ...controlProps } = props;
    const validationContext = useValidationContext(CONTROL_NAME, __scopeForm);
    const fieldContext = useFormFieldContext(CONTROL_NAME, __scopeForm);
    const ariaDescriptionContext = useAriaDescriptionContext(CONTROL_NAME, __scopeForm);
    const ref = React51.useRef(null);
    const composedRef = useComposedRefs(forwardedRef, ref);
    const name = controlProps.name || fieldContext.name;
    const id = controlProps.id || fieldContext.id;
    const customMatcherEntries = validationContext.getFieldCustomMatcherEntries(name);
    const { onFieldValidityChange, onFieldCustomErrorsChange, onFieldValiditionClear } = validationContext;
    const updateControlValidity = React51.useCallback(
      async (control) => {
        if (hasBuiltInError(control.validity)) {
          const controlValidity2 = validityStateToObject(control.validity);
          onFieldValidityChange(name, controlValidity2);
          return;
        }
        const formData = control.form ? new FormData(control.form) : new FormData();
        const matcherArgs = [control.value, formData];
        const syncCustomMatcherEntries = [];
        const ayncCustomMatcherEntries = [];
        customMatcherEntries.forEach((customMatcherEntry) => {
          if (isAsyncCustomMatcherEntry(customMatcherEntry, matcherArgs)) {
            ayncCustomMatcherEntries.push(customMatcherEntry);
          } else if (isSyncCustomMatcherEntry(customMatcherEntry)) {
            syncCustomMatcherEntries.push(customMatcherEntry);
          }
        });
        const syncCustomErrors = syncCustomMatcherEntries.map(({ id: id2, match }) => {
          return [id2, match(...matcherArgs)];
        });
        const syncCustomErrorsById = Object.fromEntries(syncCustomErrors);
        const hasSyncCustomErrors = Object.values(syncCustomErrorsById).some(Boolean);
        const hasCustomError = hasSyncCustomErrors;
        control.setCustomValidity(hasCustomError ? DEFAULT_INVALID_MESSAGE : "");
        const controlValidity = validityStateToObject(control.validity);
        onFieldValidityChange(name, controlValidity);
        onFieldCustomErrorsChange(name, syncCustomErrorsById);
        if (!hasSyncCustomErrors && ayncCustomMatcherEntries.length > 0) {
          const promisedCustomErrors = ayncCustomMatcherEntries.map(
            ({ id: id2, match }) => match(...matcherArgs).then((matches) => [id2, matches])
          );
          const asyncCustomErrors = await Promise.all(promisedCustomErrors);
          const asyncCustomErrorsById = Object.fromEntries(asyncCustomErrors);
          const hasAsyncCustomErrors = Object.values(asyncCustomErrorsById).some(Boolean);
          const hasCustomError2 = hasAsyncCustomErrors;
          control.setCustomValidity(hasCustomError2 ? DEFAULT_INVALID_MESSAGE : "");
          const controlValidity2 = validityStateToObject(control.validity);
          onFieldValidityChange(name, controlValidity2);
          onFieldCustomErrorsChange(name, asyncCustomErrorsById);
        }
      },
      [customMatcherEntries, name, onFieldCustomErrorsChange, onFieldValidityChange]
    );
    React51.useEffect(() => {
      const control = ref.current;
      if (control) {
        const handleChange = () => updateControlValidity(control);
        control.addEventListener("change", handleChange);
        return () => control.removeEventListener("change", handleChange);
      }
    }, [updateControlValidity]);
    const resetControlValidity = React51.useCallback(() => {
      const control = ref.current;
      if (control) {
        control.setCustomValidity("");
        onFieldValiditionClear(name);
      }
    }, [name, onFieldValiditionClear]);
    React51.useEffect(() => {
      var _a2;
      const form = (_a2 = ref.current) == null ? void 0 : _a2.form;
      if (form) {
        form.addEventListener("reset", resetControlValidity);
        return () => form.removeEventListener("reset", resetControlValidity);
      }
    }, [resetControlValidity]);
    React51.useEffect(() => {
      const control = ref.current;
      const form = control == null ? void 0 : control.closest("form");
      if (form && fieldContext.serverInvalid) {
        const firstInvalidControl = getFirstInvalidControl(form);
        if (firstInvalidControl === control) firstInvalidControl.focus();
      }
    }, [fieldContext.serverInvalid]);
    const validity = validationContext.getFieldValidity(name);
    return (0, import_jsx_runtime40.jsx)(
      Primitive3.input,
      {
        "data-valid": getValidAttribute(validity, fieldContext.serverInvalid),
        "data-invalid": getInvalidAttribute(validity, fieldContext.serverInvalid),
        "aria-invalid": fieldContext.serverInvalid ? true : void 0,
        "aria-describedby": ariaDescriptionContext.getFieldDescription(name),
        title: "",
        ...controlProps,
        ref: composedRef,
        id,
        name,
        onInvalid: composeEventHandlers(props.onInvalid, (event) => {
          const control = event.currentTarget;
          updateControlValidity(control);
        }),
        onChange: composeEventHandlers(props.onChange, (_event) => {
          resetControlValidity();
        })
      }
    );
  }
);
FormControl.displayName = CONTROL_NAME;
var DEFAULT_INVALID_MESSAGE = "This value is not valid";
var DEFAULT_BUILT_IN_MESSAGES = {
  badInput: DEFAULT_INVALID_MESSAGE,
  patternMismatch: "This value does not match the required pattern",
  rangeOverflow: "This value is too large",
  rangeUnderflow: "This value is too small",
  stepMismatch: "This value does not match the required step",
  tooLong: "This value is too long",
  tooShort: "This value is too short",
  typeMismatch: "This value does not match the required type",
  valid: void 0,
  valueMissing: "This value is missing"
};
var MESSAGE_NAME = "FormMessage";
var FormMessage = React51.forwardRef(
  (props, forwardedRef) => {
    const { match, name: nameProp, ...messageProps } = props;
    const fieldContext = useFormFieldContext(MESSAGE_NAME, props.__scopeForm);
    const name = nameProp ?? fieldContext.name;
    if (match === void 0) {
      return (0, import_jsx_runtime40.jsx)(FormMessageImpl, { ...messageProps, ref: forwardedRef, name, children: props.children || DEFAULT_INVALID_MESSAGE });
    } else if (typeof match === "function") {
      return (0, import_jsx_runtime40.jsx)(FormCustomMessage, { match, ...messageProps, ref: forwardedRef, name });
    } else {
      return (0, import_jsx_runtime40.jsx)(FormBuiltInMessage, { match, ...messageProps, ref: forwardedRef, name });
    }
  }
);
FormMessage.displayName = MESSAGE_NAME;
var FormBuiltInMessage = React51.forwardRef(
  (props, forwardedRef) => {
    const { match, forceMatch = false, name, children, ...messageProps } = props;
    const validationContext = useValidationContext(MESSAGE_NAME, messageProps.__scopeForm);
    const validity = validationContext.getFieldValidity(name);
    const matches = forceMatch || (validity == null ? void 0 : validity[match]);
    if (matches) {
      return (0, import_jsx_runtime40.jsx)(FormMessageImpl, { ref: forwardedRef, ...messageProps, name, children: children ?? DEFAULT_BUILT_IN_MESSAGES[match] });
    }
    return null;
  }
);
var FormCustomMessage = React51.forwardRef(
  (props, forwardedRef) => {
    const { match, forceMatch = false, name, id: idProp, children, ...messageProps } = props;
    const validationContext = useValidationContext(MESSAGE_NAME, messageProps.__scopeForm);
    const ref = React51.useRef(null);
    const composedRef = useComposedRefs(forwardedRef, ref);
    const _id = useId2();
    const id = idProp ?? _id;
    const customMatcherEntry = React51.useMemo(() => ({ id, match }), [id, match]);
    const { onFieldCustomMatcherEntryAdd, onFieldCustomMatcherEntryRemove } = validationContext;
    React51.useEffect(() => {
      onFieldCustomMatcherEntryAdd(name, customMatcherEntry);
      return () => onFieldCustomMatcherEntryRemove(name, customMatcherEntry.id);
    }, [customMatcherEntry, name, onFieldCustomMatcherEntryAdd, onFieldCustomMatcherEntryRemove]);
    const validity = validationContext.getFieldValidity(name);
    const customErrors = validationContext.getFieldCustomErrors(name);
    const hasMatchingCustomError = customErrors[id];
    const matches = forceMatch || validity && !hasBuiltInError(validity) && hasMatchingCustomError;
    if (matches) {
      return (0, import_jsx_runtime40.jsx)(FormMessageImpl, { id, ref: composedRef, ...messageProps, name, children: children ?? DEFAULT_INVALID_MESSAGE });
    }
    return null;
  }
);
var FormMessageImpl = React51.forwardRef(
  (props, forwardedRef) => {
    const { __scopeForm, id: idProp, name, ...messageProps } = props;
    const ariaDescriptionContext = useAriaDescriptionContext(MESSAGE_NAME, __scopeForm);
    const _id = useId2();
    const id = idProp ?? _id;
    const { onFieldMessageIdAdd, onFieldMessageIdRemove } = ariaDescriptionContext;
    React51.useEffect(() => {
      onFieldMessageIdAdd(name, id);
      return () => onFieldMessageIdRemove(name, id);
    }, [name, id, onFieldMessageIdAdd, onFieldMessageIdRemove]);
    return (0, import_jsx_runtime40.jsx)(Primitive3.span, { id, ...messageProps, ref: forwardedRef });
  }
);
var VALIDITY_STATE_NAME = "FormValidityState";
var FormValidityState = (props) => {
  const { __scopeForm, name: nameProp, children } = props;
  const validationContext = useValidationContext(VALIDITY_STATE_NAME, __scopeForm);
  const fieldContext = useFormFieldContext(VALIDITY_STATE_NAME, __scopeForm);
  const name = nameProp ?? fieldContext.name;
  const validity = validationContext.getFieldValidity(name);
  return (0, import_jsx_runtime40.jsx)(import_jsx_runtime40.Fragment, { children: children(validity) });
};
FormValidityState.displayName = VALIDITY_STATE_NAME;
var SUBMIT_NAME = "FormSubmit";
var FormSubmit = React51.forwardRef(
  (props, forwardedRef) => {
    const { __scopeForm, ...submitProps } = props;
    return (0, import_jsx_runtime40.jsx)(Primitive3.button, { type: "submit", ...submitProps, ref: forwardedRef });
  }
);
FormSubmit.displayName = SUBMIT_NAME;
function validityStateToObject(validity) {
  const object = {};
  for (const key in validity) {
    object[key] = validity[key];
  }
  return object;
}
function isHTMLElement2(element) {
  return element instanceof HTMLElement;
}
function isFormControl(element) {
  return "validity" in element;
}
function isInvalid(control) {
  return isFormControl(control) && (control.validity.valid === false || control.getAttribute("aria-invalid") === "true");
}
function getFirstInvalidControl(form) {
  const elements = form.elements;
  const [firstInvalidControl] = Array.from(elements).filter(isHTMLElement2).filter(isInvalid);
  return firstInvalidControl;
}
function isAsyncCustomMatcherEntry(entry, args) {
  return entry.match.constructor.name === "AsyncFunction" || returnsPromise(entry.match, args);
}
function isSyncCustomMatcherEntry(entry) {
  return entry.match.constructor.name === "Function";
}
function returnsPromise(func, args) {
  return func(...args) instanceof Promise;
}
function hasBuiltInError(validity) {
  let error = false;
  for (const validityKey in validity) {
    const key = validityKey;
    if (key !== "valid" && key !== "customError" && validity[key]) {
      error = true;
      break;
    }
  }
  return error;
}
function getValidAttribute(validity, serverInvalid) {
  if ((validity == null ? void 0 : validity.valid) === true && !serverInvalid) return true;
  return void 0;
}
function getInvalidAttribute(validity, serverInvalid) {
  if ((validity == null ? void 0 : validity.valid) === false || serverInvalid) return true;
  return void 0;
}

// ../../node_modules/.pnpm/@radix-ui+react-hover-card@1.1.15_@types+react-dom@19.2.3_@types+react@19.2.14__@types+_7ad81962fbdf173de4beb0078b2863c0/node_modules/@radix-ui/react-hover-card/dist/index.mjs
var React52 = __toESM(require_react(), 1);
var import_jsx_runtime41 = __toESM(require_jsx_runtime(), 1);
var originalBodyUserSelect;
var HOVERCARD_NAME = "HoverCard";
var [createHoverCardContext, createHoverCardScope] = createContextScope(HOVERCARD_NAME, [
  createPopperScope
]);
var usePopperScope2 = createPopperScope();
var [HoverCardProvider, useHoverCardContext] = createHoverCardContext(HOVERCARD_NAME);
var HoverCard = (props) => {
  const {
    __scopeHoverCard,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    openDelay = 700,
    closeDelay = 300
  } = props;
  const popperScope = usePopperScope2(__scopeHoverCard);
  const openTimerRef = React52.useRef(0);
  const closeTimerRef = React52.useRef(0);
  const hasSelectionRef = React52.useRef(false);
  const isPointerDownOnContentRef = React52.useRef(false);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: HOVERCARD_NAME
  });
  const handleOpen = React52.useCallback(() => {
    clearTimeout(closeTimerRef.current);
    openTimerRef.current = window.setTimeout(() => setOpen(true), openDelay);
  }, [openDelay, setOpen]);
  const handleClose = React52.useCallback(() => {
    clearTimeout(openTimerRef.current);
    if (!hasSelectionRef.current && !isPointerDownOnContentRef.current) {
      closeTimerRef.current = window.setTimeout(() => setOpen(false), closeDelay);
    }
  }, [closeDelay, setOpen]);
  const handleDismiss = React52.useCallback(() => setOpen(false), [setOpen]);
  React52.useEffect(() => {
    return () => {
      clearTimeout(openTimerRef.current);
      clearTimeout(closeTimerRef.current);
    };
  }, []);
  return (0, import_jsx_runtime41.jsx)(
    HoverCardProvider,
    {
      scope: __scopeHoverCard,
      open,
      onOpenChange: setOpen,
      onOpen: handleOpen,
      onClose: handleClose,
      onDismiss: handleDismiss,
      hasSelectionRef,
      isPointerDownOnContentRef,
      children: (0, import_jsx_runtime41.jsx)(Root22, { ...popperScope, children })
    }
  );
};
HoverCard.displayName = HOVERCARD_NAME;
var TRIGGER_NAME8 = "HoverCardTrigger";
var HoverCardTrigger = React52.forwardRef(
  (props, forwardedRef) => {
    const { __scopeHoverCard, ...triggerProps } = props;
    const context = useHoverCardContext(TRIGGER_NAME8, __scopeHoverCard);
    const popperScope = usePopperScope2(__scopeHoverCard);
    return (0, import_jsx_runtime41.jsx)(Anchor, { asChild: true, ...popperScope, children: (0, import_jsx_runtime41.jsx)(
      Primitive3.a,
      {
        "data-state": context.open ? "open" : "closed",
        ...triggerProps,
        ref: forwardedRef,
        onPointerEnter: composeEventHandlers(props.onPointerEnter, excludeTouch(context.onOpen)),
        onPointerLeave: composeEventHandlers(props.onPointerLeave, excludeTouch(context.onClose)),
        onFocus: composeEventHandlers(props.onFocus, context.onOpen),
        onBlur: composeEventHandlers(props.onBlur, context.onClose),
        onTouchStart: composeEventHandlers(props.onTouchStart, (event) => event.preventDefault())
      }
    ) });
  }
);
HoverCardTrigger.displayName = TRIGGER_NAME8;
var PORTAL_NAME7 = "HoverCardPortal";
var [PortalProvider3, usePortalContext3] = createHoverCardContext(PORTAL_NAME7, {
  forceMount: void 0
});
var HoverCardPortal = (props) => {
  const { __scopeHoverCard, forceMount, children, container } = props;
  const context = useHoverCardContext(PORTAL_NAME7, __scopeHoverCard);
  return (0, import_jsx_runtime41.jsx)(PortalProvider3, { scope: __scopeHoverCard, forceMount, children: (0, import_jsx_runtime41.jsx)(Presence, { present: forceMount || context.open, children: (0, import_jsx_runtime41.jsx)(Portal, { asChild: true, container, children }) }) });
};
HoverCardPortal.displayName = PORTAL_NAME7;
var CONTENT_NAME9 = "HoverCardContent";
var HoverCardContent = React52.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext3(CONTENT_NAME9, props.__scopeHoverCard);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useHoverCardContext(CONTENT_NAME9, props.__scopeHoverCard);
    return (0, import_jsx_runtime41.jsx)(Presence, { present: forceMount || context.open, children: (0, import_jsx_runtime41.jsx)(
      HoverCardContentImpl,
      {
        "data-state": context.open ? "open" : "closed",
        ...contentProps,
        onPointerEnter: composeEventHandlers(props.onPointerEnter, excludeTouch(context.onOpen)),
        onPointerLeave: composeEventHandlers(props.onPointerLeave, excludeTouch(context.onClose)),
        ref: forwardedRef
      }
    ) });
  }
);
HoverCardContent.displayName = CONTENT_NAME9;
var HoverCardContentImpl = React52.forwardRef((props, forwardedRef) => {
  const {
    __scopeHoverCard,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    ...contentProps
  } = props;
  const context = useHoverCardContext(CONTENT_NAME9, __scopeHoverCard);
  const popperScope = usePopperScope2(__scopeHoverCard);
  const ref = React52.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const [containSelection, setContainSelection] = React52.useState(false);
  React52.useEffect(() => {
    if (containSelection) {
      const body = document.body;
      originalBodyUserSelect = body.style.userSelect || body.style.webkitUserSelect;
      body.style.userSelect = "none";
      body.style.webkitUserSelect = "none";
      return () => {
        body.style.userSelect = originalBodyUserSelect;
        body.style.webkitUserSelect = originalBodyUserSelect;
      };
    }
  }, [containSelection]);
  React52.useEffect(() => {
    if (ref.current) {
      const handlePointerUp = () => {
        setContainSelection(false);
        context.isPointerDownOnContentRef.current = false;
        setTimeout(() => {
          var _a2;
          const hasSelection = ((_a2 = document.getSelection()) == null ? void 0 : _a2.toString()) !== "";
          if (hasSelection) context.hasSelectionRef.current = true;
        });
      };
      document.addEventListener("pointerup", handlePointerUp);
      return () => {
        document.removeEventListener("pointerup", handlePointerUp);
        context.hasSelectionRef.current = false;
        context.isPointerDownOnContentRef.current = false;
      };
    }
  }, [context.isPointerDownOnContentRef, context.hasSelectionRef]);
  React52.useEffect(() => {
    if (ref.current) {
      const tabbables = getTabbableNodes(ref.current);
      tabbables.forEach((tabbable) => tabbable.setAttribute("tabindex", "-1"));
    }
  });
  return (0, import_jsx_runtime41.jsx)(
    DismissableLayer,
    {
      asChild: true,
      disableOutsidePointerEvents: false,
      onInteractOutside,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside: composeEventHandlers(onFocusOutside, (event) => {
        event.preventDefault();
      }),
      onDismiss: context.onDismiss,
      children: (0, import_jsx_runtime41.jsx)(
        Content3,
        {
          ...popperScope,
          ...contentProps,
          onPointerDown: composeEventHandlers(contentProps.onPointerDown, (event) => {
            if (event.currentTarget.contains(event.target)) {
              setContainSelection(true);
            }
            context.hasSelectionRef.current = false;
            context.isPointerDownOnContentRef.current = true;
          }),
          ref: composedRefs,
          style: {
            ...contentProps.style,
            userSelect: containSelection ? "text" : void 0,
            // Safari requires prefix
            WebkitUserSelect: containSelection ? "text" : void 0,
            // re-namespace exposed content custom properties
            ...{
              "--radix-hover-card-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-hover-card-content-available-width": "var(--radix-popper-available-width)",
              "--radix-hover-card-content-available-height": "var(--radix-popper-available-height)",
              "--radix-hover-card-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-hover-card-trigger-height": "var(--radix-popper-anchor-height)"
            }
          }
        }
      )
    }
  );
});
var ARROW_NAME5 = "HoverCardArrow";
var HoverCardArrow = React52.forwardRef(
  (props, forwardedRef) => {
    const { __scopeHoverCard, ...arrowProps } = props;
    const popperScope = usePopperScope2(__scopeHoverCard);
    return (0, import_jsx_runtime41.jsx)(Arrow2, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
HoverCardArrow.displayName = ARROW_NAME5;
function excludeTouch(eventHandler) {
  return (event) => event.pointerType === "touch" ? void 0 : eventHandler();
}
function getTabbableNodes(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

// ../../node_modules/.pnpm/@radix-ui+react-menubar@1.1.16_@types+react-dom@19.2.3_@types+react@19.2.14__@types+rea_2538d85c615acf13b2f2294bd07156f9/node_modules/@radix-ui/react-menubar/dist/index.mjs
var React53 = __toESM(require_react(), 1);
var import_jsx_runtime42 = __toESM(require_jsx_runtime(), 1);
var MENUBAR_NAME = "Menubar";
var [Collection4, useCollection4, createCollectionScope4] = createCollection(MENUBAR_NAME);
var [createMenubarContext, createMenubarScope] = createContextScope(MENUBAR_NAME, [
  createCollectionScope4,
  createRovingFocusGroupScope
]);
var useMenuScope3 = createMenuScope();
var useRovingFocusGroupScope2 = createRovingFocusGroupScope();
var [MenubarContextProvider, useMenubarContext] = createMenubarContext(MENUBAR_NAME);
var Menubar = React53.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeMenubar,
      value: valueProp,
      onValueChange,
      defaultValue,
      loop = true,
      dir,
      ...menubarProps
    } = props;
    const direction = useDirection(dir);
    const rovingFocusGroupScope = useRovingFocusGroupScope2(__scopeMenubar);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: MENUBAR_NAME
    });
    const [currentTabStopId, setCurrentTabStopId] = React53.useState(null);
    return (0, import_jsx_runtime42.jsx)(
      MenubarContextProvider,
      {
        scope: __scopeMenubar,
        value,
        onMenuOpen: React53.useCallback(
          (value2) => {
            setValue(value2);
            setCurrentTabStopId(value2);
          },
          [setValue]
        ),
        onMenuClose: React53.useCallback(() => setValue(""), [setValue]),
        onMenuToggle: React53.useCallback(
          (value2) => {
            setValue((prevValue) => prevValue ? "" : value2);
            setCurrentTabStopId(value2);
          },
          [setValue]
        ),
        dir: direction,
        loop,
        children: (0, import_jsx_runtime42.jsx)(Collection4.Provider, { scope: __scopeMenubar, children: (0, import_jsx_runtime42.jsx)(Collection4.Slot, { scope: __scopeMenubar, children: (0, import_jsx_runtime42.jsx)(
          Root7,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation: "horizontal",
            loop,
            dir: direction,
            currentTabStopId,
            onCurrentTabStopIdChange: setCurrentTabStopId,
            children: (0, import_jsx_runtime42.jsx)(Primitive3.div, { role: "menubar", ...menubarProps, ref: forwardedRef })
          }
        ) }) })
      }
    );
  }
);
Menubar.displayName = MENUBAR_NAME;
var MENU_NAME2 = "MenubarMenu";
var [MenubarMenuProvider, useMenubarMenuContext] = createMenubarContext(MENU_NAME2);
var MenubarMenu = (props) => {
  const { __scopeMenubar, value: valueProp, ...menuProps } = props;
  const autoValue = useId2();
  const value = valueProp || autoValue || "LEGACY_REACT_AUTO_VALUE";
  const context = useMenubarContext(MENU_NAME2, __scopeMenubar);
  const menuScope = useMenuScope3(__scopeMenubar);
  const triggerRef = React53.useRef(null);
  const wasKeyboardTriggerOpenRef = React53.useRef(false);
  const open = context.value === value;
  React53.useEffect(() => {
    if (!open) wasKeyboardTriggerOpenRef.current = false;
  }, [open]);
  return (0, import_jsx_runtime42.jsx)(
    MenubarMenuProvider,
    {
      scope: __scopeMenubar,
      value,
      triggerId: useId2(),
      triggerRef,
      contentId: useId2(),
      wasKeyboardTriggerOpenRef,
      children: (0, import_jsx_runtime42.jsx)(
        Root32,
        {
          ...menuScope,
          open,
          onOpenChange: (open2) => {
            if (!open2) context.onMenuClose();
          },
          modal: false,
          dir: context.dir,
          ...menuProps
        }
      )
    }
  );
};
MenubarMenu.displayName = MENU_NAME2;
var TRIGGER_NAME9 = "MenubarTrigger";
var MenubarTrigger = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, disabled = false, ...triggerProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope2(__scopeMenubar);
    const menuScope = useMenuScope3(__scopeMenubar);
    const context = useMenubarContext(TRIGGER_NAME9, __scopeMenubar);
    const menuContext = useMenubarMenuContext(TRIGGER_NAME9, __scopeMenubar);
    const ref = React53.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, menuContext.triggerRef);
    const [isFocused, setIsFocused] = React53.useState(false);
    const open = context.value === menuContext.value;
    return (0, import_jsx_runtime42.jsx)(Collection4.ItemSlot, { scope: __scopeMenubar, value: menuContext.value, disabled, children: (0, import_jsx_runtime42.jsx)(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        tabStopId: menuContext.value,
        children: (0, import_jsx_runtime42.jsx)(Anchor2, { asChild: true, ...menuScope, children: (0, import_jsx_runtime42.jsx)(
          Primitive3.button,
          {
            type: "button",
            role: "menuitem",
            id: menuContext.triggerId,
            "aria-haspopup": "menu",
            "aria-expanded": open,
            "aria-controls": open ? menuContext.contentId : void 0,
            "data-highlighted": isFocused ? "" : void 0,
            "data-state": open ? "open" : "closed",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            ...triggerProps,
            ref: composedRefs,
            onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onMenuOpen(menuContext.value);
                if (!open) event.preventDefault();
              }
            }),
            onPointerEnter: composeEventHandlers(props.onPointerEnter, () => {
              var _a2;
              const menubarOpen = Boolean(context.value);
              if (menubarOpen && !open) {
                context.onMenuOpen(menuContext.value);
                (_a2 = ref.current) == null ? void 0 : _a2.focus();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (disabled) return;
              if (["Enter", " "].includes(event.key)) context.onMenuToggle(menuContext.value);
              if (event.key === "ArrowDown") context.onMenuOpen(menuContext.value);
              if (["Enter", " ", "ArrowDown"].includes(event.key)) {
                menuContext.wasKeyboardTriggerOpenRef.current = true;
                event.preventDefault();
              }
            }),
            onFocus: composeEventHandlers(props.onFocus, () => setIsFocused(true)),
            onBlur: composeEventHandlers(props.onBlur, () => setIsFocused(false))
          }
        ) })
      }
    ) });
  }
);
MenubarTrigger.displayName = TRIGGER_NAME9;
var PORTAL_NAME8 = "MenubarPortal";
var MenubarPortal = (props) => {
  const { __scopeMenubar, ...portalProps } = props;
  const menuScope = useMenuScope3(__scopeMenubar);
  return (0, import_jsx_runtime42.jsx)(Portal3, { ...menuScope, ...portalProps });
};
MenubarPortal.displayName = PORTAL_NAME8;
var CONTENT_NAME10 = "MenubarContent";
var MenubarContent = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, align = "start", ...contentProps } = props;
    const menuScope = useMenuScope3(__scopeMenubar);
    const context = useMenubarContext(CONTENT_NAME10, __scopeMenubar);
    const menuContext = useMenubarMenuContext(CONTENT_NAME10, __scopeMenubar);
    const getItems = useCollection4(__scopeMenubar);
    const hasInteractedOutsideRef = React53.useRef(false);
    return (0, import_jsx_runtime42.jsx)(
      Content22,
      {
        id: menuContext.contentId,
        "aria-labelledby": menuContext.triggerId,
        "data-radix-menubar-content": "",
        ...menuScope,
        ...contentProps,
        ref: forwardedRef,
        align,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          var _a2;
          const menubarOpen = Boolean(context.value);
          if (!menubarOpen && !hasInteractedOutsideRef.current) {
            (_a2 = menuContext.triggerRef.current) == null ? void 0 : _a2.focus();
          }
          hasInteractedOutsideRef.current = false;
          event.preventDefault();
        }),
        onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
          const target = event.target;
          const isMenubarTrigger = getItems().some((item) => {
            var _a2;
            return (_a2 = item.ref.current) == null ? void 0 : _a2.contains(target);
          });
          if (isMenubarTrigger) event.preventDefault();
        }),
        onInteractOutside: composeEventHandlers(props.onInteractOutside, () => {
          hasInteractedOutsideRef.current = true;
        }),
        onEntryFocus: (event) => {
          if (!menuContext.wasKeyboardTriggerOpenRef.current) event.preventDefault();
        },
        onKeyDown: composeEventHandlers(
          props.onKeyDown,
          (event) => {
            if (["ArrowRight", "ArrowLeft"].includes(event.key)) {
              const target = event.target;
              const targetIsSubTrigger = target.hasAttribute("data-radix-menubar-subtrigger");
              const isKeyDownInsideSubMenu = target.closest("[data-radix-menubar-content]") !== event.currentTarget;
              const prevMenuKey = context.dir === "rtl" ? "ArrowRight" : "ArrowLeft";
              const isPrevKey = prevMenuKey === event.key;
              const isNextKey = !isPrevKey;
              if (isNextKey && targetIsSubTrigger) return;
              if (isKeyDownInsideSubMenu && isPrevKey) return;
              const items = getItems().filter((item) => !item.disabled);
              let candidateValues = items.map((item) => item.value);
              if (isPrevKey) candidateValues.reverse();
              const currentIndex = candidateValues.indexOf(menuContext.value);
              candidateValues = context.loop ? wrapArray3(candidateValues, currentIndex + 1) : candidateValues.slice(currentIndex + 1);
              const [nextValue] = candidateValues;
              if (nextValue) context.onMenuOpen(nextValue);
            }
          },
          { checkForDefaultPrevented: false }
        ),
        style: {
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-menubar-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-menubar-content-available-width": "var(--radix-popper-available-width)",
            "--radix-menubar-content-available-height": "var(--radix-popper-available-height)",
            "--radix-menubar-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-menubar-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  }
);
MenubarContent.displayName = CONTENT_NAME10;
var GROUP_NAME5 = "MenubarGroup";
var MenubarGroup = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...groupProps } = props;
    const menuScope = useMenuScope3(__scopeMenubar);
    return (0, import_jsx_runtime42.jsx)(Group, { ...menuScope, ...groupProps, ref: forwardedRef });
  }
);
MenubarGroup.displayName = GROUP_NAME5;
var LABEL_NAME5 = "MenubarLabel";
var MenubarLabel = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...labelProps } = props;
    const menuScope = useMenuScope3(__scopeMenubar);
    return (0, import_jsx_runtime42.jsx)(Label, { ...menuScope, ...labelProps, ref: forwardedRef });
  }
);
MenubarLabel.displayName = LABEL_NAME5;
var ITEM_NAME6 = "MenubarItem";
var MenubarItem = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...itemProps } = props;
    const menuScope = useMenuScope3(__scopeMenubar);
    return (0, import_jsx_runtime42.jsx)(Item2, { ...menuScope, ...itemProps, ref: forwardedRef });
  }
);
MenubarItem.displayName = ITEM_NAME6;
var CHECKBOX_ITEM_NAME4 = "MenubarCheckboxItem";
var MenubarCheckboxItem = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...checkboxItemProps } = props;
    const menuScope = useMenuScope3(__scopeMenubar);
    return (0, import_jsx_runtime42.jsx)(CheckboxItem, { ...menuScope, ...checkboxItemProps, ref: forwardedRef });
  }
);
MenubarCheckboxItem.displayName = CHECKBOX_ITEM_NAME4;
var RADIO_GROUP_NAME4 = "MenubarRadioGroup";
var MenubarRadioGroup = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...radioGroupProps } = props;
    const menuScope = useMenuScope3(__scopeMenubar);
    return (0, import_jsx_runtime42.jsx)(RadioGroup, { ...menuScope, ...radioGroupProps, ref: forwardedRef });
  }
);
MenubarRadioGroup.displayName = RADIO_GROUP_NAME4;
var RADIO_ITEM_NAME4 = "MenubarRadioItem";
var MenubarRadioItem = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...radioItemProps } = props;
    const menuScope = useMenuScope3(__scopeMenubar);
    return (0, import_jsx_runtime42.jsx)(RadioItem, { ...menuScope, ...radioItemProps, ref: forwardedRef });
  }
);
MenubarRadioItem.displayName = RADIO_ITEM_NAME4;
var INDICATOR_NAME4 = "MenubarItemIndicator";
var MenubarItemIndicator = React53.forwardRef((props, forwardedRef) => {
  const { __scopeMenubar, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope3(__scopeMenubar);
  return (0, import_jsx_runtime42.jsx)(ItemIndicator, { ...menuScope, ...itemIndicatorProps, ref: forwardedRef });
});
MenubarItemIndicator.displayName = INDICATOR_NAME4;
var SEPARATOR_NAME4 = "MenubarSeparator";
var MenubarSeparator = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...separatorProps } = props;
    const menuScope = useMenuScope3(__scopeMenubar);
    return (0, import_jsx_runtime42.jsx)(Separator, { ...menuScope, ...separatorProps, ref: forwardedRef });
  }
);
MenubarSeparator.displayName = SEPARATOR_NAME4;
var ARROW_NAME6 = "MenubarArrow";
var MenubarArrow = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...arrowProps } = props;
    const menuScope = useMenuScope3(__scopeMenubar);
    return (0, import_jsx_runtime42.jsx)(Arrow22, { ...menuScope, ...arrowProps, ref: forwardedRef });
  }
);
MenubarArrow.displayName = ARROW_NAME6;
var SUB_NAME3 = "MenubarSub";
var MenubarSub = (props) => {
  const { __scopeMenubar, children, open: openProp, onOpenChange, defaultOpen } = props;
  const menuScope = useMenuScope3(__scopeMenubar);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SUB_NAME3
  });
  return (0, import_jsx_runtime42.jsx)(Sub, { ...menuScope, open, onOpenChange: setOpen, children });
};
MenubarSub.displayName = SUB_NAME3;
var SUB_TRIGGER_NAME4 = "MenubarSubTrigger";
var MenubarSubTrigger = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...subTriggerProps } = props;
    const menuScope = useMenuScope3(__scopeMenubar);
    return (0, import_jsx_runtime42.jsx)(
      SubTrigger,
      {
        "data-radix-menubar-subtrigger": "",
        ...menuScope,
        ...subTriggerProps,
        ref: forwardedRef
      }
    );
  }
);
MenubarSubTrigger.displayName = SUB_TRIGGER_NAME4;
var SUB_CONTENT_NAME4 = "MenubarSubContent";
var MenubarSubContent = React53.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...subContentProps } = props;
    const menuScope = useMenuScope3(__scopeMenubar);
    return (0, import_jsx_runtime42.jsx)(
      SubContent,
      {
        ...menuScope,
        "data-radix-menubar-content": "",
        ...subContentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-menubar-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-menubar-content-available-width": "var(--radix-popper-available-width)",
            "--radix-menubar-content-available-height": "var(--radix-popper-available-height)",
            "--radix-menubar-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-menubar-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  }
);
MenubarSubContent.displayName = SUB_CONTENT_NAME4;
function wrapArray3(array, startIndex) {
  return array.map((_, index4) => array[(startIndex + index4) % array.length]);
}

// ../../node_modules/.pnpm/@radix-ui+react-navigation-menu@1.2.14_@types+react-dom@19.2.3_@types+react@19.2.14__@t_7563284ec2dc0b07b96e6ca399b56630/node_modules/@radix-ui/react-navigation-menu/dist/index.mjs
var React54 = __toESM(require_react(), 1);
var import_react_dom3 = __toESM(require_react_dom(), 1);
var import_jsx_runtime43 = __toESM(require_jsx_runtime(), 1);
var NAVIGATION_MENU_NAME = "NavigationMenu";
var [Collection5, useCollection5, createCollectionScope5] = createCollection(NAVIGATION_MENU_NAME);
var [FocusGroupCollection, useFocusGroupCollection, createFocusGroupCollectionScope] = createCollection(NAVIGATION_MENU_NAME);
var [createNavigationMenuContext, createNavigationMenuScope] = createContextScope(
  NAVIGATION_MENU_NAME,
  [createCollectionScope5, createFocusGroupCollectionScope]
);
var [NavigationMenuProviderImpl, useNavigationMenuContext] = createNavigationMenuContext(NAVIGATION_MENU_NAME);
var [ViewportContentProvider, useViewportContentContext] = createNavigationMenuContext(NAVIGATION_MENU_NAME);
var NavigationMenu = React54.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeNavigationMenu,
      value: valueProp,
      onValueChange,
      defaultValue,
      delayDuration = 200,
      skipDelayDuration = 300,
      orientation = "horizontal",
      dir,
      ...NavigationMenuProps
    } = props;
    const [navigationMenu, setNavigationMenu] = React54.useState(null);
    const composedRef = useComposedRefs(forwardedRef, (node) => setNavigationMenu(node));
    const direction = useDirection(dir);
    const openTimerRef = React54.useRef(0);
    const closeTimerRef = React54.useRef(0);
    const skipDelayTimerRef = React54.useRef(0);
    const [isOpenDelayed, setIsOpenDelayed] = React54.useState(true);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: (value2) => {
        const isOpen = value2 !== "";
        const hasSkipDelayDuration = skipDelayDuration > 0;
        if (isOpen) {
          window.clearTimeout(skipDelayTimerRef.current);
          if (hasSkipDelayDuration) setIsOpenDelayed(false);
        } else {
          window.clearTimeout(skipDelayTimerRef.current);
          skipDelayTimerRef.current = window.setTimeout(
            () => setIsOpenDelayed(true),
            skipDelayDuration
          );
        }
        onValueChange == null ? void 0 : onValueChange(value2);
      },
      defaultProp: defaultValue ?? "",
      caller: NAVIGATION_MENU_NAME
    });
    const startCloseTimer = React54.useCallback(() => {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(() => setValue(""), 150);
    }, [setValue]);
    const handleOpen = React54.useCallback(
      (itemValue) => {
        window.clearTimeout(closeTimerRef.current);
        setValue(itemValue);
      },
      [setValue]
    );
    const handleDelayedOpen = React54.useCallback(
      (itemValue) => {
        const isOpenItem = value === itemValue;
        if (isOpenItem) {
          window.clearTimeout(closeTimerRef.current);
        } else {
          openTimerRef.current = window.setTimeout(() => {
            window.clearTimeout(closeTimerRef.current);
            setValue(itemValue);
          }, delayDuration);
        }
      },
      [value, setValue, delayDuration]
    );
    React54.useEffect(() => {
      return () => {
        window.clearTimeout(openTimerRef.current);
        window.clearTimeout(closeTimerRef.current);
        window.clearTimeout(skipDelayTimerRef.current);
      };
    }, []);
    return (0, import_jsx_runtime43.jsx)(
      NavigationMenuProvider,
      {
        scope: __scopeNavigationMenu,
        isRootMenu: true,
        value,
        dir: direction,
        orientation,
        rootNavigationMenu: navigationMenu,
        onTriggerEnter: (itemValue) => {
          window.clearTimeout(openTimerRef.current);
          if (isOpenDelayed) handleDelayedOpen(itemValue);
          else handleOpen(itemValue);
        },
        onTriggerLeave: () => {
          window.clearTimeout(openTimerRef.current);
          startCloseTimer();
        },
        onContentEnter: () => window.clearTimeout(closeTimerRef.current),
        onContentLeave: startCloseTimer,
        onItemSelect: (itemValue) => {
          setValue((prevValue) => prevValue === itemValue ? "" : itemValue);
        },
        onItemDismiss: () => setValue(""),
        children: (0, import_jsx_runtime43.jsx)(
          Primitive3.nav,
          {
            "aria-label": "Main",
            "data-orientation": orientation,
            dir: direction,
            ...NavigationMenuProps,
            ref: composedRef
          }
        )
      }
    );
  }
);
NavigationMenu.displayName = NAVIGATION_MENU_NAME;
var SUB_NAME4 = "NavigationMenuSub";
var NavigationMenuSub = React54.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeNavigationMenu,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      ...subProps
    } = props;
    const context = useNavigationMenuContext(SUB_NAME4, __scopeNavigationMenu);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: SUB_NAME4
    });
    return (0, import_jsx_runtime43.jsx)(
      NavigationMenuProvider,
      {
        scope: __scopeNavigationMenu,
        isRootMenu: false,
        value,
        dir: context.dir,
        orientation,
        rootNavigationMenu: context.rootNavigationMenu,
        onTriggerEnter: (itemValue) => setValue(itemValue),
        onItemSelect: (itemValue) => setValue(itemValue),
        onItemDismiss: () => setValue(""),
        children: (0, import_jsx_runtime43.jsx)(Primitive3.div, { "data-orientation": orientation, ...subProps, ref: forwardedRef })
      }
    );
  }
);
NavigationMenuSub.displayName = SUB_NAME4;
var NavigationMenuProvider = (props) => {
  const {
    scope,
    isRootMenu,
    rootNavigationMenu,
    dir,
    orientation,
    children,
    value,
    onItemSelect,
    onItemDismiss,
    onTriggerEnter,
    onTriggerLeave,
    onContentEnter,
    onContentLeave
  } = props;
  const [viewport, setViewport] = React54.useState(null);
  const [viewportContent, setViewportContent] = React54.useState(/* @__PURE__ */ new Map());
  const [indicatorTrack, setIndicatorTrack] = React54.useState(null);
  return (0, import_jsx_runtime43.jsx)(
    NavigationMenuProviderImpl,
    {
      scope,
      isRootMenu,
      rootNavigationMenu,
      value,
      previousValue: usePrevious(value),
      baseId: useId2(),
      dir,
      orientation,
      viewport,
      onViewportChange: setViewport,
      indicatorTrack,
      onIndicatorTrackChange: setIndicatorTrack,
      onTriggerEnter: useCallbackRef(onTriggerEnter),
      onTriggerLeave: useCallbackRef(onTriggerLeave),
      onContentEnter: useCallbackRef(onContentEnter),
      onContentLeave: useCallbackRef(onContentLeave),
      onItemSelect: useCallbackRef(onItemSelect),
      onItemDismiss: useCallbackRef(onItemDismiss),
      onViewportContentChange: React54.useCallback((contentValue, contentData) => {
        setViewportContent((prevContent) => {
          prevContent.set(contentValue, contentData);
          return new Map(prevContent);
        });
      }, []),
      onViewportContentRemove: React54.useCallback((contentValue) => {
        setViewportContent((prevContent) => {
          if (!prevContent.has(contentValue)) return prevContent;
          prevContent.delete(contentValue);
          return new Map(prevContent);
        });
      }, []),
      children: (0, import_jsx_runtime43.jsx)(Collection5.Provider, { scope, children: (0, import_jsx_runtime43.jsx)(ViewportContentProvider, { scope, items: viewportContent, children }) })
    }
  );
};
var LIST_NAME = "NavigationMenuList";
var NavigationMenuList = React54.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, ...listProps } = props;
    const context = useNavigationMenuContext(LIST_NAME, __scopeNavigationMenu);
    const list = (0, import_jsx_runtime43.jsx)(Primitive3.ul, { "data-orientation": context.orientation, ...listProps, ref: forwardedRef });
    return (0, import_jsx_runtime43.jsx)(Primitive3.div, { style: { position: "relative" }, ref: context.onIndicatorTrackChange, children: (0, import_jsx_runtime43.jsx)(Collection5.Slot, { scope: __scopeNavigationMenu, children: context.isRootMenu ? (0, import_jsx_runtime43.jsx)(FocusGroup, { asChild: true, children: list }) : list }) });
  }
);
NavigationMenuList.displayName = LIST_NAME;
var ITEM_NAME7 = "NavigationMenuItem";
var [NavigationMenuItemContextProvider, useNavigationMenuItemContext] = createNavigationMenuContext(ITEM_NAME7);
var NavigationMenuItem = React54.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, value: valueProp, ...itemProps } = props;
    const autoValue = useId2();
    const value = valueProp || autoValue || "LEGACY_REACT_AUTO_VALUE";
    const contentRef = React54.useRef(null);
    const triggerRef = React54.useRef(null);
    const focusProxyRef = React54.useRef(null);
    const restoreContentTabOrderRef = React54.useRef(() => {
    });
    const wasEscapeCloseRef = React54.useRef(false);
    const handleContentEntry = React54.useCallback((side = "start") => {
      if (contentRef.current) {
        restoreContentTabOrderRef.current();
        const candidates = getTabbableCandidates2(contentRef.current);
        if (candidates.length) focusFirst4(side === "start" ? candidates : candidates.reverse());
      }
    }, []);
    const handleContentExit = React54.useCallback(() => {
      if (contentRef.current) {
        const candidates = getTabbableCandidates2(contentRef.current);
        if (candidates.length) restoreContentTabOrderRef.current = removeFromTabOrder(candidates);
      }
    }, []);
    return (0, import_jsx_runtime43.jsx)(
      NavigationMenuItemContextProvider,
      {
        scope: __scopeNavigationMenu,
        value,
        triggerRef,
        contentRef,
        focusProxyRef,
        wasEscapeCloseRef,
        onEntryKeyDown: handleContentEntry,
        onFocusProxyEnter: handleContentEntry,
        onRootContentClose: handleContentExit,
        onContentFocusOutside: handleContentExit,
        children: (0, import_jsx_runtime43.jsx)(Primitive3.li, { ...itemProps, ref: forwardedRef })
      }
    );
  }
);
NavigationMenuItem.displayName = ITEM_NAME7;
var TRIGGER_NAME10 = "NavigationMenuTrigger";
var NavigationMenuTrigger = React54.forwardRef((props, forwardedRef) => {
  const { __scopeNavigationMenu, disabled, ...triggerProps } = props;
  const context = useNavigationMenuContext(TRIGGER_NAME10, props.__scopeNavigationMenu);
  const itemContext = useNavigationMenuItemContext(TRIGGER_NAME10, props.__scopeNavigationMenu);
  const ref = React54.useRef(null);
  const composedRefs = useComposedRefs(ref, itemContext.triggerRef, forwardedRef);
  const triggerId = makeTriggerId(context.baseId, itemContext.value);
  const contentId = makeContentId(context.baseId, itemContext.value);
  const hasPointerMoveOpenedRef = React54.useRef(false);
  const wasClickCloseRef = React54.useRef(false);
  const open = itemContext.value === context.value;
  return (0, import_jsx_runtime43.jsxs)(import_jsx_runtime43.Fragment, { children: [
    (0, import_jsx_runtime43.jsx)(Collection5.ItemSlot, { scope: __scopeNavigationMenu, value: itemContext.value, children: (0, import_jsx_runtime43.jsx)(FocusGroupItem, { asChild: true, children: (0, import_jsx_runtime43.jsx)(
      Primitive3.button,
      {
        id: triggerId,
        disabled,
        "data-disabled": disabled ? "" : void 0,
        "data-state": getOpenState2(open),
        "aria-expanded": open,
        "aria-controls": contentId,
        ...triggerProps,
        ref: composedRefs,
        onPointerEnter: composeEventHandlers(props.onPointerEnter, () => {
          wasClickCloseRef.current = false;
          itemContext.wasEscapeCloseRef.current = false;
        }),
        onPointerMove: composeEventHandlers(
          props.onPointerMove,
          whenMouse2(() => {
            if (disabled || wasClickCloseRef.current || itemContext.wasEscapeCloseRef.current || hasPointerMoveOpenedRef.current)
              return;
            context.onTriggerEnter(itemContext.value);
            hasPointerMoveOpenedRef.current = true;
          })
        ),
        onPointerLeave: composeEventHandlers(
          props.onPointerLeave,
          whenMouse2(() => {
            if (disabled) return;
            context.onTriggerLeave();
            hasPointerMoveOpenedRef.current = false;
          })
        ),
        onClick: composeEventHandlers(props.onClick, () => {
          context.onItemSelect(itemContext.value);
          wasClickCloseRef.current = open;
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const verticalEntryKey = context.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
          const entryKey = { horizontal: "ArrowDown", vertical: verticalEntryKey }[context.orientation];
          if (open && event.key === entryKey) {
            itemContext.onEntryKeyDown();
            event.preventDefault();
          }
        })
      }
    ) }) }),
    open && (0, import_jsx_runtime43.jsxs)(import_jsx_runtime43.Fragment, { children: [
      (0, import_jsx_runtime43.jsx)(
        Root2,
        {
          "aria-hidden": true,
          tabIndex: 0,
          ref: itemContext.focusProxyRef,
          onFocus: (event) => {
            const content = itemContext.contentRef.current;
            const prevFocusedElement = event.relatedTarget;
            const wasTriggerFocused = prevFocusedElement === ref.current;
            const wasFocusFromContent = content == null ? void 0 : content.contains(prevFocusedElement);
            if (wasTriggerFocused || !wasFocusFromContent) {
              itemContext.onFocusProxyEnter(wasTriggerFocused ? "start" : "end");
            }
          }
        }
      ),
      context.viewport && (0, import_jsx_runtime43.jsx)("span", { "aria-owns": contentId })
    ] })
  ] });
});
NavigationMenuTrigger.displayName = TRIGGER_NAME10;
var LINK_NAME = "NavigationMenuLink";
var LINK_SELECT = "navigationMenu.linkSelect";
var NavigationMenuLink = React54.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, active, onSelect, ...linkProps } = props;
    return (0, import_jsx_runtime43.jsx)(FocusGroupItem, { asChild: true, children: (0, import_jsx_runtime43.jsx)(
      Primitive3.a,
      {
        "data-active": active ? "" : void 0,
        "aria-current": active ? "page" : void 0,
        ...linkProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(
          props.onClick,
          (event) => {
            const target = event.target;
            const linkSelectEvent = new CustomEvent(LINK_SELECT, {
              bubbles: true,
              cancelable: true
            });
            target.addEventListener(LINK_SELECT, (event2) => onSelect == null ? void 0 : onSelect(event2), { once: true });
            dispatchDiscreteCustomEvent(target, linkSelectEvent);
            if (!linkSelectEvent.defaultPrevented && !event.metaKey) {
              const rootContentDismissEvent = new CustomEvent(ROOT_CONTENT_DISMISS, {
                bubbles: true,
                cancelable: true
              });
              dispatchDiscreteCustomEvent(target, rootContentDismissEvent);
            }
          },
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
NavigationMenuLink.displayName = LINK_NAME;
var INDICATOR_NAME5 = "NavigationMenuIndicator";
var NavigationMenuIndicator = React54.forwardRef((props, forwardedRef) => {
  const { forceMount, ...indicatorProps } = props;
  const context = useNavigationMenuContext(INDICATOR_NAME5, props.__scopeNavigationMenu);
  const isVisible = Boolean(context.value);
  return context.indicatorTrack ? import_react_dom3.default.createPortal(
    (0, import_jsx_runtime43.jsx)(Presence, { present: forceMount || isVisible, children: (0, import_jsx_runtime43.jsx)(NavigationMenuIndicatorImpl, { ...indicatorProps, ref: forwardedRef }) }),
    context.indicatorTrack
  ) : null;
});
NavigationMenuIndicator.displayName = INDICATOR_NAME5;
var NavigationMenuIndicatorImpl = React54.forwardRef((props, forwardedRef) => {
  const { __scopeNavigationMenu, ...indicatorProps } = props;
  const context = useNavigationMenuContext(INDICATOR_NAME5, __scopeNavigationMenu);
  const getItems = useCollection5(__scopeNavigationMenu);
  const [activeTrigger, setActiveTrigger] = React54.useState(
    null
  );
  const [position, setPosition] = React54.useState(null);
  const isHorizontal = context.orientation === "horizontal";
  const isVisible = Boolean(context.value);
  React54.useEffect(() => {
    var _a2;
    const items = getItems();
    const triggerNode = (_a2 = items.find((item) => item.value === context.value)) == null ? void 0 : _a2.ref.current;
    if (triggerNode) setActiveTrigger(triggerNode);
  }, [getItems, context.value]);
  const handlePositionChange = () => {
    if (activeTrigger) {
      setPosition({
        size: isHorizontal ? activeTrigger.offsetWidth : activeTrigger.offsetHeight,
        offset: isHorizontal ? activeTrigger.offsetLeft : activeTrigger.offsetTop
      });
    }
  };
  useResizeObserver(activeTrigger, handlePositionChange);
  useResizeObserver(context.indicatorTrack, handlePositionChange);
  return position ? (0, import_jsx_runtime43.jsx)(
    Primitive3.div,
    {
      "aria-hidden": true,
      "data-state": isVisible ? "visible" : "hidden",
      "data-orientation": context.orientation,
      ...indicatorProps,
      ref: forwardedRef,
      style: {
        position: "absolute",
        ...isHorizontal ? {
          left: 0,
          width: position.size + "px",
          transform: `translateX(${position.offset}px)`
        } : {
          top: 0,
          height: position.size + "px",
          transform: `translateY(${position.offset}px)`
        },
        ...indicatorProps.style
      }
    }
  ) : null;
});
var CONTENT_NAME11 = "NavigationMenuContent";
var NavigationMenuContent = React54.forwardRef((props, forwardedRef) => {
  const { forceMount, ...contentProps } = props;
  const context = useNavigationMenuContext(CONTENT_NAME11, props.__scopeNavigationMenu);
  const itemContext = useNavigationMenuItemContext(CONTENT_NAME11, props.__scopeNavigationMenu);
  const composedRefs = useComposedRefs(itemContext.contentRef, forwardedRef);
  const open = itemContext.value === context.value;
  const commonProps = {
    value: itemContext.value,
    triggerRef: itemContext.triggerRef,
    focusProxyRef: itemContext.focusProxyRef,
    wasEscapeCloseRef: itemContext.wasEscapeCloseRef,
    onContentFocusOutside: itemContext.onContentFocusOutside,
    onRootContentClose: itemContext.onRootContentClose,
    ...contentProps
  };
  return !context.viewport ? (0, import_jsx_runtime43.jsx)(Presence, { present: forceMount || open, children: (0, import_jsx_runtime43.jsx)(
    NavigationMenuContentImpl,
    {
      "data-state": getOpenState2(open),
      ...commonProps,
      ref: composedRefs,
      onPointerEnter: composeEventHandlers(props.onPointerEnter, context.onContentEnter),
      onPointerLeave: composeEventHandlers(
        props.onPointerLeave,
        whenMouse2(context.onContentLeave)
      ),
      style: {
        // Prevent interaction when animating out
        pointerEvents: !open && context.isRootMenu ? "none" : void 0,
        ...commonProps.style
      }
    }
  ) }) : (0, import_jsx_runtime43.jsx)(ViewportContentMounter, { forceMount, ...commonProps, ref: composedRefs });
});
NavigationMenuContent.displayName = CONTENT_NAME11;
var ViewportContentMounter = React54.forwardRef((props, forwardedRef) => {
  const context = useNavigationMenuContext(CONTENT_NAME11, props.__scopeNavigationMenu);
  const { onViewportContentChange, onViewportContentRemove } = context;
  useLayoutEffect2(() => {
    onViewportContentChange(props.value, {
      ref: forwardedRef,
      ...props
    });
  }, [props, forwardedRef, onViewportContentChange]);
  useLayoutEffect2(() => {
    return () => onViewportContentRemove(props.value);
  }, [props.value, onViewportContentRemove]);
  return null;
});
var ROOT_CONTENT_DISMISS = "navigationMenu.rootContentDismiss";
var NavigationMenuContentImpl = React54.forwardRef((props, forwardedRef) => {
  const {
    __scopeNavigationMenu,
    value,
    triggerRef,
    focusProxyRef,
    wasEscapeCloseRef,
    onRootContentClose,
    onContentFocusOutside,
    ...contentProps
  } = props;
  const context = useNavigationMenuContext(CONTENT_NAME11, __scopeNavigationMenu);
  const ref = React54.useRef(null);
  const composedRefs = useComposedRefs(ref, forwardedRef);
  const triggerId = makeTriggerId(context.baseId, value);
  const contentId = makeContentId(context.baseId, value);
  const getItems = useCollection5(__scopeNavigationMenu);
  const prevMotionAttributeRef = React54.useRef(null);
  const { onItemDismiss } = context;
  React54.useEffect(() => {
    const content = ref.current;
    if (context.isRootMenu && content) {
      const handleClose = () => {
        var _a2;
        onItemDismiss();
        onRootContentClose();
        if (content.contains(document.activeElement)) (_a2 = triggerRef.current) == null ? void 0 : _a2.focus();
      };
      content.addEventListener(ROOT_CONTENT_DISMISS, handleClose);
      return () => content.removeEventListener(ROOT_CONTENT_DISMISS, handleClose);
    }
  }, [context.isRootMenu, props.value, triggerRef, onItemDismiss, onRootContentClose]);
  const motionAttribute = React54.useMemo(() => {
    const items = getItems();
    const values = items.map((item) => item.value);
    if (context.dir === "rtl") values.reverse();
    const index4 = values.indexOf(context.value);
    const prevIndex = values.indexOf(context.previousValue);
    const isSelected = value === context.value;
    const wasSelected = prevIndex === values.indexOf(value);
    if (!isSelected && !wasSelected) return prevMotionAttributeRef.current;
    const attribute = (() => {
      if (index4 !== prevIndex) {
        if (isSelected && prevIndex !== -1) return index4 > prevIndex ? "from-end" : "from-start";
        if (wasSelected && index4 !== -1) return index4 > prevIndex ? "to-start" : "to-end";
      }
      return null;
    })();
    prevMotionAttributeRef.current = attribute;
    return attribute;
  }, [context.previousValue, context.value, context.dir, getItems, value]);
  return (0, import_jsx_runtime43.jsx)(FocusGroup, { asChild: true, children: (0, import_jsx_runtime43.jsx)(
    DismissableLayer,
    {
      id: contentId,
      "aria-labelledby": triggerId,
      "data-motion": motionAttribute,
      "data-orientation": context.orientation,
      ...contentProps,
      ref: composedRefs,
      disableOutsidePointerEvents: false,
      onDismiss: () => {
        var _a2;
        const rootContentDismissEvent = new Event(ROOT_CONTENT_DISMISS, {
          bubbles: true,
          cancelable: true
        });
        (_a2 = ref.current) == null ? void 0 : _a2.dispatchEvent(rootContentDismissEvent);
      },
      onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
        var _a2;
        onContentFocusOutside();
        const target = event.target;
        if ((_a2 = context.rootNavigationMenu) == null ? void 0 : _a2.contains(target)) event.preventDefault();
      }),
      onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
        var _a2;
        const target = event.target;
        const isTrigger = getItems().some((item) => {
          var _a3;
          return (_a3 = item.ref.current) == null ? void 0 : _a3.contains(target);
        });
        const isRootViewport = context.isRootMenu && ((_a2 = context.viewport) == null ? void 0 : _a2.contains(target));
        if (isTrigger || isRootViewport || !context.isRootMenu) event.preventDefault();
      }),
      onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
        var _a2;
        const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
        const isTabKey = event.key === "Tab" && !isMetaKey;
        if (isTabKey) {
          const candidates = getTabbableCandidates2(event.currentTarget);
          const focusedElement = document.activeElement;
          const index4 = candidates.findIndex((candidate) => candidate === focusedElement);
          const isMovingBackwards = event.shiftKey;
          const nextCandidates = isMovingBackwards ? candidates.slice(0, index4).reverse() : candidates.slice(index4 + 1, candidates.length);
          if (focusFirst4(nextCandidates)) {
            event.preventDefault();
          } else {
            (_a2 = focusProxyRef.current) == null ? void 0 : _a2.focus();
          }
        }
      }),
      onEscapeKeyDown: composeEventHandlers(props.onEscapeKeyDown, (_event) => {
        wasEscapeCloseRef.current = true;
      })
    }
  ) });
});
var VIEWPORT_NAME = "NavigationMenuViewport";
var NavigationMenuViewport = React54.forwardRef((props, forwardedRef) => {
  const { forceMount, ...viewportProps } = props;
  const context = useNavigationMenuContext(VIEWPORT_NAME, props.__scopeNavigationMenu);
  const open = Boolean(context.value);
  return (0, import_jsx_runtime43.jsx)(Presence, { present: forceMount || open, children: (0, import_jsx_runtime43.jsx)(NavigationMenuViewportImpl, { ...viewportProps, ref: forwardedRef }) });
});
NavigationMenuViewport.displayName = VIEWPORT_NAME;
var NavigationMenuViewportImpl = React54.forwardRef((props, forwardedRef) => {
  const { __scopeNavigationMenu, children, ...viewportImplProps } = props;
  const context = useNavigationMenuContext(VIEWPORT_NAME, __scopeNavigationMenu);
  const composedRefs = useComposedRefs(forwardedRef, context.onViewportChange);
  const viewportContentContext = useViewportContentContext(
    CONTENT_NAME11,
    props.__scopeNavigationMenu
  );
  const [size4, setSize] = React54.useState(null);
  const [content, setContent] = React54.useState(null);
  const viewportWidth = size4 ? (size4 == null ? void 0 : size4.width) + "px" : void 0;
  const viewportHeight = size4 ? (size4 == null ? void 0 : size4.height) + "px" : void 0;
  const open = Boolean(context.value);
  const activeContentValue = open ? context.value : context.previousValue;
  const handleSizeChange = () => {
    if (content) setSize({ width: content.offsetWidth, height: content.offsetHeight });
  };
  useResizeObserver(content, handleSizeChange);
  return (0, import_jsx_runtime43.jsx)(
    Primitive3.div,
    {
      "data-state": getOpenState2(open),
      "data-orientation": context.orientation,
      ...viewportImplProps,
      ref: composedRefs,
      style: {
        // Prevent interaction when animating out
        pointerEvents: !open && context.isRootMenu ? "none" : void 0,
        ["--radix-navigation-menu-viewport-width"]: viewportWidth,
        ["--radix-navigation-menu-viewport-height"]: viewportHeight,
        ...viewportImplProps.style
      },
      onPointerEnter: composeEventHandlers(props.onPointerEnter, context.onContentEnter),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, whenMouse2(context.onContentLeave)),
      children: Array.from(viewportContentContext.items).map(([value, { ref, forceMount, ...props2 }]) => {
        const isActive = activeContentValue === value;
        return (0, import_jsx_runtime43.jsx)(Presence, { present: forceMount || isActive, children: (0, import_jsx_runtime43.jsx)(
          NavigationMenuContentImpl,
          {
            ...props2,
            ref: composeRefs(ref, (node) => {
              if (isActive && node) setContent(node);
            })
          }
        ) }, value);
      })
    }
  );
});
var FOCUS_GROUP_NAME = "FocusGroup";
var FocusGroup = React54.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, ...groupProps } = props;
    const context = useNavigationMenuContext(FOCUS_GROUP_NAME, __scopeNavigationMenu);
    return (0, import_jsx_runtime43.jsx)(FocusGroupCollection.Provider, { scope: __scopeNavigationMenu, children: (0, import_jsx_runtime43.jsx)(FocusGroupCollection.Slot, { scope: __scopeNavigationMenu, children: (0, import_jsx_runtime43.jsx)(Primitive3.div, { dir: context.dir, ...groupProps, ref: forwardedRef }) }) });
  }
);
var ARROW_KEYS = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
var FOCUS_GROUP_ITEM_NAME = "FocusGroupItem";
var FocusGroupItem = React54.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, ...groupProps } = props;
    const getItems = useFocusGroupCollection(__scopeNavigationMenu);
    const context = useNavigationMenuContext(FOCUS_GROUP_ITEM_NAME, __scopeNavigationMenu);
    return (0, import_jsx_runtime43.jsx)(FocusGroupCollection.ItemSlot, { scope: __scopeNavigationMenu, children: (0, import_jsx_runtime43.jsx)(
      Primitive3.button,
      {
        ...groupProps,
        ref: forwardedRef,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isFocusNavigationKey = ["Home", "End", ...ARROW_KEYS].includes(event.key);
          if (isFocusNavigationKey) {
            let candidateNodes = getItems().map((item) => item.ref.current);
            const prevItemKey = context.dir === "rtl" ? "ArrowRight" : "ArrowLeft";
            const prevKeys = [prevItemKey, "ArrowUp", "End"];
            if (prevKeys.includes(event.key)) candidateNodes.reverse();
            if (ARROW_KEYS.includes(event.key)) {
              const currentIndex = candidateNodes.indexOf(event.currentTarget);
              candidateNodes = candidateNodes.slice(currentIndex + 1);
            }
            setTimeout(() => focusFirst4(candidateNodes));
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
function getTabbableCandidates2(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function focusFirst4(candidates) {
  const previouslyFocusedElement = document.activeElement;
  return candidates.some((candidate) => {
    if (candidate === previouslyFocusedElement) return true;
    candidate.focus();
    return document.activeElement !== previouslyFocusedElement;
  });
}
function removeFromTabOrder(candidates) {
  candidates.forEach((candidate) => {
    candidate.dataset.tabindex = candidate.getAttribute("tabindex") || "";
    candidate.setAttribute("tabindex", "-1");
  });
  return () => {
    candidates.forEach((candidate) => {
      const prevTabIndex = candidate.dataset.tabindex;
      candidate.setAttribute("tabindex", prevTabIndex);
    });
  };
}
function useResizeObserver(element, onResize) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect2(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
function getOpenState2(open) {
  return open ? "open" : "closed";
}
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
function whenMouse2(handler) {
  return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}

// ../../node_modules/.pnpm/@radix-ui+react-one-time-password-field@0.1.8_@types+react-dom@19.2.3_@types+react@19.2_d966c07edda083842dfc81816512d421/node_modules/@radix-ui/react-one-time-password-field/dist/index.mjs
var React55 = __toESM(require_react(), 1);
var import_react_dom4 = __toESM(require_react_dom(), 1);

// ../../node_modules/.pnpm/@radix-ui+number@1.1.1/node_modules/@radix-ui/number/dist/index.mjs
function clamp2(value, [min2, max2]) {
  return Math.min(max2, Math.max(min2, value));
}

// ../../node_modules/.pnpm/@radix-ui+react-one-time-password-field@0.1.8_@types+react-dom@19.2.3_@types+react@19.2_d966c07edda083842dfc81816512d421/node_modules/@radix-ui/react-one-time-password-field/dist/index.mjs
var import_jsx_runtime44 = __toESM(require_jsx_runtime(), 1);
var INPUT_VALIDATION_MAP = {
  numeric: {
    type: "numeric",
    regexp: /[^\d]/g,
    pattern: "\\d{1}",
    inputMode: "numeric"
  },
  alpha: {
    type: "alpha",
    regexp: /[^a-zA-Z]/g,
    pattern: "[a-zA-Z]{1}",
    inputMode: "text"
  },
  alphanumeric: {
    type: "alphanumeric",
    regexp: /[^a-zA-Z0-9]/g,
    pattern: "[a-zA-Z0-9]{1}",
    inputMode: "text"
  },
  none: null
};
var ONE_TIME_PASSWORD_FIELD_NAME = "OneTimePasswordField";
var [Collection6, { useCollection: useCollection6, createCollectionScope: createCollectionScope6, useInitCollection }] = createCollection2(ONE_TIME_PASSWORD_FIELD_NAME);
var [createOneTimePasswordFieldContext] = createContextScope(ONE_TIME_PASSWORD_FIELD_NAME, [
  createCollectionScope6,
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope3 = createRovingFocusGroupScope();
var [OneTimePasswordFieldContext, useOneTimePasswordFieldContext] = createOneTimePasswordFieldContext(ONE_TIME_PASSWORD_FIELD_NAME);
var OneTimePasswordField = React55.forwardRef(
  function OneTimePasswordFieldImpl({
    __scopeOneTimePasswordField,
    defaultValue,
    value: valueProp,
    onValueChange,
    autoSubmit = false,
    children,
    onPaste,
    onAutoSubmit,
    disabled = false,
    readOnly = false,
    autoComplete = "one-time-code",
    autoFocus = false,
    form,
    name,
    placeholder,
    type = "text",
    // TODO: Change default to vertical when inputs use vertical writing mode
    orientation = "horizontal",
    dir,
    validationType = "numeric",
    sanitizeValue: sanitizeValueProp,
    ...domProps
  }, forwardedRef) {
    var _a2;
    const rovingFocusGroupScope = useRovingFocusGroupScope3(__scopeOneTimePasswordField);
    const direction = useDirection(dir);
    const collectionState = useInitCollection();
    const [collection] = collectionState;
    const validation = INPUT_VALIDATION_MAP[validationType] ? INPUT_VALIDATION_MAP[validationType] : null;
    const sanitizeValue = React55.useCallback(
      (value2) => {
        if (Array.isArray(value2)) {
          value2 = value2.map(removeWhitespace).join("");
        } else {
          value2 = removeWhitespace(value2);
        }
        if (validation) {
          const regexp = new RegExp(validation.regexp);
          value2 = value2.replace(regexp, "");
        } else if (sanitizeValueProp) {
          value2 = sanitizeValueProp(value2);
        }
        return value2.split("");
      },
      [validation, sanitizeValueProp]
    );
    const controlledValue = React55.useMemo(() => {
      return valueProp != null ? sanitizeValue(valueProp) : void 0;
    }, [valueProp, sanitizeValue]);
    const [value, setValue] = useControllableState({
      caller: "OneTimePasswordField",
      prop: controlledValue,
      defaultProp: defaultValue != null ? sanitizeValue(defaultValue) : [],
      onChange: React55.useCallback(
        (value2) => onValueChange == null ? void 0 : onValueChange(value2.join("")),
        [onValueChange]
      )
    });
    const dispatch = useEffectEvent((action) => {
      var _a3, _b, _c, _d, _e, _f, _g, _h, _i;
      switch (action.type) {
        case "SET_CHAR": {
          const { index: index4, char } = action;
          const currentTarget = (_a3 = collection.at(index4)) == null ? void 0 : _a3.element;
          if (value[index4] === char) {
            const next = currentTarget && ((_b = collection.from(currentTarget, 1)) == null ? void 0 : _b.element);
            focusInput(next);
            return;
          }
          if (char === "") {
            return;
          }
          if (validation) {
            const regexp = new RegExp(validation.regexp);
            const clean = char.replace(regexp, "");
            if (clean !== char) {
              return;
            }
          }
          if (value.length >= collection.size) {
            const newValue2 = [...value];
            newValue2[index4] = char;
            (0, import_react_dom4.flushSync)(() => setValue(newValue2));
            const next = currentTarget && ((_c = collection.from(currentTarget, 1)) == null ? void 0 : _c.element);
            focusInput(next);
            return;
          }
          const newValue = [...value];
          newValue[index4] = char;
          const lastElement = (_d = collection.at(-1)) == null ? void 0 : _d.element;
          (0, import_react_dom4.flushSync)(() => setValue(newValue));
          if (currentTarget !== lastElement) {
            const next = currentTarget && ((_e = collection.from(currentTarget, 1)) == null ? void 0 : _e.element);
            focusInput(next);
          } else {
            currentTarget == null ? void 0 : currentTarget.select();
          }
          return;
        }
        case "CLEAR_CHAR": {
          const { index: index4, reason } = action;
          if (!value[index4]) {
            return;
          }
          const newValue = value.filter((_, i) => i !== index4);
          const currentTarget = (_f = collection.at(index4)) == null ? void 0 : _f.element;
          const previous = currentTarget && ((_g = collection.from(currentTarget, -1)) == null ? void 0 : _g.element);
          (0, import_react_dom4.flushSync)(() => setValue(newValue));
          if (reason === "Backspace") {
            focusInput(previous);
          } else if (reason === "Delete" || reason === "Cut") {
            focusInput(currentTarget);
          }
          return;
        }
        case "CLEAR": {
          if (value.length === 0) {
            return;
          }
          if (action.reason === "Backspace" || action.reason === "Delete") {
            (0, import_react_dom4.flushSync)(() => setValue([]));
            focusInput((_h = collection.at(0)) == null ? void 0 : _h.element);
          } else {
            setValue([]);
          }
          return;
        }
        case "PASTE": {
          const { value: pastedValue } = action;
          const value2 = sanitizeValue(pastedValue);
          if (!value2) {
            return;
          }
          (0, import_react_dom4.flushSync)(() => setValue(value2));
          focusInput((_i = collection.at(value2.length - 1)) == null ? void 0 : _i.element);
          return;
        }
      }
    });
    const validationTypeRef = React55.useRef(validation);
    React55.useEffect(() => {
      var _a3;
      if (!validation) {
        return;
      }
      if (((_a3 = validationTypeRef.current) == null ? void 0 : _a3.type) !== validation.type) {
        validationTypeRef.current = validation;
        setValue(sanitizeValue(value.join("")));
      }
    }, [sanitizeValue, setValue, validation, value]);
    const hiddenInputRef = React55.useRef(null);
    const userActionRef = React55.useRef(null);
    const rootRef = React55.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, rootRef);
    const firstInput = (_a2 = collection.at(0)) == null ? void 0 : _a2.element;
    const locateForm = React55.useCallback(() => {
      var _a3;
      let formElement;
      if (form) {
        const associatedElement = (((_a3 = rootRef.current) == null ? void 0 : _a3.ownerDocument) ?? document).getElementById(form);
        if (isFormElement(associatedElement)) {
          formElement = associatedElement;
        }
      } else if (hiddenInputRef.current) {
        formElement = hiddenInputRef.current.form;
      } else if (firstInput) {
        formElement = firstInput.form;
      }
      return formElement ?? null;
    }, [form, firstInput]);
    const attemptSubmit = React55.useCallback(() => {
      const formElement = locateForm();
      formElement == null ? void 0 : formElement.requestSubmit();
    }, [locateForm]);
    React55.useEffect(() => {
      const form2 = locateForm();
      if (form2) {
        const reset = () => dispatch({ type: "CLEAR", reason: "Reset" });
        form2.addEventListener("reset", reset);
        return () => form2.removeEventListener("reset", reset);
      }
    }, [dispatch, locateForm]);
    const currentValue = value.join("");
    const valueRef = React55.useRef(currentValue);
    const length = collection.size;
    React55.useEffect(() => {
      const previousValue = valueRef.current;
      valueRef.current = currentValue;
      if (previousValue === currentValue) {
        return;
      }
      if (autoSubmit && value.every((char) => char !== "") && value.length === length) {
        onAutoSubmit == null ? void 0 : onAutoSubmit(value.join(""));
        attemptSubmit();
      }
    }, [attemptSubmit, autoSubmit, currentValue, length, onAutoSubmit, value]);
    const isHydrated = useIsHydrated();
    return (0, import_jsx_runtime44.jsx)(
      OneTimePasswordFieldContext,
      {
        scope: __scopeOneTimePasswordField,
        value,
        attemptSubmit,
        disabled,
        readOnly,
        autoComplete,
        autoFocus,
        form,
        name,
        placeholder,
        type,
        hiddenInputRef,
        userActionRef,
        dispatch,
        validationType,
        orientation,
        isHydrated,
        sanitizeValue,
        children: (0, import_jsx_runtime44.jsx)(Collection6.Provider, { scope: __scopeOneTimePasswordField, state: collectionState, children: (0, import_jsx_runtime44.jsx)(Collection6.Slot, { scope: __scopeOneTimePasswordField, children: (0, import_jsx_runtime44.jsx)(
          Root7,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation,
            dir: direction,
            children: (0, import_jsx_runtime44.jsx)(
              Root.div,
              {
                ...domProps,
                role: "group",
                ref: composedRefs,
                onPaste: composeEventHandlers(
                  onPaste,
                  (event) => {
                    event.preventDefault();
                    const pastedValue = event.clipboardData.getData("Text");
                    dispatch({ type: "PASTE", value: pastedValue });
                  }
                ),
                children
              }
            )
          }
        ) }) })
      }
    );
  }
);
var OneTimePasswordFieldHiddenInput = React55.forwardRef(function OneTimePasswordFieldHiddenInput2({ __scopeOneTimePasswordField, ...props }, forwardedRef) {
  const { value, hiddenInputRef, name } = useOneTimePasswordFieldContext(
    "OneTimePasswordFieldHiddenInput",
    __scopeOneTimePasswordField
  );
  const ref = useComposedRefs(hiddenInputRef, forwardedRef);
  return (0, import_jsx_runtime44.jsx)(
    "input",
    {
      ref,
      name,
      value: value.join("").trim(),
      autoComplete: "off",
      autoFocus: false,
      autoCapitalize: "off",
      autoCorrect: "off",
      autoSave: "off",
      spellCheck: false,
      ...props,
      type: "hidden",
      readOnly: true
    }
  );
});
var OneTimePasswordFieldInput = React55.forwardRef(function OneTimePasswordFieldInput2({
  __scopeOneTimePasswordField,
  onInvalidChange,
  index: indexProp,
  ...props
}, forwardedRef) {
  const {
    value: _value,
    defaultValue: _defaultValue,
    disabled: _disabled,
    readOnly: _readOnly,
    autoComplete: _autoComplete,
    autoFocus: _autoFocus,
    form: _form,
    name: _name,
    placeholder: _placeholder,
    type: _type,
    ...domProps
  } = props;
  const context = useOneTimePasswordFieldContext(
    "OneTimePasswordFieldInput",
    __scopeOneTimePasswordField
  );
  const { dispatch, userActionRef, validationType, isHydrated, disabled } = context;
  const collection = useCollection6(__scopeOneTimePasswordField);
  const rovingFocusGroupScope = useRovingFocusGroupScope3(__scopeOneTimePasswordField);
  const inputRef = React55.useRef(null);
  const [element, setElement] = React55.useState(null);
  const index4 = indexProp ?? (element ? collection.indexOf(element) : -1);
  const canSetPlaceholder = indexProp != null || isHydrated;
  let placeholder;
  if (canSetPlaceholder && context.placeholder && context.value.length === 0) {
    placeholder = context.placeholder[index4];
  }
  const composedInputRef = useComposedRefs(forwardedRef, inputRef, setElement);
  const char = context.value[index4] ?? "";
  const keyboardActionTimeoutRef = React55.useRef(null);
  React55.useEffect(() => {
    return () => {
      window.clearTimeout(keyboardActionTimeoutRef.current);
    };
  }, []);
  const totalValue = context.value.join("").trim();
  const lastSelectableIndex = clamp2(totalValue.length, [0, collection.size - 1]);
  const isFocusable = index4 <= lastSelectableIndex;
  const validation = validationType in INPUT_VALIDATION_MAP ? INPUT_VALIDATION_MAP[validationType] : void 0;
  return (0, import_jsx_runtime44.jsx)(Collection6.ItemSlot, { scope: __scopeOneTimePasswordField, children: (0, import_jsx_runtime44.jsx)(
    Item,
    {
      ...rovingFocusGroupScope,
      asChild: true,
      focusable: !context.disabled && isFocusable,
      active: index4 === lastSelectableIndex,
      children: ({ hasTabStop, isCurrentTabStop }) => {
        const supportsAutoComplete = hasTabStop ? isCurrentTabStop : index4 === 0;
        return (0, import_jsx_runtime44.jsx)(
          Root.input,
          {
            ref: composedInputRef,
            type: context.type,
            disabled,
            "aria-label": `Character ${index4 + 1} of ${collection.size}`,
            autoComplete: supportsAutoComplete ? context.autoComplete : "off",
            "data-1p-ignore": supportsAutoComplete ? void 0 : "true",
            "data-lpignore": supportsAutoComplete ? void 0 : "true",
            "data-protonpass-ignore": supportsAutoComplete ? void 0 : "true",
            "data-bwignore": supportsAutoComplete ? void 0 : "true",
            inputMode: validation == null ? void 0 : validation.inputMode,
            maxLength: 1,
            pattern: validation == null ? void 0 : validation.pattern,
            readOnly: context.readOnly,
            value: char,
            placeholder,
            "data-radix-otp-input": "",
            "data-radix-index": index4,
            ...domProps,
            onFocus: composeEventHandlers(props.onFocus, (event) => {
              event.currentTarget.select();
            }),
            onCut: composeEventHandlers(props.onCut, (event) => {
              const currentValue = event.currentTarget.value;
              if (currentValue !== "") {
                userActionRef.current = {
                  type: "cut"
                };
                keyboardActionTimeoutRef.current = window.setTimeout(() => {
                  userActionRef.current = null;
                }, 10);
              }
            }),
            onInput: composeEventHandlers(props.onInput, (event) => {
              const value = event.currentTarget.value;
              if (value.length > 1) {
                event.preventDefault();
                dispatch({ type: "PASTE", value });
              }
            }),
            onChange: composeEventHandlers(props.onChange, (event) => {
              const value = event.target.value;
              event.preventDefault();
              const action = userActionRef.current;
              userActionRef.current = null;
              if (action) {
                switch (action.type) {
                  case "cut":
                    dispatch({ type: "CLEAR_CHAR", index: index4, reason: "Cut" });
                    return;
                  case "keydown": {
                    if (action.key === "Char") {
                      return;
                    }
                    const isClearing = action.key === "Backspace" && (action.metaKey || action.ctrlKey);
                    if (action.key === "Clear" || isClearing) {
                      dispatch({ type: "CLEAR", reason: "Backspace" });
                    } else {
                      dispatch({ type: "CLEAR_CHAR", index: index4, reason: action.key });
                    }
                    return;
                  }
                  default:
                    return;
                }
              }
              if (event.target.validity.valid) {
                if (value === "") {
                  let reason = "Backspace";
                  if (isInputEvent(event.nativeEvent)) {
                    const inputType = event.nativeEvent.inputType;
                    if (inputType === "deleteContentBackward") {
                      reason = "Backspace";
                    } else if (inputType === "deleteByCut") {
                      reason = "Cut";
                    }
                  }
                  dispatch({ type: "CLEAR_CHAR", index: index4, reason });
                } else {
                  dispatch({ type: "SET_CHAR", char: value, index: index4, event });
                }
              } else {
                const element2 = event.target;
                onInvalidChange == null ? void 0 : onInvalidChange(element2.value);
                requestAnimationFrame(() => {
                  if (element2.ownerDocument.activeElement === element2) {
                    element2.select();
                  }
                });
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              var _a2, _b, _c;
              switch (event.key) {
                case "Clear":
                case "Delete":
                case "Backspace": {
                  const currentValue = event.currentTarget.value;
                  if (currentValue === "") {
                    if (event.key === "Delete") return;
                    const isClearing = event.key === "Clear" || event.metaKey || event.ctrlKey;
                    if (isClearing) {
                      dispatch({ type: "CLEAR", reason: "Backspace" });
                    } else {
                      const element2 = event.currentTarget;
                      requestAnimationFrame(() => {
                        var _a3;
                        focusInput((_a3 = collection.from(element2, -1)) == null ? void 0 : _a3.element);
                      });
                    }
                  } else {
                    userActionRef.current = {
                      type: "keydown",
                      key: event.key,
                      metaKey: event.metaKey,
                      ctrlKey: event.ctrlKey
                    };
                    keyboardActionTimeoutRef.current = window.setTimeout(() => {
                      userActionRef.current = null;
                    }, 10);
                  }
                  return;
                }
                case "Enter": {
                  event.preventDefault();
                  context.attemptSubmit();
                  return;
                }
                case "ArrowDown":
                case "ArrowUp": {
                  if (context.orientation === "horizontal") {
                    event.preventDefault();
                  }
                  return;
                }
                // TODO: Handle left/right arrow keys in vertical writing mode
                default: {
                  if (event.currentTarget.value === event.key) {
                    const element2 = event.currentTarget;
                    event.preventDefault();
                    focusInput((_a2 = collection.from(element2, 1)) == null ? void 0 : _a2.element);
                    return;
                  } else if (
                    // input already has a value, but...
                    event.currentTarget.value && // the value is not selected
                    !(event.currentTarget.selectionStart === 0 && event.currentTarget.selectionEnd != null && event.currentTarget.selectionEnd > 0)
                  ) {
                    const attemptedValue = event.key;
                    if (event.key.length > 1 || event.key === " ") {
                      return;
                    } else {
                      const nextInput = (_b = collection.from(event.currentTarget, 1)) == null ? void 0 : _b.element;
                      const lastInput = (_c = collection.at(-1)) == null ? void 0 : _c.element;
                      if (nextInput !== lastInput && event.currentTarget !== lastInput) {
                        if (event.currentTarget.selectionStart === 0) {
                          dispatch({ type: "SET_CHAR", char: attemptedValue, index: index4, event });
                        } else {
                          dispatch({
                            type: "SET_CHAR",
                            char: attemptedValue,
                            index: index4 + 1,
                            event
                          });
                        }
                        userActionRef.current = {
                          type: "keydown",
                          key: "Char",
                          metaKey: event.metaKey,
                          ctrlKey: event.ctrlKey
                        };
                        keyboardActionTimeoutRef.current = window.setTimeout(() => {
                          userActionRef.current = null;
                        }, 10);
                      }
                    }
                  }
                }
              }
            }),
            onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
              var _a2;
              event.preventDefault();
              const indexToFocus = Math.min(index4, lastSelectableIndex);
              const element2 = (_a2 = collection.at(indexToFocus)) == null ? void 0 : _a2.element;
              focusInput(element2);
            })
          }
        );
      }
    }
  ) });
});
function isFormElement(element) {
  return (element == null ? void 0 : element.tagName) === "FORM";
}
function removeWhitespace(value) {
  return value.replace(/\s/g, "");
}
function focusInput(element) {
  if (!element) return;
  if (element.ownerDocument.activeElement === element) {
    window.requestAnimationFrame(() => {
      var _a2;
      (_a2 = element.select) == null ? void 0 : _a2.call(element);
    });
  } else {
    element.focus();
  }
}
function isInputEvent(event) {
  return event.type === "input";
}

// ../../node_modules/.pnpm/@radix-ui+react-password-toggle-field@0.1.3_@types+react-dom@19.2.3_@types+react@19.2.1_f140fea76c74b024d58beaaf8d08d46c/node_modules/@radix-ui/react-password-toggle-field/dist/index.mjs
var React56 = __toESM(require_react(), 1);
var import_react_dom5 = __toESM(require_react_dom(), 1);
var import_jsx_runtime45 = __toESM(require_jsx_runtime(), 1);
var PASSWORD_TOGGLE_FIELD_NAME = "PasswordToggleField";
var [createPasswordToggleFieldContext] = createContextScope(PASSWORD_TOGGLE_FIELD_NAME);
var [PasswordToggleFieldProvider, usePasswordToggleFieldContext] = createPasswordToggleFieldContext(PASSWORD_TOGGLE_FIELD_NAME);
var INITIAL_FOCUS_STATE = {
  clickTriggered: false,
  selectionStart: null,
  selectionEnd: null
};
var PasswordToggleField = ({
  __scopePasswordToggleField,
  ...props
}) => {
  const baseId = useId2(props.id);
  const defaultInputId = `${baseId}-input`;
  const [inputIdState, setInputIdState] = React56.useState(defaultInputId);
  const inputId = inputIdState ?? defaultInputId;
  const syncInputId = React56.useCallback(
    (providedId) => setInputIdState(providedId != null ? String(providedId) : null),
    []
  );
  const { visible: visibleProp, defaultVisible, onVisiblityChange, children } = props;
  const [visible = false, setVisible] = useControllableState({
    caller: PASSWORD_TOGGLE_FIELD_NAME,
    prop: visibleProp,
    defaultProp: defaultVisible ?? false,
    onChange: onVisiblityChange
  });
  const inputRef = React56.useRef(null);
  const focusState = React56.useRef(INITIAL_FOCUS_STATE);
  return (0, import_jsx_runtime45.jsx)(
    PasswordToggleFieldProvider,
    {
      scope: __scopePasswordToggleField,
      inputId,
      inputRef,
      setVisible,
      syncInputId,
      visible,
      focusState,
      children
    }
  );
};
PasswordToggleField.displayName = PASSWORD_TOGGLE_FIELD_NAME;
var PASSWORD_TOGGLE_FIELD_INPUT_NAME = PASSWORD_TOGGLE_FIELD_NAME + "Input";
var PasswordToggleFieldInput = React56.forwardRef(
  ({
    __scopePasswordToggleField,
    autoComplete = "current-password",
    autoCapitalize = "off",
    spellCheck = false,
    id: idProp,
    ...props
  }, forwardedRef) => {
    const { visible, inputRef, inputId, syncInputId, setVisible, focusState } = usePasswordToggleFieldContext(PASSWORD_TOGGLE_FIELD_INPUT_NAME, __scopePasswordToggleField);
    React56.useEffect(() => {
      syncInputId(idProp);
    }, [idProp, syncInputId]);
    const _setVisible = useEffectEvent(setVisible);
    React56.useEffect(() => {
      const inputElement = inputRef.current;
      const form = inputElement == null ? void 0 : inputElement.form;
      if (!form) {
        return;
      }
      const controller = new AbortController();
      form.addEventListener(
        "reset",
        (event) => {
          if (!event.defaultPrevented) {
            _setVisible(false);
          }
        },
        { signal: controller.signal }
      );
      form.addEventListener(
        "submit",
        () => {
          _setVisible(false);
        },
        { signal: controller.signal }
      );
      return () => {
        controller.abort();
      };
    }, [inputRef, _setVisible]);
    return (0, import_jsx_runtime45.jsx)(
      Primitive3.input,
      {
        ...props,
        id: idProp ?? inputId,
        autoCapitalize,
        autoComplete,
        ref: useComposedRefs(forwardedRef, inputRef),
        spellCheck,
        type: visible ? "text" : "password",
        onBlur: composeEventHandlers(props.onBlur, (event) => {
          const { selectionStart, selectionEnd } = event.currentTarget;
          focusState.current.selectionStart = selectionStart;
          focusState.current.selectionEnd = selectionEnd;
        })
      }
    );
  }
);
PasswordToggleFieldInput.displayName = PASSWORD_TOGGLE_FIELD_INPUT_NAME;
var PASSWORD_TOGGLE_FIELD_TOGGLE_NAME = PASSWORD_TOGGLE_FIELD_NAME + "Toggle";
var PasswordToggleFieldToggle = React56.forwardRef(
  ({
    __scopePasswordToggleField,
    onClick,
    onPointerDown,
    onPointerCancel,
    onPointerUp,
    onFocus,
    children,
    "aria-label": ariaLabelProp,
    "aria-controls": ariaControls,
    "aria-hidden": ariaHidden,
    tabIndex,
    ...props
  }, forwardedRef) => {
    const { setVisible, visible, inputRef, inputId, focusState } = usePasswordToggleFieldContext(
      PASSWORD_TOGGLE_FIELD_TOGGLE_NAME,
      __scopePasswordToggleField
    );
    const [internalAriaLabel, setInternalAriaLabel] = React56.useState(void 0);
    const elementRef = React56.useRef(null);
    const ref = useComposedRefs(forwardedRef, elementRef);
    const isHydrated = useIsHydrated();
    React56.useEffect(() => {
      const element = elementRef.current;
      if (!element || ariaLabelProp) {
        setInternalAriaLabel(void 0);
        return;
      }
      const DEFAULT_ARIA_LABEL = visible ? "Hide password" : "Show password";
      function checkForInnerTextLabel(textContent) {
        const text = textContent ? textContent : void 0;
        setInternalAriaLabel(text ? void 0 : DEFAULT_ARIA_LABEL);
      }
      checkForInnerTextLabel(element.textContent);
      const observer = new MutationObserver((entries) => {
        let textContent;
        for (const entry of entries) {
          if (entry.type === "characterData") {
            if (element.textContent) {
              textContent = element.textContent;
            }
          }
        }
        checkForInnerTextLabel(textContent);
      });
      observer.observe(element, { characterData: true, subtree: true });
      return () => {
        observer.disconnect();
      };
    }, [visible, ariaLabelProp]);
    const ariaLabel = ariaLabelProp || internalAriaLabel;
    if (!isHydrated) {
      ariaHidden ?? (ariaHidden = true);
      tabIndex ?? (tabIndex = -1);
    } else {
      ariaControls ?? (ariaControls = inputId);
    }
    React56.useEffect(() => {
      var _a2, _b;
      let cleanup = () => {
      };
      const ownerWindow = ((_b = (_a2 = elementRef.current) == null ? void 0 : _a2.ownerDocument) == null ? void 0 : _b.defaultView) || window;
      const reset = () => focusState.current.clickTriggered = false;
      const handlePointerUp = () => cleanup = requestIdleCallback(ownerWindow, reset);
      ownerWindow.addEventListener("pointerup", handlePointerUp);
      return () => {
        cleanup();
        ownerWindow.removeEventListener("pointerup", handlePointerUp);
      };
    }, [focusState]);
    return (0, import_jsx_runtime45.jsx)(
      Primitive3.button,
      {
        "aria-controls": ariaControls,
        "aria-hidden": ariaHidden,
        "aria-label": ariaLabel,
        ref,
        id: inputId,
        ...props,
        onPointerDown: composeEventHandlers(onPointerDown, () => {
          focusState.current.clickTriggered = true;
        }),
        onPointerCancel: (event) => {
          onPointerCancel == null ? void 0 : onPointerCancel(event);
          focusState.current = INITIAL_FOCUS_STATE;
        },
        onClick: (event) => {
          onClick == null ? void 0 : onClick(event);
          if (event.defaultPrevented) {
            focusState.current = INITIAL_FOCUS_STATE;
            return;
          }
          (0, import_react_dom5.flushSync)(() => {
            setVisible((s) => !s);
          });
          if (focusState.current.clickTriggered) {
            const input = inputRef.current;
            if (input) {
              const { selectionStart, selectionEnd } = focusState.current;
              input.focus();
              if (selectionStart !== null || selectionEnd !== null) {
                requestAnimationFrame(() => {
                  if (input.ownerDocument.activeElement === input) {
                    input.selectionStart = selectionStart;
                    input.selectionEnd = selectionEnd;
                  }
                });
              }
            }
          }
          focusState.current = INITIAL_FOCUS_STATE;
        },
        onPointerUp: (event) => {
          onPointerUp == null ? void 0 : onPointerUp(event);
          setTimeout(() => {
            focusState.current = INITIAL_FOCUS_STATE;
          }, 50);
        },
        type: "button",
        children
      }
    );
  }
);
PasswordToggleFieldToggle.displayName = PASSWORD_TOGGLE_FIELD_TOGGLE_NAME;
var PASSWORD_TOGGLE_FIELD_SLOT_NAME = PASSWORD_TOGGLE_FIELD_NAME + "Slot";
var PasswordToggleFieldSlot = ({
  __scopePasswordToggleField,
  ...props
}) => {
  const { visible } = usePasswordToggleFieldContext(
    PASSWORD_TOGGLE_FIELD_SLOT_NAME,
    __scopePasswordToggleField
  );
  return "render" in props ? (
    //
    props.render({ visible })
  ) : visible ? props.visible : props.hidden;
};
PasswordToggleFieldSlot.displayName = PASSWORD_TOGGLE_FIELD_SLOT_NAME;
var PASSWORD_TOGGLE_FIELD_ICON_NAME = PASSWORD_TOGGLE_FIELD_NAME + "Icon";
var PasswordToggleFieldIcon = React56.forwardRef(
  ({
    __scopePasswordToggleField,
    // @ts-expect-error
    children,
    ...props
  }, forwardedRef) => {
    const { visible } = usePasswordToggleFieldContext(
      PASSWORD_TOGGLE_FIELD_ICON_NAME,
      __scopePasswordToggleField
    );
    const { visible: visibleIcon, hidden: hiddenIcon, ...domProps } = props;
    return (0, import_jsx_runtime45.jsx)(Primitive3.svg, { ...domProps, ref: forwardedRef, "aria-hidden": true, asChild: true, children: visible ? visibleIcon : hiddenIcon });
  }
);
PasswordToggleFieldIcon.displayName = PASSWORD_TOGGLE_FIELD_ICON_NAME;
function requestIdleCallback(window2, callback, options) {
  if (window2.requestIdleCallback) {
    const id2 = window2.requestIdleCallback(callback, options);
    return () => {
      window2.cancelIdleCallback(id2);
    };
  }
  const start = Date.now();
  const id = window2.setTimeout(() => {
    const timeRemaining = () => Math.max(0, 50 - (Date.now() - start));
    callback({ didTimeout: false, timeRemaining });
  }, 1);
  return () => {
    window2.clearTimeout(id);
  };
}

// ../../node_modules/.pnpm/@radix-ui+react-popover@1.1.15_@types+react-dom@19.2.3_@types+react@19.2.14__@types+rea_8b5332f8e883134e9d9ab2856fc4395d/node_modules/@radix-ui/react-popover/dist/index.mjs
var dist_exports11 = {};
__export(dist_exports11, {
  Anchor: () => Anchor22,
  Arrow: () => Arrow24,
  Close: () => Close2,
  Content: () => Content24,
  Popover: () => Popover,
  PopoverAnchor: () => PopoverAnchor,
  PopoverArrow: () => PopoverArrow,
  PopoverClose: () => PopoverClose,
  PopoverContent: () => PopoverContent,
  PopoverPortal: () => PopoverPortal,
  PopoverTrigger: () => PopoverTrigger,
  Portal: () => Portal4,
  Root: () => Root24,
  Trigger: () => Trigger4,
  createPopoverScope: () => createPopoverScope
});
var React57 = __toESM(require_react(), 1);
var import_jsx_runtime46 = __toESM(require_jsx_runtime(), 1);
var POPOVER_NAME = "Popover";
var [createPopoverContext, createPopoverScope] = createContextScope(POPOVER_NAME, [
  createPopperScope
]);
var usePopperScope3 = createPopperScope();
var [PopoverProvider, usePopoverContext] = createPopoverContext(POPOVER_NAME);
var Popover = (props) => {
  const {
    __scopePopover,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = false
  } = props;
  const popperScope = usePopperScope3(__scopePopover);
  const triggerRef = React57.useRef(null);
  const [hasCustomAnchor, setHasCustomAnchor] = React57.useState(false);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: POPOVER_NAME
  });
  return (0, import_jsx_runtime46.jsx)(Root22, { ...popperScope, children: (0, import_jsx_runtime46.jsx)(
    PopoverProvider,
    {
      scope: __scopePopover,
      contentId: useId2(),
      triggerRef,
      open,
      onOpenChange: setOpen,
      onOpenToggle: React57.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      hasCustomAnchor,
      onCustomAnchorAdd: React57.useCallback(() => setHasCustomAnchor(true), []),
      onCustomAnchorRemove: React57.useCallback(() => setHasCustomAnchor(false), []),
      modal,
      children
    }
  ) });
};
Popover.displayName = POPOVER_NAME;
var ANCHOR_NAME3 = "PopoverAnchor";
var PopoverAnchor = React57.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...anchorProps } = props;
    const context = usePopoverContext(ANCHOR_NAME3, __scopePopover);
    const popperScope = usePopperScope3(__scopePopover);
    const { onCustomAnchorAdd, onCustomAnchorRemove } = context;
    React57.useEffect(() => {
      onCustomAnchorAdd();
      return () => onCustomAnchorRemove();
    }, [onCustomAnchorAdd, onCustomAnchorRemove]);
    return (0, import_jsx_runtime46.jsx)(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
  }
);
PopoverAnchor.displayName = ANCHOR_NAME3;
var TRIGGER_NAME11 = "PopoverTrigger";
var PopoverTrigger = React57.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...triggerProps } = props;
    const context = usePopoverContext(TRIGGER_NAME11, __scopePopover);
    const popperScope = usePopperScope3(__scopePopover);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    const trigger = (0, import_jsx_runtime46.jsx)(
      Primitive3.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState5(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
    return context.hasCustomAnchor ? trigger : (0, import_jsx_runtime46.jsx)(Anchor, { asChild: true, ...popperScope, children: trigger });
  }
);
PopoverTrigger.displayName = TRIGGER_NAME11;
var PORTAL_NAME9 = "PopoverPortal";
var [PortalProvider4, usePortalContext4] = createPopoverContext(PORTAL_NAME9, {
  forceMount: void 0
});
var PopoverPortal = (props) => {
  const { __scopePopover, forceMount, children, container } = props;
  const context = usePopoverContext(PORTAL_NAME9, __scopePopover);
  return (0, import_jsx_runtime46.jsx)(PortalProvider4, { scope: __scopePopover, forceMount, children: (0, import_jsx_runtime46.jsx)(Presence, { present: forceMount || context.open, children: (0, import_jsx_runtime46.jsx)(Portal, { asChild: true, container, children }) }) });
};
PopoverPortal.displayName = PORTAL_NAME9;
var CONTENT_NAME12 = "PopoverContent";
var PopoverContent = React57.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext4(CONTENT_NAME12, props.__scopePopover);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = usePopoverContext(CONTENT_NAME12, props.__scopePopover);
    return (0, import_jsx_runtime46.jsx)(Presence, { present: forceMount || context.open, children: context.modal ? (0, import_jsx_runtime46.jsx)(PopoverContentModal, { ...contentProps, ref: forwardedRef }) : (0, import_jsx_runtime46.jsx)(PopoverContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
PopoverContent.displayName = CONTENT_NAME12;
var Slot5 = createSlot2("PopoverContent.RemoveScroll");
var PopoverContentModal = React57.forwardRef(
  (props, forwardedRef) => {
    const context = usePopoverContext(CONTENT_NAME12, props.__scopePopover);
    const contentRef = React57.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const isRightClickOutsideRef = React57.useRef(false);
    React57.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return (0, import_jsx_runtime46.jsx)(Combination_default, { as: Slot5, allowPinchZoom: true, children: (0, import_jsx_runtime46.jsx)(
      PopoverContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          var _a2;
          event.preventDefault();
          if (!isRightClickOutsideRef.current) (_a2 = context.triggerRef.current) == null ? void 0 : _a2.focus();
        }),
        onPointerDownOutside: composeEventHandlers(
          props.onPointerDownOutside,
          (event) => {
            const originalEvent = event.detail.originalEvent;
            const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
            isRightClickOutsideRef.current = isRightClick;
          },
          { checkForDefaultPrevented: false }
        ),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault(),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
var PopoverContentNonModal = React57.forwardRef(
  (props, forwardedRef) => {
    const context = usePopoverContext(CONTENT_NAME12, props.__scopePopover);
    const hasInteractedOutsideRef = React57.useRef(false);
    const hasPointerDownOutsideRef = React57.useRef(false);
    return (0, import_jsx_runtime46.jsx)(
      PopoverContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          var _a2, _b;
          (_a2 = props.onCloseAutoFocus) == null ? void 0 : _a2.call(props, event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) (_b = context.triggerRef.current) == null ? void 0 : _b.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          var _a2, _b;
          (_a2 = props.onInteractOutside) == null ? void 0 : _a2.call(props, event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = (_b = context.triggerRef.current) == null ? void 0 : _b.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var PopoverContentImpl = React57.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopePopover,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      ...contentProps
    } = props;
    const context = usePopoverContext(CONTENT_NAME12, __scopePopover);
    const popperScope = usePopperScope3(__scopePopover);
    useFocusGuards();
    return (0, import_jsx_runtime46.jsx)(
      FocusScope,
      {
        asChild: true,
        loop: true,
        trapped: trapFocus,
        onMountAutoFocus: onOpenAutoFocus,
        onUnmountAutoFocus: onCloseAutoFocus,
        children: (0, import_jsx_runtime46.jsx)(
          DismissableLayer,
          {
            asChild: true,
            disableOutsidePointerEvents,
            onInteractOutside,
            onEscapeKeyDown,
            onPointerDownOutside,
            onFocusOutside,
            onDismiss: () => context.onOpenChange(false),
            children: (0, import_jsx_runtime46.jsx)(
              Content3,
              {
                "data-state": getState5(context.open),
                role: "dialog",
                id: context.contentId,
                ...popperScope,
                ...contentProps,
                ref: forwardedRef,
                style: {
                  ...contentProps.style,
                  // re-namespace exposed content custom properties
                  ...{
                    "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                    "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                    "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                    "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                    "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                  }
                }
              }
            )
          }
        )
      }
    );
  }
);
var CLOSE_NAME2 = "PopoverClose";
var PopoverClose = React57.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...closeProps } = props;
    const context = usePopoverContext(CLOSE_NAME2, __scopePopover);
    return (0, import_jsx_runtime46.jsx)(
      Primitive3.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
PopoverClose.displayName = CLOSE_NAME2;
var ARROW_NAME7 = "PopoverArrow";
var PopoverArrow = React57.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...arrowProps } = props;
    const popperScope = usePopperScope3(__scopePopover);
    return (0, import_jsx_runtime46.jsx)(Arrow2, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
PopoverArrow.displayName = ARROW_NAME7;
function getState5(open) {
  return open ? "open" : "closed";
}
var Root24 = Popover;
var Anchor22 = PopoverAnchor;
var Trigger4 = PopoverTrigger;
var Portal4 = PopoverPortal;
var Content24 = PopoverContent;
var Close2 = PopoverClose;
var Arrow24 = PopoverArrow;

// ../../node_modules/.pnpm/@radix-ui+react-progress@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types+rea_d26b5d8ff64e53a10c8029fddad30be5/node_modules/@radix-ui/react-progress/dist/index.mjs
var React58 = __toESM(require_react(), 1);
var import_jsx_runtime47 = __toESM(require_jsx_runtime(), 1);
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext, createProgressScope] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress = React58.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max2 = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max2)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max2) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max2) : void 0;
    return (0, import_jsx_runtime47.jsx)(ProgressProvider, { scope: __scopeProgress, value, max: max2, children: (0, import_jsx_runtime47.jsx)(
      Primitive3.div,
      {
        "aria-valuemax": max2,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max2),
        "data-value": value ?? void 0,
        "data-max": max2,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress.displayName = PROGRESS_NAME;
var INDICATOR_NAME6 = "ProgressIndicator";
var ProgressIndicator = React58.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME6, __scopeProgress);
    return (0, import_jsx_runtime47.jsx)(
      Primitive3.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME6;
function defaultGetValueLabel(value, max2) {
  return `${Math.round(value / max2 * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max2) {
  return isNumber(max2) && !isNaN(max2) && max2 > 0;
}
function isValidValueNumber(value, max2) {
  return isNumber(value) && !isNaN(value) && value <= max2 && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}

// ../../node_modules/.pnpm/@radix-ui+react-radio-group@1.3.8_@types+react-dom@19.2.3_@types+react@19.2.14__@types+_cc2a70da647cefa06e7f90fd9b481f08/node_modules/@radix-ui/react-radio-group/dist/index.mjs
var React210 = __toESM(require_react(), 1);
var React59 = __toESM(require_react(), 1);
var import_jsx_runtime48 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime49 = __toESM(require_jsx_runtime(), 1);
var RADIO_NAME = "Radio";
var [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);
var [RadioProvider, useRadioContext] = createRadioContext(RADIO_NAME);
var Radio = React59.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadio,
      name,
      checked = false,
      required,
      disabled,
      value = "on",
      onCheck,
      form,
      ...radioProps
    } = props;
    const [button, setButton] = React59.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = React59.useRef(false);
    const isFormControl2 = button ? form || !!button.closest("form") : true;
    return (0, import_jsx_runtime48.jsxs)(RadioProvider, { scope: __scopeRadio, checked, disabled, children: [
      (0, import_jsx_runtime48.jsx)(
        Primitive3.button,
        {
          type: "button",
          role: "radio",
          "aria-checked": checked,
          "data-state": getState6(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...radioProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            if (!checked) onCheck == null ? void 0 : onCheck();
            if (isFormControl2) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl2 && (0, import_jsx_runtime48.jsx)(
        RadioBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Radio.displayName = RADIO_NAME;
var INDICATOR_NAME7 = "RadioIndicator";
var RadioIndicator = React59.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadio, forceMount, ...indicatorProps } = props;
    const context = useRadioContext(INDICATOR_NAME7, __scopeRadio);
    return (0, import_jsx_runtime48.jsx)(Presence, { present: forceMount || context.checked, children: (0, import_jsx_runtime48.jsx)(
      Primitive3.span,
      {
        "data-state": getState6(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...indicatorProps,
        ref: forwardedRef
      }
    ) });
  }
);
RadioIndicator.displayName = INDICATOR_NAME7;
var BUBBLE_INPUT_NAME2 = "RadioBubbleInput";
var RadioBubbleInput = React59.forwardRef(
  ({
    __scopeRadio,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = React59.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    React59.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return (0, import_jsx_runtime48.jsx)(
      Primitive3.input,
      {
        type: "radio",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
RadioBubbleInput.displayName = BUBBLE_INPUT_NAME2;
function getState6(checked) {
  return checked ? "checked" : "unchecked";
}
var ARROW_KEYS2 = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var RADIO_GROUP_NAME5 = "RadioGroup";
var [createRadioGroupContext, createRadioGroupScope] = createContextScope(RADIO_GROUP_NAME5, [
  createRovingFocusGroupScope,
  createRadioScope
]);
var useRovingFocusGroupScope4 = createRovingFocusGroupScope();
var useRadioScope = createRadioScope();
var [RadioGroupProvider2, useRadioGroupContext2] = createRadioGroupContext(RADIO_GROUP_NAME5);
var RadioGroup3 = React210.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadioGroup,
      name,
      defaultValue,
      value: valueProp,
      required = false,
      disabled = false,
      orientation,
      dir,
      loop = true,
      onValueChange,
      ...groupProps
    } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope4(__scopeRadioGroup);
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? null,
      onChange: onValueChange,
      caller: RADIO_GROUP_NAME5
    });
    return (0, import_jsx_runtime49.jsx)(
      RadioGroupProvider2,
      {
        scope: __scopeRadioGroup,
        name,
        required,
        disabled,
        value,
        onValueChange: setValue,
        children: (0, import_jsx_runtime49.jsx)(
          Root7,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation,
            dir: direction,
            loop,
            children: (0, import_jsx_runtime49.jsx)(
              Primitive3.div,
              {
                role: "radiogroup",
                "aria-required": required,
                "aria-orientation": orientation,
                "data-disabled": disabled ? "" : void 0,
                dir: direction,
                ...groupProps,
                ref: forwardedRef
              }
            )
          }
        )
      }
    );
  }
);
RadioGroup3.displayName = RADIO_GROUP_NAME5;
var ITEM_NAME8 = "RadioGroupItem";
var RadioGroupItem = React210.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, disabled, ...itemProps } = props;
    const context = useRadioGroupContext2(ITEM_NAME8, __scopeRadioGroup);
    const isDisabled = context.disabled || disabled;
    const rovingFocusGroupScope = useRovingFocusGroupScope4(__scopeRadioGroup);
    const radioScope = useRadioScope(__scopeRadioGroup);
    const ref = React210.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const checked = context.value === itemProps.value;
    const isArrowKeyPressedRef = React210.useRef(false);
    React210.useEffect(() => {
      const handleKeyDown = (event) => {
        if (ARROW_KEYS2.includes(event.key)) {
          isArrowKeyPressedRef.current = true;
        }
      };
      const handleKeyUp = () => isArrowKeyPressedRef.current = false;
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
    }, []);
    return (0, import_jsx_runtime49.jsx)(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !isDisabled,
        active: checked,
        children: (0, import_jsx_runtime49.jsx)(
          Radio,
          {
            disabled: isDisabled,
            required: context.required,
            checked,
            ...radioScope,
            ...itemProps,
            name: context.name,
            ref: composedRefs,
            onCheck: () => context.onValueChange(itemProps.value),
            onKeyDown: composeEventHandlers((event) => {
              if (event.key === "Enter") event.preventDefault();
            }),
            onFocus: composeEventHandlers(itemProps.onFocus, () => {
              var _a2;
              if (isArrowKeyPressedRef.current) (_a2 = ref.current) == null ? void 0 : _a2.click();
            })
          }
        )
      }
    );
  }
);
RadioGroupItem.displayName = ITEM_NAME8;
var INDICATOR_NAME22 = "RadioGroupIndicator";
var RadioGroupIndicator = React210.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, ...indicatorProps } = props;
    const radioScope = useRadioScope(__scopeRadioGroup);
    return (0, import_jsx_runtime49.jsx)(RadioIndicator, { ...radioScope, ...indicatorProps, ref: forwardedRef });
  }
);
RadioGroupIndicator.displayName = INDICATOR_NAME22;

// ../../node_modules/.pnpm/@radix-ui+react-scroll-area@1.2.10_@types+react-dom@19.2.3_@types+react@19.2.14__@types_155614c2fe5222bb9b221068b09efefc/node_modules/@radix-ui/react-scroll-area/dist/index.mjs
var React211 = __toESM(require_react(), 1);
var React60 = __toESM(require_react(), 1);
var import_jsx_runtime50 = __toESM(require_jsx_runtime(), 1);
function useStateMachine2(initialState, machine) {
  return React60.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var SCROLL_AREA_NAME = "ScrollArea";
var [createScrollAreaContext, createScrollAreaScope] = createContextScope(SCROLL_AREA_NAME);
var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
var ScrollArea = React211.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeScrollArea,
      type = "hover",
      dir,
      scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = React211.useState(null);
    const [viewport, setViewport] = React211.useState(null);
    const [content, setContent] = React211.useState(null);
    const [scrollbarX, setScrollbarX] = React211.useState(null);
    const [scrollbarY, setScrollbarY] = React211.useState(null);
    const [cornerWidth, setCornerWidth] = React211.useState(0);
    const [cornerHeight, setCornerHeight] = React211.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = React211.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = React211.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
    const direction = useDirection(dir);
    return (0, import_jsx_runtime50.jsx)(
      ScrollAreaProvider,
      {
        scope: __scopeScrollArea,
        type,
        dir: direction,
        scrollHideDelay,
        scrollArea,
        viewport,
        onViewportChange: setViewport,
        content,
        onContentChange: setContent,
        scrollbarX,
        onScrollbarXChange: setScrollbarX,
        scrollbarXEnabled,
        onScrollbarXEnabledChange: setScrollbarXEnabled,
        scrollbarY,
        onScrollbarYChange: setScrollbarY,
        scrollbarYEnabled,
        onScrollbarYEnabledChange: setScrollbarYEnabled,
        onCornerWidthChange: setCornerWidth,
        onCornerHeightChange: setCornerHeight,
        children: (0, import_jsx_runtime50.jsx)(
          Primitive3.div,
          {
            dir: direction,
            ...scrollAreaProps,
            ref: composedRefs,
            style: {
              position: "relative",
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
              ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
              ...props.style
            }
          }
        )
      }
    );
  }
);
ScrollArea.displayName = SCROLL_AREA_NAME;
var VIEWPORT_NAME2 = "ScrollAreaViewport";
var ScrollAreaViewport = React211.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
    const context = useScrollAreaContext(VIEWPORT_NAME2, __scopeScrollArea);
    const ref = React211.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
    return (0, import_jsx_runtime50.jsxs)(import_jsx_runtime50.Fragment, { children: [
      (0, import_jsx_runtime50.jsx)(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      (0, import_jsx_runtime50.jsx)(
        Primitive3.div,
        {
          "data-radix-scroll-area-viewport": "",
          ...viewportProps,
          ref: composedRefs,
          style: {
            /**
             * We don't support `visible` because the intention is to have at least one scrollbar
             * if this component is used and `visible` will behave like `auto` in that case
             * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
             *
             * We don't handle `auto` because the intention is for the native implementation
             * to be hidden if using this component. We just want to ensure the node is scrollable
             * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
             * the browser from having to work out whether to render native scrollbars or not,
             * we tell it to with the intention of hiding them in CSS.
             */
            overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
            ...props.style
          },
          children: (0, import_jsx_runtime50.jsx)("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
        }
      )
    ] });
  }
);
ScrollAreaViewport.displayName = VIEWPORT_NAME2;
var SCROLLBAR_NAME = "ScrollAreaScrollbar";
var ScrollAreaScrollbar = React211.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
    const isHorizontal = props.orientation === "horizontal";
    React211.useEffect(() => {
      isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
    return context.type === "hover" ? (0, import_jsx_runtime50.jsx)(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? (0, import_jsx_runtime50.jsx)(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? (0, import_jsx_runtime50.jsx)(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? (0, import_jsx_runtime50.jsx)(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
  }
);
ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
var ScrollAreaScrollbarHover = React211.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [visible, setVisible] = React211.useState(false);
  React211.useEffect(() => {
    const scrollArea = context.scrollArea;
    let hideTimer = 0;
    if (scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
      };
      scrollArea.addEventListener("pointerenter", handlePointerEnter);
      scrollArea.addEventListener("pointerleave", handlePointerLeave);
      return () => {
        window.clearTimeout(hideTimer);
        scrollArea.removeEventListener("pointerenter", handlePointerEnter);
        scrollArea.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  }, [context.scrollArea, context.scrollHideDelay]);
  return (0, import_jsx_runtime50.jsx)(Presence, { present: forceMount || visible, children: (0, import_jsx_runtime50.jsx)(
    ScrollAreaScrollbarAuto,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarScroll = React211.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const isHorizontal = props.orientation === "horizontal";
  const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
  const [state, send] = useStateMachine2("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  React211.useEffect(() => {
    if (state === "idle") {
      const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
      return () => window.clearTimeout(hideTimer);
    }
  }, [state, context.scrollHideDelay, send]);
  React211.useEffect(() => {
    const viewport = context.viewport;
    const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
    if (viewport) {
      let prevScrollPos = viewport[scrollDirection];
      const handleScroll2 = () => {
        const scrollPos = viewport[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          send("SCROLL");
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      viewport.addEventListener("scroll", handleScroll2);
      return () => viewport.removeEventListener("scroll", handleScroll2);
    }
  }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
  return (0, import_jsx_runtime50.jsx)(Presence, { present: forceMount || state !== "hidden", children: (0, import_jsx_runtime50.jsx)(
    ScrollAreaScrollbarVisible,
    {
      "data-state": state === "hidden" ? "hidden" : "visible",
      ...scrollbarProps,
      ref: forwardedRef,
      onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
    }
  ) });
});
var ScrollAreaScrollbarAuto = React211.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const { forceMount, ...scrollbarProps } = props;
  const [visible, setVisible] = React211.useState(false);
  const isHorizontal = props.orientation === "horizontal";
  const handleResize = useDebounceCallback(() => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  }, 10);
  useResizeObserver2(context.viewport, handleResize);
  useResizeObserver2(context.content, handleResize);
  return (0, import_jsx_runtime50.jsx)(Presence, { present: forceMount || visible, children: (0, import_jsx_runtime50.jsx)(
    ScrollAreaScrollbarVisible,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarVisible = React211.forwardRef((props, forwardedRef) => {
  const { orientation = "vertical", ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const thumbRef = React211.useRef(null);
  const pointerOffsetRef = React211.useRef(0);
  const [sizes, setSizes] = React211.useState({
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
  });
  const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
  const commonProps = {
    ...scrollbarProps,
    sizes,
    onSizesChange: setSizes,
    hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
    onThumbChange: (thumb) => thumbRef.current = thumb,
    onThumbPointerUp: () => pointerOffsetRef.current = 0,
    onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
  };
  function getScrollPosition(pointerPos, dir) {
    return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
  }
  if (orientation === "horizontal") {
    return (0, import_jsx_runtime50.jsx)(
      ScrollAreaScrollbarX,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollLeft;
            const offset4 = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
            thumbRef.current.style.transform = `translate3d(${offset4}px, 0, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollLeft = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) {
            context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
          }
        }
      }
    );
  }
  if (orientation === "vertical") {
    return (0, import_jsx_runtime50.jsx)(
      ScrollAreaScrollbarY,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollTop;
            const offset4 = getThumbOffsetFromScroll(scrollPos, sizes);
            thumbRef.current.style.transform = `translate3d(0, ${offset4}px, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollTop = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
        }
      }
    );
  }
  return null;
});
var ScrollAreaScrollbarX = React211.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = React211.useState();
  const ref = React211.useRef(null);
  const composeRefs2 = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
  React211.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return (0, import_jsx_runtime50.jsx)(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "horizontal",
      ...scrollbarProps,
      ref: composeRefs2,
      sizes,
      style: {
        bottom: 0,
        left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
        right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
        ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollWidth,
            viewport: context.viewport.offsetWidth,
            scrollbar: {
              size: ref.current.clientWidth,
              paddingStart: toInt(computedStyle.paddingLeft),
              paddingEnd: toInt(computedStyle.paddingRight)
            }
          });
        }
      }
    }
  );
});
var ScrollAreaScrollbarY = React211.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = React211.useState();
  const ref = React211.useRef(null);
  const composeRefs2 = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
  React211.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return (0, import_jsx_runtime50.jsx)(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "vertical",
      ...scrollbarProps,
      ref: composeRefs2,
      sizes,
      style: {
        top: 0,
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: "var(--radix-scroll-area-corner-height)",
        ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollHeight,
            viewport: context.viewport.offsetHeight,
            scrollbar: {
              size: ref.current.clientHeight,
              paddingStart: toInt(computedStyle.paddingTop),
              paddingEnd: toInt(computedStyle.paddingBottom)
            }
          });
        }
      }
    }
  );
});
var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
var ScrollAreaScrollbarImpl = React211.forwardRef((props, forwardedRef) => {
  const {
    __scopeScrollArea,
    sizes,
    hasThumb,
    onThumbChange,
    onThumbPointerUp,
    onThumbPointerDown,
    onThumbPositionChange,
    onDragScroll,
    onWheelScroll,
    onResize,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
  const [scrollbar, setScrollbar] = React211.useState(null);
  const composeRefs2 = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
  const rectRef = React211.useRef(null);
  const prevWebkitUserSelectRef = React211.useRef("");
  const viewport = context.viewport;
  const maxScrollPos = sizes.content - sizes.viewport;
  const handleWheelScroll = useCallbackRef(onWheelScroll);
  const handleThumbPositionChange = useCallbackRef(onThumbPositionChange);
  const handleResize = useDebounceCallback(onResize, 10);
  function handleDragScroll(event) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({ x, y });
    }
  }
  React211.useEffect(() => {
    const handleWheel = (event) => {
      const element = event.target;
      const isScrollbarWheel = scrollbar == null ? void 0 : scrollbar.contains(element);
      if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel, { passive: false });
  }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
  React211.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
  useResizeObserver2(scrollbar, handleResize);
  useResizeObserver2(context.content, handleResize);
  return (0, import_jsx_runtime50.jsx)(
    ScrollbarProvider,
    {
      scope: __scopeScrollArea,
      scrollbar,
      hasThumb,
      onThumbChange: useCallbackRef(onThumbChange),
      onThumbPointerUp: useCallbackRef(onThumbPointerUp),
      onThumbPositionChange: handleThumbPositionChange,
      onThumbPointerDown: useCallbackRef(onThumbPointerDown),
      children: (0, import_jsx_runtime50.jsx)(
        Primitive3.div,
        {
          ...scrollbarProps,
          ref: composeRefs2,
          style: { position: "absolute", ...scrollbarProps.style },
          onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
            const mainPointer = 0;
            if (event.button === mainPointer) {
              const element = event.target;
              element.setPointerCapture(event.pointerId);
              rectRef.current = scrollbar.getBoundingClientRect();
              prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
              document.body.style.webkitUserSelect = "none";
              if (context.viewport) context.viewport.style.scrollBehavior = "auto";
              handleDragScroll(event);
            }
          }),
          onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
          onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
            const element = event.target;
            if (element.hasPointerCapture(event.pointerId)) {
              element.releasePointerCapture(event.pointerId);
            }
            document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
            if (context.viewport) context.viewport.style.scrollBehavior = "";
            rectRef.current = null;
          })
        }
      )
    }
  );
});
var THUMB_NAME = "ScrollAreaThumb";
var ScrollAreaThumb = React211.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...thumbProps } = props;
    const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
    return (0, import_jsx_runtime50.jsx)(Presence, { present: forceMount || scrollbarContext.hasThumb, children: (0, import_jsx_runtime50.jsx)(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
  }
);
var ScrollAreaThumbImpl = React211.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, style, ...thumbProps } = props;
    const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
    const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
    const { onThumbPositionChange } = scrollbarContext;
    const composedRef = useComposedRefs(
      forwardedRef,
      (node) => scrollbarContext.onThumbChange(node)
    );
    const removeUnlinkedScrollListenerRef = React211.useRef(void 0);
    const debounceScrollEnd = useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = void 0;
      }
    }, 100);
    React211.useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        const handleScroll2 = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener("scroll", handleScroll2);
        return () => viewport.removeEventListener("scroll", handleScroll2);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return (0, import_jsx_runtime50.jsx)(
      Primitive3.div,
      {
        "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
        ...thumbProps,
        ref: composedRef,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...style
        },
        onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
          const thumb = event.target;
          const thumbRect = thumb.getBoundingClientRect();
          const x = event.clientX - thumbRect.left;
          const y = event.clientY - thumbRect.top;
          scrollbarContext.onThumbPointerDown({ x, y });
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
      }
    );
  }
);
ScrollAreaThumb.displayName = THUMB_NAME;
var CORNER_NAME = "ScrollAreaCorner";
var ScrollAreaCorner = React211.forwardRef(
  (props, forwardedRef) => {
    const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
    const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
    const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
    return hasCorner ? (0, import_jsx_runtime50.jsx)(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
  }
);
ScrollAreaCorner.displayName = CORNER_NAME;
var ScrollAreaCornerImpl = React211.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, ...cornerProps } = props;
  const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
  const [width, setWidth] = React211.useState(0);
  const [height, setHeight] = React211.useState(0);
  const hasSize = Boolean(width && height);
  useResizeObserver2(context.scrollbarX, () => {
    var _a2;
    const height2 = ((_a2 = context.scrollbarX) == null ? void 0 : _a2.offsetHeight) || 0;
    context.onCornerHeightChange(height2);
    setHeight(height2);
  });
  useResizeObserver2(context.scrollbarY, () => {
    var _a2;
    const width2 = ((_a2 = context.scrollbarY) == null ? void 0 : _a2.offsetWidth) || 0;
    context.onCornerWidthChange(width2);
    setWidth(width2);
  });
  return hasSize ? (0, import_jsx_runtime50.jsx)(
    Primitive3.div,
    {
      ...cornerProps,
      ref: forwardedRef,
      style: {
        width,
        height,
        position: "absolute",
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: 0,
        ...props.style
      }
    }
  ) : null;
});
function toInt(value) {
  return value ? parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset4 = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset4;
  const minPointerPos = sizes.scrollbar.paddingStart + offset4;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
  return interpolate(pointerPos);
}
function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp2(scrollPos, scrollClampRange);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
var addUnlinkedScrollListener = (node, handler = () => {
}) => {
  let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
  let rAF = 0;
  (function loop() {
    const position = { left: node.scrollLeft, top: node.scrollTop };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll) handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};
function useDebounceCallback(callback, delay) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = React211.useRef(0);
  React211.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  return React211.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}
function useResizeObserver2(element, onResize) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect2(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}

// ../../node_modules/.pnpm/@radix-ui+react-select@2.2.6_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react_53894a32562cb9eeb6aef8b357a4f4e3/node_modules/@radix-ui/react-select/dist/index.mjs
var React61 = __toESM(require_react(), 1);
var ReactDOM6 = __toESM(require_react_dom(), 1);
var import_jsx_runtime51 = __toESM(require_jsx_runtime(), 1);
var OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];
var SELECTION_KEYS2 = [" ", "Enter"];
var SELECT_NAME = "Select";
var [Collection7, useCollection7, createCollectionScope7] = createCollection(SELECT_NAME);
var [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [
  createCollectionScope7,
  createPopperScope
]);
var usePopperScope4 = createPopperScope();
var [SelectProvider, useSelectContext] = createSelectContext(SELECT_NAME);
var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
var Select = (props) => {
  const {
    __scopeSelect,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    dir,
    name,
    autoComplete,
    disabled,
    required,
    form
  } = props;
  const popperScope = usePopperScope4(__scopeSelect);
  const [trigger, setTrigger] = React61.useState(null);
  const [valueNode, setValueNode] = React61.useState(null);
  const [valueNodeHasChildren, setValueNodeHasChildren] = React61.useState(false);
  const direction = useDirection(dir);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SELECT_NAME
  });
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: SELECT_NAME
  });
  const triggerPointerDownPosRef = React61.useRef(null);
  const isFormControl2 = trigger ? form || !!trigger.closest("form") : true;
  const [nativeOptionsSet, setNativeOptionsSet] = React61.useState(/* @__PURE__ */ new Set());
  const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
  return (0, import_jsx_runtime51.jsx)(Root22, { ...popperScope, children: (0, import_jsx_runtime51.jsxs)(
    SelectProvider,
    {
      required,
      scope: __scopeSelect,
      trigger,
      onTriggerChange: setTrigger,
      valueNode,
      onValueNodeChange: setValueNode,
      valueNodeHasChildren,
      onValueNodeHasChildrenChange: setValueNodeHasChildren,
      contentId: useId2(),
      value,
      onValueChange: setValue,
      open,
      onOpenChange: setOpen,
      dir: direction,
      triggerPointerDownPosRef,
      disabled,
      children: [
        (0, import_jsx_runtime51.jsx)(Collection7.Provider, { scope: __scopeSelect, children: (0, import_jsx_runtime51.jsx)(
          SelectNativeOptionsProvider,
          {
            scope: props.__scopeSelect,
            onNativeOptionAdd: React61.useCallback((option) => {
              setNativeOptionsSet((prev) => new Set(prev).add(option));
            }, []),
            onNativeOptionRemove: React61.useCallback((option) => {
              setNativeOptionsSet((prev) => {
                const optionsSet = new Set(prev);
                optionsSet.delete(option);
                return optionsSet;
              });
            }, []),
            children
          }
        ) }),
        isFormControl2 ? (0, import_jsx_runtime51.jsxs)(
          SelectBubbleInput,
          {
            "aria-hidden": true,
            required,
            tabIndex: -1,
            name,
            autoComplete,
            value,
            onChange: (event) => setValue(event.target.value),
            disabled,
            form,
            children: [
              value === void 0 ? (0, import_jsx_runtime51.jsx)("option", { value: "" }) : null,
              Array.from(nativeOptionsSet)
            ]
          },
          nativeSelectKey
        ) : null
      ]
    }
  ) });
};
Select.displayName = SELECT_NAME;
var TRIGGER_NAME12 = "SelectTrigger";
var SelectTrigger = React61.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, disabled = false, ...triggerProps } = props;
    const popperScope = usePopperScope4(__scopeSelect);
    const context = useSelectContext(TRIGGER_NAME12, __scopeSelect);
    const isDisabled = context.disabled || disabled;
    const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
    const getItems = useCollection7(__scopeSelect);
    const pointerTypeRef = React61.useRef("touch");
    const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.value === context.value);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem !== void 0) {
        context.onValueChange(nextItem.value);
      }
    });
    const handleOpen = (pointerEvent) => {
      if (!isDisabled) {
        context.onOpenChange(true);
        resetTypeahead();
      }
      if (pointerEvent) {
        context.triggerPointerDownPosRef.current = {
          x: Math.round(pointerEvent.pageX),
          y: Math.round(pointerEvent.pageY)
        };
      }
    };
    return (0, import_jsx_runtime51.jsx)(Anchor, { asChild: true, ...popperScope, children: (0, import_jsx_runtime51.jsx)(
      Primitive3.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": context.contentId,
        "aria-expanded": context.open,
        "aria-required": context.required,
        "aria-autocomplete": "none",
        dir: context.dir,
        "data-state": context.open ? "open" : "closed",
        disabled: isDisabled,
        "data-disabled": isDisabled ? "" : void 0,
        "data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
        ...triggerProps,
        ref: composedRefs,
        onClick: composeEventHandlers(triggerProps.onClick, (event) => {
          event.currentTarget.focus();
          if (pointerTypeRef.current !== "mouse") {
            handleOpen(event);
          }
        }),
        onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
          pointerTypeRef.current = event.pointerType;
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
          }
          if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
            handleOpen(event);
            event.preventDefault();
          }
        }),
        onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
          const isTypingAhead = searchRef.current !== "";
          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
          if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
          if (isTypingAhead && event.key === " ") return;
          if (OPEN_KEYS.includes(event.key)) {
            handleOpen();
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
SelectTrigger.displayName = TRIGGER_NAME12;
var VALUE_NAME = "SelectValue";
var SelectValue = React61.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
    const context = useSelectContext(VALUE_NAME, __scopeSelect);
    const { onValueNodeHasChildrenChange } = context;
    const hasChildren = children !== void 0;
    const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
    useLayoutEffect2(() => {
      onValueNodeHasChildrenChange(hasChildren);
    }, [onValueNodeHasChildrenChange, hasChildren]);
    return (0, import_jsx_runtime51.jsx)(
      Primitive3.span,
      {
        ...valueProps,
        ref: composedRefs,
        style: { pointerEvents: "none" },
        children: shouldShowPlaceholder(context.value) ? (0, import_jsx_runtime51.jsx)(import_jsx_runtime51.Fragment, { children: placeholder }) : children
      }
    );
  }
);
SelectValue.displayName = VALUE_NAME;
var ICON_NAME = "SelectIcon";
var SelectIcon = React61.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, children, ...iconProps } = props;
    return (0, import_jsx_runtime51.jsx)(Primitive3.span, { "aria-hidden": true, ...iconProps, ref: forwardedRef, children: children || "▼" });
  }
);
SelectIcon.displayName = ICON_NAME;
var PORTAL_NAME10 = "SelectPortal";
var SelectPortal = (props) => {
  return (0, import_jsx_runtime51.jsx)(Portal, { asChild: true, ...props });
};
SelectPortal.displayName = PORTAL_NAME10;
var CONTENT_NAME13 = "SelectContent";
var SelectContent = React61.forwardRef(
  (props, forwardedRef) => {
    const context = useSelectContext(CONTENT_NAME13, props.__scopeSelect);
    const [fragment, setFragment] = React61.useState();
    useLayoutEffect2(() => {
      setFragment(new DocumentFragment());
    }, []);
    if (!context.open) {
      const frag = fragment;
      return frag ? ReactDOM6.createPortal(
        (0, import_jsx_runtime51.jsx)(SelectContentProvider, { scope: props.__scopeSelect, children: (0, import_jsx_runtime51.jsx)(Collection7.Slot, { scope: props.__scopeSelect, children: (0, import_jsx_runtime51.jsx)("div", { children: props.children }) }) }),
        frag
      ) : null;
    }
    return (0, import_jsx_runtime51.jsx)(SelectContentImpl, { ...props, ref: forwardedRef });
  }
);
SelectContent.displayName = CONTENT_NAME13;
var CONTENT_MARGIN = 10;
var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME13);
var CONTENT_IMPL_NAME = "SelectContentImpl";
var Slot6 = createSlot2("SelectContent.RemoveScroll");
var SelectContentImpl = React61.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      position = "item-aligned",
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      //
      // PopperContent props
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions,
      //
      ...contentProps
    } = props;
    const context = useSelectContext(CONTENT_NAME13, __scopeSelect);
    const [content, setContent] = React61.useState(null);
    const [viewport, setViewport] = React61.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [selectedItem, setSelectedItem] = React61.useState(null);
    const [selectedItemText, setSelectedItemText] = React61.useState(
      null
    );
    const getItems = useCollection7(__scopeSelect);
    const [isPositioned, setIsPositioned] = React61.useState(false);
    const firstValidItemFoundRef = React61.useRef(false);
    React61.useEffect(() => {
      if (content) return hideOthers(content);
    }, [content]);
    useFocusGuards();
    const focusFirst6 = React61.useCallback(
      (candidates) => {
        const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
        const [lastItem] = restItems.slice(-1);
        const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
        for (const candidate of candidates) {
          if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
          candidate == null ? void 0 : candidate.scrollIntoView({ block: "nearest" });
          if (candidate === firstItem && viewport) viewport.scrollTop = 0;
          if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
          candidate == null ? void 0 : candidate.focus();
          if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
        }
      },
      [getItems, viewport]
    );
    const focusSelectedItem = React61.useCallback(
      () => focusFirst6([selectedItem, content]),
      [focusFirst6, selectedItem, content]
    );
    React61.useEffect(() => {
      if (isPositioned) {
        focusSelectedItem();
      }
    }, [isPositioned, focusSelectedItem]);
    const { onOpenChange, triggerPointerDownPosRef } = context;
    React61.useEffect(() => {
      if (content) {
        let pointerMoveDelta = { x: 0, y: 0 };
        const handlePointerMove = (event) => {
          var _a2, _b;
          pointerMoveDelta = {
            x: Math.abs(Math.round(event.pageX) - (((_a2 = triggerPointerDownPosRef.current) == null ? void 0 : _a2.x) ?? 0)),
            y: Math.abs(Math.round(event.pageY) - (((_b = triggerPointerDownPosRef.current) == null ? void 0 : _b.y) ?? 0))
          };
        };
        const handlePointerUp = (event) => {
          if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
            event.preventDefault();
          } else {
            if (!content.contains(event.target)) {
              onOpenChange(false);
            }
          }
          document.removeEventListener("pointermove", handlePointerMove);
          triggerPointerDownPosRef.current = null;
        };
        if (triggerPointerDownPosRef.current !== null) {
          document.addEventListener("pointermove", handlePointerMove);
          document.addEventListener("pointerup", handlePointerUp, { capture: true, once: true });
        }
        return () => {
          document.removeEventListener("pointermove", handlePointerMove);
          document.removeEventListener("pointerup", handlePointerUp, { capture: true });
        };
      }
    }, [content, onOpenChange, triggerPointerDownPosRef]);
    React61.useEffect(() => {
      const close = () => onOpenChange(false);
      window.addEventListener("blur", close);
      window.addEventListener("resize", close);
      return () => {
        window.removeEventListener("blur", close);
        window.removeEventListener("resize", close);
      };
    }, [onOpenChange]);
    const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.ref.current === document.activeElement);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem) {
        setTimeout(() => nextItem.ref.current.focus());
      }
    });
    const itemRefCallback = React61.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItem(node);
          if (isFirstValidItem) firstValidItemFoundRef.current = true;
        }
      },
      [context.value]
    );
    const handleItemLeave = React61.useCallback(() => content == null ? void 0 : content.focus(), [content]);
    const itemTextRefCallback = React61.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItemText(node);
        }
      },
      [context.value]
    );
    const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
    const popperContentProps = SelectPosition === SelectPopperPosition ? {
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions
    } : {};
    return (0, import_jsx_runtime51.jsx)(
      SelectContentProvider,
      {
        scope: __scopeSelect,
        content,
        viewport,
        onViewportChange: setViewport,
        itemRefCallback,
        selectedItem,
        onItemLeave: handleItemLeave,
        itemTextRefCallback,
        focusSelectedItem,
        selectedItemText,
        position,
        isPositioned,
        searchRef,
        children: (0, import_jsx_runtime51.jsx)(Combination_default, { as: Slot6, allowPinchZoom: true, children: (0, import_jsx_runtime51.jsx)(
          FocusScope,
          {
            asChild: true,
            trapped: context.open,
            onMountAutoFocus: (event) => {
              event.preventDefault();
            },
            onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
              var _a2;
              (_a2 = context.trigger) == null ? void 0 : _a2.focus({ preventScroll: true });
              event.preventDefault();
            }),
            children: (0, import_jsx_runtime51.jsx)(
              DismissableLayer,
              {
                asChild: true,
                disableOutsidePointerEvents: true,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside: (event) => event.preventDefault(),
                onDismiss: () => context.onOpenChange(false),
                children: (0, import_jsx_runtime51.jsx)(
                  SelectPosition,
                  {
                    role: "listbox",
                    id: context.contentId,
                    "data-state": context.open ? "open" : "closed",
                    dir: context.dir,
                    onContextMenu: (event) => event.preventDefault(),
                    ...contentProps,
                    ...popperContentProps,
                    onPlaced: () => setIsPositioned(true),
                    ref: composedRefs,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...contentProps.style
                    },
                    onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                      if (event.key === "Tab") event.preventDefault();
                      if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
                      if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
                        const items = getItems().filter((item) => !item.disabled);
                        let candidateNodes = items.map((item) => item.ref.current);
                        if (["ArrowUp", "End"].includes(event.key)) {
                          candidateNodes = candidateNodes.slice().reverse();
                        }
                        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
                          const currentElement = event.target;
                          const currentIndex = candidateNodes.indexOf(currentElement);
                          candidateNodes = candidateNodes.slice(currentIndex + 1);
                        }
                        setTimeout(() => focusFirst6(candidateNodes));
                        event.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
SelectContentImpl.displayName = CONTENT_IMPL_NAME;
var ITEM_ALIGNED_POSITION_NAME = "SelectItemAlignedPosition";
var SelectItemAlignedPosition = React61.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onPlaced, ...popperProps } = props;
  const context = useSelectContext(CONTENT_NAME13, __scopeSelect);
  const contentContext = useSelectContentContext(CONTENT_NAME13, __scopeSelect);
  const [contentWrapper, setContentWrapper] = React61.useState(null);
  const [content, setContent] = React61.useState(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
  const getItems = useCollection7(__scopeSelect);
  const shouldExpandOnScrollRef = React61.useRef(false);
  const shouldRepositionRef = React61.useRef(true);
  const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
  const position = React61.useCallback(() => {
    if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
      const triggerRect = context.trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const valueNodeRect = context.valueNode.getBoundingClientRect();
      const itemTextRect = selectedItemText.getBoundingClientRect();
      if (context.dir !== "rtl") {
        const itemTextOffset = itemTextRect.left - contentRect.left;
        const left = valueNodeRect.left - itemTextOffset;
        const leftDelta = triggerRect.left - left;
        const minContentWidth = triggerRect.width + leftDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const rightEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedLeft = clamp2(left, [
          CONTENT_MARGIN,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(CONTENT_MARGIN, rightEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.left = clampedLeft + "px";
      } else {
        const itemTextOffset = contentRect.right - itemTextRect.right;
        const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
        const rightDelta = window.innerWidth - triggerRect.right - right;
        const minContentWidth = triggerRect.width + rightDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const leftEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedRight = clamp2(right, [
          CONTENT_MARGIN,
          Math.max(CONTENT_MARGIN, leftEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.right = clampedRight + "px";
      }
      const items = getItems();
      const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
      const itemsHeight = viewport.scrollHeight;
      const contentStyles = window.getComputedStyle(content);
      const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
      const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
      const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
      const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
      const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
      const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
      const viewportStyles = window.getComputedStyle(viewport);
      const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
      const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
      const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
      const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
      const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
      const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
      const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
      const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
      const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;
      if (willAlignWithoutTopOverflow) {
        const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
        contentWrapper.style.bottom = "0px";
        const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
        const clampedTriggerMiddleToBottomEdge = Math.max(
          triggerMiddleToBottomEdge,
          selectedItemHalfHeight + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth
        );
        const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
        contentWrapper.style.height = height + "px";
      } else {
        const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
        contentWrapper.style.top = "0px";
        const clampedTopEdgeToTriggerMiddle = Math.max(
          topEdgeToTriggerMiddle,
          contentBorderTopWidth + viewport.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight
        );
        const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
        contentWrapper.style.height = height + "px";
        viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
      }
      contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
      contentWrapper.style.minHeight = minContentHeight + "px";
      contentWrapper.style.maxHeight = availableHeight + "px";
      onPlaced == null ? void 0 : onPlaced();
      requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
    }
  }, [
    getItems,
    context.trigger,
    context.valueNode,
    contentWrapper,
    content,
    viewport,
    selectedItem,
    selectedItemText,
    context.dir,
    onPlaced
  ]);
  useLayoutEffect2(() => position(), [position]);
  const [contentZIndex, setContentZIndex] = React61.useState();
  useLayoutEffect2(() => {
    if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
  }, [content]);
  const handleScrollButtonChange = React61.useCallback(
    (node) => {
      if (node && shouldRepositionRef.current === true) {
        position();
        focusSelectedItem == null ? void 0 : focusSelectedItem();
        shouldRepositionRef.current = false;
      }
    },
    [position, focusSelectedItem]
  );
  return (0, import_jsx_runtime51.jsx)(
    SelectViewportProvider,
    {
      scope: __scopeSelect,
      contentWrapper,
      shouldExpandOnScrollRef,
      onScrollButtonChange: handleScrollButtonChange,
      children: (0, import_jsx_runtime51.jsx)(
        "div",
        {
          ref: setContentWrapper,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: contentZIndex
          },
          children: (0, import_jsx_runtime51.jsx)(
            Primitive3.div,
            {
              ...popperProps,
              ref: composedRefs,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...popperProps.style
              }
            }
          )
        }
      )
    }
  );
});
SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME;
var POPPER_POSITION_NAME = "SelectPopperPosition";
var SelectPopperPosition = React61.forwardRef((props, forwardedRef) => {
  const {
    __scopeSelect,
    align = "start",
    collisionPadding = CONTENT_MARGIN,
    ...popperProps
  } = props;
  const popperScope = usePopperScope4(__scopeSelect);
  return (0, import_jsx_runtime51.jsx)(
    Content3,
    {
      ...popperScope,
      ...popperProps,
      ref: forwardedRef,
      align,
      collisionPadding,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...popperProps.style,
        // re-namespace exposed content custom properties
        ...{
          "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-select-content-available-width": "var(--radix-popper-available-width)",
          "--radix-select-content-available-height": "var(--radix-popper-available-height)",
          "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    }
  );
});
SelectPopperPosition.displayName = POPPER_POSITION_NAME;
var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME13, {});
var VIEWPORT_NAME3 = "SelectViewport";
var SelectViewport = React61.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, nonce, ...viewportProps } = props;
    const contentContext = useSelectContentContext(VIEWPORT_NAME3, __scopeSelect);
    const viewportContext = useSelectViewportContext(VIEWPORT_NAME3, __scopeSelect);
    const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
    const prevScrollTopRef = React61.useRef(0);
    return (0, import_jsx_runtime51.jsxs)(import_jsx_runtime51.Fragment, { children: [
      (0, import_jsx_runtime51.jsx)(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      (0, import_jsx_runtime51.jsx)(Collection7.Slot, { scope: __scopeSelect, children: (0, import_jsx_runtime51.jsx)(
        Primitive3.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...viewportProps,
          ref: composedRefs,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...viewportProps.style
          },
          onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
            const viewport = event.currentTarget;
            const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
            if ((shouldExpandOnScrollRef == null ? void 0 : shouldExpandOnScrollRef.current) && contentWrapper) {
              const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
              if (scrolledBy > 0) {
                const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
                const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
                const cssHeight = parseFloat(contentWrapper.style.height);
                const prevHeight = Math.max(cssMinHeight, cssHeight);
                if (prevHeight < availableHeight) {
                  const nextHeight = prevHeight + scrolledBy;
                  const clampedNextHeight = Math.min(availableHeight, nextHeight);
                  const heightDiff = nextHeight - clampedNextHeight;
                  contentWrapper.style.height = clampedNextHeight + "px";
                  if (contentWrapper.style.bottom === "0px") {
                    viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
                    contentWrapper.style.justifyContent = "flex-end";
                  }
                }
              }
            }
            prevScrollTopRef.current = viewport.scrollTop;
          })
        }
      ) })
    ] });
  }
);
SelectViewport.displayName = VIEWPORT_NAME3;
var GROUP_NAME6 = "SelectGroup";
var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext(GROUP_NAME6);
var SelectGroup = React61.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props;
    const groupId = useId2();
    return (0, import_jsx_runtime51.jsx)(SelectGroupContextProvider, { scope: __scopeSelect, id: groupId, children: (0, import_jsx_runtime51.jsx)(Primitive3.div, { role: "group", "aria-labelledby": groupId, ...groupProps, ref: forwardedRef }) });
  }
);
SelectGroup.displayName = GROUP_NAME6;
var LABEL_NAME6 = "SelectLabel";
var SelectLabel = React61.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props;
    const groupContext = useSelectGroupContext(LABEL_NAME6, __scopeSelect);
    return (0, import_jsx_runtime51.jsx)(Primitive3.div, { id: groupContext.id, ...labelProps, ref: forwardedRef });
  }
);
SelectLabel.displayName = LABEL_NAME6;
var ITEM_NAME9 = "SelectItem";
var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME9);
var SelectItem = React61.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      value,
      disabled = false,
      textValue: textValueProp,
      ...itemProps
    } = props;
    const context = useSelectContext(ITEM_NAME9, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_NAME9, __scopeSelect);
    const isSelected = context.value === value;
    const [textValue, setTextValue] = React61.useState(textValueProp ?? "");
    const [isFocused, setIsFocused] = React61.useState(false);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => {
        var _a2;
        return (_a2 = contentContext.itemRefCallback) == null ? void 0 : _a2.call(contentContext, node, value, disabled);
      }
    );
    const textId = useId2();
    const pointerTypeRef = React61.useRef("touch");
    const handleSelect = () => {
      if (!disabled) {
        context.onValueChange(value);
        context.onOpenChange(false);
      }
    };
    if (value === "") {
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    }
    return (0, import_jsx_runtime51.jsx)(
      SelectItemContextProvider,
      {
        scope: __scopeSelect,
        value,
        disabled,
        textId,
        isSelected,
        onItemTextChange: React61.useCallback((node) => {
          setTextValue((prevTextValue) => prevTextValue || ((node == null ? void 0 : node.textContent) ?? "").trim());
        }, []),
        children: (0, import_jsx_runtime51.jsx)(
          Collection7.ItemSlot,
          {
            scope: __scopeSelect,
            value,
            disabled,
            textValue,
            children: (0, import_jsx_runtime51.jsx)(
              Primitive3.div,
              {
                role: "option",
                "aria-labelledby": textId,
                "data-highlighted": isFocused ? "" : void 0,
                "aria-selected": isSelected && isFocused,
                "data-state": isSelected ? "checked" : "unchecked",
                "aria-disabled": disabled || void 0,
                "data-disabled": disabled ? "" : void 0,
                tabIndex: disabled ? void 0 : -1,
                ...itemProps,
                ref: composedRefs,
                onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
                onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
                onClick: composeEventHandlers(itemProps.onClick, () => {
                  if (pointerTypeRef.current !== "mouse") handleSelect();
                }),
                onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
                  if (pointerTypeRef.current === "mouse") handleSelect();
                }),
                onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
                  pointerTypeRef.current = event.pointerType;
                }),
                onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
                  var _a2;
                  pointerTypeRef.current = event.pointerType;
                  if (disabled) {
                    (_a2 = contentContext.onItemLeave) == null ? void 0 : _a2.call(contentContext);
                  } else if (pointerTypeRef.current === "mouse") {
                    event.currentTarget.focus({ preventScroll: true });
                  }
                }),
                onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
                  var _a2;
                  if (event.currentTarget === document.activeElement) {
                    (_a2 = contentContext.onItemLeave) == null ? void 0 : _a2.call(contentContext);
                  }
                }),
                onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
                  var _a2;
                  const isTypingAhead = ((_a2 = contentContext.searchRef) == null ? void 0 : _a2.current) !== "";
                  if (isTypingAhead && event.key === " ") return;
                  if (SELECTION_KEYS2.includes(event.key)) handleSelect();
                  if (event.key === " ") event.preventDefault();
                })
              }
            )
          }
        )
      }
    );
  }
);
SelectItem.displayName = ITEM_NAME9;
var ITEM_TEXT_NAME = "SelectItemText";
var SelectItemText = React61.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, ...itemTextProps } = props;
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
    const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
    const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
    const [itemTextNode, setItemTextNode] = React61.useState(null);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => setItemTextNode(node),
      itemContext.onItemTextChange,
      (node) => {
        var _a2;
        return (_a2 = contentContext.itemTextRefCallback) == null ? void 0 : _a2.call(contentContext, node, itemContext.value, itemContext.disabled);
      }
    );
    const textContent = itemTextNode == null ? void 0 : itemTextNode.textContent;
    const nativeOption = React61.useMemo(
      () => (0, import_jsx_runtime51.jsx)("option", { value: itemContext.value, disabled: itemContext.disabled, children: textContent }, itemContext.value),
      [itemContext.disabled, itemContext.value, textContent]
    );
    const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
    useLayoutEffect2(() => {
      onNativeOptionAdd(nativeOption);
      return () => onNativeOptionRemove(nativeOption);
    }, [onNativeOptionAdd, onNativeOptionRemove, nativeOption]);
    return (0, import_jsx_runtime51.jsxs)(import_jsx_runtime51.Fragment, { children: [
      (0, import_jsx_runtime51.jsx)(Primitive3.span, { id: itemContext.textId, ...itemTextProps, ref: composedRefs }),
      itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? ReactDOM6.createPortal(itemTextProps.children, context.valueNode) : null
    ] });
  }
);
SelectItemText.displayName = ITEM_TEXT_NAME;
var ITEM_INDICATOR_NAME2 = "SelectItemIndicator";
var SelectItemIndicator = React61.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props;
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME2, __scopeSelect);
    return itemContext.isSelected ? (0, import_jsx_runtime51.jsx)(Primitive3.span, { "aria-hidden": true, ...itemIndicatorProps, ref: forwardedRef }) : null;
  }
);
SelectItemIndicator.displayName = ITEM_INDICATOR_NAME2;
var SCROLL_UP_BUTTON_NAME = "SelectScrollUpButton";
var SelectScrollUpButton = React61.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const [canScrollUp, setCanScrollUp] = React61.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll22 = function() {
        const canScrollUp2 = viewport.scrollTop > 0;
        setCanScrollUp(canScrollUp2);
      };
      var handleScroll2 = handleScroll22;
      const viewport = contentContext.viewport;
      handleScroll22();
      viewport.addEventListener("scroll", handleScroll22);
      return () => viewport.removeEventListener("scroll", handleScroll22);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollUp ? (0, import_jsx_runtime51.jsx)(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollUpButton.displayName = SCROLL_UP_BUTTON_NAME;
var SCROLL_DOWN_BUTTON_NAME = "SelectScrollDownButton";
var SelectScrollDownButton = React61.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const [canScrollDown, setCanScrollDown] = React61.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll22 = function() {
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        const canScrollDown2 = Math.ceil(viewport.scrollTop) < maxScroll;
        setCanScrollDown(canScrollDown2);
      };
      var handleScroll2 = handleScroll22;
      const viewport = contentContext.viewport;
      handleScroll22();
      viewport.addEventListener("scroll", handleScroll22);
      return () => viewport.removeEventListener("scroll", handleScroll22);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollDown ? (0, import_jsx_runtime51.jsx)(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollDownButton.displayName = SCROLL_DOWN_BUTTON_NAME;
var SelectScrollButtonImpl = React61.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
  const contentContext = useSelectContentContext("SelectScrollButton", __scopeSelect);
  const autoScrollTimerRef = React61.useRef(null);
  const getItems = useCollection7(__scopeSelect);
  const clearAutoScrollTimer = React61.useCallback(() => {
    if (autoScrollTimerRef.current !== null) {
      window.clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);
  React61.useEffect(() => {
    return () => clearAutoScrollTimer();
  }, [clearAutoScrollTimer]);
  useLayoutEffect2(() => {
    var _a2;
    const activeItem = getItems().find((item) => item.ref.current === document.activeElement);
    (_a2 = activeItem == null ? void 0 : activeItem.ref.current) == null ? void 0 : _a2.scrollIntoView({ block: "nearest" });
  }, [getItems]);
  return (0, import_jsx_runtime51.jsx)(
    Primitive3.div,
    {
      "aria-hidden": true,
      ...scrollIndicatorProps,
      ref: forwardedRef,
      style: { flexShrink: 0, ...scrollIndicatorProps.style },
      onPointerDown: composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerMove: composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
        var _a2;
        (_a2 = contentContext.onItemLeave) == null ? void 0 : _a2.call(contentContext);
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerLeave: composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
        clearAutoScrollTimer();
      })
    }
  );
});
var SEPARATOR_NAME5 = "SelectSeparator";
var SelectSeparator = React61.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...separatorProps } = props;
    return (0, import_jsx_runtime51.jsx)(Primitive3.div, { "aria-hidden": true, ...separatorProps, ref: forwardedRef });
  }
);
SelectSeparator.displayName = SEPARATOR_NAME5;
var ARROW_NAME8 = "SelectArrow";
var SelectArrow = React61.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...arrowProps } = props;
    const popperScope = usePopperScope4(__scopeSelect);
    const context = useSelectContext(ARROW_NAME8, __scopeSelect);
    const contentContext = useSelectContentContext(ARROW_NAME8, __scopeSelect);
    return context.open && contentContext.position === "popper" ? (0, import_jsx_runtime51.jsx)(Arrow2, { ...popperScope, ...arrowProps, ref: forwardedRef }) : null;
  }
);
SelectArrow.displayName = ARROW_NAME8;
var BUBBLE_INPUT_NAME3 = "SelectBubbleInput";
var SelectBubbleInput = React61.forwardRef(
  ({ __scopeSelect, value, ...props }, forwardedRef) => {
    const ref = React61.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const prevValue = usePrevious(value);
    React61.useEffect(() => {
      const select = ref.current;
      if (!select) return;
      const selectProto = window.HTMLSelectElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        selectProto,
        "value"
      );
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("change", { bubbles: true });
        setValue.call(select, value);
        select.dispatchEvent(event);
      }
    }, [prevValue, value]);
    return (0, import_jsx_runtime51.jsx)(
      Primitive3.select,
      {
        ...props,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style },
        ref: composedRefs,
        defaultValue: value
      }
    );
  }
);
SelectBubbleInput.displayName = BUBBLE_INPUT_NAME3;
function shouldShowPlaceholder(value) {
  return value === "" || value === void 0;
}
function useTypeaheadSearch(onSearchChange) {
  const handleSearchChange = useCallbackRef(onSearchChange);
  const searchRef = React61.useRef("");
  const timerRef = React61.useRef(0);
  const handleTypeaheadSearch = React61.useCallback(
    (key) => {
      const search = searchRef.current + key;
      handleSearchChange(search);
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
      })(search);
    },
    [handleSearchChange]
  );
  const resetTypeahead = React61.useCallback(() => {
    searchRef.current = "";
    window.clearTimeout(timerRef.current);
  }, []);
  React61.useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);
  return [searchRef, handleTypeaheadSearch, resetTypeahead];
}
function findNextItem(items, search, currentItem) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
  let wrappedItems = wrapArray4(items, Math.max(currentItemIndex, 0));
  const excludeCurrentItem = normalizedSearch.length === 1;
  if (excludeCurrentItem) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
  const nextItem = wrappedItems.find(
    (item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextItem !== currentItem ? nextItem : void 0;
}
function wrapArray4(array, startIndex) {
  return array.map((_, index4) => array[(startIndex + index4) % array.length]);
}

// ../../node_modules/.pnpm/@radix-ui+react-separator@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types+re_708d1054dbf5e38a292cb79d1c79b4a1/node_modules/@radix-ui/react-separator/dist/index.mjs
var React62 = __toESM(require_react(), 1);
var import_jsx_runtime52 = __toESM(require_jsx_runtime(), 1);
var NAME6 = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator3 = React62.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return (0, import_jsx_runtime52.jsx)(
    Primitive3.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator3.displayName = NAME6;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root8 = Separator3;

// ../../node_modules/.pnpm/@radix-ui+react-slider@1.3.6_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react_c6a3fae91eb6750caf661d179680cb4a/node_modules/@radix-ui/react-slider/dist/index.mjs
var React63 = __toESM(require_react(), 1);
var import_jsx_runtime53 = __toESM(require_jsx_runtime(), 1);
var PAGE_KEYS = ["PageUp", "PageDown"];
var ARROW_KEYS3 = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var BACK_KEYS = {
  "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
  "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"]
};
var SLIDER_NAME = "Slider";
var [Collection8, useCollection8, createCollectionScope8] = createCollection(SLIDER_NAME);
var [createSliderContext, createSliderScope] = createContextScope(SLIDER_NAME, [
  createCollectionScope8
]);
var [SliderProvider, useSliderContext] = createSliderContext(SLIDER_NAME);
var Slider = React63.forwardRef(
  (props, forwardedRef) => {
    const {
      name,
      min: min2 = 0,
      max: max2 = 100,
      step = 1,
      orientation = "horizontal",
      disabled = false,
      minStepsBetweenThumbs = 0,
      defaultValue = [min2],
      value,
      onValueChange = () => {
      },
      onValueCommit = () => {
      },
      inverted = false,
      form,
      ...sliderProps
    } = props;
    const thumbRefs = React63.useRef(/* @__PURE__ */ new Set());
    const valueIndexToChangeRef = React63.useRef(0);
    const isHorizontal = orientation === "horizontal";
    const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;
    const [values = [], setValues] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: (value2) => {
        var _a2;
        const thumbs = [...thumbRefs.current];
        (_a2 = thumbs[valueIndexToChangeRef.current]) == null ? void 0 : _a2.focus();
        onValueChange(value2);
      }
    });
    const valuesBeforeSlideStartRef = React63.useRef(values);
    function handleSlideStart(value2) {
      const closestIndex = getClosestValueIndex(values, value2);
      updateValues(value2, closestIndex);
    }
    function handleSlideMove(value2) {
      updateValues(value2, valueIndexToChangeRef.current);
    }
    function handleSlideEnd() {
      const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
      const nextValue = values[valueIndexToChangeRef.current];
      const hasChanged = nextValue !== prevValue;
      if (hasChanged) onValueCommit(values);
    }
    function updateValues(value2, atIndex, { commit } = { commit: false }) {
      const decimalCount = getDecimalCount(step);
      const snapToStep = roundValue(Math.round((value2 - min2) / step) * step + min2, decimalCount);
      const nextValue = clamp2(snapToStep, [min2, max2]);
      setValues((prevValues = []) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
          valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
          const hasChanged = String(nextValues) !== String(prevValues);
          if (hasChanged && commit) onValueCommit(nextValues);
          return hasChanged ? nextValues : prevValues;
        } else {
          return prevValues;
        }
      });
    }
    return (0, import_jsx_runtime53.jsx)(
      SliderProvider,
      {
        scope: props.__scopeSlider,
        name,
        disabled,
        min: min2,
        max: max2,
        valueIndexToChangeRef,
        thumbs: thumbRefs.current,
        values,
        orientation,
        form,
        children: (0, import_jsx_runtime53.jsx)(Collection8.Provider, { scope: props.__scopeSlider, children: (0, import_jsx_runtime53.jsx)(Collection8.Slot, { scope: props.__scopeSlider, children: (0, import_jsx_runtime53.jsx)(
          SliderOrientation,
          {
            "aria-disabled": disabled,
            "data-disabled": disabled ? "" : void 0,
            ...sliderProps,
            ref: forwardedRef,
            onPointerDown: composeEventHandlers(sliderProps.onPointerDown, () => {
              if (!disabled) valuesBeforeSlideStartRef.current = values;
            }),
            min: min2,
            max: max2,
            inverted,
            onSlideStart: disabled ? void 0 : handleSlideStart,
            onSlideMove: disabled ? void 0 : handleSlideMove,
            onSlideEnd: disabled ? void 0 : handleSlideEnd,
            onHomeKeyDown: () => !disabled && updateValues(min2, 0, { commit: true }),
            onEndKeyDown: () => !disabled && updateValues(max2, values.length - 1, { commit: true }),
            onStepKeyDown: ({ event, direction: stepDirection }) => {
              if (!disabled) {
                const isPageKey = PAGE_KEYS.includes(event.key);
                const isSkipKey = isPageKey || event.shiftKey && ARROW_KEYS3.includes(event.key);
                const multiplier = isSkipKey ? 10 : 1;
                const atIndex = valueIndexToChangeRef.current;
                const value2 = values[atIndex];
                const stepInDirection = step * multiplier * stepDirection;
                updateValues(value2 + stepInDirection, atIndex, { commit: true });
              }
            }
          }
        ) }) })
      }
    );
  }
);
Slider.displayName = SLIDER_NAME;
var [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext(SLIDER_NAME, {
  startEdge: "left",
  endEdge: "right",
  size: "width",
  direction: 1
});
var SliderHorizontal = React63.forwardRef(
  (props, forwardedRef) => {
    const {
      min: min2,
      max: max2,
      dir,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const [slider, setSlider] = React63.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
    const rectRef = React63.useRef(void 0);
    const direction = useDirection(dir);
    const isDirectionLTR = direction === "ltr";
    const isSlidingFromLeft = isDirectionLTR && !inverted || !isDirectionLTR && inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || slider.getBoundingClientRect();
      const input = [0, rect.width];
      const output = isSlidingFromLeft ? [min2, max2] : [max2, min2];
      const value = linearScale2(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.left);
    }
    return (0, import_jsx_runtime53.jsx)(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromLeft ? "left" : "right",
        endEdge: isSlidingFromLeft ? "right" : "left",
        direction: isSlidingFromLeft ? 1 : -1,
        size: "width",
        children: (0, import_jsx_runtime53.jsx)(
          SliderImpl,
          {
            dir: direction,
            "data-orientation": "horizontal",
            ...sliderProps,
            ref: composedRefs,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateX(-50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideStart == null ? void 0 : onSlideStart(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideMove == null ? void 0 : onSlideMove(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd == null ? void 0 : onSlideEnd();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromLeft ? "from-left" : "from-right";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown == null ? void 0 : onStepKeyDown({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderVertical = React63.forwardRef(
  (props, forwardedRef) => {
    const {
      min: min2,
      max: max2,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const sliderRef = React63.useRef(null);
    const ref = useComposedRefs(forwardedRef, sliderRef);
    const rectRef = React63.useRef(void 0);
    const isSlidingFromBottom = !inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || sliderRef.current.getBoundingClientRect();
      const input = [0, rect.height];
      const output = isSlidingFromBottom ? [max2, min2] : [min2, max2];
      const value = linearScale2(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.top);
    }
    return (0, import_jsx_runtime53.jsx)(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromBottom ? "bottom" : "top",
        endEdge: isSlidingFromBottom ? "top" : "bottom",
        size: "height",
        direction: isSlidingFromBottom ? 1 : -1,
        children: (0, import_jsx_runtime53.jsx)(
          SliderImpl,
          {
            "data-orientation": "vertical",
            ...sliderProps,
            ref,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateY(50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideStart == null ? void 0 : onSlideStart(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideMove == null ? void 0 : onSlideMove(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd == null ? void 0 : onSlideEnd();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromBottom ? "from-bottom" : "from-top";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown == null ? void 0 : onStepKeyDown({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderImpl = React63.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSlider,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onHomeKeyDown,
      onEndKeyDown,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const context = useSliderContext(SLIDER_NAME, __scopeSlider);
    return (0, import_jsx_runtime53.jsx)(
      Primitive3.span,
      {
        ...sliderProps,
        ref: forwardedRef,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === "Home") {
            onHomeKeyDown(event);
            event.preventDefault();
          } else if (event.key === "End") {
            onEndKeyDown(event);
            event.preventDefault();
          } else if (PAGE_KEYS.concat(ARROW_KEYS3).includes(event.key)) {
            onStepKeyDown(event);
            event.preventDefault();
          }
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
          const target = event.target;
          target.setPointerCapture(event.pointerId);
          event.preventDefault();
          if (context.thumbs.has(target)) {
            target.focus();
          } else {
            onSlideStart(event);
          }
        }),
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) onSlideMove(event);
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
            onSlideEnd(event);
          }
        })
      }
    );
  }
);
var TRACK_NAME = "SliderTrack";
var SliderTrack = React63.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...trackProps } = props;
    const context = useSliderContext(TRACK_NAME, __scopeSlider);
    return (0, import_jsx_runtime53.jsx)(
      Primitive3.span,
      {
        "data-disabled": context.disabled ? "" : void 0,
        "data-orientation": context.orientation,
        ...trackProps,
        ref: forwardedRef
      }
    );
  }
);
SliderTrack.displayName = TRACK_NAME;
var RANGE_NAME = "SliderRange";
var SliderRange = React63.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...rangeProps } = props;
    const context = useSliderContext(RANGE_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(RANGE_NAME, __scopeSlider);
    const ref = React63.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const valuesCount = context.values.length;
    const percentages = context.values.map(
      (value) => convertValueToPercentage(value, context.min, context.max)
    );
    const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0;
    const offsetEnd = 100 - Math.max(...percentages);
    return (0, import_jsx_runtime53.jsx)(
      Primitive3.span,
      {
        "data-orientation": context.orientation,
        "data-disabled": context.disabled ? "" : void 0,
        ...rangeProps,
        ref: composedRefs,
        style: {
          ...props.style,
          [orientation.startEdge]: offsetStart + "%",
          [orientation.endEdge]: offsetEnd + "%"
        }
      }
    );
  }
);
SliderRange.displayName = RANGE_NAME;
var THUMB_NAME2 = "SliderThumb";
var SliderThumb = React63.forwardRef(
  (props, forwardedRef) => {
    const getItems = useCollection8(props.__scopeSlider);
    const [thumb, setThumb] = React63.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const index4 = React63.useMemo(
      () => thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1,
      [getItems, thumb]
    );
    return (0, import_jsx_runtime53.jsx)(SliderThumbImpl, { ...props, ref: composedRefs, index: index4 });
  }
);
var SliderThumbImpl = React63.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, index: index4, name, ...thumbProps } = props;
    const context = useSliderContext(THUMB_NAME2, __scopeSlider);
    const orientation = useSliderOrientationContext(THUMB_NAME2, __scopeSlider);
    const [thumb, setThumb] = React63.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const isFormControl2 = thumb ? context.form || !!thumb.closest("form") : true;
    const size4 = useSize(thumb);
    const value = context.values[index4];
    const percent = value === void 0 ? 0 : convertValueToPercentage(value, context.min, context.max);
    const label = getLabel(index4, context.values.length);
    const orientationSize = size4 == null ? void 0 : size4[orientation.size];
    const thumbInBoundsOffset = orientationSize ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction) : 0;
    React63.useEffect(() => {
      if (thumb) {
        context.thumbs.add(thumb);
        return () => {
          context.thumbs.delete(thumb);
        };
      }
    }, [thumb, context.thumbs]);
    return (0, import_jsx_runtime53.jsxs)(
      "span",
      {
        style: {
          transform: "var(--radix-slider-thumb-transform)",
          position: "absolute",
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`
        },
        children: [
          (0, import_jsx_runtime53.jsx)(Collection8.ItemSlot, { scope: props.__scopeSlider, children: (0, import_jsx_runtime53.jsx)(
            Primitive3.span,
            {
              role: "slider",
              "aria-label": props["aria-label"] || label,
              "aria-valuemin": context.min,
              "aria-valuenow": value,
              "aria-valuemax": context.max,
              "aria-orientation": context.orientation,
              "data-orientation": context.orientation,
              "data-disabled": context.disabled ? "" : void 0,
              tabIndex: context.disabled ? void 0 : 0,
              ...thumbProps,
              ref: composedRefs,
              style: value === void 0 ? { display: "none" } : props.style,
              onFocus: composeEventHandlers(props.onFocus, () => {
                context.valueIndexToChangeRef.current = index4;
              })
            }
          ) }),
          isFormControl2 && (0, import_jsx_runtime53.jsx)(
            SliderBubbleInput,
            {
              name: name ?? (context.name ? context.name + (context.values.length > 1 ? "[]" : "") : void 0),
              form: context.form,
              value
            },
            index4
          )
        ]
      }
    );
  }
);
SliderThumb.displayName = THUMB_NAME2;
var BUBBLE_INPUT_NAME4 = "RadioBubbleInput";
var SliderBubbleInput = React63.forwardRef(
  ({ __scopeSlider, value, ...props }, forwardedRef) => {
    const ref = React63.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevValue = usePrevious(value);
    React63.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(inputProto, "value");
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("input", { bubbles: true });
        setValue.call(input, value);
        input.dispatchEvent(event);
      }
    }, [prevValue, value]);
    return (0, import_jsx_runtime53.jsx)(
      Primitive3.input,
      {
        style: { display: "none" },
        ...props,
        ref: composedRefs,
        defaultValue: value
      }
    );
  }
);
SliderBubbleInput.displayName = BUBBLE_INPUT_NAME4;
function getNextSortedValues(prevValues = [], nextValue, atIndex) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}
function convertValueToPercentage(value, min2, max2) {
  const maxSteps = max2 - min2;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min2);
  return clamp2(percentage, [0, 100]);
}
function getLabel(index4, totalValues) {
  if (totalValues > 2) {
    return `Value ${index4 + 1} of ${totalValues}`;
  } else if (totalValues === 2) {
    return ["Minimum", "Maximum"][index4];
  } else {
    return void 0;
  }
}
function getClosestValueIndex(values, nextValue) {
  if (values.length === 1) return 0;
  const distances = values.map((value) => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);
  return distances.indexOf(closestDistance);
}
function getThumbInBoundsOffset(width, left, direction) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset4 = linearScale2([0, halfPercent], [0, halfWidth]);
  return (halfWidth - offset4(left) * direction) * direction;
}
function getStepsBetweenValues(values) {
  return values.slice(0, -1).map((value, index4) => values[index4 + 1] - value);
}
function hasMinStepsBetweenValues(values, minStepsBetweenValues) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values);
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
    return actualMinStepsBetweenValues >= minStepsBetweenValues;
  }
  return true;
}
function linearScale2(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function getDecimalCount(value) {
  return (String(value).split(".")[1] || "").length;
}
function roundValue(value, decimalCount) {
  const rounder = Math.pow(10, decimalCount);
  return Math.round(value * rounder) / rounder;
}

// ../../node_modules/.pnpm/@radix-ui+react-switch@1.2.6_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react_e3738c514c10df2ef7e24af5ee461853/node_modules/@radix-ui/react-switch/dist/index.mjs
var React64 = __toESM(require_react(), 1);
var import_jsx_runtime54 = __toESM(require_jsx_runtime(), 1);
var SWITCH_NAME = "Switch";
var [createSwitchContext, createSwitchScope] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch = React64.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = React64.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = React64.useRef(false);
    const isFormControl2 = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return (0, import_jsx_runtime54.jsxs)(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      (0, import_jsx_runtime54.jsx)(
        Primitive3.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState7(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl2) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl2 && (0, import_jsx_runtime54.jsx)(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch.displayName = SWITCH_NAME;
var THUMB_NAME3 = "SwitchThumb";
var SwitchThumb = React64.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME3, __scopeSwitch);
    return (0, import_jsx_runtime54.jsx)(
      Primitive3.span,
      {
        "data-state": getState7(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME3;
var BUBBLE_INPUT_NAME5 = "SwitchBubbleInput";
var SwitchBubbleInput = React64.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = React64.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    React64.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return (0, import_jsx_runtime54.jsx)(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME5;
function getState7(checked) {
  return checked ? "checked" : "unchecked";
}

// ../../node_modules/.pnpm/@radix-ui+react-tabs@1.1.13_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_2ad0945e3cb98dc5bbfaaf29c105e977/node_modules/@radix-ui/react-tabs/dist/index.mjs
var React65 = __toESM(require_react(), 1);
var import_jsx_runtime55 = __toESM(require_jsx_runtime(), 1);
var TABS_NAME = "Tabs";
var [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope5 = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs = React65.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return (0, import_jsx_runtime55.jsx)(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId2(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: (0, import_jsx_runtime55.jsx)(
          Primitive3.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList = React65.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope5(__scopeTabs);
    return (0, import_jsx_runtime55.jsx)(
      Root7,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: (0, import_jsx_runtime55.jsx)(
          Primitive3.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList.displayName = TAB_LIST_NAME;
var TRIGGER_NAME13 = "TabsTrigger";
var TabsTrigger = React65.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME13, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope5(__scopeTabs);
    const triggerId = makeTriggerId2(context.baseId, value);
    const contentId = makeContentId2(context.baseId, value);
    const isSelected = value === context.value;
    return (0, import_jsx_runtime55.jsx)(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: (0, import_jsx_runtime55.jsx)(
          Primitive3.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger.displayName = TRIGGER_NAME13;
var CONTENT_NAME14 = "TabsContent";
var TabsContent = React65.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME14, __scopeTabs);
    const triggerId = makeTriggerId2(context.baseId, value);
    const contentId = makeContentId2(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = React65.useRef(isSelected);
    React65.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return (0, import_jsx_runtime55.jsx)(Presence, { present: forceMount || isSelected, children: ({ present }) => (0, import_jsx_runtime55.jsx)(
      Primitive3.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent.displayName = CONTENT_NAME14;
function makeTriggerId2(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId2(baseId, value) {
  return `${baseId}-content-${value}`;
}

// ../../node_modules/.pnpm/@radix-ui+react-toast@1.2.15_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react_4581e89c6ba13e4159ce65546c8b2a16/node_modules/@radix-ui/react-toast/dist/index.mjs
var React66 = __toESM(require_react(), 1);
var ReactDOM7 = __toESM(require_react_dom(), 1);
var import_jsx_runtime56 = __toESM(require_jsx_runtime(), 1);
var PROVIDER_NAME = "ToastProvider";
var [Collection9, useCollection9, createCollectionScope9] = createCollection("Toast");
var [createToastContext, createToastScope] = createContextScope("Toast", [createCollectionScope9]);
var [ToastProviderProvider, useToastProviderContext] = createToastContext(PROVIDER_NAME);
var ToastProvider = (props) => {
  const {
    __scopeToast,
    label = "Notification",
    duration = 5e3,
    swipeDirection = "right",
    swipeThreshold = 50,
    children
  } = props;
  const [viewport, setViewport] = React66.useState(null);
  const [toastCount, setToastCount] = React66.useState(0);
  const isFocusedToastEscapeKeyDownRef = React66.useRef(false);
  const isClosePausedRef = React66.useRef(false);
  if (!label.trim()) {
    console.error(
      `Invalid prop \`label\` supplied to \`${PROVIDER_NAME}\`. Expected non-empty \`string\`.`
    );
  }
  return (0, import_jsx_runtime56.jsx)(Collection9.Provider, { scope: __scopeToast, children: (0, import_jsx_runtime56.jsx)(
    ToastProviderProvider,
    {
      scope: __scopeToast,
      label,
      duration,
      swipeDirection,
      swipeThreshold,
      toastCount,
      viewport,
      onViewportChange: setViewport,
      onToastAdd: React66.useCallback(() => setToastCount((prevCount) => prevCount + 1), []),
      onToastRemove: React66.useCallback(() => setToastCount((prevCount) => prevCount - 1), []),
      isFocusedToastEscapeKeyDownRef,
      isClosePausedRef,
      children
    }
  ) });
};
ToastProvider.displayName = PROVIDER_NAME;
var VIEWPORT_NAME4 = "ToastViewport";
var VIEWPORT_DEFAULT_HOTKEY = ["F8"];
var VIEWPORT_PAUSE = "toast.viewportPause";
var VIEWPORT_RESUME = "toast.viewportResume";
var ToastViewport = React66.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeToast,
      hotkey = VIEWPORT_DEFAULT_HOTKEY,
      label = "Notifications ({hotkey})",
      ...viewportProps
    } = props;
    const context = useToastProviderContext(VIEWPORT_NAME4, __scopeToast);
    const getItems = useCollection9(__scopeToast);
    const wrapperRef = React66.useRef(null);
    const headFocusProxyRef = React66.useRef(null);
    const tailFocusProxyRef = React66.useRef(null);
    const ref = React66.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
    const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
    const hasToasts = context.toastCount > 0;
    React66.useEffect(() => {
      const handleKeyDown = (event) => {
        var _a2;
        const isHotkeyPressed = hotkey.length !== 0 && hotkey.every((key) => event[key] || event.code === key);
        if (isHotkeyPressed) (_a2 = ref.current) == null ? void 0 : _a2.focus();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [hotkey]);
    React66.useEffect(() => {
      const wrapper = wrapperRef.current;
      const viewport = ref.current;
      if (hasToasts && wrapper && viewport) {
        const handlePause = () => {
          if (!context.isClosePausedRef.current) {
            const pauseEvent = new CustomEvent(VIEWPORT_PAUSE);
            viewport.dispatchEvent(pauseEvent);
            context.isClosePausedRef.current = true;
          }
        };
        const handleResume = () => {
          if (context.isClosePausedRef.current) {
            const resumeEvent = new CustomEvent(VIEWPORT_RESUME);
            viewport.dispatchEvent(resumeEvent);
            context.isClosePausedRef.current = false;
          }
        };
        const handleFocusOutResume = (event) => {
          const isFocusMovingOutside = !wrapper.contains(event.relatedTarget);
          if (isFocusMovingOutside) handleResume();
        };
        const handlePointerLeaveResume = () => {
          const isFocusInside = wrapper.contains(document.activeElement);
          if (!isFocusInside) handleResume();
        };
        wrapper.addEventListener("focusin", handlePause);
        wrapper.addEventListener("focusout", handleFocusOutResume);
        wrapper.addEventListener("pointermove", handlePause);
        wrapper.addEventListener("pointerleave", handlePointerLeaveResume);
        window.addEventListener("blur", handlePause);
        window.addEventListener("focus", handleResume);
        return () => {
          wrapper.removeEventListener("focusin", handlePause);
          wrapper.removeEventListener("focusout", handleFocusOutResume);
          wrapper.removeEventListener("pointermove", handlePause);
          wrapper.removeEventListener("pointerleave", handlePointerLeaveResume);
          window.removeEventListener("blur", handlePause);
          window.removeEventListener("focus", handleResume);
        };
      }
    }, [hasToasts, context.isClosePausedRef]);
    const getSortedTabbableCandidates = React66.useCallback(
      ({ tabbingDirection }) => {
        const toastItems = getItems();
        const tabbableCandidates = toastItems.map((toastItem) => {
          const toastNode = toastItem.ref.current;
          const toastTabbableCandidates = [toastNode, ...getTabbableCandidates3(toastNode)];
          return tabbingDirection === "forwards" ? toastTabbableCandidates : toastTabbableCandidates.reverse();
        });
        return (tabbingDirection === "forwards" ? tabbableCandidates.reverse() : tabbableCandidates).flat();
      },
      [getItems]
    );
    React66.useEffect(() => {
      const viewport = ref.current;
      if (viewport) {
        const handleKeyDown = (event) => {
          var _a2, _b, _c;
          const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
          const isTabKey = event.key === "Tab" && !isMetaKey;
          if (isTabKey) {
            const focusedElement = document.activeElement;
            const isTabbingBackwards = event.shiftKey;
            const targetIsViewport = event.target === viewport;
            if (targetIsViewport && isTabbingBackwards) {
              (_a2 = headFocusProxyRef.current) == null ? void 0 : _a2.focus();
              return;
            }
            const tabbingDirection = isTabbingBackwards ? "backwards" : "forwards";
            const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection });
            const index4 = sortedCandidates.findIndex((candidate) => candidate === focusedElement);
            if (focusFirst5(sortedCandidates.slice(index4 + 1))) {
              event.preventDefault();
            } else {
              isTabbingBackwards ? (_b = headFocusProxyRef.current) == null ? void 0 : _b.focus() : (_c = tailFocusProxyRef.current) == null ? void 0 : _c.focus();
            }
          }
        };
        viewport.addEventListener("keydown", handleKeyDown);
        return () => viewport.removeEventListener("keydown", handleKeyDown);
      }
    }, [getItems, getSortedTabbableCandidates]);
    return (0, import_jsx_runtime56.jsxs)(
      Branch,
      {
        ref: wrapperRef,
        role: "region",
        "aria-label": label.replace("{hotkey}", hotkeyLabel),
        tabIndex: -1,
        style: { pointerEvents: hasToasts ? void 0 : "none" },
        children: [
          hasToasts && (0, import_jsx_runtime56.jsx)(
            FocusProxy,
            {
              ref: headFocusProxyRef,
              onFocusFromOutsideViewport: () => {
                const tabbableCandidates = getSortedTabbableCandidates({
                  tabbingDirection: "forwards"
                });
                focusFirst5(tabbableCandidates);
              }
            }
          ),
          (0, import_jsx_runtime56.jsx)(Collection9.Slot, { scope: __scopeToast, children: (0, import_jsx_runtime56.jsx)(Primitive3.ol, { tabIndex: -1, ...viewportProps, ref: composedRefs }) }),
          hasToasts && (0, import_jsx_runtime56.jsx)(
            FocusProxy,
            {
              ref: tailFocusProxyRef,
              onFocusFromOutsideViewport: () => {
                const tabbableCandidates = getSortedTabbableCandidates({
                  tabbingDirection: "backwards"
                });
                focusFirst5(tabbableCandidates);
              }
            }
          )
        ]
      }
    );
  }
);
ToastViewport.displayName = VIEWPORT_NAME4;
var FOCUS_PROXY_NAME = "ToastFocusProxy";
var FocusProxy = React66.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToast, onFocusFromOutsideViewport, ...proxyProps } = props;
    const context = useToastProviderContext(FOCUS_PROXY_NAME, __scopeToast);
    return (0, import_jsx_runtime56.jsx)(
      VisuallyHidden,
      {
        tabIndex: 0,
        ...proxyProps,
        ref: forwardedRef,
        style: { position: "fixed" },
        onFocus: (event) => {
          var _a2;
          const prevFocusedElement = event.relatedTarget;
          const isFocusFromOutsideViewport = !((_a2 = context.viewport) == null ? void 0 : _a2.contains(prevFocusedElement));
          if (isFocusFromOutsideViewport) onFocusFromOutsideViewport();
        }
      }
    );
  }
);
FocusProxy.displayName = FOCUS_PROXY_NAME;
var TOAST_NAME = "Toast";
var TOAST_SWIPE_START = "toast.swipeStart";
var TOAST_SWIPE_MOVE = "toast.swipeMove";
var TOAST_SWIPE_CANCEL = "toast.swipeCancel";
var TOAST_SWIPE_END = "toast.swipeEnd";
var Toast = React66.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, open: openProp, defaultOpen, onOpenChange, ...toastProps } = props;
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? true,
      onChange: onOpenChange,
      caller: TOAST_NAME
    });
    return (0, import_jsx_runtime56.jsx)(Presence, { present: forceMount || open, children: (0, import_jsx_runtime56.jsx)(
      ToastImpl,
      {
        open,
        ...toastProps,
        ref: forwardedRef,
        onClose: () => setOpen(false),
        onPause: useCallbackRef(props.onPause),
        onResume: useCallbackRef(props.onResume),
        onSwipeStart: composeEventHandlers(props.onSwipeStart, (event) => {
          event.currentTarget.setAttribute("data-swipe", "start");
        }),
        onSwipeMove: composeEventHandlers(props.onSwipeMove, (event) => {
          const { x, y } = event.detail.delta;
          event.currentTarget.setAttribute("data-swipe", "move");
          event.currentTarget.style.setProperty("--radix-toast-swipe-move-x", `${x}px`);
          event.currentTarget.style.setProperty("--radix-toast-swipe-move-y", `${y}px`);
        }),
        onSwipeCancel: composeEventHandlers(props.onSwipeCancel, (event) => {
          event.currentTarget.setAttribute("data-swipe", "cancel");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-move-x");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-move-y");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-end-x");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-end-y");
        }),
        onSwipeEnd: composeEventHandlers(props.onSwipeEnd, (event) => {
          const { x, y } = event.detail.delta;
          event.currentTarget.setAttribute("data-swipe", "end");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-move-x");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-move-y");
          event.currentTarget.style.setProperty("--radix-toast-swipe-end-x", `${x}px`);
          event.currentTarget.style.setProperty("--radix-toast-swipe-end-y", `${y}px`);
          setOpen(false);
        })
      }
    ) });
  }
);
Toast.displayName = TOAST_NAME;
var [ToastInteractiveProvider, useToastInteractiveContext] = createToastContext(TOAST_NAME, {
  onClose() {
  }
});
var ToastImpl = React66.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeToast,
      type = "foreground",
      duration: durationProp,
      open,
      onClose,
      onEscapeKeyDown,
      onPause,
      onResume,
      onSwipeStart,
      onSwipeMove,
      onSwipeCancel,
      onSwipeEnd,
      ...toastProps
    } = props;
    const context = useToastProviderContext(TOAST_NAME, __scopeToast);
    const [node, setNode] = React66.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node2) => setNode(node2));
    const pointerStartRef = React66.useRef(null);
    const swipeDeltaRef = React66.useRef(null);
    const duration = durationProp || context.duration;
    const closeTimerStartTimeRef = React66.useRef(0);
    const closeTimerRemainingTimeRef = React66.useRef(duration);
    const closeTimerRef = React66.useRef(0);
    const { onToastAdd, onToastRemove } = context;
    const handleClose = useCallbackRef(() => {
      var _a2;
      const isFocusInToast = node == null ? void 0 : node.contains(document.activeElement);
      if (isFocusInToast) (_a2 = context.viewport) == null ? void 0 : _a2.focus();
      onClose();
    });
    const startTimer = React66.useCallback(
      (duration2) => {
        if (!duration2 || duration2 === Infinity) return;
        window.clearTimeout(closeTimerRef.current);
        closeTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
        closeTimerRef.current = window.setTimeout(handleClose, duration2);
      },
      [handleClose]
    );
    React66.useEffect(() => {
      const viewport = context.viewport;
      if (viewport) {
        const handleResume = () => {
          startTimer(closeTimerRemainingTimeRef.current);
          onResume == null ? void 0 : onResume();
        };
        const handlePause = () => {
          const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef.current;
          closeTimerRemainingTimeRef.current = closeTimerRemainingTimeRef.current - elapsedTime;
          window.clearTimeout(closeTimerRef.current);
          onPause == null ? void 0 : onPause();
        };
        viewport.addEventListener(VIEWPORT_PAUSE, handlePause);
        viewport.addEventListener(VIEWPORT_RESUME, handleResume);
        return () => {
          viewport.removeEventListener(VIEWPORT_PAUSE, handlePause);
          viewport.removeEventListener(VIEWPORT_RESUME, handleResume);
        };
      }
    }, [context.viewport, duration, onPause, onResume, startTimer]);
    React66.useEffect(() => {
      if (open && !context.isClosePausedRef.current) startTimer(duration);
    }, [open, duration, context.isClosePausedRef, startTimer]);
    React66.useEffect(() => {
      onToastAdd();
      return () => onToastRemove();
    }, [onToastAdd, onToastRemove]);
    const announceTextContent = React66.useMemo(() => {
      return node ? getAnnounceTextContent(node) : null;
    }, [node]);
    if (!context.viewport) return null;
    return (0, import_jsx_runtime56.jsxs)(import_jsx_runtime56.Fragment, { children: [
      announceTextContent && (0, import_jsx_runtime56.jsx)(
        ToastAnnounce,
        {
          __scopeToast,
          role: "status",
          "aria-live": type === "foreground" ? "assertive" : "polite",
          children: announceTextContent
        }
      ),
      (0, import_jsx_runtime56.jsx)(ToastInteractiveProvider, { scope: __scopeToast, onClose: handleClose, children: ReactDOM7.createPortal(
        (0, import_jsx_runtime56.jsx)(Collection9.ItemSlot, { scope: __scopeToast, children: (0, import_jsx_runtime56.jsx)(
          Root4,
          {
            asChild: true,
            onEscapeKeyDown: composeEventHandlers(onEscapeKeyDown, () => {
              if (!context.isFocusedToastEscapeKeyDownRef.current) handleClose();
              context.isFocusedToastEscapeKeyDownRef.current = false;
            }),
            children: (0, import_jsx_runtime56.jsx)(
              Primitive3.li,
              {
                tabIndex: 0,
                "data-state": open ? "open" : "closed",
                "data-swipe-direction": context.swipeDirection,
                ...toastProps,
                ref: composedRefs,
                style: { userSelect: "none", touchAction: "none", ...props.style },
                onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
                  if (event.key !== "Escape") return;
                  onEscapeKeyDown == null ? void 0 : onEscapeKeyDown(event.nativeEvent);
                  if (!event.nativeEvent.defaultPrevented) {
                    context.isFocusedToastEscapeKeyDownRef.current = true;
                    handleClose();
                  }
                }),
                onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
                  if (event.button !== 0) return;
                  pointerStartRef.current = { x: event.clientX, y: event.clientY };
                }),
                onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
                  if (!pointerStartRef.current) return;
                  const x = event.clientX - pointerStartRef.current.x;
                  const y = event.clientY - pointerStartRef.current.y;
                  const hasSwipeMoveStarted = Boolean(swipeDeltaRef.current);
                  const isHorizontalSwipe = ["left", "right"].includes(context.swipeDirection);
                  const clamp3 = ["left", "up"].includes(context.swipeDirection) ? Math.min : Math.max;
                  const clampedX = isHorizontalSwipe ? clamp3(0, x) : 0;
                  const clampedY = !isHorizontalSwipe ? clamp3(0, y) : 0;
                  const moveStartBuffer = event.pointerType === "touch" ? 10 : 2;
                  const delta = { x: clampedX, y: clampedY };
                  const eventDetail = { originalEvent: event, delta };
                  if (hasSwipeMoveStarted) {
                    swipeDeltaRef.current = delta;
                    handleAndDispatchCustomEvent2(TOAST_SWIPE_MOVE, onSwipeMove, eventDetail, {
                      discrete: false
                    });
                  } else if (isDeltaInDirection(delta, context.swipeDirection, moveStartBuffer)) {
                    swipeDeltaRef.current = delta;
                    handleAndDispatchCustomEvent2(TOAST_SWIPE_START, onSwipeStart, eventDetail, {
                      discrete: false
                    });
                    event.target.setPointerCapture(event.pointerId);
                  } else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) {
                    pointerStartRef.current = null;
                  }
                }),
                onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
                  const delta = swipeDeltaRef.current;
                  const target = event.target;
                  if (target.hasPointerCapture(event.pointerId)) {
                    target.releasePointerCapture(event.pointerId);
                  }
                  swipeDeltaRef.current = null;
                  pointerStartRef.current = null;
                  if (delta) {
                    const toast = event.currentTarget;
                    const eventDetail = { originalEvent: event, delta };
                    if (isDeltaInDirection(delta, context.swipeDirection, context.swipeThreshold)) {
                      handleAndDispatchCustomEvent2(TOAST_SWIPE_END, onSwipeEnd, eventDetail, {
                        discrete: true
                      });
                    } else {
                      handleAndDispatchCustomEvent2(
                        TOAST_SWIPE_CANCEL,
                        onSwipeCancel,
                        eventDetail,
                        {
                          discrete: true
                        }
                      );
                    }
                    toast.addEventListener("click", (event2) => event2.preventDefault(), {
                      once: true
                    });
                  }
                })
              }
            )
          }
        ) }),
        context.viewport
      ) })
    ] });
  }
);
var ToastAnnounce = (props) => {
  const { __scopeToast, children, ...announceProps } = props;
  const context = useToastProviderContext(TOAST_NAME, __scopeToast);
  const [renderAnnounceText, setRenderAnnounceText] = React66.useState(false);
  const [isAnnounced, setIsAnnounced] = React66.useState(false);
  useNextFrame(() => setRenderAnnounceText(true));
  React66.useEffect(() => {
    const timer = window.setTimeout(() => setIsAnnounced(true), 1e3);
    return () => window.clearTimeout(timer);
  }, []);
  return isAnnounced ? null : (0, import_jsx_runtime56.jsx)(Portal, { asChild: true, children: (0, import_jsx_runtime56.jsx)(VisuallyHidden, { ...announceProps, children: renderAnnounceText && (0, import_jsx_runtime56.jsxs)(import_jsx_runtime56.Fragment, { children: [
    context.label,
    " ",
    children
  ] }) }) });
};
var TITLE_NAME3 = "ToastTitle";
var ToastTitle = React66.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToast, ...titleProps } = props;
    return (0, import_jsx_runtime56.jsx)(Primitive3.div, { ...titleProps, ref: forwardedRef });
  }
);
ToastTitle.displayName = TITLE_NAME3;
var DESCRIPTION_NAME3 = "ToastDescription";
var ToastDescription = React66.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToast, ...descriptionProps } = props;
    return (0, import_jsx_runtime56.jsx)(Primitive3.div, { ...descriptionProps, ref: forwardedRef });
  }
);
ToastDescription.displayName = DESCRIPTION_NAME3;
var ACTION_NAME2 = "ToastAction";
var ToastAction = React66.forwardRef(
  (props, forwardedRef) => {
    const { altText, ...actionProps } = props;
    if (!altText.trim()) {
      console.error(
        `Invalid prop \`altText\` supplied to \`${ACTION_NAME2}\`. Expected non-empty \`string\`.`
      );
      return null;
    }
    return (0, import_jsx_runtime56.jsx)(ToastAnnounceExclude, { altText, asChild: true, children: (0, import_jsx_runtime56.jsx)(ToastClose, { ...actionProps, ref: forwardedRef }) });
  }
);
ToastAction.displayName = ACTION_NAME2;
var CLOSE_NAME3 = "ToastClose";
var ToastClose = React66.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToast, ...closeProps } = props;
    const interactiveContext = useToastInteractiveContext(CLOSE_NAME3, __scopeToast);
    return (0, import_jsx_runtime56.jsx)(ToastAnnounceExclude, { asChild: true, children: (0, import_jsx_runtime56.jsx)(
      Primitive3.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, interactiveContext.onClose)
      }
    ) });
  }
);
ToastClose.displayName = CLOSE_NAME3;
var ToastAnnounceExclude = React66.forwardRef((props, forwardedRef) => {
  const { __scopeToast, altText, ...announceExcludeProps } = props;
  return (0, import_jsx_runtime56.jsx)(
    Primitive3.div,
    {
      "data-radix-toast-announce-exclude": "",
      "data-radix-toast-announce-alt": altText || void 0,
      ...announceExcludeProps,
      ref: forwardedRef
    }
  );
});
function getAnnounceTextContent(container) {
  const textContent = [];
  const childNodes = Array.from(container.childNodes);
  childNodes.forEach((node) => {
    if (node.nodeType === node.TEXT_NODE && node.textContent) textContent.push(node.textContent);
    if (isHTMLElement3(node)) {
      const isHidden2 = node.ariaHidden || node.hidden || node.style.display === "none";
      const isExcluded = node.dataset.radixToastAnnounceExclude === "";
      if (!isHidden2) {
        if (isExcluded) {
          const altText = node.dataset.radixToastAnnounceAlt;
          if (altText) textContent.push(altText);
        } else {
          textContent.push(...getAnnounceTextContent(node));
        }
      }
    }
  });
  return textContent;
}
function handleAndDispatchCustomEvent2(name, handler, detail, { discrete }) {
  const currentTarget = detail.originalEvent.currentTarget;
  const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail });
  if (handler) currentTarget.addEventListener(name, handler, { once: true });
  if (discrete) {
    dispatchDiscreteCustomEvent(currentTarget, event);
  } else {
    currentTarget.dispatchEvent(event);
  }
}
var isDeltaInDirection = (delta, direction, threshold = 0) => {
  const deltaX = Math.abs(delta.x);
  const deltaY = Math.abs(delta.y);
  const isDeltaX = deltaX > deltaY;
  if (direction === "left" || direction === "right") {
    return isDeltaX && deltaX > threshold;
  } else {
    return !isDeltaX && deltaY > threshold;
  }
};
function useNextFrame(callback = () => {
}) {
  const fn = useCallbackRef(callback);
  useLayoutEffect2(() => {
    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => raf2 = window.requestAnimationFrame(fn));
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [fn]);
}
function isHTMLElement3(node) {
  return node.nodeType === node.ELEMENT_NODE;
}
function getTabbableCandidates3(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function focusFirst5(candidates) {
  const previouslyFocusedElement = document.activeElement;
  return candidates.some((candidate) => {
    if (candidate === previouslyFocusedElement) return true;
    candidate.focus();
    return document.activeElement !== previouslyFocusedElement;
  });
}

// ../../node_modules/.pnpm/@radix-ui+react-toggle@1.1.10_@types+react-dom@19.2.3_@types+react@19.2.14__@types+reac_63d136f11f5f79b42c1373b9162ffc86/node_modules/@radix-ui/react-toggle/dist/index.mjs
var React67 = __toESM(require_react(), 1);
var import_jsx_runtime57 = __toESM(require_jsx_runtime(), 1);
var NAME7 = "Toggle";
var Toggle = React67.forwardRef((props, forwardedRef) => {
  const { pressed: pressedProp, defaultPressed, onPressedChange, ...buttonProps } = props;
  const [pressed, setPressed] = useControllableState({
    prop: pressedProp,
    onChange: onPressedChange,
    defaultProp: defaultPressed ?? false,
    caller: NAME7
  });
  return (0, import_jsx_runtime57.jsx)(
    Primitive3.button,
    {
      type: "button",
      "aria-pressed": pressed,
      "data-state": pressed ? "on" : "off",
      "data-disabled": props.disabled ? "" : void 0,
      ...buttonProps,
      ref: forwardedRef,
      onClick: composeEventHandlers(props.onClick, () => {
        if (!props.disabled) {
          setPressed(!pressed);
        }
      })
    }
  );
});
Toggle.displayName = NAME7;

// ../../node_modules/.pnpm/@radix-ui+react-toggle-group@1.1.11_@types+react-dom@19.2.3_@types+react@19.2.14__@type_0c124bdbaa351e80a671757a596f81ce/node_modules/@radix-ui/react-toggle-group/dist/index.mjs
var import_react54 = __toESM(require_react(), 1);
var import_jsx_runtime58 = __toESM(require_jsx_runtime(), 1);
var TOGGLE_GROUP_NAME = "ToggleGroup";
var [createToggleGroupContext, createToggleGroupScope] = createContextScope(TOGGLE_GROUP_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope6 = createRovingFocusGroupScope();
var ToggleGroup = import_react54.default.forwardRef((props, forwardedRef) => {
  const { type, ...toggleGroupProps } = props;
  if (type === "single") {
    const singleProps = toggleGroupProps;
    return (0, import_jsx_runtime58.jsx)(ToggleGroupImplSingle, { ...singleProps, ref: forwardedRef });
  }
  if (type === "multiple") {
    const multipleProps = toggleGroupProps;
    return (0, import_jsx_runtime58.jsx)(ToggleGroupImplMultiple, { ...multipleProps, ref: forwardedRef });
  }
  throw new Error(`Missing prop \`type\` expected on \`${TOGGLE_GROUP_NAME}\``);
});
ToggleGroup.displayName = TOGGLE_GROUP_NAME;
var [ToggleGroupValueProvider, useToggleGroupValueContext] = createToggleGroupContext(TOGGLE_GROUP_NAME);
var ToggleGroupImplSingle = import_react54.default.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {
    },
    ...toggleGroupSingleProps
  } = props;
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? "",
    onChange: onValueChange,
    caller: TOGGLE_GROUP_NAME
  });
  return (0, import_jsx_runtime58.jsx)(
    ToggleGroupValueProvider,
    {
      scope: props.__scopeToggleGroup,
      type: "single",
      value: import_react54.default.useMemo(() => value ? [value] : [], [value]),
      onItemActivate: setValue,
      onItemDeactivate: import_react54.default.useCallback(() => setValue(""), [setValue]),
      children: (0, import_jsx_runtime58.jsx)(ToggleGroupImpl, { ...toggleGroupSingleProps, ref: forwardedRef })
    }
  );
});
var ToggleGroupImplMultiple = import_react54.default.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {
    },
    ...toggleGroupMultipleProps
  } = props;
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
    caller: TOGGLE_GROUP_NAME
  });
  const handleButtonActivate = import_react54.default.useCallback(
    (itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue]
  );
  const handleButtonDeactivate = import_react54.default.useCallback(
    (itemValue) => setValue((prevValue = []) => prevValue.filter((value2) => value2 !== itemValue)),
    [setValue]
  );
  return (0, import_jsx_runtime58.jsx)(
    ToggleGroupValueProvider,
    {
      scope: props.__scopeToggleGroup,
      type: "multiple",
      value,
      onItemActivate: handleButtonActivate,
      onItemDeactivate: handleButtonDeactivate,
      children: (0, import_jsx_runtime58.jsx)(ToggleGroupImpl, { ...toggleGroupMultipleProps, ref: forwardedRef })
    }
  );
});
ToggleGroup.displayName = TOGGLE_GROUP_NAME;
var [ToggleGroupContext, useToggleGroupContext] = createToggleGroupContext(TOGGLE_GROUP_NAME);
var ToggleGroupImpl = import_react54.default.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeToggleGroup,
      disabled = false,
      rovingFocus = true,
      orientation,
      dir,
      loop = true,
      ...toggleGroupProps
    } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope6(__scopeToggleGroup);
    const direction = useDirection(dir);
    const commonProps = { role: "group", dir: direction, ...toggleGroupProps };
    return (0, import_jsx_runtime58.jsx)(ToggleGroupContext, { scope: __scopeToggleGroup, rovingFocus, disabled, children: rovingFocus ? (0, import_jsx_runtime58.jsx)(
      Root7,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation,
        dir: direction,
        loop,
        children: (0, import_jsx_runtime58.jsx)(Primitive3.div, { ...commonProps, ref: forwardedRef })
      }
    ) : (0, import_jsx_runtime58.jsx)(Primitive3.div, { ...commonProps, ref: forwardedRef }) });
  }
);
var ITEM_NAME10 = "ToggleGroupItem";
var ToggleGroupItem = import_react54.default.forwardRef(
  (props, forwardedRef) => {
    const valueContext = useToggleGroupValueContext(ITEM_NAME10, props.__scopeToggleGroup);
    const context = useToggleGroupContext(ITEM_NAME10, props.__scopeToggleGroup);
    const rovingFocusGroupScope = useRovingFocusGroupScope6(props.__scopeToggleGroup);
    const pressed = valueContext.value.includes(props.value);
    const disabled = context.disabled || props.disabled;
    const commonProps = { ...props, pressed, disabled };
    const ref = import_react54.default.useRef(null);
    return context.rovingFocus ? (0, import_jsx_runtime58.jsx)(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: pressed,
        ref,
        children: (0, import_jsx_runtime58.jsx)(ToggleGroupItemImpl, { ...commonProps, ref: forwardedRef })
      }
    ) : (0, import_jsx_runtime58.jsx)(ToggleGroupItemImpl, { ...commonProps, ref: forwardedRef });
  }
);
ToggleGroupItem.displayName = ITEM_NAME10;
var ToggleGroupItemImpl = import_react54.default.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToggleGroup, value, ...itemProps } = props;
    const valueContext = useToggleGroupValueContext(ITEM_NAME10, __scopeToggleGroup);
    const singleProps = { role: "radio", "aria-checked": props.pressed, "aria-pressed": void 0 };
    const typeProps = valueContext.type === "single" ? singleProps : void 0;
    return (0, import_jsx_runtime58.jsx)(
      Toggle,
      {
        ...typeProps,
        ...itemProps,
        ref: forwardedRef,
        onPressedChange: (pressed) => {
          if (pressed) {
            valueContext.onItemActivate(value);
          } else {
            valueContext.onItemDeactivate(value);
          }
        }
      }
    );
  }
);
var Root25 = ToggleGroup;
var Item23 = ToggleGroupItem;

// ../../node_modules/.pnpm/@radix-ui+react-toolbar@1.1.11_@types+react-dom@19.2.3_@types+react@19.2.14__@types+rea_0c21b1d71c2cf2b659e30aa892e5950d/node_modules/@radix-ui/react-toolbar/dist/index.mjs
var React69 = __toESM(require_react(), 1);
var import_jsx_runtime59 = __toESM(require_jsx_runtime(), 1);
var TOOLBAR_NAME = "Toolbar";
var [createToolbarContext, createToolbarScope] = createContextScope(TOOLBAR_NAME, [
  createRovingFocusGroupScope,
  createToggleGroupScope
]);
var useRovingFocusGroupScope7 = createRovingFocusGroupScope();
var useToggleGroupScope = createToggleGroupScope();
var [ToolbarProvider, useToolbarContext] = createToolbarContext(TOOLBAR_NAME);
var Toolbar = React69.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToolbar, orientation = "horizontal", dir, loop = true, ...toolbarProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope7(__scopeToolbar);
    const direction = useDirection(dir);
    return (0, import_jsx_runtime59.jsx)(ToolbarProvider, { scope: __scopeToolbar, orientation, dir: direction, children: (0, import_jsx_runtime59.jsx)(
      Root7,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation,
        dir: direction,
        loop,
        children: (0, import_jsx_runtime59.jsx)(
          Primitive3.div,
          {
            role: "toolbar",
            "aria-orientation": orientation,
            dir: direction,
            ...toolbarProps,
            ref: forwardedRef
          }
        )
      }
    ) });
  }
);
Toolbar.displayName = TOOLBAR_NAME;
var SEPARATOR_NAME6 = "ToolbarSeparator";
var ToolbarSeparator = React69.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToolbar, ...separatorProps } = props;
    const context = useToolbarContext(SEPARATOR_NAME6, __scopeToolbar);
    return (0, import_jsx_runtime59.jsx)(
      Root8,
      {
        orientation: context.orientation === "horizontal" ? "vertical" : "horizontal",
        ...separatorProps,
        ref: forwardedRef
      }
    );
  }
);
ToolbarSeparator.displayName = SEPARATOR_NAME6;
var BUTTON_NAME = "ToolbarButton";
var ToolbarButton = React69.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToolbar, ...buttonProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope7(__scopeToolbar);
    return (0, import_jsx_runtime59.jsx)(Item, { asChild: true, ...rovingFocusGroupScope, focusable: !props.disabled, children: (0, import_jsx_runtime59.jsx)(Primitive3.button, { type: "button", ...buttonProps, ref: forwardedRef }) });
  }
);
ToolbarButton.displayName = BUTTON_NAME;
var LINK_NAME2 = "ToolbarLink";
var ToolbarLink = React69.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToolbar, ...linkProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope7(__scopeToolbar);
    return (0, import_jsx_runtime59.jsx)(Item, { asChild: true, ...rovingFocusGroupScope, focusable: true, children: (0, import_jsx_runtime59.jsx)(
      Primitive3.a,
      {
        ...linkProps,
        ref: forwardedRef,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === " ") event.currentTarget.click();
        })
      }
    ) });
  }
);
ToolbarLink.displayName = LINK_NAME2;
var TOGGLE_GROUP_NAME2 = "ToolbarToggleGroup";
var ToolbarToggleGroup = React69.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToolbar, ...toggleGroupProps } = props;
    const context = useToolbarContext(TOGGLE_GROUP_NAME2, __scopeToolbar);
    const toggleGroupScope = useToggleGroupScope(__scopeToolbar);
    return (0, import_jsx_runtime59.jsx)(
      Root25,
      {
        "data-orientation": context.orientation,
        dir: context.dir,
        ...toggleGroupScope,
        ...toggleGroupProps,
        ref: forwardedRef,
        rovingFocus: false
      }
    );
  }
);
ToolbarToggleGroup.displayName = TOGGLE_GROUP_NAME2;
var TOGGLE_ITEM_NAME = "ToolbarToggleItem";
var ToolbarToggleItem = React69.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToolbar, ...toggleItemProps } = props;
    const toggleGroupScope = useToggleGroupScope(__scopeToolbar);
    const scope = { __scopeToolbar: props.__scopeToolbar };
    return (0, import_jsx_runtime59.jsx)(ToolbarButton, { asChild: true, ...scope, children: (0, import_jsx_runtime59.jsx)(Item23, { ...toggleGroupScope, ...toggleItemProps, ref: forwardedRef }) });
  }
);
ToolbarToggleItem.displayName = TOGGLE_ITEM_NAME;

// ../../node_modules/.pnpm/@radix-ui+react-tooltip@1.2.8_@types+react-dom@19.2.3_@types+react@19.2.14__@types+reac_9074d9fb06315b089b2bee17c4c65951/node_modules/@radix-ui/react-tooltip/dist/index.mjs
var React70 = __toESM(require_react(), 1);
var import_jsx_runtime60 = __toESM(require_jsx_runtime(), 1);
var [createTooltipContext, createTooltipScope] = createContextScope("Tooltip", [
  createPopperScope
]);
var usePopperScope5 = createPopperScope();
var PROVIDER_NAME2 = "TooltipProvider";
var DEFAULT_DELAY_DURATION = 700;
var TOOLTIP_OPEN = "tooltip.open";
var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME2);
var TooltipProvider = (props) => {
  const {
    __scopeTooltip,
    delayDuration = DEFAULT_DELAY_DURATION,
    skipDelayDuration = 300,
    disableHoverableContent = false,
    children
  } = props;
  const isOpenDelayedRef = React70.useRef(true);
  const isPointerInTransitRef = React70.useRef(false);
  const skipDelayTimerRef = React70.useRef(0);
  React70.useEffect(() => {
    const skipDelayTimer = skipDelayTimerRef.current;
    return () => window.clearTimeout(skipDelayTimer);
  }, []);
  return (0, import_jsx_runtime60.jsx)(
    TooltipProviderContextProvider,
    {
      scope: __scopeTooltip,
      isOpenDelayedRef,
      delayDuration,
      onOpen: React70.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        isOpenDelayedRef.current = false;
      }, []),
      onClose: React70.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        skipDelayTimerRef.current = window.setTimeout(
          () => isOpenDelayedRef.current = true,
          skipDelayDuration
        );
      }, [skipDelayDuration]),
      isPointerInTransitRef,
      onPointerInTransitChange: React70.useCallback((inTransit) => {
        isPointerInTransitRef.current = inTransit;
      }, []),
      disableHoverableContent,
      children
    }
  );
};
TooltipProvider.displayName = PROVIDER_NAME2;
var TOOLTIP_NAME = "Tooltip";
var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
var Tooltip = (props) => {
  const {
    __scopeTooltip,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    disableHoverableContent: disableHoverableContentProp,
    delayDuration: delayDurationProp
  } = props;
  const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
  const popperScope = usePopperScope5(__scopeTooltip);
  const [trigger, setTrigger] = React70.useState(null);
  const contentId = useId2();
  const openTimerRef = React70.useRef(0);
  const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent;
  const delayDuration = delayDurationProp ?? providerContext.delayDuration;
  const wasOpenDelayedRef = React70.useRef(false);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: (open2) => {
      if (open2) {
        providerContext.onOpen();
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
      } else {
        providerContext.onClose();
      }
      onOpenChange == null ? void 0 : onOpenChange(open2);
    },
    caller: TOOLTIP_NAME
  });
  const stateAttribute = React70.useMemo(() => {
    return open ? wasOpenDelayedRef.current ? "delayed-open" : "instant-open" : "closed";
  }, [open]);
  const handleOpen = React70.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    wasOpenDelayedRef.current = false;
    setOpen(true);
  }, [setOpen]);
  const handleClose = React70.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    setOpen(false);
  }, [setOpen]);
  const handleDelayedOpen = React70.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = window.setTimeout(() => {
      wasOpenDelayedRef.current = true;
      setOpen(true);
      openTimerRef.current = 0;
    }, delayDuration);
  }, [delayDuration, setOpen]);
  React70.useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = 0;
      }
    };
  }, []);
  return (0, import_jsx_runtime60.jsx)(Root22, { ...popperScope, children: (0, import_jsx_runtime60.jsx)(
    TooltipContextProvider,
    {
      scope: __scopeTooltip,
      contentId,
      open,
      stateAttribute,
      trigger,
      onTriggerChange: setTrigger,
      onTriggerEnter: React70.useCallback(() => {
        if (providerContext.isOpenDelayedRef.current) handleDelayedOpen();
        else handleOpen();
      }, [providerContext.isOpenDelayedRef, handleDelayedOpen, handleOpen]),
      onTriggerLeave: React70.useCallback(() => {
        if (disableHoverableContent) {
          handleClose();
        } else {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = 0;
        }
      }, [handleClose, disableHoverableContent]),
      onOpen: handleOpen,
      onClose: handleClose,
      disableHoverableContent,
      children
    }
  ) });
};
Tooltip.displayName = TOOLTIP_NAME;
var TRIGGER_NAME14 = "TooltipTrigger";
var TooltipTrigger = React70.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...triggerProps } = props;
    const context = useTooltipContext(TRIGGER_NAME14, __scopeTooltip);
    const providerContext = useTooltipProviderContext(TRIGGER_NAME14, __scopeTooltip);
    const popperScope = usePopperScope5(__scopeTooltip);
    const ref = React70.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onTriggerChange);
    const isPointerDownRef = React70.useRef(false);
    const hasPointerMoveOpenedRef = React70.useRef(false);
    const handlePointerUp = React70.useCallback(() => isPointerDownRef.current = false, []);
    React70.useEffect(() => {
      return () => document.removeEventListener("pointerup", handlePointerUp);
    }, [handlePointerUp]);
    return (0, import_jsx_runtime60.jsx)(Anchor, { asChild: true, ...popperScope, children: (0, import_jsx_runtime60.jsx)(
      Primitive3.button,
      {
        "aria-describedby": context.open ? context.contentId : void 0,
        "data-state": context.stateAttribute,
        ...triggerProps,
        ref: composedRefs,
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          if (event.pointerType === "touch") return;
          if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
            context.onTriggerEnter();
            hasPointerMoveOpenedRef.current = true;
          }
        }),
        onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
          context.onTriggerLeave();
          hasPointerMoveOpenedRef.current = false;
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, () => {
          if (context.open) {
            context.onClose();
          }
          isPointerDownRef.current = true;
          document.addEventListener("pointerup", handlePointerUp, { once: true });
        }),
        onFocus: composeEventHandlers(props.onFocus, () => {
          if (!isPointerDownRef.current) context.onOpen();
        }),
        onBlur: composeEventHandlers(props.onBlur, context.onClose),
        onClick: composeEventHandlers(props.onClick, context.onClose)
      }
    ) });
  }
);
TooltipTrigger.displayName = TRIGGER_NAME14;
var PORTAL_NAME11 = "TooltipPortal";
var [PortalProvider5, usePortalContext5] = createTooltipContext(PORTAL_NAME11, {
  forceMount: void 0
});
var TooltipPortal = (props) => {
  const { __scopeTooltip, forceMount, children, container } = props;
  const context = useTooltipContext(PORTAL_NAME11, __scopeTooltip);
  return (0, import_jsx_runtime60.jsx)(PortalProvider5, { scope: __scopeTooltip, forceMount, children: (0, import_jsx_runtime60.jsx)(Presence, { present: forceMount || context.open, children: (0, import_jsx_runtime60.jsx)(Portal, { asChild: true, container, children }) }) });
};
TooltipPortal.displayName = PORTAL_NAME11;
var CONTENT_NAME15 = "TooltipContent";
var TooltipContent = React70.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext5(CONTENT_NAME15, props.__scopeTooltip);
    const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME15, props.__scopeTooltip);
    return (0, import_jsx_runtime60.jsx)(Presence, { present: forceMount || context.open, children: context.disableHoverableContent ? (0, import_jsx_runtime60.jsx)(TooltipContentImpl, { side, ...contentProps, ref: forwardedRef }) : (0, import_jsx_runtime60.jsx)(TooltipContentHoverable, { side, ...contentProps, ref: forwardedRef }) });
  }
);
var TooltipContentHoverable = React70.forwardRef((props, forwardedRef) => {
  const context = useTooltipContext(CONTENT_NAME15, props.__scopeTooltip);
  const providerContext = useTooltipProviderContext(CONTENT_NAME15, props.__scopeTooltip);
  const ref = React70.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const [pointerGraceArea, setPointerGraceArea] = React70.useState(null);
  const { trigger, onClose } = context;
  const content = ref.current;
  const { onPointerInTransitChange } = providerContext;
  const handleRemoveGraceArea = React70.useCallback(() => {
    setPointerGraceArea(null);
    onPointerInTransitChange(false);
  }, [onPointerInTransitChange]);
  const handleCreateGraceArea = React70.useCallback(
    (event, hoverTarget) => {
      const currentTarget = event.currentTarget;
      const exitPoint = { x: event.clientX, y: event.clientY };
      const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
      const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
      const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
      const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
      setPointerGraceArea(graceArea);
      onPointerInTransitChange(true);
    },
    [onPointerInTransitChange]
  );
  React70.useEffect(() => {
    return () => handleRemoveGraceArea();
  }, [handleRemoveGraceArea]);
  React70.useEffect(() => {
    if (trigger && content) {
      const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
      const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
      trigger.addEventListener("pointerleave", handleTriggerLeave);
      content.addEventListener("pointerleave", handleContentLeave);
      return () => {
        trigger.removeEventListener("pointerleave", handleTriggerLeave);
        content.removeEventListener("pointerleave", handleContentLeave);
      };
    }
  }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);
  React70.useEffect(() => {
    if (pointerGraceArea) {
      const handleTrackPointerGrace = (event) => {
        const target = event.target;
        const pointerPosition = { x: event.clientX, y: event.clientY };
        const hasEnteredTarget = (trigger == null ? void 0 : trigger.contains(target)) || (content == null ? void 0 : content.contains(target));
        const isPointerOutsideGraceArea = !isPointInPolygon2(pointerPosition, pointerGraceArea);
        if (hasEnteredTarget) {
          handleRemoveGraceArea();
        } else if (isPointerOutsideGraceArea) {
          handleRemoveGraceArea();
          onClose();
        }
      };
      document.addEventListener("pointermove", handleTrackPointerGrace);
      return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
    }
  }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea]);
  return (0, import_jsx_runtime60.jsx)(TooltipContentImpl, { ...props, ref: composedRefs });
});
var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
var Slottable4 = createSlottable2("TooltipContent");
var TooltipContentImpl = React70.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTooltip,
      children,
      "aria-label": ariaLabel,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...contentProps
    } = props;
    const context = useTooltipContext(CONTENT_NAME15, __scopeTooltip);
    const popperScope = usePopperScope5(__scopeTooltip);
    const { onClose } = context;
    React70.useEffect(() => {
      document.addEventListener(TOOLTIP_OPEN, onClose);
      return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
    }, [onClose]);
    React70.useEffect(() => {
      if (context.trigger) {
        const handleScroll2 = (event) => {
          const target = event.target;
          if (target == null ? void 0 : target.contains(context.trigger)) onClose();
        };
        window.addEventListener("scroll", handleScroll2, { capture: true });
        return () => window.removeEventListener("scroll", handleScroll2, { capture: true });
      }
    }, [context.trigger, onClose]);
    return (0, import_jsx_runtime60.jsx)(
      DismissableLayer,
      {
        asChild: true,
        disableOutsidePointerEvents: false,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside: (event) => event.preventDefault(),
        onDismiss: onClose,
        children: (0, import_jsx_runtime60.jsxs)(
          Content3,
          {
            "data-state": context.stateAttribute,
            ...popperScope,
            ...contentProps,
            ref: forwardedRef,
            style: {
              ...contentProps.style,
              // re-namespace exposed content custom properties
              ...{
                "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
                "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
                "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
                "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
                "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
              }
            },
            children: [
              (0, import_jsx_runtime60.jsx)(Slottable4, { children }),
              (0, import_jsx_runtime60.jsx)(VisuallyHiddenContentContextProvider, { scope: __scopeTooltip, isInside: true, children: (0, import_jsx_runtime60.jsx)(Root2, { id: context.contentId, role: "tooltip", children: ariaLabel || children }) })
            ]
          }
        )
      }
    );
  }
);
TooltipContent.displayName = CONTENT_NAME15;
var ARROW_NAME9 = "TooltipArrow";
var TooltipArrow = React70.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...arrowProps } = props;
    const popperScope = usePopperScope5(__scopeTooltip);
    const visuallyHiddenContentContext = useVisuallyHiddenContentContext(
      ARROW_NAME9,
      __scopeTooltip
    );
    return visuallyHiddenContentContext.isInside ? null : (0, import_jsx_runtime60.jsx)(Arrow2, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
TooltipArrow.displayName = ARROW_NAME9;
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const paddedExitPoints = [];
  switch (exitSide) {
    case "top":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "bottom":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y - padding }
      );
      break;
    case "left":
      paddedExitPoints.push(
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "right":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x - padding, y: exitPoint.y + padding }
      );
      break;
  }
  return paddedExitPoints;
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom }
  ];
}
function isPointInPolygon2(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const ii = polygon[i];
    const jj = polygon[j];
    const xi = ii.x;
    const yi = ii.y;
    const xj = jj.x;
    const yj = jj.y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
    return upperHull;
  } else {
    return upperHull.concat(lowerHull);
  }
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBarMore/scope.js
var useDropdownMenuScope = dist_exports9.createDropdownMenuScope();

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBarMore/ActionBarMoreRoot.js
var ActionBarMorePrimitiveRoot = ({ __scopeActionBarMore, open, onOpenChange, ...rest }) => {
  const scope = useDropdownMenuScope(__scopeActionBarMore);
  const actionBarInteraction = useActionBarInteractionContext();
  const releaseInteractionLockRef = (0, import_react55.useRef)(null);
  const isControlled = open !== void 0;
  const setInteractionOpen = (0, import_react55.useCallback)((nextOpen) => {
    var _a2;
    if (nextOpen) {
      if (releaseInteractionLockRef.current)
        return;
      releaseInteractionLockRef.current = (actionBarInteraction == null ? void 0 : actionBarInteraction.acquireInteractionLock()) ?? null;
      return;
    }
    (_a2 = releaseInteractionLockRef.current) == null ? void 0 : _a2.call(releaseInteractionLockRef);
    releaseInteractionLockRef.current = null;
  }, [actionBarInteraction]);
  const handleOpenChange = (0, import_react55.useCallback)((nextOpen) => {
    if (!isControlled) {
      setInteractionOpen(nextOpen);
    }
    onOpenChange == null ? void 0 : onOpenChange(nextOpen);
  }, [isControlled, setInteractionOpen, onOpenChange]);
  (0, import_react55.useEffect)(() => {
    if (!isControlled)
      return;
    setInteractionOpen(Boolean(open));
  }, [isControlled, open, setInteractionOpen]);
  (0, import_react55.useEffect)(() => {
    return () => {
      var _a2;
      (_a2 = releaseInteractionLockRef.current) == null ? void 0 : _a2.call(releaseInteractionLockRef);
      releaseInteractionLockRef.current = null;
    };
  }, []);
  return (0, import_jsx_runtime61.jsx)(dist_exports9.Root, { ...scope, ...rest, ...open !== void 0 ? { open } : null, onOpenChange: handleOpenChange });
};
ActionBarMorePrimitiveRoot.displayName = "ActionBarMorePrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBarMore/ActionBarMoreTrigger.js
var import_jsx_runtime62 = __toESM(require_jsx_runtime(), 1);
var import_react56 = __toESM(require_react(), 1);
var ActionBarMorePrimitiveTrigger = (0, import_react56.forwardRef)(({ __scopeActionBarMore, ...rest }, ref) => {
  const scope = useDropdownMenuScope(__scopeActionBarMore);
  return (0, import_jsx_runtime62.jsx)(dist_exports9.Trigger, { ...scope, ...rest, ref });
});
ActionBarMorePrimitiveTrigger.displayName = "ActionBarMorePrimitive.Trigger";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBarMore/ActionBarMoreContent.js
var import_jsx_runtime63 = __toESM(require_jsx_runtime(), 1);
var import_react57 = __toESM(require_react(), 1);
var ActionBarMorePrimitiveContent = (0, import_react57.forwardRef)(({ __scopeActionBarMore, portalProps, sideOffset = 4, ...props }, forwardedRef) => {
  const scope = useDropdownMenuScope(__scopeActionBarMore);
  return (0, import_jsx_runtime63.jsx)(dist_exports9.Portal, { ...scope, ...portalProps, children: (0, import_jsx_runtime63.jsx)(dist_exports9.Content, { ...scope, ...props, ref: forwardedRef, sideOffset }) });
});
ActionBarMorePrimitiveContent.displayName = "ActionBarMorePrimitive.Content";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBarMore/ActionBarMoreItem.js
var import_jsx_runtime64 = __toESM(require_jsx_runtime(), 1);
var import_react58 = __toESM(require_react(), 1);
var ActionBarMorePrimitiveItem = (0, import_react58.forwardRef)(({ __scopeActionBarMore, ...rest }, ref) => {
  const scope = useDropdownMenuScope(__scopeActionBarMore);
  return (0, import_jsx_runtime64.jsx)(dist_exports9.Item, { ...scope, ...rest, ref });
});
ActionBarMorePrimitiveItem.displayName = "ActionBarMorePrimitive.Item";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/actionBarMore/ActionBarMoreSeparator.js
var import_jsx_runtime65 = __toESM(require_jsx_runtime(), 1);
var import_react59 = __toESM(require_react(), 1);
var ActionBarMorePrimitiveSeparator = (0, import_react59.forwardRef)(({ __scopeActionBarMore, ...rest }, ref) => {
  const scope = useDropdownMenuScope(__scopeActionBarMore);
  return (0, import_jsx_runtime65.jsx)(dist_exports9.Separator, { ...scope, ...rest, ref });
});
ActionBarMorePrimitiveSeparator.displayName = "ActionBarMorePrimitive.Separator";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/assistantModal.js
var assistantModal_exports = {};
__export(assistantModal_exports, {
  Anchor: () => AssistantModalPrimitiveAnchor,
  Content: () => AssistantModalPrimitiveContent,
  Root: () => AssistantModalPrimitiveRoot,
  Trigger: () => AssistantModalPrimitiveTrigger
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/assistantModal/AssistantModalRoot.js
var import_jsx_runtime66 = __toESM(require_jsx_runtime(), 1);
var import_react60 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/assistantModal/scope.js
var usePopoverScope = dist_exports11.createPopoverScope();

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/assistantModal/AssistantModalRoot.js
var useAssistantModalOpenState = ({ defaultOpen = false, unstable_openOnRunStart = true }) => {
  const state = (0, import_react60.useState)(defaultOpen);
  const [, setOpen] = state;
  const aui = useAui();
  (0, import_react60.useEffect)(() => {
    if (!unstable_openOnRunStart)
      return void 0;
    return aui.on("thread.runStart", () => {
      setOpen(true);
    });
  }, [unstable_openOnRunStart, aui]);
  return state;
};
var AssistantModalPrimitiveRoot = ({ __scopeAssistantModal, defaultOpen, unstable_openOnRunStart, open, onOpenChange, ...rest }) => {
  const scope = usePopoverScope(__scopeAssistantModal);
  const [modalOpen, setOpen] = useAssistantModalOpenState({
    defaultOpen,
    unstable_openOnRunStart
  });
  const openChangeHandler = (open2) => {
    onOpenChange == null ? void 0 : onOpenChange(open2);
    setOpen(open2);
  };
  return (0, import_jsx_runtime66.jsx)(dist_exports11.Root, { ...scope, open: open === void 0 ? modalOpen : open, onOpenChange: openChangeHandler, ...rest });
};
AssistantModalPrimitiveRoot.displayName = "AssistantModalPrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/assistantModal/AssistantModalTrigger.js
var import_jsx_runtime67 = __toESM(require_jsx_runtime(), 1);
var import_react61 = __toESM(require_react(), 1);
var AssistantModalPrimitiveTrigger = (0, import_react61.forwardRef)(({ __scopeAssistantModal, ...rest }, ref) => {
  const scope = usePopoverScope(__scopeAssistantModal);
  return (0, import_jsx_runtime67.jsx)(dist_exports11.Trigger, { ...scope, ...rest, ref });
});
AssistantModalPrimitiveTrigger.displayName = "AssistantModalPrimitive.Trigger";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/assistantModal/AssistantModalContent.js
var import_jsx_runtime68 = __toESM(require_jsx_runtime(), 1);
var import_react62 = __toESM(require_react(), 1);
var AssistantModalPrimitiveContent = (0, import_react62.forwardRef)(({ __scopeAssistantModal, side, align, onInteractOutside, dissmissOnInteractOutside = false, portalProps, ...props }, forwardedRef) => {
  const scope = usePopoverScope(__scopeAssistantModal);
  return (0, import_jsx_runtime68.jsx)(dist_exports11.Portal, { ...scope, ...portalProps, children: (0, import_jsx_runtime68.jsx)(dist_exports11.Content, { ...scope, ...props, ref: forwardedRef, side: side ?? "top", align: align ?? "end", onInteractOutside: composeEventHandlers(onInteractOutside, dissmissOnInteractOutside ? void 0 : (e) => e.preventDefault()) }) });
});
AssistantModalPrimitiveContent.displayName = "AssistantModalPrimitive.Content";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/assistantModal/AssistantModalAnchor.js
var import_jsx_runtime69 = __toESM(require_jsx_runtime(), 1);
var import_react63 = __toESM(require_react(), 1);
var AssistantModalPrimitiveAnchor = (0, import_react63.forwardRef)(({ __scopeAssistantModal, ...rest }, ref) => {
  const scope = usePopoverScope(__scopeAssistantModal);
  return (0, import_jsx_runtime69.jsx)(dist_exports11.Anchor, { ...scope, ...rest, ref });
});
AssistantModalPrimitiveAnchor.displayName = "AssistantModalPrimitive.Anchor";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/attachment.js
var attachment_exports = {};
__export(attachment_exports, {
  Name: () => AttachmentPrimitiveName,
  Remove: () => AttachmentPrimitiveRemove,
  Root: () => AttachmentPrimitiveRoot,
  unstable_Thumb: () => AttachmentPrimitiveThumb
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/attachment/AttachmentRoot.js
var import_jsx_runtime70 = __toESM(require_jsx_runtime(), 1);
var import_react64 = __toESM(require_react(), 1);
var AttachmentPrimitiveRoot = (0, import_react64.forwardRef)((props, ref) => {
  return (0, import_jsx_runtime70.jsx)(Primitive2.div, { ...props, ref });
});
AttachmentPrimitiveRoot.displayName = "AttachmentPrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/attachment/AttachmentThumb.js
var import_jsx_runtime71 = __toESM(require_jsx_runtime(), 1);
var import_react65 = __toESM(require_react(), 1);
var AttachmentPrimitiveThumb = (0, import_react65.forwardRef)((props, ref) => {
  const ext = useAuiState((s) => {
    const parts = s.attachment.name.split(".");
    return parts.length > 1 ? parts.pop() : "";
  });
  return (0, import_jsx_runtime71.jsxs)(Primitive2.div, { ...props, ref, children: [".", ext] });
});
AttachmentPrimitiveThumb.displayName = "AttachmentPrimitive.unstable_Thumb";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/attachment/AttachmentName.js
var import_jsx_runtime72 = __toESM(require_jsx_runtime(), 1);
var AttachmentPrimitiveName = () => {
  const name = useAuiState((s) => s.attachment.name);
  return (0, import_jsx_runtime72.jsx)(import_jsx_runtime72.Fragment, { children: name });
};
AttachmentPrimitiveName.displayName = "AttachmentPrimitive.Name";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/attachment/AttachmentRemove.js
var import_react66 = __toESM(require_react(), 1);
var useAttachmentRemove = () => {
  const aui = useAui();
  const handleRemoveAttachment = (0, import_react66.useCallback)(() => {
    aui.attachment().remove();
  }, [aui]);
  return handleRemoveAttachment;
};
var AttachmentPrimitiveRemove = createActionButton("AttachmentPrimitive.Remove", useAttachmentRemove);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/branchPicker.js
var branchPicker_exports = {};
__export(branchPicker_exports, {
  Count: () => BranchPickerPrimitiveCount,
  Next: () => BranchPickerPrimitiveNext,
  Number: () => BranchPickerPrimitiveNumber,
  Previous: () => BranchPickerPrimitivePrevious,
  Root: () => BranchPickerPrimitiveRoot
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerNext.js
var useBranchPickerNext2 = () => {
  const { disabled, next } = useBranchPickerNext();
  if (disabled)
    return null;
  return next;
};
var BranchPickerPrimitiveNext = createActionButton("BranchPickerPrimitive.Next", useBranchPickerNext2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerPrevious.js
var useBranchPickerPrevious2 = () => {
  const { disabled, previous } = useBranchPickerPrevious();
  if (disabled)
    return null;
  return previous;
};
var BranchPickerPrimitivePrevious = createActionButton("BranchPickerPrimitive.Previous", useBranchPickerPrevious2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerCount.js
var import_jsx_runtime73 = __toESM(require_jsx_runtime(), 1);
var useBranchPickerCount = () => {
  const branchCount = useAuiState((s) => s.message.branchCount);
  return branchCount;
};
var BranchPickerPrimitiveCount = () => {
  const branchCount = useBranchPickerCount();
  return (0, import_jsx_runtime73.jsx)(import_jsx_runtime73.Fragment, { children: branchCount });
};
BranchPickerPrimitiveCount.displayName = "BranchPickerPrimitive.Count";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerNumber.js
var import_jsx_runtime74 = __toESM(require_jsx_runtime(), 1);
var useBranchPickerNumber = () => {
  const branchNumber = useAuiState((s) => s.message.branchNumber);
  return branchNumber;
};
var BranchPickerPrimitiveNumber = () => {
  const branchNumber = useBranchPickerNumber();
  return (0, import_jsx_runtime74.jsx)(import_jsx_runtime74.Fragment, { children: branchNumber });
};
BranchPickerPrimitiveNumber.displayName = "BranchPickerPrimitive.Number";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerRoot.js
var import_jsx_runtime75 = __toESM(require_jsx_runtime(), 1);
var import_react69 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/message/MessageIf.js
var useMessageIf = (props) => {
  return useAuiState((s) => {
    var _a2;
    const { role, attachments, parts, branchCount, isLast, speech, isCopied, isHovering } = s.message;
    if (props.hasBranches === true && branchCount < 2)
      return false;
    if (props.user && role !== "user")
      return false;
    if (props.assistant && role !== "assistant")
      return false;
    if (props.system && role !== "system")
      return false;
    if (props.lastOrHover === true && !isHovering && !isLast)
      return false;
    if (props.last !== void 0 && props.last !== isLast)
      return false;
    if (props.copied === true && !isCopied)
      return false;
    if (props.copied === false && isCopied)
      return false;
    if (props.speaking === true && speech == null)
      return false;
    if (props.speaking === false && speech != null)
      return false;
    if (props.hasAttachments === true && (role !== "user" || !(attachments == null ? void 0 : attachments.length)))
      return false;
    if (props.hasAttachments === false && role === "user" && !!(attachments == null ? void 0 : attachments.length))
      return false;
    if (props.hasContent === true && parts.length === 0)
      return false;
    if (props.hasContent === false && parts.length > 0)
      return false;
    if (props.submittedFeedback !== void 0 && (((_a2 = s.message.metadata.submittedFeedback) == null ? void 0 : _a2.type) ?? null) !== props.submittedFeedback)
      return false;
    return true;
  });
};
var MessagePrimitiveIf = ({ children, ...query }) => {
  const result = useMessageIf(query);
  return result ? children : null;
};
MessagePrimitiveIf.displayName = "MessagePrimitive.If";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/branchPicker/BranchPickerRoot.js
var BranchPickerPrimitiveRoot = (0, import_react69.forwardRef)(({ hideWhenSingleBranch, ...rest }, ref) => {
  return (0, import_jsx_runtime75.jsx)(MessagePrimitiveIf, { hasBranches: hideWhenSingleBranch ? true : void 0, children: (0, import_jsx_runtime75.jsx)(Primitive2.div, { ...rest, ref }) });
});
BranchPickerPrimitiveRoot.displayName = "BranchPickerPrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/chainOfThought.js
var chainOfThought_exports = {};
__export(chainOfThought_exports, {
  AccordionTrigger: () => ChainOfThoughtPrimitiveAccordionTrigger,
  Parts: () => ChainOfThoughtPrimitiveParts,
  Root: () => ChainOfThoughtPrimitiveRoot
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/chainOfThought/ChainOfThoughtRoot.js
var import_jsx_runtime76 = __toESM(require_jsx_runtime(), 1);
var import_react70 = __toESM(require_react(), 1);
var ChainOfThoughtPrimitiveRoot = (0, import_react70.forwardRef)((props, ref) => {
  return (0, import_jsx_runtime76.jsx)(Primitive2.div, { ...props, ref });
});
ChainOfThoughtPrimitiveRoot.displayName = "ChainOfThoughtPrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/chainOfThought/ChainOfThoughtAccordionTrigger.js
var import_react71 = __toESM(require_react(), 1);
var useChainOfThoughtAccordionTrigger = () => {
  const aui = useAui();
  const collapsed = useAuiState((s) => s.chainOfThought.collapsed);
  const callback = (0, import_react71.useCallback)(() => {
    aui.chainOfThought().setCollapsed(!collapsed);
  }, [aui, collapsed]);
  return callback;
};
var ChainOfThoughtPrimitiveAccordionTrigger = createActionButton("ChainOfThoughtPrimitive.AccordionTrigger", useChainOfThoughtAccordionTrigger);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer.js
var composer_exports = {};
__export(composer_exports, {
  AddAttachment: () => ComposerPrimitiveAddAttachment,
  AttachmentByIndex: () => ComposerPrimitiveAttachmentByIndex,
  AttachmentDropzone: () => ComposerPrimitiveAttachmentDropzone,
  Attachments: () => ComposerPrimitiveAttachments,
  Cancel: () => ComposerPrimitiveCancel,
  Dictate: () => ComposerPrimitiveDictate,
  DictationTranscript: () => ComposerPrimitiveDictationTranscript,
  If: () => ComposerPrimitiveIf,
  Input: () => ComposerPrimitiveInput,
  Queue: () => ComposerPrimitiveQueue,
  Quote: () => ComposerPrimitiveQuote,
  QuoteDismiss: () => ComposerPrimitiveQuoteDismiss,
  QuoteText: () => ComposerPrimitiveQuoteText,
  Root: () => ComposerPrimitiveRoot,
  Send: () => ComposerPrimitiveSend,
  StopDictation: () => ComposerPrimitiveStopDictation,
  Unstable_MentionBack: () => ComposerPrimitiveTriggerPopoverBack,
  Unstable_MentionCategories: () => ComposerPrimitiveTriggerPopoverCategories,
  Unstable_MentionCategoryItem: () => ComposerPrimitiveTriggerPopoverCategoryItem,
  Unstable_MentionItem: () => ComposerPrimitiveTriggerPopoverItem,
  Unstable_MentionItems: () => ComposerPrimitiveTriggerPopoverItems,
  Unstable_MentionPopover: () => ComposerPrimitiveTriggerPopoverPopover,
  Unstable_MentionRoot: () => ComposerPrimitiveMentionRoot,
  Unstable_SlashCommandRoot: () => ComposerPrimitiveSlashCommandRoot,
  Unstable_TriggerPopoverBack: () => ComposerPrimitiveTriggerPopoverBack,
  Unstable_TriggerPopoverCategories: () => ComposerPrimitiveTriggerPopoverCategories,
  Unstable_TriggerPopoverCategoryItem: () => ComposerPrimitiveTriggerPopoverCategoryItem,
  Unstable_TriggerPopoverItem: () => ComposerPrimitiveTriggerPopoverItem,
  Unstable_TriggerPopoverItems: () => ComposerPrimitiveTriggerPopoverItems,
  Unstable_TriggerPopoverPopover: () => ComposerPrimitiveTriggerPopoverPopover,
  Unstable_TriggerPopoverRoot: () => ComposerPrimitiveTriggerPopoverRoot,
  unstable_useMentionContext: () => useMentionContext,
  unstable_useMentionContextOptional: () => useMentionContextOptional,
  unstable_useTriggerPopoverContext: () => useTriggerPopoverContext,
  unstable_useTriggerPopoverContextOptional: () => useTriggerPopoverContextOptional
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerRoot.js
var import_jsx_runtime77 = __toESM(require_jsx_runtime(), 1);
var import_react75 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerSend.js
var import_react73 = __toESM(require_react(), 1);
var useComposerSend2 = () => {
  const { disabled, send } = useComposerSend();
  const callback = (0, import_react73.useCallback)(() => send(), [send]);
  if (disabled)
    return null;
  return callback;
};
var ComposerPrimitiveSend = createActionButton("ComposerPrimitive.Send", useComposerSend2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerRoot.js
var ComposerPrimitiveRoot = (0, import_react75.forwardRef)(({ onSubmit, ...rest }, forwardedRef) => {
  const send = useComposerSend2();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!send)
      return;
    send();
  };
  return (0, import_jsx_runtime77.jsx)(Primitive2.form, { ...rest, ref: forwardedRef, onSubmit: composeEventHandlers(onSubmit, handleSubmit) });
});
ComposerPrimitiveRoot.displayName = "ComposerPrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerInput.js
var import_jsx_runtime79 = __toESM(require_jsx_runtime(), 1);
var import_react81 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@babel+runtime@7.29.2/node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

// ../../node_modules/.pnpm/@babel+runtime@7.29.2/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}

// ../../node_modules/.pnpm/react-textarea-autosize@8.5.9_@types+react@19.2.14_react@19.2.4/node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.development.esm.js
var React73 = __toESM(require_react());

// ../../node_modules/.pnpm/use-latest@1.3.0_@types+react@19.2.14_react@19.2.4/node_modules/use-latest/dist/use-latest.esm.js
var import_react77 = __toESM(require_react());

// ../../node_modules/.pnpm/use-isomorphic-layout-effect@1.2.1_@types+react@19.2.14_react@19.2.4/node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js
var import_react76 = __toESM(require_react());
var index2 = import_react76.useLayoutEffect;

// ../../node_modules/.pnpm/use-latest@1.3.0_@types+react@19.2.14_react@19.2.4/node_modules/use-latest/dist/use-latest.esm.js
var useLatest = function useLatest2(value) {
  var ref = import_react77.default.useRef(value);
  index2(function() {
    ref.current = value;
  });
  return ref;
};

// ../../node_modules/.pnpm/use-composed-ref@1.4.0_@types+react@19.2.14_react@19.2.4/node_modules/use-composed-ref/dist/use-composed-ref.esm.js
var import_react78 = __toESM(require_react());
var updateRef = function updateRef2(ref, value) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  ref.current = value;
};
var useComposedRef = function useComposedRef2(libRef, userRef) {
  var prevUserRef = import_react78.default.useRef();
  return import_react78.default.useCallback(function(instance) {
    libRef.current = instance;
    if (prevUserRef.current) {
      updateRef(prevUserRef.current, null);
    }
    prevUserRef.current = userRef;
    if (!userRef) {
      return;
    }
    updateRef(userRef, instance);
  }, [userRef]);
};

// ../../node_modules/.pnpm/react-textarea-autosize@8.5.9_@types+react@19.2.14_react@19.2.4/node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.development.esm.js
var HIDDEN_TEXTAREA_STYLE = {
  "min-height": "0",
  "max-height": "none",
  height: "0",
  visibility: "hidden",
  overflow: "hidden",
  position: "absolute",
  "z-index": "-1000",
  top: "0",
  right: "0",
  display: "block"
};
var forceHiddenStyles = function forceHiddenStyles2(node) {
  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach(function(key) {
    node.style.setProperty(key, HIDDEN_TEXTAREA_STYLE[key], "important");
  });
};
var forceHiddenStyles$1 = forceHiddenStyles;
var hiddenTextarea = null;
var getHeight = function getHeight2(node, sizingData) {
  var height = node.scrollHeight;
  if (sizingData.sizingStyle.boxSizing === "border-box") {
    return height + sizingData.borderSize;
  }
  return height - sizingData.paddingSize;
};
function calculateNodeHeight(sizingData, value, minRows, maxRows) {
  if (minRows === void 0) {
    minRows = 1;
  }
  if (maxRows === void 0) {
    maxRows = Infinity;
  }
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement("textarea");
    hiddenTextarea.setAttribute("tabindex", "-1");
    hiddenTextarea.setAttribute("aria-hidden", "true");
    forceHiddenStyles$1(hiddenTextarea);
  }
  if (hiddenTextarea.parentNode === null) {
    document.body.appendChild(hiddenTextarea);
  }
  var paddingSize = sizingData.paddingSize, borderSize = sizingData.borderSize, sizingStyle = sizingData.sizingStyle;
  var boxSizing = sizingStyle.boxSizing;
  Object.keys(sizingStyle).forEach(function(_key) {
    var key = _key;
    hiddenTextarea.style[key] = sizingStyle[key];
  });
  forceHiddenStyles$1(hiddenTextarea);
  hiddenTextarea.value = value;
  var height = getHeight(hiddenTextarea, sizingData);
  hiddenTextarea.value = value;
  height = getHeight(hiddenTextarea, sizingData);
  hiddenTextarea.value = "x";
  var rowHeight = hiddenTextarea.scrollHeight - paddingSize;
  var minHeight = rowHeight * minRows;
  if (boxSizing === "border-box") {
    minHeight = minHeight + paddingSize + borderSize;
  }
  height = Math.max(minHeight, height);
  var maxHeight = rowHeight * maxRows;
  if (boxSizing === "border-box") {
    maxHeight = maxHeight + paddingSize + borderSize;
  }
  height = Math.min(maxHeight, height);
  return [height, rowHeight];
}
var noop3 = function noop4() {
};
var pick = function pick2(props, obj) {
  return props.reduce(function(acc, prop) {
    acc[prop] = obj[prop];
    return acc;
  }, {});
};
var SIZING_STYLE = [
  "borderBottomWidth",
  "borderLeftWidth",
  "borderRightWidth",
  "borderTopWidth",
  "boxSizing",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  // non-standard
  "tabSize",
  "textIndent",
  // non-standard
  "textRendering",
  "textTransform",
  "width",
  "wordBreak",
  "wordSpacing",
  "scrollbarGutter"
];
var isIE = !!document.documentElement.currentStyle;
var getSizingData = function getSizingData2(node) {
  var style = window.getComputedStyle(node);
  if (style === null) {
    return null;
  }
  var sizingStyle = pick(SIZING_STYLE, style);
  var boxSizing = sizingStyle.boxSizing;
  if (boxSizing === "") {
    return null;
  }
  if (isIE && boxSizing === "border-box") {
    sizingStyle.width = parseFloat(sizingStyle.width) + parseFloat(sizingStyle.borderRightWidth) + parseFloat(sizingStyle.borderLeftWidth) + parseFloat(sizingStyle.paddingRight) + parseFloat(sizingStyle.paddingLeft) + "px";
  }
  var paddingSize = parseFloat(sizingStyle.paddingBottom) + parseFloat(sizingStyle.paddingTop);
  var borderSize = parseFloat(sizingStyle.borderBottomWidth) + parseFloat(sizingStyle.borderTopWidth);
  return {
    sizingStyle,
    paddingSize,
    borderSize
  };
};
var getSizingData$1 = getSizingData;
function useListener(target, type, listener) {
  var latestListener = useLatest(listener);
  React73.useLayoutEffect(function() {
    var handler = function handler2(ev) {
      return latestListener.current(ev);
    };
    if (!target) {
      return;
    }
    target.addEventListener(type, handler);
    return function() {
      return target.removeEventListener(type, handler);
    };
  }, []);
}
var useFormResetListener = function useFormResetListener2(libRef, listener) {
  useListener(document.body, "reset", function(ev) {
    if (libRef.current.form === ev.target) {
      listener(ev);
    }
  });
};
var useWindowResizeListener = function useWindowResizeListener2(listener) {
  useListener(window, "resize", listener);
};
var useFontsLoadedListener = function useFontsLoadedListener2(listener) {
  useListener(document.fonts, "loadingdone", listener);
};
var _excluded = ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"];
var TextareaAutosize = function TextareaAutosize2(_ref, userRef) {
  var cacheMeasurements = _ref.cacheMeasurements, maxRows = _ref.maxRows, minRows = _ref.minRows, _ref$onChange = _ref.onChange, onChange = _ref$onChange === void 0 ? noop3 : _ref$onChange, _ref$onHeightChange = _ref.onHeightChange, onHeightChange = _ref$onHeightChange === void 0 ? noop3 : _ref$onHeightChange, props = _objectWithoutPropertiesLoose(_ref, _excluded);
  if (props.style) {
    if ("maxHeight" in props.style) {
      throw new Error("Using `style.maxHeight` for <TextareaAutosize/> is not supported. Please use `maxRows`.");
    }
    if ("minHeight" in props.style) {
      throw new Error("Using `style.minHeight` for <TextareaAutosize/> is not supported. Please use `minRows`.");
    }
  }
  var isControlled = props.value !== void 0;
  var libRef = React73.useRef(null);
  var ref = useComposedRef(libRef, userRef);
  var heightRef = React73.useRef(0);
  var measurementsCacheRef = React73.useRef();
  var resizeTextarea = function resizeTextarea2() {
    var node = libRef.current;
    var nodeSizingData = cacheMeasurements && measurementsCacheRef.current ? measurementsCacheRef.current : getSizingData$1(node);
    if (!nodeSizingData) {
      return;
    }
    measurementsCacheRef.current = nodeSizingData;
    var _calculateNodeHeight = calculateNodeHeight(nodeSizingData, node.value || node.placeholder || "x", minRows, maxRows), height = _calculateNodeHeight[0], rowHeight = _calculateNodeHeight[1];
    if (heightRef.current !== height) {
      heightRef.current = height;
      node.style.setProperty("height", height + "px", "important");
      onHeightChange(height, {
        rowHeight
      });
    }
  };
  var handleChange = function handleChange2(event) {
    if (!isControlled) {
      resizeTextarea();
    }
    onChange(event);
  };
  {
    React73.useLayoutEffect(resizeTextarea);
    useFormResetListener(libRef, function() {
      if (!isControlled) {
        var currentValue = libRef.current.value;
        requestAnimationFrame(function() {
          var node = libRef.current;
          if (node && currentValue !== node.value) {
            resizeTextarea();
          }
        });
      }
    });
    useWindowResizeListener(resizeTextarea);
    useFontsLoadedListener(resizeTextarea);
    return React73.createElement("textarea", _extends({}, props, {
      onChange: handleChange,
      ref
    }));
  }
};
var index3 = React73.forwardRef(TextareaAutosize);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/utils/hooks/useOnScrollToBottom.js
var import_react79 = __toESM(require_react(), 1);
var useOnScrollToBottom = (callback) => {
  const callbackRef = useCallbackRef(callback);
  const onScrollToBottom = useThreadViewport((vp) => vp.onScrollToBottom);
  (0, import_react79.useEffect)(() => {
    return onScrollToBottom(callbackRef);
  }, [onScrollToBottom, callbackRef]);
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerInputPluginContext.js
var import_jsx_runtime78 = __toESM(require_jsx_runtime(), 1);
var import_react80 = __toESM(require_react(), 1);
var ComposerInputPluginRegistryContext = (0, import_react80.createContext)(null);
var useComposerInputPluginRegistryOptional = () => {
  return (0, import_react80.useContext)(ComposerInputPluginRegistryContext);
};
var ComposerInputPluginProvider = ({ children }) => {
  const pluginsRef = (0, import_react80.useRef)(/* @__PURE__ */ new Set());
  const snapshotRef = (0, import_react80.useRef)([]);
  const register = (0, import_react80.useCallback)((plugin) => {
    pluginsRef.current.add(plugin);
    snapshotRef.current = Array.from(pluginsRef.current);
    return () => {
      pluginsRef.current.delete(plugin);
      snapshotRef.current = Array.from(pluginsRef.current);
    };
  }, []);
  const getPlugins = (0, import_react80.useCallback)(() => snapshotRef.current, []);
  const registry = (0, import_react80.useMemo)(() => ({ register, getPlugins }), [register, getPlugins]);
  return (0, import_jsx_runtime78.jsx)(ComposerInputPluginRegistryContext.Provider, { value: registry, children });
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerInput.js
var ComposerPrimitiveInput = (0, import_react81.forwardRef)(({ autoFocus = false, asChild, render, disabled: disabledProp, onChange, onKeyDown, onPaste, onSelect, submitOnEnter, submitMode, cancelOnEscape = true, unstable_focusOnRunStart = true, unstable_focusOnScrollToBottom = true, unstable_focusOnThreadSwitched = true, addAttachmentOnPaste = true, ...rest }, forwardedRef) => {
  const aui = useAui();
  const pluginRegistry = useComposerInputPluginRegistryOptional();
  const effectiveSubmitMode = submitMode ?? (submitOnEnter === false ? "none" : "enter");
  const value = useAuiState((s) => {
    if (!s.composer.isEditing)
      return "";
    return s.composer.text;
  });
  const isDisabled = useAuiState((s) => {
    var _a2;
    return s.thread.isDisabled || ((_a2 = s.composer.dictation) == null ? void 0 : _a2.inputDisabled);
  }) || disabledProp;
  const textareaRef = (0, import_react81.useRef)(null);
  const ref = useComposedRefs(forwardedRef, textareaRef);
  useEscapeKeydown((e) => {
    var _a2;
    if (!((_a2 = textareaRef.current) == null ? void 0 : _a2.contains(e.target)))
      return;
    if (pluginRegistry) {
      for (const plugin of pluginRegistry.getPlugins()) {
        if (plugin.handleKeyDown(e))
          return;
      }
    }
    if (!cancelOnEscape)
      return;
    const composer = aui.composer();
    if (composer.getState().canCancel) {
      composer.cancel();
      e.preventDefault();
    }
  });
  const handleKeyPress = (e) => {
    var _a2, _b;
    if (isDisabled)
      return;
    if (e.nativeEvent.isComposing)
      return;
    if (pluginRegistry) {
      for (const plugin of pluginRegistry.getPlugins()) {
        if (plugin.handleKeyDown(e))
          return;
      }
    }
    if (e.key === "Enter") {
      const threadState = aui.thread().getState();
      const hasQueue = threadState.capabilities.queue;
      if (e.shiftKey && (e.ctrlKey || e.metaKey) && hasQueue && effectiveSubmitMode !== "none" && !aui.composer().getState().isEmpty) {
        e.preventDefault();
        aui.composer().send({ steer: true });
        return;
      }
      if (e.shiftKey)
        return;
      if (threadState.isRunning && !hasQueue)
        return;
      let shouldSubmit = false;
      if (effectiveSubmitMode === "ctrlEnter") {
        shouldSubmit = e.ctrlKey || e.metaKey;
      } else if (effectiveSubmitMode === "enter") {
        shouldSubmit = true;
      }
      if (shouldSubmit) {
        e.preventDefault();
        (_b = (_a2 = textareaRef.current) == null ? void 0 : _a2.closest("form")) == null ? void 0 : _b.requestSubmit();
      }
    }
  };
  const handlePaste = async (e) => {
    var _a2;
    if (!addAttachmentOnPaste)
      return;
    const threadCapabilities = aui.thread().getState().capabilities;
    const files = Array.from(((_a2 = e.clipboardData) == null ? void 0 : _a2.files) || []);
    if (threadCapabilities.attachments && files.length > 0) {
      try {
        e.preventDefault();
        await Promise.all(files.map((file) => aui.composer().addAttachment(file)));
      } catch (error) {
        console.error("Error adding attachment:", error);
      }
    }
  };
  const autoFocusEnabled = autoFocus && !isDisabled;
  const focus2 = (0, import_react81.useCallback)(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoFocusEnabled)
      return;
    textarea.focus({ preventScroll: true });
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }, [autoFocusEnabled]);
  (0, import_react81.useEffect)(() => focus2(), [focus2]);
  useOnScrollToBottom(() => {
    if (aui.composer().getState().type === "thread" && unstable_focusOnScrollToBottom) {
      focus2();
    }
  });
  (0, import_react81.useEffect)(() => {
    if (aui.composer().getState().type !== "thread" || !unstable_focusOnRunStart)
      return void 0;
    return aui.on("thread.runStart", focus2);
  }, [unstable_focusOnRunStart, focus2, aui]);
  (0, import_react81.useEffect)(() => {
    if (aui.composer().getState().type !== "thread" || !unstable_focusOnThreadSwitched)
      return void 0;
    return aui.on("threadListItem.switchedTo", focus2);
  }, [unstable_focusOnThreadSwitched, focus2, aui]);
  const inputProps = {
    name: "input",
    value,
    ...rest,
    ref,
    disabled: isDisabled,
    onChange: composeEventHandlers(onChange, (e) => {
      if (!aui.composer().getState().isEditing)
        return;
      flushResourcesSync(() => {
        aui.composer().setText(e.target.value);
      });
      const pos = e.target.selectionStart ?? e.target.value.length;
      if (pluginRegistry) {
        for (const plugin of pluginRegistry.getPlugins()) {
          plugin.setCursorPosition(pos);
        }
      }
    }),
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyPress),
    onSelect: composeEventHandlers(onSelect, (e) => {
      const target = e.target;
      const pos = target.selectionStart ?? target.value.length;
      if (pluginRegistry) {
        for (const plugin of pluginRegistry.getPlugins()) {
          plugin.setCursorPosition(pos);
        }
      }
    }),
    onPaste: composeEventHandlers(onPaste, handlePaste)
  };
  if (render && (0, import_react81.isValidElement)(render)) {
    const renderChildren = rest.children !== void 0 ? rest.children : render.props.children;
    return (0, import_jsx_runtime79.jsx)(dist_exports.Root, { ...inputProps, children: (0, import_react81.cloneElement)(render, void 0, renderChildren) });
  }
  const Component = asChild ? dist_exports.Root : index3;
  return (0, import_jsx_runtime79.jsx)(Component, { ...inputProps });
});
ComposerPrimitiveInput.displayName = "ComposerPrimitive.Input";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerCancel.js
var useComposerCancel2 = () => {
  const { disabled, cancel } = useComposerCancel();
  if (disabled)
    return null;
  return cancel;
};
var ComposerPrimitiveCancel = createActionButton("ComposerPrimitive.Cancel", useComposerCancel2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerAddAttachment.js
var import_react83 = __toESM(require_react(), 1);
var useComposerAddAttachment2 = ({ multiple = true } = {}) => {
  const { disabled, addAttachment } = useComposerAddAttachment();
  const aui = useAui();
  const callback = (0, import_react83.useCallback)(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    input.hidden = true;
    const attachmentAccept = aui.composer().getState().attachmentAccept;
    if (attachmentAccept !== "*") {
      input.accept = attachmentAccept;
    }
    document.body.appendChild(input);
    input.onchange = (e) => {
      const fileList = e.target.files;
      if (!fileList)
        return;
      for (const file of fileList) {
        addAttachment(file);
      }
      document.body.removeChild(input);
    };
    input.oncancel = () => {
      if (!input.files || input.files.length === 0) {
        document.body.removeChild(input);
      }
    };
    input.click();
  }, [aui, multiple, addAttachment]);
  if (disabled)
    return null;
  return callback;
};
var ComposerPrimitiveAddAttachment = createActionButton("ComposerPrimitive.AddAttachment", useComposerAddAttachment2, ["multiple"]);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerAttachmentDropzone.js
var import_jsx_runtime80 = __toESM(require_jsx_runtime(), 1);
var import_react86 = __toESM(require_react(), 1);
var ComposerPrimitiveAttachmentDropzone = (0, import_react86.forwardRef)(({ disabled, asChild = false, render, children, ...rest }, ref) => {
  const [isDragging, setIsDragging] = (0, import_react86.useState)(false);
  const aui = useAui();
  const handleDragEnterCapture = (0, import_react86.useCallback)((e) => {
    if (disabled)
      return;
    e.preventDefault();
    setIsDragging(true);
  }, [disabled]);
  const handleDragOverCapture = (0, import_react86.useCallback)((e) => {
    if (disabled)
      return;
    e.preventDefault();
    if (!isDragging)
      setIsDragging(true);
  }, [disabled, isDragging]);
  const handleDragLeaveCapture = (0, import_react86.useCallback)((e) => {
    if (disabled)
      return;
    e.preventDefault();
    const next = e.relatedTarget;
    if (next && e.currentTarget.contains(next)) {
      return;
    }
    setIsDragging(false);
  }, [disabled]);
  const handleDrop = (0, import_react86.useCallback)(async (e) => {
    if (disabled)
      return;
    e.preventDefault();
    setIsDragging(false);
    for (const file of e.dataTransfer.files) {
      try {
        await aui.composer().addAttachment(file);
      } catch (error) {
        console.error("Failed to add attachment:", error);
      }
    }
  }, [disabled, aui]);
  const mergedProps = {
    ...isDragging ? { "data-dragging": "true" } : null,
    ...rest,
    onDragEnterCapture: composeEventHandlers(rest.onDragEnterCapture, handleDragEnterCapture),
    onDragOverCapture: composeEventHandlers(rest.onDragOverCapture, handleDragOverCapture),
    onDragLeaveCapture: composeEventHandlers(rest.onDragLeaveCapture, handleDragLeaveCapture),
    onDropCapture: composeEventHandlers(rest.onDropCapture, handleDrop),
    ref
  };
  if (render && (0, import_react86.isValidElement)(render)) {
    const renderChildren = children !== void 0 ? children : render.props.children;
    return (0, import_jsx_runtime80.jsx)(dist_exports.Root, { ...mergedProps, children: (0, import_react86.cloneElement)(render, void 0, renderChildren) });
  }
  const Comp = asChild ? dist_exports.Root : "div";
  return (0, import_jsx_runtime80.jsx)(Comp, { ...mergedProps, children });
});
ComposerPrimitiveAttachmentDropzone.displayName = "ComposerPrimitive.AttachmentDropzone";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerDictate.js
var useComposerDictate2 = () => {
  const { disabled, startDictation } = useComposerDictate();
  if (disabled)
    return null;
  return startDictation;
};
var ComposerPrimitiveDictate = createActionButton("ComposerPrimitive.Dictate", useComposerDictate2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerStopDictation.js
var import_react88 = __toESM(require_react(), 1);
var useComposerStopDictation = () => {
  const aui = useAui();
  const isDictating = useAuiState((s) => s.composer.dictation != null);
  const callback = (0, import_react88.useCallback)(() => {
    aui.composer().stopDictation();
  }, [aui]);
  if (!isDictating)
    return null;
  return callback;
};
var ComposerPrimitiveStopDictation = createActionButton("ComposerPrimitive.StopDictation", useComposerStopDictation);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerDictationTranscript.js
var import_jsx_runtime81 = __toESM(require_jsx_runtime(), 1);
var import_react89 = __toESM(require_react(), 1);
var ComposerPrimitiveDictationTranscript = (0, import_react89.forwardRef)(({ children, ...props }, forwardRef95) => {
  const transcript = useAuiState((s) => {
    var _a2;
    return (_a2 = s.composer.dictation) == null ? void 0 : _a2.transcript;
  });
  if (!transcript)
    return null;
  return (0, import_jsx_runtime81.jsx)(Primitive2.span, { ...props, ref: forwardRef95, children: children ?? transcript });
});
ComposerPrimitiveDictationTranscript.displayName = "ComposerPrimitive.DictationTranscript";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/ComposerQuote.js
var import_jsx_runtime82 = __toESM(require_jsx_runtime(), 1);
var import_react91 = __toESM(require_react(), 1);
var ComposerPrimitiveQuote = (0, import_react91.forwardRef)((props, forwardedRef) => {
  const quote = useAuiState((s) => s.composer.quote);
  if (!quote)
    return null;
  return (0, import_jsx_runtime82.jsx)(Primitive2.div, { ...props, ref: forwardedRef });
});
ComposerPrimitiveQuote.displayName = "ComposerPrimitive.Quote";
var ComposerPrimitiveQuoteText = (0, import_react91.forwardRef)(({ children, ...props }, forwardedRef) => {
  const text = useAuiState((s) => {
    var _a2;
    return (_a2 = s.composer.quote) == null ? void 0 : _a2.text;
  });
  if (!text)
    return null;
  return (0, import_jsx_runtime82.jsx)(Primitive2.span, { ...props, ref: forwardedRef, children: children ?? text });
});
ComposerPrimitiveQuoteText.displayName = "ComposerPrimitive.QuoteText";
var ComposerPrimitiveQuoteDismiss = (0, import_react91.forwardRef)(({ onClick, ...props }, forwardedRef) => {
  const aui = useAui();
  const handleDismiss = (0, import_react91.useCallback)(() => {
    aui.composer().setQuote(void 0);
  }, [aui]);
  return (0, import_jsx_runtime82.jsx)(Primitive2.button, { type: "button", ...props, ref: forwardedRef, onClick: composeEventHandlers(onClick, handleDismiss) });
});
ComposerPrimitiveQuoteDismiss.displayName = "ComposerPrimitive.QuoteDismiss";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/mention/ComposerMentionContext.js
var import_jsx_runtime84 = __toESM(require_jsx_runtime(), 1);
var import_react95 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/trigger/TriggerPopoverContext.js
var import_jsx_runtime83 = __toESM(require_jsx_runtime(), 1);
var import_react93 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/trigger/detectTrigger.js
var WHITESPACE_RE = /\s/;
function detectTrigger(text, triggerChar, cursorPosition) {
  const textUpToCursor = text.slice(0, cursorPosition);
  for (let i = textUpToCursor.length - 1; i >= 0; i--) {
    const char = textUpToCursor[i];
    if (WHITESPACE_RE.test(char))
      return null;
    if (textUpToCursor.startsWith(triggerChar, i)) {
      if (i > 0 && !WHITESPACE_RE.test(textUpToCursor[i - 1]))
        continue;
      const query = textUpToCursor.slice(i + triggerChar.length);
      return { query, offset: i };
    }
  }
  return null;
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/trigger/TriggerPopoverResource.js
function isTriggerItem(x) {
  return "type" in x;
}
function matchesQuery(item, lower) {
  var _a2;
  return item.id.toLowerCase().includes(lower) || item.label.toLowerCase().includes(lower) || (((_a2 = item.description) == null ? void 0 : _a2.toLowerCase().includes(lower)) ?? false);
}
var TriggerPopoverResource = resource(({ adapter, text, triggerChar, onSelect, aui, popoverId }) => {
  const [cursorPosition, setCursorPosition] = tapState(text.length);
  const trigger = tapMemo(() => {
    const pos = Math.min(cursorPosition, text.length);
    return detectTrigger(text, triggerChar, pos);
  }, [cursorPosition, text, triggerChar]);
  const open = trigger !== null && adapter !== void 0;
  const query = (trigger == null ? void 0 : trigger.query) ?? "";
  const [activeCategoryId, setActiveCategoryId] = tapState(null);
  tapEffect(() => {
    if (!open)
      setActiveCategoryId(null);
  }, [open]);
  const categories = tapMemo(() => {
    if (!open || !adapter)
      return [];
    return adapter.categories();
  }, [open, adapter]);
  const effectiveActiveCategoryId = open ? activeCategoryId : null;
  const allItems = tapMemo(() => {
    if (!effectiveActiveCategoryId || !adapter)
      return [];
    return adapter.categoryItems(effectiveActiveCategoryId);
  }, [effectiveActiveCategoryId, adapter]);
  const searchResults = tapMemo(() => {
    if (!open || !adapter || effectiveActiveCategoryId)
      return null;
    if (!query && categories.length > 0)
      return null;
    if (adapter.search)
      return adapter.search(query);
    const all = [];
    const lower = query.toLowerCase();
    for (const cat of categories) {
      for (const item of adapter.categoryItems(cat.id)) {
        if (matchesQuery(item, lower)) {
          all.push(item);
        }
      }
    }
    return all;
  }, [open, adapter, query, effectiveActiveCategoryId, categories]);
  const isSearchMode = searchResults !== null;
  const filteredCategories = tapMemo(() => {
    if (isSearchMode)
      return [];
    if (!query)
      return categories;
    const lower = query.toLowerCase();
    return categories.filter((cat) => cat.label.toLowerCase().includes(lower));
  }, [categories, query, isSearchMode]);
  const filteredItems = tapMemo(() => {
    if (isSearchMode)
      return searchResults ?? [];
    if (!query)
      return allItems;
    const lower = query.toLowerCase();
    return allItems.filter((item) => matchesQuery(item, lower));
  }, [allItems, query, isSearchMode, searchResults]);
  const [highlightedIndex, setHighlightedIndex] = tapState(0);
  const navigableList = tapMemo(() => {
    if (isSearchMode)
      return searchResults ?? [];
    if (effectiveActiveCategoryId)
      return filteredItems;
    return filteredCategories;
  }, [
    isSearchMode,
    searchResults,
    effectiveActiveCategoryId,
    filteredItems,
    filteredCategories
  ]);
  tapEffect(() => {
    setHighlightedIndex(0);
  }, [navigableList]);
  const selectItemOverrideRef = tapRef(null);
  const registerSelectItemOverride = tapEffectEvent((fn) => {
    selectItemOverrideRef.current = fn;
    return () => {
      if (selectItemOverrideRef.current === fn) {
        selectItemOverrideRef.current = null;
      }
    };
  });
  const selectCategory = tapEffectEvent((categoryId) => {
    setActiveCategoryId(categoryId);
    setHighlightedIndex(0);
  });
  const goBack = tapEffectEvent(() => {
    setActiveCategoryId(null);
    setHighlightedIndex(0);
  });
  const selectItem = tapEffectEvent((item) => {
    var _a2;
    if (!trigger)
      return;
    if ((_a2 = selectItemOverrideRef.current) == null ? void 0 : _a2.call(selectItemOverrideRef, item)) {
      setActiveCategoryId(null);
      setHighlightedIndex(0);
      return;
    }
    if (onSelect.type === "insertDirective") {
      const currentText = aui.composer().getState().text;
      const before = currentText.slice(0, trigger.offset);
      const after = currentText.slice(trigger.offset + triggerChar.length + trigger.query.length);
      const directive = onSelect.formatter.serialize(item);
      const newText = before + directive + (after.startsWith(" ") ? after : ` ${after}`);
      aui.composer().setText(newText);
    } else if (onSelect.type === "action") {
      const currentText = aui.composer().getState().text;
      const before = currentText.slice(0, trigger.offset);
      const after = currentText.slice(trigger.offset + triggerChar.length + trigger.query.length);
      const newText = before + after.trimStart();
      aui.composer().setText(newText);
      onSelect.handler(item);
    }
    setActiveCategoryId(null);
    setHighlightedIndex(0);
  });
  const close = tapEffectEvent(() => {
    setActiveCategoryId(null);
    setHighlightedIndex(0);
    if (trigger) {
      setCursorPosition(trigger.offset);
    }
  });
  const handleKeyDown = tapEffectEvent((e) => {
    if (!open)
      return false;
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const len = navigableList.length;
          if (len === 0)
            return 0;
          return prev < len - 1 ? prev + 1 : 0;
        });
        return true;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const len = navigableList.length;
          if (len === 0)
            return 0;
          return prev > 0 ? prev - 1 : len - 1;
        });
        return true;
      }
      case "Enter": {
        if (e.shiftKey)
          return false;
        e.preventDefault();
        const item = navigableList[highlightedIndex];
        if (!item)
          return true;
        if (isTriggerItem(item)) {
          selectItem(item);
        } else {
          selectCategory(item.id);
        }
        return true;
      }
      case "Escape": {
        e.preventDefault();
        close();
        return true;
      }
      case "Backspace": {
        if (effectiveActiveCategoryId && query === "") {
          e.preventDefault();
          goBack();
          return true;
        }
        return false;
      }
      default:
        return false;
    }
  });
  const highlightedEntry = navigableList[highlightedIndex];
  const highlightedItemId = open && highlightedEntry ? `${popoverId}-option-${highlightedEntry.id}` : void 0;
  return {
    open,
    query,
    activeCategoryId: effectiveActiveCategoryId,
    categories: filteredCategories,
    items: filteredItems,
    highlightedIndex,
    isSearchMode,
    popoverId,
    highlightedItemId,
    selectCategory,
    goBack,
    selectItem,
    close,
    handleKeyDown,
    setCursorPosition,
    registerSelectItemOverride
  };
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/trigger/TriggerPopoverContext.js
var TriggerPopoverContext = (0, import_react93.createContext)(null);
var useTriggerPopoverContext = () => {
  const ctx = (0, import_react93.useContext)(TriggerPopoverContext);
  if (!ctx)
    throw new Error("useTriggerPopoverContext must be used within ComposerPrimitive.TriggerPopoverRoot");
  return ctx;
};
var useTriggerPopoverContextOptional = () => {
  return (0, import_react93.useContext)(TriggerPopoverContext);
};
var TriggerPopoverRootInner = ({ children, adapter, trigger: triggerChar = "@", onSelect }) => {
  const aui = useAui();
  const text = useAuiState((s) => s.composer.text);
  const popoverId = (0, import_react93.useId)();
  const triggerPopover = useResource(TriggerPopoverResource({
    adapter,
    text,
    triggerChar,
    onSelect,
    aui,
    popoverId
  }));
  const pluginRegistry = useComposerInputPluginRegistryOptional();
  (0, import_react93.useEffect)(() => {
    if (!pluginRegistry)
      return void 0;
    return pluginRegistry.register(triggerPopover);
  }, [pluginRegistry, triggerPopover]);
  return (0, import_jsx_runtime83.jsx)(TriggerPopoverContext.Provider, { value: triggerPopover, children });
};
var ComposerPrimitiveTriggerPopoverRoot = (props) => {
  const existingRegistry = useComposerInputPluginRegistryOptional();
  if (existingRegistry) {
    return (0, import_jsx_runtime83.jsx)(TriggerPopoverRootInner, { ...props });
  }
  return (0, import_jsx_runtime83.jsx)(ComposerInputPluginProvider, { children: (0, import_jsx_runtime83.jsx)(TriggerPopoverRootInner, { ...props }) });
};
ComposerPrimitiveTriggerPopoverRoot.displayName = "ComposerPrimitive.TriggerPopoverRoot";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/mention/ComposerMentionContext.js
var MentionContext = (0, import_react95.createContext)(null);
var useMentionContext = () => {
  const ctx = (0, import_react95.useContext)(MentionContext);
  if (!ctx)
    throw new Error("useMentionContext must be used within ComposerPrimitive.MentionRoot");
  return ctx;
};
var useMentionContextOptional = () => {
  return (0, import_react95.useContext)(MentionContext);
};
var MentionInternalContext = (0, import_react95.createContext)(null);
var useMentionInternalContext = () => {
  return (0, import_react95.useContext)(MentionInternalContext);
};
var ComposerPrimitiveMentionRoot = ({ children, adapter: adapterProp, trigger: triggerChar = "@", formatter: formatterProp }) => {
  const aui = useAui();
  const formatter = formatterProp ?? unstable_defaultDirectiveFormatter;
  const getRuntimeAdapter = (0, import_react95.useCallback)(() => {
    var _a2, _b, _c, _d, _e;
    try {
      const runtime = (_b = (_a2 = aui.composer()).__internal_getRuntime) == null ? void 0 : _b.call(_a2);
      return (_e = (_d = (_c = runtime == null ? void 0 : runtime._core) == null ? void 0 : _c.getState()) == null ? void 0 : _d.getMentionAdapter) == null ? void 0 : _e.call(_d);
    } catch {
      return void 0;
    }
  }, [aui]);
  const [runtimeAdapter, setRuntimeAdapter] = (0, import_react95.useState)(getRuntimeAdapter);
  (0, import_react95.useEffect)(() => {
    return aui.subscribe(() => {
      setRuntimeAdapter((prev) => {
        const next = getRuntimeAdapter();
        return prev === next ? prev : next;
      });
    });
  }, [aui, getRuntimeAdapter]);
  const adapter = adapterProp ?? runtimeAdapter;
  const onSelect = (0, import_react95.useMemo)(() => ({ type: "insertDirective", formatter }), [formatter]);
  return (0, import_jsx_runtime84.jsx)(ComposerPrimitiveTriggerPopoverRoot, { adapter, trigger: triggerChar, onSelect, children: (0, import_jsx_runtime84.jsx)(MentionContextBridge, { formatter, children }) });
};
ComposerPrimitiveMentionRoot.displayName = "ComposerPrimitive.MentionRoot";
var MentionContextBridge = ({ formatter, children }) => {
  const triggerCtx = useTriggerPopoverContext();
  const mentionValue = (0, import_react95.useMemo)(() => ({ ...triggerCtx, formatter }), [triggerCtx, formatter]);
  const internalContextValue = (0, import_react95.useMemo)(() => ({
    registerSelectItemOverride: triggerCtx.registerSelectItemOverride
  }), [triggerCtx.registerSelectItemOverride]);
  return (0, import_jsx_runtime84.jsx)(MentionContext.Provider, { value: mentionValue, children: (0, import_jsx_runtime84.jsx)(MentionInternalContext.Provider, { value: internalContextValue, children }) });
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/trigger/TriggerPopoverPopover.js
var import_jsx_runtime85 = __toESM(require_jsx_runtime(), 1);
var import_react96 = __toESM(require_react(), 1);
var ComposerPrimitiveTriggerPopoverPopover = (0, import_react96.forwardRef)(({ "aria-label": ariaLabel, ...props }, forwardedRef) => {
  const { open, popoverId, highlightedItemId } = useTriggerPopoverContext();
  if (!open)
    return null;
  return (0, import_jsx_runtime85.jsx)(Primitive2.div, { role: "listbox", id: popoverId, "aria-label": ariaLabel ?? "Suggestions", "aria-activedescendant": highlightedItemId, "data-state": "open", ...props, ref: forwardedRef });
});
ComposerPrimitiveTriggerPopoverPopover.displayName = "ComposerPrimitive.TriggerPopoverPopover";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/trigger/TriggerPopoverCategories.js
var import_jsx_runtime86 = __toESM(require_jsx_runtime(), 1);
var import_react97 = __toESM(require_react(), 1);
var ComposerPrimitiveTriggerPopoverCategories = (0, import_react97.forwardRef)(({ children, "aria-label": ariaLabel, ...props }, forwardedRef) => {
  const { categories, activeCategoryId, isSearchMode } = useTriggerPopoverContext();
  if (activeCategoryId || isSearchMode)
    return null;
  return (0, import_jsx_runtime86.jsx)(Primitive2.div, { role: "group", "aria-label": ariaLabel ?? "Categories", ...props, ref: forwardedRef, children: children(categories) });
});
ComposerPrimitiveTriggerPopoverCategories.displayName = "ComposerPrimitive.TriggerPopoverCategories";
var ComposerPrimitiveTriggerPopoverCategoryItem = (0, import_react97.forwardRef)(({ categoryId, onClick, ...props }, forwardedRef) => {
  const { selectCategory, categories, highlightedIndex, activeCategoryId, isSearchMode, popoverId } = useTriggerPopoverContext();
  const handleClick = (0, import_react97.useCallback)(() => {
    selectCategory(categoryId);
  }, [selectCategory, categoryId]);
  const isHighlighted = !activeCategoryId && !isSearchMode && categories.findIndex((c) => c.id === categoryId) === highlightedIndex;
  return (0, import_jsx_runtime86.jsx)(Primitive2.button, { type: "button", role: "option", id: `${popoverId}-option-${categoryId}`, "aria-selected": isHighlighted, "data-highlighted": isHighlighted ? "" : void 0, ...props, ref: forwardedRef, onClick: composeEventHandlers(onClick, handleClick) });
});
ComposerPrimitiveTriggerPopoverCategoryItem.displayName = "ComposerPrimitive.TriggerPopoverCategoryItem";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/trigger/TriggerPopoverItems.js
var import_jsx_runtime87 = __toESM(require_jsx_runtime(), 1);
var import_react98 = __toESM(require_react(), 1);
var ComposerPrimitiveTriggerPopoverItems = (0, import_react98.forwardRef)(({ children, "aria-label": ariaLabel, ...props }, forwardedRef) => {
  const { items, activeCategoryId, isSearchMode } = useTriggerPopoverContext();
  if (!activeCategoryId && !isSearchMode)
    return null;
  return (0, import_jsx_runtime87.jsx)(Primitive2.div, { role: "group", "aria-label": ariaLabel ?? "Items", ...props, ref: forwardedRef, children: children(items) });
});
ComposerPrimitiveTriggerPopoverItems.displayName = "ComposerPrimitive.TriggerPopoverItems";
var ComposerPrimitiveTriggerPopoverItem = (0, import_react98.forwardRef)(({ item, index: indexProp, onClick, ...props }, forwardedRef) => {
  const { selectItem, items, highlightedIndex, activeCategoryId, isSearchMode, popoverId } = useTriggerPopoverContext();
  const handleClick = (0, import_react98.useCallback)(() => {
    selectItem(item);
  }, [selectItem, item]);
  const itemIndex = indexProp ?? items.findIndex((i) => i.id === item.id);
  const isHighlighted = (isSearchMode || activeCategoryId !== null) && itemIndex === highlightedIndex;
  return (0, import_jsx_runtime87.jsx)(Primitive2.button, { type: "button", role: "option", id: `${popoverId}-option-${item.id}`, "aria-selected": isHighlighted, "data-highlighted": isHighlighted ? "" : void 0, ...props, ref: forwardedRef, onClick: composeEventHandlers(onClick, handleClick) });
});
ComposerPrimitiveTriggerPopoverItem.displayName = "ComposerPrimitive.TriggerPopoverItem";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/trigger/TriggerPopoverBack.js
var import_jsx_runtime88 = __toESM(require_jsx_runtime(), 1);
var import_react99 = __toESM(require_react(), 1);
var ComposerPrimitiveTriggerPopoverBack = (0, import_react99.forwardRef)(({ onClick, ...props }, forwardedRef) => {
  const { activeCategoryId, isSearchMode, goBack } = useTriggerPopoverContext();
  if (!activeCategoryId || isSearchMode)
    return null;
  return (0, import_jsx_runtime88.jsx)(Primitive2.button, { type: "button", ...props, ref: forwardedRef, onClick: composeEventHandlers(onClick, goBack) });
});
ComposerPrimitiveTriggerPopoverBack.displayName = "ComposerPrimitive.TriggerPopoverBack";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/composer/slash-command/ComposerSlashCommandRoot.js
var import_jsx_runtime89 = __toESM(require_jsx_runtime(), 1);
var import_react100 = __toESM(require_react(), 1);
var ComposerPrimitiveSlashCommandRoot = ({ children, adapter, trigger = "/", onSelect: onSelectProp }) => {
  const handler = (0, import_react100.useCallback)((item) => {
    var _a2;
    (_a2 = item.execute) == null ? void 0 : _a2.call(item);
    onSelectProp == null ? void 0 : onSelectProp(item);
  }, [onSelectProp]);
  const onSelect = (0, import_react100.useMemo)(() => ({ type: "action", handler }), [handler]);
  return (0, import_jsx_runtime89.jsx)(ComposerPrimitiveTriggerPopoverRoot, { adapter, trigger, onSelect, children });
};
ComposerPrimitiveSlashCommandRoot.displayName = "ComposerPrimitive.SlashCommandRoot";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/queueItem.js
var queueItem_exports = {};
__export(queueItem_exports, {
  Remove: () => QueueItemPrimitiveRemove,
  Steer: () => QueueItemPrimitiveSteer,
  Text: () => QueueItemPrimitiveText
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/queueItem/QueueItemText.js
var import_jsx_runtime90 = __toESM(require_jsx_runtime(), 1);
var import_react101 = __toESM(require_react(), 1);
var QueueItemPrimitiveText = (0, import_react101.forwardRef)((props, ref) => {
  const prompt = useAuiState((s) => s.queueItem.prompt);
  return (0, import_jsx_runtime90.jsx)(Primitive2.span, { ...props, ref, children: props.children ?? prompt });
});
QueueItemPrimitiveText.displayName = "QueueItemPrimitive.Text";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/queueItem/QueueItemSteer.js
var import_react102 = __toESM(require_react(), 1);
var useQueueItemSteer = () => {
  const aui = useAui();
  const callback = (0, import_react102.useCallback)(() => {
    aui.queueItem().steer();
  }, [aui]);
  return callback;
};
var QueueItemPrimitiveSteer = createActionButton("QueueItemPrimitive.Steer", useQueueItemSteer);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/queueItem/QueueItemRemove.js
var import_react103 = __toESM(require_react(), 1);
var useQueueItemRemove = () => {
  const aui = useAui();
  const callback = (0, import_react103.useCallback)(() => {
    aui.queueItem().remove();
  }, [aui]);
  return callback;
};
var QueueItemPrimitiveRemove = createActionButton("QueueItemPrimitive.Remove", useQueueItemRemove);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart.js
var messagePart_exports = {};
__export(messagePart_exports, {
  Image: () => MessagePartPrimitiveImage,
  InProgress: () => MessagePartPrimitiveInProgress,
  Messages: () => PartPrimitiveMessages,
  Text: () => MessagePartPrimitiveText
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartText.js
var import_jsx_runtime92 = __toESM(require_jsx_runtime(), 1);
var import_react106 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart/useMessagePartText.js
var useMessagePartText = () => {
  const text = useAuiState((s) => {
    if (s.part.type !== "text" && s.part.type !== "reasoning")
      throw new Error("MessagePartText can only be used inside text or reasoning message parts.");
    return s.part;
  });
  return text;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/utils/smooth/useSmooth.js
var import_react105 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/utils/smooth/SmoothContext.js
var import_jsx_runtime91 = __toESM(require_jsx_runtime(), 1);
var import_react104 = __toESM(require_react(), 1);
var SmoothContext = (0, import_react104.createContext)(null);
var makeSmoothContext = (initialState) => {
  const useSmoothStatus2 = create(() => initialState);
  return { useSmoothStatus: useSmoothStatus2 };
};
var SmoothContextProvider = ({ children }) => {
  const outer = useSmoothContext({ optional: true });
  const aui = useAui();
  const [context] = (0, import_react104.useState)(() => makeSmoothContext(aui.part().getState().status));
  if (outer)
    return children;
  return (0, import_jsx_runtime91.jsx)(SmoothContext.Provider, { value: context, children });
};
var withSmoothContextProvider = (Component) => {
  const Wrapped = (0, import_react104.forwardRef)((props, ref) => {
    return (0, import_jsx_runtime91.jsx)(SmoothContextProvider, { children: (0, import_jsx_runtime91.jsx)(Component, { ...props, ref }) });
  });
  Wrapped.displayName = Component.displayName;
  return Wrapped;
};
function useSmoothContext(options) {
  const context = (0, import_react104.useContext)(SmoothContext);
  if (!(options == null ? void 0 : options.optional) && !context)
    throw new Error("This component must be used within a SmoothContextProvider.");
  return context;
}
var { useSmoothStatus, useSmoothStatusStore } = createContextStoreHook(useSmoothContext, "useSmoothStatus");

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/utils/smooth/useSmooth.js
var TextStreamAnimator = class {
  constructor(currentText, setText) {
    __publicField(this, "currentText");
    __publicField(this, "setText");
    __publicField(this, "animationFrameId", null);
    __publicField(this, "lastUpdateTime", Date.now());
    __publicField(this, "targetText", "");
    __publicField(this, "animate", () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - this.lastUpdateTime;
      let timeToConsume = deltaTime;
      const remainingChars = this.targetText.length - this.currentText.length;
      const baseTimePerChar = Math.min(5, 250 / remainingChars);
      let charsToAdd = 0;
      while (timeToConsume >= baseTimePerChar && charsToAdd < remainingChars) {
        charsToAdd++;
        timeToConsume -= baseTimePerChar;
      }
      if (charsToAdd !== remainingChars) {
        this.animationFrameId = requestAnimationFrame(this.animate);
      } else {
        this.animationFrameId = null;
      }
      if (charsToAdd === 0)
        return;
      this.currentText = this.targetText.slice(0, this.currentText.length + charsToAdd);
      this.lastUpdateTime = currentTime - timeToConsume;
      this.setText(this.currentText);
    });
    this.currentText = currentText;
    this.setText = setText;
  }
  start() {
    if (this.animationFrameId !== null)
      return;
    this.lastUpdateTime = Date.now();
    this.animate();
  }
  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
};
var SMOOTH_STATUS = Object.freeze({
  type: "running"
});
var useSmooth = (state, smooth = false) => {
  const { text } = state;
  const id = useAuiState((s) => s.message.id);
  const idRef = (0, import_react105.useRef)(id);
  const [displayedText, setDisplayedText] = (0, import_react105.useState)(state.status.type === "running" ? "" : text);
  const smoothStatusStore = useSmoothStatusStore({ optional: true });
  const setText = useCallbackRef((text2) => {
    setDisplayedText(text2);
    if (smoothStatusStore) {
      const target = displayedText !== text2 || state.status.type === "running" ? SMOOTH_STATUS : state.status;
      writableStore(smoothStatusStore).setState(target, true);
    }
  });
  (0, import_react105.useEffect)(() => {
    if (smoothStatusStore) {
      const target = smooth && (displayedText !== text || state.status.type === "running") ? SMOOTH_STATUS : state.status;
      writableStore(smoothStatusStore).setState(target, true);
    }
  }, [smoothStatusStore, smooth, text, displayedText, state.status]);
  const [animatorRef] = (0, import_react105.useState)(new TextStreamAnimator(displayedText, setText));
  (0, import_react105.useEffect)(() => {
    if (!smooth) {
      animatorRef.stop();
      return;
    }
    if (idRef.current !== id || !text.startsWith(animatorRef.targetText)) {
      idRef.current = id;
      if (state.status.type === "running") {
        setText("");
        animatorRef.currentText = "";
        animatorRef.targetText = text;
        animatorRef.start();
      } else {
        setText(text);
        animatorRef.currentText = text;
        animatorRef.targetText = text;
        animatorRef.stop();
      }
      return;
    }
    animatorRef.targetText = text;
    animatorRef.start();
  }, [setText, animatorRef, id, smooth, text, state.status.type]);
  (0, import_react105.useEffect)(() => {
    return () => {
      animatorRef.stop();
    };
  }, [animatorRef]);
  return (0, import_react105.useMemo)(() => smooth ? {
    type: "text",
    text: displayedText,
    status: text === displayedText ? state.status : SMOOTH_STATUS
  } : state, [smooth, displayedText, state, text]);
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartText.js
var MessagePartPrimitiveText = (0, import_react106.forwardRef)(({ smooth = true, component: Component = "span", ...rest }, forwardedRef) => {
  const { text, status } = useSmooth(useMessagePartText(), smooth);
  return (0, import_jsx_runtime92.jsx)(Component, { "data-status": status.type, ...rest, ref: forwardedRef, children: text });
});
MessagePartPrimitiveText.displayName = "MessagePartPrimitive.Text";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartImage.js
var import_jsx_runtime93 = __toESM(require_jsx_runtime(), 1);
var import_react107 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart/useMessagePartImage.js
var useMessagePartImage = () => {
  const image = useAuiState((s) => {
    if (s.part.type !== "image")
      throw new Error("MessagePartImage can only be used inside image message parts.");
    return s.part;
  });
  return image;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartImage.js
var MessagePartPrimitiveImage = (0, import_react107.forwardRef)((props, forwardedRef) => {
  const { image } = useMessagePartImage();
  return (0, import_jsx_runtime93.jsx)(Primitive2.img, { src: image, ...props, ref: forwardedRef });
});
MessagePartPrimitiveImage.displayName = "MessagePartPrimitive.Image";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartInProgress.js
var MessagePartPrimitiveInProgress = ({ children }) => {
  const isInProgress = useAuiState((s) => s.part.status.type === "running");
  return isInProgress ? children : null;
};
MessagePartPrimitiveInProgress.displayName = "MessagePartPrimitive.InProgress";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/error.js
var error_exports = {};
__export(error_exports, {
  Message: () => ErrorPrimitiveMessage,
  Root: () => ErrorPrimitiveRoot
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/error/ErrorRoot.js
var import_jsx_runtime94 = __toESM(require_jsx_runtime(), 1);
var import_react109 = __toESM(require_react(), 1);
var ErrorPrimitiveRoot = (0, import_react109.forwardRef)((props, forwardRef95) => {
  return (0, import_jsx_runtime94.jsx)(Primitive2.div, { role: "alert", ...props, ref: forwardRef95 });
});
ErrorPrimitiveRoot.displayName = "ErrorPrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/error/ErrorMessage.js
var import_jsx_runtime95 = __toESM(require_jsx_runtime(), 1);
var import_react110 = __toESM(require_react(), 1);
var ErrorPrimitiveMessage = (0, import_react110.forwardRef)(({ children, ...props }, forwardRef95) => {
  const error = useMessageError();
  if (error === void 0)
    return null;
  return (0, import_jsx_runtime95.jsx)(Primitive2.span, { ...props, ref: forwardRef95, children: children ?? String(error) });
});
ErrorPrimitiveMessage.displayName = "ErrorPrimitive.Message";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/message.js
var message_exports = {};
__export(message_exports, {
  AttachmentByIndex: () => MessagePrimitiveAttachmentByIndex,
  Attachments: () => MessagePrimitiveAttachments,
  Content: () => MessagePrimitiveParts2,
  Error: () => MessagePrimitiveError,
  If: () => MessagePrimitiveIf,
  PartByIndex: () => MessagePrimitivePartByIndex,
  Parts: () => MessagePrimitiveParts2,
  Quote: () => MessagePrimitiveQuote,
  Root: () => MessagePrimitiveRoot,
  Unstable_PartsGrouped: () => MessagePrimitiveUnstable_PartsGrouped,
  Unstable_PartsGroupedByParentId: () => MessagePrimitiveUnstable_PartsGroupedByParentId
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/message/MessageRoot.js
var import_jsx_runtime97 = __toESM(require_jsx_runtime(), 1);
var import_react115 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/utils/hooks/useManagedRef.js
var import_react112 = __toESM(require_react(), 1);
var useManagedRef = (callback) => {
  const cleanupRef = (0, import_react112.useRef)(void 0);
  const ref = (0, import_react112.useCallback)((el) => {
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    if (el) {
      cleanupRef.current = callback(el);
    }
  }, [callback]);
  return ref;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/utils/hooks/useSizeHandle.js
var import_react113 = __toESM(require_react(), 1);
var useSizeHandle = (register, getHeight3) => {
  const callbackRef = (0, import_react113.useCallback)((el) => {
    if (!register)
      return;
    const sizeHandle = register();
    const updateHeight = () => {
      const height = getHeight3 ? getHeight3(el) : el.offsetHeight;
      sizeHandle.setHeight(height);
    };
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    updateHeight();
    return () => {
      ro.disconnect();
      sizeHandle.unregister();
    };
  }, [register, getHeight3]);
  return useManagedRef(callbackRef);
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadViewportSlack.js
var import_jsx_runtime96 = __toESM(require_jsx_runtime(), 1);
var import_react114 = __toESM(require_react(), 1);
var SlackNestingContext = (0, import_react114.createContext)(false);
var parseCssLength = (value, element) => {
  const match = value.match(/^([\d.]+)(em|px|rem)$/);
  if (!match)
    return 0;
  const num = parseFloat(match[1]);
  const unit = match[2];
  if (unit === "px")
    return num;
  if (unit === "em") {
    const fontSize = parseFloat(getComputedStyle(element).fontSize) || 16;
    return num * fontSize;
  }
  if (unit === "rem") {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return num * rootFontSize;
  }
  return 0;
};
var ThreadPrimitiveViewportSlack = ({ children, fillClampThreshold = "10em", fillClampOffset = "6em" }) => {
  const shouldApplySlack = useAuiState(
    // only add slack to the last assistant message following a user message (valid turn)
    (s) => {
      var _a2;
      return s.message.isLast && s.message.role === "assistant" && s.message.index >= 1 && ((_a2 = s.thread.messages.at(s.message.index - 1)) == null ? void 0 : _a2.role) === "user";
    }
  );
  const threadViewportStore = useThreadViewportStore({ optional: true });
  const isNested = (0, import_react114.useContext)(SlackNestingContext);
  const callback = (0, import_react114.useCallback)((el) => {
    if (!threadViewportStore || isNested)
      return;
    const updateMinHeight = () => {
      const state = threadViewportStore.getState();
      if (state.turnAnchor === "top" && shouldApplySlack) {
        const { viewport, inset, userMessage } = state.height;
        const threshold = parseCssLength(fillClampThreshold, el);
        const offset4 = parseCssLength(fillClampOffset, el);
        const clampAdjustment = userMessage <= threshold ? userMessage : offset4;
        const minHeight = Math.max(0, viewport - inset - clampAdjustment);
        el.style.minHeight = `${minHeight}px`;
        el.style.flexShrink = "0";
        el.style.transition = "min-height 0s";
      } else {
        el.style.minHeight = "";
        el.style.flexShrink = "";
        el.style.transition = "";
      }
    };
    updateMinHeight();
    return threadViewportStore.subscribe(updateMinHeight);
  }, [
    threadViewportStore,
    shouldApplySlack,
    isNested,
    fillClampThreshold,
    fillClampOffset
  ]);
  const ref = useManagedRef(callback);
  return (0, import_jsx_runtime96.jsx)(SlackNestingContext.Provider, { value: true, children: (0, import_jsx_runtime96.jsx)(dist_exports.Root, { ref, children }) });
};
ThreadPrimitiveViewportSlack.displayName = "ThreadPrimitive.ViewportSlack";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/message/MessageRoot.js
var useIsHoveringRef = () => {
  const aui = useAui();
  const message = useAuiState(() => aui.message());
  const callbackRef = (0, import_react115.useCallback)((el) => {
    const handleMouseEnter = () => {
      message.setIsHovering(true);
    };
    const handleMouseLeave = () => {
      message.setIsHovering(false);
    };
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    if (el.matches(":hover")) {
      queueMicrotask(() => message.setIsHovering(true));
    }
    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      message.setIsHovering(false);
    };
  }, [message]);
  return useManagedRef(callbackRef);
};
var useMessageViewportRef = () => {
  const turnAnchor = useThreadViewport((s) => s.turnAnchor);
  const registerUserHeight = useThreadViewport((s) => s.registerUserMessageHeight);
  const shouldRegisterAsInset = useAuiState((s) => {
    var _a2;
    return turnAnchor === "top" && s.message.role === "user" && s.message.index === s.thread.messages.length - 2 && ((_a2 = s.thread.messages.at(-1)) == null ? void 0 : _a2.role) === "assistant";
  });
  const getHeight3 = (0, import_react115.useCallback)((el) => el.offsetHeight, []);
  return useSizeHandle(shouldRegisterAsInset ? registerUserHeight : null, getHeight3);
};
var MessagePrimitiveRoot = (0, import_react115.forwardRef)(({ fillClampThreshold, fillClampOffset, ...props }, forwardRef95) => {
  const isHoveringRef = useIsHoveringRef();
  const anchorUserMessageRef = useMessageViewportRef();
  const ref = useComposedRefs(forwardRef95, isHoveringRef, anchorUserMessageRef);
  const messageId = useAuiState((s) => s.message.id);
  return (0, import_jsx_runtime97.jsx)(ThreadPrimitiveViewportSlack, { fillClampThreshold, fillClampOffset, children: (0, import_jsx_runtime97.jsx)(Primitive2.div, { ...props, ref, "data-message-id": messageId }) });
});
MessagePrimitiveRoot.displayName = "MessagePrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/message/MessageParts.js
var import_jsx_runtime98 = __toESM(require_jsx_runtime(), 1);
var webDefaultComponents = {
  ...defaultComponents,
  Text: () => (0, import_jsx_runtime98.jsxs)("p", { style: { whiteSpace: "pre-line" }, children: [(0, import_jsx_runtime98.jsx)(MessagePartPrimitiveText, {}), (0, import_jsx_runtime98.jsx)(MessagePartPrimitiveInProgress, { children: (0, import_jsx_runtime98.jsx)("span", { style: { fontFamily: "revert" }, children: " ●" }) })] }),
  Image: () => (0, import_jsx_runtime98.jsx)(MessagePartPrimitiveImage, {})
};
var MessagePrimitiveParts2 = (props) => {
  if ("children" in props) {
    return (0, import_jsx_runtime98.jsx)(MessagePrimitiveParts, { children: props.children });
  }
  const { components, ...rest } = props;
  const merged = components ? {
    Text: components.Text ?? webDefaultComponents.Text,
    Image: components.Image ?? webDefaultComponents.Image,
    Reasoning: components.Reasoning ?? defaultComponents.Reasoning,
    Source: components.Source ?? defaultComponents.Source,
    File: components.File ?? defaultComponents.File,
    Unstable_Audio: components.Unstable_Audio ?? defaultComponents.Unstable_Audio,
    ..."ChainOfThought" in components ? { ChainOfThought: components.ChainOfThought } : {
      tools: components.tools,
      data: components.data,
      ToolGroup: components.ToolGroup ?? defaultComponents.ToolGroup,
      ReasoningGroup: components.ReasoningGroup ?? defaultComponents.ReasoningGroup
    },
    Empty: components.Empty,
    Quote: components.Quote
  } : webDefaultComponents;
  return (0, import_jsx_runtime98.jsx)(MessagePrimitiveParts, { components: merged, ...rest });
};
MessagePrimitiveParts2.displayName = "MessagePrimitive.Parts";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/message/MessageError.js
var MessagePrimitiveError = ({ children }) => {
  const error = useMessageError();
  return error !== void 0 ? children : null;
};
MessagePrimitiveError.displayName = "MessagePrimitive.Error";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/message/MessagePartsGrouped.js
var import_jsx_runtime99 = __toESM(require_jsx_runtime(), 1);
var import_react119 = __toESM(require_react(), 1);
var groupMessagePartsByParentId = (parts) => {
  const groupMap = /* @__PURE__ */ new Map();
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const parentId = part == null ? void 0 : part.parentId;
    const groupId = parentId ?? `__ungrouped_${i}`;
    const indices = groupMap.get(groupId) ?? [];
    indices.push(i);
    groupMap.set(groupId, indices);
  }
  const groups = [];
  for (const [groupId, indices] of groupMap) {
    const groupKey = groupId.startsWith("__ungrouped_") ? void 0 : groupId;
    groups.push({ groupKey, indices });
  }
  return groups;
};
var useMessagePartsGrouped = (groupingFunction) => {
  const parts = useAuiState((s) => s.message.parts);
  return (0, import_react119.useMemo)(() => {
    if (parts.length === 0) {
      return [];
    }
    return groupingFunction(parts);
  }, [parts, groupingFunction]);
};
var ToolUIDisplay = ({ Fallback, ...props }) => {
  const Render = useAuiState((s) => {
    const Render2 = s.tools.tools[props.toolName] ?? Fallback;
    if (Array.isArray(Render2))
      return Render2[0] ?? Fallback;
    return Render2;
  });
  if (!Render)
    return null;
  return (0, import_jsx_runtime99.jsx)(Render, { ...props });
};
var DataUIDisplay = ({ Fallback, ...props }) => {
  const Render = useAuiState((s) => {
    const Render2 = s.dataRenderers.renderers[props.name] ?? Fallback;
    if (Array.isArray(Render2))
      return Render2[0] ?? Fallback;
    return Render2;
  });
  if (!Render)
    return null;
  return (0, import_jsx_runtime99.jsx)(Render, { ...props });
};
var defaultComponents2 = {
  Text: () => (0, import_jsx_runtime99.jsxs)("p", { style: { whiteSpace: "pre-line" }, children: [(0, import_jsx_runtime99.jsx)(MessagePartPrimitiveText, {}), (0, import_jsx_runtime99.jsx)(MessagePartPrimitiveInProgress, { children: (0, import_jsx_runtime99.jsx)("span", { style: { fontFamily: "revert" }, children: " ●" }) })] }),
  Reasoning: () => null,
  Source: () => null,
  Image: () => (0, import_jsx_runtime99.jsx)(MessagePartPrimitiveImage, {}),
  File: () => null,
  Unstable_Audio: () => null,
  Group: ({ children }) => children
};
var MessagePartComponent2 = ({ components: { Text = defaultComponents2.Text, Reasoning = defaultComponents2.Reasoning, Image = defaultComponents2.Image, Source = defaultComponents2.Source, File: File2 = defaultComponents2.File, Unstable_Audio: Audio = defaultComponents2.Unstable_Audio, tools = {}, data } = {} }) => {
  var _a2, _b, _c;
  const aui = useAui();
  const part = useAuiState((s) => s.part);
  const type = part.type;
  if (type === "tool-call") {
    const addResult = aui.part().addToolResult;
    const resume = aui.part().resumeToolCall;
    if ("Override" in tools)
      return (0, import_jsx_runtime99.jsx)(tools.Override, { ...part, addResult, resume });
    const Tool = ((_a2 = tools.by_name) == null ? void 0 : _a2[part.toolName]) ?? tools.Fallback;
    return (0, import_jsx_runtime99.jsx)(ToolUIDisplay, { ...part, Fallback: Tool, addResult, resume });
  }
  if (((_b = part.status) == null ? void 0 : _b.type) === "requires-action")
    throw new Error("Encountered unexpected requires-action status");
  switch (type) {
    case "text":
      return (0, import_jsx_runtime99.jsx)(Text, { ...part });
    case "reasoning":
      return (0, import_jsx_runtime99.jsx)(Reasoning, { ...part });
    case "source":
      return (0, import_jsx_runtime99.jsx)(Source, { ...part });
    case "image":
      return (0, import_jsx_runtime99.jsx)(Image, { ...part });
    case "file":
      return (0, import_jsx_runtime99.jsx)(File2, { ...part });
    case "audio":
      return (0, import_jsx_runtime99.jsx)(Audio, { ...part });
    case "data": {
      const Data = ((_c = data == null ? void 0 : data.by_name) == null ? void 0 : _c[part.name]) ?? (data == null ? void 0 : data.Fallback);
      return (0, import_jsx_runtime99.jsx)(DataUIDisplay, { ...part, Fallback: Data });
    }
    default:
      console.warn(`Unknown message part type: ${type}`);
      return null;
  }
};
var MessagePartImpl = ({ partIndex, components }) => {
  return (0, import_jsx_runtime99.jsx)(PartByIndexProvider, { index: partIndex, children: (0, import_jsx_runtime99.jsx)(MessagePartComponent2, { components }) });
};
var MessagePart = (0, import_react119.memo)(MessagePartImpl, (prev, next) => {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  return prev.partIndex === next.partIndex && ((_a2 = prev.components) == null ? void 0 : _a2.Text) === ((_b = next.components) == null ? void 0 : _b.Text) && ((_c = prev.components) == null ? void 0 : _c.Reasoning) === ((_d = next.components) == null ? void 0 : _d.Reasoning) && ((_e = prev.components) == null ? void 0 : _e.Source) === ((_f = next.components) == null ? void 0 : _f.Source) && ((_g = prev.components) == null ? void 0 : _g.Image) === ((_h = next.components) == null ? void 0 : _h.Image) && ((_i = prev.components) == null ? void 0 : _i.File) === ((_j = next.components) == null ? void 0 : _j.File) && ((_k = prev.components) == null ? void 0 : _k.Unstable_Audio) === ((_l = next.components) == null ? void 0 : _l.Unstable_Audio) && ((_m = prev.components) == null ? void 0 : _m.tools) === ((_n = next.components) == null ? void 0 : _n.tools) && ((_o = prev.components) == null ? void 0 : _o.data) === ((_p = next.components) == null ? void 0 : _p.data) && ((_q = prev.components) == null ? void 0 : _q.Group) === ((_r = next.components) == null ? void 0 : _r.Group);
});
var EmptyPartFallback = ({ status, component: Component }) => {
  return (0, import_jsx_runtime99.jsx)(TextMessagePartProvider, { text: "", isRunning: status.type === "running", children: (0, import_jsx_runtime99.jsx)(Component, { type: "text", text: "", status }) });
};
var COMPLETE_STATUS = Object.freeze({
  type: "complete"
});
var EmptyPartsImpl = ({ components }) => {
  const status = useAuiState((s) => s.message.status ?? COMPLETE_STATUS);
  if (components == null ? void 0 : components.Empty)
    return (0, import_jsx_runtime99.jsx)(components.Empty, { status });
  return (0, import_jsx_runtime99.jsx)(EmptyPartFallback, { status, component: (components == null ? void 0 : components.Text) ?? defaultComponents2.Text });
};
var EmptyParts = (0, import_react119.memo)(EmptyPartsImpl, (prev, next) => {
  var _a2, _b, _c, _d;
  return ((_a2 = prev.components) == null ? void 0 : _a2.Empty) === ((_b = next.components) == null ? void 0 : _b.Empty) && ((_c = prev.components) == null ? void 0 : _c.Text) === ((_d = next.components) == null ? void 0 : _d.Text);
});
var MessagePrimitiveUnstable_PartsGrouped = ({ groupingFunction, components }) => {
  const contentLength = useAuiState((s) => s.message.parts.length);
  const messageGroups = useMessagePartsGrouped(groupingFunction);
  const partsElements = (0, import_react119.useMemo)(() => {
    if (contentLength === 0) {
      return (0, import_jsx_runtime99.jsx)(EmptyParts, { components });
    }
    return messageGroups.map((group, groupIndex) => {
      const GroupComponent = (components == null ? void 0 : components.Group) ?? defaultComponents2.Group;
      return (0, import_jsx_runtime99.jsx)(GroupComponent, { groupKey: group.groupKey, indices: group.indices, children: group.indices.map((partIndex) => (0, import_jsx_runtime99.jsx)(MessagePart, { partIndex, components }, partIndex)) }, `group-${groupIndex}-${group.groupKey ?? "ungrouped"}`);
    });
  }, [messageGroups, components, contentLength]);
  return (0, import_jsx_runtime99.jsx)(import_jsx_runtime99.Fragment, { children: partsElements });
};
MessagePrimitiveUnstable_PartsGrouped.displayName = "MessagePrimitive.Unstable_PartsGrouped";
var MessagePrimitiveUnstable_PartsGroupedByParentId = ({ components, ...props }) => {
  return (0, import_jsx_runtime99.jsx)(MessagePrimitiveUnstable_PartsGrouped, { ...props, components, groupingFunction: groupMessagePartsByParentId });
};
MessagePrimitiveUnstable_PartsGroupedByParentId.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread.js
var thread_exports = {};
__export(thread_exports, {
  Empty: () => ThreadPrimitiveEmpty,
  If: () => ThreadPrimitiveIf,
  MessageByIndex: () => ThreadPrimitiveMessageByIndex,
  Messages: () => ThreadPrimitiveMessages,
  Root: () => ThreadPrimitiveRoot,
  ScrollToBottom: () => ThreadPrimitiveScrollToBottom,
  Suggestion: () => ThreadPrimitiveSuggestion,
  SuggestionByIndex: () => ThreadPrimitiveSuggestionByIndex,
  Suggestions: () => ThreadPrimitiveSuggestions,
  Viewport: () => ThreadPrimitiveViewport,
  ViewportFooter: () => ThreadPrimitiveViewportFooter,
  ViewportProvider: () => ThreadPrimitiveViewportProvider,
  ViewportSlack: () => ThreadPrimitiveViewportSlack
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadRoot.js
var import_jsx_runtime100 = __toESM(require_jsx_runtime(), 1);
var import_react121 = __toESM(require_react(), 1);
var ThreadPrimitiveRoot = (0, import_react121.forwardRef)((props, ref) => {
  return (0, import_jsx_runtime100.jsx)(Primitive2.div, { ...props, ref });
});
ThreadPrimitiveRoot.displayName = "ThreadPrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadEmpty.js
var ThreadPrimitiveEmpty = ({ children }) => {
  const empty = useAuiState((s) => s.thread.isEmpty);
  return empty ? children : null;
};
ThreadPrimitiveEmpty.displayName = "ThreadPrimitive.Empty";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadIf.js
var useThreadIf = (props) => {
  return useAuiState((s) => {
    if (props.empty === true && !s.thread.isEmpty)
      return false;
    if (props.empty === false && s.thread.isEmpty)
      return false;
    if (props.running === true && !s.thread.isRunning)
      return false;
    if (props.running === false && s.thread.isRunning)
      return false;
    if (props.disabled === true && !s.thread.isDisabled)
      return false;
    if (props.disabled === false && s.thread.isDisabled)
      return false;
    return true;
  });
};
var ThreadPrimitiveIf = ({ children, ...query }) => {
  const result = useThreadIf(query);
  return result ? children : null;
};
ThreadPrimitiveIf.displayName = "ThreadPrimitive.If";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadViewport.js
var import_jsx_runtime101 = __toESM(require_jsx_runtime(), 1);
var import_react124 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread/useThreadViewportAutoScroll.js
var import_react123 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/utils/hooks/useOnResizeContent.js
var import_react122 = __toESM(require_react(), 1);
var useOnResizeContent = (callback) => {
  const callbackRef = useCallbackRef(callback);
  const refCallback = (0, import_react122.useCallback)((el) => {
    const resizeObserver = new ResizeObserver(() => {
      callbackRef();
    });
    const mutationObserver = new MutationObserver((mutations) => {
      const hasRelevantMutation = mutations.some((m) => m.type !== "attributes" || m.attributeName !== "style");
      if (hasRelevantMutation) {
        callbackRef();
      }
    });
    resizeObserver.observe(el);
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [callbackRef]);
  return useManagedRef(refCallback);
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread/useThreadViewportAutoScroll.js
var useThreadViewportAutoScroll = ({ autoScroll, scrollToBottomOnRunStart = true, scrollToBottomOnInitialize = true, scrollToBottomOnThreadSwitch = true }) => {
  const divRef = (0, import_react123.useRef)(null);
  const threadViewportStore = useThreadViewportStore();
  if (autoScroll === void 0) {
    autoScroll = threadViewportStore.getState().turnAnchor !== "top";
  }
  const lastScrollTop = (0, import_react123.useRef)(0);
  const scrollingToBottomBehaviorRef = (0, import_react123.useRef)(null);
  const scrollToBottom = (0, import_react123.useCallback)((behavior) => {
    const div = divRef.current;
    if (!div)
      return;
    scrollingToBottomBehaviorRef.current = behavior;
    div.scrollTo({ top: div.scrollHeight, behavior });
  }, []);
  const handleScroll2 = () => {
    const div = divRef.current;
    if (!div)
      return;
    const isAtBottom = threadViewportStore.getState().isAtBottom;
    const newIsAtBottom = Math.abs(div.scrollHeight - div.scrollTop - div.clientHeight) < 1 || div.scrollHeight <= div.clientHeight;
    if (!newIsAtBottom && lastScrollTop.current < div.scrollTop) {
    } else {
      if (newIsAtBottom) {
        scrollingToBottomBehaviorRef.current = null;
      }
      const shouldUpdate = newIsAtBottom || scrollingToBottomBehaviorRef.current === null;
      if (shouldUpdate && newIsAtBottom !== isAtBottom) {
        writableStore(threadViewportStore).setState({
          isAtBottom: newIsAtBottom
        });
      }
    }
    lastScrollTop.current = div.scrollTop;
  };
  const resizeRef = useOnResizeContent(() => {
    const scrollBehavior = scrollingToBottomBehaviorRef.current;
    if (scrollBehavior) {
      scrollToBottom(scrollBehavior);
    } else if (autoScroll && threadViewportStore.getState().isAtBottom) {
      scrollToBottom("instant");
    }
    handleScroll2();
  });
  const scrollRef = useManagedRef((el) => {
    el.addEventListener("scroll", handleScroll2);
    return () => {
      el.removeEventListener("scroll", handleScroll2);
    };
  });
  useOnScrollToBottom(({ behavior }) => {
    scrollToBottom(behavior);
  });
  useAuiEvent("thread.runStart", () => {
    if (!scrollToBottomOnRunStart)
      return;
    scrollingToBottomBehaviorRef.current = "auto";
    requestAnimationFrame(() => {
      scrollToBottom("auto");
    });
  });
  useAuiEvent("thread.initialize", () => {
    if (!scrollToBottomOnInitialize)
      return;
    scrollingToBottomBehaviorRef.current = "instant";
    requestAnimationFrame(() => {
      scrollToBottom("instant");
    });
  });
  useAuiEvent("threadListItem.switchedTo", () => {
    if (!scrollToBottomOnThreadSwitch)
      return;
    scrollingToBottomBehaviorRef.current = "instant";
    requestAnimationFrame(() => {
      scrollToBottom("instant");
    });
  });
  const autoScrollRef = useComposedRefs(resizeRef, scrollRef, divRef);
  return autoScrollRef;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadViewport.js
var useViewportSizeRef = () => {
  const register = useThreadViewport((s) => s.registerViewport);
  const getHeight3 = (0, import_react124.useCallback)((el) => el.clientHeight, []);
  return useSizeHandle(register, getHeight3);
};
var ThreadPrimitiveViewportScrollable = (0, import_react124.forwardRef)(({ autoScroll, scrollToBottomOnRunStart, scrollToBottomOnInitialize, scrollToBottomOnThreadSwitch, children, ...rest }, forwardedRef) => {
  const autoScrollRef = useThreadViewportAutoScroll({
    autoScroll,
    scrollToBottomOnRunStart,
    scrollToBottomOnInitialize,
    scrollToBottomOnThreadSwitch
  });
  const viewportSizeRef = useViewportSizeRef();
  const ref = useComposedRefs(forwardedRef, autoScrollRef, viewportSizeRef);
  return (0, import_jsx_runtime101.jsx)(Primitive2.div, { ...rest, ref, children });
});
ThreadPrimitiveViewportScrollable.displayName = "ThreadPrimitive.ViewportScrollable";
var ThreadPrimitiveViewport = (0, import_react124.forwardRef)(({ turnAnchor, ...props }, ref) => {
  return (0, import_jsx_runtime101.jsx)(ThreadPrimitiveViewportProvider, { options: { turnAnchor }, children: (0, import_jsx_runtime101.jsx)(ThreadPrimitiveViewportScrollable, { ...props, ref }) });
});
ThreadPrimitiveViewport.displayName = "ThreadPrimitive.Viewport";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadViewportFooter.js
var import_jsx_runtime102 = __toESM(require_jsx_runtime(), 1);
var import_react125 = __toESM(require_react(), 1);
var ThreadPrimitiveViewportFooter = (0, import_react125.forwardRef)((props, forwardedRef) => {
  const register = useThreadViewport((s) => s.registerContentInset);
  const getHeight3 = (0, import_react125.useCallback)((el) => {
    const marginTop = parseFloat(getComputedStyle(el).marginTop) || 0;
    return el.offsetHeight + marginTop;
  }, []);
  const resizeRef = useSizeHandle(register, getHeight3);
  const ref = useComposedRefs(forwardedRef, resizeRef);
  return (0, import_jsx_runtime102.jsx)(Primitive2.div, { ...props, ref });
});
ThreadPrimitiveViewportFooter.displayName = "ThreadPrimitive.ViewportFooter";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadScrollToBottom.js
var import_react127 = __toESM(require_react(), 1);
var useThreadScrollToBottom = ({ behavior } = {}) => {
  const isAtBottom = useThreadViewport((s) => s.isAtBottom);
  const threadViewportStore = useThreadViewportStore();
  const handleScrollToBottom = (0, import_react127.useCallback)(() => {
    threadViewportStore.getState().scrollToBottom({ behavior });
  }, [threadViewportStore, behavior]);
  if (isAtBottom)
    return null;
  return handleScrollToBottom;
};
var ThreadPrimitiveScrollToBottom = createActionButton("ThreadPrimitive.ScrollToBottom", useThreadScrollToBottom, ["behavior"]);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/thread/ThreadSuggestion.js
var useThreadSuggestion = ({ prompt, send, clearComposer, autoSend, method: _method }) => {
  const resolvedSend = send ?? autoSend ?? false;
  const { disabled, trigger } = useSuggestionTrigger({
    prompt,
    send: resolvedSend,
    clearComposer
  });
  if (disabled)
    return null;
  return trigger;
};
var ThreadPrimitiveSuggestion = createActionButton("ThreadPrimitive.Suggestion", useThreadSuggestion, ["prompt", "send", "clearComposer", "autoSend", "method"]);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/suggestion.js
var suggestion_exports = {};
__export(suggestion_exports, {
  Description: () => SuggestionPrimitiveDescription,
  Title: () => SuggestionPrimitiveTitle,
  Trigger: () => SuggestionPrimitiveTrigger
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/suggestion/SuggestionTitle.js
var import_jsx_runtime103 = __toESM(require_jsx_runtime(), 1);
var import_react130 = __toESM(require_react(), 1);
var SuggestionPrimitiveTitle = (0, import_react130.forwardRef)((props, ref) => {
  const title = useAuiState((s) => s.suggestion.title);
  return (0, import_jsx_runtime103.jsx)(Primitive2.span, { ...props, ref, children: props.children ?? title });
});
SuggestionPrimitiveTitle.displayName = "SuggestionPrimitive.Title";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/suggestion/SuggestionDescription.js
var import_jsx_runtime104 = __toESM(require_jsx_runtime(), 1);
var import_react131 = __toESM(require_react(), 1);
var SuggestionPrimitiveDescription = (0, import_react131.forwardRef)((props, ref) => {
  const label = useAuiState((s) => s.suggestion.label);
  return (0, import_jsx_runtime104.jsx)(Primitive2.span, { ...props, ref, children: props.children ?? label });
});
SuggestionPrimitiveDescription.displayName = "SuggestionPrimitive.Description";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/suggestion/SuggestionTrigger.js
var import_react132 = __toESM(require_react(), 1);
var useSuggestionTrigger2 = ({ send, clearComposer = true }) => {
  const aui = useAui();
  const disabled = useAuiState((s) => s.thread.isDisabled);
  const prompt = useAuiState((s) => s.suggestion.prompt);
  const resolvedSend = send ?? false;
  const callback = (0, import_react132.useCallback)(() => {
    const isRunning = aui.thread().getState().isRunning;
    if (resolvedSend && !isRunning) {
      aui.thread().append({
        content: [{ type: "text", text: prompt }],
        runConfig: aui.composer().getState().runConfig
      });
      if (clearComposer) {
        aui.composer().setText("");
      }
    } else {
      if (clearComposer) {
        aui.composer().setText(prompt);
      } else {
        const currentText = aui.composer().getState().text;
        aui.composer().setText(currentText.trim() ? `${currentText} ${prompt}` : prompt);
      }
    }
  }, [aui, resolvedSend, clearComposer, prompt]);
  if (disabled)
    return null;
  return callback;
};
var SuggestionPrimitiveTrigger = createActionButton("SuggestionPrimitive.Trigger", useSuggestionTrigger2, ["send", "clearComposer"]);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadList.js
var threadList_exports = {};
__export(threadList_exports, {
  ItemByIndex: () => ThreadListPrimitiveItemByIndex,
  Items: () => ThreadListPrimitiveItems,
  New: () => ThreadListPrimitiveNew,
  Root: () => ThreadListPrimitiveRoot
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadList/ThreadListNew.js
var import_jsx_runtime105 = __toESM(require_jsx_runtime(), 1);
var import_react133 = __toESM(require_react(), 1);
var ThreadListPrimitiveNew = (0, import_react133.forwardRef)(({ onClick, disabled, ...props }, forwardedRef) => {
  const isMain = useAuiState((s) => s.threads.newThreadId === s.threads.mainThreadId);
  const { switchToNewThread } = useThreadListNew();
  return (0, import_jsx_runtime105.jsx)(Primitive2.button, { type: "button", ...isMain ? { "data-active": "true", "aria-current": "true" } : null, ...props, ref: forwardedRef, disabled, onClick: composeEventHandlers(onClick, switchToNewThread) });
});
ThreadListPrimitiveNew.displayName = "ThreadListPrimitive.New";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadList/ThreadListRoot.js
var import_jsx_runtime106 = __toESM(require_jsx_runtime(), 1);
var import_react136 = __toESM(require_react(), 1);
var ThreadListPrimitiveRoot = (0, import_react136.forwardRef)((props, ref) => {
  return (0, import_jsx_runtime106.jsx)(Primitive2.div, { ...props, ref });
});
ThreadListPrimitiveRoot.displayName = "ThreadListPrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItem.js
var threadListItem_exports = {};
__export(threadListItem_exports, {
  Archive: () => ThreadListItemPrimitiveArchive,
  Delete: () => ThreadListItemPrimitiveDelete,
  Root: () => ThreadListItemPrimitiveRoot,
  Title: () => ThreadListItemPrimitiveTitle,
  Trigger: () => ThreadListItemPrimitiveTrigger,
  Unarchive: () => ThreadListItemPrimitiveUnarchive
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItem/ThreadListItemRoot.js
var import_jsx_runtime107 = __toESM(require_jsx_runtime(), 1);
var import_react137 = __toESM(require_react(), 1);
var ThreadListItemPrimitiveRoot = (0, import_react137.forwardRef)((props, ref) => {
  const isMain = useAuiState((s) => s.threads.mainThreadId === s.threadListItem.id);
  return (0, import_jsx_runtime107.jsx)(Primitive2.div, { ...isMain ? { "data-active": "true", "aria-current": "true" } : null, ...props, ref });
});
ThreadListItemPrimitiveRoot.displayName = "ThreadListItemPrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItem/ThreadListItemArchive.js
var useThreadListItemArchive2 = () => {
  const { archive } = useThreadListItemArchive();
  return archive;
};
var ThreadListItemPrimitiveArchive = createActionButton("ThreadListItemPrimitive.Archive", useThreadListItemArchive2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItem/ThreadListItemUnarchive.js
var useThreadListItemUnarchive2 = () => {
  const { unarchive } = useThreadListItemUnarchive();
  return unarchive;
};
var ThreadListItemPrimitiveUnarchive = createActionButton("ThreadListItemPrimitive.Unarchive", useThreadListItemUnarchive2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItem/ThreadListItemDelete.js
var useThreadListItemDelete2 = () => {
  const { delete: deleteThread } = useThreadListItemDelete();
  return deleteThread;
};
var ThreadListItemPrimitiveDelete = createActionButton("ThreadListItemPrimitive.Delete", useThreadListItemDelete2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItem/ThreadListItemTrigger.js
var useThreadListItemTrigger2 = () => {
  const { switchTo } = useThreadListItemTrigger();
  return switchTo;
};
var ThreadListItemPrimitiveTrigger = createActionButton("ThreadListItemPrimitive.Trigger", useThreadListItemTrigger2);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItemMore.js
var threadListItemMore_exports = {};
__export(threadListItemMore_exports, {
  Content: () => ThreadListItemMorePrimitiveContent,
  Item: () => ThreadListItemMorePrimitiveItem,
  Root: () => ThreadListItemMorePrimitiveRoot,
  Separator: () => ThreadListItemMorePrimitiveSeparator,
  Trigger: () => ThreadListItemMorePrimitiveTrigger
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItemMore/ThreadListItemMoreRoot.js
var import_jsx_runtime108 = __toESM(require_jsx_runtime(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItemMore/scope.js
var useDropdownMenuScope2 = dist_exports9.createDropdownMenuScope();

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItemMore/ThreadListItemMoreRoot.js
var ThreadListItemMorePrimitiveRoot = ({ __scopeThreadListItemMore, ...rest }) => {
  const scope = useDropdownMenuScope2(__scopeThreadListItemMore);
  return (0, import_jsx_runtime108.jsx)(dist_exports9.Root, { ...scope, ...rest });
};
ThreadListItemMorePrimitiveRoot.displayName = "ThreadListItemMorePrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItemMore/ThreadListItemMoreTrigger.js
var import_jsx_runtime109 = __toESM(require_jsx_runtime(), 1);
var import_react143 = __toESM(require_react(), 1);
var ThreadListItemMorePrimitiveTrigger = (0, import_react143.forwardRef)(({ __scopeThreadListItemMore, ...rest }, ref) => {
  const scope = useDropdownMenuScope2(__scopeThreadListItemMore);
  return (0, import_jsx_runtime109.jsx)(dist_exports9.Trigger, { ...scope, ...rest, ref });
});
ThreadListItemMorePrimitiveTrigger.displayName = "ThreadListItemMorePrimitive.Trigger";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItemMore/ThreadListItemMoreContent.js
var import_jsx_runtime110 = __toESM(require_jsx_runtime(), 1);
var import_react144 = __toESM(require_react(), 1);
var ThreadListItemMorePrimitiveContent = (0, import_react144.forwardRef)(({ __scopeThreadListItemMore, portalProps, sideOffset = 4, ...props }, forwardedRef) => {
  const scope = useDropdownMenuScope2(__scopeThreadListItemMore);
  return (0, import_jsx_runtime110.jsx)(dist_exports9.Portal, { ...scope, ...portalProps, children: (0, import_jsx_runtime110.jsx)(dist_exports9.Content, { ...scope, ...props, ref: forwardedRef, sideOffset }) });
});
ThreadListItemMorePrimitiveContent.displayName = "ThreadListItemMorePrimitive.Content";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItemMore/ThreadListItemMoreItem.js
var import_jsx_runtime111 = __toESM(require_jsx_runtime(), 1);
var import_react145 = __toESM(require_react(), 1);
var ThreadListItemMorePrimitiveItem = (0, import_react145.forwardRef)(({ __scopeThreadListItemMore, ...rest }, ref) => {
  const scope = useDropdownMenuScope2(__scopeThreadListItemMore);
  return (0, import_jsx_runtime111.jsx)(dist_exports9.Item, { ...scope, ...rest, ref });
});
ThreadListItemMorePrimitiveItem.displayName = "ThreadListItemMorePrimitive.Item";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/threadListItemMore/ThreadListItemMoreSeparator.js
var import_jsx_runtime112 = __toESM(require_jsx_runtime(), 1);
var import_react146 = __toESM(require_react(), 1);
var ThreadListItemMorePrimitiveSeparator = (0, import_react146.forwardRef)(({ __scopeThreadListItemMore, ...rest }, ref) => {
  const scope = useDropdownMenuScope2(__scopeThreadListItemMore);
  return (0, import_jsx_runtime112.jsx)(dist_exports9.Separator, { ...scope, ...rest, ref });
});
ThreadListItemMorePrimitiveSeparator.displayName = "ThreadListItemMorePrimitive.Separator";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/selectionToolbar.js
var selectionToolbar_exports = {};
__export(selectionToolbar_exports, {
  Quote: () => SelectionToolbarPrimitiveQuote,
  Root: () => SelectionToolbarPrimitiveRoot
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/selectionToolbar/SelectionToolbarRoot.js
var import_jsx_runtime113 = __toESM(require_jsx_runtime(), 1);
var import_react147 = __toESM(require_react(), 1);
var import_react_dom6 = __toESM(require_react_dom(), 1);

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/utils/getSelectionMessageId.js
var findMessageId = (node) => {
  let el = node instanceof HTMLElement ? node : (node == null ? void 0 : node.parentElement) ?? null;
  while (el) {
    const id = el.getAttribute("data-message-id");
    if (id)
      return id;
    el = el.parentElement;
  }
  return null;
};
var getSelectionMessageId = (selection) => {
  const { anchorNode, focusNode } = selection;
  if (!anchorNode || !focusNode)
    return null;
  const anchorId = findMessageId(anchorNode);
  const focusId = findMessageId(focusNode);
  if (!anchorId || anchorId !== focusId)
    return null;
  return anchorId;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/selectionToolbar/SelectionToolbarRoot.js
var SelectionToolbarContext = (0, import_react147.createContext)(null);
var useSelectionToolbarInfo = () => (0, import_react147.useContext)(SelectionToolbarContext);
var SelectionToolbarPrimitiveRoot = (0, import_react147.forwardRef)(({ onMouseDown, style, ...props }, forwardedRef) => {
  const [info, setInfo] = (0, import_react147.useState)(null);
  (0, import_react147.useEffect)(() => {
    const checkSelection = () => {
      requestAnimationFrame(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          setInfo(null);
          return;
        }
        const text = sel.toString().trim();
        if (!text) {
          setInfo(null);
          return;
        }
        const messageId = getSelectionMessageId(sel);
        if (!messageId) {
          setInfo(null);
          return;
        }
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setInfo({ text, messageId, rect });
      });
    };
    const handleSelectionCollapse = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setInfo(null);
      }
    };
    const handleScroll2 = () => {
      setInfo(null);
    };
    document.addEventListener("mouseup", checkSelection);
    document.addEventListener("keyup", checkSelection);
    document.addEventListener("selectionchange", handleSelectionCollapse);
    document.addEventListener("scroll", handleScroll2, true);
    return () => {
      document.removeEventListener("mouseup", checkSelection);
      document.removeEventListener("keyup", checkSelection);
      document.removeEventListener("selectionchange", handleSelectionCollapse);
      document.removeEventListener("scroll", handleScroll2, true);
    };
  }, []);
  if (!info)
    return null;
  const positionStyle = {
    position: "fixed",
    top: `${info.rect.top - 8}px`,
    left: `${info.rect.left + info.rect.width / 2}px`,
    transform: "translate(-50%, -100%)",
    zIndex: 50,
    ...style
  };
  return (0, import_react_dom6.createPortal)((0, import_jsx_runtime113.jsx)(SelectionToolbarContext.Provider, { value: info, children: (0, import_jsx_runtime113.jsx)(Primitive2.div, { ...props, ref: forwardedRef, style: positionStyle, onMouseDown: (e) => {
    e.preventDefault();
    onMouseDown == null ? void 0 : onMouseDown(e);
  } }) }), document.body);
});
SelectionToolbarPrimitiveRoot.displayName = "SelectionToolbarPrimitive.Root";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/selectionToolbar/SelectionToolbarQuote.js
var import_jsx_runtime114 = __toESM(require_jsx_runtime(), 1);
var import_react148 = __toESM(require_react(), 1);
var SelectionToolbarPrimitiveQuote = (0, import_react148.forwardRef)(({ onClick, disabled, ...props }, forwardedRef) => {
  const aui = useAui();
  const info = useSelectionToolbarInfo();
  const handleClick = (0, import_react148.useCallback)(() => {
    var _a2;
    if (!info)
      return;
    aui.thread().composer().setQuote({
      text: info.text,
      messageId: info.messageId
    });
    (_a2 = window.getSelection()) == null ? void 0 : _a2.removeAllRanges();
  }, [aui, info]);
  return (0, import_jsx_runtime114.jsx)(Primitive2.button, { type: "button", ...props, ref: forwardedRef, disabled: disabled || !info, onClick: composeEventHandlers(onClick, handleClick) });
});
SelectionToolbarPrimitiveQuote.displayName = "SelectionToolbarPrimitive.Quote";

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart/useMessagePartReasoning.js
var useMessagePartReasoning = () => {
  const text = useAuiState((s) => {
    if (s.part.type !== "reasoning")
      throw new Error("MessagePartReasoning can only be used inside reasoning message parts.");
    return s.part;
  });
  return text;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart/useMessagePartSource.js
var useMessagePartSource = () => {
  const source = useAuiState((s) => {
    if (s.part.type !== "source")
      throw new Error("MessagePartSource can only be used inside source message parts.");
    return s.part;
  });
  return source;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart/useMessagePartFile.js
var useMessagePartFile = () => {
  const file = useAuiState((s) => {
    if (s.part.type !== "file")
      throw new Error("MessagePartFile can only be used inside file message parts.");
    return s.part;
  });
  return file;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/messagePart/useMessagePartData.js
var useMessagePartData = (name) => {
  const part = useAuiState((s) => {
    if (s.part.type !== "data") {
      return null;
    }
    return s.part;
  });
  if (!part) {
    return null;
  }
  if (name && part.name !== name) {
    return null;
  }
  return part;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/primitives/reasoning/useScrollLock.js
var import_react149 = __toESM(require_react(), 1);
var useScrollLock = (animatedElementRef, animationDuration) => {
  const scrollContainerRef = (0, import_react149.useRef)(null);
  const cleanupRef = (0, import_react149.useRef)(null);
  (0, import_react149.useEffect)(() => {
    return () => {
      var _a2;
      (_a2 = cleanupRef.current) == null ? void 0 : _a2.call(cleanupRef);
    };
  }, []);
  const lockScroll = (0, import_react149.useCallback)(() => {
    var _a2;
    (_a2 = cleanupRef.current) == null ? void 0 : _a2.call(cleanupRef);
    (function findScrollableAncestor() {
      if (scrollContainerRef.current || !animatedElementRef.current)
        return;
      let el = animatedElementRef.current;
      while (el) {
        const { overflowY } = getComputedStyle(el);
        if (overflowY === "scroll" || overflowY === "auto") {
          scrollContainerRef.current = el;
          break;
        }
        el = el.parentElement;
      }
    })();
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer)
      return;
    const scrollPosition = scrollContainer.scrollTop;
    const scrollbarWidth = scrollContainer.style.scrollbarWidth;
    scrollContainer.style.scrollbarWidth = "none";
    const resetPosition = () => scrollContainer.scrollTop = scrollPosition;
    scrollContainer.addEventListener("scroll", resetPosition);
    const timeoutId = setTimeout(() => {
      scrollContainer.removeEventListener("scroll", resetPosition);
      scrollContainer.style.scrollbarWidth = scrollbarWidth;
      cleanupRef.current = null;
    }, animationDuration);
    cleanupRef.current = () => {
      clearTimeout(timeoutId);
      scrollContainer.removeEventListener("scroll", resetPosition);
      scrollContainer.style.scrollbarWidth = scrollbarWidth;
    };
  }, [animationDuration, animatedElementRef]);
  return lockScroll;
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/hooks/useMessageQuote.js
var useMessageQuote = () => {
  return useAuiState(getMessageQuote);
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/hooks/useMessageTiming.js
var useMessageTiming = () => {
  return useAuiState((s) => {
    var _a2;
    return s.message.role === "assistant" ? (_a2 = s.message.metadata) == null ? void 0 : _a2.timing : void 0;
  });
};

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/client/SingleThreadList.js
var RESOLVED_PROMISE = Promise.resolve();
var THREAD_ID = "default";
var SingleThreadListItem = resource(() => {
  return {
    getState: () => ({
      id: THREAD_ID,
      remoteId: void 0,
      externalId: void 0,
      title: void 0,
      status: "regular"
    }),
    switchTo: () => {
    },
    rename: () => {
    },
    archive: () => {
    },
    unarchive: () => {
    },
    delete: () => {
    },
    generateTitle: () => {
    },
    initialize: async () => ({ remoteId: THREAD_ID, externalId: void 0 }),
    detach: () => {
    }
  };
});
var SingleThreadList = resource(({ thread }) => {
  const itemClient = tapClientResource(SingleThreadListItem());
  const threadClient = tapClientResource(thread);
  const state = tapMemo(() => ({
    mainThreadId: THREAD_ID,
    newThreadId: null,
    isLoading: false,
    threadIds: [THREAD_ID],
    archivedThreadIds: [],
    threadItems: [itemClient.state],
    main: threadClient.state
  }), [itemClient.state, threadClient.state]);
  return {
    getState: () => state,
    switchToThread: () => {
      throw new Error("SingleThreadList does not support switchToThread");
    },
    switchToNewThread: () => {
      throw new Error("SingleThreadList does not support switchToNewThread");
    },
    getLoadThreadsPromise: () => RESOLVED_PROMISE,
    item: (selector) => {
      if (selector !== "main" && !(typeof selector === "object" && "id" in selector && selector.id === THREAD_ID) && !(typeof selector === "object" && "index" in selector && selector.index === 0)) {
        throw new Error(`SingleThreadList: unknown item selector ${JSON.stringify(selector)}`);
      }
      return itemClient.methods;
    },
    thread: (selector) => {
      if (selector !== "main" && selector !== THREAD_ID) {
        throw new Error(`SingleThreadList: unknown thread selector ${JSON.stringify(selector)}`);
      }
      return threadClient.methods;
    }
  };
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/client/ExternalThread.js
var EMPTY_QUEUE_ITEMS = [];
var MessageClient = resource(({ message, index: index4, onEdit, onReload, queue }) => {
  const [isCopied, setIsCopied] = tapState(false);
  const [isHovering, setIsHovering] = tapState(false);
  const [isEditing, setIsEditing] = tapState(false);
  const partClients = tapClientLookup(() => message.content.map((part, idx) => withKey(idx, PartResource({ part }))), [message.content]);
  const attachmentClients = tapClientLookup(() => (message.attachments ?? []).map((attachment) => withKey(attachment.id, AttachmentResource({
    attachment,
    onRemove: () => {
    }
  }))), [message.attachments]);
  const handleBeginEdit = () => {
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  const handleSendEdit = (msg) => {
    queue == null ? void 0 : queue.clear("edit");
    onEdit == null ? void 0 : onEdit({
      ...msg,
      parentId: message.id,
      sourceId: message.id
    });
    setIsEditing(false);
  };
  const composerClient = tapClientResource(ComposerClientResource({
    type: "edit",
    isEditing,
    canCancel: true,
    onCancel: handleCancelEdit,
    onBeginEdit: handleBeginEdit,
    onSend: handleSendEdit,
    message,
    queue
  }));
  const state = tapMemo(() => {
    return {
      ...message,
      attachments: message.attachments ?? [],
      parentId: null,
      isLast: false,
      // Will be set by thread
      branchNumber: 1,
      branchCount: 1,
      speech: void 0,
      submittedFeedback: void 0,
      parts: partClients.state,
      isCopied,
      isHovering,
      index: index4,
      composer: composerClient.state
    };
  }, [
    message,
    isCopied,
    isHovering,
    index4,
    composerClient.state,
    partClients.state
  ]);
  return {
    getState: () => state,
    composer: () => composerClient.methods,
    reload: () => {
      onReload == null ? void 0 : onReload();
    },
    speak: () => {
    },
    stopSpeaking: () => {
    },
    submitFeedback: () => {
    },
    switchToBranch: () => {
    },
    getCopyText: () => message.content.map((c) => "text" in c ? c.text : "").join(""),
    part: (selector) => {
      if ("index" in selector) {
        return partClients.get(selector);
      }
      const partIndex = state.parts.findIndex((p) => p.type === "tool-call" && p.toolCallId === selector.toolCallId);
      return partClients.get({ index: partIndex });
    },
    attachment: (selector) => {
      if ("id" in selector) {
        return attachmentClients.get({ key: selector.id });
      }
      return attachmentClients.get(selector);
    },
    setIsCopied,
    setIsHovering
  };
});
var PartResource = resource(({ part }) => {
  const state = tapMemo(() => ({
    ...part,
    status: { type: "complete" }
  }), [part]);
  return {
    getState: () => state,
    addToolResult: () => {
    },
    resumeToolCall: () => {
    }
  };
});
var AttachmentResource = resource(({ attachment, onRemove }) => {
  return {
    getState: () => attachment,
    remove: async () => {
      onRemove == null ? void 0 : onRemove();
    }
  };
});
var QueueItemClient = resource(({ item, onSteer, onRemove }) => {
  return {
    getState: () => item,
    steer: onSteer,
    remove: onRemove
  };
});
var ComposerClientResource = resource(({ type, isEditing, canCancel, onCancel, onBeginEdit, onSend, message, queue }) => {
  const [text, setText] = tapState("");
  const [role, setRole] = tapState("user");
  const [runConfig, setRunConfig] = tapState({});
  const [attachments, setAttachments] = tapState([]);
  const [quote, setQuote] = tapState(void 0);
  const updateFromMessage = tapEffectEvent(() => {
    if (message) {
      const textParts = message.content.filter((part) => part.type === "text");
      const messageText = textParts.map((part) => "text" in part ? part.text : "").join("\n\n");
      setText(messageText);
      setRole(message.role);
      setAttachments(message.attachments ?? []);
    }
  });
  tapEffect(() => {
    if (isEditing) {
      updateFromMessage();
    }
  }, [isEditing]);
  const attachmentClients = tapClientLookup(() => attachments.map((attachment, idx) => withKey(attachment.id, AttachmentResource({
    attachment,
    onRemove: () => {
      setAttachments(attachments.filter((_, i) => i !== idx));
    }
  }))), [attachments]);
  const queueItems = (queue == null ? void 0 : queue.items) ?? EMPTY_QUEUE_ITEMS;
  const queueItemClients = tapClientLookup(() => queueItems.map((item) => withKey(item.id, QueueItemClient({
    item,
    onSteer: () => queue == null ? void 0 : queue.steer(item.id),
    onRemove: () => queue == null ? void 0 : queue.remove(item.id)
  }))), [queueItems]);
  const state = tapMemo(() => ({
    text,
    role,
    attachments: attachmentClients.state,
    runConfig,
    isEditing,
    canCancel,
    attachmentAccept: "*",
    isEmpty: !text.trim() && !attachments.length,
    type,
    dictation: void 0,
    quote,
    queue: queueItems
  }), [
    text,
    role,
    attachmentClients.state,
    runConfig,
    isEditing,
    canCancel,
    type,
    attachments.length,
    quote,
    queueItems
  ]);
  return {
    getState: () => state,
    setText,
    setRole,
    setRunConfig,
    addAttachment: async (fileOrAttachment) => {
      if (fileOrAttachment instanceof File) {
        const newAttachment = {
          id: Math.random().toString(36).substring(7),
          type: "file",
          name: fileOrAttachment.name,
          contentType: fileOrAttachment.type,
          file: fileOrAttachment,
          status: { type: "complete" },
          content: []
        };
        setAttachments([...attachments, newAttachment]);
      } else {
        const newAttachment = {
          id: fileOrAttachment.id ?? Math.random().toString(36).substring(7),
          type: fileOrAttachment.type ?? "document",
          name: fileOrAttachment.name,
          contentType: fileOrAttachment.contentType,
          content: fileOrAttachment.content,
          status: { type: "complete" }
        };
        setAttachments([...attachments, newAttachment]);
      }
    },
    clearAttachments: async () => {
      setAttachments([]);
    },
    attachment: (selector) => {
      if ("id" in selector) {
        return attachmentClients.get({ key: selector.id });
      }
      return attachmentClients.get(selector);
    },
    reset: async () => {
      setText("");
      setRole("user");
      setRunConfig({});
      setAttachments([]);
      setQuote(void 0);
    },
    send: (opts) => {
      const currentQuote = quote;
      const composedMessage = {
        role,
        content: text ? [{ type: "text", text }] : [],
        attachments,
        createdAt: /* @__PURE__ */ new Date(),
        parentId: null,
        sourceId: null,
        runConfig,
        startRun: opts == null ? void 0 : opts.startRun,
        metadata: {
          custom: { ...currentQuote ? { quote: currentQuote } : {} }
        }
      };
      if (queue) {
        queue.enqueue(composedMessage, { steer: (opts == null ? void 0 : opts.steer) ?? false });
      } else {
        onSend == null ? void 0 : onSend(composedMessage);
      }
      setText("");
      setAttachments([]);
      setQuote(void 0);
    },
    cancel: onCancel,
    beginEdit: () => {
      onBeginEdit == null ? void 0 : onBeginEdit();
    },
    startDictation: () => {
    },
    stopDictation: () => {
    },
    setQuote,
    queueItem: (selector) => {
      return queueItemClients.get(selector);
    }
  };
});
var ExternalThread = resource(({ messages, isRunning = false, onNew, onEdit, onReload, onStartRun, onCancel, queue }) => {
  const handleReload = (messageId) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1)
      return;
    const parentId = messageIndex > 0 ? messages[messageIndex - 1].id : null;
    queue == null ? void 0 : queue.clear("reload");
    onReload == null ? void 0 : onReload(parentId);
  };
  const messageClients = tapClientLookup(() => messages.map((msg, index4) => {
    const props = {
      message: msg,
      index: index4,
      onReload: () => handleReload(msg.id),
      queue
    };
    if (onEdit)
      props.onEdit = onEdit;
    return withKey(msg.id, MessageClient(props));
  }), [messages, onEdit, queue]);
  const handleCancelRun = () => {
    queue == null ? void 0 : queue.clear("cancel-run");
    onCancel == null ? void 0 : onCancel();
  };
  const handleSendNew = (message) => {
    onNew == null ? void 0 : onNew(message);
  };
  const composerClient = tapClientResource(ComposerClientResource({
    type: "thread",
    isEditing: true,
    canCancel: isRunning,
    onCancel: handleCancelRun,
    onSend: handleSendNew,
    queue
  }));
  const hasQueue = !!queue;
  const state = tapMemo(() => {
    const messageStates = messageClients.state.map((s, idx, arr) => ({
      ...s,
      isLast: idx === arr.length - 1
    }));
    return {
      isEmpty: messages.length === 0,
      isDisabled: false,
      isLoading: false,
      isRunning,
      capabilities: {
        edit: false,
        reload: false,
        cancel: isRunning,
        speech: false,
        attachments: false,
        feedback: false,
        voice: false,
        switchToBranch: false,
        switchBranchDuringRun: false,
        unstable_copy: false,
        dictation: false,
        queue: hasQueue
      },
      messages: messageStates,
      state: {},
      suggestions: [],
      extras: void 0,
      speech: void 0,
      voice: void 0,
      composer: composerClient.state
    };
  }, [
    messages,
    isRunning,
    hasQueue,
    messageClients.state,
    composerClient.state
  ]);
  return {
    getState: () => state,
    composer: () => composerClient.methods,
    append: (message) => {
      var _a2, _b;
      const appendMessage = typeof message === "string" ? {
        createdAt: /* @__PURE__ */ new Date(),
        parentId: ((_a2 = messages.at(-1)) == null ? void 0 : _a2.id) ?? null,
        sourceId: null,
        runConfig: {},
        role: "user",
        content: [{ type: "text", text: message }],
        attachments: [],
        metadata: { custom: {} }
      } : {
        createdAt: message.createdAt ?? /* @__PURE__ */ new Date(),
        parentId: message.parentId ?? ((_b = messages.at(-1)) == null ? void 0 : _b.id) ?? null,
        sourceId: message.sourceId ?? null,
        role: message.role ?? "user",
        content: message.content,
        attachments: message.attachments ?? [],
        metadata: message.metadata ?? { custom: {} },
        runConfig: message.runConfig ?? {},
        startRun: message.startRun
      };
      if (queue) {
        queue.enqueue(appendMessage, { steer: false });
      } else {
        onNew == null ? void 0 : onNew(appendMessage);
      }
    },
    startRun: () => {
      onStartRun == null ? void 0 : onStartRun();
    },
    resumeRun: () => {
    },
    unstable_resumeRun: () => {
    },
    cancelRun: handleCancelRun,
    getModelContext: () => ({ tools: {}, config: {} }),
    export: () => ({ messages: [] }),
    import: () => {
    },
    reset: () => {
    },
    message: (selector) => {
      if ("id" in selector) {
        return messageClients.get({ key: selector.id });
      }
      return messageClients.get(selector);
    },
    stopSpeaking: () => {
    },
    connectVoice: () => {
    },
    disconnectVoice: () => {
    },
    getVoiceVolume: () => 0,
    subscribeVoiceVolume: () => () => {
    },
    muteVoice: () => {
    },
    unmuteVoice: () => {
    }
  };
});
attachTransformScopes(ExternalThread, (scopes, parent) => {
  if (!scopes.threads && parent.threads.source === null) {
    const threadElement = scopes.thread;
    scopes.threads = SingleThreadList({ thread: threadElement });
    scopes.thread = Derived({
      source: "threads",
      query: { type: "main" },
      get: (aui) => aui.threads().thread("main")
    });
  }
  if (!scopes.threadListItem && parent.threadListItem.source === null) {
    scopes.threadListItem = Derived({
      source: "threads",
      query: { type: "main" },
      get: (aui) => aui.threads().item("main")
    });
  }
  scopes.composer ?? (scopes.composer = Derived({
    source: "thread",
    query: {},
    get: (aui) => aui.thread().composer()
  }));
  if (!scopes.modelContext && parent.modelContext.source === null) {
    scopes.modelContext = ModelContext();
  }
  if (!scopes.tools && parent.tools.source === null) {
    scopes.tools = Tools({});
  }
  if (!scopes.dataRenderers && parent.dataRenderers.source === null) {
    scopes.dataRenderers = DataRenderers();
  }
  if (!scopes.suggestions && parent.suggestions.source === null) {
    scopes.suggestions = Suggestions();
  }
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/client/InMemoryThreadList.js
var RESOLVED_PROMISE2 = Promise.resolve();
var ThreadListItemClient = resource((props) => {
  const { data, onSwitchTo, onArchive, onUnarchive, onDelete } = props;
  const state = tapMemo(() => ({
    id: data.id,
    remoteId: void 0,
    externalId: void 0,
    title: data.title,
    status: data.status
  }), [data.id, data.title, data.status]);
  return {
    getState: () => state,
    switchTo: onSwitchTo,
    rename: () => {
    },
    archive: onArchive,
    unarchive: onUnarchive,
    delete: onDelete,
    generateTitle: () => {
    },
    initialize: async () => ({ remoteId: data.id, externalId: void 0 }),
    detach: () => {
    }
  };
});
var InMemoryThreadList = resource((props) => {
  const { thread: threadFactory, onSwitchToThread, onSwitchToNewThread } = props;
  const [mainThreadId, setMainThreadId] = tapState("main");
  const [threads, setThreads] = tapState(() => [
    { id: "main", title: "Main Thread", status: "regular" }
  ]);
  const handleSwitchToThread = (threadId) => {
    setMainThreadId(threadId);
    onSwitchToThread == null ? void 0 : onSwitchToThread(threadId);
  };
  const handleArchive = (threadId) => {
    setThreads((prev) => prev.map((t) => t.id === threadId ? { ...t, status: "archived" } : t));
  };
  const handleUnarchive = (threadId) => {
    setThreads((prev) => prev.map((t) => t.id === threadId ? { ...t, status: "regular" } : t));
  };
  const handleDelete = (threadId) => {
    var _a2;
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    if (mainThreadId === threadId) {
      const remaining = threads.filter((t) => t.id !== threadId);
      setMainThreadId(((_a2 = remaining[0]) == null ? void 0 : _a2.id) || "main");
    }
  };
  const handleSwitchToNewThread = () => {
    const newId = `thread-${Date.now()}`;
    setThreads((prev) => [
      ...prev,
      { id: newId, title: "New Thread", status: "regular" }
    ]);
    setMainThreadId(newId);
    onSwitchToNewThread == null ? void 0 : onSwitchToNewThread();
  };
  const threadListItems = tapClientLookup(() => threads.map((t) => withKey(t.id, ThreadListItemClient({
    data: t,
    onSwitchTo: () => handleSwitchToThread(t.id),
    onArchive: () => handleArchive(t.id),
    onUnarchive: () => handleUnarchive(t.id),
    onDelete: () => handleDelete(t.id)
  }))), [threads]);
  const mainThreadClient = tapClientResource(threadFactory(mainThreadId));
  const state = tapMemo(() => {
    const regularThreads = threads.filter((t) => t.status === "regular");
    const archivedThreads = threads.filter((t) => t.status === "archived");
    return {
      mainThreadId,
      newThreadId: null,
      isLoading: false,
      threadIds: regularThreads.map((t) => t.id),
      archivedThreadIds: archivedThreads.map((t) => t.id),
      threadItems: threadListItems.state,
      main: mainThreadClient.state
    };
  }, [mainThreadId, threads, threadListItems.state, mainThreadClient.state]);
  return {
    getState: () => state,
    switchToThread: handleSwitchToThread,
    switchToNewThread: handleSwitchToNewThread,
    getLoadThreadsPromise: () => RESOLVED_PROMISE2,
    item: (selector) => {
      if (selector === "main") {
        const index4 = threads.findIndex((t) => t.id === mainThreadId);
        return threadListItems.get({ index: index4 === -1 ? 0 : index4 });
      }
      if ("id" in selector) {
        const index4 = threads.findIndex((t) => t.id === selector.id);
        return threadListItems.get({ index: index4 });
      }
      return threadListItems.get(selector);
    },
    thread: () => mainThreadClient.methods
  };
});
attachTransformScopes(InMemoryThreadList, (scopes, parent) => {
  scopes.thread ?? (scopes.thread = Derived({
    source: "threads",
    query: { type: "main" },
    get: (aui) => aui.threads().thread("main")
  }));
  scopes.threadListItem ?? (scopes.threadListItem = Derived({
    source: "threads",
    query: { type: "main" },
    get: (aui) => aui.threads().item("main")
  }));
  scopes.composer ?? (scopes.composer = Derived({
    source: "thread",
    query: {},
    get: (aui) => aui.threads().thread("main").composer()
  }));
  if (!scopes.modelContext && parent.modelContext.source === null) {
    scopes.modelContext = ModelContext();
  }
  if (!scopes.tools && parent.tools.source === null) {
    scopes.tools = Tools({});
  }
  if (!scopes.dataRenderers && parent.dataRenderers.source === null) {
    scopes.dataRenderers = DataRenderers();
  }
  if (!scopes.suggestions && parent.suggestions.source === null) {
    scopes.suggestions = Suggestions();
  }
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/internal.js
var internal_exports = {};
__export(internal_exports, {
  AssistantRuntimeImpl: () => AssistantRuntimeImpl,
  BaseAssistantRuntimeCore: () => BaseAssistantRuntimeCore,
  CompositeContextProvider: () => CompositeContextProvider,
  DefaultThreadComposerRuntimeCore: () => DefaultThreadComposerRuntimeCore,
  MessageRepository: () => MessageRepository,
  ThreadRuntimeImpl: () => ThreadRuntimeImpl,
  fromThreadMessageLike: () => fromThreadMessageLike,
  generateId: () => generateId,
  getAutoStatus: () => getAutoStatus,
  splitLocalRuntimeOptions: () => splitLocalRuntimeOptions,
  useComposerInputPluginRegistryOptional: () => useComposerInputPluginRegistryOptional,
  useSmooth: () => useSmooth,
  useSmoothStatus: () => useSmoothStatus,
  useToolInvocations: () => useToolInvocations,
  withSmoothContextProvider: () => withSmoothContextProvider
});

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/unstable/useToolMentionAdapter.js
var import_react155 = __toESM(require_react(), 1);
function unstable_useToolMentionAdapter(options) {
  const aui = useAui();
  const explicitTools = options == null ? void 0 : options.tools;
  const includeModelContext = (options == null ? void 0 : options.includeModelContextTools) ?? !explicitTools;
  const formatLabel = options == null ? void 0 : options.formatLabel;
  const categoryLabel = options == null ? void 0 : options.categoryLabel;
  return (0, import_react155.useMemo)(() => {
    const getTools = () => {
      const items = [];
      if (explicitTools) {
        items.push(...explicitTools);
      }
      if (includeModelContext) {
        const context = aui.thread().getModelContext();
        const tools = context.tools;
        if (tools) {
          for (const [name, tool2] of Object.entries(tools)) {
            if (!items.some((i) => i.id === name)) {
              items.push({
                id: name,
                type: "tool",
                label: formatLabel ? formatLabel(name) : name,
                description: tool2.description ?? void 0
              });
            }
          }
        }
      }
      return items;
    };
    return {
      categories() {
        return [
          { id: "tools", label: categoryLabel ?? "Tools", icon: void 0 }
        ];
      },
      categoryItems(_categoryId) {
        return getTools();
      },
      search(query) {
        const lower = query.toLowerCase();
        return getTools().filter((item) => {
          var _a2;
          return item.id.toLowerCase().includes(lower) || item.label.toLowerCase().includes(lower) || ((_a2 = item.description) == null ? void 0 : _a2.toLowerCase().includes(lower));
        });
      }
    };
  }, [aui, explicitTools, includeModelContext, formatLabel, categoryLabel]);
}

// ../../node_modules/.pnpm/@assistant-ui+react@0.12.24_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react@_1443618c8f190003c0f37875367ffd78/node_modules/@assistant-ui/react/dist/unstable/useSlashCommandAdapter.js
var import_react156 = __toESM(require_react(), 1);
function unstable_useSlashCommandAdapter(options) {
  const { commands } = options;
  return (0, import_react156.useMemo)(() => {
    const getItems = () => commands.map((cmd) => ({
      id: cmd.name,
      type: "command",
      label: cmd.label ?? `/${cmd.name}`,
      description: cmd.description,
      icon: cmd.icon,
      execute: cmd.execute
    }));
    return {
      // No categories — slash commands show items directly via search mode
      categories() {
        return [];
      },
      categoryItems() {
        return [];
      },
      search(query) {
        const items = getItems();
        if (!query)
          return items;
        const lower = query.toLowerCase();
        return items.filter((item) => {
          var _a2;
          return item.id.toLowerCase().includes(lower) || item.label.toLowerCase().includes(lower) || ((_a2 = item.description) == null ? void 0 : _a2.toLowerCase().includes(lower));
        });
      }
    };
  }, [commands]);
}
export {
  actionBarMore_exports as ActionBarMorePrimitive,
  actionBar_exports as ActionBarPrimitive,
  AssistantCloud,
  AssistantFrameHost,
  AssistantFrameProvider,
  AuiIf as AssistantIf,
  assistantModal_exports as AssistantModalPrimitive,
  AssistantRuntimeProvider,
  attachment_exports as AttachmentPrimitive,
  AuiIf,
  AuiProvider,
  branchPicker_exports as BranchPickerPrimitive,
  ChainOfThoughtByIndicesProvider,
  ChainOfThoughtClient,
  chainOfThought_exports as ChainOfThoughtPrimitive,
  CloudFileAttachmentAdapter,
  ComposerAttachmentByIndexProvider,
  composer_exports as ComposerPrimitive,
  CompositeAttachmentAdapter,
  DataRenderers,
  DevToolsHooks,
  DevToolsProviderApi,
  error_exports as ErrorPrimitive,
  ExportedMessageRepository,
  ExternalThread,
  FRAME_MESSAGE_CHANNEL,
  internal_exports as INTERNAL,
  InMemoryThreadList,
  InMemoryThreadListAdapter,
  Interactables,
  MessageAttachmentByIndexProvider,
  MessageByIndexProvider,
  messagePart_exports as MessagePartPrimitive,
  message_exports as MessagePrimitive,
  MessageProvider,
  ModelContext as ModelContextClient,
  ModelContextRegistry,
  PartByIndexProvider,
  queueItem_exports as QueueItemPrimitive,
  ReadonlyThreadProvider,
  RuntimeAdapterProvider,
  selectionToolbar_exports as SelectionToolbarPrimitive,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
  SingleThreadList,
  SuggestionByIndexProvider,
  suggestion_exports as SuggestionPrimitive,
  Suggestions,
  TextMessagePartProvider,
  ThreadListItemByIndexProvider,
  threadListItemMore_exports as ThreadListItemMorePrimitive,
  threadListItem_exports as ThreadListItemPrimitive,
  ThreadListItemRuntimeProvider,
  threadList_exports as ThreadListPrimitive,
  thread_exports as ThreadPrimitive,
  Tools,
  WebSpeechDictationAdapter,
  WebSpeechSynthesisAdapter,
  bindExternalStoreMessage,
  createVoiceSession,
  getExternalStoreMessage,
  getExternalStoreMessages,
  makeAssistantDataUI,
  makeAssistantTool,
  makeAssistantToolUI,
  makeAssistantVisible,
  mergeModelContexts,
  tool,
  InMemoryThreadListAdapter as unstable_InMemoryThreadListAdapter,
  convertExternalMessages as unstable_convertExternalMessages,
  createMessageConverter as unstable_createMessageConverter,
  useCloudThreadListAdapter as unstable_useCloudThreadListAdapter,
  useMentionContext as unstable_useMentionContext,
  useMentionContextOptional as unstable_useMentionContextOptional,
  useMentionInternalContext as unstable_useMentionInternalContext,
  useRemoteThreadListRuntime as unstable_useRemoteThreadListRuntime,
  unstable_useSlashCommandAdapter,
  unstable_useToolMentionAdapter,
  useTriggerPopoverContext as unstable_useTriggerPopoverContext,
  useTriggerPopoverContextOptional as unstable_useTriggerPopoverContextOptional,
  useAui as useAssistantApi,
  useAssistantContext,
  useAssistantDataUI,
  useAuiEvent as useAssistantEvent,
  useAssistantFrameHost,
  useAssistantInstructions,
  useAssistantInteractable,
  useAssistantRuntime,
  useAuiState as useAssistantState,
  useAssistantTool,
  useAssistantToolUI,
  useAssistantTransportRuntime,
  useAssistantTransportSendCommand,
  useAssistantTransportState,
  useAttachment,
  useAttachmentRuntime,
  useAui,
  useAuiEvent,
  useAuiState,
  useCloudThreadListAdapter,
  useCloudThreadListRuntime,
  useComposer,
  useComposerRuntime,
  useEditComposer,
  useEditComposerAttachment,
  useEditComposerAttachmentRuntime,
  useExternalMessageConverter,
  useExternalStoreRuntime,
  useInlineRender,
  useInteractableState,
  useLocalRuntime,
  useLocalRuntime as useLocalThreadRuntime,
  useMessage,
  useMessageAttachment,
  useMessageAttachmentRuntime,
  useMessagePart,
  useMessagePartData,
  useMessagePartFile,
  useMessagePartImage,
  useMessagePartReasoning,
  useMessagePartRuntime,
  useMessagePartSource,
  useMessagePartText,
  useMessageQuote,
  useMessageRuntime,
  useMessageTiming,
  useRemoteThreadListRuntime,
  useRuntimeAdapters,
  useScrollLock,
  useThread,
  useThreadComposer,
  useThreadComposerAttachment,
  useThreadComposerAttachmentRuntime,
  useThreadList,
  useThreadListItem,
  useThreadListItemRuntime,
  useThreadModelContext,
  useThreadRuntime,
  useThreadViewport,
  useThreadViewportAutoScroll,
  useThreadViewportStore,
  useToolArgsStatus,
  useVoiceControls,
  useVoiceState,
  useVoiceVolume
};
//# sourceMappingURL=@assistant-ui_react.js.map
