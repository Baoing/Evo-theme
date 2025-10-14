var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var __await = function(promise, isYieldStar) {
  this[0] = promise;
  this[1] = isYieldStar;
};
var __asyncGenerator = (__this, __arguments, generator) => {
  var resume = (k, v, yes, no) => {
    try {
      var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
      Promise.resolve(isAwait ? v[0] : v).then((y) => isAwait ? resume(k === "return" ? k : "next", v[1] ? { done: y.done, value: y.value } : y, yes, no) : yes({ value: y, done })).catch((e) => resume("throw", e, yes, no));
    } catch (e) {
      no(e);
    }
  }, method = (k) => it[k] = (x) => new Promise((yes, no) => resume(k, x, yes, no)), it = {};
  return generator = generator.apply(__this, __arguments), it[__knownSymbol("asyncIterator")] = () => it, method("next"), method("throw"), method("return"), it;
};
var __yieldStar = (value) => {
  var obj = value[__knownSymbol("asyncIterator")], isAwait = false, method, it = {};
  if (obj == null) {
    obj = value[__knownSymbol("iterator")]();
    method = (k) => it[k] = (x) => obj[k](x);
  } else {
    obj = obj.call(value);
    method = (k) => it[k] = (v) => {
      if (isAwait) {
        isAwait = false;
        if (k === "throw") throw v;
        return v;
      }
      isAwait = true;
      return {
        done: false,
        value: new __await(new Promise((resolve) => {
          var x = obj[k](v);
          if (!(x instanceof Object)) __typeError("Object expected");
          resolve(x);
        }), 1)
      };
    };
  }
  return it[__knownSymbol("iterator")] = () => it, method("next"), "throw" in obj ? method("throw") : it.throw = (x) => {
    throw x;
  }, "return" in obj && method("return"), it;
};
var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);
var _a;
(function() {
  "use strict";
  var flushPending = false;
  var flushing = false;
  var queue = [];
  var lastFlushedIndex = -1;
  function scheduler(callback) {
    queueJob(callback);
  }
  function queueJob(job) {
    if (!queue.includes(job))
      queue.push(job);
    queueFlush();
  }
  function dequeueJob(job) {
    let index = queue.indexOf(job);
    if (index !== -1 && index > lastFlushedIndex)
      queue.splice(index, 1);
  }
  function queueFlush() {
    if (!flushing && !flushPending) {
      flushPending = true;
      queueMicrotask(flushJobs);
    }
  }
  function flushJobs() {
    flushPending = false;
    flushing = true;
    for (let i2 = 0; i2 < queue.length; i2++) {
      queue[i2]();
      lastFlushedIndex = i2;
    }
    queue.length = 0;
    lastFlushedIndex = -1;
    flushing = false;
  }
  var reactive;
  var effect;
  var release;
  var raw;
  var shouldSchedule = true;
  function disableEffectScheduling(callback) {
    shouldSchedule = false;
    callback();
    shouldSchedule = true;
  }
  function setReactivityEngine(engine) {
    reactive = engine.reactive;
    release = engine.release;
    effect = (callback) => engine.effect(callback, { scheduler: (task) => {
      if (shouldSchedule) {
        scheduler(task);
      } else {
        task();
      }
    } });
    raw = engine.raw;
  }
  function overrideEffect(override) {
    effect = override;
  }
  function elementBoundEffect(el) {
    let cleanup2 = () => {
    };
    let wrappedEffect = (callback) => {
      let effectReference = effect(callback);
      if (!el._x_effects) {
        el._x_effects = /* @__PURE__ */ new Set();
        el._x_runEffects = () => {
          el._x_effects.forEach((i2) => i2());
        };
      }
      el._x_effects.add(effectReference);
      cleanup2 = () => {
        if (effectReference === void 0)
          return;
        el._x_effects.delete(effectReference);
        release(effectReference);
      };
      return effectReference;
    };
    return [wrappedEffect, () => {
      cleanup2();
    }];
  }
  function watch(getter, callback) {
    let firstTime = true;
    let oldValue;
    let effectReference = effect(() => {
      let value = getter();
      JSON.stringify(value);
      if (!firstTime) {
        queueMicrotask(() => {
          callback(value, oldValue);
          oldValue = value;
        });
      } else {
        oldValue = value;
      }
      firstTime = false;
    });
    return () => release(effectReference);
  }
  var onAttributeAddeds = [];
  var onElRemoveds = [];
  var onElAddeds = [];
  function onElAdded(callback) {
    onElAddeds.push(callback);
  }
  function onElRemoved(el, callback) {
    if (typeof callback === "function") {
      if (!el._x_cleanups)
        el._x_cleanups = [];
      el._x_cleanups.push(callback);
    } else {
      callback = el;
      onElRemoveds.push(callback);
    }
  }
  function onAttributesAdded(callback) {
    onAttributeAddeds.push(callback);
  }
  function onAttributeRemoved(el, name, callback) {
    if (!el._x_attributeCleanups)
      el._x_attributeCleanups = {};
    if (!el._x_attributeCleanups[name])
      el._x_attributeCleanups[name] = [];
    el._x_attributeCleanups[name].push(callback);
  }
  function cleanupAttributes(el, names) {
    if (!el._x_attributeCleanups)
      return;
    Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
      if (names === void 0 || names.includes(name)) {
        value.forEach((i2) => i2());
        delete el._x_attributeCleanups[name];
      }
    });
  }
  function cleanupElement(el) {
    var _a2, _b;
    (_a2 = el._x_effects) == null ? void 0 : _a2.forEach(dequeueJob);
    while ((_b = el._x_cleanups) == null ? void 0 : _b.length)
      el._x_cleanups.pop()();
  }
  var observer = new MutationObserver(onMutate);
  var currentlyObserving = false;
  function startObservingMutations() {
    observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true });
    currentlyObserving = true;
  }
  function stopObservingMutations() {
    flushObserver();
    observer.disconnect();
    currentlyObserving = false;
  }
  var queuedMutations = [];
  function flushObserver() {
    let records = observer.takeRecords();
    queuedMutations.push(() => records.length > 0 && onMutate(records));
    let queueLengthWhenTriggered = queuedMutations.length;
    queueMicrotask(() => {
      if (queuedMutations.length === queueLengthWhenTriggered) {
        while (queuedMutations.length > 0)
          queuedMutations.shift()();
      }
    });
  }
  function mutateDom(callback) {
    if (!currentlyObserving)
      return callback();
    stopObservingMutations();
    let result = callback();
    startObservingMutations();
    return result;
  }
  var isCollecting = false;
  var deferredMutations = [];
  function deferMutations() {
    isCollecting = true;
  }
  function flushAndStopDeferringMutations() {
    isCollecting = false;
    onMutate(deferredMutations);
    deferredMutations = [];
  }
  function onMutate(mutations) {
    if (isCollecting) {
      deferredMutations = deferredMutations.concat(mutations);
      return;
    }
    let addedNodes = [];
    let removedNodes = /* @__PURE__ */ new Set();
    let addedAttributes = /* @__PURE__ */ new Map();
    let removedAttributes = /* @__PURE__ */ new Map();
    for (let i2 = 0; i2 < mutations.length; i2++) {
      if (mutations[i2].target._x_ignoreMutationObserver)
        continue;
      if (mutations[i2].type === "childList") {
        mutations[i2].removedNodes.forEach((node) => {
          if (node.nodeType !== 1)
            return;
          if (!node._x_marker)
            return;
          removedNodes.add(node);
        });
        mutations[i2].addedNodes.forEach((node) => {
          if (node.nodeType !== 1)
            return;
          if (removedNodes.has(node)) {
            removedNodes.delete(node);
            return;
          }
          if (node._x_marker)
            return;
          addedNodes.push(node);
        });
      }
      if (mutations[i2].type === "attributes") {
        let el = mutations[i2].target;
        let name = mutations[i2].attributeName;
        let oldValue = mutations[i2].oldValue;
        let add2 = () => {
          if (!addedAttributes.has(el))
            addedAttributes.set(el, []);
          addedAttributes.get(el).push({ name, value: el.getAttribute(name) });
        };
        let remove = () => {
          if (!removedAttributes.has(el))
            removedAttributes.set(el, []);
          removedAttributes.get(el).push(name);
        };
        if (el.hasAttribute(name) && oldValue === null) {
          add2();
        } else if (el.hasAttribute(name)) {
          remove();
          add2();
        } else {
          remove();
        }
      }
    }
    removedAttributes.forEach((attrs, el) => {
      cleanupAttributes(el, attrs);
    });
    addedAttributes.forEach((attrs, el) => {
      onAttributeAddeds.forEach((i2) => i2(el, attrs));
    });
    for (let node of removedNodes) {
      if (addedNodes.some((i2) => i2.contains(node)))
        continue;
      onElRemoveds.forEach((i2) => i2(node));
    }
    for (let node of addedNodes) {
      if (!node.isConnected)
        continue;
      onElAddeds.forEach((i2) => i2(node));
    }
    addedNodes = null;
    removedNodes = null;
    addedAttributes = null;
    removedAttributes = null;
  }
  function scope(node) {
    return mergeProxies(closestDataStack(node));
  }
  function addScopeToNode(node, data2, referenceNode) {
    node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
    return () => {
      node._x_dataStack = node._x_dataStack.filter((i2) => i2 !== data2);
    };
  }
  function closestDataStack(node) {
    if (node._x_dataStack)
      return node._x_dataStack;
    if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
      return closestDataStack(node.host);
    }
    if (!node.parentNode) {
      return [];
    }
    return closestDataStack(node.parentNode);
  }
  function mergeProxies(objects) {
    return new Proxy({ objects }, mergeProxyTrap);
  }
  var mergeProxyTrap = {
    ownKeys({ objects }) {
      return Array.from(
        new Set(objects.flatMap((i2) => Object.keys(i2)))
      );
    },
    has({ objects }, name) {
      if (name == Symbol.unscopables)
        return false;
      return objects.some(
        (obj) => Object.prototype.hasOwnProperty.call(obj, name) || Reflect.has(obj, name)
      );
    },
    get({ objects }, name, thisProxy) {
      if (name == "toJSON")
        return collapseProxies;
      return Reflect.get(
        objects.find(
          (obj) => Reflect.has(obj, name)
        ) || {},
        name,
        thisProxy
      );
    },
    set({ objects }, name, value, thisProxy) {
      const target = objects.find(
        (obj) => Object.prototype.hasOwnProperty.call(obj, name)
      ) || objects[objects.length - 1];
      const descriptor = Object.getOwnPropertyDescriptor(target, name);
      if ((descriptor == null ? void 0 : descriptor.set) && (descriptor == null ? void 0 : descriptor.get))
        return descriptor.set.call(thisProxy, value) || true;
      return Reflect.set(target, name, value);
    }
  };
  function collapseProxies() {
    let keys = Reflect.ownKeys(this);
    return keys.reduce((acc, key) => {
      acc[key] = Reflect.get(this, key);
      return acc;
    }, {});
  }
  function initInterceptors(data2) {
    let isObject2 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
    let recurse = (obj, basePath = "") => {
      Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
        if (enumerable === false || value === void 0)
          return;
        if (typeof value === "object" && value !== null && value.__v_skip)
          return;
        let path = basePath === "" ? key : "".concat(basePath, ".").concat(key);
        if (typeof value === "object" && value !== null && value._x_interceptor) {
          obj[key] = value.initialize(data2, path, key);
        } else {
          if (isObject2(value) && value !== obj && !(value instanceof Element)) {
            recurse(value, path);
          }
        }
      });
    };
    return recurse(data2);
  }
  function interceptor(callback, mutateObj = () => {
  }) {
    let obj = {
      initialValue: void 0,
      _x_interceptor: true,
      initialize(data2, path, key) {
        return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
      }
    };
    mutateObj(obj);
    return (initialValue) => {
      if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
        let initialize = obj.initialize.bind(obj);
        obj.initialize = (data2, path, key) => {
          let innerValue = initialValue.initialize(data2, path, key);
          obj.initialValue = innerValue;
          return initialize(data2, path, key);
        };
      } else {
        obj.initialValue = initialValue;
      }
      return obj;
    };
  }
  function get(obj, path) {
    return path.split(".").reduce((carry, segment) => carry[segment], obj);
  }
  function set(obj, path, value) {
    if (typeof path === "string")
      path = path.split(".");
    if (path.length === 1)
      obj[path[0]] = value;
    else if (path.length === 0)
      throw error;
    else {
      if (obj[path[0]])
        return set(obj[path[0]], path.slice(1), value);
      else {
        obj[path[0]] = {};
        return set(obj[path[0]], path.slice(1), value);
      }
    }
  }
  var magics = {};
  function magic(name, callback) {
    magics[name] = callback;
  }
  function injectMagics(obj, el) {
    let memoizedUtilities = getUtilities(el);
    Object.entries(magics).forEach(([name, callback]) => {
      Object.defineProperty(obj, "$".concat(name), {
        get() {
          return callback(el, memoizedUtilities);
        },
        enumerable: false
      });
    });
    return obj;
  }
  function getUtilities(el) {
    let [utilities, cleanup2] = getElementBoundUtilities(el);
    let utils2 = __spreadValues({ interceptor }, utilities);
    onElRemoved(el, cleanup2);
    return utils2;
  }
  function tryCatch(el, expression, callback, ...args) {
    try {
      return callback(...args);
    } catch (e2) {
      handleError(e2, el, expression);
    }
  }
  function handleError(error2, el, expression = void 0) {
    error2 = Object.assign(
      error2 != null ? error2 : { message: "No error message given." },
      { el, expression }
    );
    console.warn("Alpine Expression Error: ".concat(error2.message, "\n\n").concat(expression ? 'Expression: "' + expression + '"\n\n' : ""), el);
    setTimeout(() => {
      throw error2;
    }, 0);
  }
  var shouldAutoEvaluateFunctions = true;
  function dontAutoEvaluateFunctions(callback) {
    let cache = shouldAutoEvaluateFunctions;
    shouldAutoEvaluateFunctions = false;
    let result = callback();
    shouldAutoEvaluateFunctions = cache;
    return result;
  }
  function evaluate(el, expression, extras = {}) {
    let result;
    evaluateLater(el, expression)((value) => result = value, extras);
    return result;
  }
  function evaluateLater(...args) {
    return theEvaluatorFunction(...args);
  }
  var theEvaluatorFunction = normalEvaluator;
  function setEvaluator(newEvaluator) {
    theEvaluatorFunction = newEvaluator;
  }
  function normalEvaluator(el, expression) {
    let overriddenMagics = {};
    injectMagics(overriddenMagics, el);
    let dataStack = [overriddenMagics, ...closestDataStack(el)];
    let evaluator = typeof expression === "function" ? generateEvaluatorFromFunction(dataStack, expression) : generateEvaluatorFromString(dataStack, expression, el);
    return tryCatch.bind(null, el, expression, evaluator);
  }
  function generateEvaluatorFromFunction(dataStack, func) {
    return (receiver = () => {
    }, { scope: scope2 = {}, params = [], context } = {}) => {
      let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
      runIfTypeOfFunction(receiver, result);
    };
  }
  var evaluatorMemo = {};
  function generateFunctionFromString(expression, el) {
    if (evaluatorMemo[expression]) {
      return evaluatorMemo[expression];
    }
    let AsyncFunction = Object.getPrototypeOf(function() {
      return __async(this, null, function* () {
      });
    }).constructor;
    let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? "(async()=>{ ".concat(expression, " })()") : expression;
    const safeAsyncFunction = () => {
      try {
        let func2 = new AsyncFunction(
          ["__self", "scope"],
          "with (scope) { __self.result = ".concat(rightSideSafeExpression, " }; __self.finished = true; return __self.result;")
        );
        Object.defineProperty(func2, "name", {
          value: "[Alpine] ".concat(expression)
        });
        return func2;
      } catch (error2) {
        handleError(error2, el, expression);
        return Promise.resolve();
      }
    };
    let func = safeAsyncFunction();
    evaluatorMemo[expression] = func;
    return func;
  }
  function generateEvaluatorFromString(dataStack, expression, el) {
    let func = generateFunctionFromString(expression, el);
    return (receiver = () => {
    }, { scope: scope2 = {}, params = [], context } = {}) => {
      func.result = void 0;
      func.finished = false;
      let completeScope = mergeProxies([scope2, ...dataStack]);
      if (typeof func === "function") {
        let promise = func.call(context, func, completeScope).catch((error2) => handleError(error2, el, expression));
        if (func.finished) {
          runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
          func.result = void 0;
        } else {
          promise.then((result) => {
            runIfTypeOfFunction(receiver, result, completeScope, params, el);
          }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
        }
      }
    };
  }
  function runIfTypeOfFunction(receiver, value, scope2, params, el) {
    if (shouldAutoEvaluateFunctions && typeof value === "function") {
      let result = value.apply(scope2, params);
      if (result instanceof Promise) {
        result.then((i2) => runIfTypeOfFunction(receiver, i2, scope2, params)).catch((error2) => handleError(error2, el, value));
      } else {
        receiver(result);
      }
    } else if (typeof value === "object" && value instanceof Promise) {
      value.then((i2) => receiver(i2));
    } else {
      receiver(value);
    }
  }
  var prefixAsString = "x-";
  function prefix(subject = "") {
    return prefixAsString + subject;
  }
  function setPrefix(newPrefix) {
    prefixAsString = newPrefix;
  }
  var directiveHandlers = {};
  function directive(name, callback) {
    directiveHandlers[name] = callback;
    return {
      before(directive2) {
        if (!directiveHandlers[directive2]) {
          console.warn(String.raw(_a || (_a = __template(["Cannot find directive `", "`. `", "` will use the default order of execution"], ["Cannot find directive \\`", "\\`. \\`", "\\` will use the default order of execution"])), directive2, name));
          return;
        }
        const pos = directiveOrder.indexOf(directive2);
        directiveOrder.splice(pos >= 0 ? pos : directiveOrder.indexOf("DEFAULT"), 0, name);
      }
    };
  }
  function directiveExists(name) {
    return Object.keys(directiveHandlers).includes(name);
  }
  function directives(el, attributes, originalAttributeOverride) {
    attributes = Array.from(attributes);
    if (el._x_virtualDirectives) {
      let vAttributes = Object.entries(el._x_virtualDirectives).map(([name, value]) => ({ name, value }));
      let staticAttributes = attributesOnly(vAttributes);
      vAttributes = vAttributes.map((attribute) => {
        if (staticAttributes.find((attr) => attr.name === attribute.name)) {
          return {
            name: "x-bind:".concat(attribute.name),
            value: '"'.concat(attribute.value, '"')
          };
        }
        return attribute;
      });
      attributes = attributes.concat(vAttributes);
    }
    let transformedAttributeMap = {};
    let directives2 = attributes.map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
    return directives2.map((directive2) => {
      return getDirectiveHandler(el, directive2);
    });
  }
  function attributesOnly(attributes) {
    return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
  }
  var isDeferringHandlers = false;
  var directiveHandlerStacks = /* @__PURE__ */ new Map();
  var currentHandlerStackKey = Symbol();
  function deferHandlingDirectives(callback) {
    isDeferringHandlers = true;
    let key = Symbol();
    currentHandlerStackKey = key;
    directiveHandlerStacks.set(key, []);
    let flushHandlers = () => {
      while (directiveHandlerStacks.get(key).length)
        directiveHandlerStacks.get(key).shift()();
      directiveHandlerStacks.delete(key);
    };
    let stopDeferring = () => {
      isDeferringHandlers = false;
      flushHandlers();
    };
    callback(flushHandlers);
    stopDeferring();
  }
  function getElementBoundUtilities(el) {
    let cleanups = [];
    let cleanup2 = (callback) => cleanups.push(callback);
    let [effect3, cleanupEffect] = elementBoundEffect(el);
    cleanups.push(cleanupEffect);
    let utilities = {
      Alpine: alpine_default,
      effect: effect3,
      cleanup: cleanup2,
      evaluateLater: evaluateLater.bind(evaluateLater, el),
      evaluate: evaluate.bind(evaluate, el)
    };
    let doCleanup = () => cleanups.forEach((i2) => i2());
    return [utilities, doCleanup];
  }
  function getDirectiveHandler(el, directive2) {
    let noop2 = () => {
    };
    let handler4 = directiveHandlers[directive2.type] || noop2;
    let [utilities, cleanup2] = getElementBoundUtilities(el);
    onAttributeRemoved(el, directive2.original, cleanup2);
    let fullHandler = () => {
      if (el._x_ignore || el._x_ignoreSelf)
        return;
      handler4.inline && handler4.inline(el, directive2, utilities);
      handler4 = handler4.bind(handler4, el, directive2, utilities);
      isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler4) : handler4();
    };
    fullHandler.runCleanups = cleanup2;
    return fullHandler;
  }
  var startingWith = (subject, replacement) => ({ name, value }) => {
    if (name.startsWith(subject))
      name = name.replace(subject, replacement);
    return { name, value };
  };
  var into = (i2) => i2;
  function toTransformedAttributes(callback = () => {
  }) {
    return ({ name, value }) => {
      let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
        return transform(carry);
      }, { name, value });
      if (newName !== name)
        callback(newName, name);
      return { name: newName, value: newValue };
    };
  }
  var attributeTransformers = [];
  function mapAttributes(callback) {
    attributeTransformers.push(callback);
  }
  function outNonAlpineAttributes({ name }) {
    return alpineAttributeRegex().test(name);
  }
  var alpineAttributeRegex = () => new RegExp("^".concat(prefixAsString, "([^:^.]+)\\b"));
  function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
    return ({ name, value }) => {
      let typeMatch = name.match(alpineAttributeRegex());
      let valueMatch = name.match(/:([a-zA-Z0-9\-_:]+)/);
      let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
      let original = originalAttributeOverride || transformedAttributeMap[name] || name;
      return {
        type: typeMatch ? typeMatch[1] : null,
        value: valueMatch ? valueMatch[1] : null,
        modifiers: modifiers.map((i2) => i2.replace(".", "")),
        expression: value,
        original
      };
    };
  }
  var DEFAULT = "DEFAULT";
  var directiveOrder = [
    "ignore",
    "ref",
    "data",
    "id",
    "anchor",
    "bind",
    "init",
    "for",
    "model",
    "modelable",
    "transition",
    "show",
    "if",
    DEFAULT,
    "teleport"
  ];
  function byPriority(a2, b) {
    let typeA = directiveOrder.indexOf(a2.type) === -1 ? DEFAULT : a2.type;
    let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
    return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
  }
  function dispatch(el, name, detail = {}) {
    el.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        // Allows events to pass the shadow DOM barrier.
        composed: true,
        cancelable: true
      })
    );
  }
  function walk(el, callback) {
    if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
      Array.from(el.children).forEach((el2) => walk(el2, callback));
      return;
    }
    let skip = false;
    callback(el, () => skip = true);
    if (skip)
      return;
    let node = el.firstElementChild;
    while (node) {
      walk(node, callback);
      node = node.nextElementSibling;
    }
  }
  function warn(message, ...args) {
    console.warn("Alpine Warning: ".concat(message), ...args);
  }
  var started = false;
  function start() {
    if (started)
      warn("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.");
    started = true;
    if (!document.body)
      warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
    dispatch(document, "alpine:init");
    dispatch(document, "alpine:initializing");
    startObservingMutations();
    onElAdded((el) => initTree(el, walk));
    onElRemoved((el) => destroyTree(el));
    onAttributesAdded((el, attrs) => {
      directives(el, attrs).forEach((handle) => handle());
    });
    let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
    Array.from(document.querySelectorAll(allSelectors().join(","))).filter(outNestedComponents).forEach((el) => {
      initTree(el);
    });
    dispatch(document, "alpine:initialized");
    setTimeout(() => {
      warnAboutMissingPlugins();
    });
  }
  var rootSelectorCallbacks = [];
  var initSelectorCallbacks = [];
  function rootSelectors() {
    return rootSelectorCallbacks.map((fn) => fn());
  }
  function allSelectors() {
    return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
  }
  function addRootSelector(selectorCallback) {
    rootSelectorCallbacks.push(selectorCallback);
  }
  function addInitSelector(selectorCallback) {
    initSelectorCallbacks.push(selectorCallback);
  }
  function closestRoot(el, includeInitSelectors = false) {
    return findClosest(el, (element) => {
      const selectors2 = includeInitSelectors ? allSelectors() : rootSelectors();
      if (selectors2.some((selector) => element.matches(selector)))
        return true;
    });
  }
  function findClosest(el, callback) {
    if (!el)
      return;
    if (callback(el))
      return el;
    if (el._x_teleportBack)
      el = el._x_teleportBack;
    if (!el.parentElement)
      return;
    return findClosest(el.parentElement, callback);
  }
  function isRoot(el) {
    return rootSelectors().some((selector) => el.matches(selector));
  }
  var initInterceptors2 = [];
  function interceptInit(callback) {
    initInterceptors2.push(callback);
  }
  var markerDispenser = 1;
  function initTree(el, walker = walk, intercept = () => {
  }) {
    if (findClosest(el, (i2) => i2._x_ignore))
      return;
    deferHandlingDirectives(() => {
      walker(el, (el2, skip) => {
        if (el2._x_marker)
          return;
        intercept(el2, skip);
        initInterceptors2.forEach((i2) => i2(el2, skip));
        directives(el2, el2.attributes).forEach((handle) => handle());
        if (!el2._x_ignore)
          el2._x_marker = markerDispenser++;
        el2._x_ignore && skip();
      });
    });
  }
  function destroyTree(root, walker = walk) {
    walker(root, (el) => {
      cleanupElement(el);
      cleanupAttributes(el);
      delete el._x_marker;
    });
  }
  function warnAboutMissingPlugins() {
    let pluginDirectives = [
      ["ui", "dialog", ["[x-dialog], [x-popover]"]],
      ["anchor", "anchor", ["[x-anchor]"]],
      ["sort", "sort", ["[x-sort]"]]
    ];
    pluginDirectives.forEach(([plugin2, directive2, selectors2]) => {
      if (directiveExists(directive2))
        return;
      selectors2.some((selector) => {
        if (document.querySelector(selector)) {
          warn('found "'.concat(selector, '", but missing ').concat(plugin2, " plugin"));
          return true;
        }
      });
    });
  }
  var tickStack = [];
  var isHolding = false;
  function nextTick(callback = () => {
  }) {
    queueMicrotask(() => {
      isHolding || setTimeout(() => {
        releaseNextTicks();
      });
    });
    return new Promise((res) => {
      tickStack.push(() => {
        callback();
        res();
      });
    });
  }
  function releaseNextTicks() {
    isHolding = false;
    while (tickStack.length)
      tickStack.shift()();
  }
  function holdNextTicks() {
    isHolding = true;
  }
  function setClasses(el, value) {
    if (Array.isArray(value)) {
      return setClassesFromString(el, value.join(" "));
    } else if (typeof value === "object" && value !== null) {
      return setClassesFromObject(el, value);
    } else if (typeof value === "function") {
      return setClasses(el, value());
    }
    return setClassesFromString(el, value);
  }
  function setClassesFromString(el, classString) {
    let missingClasses = (classString2) => classString2.split(" ").filter((i2) => !el.classList.contains(i2)).filter(Boolean);
    let addClassesAndReturnUndo = (classes2) => {
      el.classList.add(...classes2);
      return () => {
        el.classList.remove(...classes2);
      };
    };
    classString = classString === true ? classString = "" : classString || "";
    return addClassesAndReturnUndo(missingClasses(classString));
  }
  function setClassesFromObject(el, classObject) {
    let split = (classString) => classString.split(" ").filter(Boolean);
    let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
    let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
    let added = [];
    let removed = [];
    forRemove.forEach((i2) => {
      if (el.classList.contains(i2)) {
        el.classList.remove(i2);
        removed.push(i2);
      }
    });
    forAdd.forEach((i2) => {
      if (!el.classList.contains(i2)) {
        el.classList.add(i2);
        added.push(i2);
      }
    });
    return () => {
      removed.forEach((i2) => el.classList.add(i2));
      added.forEach((i2) => el.classList.remove(i2));
    };
  }
  function setStyles(el, value) {
    if (typeof value === "object" && value !== null) {
      return setStylesFromObject(el, value);
    }
    return setStylesFromString(el, value);
  }
  function setStylesFromObject(el, value) {
    let previousStyles = {};
    Object.entries(value).forEach(([key, value2]) => {
      previousStyles[key] = el.style[key];
      if (!key.startsWith("--")) {
        key = kebabCase(key);
      }
      el.style.setProperty(key, value2);
    });
    setTimeout(() => {
      if (el.style.length === 0) {
        el.removeAttribute("style");
      }
    });
    return () => {
      setStyles(el, previousStyles);
    };
  }
  function setStylesFromString(el, value) {
    let cache = el.getAttribute("style", value);
    el.setAttribute("style", value);
    return () => {
      el.setAttribute("style", cache || "");
    };
  }
  function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  function once(callback, fallback = () => {
  }) {
    let called = false;
    return function() {
      if (!called) {
        called = true;
        callback.apply(this, arguments);
      } else {
        fallback.apply(this, arguments);
      }
    };
  }
  directive("transition", (el, { value, modifiers, expression }, { evaluate: evaluate2 }) => {
    if (typeof expression === "function")
      expression = evaluate2(expression);
    if (expression === false)
      return;
    if (!expression || typeof expression === "boolean") {
      registerTransitionsFromHelper(el, modifiers, value);
    } else {
      registerTransitionsFromClassString(el, expression, value);
    }
  });
  function registerTransitionsFromClassString(el, classString, stage) {
    registerTransitionObject(el, setClasses, "");
    let directiveStorageMap = {
      "enter": (classes2) => {
        el._x_transition.enter.during = classes2;
      },
      "enter-start": (classes2) => {
        el._x_transition.enter.start = classes2;
      },
      "enter-end": (classes2) => {
        el._x_transition.enter.end = classes2;
      },
      "leave": (classes2) => {
        el._x_transition.leave.during = classes2;
      },
      "leave-start": (classes2) => {
        el._x_transition.leave.start = classes2;
      },
      "leave-end": (classes2) => {
        el._x_transition.leave.end = classes2;
      }
    };
    directiveStorageMap[stage](classString);
  }
  function registerTransitionsFromHelper(el, modifiers, stage) {
    registerTransitionObject(el, setStyles);
    let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
    let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
    let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
    if (modifiers.includes("in") && !doesntSpecify) {
      modifiers = modifiers.filter((i2, index) => index < modifiers.indexOf("out"));
    }
    if (modifiers.includes("out") && !doesntSpecify) {
      modifiers = modifiers.filter((i2, index) => index > modifiers.indexOf("out"));
    }
    let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
    let wantsOpacity = wantsAll || modifiers.includes("opacity");
    let wantsScale = wantsAll || modifiers.includes("scale");
    let opacityValue = wantsOpacity ? 0 : 1;
    let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
    let delay = modifierValue(modifiers, "delay", 0) / 1e3;
    let origin2 = modifierValue(modifiers, "origin", "center");
    let property = "opacity, transform";
    let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
    let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
    let easing = "cubic-bezier(0.4, 0.0, 0.2, 1)";
    if (transitioningIn) {
      el._x_transition.enter.during = {
        transformOrigin: origin2,
        transitionDelay: "".concat(delay, "s"),
        transitionProperty: property,
        transitionDuration: "".concat(durationIn, "s"),
        transitionTimingFunction: easing
      };
      el._x_transition.enter.start = {
        opacity: opacityValue,
        transform: "scale(".concat(scaleValue, ")")
      };
      el._x_transition.enter.end = {
        opacity: 1,
        transform: "scale(1)"
      };
    }
    if (transitioningOut) {
      el._x_transition.leave.during = {
        transformOrigin: origin2,
        transitionDelay: "".concat(delay, "s"),
        transitionProperty: property,
        transitionDuration: "".concat(durationOut, "s"),
        transitionTimingFunction: easing
      };
      el._x_transition.leave.start = {
        opacity: 1,
        transform: "scale(1)"
      };
      el._x_transition.leave.end = {
        opacity: opacityValue,
        transform: "scale(".concat(scaleValue, ")")
      };
    }
  }
  function registerTransitionObject(el, setFunction, defaultValue = {}) {
    if (!el._x_transition)
      el._x_transition = {
        enter: { during: defaultValue, start: defaultValue, end: defaultValue },
        leave: { during: defaultValue, start: defaultValue, end: defaultValue },
        in(before = () => {
        }, after = () => {
        }) {
          transition(el, setFunction, {
            during: this.enter.during,
            start: this.enter.start,
            end: this.enter.end
          }, before, after);
        },
        out(before = () => {
        }, after = () => {
        }) {
          transition(el, setFunction, {
            during: this.leave.during,
            start: this.leave.start,
            end: this.leave.end
          }, before, after);
        }
      };
  }
  window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
    const nextTick2 = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
    let clickAwayCompatibleShow = () => nextTick2(show);
    if (value) {
      if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
        el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
      } else {
        el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
      }
      return;
    }
    el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
      el._x_transition.out(() => {
      }, () => resolve(hide));
      el._x_transitioning && el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
    }) : Promise.resolve(hide);
    queueMicrotask(() => {
      let closest = closestHide(el);
      if (closest) {
        if (!closest._x_hideChildren)
          closest._x_hideChildren = [];
        closest._x_hideChildren.push(el);
      } else {
        nextTick2(() => {
          let hideAfterChildren = (el2) => {
            let carry = Promise.all([
              el2._x_hidePromise,
              ...(el2._x_hideChildren || []).map(hideAfterChildren)
            ]).then(([i2]) => i2 == null ? void 0 : i2());
            delete el2._x_hidePromise;
            delete el2._x_hideChildren;
            return carry;
          };
          hideAfterChildren(el).catch((e2) => {
            if (!e2.isFromCancelledTransition)
              throw e2;
          });
        });
      }
    });
  };
  function closestHide(el) {
    let parent = el.parentNode;
    if (!parent)
      return;
    return parent._x_hidePromise ? parent : closestHide(parent);
  }
  function transition(el, setFunction, { during, start: start2, end } = {}, before = () => {
  }, after = () => {
  }) {
    if (el._x_transitioning)
      el._x_transitioning.cancel();
    if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
      before();
      after();
      return;
    }
    let undoStart, undoDuring, undoEnd;
    performTransition(el, {
      start() {
        undoStart = setFunction(el, start2);
      },
      during() {
        undoDuring = setFunction(el, during);
      },
      before,
      end() {
        undoStart();
        undoEnd = setFunction(el, end);
      },
      after,
      cleanup() {
        undoDuring();
        undoEnd();
      }
    });
  }
  function performTransition(el, stages) {
    let interrupted, reachedBefore, reachedEnd;
    let finish = once(() => {
      mutateDom(() => {
        interrupted = true;
        if (!reachedBefore)
          stages.before();
        if (!reachedEnd) {
          stages.end();
          releaseNextTicks();
        }
        stages.after();
        if (el.isConnected)
          stages.cleanup();
        delete el._x_transitioning;
      });
    });
    el._x_transitioning = {
      beforeCancels: [],
      beforeCancel(callback) {
        this.beforeCancels.push(callback);
      },
      cancel: once(function() {
        while (this.beforeCancels.length) {
          this.beforeCancels.shift()();
        }
        finish();
      }),
      finish
    };
    mutateDom(() => {
      stages.start();
      stages.during();
    });
    holdNextTicks();
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
      let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
      if (duration === 0)
        duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
      mutateDom(() => {
        stages.before();
      });
      reachedBefore = true;
      requestAnimationFrame(() => {
        if (interrupted)
          return;
        mutateDom(() => {
          stages.end();
        });
        releaseNextTicks();
        setTimeout(el._x_transitioning.finish, duration + delay);
        reachedEnd = true;
      });
    });
  }
  function modifierValue(modifiers, key, fallback) {
    if (modifiers.indexOf(key) === -1)
      return fallback;
    const rawValue = modifiers[modifiers.indexOf(key) + 1];
    if (!rawValue)
      return fallback;
    if (key === "scale") {
      if (isNaN(rawValue))
        return fallback;
    }
    if (key === "duration" || key === "delay") {
      let match = rawValue.match(/([0-9]+)ms/);
      if (match)
        return match[1];
    }
    if (key === "origin") {
      if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
        return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
      }
    }
    return rawValue;
  }
  var isCloning = false;
  function skipDuringClone(callback, fallback = () => {
  }) {
    return (...args) => isCloning ? fallback(...args) : callback(...args);
  }
  function onlyDuringClone(callback) {
    return (...args) => isCloning && callback(...args);
  }
  var interceptors = [];
  function interceptClone(callback) {
    interceptors.push(callback);
  }
  function cloneNode(from, to) {
    interceptors.forEach((i2) => i2(from, to));
    isCloning = true;
    dontRegisterReactiveSideEffects(() => {
      initTree(to, (el, callback) => {
        callback(el, () => {
        });
      });
    });
    isCloning = false;
  }
  var isCloningLegacy = false;
  function clone(oldEl, newEl) {
    if (!newEl._x_dataStack)
      newEl._x_dataStack = oldEl._x_dataStack;
    isCloning = true;
    isCloningLegacy = true;
    dontRegisterReactiveSideEffects(() => {
      cloneTree(newEl);
    });
    isCloning = false;
    isCloningLegacy = false;
  }
  function cloneTree(el) {
    let hasRunThroughFirstEl = false;
    let shallowWalker = (el2, callback) => {
      walk(el2, (el3, skip) => {
        if (hasRunThroughFirstEl && isRoot(el3))
          return skip();
        hasRunThroughFirstEl = true;
        callback(el3, skip);
      });
    };
    initTree(el, shallowWalker);
  }
  function dontRegisterReactiveSideEffects(callback) {
    let cache = effect;
    overrideEffect((callback2, el) => {
      let storedEffect = cache(callback2);
      release(storedEffect);
      return () => {
      };
    });
    callback();
    overrideEffect(cache);
  }
  function bind$1(el, name, value, modifiers = []) {
    if (!el._x_bindings)
      el._x_bindings = reactive({});
    el._x_bindings[name] = value;
    name = modifiers.includes("camel") ? camelCase(name) : name;
    switch (name) {
      case "value":
        bindInputValue(el, value);
        break;
      case "style":
        bindStyles(el, value);
        break;
      case "class":
        bindClasses(el, value);
        break;
      case "selected":
      case "checked":
        bindAttributeAndProperty(el, name, value);
        break;
      default:
        bindAttribute(el, name, value);
        break;
    }
  }
  function bindInputValue(el, value) {
    if (isRadio(el)) {
      if (el.attributes.value === void 0) {
        el.value = value;
      }
      if (window.fromModel) {
        if (typeof value === "boolean") {
          el.checked = safeParseBoolean(el.value) === value;
        } else {
          el.checked = checkedAttrLooseCompare(el.value, value);
        }
      }
    } else if (isCheckbox(el)) {
      if (Number.isInteger(value)) {
        el.value = value;
      } else if (!Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
        el.value = String(value);
      } else {
        if (Array.isArray(value)) {
          el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
        } else {
          el.checked = !!value;
        }
      }
    } else if (el.tagName === "SELECT") {
      updateSelect(el, value);
    } else {
      if (el.value === value)
        return;
      el.value = value === void 0 ? "" : value;
    }
  }
  function bindClasses(el, value) {
    if (el._x_undoAddedClasses)
      el._x_undoAddedClasses();
    el._x_undoAddedClasses = setClasses(el, value);
  }
  function bindStyles(el, value) {
    if (el._x_undoAddedStyles)
      el._x_undoAddedStyles();
    el._x_undoAddedStyles = setStyles(el, value);
  }
  function bindAttributeAndProperty(el, name, value) {
    bindAttribute(el, name, value);
    setPropertyIfChanged(el, name, value);
  }
  function bindAttribute(el, name, value) {
    if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
      el.removeAttribute(name);
    } else {
      if (isBooleanAttr(name))
        value = name;
      setIfChanged(el, name, value);
    }
  }
  function setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value) {
      el.setAttribute(attrName, value);
    }
  }
  function setPropertyIfChanged(el, propName, value) {
    if (el[propName] !== value) {
      el[propName] = value;
    }
  }
  function updateSelect(el, value) {
    const arrayWrappedValue = [].concat(value).map((value2) => {
      return value2 + "";
    });
    Array.from(el.options).forEach((option) => {
      option.selected = arrayWrappedValue.includes(option.value);
    });
  }
  function camelCase(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
  }
  function checkedAttrLooseCompare(valueA, valueB) {
    return valueA == valueB;
  }
  function safeParseBoolean(rawValue) {
    if ([1, "1", "true", "on", "yes", true].includes(rawValue)) {
      return true;
    }
    if ([0, "0", "false", "off", "no", false].includes(rawValue)) {
      return false;
    }
    return rawValue ? Boolean(rawValue) : null;
  }
  var booleanAttributes = /* @__PURE__ */ new Set([
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected",
    "shadowrootclonable",
    "shadowrootdelegatesfocus",
    "shadowrootserializable"
  ]);
  function isBooleanAttr(attrName) {
    return booleanAttributes.has(attrName);
  }
  function attributeShouldntBePreservedIfFalsy(name) {
    return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
  }
  function getBinding(el, name, fallback) {
    if (el._x_bindings && el._x_bindings[name] !== void 0)
      return el._x_bindings[name];
    return getAttributeBinding(el, name, fallback);
  }
  function extractProp(el, name, fallback, extract = true) {
    if (el._x_bindings && el._x_bindings[name] !== void 0)
      return el._x_bindings[name];
    if (el._x_inlineBindings && el._x_inlineBindings[name] !== void 0) {
      let binding = el._x_inlineBindings[name];
      binding.extract = extract;
      return dontAutoEvaluateFunctions(() => {
        return evaluate(el, binding.expression);
      });
    }
    return getAttributeBinding(el, name, fallback);
  }
  function getAttributeBinding(el, name, fallback) {
    let attr = el.getAttribute(name);
    if (attr === null)
      return typeof fallback === "function" ? fallback() : fallback;
    if (attr === "")
      return true;
    if (isBooleanAttr(name)) {
      return !![name, "true"].includes(attr);
    }
    return attr;
  }
  function isCheckbox(el) {
    return el.type === "checkbox" || el.localName === "ui-checkbox" || el.localName === "ui-switch";
  }
  function isRadio(el) {
    return el.type === "radio" || el.localName === "ui-radio";
  }
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  function throttle$1(func, limit) {
    let inThrottle;
    return function() {
      let context = this, args = arguments;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
    let firstRun = true;
    let outerHash;
    let reference = effect(() => {
      let outer = outerGet();
      let inner = innerGet();
      if (firstRun) {
        innerSet(cloneIfObject(outer));
        firstRun = false;
      } else {
        let outerHashLatest = JSON.stringify(outer);
        let innerHashLatest = JSON.stringify(inner);
        if (outerHashLatest !== outerHash) {
          innerSet(cloneIfObject(outer));
        } else if (outerHashLatest !== innerHashLatest) {
          outerSet(cloneIfObject(inner));
        } else ;
      }
      outerHash = JSON.stringify(outerGet());
      JSON.stringify(innerGet());
    });
    return () => {
      release(reference);
    };
  }
  function cloneIfObject(value) {
    return typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
  }
  function plugin(callback) {
    let callbacks = Array.isArray(callback) ? callback : [callback];
    callbacks.forEach((i2) => i2(alpine_default));
  }
  var stores = {};
  var isReactive = false;
  function store(name, value) {
    if (!isReactive) {
      stores = reactive(stores);
      isReactive = true;
    }
    if (value === void 0) {
      return stores[name];
    }
    stores[name] = value;
    initInterceptors(stores[name]);
    if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
      stores[name].init();
    }
  }
  function getStores() {
    return stores;
  }
  var binds = {};
  function bind2(name, bindings) {
    let getBindings = typeof bindings !== "function" ? () => bindings : bindings;
    if (name instanceof Element) {
      return applyBindingsObject(name, getBindings());
    } else {
      binds[name] = getBindings;
    }
    return () => {
    };
  }
  function injectBindingProviders(obj) {
    Object.entries(binds).forEach(([name, callback]) => {
      Object.defineProperty(obj, name, {
        get() {
          return (...args) => {
            return callback(...args);
          };
        }
      });
    });
    return obj;
  }
  function applyBindingsObject(el, obj, original) {
    let cleanupRunners = [];
    while (cleanupRunners.length)
      cleanupRunners.pop()();
    let attributes = Object.entries(obj).map(([name, value]) => ({ name, value }));
    let staticAttributes = attributesOnly(attributes);
    attributes = attributes.map((attribute) => {
      if (staticAttributes.find((attr) => attr.name === attribute.name)) {
        return {
          name: "x-bind:".concat(attribute.name),
          value: '"'.concat(attribute.value, '"')
        };
      }
      return attribute;
    });
    directives(el, attributes, original).map((handle) => {
      cleanupRunners.push(handle.runCleanups);
      handle();
    });
    return () => {
      while (cleanupRunners.length)
        cleanupRunners.pop()();
    };
  }
  var datas = {};
  function data(name, callback) {
    datas[name] = callback;
  }
  function injectDataProviders(obj, context) {
    Object.entries(datas).forEach(([name, callback]) => {
      Object.defineProperty(obj, name, {
        get() {
          return (...args) => {
            return callback.bind(context)(...args);
          };
        },
        enumerable: false
      });
    });
    return obj;
  }
  var Alpine = {
    get reactive() {
      return reactive;
    },
    get release() {
      return release;
    },
    get effect() {
      return effect;
    },
    get raw() {
      return raw;
    },
    version: "3.15.0",
    flushAndStopDeferringMutations,
    dontAutoEvaluateFunctions,
    disableEffectScheduling,
    startObservingMutations,
    stopObservingMutations,
    setReactivityEngine,
    onAttributeRemoved,
    onAttributesAdded,
    closestDataStack,
    skipDuringClone,
    onlyDuringClone,
    addRootSelector,
    addInitSelector,
    interceptClone,
    addScopeToNode,
    deferMutations,
    mapAttributes,
    evaluateLater,
    interceptInit,
    setEvaluator,
    mergeProxies,
    extractProp,
    findClosest,
    onElRemoved,
    closestRoot,
    destroyTree,
    interceptor,
    // INTERNAL: not public API and is subject to change without major release.
    transition,
    // INTERNAL
    setStyles,
    // INTERNAL
    mutateDom,
    directive,
    entangle,
    throttle: throttle$1,
    debounce,
    evaluate,
    initTree,
    nextTick,
    prefixed: prefix,
    prefix: setPrefix,
    plugin,
    magic,
    store,
    start,
    clone,
    // INTERNAL
    cloneNode,
    // INTERNAL
    bound: getBinding,
    $data: scope,
    watch,
    walk,
    data,
    bind: bind2
  };
  var alpine_default = Alpine;
  function makeMap(str, expectsLowerCase) {
    const map = /* @__PURE__ */ Object.create(null);
    const list = str.split(",");
    for (let i2 = 0; i2 < list.length; i2++) {
      map[list[i2]] = true;
    }
    return (val) => !!map[val];
  }
  var EMPTY_OBJ = Object.freeze({});
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
  var isArray$1 = Array.isArray;
  var isMap = (val) => toTypeString(val) === "[object Map]";
  var isString$1 = (val) => typeof val === "string";
  var isSymbol = (val) => typeof val === "symbol";
  var isObject$1 = (val) => val !== null && typeof val === "object";
  var objectToString = Object.prototype.toString;
  var toTypeString = (value) => objectToString.call(value);
  var toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  var isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  var cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
  var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
  var targetMap = /* @__PURE__ */ new WeakMap();
  var effectStack = [];
  var activeEffect;
  var ITERATE_KEY = Symbol("iterate");
  var MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
  function isEffect(fn) {
    return fn && fn._isEffect === true;
  }
  function effect2(fn, options = EMPTY_OBJ) {
    if (isEffect(fn)) {
      fn = fn.raw;
    }
    const effect3 = createReactiveEffect(fn, options);
    if (!options.lazy) {
      effect3();
    }
    return effect3;
  }
  function stop(effect3) {
    if (effect3.active) {
      cleanup(effect3);
      if (effect3.options.onStop) {
        effect3.options.onStop();
      }
      effect3.active = false;
    }
  }
  var uid = 0;
  function createReactiveEffect(fn, options) {
    const effect3 = function reactiveEffect() {
      if (!effect3.active) {
        return fn();
      }
      if (!effectStack.includes(effect3)) {
        cleanup(effect3);
        try {
          enableTracking();
          effectStack.push(effect3);
          activeEffect = effect3;
          return fn();
        } finally {
          effectStack.pop();
          resetTracking();
          activeEffect = effectStack[effectStack.length - 1];
        }
      }
    };
    effect3.id = uid++;
    effect3.allowRecurse = !!options.allowRecurse;
    effect3._isEffect = true;
    effect3.active = true;
    effect3.raw = fn;
    effect3.deps = [];
    effect3.options = options;
    return effect3;
  }
  function cleanup(effect3) {
    const { deps } = effect3;
    if (deps.length) {
      for (let i2 = 0; i2 < deps.length; i2++) {
        deps[i2].delete(effect3);
      }
      deps.length = 0;
    }
  }
  var shouldTrack = true;
  var trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function track(target, type, key) {
    if (!shouldTrack || activeEffect === void 0) {
      return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
      if (activeEffect.options.onTrack) {
        activeEffect.options.onTrack({
          effect: activeEffect,
          target,
          type,
          key
        });
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    const effects = /* @__PURE__ */ new Set();
    const add2 = (effectsToAdd) => {
      if (effectsToAdd) {
        effectsToAdd.forEach((effect3) => {
          if (effect3 !== activeEffect || effect3.allowRecurse) {
            effects.add(effect3);
          }
        });
      }
    };
    if (type === "clear") {
      depsMap.forEach(add2);
    } else if (key === "length" && isArray$1(target)) {
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 >= newValue) {
          add2(dep);
        }
      });
    } else {
      if (key !== void 0) {
        add2(depsMap.get(key));
      }
      switch (type) {
        case "add":
          if (!isArray$1(target)) {
            add2(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              add2(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            add2(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!isArray$1(target)) {
            add2(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              add2(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            add2(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
    const run = (effect3) => {
      if (effect3.options.onTrigger) {
        effect3.options.onTrigger({
          effect: effect3,
          target,
          key,
          type,
          newValue,
          oldValue,
          oldTarget
        });
      }
      if (effect3.options.scheduler) {
        effect3.options.scheduler(effect3);
      } else {
        effect3();
      }
    };
    effects.forEach(run);
  }
  var isNonTrackableKeys = /* @__PURE__ */ makeMap("__proto__,__v_isRef,__isVue");
  var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
  var get2 = /* @__PURE__ */ createGetter();
  var readonlyGet = /* @__PURE__ */ createGetter(true);
  var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
  function createArrayInstrumentations() {
    const instrumentations = {};
    ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
      instrumentations[key] = function(...args) {
        const arr = toRaw(this);
        for (let i2 = 0, l2 = this.length; i2 < l2; i2++) {
          track(arr, "get", i2 + "");
        }
        const res = arr[key](...args);
        if (res === -1 || res === false) {
          return arr[key](...args.map(toRaw));
        } else {
          return res;
        }
      };
    });
    ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
      instrumentations[key] = function(...args) {
        pauseTracking();
        const res = toRaw(this)[key].apply(this, args);
        resetTracking();
        return res;
      };
    });
    return instrumentations;
  }
  function createGetter(isReadonly = false, shallow = false) {
    return function get3(target, key, receiver) {
      if (key === "__v_isReactive") {
        return !isReadonly;
      } else if (key === "__v_isReadonly") {
        return isReadonly;
      } else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
        return target;
      }
      const targetIsArray = isArray$1(target);
      if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      const res = Reflect.get(target, key, receiver);
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly) {
        track(target, "get", key);
      }
      if (shallow) {
        return res;
      }
      if (isRef(res)) {
        const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
        return shouldUnwrap ? res.value : res;
      }
      if (isObject$1(res)) {
        return isReadonly ? readonly(res) : reactive2(res);
      }
      return res;
    };
  }
  var set2 = /* @__PURE__ */ createSetter();
  function createSetter(shallow = false) {
    return function set3(target, key, value, receiver) {
      let oldValue = target[key];
      if (!shallow) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
        if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        }
      }
      const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
      }
      return result;
    };
  }
  function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  function ownKeys(target) {
    track(target, "iterate", isArray$1(target) ? "length" : ITERATE_KEY);
    return Reflect.ownKeys(target);
  }
  var mutableHandlers = {
    get: get2,
    set: set2,
    deleteProperty,
    has,
    ownKeys
  };
  var readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
      {
        console.warn('Set operation on key "'.concat(String(key), '" failed: target is readonly.'), target);
      }
      return true;
    },
    deleteProperty(target, key) {
      {
        console.warn('Delete operation on key "'.concat(String(key), '" failed: target is readonly.'), target);
      }
      return true;
    }
  };
  var toReactive = (value) => isObject$1(value) ? reactive2(value) : value;
  var toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
  var toShallow = (value) => value;
  var getProto = (v) => Reflect.getPrototypeOf(v);
  function get$1(target, key, isReadonly = false, isShallow = false) {
    target = target[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "get", key);
    }
    !isReadonly && track(rawTarget, "get", rawKey);
    const { has: has2 } = getProto(rawTarget);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    if (has2.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has2.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
      target.get(key);
    }
  }
  function has$1(key, isReadonly = false) {
    const target = this[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "has", key);
    }
    !isReadonly && track(rawTarget, "has", rawKey);
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }
  function size(target, isReadonly = false) {
    target = target[
      "__v_raw"
      /* RAW */
    ];
    !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
    return Reflect.get(target, "size", target);
  }
  function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    if (!hadKey) {
      target.add(value);
      trigger(target, "add", value, value);
    }
    return this;
  }
  function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has: has2, get: get3 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get3.call(target, key);
    target.set(key, value);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, "set", key, value, oldValue);
    }
    return this;
  }
  function deleteEntry(key) {
    const target = toRaw(this);
    const { has: has2, get: get3 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get3 ? get3.call(target, key) : void 0;
    const result = target.delete(key);
    if (hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget = isMap(target) ? new Map(target) : new Set(target);
    const result = target.clear();
    if (hadItems) {
      trigger(target, "clear", void 0, void 0, oldTarget);
    }
    return result;
  }
  function createForEach(isReadonly, isShallow) {
    return function forEach2(callback, thisArg) {
      const observed = this;
      const target = observed[
        "__v_raw"
        /* RAW */
      ];
      const rawTarget = toRaw(target);
      const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }
  function createIterableMethod(method, isReadonly, isShallow) {
    return function(...args) {
      const target = this[
        "__v_raw"
        /* RAW */
      ];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      {
        const key = args[0] ? 'on key "'.concat(args[0], '" ') : "";
        console.warn("".concat(capitalize(type), " operation ").concat(key, "failed: target is readonly."), toRaw(this));
      }
      return type === "delete" ? false : this;
    };
  }
  function createInstrumentations() {
    const mutableInstrumentations2 = {
      get(key) {
        return get$1(this, key);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
    };
    const shallowInstrumentations2 = {
      get(key) {
        return get$1(this, key, false, true);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
    };
    const readonlyInstrumentations2 = {
      get(key) {
        return get$1(this, key, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod(
        "add"
        /* ADD */
      ),
      set: createReadonlyMethod(
        "set"
        /* SET */
      ),
      delete: createReadonlyMethod(
        "delete"
        /* DELETE */
      ),
      clear: createReadonlyMethod(
        "clear"
        /* CLEAR */
      ),
      forEach: createForEach(true, false)
    };
    const shallowReadonlyInstrumentations2 = {
      get(key) {
        return get$1(this, key, true, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod(
        "add"
        /* ADD */
      ),
      set: createReadonlyMethod(
        "set"
        /* SET */
      ),
      delete: createReadonlyMethod(
        "delete"
        /* DELETE */
      ),
      clear: createReadonlyMethod(
        "clear"
        /* CLEAR */
      ),
      forEach: createForEach(true, true)
    };
    const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
    iteratorMethods.forEach((method) => {
      mutableInstrumentations2[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
      shallowInstrumentations2[method] = createIterableMethod(method, false, true);
      shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
    });
    return [
      mutableInstrumentations2,
      readonlyInstrumentations2,
      shallowInstrumentations2,
      shallowReadonlyInstrumentations2
    ];
  }
  var [mutableInstrumentations, readonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
  function createInstrumentationGetter(isReadonly, shallow) {
    const instrumentations = isReadonly ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly;
      } else if (key === "__v_isReadonly") {
        return isReadonly;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
  }
  var mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false)
  };
  var readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true)
  };
  function checkIdentityKeys(target, has2, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has2.call(target, rawKey)) {
      const type = toRawType(target);
      console.warn("Reactive ".concat(type, " contains both the raw and reactive versions of the same object").concat(type === "Map" ? " as keys" : "", ", which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible."));
    }
  }
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  var readonlyMap = /* @__PURE__ */ new WeakMap();
  var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value[
      "__v_skip"
      /* SKIP */
    ] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive2(target) {
    if (target && target[
      "__v_isReadonly"
      /* IS_READONLY */
    ]) {
      return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
  }
  function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
  }
  function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject$1(target)) {
      {
        console.warn("value cannot be made reactive: ".concat(String(target)));
      }
      return target;
    }
    if (target[
      "__v_raw"
      /* RAW */
    ] && !(isReadonly && target[
      "__v_isReactive"
      /* IS_REACTIVE */
    ])) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
  }
  function toRaw(observed) {
    return observed && toRaw(observed[
      "__v_raw"
      /* RAW */
    ]) || observed;
  }
  function isRef(r2) {
    return Boolean(r2 && r2.__v_isRef === true);
  }
  magic("nextTick", () => nextTick);
  magic("dispatch", (el) => dispatch.bind(dispatch, el));
  magic("watch", (el, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => (key, callback) => {
    let evaluate2 = evaluateLater2(key);
    let getter = () => {
      let value;
      evaluate2((i2) => value = i2);
      return value;
    };
    let unwatch = watch(getter, callback);
    cleanup2(unwatch);
  });
  magic("store", getStores);
  magic("data", (el) => scope(el));
  magic("root", (el) => closestRoot(el));
  magic("refs", (el) => {
    if (el._x_refs_proxy)
      return el._x_refs_proxy;
    el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
    return el._x_refs_proxy;
  });
  function getArrayOfRefObject(el) {
    let refObjects = [];
    findClosest(el, (i2) => {
      if (i2._x_refs)
        refObjects.push(i2._x_refs);
    });
    return refObjects;
  }
  var globalIdMemo = {};
  function findAndIncrementId(name) {
    if (!globalIdMemo[name])
      globalIdMemo[name] = 0;
    return ++globalIdMemo[name];
  }
  function closestIdRoot(el, name) {
    return findClosest(el, (element) => {
      if (element._x_ids && element._x_ids[name])
        return true;
    });
  }
  function setIdRoot(el, name) {
    if (!el._x_ids)
      el._x_ids = {};
    if (!el._x_ids[name])
      el._x_ids[name] = findAndIncrementId(name);
  }
  magic("id", (el, { cleanup: cleanup2 }) => (name, key = null) => {
    let cacheKey = "".concat(name).concat(key ? "-".concat(key) : "");
    return cacheIdByNameOnElement(el, cacheKey, cleanup2, () => {
      let root = closestIdRoot(el, name);
      let id = root ? root._x_ids[name] : findAndIncrementId(name);
      return key ? "".concat(name, "-").concat(id, "-").concat(key) : "".concat(name, "-").concat(id);
    });
  });
  interceptClone((from, to) => {
    if (from._x_id) {
      to._x_id = from._x_id;
    }
  });
  function cacheIdByNameOnElement(el, cacheKey, cleanup2, callback) {
    if (!el._x_id)
      el._x_id = {};
    if (el._x_id[cacheKey])
      return el._x_id[cacheKey];
    let output = callback();
    el._x_id[cacheKey] = output;
    cleanup2(() => {
      delete el._x_id[cacheKey];
    });
    return output;
  }
  magic("el", (el) => el);
  warnMissingPluginMagic("Focus", "focus", "focus");
  warnMissingPluginMagic("Persist", "persist", "persist");
  function warnMissingPluginMagic(name, magicName, slug) {
    magic(magicName, (el) => warn("You can't use [$".concat(magicName, '] without first installing the "').concat(name, '" plugin here: https://alpinejs.dev/plugins/').concat(slug), el));
  }
  directive("modelable", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
    let func = evaluateLater2(expression);
    let innerGet = () => {
      let result;
      func((i2) => result = i2);
      return result;
    };
    let evaluateInnerSet = evaluateLater2("".concat(expression, " = __placeholder"));
    let innerSet = (val) => evaluateInnerSet(() => {
    }, { scope: { "__placeholder": val } });
    let initialValue = innerGet();
    innerSet(initialValue);
    queueMicrotask(() => {
      if (!el._x_model)
        return;
      el._x_removeModelListeners["default"]();
      let outerGet = el._x_model.get;
      let outerSet = el._x_model.set;
      let releaseEntanglement = entangle(
        {
          get() {
            return outerGet();
          },
          set(value) {
            outerSet(value);
          }
        },
        {
          get() {
            return innerGet();
          },
          set(value) {
            innerSet(value);
          }
        }
      );
      cleanup2(releaseEntanglement);
    });
  });
  directive("teleport", (el, { modifiers, expression }, { cleanup: cleanup2 }) => {
    if (el.tagName.toLowerCase() !== "template")
      warn("x-teleport can only be used on a <template> tag", el);
    let target = getTarget(expression);
    let clone2 = el.content.cloneNode(true).firstElementChild;
    el._x_teleport = clone2;
    clone2._x_teleportBack = el;
    el.setAttribute("data-teleport-template", true);
    clone2.setAttribute("data-teleport-target", true);
    if (el._x_forwardEvents) {
      el._x_forwardEvents.forEach((eventName) => {
        clone2.addEventListener(eventName, (e2) => {
          e2.stopPropagation();
          el.dispatchEvent(new e2.constructor(e2.type, e2));
        });
      });
    }
    addScopeToNode(clone2, {}, el);
    let placeInDom = (clone3, target2, modifiers2) => {
      if (modifiers2.includes("prepend")) {
        target2.parentNode.insertBefore(clone3, target2);
      } else if (modifiers2.includes("append")) {
        target2.parentNode.insertBefore(clone3, target2.nextSibling);
      } else {
        target2.appendChild(clone3);
      }
    };
    mutateDom(() => {
      placeInDom(clone2, target, modifiers);
      skipDuringClone(() => {
        initTree(clone2);
      })();
    });
    el._x_teleportPutBack = () => {
      let target2 = getTarget(expression);
      mutateDom(() => {
        placeInDom(el._x_teleport, target2, modifiers);
      });
    };
    cleanup2(
      () => mutateDom(() => {
        clone2.remove();
        destroyTree(clone2);
      })
    );
  });
  var teleportContainerDuringClone = document.createElement("div");
  function getTarget(expression) {
    let target = skipDuringClone(() => {
      return document.querySelector(expression);
    }, () => {
      return teleportContainerDuringClone;
    })();
    if (!target)
      warn('Cannot find x-teleport element for selector: "'.concat(expression, '"'));
    return target;
  }
  var handler = () => {
  };
  handler.inline = (el, { modifiers }, { cleanup: cleanup2 }) => {
    modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
    cleanup2(() => {
      modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
    });
  };
  directive("ignore", handler);
  directive("effect", skipDuringClone((el, { expression }, { effect: effect3 }) => {
    effect3(evaluateLater(el, expression));
  }));
  function on(el, event, modifiers, callback) {
    let listenerTarget = el;
    let handler4 = (e2) => callback(e2);
    let options = {};
    let wrapHandler = (callback2, wrapper) => (e2) => wrapper(callback2, e2);
    if (modifiers.includes("dot"))
      event = dotSyntax(event);
    if (modifiers.includes("camel"))
      event = camelCase2(event);
    if (modifiers.includes("passive"))
      options.passive = true;
    if (modifiers.includes("capture"))
      options.capture = true;
    if (modifiers.includes("window"))
      listenerTarget = window;
    if (modifiers.includes("document"))
      listenerTarget = document;
    if (modifiers.includes("debounce")) {
      let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
      let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
      handler4 = debounce(handler4, wait);
    }
    if (modifiers.includes("throttle")) {
      let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
      let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
      handler4 = throttle$1(handler4, wait);
    }
    if (modifiers.includes("prevent"))
      handler4 = wrapHandler(handler4, (next, e2) => {
        e2.preventDefault();
        next(e2);
      });
    if (modifiers.includes("stop"))
      handler4 = wrapHandler(handler4, (next, e2) => {
        e2.stopPropagation();
        next(e2);
      });
    if (modifiers.includes("once")) {
      handler4 = wrapHandler(handler4, (next, e2) => {
        next(e2);
        listenerTarget.removeEventListener(event, handler4, options);
      });
    }
    if (modifiers.includes("away") || modifiers.includes("outside")) {
      listenerTarget = document;
      handler4 = wrapHandler(handler4, (next, e2) => {
        if (el.contains(e2.target))
          return;
        if (e2.target.isConnected === false)
          return;
        if (el.offsetWidth < 1 && el.offsetHeight < 1)
          return;
        if (el._x_isShown === false)
          return;
        next(e2);
      });
    }
    if (modifiers.includes("self"))
      handler4 = wrapHandler(handler4, (next, e2) => {
        e2.target === el && next(e2);
      });
    if (isKeyEvent(event) || isClickEvent(event)) {
      handler4 = wrapHandler(handler4, (next, e2) => {
        if (isListeningForASpecificKeyThatHasntBeenPressed(e2, modifiers)) {
          return;
        }
        next(e2);
      });
    }
    listenerTarget.addEventListener(event, handler4, options);
    return () => {
      listenerTarget.removeEventListener(event, handler4, options);
    };
  }
  function dotSyntax(subject) {
    return subject.replace(/-/g, ".");
  }
  function camelCase2(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
  }
  function isNumeric(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  function kebabCase2(subject) {
    if ([" ", "_"].includes(
      subject
    ))
      return subject;
    return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
  }
  function isKeyEvent(event) {
    return ["keydown", "keyup"].includes(event);
  }
  function isClickEvent(event) {
    return ["contextmenu", "click", "mouse"].some((i2) => event.includes(i2));
  }
  function isListeningForASpecificKeyThatHasntBeenPressed(e2, modifiers) {
    let keyModifiers = modifiers.filter((i2) => {
      return !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(i2);
    });
    if (keyModifiers.includes("debounce")) {
      let debounceIndex = keyModifiers.indexOf("debounce");
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
    }
    if (keyModifiers.includes("throttle")) {
      let debounceIndex = keyModifiers.indexOf("throttle");
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
    }
    if (keyModifiers.length === 0)
      return false;
    if (keyModifiers.length === 1 && keyToModifiers(e2.key).includes(keyModifiers[0]))
      return false;
    const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
    const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
    keyModifiers = keyModifiers.filter((i2) => !selectedSystemKeyModifiers.includes(i2));
    if (selectedSystemKeyModifiers.length > 0) {
      const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
        if (modifier === "cmd" || modifier === "super")
          modifier = "meta";
        return e2["".concat(modifier, "Key")];
      });
      if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
        if (isClickEvent(e2.type))
          return false;
        if (keyToModifiers(e2.key).includes(keyModifiers[0]))
          return false;
      }
    }
    return true;
  }
  function keyToModifiers(key) {
    if (!key)
      return [];
    key = kebabCase2(key);
    let modifierToKeyMap = {
      "ctrl": "control",
      "slash": "/",
      "space": " ",
      "spacebar": " ",
      "cmd": "meta",
      "esc": "escape",
      "up": "arrow-up",
      "down": "arrow-down",
      "left": "arrow-left",
      "right": "arrow-right",
      "period": ".",
      "comma": ",",
      "equal": "=",
      "minus": "-",
      "underscore": "_"
    };
    modifierToKeyMap[key] = key;
    return Object.keys(modifierToKeyMap).map((modifier) => {
      if (modifierToKeyMap[modifier] === key)
        return modifier;
    }).filter((modifier) => modifier);
  }
  directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup: cleanup2 }) => {
    let scopeTarget = el;
    if (modifiers.includes("parent")) {
      scopeTarget = el.parentNode;
    }
    let evaluateGet = evaluateLater(scopeTarget, expression);
    let evaluateSet;
    if (typeof expression === "string") {
      evaluateSet = evaluateLater(scopeTarget, "".concat(expression, " = __placeholder"));
    } else if (typeof expression === "function" && typeof expression() === "string") {
      evaluateSet = evaluateLater(scopeTarget, "".concat(expression(), " = __placeholder"));
    } else {
      evaluateSet = () => {
      };
    }
    let getValue = () => {
      let result;
      evaluateGet((value) => result = value);
      return isGetterSetter(result) ? result.get() : result;
    };
    let setValue = (value) => {
      let result;
      evaluateGet((value2) => result = value2);
      if (isGetterSetter(result)) {
        result.set(value);
      } else {
        evaluateSet(() => {
        }, {
          scope: { "__placeholder": value }
        });
      }
    };
    if (typeof expression === "string" && el.type === "radio") {
      mutateDom(() => {
        if (!el.hasAttribute("name"))
          el.setAttribute("name", expression);
      });
    }
    let event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
    let removeListener = isCloning ? () => {
    } : on(el, event, modifiers, (e2) => {
      setValue(getInputValue(el, modifiers, e2, getValue()));
    });
    if (modifiers.includes("fill")) {
      if ([void 0, null, ""].includes(getValue()) || isCheckbox(el) && Array.isArray(getValue()) || el.tagName.toLowerCase() === "select" && el.multiple) {
        setValue(
          getInputValue(el, modifiers, { target: el }, getValue())
        );
      }
    }
    if (!el._x_removeModelListeners)
      el._x_removeModelListeners = {};
    el._x_removeModelListeners["default"] = removeListener;
    cleanup2(() => el._x_removeModelListeners["default"]());
    if (el.form) {
      let removeResetListener = on(el.form, "reset", [], (e2) => {
        nextTick(() => el._x_model && el._x_model.set(getInputValue(el, modifiers, { target: el }, getValue())));
      });
      cleanup2(() => removeResetListener());
    }
    el._x_model = {
      get() {
        return getValue();
      },
      set(value) {
        setValue(value);
      }
    };
    el._x_forceModelUpdate = (value) => {
      if (value === void 0 && typeof expression === "string" && expression.match(/\./))
        value = "";
      window.fromModel = true;
      mutateDom(() => bind$1(el, "value", value));
      delete window.fromModel;
    };
    effect3(() => {
      let value = getValue();
      if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
        return;
      el._x_forceModelUpdate(value);
    });
  });
  function getInputValue(el, modifiers, event, currentValue) {
    return mutateDom(() => {
      if (event instanceof CustomEvent && event.detail !== void 0)
        return event.detail !== null && event.detail !== void 0 ? event.detail : event.target.value;
      else if (isCheckbox(el)) {
        if (Array.isArray(currentValue)) {
          let newValue = null;
          if (modifiers.includes("number")) {
            newValue = safeParseNumber(event.target.value);
          } else if (modifiers.includes("boolean")) {
            newValue = safeParseBoolean(event.target.value);
          } else {
            newValue = event.target.value;
          }
          return event.target.checked ? currentValue.includes(newValue) ? currentValue : currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
        } else {
          return event.target.checked;
        }
      } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
        if (modifiers.includes("number")) {
          return Array.from(event.target.selectedOptions).map((option) => {
            let rawValue = option.value || option.text;
            return safeParseNumber(rawValue);
          });
        } else if (modifiers.includes("boolean")) {
          return Array.from(event.target.selectedOptions).map((option) => {
            let rawValue = option.value || option.text;
            return safeParseBoolean(rawValue);
          });
        }
        return Array.from(event.target.selectedOptions).map((option) => {
          return option.value || option.text;
        });
      } else {
        let newValue;
        if (isRadio(el)) {
          if (event.target.checked) {
            newValue = event.target.value;
          } else {
            newValue = currentValue;
          }
        } else {
          newValue = event.target.value;
        }
        if (modifiers.includes("number")) {
          return safeParseNumber(newValue);
        } else if (modifiers.includes("boolean")) {
          return safeParseBoolean(newValue);
        } else if (modifiers.includes("trim")) {
          return newValue.trim();
        } else {
          return newValue;
        }
      }
    });
  }
  function safeParseNumber(rawValue) {
    let number = rawValue ? parseFloat(rawValue) : null;
    return isNumeric2(number) ? number : rawValue;
  }
  function checkedAttrLooseCompare2(valueA, valueB) {
    return valueA == valueB;
  }
  function isNumeric2(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  function isGetterSetter(value) {
    return value !== null && typeof value === "object" && typeof value.get === "function" && typeof value.set === "function";
  }
  directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));
  addInitSelector(() => "[".concat(prefix("init"), "]"));
  directive("init", skipDuringClone((el, { expression }, { evaluate: evaluate2 }) => {
    if (typeof expression === "string") {
      return !!expression.trim() && evaluate2(expression, {}, false);
    }
    return evaluate2(expression, {}, false);
  }));
  directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
    let evaluate2 = evaluateLater2(expression);
    effect3(() => {
      evaluate2((value) => {
        mutateDom(() => {
          el.textContent = value;
        });
      });
    });
  });
  directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
    let evaluate2 = evaluateLater2(expression);
    effect3(() => {
      evaluate2((value) => {
        mutateDom(() => {
          el.innerHTML = value;
          el._x_ignoreSelf = true;
          initTree(el);
          delete el._x_ignoreSelf;
        });
      });
    });
  });
  mapAttributes(startingWith(":", into(prefix("bind:"))));
  var handler2 = (el, { value, modifiers, expression, original }, { effect: effect3, cleanup: cleanup2 }) => {
    if (!value) {
      let bindingProviders = {};
      injectBindingProviders(bindingProviders);
      let getBindings = evaluateLater(el, expression);
      getBindings((bindings) => {
        applyBindingsObject(el, bindings, original);
      }, { scope: bindingProviders });
      return;
    }
    if (value === "key")
      return storeKeyForXFor(el, expression);
    if (el._x_inlineBindings && el._x_inlineBindings[value] && el._x_inlineBindings[value].extract) {
      return;
    }
    let evaluate2 = evaluateLater(el, expression);
    effect3(() => evaluate2((result) => {
      if (result === void 0 && typeof expression === "string" && expression.match(/\./)) {
        result = "";
      }
      mutateDom(() => bind$1(el, value, result, modifiers));
    }));
    cleanup2(() => {
      el._x_undoAddedClasses && el._x_undoAddedClasses();
      el._x_undoAddedStyles && el._x_undoAddedStyles();
    });
  };
  handler2.inline = (el, { value, modifiers, expression }) => {
    if (!value)
      return;
    if (!el._x_inlineBindings)
      el._x_inlineBindings = {};
    el._x_inlineBindings[value] = { expression, extract: false };
  };
  directive("bind", handler2);
  function storeKeyForXFor(el, expression) {
    el._x_keyExpression = expression;
  }
  addRootSelector(() => "[".concat(prefix("data"), "]"));
  directive("data", (el, { expression }, { cleanup: cleanup2 }) => {
    if (shouldSkipRegisteringDataDuringClone(el))
      return;
    expression = expression === "" ? "{}" : expression;
    let magicContext = {};
    injectMagics(magicContext, el);
    let dataProviderContext = {};
    injectDataProviders(dataProviderContext, magicContext);
    let data2 = evaluate(el, expression, { scope: dataProviderContext });
    if (data2 === void 0 || data2 === true)
      data2 = {};
    injectMagics(data2, el);
    let reactiveData = reactive(data2);
    initInterceptors(reactiveData);
    let undo = addScopeToNode(el, reactiveData);
    reactiveData["init"] && evaluate(el, reactiveData["init"]);
    cleanup2(() => {
      reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
      undo();
    });
  });
  interceptClone((from, to) => {
    if (from._x_dataStack) {
      to._x_dataStack = from._x_dataStack;
      to.setAttribute("data-has-alpine-state", true);
    }
  });
  function shouldSkipRegisteringDataDuringClone(el) {
    if (!isCloning)
      return false;
    if (isCloningLegacy)
      return true;
    return el.hasAttribute("data-has-alpine-state");
  }
  directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
    let evaluate2 = evaluateLater(el, expression);
    if (!el._x_doHide)
      el._x_doHide = () => {
        mutateDom(() => {
          el.style.setProperty("display", "none", modifiers.includes("important") ? "important" : void 0);
        });
      };
    if (!el._x_doShow)
      el._x_doShow = () => {
        mutateDom(() => {
          if (el.style.length === 1 && el.style.display === "none") {
            el.removeAttribute("style");
          } else {
            el.style.removeProperty("display");
          }
        });
      };
    let hide = () => {
      el._x_doHide();
      el._x_isShown = false;
    };
    let show = () => {
      el._x_doShow();
      el._x_isShown = true;
    };
    let clickAwayCompatibleShow = () => setTimeout(show);
    let toggle2 = once(
      (value) => value ? show() : hide(),
      (value) => {
        if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
          el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
        } else {
          value ? clickAwayCompatibleShow() : hide();
        }
      }
    );
    let oldValue;
    let firstTime = true;
    effect3(() => evaluate2((value) => {
      if (!firstTime && value === oldValue)
        return;
      if (modifiers.includes("immediate"))
        value ? clickAwayCompatibleShow() : hide();
      toggle2(value);
      oldValue = value;
      firstTime = false;
    }));
  });
  directive("for", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
    let iteratorNames = parseForExpression(expression);
    let evaluateItems = evaluateLater(el, iteratorNames.items);
    let evaluateKey = evaluateLater(
      el,
      // the x-bind:key expression is stored for our use instead of evaluated.
      el._x_keyExpression || "index"
    );
    el._x_prevKeys = [];
    el._x_lookup = {};
    effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
    cleanup2(() => {
      Object.values(el._x_lookup).forEach((el2) => mutateDom(
        () => {
          destroyTree(el2);
          el2.remove();
        }
      ));
      delete el._x_prevKeys;
      delete el._x_lookup;
    });
  });
  function loop(el, iteratorNames, evaluateItems, evaluateKey) {
    let isObject2 = (i2) => typeof i2 === "object" && !Array.isArray(i2);
    let templateEl = el;
    evaluateItems((items) => {
      if (isNumeric3(items) && items >= 0) {
        items = Array.from(Array(items).keys(), (i2) => i2 + 1);
      }
      if (items === void 0)
        items = [];
      let lookup = el._x_lookup;
      let prevKeys = el._x_prevKeys;
      let scopes = [];
      let keys = [];
      if (isObject2(items)) {
        items = Object.entries(items).map(([key, value]) => {
          let scope2 = getIterationScopeVariables(iteratorNames, value, key, items);
          evaluateKey((value2) => {
            if (keys.includes(value2))
              warn("Duplicate key on x-for", el);
            keys.push(value2);
          }, { scope: __spreadValues({ index: key }, scope2) });
          scopes.push(scope2);
        });
      } else {
        for (let i2 = 0; i2 < items.length; i2++) {
          let scope2 = getIterationScopeVariables(iteratorNames, items[i2], i2, items);
          evaluateKey((value) => {
            if (keys.includes(value))
              warn("Duplicate key on x-for", el);
            keys.push(value);
          }, { scope: __spreadValues({ index: i2 }, scope2) });
          scopes.push(scope2);
        }
      }
      let adds = [];
      let moves = [];
      let removes = [];
      let sames = [];
      for (let i2 = 0; i2 < prevKeys.length; i2++) {
        let key = prevKeys[i2];
        if (keys.indexOf(key) === -1)
          removes.push(key);
      }
      prevKeys = prevKeys.filter((key) => !removes.includes(key));
      let lastKey = "template";
      for (let i2 = 0; i2 < keys.length; i2++) {
        let key = keys[i2];
        let prevIndex = prevKeys.indexOf(key);
        if (prevIndex === -1) {
          prevKeys.splice(i2, 0, key);
          adds.push([lastKey, i2]);
        } else if (prevIndex !== i2) {
          let keyInSpot = prevKeys.splice(i2, 1)[0];
          let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
          prevKeys.splice(i2, 0, keyForSpot);
          prevKeys.splice(prevIndex, 0, keyInSpot);
          moves.push([keyInSpot, keyForSpot]);
        } else {
          sames.push(key);
        }
        lastKey = key;
      }
      for (let i2 = 0; i2 < removes.length; i2++) {
        let key = removes[i2];
        if (!(key in lookup))
          continue;
        mutateDom(() => {
          destroyTree(lookup[key]);
          lookup[key].remove();
        });
        delete lookup[key];
      }
      for (let i2 = 0; i2 < moves.length; i2++) {
        let [keyInSpot, keyForSpot] = moves[i2];
        let elInSpot = lookup[keyInSpot];
        let elForSpot = lookup[keyForSpot];
        let marker = document.createElement("div");
        mutateDom(() => {
          if (!elForSpot)
            warn('x-for ":key" is undefined or invalid', templateEl, keyForSpot, lookup);
          elForSpot.after(marker);
          elInSpot.after(elForSpot);
          elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl);
          marker.before(elInSpot);
          elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl);
          marker.remove();
        });
        elForSpot._x_refreshXForScope(scopes[keys.indexOf(keyForSpot)]);
      }
      for (let i2 = 0; i2 < adds.length; i2++) {
        let [lastKey2, index] = adds[i2];
        let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
        if (lastEl._x_currentIfEl)
          lastEl = lastEl._x_currentIfEl;
        let scope2 = scopes[index];
        let key = keys[index];
        let clone2 = document.importNode(templateEl.content, true).firstElementChild;
        let reactiveScope = reactive(scope2);
        addScopeToNode(clone2, reactiveScope, templateEl);
        clone2._x_refreshXForScope = (newScope) => {
          Object.entries(newScope).forEach(([key2, value]) => {
            reactiveScope[key2] = value;
          });
        };
        mutateDom(() => {
          lastEl.after(clone2);
          skipDuringClone(() => initTree(clone2))();
        });
        if (typeof key === "object") {
          warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
        }
        lookup[key] = clone2;
      }
      for (let i2 = 0; i2 < sames.length; i2++) {
        lookup[sames[i2]]._x_refreshXForScope(scopes[keys.indexOf(sames[i2])]);
      }
      templateEl._x_prevKeys = keys;
    });
  }
  function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    let stripParensRE = /^\s*\(|\)\s*$/g;
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    let inMatch = expression.match(forAliasRE);
    if (!inMatch)
      return;
    let res = {};
    res.items = inMatch[2].trim();
    let item = inMatch[1].replace(stripParensRE, "").trim();
    let iteratorMatch = item.match(forIteratorRE);
    if (iteratorMatch) {
      res.item = item.replace(forIteratorRE, "").trim();
      res.index = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        res.collection = iteratorMatch[2].trim();
      }
    } else {
      res.item = item;
    }
    return res;
  }
  function getIterationScopeVariables(iteratorNames, item, index, items) {
    let scopeVariables = {};
    if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
      let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i2) => i2.trim());
      names.forEach((name, i2) => {
        scopeVariables[name] = item[i2];
      });
    } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
      let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i2) => i2.trim());
      names.forEach((name) => {
        scopeVariables[name] = item[name];
      });
    } else {
      scopeVariables[iteratorNames.item] = item;
    }
    if (iteratorNames.index)
      scopeVariables[iteratorNames.index] = index;
    if (iteratorNames.collection)
      scopeVariables[iteratorNames.collection] = items;
    return scopeVariables;
  }
  function isNumeric3(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  function handler3() {
  }
  handler3.inline = (el, { expression }, { cleanup: cleanup2 }) => {
    let root = closestRoot(el);
    if (!root._x_refs)
      root._x_refs = {};
    root._x_refs[expression] = el;
    cleanup2(() => delete root._x_refs[expression]);
  };
  directive("ref", handler3);
  directive("if", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
    if (el.tagName.toLowerCase() !== "template")
      warn("x-if can only be used on a <template> tag", el);
    let evaluate2 = evaluateLater(el, expression);
    let show = () => {
      if (el._x_currentIfEl)
        return el._x_currentIfEl;
      let clone2 = el.content.cloneNode(true).firstElementChild;
      addScopeToNode(clone2, {}, el);
      mutateDom(() => {
        el.after(clone2);
        skipDuringClone(() => initTree(clone2))();
      });
      el._x_currentIfEl = clone2;
      el._x_undoIf = () => {
        mutateDom(() => {
          destroyTree(clone2);
          clone2.remove();
        });
        delete el._x_currentIfEl;
      };
      return clone2;
    };
    let hide = () => {
      if (!el._x_undoIf)
        return;
      el._x_undoIf();
      delete el._x_undoIf;
    };
    effect3(() => evaluate2((value) => {
      value ? show() : hide();
    }));
    cleanup2(() => el._x_undoIf && el._x_undoIf());
  });
  directive("id", (el, { expression }, { evaluate: evaluate2 }) => {
    let names = evaluate2(expression);
    names.forEach((name) => setIdRoot(el, name));
  });
  interceptClone((from, to) => {
    if (from._x_ids) {
      to._x_ids = from._x_ids;
    }
  });
  mapAttributes(startingWith("@", into(prefix("on:"))));
  directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup: cleanup2 }) => {
    let evaluate2 = expression ? evaluateLater(el, expression) : () => {
    };
    if (el.tagName.toLowerCase() === "template") {
      if (!el._x_forwardEvents)
        el._x_forwardEvents = [];
      if (!el._x_forwardEvents.includes(value))
        el._x_forwardEvents.push(value);
    }
    let removeListener = on(el, value, modifiers, (e2) => {
      evaluate2(() => {
      }, { scope: { "$event": e2 }, params: [e2] });
    });
    cleanup2(() => removeListener());
  }));
  warnMissingPluginDirective("Collapse", "collapse", "collapse");
  warnMissingPluginDirective("Intersect", "intersect", "intersect");
  warnMissingPluginDirective("Focus", "trap", "focus");
  warnMissingPluginDirective("Mask", "mask", "mask");
  function warnMissingPluginDirective(name, directiveName, slug) {
    directive(directiveName, (el) => warn("You can't use [x-".concat(directiveName, '] without first installing the "').concat(name, '" plugin here: https://alpinejs.dev/plugins/').concat(slug), el));
  }
  alpine_default.setEvaluator(normalEvaluator);
  alpine_default.setReactivityEngine({ reactive: reactive2, effect: effect2, release: stop, raw: toRaw });
  var src_default = alpine_default;
  var module_default = src_default;
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var aos = { exports: {} };
  (function(module, exports) {
    !function(e2, t2) {
      module.exports = t2();
    }(commonjsGlobal, function() {
      return function(e2) {
        function t2(o2) {
          if (n2[o2]) return n2[o2].exports;
          var i2 = n2[o2] = { exports: {}, id: o2, loaded: false };
          return e2[o2].call(i2.exports, i2, i2.exports, t2), i2.loaded = true, i2.exports;
        }
        var n2 = {};
        return t2.m = e2, t2.c = n2, t2.p = "dist/", t2(0);
      }([function(e2, t2, n2) {
        function o2(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        var i2 = Object.assign || function(e3) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var n3 = arguments[t3];
            for (var o3 in n3) Object.prototype.hasOwnProperty.call(n3, o3) && (e3[o3] = n3[o3]);
          }
          return e3;
        }, r2 = n2(1), a2 = (o2(r2), n2(6)), u = o2(a2), c = n2(7), s2 = o2(c), f = n2(8), d = o2(f), l2 = n2(9), p = o2(l2), m = n2(10), b = o2(m), v = n2(11), y = o2(v), g = n2(14), h = o2(g), w = [], k = false, x = { offset: 120, delay: 0, easing: "ease", duration: 400, disable: false, once: false, startEvent: "DOMContentLoaded", throttleDelay: 99, debounceDelay: 50, disableMutationObserver: false }, j = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          if (e3 && (k = true), k) return w = (0, y.default)(w, x), (0, b.default)(w, x.once), w;
        }, O = function() {
          w = (0, h.default)(), j();
        }, M = function() {
          w.forEach(function(e3, t3) {
            e3.node.removeAttribute("data-aos"), e3.node.removeAttribute("data-aos-easing"), e3.node.removeAttribute("data-aos-duration"), e3.node.removeAttribute("data-aos-delay");
          });
        }, S = function(e3) {
          return e3 === true || "mobile" === e3 && p.default.mobile() || "phone" === e3 && p.default.phone() || "tablet" === e3 && p.default.tablet() || "function" == typeof e3 && e3() === true;
        }, _ = function(e3) {
          x = i2(x, e3), w = (0, h.default)();
          var t3 = document.all && !window.atob;
          return S(x.disable) || t3 ? M() : (x.disableMutationObserver || d.default.isSupported() || (console.info('\n      aos: MutationObserver is not supported on this browser,\n      code mutations observing has been disabled.\n      You may have to call "refreshHard()" by yourself.\n    '), x.disableMutationObserver = true), document.querySelector("body").setAttribute("data-aos-easing", x.easing), document.querySelector("body").setAttribute("data-aos-duration", x.duration), document.querySelector("body").setAttribute("data-aos-delay", x.delay), "DOMContentLoaded" === x.startEvent && ["complete", "interactive"].indexOf(document.readyState) > -1 ? j(true) : "load" === x.startEvent ? window.addEventListener(x.startEvent, function() {
            j(true);
          }) : document.addEventListener(x.startEvent, function() {
            j(true);
          }), window.addEventListener("resize", (0, s2.default)(j, x.debounceDelay, true)), window.addEventListener("orientationchange", (0, s2.default)(j, x.debounceDelay, true)), window.addEventListener("scroll", (0, u.default)(function() {
            (0, b.default)(w, x.once);
          }, x.throttleDelay)), x.disableMutationObserver || d.default.ready("[data-aos]", O), w);
        };
        e2.exports = { init: _, refresh: j, refreshHard: O };
      }, function(e2, t2) {
      }, , , , , function(e2, t2) {
        (function(t3) {
          function n2(e3, t4, n3) {
            function o3(t5) {
              var n4 = b2, o4 = v2;
              return b2 = v2 = void 0, k2 = t5, g2 = e3.apply(o4, n4);
            }
            function r3(e4) {
              return k2 = e4, h2 = setTimeout(f2, t4), M ? o3(e4) : g2;
            }
            function a3(e4) {
              var n4 = e4 - w2, o4 = e4 - k2, i3 = t4 - n4;
              return S ? j(i3, y2 - o4) : i3;
            }
            function c2(e4) {
              var n4 = e4 - w2, o4 = e4 - k2;
              return void 0 === w2 || n4 >= t4 || n4 < 0 || S && o4 >= y2;
            }
            function f2() {
              var e4 = O();
              return c2(e4) ? d2(e4) : void (h2 = setTimeout(f2, a3(e4)));
            }
            function d2(e4) {
              return h2 = void 0, _ && b2 ? o3(e4) : (b2 = v2 = void 0, g2);
            }
            function l3() {
              void 0 !== h2 && clearTimeout(h2), k2 = 0, b2 = w2 = v2 = h2 = void 0;
            }
            function p2() {
              return void 0 === h2 ? g2 : d2(O());
            }
            function m2() {
              var e4 = O(), n4 = c2(e4);
              if (b2 = arguments, v2 = this, w2 = e4, n4) {
                if (void 0 === h2) return r3(w2);
                if (S) return h2 = setTimeout(f2, t4), o3(w2);
              }
              return void 0 === h2 && (h2 = setTimeout(f2, t4)), g2;
            }
            var b2, v2, y2, g2, h2, w2, k2 = 0, M = false, S = false, _ = true;
            if ("function" != typeof e3) throw new TypeError(s2);
            return t4 = u(t4) || 0, i2(n3) && (M = !!n3.leading, S = "maxWait" in n3, y2 = S ? x(u(n3.maxWait) || 0, t4) : y2, _ = "trailing" in n3 ? !!n3.trailing : _), m2.cancel = l3, m2.flush = p2, m2;
          }
          function o2(e3, t4, o3) {
            var r3 = true, a3 = true;
            if ("function" != typeof e3) throw new TypeError(s2);
            return i2(o3) && (r3 = "leading" in o3 ? !!o3.leading : r3, a3 = "trailing" in o3 ? !!o3.trailing : a3), n2(e3, t4, { leading: r3, maxWait: t4, trailing: a3 });
          }
          function i2(e3) {
            var t4 = "undefined" == typeof e3 ? "undefined" : c(e3);
            return !!e3 && ("object" == t4 || "function" == t4);
          }
          function r2(e3) {
            return !!e3 && "object" == ("undefined" == typeof e3 ? "undefined" : c(e3));
          }
          function a2(e3) {
            return "symbol" == ("undefined" == typeof e3 ? "undefined" : c(e3)) || r2(e3) && k.call(e3) == d;
          }
          function u(e3) {
            if ("number" == typeof e3) return e3;
            if (a2(e3)) return f;
            if (i2(e3)) {
              var t4 = "function" == typeof e3.valueOf ? e3.valueOf() : e3;
              e3 = i2(t4) ? t4 + "" : t4;
            }
            if ("string" != typeof e3) return 0 === e3 ? e3 : +e3;
            e3 = e3.replace(l2, "");
            var n3 = m.test(e3);
            return n3 || b.test(e3) ? v(e3.slice(2), n3 ? 2 : 8) : p.test(e3) ? f : +e3;
          }
          var c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
            return typeof e3;
          } : function(e3) {
            return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
          }, s2 = "Expected a function", f = NaN, d = "[object Symbol]", l2 = /^\s+|\s+$/g, p = /^[-+]0x[0-9a-f]+$/i, m = /^0b[01]+$/i, b = /^0o[0-7]+$/i, v = parseInt, y = "object" == ("undefined" == typeof t3 ? "undefined" : c(t3)) && t3 && t3.Object === Object && t3, g = "object" == ("undefined" == typeof self ? "undefined" : c(self)) && self && self.Object === Object && self, h = y || g || Function("return this")(), w = Object.prototype, k = w.toString, x = Math.max, j = Math.min, O = function() {
            return h.Date.now();
          };
          e2.exports = o2;
        }).call(t2, /* @__PURE__ */ function() {
          return this;
        }());
      }, function(e2, t2) {
        (function(t3) {
          function n2(e3, t4, n3) {
            function i3(t5) {
              var n4 = b2, o3 = v2;
              return b2 = v2 = void 0, O = t5, g2 = e3.apply(o3, n4);
            }
            function r3(e4) {
              return O = e4, h2 = setTimeout(f2, t4), M ? i3(e4) : g2;
            }
            function u2(e4) {
              var n4 = e4 - w2, o3 = e4 - O, i4 = t4 - n4;
              return S ? x(i4, y2 - o3) : i4;
            }
            function s3(e4) {
              var n4 = e4 - w2, o3 = e4 - O;
              return void 0 === w2 || n4 >= t4 || n4 < 0 || S && o3 >= y2;
            }
            function f2() {
              var e4 = j();
              return s3(e4) ? d2(e4) : void (h2 = setTimeout(f2, u2(e4)));
            }
            function d2(e4) {
              return h2 = void 0, _ && b2 ? i3(e4) : (b2 = v2 = void 0, g2);
            }
            function l3() {
              void 0 !== h2 && clearTimeout(h2), O = 0, b2 = w2 = v2 = h2 = void 0;
            }
            function p2() {
              return void 0 === h2 ? g2 : d2(j());
            }
            function m2() {
              var e4 = j(), n4 = s3(e4);
              if (b2 = arguments, v2 = this, w2 = e4, n4) {
                if (void 0 === h2) return r3(w2);
                if (S) return h2 = setTimeout(f2, t4), i3(w2);
              }
              return void 0 === h2 && (h2 = setTimeout(f2, t4)), g2;
            }
            var b2, v2, y2, g2, h2, w2, O = 0, M = false, S = false, _ = true;
            if ("function" != typeof e3) throw new TypeError(c);
            return t4 = a2(t4) || 0, o2(n3) && (M = !!n3.leading, S = "maxWait" in n3, y2 = S ? k(a2(n3.maxWait) || 0, t4) : y2, _ = "trailing" in n3 ? !!n3.trailing : _), m2.cancel = l3, m2.flush = p2, m2;
          }
          function o2(e3) {
            var t4 = "undefined" == typeof e3 ? "undefined" : u(e3);
            return !!e3 && ("object" == t4 || "function" == t4);
          }
          function i2(e3) {
            return !!e3 && "object" == ("undefined" == typeof e3 ? "undefined" : u(e3));
          }
          function r2(e3) {
            return "symbol" == ("undefined" == typeof e3 ? "undefined" : u(e3)) || i2(e3) && w.call(e3) == f;
          }
          function a2(e3) {
            if ("number" == typeof e3) return e3;
            if (r2(e3)) return s2;
            if (o2(e3)) {
              var t4 = "function" == typeof e3.valueOf ? e3.valueOf() : e3;
              e3 = o2(t4) ? t4 + "" : t4;
            }
            if ("string" != typeof e3) return 0 === e3 ? e3 : +e3;
            e3 = e3.replace(d, "");
            var n3 = p.test(e3);
            return n3 || m.test(e3) ? b(e3.slice(2), n3 ? 2 : 8) : l2.test(e3) ? s2 : +e3;
          }
          var u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
            return typeof e3;
          } : function(e3) {
            return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
          }, c = "Expected a function", s2 = NaN, f = "[object Symbol]", d = /^\s+|\s+$/g, l2 = /^[-+]0x[0-9a-f]+$/i, p = /^0b[01]+$/i, m = /^0o[0-7]+$/i, b = parseInt, v = "object" == ("undefined" == typeof t3 ? "undefined" : u(t3)) && t3 && t3.Object === Object && t3, y = "object" == ("undefined" == typeof self ? "undefined" : u(self)) && self && self.Object === Object && self, g = v || y || Function("return this")(), h = Object.prototype, w = h.toString, k = Math.max, x = Math.min, j = function() {
            return g.Date.now();
          };
          e2.exports = n2;
        }).call(t2, /* @__PURE__ */ function() {
          return this;
        }());
      }, function(e2, t2) {
        function n2(e3) {
          var t3 = void 0, o3 = void 0;
          for (t3 = 0; t3 < e3.length; t3 += 1) {
            if (o3 = e3[t3], o3.dataset && o3.dataset.aos) return true;
            if (o3.children && n2(o3.children)) return true;
          }
          return false;
        }
        function o2() {
          return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        }
        function i2() {
          return !!o2();
        }
        function r2(e3, t3) {
          var n3 = window.document, i3 = o2(), r3 = new i3(a2);
          u = t3, r3.observe(n3.documentElement, { childList: true, subtree: true, removedNodes: true });
        }
        function a2(e3) {
          e3 && e3.forEach(function(e4) {
            var t3 = Array.prototype.slice.call(e4.addedNodes), o3 = Array.prototype.slice.call(e4.removedNodes), i3 = t3.concat(o3);
            if (n2(i3)) return u();
          });
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var u = function() {
        };
        t2.default = { isSupported: i2, ready: r2 };
      }, function(e2, t2) {
        function n2(e3, t3) {
          if (!(e3 instanceof t3)) throw new TypeError("Cannot call a class as a function");
        }
        function o2() {
          return navigator.userAgent || navigator.vendor || window.opera || "";
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i2 = /* @__PURE__ */ function() {
          function e3(e4, t3) {
            for (var n3 = 0; n3 < t3.length; n3++) {
              var o3 = t3[n3];
              o3.enumerable = o3.enumerable || false, o3.configurable = true, "value" in o3 && (o3.writable = true), Object.defineProperty(e4, o3.key, o3);
            }
          }
          return function(t3, n3, o3) {
            return n3 && e3(t3.prototype, n3), o3 && e3(t3, o3), t3;
          };
        }(), r2 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i, a2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i, u = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i, c = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i, s2 = function() {
          function e3() {
            n2(this, e3);
          }
          return i2(e3, [{ key: "phone", value: function() {
            var e4 = o2();
            return !(!r2.test(e4) && !a2.test(e4.substr(0, 4)));
          } }, { key: "mobile", value: function() {
            var e4 = o2();
            return !(!u.test(e4) && !c.test(e4.substr(0, 4)));
          } }, { key: "tablet", value: function() {
            return this.mobile() && !this.phone();
          } }]), e3;
        }();
        t2.default = new s2();
      }, function(e2, t2) {
        Object.defineProperty(t2, "__esModule", { value: true });
        var n2 = function(e3, t3, n3) {
          var o3 = e3.node.getAttribute("data-aos-once");
          t3 > e3.position ? e3.node.classList.add("aos-animate") : "undefined" != typeof o3 && ("false" === o3 || !n3 && "true" !== o3) && e3.node.classList.remove("aos-animate");
        }, o2 = function(e3, t3) {
          var o3 = window.pageYOffset, i2 = window.innerHeight;
          e3.forEach(function(e4, r2) {
            n2(e4, i2 + o3, t3);
          });
        };
        t2.default = o2;
      }, function(e2, t2, n2) {
        function o2(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i2 = n2(12), r2 = o2(i2), a2 = function(e3, t3) {
          return e3.forEach(function(e4, n3) {
            e4.node.classList.add("aos-init"), e4.position = (0, r2.default)(e4.node, t3.offset);
          }), e3;
        };
        t2.default = a2;
      }, function(e2, t2, n2) {
        function o2(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i2 = n2(13), r2 = o2(i2), a2 = function(e3, t3) {
          var n3 = 0, o3 = 0, i3 = window.innerHeight, a3 = { offset: e3.getAttribute("data-aos-offset"), anchor: e3.getAttribute("data-aos-anchor"), anchorPlacement: e3.getAttribute("data-aos-anchor-placement") };
          switch (a3.offset && !isNaN(a3.offset) && (o3 = parseInt(a3.offset)), a3.anchor && document.querySelectorAll(a3.anchor) && (e3 = document.querySelectorAll(a3.anchor)[0]), n3 = (0, r2.default)(e3).top, a3.anchorPlacement) {
            case "top-bottom":
              break;
            case "center-bottom":
              n3 += e3.offsetHeight / 2;
              break;
            case "bottom-bottom":
              n3 += e3.offsetHeight;
              break;
            case "top-center":
              n3 += i3 / 2;
              break;
            case "bottom-center":
              n3 += i3 / 2 + e3.offsetHeight;
              break;
            case "center-center":
              n3 += i3 / 2 + e3.offsetHeight / 2;
              break;
            case "top-top":
              n3 += i3;
              break;
            case "bottom-top":
              n3 += e3.offsetHeight + i3;
              break;
            case "center-top":
              n3 += e3.offsetHeight / 2 + i3;
          }
          return a3.anchorPlacement || a3.offset || isNaN(t3) || (o3 = t3), n3 + o3;
        };
        t2.default = a2;
      }, function(e2, t2) {
        Object.defineProperty(t2, "__esModule", { value: true });
        var n2 = function(e3) {
          for (var t3 = 0, n3 = 0; e3 && !isNaN(e3.offsetLeft) && !isNaN(e3.offsetTop); ) t3 += e3.offsetLeft - ("BODY" != e3.tagName ? e3.scrollLeft : 0), n3 += e3.offsetTop - ("BODY" != e3.tagName ? e3.scrollTop : 0), e3 = e3.offsetParent;
          return { top: n3, left: t3 };
        };
        t2.default = n2;
      }, function(e2, t2) {
        Object.defineProperty(t2, "__esModule", { value: true });
        var n2 = function(e3) {
          return e3 = e3 || document.querySelectorAll("[data-aos]"), Array.prototype.map.call(e3, function(e4) {
            return { node: e4 };
          });
        };
        t2.default = n2;
      }]);
    });
  })(aos);
  var aosExports = aos.exports;
  const AOS = /* @__PURE__ */ getDefaultExportFromCjs(aosExports);
  var flickityFade = { exports: {} };
  var js = { exports: {} };
  var core = { exports: {} };
  var evEmitter = { exports: {} };
  var hasRequiredEvEmitter;
  function requireEvEmitter() {
    if (hasRequiredEvEmitter) return evEmitter.exports;
    hasRequiredEvEmitter = 1;
    (function(module) {
      (function(global2, factory2) {
        if (module.exports) {
          module.exports = factory2();
        } else {
          global2.EvEmitter = factory2();
        }
      })(typeof window != "undefined" ? window : commonjsGlobal, function() {
        function EvEmitter() {
        }
        let proto = EvEmitter.prototype;
        proto.on = function(eventName, listener) {
          if (!eventName || !listener) return this;
          let events = this._events = this._events || {};
          let listeners = events[eventName] = events[eventName] || [];
          if (!listeners.includes(listener)) {
            listeners.push(listener);
          }
          return this;
        };
        proto.once = function(eventName, listener) {
          if (!eventName || !listener) return this;
          this.on(eventName, listener);
          let onceEvents = this._onceEvents = this._onceEvents || {};
          let onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
          onceListeners[listener] = true;
          return this;
        };
        proto.off = function(eventName, listener) {
          let listeners = this._events && this._events[eventName];
          if (!listeners || !listeners.length) return this;
          let index = listeners.indexOf(listener);
          if (index != -1) {
            listeners.splice(index, 1);
          }
          return this;
        };
        proto.emitEvent = function(eventName, args) {
          let listeners = this._events && this._events[eventName];
          if (!listeners || !listeners.length) return this;
          listeners = listeners.slice(0);
          args = args || [];
          let onceListeners = this._onceEvents && this._onceEvents[eventName];
          for (let listener of listeners) {
            let isOnce = onceListeners && onceListeners[listener];
            if (isOnce) {
              this.off(eventName, listener);
              delete onceListeners[listener];
            }
            listener.apply(this, args);
          }
          return this;
        };
        proto.allOff = function() {
          delete this._events;
          delete this._onceEvents;
          return this;
        };
        return EvEmitter;
      });
    })(evEmitter);
    return evEmitter.exports;
  }
  var getSize = { exports: {} };
  /*!
   * Infinite Scroll v2.0.4
   * measure size of elements
   * MIT license
   */
  var hasRequiredGetSize;
  function requireGetSize() {
    if (hasRequiredGetSize) return getSize.exports;
    hasRequiredGetSize = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2();
        } else {
          window2.getSize = factory2();
        }
      })(window, function factory2() {
        function getStyleSize(value) {
          let num = parseFloat(value);
          let isValid = value.indexOf("%") == -1 && !isNaN(num);
          return isValid && num;
        }
        let measurements = [
          "paddingLeft",
          "paddingRight",
          "paddingTop",
          "paddingBottom",
          "marginLeft",
          "marginRight",
          "marginTop",
          "marginBottom",
          "borderLeftWidth",
          "borderRightWidth",
          "borderTopWidth",
          "borderBottomWidth"
        ];
        function getZeroSize() {
          let size2 = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
          };
          measurements.forEach((measurement) => {
            size2[measurement] = 0;
          });
          return size2;
        }
        function getSize2(elem) {
          if (typeof elem == "string") elem = document.querySelector(elem);
          let isElement = elem && typeof elem == "object" && elem.nodeType;
          if (!isElement) return;
          let style = getComputedStyle(elem);
          if (style.display == "none") return getZeroSize();
          let size2 = {};
          size2.width = elem.offsetWidth;
          size2.height = elem.offsetHeight;
          let isBorderBox = size2.isBorderBox = style.boxSizing == "border-box";
          measurements.forEach((measurement) => {
            let value = style[measurement];
            let num = parseFloat(value);
            size2[measurement] = !isNaN(num) ? num : 0;
          });
          let paddingWidth = size2.paddingLeft + size2.paddingRight;
          let paddingHeight = size2.paddingTop + size2.paddingBottom;
          let marginWidth = size2.marginLeft + size2.marginRight;
          let marginHeight = size2.marginTop + size2.marginBottom;
          let borderWidth = size2.borderLeftWidth + size2.borderRightWidth;
          let borderHeight = size2.borderTopWidth + size2.borderBottomWidth;
          let styleWidth = getStyleSize(style.width);
          if (styleWidth !== false) {
            size2.width = styleWidth + // add padding and border unless it's already including it
            (isBorderBox ? 0 : paddingWidth + borderWidth);
          }
          let styleHeight = getStyleSize(style.height);
          if (styleHeight !== false) {
            size2.height = styleHeight + // add padding and border unless it's already including it
            (isBorderBox ? 0 : paddingHeight + borderHeight);
          }
          size2.innerWidth = size2.width - (paddingWidth + borderWidth);
          size2.innerHeight = size2.height - (paddingHeight + borderHeight);
          size2.outerWidth = size2.width + marginWidth;
          size2.outerHeight = size2.height + marginHeight;
          return size2;
        }
        return getSize2;
      });
    })(getSize);
    return getSize.exports;
  }
  var utils$2 = { exports: {} };
  var hasRequiredUtils;
  function requireUtils() {
    if (hasRequiredUtils) return utils$2.exports;
    hasRequiredUtils = 1;
    (function(module) {
      (function(global2, factory2) {
        if (module.exports) {
          module.exports = factory2(global2);
        } else {
          global2.fizzyUIUtils = factory2(global2);
        }
      })(commonjsGlobal, function factory2(global2) {
        let utils2 = {};
        utils2.extend = function(a2, b) {
          return Object.assign(a2, b);
        };
        utils2.modulo = function(num, div) {
          return (num % div + div) % div;
        };
        utils2.makeArray = function(obj) {
          if (Array.isArray(obj)) return obj;
          if (obj === null || obj === void 0) return [];
          let isArrayLike = typeof obj == "object" && typeof obj.length == "number";
          if (isArrayLike) return [...obj];
          return [obj];
        };
        utils2.removeFrom = function(ary, obj) {
          let index = ary.indexOf(obj);
          if (index != -1) {
            ary.splice(index, 1);
          }
        };
        utils2.getParent = function(elem, selector) {
          while (elem.parentNode && elem != document.body) {
            elem = elem.parentNode;
            if (elem.matches(selector)) return elem;
          }
        };
        utils2.getQueryElement = function(elem) {
          if (typeof elem == "string") {
            return document.querySelector(elem);
          }
          return elem;
        };
        utils2.handleEvent = function(event) {
          let method = "on" + event.type;
          if (this[method]) {
            this[method](event);
          }
        };
        utils2.filterFindElements = function(elems, selector) {
          elems = utils2.makeArray(elems);
          return elems.filter((elem) => elem instanceof HTMLElement).reduce((ffElems, elem) => {
            if (!selector) {
              ffElems.push(elem);
              return ffElems;
            }
            if (elem.matches(selector)) {
              ffElems.push(elem);
            }
            let childElems = elem.querySelectorAll(selector);
            ffElems = ffElems.concat(...childElems);
            return ffElems;
          }, []);
        };
        utils2.debounceMethod = function(_class, methodName, threshold) {
          threshold = threshold || 100;
          let method = _class.prototype[methodName];
          let timeoutName = methodName + "Timeout";
          _class.prototype[methodName] = function() {
            clearTimeout(this[timeoutName]);
            let args = arguments;
            this[timeoutName] = setTimeout(() => {
              method.apply(this, args);
              delete this[timeoutName];
            }, threshold);
          };
        };
        utils2.docReady = function(onDocReady) {
          let readyState = document.readyState;
          if (readyState == "complete" || readyState == "interactive") {
            setTimeout(onDocReady);
          } else {
            document.addEventListener("DOMContentLoaded", onDocReady);
          }
        };
        utils2.toDashed = function(str) {
          return str.replace(/(.)([A-Z])/g, function(match, $1, $2) {
            return $1 + "-" + $2;
          }).toLowerCase();
        };
        let console2 = global2.console;
        utils2.htmlInit = function(WidgetClass, namespace) {
          utils2.docReady(function() {
            let dashedNamespace = utils2.toDashed(namespace);
            let dataAttr = "data-" + dashedNamespace;
            let dataAttrElems = document.querySelectorAll("[".concat(dataAttr, "]"));
            let jQuery = global2.jQuery;
            [...dataAttrElems].forEach((elem) => {
              let attr = elem.getAttribute(dataAttr);
              let options;
              try {
                options = attr && JSON.parse(attr);
              } catch (error2) {
                if (console2) {
                  console2.error("Error parsing ".concat(dataAttr, " on ").concat(elem.className, ": ").concat(error2));
                }
                return;
              }
              let instance = new WidgetClass(elem, options);
              if (jQuery) {
                jQuery.data(elem, namespace, instance);
              }
            });
          });
        };
        return utils2;
      });
    })(utils$2);
    return utils$2.exports;
  }
  var cell = { exports: {} };
  var hasRequiredCell;
  function requireCell() {
    if (hasRequiredCell) return cell.exports;
    hasRequiredCell = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(requireGetSize());
        } else {
          window2.Flickity = window2.Flickity || {};
          window2.Flickity.Cell = factory2(window2.getSize);
        }
      })(typeof window != "undefined" ? window : commonjsGlobal, function factory2(getSize2) {
        const cellClassName = "flickity-cell";
        function Cell(elem) {
          this.element = elem;
          this.element.classList.add(cellClassName);
          this.x = 0;
          this.unselect();
        }
        let proto = Cell.prototype;
        proto.destroy = function() {
          this.unselect();
          this.element.classList.remove(cellClassName);
          this.element.style.transform = "";
          this.element.removeAttribute("aria-hidden");
        };
        proto.getSize = function() {
          this.size = getSize2(this.element);
        };
        proto.select = function() {
          this.element.classList.add("is-selected");
          this.element.removeAttribute("aria-hidden");
        };
        proto.unselect = function() {
          this.element.classList.remove("is-selected");
          this.element.setAttribute("aria-hidden", "true");
        };
        proto.remove = function() {
          this.element.remove();
        };
        return Cell;
      });
    })(cell);
    return cell.exports;
  }
  var slide = { exports: {} };
  var hasRequiredSlide;
  function requireSlide() {
    if (hasRequiredSlide) return slide.exports;
    hasRequiredSlide = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2();
        } else {
          window2.Flickity = window2.Flickity || {};
          window2.Flickity.Slide = factory2();
        }
      })(typeof window != "undefined" ? window : commonjsGlobal, function factory2() {
        function Slide(beginMargin, endMargin, cellAlign) {
          this.beginMargin = beginMargin;
          this.endMargin = endMargin;
          this.cellAlign = cellAlign;
          this.cells = [];
          this.outerWidth = 0;
          this.height = 0;
        }
        let proto = Slide.prototype;
        proto.addCell = function(cell2) {
          this.cells.push(cell2);
          this.outerWidth += cell2.size.outerWidth;
          this.height = Math.max(cell2.size.outerHeight, this.height);
          if (this.cells.length === 1) {
            this.x = cell2.x;
            this.firstMargin = cell2.size[this.beginMargin];
          }
        };
        proto.updateTarget = function() {
          let lastCell = this.getLastCell();
          let lastMargin = lastCell ? lastCell.size[this.endMargin] : 0;
          let slideWidth = this.outerWidth - (this.firstMargin + lastMargin);
          this.target = this.x + this.firstMargin + slideWidth * this.cellAlign;
        };
        proto.getLastCell = function() {
          return this.cells[this.cells.length - 1];
        };
        proto.select = function() {
          this.cells.forEach((cell2) => cell2.select());
        };
        proto.unselect = function() {
          this.cells.forEach((cell2) => cell2.unselect());
        };
        proto.getCellElements = function() {
          return this.cells.map((cell2) => cell2.element);
        };
        return Slide;
      });
    })(slide);
    return slide.exports;
  }
  var animate = { exports: {} };
  var hasRequiredAnimate;
  function requireAnimate() {
    if (hasRequiredAnimate) return animate.exports;
    hasRequiredAnimate = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(requireUtils());
        } else {
          window2.Flickity = window2.Flickity || {};
          window2.Flickity.animatePrototype = factory2(window2.fizzyUIUtils);
        }
      })(typeof window != "undefined" ? window : commonjsGlobal, function factory2(utils2) {
        let proto = {};
        proto.startAnimation = function() {
          if (this.isAnimating) return;
          this.isAnimating = true;
          this.restingFrames = 0;
          this.animate();
        };
        proto.animate = function() {
          this.applyDragForce();
          this.applySelectedAttraction();
          let previousX = this.x;
          this.integratePhysics();
          this.positionSlider();
          this.settle(previousX);
          if (this.isAnimating) requestAnimationFrame(() => this.animate());
        };
        proto.positionSlider = function() {
          let x = this.x;
          if (this.isWrapping) {
            x = utils2.modulo(x, this.slideableWidth) - this.slideableWidth;
            this.shiftWrapCells(x);
          }
          this.setTranslateX(x, this.isAnimating);
          this.dispatchScrollEvent();
        };
        proto.setTranslateX = function(x, is3d) {
          x += this.cursorPosition;
          if (this.options.rightToLeft) x = -x;
          let translateX = this.getPositionValue(x);
          this.slider.style.transform = is3d ? "translate3d(".concat(translateX, ",0,0)") : "translateX(".concat(translateX, ")");
        };
        proto.dispatchScrollEvent = function() {
          let firstSlide = this.slides[0];
          if (!firstSlide) return;
          let positionX = -this.x - firstSlide.target;
          let progress = positionX / this.slidesWidth;
          this.dispatchEvent("scroll", null, [progress, positionX]);
        };
        proto.positionSliderAtSelected = function() {
          if (!this.cells.length) return;
          this.x = -this.selectedSlide.target;
          this.velocity = 0;
          this.positionSlider();
        };
        proto.getPositionValue = function(position) {
          if (this.options.percentPosition) {
            return Math.round(position / this.size.innerWidth * 1e4) * 0.01 + "%";
          } else {
            return Math.round(position) + "px";
          }
        };
        proto.settle = function(previousX) {
          let isResting = !this.isPointerDown && Math.round(this.x * 100) === Math.round(previousX * 100);
          if (isResting) this.restingFrames++;
          if (this.restingFrames > 2) {
            this.isAnimating = false;
            delete this.isFreeScrolling;
            this.positionSlider();
            this.dispatchEvent("settle", null, [this.selectedIndex]);
          }
        };
        proto.shiftWrapCells = function(x) {
          let beforeGap = this.cursorPosition + x;
          this._shiftCells(this.beforeShiftCells, beforeGap, -1);
          let afterGap = this.size.innerWidth - (x + this.slideableWidth + this.cursorPosition);
          this._shiftCells(this.afterShiftCells, afterGap, 1);
        };
        proto._shiftCells = function(cells, gap, shift) {
          cells.forEach((cell2) => {
            let cellShift = gap > 0 ? shift : 0;
            this._wrapShiftCell(cell2, cellShift);
            gap -= cell2.size.outerWidth;
          });
        };
        proto._unshiftCells = function(cells) {
          if (!cells || !cells.length) return;
          cells.forEach((cell2) => this._wrapShiftCell(cell2, 0));
        };
        proto._wrapShiftCell = function(cell2, shift) {
          this._renderCellPosition(cell2, cell2.x + this.slideableWidth * shift);
        };
        proto.integratePhysics = function() {
          this.x += this.velocity;
          this.velocity *= this.getFrictionFactor();
        };
        proto.applyForce = function(force) {
          this.velocity += force;
        };
        proto.getFrictionFactor = function() {
          return 1 - this.options[this.isFreeScrolling ? "freeScrollFriction" : "friction"];
        };
        proto.getRestingPosition = function() {
          return this.x + this.velocity / (1 - this.getFrictionFactor());
        };
        proto.applyDragForce = function() {
          if (!this.isDraggable || !this.isPointerDown) return;
          let dragVelocity = this.dragX - this.x;
          let dragForce = dragVelocity - this.velocity;
          this.applyForce(dragForce);
        };
        proto.applySelectedAttraction = function() {
          let dragDown = this.isDraggable && this.isPointerDown;
          if (dragDown || this.isFreeScrolling || !this.slides.length) return;
          let distance = this.selectedSlide.target * -1 - this.x;
          let force = distance * this.options.selectedAttraction;
          this.applyForce(force);
        };
        return proto;
      });
    })(animate);
    return animate.exports;
  }
  var hasRequiredCore;
  function requireCore() {
    if (hasRequiredCore) return core.exports;
    hasRequiredCore = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(
            window2,
            requireEvEmitter(),
            requireGetSize(),
            requireUtils(),
            requireCell(),
            requireSlide(),
            requireAnimate()
          );
        } else {
          let _Flickity = window2.Flickity;
          window2.Flickity = factory2(
            window2,
            window2.EvEmitter,
            window2.getSize,
            window2.fizzyUIUtils,
            _Flickity.Cell,
            _Flickity.Slide,
            _Flickity.animatePrototype
          );
        }
      })(
        typeof window != "undefined" ? window : commonjsGlobal,
        function factory2(window2, EvEmitter, getSize2, utils2, Cell, Slide, animatePrototype) {
          const { getComputedStyle: getComputedStyle2, console: console2 } = window2;
          let { jQuery } = window2;
          let GUID = 0;
          let instances = {};
          function Flickity2(element, options) {
            let queryElement = utils2.getQueryElement(element);
            if (!queryElement) {
              if (console2) console2.error("Bad element for Flickity: ".concat(queryElement || element));
              return;
            }
            this.element = queryElement;
            if (this.element.flickityGUID) {
              let instance = instances[this.element.flickityGUID];
              if (instance) instance.option(options);
              return instance;
            }
            if (jQuery) {
              this.$element = jQuery(this.element);
            }
            this.options = __spreadValues({}, this.constructor.defaults);
            this.option(options);
            this._create();
          }
          Flickity2.defaults = {
            accessibility: true,
            // adaptiveHeight: false,
            cellAlign: "center",
            // cellSelector: undefined,
            // contain: false,
            freeScrollFriction: 0.075,
            // friction when free-scrolling
            friction: 0.28,
            // friction when selecting
            namespaceJQueryEvents: true,
            // initialIndex: 0,
            percentPosition: true,
            resize: true,
            selectedAttraction: 0.025,
            setGallerySize: true
            // watchCSS: false,
            // wrapAround: false
          };
          Flickity2.create = {};
          let proto = Flickity2.prototype;
          Object.assign(proto, EvEmitter.prototype);
          proto._create = function() {
            let { resize, watchCSS, rightToLeft } = this.options;
            let id = this.guid = ++GUID;
            this.element.flickityGUID = id;
            instances[id] = this;
            this.selectedIndex = 0;
            this.restingFrames = 0;
            this.x = 0;
            this.velocity = 0;
            this.beginMargin = rightToLeft ? "marginRight" : "marginLeft";
            this.endMargin = rightToLeft ? "marginLeft" : "marginRight";
            this.viewport = document.createElement("div");
            this.viewport.className = "flickity-viewport";
            this._createSlider();
            this.focusableElems = [this.element];
            if (resize || watchCSS) {
              window2.addEventListener("resize", this);
            }
            for (let eventName in this.options.on) {
              let listener = this.options.on[eventName];
              this.on(eventName, listener);
            }
            for (let method in Flickity2.create) {
              Flickity2.create[method].call(this);
            }
            if (watchCSS) {
              this.watchCSS();
            } else {
              this.activate();
            }
          };
          proto.option = function(opts) {
            Object.assign(this.options, opts);
          };
          proto.activate = function() {
            if (this.isActive) return;
            this.isActive = true;
            this.element.classList.add("flickity-enabled");
            if (this.options.rightToLeft) {
              this.element.classList.add("flickity-rtl");
            }
            this.getSize();
            let cellElems = this._filterFindCellElements(this.element.children);
            this.slider.append(...cellElems);
            this.viewport.append(this.slider);
            this.element.append(this.viewport);
            this.reloadCells();
            if (this.options.accessibility) {
              this.element.tabIndex = 0;
              this.element.addEventListener("keydown", this);
            }
            this.emitEvent("activate");
            this.selectInitialIndex();
            this.isInitActivated = true;
            this.dispatchEvent("ready");
          };
          proto._createSlider = function() {
            let slider = document.createElement("div");
            slider.className = "flickity-slider";
            this.slider = slider;
          };
          proto._filterFindCellElements = function(elems) {
            return utils2.filterFindElements(elems, this.options.cellSelector);
          };
          proto.reloadCells = function() {
            this.cells = this._makeCells(this.slider.children);
            this.positionCells();
            this._updateWrapShiftCells();
            this.setGallerySize();
          };
          proto._makeCells = function(elems) {
            let cellElems = this._filterFindCellElements(elems);
            return cellElems.map((cellElem) => new Cell(cellElem));
          };
          proto.getLastCell = function() {
            return this.cells[this.cells.length - 1];
          };
          proto.getLastSlide = function() {
            return this.slides[this.slides.length - 1];
          };
          proto.positionCells = function() {
            this._sizeCells(this.cells);
            this._positionCells(0);
          };
          proto._positionCells = function(index) {
            index = index || 0;
            this.maxCellHeight = index ? this.maxCellHeight || 0 : 0;
            let cellX = 0;
            if (index > 0) {
              let startCell = this.cells[index - 1];
              cellX = startCell.x + startCell.size.outerWidth;
            }
            this.cells.slice(index).forEach((cell2) => {
              cell2.x = cellX;
              this._renderCellPosition(cell2, cellX);
              cellX += cell2.size.outerWidth;
              this.maxCellHeight = Math.max(cell2.size.outerHeight, this.maxCellHeight);
            });
            this.slideableWidth = cellX;
            this.updateSlides();
            this._containSlides();
            this.slidesWidth = this.cells.length ? this.getLastSlide().target - this.slides[0].target : 0;
          };
          proto._renderCellPosition = function(cell2, x) {
            let sideOffset = this.options.rightToLeft ? -1 : 1;
            let renderX = x * sideOffset;
            if (this.options.percentPosition) renderX *= this.size.innerWidth / cell2.size.width;
            let positionValue = this.getPositionValue(renderX);
            cell2.element.style.transform = "translateX( ".concat(positionValue, " )");
          };
          proto._sizeCells = function(cells) {
            cells.forEach((cell2) => cell2.getSize());
          };
          proto.updateSlides = function() {
            this.slides = [];
            if (!this.cells.length) return;
            let { beginMargin, endMargin } = this;
            let slide2 = new Slide(beginMargin, endMargin, this.cellAlign);
            this.slides.push(slide2);
            let canCellFit = this._getCanCellFit();
            this.cells.forEach((cell2, i2) => {
              if (!slide2.cells.length) {
                slide2.addCell(cell2);
                return;
              }
              let slideWidth = slide2.outerWidth - slide2.firstMargin + (cell2.size.outerWidth - cell2.size[endMargin]);
              if (canCellFit(i2, slideWidth)) {
                slide2.addCell(cell2);
              } else {
                slide2.updateTarget();
                slide2 = new Slide(beginMargin, endMargin, this.cellAlign);
                this.slides.push(slide2);
                slide2.addCell(cell2);
              }
            });
            slide2.updateTarget();
            this.updateSelectedSlide();
          };
          proto._getCanCellFit = function() {
            let { groupCells } = this.options;
            if (!groupCells) return () => false;
            if (typeof groupCells == "number") {
              let number = parseInt(groupCells, 10);
              return (i2) => i2 % number !== 0;
            }
            let percent = 1;
            let percentMatch = typeof groupCells == "string" && groupCells.match(/^(\d+)%$/);
            if (percentMatch) percent = parseInt(percentMatch[1], 10) / 100;
            let groupWidth = (this.size.innerWidth + 1) * percent;
            return (i2, slideWidth) => slideWidth <= groupWidth;
          };
          proto._init = proto.reposition = function() {
            this.positionCells();
            this.positionSliderAtSelected();
          };
          proto.getSize = function() {
            this.size = getSize2(this.element);
            this.setCellAlign();
            this.cursorPosition = this.size.innerWidth * this.cellAlign;
          };
          let cellAlignShorthands = {
            left: 0,
            center: 0.5,
            right: 1
          };
          proto.setCellAlign = function() {
            let { cellAlign, rightToLeft } = this.options;
            let shorthand = cellAlignShorthands[cellAlign];
            this.cellAlign = shorthand !== void 0 ? shorthand : cellAlign;
            if (rightToLeft) this.cellAlign = 1 - this.cellAlign;
          };
          proto.setGallerySize = function() {
            if (!this.options.setGallerySize) return;
            let height = this.options.adaptiveHeight && this.selectedSlide ? this.selectedSlide.height : this.maxCellHeight;
            this.viewport.style.height = "".concat(height, "px");
          };
          proto._updateWrapShiftCells = function() {
            this.isWrapping = this.getIsWrapping();
            if (!this.isWrapping) return;
            this._unshiftCells(this.beforeShiftCells);
            this._unshiftCells(this.afterShiftCells);
            let beforeGapX = this.cursorPosition;
            let lastIndex = this.cells.length - 1;
            this.beforeShiftCells = this._getGapCells(beforeGapX, lastIndex, -1);
            let afterGapX = this.size.innerWidth - this.cursorPosition;
            this.afterShiftCells = this._getGapCells(afterGapX, 0, 1);
          };
          proto.getIsWrapping = function() {
            let { wrapAround } = this.options;
            if (!wrapAround || this.slides.length < 2) return false;
            if (wrapAround !== "fill") return true;
            let gapWidth = this.slideableWidth - this.size.innerWidth;
            if (gapWidth > this.size.innerWidth) return true;
            for (let cell2 of this.cells) {
              if (cell2.size.outerWidth > gapWidth) return false;
            }
            return true;
          };
          proto._getGapCells = function(gapX, cellIndex, increment) {
            let cells = [];
            while (gapX > 0) {
              let cell2 = this.cells[cellIndex];
              if (!cell2) break;
              cells.push(cell2);
              cellIndex += increment;
              gapX -= cell2.size.outerWidth;
            }
            return cells;
          };
          proto._containSlides = function() {
            let isContaining = this.options.contain && !this.isWrapping && this.cells.length;
            if (!isContaining) return;
            let contentWidth = this.slideableWidth - this.getLastCell().size[this.endMargin];
            let isContentSmaller = contentWidth < this.size.innerWidth;
            if (isContentSmaller) {
              this.slides.forEach((slide2) => {
                slide2.target = contentWidth * this.cellAlign;
              });
            } else {
              let beginBound = this.cursorPosition + this.cells[0].size[this.beginMargin];
              let endBound = contentWidth - this.size.innerWidth * (1 - this.cellAlign);
              this.slides.forEach((slide2) => {
                slide2.target = Math.max(slide2.target, beginBound);
                slide2.target = Math.min(slide2.target, endBound);
              });
            }
          };
          proto.dispatchEvent = function(type, event, args) {
            let emitArgs = event ? [event].concat(args) : args;
            this.emitEvent(type, emitArgs);
            if (jQuery && this.$element) {
              type += this.options.namespaceJQueryEvents ? ".flickity" : "";
              let $event = type;
              if (event) {
                let jQEvent = new jQuery.Event(event);
                jQEvent.type = type;
                $event = jQEvent;
              }
              this.$element.trigger($event, args);
            }
          };
          const unidraggerEvents = [
            "dragStart",
            "dragMove",
            "dragEnd",
            "pointerDown",
            "pointerMove",
            "pointerEnd",
            "staticClick"
          ];
          let _emitEvent = proto.emitEvent;
          proto.emitEvent = function(eventName, args) {
            if (eventName === "staticClick") {
              let clickedCell = this.getParentCell(args[0].target);
              let cellElem = clickedCell && clickedCell.element;
              let cellIndex = clickedCell && this.cells.indexOf(clickedCell);
              args = args.concat(cellElem, cellIndex);
            }
            _emitEvent.call(this, eventName, args);
            let isUnidraggerEvent = unidraggerEvents.includes(eventName);
            if (!isUnidraggerEvent || !jQuery || !this.$element) return;
            eventName += this.options.namespaceJQueryEvents ? ".flickity" : "";
            let event = args.shift(0);
            let jQEvent = new jQuery.Event(event);
            jQEvent.type = eventName;
            this.$element.trigger(jQEvent, args);
          };
          proto.select = function(index, isWrap, isInstant) {
            if (!this.isActive) return;
            index = parseInt(index, 10);
            this._wrapSelect(index);
            if (this.isWrapping || isWrap) {
              index = utils2.modulo(index, this.slides.length);
            }
            if (!this.slides[index]) return;
            let prevIndex = this.selectedIndex;
            this.selectedIndex = index;
            this.updateSelectedSlide();
            if (isInstant) {
              this.positionSliderAtSelected();
            } else {
              this.startAnimation();
            }
            if (this.options.adaptiveHeight) {
              this.setGallerySize();
            }
            this.dispatchEvent("select", null, [index]);
            if (index !== prevIndex) {
              this.dispatchEvent("change", null, [index]);
            }
          };
          proto._wrapSelect = function(index) {
            if (!this.isWrapping) return;
            const { selectedIndex, slideableWidth, slides: { length } } = this;
            if (!this.isDragSelect) {
              let wrapIndex = utils2.modulo(index, length);
              let delta = Math.abs(wrapIndex - selectedIndex);
              let backWrapDelta = Math.abs(wrapIndex + length - selectedIndex);
              let forewardWrapDelta = Math.abs(wrapIndex - length - selectedIndex);
              if (backWrapDelta < delta) {
                index += length;
              } else if (forewardWrapDelta < delta) {
                index -= length;
              }
            }
            if (index < 0) {
              this.x -= slideableWidth;
            } else if (index >= length) {
              this.x += slideableWidth;
            }
          };
          proto.previous = function(isWrap, isInstant) {
            this.select(this.selectedIndex - 1, isWrap, isInstant);
          };
          proto.next = function(isWrap, isInstant) {
            this.select(this.selectedIndex + 1, isWrap, isInstant);
          };
          proto.updateSelectedSlide = function() {
            let slide2 = this.slides[this.selectedIndex];
            if (!slide2) return;
            this.unselectSelectedSlide();
            this.selectedSlide = slide2;
            slide2.select();
            this.selectedCells = slide2.cells;
            this.selectedElements = slide2.getCellElements();
            this.selectedCell = slide2.cells[0];
            this.selectedElement = this.selectedElements[0];
          };
          proto.unselectSelectedSlide = function() {
            if (this.selectedSlide) this.selectedSlide.unselect();
          };
          proto.selectInitialIndex = function() {
            let initialIndex = this.options.initialIndex;
            if (this.isInitActivated) {
              this.select(this.selectedIndex, false, true);
              return;
            }
            if (initialIndex && typeof initialIndex == "string") {
              let cell2 = this.queryCell(initialIndex);
              if (cell2) {
                this.selectCell(initialIndex, false, true);
                return;
              }
            }
            let index = 0;
            if (initialIndex && this.slides[initialIndex]) {
              index = initialIndex;
            }
            this.select(index, false, true);
          };
          proto.selectCell = function(value, isWrap, isInstant) {
            let cell2 = this.queryCell(value);
            if (!cell2) return;
            let index = this.getCellSlideIndex(cell2);
            this.select(index, isWrap, isInstant);
          };
          proto.getCellSlideIndex = function(cell2) {
            let cellSlide = this.slides.find((slide2) => slide2.cells.includes(cell2));
            return this.slides.indexOf(cellSlide);
          };
          proto.getCell = function(elem) {
            for (let cell2 of this.cells) {
              if (cell2.element === elem) return cell2;
            }
          };
          proto.getCells = function(elems) {
            elems = utils2.makeArray(elems);
            return elems.map((elem) => this.getCell(elem)).filter(Boolean);
          };
          proto.getCellElements = function() {
            return this.cells.map((cell2) => cell2.element);
          };
          proto.getParentCell = function(elem) {
            let cell2 = this.getCell(elem);
            if (cell2) return cell2;
            let closest = elem.closest(".flickity-slider > *");
            return this.getCell(closest);
          };
          proto.getAdjacentCellElements = function(adjCount, index) {
            if (!adjCount) return this.selectedSlide.getCellElements();
            index = index === void 0 ? this.selectedIndex : index;
            let len = this.slides.length;
            if (1 + adjCount * 2 >= len) {
              return this.getCellElements();
            }
            let cellElems = [];
            for (let i2 = index - adjCount; i2 <= index + adjCount; i2++) {
              let slideIndex = this.isWrapping ? utils2.modulo(i2, len) : i2;
              let slide2 = this.slides[slideIndex];
              if (slide2) {
                cellElems = cellElems.concat(slide2.getCellElements());
              }
            }
            return cellElems;
          };
          proto.queryCell = function(selector) {
            if (typeof selector == "number") {
              return this.cells[selector];
            }
            let isSelectorString = typeof selector == "string" && !selector.match(/^[#.]?[\d/]/);
            if (isSelectorString) {
              selector = this.element.querySelector(selector);
            }
            return this.getCell(selector);
          };
          proto.uiChange = function() {
            this.emitEvent("uiChange");
          };
          proto.onresize = function() {
            this.watchCSS();
            this.resize();
          };
          utils2.debounceMethod(Flickity2, "onresize", 150);
          proto.resize = function() {
            if (!this.isActive || this.isAnimating || this.isDragging) return;
            this.getSize();
            if (this.isWrapping) {
              this.x = utils2.modulo(this.x, this.slideableWidth);
            }
            this.positionCells();
            this._updateWrapShiftCells();
            this.setGallerySize();
            this.emitEvent("resize");
            let selectedElement = this.selectedElements && this.selectedElements[0];
            this.selectCell(selectedElement, false, true);
          };
          proto.watchCSS = function() {
            if (!this.options.watchCSS) return;
            let afterContent = getComputedStyle2(this.element, ":after").content;
            if (afterContent.includes("flickity")) {
              this.activate();
            } else {
              this.deactivate();
            }
          };
          proto.onkeydown = function(event) {
            let { activeElement } = document;
            let handler4 = Flickity2.keyboardHandlers[event.key];
            if (!this.options.accessibility || !activeElement || !handler4) return;
            let isFocused = this.focusableElems.some((elem) => activeElement === elem);
            if (isFocused) handler4.call(this);
          };
          Flickity2.keyboardHandlers = {
            ArrowLeft: function() {
              this.uiChange();
              let leftMethod = this.options.rightToLeft ? "next" : "previous";
              this[leftMethod]();
            },
            ArrowRight: function() {
              this.uiChange();
              let rightMethod = this.options.rightToLeft ? "previous" : "next";
              this[rightMethod]();
            }
          };
          proto.focus = function() {
            this.element.focus({ preventScroll: true });
          };
          proto.deactivate = function() {
            if (!this.isActive) return;
            this.element.classList.remove("flickity-enabled");
            this.element.classList.remove("flickity-rtl");
            this.unselectSelectedSlide();
            this.cells.forEach((cell2) => cell2.destroy());
            this.viewport.remove();
            this.element.append(...this.slider.children);
            if (this.options.accessibility) {
              this.element.removeAttribute("tabIndex");
              this.element.removeEventListener("keydown", this);
            }
            this.isActive = false;
            this.emitEvent("deactivate");
          };
          proto.destroy = function() {
            this.deactivate();
            window2.removeEventListener("resize", this);
            this.allOff();
            this.emitEvent("destroy");
            if (jQuery && this.$element) {
              jQuery.removeData(this.element, "flickity");
            }
            delete this.element.flickityGUID;
            delete instances[this.guid];
          };
          Object.assign(proto, animatePrototype);
          Flickity2.data = function(elem) {
            elem = utils2.getQueryElement(elem);
            if (elem) return instances[elem.flickityGUID];
          };
          utils2.htmlInit(Flickity2, "flickity");
          let { jQueryBridget } = window2;
          if (jQuery && jQueryBridget) {
            jQueryBridget("flickity", Flickity2, jQuery);
          }
          Flickity2.setJQuery = function(jq) {
            jQuery = jq;
          };
          Flickity2.Cell = Cell;
          Flickity2.Slide = Slide;
          return Flickity2;
        }
      );
    })(core);
    return core.exports;
  }
  var drag = { exports: {} };
  var unidragger = { exports: {} };
  /*!
   * Unidragger v3.0.1
   * Draggable base class
   * MIT license
   */
  var hasRequiredUnidragger;
  function requireUnidragger() {
    if (hasRequiredUnidragger) return unidragger.exports;
    hasRequiredUnidragger = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(
            window2,
            requireEvEmitter()
          );
        } else {
          window2.Unidragger = factory2(
            window2,
            window2.EvEmitter
          );
        }
      })(typeof window != "undefined" ? window : commonjsGlobal, function factory2(window2, EvEmitter) {
        function Unidragger() {
        }
        let proto = Unidragger.prototype = Object.create(EvEmitter.prototype);
        proto.handleEvent = function(event) {
          let method = "on" + event.type;
          if (this[method]) {
            this[method](event);
          }
        };
        let startEvent, activeEvents;
        if ("ontouchstart" in window2) {
          startEvent = "touchstart";
          activeEvents = ["touchmove", "touchend", "touchcancel"];
        } else if (window2.PointerEvent) {
          startEvent = "pointerdown";
          activeEvents = ["pointermove", "pointerup", "pointercancel"];
        } else {
          startEvent = "mousedown";
          activeEvents = ["mousemove", "mouseup"];
        }
        proto.touchActionValue = "none";
        proto.bindHandles = function() {
          this._bindHandles("addEventListener", this.touchActionValue);
        };
        proto.unbindHandles = function() {
          this._bindHandles("removeEventListener", "");
        };
        proto._bindHandles = function(bindMethod, touchAction) {
          this.handles.forEach((handle) => {
            handle[bindMethod](startEvent, this);
            handle[bindMethod]("click", this);
            if (window2.PointerEvent) handle.style.touchAction = touchAction;
          });
        };
        proto.bindActivePointerEvents = function() {
          activeEvents.forEach((eventName) => {
            window2.addEventListener(eventName, this);
          });
        };
        proto.unbindActivePointerEvents = function() {
          activeEvents.forEach((eventName) => {
            window2.removeEventListener(eventName, this);
          });
        };
        proto.withPointer = function(methodName, event) {
          if (event.pointerId === this.pointerIdentifier) {
            this[methodName](event, event);
          }
        };
        proto.withTouch = function(methodName, event) {
          let touch;
          for (let changedTouch of event.changedTouches) {
            if (changedTouch.identifier === this.pointerIdentifier) {
              touch = changedTouch;
            }
          }
          if (touch) this[methodName](event, touch);
        };
        proto.onmousedown = function(event) {
          this.pointerDown(event, event);
        };
        proto.ontouchstart = function(event) {
          this.pointerDown(event, event.changedTouches[0]);
        };
        proto.onpointerdown = function(event) {
          this.pointerDown(event, event);
        };
        const cursorNodes = ["TEXTAREA", "INPUT", "SELECT", "OPTION"];
        const clickTypes = ["radio", "checkbox", "button", "submit", "image", "file"];
        proto.pointerDown = function(event, pointer) {
          let isCursorNode = cursorNodes.includes(event.target.nodeName);
          let isClickType = clickTypes.includes(event.target.type);
          let isOkayElement = !isCursorNode || isClickType;
          let isOkay = !this.isPointerDown && !event.button && isOkayElement;
          if (!isOkay) return;
          this.isPointerDown = true;
          this.pointerIdentifier = pointer.pointerId !== void 0 ? (
            // pointerId for pointer events, touch.indentifier for touch events
            pointer.pointerId
          ) : pointer.identifier;
          this.pointerDownPointer = {
            pageX: pointer.pageX,
            pageY: pointer.pageY
          };
          this.bindActivePointerEvents();
          this.emitEvent("pointerDown", [event, pointer]);
        };
        proto.onmousemove = function(event) {
          this.pointerMove(event, event);
        };
        proto.onpointermove = function(event) {
          this.withPointer("pointerMove", event);
        };
        proto.ontouchmove = function(event) {
          this.withTouch("pointerMove", event);
        };
        proto.pointerMove = function(event, pointer) {
          let moveVector = {
            x: pointer.pageX - this.pointerDownPointer.pageX,
            y: pointer.pageY - this.pointerDownPointer.pageY
          };
          this.emitEvent("pointerMove", [event, pointer, moveVector]);
          let isDragStarting = !this.isDragging && this.hasDragStarted(moveVector);
          if (isDragStarting) this.dragStart(event, pointer);
          if (this.isDragging) this.dragMove(event, pointer, moveVector);
        };
        proto.hasDragStarted = function(moveVector) {
          return Math.abs(moveVector.x) > 3 || Math.abs(moveVector.y) > 3;
        };
        proto.dragStart = function(event, pointer) {
          this.isDragging = true;
          this.isPreventingClicks = true;
          this.emitEvent("dragStart", [event, pointer]);
        };
        proto.dragMove = function(event, pointer, moveVector) {
          this.emitEvent("dragMove", [event, pointer, moveVector]);
        };
        proto.onmouseup = function(event) {
          this.pointerUp(event, event);
        };
        proto.onpointerup = function(event) {
          this.withPointer("pointerUp", event);
        };
        proto.ontouchend = function(event) {
          this.withTouch("pointerUp", event);
        };
        proto.pointerUp = function(event, pointer) {
          this.pointerDone();
          this.emitEvent("pointerUp", [event, pointer]);
          if (this.isDragging) {
            this.dragEnd(event, pointer);
          } else {
            this.staticClick(event, pointer);
          }
        };
        proto.dragEnd = function(event, pointer) {
          this.isDragging = false;
          setTimeout(() => delete this.isPreventingClicks);
          this.emitEvent("dragEnd", [event, pointer]);
        };
        proto.pointerDone = function() {
          this.isPointerDown = false;
          delete this.pointerIdentifier;
          this.unbindActivePointerEvents();
          this.emitEvent("pointerDone");
        };
        proto.onpointercancel = function(event) {
          this.withPointer("pointerCancel", event);
        };
        proto.ontouchcancel = function(event) {
          this.withTouch("pointerCancel", event);
        };
        proto.pointerCancel = function(event, pointer) {
          this.pointerDone();
          this.emitEvent("pointerCancel", [event, pointer]);
        };
        proto.onclick = function(event) {
          if (this.isPreventingClicks) event.preventDefault();
        };
        proto.staticClick = function(event, pointer) {
          let isMouseup = event.type === "mouseup";
          if (isMouseup && this.isIgnoringMouseUp) return;
          this.emitEvent("staticClick", [event, pointer]);
          if (isMouseup) {
            this.isIgnoringMouseUp = true;
            setTimeout(() => {
              delete this.isIgnoringMouseUp;
            }, 400);
          }
        };
        return Unidragger;
      });
    })(unidragger);
    return unidragger.exports;
  }
  var hasRequiredDrag;
  function requireDrag() {
    if (hasRequiredDrag) return drag.exports;
    hasRequiredDrag = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(
            window2,
            requireCore(),
            requireUnidragger(),
            requireUtils()
          );
        } else {
          window2.Flickity = factory2(
            window2,
            window2.Flickity,
            window2.Unidragger,
            window2.fizzyUIUtils
          );
        }
      })(
        typeof window != "undefined" ? window : commonjsGlobal,
        function factory2(window2, Flickity2, Unidragger, utils2) {
          Object.assign(Flickity2.defaults, {
            draggable: ">1",
            dragThreshold: 3
          });
          let proto = Flickity2.prototype;
          Object.assign(proto, Unidragger.prototype);
          proto.touchActionValue = "";
          Flickity2.create.drag = function() {
            this.on("activate", this.onActivateDrag);
            this.on("uiChange", this._uiChangeDrag);
            this.on("deactivate", this.onDeactivateDrag);
            this.on("cellChange", this.updateDraggable);
            this.on("pointerDown", this.handlePointerDown);
            this.on("pointerUp", this.handlePointerUp);
            this.on("pointerDown", this.handlePointerDone);
            this.on("dragStart", this.handleDragStart);
            this.on("dragMove", this.handleDragMove);
            this.on("dragEnd", this.handleDragEnd);
            this.on("staticClick", this.handleStaticClick);
          };
          proto.onActivateDrag = function() {
            this.handles = [this.viewport];
            this.bindHandles();
            this.updateDraggable();
          };
          proto.onDeactivateDrag = function() {
            this.unbindHandles();
            this.element.classList.remove("is-draggable");
          };
          proto.updateDraggable = function() {
            if (this.options.draggable === ">1") {
              this.isDraggable = this.slides.length > 1;
            } else {
              this.isDraggable = this.options.draggable;
            }
            this.element.classList.toggle("is-draggable", this.isDraggable);
          };
          proto._uiChangeDrag = function() {
            delete this.isFreeScrolling;
          };
          proto.handlePointerDown = function(event) {
            if (!this.isDraggable) {
              this.bindActivePointerEvents(event);
              return;
            }
            let isTouchStart = event.type === "touchstart";
            let isTouchPointer = event.pointerType === "touch";
            let isFocusNode = event.target.matches("input, textarea, select");
            if (!isTouchStart && !isTouchPointer && !isFocusNode) event.preventDefault();
            if (!isFocusNode) this.focus();
            if (document.activeElement !== this.element) document.activeElement.blur();
            this.dragX = this.x;
            this.viewport.classList.add("is-pointer-down");
            this.pointerDownScroll = getScrollPosition();
            window2.addEventListener("scroll", this);
            this.bindActivePointerEvents(event);
          };
          proto.hasDragStarted = function(moveVector) {
            return Math.abs(moveVector.x) > this.options.dragThreshold;
          };
          proto.handlePointerUp = function() {
            delete this.isTouchScrolling;
            this.viewport.classList.remove("is-pointer-down");
          };
          proto.handlePointerDone = function() {
            window2.removeEventListener("scroll", this);
            delete this.pointerDownScroll;
          };
          proto.handleDragStart = function() {
            if (!this.isDraggable) return;
            this.dragStartPosition = this.x;
            this.startAnimation();
            window2.removeEventListener("scroll", this);
          };
          proto.handleDragMove = function(event, pointer, moveVector) {
            if (!this.isDraggable) return;
            event.preventDefault();
            this.previousDragX = this.dragX;
            let direction = this.options.rightToLeft ? -1 : 1;
            if (this.isWrapping) moveVector.x %= this.slideableWidth;
            let dragX = this.dragStartPosition + moveVector.x * direction;
            if (!this.isWrapping) {
              let originBound = Math.max(-this.slides[0].target, this.dragStartPosition);
              dragX = dragX > originBound ? (dragX + originBound) * 0.5 : dragX;
              let endBound = Math.min(-this.getLastSlide().target, this.dragStartPosition);
              dragX = dragX < endBound ? (dragX + endBound) * 0.5 : dragX;
            }
            this.dragX = dragX;
            this.dragMoveTime = /* @__PURE__ */ new Date();
          };
          proto.handleDragEnd = function() {
            if (!this.isDraggable) return;
            let { freeScroll } = this.options;
            if (freeScroll) this.isFreeScrolling = true;
            let index = this.dragEndRestingSelect();
            if (freeScroll && !this.isWrapping) {
              let restingX = this.getRestingPosition();
              this.isFreeScrolling = -restingX > this.slides[0].target && -restingX < this.getLastSlide().target;
            } else if (!freeScroll && index === this.selectedIndex) {
              index += this.dragEndBoostSelect();
            }
            delete this.previousDragX;
            this.isDragSelect = this.isWrapping;
            this.select(index);
            delete this.isDragSelect;
          };
          proto.dragEndRestingSelect = function() {
            let restingX = this.getRestingPosition();
            let distance = Math.abs(this.getSlideDistance(-restingX, this.selectedIndex));
            let positiveResting = this._getClosestResting(restingX, distance, 1);
            let negativeResting = this._getClosestResting(restingX, distance, -1);
            return positiveResting.distance < negativeResting.distance ? positiveResting.index : negativeResting.index;
          };
          proto._getClosestResting = function(restingX, distance, increment) {
            let index = this.selectedIndex;
            let minDistance = Infinity;
            let condition = this.options.contain && !this.isWrapping ? (
              // if containing, keep going if distance is equal to minDistance
              (dist, minDist) => dist <= minDist
            ) : (dist, minDist) => dist < minDist;
            while (condition(distance, minDistance)) {
              index += increment;
              minDistance = distance;
              distance = this.getSlideDistance(-restingX, index);
              if (distance === null) break;
              distance = Math.abs(distance);
            }
            return {
              distance: minDistance,
              // selected was previous index
              index: index - increment
            };
          };
          proto.getSlideDistance = function(x, index) {
            let len = this.slides.length;
            let isWrapAround = this.options.wrapAround && len > 1;
            let slideIndex = isWrapAround ? utils2.modulo(index, len) : index;
            let slide2 = this.slides[slideIndex];
            if (!slide2) return null;
            let wrap = isWrapAround ? this.slideableWidth * Math.floor(index / len) : 0;
            return x - (slide2.target + wrap);
          };
          proto.dragEndBoostSelect = function() {
            if (this.previousDragX === void 0 || !this.dragMoveTime || // or if drag was held for 100 ms
            /* @__PURE__ */ new Date() - this.dragMoveTime > 100) {
              return 0;
            }
            let distance = this.getSlideDistance(-this.dragX, this.selectedIndex);
            let delta = this.previousDragX - this.dragX;
            if (distance > 0 && delta > 0) {
              return 1;
            } else if (distance < 0 && delta < 0) {
              return -1;
            }
            return 0;
          };
          proto.onscroll = function() {
            let scroll = getScrollPosition();
            let scrollMoveX = this.pointerDownScroll.x - scroll.x;
            let scrollMoveY = this.pointerDownScroll.y - scroll.y;
            if (Math.abs(scrollMoveX) > 3 || Math.abs(scrollMoveY) > 3) {
              this.pointerDone();
            }
          };
          function getScrollPosition() {
            return {
              x: window2.pageXOffset,
              y: window2.pageYOffset
            };
          }
          return Flickity2;
        }
      );
    })(drag);
    return drag.exports;
  }
  var prevNextButton = { exports: {} };
  var hasRequiredPrevNextButton;
  function requirePrevNextButton() {
    if (hasRequiredPrevNextButton) return prevNextButton.exports;
    hasRequiredPrevNextButton = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(requireCore());
        } else {
          factory2(window2.Flickity);
        }
      })(typeof window != "undefined" ? window : commonjsGlobal, function factory2(Flickity2) {
        const svgURI = "http://www.w3.org/2000/svg";
        function PrevNextButton(increment, direction, arrowShape) {
          this.increment = increment;
          this.direction = direction;
          this.isPrevious = increment === "previous";
          this.isLeft = direction === "left";
          this._create(arrowShape);
        }
        PrevNextButton.prototype._create = function(arrowShape) {
          let element = this.element = document.createElement("button");
          element.className = "flickity-button flickity-prev-next-button ".concat(this.increment);
          let label = this.isPrevious ? "Previous" : "Next";
          element.setAttribute("type", "button");
          element.setAttribute("aria-label", label);
          this.disable();
          let svg = this.createSVG(label, arrowShape);
          element.append(svg);
        };
        PrevNextButton.prototype.createSVG = function(label, arrowShape) {
          let svg = document.createElementNS(svgURI, "svg");
          svg.setAttribute("class", "flickity-button-icon");
          svg.setAttribute("viewBox", "0 0 100 100");
          let title = document.createElementNS(svgURI, "title");
          title.append(label);
          let path = document.createElementNS(svgURI, "path");
          let pathMovements = getArrowMovements(arrowShape);
          path.setAttribute("d", pathMovements);
          path.setAttribute("class", "arrow");
          if (!this.isLeft) {
            path.setAttribute("transform", "translate(100, 100) rotate(180)");
          }
          svg.append(title, path);
          return svg;
        };
        function getArrowMovements(shape) {
          if (typeof shape == "string") return shape;
          let { x0, x1, x2, x3, y1, y2 } = shape;
          return "M ".concat(x0, ", 50\n    L ").concat(x1, ", ").concat(y1 + 50, "\n    L ").concat(x2, ", ").concat(y2 + 50, "\n    L ").concat(x3, ", 50\n    L ").concat(x2, ", ").concat(50 - y2, "\n    L ").concat(x1, ", ").concat(50 - y1, "\n    Z");
        }
        PrevNextButton.prototype.enable = function() {
          this.element.removeAttribute("disabled");
        };
        PrevNextButton.prototype.disable = function() {
          this.element.setAttribute("disabled", true);
        };
        Object.assign(Flickity2.defaults, {
          prevNextButtons: true,
          arrowShape: {
            x0: 10,
            x1: 60,
            y1: 50,
            x2: 70,
            y2: 40,
            x3: 30
          }
        });
        Flickity2.create.prevNextButtons = function() {
          if (!this.options.prevNextButtons) return;
          let { rightToLeft, arrowShape } = this.options;
          let prevDirection = rightToLeft ? "right" : "left";
          let nextDirection = rightToLeft ? "left" : "right";
          this.prevButton = new PrevNextButton("previous", prevDirection, arrowShape);
          this.nextButton = new PrevNextButton("next", nextDirection, arrowShape);
          this.focusableElems.push(this.prevButton.element);
          this.focusableElems.push(this.nextButton.element);
          this.handlePrevButtonClick = () => {
            this.uiChange();
            this.previous();
          };
          this.handleNextButtonClick = () => {
            this.uiChange();
            this.next();
          };
          this.on("activate", this.activatePrevNextButtons);
          this.on("select", this.updatePrevNextButtons);
        };
        let proto = Flickity2.prototype;
        proto.updatePrevNextButtons = function() {
          let lastIndex = this.slides.length ? this.slides.length - 1 : 0;
          this.updatePrevNextButton(this.prevButton, 0);
          this.updatePrevNextButton(this.nextButton, lastIndex);
        };
        proto.updatePrevNextButton = function(button, disabledIndex) {
          if (this.isWrapping && this.slides.length > 1) {
            button.enable();
            return;
          }
          let isEnabled = this.selectedIndex !== disabledIndex;
          button[isEnabled ? "enable" : "disable"]();
          let isDisabledFocused = !isEnabled && document.activeElement === button.element;
          if (isDisabledFocused) this.focus();
        };
        proto.activatePrevNextButtons = function() {
          this.prevButton.element.addEventListener("click", this.handlePrevButtonClick);
          this.nextButton.element.addEventListener("click", this.handleNextButtonClick);
          this.element.append(this.prevButton.element, this.nextButton.element);
          this.on("deactivate", this.deactivatePrevNextButtons);
        };
        proto.deactivatePrevNextButtons = function() {
          this.prevButton.element.remove();
          this.nextButton.element.remove();
          this.prevButton.element.removeEventListener("click", this.handlePrevButtonClick);
          this.nextButton.element.removeEventListener("click", this.handleNextButtonClick);
          this.off("deactivate", this.deactivatePrevNextButtons);
        };
        Flickity2.PrevNextButton = PrevNextButton;
        return Flickity2;
      });
    })(prevNextButton);
    return prevNextButton.exports;
  }
  var pageDots = { exports: {} };
  var hasRequiredPageDots;
  function requirePageDots() {
    if (hasRequiredPageDots) return pageDots.exports;
    hasRequiredPageDots = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(
            requireCore(),
            requireUtils()
          );
        } else {
          factory2(
            window2.Flickity,
            window2.fizzyUIUtils
          );
        }
      })(typeof window != "undefined" ? window : commonjsGlobal, function factory2(Flickity2, utils2) {
        function PageDots() {
          this.holder = document.createElement("div");
          this.holder.className = "flickity-page-dots";
          this.dots = [];
        }
        PageDots.prototype.setDots = function(slidesLength) {
          let delta = slidesLength - this.dots.length;
          if (delta > 0) {
            this.addDots(delta);
          } else if (delta < 0) {
            this.removeDots(-delta);
          }
        };
        PageDots.prototype.addDots = function(count) {
          let newDots = new Array(count).fill().map((item, i2) => {
            let dot = document.createElement("button");
            dot.setAttribute("type", "button");
            let num = i2 + 1 + this.dots.length;
            dot.className = "flickity-page-dot";
            dot.textContent = "View slide ".concat(num);
            return dot;
          });
          this.holder.append(...newDots);
          this.dots = this.dots.concat(newDots);
        };
        PageDots.prototype.removeDots = function(count) {
          let removeDots = this.dots.splice(this.dots.length - count, count);
          removeDots.forEach((dot) => dot.remove());
        };
        PageDots.prototype.updateSelected = function(index) {
          if (this.selectedDot) {
            this.selectedDot.classList.remove("is-selected");
            this.selectedDot.removeAttribute("aria-current");
          }
          if (!this.dots.length) return;
          this.selectedDot = this.dots[index];
          this.selectedDot.classList.add("is-selected");
          this.selectedDot.setAttribute("aria-current", "step");
        };
        Flickity2.PageDots = PageDots;
        Object.assign(Flickity2.defaults, {
          pageDots: true
        });
        Flickity2.create.pageDots = function() {
          if (!this.options.pageDots) return;
          this.pageDots = new PageDots();
          this.handlePageDotsClick = this.onPageDotsClick.bind(this);
          this.on("activate", this.activatePageDots);
          this.on("select", this.updateSelectedPageDots);
          this.on("cellChange", this.updatePageDots);
          this.on("resize", this.updatePageDots);
          this.on("deactivate", this.deactivatePageDots);
        };
        let proto = Flickity2.prototype;
        proto.activatePageDots = function() {
          this.pageDots.setDots(this.slides.length);
          this.focusableElems.push(...this.pageDots.dots);
          this.pageDots.holder.addEventListener("click", this.handlePageDotsClick);
          this.element.append(this.pageDots.holder);
        };
        proto.onPageDotsClick = function(event) {
          let index = this.pageDots.dots.indexOf(event.target);
          if (index === -1) return;
          this.uiChange();
          this.select(index);
        };
        proto.updateSelectedPageDots = function() {
          this.pageDots.updateSelected(this.selectedIndex);
        };
        proto.updatePageDots = function() {
          this.pageDots.dots.forEach((dot) => {
            utils2.removeFrom(this.focusableElems, dot);
          });
          this.pageDots.setDots(this.slides.length);
          this.focusableElems.push(...this.pageDots.dots);
        };
        proto.deactivatePageDots = function() {
          this.pageDots.holder.remove();
          this.pageDots.holder.removeEventListener("click", this.handlePageDotsClick);
        };
        Flickity2.PageDots = PageDots;
        return Flickity2;
      });
    })(pageDots);
    return pageDots.exports;
  }
  var player = { exports: {} };
  var hasRequiredPlayer;
  function requirePlayer() {
    if (hasRequiredPlayer) return player.exports;
    hasRequiredPlayer = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(requireCore());
        } else {
          factory2(window2.Flickity);
        }
      })(typeof window != "undefined" ? window : commonjsGlobal, function factory2(Flickity2) {
        function Player(autoPlay, onTick) {
          this.autoPlay = autoPlay;
          this.onTick = onTick;
          this.state = "stopped";
          this.onVisibilityChange = this.visibilityChange.bind(this);
          this.onVisibilityPlay = this.visibilityPlay.bind(this);
        }
        Player.prototype.play = function() {
          if (this.state === "playing") return;
          let isPageHidden = document.hidden;
          if (isPageHidden) {
            document.addEventListener("visibilitychange", this.onVisibilityPlay);
            return;
          }
          this.state = "playing";
          document.addEventListener("visibilitychange", this.onVisibilityChange);
          this.tick();
        };
        Player.prototype.tick = function() {
          if (this.state !== "playing") return;
          let time = typeof this.autoPlay == "number" ? this.autoPlay : 3e3;
          this.clear();
          this.timeout = setTimeout(() => {
            this.onTick();
            this.tick();
          }, time);
        };
        Player.prototype.stop = function() {
          this.state = "stopped";
          this.clear();
          document.removeEventListener("visibilitychange", this.onVisibilityChange);
        };
        Player.prototype.clear = function() {
          clearTimeout(this.timeout);
        };
        Player.prototype.pause = function() {
          if (this.state === "playing") {
            this.state = "paused";
            this.clear();
          }
        };
        Player.prototype.unpause = function() {
          if (this.state === "paused") this.play();
        };
        Player.prototype.visibilityChange = function() {
          let isPageHidden = document.hidden;
          this[isPageHidden ? "pause" : "unpause"]();
        };
        Player.prototype.visibilityPlay = function() {
          this.play();
          document.removeEventListener("visibilitychange", this.onVisibilityPlay);
        };
        Object.assign(Flickity2.defaults, {
          pauseAutoPlayOnHover: true
        });
        Flickity2.create.player = function() {
          this.player = new Player(this.options.autoPlay, () => {
            this.next(true);
          });
          this.on("activate", this.activatePlayer);
          this.on("uiChange", this.stopPlayer);
          this.on("pointerDown", this.stopPlayer);
          this.on("deactivate", this.deactivatePlayer);
        };
        let proto = Flickity2.prototype;
        proto.activatePlayer = function() {
          if (!this.options.autoPlay) return;
          this.player.play();
          this.element.addEventListener("mouseenter", this);
        };
        proto.playPlayer = function() {
          this.player.play();
        };
        proto.stopPlayer = function() {
          this.player.stop();
        };
        proto.pausePlayer = function() {
          this.player.pause();
        };
        proto.unpausePlayer = function() {
          this.player.unpause();
        };
        proto.deactivatePlayer = function() {
          this.player.stop();
          this.element.removeEventListener("mouseenter", this);
        };
        proto.onmouseenter = function() {
          if (!this.options.pauseAutoPlayOnHover) return;
          this.player.pause();
          this.element.addEventListener("mouseleave", this);
        };
        proto.onmouseleave = function() {
          this.player.unpause();
          this.element.removeEventListener("mouseleave", this);
        };
        Flickity2.Player = Player;
        return Flickity2;
      });
    })(player);
    return player.exports;
  }
  var addRemoveCell = { exports: {} };
  var hasRequiredAddRemoveCell;
  function requireAddRemoveCell() {
    if (hasRequiredAddRemoveCell) return addRemoveCell.exports;
    hasRequiredAddRemoveCell = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(
            requireCore(),
            requireUtils()
          );
        } else {
          factory2(
            window2.Flickity,
            window2.fizzyUIUtils
          );
        }
      })(typeof window != "undefined" ? window : commonjsGlobal, function factory2(Flickity2, utils2) {
        function getCellsFragment(cells) {
          let fragment = document.createDocumentFragment();
          cells.forEach((cell2) => fragment.appendChild(cell2.element));
          return fragment;
        }
        let proto = Flickity2.prototype;
        proto.insert = function(elems, index) {
          let cells = this._makeCells(elems);
          if (!cells || !cells.length) return;
          let len = this.cells.length;
          index = index === void 0 ? len : index;
          let fragment = getCellsFragment(cells);
          let isAppend = index === len;
          if (isAppend) {
            this.slider.appendChild(fragment);
          } else {
            let insertCellElement = this.cells[index].element;
            this.slider.insertBefore(fragment, insertCellElement);
          }
          if (index === 0) {
            this.cells = cells.concat(this.cells);
          } else if (isAppend) {
            this.cells = this.cells.concat(cells);
          } else {
            let endCells = this.cells.splice(index, len - index);
            this.cells = this.cells.concat(cells).concat(endCells);
          }
          this._sizeCells(cells);
          this.cellChange(index);
          this.positionSliderAtSelected();
        };
        proto.append = function(elems) {
          this.insert(elems, this.cells.length);
        };
        proto.prepend = function(elems) {
          this.insert(elems, 0);
        };
        proto.remove = function(elems) {
          let cells = this.getCells(elems);
          if (!cells || !cells.length) return;
          let minCellIndex = this.cells.length - 1;
          cells.forEach((cell2) => {
            cell2.remove();
            let index = this.cells.indexOf(cell2);
            minCellIndex = Math.min(index, minCellIndex);
            utils2.removeFrom(this.cells, cell2);
          });
          this.cellChange(minCellIndex);
          this.positionSliderAtSelected();
        };
        proto.cellSizeChange = function(elem) {
          let cell2 = this.getCell(elem);
          if (!cell2) return;
          cell2.getSize();
          let index = this.cells.indexOf(cell2);
          this.cellChange(index);
        };
        proto.cellChange = function(changedCellIndex) {
          let prevSelectedElem = this.selectedElement;
          this._positionCells(changedCellIndex);
          this._updateWrapShiftCells();
          this.setGallerySize();
          let cell2 = this.getCell(prevSelectedElem);
          if (cell2) this.selectedIndex = this.getCellSlideIndex(cell2);
          this.selectedIndex = Math.min(this.slides.length - 1, this.selectedIndex);
          this.emitEvent("cellChange", [changedCellIndex]);
          this.select(this.selectedIndex);
        };
        return Flickity2;
      });
    })(addRemoveCell);
    return addRemoveCell.exports;
  }
  var lazyload = { exports: {} };
  var hasRequiredLazyload;
  function requireLazyload() {
    if (hasRequiredLazyload) return lazyload.exports;
    hasRequiredLazyload = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(
            requireCore(),
            requireUtils()
          );
        } else {
          factory2(
            window2.Flickity,
            window2.fizzyUIUtils
          );
        }
      })(typeof window != "undefined" ? window : commonjsGlobal, function factory2(Flickity2, utils2) {
        const lazyAttr = "data-flickity-lazyload";
        const lazySrcAttr = "".concat(lazyAttr, "-src");
        const lazySrcsetAttr = "".concat(lazyAttr, "-srcset");
        const imgSelector = "img[".concat(lazyAttr, "], img[").concat(lazySrcAttr, "], ") + "img[".concat(lazySrcsetAttr, "], source[").concat(lazySrcsetAttr, "]");
        Flickity2.create.lazyLoad = function() {
          this.on("select", this.lazyLoad);
          this.handleLazyLoadComplete = this.onLazyLoadComplete.bind(this);
        };
        let proto = Flickity2.prototype;
        proto.lazyLoad = function() {
          let { lazyLoad } = this.options;
          if (!lazyLoad) return;
          let adjCount = typeof lazyLoad == "number" ? lazyLoad : 0;
          this.getAdjacentCellElements(adjCount).map(getCellLazyImages).flat().forEach((img) => new LazyLoader(img, this.handleLazyLoadComplete));
        };
        function getCellLazyImages(cellElem) {
          if (cellElem.matches("img")) {
            let cellAttr = cellElem.getAttribute(lazyAttr);
            let cellSrcAttr = cellElem.getAttribute(lazySrcAttr);
            let cellSrcsetAttr = cellElem.getAttribute(lazySrcsetAttr);
            if (cellAttr || cellSrcAttr || cellSrcsetAttr) {
              return cellElem;
            }
          }
          return [...cellElem.querySelectorAll(imgSelector)];
        }
        proto.onLazyLoadComplete = function(img, event) {
          let cell2 = this.getParentCell(img);
          let cellElem = cell2 && cell2.element;
          this.cellSizeChange(cellElem);
          this.dispatchEvent("lazyLoad", event, cellElem);
        };
        function LazyLoader(img, onComplete) {
          this.img = img;
          this.onComplete = onComplete;
          this.load();
        }
        LazyLoader.prototype.handleEvent = utils2.handleEvent;
        LazyLoader.prototype.load = function() {
          this.img.addEventListener("load", this);
          this.img.addEventListener("error", this);
          let src = this.img.getAttribute(lazyAttr) || this.img.getAttribute(lazySrcAttr);
          let srcset = this.img.getAttribute(lazySrcsetAttr);
          this.img.src = src;
          if (srcset) this.img.setAttribute("srcset", srcset);
          this.img.removeAttribute(lazyAttr);
          this.img.removeAttribute(lazySrcAttr);
          this.img.removeAttribute(lazySrcsetAttr);
        };
        LazyLoader.prototype.onload = function(event) {
          this.complete(event, "flickity-lazyloaded");
        };
        LazyLoader.prototype.onerror = function(event) {
          this.complete(event, "flickity-lazyerror");
        };
        LazyLoader.prototype.complete = function(event, className) {
          this.img.removeEventListener("load", this);
          this.img.removeEventListener("error", this);
          let mediaElem = this.img.parentNode.matches("picture") ? this.img.parentNode : this.img;
          mediaElem.classList.add(className);
          this.onComplete(this.img, event);
        };
        Flickity2.LazyLoader = LazyLoader;
        return Flickity2;
      });
    })(lazyload);
    return lazyload.exports;
  }
  var imagesloaded$1 = { exports: {} };
  var imagesloaded = { exports: {} };
  /*!
   * imagesLoaded v5.0.0
   * JavaScript is all like "You images are done yet or what?"
   * MIT License
   */
  var hasRequiredImagesloaded$1;
  function requireImagesloaded$1() {
    if (hasRequiredImagesloaded$1) return imagesloaded.exports;
    hasRequiredImagesloaded$1 = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(window2, requireEvEmitter());
        } else {
          window2.imagesLoaded = factory2(window2, window2.EvEmitter);
        }
      })(
        typeof window !== "undefined" ? window : commonjsGlobal,
        function factory2(window2, EvEmitter) {
          let $ = window2.jQuery;
          let console2 = window2.console;
          function makeArray(obj) {
            if (Array.isArray(obj)) return obj;
            let isArrayLike = typeof obj == "object" && typeof obj.length == "number";
            if (isArrayLike) return [...obj];
            return [obj];
          }
          function ImagesLoaded(elem, options, onAlways) {
            if (!(this instanceof ImagesLoaded)) {
              return new ImagesLoaded(elem, options, onAlways);
            }
            let queryElem = elem;
            if (typeof elem == "string") {
              queryElem = document.querySelectorAll(elem);
            }
            if (!queryElem) {
              console2.error("Bad element for imagesLoaded ".concat(queryElem || elem));
              return;
            }
            this.elements = makeArray(queryElem);
            this.options = {};
            if (typeof options == "function") {
              onAlways = options;
            } else {
              Object.assign(this.options, options);
            }
            if (onAlways) this.on("always", onAlways);
            this.getImages();
            if ($) this.jqDeferred = new $.Deferred();
            setTimeout(this.check.bind(this));
          }
          ImagesLoaded.prototype = Object.create(EvEmitter.prototype);
          ImagesLoaded.prototype.getImages = function() {
            this.images = [];
            this.elements.forEach(this.addElementImages, this);
          };
          const elementNodeTypes = [1, 9, 11];
          ImagesLoaded.prototype.addElementImages = function(elem) {
            if (elem.nodeName === "IMG") {
              this.addImage(elem);
            }
            if (this.options.background === true) {
              this.addElementBackgroundImages(elem);
            }
            let { nodeType } = elem;
            if (!nodeType || !elementNodeTypes.includes(nodeType)) return;
            let childImgs = elem.querySelectorAll("img");
            for (let img of childImgs) {
              this.addImage(img);
            }
            if (typeof this.options.background == "string") {
              let children = elem.querySelectorAll(this.options.background);
              for (let child of children) {
                this.addElementBackgroundImages(child);
              }
            }
          };
          const reURL = /url\((['"])?(.*?)\1\)/gi;
          ImagesLoaded.prototype.addElementBackgroundImages = function(elem) {
            let style = getComputedStyle(elem);
            if (!style) return;
            let matches = reURL.exec(style.backgroundImage);
            while (matches !== null) {
              let url = matches && matches[2];
              if (url) {
                this.addBackground(url, elem);
              }
              matches = reURL.exec(style.backgroundImage);
            }
          };
          ImagesLoaded.prototype.addImage = function(img) {
            let loadingImage = new LoadingImage(img);
            this.images.push(loadingImage);
          };
          ImagesLoaded.prototype.addBackground = function(url, elem) {
            let background = new Background(url, elem);
            this.images.push(background);
          };
          ImagesLoaded.prototype.check = function() {
            this.progressedCount = 0;
            this.hasAnyBroken = false;
            if (!this.images.length) {
              this.complete();
              return;
            }
            let onProgress = (image, elem, message) => {
              setTimeout(() => {
                this.progress(image, elem, message);
              });
            };
            this.images.forEach(function(loadingImage) {
              loadingImage.once("progress", onProgress);
              loadingImage.check();
            });
          };
          ImagesLoaded.prototype.progress = function(image, elem, message) {
            this.progressedCount++;
            this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
            this.emitEvent("progress", [this, image, elem]);
            if (this.jqDeferred && this.jqDeferred.notify) {
              this.jqDeferred.notify(this, image);
            }
            if (this.progressedCount === this.images.length) {
              this.complete();
            }
            if (this.options.debug && console2) {
              console2.log("progress: ".concat(message), image, elem);
            }
          };
          ImagesLoaded.prototype.complete = function() {
            let eventName = this.hasAnyBroken ? "fail" : "done";
            this.isComplete = true;
            this.emitEvent(eventName, [this]);
            this.emitEvent("always", [this]);
            if (this.jqDeferred) {
              let jqMethod = this.hasAnyBroken ? "reject" : "resolve";
              this.jqDeferred[jqMethod](this);
            }
          };
          function LoadingImage(img) {
            this.img = img;
          }
          LoadingImage.prototype = Object.create(EvEmitter.prototype);
          LoadingImage.prototype.check = function() {
            let isComplete = this.getIsImageComplete();
            if (isComplete) {
              this.confirm(this.img.naturalWidth !== 0, "naturalWidth");
              return;
            }
            this.proxyImage = new Image();
            if (this.img.crossOrigin) {
              this.proxyImage.crossOrigin = this.img.crossOrigin;
            }
            this.proxyImage.addEventListener("load", this);
            this.proxyImage.addEventListener("error", this);
            this.img.addEventListener("load", this);
            this.img.addEventListener("error", this);
            this.proxyImage.src = this.img.currentSrc || this.img.src;
          };
          LoadingImage.prototype.getIsImageComplete = function() {
            return this.img.complete && this.img.naturalWidth;
          };
          LoadingImage.prototype.confirm = function(isLoaded, message) {
            this.isLoaded = isLoaded;
            let { parentNode } = this.img;
            let elem = parentNode.nodeName === "PICTURE" ? parentNode : this.img;
            this.emitEvent("progress", [this, elem, message]);
          };
          LoadingImage.prototype.handleEvent = function(event) {
            let method = "on" + event.type;
            if (this[method]) {
              this[method](event);
            }
          };
          LoadingImage.prototype.onload = function() {
            this.confirm(true, "onload");
            this.unbindEvents();
          };
          LoadingImage.prototype.onerror = function() {
            this.confirm(false, "onerror");
            this.unbindEvents();
          };
          LoadingImage.prototype.unbindEvents = function() {
            this.proxyImage.removeEventListener("load", this);
            this.proxyImage.removeEventListener("error", this);
            this.img.removeEventListener("load", this);
            this.img.removeEventListener("error", this);
          };
          function Background(url, element) {
            this.url = url;
            this.element = element;
            this.img = new Image();
          }
          Background.prototype = Object.create(LoadingImage.prototype);
          Background.prototype.check = function() {
            this.img.addEventListener("load", this);
            this.img.addEventListener("error", this);
            this.img.src = this.url;
            let isComplete = this.getIsImageComplete();
            if (isComplete) {
              this.confirm(this.img.naturalWidth !== 0, "naturalWidth");
              this.unbindEvents();
            }
          };
          Background.prototype.unbindEvents = function() {
            this.img.removeEventListener("load", this);
            this.img.removeEventListener("error", this);
          };
          Background.prototype.confirm = function(isLoaded, message) {
            this.isLoaded = isLoaded;
            this.emitEvent("progress", [this, this.element, message]);
          };
          ImagesLoaded.makeJQueryPlugin = function(jQuery) {
            jQuery = jQuery || window2.jQuery;
            if (!jQuery) return;
            $ = jQuery;
            $.fn.imagesLoaded = function(options, onAlways) {
              let instance = new ImagesLoaded(this, options, onAlways);
              return instance.jqDeferred.promise($(this));
            };
          };
          ImagesLoaded.makeJQueryPlugin();
          return ImagesLoaded;
        }
      );
    })(imagesloaded);
    return imagesloaded.exports;
  }
  var hasRequiredImagesloaded;
  function requireImagesloaded() {
    if (hasRequiredImagesloaded) return imagesloaded$1.exports;
    hasRequiredImagesloaded = 1;
    (function(module) {
      (function(window2, factory2) {
        if (module.exports) {
          module.exports = factory2(
            requireCore(),
            requireImagesloaded$1()
          );
        } else {
          factory2(
            window2.Flickity,
            window2.imagesLoaded
          );
        }
      })(
        typeof window != "undefined" ? window : commonjsGlobal,
        function factory2(Flickity2, imagesLoaded) {
          Flickity2.create.imagesLoaded = function() {
            this.on("activate", this.imagesLoaded);
          };
          Flickity2.prototype.imagesLoaded = function() {
            if (!this.options.imagesLoaded) return;
            let onImagesLoadedProgress = (instance, image) => {
              let cell2 = this.getParentCell(image.img);
              this.cellSizeChange(cell2 && cell2.element);
              if (!this.options.freeScroll) this.positionSliderAtSelected();
            };
            imagesLoaded(this.slider).on("progress", onImagesLoadedProgress);
          };
          return Flickity2;
        }
      );
    })(imagesloaded$1);
    return imagesloaded$1.exports;
  }
  /*!
   * Flickity v3.0.0
   * Touch, responsive, flickable carousels
   *
   * Licensed GPLv3 for open source use
   * or Flickity Commercial License for commercial use
   *
   * https://flickity.metafizzy.co
   * Copyright 2015-2022 Metafizzy
   */
  var hasRequiredJs;
  function requireJs() {
    if (hasRequiredJs) return js.exports;
    hasRequiredJs = 1;
    (function(module) {
      if (module.exports) {
        const Flickity2 = requireCore();
        requireDrag();
        requirePrevNextButton();
        requirePageDots();
        requirePlayer();
        requireAddRemoveCell();
        requireLazyload();
        requireImagesloaded();
        module.exports = Flickity2;
      }
    })(js);
    return js.exports;
  }
  (function(module) {
    (function(window2, factory2) {
      if (module.exports) {
        module.exports = factory2(
          requireJs(),
          requireUtils()
        );
      } else {
        factory2(
          window2.Flickity,
          window2.fizzyUIUtils
        );
      }
    })(typeof window != "undefined" ? window : commonjsGlobal, function factory2(Flickity2, utils2) {
      let Slide = Flickity2.Slide;
      Slide.prototype.renderFadePosition = function() {
      };
      Slide.prototype.setOpacity = function(alpha) {
        this.cells.forEach((cell2) => {
          cell2.element.style.opacity = alpha;
        });
      };
      Flickity2.create.fade = function() {
        this.fadeIndex = this.selectedIndex;
        this.prevSelectedIndex = this.selectedIndex;
        this.on("select", this.onSelectFade);
        this.on("dragEnd", this.onDragEndFade);
        this.on("settle", this.onSettleFade);
        this.on("activate", this.onActivateFade);
        this.on("deactivate", this.onDeactivateFade);
      };
      let proto = Flickity2.prototype;
      let updateSlides = proto.updateSlides;
      proto.updateSlides = function() {
        updateSlides.apply(this, arguments);
        if (!this.options.fade) return;
        this.slides.forEach((slide2, i2) => {
          let slideTargetX = slide2.target - slide2.x;
          let firstCellX = slide2.cells[0].x;
          slide2.cells.forEach((cell2) => {
            let targetX = cell2.x - firstCellX - slideTargetX;
            this._renderCellPosition(cell2, targetX);
          });
          let alpha = i2 === this.selectedIndex ? 1 : 0;
          slide2.setOpacity(alpha);
        });
      };
      proto.onSelectFade = function() {
        this.fadeIndex = Math.min(this.prevSelectedIndex, this.slides.length - 1);
        this.prevSelectedIndex = this.selectedIndex;
      };
      proto.onSettleFade = function() {
        delete this.didDragEnd;
        if (!this.options.fade) return;
        this.selectedSlide.setOpacity(1);
        let fadedSlide = this.slides[this.fadeIndex];
        if (fadedSlide && this.fadeIndex !== this.selectedIndex) {
          this.slides[this.fadeIndex].setOpacity(0);
        }
      };
      proto.onDragEndFade = function() {
        this.didDragEnd = true;
      };
      proto.onActivateFade = function() {
        if (this.options.fade) {
          this.element.classList.add("is-fade");
        }
      };
      proto.onDeactivateFade = function() {
        if (!this.options.fade) return;
        this.element.classList.remove("is-fade");
        this.slides.forEach((slide2) => {
          slide2.setOpacity("");
        });
      };
      let positionSlider = proto.positionSlider;
      proto.positionSlider = function() {
        if (!this.options.fade) {
          positionSlider.apply(this, arguments);
          return;
        }
        this.fadeSlides();
        this.dispatchScrollEvent();
      };
      let positionSliderAtSelected = proto.positionSliderAtSelected;
      proto.positionSliderAtSelected = function() {
        if (this.options.fade) {
          this.setTranslateX(0);
        }
        positionSliderAtSelected.apply(this, arguments);
      };
      proto.fadeSlides = function() {
        if (this.slides.length < 2) return;
        let indexes = this.getFadeIndexes();
        let fadeSlideA = this.slides[indexes.a];
        let fadeSlideB = this.slides[indexes.b];
        let distance = this.wrapDifference(fadeSlideA.target, fadeSlideB.target);
        let progress = this.wrapDifference(fadeSlideA.target, -this.x);
        progress /= distance;
        fadeSlideA.setOpacity(1 - progress);
        fadeSlideB.setOpacity(progress);
        let fadeHideIndex = indexes.a;
        if (this.isDragging) {
          fadeHideIndex = progress > 0.5 ? indexes.a : indexes.b;
        }
        let isNewHideIndex = this.fadeHideIndex !== void 0 && this.fadeHideIndex !== fadeHideIndex && this.fadeHideIndex !== indexes.a && this.fadeHideIndex !== indexes.b;
        if (isNewHideIndex) {
          this.slides[this.fadeHideIndex].setOpacity(0);
        }
        this.fadeHideIndex = fadeHideIndex;
      };
      proto.getFadeIndexes = function() {
        if (!this.isDragging && !this.didDragEnd) {
          return {
            a: this.fadeIndex,
            b: this.selectedIndex
          };
        }
        if (this.options.wrapAround) {
          return this.getFadeDragWrapIndexes();
        } else {
          return this.getFadeDragLimitIndexes();
        }
      };
      proto.getFadeDragWrapIndexes = function() {
        let distances = this.slides.map(function(slide2, i2) {
          return this.getSlideDistance(-this.x, i2);
        }, this);
        let absDistances = distances.map(function(distance2) {
          return Math.abs(distance2);
        });
        let minDistance = Math.min(...absDistances);
        let closestIndex = absDistances.indexOf(minDistance);
        let distance = distances[closestIndex];
        let len = this.slides.length;
        let delta = distance >= 0 ? 1 : -1;
        return {
          a: closestIndex,
          b: utils2.modulo(closestIndex + delta, len)
        };
      };
      proto.getFadeDragLimitIndexes = function() {
        let dragIndex = 0;
        for (let i2 = 0; i2 < this.slides.length - 1; i2++) {
          let slide2 = this.slides[i2];
          if (-this.x < slide2.target) {
            break;
          }
          dragIndex = i2;
        }
        return {
          a: dragIndex,
          b: dragIndex + 1
        };
      };
      proto.wrapDifference = function(a2, b) {
        let diff = b - a2;
        if (!this.options.wrapAround) return diff;
        let diffPlus = diff + this.slideableWidth;
        let diffMinus = diff - this.slideableWidth;
        if (Math.abs(diffPlus) < Math.abs(diff)) {
          diff = diffPlus;
        }
        if (Math.abs(diffMinus) < Math.abs(diff)) {
          diff = diffMinus;
        }
        return diff;
      };
      let _updateWrapShiftCells = proto._updateWrapShiftCells;
      proto._updateWrapShiftCells = function() {
        if (this.options.fade) {
          this.isWrapping = this.getIsWrapping();
        } else {
          _updateWrapShiftCells.apply(this, arguments);
        }
      };
      let shiftWrapCells = proto.shiftWrapCells;
      proto.shiftWrapCells = function() {
        if (!this.options.fade) {
          shiftWrapCells.apply(this, arguments);
        }
      };
      return Flickity2;
    });
  })(flickityFade);
  var flickityFadeExports = flickityFade.exports;
  const FlickityFade = /* @__PURE__ */ getDefaultExportFromCjs(flickityFadeExports);
  var scrollLock = { exports: {} };
  (function(module, exports) {
    (function webpackUniversalModuleDefinition(root, factory2) {
      module.exports = factory2();
    })(commonjsGlobal, function() {
      return (
        /******/
        function(modules) {
          var installedModules = {};
          function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
              return installedModules[moduleId].exports;
            }
            var module2 = installedModules[moduleId] = {
              /******/
              i: moduleId,
              /******/
              l: false,
              /******/
              exports: {}
              /******/
            };
            modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
            module2.l = true;
            return module2.exports;
          }
          __webpack_require__.m = modules;
          __webpack_require__.c = installedModules;
          __webpack_require__.d = function(exports2, name, getter) {
            if (!__webpack_require__.o(exports2, name)) {
              Object.defineProperty(exports2, name, { enumerable: true, get: getter });
            }
          };
          __webpack_require__.r = function(exports2) {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
              Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
            }
            Object.defineProperty(exports2, "__esModule", { value: true });
          };
          __webpack_require__.t = function(value, mode) {
            if (mode & 1) value = __webpack_require__(value);
            if (mode & 8) return value;
            if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
            var ns = /* @__PURE__ */ Object.create(null);
            __webpack_require__.r(ns);
            Object.defineProperty(ns, "default", { enumerable: true, value });
            if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, (function(key2) {
              return value[key2];
            }).bind(null, key));
            return ns;
          };
          __webpack_require__.n = function(module2) {
            var getter = module2 && module2.__esModule ? (
              /******/
              function getDefault() {
                return module2["default"];
              }
            ) : (
              /******/
              function getModuleExports() {
                return module2;
              }
            );
            __webpack_require__.d(getter, "a", getter);
            return getter;
          };
          __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
          };
          __webpack_require__.p = "";
          return __webpack_require__(__webpack_require__.s = 0);
        }([
          /* 0 */
          /***/
          function(module2, __webpack_exports__, __webpack_require__) {
            __webpack_require__.r(__webpack_exports__);
            var argumentAsArray = function argumentAsArray2(argument) {
              return Array.isArray(argument) ? argument : [argument];
            };
            var isElement = function isElement2(target) {
              return target instanceof Node;
            };
            var isElementList = function isElementList2(nodeList) {
              return nodeList instanceof NodeList;
            };
            var eachNode = function eachNode2(nodeList, callback) {
              if (nodeList && callback) {
                nodeList = isElementList(nodeList) ? nodeList : [nodeList];
                for (var i2 = 0; i2 < nodeList.length; i2++) {
                  if (callback(nodeList[i2], i2, nodeList.length) === true) {
                    break;
                  }
                }
              }
            };
            var throwError = function throwError2(message) {
              return console.error("[scroll-lock] ".concat(message));
            };
            var arrayAsSelector = function arrayAsSelector2(array) {
              if (Array.isArray(array)) {
                var selector = array.join(", ");
                return selector;
              }
            };
            var nodeListAsArray = function nodeListAsArray2(nodeList) {
              var nodes = [];
              eachNode(nodeList, function(node) {
                return nodes.push(node);
              });
              return nodes;
            };
            var findParentBySelector = function findParentBySelector2($el, selector) {
              var self2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
              var $root = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : document;
              if (self2 && nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) !== -1) {
                return $el;
              }
              while (($el = $el.parentElement) && nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) === -1) {
              }
              return $el;
            };
            var elementHasSelector = function elementHasSelector2($el, selector) {
              var $root = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : document;
              var has2 = nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) !== -1;
              return has2;
            };
            var elementHasOverflowHidden = function elementHasOverflowHidden2($el) {
              if ($el) {
                var computedStyle = getComputedStyle($el);
                var overflowIsHidden = computedStyle.overflow === "hidden";
                return overflowIsHidden;
              }
            };
            var elementScrollTopOnStart = function elementScrollTopOnStart2($el) {
              if ($el) {
                if (elementHasOverflowHidden($el)) {
                  return true;
                }
                var scrollTop = $el.scrollTop;
                return scrollTop <= 0;
              }
            };
            var elementScrollTopOnEnd = function elementScrollTopOnEnd2($el) {
              if ($el) {
                if (elementHasOverflowHidden($el)) {
                  return true;
                }
                var scrollTop = $el.scrollTop;
                var scrollHeight = $el.scrollHeight;
                var scrollTopWithHeight = scrollTop + $el.offsetHeight;
                return scrollTopWithHeight >= scrollHeight;
              }
            };
            var elementScrollLeftOnStart = function elementScrollLeftOnStart2($el) {
              if ($el) {
                if (elementHasOverflowHidden($el)) {
                  return true;
                }
                var scrollLeft = $el.scrollLeft;
                return scrollLeft <= 0;
              }
            };
            var elementScrollLeftOnEnd = function elementScrollLeftOnEnd2($el) {
              if ($el) {
                if (elementHasOverflowHidden($el)) {
                  return true;
                }
                var scrollLeft = $el.scrollLeft;
                var scrollWidth = $el.scrollWidth;
                var scrollLeftWithWidth = scrollLeft + $el.offsetWidth;
                return scrollLeftWithWidth >= scrollWidth;
              }
            };
            var elementIsScrollableField = function elementIsScrollableField2($el) {
              var selector = 'textarea, [contenteditable="true"]';
              return elementHasSelector($el, selector);
            };
            var elementIsInputRange = function elementIsInputRange2($el) {
              var selector = 'input[type="range"]';
              return elementHasSelector($el, selector);
            };
            __webpack_require__.d(__webpack_exports__, "disablePageScroll", function() {
              return disablePageScroll;
            });
            __webpack_require__.d(__webpack_exports__, "enablePageScroll", function() {
              return enablePageScroll;
            });
            __webpack_require__.d(__webpack_exports__, "getScrollState", function() {
              return getScrollState;
            });
            __webpack_require__.d(__webpack_exports__, "clearQueueScrollLocks", function() {
              return clearQueueScrollLocks;
            });
            __webpack_require__.d(__webpack_exports__, "getTargetScrollBarWidth", function() {
              return scroll_lock_getTargetScrollBarWidth;
            });
            __webpack_require__.d(__webpack_exports__, "getCurrentTargetScrollBarWidth", function() {
              return scroll_lock_getCurrentTargetScrollBarWidth;
            });
            __webpack_require__.d(__webpack_exports__, "getPageScrollBarWidth", function() {
              return getPageScrollBarWidth;
            });
            __webpack_require__.d(__webpack_exports__, "getCurrentPageScrollBarWidth", function() {
              return getCurrentPageScrollBarWidth;
            });
            __webpack_require__.d(__webpack_exports__, "addScrollableTarget", function() {
              return scroll_lock_addScrollableTarget;
            });
            __webpack_require__.d(__webpack_exports__, "removeScrollableTarget", function() {
              return scroll_lock_removeScrollableTarget;
            });
            __webpack_require__.d(__webpack_exports__, "addScrollableSelector", function() {
              return scroll_lock_addScrollableSelector;
            });
            __webpack_require__.d(__webpack_exports__, "removeScrollableSelector", function() {
              return scroll_lock_removeScrollableSelector;
            });
            __webpack_require__.d(__webpack_exports__, "addLockableTarget", function() {
              return scroll_lock_addLockableTarget;
            });
            __webpack_require__.d(__webpack_exports__, "addLockableSelector", function() {
              return scroll_lock_addLockableSelector;
            });
            __webpack_require__.d(__webpack_exports__, "setFillGapMethod", function() {
              return scroll_lock_setFillGapMethod;
            });
            __webpack_require__.d(__webpack_exports__, "addFillGapTarget", function() {
              return scroll_lock_addFillGapTarget;
            });
            __webpack_require__.d(__webpack_exports__, "removeFillGapTarget", function() {
              return scroll_lock_removeFillGapTarget;
            });
            __webpack_require__.d(__webpack_exports__, "addFillGapSelector", function() {
              return scroll_lock_addFillGapSelector;
            });
            __webpack_require__.d(__webpack_exports__, "removeFillGapSelector", function() {
              return scroll_lock_removeFillGapSelector;
            });
            __webpack_require__.d(__webpack_exports__, "refillGaps", function() {
              return refillGaps;
            });
            function _objectSpread(target) {
              for (var i2 = 1; i2 < arguments.length; i2++) {
                var source = arguments[i2] != null ? arguments[i2] : {};
                var ownKeys2 = Object.keys(source);
                if (typeof Object.getOwnPropertySymbols === "function") {
                  ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                  }));
                }
                ownKeys2.forEach(function(key) {
                  _defineProperty(target, key, source[key]);
                });
              }
              return target;
            }
            function _defineProperty(obj, key, value) {
              if (key in obj) {
                Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
              } else {
                obj[key] = value;
              }
              return obj;
            }
            var FILL_GAP_AVAILABLE_METHODS = ["padding", "margin", "width", "max-width", "none"];
            var TOUCH_DIRECTION_DETECT_OFFSET = 3;
            var state = {
              scroll: true,
              queue: 0,
              scrollableSelectors: ["[data-scroll-lock-scrollable]"],
              lockableSelectors: ["body", "[data-scroll-lock-lockable]"],
              fillGapSelectors: ["body", "[data-scroll-lock-fill-gap]", "[data-scroll-lock-lockable]"],
              fillGapMethod: FILL_GAP_AVAILABLE_METHODS[0],
              //
              startTouchY: 0,
              startTouchX: 0
            };
            var disablePageScroll = function disablePageScroll2(target) {
              if (state.queue <= 0) {
                state.scroll = false;
                scroll_lock_hideLockableOverflow();
                fillGaps();
              }
              scroll_lock_addScrollableTarget(target);
              state.queue++;
            };
            var enablePageScroll = function enablePageScroll2(target) {
              state.queue > 0 && state.queue--;
              if (state.queue <= 0) {
                state.scroll = true;
                scroll_lock_showLockableOverflow();
                unfillGaps();
              }
              scroll_lock_removeScrollableTarget(target);
            };
            var getScrollState = function getScrollState2() {
              return state.scroll;
            };
            var clearQueueScrollLocks = function clearQueueScrollLocks2() {
              state.queue = 0;
            };
            var scroll_lock_getTargetScrollBarWidth = function getTargetScrollBarWidth($target) {
              var onlyExists = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
              if (isElement($target)) {
                var currentOverflowYProperty = $target.style.overflowY;
                if (onlyExists) {
                  if (!getScrollState()) {
                    $target.style.overflowY = $target.getAttribute("data-scroll-lock-saved-overflow-y-property");
                  }
                } else {
                  $target.style.overflowY = "scroll";
                }
                var width = scroll_lock_getCurrentTargetScrollBarWidth($target);
                $target.style.overflowY = currentOverflowYProperty;
                return width;
              } else {
                return 0;
              }
            };
            var scroll_lock_getCurrentTargetScrollBarWidth = function getCurrentTargetScrollBarWidth($target) {
              if (isElement($target)) {
                if ($target === document.body) {
                  var documentWidth = document.documentElement.clientWidth;
                  var windowWidth = window.innerWidth;
                  var currentWidth = windowWidth - documentWidth;
                  return currentWidth;
                } else {
                  var borderLeftWidthCurrentProperty = $target.style.borderLeftWidth;
                  var borderRightWidthCurrentProperty = $target.style.borderRightWidth;
                  $target.style.borderLeftWidth = "0px";
                  $target.style.borderRightWidth = "0px";
                  var _currentWidth = $target.offsetWidth - $target.clientWidth;
                  $target.style.borderLeftWidth = borderLeftWidthCurrentProperty;
                  $target.style.borderRightWidth = borderRightWidthCurrentProperty;
                  return _currentWidth;
                }
              } else {
                return 0;
              }
            };
            var getPageScrollBarWidth = function getPageScrollBarWidth2() {
              var onlyExists = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
              return scroll_lock_getTargetScrollBarWidth(document.body, onlyExists);
            };
            var getCurrentPageScrollBarWidth = function getCurrentPageScrollBarWidth2() {
              return scroll_lock_getCurrentTargetScrollBarWidth(document.body);
            };
            var scroll_lock_addScrollableTarget = function addScrollableTarget(target) {
              if (target) {
                var targets = argumentAsArray(target);
                targets.map(function($targets) {
                  eachNode($targets, function($target) {
                    if (isElement($target)) {
                      $target.setAttribute("data-scroll-lock-scrollable", "");
                    } else {
                      throwError('"'.concat($target, '" is not a Element.'));
                    }
                  });
                });
              }
            };
            var scroll_lock_removeScrollableTarget = function removeScrollableTarget(target) {
              if (target) {
                var targets = argumentAsArray(target);
                targets.map(function($targets) {
                  eachNode($targets, function($target) {
                    if (isElement($target)) {
                      $target.removeAttribute("data-scroll-lock-scrollable");
                    } else {
                      throwError('"'.concat($target, '" is not a Element.'));
                    }
                  });
                });
              }
            };
            var scroll_lock_addScrollableSelector = function addScrollableSelector(selector) {
              if (selector) {
                var selectors2 = argumentAsArray(selector);
                selectors2.map(function(selector2) {
                  state.scrollableSelectors.push(selector2);
                });
              }
            };
            var scroll_lock_removeScrollableSelector = function removeScrollableSelector(selector) {
              if (selector) {
                var selectors2 = argumentAsArray(selector);
                selectors2.map(function(selector2) {
                  state.scrollableSelectors = state.scrollableSelectors.filter(function(sSelector) {
                    return sSelector !== selector2;
                  });
                });
              }
            };
            var scroll_lock_addLockableTarget = function addLockableTarget(target) {
              if (target) {
                var targets = argumentAsArray(target);
                targets.map(function($targets) {
                  eachNode($targets, function($target) {
                    if (isElement($target)) {
                      $target.setAttribute("data-scroll-lock-lockable", "");
                    } else {
                      throwError('"'.concat($target, '" is not a Element.'));
                    }
                  });
                });
                if (!getScrollState()) {
                  scroll_lock_hideLockableOverflow();
                }
              }
            };
            var scroll_lock_addLockableSelector = function addLockableSelector(selector) {
              if (selector) {
                var selectors2 = argumentAsArray(selector);
                selectors2.map(function(selector2) {
                  state.lockableSelectors.push(selector2);
                });
                if (!getScrollState()) {
                  scroll_lock_hideLockableOverflow();
                }
                scroll_lock_addFillGapSelector(selector);
              }
            };
            var scroll_lock_setFillGapMethod = function setFillGapMethod(method) {
              if (method) {
                if (FILL_GAP_AVAILABLE_METHODS.indexOf(method) !== -1) {
                  state.fillGapMethod = method;
                  refillGaps();
                } else {
                  var methods = FILL_GAP_AVAILABLE_METHODS.join(", ");
                  throwError('"'.concat(method, '" method is not available!\nAvailable fill gap methods: ').concat(methods, "."));
                }
              }
            };
            var scroll_lock_addFillGapTarget = function addFillGapTarget(target) {
              if (target) {
                var targets = argumentAsArray(target);
                targets.map(function($targets) {
                  eachNode($targets, function($target) {
                    if (isElement($target)) {
                      $target.setAttribute("data-scroll-lock-fill-gap", "");
                      if (!state.scroll) {
                        scroll_lock_fillGapTarget($target);
                      }
                    } else {
                      throwError('"'.concat($target, '" is not a Element.'));
                    }
                  });
                });
              }
            };
            var scroll_lock_removeFillGapTarget = function removeFillGapTarget(target) {
              if (target) {
                var targets = argumentAsArray(target);
                targets.map(function($targets) {
                  eachNode($targets, function($target) {
                    if (isElement($target)) {
                      $target.removeAttribute("data-scroll-lock-fill-gap");
                      if (!state.scroll) {
                        scroll_lock_unfillGapTarget($target);
                      }
                    } else {
                      throwError('"'.concat($target, '" is not a Element.'));
                    }
                  });
                });
              }
            };
            var scroll_lock_addFillGapSelector = function addFillGapSelector(selector) {
              if (selector) {
                var selectors2 = argumentAsArray(selector);
                selectors2.map(function(selector2) {
                  if (state.fillGapSelectors.indexOf(selector2) === -1) {
                    state.fillGapSelectors.push(selector2);
                    if (!state.scroll) {
                      scroll_lock_fillGapSelector(selector2);
                    }
                  }
                });
              }
            };
            var scroll_lock_removeFillGapSelector = function removeFillGapSelector(selector) {
              if (selector) {
                var selectors2 = argumentAsArray(selector);
                selectors2.map(function(selector2) {
                  state.fillGapSelectors = state.fillGapSelectors.filter(function(fSelector) {
                    return fSelector !== selector2;
                  });
                  if (!state.scroll) {
                    scroll_lock_unfillGapSelector(selector2);
                  }
                });
              }
            };
            var refillGaps = function refillGaps2() {
              if (!state.scroll) {
                fillGaps();
              }
            };
            var scroll_lock_hideLockableOverflow = function hideLockableOverflow() {
              var selector = arrayAsSelector(state.lockableSelectors);
              scroll_lock_hideLockableOverflowSelector(selector);
            };
            var scroll_lock_showLockableOverflow = function showLockableOverflow() {
              var selector = arrayAsSelector(state.lockableSelectors);
              scroll_lock_showLockableOverflowSelector(selector);
            };
            var scroll_lock_hideLockableOverflowSelector = function hideLockableOverflowSelector(selector) {
              var $targets = document.querySelectorAll(selector);
              eachNode($targets, function($target) {
                scroll_lock_hideLockableOverflowTarget($target);
              });
            };
            var scroll_lock_showLockableOverflowSelector = function showLockableOverflowSelector(selector) {
              var $targets = document.querySelectorAll(selector);
              eachNode($targets, function($target) {
                scroll_lock_showLockableOverflowTarget($target);
              });
            };
            var scroll_lock_hideLockableOverflowTarget = function hideLockableOverflowTarget($target) {
              if (isElement($target) && $target.getAttribute("data-scroll-lock-locked") !== "true") {
                var computedStyle = window.getComputedStyle($target);
                $target.setAttribute("data-scroll-lock-saved-overflow-y-property", computedStyle.overflowY);
                $target.setAttribute("data-scroll-lock-saved-inline-overflow-property", $target.style.overflow);
                $target.setAttribute("data-scroll-lock-saved-inline-overflow-y-property", $target.style.overflowY);
                $target.style.overflow = "hidden";
                $target.setAttribute("data-scroll-lock-locked", "true");
              }
            };
            var scroll_lock_showLockableOverflowTarget = function showLockableOverflowTarget($target) {
              if (isElement($target) && $target.getAttribute("data-scroll-lock-locked") === "true") {
                $target.style.overflow = $target.getAttribute("data-scroll-lock-saved-inline-overflow-property");
                $target.style.overflowY = $target.getAttribute("data-scroll-lock-saved-inline-overflow-y-property");
                $target.removeAttribute("data-scroll-lock-saved-overflow-property");
                $target.removeAttribute("data-scroll-lock-saved-inline-overflow-property");
                $target.removeAttribute("data-scroll-lock-saved-inline-overflow-y-property");
                $target.removeAttribute("data-scroll-lock-locked");
              }
            };
            var fillGaps = function fillGaps2() {
              state.fillGapSelectors.map(function(selector) {
                scroll_lock_fillGapSelector(selector);
              });
            };
            var unfillGaps = function unfillGaps2() {
              state.fillGapSelectors.map(function(selector) {
                scroll_lock_unfillGapSelector(selector);
              });
            };
            var scroll_lock_fillGapSelector = function fillGapSelector(selector) {
              var $targets = document.querySelectorAll(selector);
              var isLockable = state.lockableSelectors.indexOf(selector) !== -1;
              eachNode($targets, function($target) {
                scroll_lock_fillGapTarget($target, isLockable);
              });
            };
            var scroll_lock_fillGapTarget = function fillGapTarget($target) {
              var isLockable = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
              if (isElement($target)) {
                var scrollBarWidth;
                if ($target.getAttribute("data-scroll-lock-lockable") === "" || isLockable) {
                  scrollBarWidth = scroll_lock_getTargetScrollBarWidth($target, true);
                } else {
                  var $lockableParent = findParentBySelector($target, arrayAsSelector(state.lockableSelectors));
                  scrollBarWidth = scroll_lock_getTargetScrollBarWidth($lockableParent, true);
                }
                if ($target.getAttribute("data-scroll-lock-filled-gap") === "true") {
                  scroll_lock_unfillGapTarget($target);
                }
                var computedStyle = window.getComputedStyle($target);
                $target.setAttribute("data-scroll-lock-filled-gap", "true");
                $target.setAttribute("data-scroll-lock-current-fill-gap-method", state.fillGapMethod);
                if (state.fillGapMethod === "margin") {
                  var currentMargin = parseFloat(computedStyle.marginRight);
                  $target.style.marginRight = "".concat(currentMargin + scrollBarWidth, "px");
                } else if (state.fillGapMethod === "width") {
                  $target.style.width = "calc(100% - ".concat(scrollBarWidth, "px)");
                } else if (state.fillGapMethod === "max-width") {
                  $target.style.maxWidth = "calc(100% - ".concat(scrollBarWidth, "px)");
                } else if (state.fillGapMethod === "padding") {
                  var currentPadding = parseFloat(computedStyle.paddingRight);
                  $target.style.paddingRight = "".concat(currentPadding + scrollBarWidth, "px");
                }
              }
            };
            var scroll_lock_unfillGapSelector = function unfillGapSelector(selector) {
              var $targets = document.querySelectorAll(selector);
              eachNode($targets, function($target) {
                scroll_lock_unfillGapTarget($target);
              });
            };
            var scroll_lock_unfillGapTarget = function unfillGapTarget($target) {
              if (isElement($target)) {
                if ($target.getAttribute("data-scroll-lock-filled-gap") === "true") {
                  var currentFillGapMethod = $target.getAttribute("data-scroll-lock-current-fill-gap-method");
                  $target.removeAttribute("data-scroll-lock-filled-gap");
                  $target.removeAttribute("data-scroll-lock-current-fill-gap-method");
                  if (currentFillGapMethod === "margin") {
                    $target.style.marginRight = "";
                  } else if (currentFillGapMethod === "width") {
                    $target.style.width = "";
                  } else if (currentFillGapMethod === "max-width") {
                    $target.style.maxWidth = "";
                  } else if (currentFillGapMethod === "padding") {
                    $target.style.paddingRight = "";
                  }
                }
              }
            };
            var onResize = function onResize2(e2) {
              refillGaps();
            };
            var onTouchStart = function onTouchStart2(e2) {
              if (!state.scroll) {
                state.startTouchY = e2.touches[0].clientY;
                state.startTouchX = e2.touches[0].clientX;
              }
            };
            var scroll_lock_onTouchMove = function onTouchMove(e2) {
              if (!state.scroll) {
                var startTouchY = state.startTouchY, startTouchX = state.startTouchX;
                var currentClientY = e2.touches[0].clientY;
                var currentClientX = e2.touches[0].clientX;
                if (e2.touches.length < 2) {
                  var selector = arrayAsSelector(state.scrollableSelectors);
                  var direction = {
                    up: startTouchY < currentClientY,
                    down: startTouchY > currentClientY,
                    left: startTouchX < currentClientX,
                    right: startTouchX > currentClientX
                  };
                  var directionWithOffset = {
                    up: startTouchY + TOUCH_DIRECTION_DETECT_OFFSET < currentClientY,
                    down: startTouchY - TOUCH_DIRECTION_DETECT_OFFSET > currentClientY,
                    left: startTouchX + TOUCH_DIRECTION_DETECT_OFFSET < currentClientX,
                    right: startTouchX - TOUCH_DIRECTION_DETECT_OFFSET > currentClientX
                  };
                  var handle = function handle2($el) {
                    var skip = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                    if ($el) {
                      var parentScrollableEl = findParentBySelector($el, selector, false);
                      if (elementIsInputRange($el)) {
                        return false;
                      }
                      if (skip || elementIsScrollableField($el) && findParentBySelector($el, selector) || elementHasSelector($el, selector)) {
                        var prevent = false;
                        if (elementScrollLeftOnStart($el) && elementScrollLeftOnEnd($el)) {
                          if (direction.up && elementScrollTopOnStart($el) || direction.down && elementScrollTopOnEnd($el)) {
                            prevent = true;
                          }
                        } else if (elementScrollTopOnStart($el) && elementScrollTopOnEnd($el)) {
                          if (direction.left && elementScrollLeftOnStart($el) || direction.right && elementScrollLeftOnEnd($el)) {
                            prevent = true;
                          }
                        } else if (directionWithOffset.up && elementScrollTopOnStart($el) || directionWithOffset.down && elementScrollTopOnEnd($el) || directionWithOffset.left && elementScrollLeftOnStart($el) || directionWithOffset.right && elementScrollLeftOnEnd($el)) {
                          prevent = true;
                        }
                        if (prevent) {
                          if (parentScrollableEl) {
                            handle2(parentScrollableEl, true);
                          } else {
                            if (e2.cancelable) {
                              e2.preventDefault();
                            }
                          }
                        }
                      } else {
                        handle2(parentScrollableEl);
                      }
                    } else {
                      if (e2.cancelable) {
                        e2.preventDefault();
                      }
                    }
                  };
                  handle(e2.target);
                }
              }
            };
            var onTouchEnd = function onTouchEnd2(e2) {
              if (!state.scroll) {
                state.startTouchY = 0;
                state.startTouchX = 0;
              }
            };
            if (typeof window !== "undefined") {
              window.addEventListener("resize", onResize);
            }
            if (typeof document !== "undefined") {
              document.addEventListener("touchstart", onTouchStart);
              document.addEventListener("touchmove", scroll_lock_onTouchMove, {
                passive: false
              });
              document.addEventListener("touchend", onTouchEnd);
            }
            var deprecatedMethods = {
              hide: function hide(target) {
                throwError('"hide" is deprecated! Use "disablePageScroll" instead. \n https://github.com/FL3NKEY/scroll-lock#disablepagescrollscrollabletarget');
                disablePageScroll(target);
              },
              show: function show(target) {
                throwError('"show" is deprecated! Use "enablePageScroll" instead. \n https://github.com/FL3NKEY/scroll-lock#enablepagescrollscrollabletarget');
                enablePageScroll(target);
              },
              toggle: function toggle2(target) {
                throwError('"toggle" is deprecated! Do not use it.');
                if (getScrollState()) {
                  disablePageScroll();
                } else {
                  enablePageScroll(target);
                }
              },
              getState: function getState() {
                throwError('"getState" is deprecated! Use "getScrollState" instead. \n https://github.com/FL3NKEY/scroll-lock#getscrollstate');
                return getScrollState();
              },
              getWidth: function getWidth() {
                throwError('"getWidth" is deprecated! Use "getPageScrollBarWidth" instead. \n https://github.com/FL3NKEY/scroll-lock#getpagescrollbarwidth');
                return getPageScrollBarWidth();
              },
              getCurrentWidth: function getCurrentWidth() {
                throwError('"getCurrentWidth" is deprecated! Use "getCurrentPageScrollBarWidth" instead. \n https://github.com/FL3NKEY/scroll-lock#getcurrentpagescrollbarwidth');
                return getCurrentPageScrollBarWidth();
              },
              setScrollableTargets: function setScrollableTargets(target) {
                throwError('"setScrollableTargets" is deprecated! Use "addScrollableTarget" instead. \n https://github.com/FL3NKEY/scroll-lock#addscrollabletargetscrollabletarget');
                scroll_lock_addScrollableTarget(target);
              },
              setFillGapSelectors: function setFillGapSelectors(selector) {
                throwError('"setFillGapSelectors" is deprecated! Use "addFillGapSelector" instead. \n https://github.com/FL3NKEY/scroll-lock#addfillgapselectorfillgapselector');
                scroll_lock_addFillGapSelector(selector);
              },
              setFillGapTargets: function setFillGapTargets(target) {
                throwError('"setFillGapTargets" is deprecated! Use "addFillGapTarget" instead. \n https://github.com/FL3NKEY/scroll-lock#addfillgaptargetfillgaptarget');
                scroll_lock_addFillGapTarget(target);
              },
              clearQueue: function clearQueue() {
                throwError('"clearQueue" is deprecated! Use "clearQueueScrollLocks" instead. \n https://github.com/FL3NKEY/scroll-lock#clearqueuescrolllocks');
                clearQueueScrollLocks();
              }
            };
            var scrollLock2 = _objectSpread({
              disablePageScroll,
              enablePageScroll,
              getScrollState,
              clearQueueScrollLocks,
              getTargetScrollBarWidth: scroll_lock_getTargetScrollBarWidth,
              getCurrentTargetScrollBarWidth: scroll_lock_getCurrentTargetScrollBarWidth,
              getPageScrollBarWidth,
              getCurrentPageScrollBarWidth,
              addScrollableSelector: scroll_lock_addScrollableSelector,
              removeScrollableSelector: scroll_lock_removeScrollableSelector,
              addScrollableTarget: scroll_lock_addScrollableTarget,
              removeScrollableTarget: scroll_lock_removeScrollableTarget,
              addLockableSelector: scroll_lock_addLockableSelector,
              addLockableTarget: scroll_lock_addLockableTarget,
              addFillGapSelector: scroll_lock_addFillGapSelector,
              removeFillGapSelector: scroll_lock_removeFillGapSelector,
              addFillGapTarget: scroll_lock_addFillGapTarget,
              removeFillGapTarget: scroll_lock_removeFillGapTarget,
              setFillGapMethod: scroll_lock_setFillGapMethod,
              refillGaps,
              _state: state
            }, deprecatedMethods);
            __webpack_exports__["default"] = scrollLock2;
          }
          /******/
        ])["default"]
      );
    });
  })(scrollLock);
  var scrollLockExports = scrollLock.exports;
  const ScrollLock = /* @__PURE__ */ getDefaultExportFromCjs(scrollLockExports);
  var jsExports = requireJs();
  const Flickity = /* @__PURE__ */ getDefaultExportFromCjs(jsExports);
  function e(e2, t2) {
    for (var o2 = 0; o2 < t2.length; o2++) {
      var n2 = t2[o2];
      n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e2, n2.key, n2);
    }
  }
  function t(e2) {
    return function(e3) {
      if (Array.isArray(e3)) return o(e3);
    }(e2) || function(e3) {
      if ("undefined" != typeof Symbol && Symbol.iterator in Object(e3)) return Array.from(e3);
    }(e2) || function(e3, t2) {
      if (!e3) return;
      if ("string" == typeof e3) return o(e3, t2);
      var n2 = Object.prototype.toString.call(e3).slice(8, -1);
      "Object" === n2 && e3.constructor && (n2 = e3.constructor.name);
      if ("Map" === n2 || "Set" === n2) return Array.from(e3);
      if ("Arguments" === n2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2)) return o(e3, t2);
    }(e2) || function() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
  }
  function o(e2, t2) {
    (null == t2 || t2 > e2.length) && (t2 = e2.length);
    for (var o2 = 0, n2 = new Array(t2); o2 < t2; o2++) n2[o2] = e2[o2];
    return n2;
  }
  var n, i, a, r, s, l = (n = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'], i = function() {
    function o2(e2) {
      var n2 = e2.targetModal, i3 = e2.triggers, a3 = void 0 === i3 ? [] : i3, r2 = e2.onShow, s2 = void 0 === r2 ? function() {
      } : r2, l2 = e2.onClose, c = void 0 === l2 ? function() {
      } : l2, d = e2.openTrigger, u = void 0 === d ? "data-micromodal-trigger" : d, f = e2.closeTrigger, h = void 0 === f ? "data-micromodal-close" : f, v = e2.openClass, g = void 0 === v ? "is-open" : v, m = e2.disableScroll, b = void 0 !== m && m, y = e2.disableFocus, p = void 0 !== y && y, w = e2.awaitCloseAnimation, E = void 0 !== w && w, k = e2.awaitOpenAnimation, M = void 0 !== k && k, A = e2.debugMode, C = void 0 !== A && A;
      !function(e3, t2) {
        if (!(e3 instanceof t2)) throw new TypeError("Cannot call a class as a function");
      }(this, o2), this.modal = document.getElementById(n2), this.config = { debugMode: C, disableScroll: b, openTrigger: u, closeTrigger: h, openClass: g, onShow: s2, onClose: c, awaitCloseAnimation: E, awaitOpenAnimation: M, disableFocus: p }, a3.length > 0 && this.registerTriggers.apply(this, t(a3)), this.onClick = this.onClick.bind(this), this.onKeydown = this.onKeydown.bind(this);
    }
    var i2, a2;
    return i2 = o2, (a2 = [{ key: "registerTriggers", value: function() {
      for (var e2 = this, t2 = arguments.length, o3 = new Array(t2), n2 = 0; n2 < t2; n2++) o3[n2] = arguments[n2];
      o3.filter(Boolean).forEach(function(t3) {
        t3.addEventListener("click", function(t4) {
          return e2.showModal(t4);
        });
      });
    } }, { key: "showModal", value: function() {
      var e2 = this, t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
      if (this.activeElement = document.activeElement, this.modal.setAttribute("aria-hidden", "false"), this.modal.classList.add(this.config.openClass), this.scrollBehaviour("disable"), this.addEventListeners(), this.config.awaitOpenAnimation) {
        var o3 = function t3() {
          e2.modal.removeEventListener("animationend", t3, false), e2.setFocusToFirstNode();
        };
        this.modal.addEventListener("animationend", o3, false);
      } else this.setFocusToFirstNode();
      this.config.onShow(this.modal, this.activeElement, t2);
    } }, { key: "closeModal", value: function() {
      var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, t2 = this.modal;
      if (this.modal.setAttribute("aria-hidden", "true"), this.removeEventListeners(), this.scrollBehaviour("enable"), this.activeElement && this.activeElement.focus && this.activeElement.focus(), this.config.onClose(this.modal, this.activeElement, e2), this.config.awaitCloseAnimation) {
        var o3 = this.config.openClass;
        this.modal.addEventListener("animationend", function e3() {
          t2.classList.remove(o3), t2.removeEventListener("animationend", e3, false);
        }, false);
      } else t2.classList.remove(this.config.openClass);
    } }, { key: "closeModalById", value: function(e2) {
      this.modal = document.getElementById(e2), this.modal && this.closeModal();
    } }, { key: "scrollBehaviour", value: function(e2) {
      if (this.config.disableScroll) {
        var t2 = document.querySelector("body");
        switch (e2) {
          case "enable":
            Object.assign(t2.style, { overflow: "" });
            break;
          case "disable":
            Object.assign(t2.style, { overflow: "hidden" });
        }
      }
    } }, { key: "addEventListeners", value: function() {
      this.modal.addEventListener("touchstart", this.onClick), this.modal.addEventListener("click", this.onClick), document.addEventListener("keydown", this.onKeydown);
    } }, { key: "removeEventListeners", value: function() {
      this.modal.removeEventListener("touchstart", this.onClick), this.modal.removeEventListener("click", this.onClick), document.removeEventListener("keydown", this.onKeydown);
    } }, { key: "onClick", value: function(e2) {
      (e2.target.hasAttribute(this.config.closeTrigger) || e2.target.parentNode.hasAttribute(this.config.closeTrigger)) && (e2.preventDefault(), e2.stopPropagation(), this.closeModal(e2));
    } }, { key: "onKeydown", value: function(e2) {
      27 === e2.keyCode && this.closeModal(e2), 9 === e2.keyCode && this.retainFocus(e2);
    } }, { key: "getFocusableNodes", value: function() {
      var e2 = this.modal.querySelectorAll(n);
      return Array.apply(void 0, t(e2));
    } }, { key: "setFocusToFirstNode", value: function() {
      var e2 = this;
      if (!this.config.disableFocus) {
        var t2 = this.getFocusableNodes();
        if (0 !== t2.length) {
          var o3 = t2.filter(function(t3) {
            return !t3.hasAttribute(e2.config.closeTrigger);
          });
          o3.length > 0 && o3[0].focus(), 0 === o3.length && t2[0].focus();
        }
      }
    } }, { key: "retainFocus", value: function(e2) {
      var t2 = this.getFocusableNodes();
      if (0 !== t2.length) if (t2 = t2.filter(function(e3) {
        return null !== e3.offsetParent;
      }), this.modal.contains(document.activeElement)) {
        var o3 = t2.indexOf(document.activeElement);
        e2.shiftKey && 0 === o3 && (t2[t2.length - 1].focus(), e2.preventDefault()), !e2.shiftKey && t2.length > 0 && o3 === t2.length - 1 && (t2[0].focus(), e2.preventDefault());
      } else t2[0].focus();
    } }]) && e(i2.prototype, a2), o2;
  }(), a = null, r = function(e2) {
    if (!document.getElementById(e2)) return console.warn("MicroModal: ❗Seems like you have missed %c'".concat(e2, "'"), "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "ID somewhere in your code. Refer example below to resolve it."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<div class="modal" id="'.concat(e2, '"></div>')), false;
  }, s = function(e2, t2) {
    if (function(e3) {
      e3.length <= 0 && (console.warn("MicroModal: ❗Please specify at least one %c'micromodal-trigger'", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "data attribute."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<a href="#" data-micromodal-trigger="my-modal"></a>'));
    }(e2), !t2) return true;
    for (var o2 in t2) r(o2);
    return true;
  }, { init: function(e2) {
    var o2 = Object.assign({}, { openTrigger: "data-micromodal-trigger" }, e2), n2 = t(document.querySelectorAll("[".concat(o2.openTrigger, "]"))), r2 = function(e3, t2) {
      var o3 = [];
      return e3.forEach(function(e4) {
        var n3 = e4.attributes[t2].value;
        void 0 === o3[n3] && (o3[n3] = []), o3[n3].push(e4);
      }), o3;
    }(n2, o2.openTrigger);
    if (true !== o2.debugMode || false !== s(n2, r2)) for (var l2 in r2) {
      var c = r2[l2];
      o2.targetModal = l2, o2.triggers = t(c), a = new i(o2);
    }
  }, show: function(e2, t2) {
    var o2 = t2 || {};
    o2.targetModal = e2, true === o2.debugMode && false === r(e2) || (a && a.removeEventListeners(), (a = new i(o2)).showModal());
  }, close: function(e2) {
    e2 ? a.closeModalById(e2) : a.closeModal();
  } });
  "undefined" != typeof window && (window.MicroModal = l);
  var rellax = { exports: {} };
  (function(module) {
    (function(root, factory2) {
      if (module.exports) {
        module.exports = factory2();
      } else {
        root.Rellax = factory2();
      }
    })(typeof window !== "undefined" ? window : commonjsGlobal, function() {
      var Rellax2 = function(el, options) {
        var self2 = Object.create(Rellax2.prototype);
        var posY = 0;
        var screenY = 0;
        var posX = 0;
        var screenX = 0;
        var blocks = [];
        var pause = true;
        var loop2 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
          return setTimeout(callback, 1e3 / 60);
        };
        var loopId = null;
        var supportsPassive = false;
        try {
          var opts = Object.defineProperty({}, "passive", {
            get: function() {
              supportsPassive = true;
            }
          });
          window.addEventListener("testPassive", null, opts);
          window.removeEventListener("testPassive", null, opts);
        } catch (e2) {
        }
        var clearLoop = window.cancelAnimationFrame || window.mozCancelAnimationFrame || clearTimeout;
        var transformProp = window.transformProp || function() {
          var testEl = document.createElement("div");
          if (testEl.style.transform === null) {
            var vendors = ["Webkit", "Moz", "ms"];
            for (var vendor in vendors) {
              if (testEl.style[vendors[vendor] + "Transform"] !== void 0) {
                return vendors[vendor] + "Transform";
              }
            }
          }
          return "transform";
        }();
        self2.options = {
          speed: -2,
          verticalSpeed: null,
          horizontalSpeed: null,
          breakpoints: [576, 768, 1201],
          center: false,
          wrapper: null,
          relativeToWrapper: false,
          round: true,
          vertical: true,
          horizontal: false,
          verticalScrollAxis: "y",
          horizontalScrollAxis: "x",
          callback: function() {
          }
        };
        if (options) {
          Object.keys(options).forEach(function(key) {
            self2.options[key] = options[key];
          });
        }
        function validateCustomBreakpoints() {
          if (self2.options.breakpoints.length === 3 && Array.isArray(self2.options.breakpoints)) {
            var isAscending = true;
            var isNumerical = true;
            var lastVal;
            self2.options.breakpoints.forEach(function(i2) {
              if (typeof i2 !== "number") isNumerical = false;
              if (lastVal !== null) {
                if (i2 < lastVal) isAscending = false;
              }
              lastVal = i2;
            });
            if (isAscending && isNumerical) return;
          }
          self2.options.breakpoints = [576, 768, 1201];
          console.warn("Rellax: You must pass an array of 3 numbers in ascending order to the breakpoints option. Defaults reverted");
        }
        if (options && options.breakpoints) {
          validateCustomBreakpoints();
        }
        if (!el) {
          el = ".rellax";
        }
        var elements = typeof el === "string" ? document.querySelectorAll(el) : [el];
        if (elements.length > 0) {
          self2.elems = elements;
        } else {
          console.warn("Rellax: The elements you're trying to select don't exist.");
          return;
        }
        if (self2.options.wrapper) {
          if (!self2.options.wrapper.nodeType) {
            var wrapper = document.querySelector(self2.options.wrapper);
            if (wrapper) {
              self2.options.wrapper = wrapper;
            } else {
              console.warn("Rellax: The wrapper you're trying to use doesn't exist.");
              return;
            }
          }
        }
        var currentBreakpoint;
        var getCurrentBreakpoint = function(w) {
          var bp = self2.options.breakpoints;
          if (w < bp[0]) return "xs";
          if (w >= bp[0] && w < bp[1]) return "sm";
          if (w >= bp[1] && w < bp[2]) return "md";
          return "lg";
        };
        var cacheBlocks = function() {
          for (var i2 = 0; i2 < self2.elems.length; i2++) {
            var block = createBlock(self2.elems[i2]);
            blocks.push(block);
          }
        };
        var init = function() {
          for (var i2 = 0; i2 < blocks.length; i2++) {
            self2.elems[i2].style.cssText = blocks[i2].style;
          }
          blocks = [];
          screenY = window.innerHeight;
          screenX = window.innerWidth;
          currentBreakpoint = getCurrentBreakpoint(screenX);
          setPosition();
          cacheBlocks();
          animate2();
          if (pause) {
            window.addEventListener("resize", init);
            pause = false;
            update();
          }
        };
        var createBlock = function(el2) {
          var dataPercentage = el2.getAttribute("data-rellax-percentage");
          var dataSpeed = el2.getAttribute("data-rellax-speed");
          var dataXsSpeed = el2.getAttribute("data-rellax-xs-speed");
          var dataMobileSpeed = el2.getAttribute("data-rellax-mobile-speed");
          var dataTabletSpeed = el2.getAttribute("data-rellax-tablet-speed");
          var dataDesktopSpeed = el2.getAttribute("data-rellax-desktop-speed");
          var dataVerticalSpeed = el2.getAttribute("data-rellax-vertical-speed");
          var dataHorizontalSpeed = el2.getAttribute("data-rellax-horizontal-speed");
          var dataVericalScrollAxis = el2.getAttribute("data-rellax-vertical-scroll-axis");
          var dataHorizontalScrollAxis = el2.getAttribute("data-rellax-horizontal-scroll-axis");
          var dataZindex = el2.getAttribute("data-rellax-zindex") || 0;
          var dataMin = el2.getAttribute("data-rellax-min");
          var dataMax = el2.getAttribute("data-rellax-max");
          var dataMinX = el2.getAttribute("data-rellax-min-x");
          var dataMaxX = el2.getAttribute("data-rellax-max-x");
          var dataMinY = el2.getAttribute("data-rellax-min-y");
          var dataMaxY = el2.getAttribute("data-rellax-max-y");
          var mapBreakpoints;
          var breakpoints = true;
          if (!dataXsSpeed && !dataMobileSpeed && !dataTabletSpeed && !dataDesktopSpeed) {
            breakpoints = false;
          } else {
            mapBreakpoints = {
              "xs": dataXsSpeed,
              "sm": dataMobileSpeed,
              "md": dataTabletSpeed,
              "lg": dataDesktopSpeed
            };
          }
          var wrapperPosY = self2.options.wrapper ? self2.options.wrapper.scrollTop : window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
          if (self2.options.relativeToWrapper) {
            var scrollPosY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            wrapperPosY = scrollPosY - self2.options.wrapper.offsetTop;
          }
          var posY2 = self2.options.vertical ? dataPercentage || self2.options.center ? wrapperPosY : 0 : 0;
          var posX2 = self2.options.horizontal ? dataPercentage || self2.options.center ? self2.options.wrapper ? self2.options.wrapper.scrollLeft : window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft : 0 : 0;
          var blockTop = posY2 + el2.getBoundingClientRect().top;
          var blockHeight = el2.clientHeight || el2.offsetHeight || el2.scrollHeight;
          var blockLeft = posX2 + el2.getBoundingClientRect().left;
          var blockWidth = el2.clientWidth || el2.offsetWidth || el2.scrollWidth;
          var percentageY = dataPercentage ? dataPercentage : (posY2 - blockTop + screenY) / (blockHeight + screenY);
          var percentageX = dataPercentage ? dataPercentage : (posX2 - blockLeft + screenX) / (blockWidth + screenX);
          if (self2.options.center) {
            percentageX = 0.5;
            percentageY = 0.5;
          }
          var speed = breakpoints && mapBreakpoints[currentBreakpoint] !== null ? Number(mapBreakpoints[currentBreakpoint]) : dataSpeed ? dataSpeed : self2.options.speed;
          var verticalSpeed = dataVerticalSpeed ? dataVerticalSpeed : self2.options.verticalSpeed;
          var horizontalSpeed = dataHorizontalSpeed ? dataHorizontalSpeed : self2.options.horizontalSpeed;
          var verticalScrollAxis = dataVericalScrollAxis ? dataVericalScrollAxis : self2.options.verticalScrollAxis;
          var horizontalScrollAxis = dataHorizontalScrollAxis ? dataHorizontalScrollAxis : self2.options.horizontalScrollAxis;
          var bases = updatePosition(percentageX, percentageY, speed, verticalSpeed, horizontalSpeed);
          var style = el2.style.cssText;
          var transform = "";
          var searchResult = /transform\s*:/i.exec(style);
          if (searchResult) {
            var index = searchResult.index;
            var trimmedStyle = style.slice(index);
            var delimiter = trimmedStyle.indexOf(";");
            if (delimiter) {
              transform = " " + trimmedStyle.slice(11, delimiter).replace(/\s/g, "");
            } else {
              transform = " " + trimmedStyle.slice(11).replace(/\s/g, "");
            }
          }
          return {
            baseX: bases.x,
            baseY: bases.y,
            top: blockTop,
            left: blockLeft,
            height: blockHeight,
            width: blockWidth,
            speed,
            verticalSpeed,
            horizontalSpeed,
            verticalScrollAxis,
            horizontalScrollAxis,
            style,
            transform,
            zindex: dataZindex,
            min: dataMin,
            max: dataMax,
            minX: dataMinX,
            maxX: dataMaxX,
            minY: dataMinY,
            maxY: dataMaxY
          };
        };
        var setPosition = function() {
          var oldY = posY;
          var oldX = posX;
          posY = self2.options.wrapper ? self2.options.wrapper.scrollTop : (document.documentElement || document.body.parentNode || document.body).scrollTop || window.pageYOffset;
          posX = self2.options.wrapper ? self2.options.wrapper.scrollLeft : (document.documentElement || document.body.parentNode || document.body).scrollLeft || window.pageXOffset;
          if (self2.options.relativeToWrapper) {
            var scrollPosY = (document.documentElement || document.body.parentNode || document.body).scrollTop || window.pageYOffset;
            posY = scrollPosY - self2.options.wrapper.offsetTop;
          }
          if (oldY != posY && self2.options.vertical) {
            return true;
          }
          if (oldX != posX && self2.options.horizontal) {
            return true;
          }
          return false;
        };
        var updatePosition = function(percentageX, percentageY, speed, verticalSpeed, horizontalSpeed) {
          var result = {};
          var valueX = (horizontalSpeed ? horizontalSpeed : speed) * (100 * (1 - percentageX));
          var valueY = (verticalSpeed ? verticalSpeed : speed) * (100 * (1 - percentageY));
          result.x = self2.options.round ? Math.round(valueX) : Math.round(valueX * 100) / 100;
          result.y = self2.options.round ? Math.round(valueY) : Math.round(valueY * 100) / 100;
          return result;
        };
        var deferredUpdate = function() {
          window.removeEventListener("resize", deferredUpdate);
          window.removeEventListener("orientationchange", deferredUpdate);
          (self2.options.wrapper ? self2.options.wrapper : window).removeEventListener("scroll", deferredUpdate);
          (self2.options.wrapper ? self2.options.wrapper : document).removeEventListener("touchmove", deferredUpdate);
          loopId = loop2(update);
        };
        var update = function() {
          if (setPosition() && pause === false) {
            animate2();
            loopId = loop2(update);
          } else {
            loopId = null;
            window.addEventListener("resize", deferredUpdate);
            window.addEventListener("orientationchange", deferredUpdate);
            (self2.options.wrapper ? self2.options.wrapper : window).addEventListener("scroll", deferredUpdate, supportsPassive ? { passive: true } : false);
            (self2.options.wrapper ? self2.options.wrapper : document).addEventListener("touchmove", deferredUpdate, supportsPassive ? { passive: true } : false);
          }
        };
        var animate2 = function() {
          var positions;
          for (var i2 = 0; i2 < self2.elems.length; i2++) {
            var verticalScrollAxis = blocks[i2].verticalScrollAxis.toLowerCase();
            var horizontalScrollAxis = blocks[i2].horizontalScrollAxis.toLowerCase();
            var verticalScrollX = verticalScrollAxis.indexOf("x") != -1 ? posY : 0;
            var verticalScrollY = verticalScrollAxis.indexOf("y") != -1 ? posY : 0;
            var horizontalScrollX = horizontalScrollAxis.indexOf("x") != -1 ? posX : 0;
            var horizontalScrollY = horizontalScrollAxis.indexOf("y") != -1 ? posX : 0;
            var percentageY = (verticalScrollY + horizontalScrollY - blocks[i2].top + screenY) / (blocks[i2].height + screenY);
            var percentageX = (verticalScrollX + horizontalScrollX - blocks[i2].left + screenX) / (blocks[i2].width + screenX);
            positions = updatePosition(percentageX, percentageY, blocks[i2].speed, blocks[i2].verticalSpeed, blocks[i2].horizontalSpeed);
            var positionY = positions.y - blocks[i2].baseY;
            var positionX = positions.x - blocks[i2].baseX;
            if (blocks[i2].min !== null) {
              if (self2.options.vertical && !self2.options.horizontal) {
                positionY = positionY <= blocks[i2].min ? blocks[i2].min : positionY;
              }
              if (self2.options.horizontal && !self2.options.vertical) {
                positionX = positionX <= blocks[i2].min ? blocks[i2].min : positionX;
              }
            }
            if (blocks[i2].minY != null) {
              positionY = positionY <= blocks[i2].minY ? blocks[i2].minY : positionY;
            }
            if (blocks[i2].minX != null) {
              positionX = positionX <= blocks[i2].minX ? blocks[i2].minX : positionX;
            }
            if (blocks[i2].max !== null) {
              if (self2.options.vertical && !self2.options.horizontal) {
                positionY = positionY >= blocks[i2].max ? blocks[i2].max : positionY;
              }
              if (self2.options.horizontal && !self2.options.vertical) {
                positionX = positionX >= blocks[i2].max ? blocks[i2].max : positionX;
              }
            }
            if (blocks[i2].maxY != null) {
              positionY = positionY >= blocks[i2].maxY ? blocks[i2].maxY : positionY;
            }
            if (blocks[i2].maxX != null) {
              positionX = positionX >= blocks[i2].maxX ? blocks[i2].maxX : positionX;
            }
            var zindex = blocks[i2].zindex;
            var translate = "translate3d(" + (self2.options.horizontal ? positionX : "0") + "px," + (self2.options.vertical ? positionY : "0") + "px," + zindex + "px) " + blocks[i2].transform;
            self2.elems[i2].style[transformProp] = translate;
          }
          self2.options.callback(positions);
        };
        self2.destroy = function() {
          for (var i2 = 0; i2 < self2.elems.length; i2++) {
            self2.elems[i2].style.cssText = blocks[i2].style;
          }
          if (!pause) {
            window.removeEventListener("resize", init);
            pause = true;
          }
          clearLoop(loopId);
          loopId = null;
        };
        init();
        self2.refresh = init;
        return self2;
      };
      return Rellax2;
    });
  })(rellax);
  var rellaxExports = rellax.exports;
  const Rellax = /* @__PURE__ */ getDefaultExportFromCjs(rellaxExports);
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }
  const { toString } = Object.prototype;
  const { getPrototypeOf } = Object;
  const { iterator, toStringTag } = Symbol;
  const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  const kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  const typeOfTest = (type) => (thing) => typeof thing === type;
  const { isArray } = Array;
  const isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  const isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  const isString = typeOfTest("string");
  const isFunction$1 = typeOfTest("function");
  const isNumber = typeOfTest("number");
  const isObject = (thing) => thing !== null && typeof thing === "object";
  const isBoolean = (thing) => thing === true || thing === false;
  const isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
  };
  const isEmptyObject = (val) => {
    if (!isObject(val) || isBuffer(val)) {
      return false;
    }
    try {
      return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
    } catch (e2) {
      return false;
    }
  };
  const isDate = kindOfTest("Date");
  const isFile = kindOfTest("File");
  const isBlob = kindOfTest("Blob");
  const isFileList = kindOfTest("FileList");
  const isStream = (val) => isObject(val) && isFunction$1(val.pipe);
  const isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction$1(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]"));
  };
  const isURLSearchParams = kindOfTest("URLSearchParams");
  const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i2;
    let l2;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i2 = 0, l2 = obj.length; i2 < l2; i2++) {
        fn.call(null, obj[i2], i2, obj);
      }
    } else {
      if (isBuffer(obj)) {
        return;
      }
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i2 = 0; i2 < len; i2++) {
        key = keys[i2];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    if (isBuffer(obj)) {
      return null;
    }
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i2 = keys.length;
    let _key;
    while (i2-- > 0) {
      _key = keys[i2];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  const _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  const isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless, skipUndefined } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else if (!skipUndefined || !isUndefined(val)) {
        result[targetKey] = val;
      }
    };
    for (let i2 = 0, l2 = arguments.length; i2 < l2; i2++) {
      arguments[i2] && forEach(arguments[i2], assignValue);
    }
    return result;
  }
  const extend = (a2, b, thisArg, { allOwnKeys } = {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction$1(val)) {
        a2[key] = bind(val, thisArg);
      } else {
        a2[key] = val;
      }
    }, { allOwnKeys });
    return a2;
  };
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  const inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
    let props;
    let i2;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i2 = props.length;
      while (i2-- > 0) {
        prop = props[i2];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  const endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  const toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i2 = thing.length;
    if (!isNumber(i2)) return null;
    const arr = new Array(i2);
    while (i2-- > 0) {
      arr[i2] = thing[i2];
    }
    return arr;
  };
  const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[iterator];
    const _iterator = generator.call(obj);
    let result;
    while ((result = _iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  const matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  const isHTMLForm = kindOfTest("HTMLFormElement");
  const toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  const isRegExp = kindOfTest("RegExp");
  const reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction$1(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction$1(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  const noop = () => {
  };
  const toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
  }
  const toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i2) => {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (isBuffer(source)) {
          return source;
        }
        if (!("toJSON" in source)) {
          stack[i2] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i2 + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i2] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  const isAsyncFn = kindOfTest("AsyncFunction");
  const isThenable = (thing) => thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
  const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({ source, data: data2 }) => {
        if (source === _global && data2 === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })("axios@".concat(Math.random()), []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction$1(_global.postMessage)
  );
  const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  const isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);
  const utils$1 = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isEmptyObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction: isFunction$1,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
  };
  function AxiosError$1(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils$1.inherits(AxiosError$1, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils$1.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  const prototype$1 = AxiosError$1.prototype;
  const descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError$1, descriptors);
  Object.defineProperty(prototype$1, "isAxiosError", { value: true });
  AxiosError$1.from = (error2, code, config, request, response, customProps) => {
    const axiosError = Object.create(prototype$1);
    utils$1.toFlatObject(error2, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    const msg = error2 && error2.message ? error2.message : "Error";
    const errCode = code == null && error2 ? error2.code : code;
    AxiosError$1.call(axiosError, msg, errCode, config, request, response);
    if (error2 && axiosError.cause == null) {
      Object.defineProperty(axiosError, "cause", { value: error2, configurable: true });
    }
    axiosError.name = error2 && error2.name || "Error";
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  const httpAdapter = null;
  function isVisitable(thing) {
    return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
  }
  function removeBrackets(key) {
    return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i2) {
      token = removeBrackets(token);
      return !dots && i2 ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils$1.isArray(arr) && !arr.some(isVisitable);
  }
  const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData$1(obj, formData, options) {
    if (!utils$1.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new FormData();
    options = utils$1.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils$1.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
    if (!utils$1.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils$1.isDate(value)) {
        return value.toISOString();
      }
      if (utils$1.isBoolean(value)) {
        return value.toString();
      }
      if (!useBlob && utils$1.isBlob(value)) {
        throw new AxiosError$1("Blob is not supported. Use a Buffer instead.");
      }
      if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils$1.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils$1.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils$1.isUndefined(value)) return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils$1.forEach(value, function each(el, key) {
        const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils$1.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils$1.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  function encode$1(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData$1(params, this, options);
  }
  const prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode;
    if (utils$1.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }
  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  }
  const transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
  const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
  const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
  const platform$1 = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams$1,
      FormData: FormData$1,
      Blob: Blob$1
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };
  const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  const _navigator = typeof navigator === "object" && navigator || void 0;
  const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  const hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  const origin = hasBrowserEnv && window.location.href || "http://localhost";
  const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    hasBrowserEnv,
    hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv,
    navigator: _navigator,
    origin
  }, Symbol.toStringTag, { value: "Module" }));
  const platform = __spreadValues(__spreadValues({}, utils), platform$1);
  function toURLEncodedForm(data2, options) {
    return toFormData$1(data2, new platform.classes.URLSearchParams(), __spreadValues({
      visitor: function(value, key, path, helpers) {
        if (platform.isNode && utils$1.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      }
    }, options));
  }
  function parsePropPath(name) {
    return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i2;
    const len = keys.length;
    let key;
    for (i2 = 0; i2 < len; i2++) {
      key = keys[i2];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];
      if (name === "__proto__") return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils$1.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils$1.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils$1.isObject(target[name])) {
        target[name] = [];
      }
      const result = buildPath(path, value, target[name], index);
      if (result && utils$1.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
      const obj = {};
      utils$1.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$1.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$1.trim(rawValue);
      } catch (e2) {
        if (e2.name !== "SyntaxError") {
          throw e2;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  const defaults = {
    transitional: transitionalDefaults,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function transformRequest(data2, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils$1.isObject(data2);
      if (isObjectPayload && utils$1.isHTMLForm(data2)) {
        data2 = new FormData(data2);
      }
      const isFormData2 = utils$1.isFormData(data2);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data2)) : data2;
      }
      if (utils$1.isArrayBuffer(data2) || utils$1.isBuffer(data2) || utils$1.isStream(data2) || utils$1.isFile(data2) || utils$1.isBlob(data2) || utils$1.isReadableStream(data2)) {
        return data2;
      }
      if (utils$1.isArrayBufferView(data2)) {
        return data2.buffer;
      }
      if (utils$1.isURLSearchParams(data2)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data2.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data2, this.formSerializer).toString();
        }
        if ((isFileList2 = utils$1.isFileList(data2)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData$1(
            isFileList2 ? { "files[]": data2 } : data2,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data2);
      }
      return data2;
    }],
    transformResponse: [function transformResponse(data2) {
      const transitional = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (utils$1.isResponse(data2) || utils$1.isReadableStream(data2)) {
        return data2;
      }
      if (data2 && utils$1.isString(data2) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional && transitional.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data2, this.parseReviver);
        } catch (e2) {
          if (strictJSONParsing) {
            if (e2.name === "SyntaxError") {
              throw AxiosError$1.from(e2, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e2;
          }
        }
      }
      return data2;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  const ignoreDuplicateOf = utils$1.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  const parseHeaders = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i2;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i2 = line.indexOf(":");
      key = line.substring(0, i2).trim().toLowerCase();
      val = line.substring(i2 + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };
  const $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils$1.isFunction(filter)) {
      return filter.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils$1.isString(value)) return;
    if (utils$1.isString(filter)) {
      return value.indexOf(filter) !== -1;
    }
    if (utils$1.isRegExp(filter)) {
      return filter.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils$1.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  let AxiosHeaders$1 = class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils$1.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
        let obj = {}, dest, key;
        for (const entry of header) {
          if (!utils$1.isArray(entry)) {
            throw TypeError("Object iterator must return a key-value pair");
          }
          obj[key = entry[0]] = (dest = obj[key]) ? utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
        }
        setHeaders(obj, valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils$1.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils$1.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils$1.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils$1.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i2 = keys.length;
      let deleted = false;
      while (i2--) {
        const key = keys[i2];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils$1.forEach(this, (value, header) => {
        const key = utils$1.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils$1.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders$1.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils$1.reduceDescriptors(AxiosHeaders$1.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils$1.freezeMethods(AxiosHeaders$1);
  function transformData(fns, response) {
    const config = this || defaults;
    const context = response || config;
    const headers = AxiosHeaders$1.from(context.headers);
    let data2 = context.data;
    utils$1.forEach(fns, function transform(fn) {
      data2 = fn.call(config, data2, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data2;
  }
  function isCancel$1(value) {
    return !!(value && value.__CANCEL__);
  }
  function CanceledError$1(message, config, request) {
    AxiosError$1.call(this, message == null ? "canceled" : message, AxiosError$1.ERR_CANCELED, config, request);
    this.name = "CanceledError";
  }
  utils$1.inherits(CanceledError$1, AxiosError$1, {
    __CANCEL__: true
  });
  function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError$1(
        "Request failed with status code " + response.status,
        [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  }
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i2 = tail;
      let bytesCount = 0;
      while (i2 !== head) {
        bytesCount += bytes[i2++];
        i2 = i2 % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn(...args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);
    return throttle((e2) => {
      const loaded = e2.loaded;
      const total = e2.lengthComputable ? e2.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data2 = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e2,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data2);
    }, freq);
  };
  const progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [(loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }), throttled[1]];
  };
  const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));
  const isURLSameOrigin = platform.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(
    new URL(platform.origin),
    platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
  ) : () => true;
  const cookies = platform.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + "=" + encodeURIComponent(value)];
        utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
        utils$1.isString(path) && cookie.push("path=" + path);
        utils$1.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }
  const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? __spreadValues({}, thing) : thing;
  function mergeConfig$1(config1, config2) {
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, prop, caseless) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge.call({ caseless }, target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a2, b, prop, caseless) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(a2, b, prop, caseless);
      } else if (!utils$1.isUndefined(a2)) {
        return getMergedValue(void 0, a2, prop, caseless);
      }
    }
    function valueFromConfig2(a2, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a2, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils$1.isUndefined(a2)) {
        return getMergedValue(void 0, a2);
      }
    }
    function mergeDirectKeys(a2, b, prop) {
      if (prop in config2) {
        return getMergedValue(a2, b);
      } else if (prop in config1) {
        return getMergedValue(void 0, a2);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a2, b, prop) => mergeDeepProperties(headersToObject(a2), headersToObject(b), prop, true)
    };
    utils$1.forEach(Object.keys(__spreadValues(__spreadValues({}, config1), config2)), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }
  const resolveConfig = (config) => {
    const newConfig = mergeConfig$1({}, config);
    let { data: data2, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = AxiosHeaders$1.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
      );
    }
    if (utils$1.isFormData(data2)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if (utils$1.isFunction(data2.getHeaders)) {
        const formHeaders = data2.getHeaders();
        const allowedHeaders = ["content-type", "content-length"];
        Object.entries(formHeaders).forEach(([key, val]) => {
          if (allowedHeaders.includes(key.toLowerCase())) {
            headers.set(key, val);
          }
        });
      }
    }
    if (platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };
  const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  const xhrAdapter = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders$1.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError$1("Request aborted", AxiosError$1.ECONNABORTED, config, request));
        request = null;
      };
      request.onerror = function handleError2(event) {
        const msg = event && event.message ? event.message : "Network Error";
        const err = new AxiosError$1(msg, AxiosError$1.ERR_NETWORK, config, request);
        err.event = event || null;
        reject(err);
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional = _config.transitional || transitionalDefaults;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError$1(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
          config,
          request
        ));
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils$1.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError$1("Unsupported protocol " + protocol + ":", AxiosError$1.ERR_BAD_REQUEST, config));
        return;
      }
      request.send(requestData || null);
    });
  };
  const composeSignals = (signals, timeout) => {
    const { length } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length) {
      let controller = new AbortController();
      let aborted;
      const onabort = function(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
        }
      };
      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError$1("timeout ".concat(timeout, " of ms exceeded"), AxiosError$1.ETIMEDOUT));
      }, timeout);
      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach((signal2) => {
            signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
          });
          signals = null;
        }
      };
      signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
      const { signal } = controller;
      signal.unsubscribe = () => utils$1.asap(unsubscribe);
      return signal;
    }
  };
  const streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end;
    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };
  const readBytes = function(iterable, chunkSize) {
    return __asyncGenerator(this, null, function* () {
      try {
        for (var iter = __forAwait(readStream(iterable)), more, temp, error2; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const chunk = temp.value;
          yield* __yieldStar(streamChunk(chunk, chunkSize));
        }
      } catch (temp) {
        error2 = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error2)
            throw error2[0];
        }
      }
    });
  };
  const readStream = function(stream) {
    return __asyncGenerator(this, null, function* () {
      if (stream[Symbol.asyncIterator]) {
        yield* __yieldStar(stream);
        return;
      }
      const reader = stream.getReader();
      try {
        for (; ; ) {
          const { done, value } = yield new __await(reader.read());
          if (done) {
            break;
          }
          yield value;
        }
      } finally {
        yield new __await(reader.cancel());
      }
    });
  };
  const trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator2 = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e2) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e2);
      }
    };
    return new ReadableStream({
      pull(controller) {
        return __async(this, null, function* () {
          try {
            const { done: done2, value } = yield iterator2.next();
            if (done2) {
              _onFinish();
              controller.close();
              return;
            }
            let len = value.byteLength;
            if (onProgress) {
              let loadedBytes = bytes += len;
              onProgress(loadedBytes);
            }
            controller.enqueue(new Uint8Array(value));
          } catch (err) {
            _onFinish(err);
            throw err;
          }
        });
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator2.return();
      }
    }, {
      highWaterMark: 2
    });
  };
  const DEFAULT_CHUNK_SIZE = 64 * 1024;
  const { isFunction } = utils$1;
  const globalFetchAPI = (({ Request, Response }) => ({
    Request,
    Response
  }))(utils$1.global);
  const {
    ReadableStream: ReadableStream$1,
    TextEncoder
  } = utils$1.global;
  const test = (fn, ...args) => {
    try {
      return !!fn(...args);
    } catch (e2) {
      return false;
    }
  };
  const factory = (env) => {
    env = utils$1.merge.call({
      skipUndefined: true
    }, globalFetchAPI, env);
    const { fetch: envFetch, Request, Response } = env;
    const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
    const isRequestSupported = isFunction(Request);
    const isResponseSupported = isFunction(Response);
    if (!isFetchSupported) {
      return false;
    }
    const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);
    const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : (str) => __async(this, null, function* () {
      return new Uint8Array(yield new Request(str).arrayBuffer());
    }));
    const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
      let duplexAccessed = false;
      const hasContentType = new Request(platform.origin, {
        body: new ReadableStream$1(),
        method: "POST",
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("Content-Type");
      return duplexAccessed && !hasContentType;
    });
    const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
    const resolvers = {
      stream: supportsResponseStream && ((res) => res.body)
    };
    isFetchSupported && (() => {
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
        !resolvers[type] && (resolvers[type] = (res, config) => {
          let method = res && res[type];
          if (method) {
            return method.call(res);
          }
          throw new AxiosError$1("Response type '".concat(type, "' is not supported"), AxiosError$1.ERR_NOT_SUPPORT, config);
        });
      });
    })();
    const getBodyLength = (body) => __async(this, null, function* () {
      if (body == null) {
        return 0;
      }
      if (utils$1.isBlob(body)) {
        return body.size;
      }
      if (utils$1.isSpecCompliantForm(body)) {
        const _request = new Request(platform.origin, {
          method: "POST",
          body
        });
        return (yield _request.arrayBuffer()).byteLength;
      }
      if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
        return body.byteLength;
      }
      if (utils$1.isURLSearchParams(body)) {
        body = body + "";
      }
      if (utils$1.isString(body)) {
        return (yield encodeText(body)).byteLength;
      }
    });
    const resolveBodyLength = (headers, body) => __async(this, null, function* () {
      const length = utils$1.toFiniteNumber(headers.getContentLength());
      return length == null ? getBodyLength(body) : length;
    });
    return (config) => __async(this, null, function* () {
      let {
        url,
        method,
        data: data2,
        signal,
        cancelToken,
        timeout,
        onDownloadProgress,
        onUploadProgress,
        responseType,
        headers,
        withCredentials = "same-origin",
        fetchOptions
      } = resolveConfig(config);
      let _fetch = envFetch || fetch;
      responseType = responseType ? (responseType + "").toLowerCase() : "text";
      let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
      let request = null;
      const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
        composedSignal.unsubscribe();
      });
      let requestContentLength;
      try {
        if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = yield resolveBodyLength(headers, data2)) !== 0) {
          let _request = new Request(url, {
            method: "POST",
            body: data2,
            duplex: "half"
          });
          let contentTypeHeader;
          if (utils$1.isFormData(data2) && (contentTypeHeader = _request.headers.get("content-type"))) {
            headers.setContentType(contentTypeHeader);
          }
          if (_request.body) {
            const [onProgress, flush] = progressEventDecorator(
              requestContentLength,
              progressEventReducer(asyncDecorator(onUploadProgress))
            );
            data2 = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
          }
        }
        if (!utils$1.isString(withCredentials)) {
          withCredentials = withCredentials ? "include" : "omit";
        }
        const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
        const resolvedOptions = __spreadProps(__spreadValues({}, fetchOptions), {
          signal: composedSignal,
          method: method.toUpperCase(),
          headers: headers.normalize().toJSON(),
          body: data2,
          duplex: "half",
          credentials: isCredentialsSupported ? withCredentials : void 0
        });
        request = isRequestSupported && new Request(url, resolvedOptions);
        let response = yield isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions);
        const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
        if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
          const options = {};
          ["status", "statusText", "headers"].forEach((prop) => {
            options[prop] = response[prop];
          });
          const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
          const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
            responseContentLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true)
          ) || [];
          response = new Response(
            trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
              flush && flush();
              unsubscribe && unsubscribe();
            }),
            options
          );
        }
        responseType = responseType || "text";
        let responseData = yield resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config);
        !isStreamResponse && unsubscribe && unsubscribe();
        return yield new Promise((resolve, reject) => {
          settle(resolve, reject, {
            data: responseData,
            headers: AxiosHeaders$1.from(response.headers),
            status: response.status,
            statusText: response.statusText,
            config,
            request
          });
        });
      } catch (err) {
        unsubscribe && unsubscribe();
        if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
          throw Object.assign(
            new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config, request),
            {
              cause: err.cause || err
            }
          );
        }
        throw AxiosError$1.from(err, err && err.code, config, request);
      }
    });
  };
  const seedCache = /* @__PURE__ */ new Map();
  const getFetch = (config) => {
    let env = config ? config.env : {};
    const { fetch: fetch2, Request, Response } = env;
    const seeds = [
      Request,
      Response,
      fetch2
    ];
    let len = seeds.length, i2 = len, seed, target, map = seedCache;
    while (i2--) {
      seed = seeds[i2];
      target = map.get(seed);
      target === void 0 && map.set(seed, target = i2 ? /* @__PURE__ */ new Map() : factory(env));
      map = target;
    }
    return target;
  };
  getFetch();
  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: {
      get: getFetch
    }
  };
  utils$1.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e2) {
      }
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  const renderReason = (reason) => "- ".concat(reason);
  const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
  const adapters = {
    getAdapter: (adapters2, config) => {
      adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
      const { length } = adapters2;
      let nameOrAdapter;
      let adapter;
      const rejectedReasons = {};
      for (let i2 = 0; i2 < length; i2++) {
        nameOrAdapter = adapters2[i2];
        let id;
        adapter = nameOrAdapter;
        if (!isResolvedHandle(nameOrAdapter)) {
          adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
          if (adapter === void 0) {
            throw new AxiosError$1("Unknown adapter '".concat(id, "'"));
          }
        }
        if (adapter && (utils$1.isFunction(adapter) || (adapter = adapter.get(config)))) {
          break;
        }
        rejectedReasons[id || "#" + i2] = adapter;
      }
      if (!adapter) {
        const reasons = Object.entries(rejectedReasons).map(
          ([id, state]) => "adapter ".concat(id, " ") + (state === false ? "is not supported by the environment" : "is not available in the build")
        );
        let s2 = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
        throw new AxiosError$1(
          "There is no suitable adapter to dispatch the request " + s2,
          "ERR_NOT_SUPPORT"
        );
      }
      return adapter;
    },
    adapters: knownAdapters
  };
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError$1(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders$1.from(config.headers);
    config.data = transformData.call(
      config,
      config.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters.getAdapter(config.adapter || defaults.adapter, config);
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );
      response.headers = AxiosHeaders$1.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel$1(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }
  const VERSION$1 = "1.12.2";
  const validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i2) => {
    validators$1[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i2 < 1 ? "n " : " ") + type;
    };
  });
  const deprecatedWarnings = {};
  validators$1.transitional = function transitional(validator2, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator2 === false) {
        throw new AxiosError$1(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError$1.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  validators$1.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn("".concat(opt, " is likely a misspelling of ").concat(correctSpelling));
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError$1("options must be an object", AxiosError$1.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i2 = keys.length;
    while (i2-- > 0) {
      const opt = keys[i2];
      const validator2 = schema[opt];
      if (validator2) {
        const value = options[opt];
        const result = value === void 0 || validator2(value, opt, options);
        if (result !== true) {
          throw new AxiosError$1("option " + opt + " must be " + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError$1("Unknown option " + opt, AxiosError$1.ERR_BAD_OPTION);
      }
    }
  }
  const validator = {
    assertOptions,
    validators: validators$1
  };
  const validators = validator.validators;
  let Axios$1 = class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig || {};
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    request(configOrUrl, config) {
      return __async(this, null, function* () {
        try {
          return yield this._request(configOrUrl, config);
        } catch (err) {
          if (err instanceof Error) {
            let dummy = {};
            Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
            const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
            try {
              if (!err.stack) {
                err.stack = stack;
              } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
                err.stack += "\n" + stack;
              }
            } catch (e2) {
            }
          }
          throw err;
        }
      });
    }
    _request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig$1(this.defaults, config);
      const { transitional, paramsSerializer, headers } = config;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils$1.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }
      if (config.allowAbsoluteUrls !== void 0) ;
      else if (this.defaults.allowAbsoluteUrls !== void 0) {
        config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config.allowAbsoluteUrls = true;
      }
      validator.assertOptions(config, {
        baseUrl: validators.spelling("baseURL"),
        withXsrfToken: validators.spelling("withXSRFToken")
      }, true);
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils$1.merge(
        headers.common,
        headers[config.method]
      );
      headers && utils$1.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor2) {
        if (typeof interceptor2.runWhen === "function" && interceptor2.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor2.synchronous;
        requestInterceptorChain.unshift(interceptor2.fulfilled, interceptor2.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor2) {
        responseInterceptorChain.push(interceptor2.fulfilled, interceptor2.rejected);
      });
      let promise;
      let i2 = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift(...requestInterceptorChain);
        chain.push(...responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config);
        while (i2 < len) {
          promise = promise.then(chain[i2++], chain[i2++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      while (i2 < len) {
        const onFulfilled = requestInterceptorChain[i2++];
        const onRejected = requestInterceptorChain[i2++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error2) {
          onRejected.call(this, error2);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error2) {
        return Promise.reject(error2);
      }
      i2 = 0;
      len = responseInterceptorChain.length;
      while (i2 < len) {
        promise = promise.then(responseInterceptorChain[i2++], responseInterceptorChain[i2++]);
      }
      return promise;
    }
    getUri(config) {
      config = mergeConfig$1(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  };
  utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios$1.prototype[method] = function(url, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data2, config) {
        return this.request(mergeConfig$1(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data: data2
        }));
      };
    }
    Axios$1.prototype[method] = generateHTTPMethod();
    Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  let CancelToken$1 = class CancelToken2 {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners) return;
        let i2 = token._listeners.length;
        while (i2-- > 0) {
          token._listeners[i2](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError$1(message, config, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new CancelToken2(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  };
  function spread$1(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }
  function isAxiosError$1(payload) {
    return utils$1.isObject(payload) && payload.isAxiosError === true;
  }
  const HttpStatusCode$1 = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
  };
  Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
    HttpStatusCode$1[value] = key;
  });
  function createInstance(defaultConfig) {
    const context = new Axios$1(defaultConfig);
    const instance = bind(Axios$1.prototype.request, context);
    utils$1.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
    utils$1.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
    };
    return instance;
  }
  const axios = createInstance(defaults);
  axios.Axios = Axios$1;
  axios.CanceledError = CanceledError$1;
  axios.CancelToken = CancelToken$1;
  axios.isCancel = isCancel$1;
  axios.VERSION = VERSION$1;
  axios.toFormData = toFormData$1;
  axios.AxiosError = AxiosError$1;
  axios.Cancel = axios.CanceledError;
  axios.all = function all2(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread$1;
  axios.isAxiosError = isAxiosError$1;
  axios.mergeConfig = mergeConfig$1;
  axios.AxiosHeaders = AxiosHeaders$1;
  axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters.getAdapter;
  axios.HttpStatusCode = HttpStatusCode$1;
  axios.default = axios;
  const {
    Axios,
    AxiosError,
    CanceledError,
    isCancel,
    CancelToken,
    VERSION,
    all,
    Cancel,
    isAxiosError,
    spread,
    toFormData,
    AxiosHeaders,
    HttpStatusCode,
    formToJSON,
    getAdapter,
    mergeConfig
  } = axios;
  window.themeVendor = {
    AOS,
    FlickityFade,
    ScrollLock,
    Flickity,
    MicroModal: l,
    Rellax,
    axios
    // themeCurrency,
    // FlickitySync,
    // themeAddresses,
    // Sqrl
  };
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true
  });
  var define_process_env_default = {};
  window.requestIdleCallback = window.requestIdleCallback || function(cb) {
    const start2 = Date.now();
    return setTimeout(function() {
      cb({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start2));
        }
      });
    }, 1);
  };
  window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
    clearTimeout(id);
  };
  (function() {
    const env = { "NODE_ENV": "development" };
    try {
      if (process) {
        define_process_env_default = Object.assign({}, define_process_env_default);
        Object.assign(define_process_env_default, env);
        return;
      }
    } catch (e2) {
    }
    globalThis.process = { env };
  })();
  window.theme = window.theme || {};
  window.theme.config = {
    mqlSmall: false,
    mediaQuerySmall: "screen and (max-width: 749px)",
    mediaQueryMedium: "screen and (min-width: 750px) and (max-width: 999px)",
    mediaQueryLarge: "screen and (min-width: 1000px)",
    isTouch: "ontouchstart" in window || window.DocumentTouch && window.document instanceof DocumentTouch || window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints ? true : false,
    rtl: document.documentElement.getAttribute("dir") === "rtl" ? true : false
  };
  window.theme.sizes = {
    mobile: 749,
    small: 750,
    medium: 999,
    large: 1e3,
    widescreen: 1400
  };
  window.theme.settings = {
    cartType: "drawer",
    isCustomerTemplate: false,
    moneyFormat: "${{amount}}",
    predictiveSearch: true,
    predictiveSearchType: "product,page,article",
    quickAdd: true,
    themeName: "Evo",
    themeVersion: "1.0.0",
    themeAuthor: "Evo Development Team",
    performanceMode: true
  };
  window.theme.strings = {
    addToCart: "Add to cart",
    soldOut: "Sold out",
    unavailable: "Unavailable",
    regularPrice: "Regular price",
    salePrice: "Sale price",
    unitPrice: "Unit price",
    unitPriceSeparator: "per",
    onSale: "Sale",
    quantity: "Quantity",
    quantityMinimumMessage: "Quantity must be 1 or more",
    quantityMaximumMessage: "You can only add [quantity] of this item to your cart",
    cartError: "There was an error while updating your cart. Please try again.",
    cartTermsConfirmation: "You must agree to the terms and conditions before checking out.",
    searchNoResults: 'No results found for "[terms]". Check the spelling or use a different word or phrase.',
    searchResults: 'Search results for "[terms]"',
    searchResultsCount: {
      one: '[count] result for "[terms]"',
      other: '[count] results for "[terms]"'
    }
  };
  window.theme.routes = {
    root: "/",
    account: "/account",
    cart: "/cart",
    cartAdd: "/cart/add.js",
    cartChange: "/cart/change.js",
    cartUpdate: "/cart/update.js",
    predictiveSearch: "/search/suggest.json",
    productRecommendations: "/recommendations/products.json"
  };
  const resolution = {};
  function initResolution() {
    const touchQuery = "(hover: none) and (pointer: coarse)";
    const mobileQuery = "(max-width: ".concat(window.theme.sizes.medium, "px)");
    const tabletQuery = "(min-width: ".concat(window.theme.sizes.medium + 1, "px) and (max-width: ").concat(window.theme.sizes.large, "px)");
    const desktopQuery = "(min-width: ".concat(window.theme.sizes.large + 1, "px)");
    resolution.isTouch = () => {
      const touchMatches = window.matchMedia(touchQuery).matches;
      document.documentElement.classList.toggle("supports-touch", touchMatches);
      return touchMatches;
    };
    resolution.isMobile = () => window.matchMedia(mobileQuery).matches;
    resolution.isTablet = () => window.matchMedia(tabletQuery).matches;
    resolution.isDesktop = () => window.matchMedia(desktopQuery).matches;
    const queries = [
      [touchQuery, resolution.isTouch],
      [mobileQuery, resolution.isMobile],
      [tabletQuery, resolution.isTablet],
      [desktopQuery, resolution.isDesktop]
    ];
    resolution.onChange = (callback) => {
      queries.forEach((query) => {
        window.matchMedia(query[0]).addEventListener("change", () => {
          if (query[1]() && callback) callback();
        });
      });
    };
    resolution.isTouch();
  }
  initResolution();
  function announcement() {
    return {
      // Component state
      isVisible: true,
      isDismissed: false,
      // Initialize component
      init() {
        const dismissed = localStorage.getItem("announcement-dismissed");
        if (dismissed) {
          this.isDismissed = true;
          this.isVisible = false;
        }
      },
      // Dismiss announcement
      dismiss() {
        this.isVisible = false;
        this.isDismissed = true;
        localStorage.setItem("announcement-dismissed", "true");
        this.$dispatch("announcement:dismissed");
      },
      // Show announcement
      show() {
        this.isVisible = true;
        this.isDismissed = false;
        localStorage.removeItem("announcement-dismissed");
        this.$dispatch("announcement:shown");
      },
      // Toggle announcement
      toggle() {
        if (this.isVisible) {
          this.dismiss();
        } else {
          this.show();
        }
      }
    };
  }
  function announcementSlider() {
    return {
      currentSlide: 0,
      totalSlides: 0,
      isPlaying: true,
      autoplayInterval: null,
      init() {
        this.totalSlides = this.$el.querySelectorAll("[data-slide]").length;
        if (this.totalSlides > 1 && this.isPlaying) {
          this.startAutoplay();
        }
      },
      nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.$dispatch("slide:changed", { index: this.currentSlide });
      },
      prevSlide() {
        this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.totalSlides - 1;
        this.$dispatch("slide:changed", { index: this.currentSlide });
      },
      goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
          this.currentSlide = index;
          this.$dispatch("slide:changed", { index: this.currentSlide });
        }
      },
      startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
          this.nextSlide();
        }, 5e3);
      },
      stopAutoplay() {
        if (this.autoplayInterval) {
          clearInterval(this.autoplayInterval);
          this.autoplayInterval = null;
        }
      },
      toggleAutoplay() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
          this.startAutoplay();
        } else {
          this.stopAutoplay();
        }
      }
    };
  }
  function announcementTicker() {
    return {
      isPaused: false,
      speed: 1,
      init() {
        this.setupTicker();
      },
      setupTicker() {
        const ticker = this.$el.querySelector("[data-ticker-content]");
        if (!ticker) return;
        const contentWidth = ticker.scrollWidth;
        this.$el.offsetWidth;
        const duration = contentWidth / 50 * this.speed;
        ticker.style.animationDuration = "".concat(duration, "s");
      },
      pause() {
        this.isPaused = true;
        const ticker = this.$el.querySelector("[data-ticker-content]");
        if (ticker) {
          ticker.style.animationPlayState = "paused";
        }
      },
      resume() {
        this.isPaused = false;
        const ticker = this.$el.querySelector("[data-ticker-content]");
        if (ticker) {
          ticker.style.animationPlayState = "running";
        }
      },
      toggle() {
        if (this.isPaused) {
          this.resume();
        } else {
          this.pause();
        }
      },
      setSpeed(newSpeed) {
        this.speed = newSpeed;
        this.setupTicker();
      }
    };
  }
  function productAddButtonForm() {
    return {
      isLoading: false,
      isAdded: false,
      quantity: 1,
      variantId: null,
      init() {
        this.variantId = this.$el.dataset.variantId;
      },
      addToCart() {
        return __async(this, null, function* () {
          if (this.isLoading) return;
          this.isLoading = true;
          try {
            const response = yield fetch("/cart/add.js", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                id: this.variantId,
                quantity: this.quantity
              })
            });
            if (response.ok) {
              this.isAdded = true;
              this.$dispatch("cart:added", { variantId: this.variantId, quantity: this.quantity });
              setTimeout(() => {
                this.isAdded = false;
              }, 2e3);
            } else {
              throw new Error("Failed to add to cart");
            }
          } catch (error2) {
            console.error("Add to cart error:", error2);
            this.$dispatch("cart:error", { error: error2 });
          } finally {
            this.isLoading = false;
          }
        });
      },
      incrementQuantity() {
        this.quantity++;
      },
      decrementQuantity() {
        if (this.quantity > 1) {
          this.quantity--;
        }
      }
    };
  }
  function productQuickViewButton() {
    return {
      isLoading: false,
      isOpen: false,
      productData: null,
      init() {
        this.productHandle = this.$el.dataset.productHandle;
      },
      openQuickView() {
        return __async(this, null, function* () {
          if (this.isLoading) return;
          this.isLoading = true;
          try {
            const response = yield fetch("/products/".concat(this.productHandle, ".js"));
            this.productData = yield response.json();
            this.isOpen = true;
            this.$dispatch("quickview:opened", { product: this.productData });
          } catch (error2) {
            console.error("Quick view error:", error2);
            this.$dispatch("quickview:error", { error: error2 });
          } finally {
            this.isLoading = false;
          }
        });
      },
      closeQuickView() {
        this.isOpen = false;
        this.$dispatch("quickview:closed");
      }
    };
  }
  function productGridItemQuickAddMenu() {
    return {
      isOpen: false,
      isLoading: false,
      selectedVariant: null,
      variants: [],
      init() {
        this.productId = this.$el.dataset.productId;
        this.loadVariants();
      },
      loadVariants() {
        return __async(this, null, function* () {
          try {
            const response = yield fetch("/products/".concat(this.productId, ".js"));
            const product = yield response.json();
            this.variants = product.variants;
            this.selectedVariant = this.variants[0];
          } catch (error2) {
            console.error("Failed to load variants:", error2);
          }
        });
      },
      openMenu() {
        this.isOpen = true;
        this.$dispatch("quickadd:opened");
      },
      closeMenu() {
        this.isOpen = false;
        this.$dispatch("quickadd:closed");
      },
      selectVariant(variant) {
        this.selectedVariant = variant;
      },
      addToCart() {
        return __async(this, null, function* () {
          if (!this.selectedVariant || this.isLoading) return;
          this.isLoading = true;
          try {
            const response = yield fetch("/cart/add.js", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                id: this.selectedVariant.id,
                quantity: 1
              })
            });
            if (response.ok) {
              this.$dispatch("cart:added", { variant: this.selectedVariant });
              this.closeMenu();
            }
          } catch (error2) {
            console.error("Add to cart error:", error2);
            this.$dispatch("cart:error", { error: error2 });
          } finally {
            this.isLoading = false;
          }
        });
      }
    };
  }
  function toggle() {
    return {
      // Component state
      isOpen: false,
      isAnimating: false,
      // Initialize component
      init() {
        const initialState = this.$el.dataset.toggleOpen;
        if (initialState === "true") {
          this.isOpen = true;
        }
        this.$el.addEventListener("toggle:open", () => this.open());
        this.$el.addEventListener("toggle:close", () => this.close());
        this.$el.addEventListener("toggle:toggle", () => this.toggle());
      },
      // Open toggle
      open() {
        if (this.isOpen || this.isAnimating) return;
        this.isAnimating = true;
        this.isOpen = true;
        this.$dispatch("toggle:opening");
        this.$nextTick(() => {
          setTimeout(() => {
            this.isAnimating = false;
            this.$dispatch("toggle:opened");
          }, 300);
        });
      },
      // Close toggle
      close() {
        if (!this.isOpen || this.isAnimating) return;
        this.isAnimating = true;
        this.isOpen = false;
        this.$dispatch("toggle:closing");
        this.$nextTick(() => {
          setTimeout(() => {
            this.isAnimating = false;
            this.$dispatch("toggle:closed");
          }, 300);
        });
      },
      // Toggle state
      toggle() {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      },
      // Computed properties
      get toggleClass() {
        return {
          "is-open": this.isOpen,
          "is-animating": this.isAnimating,
          "is-closed": !this.isOpen
        };
      }
    };
  }
  function tabs() {
    return {
      // Component state
      activeTab: 0,
      tabs: [],
      panels: [],
      // Initialize component
      init() {
        this.tabs = Array.from(this.$el.querySelectorAll("[data-tab]"));
        this.panels = Array.from(this.$el.querySelectorAll("[data-tab-panel]"));
        const initialTab = parseInt(this.$el.dataset.activeTab) || 0;
        this.setActiveTab(initialTab);
        this.tabs.forEach((tab, index) => {
          tab.addEventListener("click", (e2) => {
            e2.preventDefault();
            this.setActiveTab(index);
          });
          tab.addEventListener("keydown", (e2) => {
            this.handleKeydown(e2, index);
          });
        });
      },
      // Set active tab
      setActiveTab(index) {
        if (index < 0 || index >= this.tabs.length) return;
        const previousTab = this.activeTab;
        this.activeTab = index;
        this.tabs.forEach((tab, i2) => {
          const isActive = i2 === index;
          tab.setAttribute("aria-selected", isActive);
          tab.setAttribute("tabindex", isActive ? "0" : "-1");
          tab.classList.toggle("active", isActive);
        });
        this.panels.forEach((panel, i2) => {
          const isActive = i2 === index;
          panel.setAttribute("aria-hidden", !isActive);
          panel.classList.toggle("active", isActive);
        });
        if (document.activeElement !== this.tabs[index]) {
          this.tabs[index].focus();
        }
        this.$dispatch("tabs:changed", {
          activeTab: index,
          previousTab,
          tab: this.tabs[index],
          panel: this.panels[index]
        });
      },
      // Handle keyboard navigation
      handleKeydown(event, currentIndex) {
        let newIndex = currentIndex;
        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
            break;
          case "ArrowRight":
            event.preventDefault();
            newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
            break;
          case "Home":
            event.preventDefault();
            newIndex = 0;
            break;
          case "End":
            event.preventDefault();
            newIndex = this.tabs.length - 1;
            break;
          default:
            return;
        }
        this.setActiveTab(newIndex);
      },
      // Go to next tab
      nextTab() {
        const nextIndex = this.activeTab < this.tabs.length - 1 ? this.activeTab + 1 : 0;
        this.setActiveTab(nextIndex);
      },
      // Go to previous tab
      prevTab() {
        const prevIndex = this.activeTab > 0 ? this.activeTab - 1 : this.tabs.length - 1;
        this.setActiveTab(prevIndex);
      },
      // Computed properties
      get currentTab() {
        return this.tabs[this.activeTab];
      },
      get currentPanel() {
        return this.panels[this.activeTab];
      }
    };
  }
  function overflow() {
    return {
      hasOverflow: false,
      isExpanded: false,
      maxHeight: null,
      init() {
        this.maxHeight = this.$el.dataset.maxHeight ? parseInt(this.$el.dataset.maxHeight) : 200;
        this.checkOverflow();
        window.addEventListener("resize", () => this.checkOverflow());
      },
      checkOverflow() {
        const contentHeight = this.$el.scrollHeight;
        this.hasOverflow = contentHeight > this.maxHeight;
        if (this.hasOverflow && !this.isExpanded) {
          this.$el.style.maxHeight = "".concat(this.maxHeight, "px");
          this.$el.style.overflow = "hidden";
        }
      },
      expand() {
        this.isExpanded = true;
        this.$el.style.maxHeight = "none";
        this.$el.style.overflow = "visible";
        this.$dispatch("overflow:expanded");
      },
      collapse() {
        this.isExpanded = false;
        this.$el.style.maxHeight = "".concat(this.maxHeight, "px");
        this.$el.style.overflow = "hidden";
        this.$dispatch("overflow:collapsed");
      },
      toggle() {
        if (this.isExpanded) {
          this.collapse();
        } else {
          this.expand();
        }
      }
    };
  }
  function targetReferrer(Alpine2) {
    Alpine2.directive("target-referrer", (el, { expression }, { evaluateLater: evaluateLater2, effect: effect3 }) => {
      if (!expression) return;
      const getReferrerConfig = evaluateLater2(expression);
      effect3(() => {
        getReferrerConfig((config) => {
          if (!config || typeof config !== "object") return;
          const referrer = document.referrer;
          const currentHost = window.location.hostname;
          let shouldShow = false;
          if (config.external && referrer && !referrer.includes(currentHost)) {
            shouldShow = true;
          }
          if (config.internal && referrer && referrer.includes(currentHost)) {
            shouldShow = true;
          }
          if (config.direct && !referrer) {
            shouldShow = true;
          }
          if (config.domains && Array.isArray(config.domains)) {
            shouldShow = config.domains.some((domain) => referrer.includes(domain));
          }
          if (config.patterns && Array.isArray(config.patterns)) {
            shouldShow = config.patterns.some((pattern) => {
              const regex = new RegExp(pattern, "i");
              return regex.test(referrer);
            });
          }
          if (config.hide) {
            el.style.display = shouldShow ? "none" : "";
          } else {
            el.style.display = shouldShow ? "" : "none";
          }
          el.classList.toggle("referrer-match", shouldShow);
          el.dispatchEvent(new CustomEvent("referrer:evaluated", {
            detail: { shouldShow, referrer, config }
          }));
        });
      });
    });
  }
  function flickityPlugin(Alpine2) {
    Alpine2.directive("flickity", (el, { expression, modifiers }, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
      let flickityInstance = null;
      let options = {};
      if (expression) {
        const getOptions = evaluateLater2(expression);
        getOptions((value) => {
          options = value || {};
        });
      }
      const defaultOptions = __spreadValues({
        cellAlign: "left",
        contain: true,
        pageDots: false,
        prevNextButtons: true,
        accessibility: true,
        setGallerySize: false
      }, options);
      if (modifiers.includes("fade")) {
        defaultOptions.fade = true;
      }
      if (modifiers.includes("autoplay")) {
        defaultOptions.autoPlay = 3e3;
      }
      if (modifiers.includes("dots")) {
        defaultOptions.pageDots = true;
      }
      if (modifiers.includes("no-arrows")) {
        defaultOptions.prevNextButtons = false;
      }
      const initFlickity = () => {
        if (flickityInstance) {
          flickityInstance.destroy();
        }
        flickityInstance = new Flickity(el, defaultOptions);
        el._flickity = flickityInstance;
        flickityInstance.on("ready", () => {
          el.dispatchEvent(new CustomEvent("flickity:ready", {
            detail: { flickity: flickityInstance }
          }));
        });
        flickityInstance.on("change", (index) => {
          el.dispatchEvent(new CustomEvent("flickity:change", {
            detail: { index, flickity: flickityInstance }
          }));
        });
        flickityInstance.on("select", (index) => {
          el.dispatchEvent(new CustomEvent("flickity:select", {
            detail: { index, flickity: flickityInstance }
          }));
        });
      };
      if (el.children.length > 0) {
        initFlickity();
      } else {
        const observer2 = new MutationObserver(() => {
          if (el.children.length > 0) {
            initFlickity();
            observer2.disconnect();
          }
        });
        observer2.observe(el, { childList: true });
      }
      cleanup2(() => {
        if (flickityInstance) {
          flickityInstance.destroy();
          flickityInstance = null;
        }
      });
    });
    Alpine2.magic("flickity", (el) => {
      return el._flickity || null;
    });
  }
  function sectionPlugin(Alpine2) {
    Alpine2.directive("section", (el, { expression }, { evaluateLater: evaluateLater2, effect: effect3, cleanup: cleanup2 }) => {
      let sectionId = null;
      let sectionType = null;
      if (expression) {
        const getSectionConfig = evaluateLater2(expression);
        effect3(() => {
          getSectionConfig((config) => {
            if (typeof config === "string") {
              sectionId = config;
            } else if (config && typeof config === "object") {
              sectionId = config.id;
              sectionType = config.type;
            }
          });
        });
      }
      if (!sectionId) {
        sectionId = el.dataset.sectionId || el.id;
      }
      if (!sectionType) {
        sectionType = el.dataset.sectionType || "generic";
      }
      const handleSectionSelect = (event) => {
        if (event.detail.sectionId === sectionId) {
          el.dispatchEvent(new CustomEvent("section:selected", {
            detail: { sectionId, sectionType }
          }));
        }
      };
      const handleSectionDeselect = (event) => {
        if (event.detail.sectionId === sectionId) {
          el.dispatchEvent(new CustomEvent("section:deselected", {
            detail: { sectionId, sectionType }
          }));
        }
      };
      const handleSectionLoad = (event) => {
        if (event.detail.sectionId === sectionId) {
          el.dispatchEvent(new CustomEvent("section:loaded", {
            detail: { sectionId, sectionType }
          }));
        }
      };
      const handleSectionUnload = (event) => {
        if (event.detail.sectionId === sectionId) {
          el.dispatchEvent(new CustomEvent("section:unloaded", {
            detail: { sectionId, sectionType }
          }));
        }
      };
      document.addEventListener("shopify:section:select", handleSectionSelect);
      document.addEventListener("shopify:section:deselect", handleSectionDeselect);
      document.addEventListener("shopify:section:load", handleSectionLoad);
      document.addEventListener("shopify:section:unload", handleSectionUnload);
      el._section = {
        id: sectionId,
        type: sectionType,
        element: el
      };
      cleanup2(() => {
        document.removeEventListener("shopify:section:select", handleSectionSelect);
        document.removeEventListener("shopify:section:deselect", handleSectionDeselect);
        document.removeEventListener("shopify:section:load", handleSectionLoad);
        document.removeEventListener("shopify:section:unload", handleSectionUnload);
      });
    });
    Alpine2.magic("section", (el) => {
      return el._section || null;
    });
  }
  function ensemblePlugin(Alpine2) {
    Alpine2.directive("ensemble", (el, { expression }, { evaluateLater: evaluateLater2, effect: effect3 }) => {
      let ensembleId = null;
      let config = {};
      if (expression) {
        const getConfig = evaluateLater2(expression);
        effect3(() => {
          getConfig((value) => {
            if (typeof value === "string") {
              ensembleId = value;
            } else if (value && typeof value === "object") {
              ensembleId = value.id;
              config = value;
            }
          });
        });
      }
      if (!ensembleId) {
        ensembleId = el.dataset.ensembleId || "default";
      }
      if (!window._ensembles) {
        window._ensembles = {};
      }
      if (!window._ensembles[ensembleId]) {
        window._ensembles[ensembleId] = {
          members: /* @__PURE__ */ new Set(),
          state: {},
          events: new EventTarget()
        };
      }
      const ensemble = window._ensembles[ensembleId];
      ensemble.members.add(el);
      const ensembleMethods = {
        // Broadcast to all members
        broadcast(eventName, data2) {
          ensemble.events.dispatchEvent(new CustomEvent(eventName, {
            detail: __spreadProps(__spreadValues({}, data2), { sender: el })
          }));
        },
        // Listen for ensemble events
        listen(eventName, callback) {
          ensemble.events.addEventListener(eventName, callback);
        },
        // Set shared state
        setState(key, value) {
          ensemble.state[key] = value;
          this.broadcast("state:changed", { key, value });
        },
        // Get shared state
        getState(key) {
          return ensemble.state[key];
        },
        // Get all members
        getMembers() {
          return Array.from(ensemble.members);
        },
        // Get other members (excluding self)
        getPeers() {
          return Array.from(ensemble.members).filter((member) => member !== el);
        }
      };
      el._ensemble = ensembleMethods;
      if (config.initialState) {
        Object.entries(config.initialState).forEach(([key, value]) => {
          ensembleMethods.setState(key, value);
        });
      }
      const observer2 = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === el) {
              ensemble.members.delete(el);
              observer2.disconnect();
            }
          });
        });
      });
      if (el.parentNode) {
        observer2.observe(el.parentNode, { childList: true, subtree: true });
      }
    });
    Alpine2.magic("ensemble", (el) => {
      return el._ensemble || null;
    });
  }
  function holdPlugin(Alpine2) {
    Alpine2.directive("hold", (el, { expression, modifiers }, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
      let holdTimer = null;
      let holdDuration = 500;
      let callback = null;
      if (expression) {
        const getCallback = evaluateLater2(expression);
        callback = () => getCallback();
      }
      modifiers.forEach((modifier) => {
        if (modifier.includes("ms")) {
          holdDuration = parseInt(modifier.replace("ms", ""));
        }
      });
      const startHold = (event) => {
        event.preventDefault();
        holdTimer = setTimeout(() => {
          if (callback) callback();
          el.dispatchEvent(new CustomEvent("hold:triggered", {
            detail: { duration: holdDuration, originalEvent: event }
          }));
        }, holdDuration);
        el.classList.add("holding");
      };
      const endHold = () => {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
        el.classList.remove("holding");
      };
      el.addEventListener("mousedown", startHold);
      el.addEventListener("touchstart", startHold, { passive: false });
      el.addEventListener("mouseup", endHold);
      el.addEventListener("mouseleave", endHold);
      el.addEventListener("touchend", endHold);
      el.addEventListener("touchcancel", endHold);
      cleanup2(() => {
        endHold();
        el.removeEventListener("mousedown", startHold);
        el.removeEventListener("touchstart", startHold);
        el.removeEventListener("mouseup", endHold);
        el.removeEventListener("mouseleave", endHold);
        el.removeEventListener("touchend", endHold);
        el.removeEventListener("touchcancel", endHold);
      });
    });
  }
  function marqueePlugin(Alpine2) {
    Alpine2.directive("marquee", (el, { expression, modifiers }, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
      let animationId = null;
      let isPaused = false;
      let speed = 1;
      if (expression) {
        const getConfig = evaluateLater2(expression);
        getConfig((config) => {
          if (typeof config === "number") {
            speed = config;
          } else if (config && typeof config === "object") {
            speed = config.speed || 1;
          }
        });
      }
      if (modifiers.includes("slow")) speed = 0.5;
      if (modifiers.includes("fast")) speed = 2;
      const startMarquee = () => {
        const content = el.querySelector("[data-marquee-content]") || el;
        const containerWidth = el.offsetWidth;
        const contentWidth = content.scrollWidth;
        if (contentWidth <= containerWidth) return;
        let position = containerWidth;
        const animate2 = () => {
          if (!isPaused) {
            position -= speed;
            if (position < -contentWidth) {
              position = containerWidth;
            }
            content.style.transform = "translateX(".concat(position, "px)");
          }
          animationId = requestAnimationFrame(animate2);
        };
        animate2();
      };
      const pauseMarquee = () => {
        isPaused = true;
      };
      const resumeMarquee = () => {
        isPaused = false;
      };
      if (modifiers.includes("pause-on-hover")) {
        el.addEventListener("mouseenter", pauseMarquee);
        el.addEventListener("mouseleave", resumeMarquee);
      }
      startMarquee();
      el._marquee = {
        pause: pauseMarquee,
        resume: resumeMarquee,
        get isPaused() {
          return isPaused;
        }
      };
      cleanup2(() => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      });
    });
    Alpine2.magic("marquee", (el) => {
      return el._marquee || null;
    });
  }
  function themeEditorPlugin(Alpine2) {
    Alpine2.directive("theme-editor", (el, { expression }, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
      let config = {};
      if (expression) {
        const getConfig = evaluateLater2(expression);
        getConfig((value) => {
          config = value || {};
        });
      }
      const handleSectionSelect = (event) => {
        if (config.onSelect) {
          config.onSelect(event.detail);
        }
        el.classList.add("theme-editor-selected");
      };
      const handleSectionDeselect = (event) => {
        if (config.onDeselect) {
          config.onDeselect(event.detail);
        }
        el.classList.remove("theme-editor-selected");
      };
      const handleSectionLoad = (event) => {
        if (config.onLoad) {
          config.onLoad(event.detail);
        }
      };
      const handleSectionUnload = (event) => {
        if (config.onUnload) {
          config.onUnload(event.detail);
        }
      };
      document.addEventListener("shopify:section:select", handleSectionSelect);
      document.addEventListener("shopify:section:deselect", handleSectionDeselect);
      document.addEventListener("shopify:section:load", handleSectionLoad);
      document.addEventListener("shopify:section:unload", handleSectionUnload);
      cleanup2(() => {
        document.removeEventListener("shopify:section:select", handleSectionSelect);
        document.removeEventListener("shopify:section:deselect", handleSectionDeselect);
        document.removeEventListener("shopify:section:load", handleSectionLoad);
        document.removeEventListener("shopify:section:unload", handleSectionUnload);
      });
    });
  }
  function disclosurePlugin(Alpine2) {
    Alpine2.directive("disclosure", (el, { expression, modifiers }, { evaluateLater: evaluateLater2, effect: effect3, cleanup: cleanup2 }) => {
      let isOpen = false;
      let isAnimating = false;
      let content = null;
      let trigger2 = null;
      trigger2 = el.querySelector("[data-disclosure-trigger]") || el;
      content = el.querySelector("[data-disclosure-content]");
      if (!content) {
        console.warn("Disclosure: content element not found");
        return;
      }
      if (expression) {
        const getInitialState = evaluateLater2(expression);
        effect3(() => {
          getInitialState((value) => {
            if (typeof value === "boolean") {
              setDisclosureState(value, false);
            }
          });
        });
      }
      const initialState = modifiers.includes("open") || el.dataset.disclosureOpen === "true" || trigger2.getAttribute("aria-expanded") === "true";
      setDisclosureState(initialState, false);
      const handleTriggerClick = (e2) => {
        e2.preventDefault();
        toggle2();
      };
      const handleKeydown = (e2) => {
        if (e2.key === "Enter" || e2.key === " ") {
          e2.preventDefault();
          toggle2();
        }
      };
      function setDisclosureState(open2, animate2 = true) {
        if (isAnimating) return;
        isOpen = open2;
        trigger2.setAttribute("aria-expanded", isOpen);
        content.setAttribute("aria-hidden", !isOpen);
        el.classList.toggle("is-open", isOpen);
        trigger2.classList.toggle("is-expanded", isOpen);
        if (animate2 && !modifiers.includes("no-animate")) {
          animateDisclosure(isOpen);
        } else {
          content.style.display = isOpen ? "" : "none";
          content.style.height = "";
          content.style.overflow = "";
        }
        el.dispatchEvent(new CustomEvent(isOpen ? "disclosure:opened" : "disclosure:closed", {
          detail: { disclosure: el, isOpen }
        }));
      }
      function animateDisclosure(open2) {
        isAnimating = true;
        if (open2) {
          content.style.display = "";
          content.style.height = "0px";
          content.style.overflow = "hidden";
          requestAnimationFrame(() => {
            const height = content.scrollHeight;
            content.style.height = height + "px";
            const handleTransitionEnd = () => {
              content.removeEventListener("transitionend", handleTransitionEnd);
              content.style.height = "";
              content.style.overflow = "";
              isAnimating = false;
            };
            content.addEventListener("transitionend", handleTransitionEnd);
          });
        } else {
          const height = content.scrollHeight;
          content.style.height = height + "px";
          content.style.overflow = "hidden";
          requestAnimationFrame(() => {
            content.style.height = "0px";
            const handleTransitionEnd = () => {
              content.removeEventListener("transitionend", handleTransitionEnd);
              content.style.display = "none";
              content.style.height = "";
              content.style.overflow = "";
              isAnimating = false;
            };
            content.addEventListener("transitionend", handleTransitionEnd);
          });
        }
      }
      function toggle2() {
        setDisclosureState(!isOpen);
      }
      function open() {
        setDisclosureState(true);
      }
      function close() {
        setDisclosureState(false);
      }
      trigger2.addEventListener("click", handleTriggerClick);
      trigger2.addEventListener("keydown", handleKeydown);
      el._disclosure = {
        toggle: toggle2,
        open,
        close,
        get isOpen() {
          return isOpen;
        },
        get isAnimating() {
          return isAnimating;
        }
      };
      cleanup2(() => {
        trigger2.removeEventListener("click", handleTriggerClick);
        trigger2.removeEventListener("keydown", handleKeydown);
      });
    });
    Alpine2.magic("disclosure", (el) => {
      return el._disclosure || null;
    });
  }
  function animationUtilsPlugin(Alpine2) {
    Alpine2.magic("animate", () => ({
      fadeIn: (el, duration = 300) => {
        el.style.opacity = "0";
        el.style.transition = "opacity ".concat(duration, "ms ease-in-out");
        requestAnimationFrame(() => {
          el.style.opacity = "1";
        });
      },
      fadeOut: (el, duration = 300) => {
        el.style.transition = "opacity ".concat(duration, "ms ease-in-out");
        el.style.opacity = "0";
        setTimeout(() => {
          el.style.display = "none";
        }, duration);
      },
      slideDown: (el, duration = 300) => {
        el.style.height = "0px";
        el.style.overflow = "hidden";
        el.style.transition = "height ".concat(duration, "ms ease-in-out");
        requestAnimationFrame(() => {
          el.style.height = el.scrollHeight + "px";
        });
      },
      slideUp: (el, duration = 300) => {
        el.style.height = el.scrollHeight + "px";
        el.style.overflow = "hidden";
        el.style.transition = "height ".concat(duration, "ms ease-in-out");
        requestAnimationFrame(() => {
          el.style.height = "0px";
        });
      }
    }));
  }
  function motionPlugin(Alpine2) {
    Alpine2.directive("motion", (el, { expression, modifiers }, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
      let observer2 = null;
      let config = { threshold: 0.1, rootMargin: "0px" };
      if (expression) {
        const getConfig = evaluateLater2(expression);
        getConfig((value) => {
          config = __spreadValues(__spreadValues({}, config), value);
        });
      }
      observer2 = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            el.dispatchEvent(new CustomEvent("motion:enter"));
          } else {
            el.classList.remove("in-view");
            el.dispatchEvent(new CustomEvent("motion:leave"));
          }
        });
      }, config);
      observer2.observe(el);
      cleanup2(() => {
        if (observer2) {
          observer2.disconnect();
        }
      });
    });
  }
  function listStatePlugin(Alpine2) {
    Alpine2.directive("list-state", (el, { expression }, { evaluateLater: evaluateLater2, effect: effect3 }) => {
      let config = {};
      if (expression) {
        const getConfig = evaluateLater2(expression);
        effect3(() => {
          getConfig((value) => {
            config = value || {};
          });
        });
      }
      const listState = {
        items: [],
        filteredItems: [],
        selectedItems: [],
        sortBy: null,
        sortOrder: "asc",
        filters: {},
        // Filter items
        filter(filterFn) {
          this.filteredItems = this.items.filter(filterFn);
          this.updateDisplay();
        },
        // Sort items
        sort(key, order = "asc") {
          this.sortBy = key;
          this.sortOrder = order;
          this.filteredItems.sort((a2, b) => {
            const aVal = a2[key];
            const bVal = b[key];
            if (order === "asc") {
              return aVal > bVal ? 1 : -1;
            } else {
              return aVal < bVal ? 1 : -1;
            }
          });
          this.updateDisplay();
        },
        // Select item
        select(item) {
          if (!this.selectedItems.includes(item)) {
            this.selectedItems.push(item);
          }
        },
        // Deselect item
        deselect(item) {
          const index = this.selectedItems.indexOf(item);
          if (index > -1) {
            this.selectedItems.splice(index, 1);
          }
        },
        // Toggle selection
        toggle(item) {
          if (this.selectedItems.includes(item)) {
            this.deselect(item);
          } else {
            this.select(item);
          }
        },
        // Update display
        updateDisplay() {
          el.dispatchEvent(new CustomEvent("list:updated", {
            detail: {
              items: this.filteredItems,
              selected: this.selectedItems,
              total: this.items.length,
              filtered: this.filteredItems.length
            }
          }));
        }
      };
      el._listState = listState;
      if (config.items) {
        listState.items = config.items;
        listState.filteredItems = [...config.items];
        listState.updateDisplay();
      }
    });
    Alpine2.magic("listState", (el) => {
      return el._listState || null;
    });
  }
  function slideshowPlugin(Alpine2) {
    Alpine2.directive("slideshow", (el, { expression, modifiers }, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
      let currentSlide = 0;
      let slides = [];
      let autoplayInterval = null;
      let config = { autoplay: false, duration: 5e3 };
      if (expression) {
        const getConfig = evaluateLater2(expression);
        getConfig((value) => {
          config = __spreadValues(__spreadValues({}, config), value);
        });
      }
      const init = () => {
        slides = Array.from(el.querySelectorAll("[data-slide]"));
        if (slides.length === 0) return;
        showSlide(0);
        if (config.autoplay || modifiers.includes("autoplay")) {
          startAutoplay();
        }
      };
      const showSlide = (index) => {
        slides.forEach((slide2, i2) => {
          slide2.classList.toggle("active", i2 === index);
          slide2.setAttribute("aria-hidden", i2 !== index);
        });
        currentSlide = index;
        el.dispatchEvent(new CustomEvent("slideshow:changed", {
          detail: { currentSlide, totalSlides: slides.length }
        }));
      };
      const nextSlide = () => {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
      };
      const prevSlide = () => {
        const prev = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
        showSlide(prev);
      };
      const startAutoplay = () => {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, config.duration);
      };
      const stopAutoplay = () => {
        if (autoplayInterval) {
          clearInterval(autoplayInterval);
          autoplayInterval = null;
        }
      };
      el._slideshow = {
        next: nextSlide,
        prev: prevSlide,
        goTo: showSlide,
        startAutoplay,
        stopAutoplay,
        get currentSlide() {
          return currentSlide;
        },
        get totalSlides() {
          return slides.length;
        }
      };
      init();
      cleanup2(() => {
        stopAutoplay();
      });
    });
    Alpine2.magic("slideshow", (el) => {
      return el._slideshow || null;
    });
  }
  function sliderRevealPlugin(Alpine2) {
    Alpine2.directive("slider-reveal", (el, { expression, modifiers }, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
      let config = { duration: 300, easing: "ease-in-out" };
      let isRevealed = false;
      let slider = null;
      let content = null;
      if (expression) {
        const getConfig = evaluateLater2(expression);
        getConfig((value) => {
          config = __spreadValues(__spreadValues({}, config), value);
        });
      }
      const init = () => {
        slider = el.querySelector("[data-slider]");
        content = el.querySelector("[data-reveal-content]");
        if (!slider || !content) {
          console.warn("Slider reveal: missing slider or content elements");
          return;
        }
        content.style.height = "0px";
        content.style.overflow = "hidden";
        content.style.transition = "height ".concat(config.duration, "ms ").concat(config.easing);
        slider.addEventListener("input", handleSliderChange);
        slider.addEventListener("change", handleSliderChange);
      };
      const handleSliderChange = (event) => {
        const value = parseFloat(event.target.value);
        const max = parseFloat(event.target.max) || 100;
        const percentage = value / max;
        revealContent(percentage);
      };
      const revealContent = (percentage) => {
        if (!content) return;
        const maxHeight = content.scrollHeight;
        const targetHeight = maxHeight * Math.max(0, Math.min(1, percentage));
        content.style.height = "".concat(targetHeight, "px");
        const wasRevealed = isRevealed;
        isRevealed = percentage > 0.5;
        if (isRevealed !== wasRevealed) {
          el.classList.toggle("is-revealed", isRevealed);
          el.dispatchEvent(new CustomEvent(isRevealed ? "reveal:shown" : "reveal:hidden", {
            detail: { percentage, height: targetHeight }
          }));
        }
        el.dispatchEvent(new CustomEvent("reveal:progress", {
          detail: { percentage, height: targetHeight }
        }));
      };
      el._sliderReveal = {
        reveal: (percentage = 1) => revealContent(percentage),
        hide: () => revealContent(0),
        toggle: () => revealContent(isRevealed ? 0 : 1),
        get isRevealed() {
          return isRevealed;
        }
      };
      init();
      cleanup2(() => {
        if (slider) {
          slider.removeEventListener("input", handleSliderChange);
          slider.removeEventListener("change", handleSliderChange);
        }
      });
    });
    Alpine2.magic("sliderReveal", (el) => {
      return el._sliderReveal || null;
    });
  }
  function clonePlugin(Alpine2) {
    Alpine2.directive("clone", (el, { expression, modifiers }, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
      let cloneTarget = null;
      let cloneContainer = null;
      if (expression) {
        const getConfig = evaluateLater2(expression);
        getConfig((config) => {
          if (typeof config === "string") {
            cloneTarget = document.querySelector(config);
          } else if (config && typeof config === "object") {
            cloneTarget = config.target ? document.querySelector(config.target) : null;
            cloneContainer = config.container ? document.querySelector(config.container) : el;
          }
        });
      }
      if (!cloneTarget) {
        cloneTarget = el;
      }
      if (!cloneContainer) {
        cloneContainer = el.parentElement;
      }
      const cloneElement = () => {
        if (!cloneTarget || !cloneContainer) return null;
        const clone2 = cloneTarget.cloneNode(true);
        if (clone2.id) {
          clone2.removeAttribute("id");
        }
        clone2.classList.add("is-clone");
        if (modifiers.includes("append")) {
          cloneContainer.appendChild(clone2);
        } else if (modifiers.includes("prepend")) {
          cloneContainer.insertBefore(clone2, cloneContainer.firstChild);
        } else {
          cloneContainer.appendChild(clone2);
        }
        el.dispatchEvent(new CustomEvent("clone:created", {
          detail: { clone: clone2, target: cloneTarget, container: cloneContainer }
        }));
        return clone2;
      };
      if (modifiers.includes("auto")) {
        cloneElement();
      }
      el._clone = {
        create: cloneElement,
        target: cloneTarget,
        container: cloneContainer
      };
    });
    Alpine2.magic("clone", (el) => {
      return el._clone || null;
    });
  }
  function moveModals(container) {
    const modals = container.querySelectorAll("[data-modal]");
    const modalBin = document.querySelector("[data-modal-container]");
    if (!modalBin) {
      console.warn("Modal container not found. Please add [data-modal-container] to your layout.");
      return;
    }
    modals.forEach((element) => {
      const alreadyAdded = modalBin.querySelector('[id="'.concat(element.id, '"]'));
      if (!alreadyAdded) {
        modalBin.appendChild(element);
      }
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    moveModals(document);
  });
  function floatLabels(container) {
    const floats = container.querySelectorAll(".float__wrapper");
    floats.forEach((element) => {
      const label = element.querySelector("label");
      const input = element.querySelector("input, textarea");
      if (!label || !input) return;
      const handleInput = (event) => {
        if (event.target.value !== "") {
          label.classList.add("label--float");
        } else {
          label.classList.remove("label--float");
        }
      };
      input.addEventListener("keyup", handleInput);
      input.addEventListener("change", handleInput);
      input.addEventListener("blur", handleInput);
      if (input.value && input.value.length) {
        label.classList.add("label--float");
      }
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    floatLabels(document);
  });
  function errorTabIndex(container) {
    const errata = container.querySelectorAll(".errors");
    errata.forEach((element) => {
      element.setAttribute("tabindex", "0");
      element.setAttribute("aria-live", "assertive");
      element.setAttribute("role", "alert");
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    errorTabIndex(document);
  });
  const selectors = {
    holderItems: "[data-custom-scrollbar-items]",
    scrollbar: "[data-custom-scrollbar]",
    scrollbarTrack: "[data-custom-scrollbar-track]"
  };
  const classes = {
    hide: "hide"
  };
  function initCustomScrollbar(container) {
    const scrollbarElements = container.querySelectorAll(selectors.scrollbar);
    scrollbarElements.forEach((scrollbar) => {
      const items = scrollbar.querySelector(selectors.holderItems);
      const track2 = scrollbar.querySelector(selectors.scrollbarTrack);
      if (!items || !track2) return;
      const updateScrollbar = () => {
        const scrollWidth = items.scrollWidth;
        const clientWidth = items.clientWidth;
        const scrollLeft = items.scrollLeft;
        if (scrollWidth <= clientWidth) {
          scrollbar.classList.add(classes.hide);
          return;
        } else {
          scrollbar.classList.remove(classes.hide);
        }
        const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
        const trackWidth = track2.offsetWidth;
        const maxTrackPosition = scrollbar.offsetWidth - trackWidth;
        track2.style.transform = "translateX(".concat(scrollPercentage * maxTrackPosition, "px)");
      };
      items.addEventListener("scroll", updateScrollbar);
      window.addEventListener("resize", updateScrollbar);
      updateScrollbar();
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    initCustomScrollbar(document);
  });
  module_default.data("announcement", announcement);
  module_default.data("announcementSlider", announcementSlider);
  module_default.data("announcementTicker", announcementTicker);
  module_default.data("productAddButtonForm", productAddButtonForm);
  module_default.data("productQuickViewButton", productQuickViewButton);
  module_default.data("productGridItemQuickAddMenu", productGridItemQuickAddMenu);
  module_default.data("toggle", toggle);
  module_default.data("tabs", tabs);
  module_default.data("overflow", overflow);
  module_default.directive("target-referrer", targetReferrer);
  module_default.plugin(flickityPlugin);
  module_default.plugin(sectionPlugin);
  module_default.plugin(ensemblePlugin);
  module_default.plugin(holdPlugin);
  module_default.plugin(marqueePlugin);
  module_default.plugin(themeEditorPlugin);
  module_default.plugin(disclosurePlugin);
  module_default.plugin(animationUtilsPlugin);
  module_default.plugin(motionPlugin);
  module_default.plugin(listStatePlugin);
  module_default.plugin(slideshowPlugin);
  module_default.plugin(sliderRevealPlugin);
  module_default.plugin(clonePlugin);
  module_default.start();
  window.Alpine = module_default;
})();
//# sourceMappingURL=theme.js.map
