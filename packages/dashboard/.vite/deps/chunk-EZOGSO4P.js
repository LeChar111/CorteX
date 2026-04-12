import {
  require_jsx_runtime
} from "./chunk-EWUVWUVW.js";
import {
  require_react
} from "./chunk-YAJ64PPY.js";
import {
  __commonJS,
  __privateAdd,
  __privateGet,
  __privateSet,
  __publicField,
  __toESM
} from "./chunk-DP4XHQAG.js";

// ../../node_modules/.pnpm/secure-json-parse@4.1.0/node_modules/secure-json-parse/index.js
var require_secure_json_parse = __commonJS({
  "../../node_modules/.pnpm/secure-json-parse@4.1.0/node_modules/secure-json-parse/index.js"(exports, module) {
    "use strict";
    var hasBuffer = typeof Buffer !== "undefined";
    var suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
    var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
    function _parse(text, reviver, options) {
      if (options == null) {
        if (reviver !== null && typeof reviver === "object") {
          options = reviver;
          reviver = void 0;
        }
      }
      if (hasBuffer && Buffer.isBuffer(text)) {
        text = text.toString();
      }
      if (text && text.charCodeAt(0) === 65279) {
        text = text.slice(1);
      }
      const obj = JSON.parse(text, reviver);
      if (obj === null || typeof obj !== "object") {
        return obj;
      }
      const protoAction = options && options.protoAction || "error";
      const constructorAction = options && options.constructorAction || "error";
      if (protoAction === "ignore" && constructorAction === "ignore") {
        return obj;
      }
      if (protoAction !== "ignore" && constructorAction !== "ignore") {
        if (suspectProtoRx.test(text) === false && suspectConstructorRx.test(text) === false) {
          return obj;
        }
      } else if (protoAction !== "ignore" && constructorAction === "ignore") {
        if (suspectProtoRx.test(text) === false) {
          return obj;
        }
      } else {
        if (suspectConstructorRx.test(text) === false) {
          return obj;
        }
      }
      return filter(obj, { protoAction, constructorAction, safe: options && options.safe });
    }
    function filter(obj, { protoAction = "error", constructorAction = "error", safe } = {}) {
      let next = [obj];
      while (next.length) {
        const nodes = next;
        next = [];
        for (const node of nodes) {
          if (protoAction !== "ignore" && Object.prototype.hasOwnProperty.call(node, "__proto__")) {
            if (safe === true) {
              return null;
            } else if (protoAction === "error") {
              throw new SyntaxError("Object contains forbidden prototype property");
            }
            delete node.__proto__;
          }
          if (constructorAction !== "ignore" && Object.prototype.hasOwnProperty.call(node, "constructor") && node.constructor !== null && typeof node.constructor === "object" && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
            if (safe === true) {
              return null;
            } else if (constructorAction === "error") {
              throw new SyntaxError("Object contains forbidden prototype property");
            }
            delete node.constructor;
          }
          for (const key in node) {
            const value = node[key];
            if (value && typeof value === "object") {
              next.push(value);
            }
          }
        }
      }
      return obj;
    }
    function parse(text, reviver, options) {
      const { stackTraceLimit } = Error;
      Error.stackTraceLimit = 0;
      try {
        return _parse(text, reviver, options);
      } finally {
        Error.stackTraceLimit = stackTraceLimit;
      }
    }
    function safeParse(text, reviver) {
      const { stackTraceLimit } = Error;
      Error.stackTraceLimit = 0;
      try {
        return _parse(text, reviver, { safe: true });
      } catch {
        return void 0;
      } finally {
        Error.stackTraceLimit = stackTraceLimit;
      }
    }
    module.exports = parse;
    module.exports.default = parse;
    module.exports.parse = parse;
    module.exports.safeParse = safeParse;
    module.exports.scan = filter;
  }
});

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/utils/react-assistant-context.js
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var import_react = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/core/helpers/callResourceFn.js
function callResourceFn(resource2, props) {
  const fn = resource2[fnSymbol];
  if (!fn) {
    throw new Error("ResourceElement.type is not a valid Resource");
  }
  return fn(props);
}
var fnSymbol = Symbol("fnSymbol");

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/core/resource.js
function resource(fn) {
  const type = (props) => {
    return {
      type,
      props
    };
  };
  type[fnSymbol] = fn;
  return type;
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/core/withKey.js
function withKey(key, element) {
  return { ...element, key };
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/core/helpers/env.js
var isDevelopment = typeof process !== "undefined" && true;

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/core/helpers/execution-context.js
var currentResourceFiber = null;
function withResourceFiber(fiber, fn) {
  fiber.currentIndex = 0;
  const previousContext = currentResourceFiber;
  currentResourceFiber = fiber;
  try {
    fn();
    fiber.isFirstRender = false;
    if (fiber.cells.length !== fiber.currentIndex) {
      throw new Error(`Rendered ${fiber.currentIndex} hooks but expected ${fiber.cells.length}. Hooks must be called in the exact same order in every render.`);
    }
  } finally {
    currentResourceFiber = previousContext;
  }
}
function getCurrentResourceFiber() {
  if (!currentResourceFiber) {
    throw new Error("No resource fiber available");
  }
  return currentResourceFiber;
}
function getDevStrictMode(enable) {
  if (!isDevelopment)
    return null;
  if (currentResourceFiber == null ? void 0 : currentResourceFiber.devStrictMode)
    return currentResourceFiber.isFirstRender ? "child" : "root";
  return enable ? "root" : null;
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/core/helpers/root.js
var createResourceFiberRoot = (dispatchUpdate) => {
  return {
    version: 0,
    committedVersion: 0,
    dispatchUpdate,
    changelog: [],
    dirtyCells: []
  };
};
var commitRoot = (root) => {
  for (const cell of root.dirtyCells) {
    cell.dirty = false;
    cell.queue.clear();
    cell.current = cell.workInProgress;
  }
  root.committedVersion = root.version;
  root.changelog.length = 0;
  root.dirtyCells.length = 0;
};
var setRootVersion = (root, version2) => {
  const rollback = root.version > version2;
  root.version = version2;
  if (rollback) {
    for (const cell of root.dirtyCells) {
      cell.dirty = false;
      cell.queue.clear();
      cell.workInProgress = cell.current;
    }
    root.dirtyCells.length = 0;
    if (version2 === root.committedVersion) {
      root.changelog.length = 0;
    } else {
      if (root.committedVersion > version2)
        throw new Error("Version is less than committed version");
      while (root.committedVersion + root.changelog.length > version2) {
        root.changelog.pop();
      }
      root.changelog.forEach((apply) => apply());
      commitRoot(root);
    }
  }
};
var markCellDirty = (fiber, cell) => {
  var _a2;
  if (!cell.dirty) {
    cell.dirty = true;
    (_a2 = fiber.markDirty) == null ? void 0 : _a2.call(fiber);
    fiber.root.dirtyCells.push(cell);
  }
};

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/utils/tapHook.js
var tapHook = (type, init) => {
  const fiber = getCurrentResourceFiber();
  const index = fiber.currentIndex++;
  if (!fiber.isFirstRender && index >= fiber.cells.length) {
    throw new Error("Rendered more hooks than during the previous render. Hooks must be called in the exact same order in every render.");
  }
  let cell = fiber.cells[index];
  if (!cell) {
    cell = init();
    fiber.cells[index] = cell;
  }
  if (cell.type !== type) {
    throw new Error("Hook order changed between renders");
  }
  return cell;
};
var registerRenderMountTask = (task) => {
  const fiber = getCurrentResourceFiber();
  fiber.renderContext.effectTasks.push(task);
};

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/tap-reducer.js
var dispatchOnFiber = (fiber, callback) => {
  if (fiber.renderContext) {
    throw new Error("Resource updated during render");
  }
  if (fiber.isNeverMounted) {
    throw new Error("Resource updated before mount");
  }
  fiber.root.dispatchUpdate(() => {
    const result = callback();
    if (result) {
      result();
      fiber.root.changelog.push(result);
      return true;
    }
    return false;
  });
};
function tapReducerImpl(reducer, getDerivedState, initialArg, initFn) {
  const cell = tapHook("reducer", () => {
    const fiber2 = getCurrentResourceFiber();
    const initialState = initFn ? initFn(initialArg) : initialArg;
    if (isDevelopment && fiber2.devStrictMode && initFn) {
      void initFn(initialArg);
    }
    return {
      type: "reducer",
      queue: /* @__PURE__ */ new Set(),
      dirty: false,
      workInProgress: initialState,
      current: initialState,
      reducer,
      dispatch: (action) => {
        const entry = {
          action,
          hasEagerState: false,
          eagerState: void 0
        };
        dispatchOnFiber(fiber2, () => {
          if (fiber2.root.dirtyCells.length === 0 && !entry.hasEagerState) {
            entry.eagerState = reducer(cell.workInProgress, action);
            entry.hasEagerState = true;
            if (Object.is(cell.current, entry.eagerState))
              return null;
          }
          return () => {
            markCellDirty(fiber2, cell);
            cell.queue.add(entry);
          };
        });
      }
    };
  });
  const fiber = getCurrentResourceFiber();
  const sameReducer = reducer === cell.reducer;
  cell.reducer = reducer;
  for (const item of cell.queue) {
    if (!item.hasEagerState || !sameReducer) {
      item.eagerState = reducer(cell.workInProgress, item.action);
      item.hasEagerState = true;
    }
    if (isDevelopment && fiber.devStrictMode) {
      void reducer(cell.workInProgress, item.action);
    }
    cell.workInProgress = item.eagerState;
  }
  cell.queue.clear();
  if (getDerivedState) {
    const derived = getDerivedState(cell.workInProgress);
    if (!Object.is(derived, cell.workInProgress)) {
      markCellDirty(fiber, cell);
      cell.workInProgress = derived;
    }
  }
  return [cell.workInProgress, cell.dispatch];
}
function tapReducer(reducer, initialArg, init) {
  return tapReducerImpl(reducer, void 0, initialArg, init);
}
function tapReducerWithDerivedState(reducer, getDerivedState, initialArg, init) {
  return tapReducerImpl(reducer, getDerivedState, initialArg, init);
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/tap-state.js
var stateReducer = (state, action) => typeof action === "function" ? action(state) : action;
var stateInit = (initial) => typeof initial === "function" ? initial() : initial;
function tapState(initial) {
  return tapReducer(stateReducer, initial, stateInit);
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/utils/depsShallowEqual.js
var depsShallowEqual = (a, b) => {
  if (a.length !== b.length)
    return false;
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i]))
      return false;
  }
  return true;
};

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/tap-effect.js
var newEffect = () => ({
  type: "effect",
  cleanup: void 0,
  deps: null
  // null means the effect has never been run
});
function tapEffect(effect, deps) {
  const cell = tapHook("effect", newEffect);
  if (deps && cell.deps && depsShallowEqual(cell.deps, deps))
    return;
  if (cell.deps !== null && !!deps !== !!cell.deps)
    throw new Error("tapEffect called with and without dependencies across re-renders");
  registerRenderMountTask(() => {
    var _a2;
    const errors = [];
    try {
      (_a2 = cell.cleanup) == null ? void 0 : _a2.call(cell);
    } catch (error) {
      errors.push(error);
    } finally {
      cell.cleanup = void 0;
    }
    try {
      const cleanup = effect();
      if (cleanup !== void 0 && typeof cleanup !== "function") {
        throw new Error(`An effect function must either return a cleanup function or nothing. Received: ${typeof cleanup}`);
      }
      cell.cleanup = cleanup;
    } catch (error) {
      errors.push(error);
    }
    cell.deps = deps;
    if (errors.length > 0) {
      if (errors.length === 1) {
        throw errors[0];
      } else {
        for (const error of errors) {
          console.error(error);
        }
        throw new AggregateError(errors, "Errors during commit");
      }
    }
  });
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/tap-ref.js
function tapRef(initialValue) {
  const [state] = tapState(() => ({
    current: initialValue
  }));
  return state;
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/tap-const.js
function tapConst(getValue, _deps) {
  const [state] = tapState(getValue);
  return state;
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/tap-memo.js
var memoReducer = () => {
  throw new Error("Memo reducer should not be called");
};
var tapMemo = (fn, deps) => {
  const fiber = getCurrentResourceFiber();
  const [state] = tapReducerWithDerivedState(memoReducer, (state2) => {
    if (state2 && depsShallowEqual(state2.deps, deps))
      return state2;
    const value = fn();
    if (isDevelopment && fiber.devStrictMode) {
      void fn();
    }
    return { value, deps };
  }, null);
  return state.value;
};

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/tap-callback.js
var tapCallback = (fn, deps) => {
  return tapMemo(() => fn, deps);
};

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/tap-effect-event.js
function tapEffectEvent(callback) {
  const callbackRef = tapRef(callback);
  tapEffect(() => {
    callbackRef.current = callback;
  });
  if (isDevelopment) {
    const fiber = getCurrentResourceFiber();
    return tapCallback(((...args) => {
      if (fiber.renderContext)
        throw new Error("tapEffectEvent cannot be called during render");
      return callbackRef.current(...args);
    }), [fiber]);
  }
  return callbackRef.current;
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/core/helpers/commit.js
function commitAllEffects(renderResult) {
  const errors = [];
  for (const task of renderResult.effectTasks) {
    try {
      task();
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length > 0) {
    if (errors.length === 1) {
      throw errors[0];
    } else {
      for (const error of errors) {
        console.error(error);
      }
      throw new AggregateError(errors, "Errors during commit");
    }
  }
}
function cleanupAllEffects(executionContext) {
  var _a2;
  const errors = [];
  for (const cell of executionContext.cells) {
    if ((cell == null ? void 0 : cell.type) === "effect") {
      cell.deps = null;
      if (cell.cleanup) {
        try {
          (_a2 = cell.cleanup) == null ? void 0 : _a2.call(cell);
        } catch (e) {
          errors.push(e);
        } finally {
          cell.cleanup = void 0;
        }
      }
    }
  }
  if (errors.length > 0) {
    if (errors.length === 1) {
      throw errors[0];
    } else {
      for (const error of errors) {
        console.error(error);
      }
      throw new AggregateError(errors, "Errors during cleanup");
    }
  }
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/core/ResourceFiber.js
function createResourceFiber(type, root, markDirty = void 0, strictMode = getDevStrictMode(false)) {
  return {
    type,
    root,
    markDirty,
    devStrictMode: strictMode,
    cells: [],
    currentIndex: 0,
    renderContext: void 0,
    isFirstRender: true,
    isMounted: false,
    isNeverMounted: true
  };
}
function unmountResourceFiber(fiber) {
  if (!fiber.isMounted)
    throw new Error("Tried to unmount a fiber that is already unmounted");
  fiber.isMounted = false;
  cleanupAllEffects(fiber);
}
function renderResourceFiber(fiber, props) {
  const result = {
    effectTasks: [],
    props,
    output: void 0
  };
  withResourceFiber(fiber, () => {
    fiber.renderContext = result;
    try {
      result.output = callResourceFn(fiber.type, props);
    } finally {
      fiber.renderContext = void 0;
    }
  });
  return result;
}
function commitResourceFiber(fiber, result) {
  fiber.isMounted = true;
  if (isDevelopment && fiber.isNeverMounted && fiber.devStrictMode === "root") {
    fiber.isNeverMounted = false;
    commitAllEffects(result);
    cleanupAllEffects(fiber);
  }
  fiber.isNeverMounted = false;
  commitAllEffects(result);
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/tap-resource.js
function tapResource(element, propsDeps) {
  const parentFiber = getCurrentResourceFiber();
  const versionRef = tapRef(0);
  const fiber = tapMemo(() => {
    void element.key;
    return createResourceFiber(element.type, parentFiber.root, () => {
      var _a2;
      versionRef.current++;
      (_a2 = parentFiber.markDirty) == null ? void 0 : _a2.call(parentFiber);
    });
  }, [element.type, element.key, parentFiber]);
  const result = propsDeps ? (
    // biome-ignore lint/correctness/useExhaustiveDependencies: user provided deps instead of prop identity
    tapMemo(() => renderResourceFiber(fiber, element.props), [fiber, ...propsDeps, versionRef.current])
  ) : renderResourceFiber(fiber, element.props);
  tapEffect(() => () => unmountResourceFiber(fiber), [fiber]);
  tapEffect(() => {
    commitResourceFiber(fiber, result);
  }, [fiber, result]);
  return result.output;
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/hooks/tap-resources.js
function tapResources(getElements, getElementsDeps) {
  const versionRef = tapRef(0);
  const version2 = versionRef.current;
  const parentFiber = tapConst(getCurrentResourceFiber, []);
  const markDirty = tapConst(() => () => {
    var _a2;
    versionRef.current++;
    (_a2 = parentFiber.markDirty) == null ? void 0 : _a2.call(parentFiber);
  }, []);
  const fibers = tapConst(() => /* @__PURE__ */ new Map(), []);
  const getElementsMemo = getElementsDeps ? (
    // biome-ignore lint/correctness/useExhaustiveDependencies: library code
    tapCallback(getElements, getElementsDeps)
  ) : getElements;
  const res = tapMemo(() => {
    void version2;
    const elementsArray = getElementsMemo();
    const seenKeys = /* @__PURE__ */ new Set();
    const results = [];
    let newCount = 0;
    for (let i = 0; i < elementsArray.length; i++) {
      const element = elementsArray[i];
      const elementKey = element.key;
      if (elementKey === void 0) {
        throw new Error(`tapResources did not provide a key for array at index ${i}`);
      }
      if (seenKeys.has(elementKey))
        throw new Error(`Duplicate key ${elementKey} in tapResources`);
      seenKeys.add(elementKey);
      let state = fibers.get(elementKey);
      if (!state) {
        const fiber = createResourceFiber(element.type, parentFiber.root, markDirty);
        const result = renderResourceFiber(fiber, element.props);
        state = {
          fiber,
          next: result
        };
        newCount++;
        fibers.set(elementKey, state);
        results.push(result.output);
      } else if (state.fiber.type !== element.type) {
        const fiber = createResourceFiber(element.type, parentFiber.root, markDirty);
        const result = renderResourceFiber(fiber, element.props);
        state.next = [fiber, result];
        results.push(result.output);
      } else {
        state.next = renderResourceFiber(state.fiber, element.props);
        results.push(state.next.output);
      }
    }
    if (fibers.size > results.length - newCount) {
      for (const key of fibers.keys()) {
        if (!seenKeys.has(key)) {
          fibers.get(key).next = "delete";
        }
      }
    }
    return results;
  }, [getElementsMemo, version2]);
  tapEffect(() => {
    return () => {
      for (const key of fibers.keys()) {
        const fiber = fibers.get(key).fiber;
        unmountResourceFiber(fiber);
      }
    };
  }, []);
  tapEffect(() => {
    res;
    for (const [key, state] of fibers.entries()) {
      if (state.next === "delete") {
        if (state.fiber.isMounted) {
          unmountResourceFiber(state.fiber);
        }
        fibers.delete(key);
      } else if (Array.isArray(state.next)) {
        unmountResourceFiber(state.fiber);
        state.fiber = state.next[0];
        commitResourceFiber(state.fiber, state.next[1]);
      } else {
        commitResourceFiber(state.fiber, state.next);
      }
    }
  }, [res]);
  return res;
}

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/core/scheduler.js
var MAX_FLUSH_LIMIT = 50;
var flushState = {
  schedulers: /* @__PURE__ */ new Set([]),
  isScheduled: false
};
var UpdateScheduler = class {
  constructor(_task) {
    __publicField(this, "_task");
    __publicField(this, "_isDirty", false);
    this._task = _task;
  }
  get isDirty() {
    return this._isDirty;
  }
  markDirty() {
    this._isDirty = true;
    flushState.schedulers.add(this);
    scheduleFlush();
  }
  runTask() {
    this._isDirty = false;
    this._task();
  }
};
var scheduleFlush = () => {
  if (flushState.isScheduled)
    return;
  flushState.isScheduled = true;
  scheduleMacrotask();
};
var flushScheduled = () => {
  try {
    const errors = [];
    let flushDepth = 0;
    for (const scheduler of flushState.schedulers) {
      flushState.schedulers.delete(scheduler);
      if (!scheduler.isDirty)
        continue;
      flushDepth++;
      if (flushDepth > MAX_FLUSH_LIMIT) {
        throw new Error(`Maximum update depth exceeded. This can happen when a resource repeatedly calls setState inside tapEffect.`);
      }
      try {
        scheduler.runTask();
      } catch (error) {
        errors.push(error);
      }
    }
    if (errors.length > 0) {
      if (errors.length === 1) {
        throw errors[0];
      } else {
        for (const error of errors) {
          console.error(error);
        }
        throw new AggregateError(errors, "Errors occurred during flushSync");
      }
    }
  } finally {
    flushState.schedulers.clear();
    flushState.isScheduled = false;
  }
};
var scheduleMacrotask = (() => {
  if (typeof MessageChannel !== "undefined") {
    const channel = new MessageChannel();
    channel.port1.onmessage = flushScheduled;
    return () => channel.port2.postMessage(null);
  }
  return () => setTimeout(flushScheduled, 0);
})();
var flushResourcesSync = (callback) => {
  const prev = flushState;
  flushState = {
    schedulers: /* @__PURE__ */ new Set([]),
    isScheduled: true
  };
  try {
    const result = callback();
    flushScheduled();
    return result;
  } finally {
    flushState = prev;
  }
};

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/tapResourceRoot.js
var tapResourceRoot = (element) => {
  const scheduler = tapConst(() => new UpdateScheduler(() => handleUpdate(null)), []);
  const queue = tapConst(() => [], []);
  const fiber = tapMemo(() => {
    void element.key;
    return createResourceFiber(element.type, createResourceFiberRoot((callback) => {
      if (!scheduler.isDirty && !callback())
        return;
      queue.push(callback);
      scheduler.markDirty();
    }));
  }, [element.type, element.key]);
  setRootVersion(fiber.root, fiber.root.committedVersion);
  const render = renderResourceFiber(fiber, element.props);
  const isMountedRef = tapRef(false);
  const committedPropsRef = tapRef(element.props);
  const valueRef = tapRef(render.output);
  const subscribers = tapConst(() => /* @__PURE__ */ new Set(), []);
  const handleUpdate = tapEffectEvent((render2) => {
    if (render2 === null) {
      setRootVersion(fiber.root, 2);
      setRootVersion(fiber.root, 1);
      queue.forEach((callback) => {
        if (isDevelopment && fiber.devStrictMode) {
          callback();
        }
        callback();
      });
      if (isDevelopment && fiber.devStrictMode) {
        void renderResourceFiber(fiber, committedPropsRef.current);
      }
      render2 = renderResourceFiber(fiber, committedPropsRef.current);
    }
    if (scheduler.isDirty)
      throw new Error("Scheduler is dirty, this should never happen");
    commitRoot(fiber.root);
    queue.length = 0;
    if (isMountedRef.current) {
      commitResourceFiber(fiber, render2);
    }
    if (scheduler.isDirty || valueRef.current === render2.output)
      return;
    valueRef.current = render2.output;
    subscribers.forEach((callback) => callback());
  });
  tapEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      unmountResourceFiber(fiber);
    };
  }, [fiber]);
  tapEffect(() => {
    committedPropsRef.current = render.props;
    commitRoot(fiber.root);
    commitResourceFiber(fiber, render);
    if (scheduler.isDirty || valueRef.current === render.output)
      return;
    valueRef.current = render.output;
    subscribers.forEach((callback) => callback());
  });
  return tapMemo(() => ({
    getValue: () => valueRef.current,
    subscribe: (listener) => {
      subscribers.add(listener);
      return () => subscribers.delete(listener);
    }
  }), []);
};

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/core/createResourceRoot.js
var SubscribableResource = resource(tapResourceRoot);

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/core/context.js
var contextValue = Symbol("tap.Context");
var createResourceContext = (defaultValue) => {
  return {
    [contextValue]: defaultValue
  };
};
var withContextProvider = (context2, value, fn) => {
  const previousValue = context2[contextValue];
  context2[contextValue] = value;
  try {
    return fn();
  } finally {
    context2[contextValue] = previousValue;
  }
};
var tap = (context2) => {
  return context2[contextValue];
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/utils/tap-client-stack-context.js
var SYMBOL_CLIENT_INDEX = Symbol("assistant-ui.store.clientIndex");
var getClientIndex = (client) => {
  return client[SYMBOL_CLIENT_INDEX];
};
var ClientStackContext = createResourceContext([]);
var tapClientStack = () => {
  return tap(ClientStackContext);
};
var tapWithClientStack = (client, callback) => {
  const currentStack = tapClientStack();
  const newStack = tapMemo(() => [...currentStack, client], [currentStack, client]);
  return withContextProvider(ClientStackContext, newStack, callback);
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/utils/BaseProxyHandler.js
var INTROSPECTION_PROPS = /* @__PURE__ */ new Set(["$$typeof", "nodeType", "then"]);
var handleIntrospectionProp = (prop, name) => {
  if (prop === Symbol.toStringTag)
    return name;
  if (typeof prop === "symbol")
    return void 0;
  if (prop === "toJSON")
    return () => name;
  if (INTROSPECTION_PROPS.has(prop))
    return void 0;
  return false;
};
var BaseProxyHandler = class {
  getOwnPropertyDescriptor(_, prop) {
    const value = this.get(_, prop);
    if (value === void 0)
      return void 0;
    return {
      value,
      writable: false,
      enumerable: true,
      configurable: false
    };
  }
  set() {
    return false;
  }
  setPrototypeOf() {
    return false;
  }
  defineProperty() {
    return false;
  }
  deleteProperty() {
    return false;
  }
  preventExtensions() {
    return false;
  }
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/wrapperResource.js
var wrapperResource = (fn) => {
  const res = resource(fn);
  return (props) => {
    const el = res(props);
    if (props.key === void 0)
      return el;
    return withKey(props.key, el);
  };
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/tapClientResource.js
var SYMBOL_GET_OUTPUT = Symbol("assistant-ui.store.getValue");
var getClientState = (client) => {
  var _a2;
  const output = client[SYMBOL_GET_OUTPUT];
  if (!output) {
    throw new Error("Client scope contains a non-client resource. Ensure your Derived get() returns a client created with tapClientResource(), not a plain resource.");
  }
  return (_a2 = output.getState) == null ? void 0 : _a2.call(output);
};
var fieldAccessFns = /* @__PURE__ */ new Map();
function getOrCreateProxyFn(prop) {
  let template = fieldAccessFns.get(prop);
  if (!template) {
    template = function(...args) {
      if (!this || typeof this !== "object") {
        throw new Error(`Method "${String(prop)}" called without proper context. This may indicate the function was called incorrectly.`);
      }
      const output = this[SYMBOL_GET_OUTPUT];
      if (!output) {
        throw new Error(`Method "${String(prop)}" called on invalid client proxy. Ensure you are calling this method on a valid client instance.`);
      }
      const method = output[prop];
      if (!method)
        throw new Error(`Method "${String(prop)}" is not implemented.`);
      if (typeof method !== "function")
        throw new Error(`"${String(prop)}" is not a function.`);
      return method(...args);
    };
    fieldAccessFns.set(prop, template);
  }
  return template;
}
var ClientProxyHandler = class extends BaseProxyHandler {
  constructor(outputRef, index) {
    super();
    __publicField(this, "outputRef");
    __publicField(this, "index");
    __publicField(this, "boundFns");
    __publicField(this, "cachedReceiver");
    this.outputRef = outputRef;
    this.index = index;
  }
  get(_, prop, receiver) {
    if (prop === SYMBOL_GET_OUTPUT)
      return this.outputRef.current;
    if (prop === SYMBOL_CLIENT_INDEX)
      return this.index;
    const introspection = handleIntrospectionProp(prop, "ClientProxy");
    if (introspection !== false)
      return introspection;
    const value = this.outputRef.current[prop];
    if (typeof value === "function") {
      if (this.cachedReceiver !== receiver) {
        this.boundFns = /* @__PURE__ */ new Map();
        this.cachedReceiver = receiver;
      }
      let bound = this.boundFns.get(prop);
      if (!bound) {
        bound = getOrCreateProxyFn(prop).bind(receiver);
        this.boundFns.set(prop, bound);
      }
      return bound;
    }
    return value;
  }
  ownKeys() {
    return Object.keys(this.outputRef.current);
  }
  has(_, prop) {
    if (prop === SYMBOL_GET_OUTPUT)
      return true;
    if (prop === SYMBOL_CLIENT_INDEX)
      return true;
    return prop in this.outputRef.current;
  }
};
var ClientResource = wrapperResource((element) => {
  var _a2;
  const valueRef = tapRef(null);
  const index = tapClientStack().length;
  const methods = tapMemo(() => new Proxy({}, new ClientProxyHandler(valueRef, index)), [index]);
  const value = tapWithClientStack(methods, () => tapResource(element));
  if (!valueRef.current) {
    valueRef.current = value;
  }
  tapEffect(() => {
    valueRef.current = value;
  });
  const state = (_a2 = value.getState) == null ? void 0 : _a2.call(value);
  return { methods, state, key: element.key };
});
var tapClientResource = (element) => {
  return tapResource(ClientResource(element));
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/utils/proxied-assistant-state.js
var PROXIED_ASSISTANT_STATE_SYMBOL = Symbol("assistant-ui.store.proxiedAssistantState");
var isIgnoredKey = (key) => {
  return key === "on" || key === "subscribe" || typeof key === "symbol";
};
var createProxiedAssistantState = (client) => {
  class ProxiedAssistantStateProxyHandler extends BaseProxyHandler {
    get(_, prop) {
      const introspection = handleIntrospectionProp(prop, "AssistantState");
      if (introspection !== false)
        return introspection;
      const scope = prop;
      if (isIgnoredKey(scope))
        return void 0;
      return getClientState(client[scope]());
    }
    ownKeys() {
      return Object.keys(client).filter((key) => !isIgnoredKey(key));
    }
    has(_, prop) {
      return !isIgnoredKey(prop) && prop in client;
    }
  }
  return new Proxy({}, new ProxiedAssistantStateProxyHandler());
};
var getProxiedAssistantState = (client) => {
  return client[PROXIED_ASSISTANT_STATE_SYMBOL];
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/utils/react-assistant-context.js
var NO_OP_SUBSCRIBE = () => () => {
};
var createErrorClientField = (message) => {
  const fn = (() => {
    throw new Error(message);
  });
  fn.source = null;
  fn.query = null;
  return fn;
};
var DefaultAssistantClientProxyHandler = class extends BaseProxyHandler {
  get(_, prop) {
    if (prop === "subscribe")
      return NO_OP_SUBSCRIBE;
    if (prop === "on")
      return NO_OP_SUBSCRIBE;
    if (prop === PROXIED_ASSISTANT_STATE_SYMBOL)
      return DefaultAssistantClientProxiedAssistantState;
    const introspection = handleIntrospectionProp(prop, "DefaultAssistantClient");
    if (introspection !== false)
      return introspection;
    return createErrorClientField("You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.");
  }
  ownKeys() {
    return ["subscribe", "on", PROXIED_ASSISTANT_STATE_SYMBOL];
  }
  has(_, prop) {
    return prop === "subscribe" || prop === "on" || prop === PROXIED_ASSISTANT_STATE_SYMBOL;
  }
};
var DefaultAssistantClient = new Proxy({}, new DefaultAssistantClientProxyHandler());
var DefaultAssistantClientProxiedAssistantState = createProxiedAssistantState(DefaultAssistantClient);
var createRootAssistantClient = () => new Proxy({}, {
  get(_, prop) {
    const introspection = handleIntrospectionProp(prop, "AssistantClient");
    if (introspection !== false)
      return introspection;
    return createErrorClientField(`The current scope does not have a "${String(prop)}" property.`);
  }
});
var AssistantContext = (0, import_react.createContext)(DefaultAssistantClient);
var useAssistantContextValue = () => {
  return (0, import_react.useContext)(AssistantContext);
};
var AuiProvider = ({ value, children }) => {
  return (0, import_jsx_runtime.jsx)(AssistantContext.Provider, { value, children });
};

// ../../node_modules/.pnpm/@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/tap/dist/react/use-resource.js
var import_react2 = __toESM(require_react(), 1);
var useDevStrictMode = () => {
  if (!isDevelopment)
    return null;
  const count = (0, import_react2.useRef)(0);
  const isFirstRender = count.current === 0;
  (0, import_react2.useState)(() => count.current++);
  if (count.current !== 2)
    return null;
  return isFirstRender ? "child" : "root";
};
function useResource(element) {
  const root = (0, import_react2.useMemo)(() => {
    return createResourceFiberRoot((cb) => dispatch(cb));
  }, []);
  const [version2, dispatch] = (0, import_react2.useReducer)((v, cb) => {
    setRootVersion(root, v);
    return v + (cb() ? 1 : 0);
  }, 0);
  setRootVersion(root, version2);
  const devStrictMode = useDevStrictMode();
  const fiber = (0, import_react2.useMemo)(() => {
    void element.key;
    return createResourceFiber(element.type, root, void 0, devStrictMode);
  }, [element.type, element.key, root, devStrictMode]);
  const result = renderResourceFiber(fiber, element.props);
  (0, import_react2.useLayoutEffect)(() => {
    return () => unmountResourceFiber(fiber);
  }, [fiber]);
  (0, import_react2.useLayoutEffect)(() => {
    commitRoot(root);
    commitResourceFiber(fiber, result);
  });
  return result.output;
}

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/Derived.js
var Derived = resource((_config) => {
  return null;
});

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/attachTransformScopes.js
var TRANSFORM_SCOPES = Symbol("assistant-ui.transform-scopes");
function attachTransformScopes(resource2, transform) {
  const r = resource2;
  if (r[TRANSFORM_SCOPES]) {
    throw new Error("transformScopes is already attached to this resource");
  }
  r[TRANSFORM_SCOPES] = transform;
}
function getTransformScopes(resource2) {
  return resource2[TRANSFORM_SCOPES];
}

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/utils/splitClients.js
function splitClients(clients, baseClient) {
  const scopes = { ...clients };
  const visited = /* @__PURE__ */ new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const clientElement of Object.values(scopes)) {
      if (clientElement.type === Derived)
        continue;
      if (visited.has(clientElement.type))
        continue;
      visited.add(clientElement.type);
      const transform = getTransformScopes(clientElement.type);
      if (transform) {
        transform(scopes, baseClient);
        changed = true;
        break;
      }
    }
  }
  const rootClients = {};
  const derivedClients = {};
  for (const [key, clientElement] of Object.entries(scopes)) {
    if (clientElement.type === Derived) {
      derivedClients[key] = clientElement;
    } else {
      rootClients[key] = clientElement;
    }
  }
  return { rootClients, derivedClients };
}
var tapShallowMemoObject = (object) => {
  return tapMemo(() => object, [...Object.entries(object).flat()]);
};
var tapSplitClients = (clients, baseClient) => {
  const { rootClients, derivedClients } = splitClients(clients, baseClient);
  return {
    rootClients: tapShallowMemoObject(rootClients),
    derivedClients: tapShallowMemoObject(derivedClients)
  };
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/types/events.js
var normalizeEventSelector = (selector) => {
  if (typeof selector === "string") {
    const source = selector.split(".")[0];
    return { scope: source, event: selector };
  }
  return { scope: selector.scope, event: selector.event };
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/utils/NotificationManager.js
var NotificationManager = resource(() => {
  return tapConst(() => {
    const listeners = /* @__PURE__ */ new Map();
    const wildcardListeners = /* @__PURE__ */ new Set();
    const subscribers = /* @__PURE__ */ new Set();
    return {
      on(event, callback) {
        const cb = callback;
        if (event === "*") {
          wildcardListeners.add(cb);
          return () => wildcardListeners.delete(cb);
        }
        let set = listeners.get(event);
        if (!set) {
          set = /* @__PURE__ */ new Set();
          listeners.set(event, set);
        }
        set.add(cb);
        return () => {
          set.delete(cb);
          if (set.size === 0)
            listeners.delete(event);
        };
      },
      emit(event, payload, clientStack) {
        const eventListeners = listeners.get(event);
        if (!eventListeners && wildcardListeners.size === 0)
          return;
        queueMicrotask(() => {
          const errors = [];
          if (eventListeners) {
            for (const cb of eventListeners) {
              try {
                cb(payload, clientStack);
              } catch (e) {
                errors.push(e);
              }
            }
          }
          if (wildcardListeners.size > 0) {
            const wrapped = { event, payload };
            for (const cb of wildcardListeners) {
              try {
                cb(wrapped, clientStack);
              } catch (e) {
                errors.push(e);
              }
            }
          }
          if (errors.length > 0) {
            if (errors.length === 1) {
              throw errors[0];
            } else {
              for (const error of errors) {
                console.error(error);
              }
              throw new AggregateError(errors, "Errors occurred during event emission");
            }
          }
        });
      },
      subscribe(callback) {
        subscribers.add(callback);
        return () => subscribers.delete(callback);
      },
      notifySubscribers() {
        for (const cb of subscribers) {
          try {
            cb();
          } catch (e) {
            console.error("NotificationManager: subscriber callback error", e);
          }
        }
      }
    };
  }, []);
});

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/utils/tap-assistant-context.js
var AssistantTapContext = createResourceContext(null);
var withAssistantTapContextProvider = (value, fn) => {
  return withContextProvider(AssistantTapContext, value, fn);
};
var tapAssistantTapContext = () => {
  const ctx = tap(AssistantTapContext);
  if (!ctx)
    throw new Error("AssistantTapContext is not available");
  return ctx;
};
var tapAssistantClientRef = () => {
  return tapAssistantTapContext().clientRef;
};
var tapAssistantEmit = () => {
  const { emit } = tapAssistantTapContext();
  const clientStack = tapClientStack();
  return tapEffectEvent((event, payload) => {
    emit(event, payload, clientStack);
  });
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/useAui.js
var tapShallowMemoArray = (array) => {
  return tapMemo(() => array, array);
};
var RootClientResource = resource(({ element, emit, clientRef }) => {
  const { methods, state } = withAssistantTapContextProvider({ clientRef, emit }, () => tapClientResource(element));
  return tapMemo(() => ({ state, methods }), [methods, state]);
});
var RootClientAccessorResource = resource(({ element, notifications, clientRef, name }) => {
  const store = tapResourceRoot(RootClientResource({ element, emit: notifications.emit, clientRef }));
  tapEffect(() => {
    return store.subscribe(notifications.notifySubscribers);
  }, [store, notifications]);
  return tapMemo(() => {
    const clientFunction = () => store.getValue().methods;
    Object.defineProperties(clientFunction, {
      source: {
        value: "root",
        writable: false
      },
      query: {
        value: {},
        writable: false
      },
      name: {
        value: name,
        configurable: true
      }
    });
    return clientFunction;
  }, [store, name]);
});
var NoOpRootClientsAccessorsResource = resource(() => {
  return tapMemo(() => ({
    clients: [],
    subscribe: void 0,
    on: void 0
  }), []);
});
var RootClientsAccessorsResource = resource(({ clients: inputClients, clientRef }) => {
  const notifications = tapResource(NotificationManager());
  tapEffect(() => clientRef.parent.subscribe(notifications.notifySubscribers), [clientRef, notifications]);
  const results = tapShallowMemoArray(tapResources(() => Object.keys(inputClients).map((key) => withKey(key, RootClientAccessorResource({
    element: inputClients[key],
    notifications,
    clientRef,
    name: key
  }))), [inputClients, notifications, clientRef]));
  return tapMemo(() => {
    return {
      clients: results,
      subscribe: notifications.subscribe,
      on: function(selector, callback) {
        if (!this) {
          throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
        }
        const { scope, event } = normalizeEventSelector(selector);
        if (scope !== "*") {
          const source = this[scope].source;
          if (source === null) {
            throw new Error(`Scope "${scope}" is not available. Use { scope: "*", event: "${event}" } to listen globally.`);
          }
        }
        const localUnsub = notifications.on(event, (payload, clientStack) => {
          if (scope === "*") {
            callback(payload);
            return;
          }
          const scopeClient = this[scope]();
          const index = getClientIndex(scopeClient);
          if (scopeClient === clientStack[index]) {
            callback(payload);
          }
        });
        if (scope !== "*" && clientRef.parent[scope].source === null)
          return localUnsub;
        const parentUnsub = clientRef.parent.on(selector, callback);
        return () => {
          localUnsub();
          parentUnsub();
        };
      }
    };
  }, [results, notifications, clientRef]);
});
var getMeta = (props, clientRef, memo13) => {
  if ("source" in props && "query" in props)
    return props;
  if (memo13.dep === props)
    return memo13.meta;
  const meta = props.getMeta(clientRef.current);
  memo13.meta = meta;
  memo13.dep = props;
  return meta;
};
var DerivedClientAccessorResource = resource(({ element, clientRef, name }) => {
  const get = tapEffectEvent(() => element.props);
  return tapMemo(() => {
    const clientFunction = () => get().get(clientRef.current);
    const metaMemo = {};
    Object.defineProperties(clientFunction, {
      source: {
        get: () => getMeta(get(), clientRef, metaMemo).source
      },
      query: {
        get: () => getMeta(get(), clientRef, metaMemo).query
      },
      name: {
        value: name,
        configurable: true
      }
    });
    return clientFunction;
  }, [clientRef, name]);
});
var DerivedClientsAccessorsResource = resource(({ clients, clientRef }) => {
  return tapShallowMemoArray(tapResources(() => Object.keys(clients).map((key) => withKey(key, DerivedClientAccessorResource({
    element: clients[key],
    clientRef,
    name: key
  }))), [clients, clientRef]));
});
var AssistantClientResource = resource(({ parent, clients }) => {
  const { rootClients, derivedClients } = tapSplitClients(clients, parent);
  const clientRef = tapRef({
    parent,
    current: null
  }).current;
  tapEffect(() => {
    clientRef.current = client;
  });
  const rootFields = tapResource(Object.keys(rootClients).length > 0 ? RootClientsAccessorsResource({ clients: rootClients, clientRef }) : NoOpRootClientsAccessorsResource());
  const derivedFields = tapResource(DerivedClientsAccessorsResource({ clients: derivedClients, clientRef }));
  const client = tapMemo(() => {
    const proto = parent === DefaultAssistantClient ? createRootAssistantClient() : parent;
    const client2 = Object.create(proto);
    Object.assign(client2, {
      subscribe: rootFields.subscribe ?? parent.subscribe,
      on: rootFields.on ?? parent.on,
      [PROXIED_ASSISTANT_STATE_SYMBOL]: createProxiedAssistantState(client2)
    });
    for (const field of rootFields.clients) {
      client2[field.name] = field;
    }
    for (const field of derivedFields) {
      client2[field.name] = field;
    }
    return client2;
  }, [parent, rootFields, derivedFields]);
  if (clientRef.current === null) {
    clientRef.current = client;
  }
  return client;
});
function useAui(clients, { parent } = {
  parent: useAssistantContextValue()
}) {
  if (clients) {
    return useResource(AssistantClientResource({
      parent: parent ?? DefaultAssistantClient,
      clients
    }));
  }
  if (parent === null)
    throw new Error("received null parent, this usage is not allowed");
  return parent;
}

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/useAuiState.js
var import_react4 = __toESM(require_react(), 1);
var useAuiState = (selector) => {
  const aui = useAui();
  const proxiedState = getProxiedAssistantState(aui);
  const slice = (0, import_react4.useSyncExternalStore)(aui.subscribe, () => selector(proxiedState), () => selector(proxiedState));
  if (slice === proxiedState) {
    throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
  }
  (0, import_react4.useDebugValue)(slice);
  return slice;
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/useAuiEvent.js
var import_react6 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/use-effect-event@2.0.3_react@19.2.4/node_modules/use-effect-event/dist/index.js
var import_react5 = __toESM(require_react());
var context = import_react5.default.createContext(true);
function forbiddenInRender() {
  throw new Error("A function wrapped in useEffectEvent can't be called during rendering.");
}
var isInvalidExecutionContextForEventFunction = "use" in import_react5.default ? () => {
  try {
    return import_react5.default.use(context);
  } catch {
    return false;
  }
} : () => false;
function useEffectEvent(fn) {
  const ref = import_react5.default.useRef(forbiddenInRender);
  return import_react5.default.useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]), (...args) => {
    isInvalidExecutionContextForEventFunction() && forbiddenInRender();
    const latestFn = ref.current;
    return latestFn(...args);
  };
}

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/useAuiEvent.js
var useAuiEvent = (selector, callback) => {
  const aui = useAui();
  const callbackRef = useEffectEvent(callback);
  const { scope, event } = normalizeEventSelector(selector);
  (0, import_react6.useEffect)(() => aui.on({ scope, event }, callbackRef), [aui, scope, event, callbackRef]);
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/AuiIf.js
var AuiIf = ({ children, condition }) => {
  const result = useAuiState(condition);
  return result ? children : null;
};
AuiIf.displayName = "AuiIf";

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/RenderChildrenWithAccessor.js
var import_react7 = __toESM(require_react(), 1);
var useGetItemAccessor = (getItemState) => {
  const aui = useAui();
  const cacheRef = (0, import_react7.useRef)(void 0);
  useAuiState(() => {
    if (cacheRef.current === void 0) {
      cacheRef.current = getItemState(aui);
    }
    return cacheRef.current;
  });
  return () => {
    cacheRef.current = void 0;
    return getItemState(aui);
  };
};
var EMPTY_OBJECT = Object.freeze({});
function RenderChildrenWithAccessor({ getItemState, children }) {
  const getItem = useGetItemAccessor(getItemState);
  return useMemoizedProplessComponent(children(getItem));
}
var useMemoizedProplessComponent = (node) => {
  const el = typeof node === "object" && node != null && "type" in node ? node : null;
  const resultType = el == null ? void 0 : el.type;
  const resultKey = el == null ? void 0 : el.key;
  const resultProps = typeof (el == null ? void 0 : el.props) === "object" && el.props != null && Object.entries(el.props).length === 0 ? EMPTY_OBJECT : el == null ? void 0 : el.props;
  return (
    // biome-ignore lint/correctness/useExhaustiveDependencies: optimization
    (0, import_react7.useMemo)(() => el, [resultType, resultKey, resultProps]) ?? node
  );
};

// ../../node_modules/.pnpm/@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+react@19.2.14_react@19.2.4__@types+react@19.2.14_react@19.2.4/node_modules/@assistant-ui/store/dist/tapClientLookup.js
var ClientResourceWithKey = wrapperResource((el) => {
  if (el.key === void 0) {
    throw new Error("tapClientResource: Element has no key");
  }
  return tapResource(ClientResource(el));
});
function tapClientLookup(getElements, getElementsDeps) {
  const resources = tapResources(
    () => getElements().map((el) => ClientResourceWithKey(el)),
    // biome-ignore lint/correctness/useExhaustiveDependencies: getElementsDeps is passed through from caller
    getElementsDeps
  );
  const keys = tapMemo(() => Object.keys(resources), [resources]);
  const keyToIndex = tapMemo(() => {
    return resources.reduce((acc, resource2, index) => {
      acc[resource2.key] = index;
      return acc;
    }, {});
  }, [resources]);
  const state = tapMemo(() => {
    return resources.map((r) => r.state);
  }, [resources]);
  return {
    state,
    get: (lookup) => {
      if ("index" in lookup) {
        if (lookup.index < 0 || lookup.index >= keys.length) {
          throw new Error(`tapClientLookup: Index ${lookup.index} out of bounds (length: ${keys.length})`);
        }
        return resources[lookup.index].methods;
      }
      const index = keyToIndex[lookup.key];
      if (index === void 0) {
        throw new Error(`tapClientLookup: Key "${lookup.key}" not found`);
      }
      return resources[index].methods;
    }
  };
}

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/useAssistantTool.js
var import_react8 = __toESM(require_react(), 1);
var useAssistantTool = (tool) => {
  const aui = useAui();
  (0, import_react8.useEffect)(() => {
    if (!tool.render)
      return void 0;
    return aui.tools().setToolUI(tool.toolName, tool.render);
  }, [aui, tool.toolName, tool.render]);
  (0, import_react8.useEffect)(() => {
    const { toolName, render, ...rest } = tool;
    const context2 = {
      tools: {
        [toolName]: rest
      }
    };
    return aui.modelContext().register({
      getModelContext: () => context2
    });
  }, [aui, tool]);
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/makeAssistantTool.js
var makeAssistantTool = (tool) => {
  const Tool = () => {
    useAssistantTool(tool);
    return null;
  };
  Tool.unstable_tool = tool;
  return Tool;
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/useAssistantToolUI.js
var import_react9 = __toESM(require_react(), 1);
var useAssistantToolUI = (tool) => {
  const aui = useAui();
  (0, import_react9.useEffect)(() => {
    if (!(tool == null ? void 0 : tool.toolName) || !(tool == null ? void 0 : tool.render))
      return void 0;
    return aui.tools().setToolUI(tool.toolName, tool.render);
  }, [aui, tool == null ? void 0 : tool.toolName, tool == null ? void 0 : tool.render]);
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/makeAssistantToolUI.js
var makeAssistantToolUI = (tool) => {
  const ToolUI = () => {
    useAssistantToolUI(tool);
    return null;
  };
  ToolUI.unstable_tool = tool;
  return ToolUI;
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/useAssistantDataUI.js
var import_react10 = __toESM(require_react(), 1);
var useAssistantDataUI = (dataUI) => {
  const aui = useAui();
  (0, import_react10.useEffect)(() => {
    if (!(dataUI == null ? void 0 : dataUI.name) || !(dataUI == null ? void 0 : dataUI.render))
      return void 0;
    return aui.dataRenderers().setDataUI(dataUI.name, dataUI.render);
  }, [aui, dataUI == null ? void 0 : dataUI.name, dataUI == null ? void 0 : dataUI.render]);
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/makeAssistantDataUI.js
var makeAssistantDataUI = (dataUI) => {
  const DataUI = () => {
    useAssistantDataUI(dataUI);
    return null;
  };
  DataUI.unstable_data = dataUI;
  return DataUI;
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/useAssistantInstructions.js
var import_react11 = __toESM(require_react(), 1);
var getInstructions = (instruction) => {
  if (typeof instruction === "string")
    return { instruction };
  return instruction;
};
var useAssistantInstructions = (config) => {
  const { instruction, disabled = false } = getInstructions(config);
  const aui = useAui();
  (0, import_react11.useEffect)(() => {
    if (disabled)
      return;
    const config2 = {
      system: instruction
    };
    return aui.modelContext().register({
      getModelContext: () => config2
    });
  }, [aui, instruction, disabled]);
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/useAssistantContext.js
var import_react12 = __toESM(require_react(), 1);
var useAssistantContext = (config) => {
  const { getContext, disabled = false } = config;
  const aui = useAui();
  const getContextRef = (0, import_react12.useRef)(getContext);
  getContextRef.current = getContext;
  (0, import_react12.useEffect)(() => {
    if (disabled)
      return;
    return aui.modelContext().register({
      getModelContext: () => ({
        system: getContextRef.current()
      })
    });
  }, [aui, disabled]);
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/useInlineRender.js
var import_react14 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/zustand@5.0.12_@types+react@19.2.14_immer@11.1.4_react@19.2.4_use-sync-external-store@1.6.0_react@19.2.4_/node_modules/zustand/esm/vanilla.mjs
var createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
var createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);

// ../../node_modules/.pnpm/zustand@5.0.12_@types+react@19.2.14_immer@11.1.4_react@19.2.4_use-sync-external-store@1.6.0_react@19.2.4_/node_modules/zustand/esm/react.mjs
var import_react13 = __toESM(require_react(), 1);
var identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = import_react13.default.useSyncExternalStore(
    api.subscribe,
    import_react13.default.useCallback(() => selector(api.getState()), [api, selector]),
    import_react13.default.useCallback(() => selector(api.getInitialState()), [api, selector])
  );
  import_react13.default.useDebugValue(slice);
  return slice;
}
var createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
var create = ((createState) => createState ? createImpl(createState) : createImpl);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/useInlineRender.js
var useInlineRender = (toolUI) => {
  const [useToolUIStore] = (0, import_react14.useState)(() => create(() => ({
    toolUI
  })));
  (0, import_react14.useEffect)(() => {
    useToolUIStore.setState({ toolUI });
  }, [toolUI, useToolUIStore]);
  return (0, import_react14.useCallback)(function ToolUI(args) {
    const store = useToolUIStore();
    return store.toolUI(args);
  }, [useToolUIStore]);
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/useAssistantInteractable.js
var import_react15 = __toESM(require_react(), 1);
var useAssistantInteractable = (name, config) => {
  const aui = useAui();
  const autoId = (0, import_react15.useId)().replace(/[^a-zA-Z0-9]/g, "");
  const id = config.id ?? autoId;
  const stateSchemaRef = (0, import_react15.useRef)(config.stateSchema);
  stateSchemaRef.current = config.stateSchema;
  const initialStateRef = (0, import_react15.useRef)(config.initialState);
  initialStateRef.current = config.initialState;
  (0, import_react15.useEffect)(() => {
    return aui.interactables().register({
      id,
      name,
      description: config.description,
      stateSchema: stateSchemaRef.current,
      initialState: initialStateRef.current,
      selected: config.selected
    });
  }, [aui, id, name, config.description, config.selected]);
  return id;
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/useInteractableState.js
var import_react16 = __toESM(require_react(), 1);
var useInteractableState = (id, fallback) => {
  const aui = useAui();
  const state = useAuiState((s) => {
    var _a2;
    return (_a2 = s.interactables.definitions[id]) == null ? void 0 : _a2.state;
  }) ?? fallback;
  const persistenceStatus = useAuiState((s) => s.interactables.persistence[id]);
  const setState = (0, import_react16.useCallback)((updater) => {
    aui.interactables().setState(id, (prev) => {
      if (typeof updater === "function") {
        return updater(prev);
      }
      return updater;
    });
  }, [aui, id]);
  const setSelected = (0, import_react16.useCallback)((selected) => {
    aui.interactables().setSelected(id, selected);
  }, [aui, id]);
  const flush = (0, import_react16.useCallback)(() => aui.interactables().flush(), [aui]);
  return [
    state,
    {
      setState,
      setSelected,
      isPending: (persistenceStatus == null ? void 0 : persistenceStatus.isPending) ?? false,
      error: persistenceStatus == null ? void 0 : persistenceStatus.error,
      flush
    }
  ];
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/useToolArgsStatus.js
var import_react17 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/utils/json/parse-partial-json-object.js
var import_secure_json_parse = __toESM(require_secure_json_parse(), 1);

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/utils/json/fix-json.js
function fixJson(input) {
  const stack = ["ROOT"];
  let lastValidIndex = -1;
  let literalStart = null;
  const path = [];
  let currentKey;
  function pushCurrentKeyToPath() {
    if (currentKey !== void 0) {
      path.push(JSON.parse(`"${currentKey}"`));
      currentKey = void 0;
    }
  }
  function processValueStart(char, i, swapState) {
    switch (char) {
      case '"': {
        lastValidIndex = i;
        stack.pop();
        stack.push(swapState);
        stack.push("INSIDE_STRING");
        pushCurrentKeyToPath();
        break;
      }
      case "f":
      case "t":
      case "n": {
        lastValidIndex = i;
        literalStart = i;
        stack.pop();
        stack.push(swapState);
        stack.push("INSIDE_LITERAL");
        break;
      }
      case "-": {
        stack.pop();
        stack.push(swapState);
        stack.push("INSIDE_NUMBER");
        pushCurrentKeyToPath();
        break;
      }
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9": {
        lastValidIndex = i;
        stack.pop();
        stack.push(swapState);
        stack.push("INSIDE_NUMBER");
        pushCurrentKeyToPath();
        break;
      }
      case "{": {
        lastValidIndex = i;
        stack.pop();
        stack.push(swapState);
        stack.push("INSIDE_OBJECT_START");
        pushCurrentKeyToPath();
        break;
      }
      case "[": {
        lastValidIndex = i;
        stack.pop();
        stack.push(swapState);
        stack.push("INSIDE_ARRAY_START");
        pushCurrentKeyToPath();
        break;
      }
    }
  }
  function processAfterObjectValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      }
      case "}": {
        lastValidIndex = i;
        stack.pop();
        currentKey = path.pop();
        break;
      }
    }
  }
  function processAfterArrayValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_ARRAY_AFTER_COMMA");
        currentKey = (Number(currentKey) + 1).toString();
        break;
      }
      case "]": {
        lastValidIndex = i;
        stack.pop();
        currentKey = path.pop();
        break;
      }
    }
  }
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const currentState = stack[stack.length - 1];
    switch (currentState) {
      case "ROOT":
        processValueStart(char, i, "FINISH");
        break;
      case "INSIDE_OBJECT_START": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            currentKey = "";
            break;
          }
          case "}": {
            lastValidIndex = i;
            stack.pop();
            currentKey = path.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_COMMA": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            currentKey = "";
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_KEY": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          }
          case "\\": {
            stack.push("INSIDE_STRING_ESCAPE");
            currentKey += char;
            break;
          }
          default: {
            currentKey += char;
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_KEY": {
        switch (char) {
          case ":": {
            stack.pop();
            stack.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_BEFORE_VALUE": {
        processValueStart(char, i, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      }
      case "INSIDE_OBJECT_AFTER_VALUE": {
        processAfterObjectValue(char, i);
        break;
      }
      case "INSIDE_STRING": {
        switch (char) {
          case '"': {
            stack.pop();
            lastValidIndex = i;
            currentKey = path.pop();
            break;
          }
          case "\\": {
            stack.push("INSIDE_STRING_ESCAPE");
            break;
          }
          default: {
            lastValidIndex = i;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_START": {
        switch (char) {
          case "]": {
            lastValidIndex = i;
            stack.pop();
            currentKey = path.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            currentKey = "0";
            processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_VALUE": {
        switch (char) {
          case ",": {
            stack.pop();
            stack.push("INSIDE_ARRAY_AFTER_COMMA");
            currentKey = (Number(currentKey) + 1).toString();
            break;
          }
          case "]": {
            lastValidIndex = i;
            stack.pop();
            currentKey = path.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_COMMA": {
        processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      }
      case "INSIDE_STRING_ESCAPE": {
        stack.pop();
        if (stack[stack.length - 1] === "INSIDE_STRING") {
          lastValidIndex = i;
        } else if (stack[stack.length - 1] === "INSIDE_OBJECT_KEY") {
          currentKey += char;
        }
        break;
      }
      case "INSIDE_NUMBER": {
        switch (char) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            lastValidIndex = i;
            break;
          }
          case "e":
          case "E":
          case "-":
          case ".": {
            break;
          }
          case ",": {
            stack.pop();
            currentKey = path.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "}": {
            stack.pop();
            currentKey = path.pop();
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "]": {
            stack.pop();
            currentKey = path.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            break;
          }
          default: {
            stack.pop();
            currentKey = path.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, i + 1);
        if (!"false".startsWith(partialLiteral) && !"true".startsWith(partialLiteral) && !"null".startsWith(partialLiteral)) {
          stack.pop();
          if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
            processAfterObjectValue(char, i);
          } else if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
            processAfterArrayValue(char, i);
          }
        } else {
          lastValidIndex = i;
        }
        break;
      }
    }
  }
  let result = input.slice(0, lastValidIndex + 1);
  for (let i = stack.length - 1; i >= 0; i--) {
    const state = stack[i];
    switch (state) {
      case "INSIDE_STRING": {
        result += '"';
        break;
      }
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE": {
        result += "}";
        break;
      }
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE": {
        result += "]";
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, input.length);
        if ("true".startsWith(partialLiteral)) {
          result += "true".slice(partialLiteral.length);
        } else if ("false".startsWith(partialLiteral)) {
          result += "false".slice(partialLiteral.length);
        } else if ("null".startsWith(partialLiteral)) {
          result += "null".slice(partialLiteral.length);
        }
      }
    }
  }
  return [result, path];
}

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/utils/json/parse-partial-json-object.js
var PARTIAL_JSON_OBJECT_META_SYMBOL = Symbol("aui.parse-partial-json-object.meta");
var getPartialJsonObjectMeta = (obj) => {
  return obj == null ? void 0 : obj[PARTIAL_JSON_OBJECT_META_SYMBOL];
};
var parsePartialJsonObject = (json) => {
  if (json.length === 0)
    return {
      [PARTIAL_JSON_OBJECT_META_SYMBOL]: { state: "partial", partialPath: [] }
    };
  try {
    const res = import_secure_json_parse.default.parse(json);
    if (typeof res !== "object" || res === null)
      throw new Error("argsText is expected to be an object");
    res[PARTIAL_JSON_OBJECT_META_SYMBOL] = {
      state: "complete",
      partialPath: []
    };
    return res;
  } catch {
    try {
      const [fixedJson, partialPath] = fixJson(json);
      const res = import_secure_json_parse.default.parse(fixedJson);
      if (typeof res !== "object" || res === null)
        throw new Error("argsText is expected to be an object");
      res[PARTIAL_JSON_OBJECT_META_SYMBOL] = {
        state: "partial",
        partialPath
      };
      return res;
    } catch {
      return void 0;
    }
  }
};
var getFieldState = (parent, parentMeta, fieldPath) => {
  if (typeof parent !== "object" || parent === null)
    return parentMeta.state;
  if (parentMeta.state === "complete")
    return "complete";
  if (fieldPath.length === 0)
    return parentMeta.state;
  const [field, ...restPath] = fieldPath;
  if (!Object.prototype.hasOwnProperty.call(parent, field))
    return "partial";
  const [partialField, ...restPartialPath] = parentMeta.partialPath;
  if (field !== partialField)
    return "complete";
  const child = parent[field];
  const childMeta = {
    state: "partial",
    partialPath: restPartialPath
  };
  return getFieldState(child, childMeta, restPath);
};
var getPartialJsonObjectFieldState = (obj, fieldPath) => {
  const meta = getPartialJsonObjectMeta(obj);
  if (!meta)
    throw new Error("unable to determine object state");
  return getFieldState(obj, meta, fieldPath.map(String));
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/utils/AsyncIterableStream.js
async function* streamGeneratorPolyfill() {
  const reader = this.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done)
        break;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
function asAsyncIterableStream(source) {
  var _a2;
  source[_a2 = Symbol.asyncIterator] ?? (source[_a2] = streamGeneratorPolyfill);
  return source;
}

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/AssistantStream.js
var AssistantStream = {
  toResponse(stream, transformer) {
    return new Response(AssistantStream.toByteStream(stream, transformer), {
      headers: transformer.headers ?? {}
    });
  },
  fromResponse(response, transformer) {
    return AssistantStream.fromByteStream(response.body, transformer);
  },
  toByteStream(stream, transformer) {
    return stream.pipeThrough(transformer);
  },
  fromByteStream(readable, transformer) {
    return readable.pipeThrough(transformer);
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/utils/promiseWithResolvers.js
var promiseWithResolvers = function() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  if (!resolve || !reject)
    throw new Error("Failed to create promise");
  return { promise, resolve, reject };
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/utils/stream/merge.js
var createMergeStream = () => {
  const list = [];
  let sealed = false;
  let controller;
  let currentPull;
  const handlePull = (item) => {
    if (!item.promise) {
      item.promise = item.reader.read().then(({ done, value }) => {
        item.promise = void 0;
        if (done) {
          list.splice(list.indexOf(item), 1);
          if (sealed && list.length === 0) {
            controller.close();
          }
        } else {
          controller.enqueue(value);
        }
        currentPull == null ? void 0 : currentPull.resolve();
        currentPull = void 0;
      }).catch((e) => {
        console.error(e);
        list.forEach((item2) => {
          item2.reader.cancel();
        });
        list.length = 0;
        controller.error(e);
        currentPull == null ? void 0 : currentPull.reject(e);
        currentPull = void 0;
      });
    }
  };
  const readable = new ReadableStream({
    start(c) {
      controller = c;
    },
    pull() {
      currentPull = promiseWithResolvers();
      list.forEach((item) => {
        handlePull(item);
      });
      return currentPull.promise;
    },
    cancel() {
      list.forEach((item) => {
        item.reader.cancel();
      });
      list.length = 0;
    }
  });
  return {
    readable,
    isSealed() {
      return sealed;
    },
    seal() {
      sealed = true;
      if (list.length === 0)
        controller.close();
    },
    addStream(stream) {
      if (sealed)
        throw new Error("Cannot add streams after the run callback has settled.");
      const item = { reader: stream.getReader() };
      list.push(item);
      handlePull(item);
    },
    enqueue(chunk) {
      this.addStream(new ReadableStream({
        start(c) {
          c.enqueue(chunk);
          c.close();
        }
      }));
    }
  };
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/modules/text.js
var TextStreamControllerImpl = class {
  constructor(controller) {
    __publicField(this, "_controller");
    __publicField(this, "_isClosed", false);
    this._controller = controller;
  }
  append(textDelta) {
    this._controller.enqueue({
      type: "text-delta",
      path: [],
      textDelta
    });
    return this;
  }
  close() {
    if (this._isClosed)
      return;
    this._isClosed = true;
    this._controller.enqueue({
      type: "part-finish",
      path: []
    });
    this._controller.close();
  }
};
var createTextStream = (readable) => {
  return new ReadableStream({
    start(c) {
      var _a2;
      return (_a2 = readable.start) == null ? void 0 : _a2.call(readable, new TextStreamControllerImpl(c));
    },
    pull(c) {
      var _a2;
      return (_a2 = readable.pull) == null ? void 0 : _a2.call(readable, new TextStreamControllerImpl(c));
    },
    cancel(c) {
      var _a2;
      return (_a2 = readable.cancel) == null ? void 0 : _a2.call(readable, c);
    }
  });
};
var createTextStreamController = () => {
  let controller;
  const stream = createTextStream({
    start(c) {
      controller = c;
    }
  });
  return [stream, controller];
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/modules/tool-call.js
var ToolCallStreamControllerImpl = class {
  constructor(_controller) {
    __publicField(this, "_controller");
    __publicField(this, "_isClosed", false);
    __publicField(this, "_mergeTask");
    __publicField(this, "_argsTextController");
    this._controller = _controller;
    const stream = createTextStream({
      start: (c) => {
        this._argsTextController = c;
      }
    });
    let hasArgsText = false;
    this._mergeTask = stream.pipeTo(new WritableStream({
      write: (chunk) => {
        switch (chunk.type) {
          case "text-delta":
            hasArgsText = true;
            this._controller.enqueue(chunk);
            break;
          case "part-finish":
            if (!hasArgsText) {
              this._controller.enqueue({
                type: "text-delta",
                textDelta: "{}",
                path: []
              });
            }
            this._controller.enqueue({
              type: "tool-call-args-text-finish",
              path: []
            });
            break;
          default:
            throw new Error(`Unexpected chunk type: ${chunk.type}`);
        }
      }
    }));
  }
  get argsText() {
    return this._argsTextController;
  }
  async setResponse(response) {
    this._argsTextController.close();
    await Promise.resolve();
    this._controller.enqueue({
      type: "result",
      path: [],
      ...response.artifact !== void 0 ? { artifact: response.artifact } : {},
      result: response.result,
      isError: response.isError ?? false,
      ...response.messages !== void 0 ? { messages: response.messages } : {}
    });
  }
  async close() {
    if (this._isClosed)
      return;
    this._isClosed = true;
    this._argsTextController.close();
    await this._mergeTask;
    this._controller.enqueue({
      type: "part-finish",
      path: []
    });
    this._controller.close();
  }
};
var createToolCallStream = (readable) => {
  return new ReadableStream({
    start(c) {
      var _a2;
      return (_a2 = readable.start) == null ? void 0 : _a2.call(readable, new ToolCallStreamControllerImpl(c));
    },
    pull(c) {
      var _a2;
      return (_a2 = readable.pull) == null ? void 0 : _a2.call(readable, new ToolCallStreamControllerImpl(c));
    },
    cancel(c) {
      var _a2;
      return (_a2 = readable.cancel) == null ? void 0 : _a2.call(readable, c);
    }
  });
};
var createToolCallStreamController = () => {
  let controller;
  const stream = createToolCallStream({
    start(c) {
      controller = c;
    }
  });
  return [stream, controller];
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/utils/Counter.js
var Counter = class {
  constructor() {
    __publicField(this, "value", -1);
  }
  up() {
    return ++this.value;
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/utils/stream/path-utils.js
var PathAppendEncoder = class extends TransformStream {
  constructor(idx) {
    super({
      transform(chunk, controller) {
        controller.enqueue({
          ...chunk,
          path: [idx, ...chunk.path]
        });
      }
    });
  }
};
var PathAppendDecoder = class extends TransformStream {
  constructor(idx) {
    super({
      transform(chunk, controller) {
        const { path: [idx2, ...path] } = chunk;
        if (idx !== idx2)
          throw new Error(`Path mismatch: expected ${idx}, got ${idx2}`);
        controller.enqueue({
          ...chunk,
          path
        });
      }
    });
  }
};
var PathMergeEncoder = class extends TransformStream {
  constructor(counter) {
    const innerCounter = new Counter();
    const mapping = /* @__PURE__ */ new Map();
    super({
      transform(chunk, controller) {
        if (chunk.type === "part-start" && chunk.path.length === 0) {
          mapping.set(innerCounter.up(), counter.up());
        }
        const [idx, ...path] = chunk.path;
        if (idx === void 0) {
          controller.enqueue(chunk);
          return;
        }
        const mappedIdx = mapping.get(idx);
        if (mappedIdx === void 0)
          throw new Error("Path not found");
        controller.enqueue({
          ...chunk,
          path: [mappedIdx, ...path]
        });
      }
    });
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/utils/stream/PipeableTransformStream.js
var PipeableTransformStream = class extends TransformStream {
  constructor(transform) {
    super();
    const readable = transform(super.readable);
    Object.defineProperty(this, "readable", {
      value: readable,
      writable: false
    });
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/serialization/data-stream/chunk-types.js
var DataStreamStreamChunkType;
(function(DataStreamStreamChunkType2) {
  DataStreamStreamChunkType2["TextDelta"] = "0";
  DataStreamStreamChunkType2["Data"] = "2";
  DataStreamStreamChunkType2["Error"] = "3";
  DataStreamStreamChunkType2["Annotation"] = "8";
  DataStreamStreamChunkType2["ToolCall"] = "9";
  DataStreamStreamChunkType2["ToolCallResult"] = "a";
  DataStreamStreamChunkType2["StartToolCall"] = "b";
  DataStreamStreamChunkType2["ToolCallArgsTextDelta"] = "c";
  DataStreamStreamChunkType2["FinishMessage"] = "d";
  DataStreamStreamChunkType2["FinishStep"] = "e";
  DataStreamStreamChunkType2["StartStep"] = "f";
  DataStreamStreamChunkType2["ReasoningDelta"] = "g";
  DataStreamStreamChunkType2["Source"] = "h";
  DataStreamStreamChunkType2["RedactedReasoning"] = "i";
  DataStreamStreamChunkType2["ReasoningSignature"] = "j";
  DataStreamStreamChunkType2["File"] = "k";
  DataStreamStreamChunkType2["AuiUpdateStateOperations"] = "aui-state";
  DataStreamStreamChunkType2["AuiTextDelta"] = "aui-text-delta";
  DataStreamStreamChunkType2["AuiReasoningDelta"] = "aui-reasoning-delta";
  DataStreamStreamChunkType2["AuiDataPart"] = "aui-data";
})(DataStreamStreamChunkType || (DataStreamStreamChunkType = {}));

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/utils/stream/LineDecoderStream.js
var LineDecoderStream = class extends TransformStream {
  constructor() {
    super({
      transform: (chunk, controller) => {
        this.buffer += chunk;
        const lines = this.buffer.split("\n");
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i];
          controller.enqueue(line.endsWith("\r") ? line.slice(0, -1) : line);
        }
        this.buffer = lines[lines.length - 1] || "";
      },
      flush: () => {
        if (this.buffer) {
          throw new Error(`Stream ended with an incomplete line: "${this.buffer}"`);
        }
      }
    });
    __publicField(this, "buffer", "");
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/serialization/data-stream/serialization.js
var DataStreamChunkEncoder = class extends TransformStream {
  constructor() {
    super({
      transform: (chunk, controller) => {
        controller.enqueue(`${chunk.type}:${JSON.stringify(chunk.value)}
`);
      }
    });
  }
};
var DataStreamChunkDecoder = class extends TransformStream {
  constructor() {
    super({
      transform: (chunk, controller) => {
        const index = chunk.indexOf(":");
        if (index === -1)
          throw new Error("Invalid stream part");
        controller.enqueue({
          type: chunk.slice(0, index),
          value: JSON.parse(chunk.slice(index + 1))
        });
      }
    });
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/utils/stream/AssistantMetaTransformStream.js
var AssistantMetaTransformStream = class extends TransformStream {
  constructor() {
    const parts = [];
    super({
      transform(chunk, controller) {
        if (chunk.type === "part-start") {
          if (chunk.path.length !== 0) {
            controller.error(new Error("Nested parts are not supported"));
            return;
          }
          parts.push(chunk.part);
          controller.enqueue(chunk);
          return;
        }
        if (chunk.type === "text-delta" || chunk.type === "result" || chunk.type === "part-finish" || chunk.type === "tool-call-args-text-finish") {
          if (chunk.path.length !== 1) {
            controller.error(new Error(`${chunk.type} chunks must have a path of length 1`));
            return;
          }
          const idx = chunk.path[0];
          if (idx < 0 || idx >= parts.length) {
            controller.error(new Error(`Invalid path index: ${idx}`));
            return;
          }
          const part = parts[idx];
          controller.enqueue({
            ...chunk,
            meta: part
            // TODO
          });
          return;
        }
        controller.enqueue(chunk);
      }
    });
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/serialization/data-stream/DataStream.js
var TOOL_CALL_ARGS_CLOSING_CHUNKS = [
  DataStreamStreamChunkType.StartToolCall,
  DataStreamStreamChunkType.ToolCall,
  DataStreamStreamChunkType.TextDelta,
  DataStreamStreamChunkType.ReasoningDelta,
  DataStreamStreamChunkType.Source,
  DataStreamStreamChunkType.Error,
  DataStreamStreamChunkType.FinishStep,
  DataStreamStreamChunkType.FinishMessage,
  DataStreamStreamChunkType.AuiTextDelta,
  DataStreamStreamChunkType.AuiReasoningDelta,
  DataStreamStreamChunkType.AuiDataPart
];
var DataStreamDecoder = class extends PipeableTransformStream {
  constructor() {
    super((readable) => {
      const toolCallControllers = /* @__PURE__ */ new Map();
      let activeToolCallArgsText;
      const transform = new AssistantTransformStream({
        transform(chunk, controller) {
          const { type, value } = chunk;
          if (TOOL_CALL_ARGS_CLOSING_CHUNKS.includes(type)) {
            activeToolCallArgsText == null ? void 0 : activeToolCallArgsText.close();
            activeToolCallArgsText = void 0;
          }
          switch (type) {
            case DataStreamStreamChunkType.ReasoningDelta:
              controller.appendReasoning(value);
              break;
            case DataStreamStreamChunkType.TextDelta:
              controller.appendText(value);
              break;
            case DataStreamStreamChunkType.AuiTextDelta:
              controller.withParentId(value.parentId).appendText(value.textDelta);
              break;
            case DataStreamStreamChunkType.AuiReasoningDelta:
              controller.withParentId(value.parentId).appendReasoning(value.reasoningDelta);
              break;
            case DataStreamStreamChunkType.StartToolCall: {
              const { toolCallId, toolName, parentId } = value;
              const ctrl = parentId ? controller.withParentId(parentId) : controller;
              if (toolCallControllers.has(toolCallId))
                throw new Error(`Encountered duplicate tool call id: ${toolCallId}`);
              const toolCallController = ctrl.addToolCallPart({
                toolCallId,
                toolName
              });
              toolCallControllers.set(toolCallId, toolCallController);
              activeToolCallArgsText = toolCallController.argsText;
              break;
            }
            case DataStreamStreamChunkType.ToolCallArgsTextDelta: {
              const { toolCallId, argsTextDelta } = value;
              const toolCallController = toolCallControllers.get(toolCallId);
              if (!toolCallController)
                throw new Error(`Encountered tool call with unknown id: ${toolCallId}`);
              toolCallController.argsText.append(argsTextDelta);
              break;
            }
            case DataStreamStreamChunkType.ToolCallResult: {
              const { toolCallId, artifact, result, isError } = value;
              const toolCallController = toolCallControllers.get(toolCallId);
              if (!toolCallController)
                throw new Error(`Encountered tool call result with unknown id: ${toolCallId}`);
              toolCallController.setResponse({
                artifact,
                result,
                isError
              });
              break;
            }
            case DataStreamStreamChunkType.ToolCall: {
              const { toolCallId, toolName, args } = value;
              let toolCallController = toolCallControllers.get(toolCallId);
              if (toolCallController) {
                toolCallController.argsText.close();
              } else {
                toolCallController = controller.addToolCallPart({
                  toolCallId,
                  toolName,
                  args
                });
                toolCallControllers.set(toolCallId, toolCallController);
              }
              break;
            }
            case DataStreamStreamChunkType.FinishMessage:
              controller.enqueue({
                type: "message-finish",
                path: [],
                ...value
              });
              break;
            case DataStreamStreamChunkType.StartStep:
              controller.enqueue({
                type: "step-start",
                path: [],
                ...value
              });
              break;
            case DataStreamStreamChunkType.FinishStep:
              controller.enqueue({
                type: "step-finish",
                path: [],
                ...value
              });
              break;
            case DataStreamStreamChunkType.Data:
              controller.enqueue({
                type: "data",
                path: [],
                data: value
              });
              break;
            case DataStreamStreamChunkType.Annotation:
              controller.enqueue({
                type: "annotations",
                path: [],
                annotations: value
              });
              break;
            case DataStreamStreamChunkType.Source: {
              const { parentId, ...sourceData } = value;
              const ctrl = parentId ? controller.withParentId(parentId) : controller;
              ctrl.appendSource({
                type: "source",
                ...sourceData
              });
              break;
            }
            case DataStreamStreamChunkType.Error:
              controller.enqueue({
                type: "error",
                path: [],
                error: value
              });
              break;
            case DataStreamStreamChunkType.File:
              controller.appendFile({
                type: "file",
                ...value
              });
              break;
            case DataStreamStreamChunkType.AuiDataPart:
              controller.appendData({
                type: "data",
                ...value
              });
              break;
            case DataStreamStreamChunkType.AuiUpdateStateOperations:
              controller.enqueue({
                type: "update-state",
                path: [],
                operations: value
              });
              break;
            case DataStreamStreamChunkType.ReasoningSignature:
            case DataStreamStreamChunkType.RedactedReasoning:
              break;
            default: {
              const exhaustiveCheck = type;
              throw new Error(`unsupported chunk type: ${exhaustiveCheck}`);
            }
          }
        },
        flush() {
          activeToolCallArgsText == null ? void 0 : activeToolCallArgsText.close();
          activeToolCallArgsText = void 0;
          toolCallControllers.forEach((controller) => controller.close());
          toolCallControllers.clear();
        }
      });
      return readable.pipeThrough(new TextDecoderStream()).pipeThrough(new LineDecoderStream()).pipeThrough(new DataStreamChunkDecoder()).pipeThrough(transform);
    });
  }
};

// ../../node_modules/.pnpm/nanoid@5.1.7/node_modules/nanoid/non-secure/index.js
var customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = "";
    let i = size | 0;
    while (i--) {
      id += alphabet[Math.random() * alphabet.length | 0];
    }
    return id;
  };
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/utils/generateId.js
var generateId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/modules/assistant-stream.js
var AssistantStreamControllerImpl = class _AssistantStreamControllerImpl {
  constructor(state) {
    __publicField(this, "_state");
    __publicField(this, "_parentId");
    this._state = state || {
      merger: createMergeStream(),
      contentCounter: new Counter()
    };
  }
  get __internal_isClosed() {
    return this._state.merger.isSealed();
  }
  __internal_getReadable() {
    return this._state.merger.readable;
  }
  __internal_subscribeToClose(callback) {
    this._state.closeSubscriber = callback;
  }
  _addPart(part, stream) {
    if (this._state.append) {
      this._state.append.controller.close();
      this._state.append = void 0;
    }
    this.enqueue({
      type: "part-start",
      part,
      path: []
    });
    this._state.merger.addStream(stream.pipeThrough(new PathAppendEncoder(this._state.contentCounter.value)));
  }
  merge(stream) {
    this._state.merger.addStream(stream.pipeThrough(new PathMergeEncoder(this._state.contentCounter)));
  }
  appendText(textDelta) {
    var _a2;
    if (((_a2 = this._state.append) == null ? void 0 : _a2.kind) !== "text") {
      this._state.append = {
        kind: "text",
        controller: this.addTextPart()
      };
    }
    this._state.append.controller.append(textDelta);
  }
  appendReasoning(textDelta) {
    var _a2;
    if (((_a2 = this._state.append) == null ? void 0 : _a2.kind) !== "reasoning") {
      this._state.append = {
        kind: "reasoning",
        controller: this.addReasoningPart()
      };
    }
    this._state.append.controller.append(textDelta);
  }
  addTextPart() {
    const [stream, controller] = createTextStreamController();
    this._addPart({ type: "text" }, stream);
    return controller;
  }
  addReasoningPart() {
    const [stream, controller] = createTextStreamController();
    this._addPart({ type: "reasoning" }, stream);
    return controller;
  }
  addToolCallPart(options) {
    const opt = typeof options === "string" ? { toolName: options } : options;
    const toolName = opt.toolName;
    const toolCallId = opt.toolCallId ?? generateId();
    const [stream, controller] = createToolCallStreamController();
    this._addPart({
      type: "tool-call",
      toolName,
      toolCallId,
      ...this._parentId && { parentId: this._parentId }
    }, stream);
    if (opt.argsText !== void 0) {
      controller.argsText.append(opt.argsText);
      controller.argsText.close();
    }
    if (opt.args !== void 0) {
      controller.argsText.append(JSON.stringify(opt.args));
      controller.argsText.close();
    }
    if (opt.response !== void 0) {
      controller.setResponse(opt.response);
    }
    return controller;
  }
  _finishedPartStream() {
    return new ReadableStream({
      start(controller) {
        controller.enqueue({ type: "part-finish", path: [] });
        controller.close();
      }
    });
  }
  _withParentIdOption(options) {
    if (!this._parentId)
      return options;
    return { ...options, parentId: this._parentId };
  }
  appendSource(options) {
    this._addPart(this._withParentIdOption(options), this._finishedPartStream());
  }
  appendFile(options) {
    this._addPart(this._withParentIdOption(options), this._finishedPartStream());
  }
  appendData(options) {
    this._addPart(this._withParentIdOption(options), this._finishedPartStream());
  }
  enqueue(chunk) {
    this._state.merger.enqueue(chunk);
    if (chunk.type === "part-start" && chunk.path.length === 0) {
      this._state.contentCounter.up();
    }
  }
  withParentId(parentId) {
    const controller = new _AssistantStreamControllerImpl(this._state);
    controller._parentId = parentId;
    return controller;
  }
  close() {
    var _a2, _b, _c, _d;
    (_b = (_a2 = this._state.append) == null ? void 0 : _a2.controller) == null ? void 0 : _b.close();
    this._state.merger.seal();
    (_d = (_c = this._state).closeSubscriber) == null ? void 0 : _d.call(_c);
  }
};
function createAssistantStream(callback) {
  const controller = new AssistantStreamControllerImpl();
  const runTask = async () => {
    try {
      await callback(controller);
    } catch (e) {
      if (!controller.__internal_isClosed) {
        controller.enqueue({
          type: "error",
          path: [],
          error: String(e)
        });
      }
      throw e;
    } finally {
      if (!controller.__internal_isClosed) {
        controller.close();
      }
    }
  };
  runTask();
  return controller.__internal_getReadable();
}
function createAssistantStreamController() {
  const { resolve, promise } = promiseWithResolvers();
  let controller;
  const stream = createAssistantStream((c) => {
    controller = c;
    controller.__internal_subscribeToClose(resolve);
    return promise;
  });
  return [stream, controller];
}

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/utils/stream/AssistantTransformStream.js
var AssistantTransformStream = class extends TransformStream {
  constructor(transformer, writableStrategy, readableStrategy) {
    const [stream, runController] = createAssistantStreamController();
    let runPipeTask;
    super({
      start(controller) {
        var _a2;
        runPipeTask = stream.pipeTo(new WritableStream({
          write(chunk) {
            controller.enqueue(chunk);
          },
          abort(reason) {
            controller.error(reason);
          },
          close() {
            controller.terminate();
          }
        })).catch((error) => {
          controller.error(error);
        });
        return (_a2 = transformer.start) == null ? void 0 : _a2.call(transformer, runController);
      },
      transform(chunk) {
        var _a2;
        return (_a2 = transformer.transform) == null ? void 0 : _a2.call(transformer, chunk, runController);
      },
      async flush() {
        var _a2;
        await ((_a2 = transformer.flush) == null ? void 0 : _a2.call(transformer, runController));
        runController.close();
        await runPipeTask;
      }
    }, writableStrategy, readableStrategy);
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/model-context/useToolArgsStatus.js
var useToolArgsStatus = () => {
  const part = useAuiState((s) => s.part);
  return (0, import_react17.useMemo)(() => {
    const statusType = part.status.type;
    if (part.type !== "tool-call") {
      throw new Error("useToolArgsStatus can only be used inside tool-call message parts");
    }
    const isStreaming = statusType === "running";
    const args = part.args;
    const meta = getPartialJsonObjectMeta(args);
    const propStatus = {};
    for (const key of Object.keys(args)) {
      if (meta) {
        const fieldState = getPartialJsonObjectFieldState(args, [key]);
        propStatus[key] = fieldState === "complete" || !isStreaming ? "complete" : "streaming";
      } else {
        propStatus[key] = isStreaming ? "streaming" : "complete";
      }
    }
    return {
      status: statusType,
      propStatus
    };
  }, [part]);
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/clients/suggestions.js
var SuggestionClient = resource((state) => {
  return {
    getState: () => state
  };
});
var SuggestionsResource = resource((suggestions) => {
  const [state] = tapState(() => {
    const normalizedSuggestions = (suggestions ?? []).map((s) => {
      if (typeof s === "string") {
        return {
          title: s,
          label: "",
          prompt: s
        };
      }
      return {
        title: s.title,
        label: s.label,
        prompt: s.prompt
      };
    });
    return {
      suggestions: normalizedSuggestions
    };
  });
  const suggestionClients = tapClientLookup(() => state.suggestions.map((suggestion, index) => withKey(index, SuggestionClient(suggestion))), [state.suggestions]);
  return {
    getState: () => state,
    suggestion: ({ index }) => {
      return suggestionClients.get({ index });
    }
  };
});
var Suggestions = SuggestionsResource;

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/clients/chain-of-thought-client.js
var COMPLETE_STATUS = Object.freeze({
  type: "complete"
});
var ChainOfThoughtClient = resource(({ parts, getMessagePart }) => {
  const [collapsed, setCollapsed] = tapState(true);
  const status = tapMemo(() => {
    const lastPart = parts[parts.length - 1];
    return (lastPart == null ? void 0 : lastPart.status) ?? COMPLETE_STATUS;
  }, [parts]);
  const state = tapMemo(() => ({ parts, collapsed, status }), [parts, collapsed, status]);
  return {
    getState: () => state,
    setCollapsed,
    part: getMessagePart
  };
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/model-context/types.js
var mergeModelContexts = (configSet) => {
  const configs = Array.from(configSet).map((c) => c.getModelContext()).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return configs.reduce((acc, config) => {
    var _a2;
    if (config.system) {
      if (acc.system) {
        acc.system += `

${config.system}`;
      } else {
        acc.system = config.system;
      }
    }
    if (config.tools) {
      for (const [name, tool] of Object.entries(config.tools)) {
        const existing = (_a2 = acc.tools) == null ? void 0 : _a2[name];
        if (existing && existing !== tool) {
          throw new Error(`You tried to define a tool with the name ${name}, but it already exists.`);
        }
        if (!acc.tools)
          acc.tools = {};
        acc.tools[name] = tool;
      }
    }
    if (config.config) {
      acc.config = {
        ...acc.config,
        ...config.config
      };
    }
    if (config.callSettings) {
      acc.callSettings = {
        ...acc.callSettings,
        ...config.callSettings
      };
    }
    return acc;
  }, {});
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/utils/composite-context-provider.js
var CompositeContextProvider = class {
  constructor() {
    __publicField(this, "_providers", /* @__PURE__ */ new Set());
    __publicField(this, "_subscribers", /* @__PURE__ */ new Set());
  }
  getModelContext() {
    return mergeModelContexts(this._providers);
  }
  registerModelContextProvider(provider) {
    var _a2;
    this._providers.add(provider);
    const unsubscribe = (_a2 = provider.subscribe) == null ? void 0 : _a2.call(provider, () => {
      this.notifySubscribers();
    });
    this.notifySubscribers();
    return () => {
      this._providers.delete(provider);
      unsubscribe == null ? void 0 : unsubscribe();
      this.notifySubscribers();
    };
  }
  notifySubscribers() {
    for (const callback of this._subscribers)
      callback();
  }
  subscribe(callback) {
    this._subscribers.add(callback);
    return () => this._subscribers.delete(callback);
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/clients/model-context-client.js
var version = 1;
var ModelContext = resource(() => {
  const [state] = tapState(() => ({ version: version + 1 }));
  const composite = tapMemo(() => new CompositeContextProvider(), []);
  return {
    getState: () => state,
    getModelContext: () => composite.getModelContext(),
    subscribe: (callback) => composite.subscribe(callback),
    register: (provider) => composite.registerModelContextProvider(provider)
  };
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/clients/no-op-composer-client.js
var NoOpComposerClient = resource(({ type }) => {
  const state = tapMemo(() => {
    return {
      isEditing: false,
      isEmpty: true,
      text: "",
      attachmentAccept: "*",
      attachments: [],
      role: "user",
      runConfig: {},
      canCancel: false,
      type,
      dictation: void 0,
      quote: void 0,
      queue: []
    };
  }, [type]);
  return {
    getState: () => state,
    setText: () => {
      throw new Error("Not supported");
    },
    setRole: () => {
      throw new Error("Not supported");
    },
    setRunConfig: () => {
      throw new Error("Not supported");
    },
    addAttachment: () => {
      throw new Error("Not supported");
    },
    clearAttachments: () => {
      throw new Error("Not supported");
    },
    attachment: () => {
      throw new Error("Not supported");
    },
    reset: () => {
      throw new Error("Not supported");
    },
    send: () => {
      throw new Error("Not supported");
    },
    cancel: () => {
      throw new Error("Not supported");
    },
    startDictation: () => {
      throw new Error("Not supported");
    },
    stopDictation: () => {
      throw new Error("Not supported");
    },
    beginEdit: () => {
      throw new Error("Not supported");
    },
    setQuote: () => {
      throw new Error("Not supported");
    },
    queueItem: () => {
      throw new Error("Not supported");
    }
  };
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/clients/thread-message-client.js
var ThreadMessagePartClient = resource(({ part }) => {
  const state = tapMemo(() => {
    return {
      ...part,
      status: { type: "complete" }
    };
  }, [part]);
  return {
    getState: () => state,
    addToolResult: () => {
      throw new Error("Not supported");
    },
    resumeToolCall: () => {
      throw new Error("Not supported");
    }
  };
});
var ThreadMessageAttachmentClient = resource(({ attachment }) => {
  return {
    getState: () => attachment,
    remove: () => {
      throw new Error("Not supported");
    }
  };
});
var ThreadMessageClient = resource(({ message, index, isLast = true, branchNumber = 1, branchCount = 1 }) => {
  const [isCopiedState, setIsCopied] = tapState(false);
  const [isHoveringState, setIsHovering] = tapState(false);
  const parts = tapClientLookup(() => message.content.map((part, idx) => withKey("toolCallId" in part && part.toolCallId != null ? `toolCallId-${part.toolCallId}` : `index-${idx}`, ThreadMessagePartClient({ part }))), [message.content]);
  const attachments = tapClientLookup(() => (message.attachments ?? []).map((attachment) => withKey(attachment.id, ThreadMessageAttachmentClient({ attachment }))), [message.attachments]);
  const composer = tapResource(NoOpComposerClient({ type: "edit" }));
  const composerState = composer.getState();
  const state = tapMemo(() => {
    return {
      ...message,
      parts: parts.state,
      composer: composerState,
      parentId: null,
      index,
      isLast,
      branchNumber,
      branchCount,
      speech: void 0,
      submittedFeedback: message.metadata.submittedFeedback,
      isCopied: isCopiedState,
      isHovering: isHoveringState
    };
  }, [
    message,
    index,
    isCopiedState,
    isHoveringState,
    isLast,
    parts.state,
    composerState,
    branchNumber,
    branchCount
  ]);
  return {
    getState: () => state,
    composer: () => composer,
    part: (selector) => {
      if ("index" in selector) {
        return parts.get({ index: selector.index });
      } else {
        return parts.get({ key: `toolCallId-${selector.toolCallId}` });
      }
    },
    attachment: (selector) => {
      if ("id" in selector) {
        return attachments.get({ key: selector.id });
      } else {
        return attachments.get(selector);
      }
    },
    reload: () => {
      throw new Error("Not supported in ThreadMessageProvider");
    },
    speak: () => {
      throw new Error("Not supported in ThreadMessageProvider");
    },
    stopSpeaking: () => {
      throw new Error("Not supported in ThreadMessageProvider");
    },
    submitFeedback: () => {
      throw new Error("Not supported in ThreadMessageProvider");
    },
    switchToBranch: () => {
      throw new Error("Not supported in ThreadMessageProvider");
    },
    getCopyText: () => {
      return message.content.map((part) => {
        if ("text" in part && typeof part.text === "string") {
          return part.text;
        }
        return "";
      }).join("\n");
    },
    setIsCopied,
    setIsHovering
  };
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/client/Tools.js
var Tools = resource(({ toolkit }) => {
  const [state, setState] = tapState(() => ({
    tools: {}
  }));
  const clientRef = tapAssistantClientRef();
  const setToolUI = tapCallback((toolName, render) => {
    setState((prev) => {
      return {
        ...prev,
        tools: {
          ...prev.tools,
          [toolName]: [...prev.tools[toolName] ?? [], render]
        }
      };
    });
    return () => {
      setState((prev) => {
        var _a2;
        return {
          ...prev,
          tools: {
            ...prev.tools,
            [toolName]: ((_a2 = prev.tools[toolName]) == null ? void 0 : _a2.filter((r) => r !== render)) ?? []
          }
        };
      });
    };
  }, []);
  tapEffect(() => {
    if (!toolkit)
      return;
    const unsubscribes = [];
    for (const [toolName, tool] of Object.entries(toolkit)) {
      if (tool.render) {
        unsubscribes.push(setToolUI(toolName, tool.render));
      }
    }
    const toolsWithoutRender = Object.entries(toolkit).reduce((acc, [name, tool]) => {
      const { render, ...rest } = tool;
      acc[name] = rest;
      return acc;
    }, {});
    const modelContextProvider = {
      getModelContext: () => ({
        tools: toolsWithoutRender
      })
    };
    unsubscribes.push(clientRef.current.modelContext().register(modelContextProvider));
    return () => {
      unsubscribes.forEach((fn) => fn());
    };
  }, [toolkit, setToolUI, clientRef]);
  return {
    getState: () => state,
    setToolUI
  };
});
attachTransformScopes(Tools, (scopes, parent) => {
  if (!scopes.modelContext && parent.modelContext.source === null) {
    scopes.modelContext = ModelContext();
  }
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/client/DataRenderers.js
var DataRenderers = resource(() => {
  const [state, setState] = tapState(() => ({
    renderers: {}
  }));
  const setDataUI = tapCallback((name, render) => {
    setState((prev) => {
      return {
        ...prev,
        renderers: {
          ...prev.renderers,
          [name]: [...prev.renderers[name] ?? [], render]
        }
      };
    });
    return () => {
      setState((prev) => {
        var _a2;
        return {
          ...prev,
          renderers: {
            ...prev.renderers,
            [name]: ((_a2 = prev.renderers[name]) == null ? void 0 : _a2.filter((r) => r !== render)) ?? []
          }
        };
      });
    };
  }, []);
  return {
    getState: () => state,
    setDataUI
  };
});

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/object/ObjectStreamAccumulator.js
var ObjectStreamAccumulator = class _ObjectStreamAccumulator {
  constructor(initialValue = null) {
    __publicField(this, "_state");
    this._state = initialValue;
  }
  get state() {
    return this._state;
  }
  append(ops) {
    this._state = ops.reduce((state, op) => _ObjectStreamAccumulator.apply(state, op), this._state);
  }
  static apply(state, op) {
    const type = op.type;
    switch (type) {
      case "set":
        return _ObjectStreamAccumulator.updatePath(state, op.path, () => op.value);
      case "append-text":
        return _ObjectStreamAccumulator.updatePath(state, op.path, (current) => {
          if (typeof current !== "string")
            throw new Error(`Expected string at path [${op.path.join(", ")}]`);
          return current + op.value;
        });
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Invalid operation type: ${_exhaustiveCheck}`);
      }
    }
  }
  static updatePath(state, path, updater) {
    if (path.length === 0)
      return updater(state);
    state ?? (state = {});
    if (typeof state !== "object") {
      throw new Error(`Invalid path: [${path.join(", ")}]`);
    }
    const [key, ...rest] = path;
    if (Array.isArray(state)) {
      const idx = Number(key);
      if (Number.isNaN(idx))
        throw new Error(`Expected array index at [${path.join(", ")}]`);
      if (idx > state.length || idx < 0)
        throw new Error(`Insert array index out of bounds`);
      const nextState2 = [...state];
      nextState2[idx] = this.updatePath(nextState2[idx], rest, updater);
      return nextState2;
    }
    const nextState = { ...state };
    nextState[key] = this.updatePath(nextState[key], rest, updater);
    return nextState;
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/accumulators/TimingTracker.js
var TimingTracker = class {
  constructor() {
    __publicField(this, "_streamStartTime");
    __publicField(this, "_firstTokenTime");
    __publicField(this, "_totalChunks", 0);
    __publicField(this, "_toolCallIds", /* @__PURE__ */ new Set());
    this._streamStartTime = Date.now();
  }
  recordChunk() {
    this._totalChunks++;
  }
  recordFirstToken() {
    if (this._firstTokenTime === void 0) {
      this._firstTokenTime = Date.now();
    }
  }
  recordToolCallStart(toolCallId) {
    this._toolCallIds.add(toolCallId);
  }
  getTiming(outputTokens, totalText) {
    const now = Date.now();
    const totalStreamTime = now - this._streamStartTime;
    const tokenCount = outputTokens && outputTokens > 0 ? outputTokens : totalText ? Math.ceil(totalText.length / 4) : void 0;
    const tokensPerSecond = tokenCount && totalStreamTime > 0 ? tokenCount / totalStreamTime * 1e3 : void 0;
    return {
      streamStartTime: this._streamStartTime,
      ...this._firstTokenTime !== void 0 ? { firstTokenTime: this._firstTokenTime - this._streamStartTime } : void 0,
      totalStreamTime,
      ...tokenCount !== void 0 ? { tokenCount } : void 0,
      ...tokensPerSecond !== void 0 ? { tokensPerSecond } : void 0,
      totalChunks: this._totalChunks,
      toolCallCount: this._toolCallIds.size
    };
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/accumulators/assistant-message-accumulator.js
var createInitialMessage = ({ unstable_state = null } = {}) => ({
  role: "assistant",
  status: { type: "running" },
  parts: [],
  get content() {
    return this.parts;
  },
  metadata: {
    unstable_state,
    unstable_data: [],
    unstable_annotations: [],
    steps: [],
    custom: {}
  }
});
var updatePartForPath = (message, chunk, updater) => {
  if (message.parts.length === 0) {
    throw new Error("No parts available to update.");
  }
  if (chunk.path.length !== 1)
    throw new Error("Nested paths are not supported yet.");
  const partIndex = chunk.path[0];
  const updatedPart = updater(message.parts[partIndex]);
  return {
    ...message,
    parts: [
      ...message.parts.slice(0, partIndex),
      updatedPart,
      ...message.parts.slice(partIndex + 1)
    ],
    get content() {
      return this.parts;
    }
  };
};
var handlePartStart = (message, chunk) => {
  const partInit = chunk.part;
  if (partInit.type === "text" || partInit.type === "reasoning") {
    const newTextPart = {
      type: partInit.type,
      text: "",
      status: { type: "running" },
      ...partInit.parentId && { parentId: partInit.parentId }
    };
    return {
      ...message,
      parts: [...message.parts, newTextPart],
      get content() {
        return this.parts;
      }
    };
  } else if (partInit.type === "tool-call") {
    const newToolCallPart = {
      type: "tool-call",
      state: "partial-call",
      status: { type: "running", isArgsComplete: false },
      toolCallId: partInit.toolCallId,
      toolName: partInit.toolName,
      argsText: "",
      args: {},
      ...partInit.parentId && { parentId: partInit.parentId }
    };
    return {
      ...message,
      parts: [...message.parts, newToolCallPart],
      get content() {
        return this.parts;
      }
    };
  } else if (partInit.type === "source") {
    const newSourcePart = {
      type: "source",
      sourceType: partInit.sourceType,
      id: partInit.id,
      url: partInit.url,
      ...partInit.title ? { title: partInit.title } : void 0,
      ...partInit.parentId && { parentId: partInit.parentId }
    };
    return {
      ...message,
      parts: [...message.parts, newSourcePart],
      get content() {
        return this.parts;
      }
    };
  } else if (partInit.type === "file") {
    const newFilePart = {
      type: "file",
      mimeType: partInit.mimeType,
      data: partInit.data,
      ...partInit.parentId && { parentId: partInit.parentId }
    };
    return {
      ...message,
      parts: [...message.parts, newFilePart],
      get content() {
        return this.parts;
      }
    };
  } else if (partInit.type === "data") {
    const newDataPart = {
      type: "data",
      name: partInit.name,
      data: partInit.data,
      ...partInit.parentId && { parentId: partInit.parentId }
    };
    return {
      ...message,
      parts: [...message.parts, newDataPart],
      get content() {
        return this.parts;
      }
    };
  } else {
    throw new Error(`Unsupported part type: ${partInit.type}`);
  }
};
var handleToolCallArgsTextFinish = (message, chunk) => {
  return updatePartForPath(message, chunk, (part) => {
    if (part.type !== "tool-call") {
      throw new Error("Last is not a tool call");
    }
    if (part.state !== "partial-call")
      return part;
    return {
      ...part,
      state: "call"
    };
  });
};
var handlePartFinish = (message, chunk) => {
  return updatePartForPath(message, chunk, (part) => ({
    ...part,
    status: { type: "complete", reason: "unknown" }
  }));
};
var handleTextDelta = (message, chunk) => {
  return updatePartForPath(message, chunk, (part) => {
    if (part.type === "text" || part.type === "reasoning") {
      return { ...part, text: part.text + chunk.textDelta };
    } else if (part.type === "tool-call") {
      const newArgsText = part.argsText + chunk.textDelta;
      const newArgs = parsePartialJsonObject(newArgsText) ?? part.args;
      return { ...part, argsText: newArgsText, args: newArgs };
    } else {
      throw new Error("text-delta received but part is neither text nor tool-call");
    }
  });
};
var handleResult = (message, chunk) => {
  return updatePartForPath(message, chunk, (part) => {
    if (part.type === "tool-call") {
      return {
        ...part,
        state: "result",
        ...chunk.artifact !== void 0 ? { artifact: chunk.artifact } : {},
        result: chunk.result,
        isError: chunk.isError ?? false,
        ...chunk.messages !== void 0 ? { messages: chunk.messages } : {},
        status: { type: "complete", reason: "stop" }
      };
    } else {
      throw new Error("Result chunk received but part is not a tool-call");
    }
  });
};
var handleMessageFinish = (message, chunk) => {
  var _a2, _b;
  if (((_a2 = message.status) == null ? void 0 : _a2.type) === "incomplete" && ((_b = message.status) == null ? void 0 : _b.reason) === "error") {
    return message;
  }
  const newStatus = getStatus(chunk);
  return { ...message, status: newStatus };
};
var getStatus = (chunk) => {
  if (chunk.finishReason === "tool-calls") {
    return {
      type: "requires-action",
      reason: "tool-calls"
    };
  } else if (chunk.finishReason === "stop" || chunk.finishReason === "unknown") {
    return {
      type: "complete",
      reason: chunk.finishReason
    };
  } else {
    return {
      type: "incomplete",
      reason: chunk.finishReason
    };
  }
};
var handleAnnotations = (message, chunk) => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      unstable_annotations: [
        ...message.metadata.unstable_annotations,
        ...chunk.annotations
      ]
    }
  };
};
var handleData = (message, chunk) => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      unstable_data: [...message.metadata.unstable_data, ...chunk.data]
    }
  };
};
var handleStepStart = (message, chunk) => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      steps: [
        ...message.metadata.steps,
        { state: "started", messageId: chunk.messageId }
      ]
    }
  };
};
var handleStepFinish = (message, chunk) => {
  var _a2;
  const steps = message.metadata.steps.slice();
  const lastIndex = steps.length - 1;
  if (steps.length > 0 && ((_a2 = steps[lastIndex]) == null ? void 0 : _a2.state) === "started") {
    steps[lastIndex] = {
      ...steps[lastIndex],
      state: "finished",
      finishReason: chunk.finishReason,
      usage: chunk.usage,
      isContinued: chunk.isContinued
    };
  } else {
    steps.push({
      state: "finished",
      messageId: generateId(),
      finishReason: chunk.finishReason,
      usage: chunk.usage,
      isContinued: chunk.isContinued
    });
  }
  return {
    ...message,
    metadata: {
      ...message.metadata,
      steps
    }
  };
};
var handleErrorChunk = (message, chunk) => {
  return {
    ...message,
    status: { type: "incomplete", reason: "error", error: chunk.error }
  };
};
var handleUpdateState = (message, chunk) => {
  const acc = new ObjectStreamAccumulator(message.metadata.unstable_state);
  acc.append(chunk.operations);
  return {
    ...message,
    metadata: {
      ...message.metadata,
      unstable_state: acc.state
    }
  };
};
var computeTiming = (tracker, message) => {
  let outputTokens = 0;
  for (const step of message.metadata.steps) {
    if (step.state === "finished" && step.usage) {
      outputTokens += step.usage.outputTokens;
    }
  }
  let totalText = "";
  for (const part of message.parts) {
    if (part.type === "text" || part.type === "reasoning") {
      totalText += part.text;
    }
  }
  return tracker.getTiming(outputTokens > 0 ? outputTokens : void 0, totalText || void 0);
};
var throttleCallback = (callback) => {
  let hasScheduled = false;
  return () => {
    if (hasScheduled)
      return;
    hasScheduled = true;
    queueMicrotask(() => {
      hasScheduled = false;
      callback();
    });
  };
};
var AssistantMessageAccumulator = class extends TransformStream {
  constructor({ initialMessage, throttle, onError } = {}) {
    let message = initialMessage ?? createInitialMessage();
    const tracker = new TimingTracker();
    let controller;
    const emitChunk = throttle ? throttleCallback(() => {
      controller == null ? void 0 : controller.enqueue(message);
    }) : () => {
      controller == null ? void 0 : controller.enqueue(message);
    };
    super({
      start(c) {
        controller = c;
      },
      transform(chunk) {
        tracker.recordChunk();
        const type = chunk.type;
        switch (type) {
          case "part-start":
            message = handlePartStart(message, chunk);
            if (chunk.part.type === "tool-call") {
              tracker.recordToolCallStart(chunk.part.toolCallId);
            }
            break;
          case "tool-call-args-text-finish":
            message = handleToolCallArgsTextFinish(message, chunk);
            break;
          case "part-finish":
            message = handlePartFinish(message, chunk);
            break;
          case "text-delta":
            message = handleTextDelta(message, chunk);
            tracker.recordFirstToken();
            break;
          case "result":
            message = handleResult(message, chunk);
            break;
          case "message-finish":
            message = handleMessageFinish(message, chunk);
            break;
          case "annotations":
            message = handleAnnotations(message, chunk);
            break;
          case "data":
            message = handleData(message, chunk);
            break;
          case "step-start":
            message = handleStepStart(message, chunk);
            break;
          case "step-finish":
            message = handleStepFinish(message, chunk);
            break;
          case "error":
            message = handleErrorChunk(message, chunk);
            onError == null ? void 0 : onError(chunk.error);
            break;
          case "update-state":
            message = handleUpdateState(message, chunk);
            break;
          default: {
            const unhandledType = type;
            throw new Error(`Unsupported chunk type: ${unhandledType}`);
          }
        }
        if (message.status.type !== "running") {
          message = {
            ...message,
            metadata: {
              ...message.metadata,
              timing: computeTiming(tracker, message)
            }
          };
        }
        emitChunk();
      },
      flush(controller2) {
        var _a2, _b;
        if (((_a2 = message.status) == null ? void 0 : _a2.type) === "running") {
          const requiresAction = ((_b = message.parts) == null ? void 0 : _b.some((part) => part.type === "tool-call" && (part.state === "call" || part.state === "partial-call") && part.result === void 0)) ?? false;
          message = handleMessageFinish(message, {
            type: "message-finish",
            path: [],
            finishReason: requiresAction ? "tool-calls" : "unknown",
            usage: {
              inputTokens: 0,
              outputTokens: 0
            }
          });
          message = {
            ...message,
            metadata: {
              ...message.metadata,
              timing: computeTiming(tracker, message)
            }
          };
          controller2.enqueue(message);
        }
      }
    });
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/serialization/PlainText.js
var PlainTextDecoder = class extends PipeableTransformStream {
  constructor() {
    super((readable) => {
      const transform = new AssistantTransformStream({
        transform(chunk, controller) {
          controller.appendText(chunk);
        }
      });
      return readable.pipeThrough(new TextDecoderStream()).pipeThrough(transform);
    });
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/serialization/assistant-transport/AssistantTransport.js
var SSEEventStream = class extends TransformStream {
  constructor() {
    let eventBuffer = {};
    let dataLines = [];
    super({
      start() {
        eventBuffer = {};
        dataLines = [];
      },
      transform(line, controller) {
        if (line.startsWith(":"))
          return;
        if (line === "") {
          if (dataLines.length > 0) {
            controller.enqueue({
              event: eventBuffer.event || "message",
              data: dataLines.join("\n"),
              id: eventBuffer.id,
              retry: eventBuffer.retry
            });
          }
          eventBuffer = {};
          dataLines = [];
          return;
        }
        const [field, ...rest] = line.split(":");
        const value = rest.join(":").trimStart();
        switch (field) {
          case "event":
            eventBuffer.event = value;
            break;
          case "data":
            dataLines.push(value);
            break;
          case "id":
            eventBuffer.id = value;
            break;
          case "retry":
            eventBuffer.retry = Number(value);
            break;
        }
      },
      flush(controller) {
        if (dataLines.length > 0) {
          controller.enqueue({
            event: eventBuffer.event || "message",
            data: dataLines.join("\n"),
            id: eventBuffer.id,
            retry: eventBuffer.retry
          });
        }
      }
    });
  }
};
var AssistantTransportDecoder = class extends PipeableTransformStream {
  constructor() {
    super((readable) => {
      let receivedDone = false;
      return readable.pipeThrough(new TextDecoderStream()).pipeThrough(new LineDecoderStream()).pipeThrough(new SSEEventStream()).pipeThrough(new TransformStream({
        transform(event, controller) {
          switch (event.event) {
            case "message":
              if (event.data === "[DONE]") {
                receivedDone = true;
                controller.terminate();
              } else {
                controller.enqueue(JSON.parse(event.data));
              }
              break;
            default:
              throw new Error(`Unknown SSE event type: ${event.event}`);
          }
        },
        flush() {
          if (!receivedDone) {
            throw new Error("Stream ended abruptly without receiving [DONE] marker");
          }
        }
      }));
    });
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/serialization/ui-message-stream/UIMessageStream.js
var SSEEventStream2 = class extends TransformStream {
  constructor() {
    let eventBuffer = {};
    let dataLines = [];
    super({
      start() {
        eventBuffer = {};
        dataLines = [];
      },
      transform(line, controller) {
        if (line.startsWith(":"))
          return;
        if (line === "") {
          if (dataLines.length > 0) {
            controller.enqueue({
              event: eventBuffer.event || "message",
              data: dataLines.join("\n"),
              id: eventBuffer.id,
              retry: eventBuffer.retry
            });
          }
          eventBuffer = {};
          dataLines = [];
          return;
        }
        const [field, ...rest] = line.split(":");
        const value = rest.join(":").trimStart();
        switch (field) {
          case "event":
            eventBuffer.event = value;
            break;
          case "data":
            dataLines.push(value);
            break;
          case "id":
            eventBuffer.id = value;
            break;
          case "retry":
            eventBuffer.retry = Number(value);
            break;
        }
      },
      flush(controller) {
        if (dataLines.length > 0) {
          controller.enqueue({
            event: eventBuffer.event || "message",
            data: dataLines.join("\n"),
            id: eventBuffer.id,
            retry: eventBuffer.retry
          });
        }
      }
    });
  }
};
var isDataChunk = (chunk) => chunk.type.startsWith("data-");
var UIMessageStreamDecoder = class extends PipeableTransformStream {
  constructor(options = {}) {
    super((readable) => {
      const toolCallControllers = /* @__PURE__ */ new Map();
      let activeToolCallArgsText;
      let currentMessageId;
      let receivedDone = false;
      const transform = new AssistantTransformStream({
        transform(chunk, controller) {
          const type = chunk.type;
          if (isDataChunk(chunk)) {
            const name = chunk.type.slice(5);
            if (options.onData) {
              options.onData({
                type: chunk.type,
                name,
                data: chunk.data,
                ...chunk.transient !== void 0 && {
                  transient: chunk.transient
                }
              });
            }
            if (!chunk.transient) {
              controller.enqueue({
                type: "data",
                path: [],
                data: [{ name, data: chunk.data }]
              });
            }
            return;
          }
          switch (type) {
            case "start":
              currentMessageId = chunk.messageId;
              controller.enqueue({
                type: "step-start",
                path: [],
                messageId: chunk.messageId
              });
              break;
            case "text-start":
            case "text-end":
            case "reasoning-start":
            case "reasoning-end":
              break;
            case "text-delta":
              controller.appendText(chunk.textDelta);
              break;
            case "reasoning-delta":
              controller.appendReasoning(chunk.delta);
              break;
            case "source":
              controller.appendSource({
                type: "source",
                sourceType: chunk.source.sourceType,
                id: chunk.source.id,
                url: chunk.source.url,
                ...chunk.source.title && { title: chunk.source.title }
              });
              break;
            case "file":
              controller.appendFile({
                type: "file",
                mimeType: chunk.file.mimeType,
                data: chunk.file.data
              });
              break;
            case "tool-call-start": {
              activeToolCallArgsText == null ? void 0 : activeToolCallArgsText.close();
              activeToolCallArgsText = void 0;
              if (toolCallControllers.has(chunk.toolCallId)) {
                throw new Error(`Encountered duplicate tool call id: ${chunk.toolCallId}`);
              }
              const toolCallController = controller.addToolCallPart({
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName
              });
              toolCallControllers.set(chunk.toolCallId, toolCallController);
              activeToolCallArgsText = toolCallController.argsText;
              break;
            }
            case "tool-call-delta":
              activeToolCallArgsText == null ? void 0 : activeToolCallArgsText.append(chunk.argsText);
              break;
            case "tool-call-end":
              activeToolCallArgsText == null ? void 0 : activeToolCallArgsText.close();
              activeToolCallArgsText = void 0;
              break;
            case "tool-result": {
              const toolCallController = toolCallControllers.get(chunk.toolCallId);
              if (!toolCallController) {
                throw new Error(`Encountered tool result with unknown id: ${chunk.toolCallId}`);
              }
              toolCallController.setResponse({
                result: chunk.result,
                isError: chunk.isError ?? false,
                ...chunk.messages !== void 0 ? { messages: chunk.messages } : {}
              });
              break;
            }
            case "start-step":
              controller.enqueue({
                type: "step-start",
                path: [],
                messageId: chunk.messageId ?? currentMessageId ?? generateId()
              });
              break;
            case "finish-step":
              controller.enqueue({
                type: "step-finish",
                path: [],
                finishReason: chunk.finishReason,
                usage: chunk.usage,
                isContinued: chunk.isContinued
              });
              break;
            case "finish":
              controller.enqueue({
                type: "message-finish",
                path: [],
                finishReason: chunk.finishReason,
                usage: chunk.usage
              });
              break;
            case "error":
              controller.enqueue({
                type: "error",
                path: [],
                error: chunk.errorText
              });
              break;
            default:
              break;
          }
        },
        flush() {
          activeToolCallArgsText == null ? void 0 : activeToolCallArgsText.close();
          toolCallControllers.forEach((ctrl) => ctrl.close());
          toolCallControllers.clear();
        }
      });
      return readable.pipeThrough(new TextDecoderStream()).pipeThrough(new LineDecoderStream()).pipeThrough(new SSEEventStream2()).pipeThrough(new TransformStream({
        transform(event, controller) {
          if (event.event !== "message") {
            throw new Error(`Unknown SSE event type: ${event.event}`);
          }
          if (event.data === "[DONE]") {
            receivedDone = true;
            controller.terminate();
            return;
          }
          controller.enqueue(JSON.parse(event.data));
        },
        flush() {
          if (!receivedDone) {
            throw new Error("Stream ended abruptly without receiving [DONE] marker");
          }
        }
      })).pipeThrough(transform);
    });
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/accumulators/AssistantMessageStream.js
var AssistantMessageStream = class _AssistantMessageStream {
  constructor(readable) {
    __publicField(this, "readable");
    this.readable = readable;
    this.readable = readable;
  }
  static fromAssistantStream(stream) {
    return new _AssistantMessageStream(stream.pipeThrough(new AssistantMessageAccumulator()));
  }
  async unstable_result() {
    let last;
    for await (const chunk of this) {
      last = chunk;
    }
    if (!last) {
      return {
        role: "assistant",
        status: { type: "complete", reason: "unknown" },
        parts: [],
        content: [],
        metadata: {
          unstable_state: null,
          unstable_data: [],
          unstable_annotations: [],
          steps: [],
          custom: {}
        }
      };
    }
    return last;
  }
  [Symbol.asyncIterator]() {
    const reader = this.readable.getReader();
    return {
      async next() {
        const { done, value } = await reader.read();
        return done ? { done: true, value: void 0 } : { done: false, value };
      }
    };
  }
  tee() {
    const [readable1, readable2] = this.readable.tee();
    return [
      new _AssistantMessageStream(readable1),
      new _AssistantMessageStream(readable2)
    ];
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/tool/ToolResponse.js
var TOOL_RESPONSE_SYMBOL = Symbol.for("aui.tool-response");
var ToolResponse = class _ToolResponse {
  constructor(options) {
    __publicField(this, "artifact");
    __publicField(this, "result");
    __publicField(this, "isError");
    __publicField(this, "messages");
    if (options.artifact !== void 0) {
      this.artifact = options.artifact;
    }
    this.result = options.result;
    this.isError = options.isError ?? false;
    if (options.messages !== void 0) {
      this.messages = options.messages;
    }
  }
  get [TOOL_RESPONSE_SYMBOL]() {
    return true;
  }
  static [Symbol.hasInstance](obj) {
    return typeof obj === "object" && obj !== null && TOOL_RESPONSE_SYMBOL in obj;
  }
  static toResponse(result) {
    if (result instanceof _ToolResponse) {
      return result;
    }
    return new _ToolResponse({
      result: result === void 0 ? "<no result>" : result
    });
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/tool/ToolExecutionStream.js
var import_secure_json_parse2 = __toESM(require_secure_json_parse(), 1);

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/utils/withPromiseOrValue.js
function withPromiseOrValue(callback, thenHandler, catchHandler) {
  try {
    const promiseOrValue = callback();
    if (typeof promiseOrValue === "object" && promiseOrValue !== null && "then" in promiseOrValue) {
      return promiseOrValue.then(thenHandler, catchHandler);
    } else {
      thenHandler(promiseOrValue);
    }
  } catch (e) {
    catchHandler(e);
  }
}

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/tool/ToolCallReader.js
function getField(obj, fieldPath) {
  let current = obj;
  for (const key of fieldPath) {
    if (current === void 0 || current === null) {
      return void 0;
    }
    current = current[key];
  }
  return current;
}
var GetHandle = class {
  constructor(resolve, reject, fieldPath) {
    __publicField(this, "resolve");
    __publicField(this, "reject");
    __publicField(this, "disposed", false);
    __publicField(this, "fieldPath");
    this.resolve = resolve;
    this.reject = reject;
    this.fieldPath = fieldPath;
  }
  update(args) {
    if (this.disposed)
      return;
    try {
      if (getPartialJsonObjectFieldState(args, this.fieldPath) === "complete") {
        const value = getField(args, this.fieldPath);
        if (value !== void 0) {
          this.resolve(value);
          this.dispose();
        }
      }
    } catch (e) {
      this.reject(e);
      this.dispose();
    }
  }
  dispose() {
    this.disposed = true;
  }
};
var StreamValuesHandle = class {
  constructor(controller, fieldPath) {
    __publicField(this, "controller");
    __publicField(this, "disposed", false);
    __publicField(this, "fieldPath");
    this.controller = controller;
    this.fieldPath = fieldPath;
  }
  update(args) {
    if (this.disposed)
      return;
    try {
      const value = getField(args, this.fieldPath);
      if (value !== void 0) {
        this.controller.enqueue(value);
      }
      if (getPartialJsonObjectFieldState(args, this.fieldPath) === "complete") {
        this.controller.close();
        this.dispose();
      }
    } catch (e) {
      this.controller.error(e);
      this.dispose();
    }
  }
  dispose() {
    this.disposed = true;
  }
};
var StreamTextHandle = class {
  constructor(controller, fieldPath) {
    __publicField(this, "controller");
    __publicField(this, "disposed", false);
    __publicField(this, "fieldPath");
    __publicField(this, "lastValue");
    this.controller = controller;
    this.fieldPath = fieldPath;
  }
  update(args) {
    var _a2;
    if (this.disposed)
      return;
    try {
      const value = getField(args, this.fieldPath);
      if (value !== void 0 && typeof value === "string") {
        const delta = value.substring(((_a2 = this.lastValue) == null ? void 0 : _a2.length) || 0);
        this.lastValue = value;
        this.controller.enqueue(delta);
      }
      if (getPartialJsonObjectFieldState(args, this.fieldPath) === "complete") {
        this.controller.close();
        this.dispose();
      }
    } catch (e) {
      this.controller.error(e);
      this.dispose();
    }
  }
  dispose() {
    this.disposed = true;
  }
};
var ForEachHandle = class {
  constructor(controller, fieldPath) {
    __publicField(this, "controller");
    __publicField(this, "disposed", false);
    __publicField(this, "fieldPath");
    __publicField(this, "processedIndexes", /* @__PURE__ */ new Set());
    this.controller = controller;
    this.fieldPath = fieldPath;
  }
  update(args) {
    if (this.disposed)
      return;
    try {
      const array = getField(args, this.fieldPath);
      if (!Array.isArray(array)) {
        return;
      }
      for (let i = 0; i < array.length; i++) {
        if (!this.processedIndexes.has(i)) {
          const elementPath = [...this.fieldPath, i];
          if (getPartialJsonObjectFieldState(args, elementPath) === "complete") {
            this.controller.enqueue(array[i]);
            this.processedIndexes.add(i);
          }
        }
      }
      if (getPartialJsonObjectFieldState(args, this.fieldPath) === "complete") {
        this.controller.close();
        this.dispose();
      }
    } catch (e) {
      this.controller.error(e);
      this.dispose();
    }
  }
  dispose() {
    this.disposed = true;
  }
};
var ToolCallArgsReaderImpl = class {
  constructor(argTextDeltas) {
    __publicField(this, "argTextDeltas");
    __publicField(this, "handles", /* @__PURE__ */ new Set());
    __publicField(this, "args", parsePartialJsonObject(""));
    this.argTextDeltas = argTextDeltas;
    this.processStream();
  }
  async processStream() {
    try {
      let accumulatedText = "";
      const reader = this.argTextDeltas.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done)
          break;
        accumulatedText += value;
        const parsedArgs = parsePartialJsonObject(accumulatedText);
        if (parsedArgs !== void 0) {
          this.args = parsedArgs;
          for (const handle of this.handles) {
            handle.update(parsedArgs);
          }
        }
      }
    } catch (error) {
      console.error("Error processing argument stream:", error);
      for (const handle of this.handles) {
        handle.dispose();
      }
    }
  }
  get(...fieldPath) {
    return new Promise((resolve, reject) => {
      const handle = new GetHandle(resolve, reject, fieldPath);
      if (this.args && getPartialJsonObjectFieldState(this.args, fieldPath) === "complete") {
        const value = getField(this.args, fieldPath);
        if (value !== void 0) {
          resolve(value);
          return;
        }
      }
      this.handles.add(handle);
      handle.update(this.args);
    });
  }
  streamValues(...fieldPath) {
    const simplePath = fieldPath;
    const stream = new ReadableStream({
      start: (controller) => {
        const handle = new StreamValuesHandle(controller, simplePath);
        this.handles.add(handle);
        handle.update(this.args);
      },
      cancel: () => {
        for (const handle of this.handles) {
          if (handle instanceof StreamValuesHandle) {
            handle.dispose();
            this.handles.delete(handle);
            break;
          }
        }
      }
    });
    return asAsyncIterableStream(stream);
  }
  streamText(...fieldPath) {
    const simplePath = fieldPath;
    const stream = new ReadableStream({
      start: (controller) => {
        const handle = new StreamTextHandle(controller, simplePath);
        this.handles.add(handle);
        handle.update(this.args);
      },
      cancel: () => {
        for (const handle of this.handles) {
          if (handle instanceof StreamTextHandle) {
            handle.dispose();
            this.handles.delete(handle);
            break;
          }
        }
      }
    });
    return asAsyncIterableStream(stream);
  }
  forEach(...fieldPath) {
    const simplePath = fieldPath;
    const stream = new ReadableStream({
      start: (controller) => {
        const handle = new ForEachHandle(controller, simplePath);
        this.handles.add(handle);
        handle.update(this.args);
      },
      cancel: () => {
        for (const handle of this.handles) {
          if (handle instanceof ForEachHandle) {
            handle.dispose();
            this.handles.delete(handle);
            break;
          }
        }
      }
    });
    return asAsyncIterableStream(stream);
  }
};
var ToolCallResponseReaderImpl = class {
  constructor(promise) {
    __publicField(this, "promise");
    this.promise = promise;
  }
  get() {
    return this.promise;
  }
};
var ToolCallReaderImpl = class {
  constructor() {
    __publicField(this, "args");
    __publicField(this, "response");
    __publicField(this, "writable");
    __publicField(this, "resolve");
    __publicField(this, "argsText", "");
    __publicField(this, "result", {
      get: async () => {
        const response = await this.response.get();
        return response.result;
      }
    });
    const stream = new TransformStream();
    this.writable = stream.writable;
    this.args = new ToolCallArgsReaderImpl(stream.readable);
    const { promise, resolve } = promiseWithResolvers();
    this.resolve = resolve;
    this.response = new ToolCallResponseReaderImpl(promise);
  }
  async appendArgsTextDelta(text) {
    const writer = this.writable.getWriter();
    try {
      await writer.write(text);
    } catch (err) {
      console.warn(err);
    } finally {
      writer.releaseLock();
    }
    this.argsText += text;
  }
  setResponse(value) {
    this.resolve(value);
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/tool/ToolExecutionStream.js
var ToolExecutionStream = class extends PipeableTransformStream {
  constructor(options) {
    const toolCallPromises = /* @__PURE__ */ new Map();
    const toolCallControllers = /* @__PURE__ */ new Map();
    super((readable) => {
      const transform = new TransformStream({
        transform(chunk, controller) {
          if (chunk.type !== "part-finish" || chunk.meta.type !== "tool-call") {
            controller.enqueue(chunk);
          }
          const type = chunk.type;
          switch (type) {
            case "part-start":
              if (chunk.part.type === "tool-call") {
                const reader = new ToolCallReaderImpl();
                toolCallControllers.set(chunk.part.toolCallId, reader);
                options.streamCall({
                  reader,
                  toolCallId: chunk.part.toolCallId,
                  toolName: chunk.part.toolName
                });
              }
              break;
            case "text-delta": {
              if (chunk.meta.type === "tool-call") {
                const toolCallId = chunk.meta.toolCallId;
                const controller2 = toolCallControllers.get(toolCallId);
                if (!controller2)
                  throw new Error("No controller found for tool call");
                controller2.appendArgsTextDelta(chunk.textDelta);
              }
              break;
            }
            case "result": {
              if (chunk.meta.type !== "tool-call")
                break;
              const { toolCallId } = chunk.meta;
              const controller2 = toolCallControllers.get(toolCallId);
              if (!controller2)
                throw new Error("No controller found for tool call");
              controller2.setResponse(new ToolResponse({
                result: chunk.result,
                artifact: chunk.artifact,
                isError: chunk.isError
              }));
              break;
            }
            case "tool-call-args-text-finish": {
              if (chunk.meta.type !== "tool-call")
                break;
              const { toolCallId, toolName } = chunk.meta;
              const streamController = toolCallControllers.get(toolCallId);
              if (!streamController)
                throw new Error("No controller found for tool call");
              let isExecuting = false;
              const promise = withPromiseOrValue(() => {
                var _a2;
                let args;
                try {
                  args = import_secure_json_parse2.default.parse(streamController.argsText);
                } catch (e) {
                  throw new Error(`Function parameter parsing failed. ${JSON.stringify(e.message)}`);
                }
                const executeResult = options.execute({
                  toolCallId,
                  toolName,
                  args
                });
                if (executeResult !== void 0) {
                  isExecuting = true;
                  (_a2 = options.onExecutionStart) == null ? void 0 : _a2.call(options, toolCallId, toolName);
                }
                return executeResult;
              }, (c) => {
                var _a2;
                if (isExecuting) {
                  (_a2 = options.onExecutionEnd) == null ? void 0 : _a2.call(options, toolCallId, toolName);
                }
                if (c === void 0)
                  return;
                const result = new ToolResponse({
                  artifact: c.artifact,
                  result: c.result,
                  isError: c.isError
                });
                streamController.setResponse(result);
                controller.enqueue({
                  type: "result",
                  path: chunk.path,
                  ...result
                });
              }, (e) => {
                var _a2;
                if (isExecuting) {
                  (_a2 = options.onExecutionEnd) == null ? void 0 : _a2.call(options, toolCallId, toolName);
                }
                const result = new ToolResponse({
                  result: String(e),
                  isError: true
                });
                streamController.setResponse(result);
                controller.enqueue({
                  type: "result",
                  path: chunk.path,
                  ...result
                });
              });
              if (promise) {
                toolCallPromises.set(toolCallId, promise);
              }
              break;
            }
            case "part-finish": {
              if (chunk.meta.type !== "tool-call")
                break;
              const { toolCallId } = chunk.meta;
              const toolCallPromise = toolCallPromises.get(toolCallId);
              if (toolCallPromise) {
                toolCallPromise.then(() => {
                  toolCallPromises.delete(toolCallId);
                  toolCallControllers.delete(toolCallId);
                  controller.enqueue(chunk);
                });
              } else {
                controller.enqueue(chunk);
              }
            }
          }
        },
        async flush() {
          await Promise.all(toolCallPromises.values());
        }
      });
      return readable.pipeThrough(new AssistantMetaTransformStream()).pipeThrough(transform);
    });
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/tool/toolResultStream.js
var isStandardSchemaV1 = (schema) => {
  return typeof schema === "object" && schema !== null && "~standard" in schema && schema["~standard"].version === 1;
};
function getToolResponse(tools, abortSignal, toolCall, human) {
  const tool = tools == null ? void 0 : tools[toolCall.toolName];
  if (!(tool == null ? void 0 : tool.execute))
    return void 0;
  const getResult = async (toolExecute) => {
    if (abortSignal.aborted) {
      return new ToolResponse({
        result: "Tool execution was cancelled.",
        isError: true
      });
    }
    let executeFn = toolExecute;
    if (isStandardSchemaV1(tool.parameters)) {
      let result = tool.parameters["~standard"].validate(toolCall.args);
      if (result instanceof Promise)
        result = await result;
      if (result.issues) {
        executeFn = tool.experimental_onSchemaValidationError ?? (() => {
          throw new Error(`Function parameter validation failed. ${JSON.stringify(result.issues)}`);
        });
      }
    }
    const abortPromise = new Promise((resolve) => {
      const onAbort = () => {
        queueMicrotask(() => {
          queueMicrotask(() => {
            resolve(new ToolResponse({
              result: "Tool execution was cancelled.",
              isError: true
            }));
          });
        });
      };
      if (abortSignal.aborted) {
        onAbort();
      } else {
        abortSignal.addEventListener("abort", onAbort, { once: true });
      }
    });
    const executePromise = (async () => {
      const result = await executeFn(toolCall.args, {
        toolCallId: toolCall.toolCallId,
        abortSignal,
        human: (payload) => human(toolCall.toolCallId, payload)
      });
      return ToolResponse.toResponse(result);
    })();
    return Promise.race([executePromise, abortPromise]);
  };
  return getResult(tool.execute);
}
function getToolStreamResponse(tools, abortSignal, reader, context2, human) {
  var _a2, _b;
  (_b = (_a2 = tools == null ? void 0 : tools[context2.toolName]) == null ? void 0 : _a2.streamCall) == null ? void 0 : _b.call(_a2, reader, {
    toolCallId: context2.toolCallId,
    abortSignal,
    human: (payload) => human(context2.toolCallId, payload)
  });
}
function toolResultStream(tools, abortSignal, human, options) {
  const toolsFn = typeof tools === "function" ? tools : () => tools;
  const abortSignalFn = typeof abortSignal === "function" ? abortSignal : () => abortSignal;
  return new ToolExecutionStream({
    execute: (toolCall) => getToolResponse(toolsFn(), abortSignalFn(), toolCall, human),
    streamCall: ({ reader, ...context2 }) => getToolStreamResponse(toolsFn(), abortSignalFn(), reader, context2, human),
    onExecutionStart: options == null ? void 0 : options.onExecutionStart,
    onExecutionEnd: options == null ? void 0 : options.onExecutionEnd
  });
}

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/tool/schema-utils.js
function isStandardSchema(schema) {
  return typeof schema === "object" && schema !== null && "~standard" in schema && typeof schema["~standard"] === "object";
}
function hasToJSONSchemaMethod(schema) {
  return typeof schema === "object" && schema !== null && "toJSONSchema" in schema && typeof schema.toJSONSchema === "function";
}
function hasToJSONMethod(schema) {
  return typeof schema === "object" && schema !== null && "toJSON" in schema && typeof schema.toJSON === "function";
}
function toJSONSchema(schema) {
  if (isStandardSchema(schema)) {
    const toJSONSchemaMethod = schema["~standard"].toJSONSchema;
    if (typeof toJSONSchemaMethod === "function") {
      return toJSONSchemaMethod();
    }
    const jsonSchema = schema["~standard"].jsonSchema;
    if (typeof jsonSchema === "object" && jsonSchema !== null && typeof jsonSchema.input === "function") {
      return jsonSchema.input();
    }
  }
  if (hasToJSONSchemaMethod(schema)) {
    return schema.toJSONSchema();
  }
  if (hasToJSONMethod(schema)) {
    return schema.toJSON();
  }
  if (isStandardSchema(schema)) {
    throw new Error("Could not convert schema to JSON Schema. The schema implements Standard Schema but does not support JSON Schema conversion. If you are using Zod, please upgrade to Zod v4 (npm install zod@latest). Alternatively, pass a plain JSON Schema object instead.");
  }
  return schema;
}
function toPartialJSONSchema(schema) {
  const { required: _, ...result } = schema;
  if (result.properties) {
    result.properties = Object.fromEntries(Object.entries(result.properties).map(([key, prop]) => {
      if (typeof prop === "object" && prop !== null && !Array.isArray(prop)) {
        const p = prop;
        return [key, p.properties != null ? toPartialJSONSchema(p) : prop];
      }
      return [key, prop];
    }));
  }
  return result;
}
function defaultToolFilter(_name, tool) {
  return !tool.disabled && tool.type !== "backend";
}
function toToolsJSONSchema(tools, options = {}) {
  if (!tools)
    return {};
  const filter = options.filter ?? defaultToolFilter;
  return Object.fromEntries(Object.entries(tools).filter(([name, tool]) => filter(name, tool) && tool.parameters).map(([name, tool]) => [
    name,
    {
      ...tool.description && { description: tool.description },
      parameters: toJSONSchema(tool.parameters)
    }
  ]));
}

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/utils/stream/SSE.js
var _SSEEncoder = class _SSEEncoder extends PipeableTransformStream {
  constructor() {
    super((readable) => readable.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(`data: ${JSON.stringify(chunk)}

`);
      }
    })).pipeThrough(new TextEncoderStream()));
    __publicField(this, "headers", _SSEEncoder.headers);
  }
};
__publicField(_SSEEncoder, "headers", new Headers({
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive"
}));
var SSEEncoder = _SSEEncoder;
var SSEEventStream3 = class extends TransformStream {
  constructor() {
    let eventBuffer = {};
    let dataLines = [];
    super({
      start() {
        eventBuffer = {};
        dataLines = [];
      },
      transform(line, controller) {
        if (line.startsWith(":"))
          return;
        if (line === "") {
          if (dataLines.length > 0) {
            controller.enqueue({
              event: eventBuffer.event || "message",
              data: dataLines.join("\n"),
              id: eventBuffer.id,
              retry: eventBuffer.retry
            });
          }
          eventBuffer = {};
          dataLines = [];
          return;
        }
        const [field, ...rest] = line.split(":");
        const value = rest.join(":").trimStart();
        switch (field) {
          case "event":
            eventBuffer.event = value;
            break;
          case "data":
            dataLines.push(value);
            break;
          case "id":
            eventBuffer.id = value;
            break;
          case "retry":
            eventBuffer.retry = Number(value);
            break;
        }
      },
      flush(controller) {
        if (dataLines.length > 0) {
          controller.enqueue({
            event: eventBuffer.event || "message",
            data: dataLines.join("\n"),
            id: eventBuffer.id,
            retry: eventBuffer.retry
          });
        }
      }
    });
  }
};

// ../../node_modules/.pnpm/assistant-stream@0.3.10/node_modules/assistant-stream/dist/core/converters/toGenericMessages.js
var IMAGE_MEDIA_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
  bmp: "image/bmp",
  ico: "image/x-icon",
  tiff: "image/tiff",
  tif: "image/tiff",
  heic: "image/heic",
  heif: "image/heif"
};
function inferImageMediaType(url) {
  var _a2;
  if (url.startsWith("data:")) {
    const match = url.match(/^data:([^;,]+)/);
    if (match == null ? void 0 : match[1])
      return match[1];
  }
  const [pathWithoutParams = ""] = url.split(/[?#]/);
  const ext = ((_a2 = pathWithoutParams.split(".").pop()) == null ? void 0 : _a2.toLowerCase()) ?? "";
  return IMAGE_MEDIA_TYPES[ext] ?? "image/png";
}
function toUrlOrString(value) {
  try {
    return new URL(value);
  } catch {
    return value;
  }
}
function processToolCall(part, accumulator) {
  if (!part.toolCallId || !part.toolName)
    return false;
  accumulator.textParts.push({
    type: "tool-call",
    toolCallId: part.toolCallId,
    toolName: part.toolName,
    args: part.args ?? {}
  });
  if (part.result !== void 0) {
    const toolResult = {
      type: "tool-result",
      toolCallId: part.toolCallId,
      toolName: part.toolName,
      result: part.result
    };
    if (part.isError) {
      toolResult.isError = true;
    }
    accumulator.toolResults.push(toolResult);
    return true;
  }
  return false;
}
function flushAccumulator(accumulator, result) {
  if (accumulator.textParts.length > 0) {
    result.push({ role: "assistant", content: accumulator.textParts });
    accumulator.textParts = [];
  }
  if (accumulator.toolResults.length > 0) {
    result.push({ role: "tool", content: accumulator.toolResults });
    accumulator.toolResults = [];
  }
}
function convertSystemMessage(message, result) {
  const textPart = message.content.find((p) => p.type === "text");
  if (textPart == null ? void 0 : textPart.text) {
    result.push({ role: "system", content: textPart.text });
  }
}
function convertUserMessage(message, result) {
  const attachments = message.attachments ?? [];
  const allContent = [
    ...message.content,
    ...attachments.flatMap((a) => a.content)
  ];
  const content = [];
  for (const part of allContent) {
    if (part.type === "text" && part.text) {
      content.push({ type: "text", text: part.text });
    } else if (part.type === "image" && part.image) {
      content.push({
        type: "file",
        data: toUrlOrString(part.image),
        mediaType: inferImageMediaType(part.image)
      });
    } else if (part.type === "file" && part.data && part.mimeType) {
      content.push({
        type: "file",
        data: toUrlOrString(part.data),
        mediaType: part.mimeType
      });
    }
  }
  if (content.length > 0) {
    result.push({ role: "user", content });
  }
}
function convertAssistantMessage(message, result) {
  const accumulator = {
    textParts: [],
    toolResults: []
  };
  let hasPendingToolResults = false;
  for (const part of message.content) {
    if (part.type === "text" && part.text) {
      if (hasPendingToolResults) {
        flushAccumulator(accumulator, result);
        hasPendingToolResults = false;
      }
      accumulator.textParts.push({ type: "text", text: part.text });
    } else if (part.type === "tool-call") {
      if (processToolCall(part, accumulator)) {
        hasPendingToolResults = true;
      }
    }
  }
  flushAccumulator(accumulator, result);
}
function toGenericMessages(messages) {
  const result = [];
  for (const message of messages) {
    switch (message.role) {
      case "system":
        convertSystemMessage(message, result);
        break;
      case "user":
        convertUserMessage(message, result);
        break;
      case "assistant":
        convertAssistantMessage(message, result);
        break;
    }
  }
  return result;
}

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/client/interactable-model-context.js
function shallowMerge(prev, partial) {
  if (typeof prev !== "object" || prev === null || typeof partial !== "object" || partial === null || Array.isArray(prev) || Array.isArray(partial)) {
    return partial;
  }
  return {
    ...prev,
    ...partial
  };
}
function buildInteractableModelContext(definitions, partialSchemaCache, setDefState) {
  const entries = Object.values(definitions);
  if (entries.length === 0)
    return void 0;
  const byName = /* @__PURE__ */ new Map();
  for (const def of entries) {
    const list = byName.get(def.name) ?? [];
    list.push(def);
    byName.set(def.name, list);
  }
  const systemParts = [];
  const tools = {};
  for (const [name, instances] of byName) {
    const isMulti = instances.length > 1;
    for (const def of instances) {
      const selectedTag = def.selected ? " (SELECTED)" : "";
      const idTag = isMulti ? ` [id="${def.id}"]` : "";
      systemParts.push(`Interactable component "${name}"${idTag}${selectedTag} (${def.description}). Current state: ${JSON.stringify(def.state)}`);
      const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const safeId = def.id.replace(/[^a-zA-Z0-9_-]/g, "_");
      const toolName = isMulti ? `update_${safeName}_${safeId}` : `update_${safeName}`;
      const partialSchema = partialSchemaCache.get(def.id) ?? def.stateSchema;
      tools[toolName] = {
        type: "frontend",
        description: `Update the state of interactable component "${name}"${isMulti ? ` (id: ${def.id})` : ""}. Only include the fields you want to change; omitted fields keep their current values. ${def.description}`,
        parameters: partialSchema,
        streamCall: async (reader) => {
          try {
            for await (const partialArgs of reader.args.streamValues()) {
              setDefState(def.id, (prev) => shallowMerge(prev, partialArgs));
            }
          } catch {
          }
        },
        execute: async (partialState) => {
          setDefState(def.id, (prev) => shallowMerge(prev, partialState));
          return { success: true };
        }
      };
    }
  }
  return { system: systemParts.join("\n"), tools };
}

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/client/Interactables.js
var PERSISTENCE_DEBOUNCE_MS = 500;
var Interactables = resource(() => {
  const [state, setState] = tapState(() => ({
    definitions: {},
    persistence: {}
  }));
  const clientRef = tapAssistantClientRef();
  const stateRef = tapRef(state);
  tapEffect(() => {
    stateRef.current = state;
  }, [state]);
  const subscribersRef = tapRef(/* @__PURE__ */ new Set());
  const partialSchemaCacheRef = tapRef(/* @__PURE__ */ new Map());
  const detachedStateRef = tapRef(/* @__PURE__ */ new Map());
  const adapterRef = tapRef(void 0);
  const debounceTimerRef = tapRef(void 0);
  const syncSeqRef = tapRef(0);
  const hasPendingLocalChangeRef = tapRef(false);
  const flushResolversRef = tapRef([]);
  const dirtyIdsRef = tapRef(/* @__PURE__ */ new Set());
  const runPersistence = tapCallback(async () => {
    const adapter = adapterRef.current;
    if (!adapter) {
      for (const resolve of flushResolversRef.current)
        resolve();
      flushResolversRef.current = [];
      return;
    }
    const seq = ++syncSeqRef.current;
    const dirtyIds = new Set(dirtyIdsRef.current);
    dirtyIdsRef.current.clear();
    hasPendingLocalChangeRef.current = true;
    const exported = stateRef.current.definitions;
    const payload = {};
    for (const [id, def] of Object.entries(exported)) {
      payload[id] = { name: def.name, state: def.state };
    }
    setState((prev) => ({
      ...prev,
      persistence: {
        ...prev.persistence,
        ...Object.fromEntries([...dirtyIds].map((id) => [
          id,
          { isPending: true, error: void 0 }
        ]))
      }
    }));
    try {
      await adapter.save(payload);
      if (syncSeqRef.current === seq) {
        hasPendingLocalChangeRef.current = false;
        setState((prev) => {
          const persistence = { ...prev.persistence };
          for (const id of dirtyIds)
            delete persistence[id];
          return { ...prev, persistence };
        });
      }
    } catch (e) {
      if (syncSeqRef.current === seq) {
        hasPendingLocalChangeRef.current = false;
        setState((prev) => ({
          ...prev,
          persistence: {
            ...prev.persistence,
            ...Object.fromEntries([...dirtyIds].map((id) => [id, { isPending: false, error: e }]))
          }
        }));
      }
    } finally {
      if (dirtyIdsRef.current.size > 0 && adapterRef.current) {
        runPersistence();
      } else {
        for (const resolve of flushResolversRef.current)
          resolve();
        flushResolversRef.current = [];
      }
    }
  }, []);
  const schedulePersistence = tapCallback((id) => {
    if (!adapterRef.current)
      return;
    dirtyIdsRef.current.add(id);
    if (debounceTimerRef.current !== void 0) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = void 0;
      if (!hasPendingLocalChangeRef.current) {
        runPersistence();
      } else {
        debounceTimerRef.current = setTimeout(() => {
          debounceTimerRef.current = void 0;
          runPersistence();
        }, PERSISTENCE_DEBOUNCE_MS);
      }
    }, PERSISTENCE_DEBOUNCE_MS);
  }, [runPersistence]);
  const exportState = tapCallback(() => {
    const result = {};
    for (const [id, def] of Object.entries(stateRef.current.definitions)) {
      result[id] = { name: def.name, state: def.state };
    }
    return result;
  }, []);
  const importState = tapCallback((saved) => {
    for (const [id, entry] of Object.entries(saved)) {
      detachedStateRef.current.set(id, entry.state);
    }
    setState((prev) => {
      let changed = false;
      const definitions = { ...prev.definitions };
      for (const [id, entry] of Object.entries(saved)) {
        if (definitions[id]) {
          definitions[id] = { ...definitions[id], state: entry.state };
          changed = true;
        }
      }
      return changed ? { ...prev, definitions } : prev;
    });
  }, []);
  const setPersistenceAdapter = tapCallback((adapter) => {
    adapterRef.current = adapter;
  }, []);
  const flush = tapCallback(async () => {
    if (debounceTimerRef.current !== void 0) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = void 0;
    }
    if (!adapterRef.current)
      return;
    if (!hasPendingLocalChangeRef.current && dirtyIdsRef.current.size === 0)
      return;
    const p = new Promise((resolve) => {
      flushResolversRef.current.push(resolve);
    });
    if (!hasPendingLocalChangeRef.current) {
      runPersistence();
    }
    return p;
  }, [runPersistence]);
  const flushIfPending = tapCallback(() => {
    if (adapterRef.current && debounceTimerRef.current !== void 0) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = void 0;
      runPersistence();
    }
  }, [runPersistence]);
  const setDefState = tapCallback((id, updater) => {
    setState((prev) => {
      const existing = prev.definitions[id];
      if (!existing)
        return prev;
      return {
        ...prev,
        definitions: {
          ...prev.definitions,
          [id]: { ...existing, state: updater(existing.state) }
        }
      };
    });
    if (stateRef.current.definitions[id])
      schedulePersistence(id);
  }, [schedulePersistence]);
  const setDefSelected = tapCallback((id, selected) => {
    setState((prev) => {
      const existing = prev.definitions[id];
      if (!existing)
        return prev;
      return {
        ...prev,
        definitions: {
          ...prev.definitions,
          [id]: { ...existing, selected }
        }
      };
    });
  }, []);
  const provider = tapMemo(() => ({
    getModelContext: () => {
      const defs = stateRef.current.definitions;
      return buildInteractableModelContext(defs, partialSchemaCacheRef.current, setDefState) ?? {};
    },
    subscribe: (callback) => {
      subscribersRef.current.add(callback);
      return () => {
        subscribersRef.current.delete(callback);
      };
    }
  }), [setDefState]);
  tapEffect(() => {
    for (const cb of subscribersRef.current)
      cb();
  }, [state]);
  tapEffect(() => {
    return clientRef.current.modelContext().register(provider);
  }, [clientRef, provider]);
  const register = tapCallback((def) => {
    try {
      const jsonSchema = toJSONSchema(def.stateSchema);
      partialSchemaCacheRef.current.set(def.id, toPartialJSONSchema(jsonSchema));
    } catch (e) {
      console.warn(`[Interactables] Failed to create partial schema for "${def.name}". The update tool will require all fields.`, e);
    }
    const detached = detachedStateRef.current.get(def.id);
    detachedStateRef.current.delete(def.id);
    setState((prev) => {
      var _a2;
      return {
        ...prev,
        definitions: {
          ...prev.definitions,
          [def.id]: {
            id: def.id,
            name: def.name,
            description: def.description,
            stateSchema: def.stateSchema,
            state: ((_a2 = prev.definitions[def.id]) == null ? void 0 : _a2.state) ?? detached ?? def.initialState,
            selected: def.selected
          }
        }
      };
    });
    return () => {
      flushIfPending();
      setState((prev) => {
        const existing = prev.definitions[def.id];
        if (existing) {
          detachedStateRef.current.set(def.id, existing.state);
        }
        partialSchemaCacheRef.current.delete(def.id);
        const { [def.id]: _, ...rest } = prev.definitions;
        const { [def.id]: __, ...restPersistence } = prev.persistence;
        return { ...prev, definitions: rest, persistence: restPersistence };
      });
    };
  }, [flushIfPending]);
  return {
    getState: () => state,
    register,
    setState: setDefState,
    setSelected: setDefSelected,
    exportState,
    importState,
    setPersistenceAdapter,
    flush
  };
});
attachTransformScopes(Interactables, (scopes, parent) => {
  if (!scopes.modelContext && parent.modelContext.source === null) {
    scopes.modelContext = ModelContext();
  }
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/AttachmentByIndexProvider.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var MessageAttachmentByIndexProvider = ({ index, children }) => {
  const aui = useAui({
    attachment: Derived({
      source: "message",
      query: { type: "index", index },
      get: (aui2) => aui2.message().attachment({ index })
    })
  });
  return (0, import_jsx_runtime2.jsx)(AuiProvider, { value: aui, children });
};
var ComposerAttachmentByIndexProvider = ({ index, children }) => {
  const aui = useAui({
    attachment: Derived({
      source: "composer",
      query: { type: "index", index },
      get: (aui2) => aui2.composer().attachment({ index })
    })
  });
  return (0, import_jsx_runtime2.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/ThreadListItemRuntimeProvider.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/runtime-clients/tap-subscribable.js
var tapSubscribable = (subscribable) => {
  const [, setState] = tapState(subscribable.getState);
  tapEffect(() => {
    setState(subscribable.getState());
    return subscribable.subscribe(() => {
      setState(subscribable.getState());
    });
  }, [subscribable]);
  return subscribable.getState();
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/runtime-clients/attachment-runtime-client.js
var AttachmentRuntimeClient = resource(({ runtime }) => {
  const state = tapSubscribable(runtime);
  return {
    getState: () => state,
    remove: runtime.remove,
    __internal_getRuntime: () => runtime
  };
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/runtime-clients/message-part-runtime-client.js
var MessagePartClient = resource(({ runtime }) => {
  const state = tapSubscribable(runtime);
  return {
    getState: () => state,
    addToolResult: (result) => runtime.addToolResult(result),
    resumeToolCall: (payload) => runtime.resumeToolCall(payload),
    __internal_getRuntime: () => runtime
  };
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/runtime-clients/composer-runtime-client.js
var ComposerAttachmentClientByIndex = resource(({ runtime, index }) => {
  const attachmentRuntime = tapMemo(() => runtime.getAttachmentByIndex(index), [runtime, index]);
  return tapResource(AttachmentRuntimeClient({
    runtime: attachmentRuntime
  }));
});
var ComposerClient = resource(({ threadIdRef, messageIdRef, runtime }) => {
  const runtimeState = tapSubscribable(runtime);
  const emit = tapAssistantEmit();
  tapEffect(() => {
    const unsubscribers = [];
    for (const event of ["send", "attachmentAdd"]) {
      const unsubscribe = runtime.unstable_on(event, () => {
        emit(`composer.${event}`, {
          threadId: threadIdRef.current,
          ...messageIdRef && { messageId: messageIdRef.current }
        });
      });
      unsubscribers.push(unsubscribe);
    }
    unsubscribers.push(runtime.unstable_on("attachmentAddError", () => {
      const errorAttachment = runtime.getState().attachments.findLast((a) => a.status.type === "incomplete" && a.status.reason === "error");
      emit("composer.attachmentAddError", {
        threadId: threadIdRef.current,
        ...messageIdRef && { messageId: messageIdRef.current },
        ...errorAttachment && { attachmentId: errorAttachment.id }
      });
    }));
    return () => {
      for (const unsub of unsubscribers)
        unsub();
    };
  }, [runtime, emit, threadIdRef, messageIdRef]);
  const attachments = tapClientLookup(() => runtimeState.attachments.map((attachment, idx) => withKey(attachment.id, ComposerAttachmentClientByIndex({
    runtime,
    index: idx
  }))), [runtimeState.attachments, runtime]);
  const state = tapMemo(() => {
    return {
      text: runtimeState.text,
      role: runtimeState.role,
      attachments: attachments.state,
      runConfig: runtimeState.runConfig,
      isEditing: runtimeState.isEditing,
      canCancel: runtimeState.canCancel,
      attachmentAccept: runtimeState.attachmentAccept,
      isEmpty: runtimeState.isEmpty,
      type: runtimeState.type ?? "thread",
      dictation: runtimeState.dictation,
      quote: runtimeState.quote,
      queue: []
    };
  }, [runtimeState, attachments.state]);
  return {
    getState: () => state,
    setText: runtime.setText,
    setRole: runtime.setRole,
    setRunConfig: runtime.setRunConfig,
    addAttachment: runtime.addAttachment,
    reset: runtime.reset,
    clearAttachments: runtime.clearAttachments,
    send: runtime.send,
    cancel: runtime.cancel,
    beginEdit: runtime.beginEdit ?? (() => {
      throw new Error("beginEdit is not supported in this runtime");
    }),
    startDictation: runtime.startDictation,
    stopDictation: runtime.stopDictation,
    setQuote: runtime.setQuote,
    attachment: (selector) => {
      if ("id" in selector) {
        return attachments.get({ key: selector.id });
      } else {
        return attachments.get(selector);
      }
    },
    queueItem: () => {
      throw new Error("Queue is not supported in this runtime");
    },
    __internal_getRuntime: () => runtime
  };
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/runtime-clients/message-runtime-client.js
var MessageAttachmentClientByIndex = resource(({ runtime, index }) => {
  const attachmentRuntime = tapMemo(() => runtime.getAttachmentByIndex(index), [runtime, index]);
  return tapResource(AttachmentRuntimeClient({ runtime: attachmentRuntime }));
});
var MessagePartByIndex = resource(({ runtime, index }) => {
  const partRuntime = tapMemo(() => runtime.getMessagePartByIndex(index), [runtime, index]);
  return tapResource(MessagePartClient({ runtime: partRuntime }));
});
var MessageClient = resource(({ runtime, threadIdRef }) => {
  const runtimeState = tapSubscribable(runtime);
  const [isCopiedState, setIsCopied] = tapState(false);
  const [isHoveringState, setIsHovering] = tapState(false);
  const messageIdRef = tapMemo(() => ({
    get current() {
      return runtime.getState().id;
    }
  }), [runtime]);
  const composer = tapClientResource(ComposerClient({
    runtime: runtime.composer,
    threadIdRef,
    messageIdRef
  }));
  const parts = tapClientLookup(() => runtimeState.content.map((part, idx) => withKey("toolCallId" in part && part.toolCallId != null ? `toolCallId-${part.toolCallId}` : `index-${idx}`, MessagePartByIndex({ runtime, index: idx }))), [runtimeState.content, runtime]);
  const attachments = tapClientLookup(() => (runtimeState.attachments ?? []).map((attachment, idx) => withKey(attachment.id, MessageAttachmentClientByIndex({ runtime, index: idx }))), [runtimeState.attachments, runtime]);
  const state = tapMemo(() => {
    return {
      ...runtimeState,
      parts: parts.state,
      composer: composer.state,
      isCopied: isCopiedState,
      isHovering: isHoveringState
    };
  }, [
    runtimeState,
    parts.state,
    composer.state,
    isCopiedState,
    isHoveringState
  ]);
  return {
    getState: () => state,
    composer: () => composer.methods,
    reload: (config) => runtime.reload(config),
    speak: () => runtime.speak(),
    stopSpeaking: () => runtime.stopSpeaking(),
    submitFeedback: (feedback) => runtime.submitFeedback(feedback),
    switchToBranch: (options) => runtime.switchToBranch(options),
    getCopyText: () => runtime.unstable_getCopyText(),
    part: (selector) => {
      if ("index" in selector) {
        return parts.get({ index: selector.index });
      } else {
        return parts.get({ key: `toolCallId-${selector.toolCallId}` });
      }
    },
    attachment: (selector) => {
      if ("id" in selector) {
        return attachments.get({ key: selector.id });
      } else {
        return attachments.get(selector);
      }
    },
    setIsCopied,
    setIsHovering,
    __internal_getRuntime: () => runtime
  };
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/runtime-clients/thread-runtime-client.js
var MessageClientById = resource(({ runtime, id, threadIdRef }) => {
  const messageRuntime = tapMemo(() => runtime.getMessageById(id), [runtime, id]);
  return tapResource(MessageClient({ runtime: messageRuntime, threadIdRef }));
});
var ThreadClient = resource(({ runtime }) => {
  const runtimeState = tapSubscribable(runtime);
  const emit = tapAssistantEmit();
  tapEffect(() => {
    const unsubscribers = [];
    const threadEvents = [
      "runStart",
      "runEnd",
      "initialize",
      "modelContextUpdate"
    ];
    for (const event of threadEvents) {
      const unsubscribe = runtime.unstable_on(event, () => {
        var _a2;
        const threadId = ((_a2 = runtime.getState()) == null ? void 0 : _a2.threadId) || "unknown";
        emit(`thread.${event}`, {
          threadId
        });
      });
      unsubscribers.push(unsubscribe);
    }
    return () => {
      for (const unsub of unsubscribers)
        unsub();
    };
  }, [runtime, emit]);
  const threadIdRef = tapMemo(() => ({
    get current() {
      return runtime.getState().threadId;
    }
  }), [runtime]);
  const composer = tapClientResource(ComposerClient({
    runtime: runtime.composer,
    threadIdRef
  }));
  const messages = tapClientLookup(() => runtimeState.messages.map((m) => withKey(m.id, MessageClientById({ runtime, id: m.id, threadIdRef }))), [runtimeState.messages, runtime, threadIdRef]);
  const state = tapMemo(() => {
    return {
      isEmpty: messages.state.length === 0 && !runtimeState.isLoading,
      isDisabled: runtimeState.isDisabled,
      isLoading: runtimeState.isLoading,
      isRunning: runtimeState.isRunning,
      capabilities: runtimeState.capabilities,
      state: runtimeState.state,
      suggestions: runtimeState.suggestions,
      extras: runtimeState.extras,
      speech: runtimeState.speech,
      voice: runtimeState.voice,
      composer: composer.state,
      messages: messages.state
    };
  }, [runtimeState, messages, composer.state]);
  return {
    getState: () => state,
    composer: () => composer.methods,
    append: runtime.append,
    startRun: runtime.startRun,
    resumeRun: runtime.resumeRun,
    unstable_resumeRun: runtime.resumeRun,
    cancelRun: runtime.cancelRun,
    getModelContext: runtime.getModelContext,
    export: runtime.export,
    import: runtime.import,
    reset: runtime.reset,
    stopSpeaking: runtime.stopSpeaking,
    connectVoice: runtime.connectVoice,
    disconnectVoice: runtime.disconnectVoice,
    getVoiceVolume: runtime.getVoiceVolume,
    subscribeVoiceVolume: runtime.subscribeVoiceVolume,
    muteVoice: runtime.muteVoice,
    unmuteVoice: runtime.unmuteVoice,
    message: (selector) => {
      if ("id" in selector) {
        return messages.get({ key: selector.id });
      } else {
        return messages.get(selector);
      }
    },
    __internal_getRuntime: () => runtime
  };
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/runtime-clients/thread-list-item-runtime-client.js
var ThreadListItemClient = resource(({ runtime }) => {
  const state = tapSubscribable(runtime);
  const emit = tapAssistantEmit();
  tapEffect(() => {
    const unsubscribers = [];
    const threadListItemEvents = [
      "switchedTo",
      "switchedAway"
    ];
    for (const event of threadListItemEvents) {
      const unsubscribe = runtime.unstable_on(event, () => {
        emit(`threadListItem.${event}`, {
          threadId: runtime.getState().id
        });
      });
      unsubscribers.push(unsubscribe);
    }
    return () => {
      for (const unsub of unsubscribers)
        unsub();
    };
  }, [runtime, emit]);
  return {
    getState: () => state,
    switchTo: runtime.switchTo,
    rename: runtime.rename,
    archive: runtime.archive,
    unarchive: runtime.unarchive,
    delete: runtime.delete,
    generateTitle: runtime.generateTitle,
    initialize: runtime.initialize,
    detach: runtime.detach,
    __internal_getRuntime: () => runtime
  };
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/runtime-clients/thread-list-runtime-client.js
var ThreadListItemClientById = resource(({ runtime, id }) => {
  const threadListItemRuntime = tapMemo(() => runtime.getItemById(id), [runtime, id]);
  return tapResource(ThreadListItemClient({
    runtime: threadListItemRuntime
  }));
});
var ThreadListClient = resource(({ runtime, __internal_assistantRuntime }) => {
  const runtimeState = tapSubscribable(runtime);
  const main = tapClientResource(ThreadClient({
    runtime: runtime.main
  }));
  const threadItems = tapClientLookup(() => Object.keys(runtimeState.threadItems).map((id) => withKey(id, ThreadListItemClientById({ runtime, id }))), [runtimeState.threadItems, runtime]);
  const state = tapMemo(() => {
    return {
      mainThreadId: runtimeState.mainThreadId,
      newThreadId: runtimeState.newThreadId ?? null,
      isLoading: runtimeState.isLoading,
      threadIds: runtimeState.threadIds,
      archivedThreadIds: runtimeState.archivedThreadIds,
      threadItems: threadItems.state,
      main: main.state
    };
  }, [runtimeState, threadItems.state, main.state]);
  return {
    getState: () => state,
    thread: () => main.methods,
    item: (threadIdOrOptions) => {
      if (threadIdOrOptions === "main") {
        return threadItems.get({ key: state.mainThreadId });
      }
      if ("id" in threadIdOrOptions) {
        return threadItems.get({ key: threadIdOrOptions.id });
      }
      const { index, archived = false } = threadIdOrOptions;
      const id = archived ? state.archivedThreadIds[index] : state.threadIds[index];
      return threadItems.get({ key: id });
    },
    switchToThread: async (threadId) => {
      await runtime.switchToThread(threadId);
    },
    switchToNewThread: async () => {
      await runtime.switchToNewThread();
    },
    getLoadThreadsPromise: () => runtime.getLoadThreadsPromise(),
    __internal_getAssistantRuntime: () => __internal_assistantRuntime
  };
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/store/clients/runtime-adapter.js
var RuntimeAdapterResource = resource((runtime) => {
  const clientRef = tapAssistantClientRef();
  tapEffect(() => {
    return runtime.registerModelContextProvider(clientRef.current.modelContext());
  }, [runtime, clientRef]);
  return tapResource(ThreadListClient({
    runtime: runtime.threads,
    __internal_assistantRuntime: runtime
  }));
});
var baseRuntimeAdapterTransformScopes = (scopes, parent) => {
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
  if (!scopes.suggestions && parent.suggestions.source === null) {
    scopes.suggestions = Suggestions();
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/ThreadListItemRuntimeProvider.js
var ThreadListItemRuntimeProvider = ({ runtime, children }) => {
  const aui = useAui({
    threadListItem: ThreadListItemClient({ runtime })
  });
  return (0, import_jsx_runtime3.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/MessageByIndexProvider.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var MessageByIndexProvider = ({ index, children }) => {
  const aui = useAui({
    message: Derived({
      source: "thread",
      query: { type: "index", index },
      get: (aui2) => aui2.thread().message({ index })
    }),
    composer: Derived({
      source: "message",
      query: {},
      get: (aui2) => aui2.thread().message({ index }).composer()
    })
  });
  return (0, import_jsx_runtime4.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/PartByIndexProvider.js
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
var PartByIndexProvider = ({ index, children }) => {
  const aui = useAui({
    part: Derived({
      source: "message",
      query: { type: "index", index },
      get: (aui2) => aui2.message().part({ index })
    })
  });
  return (0, import_jsx_runtime5.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/TextMessagePartProvider.js
var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
var TextMessagePartClient = resource(({ text, isRunning }) => {
  const state = tapMemo(() => ({
    type: "text",
    text,
    status: isRunning ? { type: "running" } : { type: "complete" }
  }), [text, isRunning]);
  return {
    getState: () => state,
    addToolResult: () => {
      throw new Error("Not supported");
    },
    resumeToolCall: () => {
      throw new Error("Not supported");
    }
  };
});
var TextMessagePartProvider = ({ text, isRunning = false, children }) => {
  const aui = useAui({
    part: TextMessagePartClient({ text, isRunning })
  });
  return (0, import_jsx_runtime6.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/ChainOfThoughtByIndicesProvider.js
var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
var ChainOfThoughtByIndicesProvider = ({ startIndex, endIndex, children }) => {
  const parts = useAuiState((s) => s.message.parts).slice(startIndex, endIndex + 1);
  const parentAui = useAui();
  const aui = useAui({
    chainOfThought: ChainOfThoughtClient({
      parts,
      getMessagePart: ({ index }) => {
        if (index < 0 || index >= parts.length) {
          throw new Error(`ChainOfThought part index ${index} is out of bounds (0..${parts.length - 1})`);
        }
        return parentAui.message().part({ index: startIndex + index });
      }
    })
  });
  return (0, import_jsx_runtime7.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/ThreadListItemByIndexProvider.js
var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
var ThreadListItemByIndexProvider = ({ index, archived, children }) => {
  const aui = useAui({
    threadListItem: Derived({
      source: "threads",
      query: { type: "index", index, archived },
      get: (aui2) => aui2.threads().item({ index, archived })
    })
  });
  return (0, import_jsx_runtime8.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/SuggestionByIndexProvider.js
var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
var SuggestionByIndexProvider = ({ index, children }) => {
  const aui = useAui({
    suggestion: Derived({
      source: "suggestions",
      query: { index },
      get: (aui2) => aui2.suggestions().suggestion({ index })
    })
  });
  return (0, import_jsx_runtime9.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/utils/id.js
var generateId2 = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
var optimisticPrefix = "__optimistic__";
var generateOptimisticId = () => `${optimisticPrefix}${generateId2()}`;
var errorPrefix = "__error__";
var generateErrorMessageId = () => `${errorPrefix}${generateId2()}`;

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/utils/auto-status.js
var symbolAutoStatus = Symbol("autoStatus");
var AUTO_STATUS_RUNNING = Object.freeze(Object.assign({ type: "running" }, { [symbolAutoStatus]: true }));
var AUTO_STATUS_COMPLETE = Object.freeze(Object.assign({
  type: "complete",
  reason: "unknown"
}, { [symbolAutoStatus]: true }));
var AUTO_STATUS_PENDING = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "tool-calls"
}, { [symbolAutoStatus]: true }));
var AUTO_STATUS_INTERRUPT = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "interrupt"
}, { [symbolAutoStatus]: true }));
var isAutoStatus = (status) => status[symbolAutoStatus] === true;
var getAutoStatus = (isLast, isRunning, hasInterruptedToolCalls, hasPendingToolCalls, error) => {
  if (isLast && error) {
    return Object.assign({
      type: "incomplete",
      reason: "error",
      error
    }, { [symbolAutoStatus]: true });
  }
  return isLast && isRunning ? AUTO_STATUS_RUNNING : hasInterruptedToolCalls ? AUTO_STATUS_INTERRUPT : hasPendingToolCalls ? AUTO_STATUS_PENDING : AUTO_STATUS_COMPLETE;
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/utils/thread-message-like.js
var convertDataPrefixedPart = (type, data) => {
  if (!type.startsWith("data-"))
    return void 0;
  return { type: "data", name: type.substring(5), data };
};
var fromThreadMessageLike = (like, fallbackId, fallbackStatus) => {
  const { role, id, createdAt, attachments, status, metadata } = like;
  const common = {
    id: id ?? fallbackId,
    createdAt: createdAt ?? /* @__PURE__ */ new Date()
  };
  const content = typeof like.content === "string" ? [{ type: "text", text: like.content }] : like.content;
  const sanitizeImageContent = ({ image, ...rest }) => {
    const match = image.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,(.*)$/);
    if (match) {
      return { ...rest, image };
    }
    console.warn(`Invalid image data format detected`);
    return null;
  };
  if (role !== "user" && (attachments == null ? void 0 : attachments.length))
    throw new Error("attachments are only supported for user messages");
  if (role !== "assistant" && status)
    throw new Error("status is only supported for assistant messages");
  if (role !== "assistant" && (metadata == null ? void 0 : metadata.steps))
    throw new Error("metadata.steps is only supported for assistant messages");
  switch (role) {
    case "assistant":
      return {
        ...common,
        role,
        content: content.map((part) => {
          const type = part.type;
          switch (type) {
            case "text":
            case "reasoning":
              if (part.text.trim().length === 0)
                return null;
              return part;
            case "file":
            case "source":
              return part;
            case "image":
              return sanitizeImageContent(part);
            case "data":
              return part;
            case "tool-call": {
              const { parentId, messages, ...basePart } = part;
              const commonProps = {
                ...basePart,
                toolCallId: part.toolCallId ?? `tool-${generateId2()}`,
                ...parentId !== void 0 && { parentId },
                ...messages !== void 0 && { messages }
              };
              if (part.args) {
                return {
                  ...commonProps,
                  args: part.args,
                  argsText: part.argsText ?? JSON.stringify(part.args)
                };
              }
              return {
                ...commonProps,
                args: parsePartialJsonObject(part.argsText ?? "") ?? {},
                argsText: part.argsText ?? ""
              };
            }
            default: {
              const converted = convertDataPrefixedPart(type, part.data);
              if (converted)
                return converted;
              throw new Error(`Unsupported assistant message part type: ${type}`);
            }
          }
        }).filter((c) => !!c),
        status: status ?? fallbackStatus,
        metadata: {
          unstable_state: (metadata == null ? void 0 : metadata.unstable_state) ?? null,
          unstable_annotations: (metadata == null ? void 0 : metadata.unstable_annotations) ?? [],
          unstable_data: (metadata == null ? void 0 : metadata.unstable_data) ?? [],
          custom: (metadata == null ? void 0 : metadata.custom) ?? {},
          steps: (metadata == null ? void 0 : metadata.steps) ?? [],
          ...(metadata == null ? void 0 : metadata.timing) && { timing: metadata.timing },
          ...(metadata == null ? void 0 : metadata.submittedFeedback) && {
            submittedFeedback: metadata.submittedFeedback
          }
        }
      };
    case "user":
      return {
        ...common,
        role,
        content: content.map((part) => {
          const type = part.type;
          switch (type) {
            case "text":
            case "image":
            case "audio":
            case "file":
            case "data":
              return part;
            default: {
              const converted = convertDataPrefixedPart(type, part.data);
              if (converted)
                return converted;
              throw new Error(`Unsupported user message part type: ${type}`);
            }
          }
        }),
        attachments: (attachments ?? []).map((att) => ({
          ...att,
          content: att.content.map((part) => {
            const converted = convertDataPrefixedPart(part.type, part.data);
            return converted ?? part;
          })
        })),
        metadata: {
          custom: (metadata == null ? void 0 : metadata.custom) ?? {}
        }
      };
    case "system":
      if (content.length !== 1 || content[0].type !== "text")
        throw new Error("System messages must have exactly one text message part.");
      return {
        ...common,
        role,
        content,
        metadata: {
          custom: (metadata == null ? void 0 : metadata.custom) ?? {}
        }
      };
    default: {
      const unsupportedRole = role;
      throw new Error(`Unknown message role: ${unsupportedRole}`);
    }
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/utils/message-repository.js
var ExportedMessageRepository = {
  fromArray: (messages) => {
    const conv = messages.map((m) => fromThreadMessageLike(m, generateId2(), getAutoStatus(false, false, false, false, void 0)));
    return {
      messages: conv.map((m, idx) => ({
        parentId: idx > 0 ? conv[idx - 1].id : null,
        message: m
      }))
    };
  }
};
var findHead = (message) => {
  if (message.next)
    return findHead(message.next);
  if ("current" in message)
    return message;
  return null;
};
var CachedValue = class {
  constructor(func) {
    __publicField(this, "func");
    __publicField(this, "_value", null);
    this.func = func;
  }
  get value() {
    if (this._value === null) {
      this._value = this.func();
    }
    return this._value;
  }
  dirty() {
    this._value = null;
  }
};
var MessageRepository = class {
  constructor() {
    __publicField(this, "messages", /* @__PURE__ */ new Map());
    __publicField(this, "head", null);
    __publicField(this, "root", {
      children: [],
      next: null
    });
    __publicField(this, "_messages", new CachedValue(() => {
      var _a2;
      const messages = new Array((((_a2 = this.head) == null ? void 0 : _a2.level) ?? -1) + 1);
      for (let current = this.head; current; current = current.prev) {
        messages[current.level] = current.current;
      }
      return messages;
    }));
  }
  updateLevels(message, newLevel) {
    message.level = newLevel;
    for (const childId of message.children) {
      const childMessage = this.messages.get(childId);
      if (childMessage) {
        this.updateLevels(childMessage, newLevel + 1);
      }
    }
  }
  performOp(newParent, child, operation) {
    const parentOrRoot = child.prev ?? this.root;
    const newParentOrRoot = newParent ?? this.root;
    if (operation === "relink" && parentOrRoot === newParentOrRoot)
      return;
    if (operation !== "link") {
      parentOrRoot.children = parentOrRoot.children.filter((m) => m !== child.current.id);
      if (parentOrRoot.next === child) {
        const fallbackId = parentOrRoot.children.at(-1);
        const fallback = fallbackId ? this.messages.get(fallbackId) : null;
        if (fallback === void 0) {
          throw new Error("MessageRepository(performOp/cut): Fallback sibling message not found. This is likely an internal bug in assistant-ui.");
        }
        parentOrRoot.next = fallback;
      }
    }
    if (operation !== "cut") {
      for (let current = newParent; current; current = current.prev) {
        if (current.current.id === child.current.id) {
          throw new Error("MessageRepository(performOp/link): A message with the same id already exists in the parent tree. This error occurs if the same message id is found multiple times. This is likely an internal bug in assistant-ui.");
        }
      }
      newParentOrRoot.children = [
        ...newParentOrRoot.children,
        child.current.id
      ];
      if (findHead(child) === this.head || newParentOrRoot.next === null) {
        newParentOrRoot.next = child;
      }
      child.prev = newParent;
      const newLevel = newParent ? newParent.level + 1 : 0;
      this.updateLevels(child, newLevel);
    }
  }
  get headId() {
    var _a2;
    return ((_a2 = this.head) == null ? void 0 : _a2.current.id) ?? null;
  }
  getMessages(headId) {
    var _a2;
    if (headId === void 0 || headId === ((_a2 = this.head) == null ? void 0 : _a2.current.id)) {
      return this._messages.value;
    }
    const headMessage = this.messages.get(headId);
    if (!headMessage) {
      throw new Error("MessageRepository(getMessages): Head message not found. This is likely an internal bug in assistant-ui.");
    }
    const messages = new Array(headMessage.level + 1);
    for (let current = headMessage; current; current = current.prev) {
      messages[current.level] = current.current;
    }
    return messages;
  }
  addOrUpdateMessage(parentId, message) {
    const existingItem = this.messages.get(message.id);
    const prev = parentId ? this.messages.get(parentId) : null;
    if (prev === void 0)
      throw new Error("MessageRepository(addOrUpdateMessage): Parent message not found. This is likely an internal bug in assistant-ui.");
    if (existingItem) {
      existingItem.current = message;
      this.performOp(prev, existingItem, "relink");
      this._messages.dirty();
      return;
    }
    const newItem = {
      prev,
      current: message,
      next: null,
      children: [],
      level: prev ? prev.level + 1 : 0
    };
    this.messages.set(message.id, newItem);
    this.performOp(prev, newItem, "link");
    if (this.head === prev) {
      this.head = newItem;
    }
    this._messages.dirty();
  }
  getMessage(messageId) {
    var _a2;
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error("MessageRepository(updateMessage): Message not found. This is likely an internal bug in assistant-ui.");
    return {
      parentId: ((_a2 = message.prev) == null ? void 0 : _a2.current.id) ?? null,
      message: message.current,
      index: message.level
    };
  }
  appendOptimisticMessage(parentId, message) {
    let optimisticId;
    do {
      optimisticId = generateOptimisticId();
    } while (this.messages.has(optimisticId));
    this.addOrUpdateMessage(parentId, fromThreadMessageLike(message, optimisticId, { type: "running" }));
    return optimisticId;
  }
  deleteMessage(messageId, replacementId) {
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error("MessageRepository(deleteMessage): Message not found. This is likely an internal bug in assistant-ui.");
    const replacement = replacementId === void 0 ? message.prev : replacementId === null ? null : this.messages.get(replacementId);
    if (replacement === void 0)
      throw new Error("MessageRepository(deleteMessage): Replacement not found. This is likely an internal bug in assistant-ui.");
    for (const child of message.children) {
      const childMessage = this.messages.get(child);
      if (!childMessage)
        throw new Error("MessageRepository(deleteMessage): Child message not found. This is likely an internal bug in assistant-ui.");
      this.performOp(replacement, childMessage, "relink");
    }
    this.performOp(null, message, "cut");
    this.messages.delete(messageId);
    if (this.head === message) {
      this.head = findHead(replacement ?? this.root);
    }
    this._messages.dirty();
  }
  getBranches(messageId) {
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error("MessageRepository(getBranches): Message not found. This is likely an internal bug in assistant-ui.");
    const { children } = message.prev ?? this.root;
    return children;
  }
  switchToBranch(messageId) {
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error("MessageRepository(switchToBranch): Branch not found. This is likely an internal bug in assistant-ui.");
    const prevOrRoot = message.prev ?? this.root;
    prevOrRoot.next = message;
    this.head = findHead(message);
    this._messages.dirty();
  }
  resetHead(messageId) {
    if (messageId === null) {
      this.clear();
      return;
    }
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error("MessageRepository(resetHead): Branch not found. This is likely an internal bug in assistant-ui.");
    if (message.children.length > 0) {
      const deleteDescendants = (msg) => {
        for (const childId of msg.children) {
          const childMessage = this.messages.get(childId);
          if (childMessage) {
            deleteDescendants(childMessage);
            this.messages.delete(childId);
          }
        }
      };
      deleteDescendants(message);
      message.children = [];
      message.next = null;
    }
    this.head = message;
    for (let current = message; current; current = current.prev) {
      if (current.prev) {
        current.prev.next = current;
      } else {
        this.root.next = current;
      }
    }
    this._messages.dirty();
  }
  clear() {
    this.messages.clear();
    this.head = null;
    this.root = {
      children: [],
      next: null
    };
    this._messages.dirty();
  }
  export() {
    var _a2, _b;
    const exportItems = [];
    for (const [, message] of this.messages) {
      exportItems.push({
        message: message.current,
        parentId: ((_a2 = message.prev) == null ? void 0 : _a2.current.id) ?? null
      });
    }
    return {
      headId: ((_b = this.head) == null ? void 0 : _b.current.id) ?? null,
      messages: exportItems
    };
  }
  import({ headId, messages }) {
    var _a2;
    for (const { message, parentId } of messages) {
      this.addOrUpdateMessage(parentId, message);
    }
    this.resetHead(headId ?? ((_a2 = messages.at(-1)) == null ? void 0 : _a2.message.id) ?? null);
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/adapters/attachment.js
var SimpleImageAttachmentAdapter = class {
  constructor() {
    __publicField(this, "accept", "image/*");
  }
  async add(state) {
    return {
      id: state.file.name,
      type: "image",
      name: state.file.name,
      contentType: state.file.type,
      file: state.file,
      status: { type: "requires-action", reason: "composer-send" }
    };
  }
  async send(attachment) {
    return {
      ...attachment,
      status: { type: "complete" },
      content: [
        {
          type: "image",
          image: await getFileDataURL(attachment.file)
        }
      ]
    };
  }
  async remove() {
  }
};
var getFileDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(file);
});
var SimpleTextAttachmentAdapter = class {
  constructor() {
    __publicField(this, "accept", "text/plain,text/html,text/markdown,text/csv,text/xml,text/json,text/css");
  }
  async add(state) {
    return {
      id: state.file.name,
      type: "document",
      name: state.file.name,
      contentType: state.file.type,
      file: state.file,
      status: { type: "requires-action", reason: "composer-send" }
    };
  }
  async send(attachment) {
    return {
      ...attachment,
      status: { type: "complete" },
      content: [
        {
          type: "text",
          text: `<attachment name=${attachment.name}>
${await getFileText(attachment.file)}
</attachment>`
        }
      ]
    };
  }
  async remove() {
  }
};
var getFileText = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
  reader.readAsText(file);
});
function fileMatchesAccept(file, acceptString) {
  if (acceptString === "*") {
    return true;
  }
  const allowedTypes = acceptString.split(",").map((type) => type.trim().toLowerCase());
  const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
  const fileMimeType = file.type.toLowerCase();
  for (const type of allowedTypes) {
    if (type.startsWith(".") && type === fileExtension) {
      return true;
    }
    if (type.includes("/") && type === fileMimeType) {
      return true;
    }
    if (type.endsWith("/*")) {
      const generalType = type.split("/")[0];
      if (fileMimeType.startsWith(`${generalType}/`)) {
        return true;
      }
    }
  }
  return false;
}
var CompositeAttachmentAdapter = class {
  constructor(adapters) {
    __publicField(this, "_adapters");
    __publicField(this, "accept");
    this._adapters = adapters;
    const wildcardIdx = adapters.findIndex((a) => a.accept === "*");
    if (wildcardIdx !== -1) {
      if (wildcardIdx !== adapters.length - 1)
        throw new Error("A wildcard adapter (handling all files) can only be specified as the last adapter.");
      this.accept = "*";
    } else {
      this.accept = adapters.map((a) => a.accept).join(",");
    }
  }
  add(state) {
    for (const adapter of this._adapters) {
      if (fileMatchesAccept(state.file, adapter.accept)) {
        return adapter.add(state);
      }
    }
    throw new Error("No matching adapter found for file");
  }
  async send(attachment) {
    const adapters = this._adapters.slice();
    for (const adapter of adapters) {
      if (fileMatchesAccept(attachment.file, adapter.accept)) {
        return adapter.send(attachment);
      }
    }
    throw new Error("No matching adapter found for attachment");
  }
  async remove(attachment) {
    const adapters = this._adapters.slice();
    for (const adapter of adapters) {
      if (fileMatchesAccept({
        name: attachment.name,
        type: attachment.contentType ?? ""
      }, adapter.accept)) {
        return adapter.remove(attachment);
      }
    }
    throw new Error("No matching adapter found for attachment");
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/utils/external-store-message.js
var symbolInnerMessage = Symbol("innerMessage");
var symbolInnerMessages = Symbol("innerMessages");
var getExternalStoreMessage = (input) => {
  const withInnerMessages = input;
  return withInnerMessages[symbolInnerMessage];
};
var EMPTY_ARRAY = [];
var bindExternalStoreMessage = (target, message) => {
  if (symbolInnerMessage in target)
    return;
  target[symbolInnerMessage] = message;
};
var getExternalStoreMessages = (input) => {
  const container = "messages" in input ? input.messages : input;
  const value = container[symbolInnerMessages] || container[symbolInnerMessage];
  if (!value)
    return EMPTY_ARRAY;
  if (Array.isArray(value)) {
    return value;
  }
  container[symbolInnerMessages] = [value];
  return container[symbolInnerMessages];
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/ReadonlyThreadProvider.js
var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
var import_react18 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/subscribable/subscribable.js
var SKIP_UPDATE = Symbol("skip-update");
function shallowEqual(objA, objB) {
  if (objA === void 0 && objB === void 0)
    return true;
  if (objA === void 0)
    return false;
  if (objB === void 0)
    return false;
  for (const key of Object.keys(objA)) {
    const valueA = objA[key];
    const valueB = objB[key];
    if (!Object.is(valueA, valueB))
      return false;
  }
  return true;
}
var BaseSubscribable = class {
  constructor() {
    __publicField(this, "_subscribers", /* @__PURE__ */ new Set());
  }
  subscribe(callback) {
    this._subscribers.add(callback);
    return () => this._subscribers.delete(callback);
  }
  waitForUpdate() {
    return new Promise((resolve) => {
      const unsubscribe = this.subscribe(() => {
        unsubscribe();
        resolve();
      });
    });
  }
  _notifySubscribers() {
    const errors = [];
    for (const callback of this._subscribers) {
      try {
        callback();
      } catch (error) {
        errors.push(error);
      }
    }
    if (errors.length > 0) {
      if (errors.length === 1) {
        throw errors[0];
      } else {
        for (const error of errors) {
          console.error(error);
        }
        throw new AggregateError(errors);
      }
    }
  }
};
var BaseSubject = class {
  constructor() {
    __publicField(this, "_subscriptions", /* @__PURE__ */ new Set());
    __publicField(this, "_connection");
  }
  get isConnected() {
    return !!this._connection;
  }
  notifySubscribers() {
    for (const callback of this._subscriptions)
      callback();
  }
  _updateConnection() {
    var _a2;
    if (this._subscriptions.size > 0) {
      if (this._connection)
        return;
      this._connection = this._connect();
    } else {
      (_a2 = this._connection) == null ? void 0 : _a2.call(this);
      this._connection = void 0;
    }
  }
  subscribe(callback) {
    this._subscriptions.add(callback);
    this._updateConnection();
    return () => {
      this._subscriptions.delete(callback);
      this._updateConnection();
    };
  }
};
var ShallowMemoizeSubject = class extends BaseSubject {
  constructor(binding) {
    super();
    __publicField(this, "binding");
    __publicField(this, "_previousState");
    __publicField(this, "getState", () => {
      if (!this.isConnected)
        this._syncState();
      return this._previousState;
    });
    this.binding = binding;
    const state = binding.getState();
    if (state === SKIP_UPDATE)
      throw new Error("Entry not available in the store");
    this._previousState = state;
  }
  get path() {
    return this.binding.path;
  }
  _syncState() {
    const state = this.binding.getState();
    if (state === SKIP_UPDATE)
      return false;
    if (shallowEqual(state, this._previousState))
      return false;
    this._previousState = state;
    return true;
  }
  _connect() {
    const callback = () => {
      if (this._syncState()) {
        this.notifySubscribers();
      }
    };
    return this.binding.subscribe(callback);
  }
};
var LazyMemoizeSubject = class extends BaseSubject {
  constructor(binding) {
    super();
    __publicField(this, "binding");
    __publicField(this, "_previousStateDirty", true);
    __publicField(this, "_previousState");
    __publicField(this, "getState", () => {
      if (!this.isConnected || this._previousStateDirty) {
        const newState = this.binding.getState();
        if (newState !== SKIP_UPDATE) {
          this._previousState = newState;
        }
        this._previousStateDirty = false;
      }
      if (this._previousState === void 0)
        throw new Error("Entry not available in the store");
      return this._previousState;
    });
    this.binding = binding;
  }
  get path() {
    return this.binding.path;
  }
  _connect() {
    const callback = () => {
      this._previousStateDirty = true;
      this.notifySubscribers();
    };
    return this.binding.subscribe(callback);
  }
};
var NestedSubscriptionSubject = class extends BaseSubject {
  constructor(binding) {
    super();
    __publicField(this, "binding");
    this.binding = binding;
  }
  get path() {
    return this.binding.path;
  }
  getState() {
    return this.binding.getState();
  }
  outerSubscribe(callback) {
    return this.binding.subscribe(callback);
  }
  _connect() {
    const callback = () => {
      this.notifySubscribers();
    };
    let lastState = this.binding.getState();
    let innerUnsubscribe = lastState == null ? void 0 : lastState.subscribe(callback);
    const onRuntimeUpdate = () => {
      const newState = this.binding.getState();
      if (newState === lastState)
        return;
      lastState = newState;
      innerUnsubscribe == null ? void 0 : innerUnsubscribe();
      innerUnsubscribe = newState == null ? void 0 : newState.subscribe(callback);
      callback();
    };
    const outerUnsubscribe = this.outerSubscribe(onRuntimeUpdate);
    return () => {
      outerUnsubscribe == null ? void 0 : outerUnsubscribe();
      innerUnsubscribe == null ? void 0 : innerUnsubscribe();
    };
  }
};
var EventSubscriptionSubject = class extends BaseSubject {
  constructor(config) {
    super();
    __publicField(this, "config");
    this.config = config;
  }
  getState() {
    return this.config.binding.getState();
  }
  outerSubscribe(callback) {
    return this.config.binding.subscribe(callback);
  }
  _connect() {
    const callback = () => {
      this.notifySubscribers();
    };
    let lastState = this.config.binding.getState();
    let innerUnsubscribe = lastState == null ? void 0 : lastState.unstable_on(this.config.event, callback);
    const onRuntimeUpdate = () => {
      const newState = this.config.binding.getState();
      if (newState === lastState)
        return;
      lastState = newState;
      innerUnsubscribe == null ? void 0 : innerUnsubscribe();
      innerUnsubscribe = newState == null ? void 0 : newState.unstable_on(this.config.event, callback);
    };
    const outerUnsubscribe = this.outerSubscribe(onRuntimeUpdate);
    return () => {
      outerUnsubscribe == null ? void 0 : outerUnsubscribe();
      innerUnsubscribe == null ? void 0 : innerUnsubscribe();
    };
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/readonly/ReadonlyThreadRuntimeCore.js
var READONLY_THREAD_ERROR = new Error("This is a readonly thread. You cannot perform mutations on readonly threads.");
var ReadonlyThreadRuntimeCore = class extends BaseSubscribable {
  constructor() {
    super(...arguments);
    __publicField(this, "_messages", []);
    __publicField(this, "getVoiceVolume", () => 0);
    __publicField(this, "subscribeVoiceVolume", () => () => {
    });
    __publicField(this, "composer", {
      attachments: [],
      attachmentAccept: "*",
      async addAttachment() {
        throw READONLY_THREAD_ERROR;
      },
      async removeAttachment() {
        throw READONLY_THREAD_ERROR;
      },
      isEditing: false,
      canCancel: false,
      isEmpty: true,
      text: "",
      setText() {
        throw READONLY_THREAD_ERROR;
      },
      role: "user",
      setRole() {
        throw READONLY_THREAD_ERROR;
      },
      runConfig: {},
      setRunConfig() {
        throw READONLY_THREAD_ERROR;
      },
      async reset() {
      },
      async clearAttachments() {
      },
      send() {
        throw READONLY_THREAD_ERROR;
      },
      cancel() {
      },
      dictation: void 0,
      startDictation() {
        throw READONLY_THREAD_ERROR;
      },
      stopDictation() {
      },
      quote: void 0,
      setQuote() {
        throw READONLY_THREAD_ERROR;
      },
      subscribe() {
        return () => {
        };
      },
      unstable_on() {
        return () => {
        };
      }
    });
    __publicField(this, "speech");
    __publicField(this, "voice");
    __publicField(this, "capabilities", {
      switchToBranch: false,
      switchBranchDuringRun: false,
      edit: false,
      reload: false,
      cancel: false,
      unstable_copy: false,
      speech: false,
      dictation: false,
      voice: false,
      attachments: false,
      feedback: false,
      queue: false
    });
    __publicField(this, "isDisabled", false);
    __publicField(this, "isLoading", false);
    __publicField(this, "state", null);
    __publicField(this, "suggestions", []);
    __publicField(this, "extras");
  }
  get messages() {
    return this._messages;
  }
  setMessages(messages) {
    if (this._messages === messages)
      return;
    this._messages = messages;
    this._notifySubscribers();
  }
  getMessageById(messageId) {
    var _a2;
    const idx = this._messages.findIndex((m) => m.id === messageId);
    if (idx === -1)
      return void 0;
    return {
      parentId: ((_a2 = this._messages[idx - 1]) == null ? void 0 : _a2.id) ?? null,
      message: this._messages[idx],
      index: idx
    };
  }
  getBranches(messageId) {
    const idx = this._messages.findIndex((m) => m.id === messageId);
    if (idx === -1)
      return [];
    return [messageId];
  }
  switchToBranch() {
    throw READONLY_THREAD_ERROR;
  }
  append() {
    throw READONLY_THREAD_ERROR;
  }
  startRun() {
    throw READONLY_THREAD_ERROR;
  }
  resumeRun() {
    throw READONLY_THREAD_ERROR;
  }
  cancelRun() {
  }
  addToolResult() {
    throw READONLY_THREAD_ERROR;
  }
  resumeToolCall() {
    throw READONLY_THREAD_ERROR;
  }
  speak() {
    throw READONLY_THREAD_ERROR;
  }
  stopSpeaking() {
  }
  connectVoice() {
    throw READONLY_THREAD_ERROR;
  }
  disconnectVoice() {
  }
  muteVoice() {
    throw READONLY_THREAD_ERROR;
  }
  unmuteVoice() {
    throw READONLY_THREAD_ERROR;
  }
  submitFeedback() {
    throw READONLY_THREAD_ERROR;
  }
  getModelContext() {
    return {};
  }
  exportExternalState() {
    throw READONLY_THREAD_ERROR;
  }
  importExternalState() {
    throw READONLY_THREAD_ERROR;
  }
  unstable_loadExternalState() {
    throw READONLY_THREAD_ERROR;
  }
  getEditComposer() {
    return void 0;
  }
  beginEdit() {
    throw READONLY_THREAD_ERROR;
  }
  import() {
    throw READONLY_THREAD_ERROR;
  }
  export() {
    return {
      messages: this._messages.map((message, idx) => {
        var _a2;
        return {
          message,
          parentId: ((_a2 = this._messages[idx - 1]) == null ? void 0 : _a2.id) ?? null
        };
      })
    };
  }
  reset() {
    throw READONLY_THREAD_ERROR;
  }
  unstable_on() {
    return () => {
    };
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/base/base-assistant-runtime-core.js
var BaseAssistantRuntimeCore = class {
  constructor() {
    __publicField(this, "_contextProvider", new CompositeContextProvider());
  }
  registerModelContextProvider(provider) {
    return this._contextProvider.registerModelContextProvider(provider);
  }
  getModelContextProvider() {
    return this._contextProvider;
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/utils/text.js
var getThreadMessageText = (message) => {
  const textParts = message.content.filter((part) => part.type === "text");
  return textParts.map((part) => part.text).join("\n\n");
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/base/base-composer-runtime-core.js
var isAttachmentComplete = (a) => a.status.type === "complete";
var BaseComposerRuntimeCore = class extends BaseSubscribable {
  constructor() {
    super(...arguments);
    __publicField(this, "isEditing", true);
    __publicField(this, "_attachments", []);
    __publicField(this, "_text", "");
    __publicField(this, "_role", "user");
    __publicField(this, "_runConfig", {});
    __publicField(this, "_quote");
    __publicField(this, "_dictation");
    __publicField(this, "_dictationSession");
    __publicField(this, "_dictationUnsubscribes", []);
    __publicField(this, "_dictationBaseText", "");
    __publicField(this, "_currentInterimText", "");
    __publicField(this, "_dictationSessionIdCounter", 0);
    __publicField(this, "_activeDictationSessionId");
    __publicField(this, "_isCleaningDictation", false);
    __publicField(this, "_eventSubscribers", /* @__PURE__ */ new Map());
  }
  get attachmentAccept() {
    var _a2;
    return ((_a2 = this.getAttachmentAdapter()) == null ? void 0 : _a2.accept) ?? "*";
  }
  get attachments() {
    return this._attachments;
  }
  setAttachments(value) {
    this._attachments = value;
    this._notifySubscribers();
  }
  get isEmpty() {
    return !this.text.trim() && !this.attachments.length;
  }
  get text() {
    return this._text;
  }
  get role() {
    return this._role;
  }
  get runConfig() {
    return this._runConfig;
  }
  get quote() {
    return this._quote;
  }
  setQuote(quote) {
    if (this._quote === quote)
      return;
    this._quote = quote;
    this._notifySubscribers();
  }
  setText(value) {
    if (this._text === value)
      return;
    this._text = value;
    if (this._dictation) {
      this._dictationBaseText = value;
      this._currentInterimText = "";
      const { status, inputDisabled } = this._dictation;
      this._dictation = inputDisabled ? { status, inputDisabled } : { status };
    }
    this._notifySubscribers();
  }
  setRole(role) {
    if (this._role === role)
      return;
    this._role = role;
    this._notifySubscribers();
  }
  setRunConfig(runConfig) {
    if (this._runConfig === runConfig)
      return;
    this._runConfig = runConfig;
    this._notifySubscribers();
  }
  _emptyTextAndAttachments() {
    this._attachments = [];
    this._text = "";
    this._notifySubscribers();
  }
  async _onClearAttachments() {
    const adapter = this.getAttachmentAdapter();
    if (adapter) {
      const pending = this._attachments.filter((a) => !isAttachmentComplete(a));
      await Promise.all(pending.map((a) => adapter.remove(a)));
    }
  }
  async reset() {
    if (this._attachments.length === 0 && this._text === "" && this._role === "user" && Object.keys(this._runConfig).length === 0 && this._quote === void 0) {
      return;
    }
    this._role = "user";
    this._runConfig = {};
    this._quote = void 0;
    const task = this._onClearAttachments();
    this._emptyTextAndAttachments();
    await task;
  }
  async clearAttachments() {
    const task = this._onClearAttachments();
    this.setAttachments([]);
    await task;
  }
  async send(options) {
    if (this.isEmpty)
      return;
    if (this._dictationSession) {
      this._dictationSession.cancel();
      this._cleanupDictation();
    }
    const adapter = this.getAttachmentAdapter();
    const attachments = this.attachments.length > 0 ? Promise.all(this.attachments.map(async (a) => {
      if (isAttachmentComplete(a))
        return a;
      if (!adapter)
        throw new Error("Attachments are not supported");
      const result = await adapter.send(a);
      return result;
    })) : [];
    const text = this.text;
    const quote = this._quote;
    this._quote = void 0;
    this._emptyTextAndAttachments();
    const message = {
      createdAt: /* @__PURE__ */ new Date(),
      role: this.role,
      content: text ? [{ type: "text", text }] : [],
      attachments: await attachments,
      runConfig: this.runConfig,
      metadata: { custom: { ...quote ? { quote } : {} } }
    };
    this.handleSend(message, options);
    this._notifyEventSubscribers("send");
  }
  cancel() {
    this.handleCancel();
  }
  async addAttachment(fileOrAttachment) {
    if (!(fileOrAttachment instanceof File)) {
      const a = {
        id: fileOrAttachment.id ?? generateId2(),
        type: fileOrAttachment.type ?? "document",
        name: fileOrAttachment.name,
        contentType: fileOrAttachment.contentType,
        content: fileOrAttachment.content,
        status: { type: "complete" }
      };
      this._attachments = [...this._attachments, a];
      this._notifyEventSubscribers("attachmentAdd");
      this._notifySubscribers();
      return;
    }
    const adapter = this.getAttachmentAdapter();
    if (!adapter)
      throw new Error("Attachments are not supported");
    if (!fileMatchesAccept({ name: fileOrAttachment.name, type: fileOrAttachment.type }, adapter.accept)) {
      throw new Error(`File type ${fileOrAttachment.type || "unknown"} is not accepted. Accepted types: ${adapter.accept}`);
    }
    const upsertAttachment = (a) => {
      const idx = this._attachments.findIndex((attachment) => attachment.id === a.id);
      if (idx !== -1)
        this._attachments = [
          ...this._attachments.slice(0, idx),
          a,
          ...this._attachments.slice(idx + 1)
        ];
      else {
        this._attachments = [...this._attachments, a];
      }
      this._notifySubscribers();
    };
    let lastAttachment;
    try {
      const promiseOrGenerator = adapter.add({ file: fileOrAttachment });
      if (Symbol.asyncIterator in promiseOrGenerator) {
        for await (const r of promiseOrGenerator) {
          lastAttachment = r;
          upsertAttachment(r);
        }
      } else {
        lastAttachment = await promiseOrGenerator;
        upsertAttachment(lastAttachment);
      }
    } catch (e) {
      if (lastAttachment) {
        upsertAttachment({
          ...lastAttachment,
          status: { type: "incomplete", reason: "error" }
        });
      }
      try {
        this._notifyEventSubscribers("attachmentAddError");
      } catch {
      }
      throw e;
    }
    const hasError = (lastAttachment == null ? void 0 : lastAttachment.status.type) === "incomplete" && lastAttachment.status.reason === "error";
    this._notifyEventSubscribers(hasError ? "attachmentAddError" : "attachmentAdd");
  }
  async removeAttachment(attachmentId) {
    const index = this._attachments.findIndex((a) => a.id === attachmentId);
    if (index === -1)
      throw new Error("Attachment not found");
    const attachment = this._attachments[index];
    if (!isAttachmentComplete(attachment)) {
      const adapter = this.getAttachmentAdapter();
      if (!adapter)
        throw new Error("Attachments are not supported");
      await adapter.remove(attachment);
    }
    this._attachments = this._attachments.filter((a) => a.id !== attachmentId);
    this._notifySubscribers();
  }
  get dictation() {
    return this._dictation;
  }
  _isActiveSession(sessionId, session) {
    return this._activeDictationSessionId === sessionId && this._dictationSession === session;
  }
  startDictation() {
    const adapter = this.getDictationAdapter();
    if (!adapter) {
      throw new Error("Dictation adapter not configured");
    }
    if (this._dictationSession) {
      for (const unsub of this._dictationUnsubscribes) {
        unsub();
      }
      this._dictationUnsubscribes = [];
      const oldSession = this._dictationSession;
      oldSession.stop().catch(() => {
      });
      this._dictationSession = void 0;
    }
    const inputDisabled = adapter.disableInputDuringDictation ?? false;
    this._dictationBaseText = this._text;
    this._currentInterimText = "";
    const session = adapter.listen();
    this._dictationSession = session;
    const sessionId = ++this._dictationSessionIdCounter;
    this._activeDictationSessionId = sessionId;
    this._dictation = { status: session.status, inputDisabled };
    this._notifySubscribers();
    const unsubSpeech = session.onSpeech((result) => {
      if (!this._isActiveSession(sessionId, session))
        return;
      const isFinal = result.isFinal !== false;
      const needsSeparator = this._dictationBaseText && !this._dictationBaseText.endsWith(" ") && result.transcript;
      const separator = needsSeparator ? " " : "";
      if (isFinal) {
        this._dictationBaseText = this._dictationBaseText + separator + result.transcript;
        this._currentInterimText = "";
        this._text = this._dictationBaseText;
        if (this._dictation) {
          const { transcript: _, ...rest } = this._dictation;
          this._dictation = rest;
        }
        this._notifySubscribers();
      } else {
        this._currentInterimText = separator + result.transcript;
        this._text = this._dictationBaseText + this._currentInterimText;
        if (this._dictation) {
          this._dictation = {
            ...this._dictation,
            transcript: result.transcript
          };
        }
        this._notifySubscribers();
      }
    });
    this._dictationUnsubscribes.push(unsubSpeech);
    const unsubStart = session.onSpeechStart(() => {
      var _a2;
      if (!this._isActiveSession(sessionId, session))
        return;
      this._dictation = {
        status: { type: "running" },
        inputDisabled,
        ...((_a2 = this._dictation) == null ? void 0 : _a2.transcript) && {
          transcript: this._dictation.transcript
        }
      };
      this._notifySubscribers();
    });
    this._dictationUnsubscribes.push(unsubStart);
    const unsubEnd = session.onSpeechEnd(() => {
      this._cleanupDictation({ sessionId });
    });
    this._dictationUnsubscribes.push(unsubEnd);
    const statusInterval = setInterval(() => {
      if (!this._isActiveSession(sessionId, session))
        return;
      if (session.status.type === "ended") {
        this._cleanupDictation({ sessionId });
      }
    }, 100);
    this._dictationUnsubscribes.push(() => clearInterval(statusInterval));
  }
  stopDictation() {
    if (!this._dictationSession)
      return;
    const session = this._dictationSession;
    const sessionId = this._activeDictationSessionId;
    session.stop().finally(() => {
      this._cleanupDictation({ sessionId });
    });
  }
  _cleanupDictation(options) {
    const isStaleSession = (options == null ? void 0 : options.sessionId) !== void 0 && options.sessionId !== this._activeDictationSessionId;
    if (isStaleSession || this._isCleaningDictation)
      return;
    this._isCleaningDictation = true;
    try {
      for (const unsub of this._dictationUnsubscribes) {
        unsub();
      }
      this._dictationUnsubscribes = [];
      this._dictationSession = void 0;
      this._activeDictationSessionId = void 0;
      this._dictation = void 0;
      this._dictationBaseText = "";
      this._currentInterimText = "";
      this._notifySubscribers();
    } finally {
      this._isCleaningDictation = false;
    }
  }
  _notifyEventSubscribers(event) {
    const subscribers = this._eventSubscribers.get(event);
    if (!subscribers)
      return;
    for (const callback of subscribers)
      callback();
  }
  unstable_on(event, callback) {
    const subscribers = this._eventSubscribers.get(event);
    if (!subscribers) {
      this._eventSubscribers.set(event, /* @__PURE__ */ new Set([callback]));
    } else {
      subscribers.add(callback);
    }
    return () => {
      const subscribers2 = this._eventSubscribers.get(event);
      if (!subscribers2)
        return;
      subscribers2.delete(callback);
    };
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/base/default-thread-composer-runtime-core.js
var DefaultThreadComposerRuntimeCore = class extends BaseComposerRuntimeCore {
  constructor(runtime) {
    super();
    __publicField(this, "runtime");
    __publicField(this, "_canCancel", false);
    this.runtime = runtime;
    this.connect();
  }
  get canCancel() {
    return this._canCancel;
  }
  getAttachmentAdapter() {
    var _a2;
    return (_a2 = this.runtime.adapters) == null ? void 0 : _a2.attachments;
  }
  getDictationAdapter() {
    var _a2;
    return (_a2 = this.runtime.adapters) == null ? void 0 : _a2.dictation;
  }
  connect() {
    return this.runtime.subscribe(() => {
      if (this.canCancel !== this.runtime.capabilities.cancel) {
        this._canCancel = this.runtime.capabilities.cancel;
        this._notifySubscribers();
      }
    });
  }
  async handleSend(message, options) {
    var _a2;
    this.runtime.append({
      ...message,
      parentId: ((_a2 = this.runtime.messages.at(-1)) == null ? void 0 : _a2.id) ?? null,
      sourceId: null,
      startRun: options == null ? void 0 : options.startRun
    });
  }
  async handleCancel() {
    this.runtime.cancelRun();
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/base/default-edit-composer-runtime-core.js
var DefaultEditComposerRuntimeCore = class extends BaseComposerRuntimeCore {
  constructor(runtime, endEditCallback, { parentId, message }) {
    super();
    __publicField(this, "runtime");
    __publicField(this, "endEditCallback");
    __publicField(this, "_nonTextParts");
    __publicField(this, "_previousText");
    __publicField(this, "_parentId");
    __publicField(this, "_sourceId");
    this.runtime = runtime;
    this.endEditCallback = endEditCallback;
    this._parentId = parentId;
    this._sourceId = message.id;
    this._previousText = getThreadMessageText(message);
    this.setText(this._previousText);
    this.setRole(message.role);
    this.setAttachments(message.attachments ?? []);
    this._nonTextParts = message.content.filter((part) => part.type !== "text");
    this.setRunConfig({ ...runtime.composer.runConfig });
  }
  get canCancel() {
    return true;
  }
  getAttachmentAdapter() {
    var _a2;
    return (_a2 = this.runtime.adapters) == null ? void 0 : _a2.attachments;
  }
  getDictationAdapter() {
    var _a2;
    return (_a2 = this.runtime.adapters) == null ? void 0 : _a2.dictation;
  }
  get parentId() {
    return this._parentId;
  }
  get sourceId() {
    return this._sourceId;
  }
  async handleSend(message, options) {
    const text = getThreadMessageText(message);
    if (text !== this._previousText || (options == null ? void 0 : options.startRun)) {
      this.runtime.append({
        ...message,
        content: [...message.content, ...this._nonTextParts],
        parentId: this._parentId,
        sourceId: this._sourceId,
        startRun: options == null ? void 0 : options.startRun
      });
    }
    this.handleCancel();
  }
  handleCancel() {
    this.endEditCallback();
    this._notifySubscribers();
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/base/base-thread-runtime-core.js
var BaseThreadRuntimeCore = class {
  constructor(_contextProvider) {
    __publicField(this, "_contextProvider");
    __publicField(this, "_subscriptions", /* @__PURE__ */ new Set());
    __publicField(this, "_isInitialized", false);
    __publicField(this, "repository", new MessageRepository());
    __publicField(this, "_voiceMessages", []);
    __publicField(this, "_voiceGeneration", 0);
    __publicField(this, "_cachedMergedMessages", null);
    __publicField(this, "_cachedVoiceGeneration", -1);
    __publicField(this, "_cachedMergedBase", null);
    __publicField(this, "composer", new DefaultThreadComposerRuntimeCore(this));
    __publicField(this, "_editComposers", /* @__PURE__ */ new Map());
    __publicField(this, "_stopSpeaking");
    __publicField(this, "speech");
    __publicField(this, "_voiceSession");
    __publicField(this, "_voiceUnsubs", []);
    __publicField(this, "voice");
    __publicField(this, "_voiceVolume", 0);
    __publicField(this, "_voiceVolumeSubscribers", /* @__PURE__ */ new Set());
    __publicField(this, "getVoiceVolume", () => this._voiceVolume);
    __publicField(this, "subscribeVoiceVolume", (callback) => {
      this._voiceVolumeSubscribers.add(callback);
      return () => this._voiceVolumeSubscribers.delete(callback);
    });
    __publicField(this, "_currentAssistantMsg", null);
    __publicField(this, "_eventSubscribers", /* @__PURE__ */ new Map());
    this._contextProvider = _contextProvider;
  }
  _markVoiceMessagesDirty() {
    this._voiceGeneration++;
    this._cachedMergedMessages = null;
  }
  _getBaseMessages() {
    return this.repository.getMessages();
  }
  get messages() {
    if (this._voiceMessages.length === 0) {
      return this._getBaseMessages();
    }
    const base = this._getBaseMessages();
    if (this._cachedVoiceGeneration !== this._voiceGeneration || this._cachedMergedBase !== base) {
      this._cachedMergedMessages = [...base, ...this._voiceMessages];
      this._cachedVoiceGeneration = this._voiceGeneration;
      this._cachedMergedBase = base;
    }
    return this._cachedMergedMessages;
  }
  get state() {
    let mostRecentAssistantMessage;
    for (const message of this.messages) {
      if (message.role === "assistant") {
        mostRecentAssistantMessage = message;
      }
    }
    return (mostRecentAssistantMessage == null ? void 0 : mostRecentAssistantMessage.metadata.unstable_state) ?? null;
  }
  getModelContext() {
    return this._contextProvider.getModelContext();
  }
  getEditComposer(messageId) {
    return this._editComposers.get(messageId);
  }
  beginEdit(messageId) {
    if (this._editComposers.has(messageId))
      throw new Error("Edit already in progress");
    this._editComposers.set(messageId, new DefaultEditComposerRuntimeCore(this, () => this._editComposers.delete(messageId), this.repository.getMessage(messageId)));
    this._notifySubscribers();
  }
  getMessageById(messageId) {
    var _a2;
    try {
      return this.repository.getMessage(messageId);
    } catch {
      const baseMessages = this.repository.getMessages();
      const voiceIdx = this._voiceMessages.findIndex((m) => m.id === messageId);
      if (voiceIdx !== -1) {
        const parentId = voiceIdx > 0 ? this._voiceMessages[voiceIdx - 1].id : ((_a2 = baseMessages.at(-1)) == null ? void 0 : _a2.id) ?? null;
        return {
          parentId,
          message: this._voiceMessages[voiceIdx],
          index: baseMessages.length + voiceIdx
        };
      }
      return void 0;
    }
  }
  getBranches(messageId) {
    if (this._voiceMessages.some((m) => m.id === messageId)) {
      return [];
    }
    return this.repository.getBranches(messageId);
  }
  switchToBranch(branchId) {
    this.repository.switchToBranch(branchId);
    this._notifySubscribers();
  }
  _notifySubscribers() {
    for (const callback of this._subscriptions)
      callback();
  }
  _notifyEventSubscribers(event) {
    const subscribers = this._eventSubscribers.get(event);
    if (!subscribers)
      return;
    for (const callback of subscribers)
      callback();
  }
  subscribe(callback) {
    this._subscriptions.add(callback);
    return () => this._subscriptions.delete(callback);
  }
  submitFeedback({ messageId, type }) {
    var _a2;
    const adapter = (_a2 = this.adapters) == null ? void 0 : _a2.feedback;
    if (!adapter)
      throw new Error("Feedback adapter not configured");
    const { message, parentId } = this.repository.getMessage(messageId);
    adapter.submit({ message, type });
    if (message.role === "assistant") {
      const updatedMessage = {
        ...message,
        metadata: {
          ...message.metadata,
          submittedFeedback: { type }
        }
      };
      this.repository.addOrUpdateMessage(parentId, updatedMessage);
    }
    this._notifySubscribers();
  }
  speak(messageId) {
    var _a2, _b;
    const adapter = (_a2 = this.adapters) == null ? void 0 : _a2.speech;
    if (!adapter)
      throw new Error("Speech adapter not configured");
    const { message } = this.repository.getMessage(messageId);
    (_b = this._stopSpeaking) == null ? void 0 : _b.call(this);
    const utterance = adapter.speak(getThreadMessageText(message));
    const unsub = utterance.subscribe(() => {
      if (utterance.status.type === "ended") {
        this._stopSpeaking = void 0;
        this.speech = void 0;
      } else {
        this.speech = { messageId, status: utterance.status };
      }
      this._notifySubscribers();
    });
    this.speech = { messageId, status: utterance.status };
    this._notifySubscribers();
    this._stopSpeaking = () => {
      utterance.cancel();
      unsub();
      this.speech = void 0;
      this._stopSpeaking = void 0;
    };
  }
  stopSpeaking() {
    if (!this._stopSpeaking)
      throw new Error("No message is being spoken");
    this._stopSpeaking();
    this._notifySubscribers();
  }
  connectVoice() {
    var _a2;
    const adapter = (_a2 = this.adapters) == null ? void 0 : _a2.voice;
    if (!adapter)
      throw new Error("Voice adapter not configured");
    this.disconnectVoice();
    const session = adapter.connect({});
    this._voiceSession = session;
    const unsubs = [];
    let currentMode = "listening";
    this.voice = {
      status: session.status,
      isMuted: session.isMuted,
      mode: currentMode
    };
    this._voiceVolume = 0;
    this._notifySubscribers();
    unsubs.push(session.onStatusChange((status) => {
      if (status.type === "ended") {
        this._finishVoiceAssistantMessage();
        this._voiceSession = void 0;
        this.voice = void 0;
      } else {
        this.voice = {
          status,
          isMuted: session.isMuted,
          mode: currentMode
        };
      }
      this._notifySubscribers();
    }));
    unsubs.push(session.onModeChange((mode) => {
      currentMode = mode;
      if (this.voice) {
        this.voice = { ...this.voice, mode };
        this._notifySubscribers();
      }
    }));
    unsubs.push(session.onVolumeChange((volume) => {
      this._voiceVolume = volume;
      for (const cb of this._voiceVolumeSubscribers)
        cb();
    }));
    unsubs.push(session.onTranscript((transcript) => {
      this._handleVoiceTranscript(transcript);
    }));
    this._voiceUnsubs = unsubs;
  }
  _handleVoiceTranscript(transcript) {
    this.ensureInitialized();
    if (transcript.role === "user") {
      this._finishVoiceAssistantMessage();
      this._currentAssistantMsg = null;
      if (transcript.isFinal) {
        this._voiceMessages.push({
          id: generateId2(),
          role: "user",
          content: [{ type: "text", text: transcript.text }],
          metadata: { custom: {} },
          createdAt: /* @__PURE__ */ new Date(),
          status: { type: "complete", reason: "unknown" },
          attachments: []
        });
        this._markVoiceMessagesDirty();
        this._notifySubscribers();
      }
    } else {
      if (!this._currentAssistantMsg) {
        this._currentAssistantMsg = {
          id: generateId2(),
          role: "assistant",
          content: [{ type: "text", text: transcript.text }],
          metadata: {
            unstable_state: this.state,
            unstable_annotations: [],
            unstable_data: [],
            steps: [],
            custom: {}
          },
          status: { type: "running" },
          createdAt: /* @__PURE__ */ new Date()
        };
        this._voiceMessages.push(this._currentAssistantMsg);
      } else {
        const idx = this._voiceMessages.indexOf(this._currentAssistantMsg);
        if (idx === -1)
          return;
        const updated = {
          ...this._currentAssistantMsg,
          content: [{ type: "text", text: transcript.text }],
          ...transcript.isFinal ? { status: { type: "complete", reason: "stop" } } : {}
        };
        this._voiceMessages[idx] = updated;
        this._currentAssistantMsg = updated;
      }
      if (transcript.isFinal) {
        this._currentAssistantMsg = null;
      }
      this._markVoiceMessagesDirty();
      this._notifySubscribers();
    }
  }
  _finishVoiceAssistantMessage() {
    const last = this._voiceMessages.at(-1);
    if ((last == null ? void 0 : last.role) === "assistant" && last.status.type === "running") {
      const idx = this._voiceMessages.length - 1;
      this._voiceMessages[idx] = {
        ...last,
        status: { type: "complete", reason: "stop" }
      };
      this._markVoiceMessagesDirty();
      this._notifySubscribers();
    }
  }
  disconnectVoice() {
    var _a2;
    this._finishVoiceAssistantMessage();
    this._currentAssistantMsg = null;
    for (const unsub of this._voiceUnsubs)
      unsub();
    this._voiceUnsubs = [];
    (_a2 = this._voiceSession) == null ? void 0 : _a2.disconnect();
    this._voiceSession = void 0;
    this.voice = void 0;
    this._voiceVolume = 0;
    for (const cb of this._voiceVolumeSubscribers)
      cb();
    this._voiceMessages = [];
    this._markVoiceMessagesDirty();
    this._notifySubscribers();
  }
  muteVoice() {
    if (!this._voiceSession)
      throw new Error("No active voice session");
    this._voiceSession.mute();
    this.voice = {
      ...this.voice,
      isMuted: true
    };
    this._notifySubscribers();
  }
  unmuteVoice() {
    if (!this._voiceSession)
      throw new Error("No active voice session");
    this._voiceSession.unmute();
    this.voice = {
      ...this.voice,
      isMuted: false
    };
    this._notifySubscribers();
  }
  ensureInitialized() {
    if (!this._isInitialized) {
      this._isInitialized = true;
      this._notifyEventSubscribers("initialize");
    }
  }
  export() {
    return this.repository.export();
  }
  import(data) {
    this.ensureInitialized();
    this.repository.clear();
    this.repository.import(data);
    this._notifySubscribers();
  }
  reset(initialMessages) {
    this.import(ExportedMessageRepository.fromArray(initialMessages ?? []));
  }
  unstable_on(event, callback) {
    var _a2, _b;
    if (event === "modelContextUpdate") {
      return ((_b = (_a2 = this._contextProvider).subscribe) == null ? void 0 : _b.call(_a2, callback)) ?? (() => {
      });
    }
    const subscribers = this._eventSubscribers.get(event);
    if (!subscribers) {
      this._eventSubscribers.set(event, /* @__PURE__ */ new Set([callback]));
    } else {
      subscribers.add(callback);
    }
    return () => {
      const subscribers2 = this._eventSubscribers.get(event);
      subscribers2.delete(callback);
    };
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/api/thread-list-item-runtime.js
var ThreadListItemRuntimeImpl = class {
  constructor(_core, _threadListBinding) {
    __publicField(this, "_core");
    __publicField(this, "_threadListBinding");
    this._core = _core;
    this._threadListBinding = _threadListBinding;
    this.__internal_bindMethods();
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.switchTo = this.switchTo.bind(this);
    this.rename = this.rename.bind(this);
    this.archive = this.archive.bind(this);
    this.unarchive = this.unarchive.bind(this);
    this.delete = this.delete.bind(this);
    this.initialize = this.initialize.bind(this);
    this.generateTitle = this.generateTitle.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unstable_on = this.unstable_on.bind(this);
    this.getState = this.getState.bind(this);
    this.detach = this.detach.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  switchTo() {
    const state = this._core.getState();
    return this._threadListBinding.switchToThread(state.id);
  }
  rename(newTitle) {
    const state = this._core.getState();
    return this._threadListBinding.rename(state.id, newTitle);
  }
  archive() {
    const state = this._core.getState();
    return this._threadListBinding.archive(state.id);
  }
  unarchive() {
    const state = this._core.getState();
    return this._threadListBinding.unarchive(state.id);
  }
  delete() {
    const state = this._core.getState();
    return this._threadListBinding.delete(state.id);
  }
  initialize() {
    const state = this._core.getState();
    return this._threadListBinding.initialize(state.id);
  }
  generateTitle() {
    const state = this._core.getState();
    return this._threadListBinding.generateTitle(state.id);
  }
  unstable_on(event, callback) {
    let prevIsMain = this._core.getState().isMain;
    let prevThreadId = this._core.getState().id;
    return this.subscribe(() => {
      const currentState = this._core.getState();
      const newIsMain = currentState.isMain;
      const newThreadId = currentState.id;
      if (prevIsMain === newIsMain && prevThreadId === newThreadId)
        return;
      prevIsMain = newIsMain;
      prevThreadId = newThreadId;
      if (event === "switchedTo" && !newIsMain)
        return;
      if (event === "switchedAway" && newIsMain)
        return;
      callback();
    });
  }
  subscribe(callback) {
    return this._core.subscribe(callback);
  }
  detach() {
    const state = this._core.getState();
    this._threadListBinding.detach(state.id);
  }
  __internal_getRuntime() {
    return this;
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/api/attachment-runtime.js
var AttachmentRuntimeImpl = class {
  constructor(_core) {
    __publicField(this, "_core");
    this._core = _core;
    this.__internal_bindMethods();
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.getState = this.getState.bind(this);
    this.remove = this.remove.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  subscribe(callback) {
    return this._core.subscribe(callback);
  }
};
var ComposerAttachmentRuntime = class extends AttachmentRuntimeImpl {
  constructor(core, _composerApi) {
    super(core);
    __publicField(this, "_composerApi");
    this._composerApi = _composerApi;
  }
  remove() {
    const core = this._composerApi.getState();
    if (!core)
      throw new Error("Composer is not available");
    return core.removeAttachment(this.getState().id);
  }
};
var ThreadComposerAttachmentRuntimeImpl = class extends ComposerAttachmentRuntime {
  get source() {
    return "thread-composer";
  }
};
var EditComposerAttachmentRuntimeImpl = class extends ComposerAttachmentRuntime {
  get source() {
    return "edit-composer";
  }
};
var MessageAttachmentRuntimeImpl = class extends AttachmentRuntimeImpl {
  get source() {
    return "message";
  }
  constructor(core) {
    super(core);
  }
  remove() {
    throw new Error("Message attachments cannot be removed");
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/api/composer-runtime.js
var EMPTY_ARRAY2 = Object.freeze([]);
var EMPTY_OBJECT2 = Object.freeze({});
var getThreadComposerState = (runtime) => {
  return Object.freeze({
    type: "thread",
    isEditing: (runtime == null ? void 0 : runtime.isEditing) ?? false,
    canCancel: (runtime == null ? void 0 : runtime.canCancel) ?? false,
    isEmpty: (runtime == null ? void 0 : runtime.isEmpty) ?? true,
    attachments: (runtime == null ? void 0 : runtime.attachments) ?? EMPTY_ARRAY2,
    text: (runtime == null ? void 0 : runtime.text) ?? "",
    role: (runtime == null ? void 0 : runtime.role) ?? "user",
    runConfig: (runtime == null ? void 0 : runtime.runConfig) ?? EMPTY_OBJECT2,
    attachmentAccept: (runtime == null ? void 0 : runtime.attachmentAccept) ?? "",
    dictation: runtime == null ? void 0 : runtime.dictation,
    quote: runtime == null ? void 0 : runtime.quote,
    value: (runtime == null ? void 0 : runtime.text) ?? ""
  });
};
var getEditComposerState = (runtime) => {
  return Object.freeze({
    type: "edit",
    isEditing: (runtime == null ? void 0 : runtime.isEditing) ?? false,
    canCancel: (runtime == null ? void 0 : runtime.canCancel) ?? false,
    isEmpty: (runtime == null ? void 0 : runtime.isEmpty) ?? true,
    text: (runtime == null ? void 0 : runtime.text) ?? "",
    role: (runtime == null ? void 0 : runtime.role) ?? "user",
    attachments: (runtime == null ? void 0 : runtime.attachments) ?? EMPTY_ARRAY2,
    runConfig: (runtime == null ? void 0 : runtime.runConfig) ?? EMPTY_OBJECT2,
    attachmentAccept: (runtime == null ? void 0 : runtime.attachmentAccept) ?? "",
    dictation: runtime == null ? void 0 : runtime.dictation,
    quote: runtime == null ? void 0 : runtime.quote,
    parentId: (runtime == null ? void 0 : runtime.parentId) ?? null,
    sourceId: (runtime == null ? void 0 : runtime.sourceId) ?? null,
    value: (runtime == null ? void 0 : runtime.text) ?? ""
  });
};
var ComposerRuntimeImpl = class {
  constructor(_core) {
    __publicField(this, "_core");
    __publicField(this, "_eventSubscriptionSubjects", /* @__PURE__ */ new Map());
    this._core = _core;
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.setText = this.setText.bind(this);
    this.setRunConfig = this.setRunConfig.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.addAttachment = this.addAttachment.bind(this);
    this.reset = this.reset.bind(this);
    this.clearAttachments = this.clearAttachments.bind(this);
    this.send = this.send.bind(this);
    this.cancel = this.cancel.bind(this);
    this.setRole = this.setRole.bind(this);
    this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this);
    this.startDictation = this.startDictation.bind(this);
    this.stopDictation = this.stopDictation.bind(this);
    this.setQuote = this.setQuote.bind(this);
    this.unstable_on = this.unstable_on.bind(this);
  }
  setText(text) {
    const core = this._core.getState();
    if (!core)
      throw new Error("Composer is not available");
    core.setText(text);
  }
  setRunConfig(runConfig) {
    const core = this._core.getState();
    if (!core)
      throw new Error("Composer is not available");
    core.setRunConfig(runConfig);
  }
  addAttachment(fileOrAttachment) {
    const core = this._core.getState();
    if (!core)
      throw new Error("Composer is not available");
    return core.addAttachment(fileOrAttachment);
  }
  reset() {
    const core = this._core.getState();
    if (!core)
      throw new Error("Composer is not available");
    return core.reset();
  }
  clearAttachments() {
    const core = this._core.getState();
    if (!core)
      throw new Error("Composer is not available");
    return core.clearAttachments();
  }
  send(options) {
    const core = this._core.getState();
    if (!core)
      throw new Error("Composer is not available");
    core.send(options);
  }
  cancel() {
    const core = this._core.getState();
    if (!core)
      throw new Error("Composer is not available");
    core.cancel();
  }
  setRole(role) {
    const core = this._core.getState();
    if (!core)
      throw new Error("Composer is not available");
    core.setRole(role);
  }
  startDictation() {
    const core = this._core.getState();
    if (!core)
      throw new Error("Composer is not available");
    core.startDictation();
  }
  stopDictation() {
    const core = this._core.getState();
    if (!core)
      throw new Error("Composer is not available");
    core.stopDictation();
  }
  setQuote(quote) {
    const core = this._core.getState();
    if (!core)
      throw new Error("Composer is not available");
    core.setQuote(quote);
  }
  subscribe(callback) {
    return this._core.subscribe(callback);
  }
  unstable_on(event, callback) {
    let subject = this._eventSubscriptionSubjects.get(event);
    if (!subject) {
      subject = new EventSubscriptionSubject({
        event,
        binding: this._core
      });
      this._eventSubscriptionSubjects.set(event, subject);
    }
    return subject.subscribe(callback);
  }
};
var ThreadComposerRuntimeImpl = class extends ComposerRuntimeImpl {
  constructor(core) {
    const stateBinding = new LazyMemoizeSubject({
      path: core.path,
      getState: () => getThreadComposerState(core.getState()),
      subscribe: (callback) => core.subscribe(callback)
    });
    super({
      path: core.path,
      getState: () => core.getState(),
      subscribe: (callback) => stateBinding.subscribe(callback)
    });
    __publicField(this, "_getState");
    this._getState = stateBinding.getState.bind(stateBinding);
    this.__internal_bindMethods();
  }
  get path() {
    return this._core.path;
  }
  get type() {
    return "thread";
  }
  getState() {
    return this._getState();
  }
  getAttachmentByIndex(idx) {
    return new ThreadComposerAttachmentRuntimeImpl(new ShallowMemoizeSubject({
      path: {
        ...this.path,
        attachmentSource: "thread-composer",
        attachmentSelector: { type: "index", index: idx },
        ref: `${this.path.ref}.attachments[${idx}]`
      },
      getState: () => {
        const attachments = this.getState().attachments;
        const attachment = attachments[idx];
        if (!attachment)
          return SKIP_UPDATE;
        return {
          ...attachment,
          source: "thread-composer"
        };
      },
      subscribe: (callback) => this._core.subscribe(callback)
    }), this._core);
  }
};
var EditComposerRuntimeImpl = class extends ComposerRuntimeImpl {
  constructor(core, _beginEdit) {
    const stateBinding = new LazyMemoizeSubject({
      path: core.path,
      getState: () => getEditComposerState(core.getState()),
      subscribe: (callback) => core.subscribe(callback)
    });
    super({
      path: core.path,
      getState: () => core.getState(),
      subscribe: (callback) => stateBinding.subscribe(callback)
    });
    __publicField(this, "_beginEdit");
    __publicField(this, "_getState");
    this._beginEdit = _beginEdit;
    this._getState = stateBinding.getState.bind(stateBinding);
    this.__internal_bindMethods();
  }
  get path() {
    return this._core.path;
  }
  get type() {
    return "edit";
  }
  __internal_bindMethods() {
    super.__internal_bindMethods();
    this.beginEdit = this.beginEdit.bind(this);
  }
  getState() {
    return this._getState();
  }
  beginEdit() {
    this._beginEdit();
  }
  getAttachmentByIndex(idx) {
    return new EditComposerAttachmentRuntimeImpl(new ShallowMemoizeSubject({
      path: {
        ...this.path,
        attachmentSource: "edit-composer",
        attachmentSelector: { type: "index", index: idx },
        ref: `${this.path.ref}.attachments[${idx}]`
      },
      getState: () => {
        const attachments = this.getState().attachments;
        const attachment = attachments[idx];
        if (!attachment)
          return SKIP_UPDATE;
        return {
          ...attachment,
          source: "edit-composer"
        };
      },
      subscribe: (callback) => this._core.subscribe(callback)
    }), this._core);
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/api/message-part-runtime.js
var MessagePartRuntimeImpl = class {
  constructor(contentBinding, messageApi, threadApi) {
    __publicField(this, "contentBinding");
    __publicField(this, "messageApi");
    __publicField(this, "threadApi");
    this.contentBinding = contentBinding;
    this.messageApi = messageApi;
    this.threadApi = threadApi;
    this.__internal_bindMethods();
  }
  get path() {
    return this.contentBinding.path;
  }
  __internal_bindMethods() {
    this.addToolResult = this.addToolResult.bind(this);
    this.resumeToolCall = this.resumeToolCall.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }
  getState() {
    return this.contentBinding.getState();
  }
  addToolResult(result) {
    const state = this.contentBinding.getState();
    if (!state)
      throw new Error("Message part is not available");
    if (state.type !== "tool-call")
      throw new Error("Tried to add tool result to non-tool message part");
    if (!this.messageApi)
      throw new Error("Message API is not available. This is likely a bug in assistant-ui.");
    if (!this.threadApi)
      throw new Error("Thread API is not available");
    const message = this.messageApi.getState();
    if (!message)
      throw new Error("Message is not available");
    const toolName = state.toolName;
    const toolCallId = state.toolCallId;
    const response = ToolResponse.toResponse(result);
    this.threadApi.getState().addToolResult({
      messageId: message.id,
      toolName,
      toolCallId,
      result: response.result,
      artifact: response.artifact,
      isError: response.isError
    });
  }
  resumeToolCall(payload) {
    const state = this.contentBinding.getState();
    if (!state)
      throw new Error("Message part is not available");
    if (state.type !== "tool-call")
      throw new Error("Tried to resume tool call on non-tool message part");
    if (!this.threadApi)
      throw new Error("Thread API is not available");
    const toolCallId = state.toolCallId;
    this.threadApi.getState().resumeToolCall({
      toolCallId,
      payload
    });
  }
  subscribe(callback) {
    return this.contentBinding.subscribe(callback);
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/api/message-runtime.js
var COMPLETE_STATUS2 = Object.freeze({
  type: "complete"
});
var toMessagePartStatus = (message, partIndex, part) => {
  if (message.role !== "assistant")
    return COMPLETE_STATUS2;
  if (part.type === "tool-call") {
    if (!part.result) {
      return message.status;
    } else {
      return COMPLETE_STATUS2;
    }
  }
  const isLastPart = partIndex === Math.max(0, message.content.length - 1);
  if (message.status.type === "requires-action")
    return COMPLETE_STATUS2;
  return isLastPart ? message.status : COMPLETE_STATUS2;
};
var getMessagePartState = (message, partIndex) => {
  const part = message.content[partIndex];
  if (!part) {
    return SKIP_UPDATE;
  }
  const status = toMessagePartStatus(message, partIndex, part);
  return Object.freeze({
    ...part,
    ...{ [symbolInnerMessage]: part[symbolInnerMessage] },
    status
  });
};
var MessageRuntimeImpl = class {
  constructor(_core, _threadBinding) {
    __publicField(this, "_core");
    __publicField(this, "_threadBinding");
    __publicField(this, "composer");
    __publicField(this, "_getEditComposerRuntimeCore", () => {
      return this._threadBinding.getState().getEditComposer(this._core.getState().id);
    });
    this._core = _core;
    this._threadBinding = _threadBinding;
    this.composer = new EditComposerRuntimeImpl(new NestedSubscriptionSubject({
      path: {
        ...this.path,
        ref: `${this.path.ref}${this.path.ref}.composer`,
        composerSource: "edit"
      },
      getState: this._getEditComposerRuntimeCore,
      subscribe: (callback) => this._threadBinding.subscribe(callback)
    }), () => this._threadBinding.getState().beginEdit(this._core.getState().id));
    this.__internal_bindMethods();
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.reload = this.reload.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.getMessagePartByIndex = this.getMessagePartByIndex.bind(this);
    this.getMessagePartByToolCallId = this.getMessagePartByToolCallId.bind(this);
    this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this);
    this.unstable_getCopyText = this.unstable_getCopyText.bind(this);
    this.speak = this.speak.bind(this);
    this.stopSpeaking = this.stopSpeaking.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
    this.switchToBranch = this.switchToBranch.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  reload(reloadConfig = {}) {
    const editComposerRuntimeCore = this._getEditComposerRuntimeCore();
    const composerRuntimeCore = editComposerRuntimeCore ?? this._threadBinding.getState().composer;
    const composer = editComposerRuntimeCore ?? composerRuntimeCore;
    const { runConfig = composer.runConfig } = reloadConfig;
    const state = this._core.getState();
    if (state.role !== "assistant")
      throw new Error("Can only reload assistant messages");
    this._threadBinding.getState().startRun({
      parentId: state.parentId,
      sourceId: state.id,
      runConfig
    });
  }
  speak() {
    const state = this._core.getState();
    return this._threadBinding.getState().speak(state.id);
  }
  stopSpeaking() {
    var _a2;
    const state = this._core.getState();
    const thread = this._threadBinding.getState();
    if (((_a2 = thread.speech) == null ? void 0 : _a2.messageId) === state.id) {
      this._threadBinding.getState().stopSpeaking();
    } else {
      throw new Error("Message is not being spoken");
    }
  }
  submitFeedback({ type }) {
    const state = this._core.getState();
    this._threadBinding.getState().submitFeedback({
      messageId: state.id,
      type
    });
  }
  switchToBranch({ position, branchId }) {
    const state = this._core.getState();
    if (branchId && position) {
      throw new Error("May not specify both branchId and position");
    } else if (!branchId && !position) {
      throw new Error("Must specify either branchId or position");
    }
    const thread = this._threadBinding.getState();
    const branches = thread.getBranches(state.id);
    let targetBranch = branchId;
    if (position === "previous") {
      targetBranch = branches[state.branchNumber - 2];
    } else if (position === "next") {
      targetBranch = branches[state.branchNumber];
    }
    if (!targetBranch)
      throw new Error("Branch not found");
    this._threadBinding.getState().switchToBranch(targetBranch);
  }
  unstable_getCopyText() {
    return getThreadMessageText(this.getState());
  }
  subscribe(callback) {
    return this._core.subscribe(callback);
  }
  getMessagePartByIndex(idx) {
    if (idx < 0)
      throw new Error("Message part index must be >= 0");
    return new MessagePartRuntimeImpl(new ShallowMemoizeSubject({
      path: {
        ...this.path,
        ref: `${this.path.ref}${this.path.ref}.content[${idx}]`,
        messagePartSelector: { type: "index", index: idx }
      },
      getState: () => {
        return getMessagePartState(this.getState(), idx);
      },
      subscribe: (callback) => this._core.subscribe(callback)
    }), this._core, this._threadBinding);
  }
  getMessagePartByToolCallId(toolCallId) {
    return new MessagePartRuntimeImpl(new ShallowMemoizeSubject({
      path: {
        ...this.path,
        ref: this.path.ref + `${this.path.ref}.content[toolCallId=${JSON.stringify(toolCallId)}]`,
        messagePartSelector: { type: "toolCallId", toolCallId }
      },
      getState: () => {
        const state = this._core.getState();
        const idx = state.content.findIndex((part) => part.type === "tool-call" && part.toolCallId === toolCallId);
        if (idx === -1)
          return SKIP_UPDATE;
        return getMessagePartState(state, idx);
      },
      subscribe: (callback) => this._core.subscribe(callback)
    }), this._core, this._threadBinding);
  }
  getAttachmentByIndex(idx) {
    return new MessageAttachmentRuntimeImpl(new ShallowMemoizeSubject({
      path: {
        ...this.path,
        ref: `${this.path.ref}${this.path.ref}.attachments[${idx}]`,
        attachmentSource: "message",
        attachmentSelector: { type: "index", index: idx }
      },
      getState: () => {
        const attachments = this.getState().attachments;
        const attachment = attachments == null ? void 0 : attachments[idx];
        if (!attachment)
          return SKIP_UPDATE;
        return {
          ...attachment,
          source: "message"
        };
      },
      subscribe: (callback) => this._core.subscribe(callback)
    }));
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/api/thread-runtime.js
var toResumeRunConfig = (message) => {
  return {
    parentId: message.parentId ?? null,
    sourceId: message.sourceId ?? null,
    runConfig: message.runConfig ?? {},
    ...message.stream ? { stream: message.stream } : {}
  };
};
var toStartRunConfig = (message) => {
  return {
    parentId: message.parentId ?? null,
    sourceId: message.sourceId ?? null,
    runConfig: message.runConfig ?? {}
  };
};
var toAppendMessage = (messages, message) => {
  var _a2, _b;
  if (typeof message === "string") {
    return {
      createdAt: /* @__PURE__ */ new Date(),
      parentId: ((_a2 = messages.at(-1)) == null ? void 0 : _a2.id) ?? null,
      sourceId: null,
      runConfig: {},
      role: "user",
      content: [{ type: "text", text: message }],
      attachments: [],
      metadata: { custom: {} }
    };
  }
  return {
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
};
var getThreadState = (runtime, threadListItemState) => {
  const lastMessage = runtime.messages.at(-1);
  return Object.freeze({
    threadId: threadListItemState.id,
    metadata: threadListItemState,
    capabilities: runtime.capabilities,
    isDisabled: runtime.isDisabled,
    isLoading: runtime.isLoading,
    isRunning: (lastMessage == null ? void 0 : lastMessage.role) !== "assistant" ? false : lastMessage.status.type === "running",
    messages: runtime.messages,
    state: runtime.state,
    suggestions: runtime.suggestions,
    extras: runtime.extras,
    speech: runtime.speech,
    voice: runtime.voice
  });
};
var ThreadRuntimeImpl = class {
  constructor(threadBinding, threadListItemBinding) {
    __publicField(this, "_threadBinding");
    __publicField(this, "composer");
    __publicField(this, "_eventSubscriptionSubjects", /* @__PURE__ */ new Map());
    const stateBinding = new ShallowMemoizeSubject({
      path: threadBinding.path,
      getState: () => getThreadState(threadBinding.getState(), threadListItemBinding.getState()),
      subscribe: (callback) => {
        const sub1 = threadBinding.subscribe(callback);
        const sub2 = threadListItemBinding.subscribe(callback);
        return () => {
          sub1();
          sub2();
        };
      }
    });
    this._threadBinding = {
      path: threadBinding.path,
      getState: () => threadBinding.getState(),
      getStateState: () => stateBinding.getState(),
      outerSubscribe: (callback) => threadBinding.outerSubscribe(callback),
      subscribe: (callback) => threadBinding.subscribe(callback)
    };
    this.composer = new ThreadComposerRuntimeImpl(new NestedSubscriptionSubject({
      path: {
        ...this.path,
        ref: `${this.path.ref}.composer`,
        composerSource: "thread"
      },
      getState: () => this._threadBinding.getState().composer,
      subscribe: (callback) => this._threadBinding.subscribe(callback)
    }));
    this.__internal_bindMethods();
  }
  get path() {
    return this._threadBinding.path;
  }
  get __internal_threadBinding() {
    return this._threadBinding;
  }
  __internal_bindMethods() {
    this.append = this.append.bind(this);
    this.resumeRun = this.resumeRun.bind(this);
    this.unstable_resumeRun = this.unstable_resumeRun.bind(this);
    this.unstable_loadExternalState = this.unstable_loadExternalState.bind(this);
    this.importExternalState = this.importExternalState.bind(this);
    this.exportExternalState = this.exportExternalState.bind(this);
    this.startRun = this.startRun.bind(this);
    this.cancelRun = this.cancelRun.bind(this);
    this.stopSpeaking = this.stopSpeaking.bind(this);
    this.connectVoice = this.connectVoice.bind(this);
    this.disconnectVoice = this.disconnectVoice.bind(this);
    this.muteVoice = this.muteVoice.bind(this);
    this.unmuteVoice = this.unmuteVoice.bind(this);
    this.getVoiceVolume = this.getVoiceVolume.bind(this);
    this.subscribeVoiceVolume = this.subscribeVoiceVolume.bind(this);
    this.export = this.export.bind(this);
    this.import = this.import.bind(this);
    this.reset = this.reset.bind(this);
    this.getMessageByIndex = this.getMessageByIndex.bind(this);
    this.getMessageById = this.getMessageById.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unstable_on = this.unstable_on.bind(this);
    this.getModelContext = this.getModelContext.bind(this);
    this.getModelConfig = this.getModelConfig.bind(this);
    this.getState = this.getState.bind(this);
  }
  getState() {
    return this._threadBinding.getStateState();
  }
  append(message) {
    this._threadBinding.getState().append(toAppendMessage(this._threadBinding.getState().messages, message));
  }
  subscribe(callback) {
    return this._threadBinding.subscribe(callback);
  }
  getModelContext() {
    return this._threadBinding.getState().getModelContext();
  }
  getModelConfig() {
    return this.getModelContext();
  }
  startRun(configOrParentId) {
    const config = configOrParentId === null || typeof configOrParentId === "string" ? { parentId: configOrParentId } : configOrParentId;
    return this._threadBinding.getState().startRun(toStartRunConfig(config));
  }
  resumeRun(config) {
    return this._threadBinding.getState().resumeRun(toResumeRunConfig(config));
  }
  /** @deprecated Use `resumeRun` instead. */
  unstable_resumeRun(config) {
    return this.resumeRun(config);
  }
  exportExternalState() {
    return this._threadBinding.getState().exportExternalState();
  }
  importExternalState(state) {
    this._threadBinding.getState().importExternalState(state);
  }
  unstable_loadExternalState(state) {
    this._threadBinding.getState().unstable_loadExternalState(state);
  }
  cancelRun() {
    this._threadBinding.getState().cancelRun();
  }
  stopSpeaking() {
    return this._threadBinding.getState().stopSpeaking();
  }
  connectVoice() {
    this._threadBinding.getState().connectVoice();
  }
  disconnectVoice() {
    this._threadBinding.getState().disconnectVoice();
  }
  getVoiceVolume() {
    return this._threadBinding.getState().getVoiceVolume();
  }
  subscribeVoiceVolume(callback) {
    return this._threadBinding.getState().subscribeVoiceVolume(callback);
  }
  muteVoice() {
    this._threadBinding.getState().muteVoice();
  }
  unmuteVoice() {
    this._threadBinding.getState().unmuteVoice();
  }
  export() {
    return this._threadBinding.getState().export();
  }
  import(data) {
    this._threadBinding.getState().import(data);
  }
  reset(initialMessages) {
    this._threadBinding.getState().reset(initialMessages);
  }
  getMessageByIndex(idx) {
    if (idx < 0)
      throw new Error("Message index must be >= 0");
    return this._getMessageRuntime({
      ...this.path,
      ref: `${this.path.ref}.messages[${idx}]`,
      messageSelector: { type: "index", index: idx }
    }, () => {
      var _a2;
      const messages = this._threadBinding.getState().messages;
      const message = messages[idx];
      if (!message)
        return void 0;
      return {
        message,
        parentId: ((_a2 = messages[idx - 1]) == null ? void 0 : _a2.id) ?? null,
        index: idx
      };
    });
  }
  getMessageById(messageId) {
    return this._getMessageRuntime({
      ...this.path,
      ref: `${this.path.ref}.messages[messageId=${JSON.stringify(messageId)}]`,
      messageSelector: { type: "messageId", messageId }
    }, () => this._threadBinding.getState().getMessageById(messageId));
  }
  _getMessageRuntime(path, callback) {
    return new MessageRuntimeImpl(new ShallowMemoizeSubject({
      path,
      getState: () => {
        var _a2;
        const { message, parentId, index } = callback() ?? {};
        const { messages, speech: speechState } = this._threadBinding.getState();
        if (!message || parentId === void 0 || index === void 0)
          return SKIP_UPDATE;
        const thread = this._threadBinding.getState();
        const branches = thread.getBranches(message.id);
        const submittedFeedback = message.metadata.submittedFeedback;
        return {
          ...message,
          ...{ [symbolInnerMessage]: message[symbolInnerMessage] },
          index,
          isLast: ((_a2 = messages.at(-1)) == null ? void 0 : _a2.id) === message.id,
          parentId,
          branchNumber: branches.indexOf(message.id) + 1,
          branchCount: branches.length,
          speech: (speechState == null ? void 0 : speechState.messageId) === message.id ? speechState : void 0,
          submittedFeedback
        };
      },
      subscribe: (callback2) => this._threadBinding.subscribe(callback2)
    }), this._threadBinding);
  }
  unstable_on(event, callback) {
    let subject = this._eventSubscriptionSubjects.get(event);
    if (!subject) {
      subject = new EventSubscriptionSubject({
        event,
        binding: this._threadBinding
      });
      this._eventSubscriptionSubjects.set(event, subject);
    }
    return subject.subscribe(callback);
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/api/thread-list-runtime.js
var getThreadListState = (threadList) => {
  return {
    mainThreadId: threadList.mainThreadId,
    newThreadId: threadList.newThreadId,
    threadIds: threadList.threadIds,
    archivedThreadIds: threadList.archivedThreadIds,
    isLoading: threadList.isLoading,
    threadItems: threadList.threadItems
  };
};
var getThreadListItemState = (threadList, threadId) => {
  if (threadId === void 0)
    return SKIP_UPDATE;
  const threadData = threadList.getItemById(threadId);
  if (!threadData)
    return SKIP_UPDATE;
  return {
    id: threadData.id,
    remoteId: threadData.remoteId,
    externalId: threadData.externalId,
    title: threadData.title,
    status: threadData.status,
    isMain: threadData.id === threadList.mainThreadId
  };
};
var ThreadListRuntimeImpl = class {
  constructor(_core, _runtimeFactory = ThreadRuntimeImpl) {
    __publicField(this, "_core");
    __publicField(this, "_runtimeFactory");
    __publicField(this, "_getState");
    __publicField(this, "_mainThreadListItemRuntime");
    __publicField(this, "main");
    this._core = _core;
    this._runtimeFactory = _runtimeFactory;
    const stateBinding = new LazyMemoizeSubject({
      path: {},
      getState: () => getThreadListState(_core),
      subscribe: (callback) => _core.subscribe(callback)
    });
    this._getState = stateBinding.getState.bind(stateBinding);
    this._mainThreadListItemRuntime = new ThreadListItemRuntimeImpl(new ShallowMemoizeSubject({
      path: {
        ref: `threadItems[main]`,
        threadSelector: { type: "main" }
      },
      getState: () => {
        return getThreadListItemState(this._core, this._core.mainThreadId);
      },
      subscribe: (callback) => this._core.subscribe(callback)
    }), this._core);
    this.main = new _runtimeFactory(new NestedSubscriptionSubject({
      path: {
        ref: "threads.main",
        threadSelector: { type: "main" }
      },
      getState: () => _core.getMainThreadRuntimeCore(),
      subscribe: (callback) => _core.subscribe(callback)
    }), this._mainThreadListItemRuntime);
    this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.switchToThread = this.switchToThread.bind(this);
    this.switchToNewThread = this.switchToNewThread.bind(this);
    this.getLoadThreadsPromise = this.getLoadThreadsPromise.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.getById = this.getById.bind(this);
    this.getItemById = this.getItemById.bind(this);
    this.getItemByIndex = this.getItemByIndex.bind(this);
    this.getArchivedItemByIndex = this.getArchivedItemByIndex.bind(this);
  }
  switchToThread(threadId) {
    return this._core.switchToThread(threadId);
  }
  switchToNewThread() {
    return this._core.switchToNewThread();
  }
  getLoadThreadsPromise() {
    return this._core.getLoadThreadsPromise();
  }
  getState() {
    return this._getState();
  }
  subscribe(callback) {
    return this._core.subscribe(callback);
  }
  get mainItem() {
    return this._mainThreadListItemRuntime;
  }
  getById(threadId) {
    return new this._runtimeFactory(new NestedSubscriptionSubject({
      path: {
        ref: `threads[threadId=${JSON.stringify(threadId)}]`,
        threadSelector: { type: "threadId", threadId }
      },
      getState: () => this._core.getThreadRuntimeCore(threadId),
      subscribe: (callback) => this._core.subscribe(callback)
    }), this.mainItem);
  }
  getItemByIndex(idx) {
    return new ThreadListItemRuntimeImpl(new ShallowMemoizeSubject({
      path: {
        ref: `threadItems[${idx}]`,
        threadSelector: { type: "index", index: idx }
      },
      getState: () => {
        return getThreadListItemState(this._core, this._core.threadIds[idx]);
      },
      subscribe: (callback) => this._core.subscribe(callback)
    }), this._core);
  }
  getArchivedItemByIndex(idx) {
    return new ThreadListItemRuntimeImpl(new ShallowMemoizeSubject({
      path: {
        ref: `archivedThreadItems[${idx}]`,
        threadSelector: { type: "archiveIndex", index: idx }
      },
      getState: () => {
        return getThreadListItemState(this._core, this._core.archivedThreadIds[idx]);
      },
      subscribe: (callback) => this._core.subscribe(callback)
    }), this._core);
  }
  getItemById(threadId) {
    return new ThreadListItemRuntimeImpl(new ShallowMemoizeSubject({
      path: {
        ref: `threadItems[threadId=${threadId}]`,
        threadSelector: { type: "threadId", threadId }
      },
      getState: () => {
        return getThreadListItemState(this._core, threadId);
      },
      subscribe: (callback) => this._core.subscribe(callback)
    }), this._core);
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtime/api/assistant-runtime.js
var AssistantRuntimeImpl = class {
  constructor(_core) {
    __publicField(this, "_core");
    __publicField(this, "threads");
    __publicField(this, "_thread");
    this._core = _core;
    this.threads = new ThreadListRuntimeImpl(_core.threads);
    this._thread = this.threads.main;
    this.__internal_bindMethods();
  }
  get threadList() {
    return this.threads;
  }
  __internal_bindMethods() {
    this.switchToNewThread = this.switchToNewThread.bind(this);
    this.switchToThread = this.switchToThread.bind(this);
    this.registerModelContextProvider = this.registerModelContextProvider.bind(this);
    this.registerModelConfigProvider = this.registerModelConfigProvider.bind(this);
    this.reset = this.reset.bind(this);
  }
  get thread() {
    return this._thread;
  }
  switchToNewThread() {
    return this._core.threads.switchToNewThread();
  }
  switchToThread(threadId) {
    return this._core.threads.switchToThread(threadId);
  }
  registerModelContextProvider(provider) {
    return this._core.registerModelContextProvider(provider);
  }
  registerModelConfigProvider(provider) {
    return this.registerModelContextProvider(provider);
  }
  reset({ initialMessages } = {}) {
    return this._core.threads.getMainThreadRuntimeCore().import(ExportedMessageRepository.fromArray(initialMessages ?? []));
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/ReadonlyThreadProvider.js
var READONLY_THREAD_PATH = Object.freeze({
  ref: "readonly-thread",
  threadSelector: { type: "main" }
});
var READONLY_THREAD_LIST_ITEM = Object.freeze({
  id: "readonly",
  remoteId: void 0,
  externalId: void 0,
  isMain: true,
  status: "regular",
  title: void 0
});
var READONLY_THREAD_LIST_ITEM_BINDING = Object.freeze({
  path: READONLY_THREAD_PATH,
  getState: () => READONLY_THREAD_LIST_ITEM,
  subscribe: () => () => {
  }
});
var ReadonlyThreadProvider = ({ messages, children }) => {
  const [core] = (0, import_react18.useState)(() => {
    const c = new ReadonlyThreadRuntimeCore();
    c.setMessages(messages);
    return c;
  });
  (0, import_react18.useEffect)(() => {
    core.setMessages(messages);
  }, [core, messages]);
  const threadRuntime = (0, import_react18.useMemo)(() => {
    const threadBinding = {
      path: READONLY_THREAD_PATH,
      getState: () => core,
      subscribe: (callback) => core.subscribe(callback),
      outerSubscribe: (callback) => core.subscribe(callback)
    };
    return new ThreadRuntimeImpl(threadBinding, READONLY_THREAD_LIST_ITEM_BINDING);
  }, [core]);
  const aui = useAui({
    thread: ThreadClient({ runtime: threadRuntime }),
    composer: Derived({
      source: "thread",
      query: {},
      get: (aui2) => aui2.thread().composer()
    })
  });
  return (0, import_jsx_runtime10.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/RuntimeAdapterProvider.js
var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);
var import_react19 = __toESM(require_react(), 1);
var RuntimeAdaptersContext = (0, import_react19.createContext)(null);
var RuntimeAdapterProvider = ({ adapters, children }) => {
  const context2 = (0, import_react19.useContext)(RuntimeAdaptersContext);
  return (0, import_jsx_runtime11.jsx)(RuntimeAdaptersContext.Provider, { value: {
    ...context2,
    ...adapters
  }, children });
};
var useRuntimeAdapters = () => {
  return (0, import_react19.useContext)(RuntimeAdaptersContext);
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/useExternalStoreRuntime.js
var import_react20 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/local/should-continue.js
var shouldContinue = (result, humanToolNames) => {
  var _a2, _b;
  if (humanToolNames === void 0) {
    return ((_a2 = result.status) == null ? void 0 : _a2.type) === "requires-action" && result.status.reason === "tool-calls" && result.content.every((c) => c.type !== "tool-call" || !!c.result);
  }
  return ((_b = result.status) == null ? void 0 : _b.type) === "requires-action" && result.status.reason === "tool-calls" && result.content.every((c) => c.type !== "tool-call" || !!c.result || !humanToolNames.includes(c.toolName));
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/local/local-thread-runtime-core.js
var AbortError = class extends Error {
  constructor(detach, message) {
    super(message);
    __publicField(this, "name", "AbortError");
    __publicField(this, "detach");
    this.detach = detach;
  }
};
var LocalThreadRuntimeCore = class extends BaseThreadRuntimeCore {
  constructor(contextProvider, options) {
    super(contextProvider);
    __publicField(this, "capabilities", {
      switchToBranch: true,
      switchBranchDuringRun: true,
      edit: true,
      reload: true,
      cancel: true,
      unstable_copy: true,
      speech: false,
      dictation: false,
      voice: false,
      attachments: false,
      feedback: false,
      queue: false
    });
    __publicField(this, "abortController", null);
    __publicField(this, "isDisabled", false);
    __publicField(this, "_isLoading", false);
    __publicField(this, "_suggestions", []);
    __publicField(this, "_suggestionsController", null);
    __publicField(this, "_options");
    __publicField(this, "_lastRunConfig", {});
    __publicField(this, "_getThreadId");
    __publicField(this, "_getInitializePromise");
    __publicField(this, "_loadPromise");
    this.__internal_setOptions(options);
  }
  get isLoading() {
    return this._isLoading;
  }
  get suggestions() {
    return this._suggestions;
  }
  get adapters() {
    return this._options.adapters;
  }
  __internal_setGetThreadId(getThreadId) {
    this._getThreadId = getThreadId;
  }
  __internal_setGetInitializePromise(getPromise) {
    this._getInitializePromise = getPromise;
  }
  get extras() {
    return void 0;
  }
  __internal_setOptions(options) {
    var _a2, _b, _c, _d, _e;
    if (this._options === options)
      return;
    this._options = options;
    let hasUpdates = false;
    const canSpeak = ((_a2 = options.adapters) == null ? void 0 : _a2.speech) !== void 0;
    if (this.capabilities.speech !== canSpeak) {
      this.capabilities.speech = canSpeak;
      hasUpdates = true;
    }
    const canDictate = ((_b = options.adapters) == null ? void 0 : _b.dictation) !== void 0;
    if (this.capabilities.dictation !== canDictate) {
      this.capabilities.dictation = canDictate;
      hasUpdates = true;
    }
    const canVoice = ((_c = options.adapters) == null ? void 0 : _c.voice) !== void 0;
    if (this.capabilities.voice !== canVoice) {
      this.capabilities.voice = canVoice;
      hasUpdates = true;
    }
    const canAttach = ((_d = options.adapters) == null ? void 0 : _d.attachments) !== void 0;
    if (this.capabilities.attachments !== canAttach) {
      this.capabilities.attachments = canAttach;
      hasUpdates = true;
    }
    const canFeedback = ((_e = options.adapters) == null ? void 0 : _e.feedback) !== void 0;
    if (this.capabilities.feedback !== canFeedback) {
      this.capabilities.feedback = canFeedback;
      hasUpdates = true;
    }
    if (hasUpdates)
      this._notifySubscribers();
  }
  __internal_load() {
    var _a2;
    if (this._loadPromise)
      return this._loadPromise;
    const promise = ((_a2 = this.adapters.history) == null ? void 0 : _a2.load()) ?? Promise.resolve(null);
    this._isLoading = true;
    this._notifySubscribers();
    this._loadPromise = promise.then((repo) => {
      var _a3, _b;
      if (!repo)
        return;
      this.repository.import(repo);
      if (repo.messages.length > 0) {
        this.ensureInitialized();
      }
      this._notifySubscribers();
      const resume = (_b = (_a3 = this.adapters.history) == null ? void 0 : _a3.resume) == null ? void 0 : _b.bind(this.adapters.history);
      if (repo.unstable_resume && resume) {
        this.startRun({
          parentId: this.repository.headId,
          sourceId: this.repository.headId,
          runConfig: this._lastRunConfig
        }, resume).catch(() => {
        });
      }
    }).finally(() => {
      this._isLoading = false;
      this._notifySubscribers();
    });
    return this._loadPromise;
  }
  async append(message) {
    var _a2, _b;
    this.ensureInitialized();
    const initPromise = (_a2 = this._getInitializePromise) == null ? void 0 : _a2.call(this);
    if (initPromise) {
      await initPromise;
    }
    const newMessage = fromThreadMessageLike(message, generateId2(), {
      type: "complete",
      reason: "unknown"
    });
    this.repository.addOrUpdateMessage(message.parentId, newMessage);
    (_b = this._options.adapters.history) == null ? void 0 : _b.append({
      parentId: message.parentId,
      message: newMessage,
      ...message.runConfig !== void 0 && { runConfig: message.runConfig }
    });
    const startRun = message.startRun ?? message.role === "user";
    if (startRun) {
      await this.startRun({
        parentId: newMessage.id,
        sourceId: message.sourceId,
        runConfig: message.runConfig ?? {}
      });
    } else {
      this.repository.resetHead(newMessage.id);
      this._notifySubscribers();
    }
  }
  resumeRun({ stream, ...startConfig }) {
    if (!stream)
      throw new Error("You must pass a stream parameter to resume runs.");
    return this.startRun(startConfig, stream);
  }
  exportExternalState() {
    throw new Error("Runtime does not support exporting external states.");
  }
  importExternalState() {
    throw new Error("Runtime does not support importing external states.");
  }
  unstable_loadExternalState() {
    throw new Error("Runtime does not support importing external states.");
  }
  async startRun({ parentId, runConfig }, runCallback) {
    var _a2, _b, _c;
    this.ensureInitialized();
    const id = generateId2();
    let message = {
      id,
      role: "assistant",
      status: { type: "running" },
      content: [],
      metadata: {
        unstable_state: this.state,
        unstable_annotations: [],
        unstable_data: [],
        steps: [],
        custom: {}
      },
      createdAt: /* @__PURE__ */ new Date()
    };
    this._notifyEventSubscribers("runStart");
    try {
      this._suggestions = [];
      (_a2 = this._suggestionsController) == null ? void 0 : _a2.abort();
      this._suggestionsController = null;
      this._notifySubscribers();
      do {
        message = await this.performRoundtrip(parentId, message, runConfig, runCallback);
        runCallback = void 0;
      } while (shouldContinue(message, this._options.unstable_humanToolNames));
    } finally {
      this._notifyEventSubscribers("runEnd");
    }
    this._suggestionsController = new AbortController();
    const signal = this._suggestionsController.signal;
    if (this.adapters.suggestion && ((_b = message.status) == null ? void 0 : _b.type) !== "requires-action") {
      const promiseOrGenerator = (_c = this.adapters.suggestion) == null ? void 0 : _c.generate({
        messages: this.messages
      });
      if (Symbol.asyncIterator in promiseOrGenerator) {
        for await (const r of promiseOrGenerator) {
          if (signal.aborted)
            break;
          this._suggestions = r;
          this._notifySubscribers();
        }
      } else {
        const result = await promiseOrGenerator;
        if (signal.aborted)
          return;
        this._suggestions = result;
        this._notifySubscribers();
      }
    }
  }
  async performRoundtrip(parentId, message, runConfig, runCallback) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    const messages = parentId ? this.repository.getMessages(parentId) : [];
    (_a2 = this.abortController) == null ? void 0 : _a2.abort();
    this.abortController = new AbortController();
    const initialContent = message.content;
    const initialAnnotations = (_b = message.metadata) == null ? void 0 : _b.unstable_annotations;
    const initialData = (_c = message.metadata) == null ? void 0 : _c.unstable_data;
    const initialSteps = (_d = message.metadata) == null ? void 0 : _d.steps;
    const initialCustom = (_e = message.metadata) == null ? void 0 : _e.custom;
    const updateMessage = (m) => {
      var _a3, _b2, _c2, _d2, _e2;
      const newSteps = (_a3 = m.metadata) == null ? void 0 : _a3.steps;
      const steps2 = newSteps ? [...initialSteps ?? [], ...newSteps] : void 0;
      const newAnnotations = (_b2 = m.metadata) == null ? void 0 : _b2.unstable_annotations;
      const newData = (_c2 = m.metadata) == null ? void 0 : _c2.unstable_data;
      const annotations = newAnnotations ? [...initialAnnotations ?? [], ...newAnnotations] : void 0;
      const data = newData ? [...initialData ?? [], ...newData] : void 0;
      message = {
        ...message,
        ...m.content ? { content: [...initialContent, ...m.content ?? []] } : void 0,
        status: m.status ?? message.status,
        ...m.metadata ? {
          metadata: {
            ...message.metadata,
            ...m.metadata.unstable_state ? { unstable_state: m.metadata.unstable_state } : void 0,
            ...annotations ? { unstable_annotations: annotations } : void 0,
            ...data ? { unstable_data: data } : void 0,
            ...steps2 ? { steps: steps2 } : void 0,
            ...((_d2 = m.metadata) == null ? void 0 : _d2.timing) ? { timing: m.metadata.timing } : void 0,
            ...((_e2 = m.metadata) == null ? void 0 : _e2.custom) ? {
              custom: {
                ...initialCustom ?? {},
                ...m.metadata.custom
              }
            } : void 0
          }
        } : void 0
      };
      this.repository.addOrUpdateMessage(parentId, message);
      this._notifySubscribers();
    };
    const maxSteps = this._options.maxSteps ?? 2;
    const steps = ((_g = (_f = message.metadata) == null ? void 0 : _f.steps) == null ? void 0 : _g.length) ?? 0;
    if (steps >= maxSteps) {
      updateMessage({
        status: {
          type: "incomplete",
          reason: "tool-calls"
        }
      });
      return message;
    } else {
      updateMessage({
        status: {
          type: "running"
        }
      });
      this.repository.resetHead(message.id);
      this._notifySubscribers();
    }
    try {
      this._lastRunConfig = runConfig ?? {};
      const context2 = this.getModelContext();
      runCallback = runCallback ?? this.adapters.chatModel.run.bind(this.adapters.chatModel);
      const abortSignal = this.abortController.signal;
      const threadId = (_h = this._getThreadId) == null ? void 0 : _h.call(this);
      const promiseOrGenerator = runCallback({
        messages,
        runConfig: this._lastRunConfig,
        abortSignal,
        context: context2,
        config: context2,
        unstable_assistantMessageId: message.id,
        unstable_threadId: threadId,
        unstable_parentId: parentId,
        unstable_getMessage() {
          return message;
        }
      });
      if (Symbol.asyncIterator in promiseOrGenerator) {
        for await (const r of promiseOrGenerator) {
          if (abortSignal.aborted) {
            updateMessage({
              status: { type: "incomplete", reason: "cancelled" }
            });
            break;
          }
          updateMessage(r);
        }
      } else {
        updateMessage(await promiseOrGenerator);
      }
      if (message.status.type === "running") {
        updateMessage({
          status: { type: "complete", reason: "unknown" }
        });
      }
    } catch (e) {
      if (e instanceof AbortError) {
        updateMessage({
          status: { type: "incomplete", reason: "cancelled" }
        });
      } else if (e instanceof Error && e.name === "AbortError") {
        updateMessage({
          status: { type: "incomplete", reason: "cancelled" }
        });
      } else {
        updateMessage({
          status: {
            type: "incomplete",
            reason: "error",
            error: e instanceof Error ? e.message : `[${typeof e}] ${new String(e).toString()}`
          }
        });
        throw e;
      }
    } finally {
      this.abortController = null;
      if (message.status.type === "complete" || message.status.type === "incomplete") {
        await ((_i = this._options.adapters.history) == null ? void 0 : _i.append({
          parentId,
          message,
          runConfig: this._lastRunConfig
        }));
      }
    }
    return message;
  }
  detach() {
    var _a2;
    const error = new AbortError(true);
    (_a2 = this.abortController) == null ? void 0 : _a2.abort(error);
    this.abortController = null;
  }
  cancelRun() {
    var _a2;
    const error = new AbortError(false);
    (_a2 = this.abortController) == null ? void 0 : _a2.abort(error);
    this.abortController = null;
  }
  addToolResult({ messageId, toolCallId, result, isError, artifact }) {
    const messageData = this.repository.getMessage(messageId);
    const { parentId } = messageData;
    let { message } = messageData;
    if (message.role !== "assistant")
      throw new Error("Tried to add tool result to non-assistant message");
    let added = false;
    let found = false;
    const newContent = message.content.map((c) => {
      if (c.type !== "tool-call")
        return c;
      if (c.toolCallId !== toolCallId)
        return c;
      found = true;
      if (!c.result)
        added = true;
      return {
        ...c,
        result,
        artifact,
        isError
      };
    });
    if (!found)
      throw new Error("Tried to add tool result to non-existing tool call");
    message = {
      ...message,
      content: newContent
    };
    this.repository.addOrUpdateMessage(parentId, message);
    if (added && shouldContinue(message, this._options.unstable_humanToolNames)) {
      this.performRoundtrip(parentId, message, this._lastRunConfig).catch(() => {
      });
    }
  }
  resumeToolCall(_options) {
    throw new Error("Local runtime does not support resuming tool calls.");
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/local/local-thread-list-runtime-core.js
var EMPTY_ARRAY3 = Object.freeze([]);
var DEFAULT_THREAD_ID = "__DEFAULT_ID__";
var DEFAULT_THREAD_DATA = Object.freeze({
  [DEFAULT_THREAD_ID]: {
    id: DEFAULT_THREAD_ID,
    remoteId: void 0,
    externalId: void 0,
    status: "regular",
    title: void 0
  }
});
var LocalThreadListRuntimeCore = class extends BaseSubscribable {
  constructor(_threadFactory) {
    super();
    __publicField(this, "_mainThread");
    this._mainThread = _threadFactory();
  }
  get isLoading() {
    return false;
  }
  getMainThreadRuntimeCore() {
    return this._mainThread;
  }
  get newThreadId() {
    return void 0;
  }
  get threadIds() {
    return EMPTY_ARRAY3;
  }
  get archivedThreadIds() {
    return EMPTY_ARRAY3;
  }
  get mainThreadId() {
    return DEFAULT_THREAD_ID;
  }
  get threadItems() {
    return DEFAULT_THREAD_DATA;
  }
  getThreadRuntimeCore() {
    throw new Error("Method not implemented.");
  }
  getLoadThreadsPromise() {
    return Promise.resolve();
  }
  getItemById(threadId) {
    if (threadId === this.mainThreadId) {
      return {
        status: "regular",
        id: this.mainThreadId,
        remoteId: this.mainThreadId,
        externalId: void 0,
        title: void 0,
        isMain: true
      };
    }
    throw new Error("Method not implemented");
  }
  async switchToThread() {
    throw new Error("Method not implemented.");
  }
  switchToNewThread() {
    throw new Error("Method not implemented.");
  }
  rename() {
    throw new Error("Method not implemented.");
  }
  archive() {
    throw new Error("Method not implemented.");
  }
  detach() {
    throw new Error("Method not implemented.");
  }
  unarchive() {
    throw new Error("Method not implemented.");
  }
  delete() {
    throw new Error("Method not implemented.");
  }
  initialize(threadId) {
    return Promise.resolve({ remoteId: threadId, externalId: void 0 });
  }
  generateTitle() {
    throw new Error("Method not implemented.");
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/local/local-runtime-core.js
var LocalRuntimeCore = class extends BaseAssistantRuntimeCore {
  constructor(options, initialMessages) {
    super();
    __publicField(this, "threads");
    __publicField(this, "Provider");
    __publicField(this, "_options");
    this._options = options;
    this.threads = new LocalThreadListRuntimeCore(() => {
      return new LocalThreadRuntimeCore(this._contextProvider, this._options);
    });
    if (initialMessages) {
      this.threads.getMainThreadRuntimeCore().import(ExportedMessageRepository.fromArray(initialMessages));
    }
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/external-store/external-store-thread-list-runtime-core.js
var EMPTY_ARRAY4 = Object.freeze([]);
var DEFAULT_THREAD_ID2 = "DEFAULT_THREAD_ID";
var DEFAULT_THREADS = Object.freeze([DEFAULT_THREAD_ID2]);
var DEFAULT_THREAD = Object.freeze({
  id: DEFAULT_THREAD_ID2,
  remoteId: void 0,
  externalId: void 0,
  status: "regular"
});
var RESOLVED_PROMISE = Promise.resolve();
var DEFAULT_THREAD_DATA2 = Object.freeze({
  [DEFAULT_THREAD_ID2]: DEFAULT_THREAD
});
var ExternalStoreThreadListRuntimeCore = class {
  constructor(adapter = {}, threadFactory) {
    __publicField(this, "adapter");
    __publicField(this, "threadFactory");
    __publicField(this, "_mainThreadId", DEFAULT_THREAD_ID2);
    __publicField(this, "_threads", DEFAULT_THREADS);
    __publicField(this, "_archivedThreads", EMPTY_ARRAY4);
    __publicField(this, "_threadData", DEFAULT_THREAD_DATA2);
    __publicField(this, "_mainThread");
    __publicField(this, "_subscriptions", /* @__PURE__ */ new Set());
    this.adapter = adapter;
    this.threadFactory = threadFactory;
    this._mainThread = this.threadFactory();
    this.__internal_setAdapter(adapter, true);
  }
  get isLoading() {
    return this.adapter.isLoading ?? false;
  }
  get newThreadId() {
    return void 0;
  }
  get threadIds() {
    return this._threads;
  }
  get archivedThreadIds() {
    return this._archivedThreads;
  }
  get threadItems() {
    return this._threadData;
  }
  getLoadThreadsPromise() {
    return RESOLVED_PROMISE;
  }
  get mainThreadId() {
    return this._mainThreadId;
  }
  getMainThreadRuntimeCore() {
    return this._mainThread;
  }
  getThreadRuntimeCore() {
    throw new Error("Method not implemented.");
  }
  getItemById(threadId) {
    for (const thread of this.adapter.threads ?? []) {
      if (thread.id === threadId)
        return thread;
    }
    for (const thread of this.adapter.archivedThreads ?? []) {
      if (thread.id === threadId)
        return thread;
    }
    if (threadId === DEFAULT_THREAD_ID2)
      return DEFAULT_THREAD;
    return void 0;
  }
  __internal_setAdapter(adapter, initialLoad = false) {
    var _a2, _b, _c, _d;
    const previousAdapter = this.adapter;
    this.adapter = adapter;
    const newThreadId = adapter.threadId ?? DEFAULT_THREAD_ID2;
    const newThreads = adapter.threads ?? EMPTY_ARRAY4;
    const newArchivedThreads = adapter.archivedThreads ?? EMPTY_ARRAY4;
    const previousThreadId = previousAdapter.threadId ?? DEFAULT_THREAD_ID2;
    const previousThreads = previousAdapter.threads ?? EMPTY_ARRAY4;
    const previousArchivedThreads = previousAdapter.archivedThreads ?? EMPTY_ARRAY4;
    if (!initialLoad && previousThreadId === newThreadId && previousThreads === newThreads && previousArchivedThreads === newArchivedThreads) {
      return;
    }
    this._threadData = {
      ...DEFAULT_THREAD_DATA2,
      ...Object.fromEntries(((_a2 = adapter.threads) == null ? void 0 : _a2.map((t) => [
        t.id,
        {
          ...t,
          remoteId: t.remoteId,
          externalId: t.externalId,
          status: "regular"
        }
      ])) ?? []),
      ...Object.fromEntries(((_b = adapter.archivedThreads) == null ? void 0 : _b.map((t) => [
        t.id,
        {
          ...t,
          remoteId: t.remoteId,
          externalId: t.externalId,
          status: "archived"
        }
      ])) ?? [])
    };
    if (previousThreads !== newThreads) {
      this._threads = ((_c = this.adapter.threads) == null ? void 0 : _c.map((t) => t.id)) ?? EMPTY_ARRAY4;
    }
    if (previousArchivedThreads !== newArchivedThreads) {
      this._archivedThreads = ((_d = this.adapter.archivedThreads) == null ? void 0 : _d.map((t) => t.id)) ?? EMPTY_ARRAY4;
    }
    if (previousThreadId !== newThreadId) {
      this._mainThreadId = newThreadId;
      this._mainThread = this.threadFactory();
    }
    this._notifySubscribers();
  }
  async switchToThread(threadId) {
    if (this._mainThreadId === threadId)
      return;
    const onSwitchToThread = this.adapter.onSwitchToThread;
    if (!onSwitchToThread)
      throw new Error("External store adapter does not support switching to thread");
    await onSwitchToThread(threadId);
  }
  async switchToNewThread() {
    const onSwitchToNewThread = this.adapter.onSwitchToNewThread;
    if (!onSwitchToNewThread)
      throw new Error("External store adapter does not support switching to new thread");
    await onSwitchToNewThread();
  }
  async rename(threadId, newTitle) {
    const onRename = this.adapter.onRename;
    if (!onRename)
      throw new Error("External store adapter does not support renaming");
    await onRename(threadId, newTitle);
  }
  async detach() {
  }
  async archive(threadId) {
    const onArchive = this.adapter.onArchive;
    if (!onArchive)
      throw new Error("External store adapter does not support archiving");
    await onArchive(threadId);
  }
  async unarchive(threadId) {
    const onUnarchive = this.adapter.onUnarchive;
    if (!onUnarchive)
      throw new Error("External store adapter does not support unarchiving");
    await onUnarchive(threadId);
  }
  async delete(threadId) {
    const onDelete = this.adapter.onDelete;
    if (!onDelete)
      throw new Error("External store adapter does not support deleting");
    await onDelete(threadId);
  }
  initialize(threadId) {
    return Promise.resolve({ remoteId: threadId, externalId: void 0 });
  }
  generateTitle() {
    throw new Error("Method not implemented.");
  }
  subscribe(callback) {
    this._subscriptions.add(callback);
    return () => this._subscriptions.delete(callback);
  }
  _notifySubscribers() {
    for (const callback of this._subscriptions)
      callback();
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/external-store/thread-message-converter.js
var ThreadMessageConverter = class {
  constructor() {
    __publicField(this, "cache", /* @__PURE__ */ new WeakMap());
  }
  convertMessages(messages, converter) {
    return messages.map((m, idx) => {
      const cached = this.cache.get(m);
      const newMessage = converter(cached, m, idx);
      this.cache.set(m, newMessage);
      return newMessage;
    });
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/external-store/external-store-thread-runtime-core.js
var EMPTY_ARRAY5 = Object.freeze([]);
var shallowEqual2 = (a, b) => {
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length)
    return false;
  for (const key of aKeys) {
    if (a[key] !== b[key])
      return false;
  }
  return true;
};
var hasUpcomingMessage = (isRunning, messages) => {
  var _a2;
  return isRunning && ((_a2 = messages[messages.length - 1]) == null ? void 0 : _a2.role) !== "assistant";
};
var ExternalStoreThreadRuntimeCore = class extends BaseThreadRuntimeCore {
  constructor(contextProvider, store) {
    super(contextProvider);
    __publicField(this, "_assistantOptimisticId", null);
    __publicField(this, "_capabilities", {
      switchToBranch: false,
      switchBranchDuringRun: false,
      edit: false,
      reload: false,
      cancel: false,
      unstable_copy: false,
      speech: false,
      dictation: false,
      voice: false,
      attachments: false,
      feedback: false,
      queue: false
    });
    __publicField(this, "_messages");
    __publicField(this, "isDisabled");
    __publicField(this, "suggestions", []);
    __publicField(this, "extras");
    __publicField(this, "_converter", new ThreadMessageConverter());
    __publicField(this, "_store");
    __publicField(this, "updateMessages", (messages) => {
      var _a2, _b, _c, _d;
      const hasConverter = this._store.convertMessage !== void 0;
      if (hasConverter) {
        (_b = (_a2 = this._store).setMessages) == null ? void 0 : _b.call(_a2, messages.flatMap(getExternalStoreMessages));
      } else {
        (_d = (_c = this._store).setMessages) == null ? void 0 : _d.call(_c, messages);
      }
    });
    this.__internal_setAdapter(store);
  }
  get capabilities() {
    return this._capabilities;
  }
  get isLoading() {
    return this._store.isLoading ?? false;
  }
  _getBaseMessages() {
    return this._messages;
  }
  get state() {
    return this._store.state ?? super.state;
  }
  get adapters() {
    return this._store.adapters;
  }
  beginEdit(messageId) {
    if (!this._store.onEdit)
      throw new Error("Runtime does not support editing.");
    super.beginEdit(messageId);
  }
  __internal_setAdapter(store) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (this._store === store)
      return;
    const isRunning = store.isRunning ?? false;
    this.isDisabled = store.isDisabled ?? false;
    const oldStore = this._store;
    this._store = store;
    if (this.extras !== store.extras) {
      this.extras = store.extras;
    }
    const newSuggestions = store.suggestions ?? EMPTY_ARRAY5;
    if (!shallowEqual2(this.suggestions, newSuggestions)) {
      this.suggestions = newSuggestions;
    }
    const newCapabilities = {
      switchToBranch: this._store.setMessages !== void 0,
      switchBranchDuringRun: false,
      edit: this._store.onEdit !== void 0,
      reload: this._store.onReload !== void 0,
      cancel: this._store.onCancel !== void 0,
      speech: ((_a2 = this._store.adapters) == null ? void 0 : _a2.speech) !== void 0,
      dictation: ((_b = this._store.adapters) == null ? void 0 : _b.dictation) !== void 0,
      voice: ((_c = this._store.adapters) == null ? void 0 : _c.voice) !== void 0,
      unstable_copy: ((_d = this._store.unstable_capabilities) == null ? void 0 : _d.copy) !== false,
      attachments: !!((_e = this._store.adapters) == null ? void 0 : _e.attachments),
      feedback: !!((_f = this._store.adapters) == null ? void 0 : _f.feedback),
      queue: false
    };
    if (!shallowEqual2(this._capabilities, newCapabilities)) {
      this._capabilities = newCapabilities;
    }
    let messages;
    if (store.messageRepository) {
      if (oldStore && oldStore.isRunning === store.isRunning && oldStore.messageRepository === store.messageRepository) {
        this._notifySubscribers();
        return;
      }
      this.repository.clear();
      this._assistantOptimisticId = null;
      this.repository.import(store.messageRepository);
      messages = this.repository.getMessages();
    } else if (store.messages) {
      if (oldStore) {
        if (oldStore.convertMessage !== store.convertMessage) {
          this._converter = new ThreadMessageConverter();
        } else if (oldStore.isRunning === store.isRunning && oldStore.messages === store.messages) {
          this._notifySubscribers();
          return;
        }
      }
      messages = !store.convertMessage ? store.messages : this._converter.convertMessages(store.messages, (cache, m, idx) => {
        var _a3;
        if (!store.convertMessage)
          return m;
        const isLast = idx === (((_a3 = store.messages) == null ? void 0 : _a3.length) ?? 0) - 1;
        const autoStatus = getAutoStatus(isLast, isRunning, false, false, void 0);
        if (cache && (cache.role !== "assistant" || !isAutoStatus(cache.status) || cache.status === autoStatus))
          return cache;
        const messageLike = store.convertMessage(m, idx);
        const newMessage = fromThreadMessageLike(messageLike, idx.toString(), autoStatus);
        bindExternalStoreMessage(newMessage, m);
        return newMessage;
      });
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const parent = messages[i - 1];
        this.repository.addOrUpdateMessage((parent == null ? void 0 : parent.id) ?? null, message);
      }
    } else {
      throw new Error("ExternalStoreAdapter must provide either 'messages' or 'messageRepository'");
    }
    if (messages.length > 0)
      this.ensureInitialized();
    if (((oldStore == null ? void 0 : oldStore.isRunning) ?? false) !== (store.isRunning ?? false)) {
      if (store.isRunning) {
        this._notifyEventSubscribers("runStart");
      } else {
        this._notifyEventSubscribers("runEnd");
      }
    }
    if (this._assistantOptimisticId) {
      this.repository.deleteMessage(this._assistantOptimisticId);
      this._assistantOptimisticId = null;
    }
    if (hasUpcomingMessage(isRunning, messages)) {
      this._assistantOptimisticId = this.repository.appendOptimisticMessage(((_g = messages.at(-1)) == null ? void 0 : _g.id) ?? null, {
        role: "assistant",
        content: []
      });
    }
    this.repository.resetHead(this._assistantOptimisticId ?? ((_h = messages.at(-1)) == null ? void 0 : _h.id) ?? null);
    this._messages = this.repository.getMessages();
    this._notifySubscribers();
  }
  switchToBranch(branchId) {
    if (!this._store.setMessages)
      throw new Error("Runtime does not support switching branches.");
    if (this._store.isRunning) {
      return;
    }
    this.repository.switchToBranch(branchId);
    this.updateMessages(this.repository.getMessages());
  }
  async append(message) {
    var _a2;
    if (message.parentId !== (((_a2 = this.messages.at(-1)) == null ? void 0 : _a2.id) ?? null)) {
      if (!this._store.onEdit)
        throw new Error("Runtime does not support editing messages.");
      await this._store.onEdit(message);
    } else {
      await this._store.onNew(message);
    }
  }
  async startRun(config) {
    if (!this._store.onReload)
      throw new Error("Runtime does not support reloading messages.");
    await this._store.onReload(config.parentId, config);
  }
  async resumeRun(config) {
    if (!this._store.onResume)
      throw new Error("Runtime does not support resuming runs.");
    await this._store.onResume(config);
  }
  exportExternalState() {
    if (!this._store.onExportExternalState)
      throw new Error("Runtime does not support exporting external states.");
    return this._store.onExportExternalState();
  }
  importExternalState(state) {
    if (!this._store.onLoadExternalState)
      throw new Error("Runtime does not support importing external states.");
    this._store.onLoadExternalState(state);
  }
  unstable_loadExternalState(state) {
    this.importExternalState(state);
  }
  cancelRun() {
    var _a2;
    if (!this._store.onCancel)
      throw new Error("Runtime does not support cancelling runs.");
    this._store.onCancel();
    if (this._assistantOptimisticId) {
      this.repository.deleteMessage(this._assistantOptimisticId);
      this._assistantOptimisticId = null;
    }
    let messages = this.repository.getMessages();
    const previousMessage = messages[messages.length - 1];
    if ((previousMessage == null ? void 0 : previousMessage.role) === "user" && previousMessage.id === ((_a2 = messages.at(-1)) == null ? void 0 : _a2.id)) {
      this.repository.deleteMessage(previousMessage.id);
      if (!this.composer.text.trim()) {
        this.composer.setText(getThreadMessageText(previousMessage));
      }
      messages = this.repository.getMessages();
    } else {
      this._notifySubscribers();
    }
    setTimeout(() => {
      this.updateMessages(messages);
    }, 0);
  }
  addToolResult(options) {
    var _a2, _b;
    if (!this._store.onAddToolResult && !this._store.onAddToolResult)
      throw new Error("Runtime does not support tool results.");
    (_b = (_a2 = this._store).onAddToolResult) == null ? void 0 : _b.call(_a2, options);
  }
  resumeToolCall(options) {
    if (!this._store.onResumeToolCall)
      throw new Error("Runtime does not support resuming tool calls.");
    this._store.onResumeToolCall(options);
  }
  reset(initialMessages) {
    const repo = new MessageRepository();
    repo.import(ExportedMessageRepository.fromArray(initialMessages ?? []));
    this.updateMessages(repo.getMessages());
  }
  import(data) {
    this._assistantOptimisticId = null;
    super.import(data);
    if (this._store.onImport) {
      this._store.onImport(this.repository.getMessages());
    }
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/external-store/external-store-runtime-core.js
var getThreadListAdapter = (store) => {
  var _a2;
  return ((_a2 = store.adapters) == null ? void 0 : _a2.threadList) ?? {};
};
var ExternalStoreRuntimeCore = class extends BaseAssistantRuntimeCore {
  constructor(adapter) {
    super();
    __publicField(this, "threads");
    this.threads = new ExternalStoreThreadListRuntimeCore(getThreadListAdapter(adapter), () => new ExternalStoreThreadRuntimeCore(this._contextProvider, adapter));
  }
  setAdapter(adapter) {
    this.threads.__internal_setAdapter(getThreadListAdapter(adapter));
    this.threads.getMainThreadRuntimeCore().__internal_setAdapter(adapter);
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/remote-thread-list/optimistic-state.js
var pipeTransforms = (initialState, extraParam, transforms) => {
  return transforms.reduce((state, transform) => {
    return (transform == null ? void 0 : transform(state, extraParam)) ?? state;
  }, initialState);
};
var OptimisticState = class extends BaseSubscribable {
  constructor(initialState) {
    super();
    __publicField(this, "_pendingTransforms", []);
    /**
     * `optimistic` callbacks from transforms that have already resolved.
     * Re-applied after every `then` callback so that a wholesale state
     * replacement (e.g. list()) cannot erase earlier completed effects
     * (e.g. delete). Cleared when no pending transforms remain.
     *
     * Correctness requirement: `optimistic` callbacks must be idempotent.
     */
    __publicField(this, "_completedOptimistics", []);
    __publicField(this, "_baseValue");
    __publicField(this, "_cachedValue");
    this._baseValue = initialState;
    this._cachedValue = initialState;
  }
  _updateState() {
    this._cachedValue = this._pendingTransforms.reduce((state, transform) => {
      return pipeTransforms(state, transform.task, [
        transform.loading,
        transform.optimistic
      ]);
    }, this._baseValue);
    this._notifySubscribers();
  }
  get baseValue() {
    return this._baseValue;
  }
  get value() {
    return this._cachedValue;
  }
  update(state) {
    this._baseValue = state;
    this._updateState();
  }
  async optimisticUpdate(transform) {
    const task = transform.execute();
    const pendingTransform = { ...transform, task };
    try {
      this._pendingTransforms.push(pendingTransform);
      this._updateState();
      const result = await task;
      this._baseValue = pipeTransforms(this._baseValue, result, [
        transform.optimistic,
        transform.then
      ]);
      for (const fn of this._completedOptimistics) {
        this._baseValue = fn(this._baseValue);
      }
      if (transform.optimistic) {
        this._completedOptimistics.push(transform.optimistic);
      }
      return result;
    } finally {
      const index = this._pendingTransforms.indexOf(pendingTransform);
      if (index > -1) {
        this._pendingTransforms.splice(index, 1);
      }
      if (this._pendingTransforms.length === 0) {
        this._completedOptimistics.length = 0;
      }
      this._updateState();
    }
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/remote-thread-list/empty-thread-core.js
var EMPTY_THREAD_ERROR = new Error("This is the empty thread, a placeholder for the main thread. You cannot perform any actions on this thread instance. This error is probably because you tried to call a thread method in your render function. Call the method inside a `useEffect` hook instead.");
var EMPTY_THREAD_CORE = {
  getMessageById() {
    return void 0;
  },
  getBranches() {
    return [];
  },
  switchToBranch() {
    throw EMPTY_THREAD_ERROR;
  },
  append() {
    throw EMPTY_THREAD_ERROR;
  },
  startRun() {
    throw EMPTY_THREAD_ERROR;
  },
  resumeRun() {
    throw EMPTY_THREAD_ERROR;
  },
  cancelRun() {
    throw EMPTY_THREAD_ERROR;
  },
  addToolResult() {
    throw EMPTY_THREAD_ERROR;
  },
  resumeToolCall() {
    throw EMPTY_THREAD_ERROR;
  },
  speak() {
    throw EMPTY_THREAD_ERROR;
  },
  stopSpeaking() {
    throw EMPTY_THREAD_ERROR;
  },
  connectVoice() {
    throw EMPTY_THREAD_ERROR;
  },
  disconnectVoice() {
    throw EMPTY_THREAD_ERROR;
  },
  getVoiceVolume: () => 0,
  subscribeVoiceVolume: () => () => {
  },
  muteVoice() {
    throw EMPTY_THREAD_ERROR;
  },
  unmuteVoice() {
    throw EMPTY_THREAD_ERROR;
  },
  submitFeedback() {
    throw EMPTY_THREAD_ERROR;
  },
  getModelContext() {
    return {};
  },
  exportExternalState() {
    throw EMPTY_THREAD_ERROR;
  },
  importExternalState() {
    throw EMPTY_THREAD_ERROR;
  },
  unstable_loadExternalState() {
    throw EMPTY_THREAD_ERROR;
  },
  composer: {
    attachments: [],
    attachmentAccept: "*",
    async addAttachment() {
      throw EMPTY_THREAD_ERROR;
    },
    async removeAttachment() {
      throw EMPTY_THREAD_ERROR;
    },
    isEditing: true,
    canCancel: false,
    isEmpty: true,
    text: "",
    setText() {
      throw EMPTY_THREAD_ERROR;
    },
    role: "user",
    setRole() {
      throw EMPTY_THREAD_ERROR;
    },
    runConfig: {},
    setRunConfig() {
      throw EMPTY_THREAD_ERROR;
    },
    async reset() {
    },
    async clearAttachments() {
    },
    send() {
      throw EMPTY_THREAD_ERROR;
    },
    cancel() {
    },
    dictation: void 0,
    startDictation() {
      throw EMPTY_THREAD_ERROR;
    },
    stopDictation() {
    },
    quote: void 0,
    setQuote() {
      throw EMPTY_THREAD_ERROR;
    },
    subscribe() {
      return () => {
      };
    },
    unstable_on() {
      return () => {
      };
    }
  },
  getEditComposer() {
    return void 0;
  },
  beginEdit() {
    throw EMPTY_THREAD_ERROR;
  },
  speech: void 0,
  voice: void 0,
  capabilities: {
    switchToBranch: false,
    switchBranchDuringRun: false,
    edit: false,
    reload: false,
    cancel: false,
    unstable_copy: false,
    speech: false,
    dictation: false,
    voice: false,
    attachments: false,
    feedback: false,
    queue: false
  },
  isDisabled: false,
  isLoading: true,
  messages: [],
  state: null,
  suggestions: [],
  extras: void 0,
  subscribe() {
    return () => {
    };
  },
  import() {
    throw EMPTY_THREAD_ERROR;
  },
  export() {
    return { messages: [] };
  },
  reset() {
    throw EMPTY_THREAD_ERROR;
  },
  unstable_on() {
    return () => {
    };
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/remote-thread-list/remote-thread-state.js
function createThreadMappingId(id) {
  return id;
}
var getThreadData = (state, threadIdOrRemoteId) => {
  const idx = state.threadIdMap[threadIdOrRemoteId];
  if (idx === void 0)
    return void 0;
  return state.threadData[idx];
};
var updateStatusReducer = (state, threadIdOrRemoteId, newStatus) => {
  const data = getThreadData(state, threadIdOrRemoteId);
  if (!data)
    return state;
  const { id, remoteId, status: lastStatus } = data;
  if (lastStatus === newStatus)
    return state;
  const newState = { ...state };
  switch (lastStatus) {
    case "new":
      newState.newThreadId = void 0;
      break;
    case "regular":
      newState.threadIds = newState.threadIds.filter((t) => t !== id);
      break;
    case "archived":
      newState.archivedThreadIds = newState.archivedThreadIds.filter((t) => t !== id);
      break;
    default: {
      const _exhaustiveCheck = lastStatus;
      throw new Error(`Unsupported state: ${_exhaustiveCheck}`);
    }
  }
  switch (newStatus) {
    case "regular":
      newState.threadIds = [id, ...newState.threadIds];
      break;
    case "archived":
      newState.archivedThreadIds = [id, ...newState.archivedThreadIds];
      break;
    case "deleted":
      newState.threadData = Object.fromEntries(Object.entries(newState.threadData).filter(([key]) => key !== id));
      newState.threadIdMap = Object.fromEntries(Object.entries(newState.threadIdMap).filter(([key]) => key !== id && key !== remoteId));
      break;
    default: {
      const _exhaustiveCheck = newStatus;
      throw new Error(`Unsupported state: ${_exhaustiveCheck}`);
    }
  }
  if (newStatus !== "deleted") {
    newState.threadData = {
      ...newState.threadData,
      [id]: {
        ...data,
        status: newStatus
      }
    };
  }
  return newState;
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/useExternalStoreRuntime.js
var useExternalStoreRuntime = (store) => {
  const [runtime] = (0, import_react20.useState)(() => new ExternalStoreRuntimeCore(store));
  (0, import_react20.useEffect)(() => {
    runtime.setAdapter(store);
  });
  const { modelContext } = useRuntimeAdapters() ?? {};
  (0, import_react20.useEffect)(() => {
    if (!modelContext)
      return void 0;
    return runtime.registerModelContextProvider(modelContext);
  }, [modelContext, runtime]);
  return (0, import_react20.useMemo)(() => new AssistantRuntimeImpl(runtime), [runtime]);
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/external-message-converter.js
var import_react21 = __toESM(require_react(), 1);
var mergeInnerMessages = (existing, incoming) => ({
  [symbolInnerMessage]: [
    ...existing[symbolInnerMessage] ?? [],
    ...incoming[symbolInnerMessage] ?? []
  ]
});
var joinExternalMessages = (messages) => {
  const assistantMessage = {
    role: "assistant",
    content: []
  };
  for (const output of messages) {
    if (output.role === "tool") {
      const toolCallIdx = assistantMessage.content.findIndex((c) => c.type === "tool-call" && c.toolCallId === output.toolCallId);
      if (toolCallIdx !== -1) {
        const toolCall = assistantMessage.content[toolCallIdx];
        if (output.toolName !== void 0) {
          if (toolCall.toolName !== output.toolName)
            throw new Error(`Tool call name ${output.toolCallId} ${output.toolName} does not match existing tool call ${toolCall.toolName}`);
        }
        assistantMessage.content[toolCallIdx] = {
          ...toolCall,
          ...{
            [symbolInnerMessage]: [
              ...toolCall[symbolInnerMessage] ?? [],
              output
            ]
          },
          result: output.result,
          artifact: output.artifact,
          isError: output.isError,
          messages: output.messages
        };
      }
    } else {
      const role = output.role;
      const content = (typeof output.content === "string" ? [{ type: "text", text: output.content }] : output.content).map((c) => ({
        ...c,
        ...{ [symbolInnerMessage]: [output] }
      }));
      switch (role) {
        case "system":
        case "user":
          return {
            ...output,
            content
          };
        case "assistant":
          if (assistantMessage.content.length === 0) {
            assistantMessage.id = output.id;
            assistantMessage.createdAt ?? (assistantMessage.createdAt = output.createdAt);
            assistantMessage.status ?? (assistantMessage.status = output.status);
            if (output.attachments) {
              assistantMessage.attachments = [
                ...assistantMessage.attachments ?? [],
                ...output.attachments
              ];
            }
            if (output.metadata) {
              assistantMessage.metadata ?? (assistantMessage.metadata = {});
              if (output.metadata.unstable_state) {
                assistantMessage.metadata.unstable_state = output.metadata.unstable_state;
              }
              if (output.metadata.unstable_annotations) {
                assistantMessage.metadata.unstable_annotations = [
                  ...assistantMessage.metadata.unstable_annotations ?? [],
                  ...output.metadata.unstable_annotations
                ];
              }
              if (output.metadata.unstable_data) {
                assistantMessage.metadata.unstable_data = [
                  ...assistantMessage.metadata.unstable_data ?? [],
                  ...output.metadata.unstable_data
                ];
              }
              if (output.metadata.steps) {
                assistantMessage.metadata.steps = [
                  ...assistantMessage.metadata.steps ?? [],
                  ...output.metadata.steps
                ];
              }
              if (output.metadata.custom) {
                assistantMessage.metadata.custom = {
                  ...assistantMessage.metadata.custom ?? {},
                  ...output.metadata.custom
                };
              }
              if (output.metadata.timing) {
                assistantMessage.metadata.timing = output.metadata.timing;
              }
              if (output.metadata.submittedFeedback) {
                assistantMessage.metadata.submittedFeedback = output.metadata.submittedFeedback;
              }
            }
          }
          for (const part of content) {
            if (part.type === "tool-call") {
              const existingIdx = assistantMessage.content.findIndex((c) => c.type === "tool-call" && c.toolCallId === part.toolCallId);
              if (existingIdx !== -1) {
                const existing = assistantMessage.content[existingIdx];
                assistantMessage.content[existingIdx] = {
                  ...existing,
                  ...part,
                  ...mergeInnerMessages(existing, part)
                };
                continue;
              }
            }
            if (part.type === "reasoning" && "parentId" in part && part.parentId) {
              const existingIdx = assistantMessage.content.findIndex((c) => c.type === "reasoning" && "parentId" in c && c.parentId === part.parentId);
              if (existingIdx !== -1) {
                const existing = assistantMessage.content[existingIdx];
                assistantMessage.content[existingIdx] = {
                  ...existing,
                  text: `${existing.text}

${part.text}`,
                  ...mergeInnerMessages(existing, part)
                };
                continue;
              }
            }
            assistantMessage.content.push(part);
          }
          break;
        default: {
          const unsupportedRole = role;
          throw new Error(`Unknown message role: ${unsupportedRole}`);
        }
      }
    }
  }
  return assistantMessage;
};
var chunkExternalMessages = (callbackResults, joinStrategy) => {
  var _a2;
  const results = [];
  let isAssistant = false;
  let pendingNone = false;
  let inputs = [];
  let outputs = [];
  const flush = () => {
    if (outputs.length) {
      results.push({
        inputs,
        outputs
      });
    }
    inputs = [];
    outputs = [];
    isAssistant = false;
    pendingNone = false;
  };
  for (const callbackResult of callbackResults) {
    for (const output of callbackResult.outputs) {
      if (pendingNone && output.role !== "tool" || !isAssistant || output.role === "user" || output.role === "system") {
        flush();
      }
      isAssistant = output.role === "assistant" || output.role === "tool";
      if (inputs.at(-1) !== callbackResult.input) {
        inputs.push(callbackResult.input);
      }
      outputs.push(output);
      if (output.role === "assistant" && (((_a2 = output.convertConfig) == null ? void 0 : _a2.joinStrategy) === "none" || joinStrategy === "none")) {
        pendingNone = true;
      }
    }
  }
  flush();
  return results;
};
function createErrorAssistantMessage(error) {
  const msg = {
    id: generateErrorMessageId(),
    role: "assistant",
    content: [],
    status: { type: "incomplete", reason: "error", error },
    createdAt: /* @__PURE__ */ new Date(),
    metadata: {
      unstable_state: null,
      unstable_annotations: [],
      unstable_data: [],
      custom: {},
      steps: []
    }
  };
  bindExternalStoreMessage(msg, []);
  return msg;
}
var convertExternalMessages = (messages, callback, isRunning, metadata) => {
  const callbackResults = [];
  for (const message of messages) {
    const output = callback(message, metadata);
    const outputs = Array.isArray(output) ? output : [output];
    const result2 = { input: message, outputs };
    callbackResults.push(result2);
  }
  const chunks = chunkExternalMessages(callbackResults);
  const result = chunks.map((message, idx) => {
    const isLast = idx === chunks.length - 1;
    const joined = joinExternalMessages(message.outputs);
    const hasPendingToolCalls = typeof joined.content === "object" && joined.content.some((c) => c.type === "tool-call" && c.result === void 0);
    const autoStatus = getAutoStatus(isLast, isRunning, hasPendingToolCalls, hasPendingToolCalls, isLast ? metadata.error : void 0);
    const newMessage = fromThreadMessageLike(joined, idx.toString(), autoStatus);
    bindExternalStoreMessage(newMessage, message.inputs);
    return newMessage;
  });
  if (metadata.error) {
    const lastMessage = result.at(-1);
    if (!lastMessage || lastMessage.role !== "assistant") {
      result.push(createErrorAssistantMessage(metadata.error));
    }
  }
  return result;
};
var useExternalMessageConverter = ({ callback, messages, isRunning, joinStrategy, metadata }) => {
  const state = (0, import_react21.useMemo)(() => ({
    metadata: metadata ?? {},
    callback,
    callbackCache: /* @__PURE__ */ new WeakMap(),
    chunkCache: /* @__PURE__ */ new WeakMap(),
    converterCache: new ThreadMessageConverter()
  }), [callback, metadata]);
  return (0, import_react21.useMemo)(() => {
    const callbackResults = [];
    for (const message of messages) {
      let result = state.callbackCache.get(message);
      if (!result) {
        const output = state.callback(message, state.metadata);
        const outputs = Array.isArray(output) ? output : [output];
        result = { input: message, outputs };
        state.callbackCache.set(message, result);
      }
      callbackResults.push(result);
    }
    const chunks = chunkExternalMessages(callbackResults, joinStrategy).map((m) => {
      const key = m.outputs[0];
      if (!key)
        return m;
      const cached = state.chunkCache.get(key);
      if (cached && shallowArrayEqual(cached.outputs, m.outputs))
        return cached;
      state.chunkCache.set(key, m);
      return m;
    });
    const threadMessages = state.converterCache.convertMessages(chunks, (cache, message, idx) => {
      const isLast = idx === chunks.length - 1;
      const joined = joinExternalMessages(message.outputs);
      const hasSuspendedToolCalls = typeof joined.content === "object" && joined.content.some((c) => c.type === "tool-call" && c.result === void 0);
      const hasPendingToolCalls = typeof joined.content === "object" && joined.content.some((c) => c.type === "tool-call" && c.result === void 0);
      const autoStatus = getAutoStatus(isLast, isRunning, hasSuspendedToolCalls, hasPendingToolCalls, isLast ? state.metadata.error : void 0);
      if (cache && (cache.role !== "assistant" || !isAutoStatus(cache.status) || cache.status === autoStatus)) {
        const inputs = getExternalStoreMessages(cache);
        if (shallowArrayEqual(inputs, message.inputs)) {
          return cache;
        }
      }
      const newMessage = fromThreadMessageLike(joined, idx.toString(), autoStatus);
      bindExternalStoreMessage(newMessage, message.inputs);
      return newMessage;
    });
    bindExternalStoreMessage(threadMessages, messages);
    if (state.metadata.error) {
      const lastMessage = threadMessages.at(-1);
      if (!lastMessage || lastMessage.role !== "assistant") {
        threadMessages.push(createErrorAssistantMessage(state.metadata.error));
      }
    }
    return threadMessages;
  }, [state, messages, isRunning, joinStrategy]);
};
var shallowArrayEqual = (a, b) => {
  if (a.length !== b.length)
    return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i])
      return false;
  }
  return true;
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/createMessageConverter.js
var createMessageConverter = (callback) => {
  const result = {
    useThreadMessages: ({ messages, isRunning, joinStrategy, metadata }) => {
      return useExternalMessageConverter({
        callback,
        messages,
        isRunning,
        joinStrategy,
        metadata
      });
    },
    toThreadMessages: (messages, isRunning = false, metadata = {}) => {
      return convertExternalMessages(messages, callback, isRunning, metadata);
    },
    toOriginalMessages: (input) => {
      const messages = getExternalStoreMessages(input);
      if (messages.length === 0)
        throw new Error("No original messages found");
      return messages;
    },
    toOriginalMessage: (input) => {
      const messages = result.toOriginalMessages(input);
      return messages[0];
    },
    useOriginalMessage: () => {
      const messageMessages = result.useOriginalMessages();
      const first = messageMessages[0];
      return first;
    },
    useOriginalMessages: () => {
      const aui = useAui();
      const partMessages = useAuiState((s) => {
        if (aui.part.source)
          return getExternalStoreMessages(s.part);
        return void 0;
      });
      const messageMessages = useAuiState((s) => getExternalStoreMessages(s.message));
      const messages = partMessages ?? messageMessages;
      if (messages.length === 0)
        throw new Error("No original messages found");
      return messages;
    }
  };
  return result;
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/useRemoteThreadListRuntime.js
var import_react24 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/RemoteThreadListThreadListRuntimeCore.js
var import_jsx_runtime13 = __toESM(require_jsx_runtime(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/RemoteThreadListHookInstanceManager.js
var import_jsx_runtime12 = __toESM(require_jsx_runtime(), 1);
var import_react22 = __toESM(require_react(), 1);
var RemoteThreadListHookInstanceManager = class extends BaseSubscribable {
  constructor(runtimeHook, parent) {
    super();
    __publicField(this, "useRuntimeHook");
    __publicField(this, "instances", /* @__PURE__ */ new Map());
    __publicField(this, "useAliveThreadsKeysChanged", create(() => ({})));
    __publicField(this, "parent");
    __publicField(this, "_InnerActiveThreadProvider", ({ threadId }) => {
      const { useRuntime } = this.useRuntimeHook();
      const runtime = useRuntime();
      const threadBinding = runtime.thread.__internal_threadBinding;
      const updateRuntime = (0, import_react22.useCallback)(() => {
        const aliveThread = this.instances.get(threadId);
        if (!aliveThread)
          throw new Error("Thread not found. This is a bug in assistant-ui.");
        aliveThread.runtime = threadBinding.getState();
        this._notifySubscribers();
      }, [threadId, threadBinding]);
      const isMounted = (0, import_react22.useRef)(false);
      if (!isMounted.current) {
        updateRuntime();
      }
      (0, import_react22.useEffect)(() => {
        isMounted.current = true;
        updateRuntime();
        return threadBinding.outerSubscribe(updateRuntime);
      }, [threadBinding, updateRuntime]);
      const aui = useAui();
      const initPromiseRef = (0, import_react22.useRef)(void 0);
      (0, import_react22.useEffect)(() => {
        const runtimeCore = threadBinding.getState();
        const setGetInitializePromise = runtimeCore["__internal_setGetInitializePromise"];
        if (typeof setGetInitializePromise === "function") {
          setGetInitializePromise.call(runtimeCore, () => initPromiseRef.current);
        }
      }, [threadBinding]);
      (0, import_react22.useEffect)(() => {
        return runtime.threads.main.unstable_on("initialize", () => {
          const state = aui.threadListItem().getState();
          if (state.status === "new") {
            initPromiseRef.current = aui.threadListItem().initialize();
            const dispose = runtime.thread.unstable_on("runEnd", () => {
              dispose();
              aui.threadListItem().generateTitle();
            });
          }
        });
      }, [runtime, aui]);
      return null;
    });
    __publicField(this, "_OuterActiveThreadProvider", (0, import_react22.memo)(({ threadId, provider: Provider }) => {
      const runtime = (0, import_react22.useMemo)(() => new ThreadListRuntimeImpl(this.parent).getItemById(threadId), [threadId]);
      return (0, import_jsx_runtime12.jsx)(ThreadListItemRuntimeProvider, { runtime, children: (0, import_jsx_runtime12.jsx)(Provider, { children: (0, import_jsx_runtime12.jsx)(this._InnerActiveThreadProvider, { threadId }) }) });
    }));
    __publicField(this, "__internal_RenderThreadRuntimes", ({ provider }) => {
      this.useAliveThreadsKeysChanged();
      return Array.from(this.instances.keys()).map((threadId) => (0, import_jsx_runtime12.jsx)(this._OuterActiveThreadProvider, { threadId, provider }, threadId));
    });
    this.parent = parent;
    this.useRuntimeHook = create(() => ({ useRuntime: runtimeHook }));
  }
  startThreadRuntime(threadId) {
    if (!this.instances.has(threadId)) {
      this.instances.set(threadId, {});
      this.useAliveThreadsKeysChanged.setState({}, true);
    }
    return new Promise((resolve, reject) => {
      const callback = () => {
        const instance = this.instances.get(threadId);
        if (!instance) {
          dispose();
          reject(new Error("Thread was deleted before runtime was started"));
        } else if (!instance.runtime) {
          return;
        } else {
          dispose();
          resolve(instance.runtime);
        }
      };
      const dispose = this.subscribe(callback);
      callback();
    });
  }
  getThreadRuntimeCore(threadId) {
    const instance = this.instances.get(threadId);
    if (!instance)
      return void 0;
    return instance.runtime;
  }
  stopThreadRuntime(threadId) {
    this.instances.delete(threadId);
    this.useAliveThreadsKeysChanged.setState({}, true);
  }
  setRuntimeHook(newRuntimeHook) {
    const prevRuntimeHook = this.useRuntimeHook.getState().useRuntime;
    if (prevRuntimeHook !== newRuntimeHook) {
      this.useRuntimeHook.setState({ useRuntime: newRuntimeHook }, true);
    }
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/RemoteThreadListThreadListRuntimeCore.js
var import_react23 = __toESM(require_react(), 1);
var RemoteThreadListThreadListRuntimeCore = class extends BaseSubscribable {
  constructor(options, contextProvider) {
    super();
    __publicField(this, "_options");
    __publicField(this, "_hookManager");
    __publicField(this, "_loadThreadsPromise");
    __publicField(this, "_mainThreadId");
    __publicField(this, "_state", new OptimisticState({
      isLoading: true,
      newThreadId: void 0,
      threadIds: [],
      archivedThreadIds: [],
      threadIdMap: {},
      threadData: {}
    }));
    __publicField(this, "contextProvider");
    __publicField(this, "_initialThreadLoaded", false);
    __publicField(this, "useProvider");
    __publicField(this, "initialize", async (threadId) => {
      if (this._state.value.newThreadId !== threadId) {
        const data = this.getItemById(threadId);
        if (!data)
          throw new Error("Thread not found");
        if (data.status === "new")
          throw new Error("Unexpected new state");
        return data.initializeTask;
      }
      return this._state.optimisticUpdate({
        execute: () => {
          return this._options.adapter.initialize(threadId);
        },
        optimistic: (state) => {
          return updateStatusReducer(state, threadId, "regular");
        },
        loading: (state, task) => {
          const mappingId = createThreadMappingId(threadId);
          return {
            ...state,
            threadData: {
              ...state.threadData,
              [mappingId]: {
                ...state.threadData[mappingId],
                initializeTask: task
              }
            }
          };
        },
        then: (state, { remoteId, externalId }) => {
          const data = getThreadData(state, threadId);
          if (!data)
            return state;
          const mappingId = createThreadMappingId(threadId);
          return {
            ...state,
            threadIdMap: {
              ...state.threadIdMap,
              [remoteId]: mappingId
            },
            threadData: {
              ...state.threadData,
              [mappingId]: {
                ...data,
                initializeTask: Promise.resolve({ remoteId, externalId }),
                remoteId,
                externalId
              }
            }
          };
        }
      });
    });
    __publicField(this, "generateTitle", async (threadId) => {
      var _a2;
      const data = this.getItemById(threadId);
      if (!data)
        throw new Error("Thread not found");
      if (data.status === "new")
        throw new Error("Thread is not yet initialized");
      const { remoteId } = await data.initializeTask;
      const runtimeCore = this._hookManager.getThreadRuntimeCore(data.id);
      if (!runtimeCore)
        return;
      const messages = runtimeCore.messages;
      const stream = await this._options.adapter.generateTitle(remoteId, messages);
      const messageStream = AssistantMessageStream.fromAssistantStream(stream);
      for await (const result of messageStream) {
        const newTitle = (_a2 = result.parts.filter((c) => c.type === "text")[0]) == null ? void 0 : _a2.text;
        const state = this._state.baseValue;
        const currentData = getThreadData(state, data.id);
        if (!currentData)
          continue;
        this._state.update({
          ...state,
          threadData: {
            ...state.threadData,
            [currentData.id]: {
              ...currentData,
              title: newTitle
            }
          }
        });
      }
    });
    __publicField(this, "useBoundIds", create(() => []));
    __publicField(this, "__internal_RenderComponent", () => {
      const id = (0, import_react23.useId)();
      (0, import_react23.useEffect)(() => {
        this.useBoundIds.setState((s) => [...s, id], true);
        return () => {
          this.useBoundIds.setState((s) => s.filter((i) => i !== id), true);
        };
      }, [id]);
      const boundIds = this.useBoundIds();
      const { Provider } = this.useProvider();
      const adapters = {
        modelContext: this.contextProvider
      };
      return (boundIds.length === 0 || boundIds[0] === id) && // only render if the component is the first one mounted
      (0, import_jsx_runtime13.jsx)(RuntimeAdapterProvider, { adapters, children: (0, import_jsx_runtime13.jsx)(this._hookManager.__internal_RenderThreadRuntimes, { provider: Provider }) });
    });
    this.contextProvider = contextProvider;
    this._state.subscribe(() => this._notifySubscribers());
    this._hookManager = new RemoteThreadListHookInstanceManager(options.runtimeHook, this);
    this.useProvider = create(() => ({
      Provider: options.adapter.unstable_Provider ?? import_react23.Fragment
    }));
    this.__internal_setOptions(options);
    this.switchToNewThread();
  }
  get threadItems() {
    return this._state.value.threadData;
  }
  getLoadThreadsPromise() {
    if (!this._loadThreadsPromise) {
      this._loadThreadsPromise = this._state.optimisticUpdate({
        execute: () => this._options.adapter.list(),
        loading: (state) => {
          return {
            ...state,
            isLoading: true
          };
        },
        then: (state, l) => {
          const newThreadIds = [];
          const newArchivedThreadIds = [];
          const newThreadIdMap = {};
          const newThreadData = {};
          for (const thread of l.threads) {
            switch (thread.status) {
              case "regular":
                newThreadIds.push(thread.remoteId);
                break;
              case "archived":
                newArchivedThreadIds.push(thread.remoteId);
                break;
              default: {
                const _exhaustiveCheck = thread.status;
                throw new Error(`Unsupported state: ${_exhaustiveCheck}`);
              }
            }
            const mappingId = createThreadMappingId(thread.remoteId);
            newThreadIdMap[thread.remoteId] = mappingId;
            newThreadData[mappingId] = {
              id: thread.remoteId,
              remoteId: thread.remoteId,
              externalId: thread.externalId,
              status: thread.status,
              title: thread.title,
              initializeTask: Promise.resolve({
                remoteId: thread.remoteId,
                externalId: thread.externalId
              })
            };
          }
          return {
            ...state,
            isLoading: false,
            threadIds: newThreadIds,
            archivedThreadIds: newArchivedThreadIds,
            threadIdMap: {
              ...state.threadIdMap,
              ...newThreadIdMap
            },
            threadData: {
              ...state.threadData,
              ...newThreadData
            }
          };
        }
      }).catch(() => {
        this._loadThreadsPromise = void 0;
        this._state.update({
          ...this._state.baseValue,
          isLoading: false
        });
      }).then(() => {
      });
    }
    return this._loadThreadsPromise;
  }
  __internal_setOptions(options) {
    if (this._options === options)
      return;
    this._options = options;
    const Provider = options.adapter.unstable_Provider ?? import_react23.Fragment;
    if (Provider !== this.useProvider.getState().Provider) {
      this.useProvider.setState({ Provider }, true);
    }
    this._hookManager.setRuntimeHook(options.runtimeHook);
  }
  __internal_load() {
    this.getLoadThreadsPromise();
    const startThreadId = this._options.threadId ?? this._options.initialThreadId;
    if (!this._initialThreadLoaded && startThreadId) {
      this._initialThreadLoaded = true;
      this.switchToThread(startThreadId).catch(() => {
      });
    }
  }
  get isLoading() {
    return this._state.value.isLoading;
  }
  get threadIds() {
    return this._state.value.threadIds;
  }
  get archivedThreadIds() {
    return this._state.value.archivedThreadIds;
  }
  get newThreadId() {
    return this._state.value.newThreadId;
  }
  get mainThreadId() {
    return this._mainThreadId;
  }
  getMainThreadRuntimeCore() {
    const result = this._hookManager.getThreadRuntimeCore(this._mainThreadId);
    if (!result)
      return EMPTY_THREAD_CORE;
    return result;
  }
  getThreadRuntimeCore(threadIdOrRemoteId) {
    const data = this.getItemById(threadIdOrRemoteId);
    if (!data)
      throw new Error("Thread not found");
    const result = this._hookManager.getThreadRuntimeCore(data.id);
    if (!result)
      throw new Error("Thread not found");
    return result;
  }
  getItemById(threadIdOrRemoteId) {
    return getThreadData(this._state.value, threadIdOrRemoteId);
  }
  async switchToThread(threadIdOrRemoteId) {
    let data = this.getItemById(threadIdOrRemoteId);
    if (!data) {
      const remoteMetadata = await this._options.adapter.fetch(threadIdOrRemoteId);
      const state = this._state.value;
      const mappingId = createThreadMappingId(remoteMetadata.remoteId);
      const newThreadData = {
        ...state.threadData,
        [mappingId]: {
          id: mappingId,
          initializeTask: Promise.resolve({
            remoteId: remoteMetadata.remoteId,
            externalId: remoteMetadata.externalId
          }),
          remoteId: remoteMetadata.remoteId,
          externalId: remoteMetadata.externalId,
          status: remoteMetadata.status,
          title: remoteMetadata.title
        }
      };
      const newThreadIdMap = {
        ...state.threadIdMap,
        [remoteMetadata.remoteId]: mappingId
      };
      const newThreadIds = remoteMetadata.status === "regular" ? [...state.threadIds, remoteMetadata.remoteId] : state.threadIds;
      const newArchivedThreadIds = remoteMetadata.status === "archived" ? [...state.archivedThreadIds, remoteMetadata.remoteId] : state.archivedThreadIds;
      this._state.update({
        ...state,
        threadIds: newThreadIds,
        archivedThreadIds: newArchivedThreadIds,
        threadIdMap: newThreadIdMap,
        threadData: newThreadData
      });
      data = this.getItemById(threadIdOrRemoteId);
    }
    if (!data)
      throw new Error("Thread not found");
    if (this._mainThreadId === data.id)
      return;
    const task = this._hookManager.startThreadRuntime(data.id);
    if (this.mainThreadId !== void 0) {
      await task;
    } else {
      task.then(() => this._notifySubscribers());
    }
    if (data.status === "archived")
      await this.unarchive(data.id);
    this._mainThreadId = data.id;
    this._notifySubscribers();
  }
  async switchToNewThread() {
    while (this._state.baseValue.newThreadId !== void 0 && this._state.value.newThreadId === void 0) {
      await this._state.waitForUpdate();
    }
    const state = this._state.value;
    let id = this._state.value.newThreadId;
    if (id === void 0) {
      do {
        id = `__LOCALID_${generateId2()}`;
      } while (state.threadIdMap[id]);
      const mappingId = createThreadMappingId(id);
      this._state.update({
        ...state,
        newThreadId: id,
        threadIdMap: {
          ...state.threadIdMap,
          [id]: mappingId
        },
        threadData: {
          ...state.threadData,
          [mappingId]: {
            status: "new",
            id,
            remoteId: void 0,
            externalId: void 0,
            title: void 0
          }
        }
      });
    }
    return this.switchToThread(id);
  }
  rename(threadIdOrRemoteId, newTitle) {
    const data = this.getItemById(threadIdOrRemoteId);
    if (!data)
      throw new Error("Thread not found");
    if (data.status === "new")
      throw new Error("Thread is not yet initialized");
    return this._state.optimisticUpdate({
      execute: async () => {
        const { remoteId } = await data.initializeTask;
        return this._options.adapter.rename(remoteId, newTitle);
      },
      optimistic: (state) => {
        const data2 = getThreadData(state, threadIdOrRemoteId);
        if (!data2)
          return state;
        return {
          ...state,
          threadData: {
            ...state.threadData,
            [data2.id]: {
              ...data2,
              title: newTitle
            }
          }
        };
      }
    });
  }
  async _ensureThreadIsNotMain(threadId) {
    if (threadId === this.newThreadId)
      throw new Error("Cannot ensure new thread is not main");
    if (threadId === this._mainThreadId) {
      await this.switchToNewThread();
    }
  }
  async archive(threadIdOrRemoteId) {
    const data = this.getItemById(threadIdOrRemoteId);
    if (!data)
      throw new Error("Thread not found");
    if (data.status !== "regular")
      throw new Error("Thread is not yet initialized or already archived");
    await this._ensureThreadIsNotMain(data.id);
    return this._state.optimisticUpdate({
      execute: async () => {
        const { remoteId } = await data.initializeTask;
        return this._options.adapter.archive(remoteId);
      },
      optimistic: (state) => {
        return updateStatusReducer(state, data.id, "archived");
      }
    });
  }
  unarchive(threadIdOrRemoteId) {
    const data = this.getItemById(threadIdOrRemoteId);
    if (!data)
      throw new Error("Thread not found");
    if (data.status !== "archived")
      throw new Error("Thread is not archived");
    return this._state.optimisticUpdate({
      execute: async () => {
        try {
          const { remoteId } = await data.initializeTask;
          return await this._options.adapter.unarchive(remoteId);
        } catch (error) {
          await this._ensureThreadIsNotMain(data.id);
          throw error;
        }
      },
      optimistic: (state) => {
        return updateStatusReducer(state, data.id, "regular");
      }
    });
  }
  async delete(threadIdOrRemoteId) {
    const data = this.getItemById(threadIdOrRemoteId);
    if (!data)
      throw new Error("Thread not found");
    if (data.status !== "regular" && data.status !== "archived")
      throw new Error("Thread is not yet initialized");
    await this._ensureThreadIsNotMain(data.id);
    this._hookManager.stopThreadRuntime(data.id);
    return this._state.optimisticUpdate({
      execute: async () => {
        const { remoteId } = await data.initializeTask;
        return await this._options.adapter.delete(remoteId);
      },
      optimistic: (state) => {
        return updateStatusReducer(state, data.id, "deleted");
      }
    });
  }
  async detach(threadIdOrRemoteId) {
    const data = this.getItemById(threadIdOrRemoteId);
    if (!data)
      throw new Error("Thread not found");
    if (data.status !== "regular" && data.status !== "archived")
      throw new Error("Thread is not yet initialized");
    await this._ensureThreadIsNotMain(data.id);
    this._hookManager.stopThreadRuntime(data.id);
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/useRemoteThreadListRuntime.js
var RemoteThreadListRuntimeCore = class extends BaseAssistantRuntimeCore {
  constructor(options) {
    super();
    __publicField(this, "threads");
    this.threads = new RemoteThreadListThreadListRuntimeCore(options, this._contextProvider);
  }
  get RenderComponent() {
    return this.threads.__internal_RenderComponent;
  }
};
var useRemoteThreadListRuntimeImpl = (options) => {
  const [runtime] = (0, import_react24.useState)(() => new RemoteThreadListRuntimeCore(options));
  (0, import_react24.useEffect)(() => {
    runtime.threads.__internal_setOptions(options);
    runtime.threads.__internal_load();
  }, [runtime, options]);
  return (0, import_react24.useMemo)(() => new AssistantRuntimeImpl(runtime), [runtime]);
};
var useRemoteThreadListRuntime = (options) => {
  const runtimeHookRef = (0, import_react24.useRef)(options.runtimeHook);
  runtimeHookRef.current = options.runtimeHook;
  const startThreadIdRef = (0, import_react24.useRef)(options.threadId ?? options.initialThreadId);
  const stableRuntimeHook = (0, import_react24.useCallback)(() => {
    return runtimeHookRef.current();
  }, []);
  const stableOptions = (0, import_react24.useMemo)(() => ({
    adapter: options.adapter,
    allowNesting: options.allowNesting,
    initialThreadId: startThreadIdRef.current,
    runtimeHook: stableRuntimeHook
  }), [options.adapter, options.allowNesting, stableRuntimeHook]);
  const aui = useAui();
  const isNested = aui.threadListItem.source !== null;
  if (isNested) {
    if (!stableOptions.allowNesting) {
      throw new Error("useRemoteThreadListRuntime cannot be nested inside another RemoteThreadListRuntime. Set allowNesting: true to allow nesting (the inner runtime will become a no-op).");
    }
    return stableRuntimeHook();
  }
  const runtime = useRemoteThreadListRuntimeImpl(stableOptions);
  const prevThreadIdRef = (0, import_react24.useRef)(options.threadId);
  (0, import_react24.useEffect)(() => {
    if (options.threadId === prevThreadIdRef.current)
      return;
    prevThreadIdRef.current = options.threadId;
    if (options.threadId) {
      runtime.threads.switchToThread(options.threadId).catch(() => {
      });
    } else {
      runtime.threads.switchToNewThread().catch(() => {
      });
    }
  }, [runtime, options.threadId]);
  return runtime;
};

// ../../node_modules/.pnpm/assistant-cloud@0.1.25/node_modules/assistant-cloud/dist/AssistantCloudAuthStrategy.js
var getJwtExpiry = (jwt) => {
  try {
    const parts = jwt.split(".");
    const bodyPart = parts[1];
    if (!bodyPart) {
      throw new Error("Invalid JWT format");
    }
    let base64 = bodyPart.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const payload = atob(base64);
    const payloadObj = JSON.parse(payload);
    const exp = payloadObj.exp;
    if (!exp || typeof exp !== "number") {
      throw new Error('JWT does not contain a valid "exp" field');
    }
    return exp * 1e3;
  } catch (error) {
    throw new Error(`Unable to determine the token expiry: ${error}`);
  }
};
var _authTokenCallback;
var AssistantCloudJWTAuthStrategy = class {
  constructor(authTokenCallback) {
    __publicField(this, "strategy", "jwt");
    __publicField(this, "cachedToken", null);
    __publicField(this, "tokenExpiry", null);
    __privateAdd(this, _authTokenCallback);
    __privateSet(this, _authTokenCallback, authTokenCallback);
  }
  async getAuthHeaders() {
    const currentTime = Date.now();
    if (this.cachedToken && this.tokenExpiry && this.tokenExpiry - currentTime > 30 * 1e3) {
      return { Authorization: `Bearer ${this.cachedToken}` };
    }
    const newToken = await __privateGet(this, _authTokenCallback).call(this);
    if (!newToken)
      return false;
    this.cachedToken = newToken;
    this.tokenExpiry = getJwtExpiry(newToken);
    return { Authorization: `Bearer ${newToken}` };
  }
  readAuthHeaders(headers) {
    const authHeader = headers.get("Authorization");
    if (!authHeader)
      return;
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new Error("Invalid auth header received");
    }
    this.cachedToken = token;
    this.tokenExpiry = getJwtExpiry(token);
  }
};
_authTokenCallback = new WeakMap();
var _apiKey, _userId, _workspaceId;
var AssistantCloudAPIKeyAuthStrategy = class {
  constructor(apiKey, userId, workspaceId) {
    __publicField(this, "strategy", "api-key");
    __privateAdd(this, _apiKey);
    __privateAdd(this, _userId);
    __privateAdd(this, _workspaceId);
    __privateSet(this, _apiKey, apiKey);
    __privateSet(this, _userId, userId);
    __privateSet(this, _workspaceId, workspaceId);
  }
  async getAuthHeaders() {
    return {
      Authorization: `Bearer ${__privateGet(this, _apiKey)}`,
      "Aui-User-Id": __privateGet(this, _userId),
      "Aui-Workspace-Id": __privateGet(this, _workspaceId)
    };
  }
  readAuthHeaders() {
  }
};
_apiKey = new WeakMap();
_userId = new WeakMap();
_workspaceId = new WeakMap();
var AUI_REFRESH_TOKEN_NAME = "aui:refresh_token";
var AssistantCloudAnonymousAuthStrategy = class {
  constructor(baseUrl2) {
    __publicField(this, "strategy", "anon");
    __publicField(this, "baseUrl");
    __publicField(this, "jwtStrategy");
    this.baseUrl = baseUrl2;
    this.jwtStrategy = new AssistantCloudJWTAuthStrategy(async () => {
      const currentTime = Date.now();
      const storedRefreshTokenJson = localStorage.getItem(AUI_REFRESH_TOKEN_NAME);
      const storedRefreshToken = storedRefreshTokenJson ? JSON.parse(storedRefreshTokenJson) : void 0;
      if (storedRefreshToken) {
        const refreshExpiry = new Date(storedRefreshToken.expires_at).getTime();
        if (refreshExpiry - currentTime > 30 * 1e3) {
          const response2 = await fetch(`${this.baseUrl}/v1/auth/tokens/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: storedRefreshToken.token })
          });
          if (response2.ok) {
            const data2 = await response2.json();
            const { access_token: access_token2, refresh_token: refresh_token2 } = data2;
            if (refresh_token2) {
              localStorage.setItem(AUI_REFRESH_TOKEN_NAME, JSON.stringify(refresh_token2));
            }
            return access_token2;
          }
        } else {
          localStorage.removeItem(AUI_REFRESH_TOKEN_NAME);
        }
      }
      const response = await fetch(`${this.baseUrl}/v1/auth/tokens/anonymous`, {
        method: "POST"
      });
      if (!response.ok)
        return null;
      const data = await response.json();
      const { access_token, refresh_token } = data;
      if (!access_token || !refresh_token)
        return null;
      localStorage.setItem(AUI_REFRESH_TOKEN_NAME, JSON.stringify(refresh_token));
      return access_token;
    });
  }
  async getAuthHeaders() {
    return this.jwtStrategy.getAuthHeaders();
  }
  readAuthHeaders(headers) {
    this.jwtStrategy.readAuthHeaders(headers);
  }
};

// ../../node_modules/.pnpm/assistant-cloud@0.1.25/node_modules/assistant-cloud/dist/AssistantCloudAPI.js
var CloudAPIError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "APIError";
  }
};
var AssistantCloudAPI = class {
  constructor(config) {
    __publicField(this, "_auth");
    __publicField(this, "_baseUrl");
    if ("authToken" in config) {
      this._baseUrl = config.baseUrl;
      this._auth = new AssistantCloudJWTAuthStrategy(config.authToken);
    } else if ("apiKey" in config) {
      this._baseUrl = "https://backend.assistant-api.com";
      this._auth = new AssistantCloudAPIKeyAuthStrategy(config.apiKey, config.userId, config.workspaceId);
    } else if ("anonymous" in config) {
      this._baseUrl = config.baseUrl;
      this._auth = new AssistantCloudAnonymousAuthStrategy(config.baseUrl);
    } else {
      throw new Error("Invalid configuration: Must provide authToken, apiKey, or anonymous configuration");
    }
  }
  async initializeAuth() {
    return !!this._auth.getAuthHeaders();
  }
  async makeRawRequest(endpoint, options = {}) {
    const authHeaders = await this._auth.getAuthHeaders();
    if (!authHeaders)
      throw new Error("Authorization failed");
    const headers = {
      ...authHeaders,
      ...options.headers,
      "Content-Type": "application/json"
    };
    const queryParams = new URLSearchParams();
    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === false)
          continue;
        if (value === true) {
          queryParams.set(key, "true");
        } else {
          queryParams.set(key, value.toString());
        }
      }
    }
    const url = new URL(`${this._baseUrl}/v1${endpoint}`);
    url.search = queryParams.toString();
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : null
    });
    this._auth.readAuthHeaders(response.headers);
    if (!response.ok) {
      const text = await response.text();
      try {
        const body = JSON.parse(text);
        throw new CloudAPIError(body.message);
      } catch (error) {
        if (error instanceof CloudAPIError)
          throw error;
        throw new Error(`Request failed with status ${response.status}, ${text}`);
      }
    }
    return response;
  }
  async makeRequest(endpoint, options = {}) {
    const response = await this.makeRawRequest(endpoint, options);
    return response.json();
  }
};

// ../../node_modules/.pnpm/assistant-cloud@0.1.25/node_modules/assistant-cloud/dist/AssistantCloudAuthTokens.js
var AssistantCloudAuthTokens = class {
  constructor(cloud) {
    __publicField(this, "cloud");
    this.cloud = cloud;
  }
  async create() {
    return this.cloud.makeRequest("/auth/tokens", { method: "POST" });
  }
};

// ../../node_modules/.pnpm/assistant-cloud@0.1.25/node_modules/assistant-cloud/dist/AssistantCloudRuns.js
var AssistantCloudRuns = class {
  constructor(cloud) {
    __publicField(this, "cloud");
    this.cloud = cloud;
  }
  __internal_getAssistantOptions(assistantId) {
    return {
      api: `${this.cloud._baseUrl}/v1/runs/stream`,
      headers: async () => {
        const headers = await this.cloud._auth.getAuthHeaders();
        if (!headers)
          throw new Error("Authorization failed");
        return {
          ...headers,
          Accept: "text/plain"
        };
      },
      body: {
        assistant_id: assistantId,
        response_format: "vercel-ai-data-stream/v1",
        thread_id: "unstable_todo"
      }
    };
  }
  async stream(body) {
    const response = await this.cloud.makeRawRequest("/runs/stream", {
      method: "POST",
      headers: {
        Accept: "text/plain"
      },
      body
    });
    return AssistantStream.fromResponse(response, new PlainTextDecoder());
  }
  async report(body) {
    return this.cloud.makeRequest("/runs", { method: "POST", body });
  }
};

// ../../node_modules/.pnpm/assistant-cloud@0.1.25/node_modules/assistant-cloud/dist/AssistantCloudThreadMessages.js
var AssistantCloudThreadMessages = class {
  constructor(cloud) {
    __publicField(this, "cloud");
    this.cloud = cloud;
  }
  async list(threadId, query) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(threadId)}/messages`, { query });
  }
  async create(threadId, body) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(threadId)}/messages`, { method: "POST", body });
  }
  async update(threadId, messageId, body) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(threadId)}/messages/${encodeURIComponent(messageId)}`, { method: "PUT", body });
  }
};

// ../../node_modules/.pnpm/assistant-cloud@0.1.25/node_modules/assistant-cloud/dist/AssistantCloudThreads.js
var AssistantCloudThreads = class {
  constructor(cloud) {
    __publicField(this, "cloud");
    __publicField(this, "messages");
    this.cloud = cloud;
    this.messages = new AssistantCloudThreadMessages(cloud);
  }
  async list(query) {
    return this.cloud.makeRequest("/threads", { query });
  }
  async get(threadId) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(threadId)}`);
  }
  async create(body) {
    return this.cloud.makeRequest("/threads", { method: "POST", body });
  }
  async update(threadId, body) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(threadId)}`, {
      method: "PUT",
      body
    });
  }
  async delete(threadId) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(threadId)}`, {
      method: "DELETE"
    });
  }
};

// ../../node_modules/.pnpm/assistant-cloud@0.1.25/node_modules/assistant-cloud/dist/AssistantCloudFiles.js
var AssistantCloudFiles = class {
  constructor(cloud) {
    __publicField(this, "cloud");
    this.cloud = cloud;
  }
  async pdfToImages(body) {
    return this.cloud.makeRequest("/files/pdf-to-images", {
      method: "POST",
      body
    });
  }
  async generatePresignedUploadUrl(body) {
    return this.cloud.makeRequest("/files/attachments/generate-presigned-upload-url", {
      method: "POST",
      body
    });
  }
};

// ../../node_modules/.pnpm/assistant-cloud@0.1.25/node_modules/assistant-cloud/dist/AssistantCloud.js
var AssistantCloud = class {
  constructor(config) {
    __publicField(this, "threads");
    __publicField(this, "auth");
    __publicField(this, "runs");
    __publicField(this, "files");
    __publicField(this, "telemetry");
    const api = new AssistantCloudAPI(config);
    this.threads = new AssistantCloudThreads(api);
    this.auth = {
      tokens: new AssistantCloudAuthTokens(api)
    };
    this.runs = new AssistantCloudRuns(api);
    this.files = new AssistantCloudFiles(api);
    const t = config.telemetry;
    this.telemetry = t === false ? { enabled: false } : t === true || t === void 0 ? { enabled: true } : { enabled: t.enabled !== false, ...t };
  }
};

// ../../node_modules/.pnpm/assistant-cloud@0.1.25/node_modules/assistant-cloud/dist/CloudMessagePersistence.js
var CloudMessagePersistence = class {
  constructor(cloud) {
    __publicField(this, "cloud");
    __publicField(this, "idMapping", {});
    this.cloud = cloud;
  }
  /**
   * Persist a message to the cloud.
   *
   * @param threadId - Remote thread ID
   * @param messageId - Local message ID (used for tracking)
   * @param parentId - Local parent message ID (or null for first message)
   * @param format - Message format (e.g., "aui/v0", "ai-sdk/v6")
   * @param content - Message content (format-specific)
   */
  async append(threadId, messageId, parentId, format, content) {
    const resolvedParentId = parentId ? await this.idMapping[parentId] ?? parentId : null;
    const task = this.cloud.threads.messages.create(threadId, {
      parent_id: resolvedParentId,
      format,
      content
    }).then(({ message_id }) => {
      this.idMapping[messageId] = message_id;
      return message_id;
    }).catch((err) => {
      if (this.idMapping[messageId] === task) {
        delete this.idMapping[messageId];
      }
      throw err;
    });
    this.idMapping[messageId] = task;
    return task.then(() => {
    });
  }
  /**
   * Update an already-persisted message in the cloud.
   */
  async update(threadId, messageId, _format, content) {
    const remoteId = await this.getRemoteId(messageId);
    if (!remoteId)
      return;
    await this.cloud.threads.messages.update(threadId, remoteId, { content });
  }
  /**
   * Check if a message has been persisted (or is currently being persisted).
   */
  isPersisted(messageId) {
    return messageId in this.idMapping;
  }
  /**
   * Get the remote ID for a local message ID (resolved).
   * Returns undefined if not persisted.
   */
  async getRemoteId(messageId) {
    const entry = this.idMapping[messageId];
    if (!entry)
      return void 0;
    return entry;
  }
  /**
   * Load messages from the cloud and populate the ID mapping.
   *
   * The ID mapping is populated so that `isPersisted()` returns true for
   * loaded messages, preventing re-persistence of already-stored messages.
   *
   * @param threadId - Remote thread ID
   * @param format - Optional format filter
   * @returns Array of cloud messages
   */
  async load(threadId, format) {
    const { messages } = await this.cloud.threads.messages.list(threadId, format ? { format } : void 0);
    for (const m of messages) {
      this.idMapping[m.id] = m.id;
    }
    return messages;
  }
  /**
   * Reset the ID mapping (call when switching threads).
   */
  reset() {
    this.idMapping = {};
  }
};

// ../../node_modules/.pnpm/assistant-cloud@0.1.25/node_modules/assistant-cloud/dist/FormattedCloudPersistence.js
var createFormattedPersistence = (persistence, adapter) => ({
  append: async (threadId, item) => {
    const messageId = adapter.getId(item.message);
    const encoded = adapter.encode(item);
    return persistence.append(threadId, messageId, item.parentId, adapter.format, encoded);
  },
  update: persistence.update ? async (threadId, item, messageId) => {
    const encoded = adapter.encode(item);
    return persistence.update(threadId, messageId, adapter.format, encoded);
  } : void 0,
  load: async (threadId) => {
    const messages = await persistence.load(threadId, adapter.format);
    return {
      messages: messages.filter((m) => m.format === adapter.format).map((m) => adapter.decode({
        id: m.id,
        parent_id: m.parent_id,
        format: m.format,
        content: m.content
      })).reverse()
    };
  },
  isPersisted: (messageId) => persistence.isPersisted(messageId)
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/runtimes/remote-thread-list/adapter/in-memory.js
var InMemoryThreadListAdapter = class {
  list() {
    return Promise.resolve({
      threads: []
    });
  }
  rename() {
    return Promise.resolve();
  }
  archive() {
    return Promise.resolve();
  }
  unarchive() {
    return Promise.resolve();
  }
  delete() {
    return Promise.resolve();
  }
  initialize(threadId) {
    return Promise.resolve({ remoteId: threadId, externalId: void 0 });
  }
  generateTitle() {
    return Promise.resolve(new ReadableStream());
  }
  fetch(_threadId) {
    return Promise.reject(new Error("Thread not found"));
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/cloud/CloudFileAttachmentAdapter.js
var guessAttachmentType = (contentType) => {
  if (contentType.startsWith("image/"))
    return "image";
  if (contentType.startsWith("text/"))
    return "document";
  return "file";
};
var CloudFileAttachmentAdapter = class {
  constructor(cloud) {
    __publicField(this, "cloud");
    __publicField(this, "accept", "*");
    __publicField(this, "uploadedUrls", /* @__PURE__ */ new Map());
    this.cloud = cloud;
  }
  async *add({ file }) {
    const id = crypto.randomUUID();
    const type = guessAttachmentType(file.type);
    let attachment = {
      id,
      type,
      name: file.name,
      contentType: file.type,
      file,
      status: { type: "running", reason: "uploading", progress: 0 }
    };
    yield attachment;
    try {
      const { signedUrl, publicUrl } = await this.cloud.files.generatePresignedUploadUrl({
        filename: file.name
      });
      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type
        },
        mode: "cors"
      });
      this.uploadedUrls.set(id, publicUrl);
      attachment = {
        ...attachment,
        status: { type: "requires-action", reason: "composer-send" }
      };
      yield attachment;
    } catch {
      attachment = {
        ...attachment,
        status: { type: "incomplete", reason: "error" }
      };
      yield attachment;
    }
  }
  async remove(attachment) {
    this.uploadedUrls.delete(attachment.id);
  }
  async send(attachment) {
    const url = this.uploadedUrls.get(attachment.id);
    if (!url)
      throw new Error("Attachment not uploaded");
    this.uploadedUrls.delete(attachment.id);
    let content;
    if (attachment.type === "image") {
      content = [{ type: "image", image: url, filename: attachment.name }];
    } else {
      content = [
        {
          type: "file",
          data: url,
          mimeType: attachment.contentType ?? "",
          filename: attachment.name
        }
      ];
    }
    return {
      ...attachment,
      status: { type: "complete" },
      content
    };
  }
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/cloud/useCloudThreadListAdapter.js
var import_jsx_runtime14 = __toESM(require_jsx_runtime(), 1);
var import_react26 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/cloud/AssistantCloudThreadHistoryAdapter.js
var import_react25 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/utils/json/is-json.js
function isRecord(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}
function isJSONValue(value, currentDepth = 0) {
  if (currentDepth > 100) {
    return false;
  }
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return true;
  }
  if (typeof value === "number") {
    return !Number.isNaN(value) && Number.isFinite(value);
  }
  if (Array.isArray(value)) {
    return value.every((item) => isJSONValue(item, currentDepth + 1));
  }
  if (isRecord(value)) {
    return Object.entries(value).every(([key, val]) => typeof key === "string" && isJSONValue(val, currentDepth + 1));
  }
  return false;
}

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/cloud/auiV0.js
function auiV0Encode(message) {
  var _a2;
  const status = ((_a2 = message.status) == null ? void 0 : _a2.type) === "running" ? { type: "incomplete", reason: "cancelled" } : message.status;
  return {
    role: message.role,
    content: message.content.map((part) => {
      const type = part.type;
      switch (type) {
        case "text":
          return { type: "text", text: part.text };
        case "reasoning":
          return { type: "reasoning", text: part.text };
        case "source":
          return {
            type: "source",
            sourceType: part.sourceType,
            id: part.id,
            url: part.url,
            ...part.title ? { title: part.title } : void 0
          };
        case "tool-call": {
          if (!isJSONValue(part.result)) {
            console.warn(`tool-call result is not JSON! ${JSON.stringify(part)}`);
          }
          return {
            type: "tool-call",
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            ...JSON.stringify(part.args) === part.argsText ? { args: part.args } : { argsText: part.argsText },
            ...part.result ? { result: part.result } : void 0,
            ...part.isError ? { isError: true } : void 0
          };
        }
        case "image":
          return { type: "image", image: part.image };
        case "file":
          return {
            type: "file",
            data: part.data,
            mimeType: part.mimeType,
            ...part.filename ? { filename: part.filename } : void 0
          };
        default: {
          const unhandledType = type;
          throw new Error(`Message part type not supported by aui/v0: ${unhandledType}`);
        }
      }
    }),
    metadata: message.metadata,
    ...status ? { status } : void 0
  };
}
function auiV0Decode(cloudMessage) {
  const payload = cloudMessage.content;
  const message = fromThreadMessageLike({
    id: cloudMessage.id,
    createdAt: cloudMessage.created_at,
    ...payload
  }, cloudMessage.id, { type: "complete", reason: "unknown" });
  return {
    parentId: cloudMessage.parent_id,
    message
  };
}

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/cloud/AssistantCloudThreadHistoryAdapter.js
var globalPersistence = /* @__PURE__ */ new WeakMap();
var AssistantCloudThreadHistoryAdapter = class {
  constructor(cloudRef, aui) {
    __publicField(this, "cloudRef");
    __publicField(this, "aui");
    this.cloudRef = cloudRef;
    this.aui = aui;
  }
  get _persistence() {
    const key = this.aui.threadListItem();
    if (!globalPersistence.has(key)) {
      globalPersistence.set(key, new CloudMessagePersistence(this.cloudRef.current));
    }
    return globalPersistence.get(key);
  }
  withFormat(formatAdapter) {
    const adapter = this;
    const formatted = createFormattedPersistence(this._persistence, formatAdapter);
    return {
      // Note: callers must also call reportTelemetry() for run tracking
      async append(item) {
        const { remoteId } = await adapter.aui.threadListItem().initialize();
        await formatted.append(remoteId, item);
      },
      async update(item, localMessageId) {
        var _a2;
        const remoteId = adapter.aui.threadListItem().getState().remoteId;
        if (!remoteId)
          return;
        await ((_a2 = formatted.update) == null ? void 0 : _a2.call(formatted, remoteId, item, localMessageId));
      },
      reportTelemetry(items, options) {
        const encodedRunMessages = items.map((item) => formatAdapter.encode(item));
        adapter._reportRunTelemetry(formatAdapter.format, encodedRunMessages, options);
      },
      async load() {
        const remoteId = adapter.aui.threadListItem().getState().remoteId;
        if (!remoteId)
          return { messages: [] };
        return formatted.load(remoteId);
      }
    };
  }
  async append({ parentId, message }) {
    const { remoteId } = await this.aui.threadListItem().initialize();
    const encoded = auiV0Encode(message);
    await this._persistence.append(remoteId, message.id, parentId, "aui/v0", encoded);
    if (this.cloudRef.current.telemetry.enabled) {
      this._maybeReportRun(remoteId, "aui/v0", encoded);
    }
  }
  async load() {
    const remoteId = this.aui.threadListItem().getState().remoteId;
    if (!remoteId)
      return { messages: [] };
    const messages = await this._persistence.load(remoteId, "aui/v0");
    return {
      messages: messages.filter((m) => m.format === "aui/v0").map(auiV0Decode).reverse()
    };
  }
  _reportRunTelemetry(format, runMessages, options) {
    if (!this.cloudRef.current.telemetry.enabled)
      return;
    const remoteId = this.aui.threadListItem().getState().remoteId;
    if (!remoteId)
      return;
    const extracted = extractRunTelemetry(format, runMessages);
    if (!extracted)
      return;
    this._sendReport(remoteId, extracted, options == null ? void 0 : options.durationMs, options == null ? void 0 : options.stepTimestamps);
  }
  _maybeReportRun(remoteId, format, content) {
    const extracted = extractTelemetry(format, content);
    if (!extracted)
      return;
    this._sendReport(remoteId, extracted);
  }
  _sendReport(remoteId, data, durationMs, stepTimestamps) {
    const mergedSteps = mergeStepTimestamps(data.steps, stepTimestamps);
    const initial = {
      thread_id: remoteId,
      status: data.status,
      ...data.totalSteps != null ? { total_steps: data.totalSteps } : void 0,
      ...data.toolCalls ? { tool_calls: data.toolCalls } : void 0,
      ...mergedSteps ? { steps: mergedSteps } : void 0,
      ...data.inputTokens != null ? { input_tokens: data.inputTokens } : void 0,
      ...data.outputTokens != null ? { output_tokens: data.outputTokens } : void 0,
      ...data.reasoningTokens != null ? { reasoning_tokens: data.reasoningTokens } : void 0,
      ...data.cachedInputTokens != null ? { cached_input_tokens: data.cachedInputTokens } : void 0,
      ...durationMs != null ? { duration_ms: durationMs } : void 0,
      ...data.outputText != null ? { output_text: data.outputText } : void 0,
      ...data.metadata ? { metadata: data.metadata } : void 0,
      ...data.modelId ? { model_id: data.modelId } : void 0
    };
    const { beforeReport } = this.cloudRef.current.telemetry;
    const report = beforeReport ? beforeReport(initial) : initial;
    if (!report)
      return;
    this.cloudRef.current.runs.report(report).catch(() => {
    });
  }
};
var MAX_SPAN_CONTENT = 5e4;
function truncateStr(value) {
  if (value.length <= MAX_SPAN_CONTENT)
    return value;
  return value.slice(0, MAX_SPAN_CONTENT);
}
function safeStringify(value) {
  if (value == null)
    return void 0;
  try {
    return truncateStr(JSON.stringify(value));
  } catch {
    return void 0;
  }
}
var BASE64_PATTERN = /^[A-Za-z0-9+/]{100,}={0,2}$/;
function summarizeMcpResult(value) {
  if (value == null)
    return void 0;
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (Array.isArray(parsed)) {
      const summarized = parsed.map((item) => {
        if (item && typeof item === "object" && item.type) {
          if ((item.type === "image" || item.type === "audio") && typeof item.data === "string" && BASE64_PATTERN.test(item.data.slice(0, 200))) {
            const sizeKB = (item.data.length * 3 / 4 / 1024).toFixed(1);
            return { ...item, data: `[${item.type}: ${sizeKB}KB]` };
          }
        }
        return item;
      });
      return truncateStr(JSON.stringify(summarized));
    }
  } catch {
  }
  return safeStringify(value);
}
function buildToolCall(toolName, toolCallId, args, result, argsText, toolSource) {
  const call = {
    tool_name: toolName,
    tool_call_id: toolCallId
  };
  const toolArgs = argsText ?? safeStringify(args);
  if (toolArgs !== void 0)
    call.tool_args = toolArgs;
  const toolResult = toolSource === "mcp" ? summarizeMcpResult(result) : safeStringify(result);
  if (toolResult !== void 0)
    call.tool_result = toolResult;
  if (toolSource)
    call.tool_source = toolSource;
  return call;
}
function mergeStepTimestamps(steps, timestamps) {
  if (!timestamps)
    return steps;
  if (!steps)
    return timestamps.map((t) => ({ ...t }));
  const len = Math.min(steps.length, timestamps.length);
  return steps.map((s, i) => ({
    ...s,
    ...i < len ? timestamps[i] : void 0
  }));
}
function extractTelemetry(format, content) {
  switch (format) {
    case "aui/v0":
      return extractAuiV0(content);
    case "ai-sdk/v6":
      return extractAiSdkV6(content);
    default:
      return null;
  }
}
function extractRunTelemetry(format, runMessages) {
  if (format === "ai-sdk/v6") {
    return aggregateAiSdkV6RunSteps(runMessages);
  }
  for (let i = runMessages.length - 1; i >= 0; i--) {
    const result = extractTelemetry(format, runMessages[i]);
    if (result)
      return result;
  }
  return null;
}
var AUI_STATUS_MAP = {
  error: "error",
  incomplete: "incomplete"
};
function extractAuiV0(content) {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const msg = content;
  if (msg.role !== "assistant")
    return null;
  const toolCalls = (_a2 = msg.content) == null ? void 0 : _a2.filter((p) => p.type === "tool-call" && p.toolName && p.toolCallId).map((p) => buildToolCall(p.toolName, p.toolCallId, p.args, p.result, p.argsText));
  const textParts = (_b = msg.content) == null ? void 0 : _b.filter((p) => p.type === "text" && p.text);
  const outputText = textParts && textParts.length > 0 ? truncateStr(textParts.map((p) => p.text).join("")) : void 0;
  const steps = (_c = msg.metadata) == null ? void 0 : _c.steps;
  let inputTokens;
  let outputTokens;
  let reasoningTokens;
  let cachedInputTokens;
  if (steps && steps.length > 0) {
    let totalInput = 0;
    let totalOutput = 0;
    let totalReasoning = 0;
    let totalCachedInput = 0;
    let hasInput = false;
    let hasOutput = false;
    let hasReasoning = false;
    let hasCachedInput = false;
    for (const step of steps) {
      if (((_d = step.usage) == null ? void 0 : _d.inputTokens) != null) {
        totalInput += step.usage.inputTokens;
        hasInput = true;
      }
      if (((_e = step.usage) == null ? void 0 : _e.outputTokens) != null) {
        totalOutput += step.usage.outputTokens;
        hasOutput = true;
      }
      if (((_f = step.usage) == null ? void 0 : _f.reasoningTokens) != null) {
        totalReasoning += step.usage.reasoningTokens;
        hasReasoning = true;
      }
      if (((_g = step.usage) == null ? void 0 : _g.cachedInputTokens) != null) {
        totalCachedInput += step.usage.cachedInputTokens;
        hasCachedInput = true;
      }
    }
    inputTokens = hasInput ? totalInput : void 0;
    outputTokens = hasOutput ? totalOutput : void 0;
    reasoningTokens = hasReasoning ? totalReasoning : void 0;
    cachedInputTokens = hasCachedInput ? totalCachedInput : void 0;
  }
  const statusType = (_h = msg.status) == null ? void 0 : _h.type;
  const status = statusType && AUI_STATUS_MAP[statusType] || "completed";
  const metadata = (_i = msg.metadata) == null ? void 0 : _i.custom;
  const modelId = ((_j = msg.metadata) == null ? void 0 : _j.modelId) ?? (typeof ((_l = (_k = msg.metadata) == null ? void 0 : _k.custom) == null ? void 0 : _l.modelId) === "string" ? msg.metadata.custom.modelId : void 0);
  const telemetrySteps = steps && steps.length > 1 ? steps.map((s) => {
    var _a3, _b2, _c2, _d2;
    return {
      ...((_a3 = s.usage) == null ? void 0 : _a3.inputTokens) != null ? { input_tokens: s.usage.inputTokens } : void 0,
      ...((_b2 = s.usage) == null ? void 0 : _b2.outputTokens) != null ? { output_tokens: s.usage.outputTokens } : void 0,
      ...((_c2 = s.usage) == null ? void 0 : _c2.reasoningTokens) != null ? { reasoning_tokens: s.usage.reasoningTokens } : void 0,
      ...((_d2 = s.usage) == null ? void 0 : _d2.cachedInputTokens) != null ? { cached_input_tokens: s.usage.cachedInputTokens } : void 0
    };
  }) : void 0;
  return {
    status,
    ...toolCalls && toolCalls.length > 0 ? { toolCalls } : void 0,
    ...(steps == null ? void 0 : steps.length) ? { totalSteps: steps.length } : void 0,
    ...inputTokens != null ? { inputTokens } : void 0,
    ...outputTokens != null ? { outputTokens } : void 0,
    ...reasoningTokens != null ? { reasoningTokens } : void 0,
    ...cachedInputTokens != null ? { cachedInputTokens } : void 0,
    ...outputText != null ? { outputText } : void 0,
    ...metadata ? { metadata } : void 0,
    ...telemetrySteps ? { steps: telemetrySteps } : void 0,
    ...modelId ? { modelId } : void 0
  };
}
function isToolCallPart(p) {
  if (!p.toolCallId)
    return false;
  if (p.type === "tool-call" || p.type === "dynamic-tool")
    return !!p.toolName;
  return p.type.startsWith("tool-") || p.type.startsWith("dynamic-tool-");
}
function isDynamicToolPart(p) {
  return p.type === "dynamic-tool" || p.type.startsWith("dynamic-tool-");
}
function partToToolCall(p) {
  const toolSource = isDynamicToolPart(p) ? "mcp" : void 0;
  return buildToolCall(p.toolName ?? p.type.slice(5), p.toolCallId, p.args ?? p.input, p.result ?? p.output, void 0, toolSource);
}
function collectAiSdkV6Parts(parts) {
  const textParts = [];
  const toolCalls = [];
  const stepsData = [];
  let currentStepToolCalls = null;
  for (const p of parts) {
    if (p.type === "step-start") {
      if (currentStepToolCalls !== null) {
        stepsData.push({ tool_calls: currentStepToolCalls });
      }
      currentStepToolCalls = [];
    } else if (p.type === "text" && p.text) {
      textParts.push(p.text);
    } else if (isToolCallPart(p)) {
      const tc = partToToolCall(p);
      toolCalls.push(tc);
      if (currentStepToolCalls !== null) {
        currentStepToolCalls.push(tc);
      }
    }
  }
  if (currentStepToolCalls !== null) {
    stepsData.push({ tool_calls: currentStepToolCalls });
  }
  return { textParts, toolCalls, stepsData };
}
function extractModelId(metadata) {
  if (!metadata)
    return void 0;
  if (typeof metadata.modelId === "string")
    return metadata.modelId;
  const custom = metadata.custom;
  if (typeof (custom == null ? void 0 : custom.modelId) === "string")
    return custom.modelId;
  return void 0;
}
function buildAiSdkV6Result(textParts, toolCalls, totalSteps, metadata, stepsData, usage) {
  const hasText = textParts.length > 0;
  const outputText = hasText ? truncateStr(textParts.join("")) : void 0;
  const modelId = extractModelId(metadata);
  const steps = stepsData && stepsData.length > 1 ? stepsData.map((s) => ({
    ...s.tool_calls.length > 0 ? { tool_calls: s.tool_calls } : void 0
  })) : void 0;
  return {
    status: hasText ? "completed" : "incomplete",
    ...toolCalls.length > 0 ? { toolCalls } : void 0,
    ...totalSteps > 0 ? { totalSteps } : void 0,
    ...(usage == null ? void 0 : usage.inputTokens) != null ? { inputTokens: usage.inputTokens } : void 0,
    ...(usage == null ? void 0 : usage.outputTokens) != null ? { outputTokens: usage.outputTokens } : void 0,
    ...(usage == null ? void 0 : usage.reasoningTokens) != null ? { reasoningTokens: usage.reasoningTokens } : void 0,
    ...(usage == null ? void 0 : usage.cachedInputTokens) != null ? { cachedInputTokens: usage.cachedInputTokens } : void 0,
    ...outputText != null ? { outputText } : void 0,
    ...metadata ? { metadata } : void 0,
    ...steps ? { steps } : void 0,
    ...modelId ? { modelId } : void 0
  };
}
function normalizeUsage(u) {
  const input = u.inputTokens ?? u.promptTokens;
  const output = u.outputTokens ?? u.completionTokens;
  if (input == null && output == null && u.reasoningTokens == null && u.cachedInputTokens == null) {
    return void 0;
  }
  return {
    ...input != null ? { inputTokens: input } : void 0,
    ...output != null ? { outputTokens: output } : void 0,
    ...u.reasoningTokens != null ? { reasoningTokens: u.reasoningTokens } : void 0,
    ...u.cachedInputTokens != null ? { cachedInputTokens: u.cachedInputTokens } : void 0
  };
}
function extractAiSdkV6Usage(metadata) {
  const usage = metadata == null ? void 0 : metadata.usage;
  if (usage) {
    const normalized = normalizeUsage(usage);
    if (normalized)
      return normalized;
  }
  const steps = metadata == null ? void 0 : metadata.steps;
  if (steps && steps.length > 0) {
    let inputTokens = 0;
    let outputTokens = 0;
    let reasoningTokens = 0;
    let cachedInputTokens = 0;
    let hasInput = false;
    let hasOutput = false;
    let hasReasoning = false;
    let hasCachedInput = false;
    let hasAny = false;
    for (const s of steps) {
      if (!s.usage)
        continue;
      const n = normalizeUsage(s.usage);
      if (n) {
        if (n.inputTokens != null) {
          inputTokens += n.inputTokens;
          hasInput = true;
        }
        if (n.outputTokens != null) {
          outputTokens += n.outputTokens;
          hasOutput = true;
        }
        if (n.reasoningTokens != null) {
          reasoningTokens += n.reasoningTokens;
          hasReasoning = true;
        }
        if (n.cachedInputTokens != null) {
          cachedInputTokens += n.cachedInputTokens;
          hasCachedInput = true;
        }
        hasAny = true;
      }
    }
    if (hasAny) {
      return {
        ...hasInput ? { inputTokens } : void 0,
        ...hasOutput ? { outputTokens } : void 0,
        ...hasReasoning ? { reasoningTokens } : void 0,
        ...hasCachedInput ? { cachedInputTokens } : void 0
      };
    }
  }
  return void 0;
}
function extractAiSdkV6(content) {
  const msg = content;
  if (msg.role !== "assistant")
    return null;
  const { textParts, toolCalls, stepsData } = collectAiSdkV6Parts(msg.parts ?? []);
  return buildAiSdkV6Result(textParts, toolCalls, stepsData.length, msg.metadata, stepsData, extractAiSdkV6Usage(msg.metadata));
}
function aggregateAiSdkV6RunSteps(stepMessages) {
  const allTextParts = [];
  const allToolCalls = [];
  const allStepsData = [];
  let hasAssistant = false;
  let metadata;
  let inputTokens = 0;
  let outputTokens = 0;
  let reasoningTokens = 0;
  let cachedInputTokens = 0;
  let hasInput = false;
  let hasOutput = false;
  let hasReasoning = false;
  let hasCachedInput = false;
  for (const content of stepMessages) {
    const msg = content;
    if (msg.role !== "assistant")
      continue;
    hasAssistant = true;
    const { textParts, toolCalls, stepsData } = collectAiSdkV6Parts(msg.parts ?? []);
    allTextParts.push(...textParts);
    allToolCalls.push(...toolCalls);
    allStepsData.push(...stepsData);
    if (msg.metadata)
      metadata = msg.metadata;
    const usage = extractAiSdkV6Usage(msg.metadata);
    if (usage) {
      if (usage.inputTokens != null) {
        inputTokens += usage.inputTokens;
        hasInput = true;
      }
      if (usage.outputTokens != null) {
        outputTokens += usage.outputTokens;
        hasOutput = true;
      }
      if (usage.reasoningTokens != null) {
        reasoningTokens += usage.reasoningTokens;
        hasReasoning = true;
      }
      if (usage.cachedInputTokens != null) {
        cachedInputTokens += usage.cachedInputTokens;
        hasCachedInput = true;
      }
    }
  }
  if (!hasAssistant)
    return null;
  return buildAiSdkV6Result(allTextParts, allToolCalls, allStepsData.length, metadata, allStepsData, {
    ...hasInput ? { inputTokens } : void 0,
    ...hasOutput ? { outputTokens } : void 0,
    ...hasReasoning ? { reasoningTokens } : void 0,
    ...hasCachedInput ? { cachedInputTokens } : void 0
  });
}
function useAssistantCloudThreadHistoryAdapter(cloudRef) {
  const aui = useAui();
  const [adapter] = (0, import_react25.useState)(() => new AssistantCloudThreadHistoryAdapter(cloudRef, aui));
  return adapter;
}

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/cloud/useCloudThreadListAdapter.js
var _a;
var baseUrl = typeof process !== "undefined" && ((_a = process == null ? void 0 : process.env) == null ? void 0 : _a["NEXT_PUBLIC_ASSISTANT_BASE_URL"]);
var autoCloud = baseUrl ? new AssistantCloud({ baseUrl, anonymous: true }) : void 0;
var useCloudThreadListAdapter = (adapter) => {
  const adapterRef = (0, import_react26.useRef)(adapter);
  (0, import_react26.useEffect)(() => {
    adapterRef.current = adapter;
  }, [adapter]);
  const unstable_Provider = (0, import_react26.useCallback)(function Provider({ children }) {
    const history = useAssistantCloudThreadHistoryAdapter({
      get current() {
        return adapterRef.current.cloud ?? autoCloud;
      }
    });
    const cloudInstance = adapterRef.current.cloud ?? autoCloud;
    const attachments = (0, import_react26.useMemo)(() => new CloudFileAttachmentAdapter(cloudInstance), [cloudInstance]);
    const adapters = (0, import_react26.useMemo)(() => ({
      history,
      attachments
    }), [history, attachments]);
    return (0, import_jsx_runtime14.jsx)(RuntimeAdapterProvider, { adapters, children });
  }, []);
  const cloud = adapter.cloud ?? autoCloud;
  if (!cloud) {
    const ref = adapterRef;
    const inMemory = new InMemoryThreadListAdapter();
    inMemory.initialize = async (threadId) => {
      var _a2, _b;
      const result = await ((_b = (_a2 = ref.current).create) == null ? void 0 : _b.call(_a2));
      return { remoteId: threadId, externalId: result == null ? void 0 : result.externalId };
    };
    return inMemory;
  }
  return {
    list: async () => {
      const { threads } = await cloud.threads.list();
      return {
        threads: threads.map((t) => ({
          status: t.is_archived ? "archived" : "regular",
          remoteId: t.id,
          title: t.title,
          externalId: t.external_id ?? void 0
        }))
      };
    },
    initialize: async () => {
      var _a2;
      const createTask = ((_a2 = adapter.create) == null ? void 0 : _a2.call(adapter)) ?? Promise.resolve();
      const t = await createTask;
      const external_id = t ? t.externalId : void 0;
      const { thread_id: remoteId } = await cloud.threads.create({
        last_message_at: /* @__PURE__ */ new Date(),
        external_id
      });
      return { externalId: external_id, remoteId };
    },
    rename: async (threadId, newTitle) => {
      return cloud.threads.update(threadId, { title: newTitle });
    },
    archive: async (threadId) => {
      return cloud.threads.update(threadId, { is_archived: true });
    },
    unarchive: async (threadId) => {
      return cloud.threads.update(threadId, { is_archived: false });
    },
    delete: async (threadId) => {
      var _a2;
      await ((_a2 = adapter.delete) == null ? void 0 : _a2.call(adapter, threadId));
      return cloud.threads.delete(threadId);
    },
    generateTitle: async (threadId, messages) => {
      const filteredMessages = messages.map((msg) => ({
        ...msg,
        content: msg.content.filter((part) => part.type === "text" || part.type === "tool-call")
      }));
      return cloud.runs.stream({
        thread_id: threadId,
        assistant_id: "system/thread_title",
        messages: filteredMessages
      });
    },
    fetch: async (threadId) => {
      const thread = await cloud.threads.get(threadId);
      return {
        status: thread.is_archived ? "archived" : "regular",
        remoteId: thread.id,
        title: thread.title,
        externalId: thread.external_id ?? void 0
      };
    },
    unstable_Provider
  };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useVoice.js
var import_react27 = __toESM(require_react(), 1);
var useVoiceState = () => {
  return useAuiState((s) => s.thread.voice);
};
var getServerVolume = () => 0;
var useVoiceVolume = () => {
  const aui = useAui();
  const thread = aui.thread();
  return (0, import_react27.useSyncExternalStore)(thread.subscribeVoiceVolume, thread.getVoiceVolume, getServerVolume);
};
var useVoiceControls = () => {
  const aui = useAui();
  const connect = (0, import_react27.useCallback)(() => {
    aui.thread().connectVoice();
  }, [aui]);
  const disconnect = (0, import_react27.useCallback)(() => {
    aui.thread().disconnectVoice();
  }, [aui]);
  const mute = (0, import_react27.useCallback)(() => {
    aui.thread().muteVoice();
  }, [aui]);
  const unmute = (0, import_react27.useCallback)(() => {
    aui.thread().unmuteVoice();
  }, [aui]);
  return { connect, disconnect, mute, unmute };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/useLocalRuntime.js
var import_react28 = __toESM(require_react(), 1);
var useLocalThreadRuntime = (chatModel, { initialMessages, ...options }) => {
  const { modelContext, ...threadListAdapters } = useRuntimeAdapters() ?? {};
  const opt = {
    ...options,
    adapters: {
      ...threadListAdapters,
      ...options.adapters,
      chatModel
    }
  };
  const [runtime] = (0, import_react28.useState)(() => new LocalRuntimeCore(opt, initialMessages));
  const threadIdRef = (0, import_react28.useRef)(void 0);
  threadIdRef.current = useAuiState((s) => s.threadListItem.remoteId);
  (0, import_react28.useEffect)(() => {
    runtime.threads.getMainThreadRuntimeCore().__internal_setGetThreadId(() => threadIdRef.current);
  }, [runtime]);
  (0, import_react28.useEffect)(() => {
    return () => {
      runtime.threads.getMainThreadRuntimeCore().detach();
    };
  }, [runtime]);
  (0, import_react28.useEffect)(() => {
    runtime.threads.getMainThreadRuntimeCore().__internal_setOptions(opt);
    runtime.threads.getMainThreadRuntimeCore().__internal_load();
  });
  (0, import_react28.useEffect)(() => {
    if (!modelContext)
      return void 0;
    return runtime.registerModelContextProvider(modelContext);
  }, [modelContext, runtime]);
  return (0, import_react28.useMemo)(() => new AssistantRuntimeImpl(runtime), [runtime]);
};
var splitLocalRuntimeOptions = (options) => {
  const { cloud, initialMessages, maxSteps, adapters, unstable_humanToolNames, ...rest } = options;
  return {
    localRuntimeOptions: {
      cloud,
      initialMessages,
      maxSteps,
      adapters,
      unstable_humanToolNames
    },
    otherOptions: rest
  };
};
var useLocalRuntime = (chatModel, { cloud, ...options } = {}) => {
  const cloudAdapter = useCloudThreadListAdapter({ cloud });
  return useRemoteThreadListRuntime({
    runtimeHook: function RuntimeHook() {
      return useLocalThreadRuntime(chatModel, options);
    },
    adapter: cloudAdapter,
    allowNesting: true
  });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/ChainOfThoughtPartByIndexProvider.js
var import_jsx_runtime15 = __toESM(require_jsx_runtime(), 1);
var ChainOfThoughtPartByIndexProvider = ({ index, children }) => {
  const aui = useAui({
    part: Derived({
      source: "chainOfThought",
      query: { type: "index", index },
      get: (aui2) => aui2.chainOfThought().part({ index })
    })
  });
  return (0, import_jsx_runtime15.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/providers/QueueItemByIndexProvider.js
var import_jsx_runtime16 = __toESM(require_jsx_runtime(), 1);
var QueueItemByIndexProvider = ({ index, children }) => {
  const aui = useAui({
    queueItem: Derived({
      source: "composer",
      query: { index },
      get: (aui2) => aui2.composer().queueItem({ index })
    })
  });
  return (0, import_jsx_runtime16.jsx)(AuiProvider, { value: aui, children });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/RuntimeAdapter.js
var RuntimeAdapter = resource((runtime) => tapResource(RuntimeAdapterResource(runtime)));
attachTransformScopes(RuntimeAdapter, (scopes, parent) => {
  baseRuntimeAdapterTransformScopes(scopes, parent);
  if (!scopes.tools && parent.tools.source === null) {
    scopes.tools = Tools({});
  }
  if (!scopes.dataRenderers && parent.dataRenderers.source === null) {
    scopes.dataRenderers = DataRenderers();
  }
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/useToolInvocations.js
var import_react29 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/utils/json/is-json-equal.js
var MAX_JSON_DEPTH = 100;
var isJSONValueEqualAtDepth = (a, b, currentDepth) => {
  if (a === b)
    return true;
  if (currentDepth > MAX_JSON_DEPTH)
    return false;
  if (a == null || b == null)
    return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length)
      return false;
    return a.every((item, index) => isJSONValueEqualAtDepth(item, b[index], currentDepth + 1));
  }
  if (Array.isArray(b))
    return false;
  if (!isRecord(a) || !isRecord(b))
    return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length)
    return false;
  return aKeys.every((key) => Object.hasOwn(b, key) && isJSONValueEqualAtDepth(a[key], b[key], currentDepth + 1));
};
var isJSONValueEqual = (a, b) => {
  if (!isJSONValue(a) || !isJSONValue(b))
    return false;
  return isJSONValueEqualAtDepth(a, b, 0);
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/runtimes/useToolInvocations.js
var isArgsTextComplete = (argsText) => {
  try {
    JSON.parse(argsText);
    return true;
  } catch {
    return false;
  }
};
var parseArgsText = (argsText) => {
  try {
    return JSON.parse(argsText);
  } catch {
    return void 0;
  }
};
var isEquivalentCompleteArgsText = (previous, next) => {
  const previousValue = parseArgsText(previous);
  const nextValue = parseArgsText(next);
  if (previousValue === void 0 || nextValue === void 0)
    return false;
  return isJSONValueEqual(previousValue, nextValue);
};
function useToolInvocations({ state, getTools, onResult, setToolStatuses }) {
  const lastToolStates = (0, import_react29.useRef)({});
  const humanInputRef = (0, import_react29.useRef)(/* @__PURE__ */ new Map());
  const acRef = (0, import_react29.useRef)(new AbortController());
  const executingCountRef = (0, import_react29.useRef)(0);
  const startedExecutionToolCallIdsRef = (0, import_react29.useRef)(/* @__PURE__ */ new Set());
  const settledResolversRef = (0, import_react29.useRef)([]);
  const toolCallIdAliasesRef = (0, import_react29.useRef)(/* @__PURE__ */ new Map());
  const ignoredResultToolCallIdsRef = (0, import_react29.useRef)(/* @__PURE__ */ new Set());
  const rewriteCounterRef = (0, import_react29.useRef)(0);
  const getLogicalToolCallId = (toolCallId) => {
    return toolCallIdAliasesRef.current.get(toolCallId) ?? toolCallId;
  };
  const shouldIgnoreAndCleanupResult = (toolCallId) => {
    if (!ignoredResultToolCallIdsRef.current.has(toolCallId))
      return false;
    ignoredResultToolCallIdsRef.current.delete(toolCallId);
    toolCallIdAliasesRef.current.delete(toolCallId);
    return true;
  };
  const getWrappedTools = () => {
    const tools = getTools();
    if (!tools)
      return void 0;
    return Object.fromEntries(Object.entries(tools).map(([name, tool]) => {
      const execute = tool.execute;
      const streamCall = tool.streamCall;
      const wrappedTool = {
        ...tool,
        ...execute !== void 0 && {
          execute: (...[args, context2]) => execute(args, {
            ...context2,
            toolCallId: getLogicalToolCallId(context2.toolCallId)
          })
        },
        ...streamCall !== void 0 && {
          streamCall: (...[reader, context2]) => streamCall(reader, {
            ...context2,
            toolCallId: getLogicalToolCallId(context2.toolCallId)
          })
        }
      };
      return [name, wrappedTool];
    }));
  };
  const [controller] = (0, import_react29.useState)(() => {
    const [stream, controller2] = createAssistantStreamController();
    const transform = toolResultStream(getWrappedTools, () => {
      var _a2;
      return ((_a2 = acRef.current) == null ? void 0 : _a2.signal) ?? new AbortController().signal;
    }, (toolCallId, payload) => {
      const logicalToolCallId = getLogicalToolCallId(toolCallId);
      return new Promise((resolve, reject) => {
        const previous = humanInputRef.current.get(logicalToolCallId);
        if (previous) {
          previous.reject(new Error("Human input request was superseded by a new request"));
        }
        humanInputRef.current.set(logicalToolCallId, { resolve, reject });
        setToolStatuses((prev) => ({
          ...prev,
          [logicalToolCallId]: {
            type: "interrupt",
            payload: { type: "human", payload }
          }
        }));
      });
    }, {
      onExecutionStart: (toolCallId) => {
        if (ignoredResultToolCallIdsRef.current.has(toolCallId)) {
          return;
        }
        startedExecutionToolCallIdsRef.current.add(toolCallId);
        const logicalToolCallId = getLogicalToolCallId(toolCallId);
        executingCountRef.current++;
        setToolStatuses((prev) => ({
          ...prev,
          [logicalToolCallId]: { type: "executing" }
        }));
      },
      onExecutionEnd: (toolCallId) => {
        const wasStarted = startedExecutionToolCallIdsRef.current.delete(toolCallId);
        if (ignoredResultToolCallIdsRef.current.has(toolCallId)) {
          if (wasStarted) {
            executingCountRef.current--;
            if (executingCountRef.current === 0) {
              settledResolversRef.current.forEach((resolve) => resolve());
              settledResolversRef.current = [];
            }
          }
          return;
        }
        if (!wasStarted) {
          return;
        }
        const logicalToolCallId = getLogicalToolCallId(toolCallId);
        executingCountRef.current--;
        setToolStatuses((prev) => {
          const next = { ...prev };
          delete next[logicalToolCallId];
          return next;
        });
        if (executingCountRef.current === 0) {
          settledResolversRef.current.forEach((resolve) => resolve());
          settledResolversRef.current = [];
        }
      }
    });
    stream.pipeThrough(transform).pipeThrough(new AssistantMetaTransformStream()).pipeTo(new WritableStream({
      write(chunk) {
        var _a2;
        if (chunk.type === "result") {
          if (shouldIgnoreAndCleanupResult(chunk.meta.toolCallId)) {
            return;
          }
          const logicalToolCallId = getLogicalToolCallId(chunk.meta.toolCallId);
          if (logicalToolCallId !== chunk.meta.toolCallId) {
            toolCallIdAliasesRef.current.delete(chunk.meta.toolCallId);
          }
          if ((_a2 = lastToolStates.current[logicalToolCallId]) == null ? void 0 : _a2.hasResult)
            return;
          onResult({
            type: "add-tool-result",
            toolCallId: logicalToolCallId,
            toolName: chunk.meta.toolName,
            result: chunk.result,
            isError: chunk.isError,
            ...chunk.artifact && { artifact: chunk.artifact }
          });
        }
      }
    }));
    return controller2;
  });
  const ignoredToolIds = (0, import_react29.useRef)(/* @__PURE__ */ new Set());
  const isInitialState = (0, import_react29.useRef)(true);
  (0, import_react29.useEffect)(() => {
    const createToolState = ({ controller: controller2, streamToolCallId }) => ({
      argsText: "",
      hasResult: false,
      argsComplete: false,
      streamToolCallId,
      controller: controller2
    });
    const setToolState = (toolCallId, state2) => {
      lastToolStates.current[toolCallId] = state2;
      return state2;
    };
    const patchToolState = (toolCallId, state2, patch) => {
      return setToolState(toolCallId, { ...state2, ...patch });
    };
    const hasExecutableTool = (toolName) => {
      var _a2;
      const tool = (_a2 = getTools()) == null ? void 0 : _a2[toolName];
      return (tool == null ? void 0 : tool.execute) !== void 0 || (tool == null ? void 0 : tool.streamCall) !== void 0;
    };
    const shouldCloseArgsStream = ({ toolName, argsText, hasResult }) => {
      if (hasResult)
        return true;
      if (!hasExecutableTool(toolName)) {
        return !state.isRunning && isArgsTextComplete(argsText);
      }
      return isArgsTextComplete(argsText);
    };
    const restartToolArgsStream = ({ toolCallId, toolName, state: state2 }) => {
      ignoredResultToolCallIdsRef.current.add(state2.streamToolCallId);
      state2.controller.argsText.close();
      const streamToolCallId = `${toolCallId}:rewrite:${rewriteCounterRef.current++}`;
      toolCallIdAliasesRef.current.set(streamToolCallId, toolCallId);
      const toolCallController = controller.addToolCallPart({
        toolName,
        toolCallId: streamToolCallId
      });
      if (true) {
        console.warn("started replacement stream tool call", {
          toolCallId,
          streamToolCallId
        });
      }
      return setToolState(toolCallId, {
        ...createToolState({
          controller: toolCallController,
          streamToolCallId
        }),
        hasResult: state2.hasResult
      });
    };
    const processMessages = (messages) => {
      messages.forEach((message) => {
        message.content.forEach((content) => {
          if (content.type === "tool-call") {
            if (isInitialState.current) {
              ignoredToolIds.current.add(content.toolCallId);
            } else {
              if (ignoredToolIds.current.has(content.toolCallId)) {
                return;
              }
              let lastState = lastToolStates.current[content.toolCallId];
              if (!lastState) {
                if (content.result !== void 0) {
                  if (content.messages) {
                    processMessages(content.messages);
                  }
                  return;
                }
                toolCallIdAliasesRef.current.set(content.toolCallId, content.toolCallId);
                const toolCallController = controller.addToolCallPart({
                  toolName: content.toolName,
                  toolCallId: content.toolCallId
                });
                lastState = setToolState(content.toolCallId, createToolState({
                  controller: toolCallController,
                  streamToolCallId: content.toolCallId
                }));
              }
              if (content.argsText !== lastState.argsText) {
                let shouldWriteArgsText = true;
                if (lastState.argsComplete) {
                  if (isEquivalentCompleteArgsText(lastState.argsText, content.argsText)) {
                    lastState = patchToolState(content.toolCallId, lastState, {
                      argsText: content.argsText
                    });
                    shouldWriteArgsText = false;
                  }
                  if (shouldWriteArgsText) {
                    const canRestartClosedArgsStream = !lastState.hasResult && !startedExecutionToolCallIdsRef.current.has(lastState.streamToolCallId);
                    if (true) {
                      console.warn(canRestartClosedArgsStream ? "argsText updated after controller was closed, restarting tool args stream:" : "argsText updated after controller was closed:", {
                        previous: lastState.argsText,
                        next: content.argsText
                      });
                    }
                    if (!canRestartClosedArgsStream) {
                      lastState = patchToolState(content.toolCallId, lastState, {
                        argsText: content.argsText
                      });
                      shouldWriteArgsText = false;
                    }
                  }
                  if (shouldWriteArgsText) {
                    lastState = restartToolArgsStream({
                      toolCallId: content.toolCallId,
                      toolName: content.toolName,
                      state: lastState
                    });
                  }
                } else if (!content.argsText.startsWith(lastState.argsText)) {
                  if (isArgsTextComplete(lastState.argsText) && isArgsTextComplete(content.argsText) && isEquivalentCompleteArgsText(lastState.argsText, content.argsText)) {
                    const shouldClose = shouldCloseArgsStream({
                      toolName: content.toolName,
                      argsText: content.argsText,
                      hasResult: content.result !== void 0
                    });
                    if (shouldClose) {
                      lastState.controller.argsText.close();
                    }
                    lastState = patchToolState(content.toolCallId, lastState, {
                      argsText: content.argsText,
                      argsComplete: shouldClose
                    });
                    shouldWriteArgsText = false;
                  }
                  if (shouldWriteArgsText) {
                    if (true) {
                      console.warn("argsText rewrote previous snapshot, restarting tool args stream:", {
                        previous: lastState.argsText,
                        next: content.argsText,
                        toolCallId: content.toolCallId
                      });
                    }
                    lastState = restartToolArgsStream({
                      toolCallId: content.toolCallId,
                      toolName: content.toolName,
                      state: lastState
                    });
                  }
                }
                if (shouldWriteArgsText) {
                  const argsTextDelta = content.argsText.slice(lastState.argsText.length);
                  lastState.controller.argsText.append(argsTextDelta);
                  const shouldClose = shouldCloseArgsStream({
                    toolName: content.toolName,
                    argsText: content.argsText,
                    hasResult: content.result !== void 0
                  });
                  if (shouldClose) {
                    lastState.controller.argsText.close();
                  }
                  lastState = patchToolState(content.toolCallId, lastState, {
                    argsText: content.argsText,
                    argsComplete: shouldClose
                  });
                }
              }
              if (!lastState.argsComplete) {
                const shouldClose = shouldCloseArgsStream({
                  toolName: content.toolName,
                  argsText: content.argsText,
                  hasResult: content.result !== void 0
                });
                if (shouldClose) {
                  lastState.controller.argsText.close();
                  lastState = patchToolState(content.toolCallId, lastState, {
                    argsText: content.argsText,
                    argsComplete: true
                  });
                }
              }
              if (content.result !== void 0 && !lastState.hasResult) {
                patchToolState(content.toolCallId, lastState, {
                  hasResult: true,
                  argsComplete: true
                });
                lastState.controller.setResponse(new ToolResponse({
                  result: content.result,
                  artifact: content.artifact,
                  isError: content.isError
                }));
                lastState.controller.close();
              }
            }
            if (content.messages) {
              processMessages(content.messages);
            }
          }
        });
      });
    };
    processMessages(state.messages);
    if (isInitialState.current) {
      isInitialState.current = false;
    }
  }, [state, controller, getTools]);
  const abort = () => {
    humanInputRef.current.forEach(({ reject }) => {
      reject(new Error("Tool execution aborted"));
    });
    humanInputRef.current.clear();
    acRef.current.abort();
    acRef.current = new AbortController();
    if (executingCountRef.current === 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      settledResolversRef.current.push(resolve);
    });
  };
  return {
    reset: () => {
      isInitialState.current = true;
      ignoredToolIds.current.clear();
      lastToolStates.current = {};
      void abort().finally(() => {
        startedExecutionToolCallIdsRef.current.clear();
        toolCallIdAliasesRef.current.clear();
        ignoredResultToolCallIdsRef.current.clear();
        rewriteCounterRef.current = 0;
      });
    },
    abort,
    resume: (toolCallId, payload) => {
      const handlers = humanInputRef.current.get(toolCallId);
      if (handlers) {
        humanInputRef.current.delete(toolCallId);
        setToolStatuses((prev) => ({
          ...prev,
          [toolCallId]: { type: "executing" }
        }));
        handlers.resolve(payload);
      } else {
        throw new Error(`Tool call ${toolCallId} is not waiting for human input`);
      }
    }
  };
}

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/AssistantProvider.js
var import_jsx_runtime17 = __toESM(require_jsx_runtime(), 1);
var import_react30 = __toESM(require_react(), 1);
var getRenderComponent = (runtime) => {
  var _a2;
  return (_a2 = runtime._core) == null ? void 0 : _a2.RenderComponent;
};
var AssistantProviderBase = (0, import_react30.memo)(({ runtime, aui: parent = null, children }) => {
  const aui = useAui({ threads: RuntimeAdapter(runtime) }, { parent });
  const RenderComponent = getRenderComponent(runtime);
  return (0, import_jsx_runtime17.jsxs)(AuiProvider, { value: aui, children: [RenderComponent && (0, import_jsx_runtime17.jsx)(RenderComponent, {}), children] });
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/thread/ThreadMessages.js
var import_jsx_runtime18 = __toESM(require_jsx_runtime(), 1);
var import_react31 = __toESM(require_react(), 1);
var isComponentsSame = (prev, next) => {
  return prev.Message === next.Message && prev.EditComposer === next.EditComposer && prev.UserEditComposer === next.UserEditComposer && prev.AssistantEditComposer === next.AssistantEditComposer && prev.SystemEditComposer === next.SystemEditComposer && prev.UserMessage === next.UserMessage && prev.AssistantMessage === next.AssistantMessage && prev.SystemMessage === next.SystemMessage;
};
var DEFAULT_SYSTEM_MESSAGE = () => null;
var getComponent = (components, role, isEditing) => {
  switch (role) {
    case "user":
      if (isEditing) {
        return components.UserEditComposer ?? components.EditComposer ?? components.UserMessage ?? components.Message;
      } else {
        return components.UserMessage ?? components.Message;
      }
    case "assistant":
      if (isEditing) {
        return components.AssistantEditComposer ?? components.EditComposer ?? components.AssistantMessage ?? components.Message;
      } else {
        return components.AssistantMessage ?? components.Message;
      }
    case "system":
      if (isEditing) {
        return components.SystemEditComposer ?? components.EditComposer ?? components.SystemMessage ?? components.Message;
      } else {
        return components.SystemMessage ?? components.Message ?? DEFAULT_SYSTEM_MESSAGE;
      }
    default:
      const _exhaustiveCheck = role;
      throw new Error(`Unknown message role: ${_exhaustiveCheck}`);
  }
};
var ThreadMessageComponent = ({ components }) => {
  const role = useAuiState((s) => s.message.role);
  const isEditing = useAuiState((s) => s.message.composer.isEditing);
  const Component = getComponent(components, role, isEditing);
  return (0, import_jsx_runtime18.jsx)(Component, {});
};
var ThreadPrimitiveMessageByIndex = (0, import_react31.memo)(({ index, components }) => {
  return (0, import_jsx_runtime18.jsx)(MessageByIndexProvider, { index, children: (0, import_jsx_runtime18.jsx)(ThreadMessageComponent, { components }) });
}, (prev, next) => prev.index === next.index && isComponentsSame(prev.components, next.components));
ThreadPrimitiveMessageByIndex.displayName = "ThreadPrimitive.MessageByIndex";
var ThreadPrimitiveMessagesInner = ({ children }) => {
  const messagesLength = useAuiState((s) => s.thread.messages.length);
  return (0, import_react31.useMemo)(() => {
    if (messagesLength === 0)
      return null;
    return Array.from({ length: messagesLength }, (_, index) => (0, import_jsx_runtime18.jsx)(MessageByIndexProvider, { index, children: (0, import_jsx_runtime18.jsx)(RenderChildrenWithAccessor, { getItemState: (aui) => aui.thread().message({ index }).getState(), children: (getItem) => children({
      get message() {
        return getItem();
      }
    }) }) }, index));
  }, [messagesLength, children]);
};
var ThreadPrimitiveMessagesImpl = ({ components, children }) => {
  if (components) {
    return (0, import_jsx_runtime18.jsx)(ThreadPrimitiveMessagesInner, { children: () => (0, import_jsx_runtime18.jsx)(ThreadMessageComponent, { components }) });
  }
  return (0, import_jsx_runtime18.jsx)(ThreadPrimitiveMessagesInner, { children });
};
ThreadPrimitiveMessagesImpl.displayName = "ThreadPrimitive.Messages";
var ThreadPrimitiveMessages = (0, import_react31.memo)(ThreadPrimitiveMessagesImpl, (prev, next) => {
  if (prev.children || next.children) {
    return prev.children === next.children;
  }
  return isComponentsSame(prev.components, next.components);
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/message/MessageParts.js
var import_jsx_runtime19 = __toESM(require_jsx_runtime(), 1);
var import_react33 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/utils/getMessageQuote.js
var getMessageQuote = (state) => {
  var _a2;
  const metadata = state.message.metadata;
  if (!metadata || typeof metadata !== "object")
    return void 0;
  return (_a2 = metadata.custom) == null ? void 0 : _a2.quote;
};

// ../../node_modules/.pnpm/zustand@5.0.12_@types+react@19.2.14_immer@11.1.4_react@19.2.4_use-sync-external-store@1.6.0_react@19.2.4_/node_modules/zustand/esm/vanilla/shallow.mjs
var isIterable = (obj) => Symbol.iterator in obj;
var hasIterableEntries = (value) => (
  // HACK: avoid checking entries type
  "entries" in value
);
var compareEntries = (valueA, valueB) => {
  const mapA = valueA instanceof Map ? valueA : new Map(valueA.entries());
  const mapB = valueB instanceof Map ? valueB : new Map(valueB.entries());
  if (mapA.size !== mapB.size) {
    return false;
  }
  for (const [key, value] of mapA) {
    if (!mapB.has(key) || !Object.is(value, mapB.get(key))) {
      return false;
    }
  }
  return true;
};
var compareIterables = (valueA, valueB) => {
  const iteratorA = valueA[Symbol.iterator]();
  const iteratorB = valueB[Symbol.iterator]();
  let nextA = iteratorA.next();
  let nextB = iteratorB.next();
  while (!nextA.done && !nextB.done) {
    if (!Object.is(nextA.value, nextB.value)) {
      return false;
    }
    nextA = iteratorA.next();
    nextB = iteratorB.next();
  }
  return !!nextA.done && !!nextB.done;
};
function shallow(valueA, valueB) {
  if (Object.is(valueA, valueB)) {
    return true;
  }
  if (typeof valueA !== "object" || valueA === null || typeof valueB !== "object" || valueB === null) {
    return false;
  }
  if (Object.getPrototypeOf(valueA) !== Object.getPrototypeOf(valueB)) {
    return false;
  }
  if (isIterable(valueA) && isIterable(valueB)) {
    if (hasIterableEntries(valueA) && hasIterableEntries(valueB)) {
      return compareEntries(valueA, valueB);
    }
    return compareIterables(valueA, valueB);
  }
  return compareEntries(
    { entries: () => Object.entries(valueA) },
    { entries: () => Object.entries(valueB) }
  );
}

// ../../node_modules/.pnpm/zustand@5.0.12_@types+react@19.2.14_immer@11.1.4_react@19.2.4_use-sync-external-store@1.6.0_react@19.2.4_/node_modules/zustand/esm/react/shallow.mjs
var import_react32 = __toESM(require_react(), 1);
function useShallow(selector) {
  const prev = import_react32.default.useRef(void 0);
  return (state) => {
    const next = selector(state);
    return shallow(prev.current, next) ? prev.current : prev.current = next;
  };
}

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/message/MessageParts.js
var createGroupState = (groupType) => {
  let start = -1;
  return {
    startGroup: (index) => {
      if (start === -1) {
        start = index;
      }
    },
    endGroup: (endIndex, ranges) => {
      if (start !== -1) {
        ranges.push({
          type: groupType,
          startIndex: start,
          endIndex
        });
        start = -1;
      }
    },
    finalize: (endIndex, ranges) => {
      if (start !== -1) {
        ranges.push({
          type: groupType,
          startIndex: start,
          endIndex
        });
      }
    }
  };
};
var groupMessageParts = (messageTypes, useChainOfThought) => {
  const ranges = [];
  if (useChainOfThought) {
    const chainOfThoughtGroup = createGroupState("chainOfThoughtGroup");
    for (let i = 0; i < messageTypes.length; i++) {
      const type = messageTypes[i];
      if (type === "tool-call" || type === "reasoning") {
        chainOfThoughtGroup.startGroup(i);
      } else {
        chainOfThoughtGroup.endGroup(i - 1, ranges);
        ranges.push({ type: "single", index: i });
      }
    }
    chainOfThoughtGroup.finalize(messageTypes.length - 1, ranges);
  } else {
    const toolGroup = createGroupState("toolGroup");
    const reasoningGroup = createGroupState("reasoningGroup");
    for (let i = 0; i < messageTypes.length; i++) {
      const type = messageTypes[i];
      if (type === "tool-call") {
        reasoningGroup.endGroup(i - 1, ranges);
        toolGroup.startGroup(i);
      } else if (type === "reasoning") {
        toolGroup.endGroup(i - 1, ranges);
        reasoningGroup.startGroup(i);
      } else {
        toolGroup.endGroup(i - 1, ranges);
        reasoningGroup.endGroup(i - 1, ranges);
        ranges.push({ type: "single", index: i });
      }
    }
    toolGroup.finalize(messageTypes.length - 1, ranges);
    reasoningGroup.finalize(messageTypes.length - 1, ranges);
  }
  return ranges;
};
var useMessagePartsGroups = (useChainOfThought) => {
  const messageTypes = useAuiState(useShallow((s) => s.message.parts.map((c) => c.type)));
  return (0, import_react33.useMemo)(() => {
    if (messageTypes.length === 0) {
      return [];
    }
    return groupMessageParts(messageTypes, useChainOfThought);
  }, [messageTypes, useChainOfThought]);
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
  return (0, import_jsx_runtime19.jsx)(Render, { ...props });
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
  return (0, import_jsx_runtime19.jsx)(Render, { ...props });
};
var defaultComponents = {
  Text: () => null,
  Reasoning: () => null,
  Source: () => null,
  Image: () => null,
  File: () => null,
  Unstable_Audio: () => null,
  ToolGroup: ({ children }) => children,
  ReasoningGroup: ({ children }) => children
};
var MessagePartComponent = ({ components: { Text = defaultComponents.Text, Reasoning = defaultComponents.Reasoning, Image = defaultComponents.Image, Source = defaultComponents.Source, File: File2 = defaultComponents.File, Unstable_Audio: Audio = defaultComponents.Unstable_Audio, tools = {}, data } = {} }) => {
  var _a2, _b, _c;
  const aui = useAui();
  const part = useAuiState((s) => s.part);
  const type = part.type;
  if (type === "tool-call") {
    const addResult = aui.part().addToolResult;
    const resume = aui.part().resumeToolCall;
    if ("Override" in tools)
      return (0, import_jsx_runtime19.jsx)(tools.Override, { ...part, addResult, resume });
    const Tool = ((_a2 = tools.by_name) == null ? void 0 : _a2[part.toolName]) ?? tools.Fallback;
    return (0, import_jsx_runtime19.jsx)(ToolUIDisplay, { ...part, Fallback: Tool, addResult, resume });
  }
  if (((_b = part.status) == null ? void 0 : _b.type) === "requires-action")
    throw new Error("Encountered unexpected requires-action status");
  switch (type) {
    case "text":
      return (0, import_jsx_runtime19.jsx)(Text, { ...part });
    case "reasoning":
      return (0, import_jsx_runtime19.jsx)(Reasoning, { ...part });
    case "source":
      return (0, import_jsx_runtime19.jsx)(Source, { ...part });
    case "image":
      return (0, import_jsx_runtime19.jsx)(Image, { ...part });
    case "file":
      return (0, import_jsx_runtime19.jsx)(File2, { ...part });
    case "audio":
      return (0, import_jsx_runtime19.jsx)(Audio, { ...part });
    case "data": {
      const Data = ((_c = data == null ? void 0 : data.by_name) == null ? void 0 : _c[part.name]) ?? (data == null ? void 0 : data.Fallback);
      return (0, import_jsx_runtime19.jsx)(DataUIDisplay, { ...part, Fallback: Data });
    }
    default:
      console.warn(`Unknown message part type: ${type}`);
      return null;
  }
};
var MessagePrimitivePartByIndex = (0, import_react33.memo)(({ index, components }) => {
  return (0, import_jsx_runtime19.jsx)(PartByIndexProvider, { index, children: (0, import_jsx_runtime19.jsx)(MessagePartComponent, { components }) });
}, (prev, next) => {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
  return prev.index === next.index && ((_a2 = prev.components) == null ? void 0 : _a2.Text) === ((_b = next.components) == null ? void 0 : _b.Text) && ((_c = prev.components) == null ? void 0 : _c.Reasoning) === ((_d = next.components) == null ? void 0 : _d.Reasoning) && ((_e = prev.components) == null ? void 0 : _e.Source) === ((_f = next.components) == null ? void 0 : _f.Source) && ((_g = prev.components) == null ? void 0 : _g.Image) === ((_h = next.components) == null ? void 0 : _h.Image) && ((_i = prev.components) == null ? void 0 : _i.File) === ((_j = next.components) == null ? void 0 : _j.File) && ((_k = prev.components) == null ? void 0 : _k.Unstable_Audio) === ((_l = next.components) == null ? void 0 : _l.Unstable_Audio) && ((_m = prev.components) == null ? void 0 : _m.tools) === ((_n = next.components) == null ? void 0 : _n.tools) && ((_o = prev.components) == null ? void 0 : _o.data) === ((_p = next.components) == null ? void 0 : _p.data) && ((_q = prev.components) == null ? void 0 : _q.ToolGroup) === ((_r = next.components) == null ? void 0 : _r.ToolGroup) && ((_s = prev.components) == null ? void 0 : _s.ReasoningGroup) === ((_t = next.components) == null ? void 0 : _t.ReasoningGroup);
});
MessagePrimitivePartByIndex.displayName = "MessagePrimitive.PartByIndex";
var EmptyPartFallback = ({ status, component: Component }) => {
  return (0, import_jsx_runtime19.jsx)(TextMessagePartProvider, { text: "", isRunning: status.type === "running", children: (0, import_jsx_runtime19.jsx)(Component, { type: "text", text: "", status }) });
};
var COMPLETE_STATUS3 = Object.freeze({
  type: "complete"
});
var EmptyPartsImpl = ({ components }) => {
  const status = useAuiState((s) => s.message.status ?? COMPLETE_STATUS3);
  if (components == null ? void 0 : components.Empty)
    return (0, import_jsx_runtime19.jsx)(components.Empty, { status });
  if (status.type !== "running")
    return null;
  return (0, import_jsx_runtime19.jsx)(EmptyPartFallback, { status, component: (components == null ? void 0 : components.Text) ?? defaultComponents.Text });
};
var EmptyParts = (0, import_react33.memo)(EmptyPartsImpl, (prev, next) => {
  var _a2, _b, _c, _d;
  return ((_a2 = prev.components) == null ? void 0 : _a2.Empty) === ((_b = next.components) == null ? void 0 : _b.Empty) && ((_c = prev.components) == null ? void 0 : _c.Text) === ((_d = next.components) == null ? void 0 : _d.Text);
});
var ConditionalEmptyImpl = ({ components, enabled }) => {
  const shouldShowEmpty = useAuiState((s) => {
    if (!enabled)
      return false;
    if (s.message.parts.length === 0)
      return false;
    const lastPart = s.message.parts[s.message.parts.length - 1];
    return (lastPart == null ? void 0 : lastPart.type) !== "text" && (lastPart == null ? void 0 : lastPart.type) !== "reasoning";
  });
  if (!shouldShowEmpty)
    return null;
  return (0, import_jsx_runtime19.jsx)(EmptyParts, { components });
};
var ConditionalEmpty = (0, import_react33.memo)(ConditionalEmptyImpl, (prev, next) => {
  var _a2, _b, _c, _d;
  return prev.enabled === next.enabled && ((_a2 = prev.components) == null ? void 0 : _a2.Empty) === ((_b = next.components) == null ? void 0 : _b.Empty) && ((_c = prev.components) == null ? void 0 : _c.Text) === ((_d = next.components) == null ? void 0 : _d.Text);
});
var QuoteRendererImpl = ({ Quote }) => {
  const quoteInfo = useAuiState(getMessageQuote);
  if (!quoteInfo)
    return null;
  return (0, import_jsx_runtime19.jsx)(Quote, { text: quoteInfo.text, messageId: quoteInfo.messageId });
};
var QuoteRenderer = (0, import_react33.memo)(QuoteRendererImpl);
var RegisteredToolUI = () => {
  const aui = useAui();
  const part = useAuiState((s) => s.part);
  const Render = useAuiState((s) => {
    if (s.part.type !== "tool-call")
      return null;
    const entry = s.tools.tools[s.part.toolName];
    if (Array.isArray(entry))
      return entry[0] ?? null;
    return entry ?? null;
  });
  if (!Render || part.type !== "tool-call")
    return null;
  return (0, import_jsx_runtime19.jsx)(Render, { ...part, addResult: aui.part().addToolResult, resume: aui.part().resumeToolCall });
};
var RegisteredDataRendererUI = () => {
  const part = useAuiState((s) => s.part);
  const Render = useAuiState((s) => {
    if (s.part.type !== "data")
      return null;
    const entry = s.dataRenderers.renderers[s.part.name];
    if (Array.isArray(entry))
      return entry[0] ?? null;
    return entry ?? null;
  });
  if (!Render || part.type !== "data")
    return null;
  return (0, import_jsx_runtime19.jsx)(Render, { ...part });
};
var DefaultPartFallback = () => {
  const partType = useAuiState((s) => s.part.type);
  if (partType === "tool-call")
    return (0, import_jsx_runtime19.jsx)(RegisteredToolUI, {});
  if (partType === "data")
    return (0, import_jsx_runtime19.jsx)(RegisteredDataRendererUI, {});
  return null;
};
var MessagePrimitivePartsInner = ({ children }) => {
  const aui = useAui();
  const contentLength = useAuiState((s) => s.message.parts.length);
  return (0, import_react33.useMemo)(() => Array.from({ length: contentLength }, (_, index) => (0, import_jsx_runtime19.jsx)(PartByIndexProvider, { index, children: (0, import_jsx_runtime19.jsx)(RenderChildrenWithAccessor, { getItemState: (aui2) => aui2.message().part({ index }).getState(), children: (getItem) => {
    const result = children({
      get part() {
        const state = getItem();
        if (state.type === "tool-call") {
          const entry = aui.tools().getState().tools[state.toolName];
          const hasUI = Array.isArray(entry) ? !!entry[0] : !!entry;
          const partMethods = aui.message().part({ index });
          return {
            ...state,
            toolUI: hasUI ? (0, import_jsx_runtime19.jsx)(RegisteredToolUI, {}) : null,
            addResult: partMethods.addToolResult,
            resume: partMethods.resumeToolCall
          };
        }
        if (state.type === "data") {
          const entry = aui.dataRenderers().getState().renderers[state.name];
          const hasUI = Array.isArray(entry) ? !!entry[0] : !!entry;
          return {
            ...state,
            dataRendererUI: hasUI ? (0, import_jsx_runtime19.jsx)(RegisteredDataRendererUI, {}) : null
          };
        }
        return state;
      }
    });
    if (result !== null)
      return result;
    return (0, import_jsx_runtime19.jsx)(DefaultPartFallback, {});
  } }) }, index)), [contentLength, children]);
};
var MessagePrimitiveParts = ({ components, unstable_showEmptyOnNonTextEnd = true, children }) => {
  if (children) {
    return (0, import_jsx_runtime19.jsx)(MessagePrimitivePartsInner, { children });
  }
  return (0, import_jsx_runtime19.jsx)(MessagePrimitivePartsCompat, { components, unstable_showEmptyOnNonTextEnd });
};
MessagePrimitiveParts.displayName = "MessagePrimitive.Parts";
var MessagePrimitivePartsCompat = ({ components, unstable_showEmptyOnNonTextEnd }) => {
  const contentLength = useAuiState((s) => s.message.parts.length);
  const useChainOfThought = !!(components == null ? void 0 : components.ChainOfThought);
  const messageRanges = useMessagePartsGroups(useChainOfThought);
  const partsElements = (0, import_react33.useMemo)(() => {
    if (contentLength === 0) {
      return (0, import_jsx_runtime19.jsx)(EmptyParts, { components });
    }
    return messageRanges.map((range) => {
      if (range.type === "single") {
        return (0, import_jsx_runtime19.jsx)(MessagePrimitivePartByIndex, { index: range.index, components }, range.index);
      } else if (range.type === "chainOfThoughtGroup") {
        const ChainOfThoughtComponent = components == null ? void 0 : components.ChainOfThought;
        if (!ChainOfThoughtComponent)
          return null;
        return (0, import_jsx_runtime19.jsx)(ChainOfThoughtByIndicesProvider, { startIndex: range.startIndex, endIndex: range.endIndex, children: (0, import_jsx_runtime19.jsx)(ChainOfThoughtComponent, {}) }, `chainOfThought-${range.startIndex}`);
      } else if (range.type === "toolGroup") {
        const ToolGroupComponent = (components == null ? void 0 : components.ToolGroup) ?? defaultComponents.ToolGroup;
        return (0, import_jsx_runtime19.jsx)(ToolGroupComponent, { startIndex: range.startIndex, endIndex: range.endIndex, children: Array.from({ length: range.endIndex - range.startIndex + 1 }, (_, i) => (0, import_jsx_runtime19.jsx)(MessagePrimitivePartByIndex, { index: range.startIndex + i, components }, i)) }, `tool-${range.startIndex}`);
      } else {
        const ReasoningGroupComponent = (components == null ? void 0 : components.ReasoningGroup) ?? defaultComponents.ReasoningGroup;
        return (0, import_jsx_runtime19.jsx)(ReasoningGroupComponent, { startIndex: range.startIndex, endIndex: range.endIndex, children: Array.from({ length: range.endIndex - range.startIndex + 1 }, (_, i) => (0, import_jsx_runtime19.jsx)(MessagePrimitivePartByIndex, { index: range.startIndex + i, components }, i)) }, `reasoning-${range.startIndex}`);
      }
    });
  }, [messageRanges, components, contentLength]);
  return (0, import_jsx_runtime19.jsxs)(import_jsx_runtime19.Fragment, { children: [(components == null ? void 0 : components.Quote) && (0, import_jsx_runtime19.jsx)(QuoteRenderer, { Quote: components.Quote }), partsElements, (0, import_jsx_runtime19.jsx)(ConditionalEmpty, { components, enabled: unstable_showEmptyOnNonTextEnd })] });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/message/MessageQuote.js
var import_jsx_runtime20 = __toESM(require_jsx_runtime(), 1);
var import_react34 = __toESM(require_react(), 1);
var MessagePrimitiveQuoteImpl = ({ children }) => {
  const quoteInfo = useAuiState(getMessageQuote);
  if (!quoteInfo)
    return null;
  return (0, import_jsx_runtime20.jsx)(import_jsx_runtime20.Fragment, { children: children(quoteInfo) });
};
var MessagePrimitiveQuote = (0, import_react34.memo)(MessagePrimitiveQuoteImpl);
MessagePrimitiveQuote.displayName = "MessagePrimitive.Quote";

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/message/MessageAttachments.js
var import_jsx_runtime21 = __toESM(require_jsx_runtime(), 1);
var import_react35 = __toESM(require_react(), 1);
var getComponent2 = (components, attachment) => {
  const type = attachment.type;
  switch (type) {
    case "image":
      return (components == null ? void 0 : components.Image) ?? (components == null ? void 0 : components.Attachment);
    case "document":
      return (components == null ? void 0 : components.Document) ?? (components == null ? void 0 : components.Attachment);
    case "file":
      return (components == null ? void 0 : components.File) ?? (components == null ? void 0 : components.Attachment);
    default:
      return components == null ? void 0 : components.Attachment;
  }
};
var AttachmentComponent = ({ components }) => {
  const attachment = useAuiState((s) => s.attachment);
  if (!attachment)
    return null;
  const Component = getComponent2(components, attachment);
  if (!Component)
    return null;
  return (0, import_jsx_runtime21.jsx)(Component, {});
};
var MessagePrimitiveAttachmentByIndex = (0, import_react35.memo)(({ index, components }) => {
  return (0, import_jsx_runtime21.jsx)(MessageAttachmentByIndexProvider, { index, children: (0, import_jsx_runtime21.jsx)(AttachmentComponent, { components }) });
}, (prev, next) => {
  var _a2, _b, _c, _d, _e, _f, _g, _h;
  return prev.index === next.index && ((_a2 = prev.components) == null ? void 0 : _a2.Image) === ((_b = next.components) == null ? void 0 : _b.Image) && ((_c = prev.components) == null ? void 0 : _c.Document) === ((_d = next.components) == null ? void 0 : _d.Document) && ((_e = prev.components) == null ? void 0 : _e.File) === ((_f = next.components) == null ? void 0 : _f.File) && ((_g = prev.components) == null ? void 0 : _g.Attachment) === ((_h = next.components) == null ? void 0 : _h.Attachment);
});
MessagePrimitiveAttachmentByIndex.displayName = "MessagePrimitive.AttachmentByIndex";
var MessagePrimitiveAttachmentsInner = ({ children }) => {
  const attachmentsCount = useAuiState((s) => {
    if (s.message.role !== "user")
      return 0;
    return s.message.attachments.length;
  });
  return (0, import_react35.useMemo)(() => Array.from({ length: attachmentsCount }, (_, index) => (0, import_jsx_runtime21.jsx)(MessageAttachmentByIndexProvider, { index, children: (0, import_jsx_runtime21.jsx)(RenderChildrenWithAccessor, { getItemState: (aui) => aui.message().attachment({ index }).getState(), children: (getItem) => children({
    get attachment() {
      return getItem();
    }
  }) }) }, index)), [attachmentsCount, children]);
};
var MessagePrimitiveAttachments = ({ components, children }) => {
  if (components) {
    return (0, import_jsx_runtime21.jsx)(MessagePrimitiveAttachmentsInner, { children: ({ attachment }) => {
      const Component = getComponent2(components, attachment);
      if (!Component)
        return null;
      return (0, import_jsx_runtime21.jsx)(Component, {});
    } });
  }
  return (0, import_jsx_runtime21.jsx)(MessagePrimitiveAttachmentsInner, { children });
};
MessagePrimitiveAttachments.displayName = "MessagePrimitive.Attachments";

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/composer/ComposerAttachments.js
var import_jsx_runtime22 = __toESM(require_jsx_runtime(), 1);
var import_react36 = __toESM(require_react(), 1);
var getComponent3 = (components, attachment) => {
  const type = attachment.type;
  switch (type) {
    case "image":
      return (components == null ? void 0 : components.Image) ?? (components == null ? void 0 : components.Attachment);
    case "document":
      return (components == null ? void 0 : components.Document) ?? (components == null ? void 0 : components.Attachment);
    case "file":
      return (components == null ? void 0 : components.File) ?? (components == null ? void 0 : components.Attachment);
    default:
      return components == null ? void 0 : components.Attachment;
  }
};
var AttachmentComponent2 = ({ components }) => {
  const attachment = useAuiState((s) => s.attachment);
  if (!attachment)
    return null;
  const Component = getComponent3(components, attachment);
  if (!Component)
    return null;
  return (0, import_jsx_runtime22.jsx)(Component, {});
};
var ComposerPrimitiveAttachmentByIndex = (0, import_react36.memo)(({ index, components }) => {
  return (0, import_jsx_runtime22.jsx)(ComposerAttachmentByIndexProvider, { index, children: (0, import_jsx_runtime22.jsx)(AttachmentComponent2, { components }) });
}, (prev, next) => {
  var _a2, _b, _c, _d, _e, _f, _g, _h;
  return prev.index === next.index && ((_a2 = prev.components) == null ? void 0 : _a2.Image) === ((_b = next.components) == null ? void 0 : _b.Image) && ((_c = prev.components) == null ? void 0 : _c.Document) === ((_d = next.components) == null ? void 0 : _d.Document) && ((_e = prev.components) == null ? void 0 : _e.File) === ((_f = next.components) == null ? void 0 : _f.File) && ((_g = prev.components) == null ? void 0 : _g.Attachment) === ((_h = next.components) == null ? void 0 : _h.Attachment);
});
ComposerPrimitiveAttachmentByIndex.displayName = "ComposerPrimitive.AttachmentByIndex";
var ComposerPrimitiveAttachmentsInner = ({ children }) => {
  const attachmentsCount = useAuiState((s) => s.composer.attachments.length);
  return (0, import_react36.useMemo)(() => Array.from({ length: attachmentsCount }, (_, index) => (0, import_jsx_runtime22.jsx)(ComposerAttachmentByIndexProvider, { index, children: (0, import_jsx_runtime22.jsx)(RenderChildrenWithAccessor, { getItemState: (aui) => aui.composer().attachment({ index }).getState(), children: (getItem) => children({
    get attachment() {
      return getItem();
    }
  }) }) }, index)), [attachmentsCount, children]);
};
var ComposerPrimitiveAttachments = ({ components, children }) => {
  if (components) {
    return (0, import_jsx_runtime22.jsx)(ComposerPrimitiveAttachmentsInner, { children: ({ attachment }) => {
      const Component = getComponent3(components, attachment);
      if (!Component)
        return null;
      return (0, import_jsx_runtime22.jsx)(Component, {});
    } });
  }
  return (0, import_jsx_runtime22.jsx)(ComposerPrimitiveAttachmentsInner, { children });
};
ComposerPrimitiveAttachments.displayName = "ComposerPrimitive.Attachments";

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/composer/ComposerQueue.js
var import_jsx_runtime23 = __toESM(require_jsx_runtime(), 1);
var import_react37 = __toESM(require_react(), 1);
var ComposerPrimitiveQueueInner = ({ children }) => {
  const queue = useAuiState((s) => s.composer.queue.length);
  return (0, import_react37.useMemo)(() => Array.from({ length: queue }, (_, index) => (0, import_jsx_runtime23.jsx)(QueueItemByIndexProvider, { index, children: (0, import_jsx_runtime23.jsx)(RenderChildrenWithAccessor, { getItemState: (aui) => aui.composer().queueItem({ index }).getState(), children: (getItem) => children({
    get queueItem() {
      return getItem();
    }
  }) }) }, index)), [queue, children]);
};
var ComposerPrimitiveQueue = (0, import_react37.memo)(ComposerPrimitiveQueueInner);
ComposerPrimitiveQueue.displayName = "ComposerPrimitive.Queue";

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/threadList/ThreadListItems.js
var import_jsx_runtime24 = __toESM(require_jsx_runtime(), 1);
var import_react38 = __toESM(require_react(), 1);
var ThreadListPrimitiveItemByIndex = (0, import_react38.memo)(({ index, archived = false, components }) => {
  const ThreadListItemComponent = components.ThreadListItem;
  return (0, import_jsx_runtime24.jsx)(ThreadListItemByIndexProvider, { index, archived, children: (0, import_jsx_runtime24.jsx)(ThreadListItemComponent, {}) });
}, (prev, next) => prev.index === next.index && prev.archived === next.archived && prev.components.ThreadListItem === next.components.ThreadListItem);
ThreadListPrimitiveItemByIndex.displayName = "ThreadListPrimitive.ItemByIndex";
var ThreadListPrimitiveItemsInner = ({ archived, children }) => {
  const contentLength = useAuiState((s) => archived ? s.threads.archivedThreadIds.length : s.threads.threadIds.length);
  return (0, import_react38.useMemo)(() => Array.from({ length: contentLength }, (_, index) => (0, import_jsx_runtime24.jsx)(ThreadListItemByIndexProvider, { index, archived, children: (0, import_jsx_runtime24.jsx)(RenderChildrenWithAccessor, { getItemState: (aui) => aui.threads().item({ index, archived }).getState(), children: (getItem) => children({
    get threadListItem() {
      return getItem();
    }
  }) }) }, index)), [contentLength, archived, children]);
};
var ThreadListPrimitiveItems = ({ archived = false, components, children }) => {
  if (components) {
    const ThreadListItemComponent = components.ThreadListItem;
    return (0, import_jsx_runtime24.jsx)(ThreadListPrimitiveItemsInner, { archived, children: () => (0, import_jsx_runtime24.jsx)(ThreadListItemComponent, {}) });
  }
  return (0, import_jsx_runtime24.jsx)(ThreadListPrimitiveItemsInner, { archived, children });
};
ThreadListPrimitiveItems.displayName = "ThreadListPrimitive.Items";

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/chainOfThought/ChainOfThoughtParts.js
var import_jsx_runtime25 = __toESM(require_jsx_runtime(), 1);
var import_react39 = __toESM(require_react(), 1);
var ChainOfThoughtPrimitivePartsInner = ({ children }) => {
  const partsLength = useAuiState((s) => s.chainOfThought.parts.length);
  return (0, import_react39.useMemo)(() => Array.from({ length: partsLength }, (_, index) => (0, import_jsx_runtime25.jsx)(ChainOfThoughtPartByIndexProvider, { index, children: (0, import_jsx_runtime25.jsx)(RenderChildrenWithAccessor, { getItemState: (aui) => aui.chainOfThought().part({ index }).getState(), children: (getItem) => children({
    get part() {
      return getItem();
    }
  }) }) }, index)), [partsLength, children]);
};
var ChainOfThoughtPrimitiveParts = ({ components, children }) => {
  var _a2;
  if (children) {
    return (0, import_jsx_runtime25.jsx)(ChainOfThoughtPrimitivePartsInner, { children });
  }
  const messageComponents = (0, import_react39.useMemo)(() => {
    var _a3;
    return {
      Reasoning: components == null ? void 0 : components.Reasoning,
      tools: {
        Fallback: (_a3 = components == null ? void 0 : components.tools) == null ? void 0 : _a3.Fallback
      }
    };
  }, [components == null ? void 0 : components.Reasoning, (_a2 = components == null ? void 0 : components.tools) == null ? void 0 : _a2.Fallback]);
  const Layout = components == null ? void 0 : components.Layout;
  return (0, import_jsx_runtime25.jsx)(ChainOfThoughtPrimitivePartsInner, { children: () => Layout ? (0, import_jsx_runtime25.jsx)(Layout, { children: (0, import_jsx_runtime25.jsx)(MessagePartComponent, { components: messageComponents }) }) : (0, import_jsx_runtime25.jsx)(MessagePartComponent, { components: messageComponents }) });
};
ChainOfThoughtPrimitiveParts.displayName = "ChainOfThoughtPrimitive.Parts";

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/part/PartMessages.js
var import_jsx_runtime26 = __toESM(require_jsx_runtime(), 1);
var import_react40 = __toESM(require_react(), 1);
var usePartMessages = () => {
  return useAuiState((s) => {
    const part = s.part;
    if (part.type !== "tool-call")
      return void 0;
    return "messages" in part ? part.messages : void 0;
  });
};
var PartPrimitiveMessagesImpl = ({ components, children }) => {
  const messages = usePartMessages();
  if (!(messages == null ? void 0 : messages.length))
    return null;
  if (children) {
    return (0, import_jsx_runtime26.jsx)(ReadonlyThreadProvider, { messages, children: (0, import_jsx_runtime26.jsx)(ThreadPrimitiveMessagesImpl, { children }) });
  }
  return (0, import_jsx_runtime26.jsx)(ReadonlyThreadProvider, { messages, children: (0, import_jsx_runtime26.jsx)(ThreadPrimitiveMessagesImpl, { components }) });
};
PartPrimitiveMessagesImpl.displayName = "PartPrimitive.Messages";
var PartPrimitiveMessages = (0, import_react40.memo)(PartPrimitiveMessagesImpl);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/threadListItem/ThreadListItemTitle.js
var import_jsx_runtime27 = __toESM(require_jsx_runtime(), 1);
var ThreadListItemPrimitiveTitle = ({ fallback }) => {
  const title = useAuiState((s) => s.threadListItem.title);
  return (0, import_jsx_runtime27.jsx)(import_jsx_runtime27.Fragment, { children: title || fallback });
};
ThreadListItemPrimitiveTitle.displayName = "ThreadListItemPrimitive.Title";

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/thread/ThreadSuggestions.js
var import_jsx_runtime28 = __toESM(require_jsx_runtime(), 1);
var import_react41 = __toESM(require_react(), 1);
var SuggestionComponent = ({ components }) => {
  const Component = components.Suggestion;
  return (0, import_jsx_runtime28.jsx)(Component, {});
};
var ThreadPrimitiveSuggestionByIndex = (0, import_react41.memo)(({ index, components }) => {
  return (0, import_jsx_runtime28.jsx)(SuggestionByIndexProvider, { index, children: (0, import_jsx_runtime28.jsx)(SuggestionComponent, { components }) });
}, (prev, next) => prev.index === next.index && prev.components.Suggestion === next.components.Suggestion);
ThreadPrimitiveSuggestionByIndex.displayName = "ThreadPrimitive.SuggestionByIndex";
var ThreadPrimitiveSuggestionsInner = ({ children }) => {
  const suggestionsLength = useAuiState((s) => s.suggestions.suggestions.length);
  return (0, import_react41.useMemo)(() => {
    if (suggestionsLength === 0)
      return null;
    return Array.from({ length: suggestionsLength }, (_, index) => (0, import_jsx_runtime28.jsx)(SuggestionByIndexProvider, { index, children: (0, import_jsx_runtime28.jsx)(RenderChildrenWithAccessor, { getItemState: (aui) => aui.suggestions().suggestion({ index }).getState(), children: (getItem) => children({
      get suggestion() {
        return getItem();
      }
    }) }) }, index));
  }, [suggestionsLength, children]);
};
var ThreadPrimitiveSuggestionsImpl = ({ components, children }) => {
  if (components) {
    return (0, import_jsx_runtime28.jsx)(ThreadPrimitiveSuggestionsInner, { children: () => (0, import_jsx_runtime28.jsx)(SuggestionComponent, { components }) });
  }
  return (0, import_jsx_runtime28.jsx)(ThreadPrimitiveSuggestionsInner, { children });
};
ThreadPrimitiveSuggestionsImpl.displayName = "ThreadPrimitive.Suggestions";
var ThreadPrimitiveSuggestions = (0, import_react41.memo)(ThreadPrimitiveSuggestionsImpl, (prev, next) => {
  if (prev.children || next.children) {
    return prev.children === next.children;
  }
  return prev.components.Suggestion === next.components.Suggestion;
});

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitives/composer/ComposerIf.js
var useComposerIf = (props) => {
  return useAuiState((s) => {
    if (props.editing === true && !s.composer.isEditing)
      return false;
    if (props.editing === false && s.composer.isEditing)
      return false;
    const isDictating = s.composer.dictation != null;
    if (props.dictation === true && !isDictating)
      return false;
    if (props.dictation === false && isDictating)
      return false;
    return true;
  });
};
var ComposerPrimitiveIf = ({ children, ...query }) => {
  const result = useComposerIf(query);
  return result ? children : null;
};
ComposerPrimitiveIf.displayName = "ComposerPrimitive.If";

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useComposerSend.js
var import_react42 = __toESM(require_react(), 1);
var useComposerSend = () => {
  const aui = useAui();
  const disabled = useAuiState((s) => s.thread.isRunning && !s.thread.capabilities.queue || !s.composer.isEditing || s.composer.isEmpty);
  const send = (0, import_react42.useCallback)((opts) => {
    aui.composer().send(opts);
  }, [aui]);
  return { send, disabled };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useComposerCancel.js
var import_react43 = __toESM(require_react(), 1);
var useComposerCancel = () => {
  const aui = useAui();
  const disabled = useAuiState((s) => !s.composer.canCancel);
  const cancel = (0, import_react43.useCallback)(() => {
    aui.composer().cancel();
  }, [aui]);
  return { cancel, disabled };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useComposerDictate.js
var import_react44 = __toESM(require_react(), 1);
var useComposerDictate = () => {
  const aui = useAui();
  const disabled = useAuiState((s) => s.composer.dictation != null || !s.thread.capabilities.dictation || !s.composer.isEditing);
  const startDictation = (0, import_react44.useCallback)(() => {
    aui.composer().startDictation();
  }, [aui]);
  return { startDictation, disabled };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useComposerAddAttachment.js
var import_react45 = __toESM(require_react(), 1);
var useComposerAddAttachment = () => {
  const aui = useAui();
  const disabled = useAuiState((s) => !s.composer.isEditing);
  const addAttachment = (0, import_react45.useCallback)((file) => {
    return aui.composer().addAttachment(file);
  }, [aui]);
  return { addAttachment, disabled };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useMessageReload.js
var import_react46 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useMessageBranching.js
var import_react47 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useActionBarCopy.js
var import_react48 = __toESM(require_react(), 1);
var useActionBarCopy = ({ copiedDuration = 3e3, copyToClipboard } = {}) => {
  const aui = useAui();
  const disabled = useAuiState((s) => {
    var _a2;
    return !((s.message.role !== "assistant" || ((_a2 = s.message.status) == null ? void 0 : _a2.type) !== "running") && s.message.parts.some((c) => c.type === "text" && c.text.length > 0));
  });
  const isCopied = useAuiState((s) => s.message.isCopied);
  const isEditing = useAuiState((s) => s.composer.isEditing);
  const composerValue = useAuiState((s) => s.composer.text);
  const copy = (0, import_react48.useCallback)(() => {
    const valueToCopy = isEditing ? composerValue : aui.message().getCopyText();
    if (!valueToCopy)
      return;
    const write = copyToClipboard ?? (() => {
    });
    const result = write(valueToCopy);
    Promise.resolve(result).then(() => {
      aui.message().setIsCopied(true);
      setTimeout(() => aui.message().setIsCopied(false), copiedDuration);
    });
  }, [aui, isEditing, composerValue, copiedDuration, copyToClipboard]);
  return { copy, disabled, isCopied };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useActionBarEdit.js
var import_react49 = __toESM(require_react(), 1);
var useActionBarEdit = () => {
  const aui = useAui();
  const disabled = useAuiState((s) => s.composer.isEditing);
  const edit = (0, import_react49.useCallback)(() => {
    aui.composer().beginEdit();
  }, [aui]);
  return { edit, disabled };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useActionBarReload.js
var import_react50 = __toESM(require_react(), 1);
var useActionBarReload = () => {
  const aui = useAui();
  const disabled = useAuiState((s) => s.thread.isRunning || s.thread.isDisabled || s.message.role !== "assistant");
  const reload = (0, import_react50.useCallback)(() => {
    aui.message().reload();
  }, [aui]);
  return { reload, disabled };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useActionBarFeedback.js
var import_react51 = __toESM(require_react(), 1);
var useActionBarFeedbackPositive = () => {
  const aui = useAui();
  const isSubmitted = useAuiState((s) => {
    var _a2;
    return ((_a2 = s.message.metadata.submittedFeedback) == null ? void 0 : _a2.type) === "positive";
  });
  const submit = (0, import_react51.useCallback)(() => {
    aui.message().submitFeedback({ type: "positive" });
  }, [aui]);
  return { submit, isSubmitted };
};
var useActionBarFeedbackNegative = () => {
  const aui = useAui();
  const isSubmitted = useAuiState((s) => {
    var _a2;
    return ((_a2 = s.message.metadata.submittedFeedback) == null ? void 0 : _a2.type) === "negative";
  });
  const submit = (0, import_react51.useCallback)(() => {
    aui.message().submitFeedback({ type: "negative" });
  }, [aui]);
  return { submit, isSubmitted };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useActionBarSpeak.js
var import_react52 = __toESM(require_react(), 1);
var useActionBarSpeak = () => {
  const aui = useAui();
  const disabled = useAuiState((s) => {
    var _a2;
    return !((s.message.role !== "assistant" || ((_a2 = s.message.status) == null ? void 0 : _a2.type) !== "running") && s.message.parts.some((c) => c.type === "text" && c.text.length > 0));
  });
  const speak = (0, import_react52.useCallback)(async () => {
    aui.message().speak();
  }, [aui]);
  return { speak, disabled };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useActionBarStopSpeaking.js
var import_react53 = __toESM(require_react(), 1);
var useActionBarStopSpeaking = () => {
  const aui = useAui();
  const disabled = useAuiState((s) => s.message.speech == null);
  const stopSpeaking = (0, import_react53.useCallback)(() => {
    aui.message().stopSpeaking();
  }, [aui]);
  return { stopSpeaking, disabled };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useBranchPickerNext.js
var import_react54 = __toESM(require_react(), 1);
var useBranchPickerNext = () => {
  const aui = useAui();
  const disabled = useAuiState((s) => {
    if (s.message.branchNumber >= s.message.branchCount)
      return true;
    if (s.thread.isRunning && !s.thread.capabilities.switchBranchDuringRun) {
      return true;
    }
    return false;
  });
  const next = (0, import_react54.useCallback)(() => {
    aui.message().switchToBranch({ position: "next" });
  }, [aui]);
  return { next, disabled };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useBranchPickerPrevious.js
var import_react55 = __toESM(require_react(), 1);
var useBranchPickerPrevious = () => {
  const aui = useAui();
  const disabled = useAuiState((s) => {
    if (s.message.branchNumber <= 1)
      return true;
    if (s.thread.isRunning && !s.thread.capabilities.switchBranchDuringRun) {
      return true;
    }
    return false;
  });
  const previous = (0, import_react55.useCallback)(() => {
    aui.message().switchToBranch({ position: "previous" });
  }, [aui]);
  return { previous, disabled };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useSuggestionTrigger.js
var import_react56 = __toESM(require_react(), 1);
var useSuggestionTrigger = ({ prompt, send, clearComposer = true }) => {
  const aui = useAui();
  const disabled = useAuiState((s) => s.thread.isDisabled);
  const resolvedSend = send ?? false;
  const trigger = (0, import_react56.useCallback)(() => {
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
  return { trigger, disabled };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useThreadListItemArchive.js
var import_react57 = __toESM(require_react(), 1);
var useThreadListItemArchive = () => {
  const aui = useAui();
  const archive = (0, import_react57.useCallback)(() => {
    aui.threadListItem().archive();
  }, [aui]);
  return { archive };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useThreadListItemDelete.js
var import_react58 = __toESM(require_react(), 1);
var useThreadListItemDelete = () => {
  const aui = useAui();
  const deleteThread = (0, import_react58.useCallback)(() => {
    aui.threadListItem().delete();
  }, [aui]);
  return { delete: deleteThread };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useThreadListItemUnarchive.js
var import_react59 = __toESM(require_react(), 1);
var useThreadListItemUnarchive = () => {
  const aui = useAui();
  const unarchive = (0, import_react59.useCallback)(() => {
    aui.threadListItem().unarchive();
  }, [aui]);
  return { unarchive };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useThreadListItemTrigger.js
var import_react60 = __toESM(require_react(), 1);
var useThreadListItemTrigger = () => {
  const aui = useAui();
  const switchTo = (0, import_react60.useCallback)(() => {
    aui.threadListItem().switchTo();
  }, [aui]);
  return { switchTo };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useThreadListNew.js
var import_react61 = __toESM(require_react(), 1);
var useThreadListNew = () => {
  const aui = useAui();
  const switchToNewThread = (0, import_react61.useCallback)(() => {
    aui.threads().switchToNewThread();
  }, [aui]);
  return { switchToNewThread };
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useEditComposerCancel.js
var import_react62 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useEditComposerSend.js
var import_react63 = __toESM(require_react(), 1);

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/primitive-hooks/useMessageError.js
var useMessageError = () => {
  return useAuiState((s) => {
    var _a2;
    return ((_a2 = s.message.status) == null ? void 0 : _a2.type) === "incomplete" && s.message.status.reason === "error" ? s.message.status.error ?? "An error occurred" : void 0;
  });
};

// ../../node_modules/.pnpm/@assistant-ui+core@0.1.13_@assistant-ui+store@0.2.6_@assistant-ui+tap@0.5.7_@types+reac_0ba7e01e99f2edcb255def189655721f/node_modules/@assistant-ui/core/dist/react/AssistantRuntimeProvider.js
var import_jsx_runtime29 = __toESM(require_jsx_runtime(), 1);
var import_react64 = __toESM(require_react(), 1);
var AssistantRuntimeProvider = (0, import_react64.memo)(({ runtime, aui, children }) => {
  return (0, import_jsx_runtime29.jsx)(AssistantProviderBase, { runtime, aui: aui ?? null, children });
});

export {
  useResource,
  resource,
  withKey,
  tapState,
  tapEffect,
  tapRef,
  tapMemo,
  tapEffectEvent,
  flushResourcesSync,
  tapClientResource,
  AuiProvider,
  Derived,
  attachTransformScopes,
  useAui,
  useAuiState,
  useAuiEvent,
  AuiIf,
  tapClientLookup,
  useAssistantTool,
  makeAssistantTool,
  useAssistantToolUI,
  makeAssistantToolUI,
  useAssistantDataUI,
  makeAssistantDataUI,
  useAssistantInstructions,
  useAssistantContext,
  create,
  useInlineRender,
  useAssistantInteractable,
  useInteractableState,
  asAsyncIterableStream,
  DataStreamDecoder,
  useToolArgsStatus,
  Suggestions,
  ChainOfThoughtClient,
  ThreadMessageClient,
  mergeModelContexts,
  CompositeContextProvider,
  ModelContext,
  Tools,
  DataRenderers,
  createInitialMessage,
  AssistantMessageAccumulator,
  AssistantTransportDecoder,
  UIMessageStreamDecoder,
  toolResultStream,
  toJSONSchema,
  toToolsJSONSchema,
  toGenericMessages,
  Interactables,
  MessageAttachmentByIndexProvider,
  ComposerAttachmentByIndexProvider,
  ThreadListItemRuntimeProvider,
  MessageByIndexProvider,
  PartByIndexProvider,
  TextMessagePartProvider,
  ChainOfThoughtByIndicesProvider,
  ThreadListItemByIndexProvider,
  SuggestionByIndexProvider,
  BaseAssistantRuntimeCore,
  generateId2 as generateId,
  getAutoStatus,
  fromThreadMessageLike,
  ExportedMessageRepository,
  MessageRepository,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
  CompositeAttachmentAdapter,
  DefaultThreadComposerRuntimeCore,
  getExternalStoreMessage,
  bindExternalStoreMessage,
  getExternalStoreMessages,
  ThreadRuntimeImpl,
  AssistantRuntimeImpl,
  ReadonlyThreadProvider,
  RuntimeAdapterProvider,
  useRuntimeAdapters,
  useToolInvocations,
  useExternalStoreRuntime,
  convertExternalMessages,
  useExternalMessageConverter,
  createMessageConverter,
  useRemoteThreadListRuntime,
  AssistantCloud,
  InMemoryThreadListAdapter,
  CloudFileAttachmentAdapter,
  useCloudThreadListAdapter,
  AssistantProviderBase,
  ThreadPrimitiveMessageByIndex,
  ThreadPrimitiveMessages,
  getMessageQuote,
  defaultComponents,
  MessagePrimitivePartByIndex,
  MessagePrimitiveParts,
  MessagePrimitiveQuote,
  MessagePrimitiveAttachmentByIndex,
  MessagePrimitiveAttachments,
  ComposerPrimitiveAttachmentByIndex,
  ComposerPrimitiveAttachments,
  ComposerPrimitiveQueue,
  ThreadListPrimitiveItemByIndex,
  ThreadListPrimitiveItems,
  ChainOfThoughtPrimitiveParts,
  PartPrimitiveMessages,
  ThreadListItemPrimitiveTitle,
  ThreadPrimitiveSuggestionByIndex,
  ThreadPrimitiveSuggestions,
  ComposerPrimitiveIf,
  useComposerSend,
  useComposerCancel,
  useComposerDictate,
  useComposerAddAttachment,
  useActionBarCopy,
  useActionBarEdit,
  useActionBarReload,
  useActionBarFeedbackPositive,
  useActionBarFeedbackNegative,
  useActionBarSpeak,
  useActionBarStopSpeaking,
  useVoiceState,
  useVoiceVolume,
  useVoiceControls,
  useBranchPickerNext,
  useBranchPickerPrevious,
  useSuggestionTrigger,
  useThreadListItemArchive,
  useThreadListItemDelete,
  useThreadListItemUnarchive,
  useThreadListItemTrigger,
  useThreadListNew,
  useMessageError,
  splitLocalRuntimeOptions,
  useLocalRuntime
};
//# sourceMappingURL=chunk-EZOGSO4P.js.map
