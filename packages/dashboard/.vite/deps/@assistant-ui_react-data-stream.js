import {
  AssistantMessageAccumulator,
  DataStreamDecoder,
  UIMessageStreamDecoder,
  asAsyncIterableStream,
  splitLocalRuntimeOptions,
  toGenericMessages,
  toToolsJSONSchema,
  toolResultStream,
  useLocalRuntime
} from "./chunk-EZOGSO4P.js";
import "./chunk-EWUVWUVW.js";
import "./chunk-YAJ64PPY.js";
import {
  __publicField
} from "./chunk-DP4XHQAG.js";

// ../../node_modules/.pnpm/@assistant-ui+react-data-stream@0.12.10_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5_0b47d1b53670e808a4542a8b4f328a4f/node_modules/@assistant-ui/react-data-stream/dist/converters/toLanguageModelMessages.js
function toUrl(value) {
  if (value instanceof URL)
    return value;
  try {
    return new URL(value);
  } catch {
    return new URL(value, "file://");
  }
}
function convertUserContent(content) {
  return content.content.map((part) => {
    if (part.type === "text") {
      return part;
    }
    return {
      type: "file",
      data: toUrl(part.data),
      mediaType: part.mediaType
    };
  });
}
function convertAssistantContent(content) {
  return content.map((part) => {
    if (part.type === "text") {
      return part;
    }
    return {
      type: "tool-call",
      toolCallId: part.toolCallId,
      toolName: part.toolName,
      input: part.args
    };
  });
}
function convertToolContent(content) {
  return content.map((part) => ({
    type: "tool-result",
    toolCallId: part.toolCallId,
    toolName: part.toolName,
    output: part.isError ? { type: "error-json", value: part.result } : { type: "json", value: part.result }
  }));
}
function convertGenericToLanguageModel(generic) {
  switch (generic.role) {
    case "system":
      return { role: "system", content: generic.content };
    case "user":
      return { role: "user", content: convertUserContent(generic) };
    case "assistant":
      return {
        role: "assistant",
        content: convertAssistantContent(generic.content)
      };
    case "tool":
      return { role: "tool", content: convertToolContent(generic.content) };
  }
}
function toLanguageModelMessages(messages, options = {}) {
  const includeId = options.unstable_includeId ?? false;
  const genericMessages = toGenericMessages(messages);
  if (!includeId) {
    return genericMessages.map(convertGenericToLanguageModel);
  }
  const result = [];
  let messageIndex = 0;
  for (const generic of genericMessages) {
    const converted = convertGenericToLanguageModel(generic);
    if (generic.role !== "tool") {
      while (messageIndex < messages.length && messages[messageIndex].role !== generic.role) {
        messageIndex++;
      }
      if (messageIndex < messages.length) {
        converted.unstable_id = messages[messageIndex].id;
        messageIndex++;
      }
    }
    result.push(converted);
  }
  return result;
}

// ../../node_modules/.pnpm/@assistant-ui+react-data-stream@0.12.10_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5_0b47d1b53670e808a4542a8b4f328a4f/node_modules/@assistant-ui/react-data-stream/dist/useDataStreamRuntime.js
var DataStreamRuntimeAdapter = class {
  constructor(options) {
    __publicField(this, "options");
    this.options = options;
  }
  async *run({ messages, runConfig, abortSignal, context, unstable_assistantMessageId, unstable_threadId, unstable_parentId, unstable_getMessage }) {
    var _a, _b, _c, _d, _e, _f;
    const headersValue = typeof this.options.headers === "function" ? await this.options.headers() : this.options.headers;
    const bodyValue = typeof this.options.body === "function" ? await this.options.body() : this.options.body;
    abortSignal.addEventListener("abort", () => {
      var _a2, _b2, _c2;
      if (!((_a2 = abortSignal.reason) == null ? void 0 : _a2.detach))
        (_c2 = (_b2 = this.options).onCancel) == null ? void 0 : _c2.call(_b2);
    }, { once: true });
    const headers = new Headers(headersValue);
    headers.set("Content-Type", "application/json");
    const result = await fetch(this.options.api, {
      method: "POST",
      headers,
      credentials: this.options.credentials ?? "same-origin",
      body: JSON.stringify({
        system: context.system,
        messages: toLanguageModelMessages(messages, {
          unstable_includeId: this.options.sendExtraMessageFields
        }),
        tools: toToolsJSONSchema(context.tools ?? {}),
        ...unstable_assistantMessageId ? { unstable_assistantMessageId } : {},
        ...unstable_threadId ? { threadId: unstable_threadId } : {},
        ...unstable_parentId !== void 0 ? { parentId: unstable_parentId } : {},
        runConfig,
        state: unstable_getMessage().metadata.unstable_state || void 0,
        ...context.callSettings,
        ...context.config,
        ...bodyValue ?? {}
      }),
      signal: abortSignal
    });
    await ((_b = (_a = this.options).onResponse) == null ? void 0 : _b.call(_a, result));
    try {
      if (!result.ok) {
        throw new Error(`Status ${result.status}: ${await result.text()}`);
      }
      if (!result.body) {
        throw new Error("Response body is null");
      }
      const protocol = this.options.protocol ?? "ui-message-stream";
      const decoder = protocol === "ui-message-stream" ? new UIMessageStreamDecoder(this.options.onData ? { onData: this.options.onData } : {}) : new DataStreamDecoder();
      const stream = result.body.pipeThrough(decoder).pipeThrough(toolResultStream(context.tools, abortSignal, () => {
        throw new Error("Tool interrupt is not supported in data stream runtime");
      })).pipeThrough(new AssistantMessageAccumulator());
      yield* asAsyncIterableStream(stream);
      (_d = (_c = this.options).onFinish) == null ? void 0 : _d.call(_c, unstable_getMessage());
    } catch (error) {
      (_f = (_e = this.options).onError) == null ? void 0 : _f.call(_e, error);
      throw error;
    }
  }
};
var useDataStreamRuntime = (options) => {
  const { localRuntimeOptions, otherOptions } = splitLocalRuntimeOptions(options);
  return useLocalRuntime(new DataStreamRuntimeAdapter(otherOptions), localRuntimeOptions);
};

// ../../node_modules/.pnpm/@assistant-ui+react-data-stream@0.12.10_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5_0b47d1b53670e808a4542a8b4f328a4f/node_modules/@assistant-ui/react-data-stream/dist/useCloudRuntime.js
var useCloudRuntime = (options) => {
  const opts = options.cloud.runs.__internal_getAssistantOptions(options.assistantId);
  return useDataStreamRuntime({
    ...options,
    ...opts
  });
};
export {
  toLanguageModelMessages,
  useCloudRuntime,
  useDataStreamRuntime
};
//# sourceMappingURL=@assistant-ui_react-data-stream.js.map
