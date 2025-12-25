var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@hono/node-server/dist/vercel.mjs
import { Http2ServerRequest as Http2ServerRequest2 } from "http2";
import { Http2ServerRequest } from "http2";
import { Readable } from "stream";
import crypto from "crypto";
var RequestError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "RequestError";
  }
};
var toRequestError = (e) => {
  if (e instanceof RequestError) {
    return e;
  }
  return new RequestError(e.message, { cause: e });
};
var GlobalRequest = global.Request;
var Request2 = class extends GlobalRequest {
  constructor(input3, options) {
    if (typeof input3 === "object" && getRequestCache in input3) {
      input3 = input3[getRequestCache]();
    }
    if (typeof options?.body?.getReader !== "undefined") {
      ;
      options.duplex ??= "half";
    }
    super(input3, options);
  }
};
var newHeadersFromIncoming = (incoming) => {
  const headerRecord = [];
  const rawHeaders = incoming.rawHeaders;
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const { [i]: key, [i + 1]: value } = rawHeaders;
    if (key.charCodeAt(0) !== /*:*/
    58) {
      headerRecord.push([key, value]);
    }
  }
  return new Headers(headerRecord);
};
var wrapBodyStream = /* @__PURE__ */ Symbol("wrapBodyStream");
var newRequestFromIncoming = (method, url, headers, incoming, abortController) => {
  const init = {
    method,
    headers,
    signal: abortController.signal
  };
  if (method === "TRACE") {
    init.method = "GET";
    const req = new Request2(url, init);
    Object.defineProperty(req, "method", {
      get() {
        return "TRACE";
      }
    });
    return req;
  }
  if (!(method === "GET" || method === "HEAD")) {
    if ("rawBody" in incoming && incoming.rawBody instanceof Buffer) {
      init.body = new ReadableStream({
        start(controller) {
          controller.enqueue(incoming.rawBody);
          controller.close();
        }
      });
    } else if (incoming[wrapBodyStream]) {
      let reader;
      init.body = new ReadableStream({
        async pull(controller) {
          try {
            reader ||= Readable.toWeb(incoming).getReader();
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
            } else {
              controller.enqueue(value);
            }
          } catch (error) {
            controller.error(error);
          }
        }
      });
    } else {
      init.body = Readable.toWeb(incoming);
    }
  }
  return new Request2(url, init);
};
var getRequestCache = /* @__PURE__ */ Symbol("getRequestCache");
var requestCache = /* @__PURE__ */ Symbol("requestCache");
var incomingKey = /* @__PURE__ */ Symbol("incomingKey");
var urlKey = /* @__PURE__ */ Symbol("urlKey");
var headersKey = /* @__PURE__ */ Symbol("headersKey");
var abortControllerKey = /* @__PURE__ */ Symbol("abortControllerKey");
var getAbortController = /* @__PURE__ */ Symbol("getAbortController");
var requestPrototype = {
  get method() {
    return this[incomingKey].method || "GET";
  },
  get url() {
    return this[urlKey];
  },
  get headers() {
    return this[headersKey] ||= newHeadersFromIncoming(this[incomingKey]);
  },
  [getAbortController]() {
    this[getRequestCache]();
    return this[abortControllerKey];
  },
  [getRequestCache]() {
    this[abortControllerKey] ||= new AbortController();
    return this[requestCache] ||= newRequestFromIncoming(
      this.method,
      this[urlKey],
      this.headers,
      this[incomingKey],
      this[abortControllerKey]
    );
  }
};
[
  "body",
  "bodyUsed",
  "cache",
  "credentials",
  "destination",
  "integrity",
  "mode",
  "redirect",
  "referrer",
  "referrerPolicy",
  "signal",
  "keepalive"
].forEach((k) => {
  Object.defineProperty(requestPrototype, k, {
    get() {
      return this[getRequestCache]()[k];
    }
  });
});
["arrayBuffer", "blob", "clone", "formData", "json", "text"].forEach((k) => {
  Object.defineProperty(requestPrototype, k, {
    value: function() {
      return this[getRequestCache]()[k]();
    }
  });
});
Object.setPrototypeOf(requestPrototype, Request2.prototype);
var newRequest = (incoming, defaultHostname) => {
  const req = Object.create(requestPrototype);
  req[incomingKey] = incoming;
  const incomingUrl = incoming.url || "";
  if (incomingUrl[0] !== "/" && // short-circuit for performance. most requests are relative URL.
  (incomingUrl.startsWith("http://") || incomingUrl.startsWith("https://"))) {
    if (incoming instanceof Http2ServerRequest) {
      throw new RequestError("Absolute URL for :path is not allowed in HTTP/2");
    }
    try {
      const url2 = new URL(incomingUrl);
      req[urlKey] = url2.href;
    } catch (e) {
      throw new RequestError("Invalid absolute URL", { cause: e });
    }
    return req;
  }
  const host = (incoming instanceof Http2ServerRequest ? incoming.authority : incoming.headers.host) || defaultHostname;
  if (!host) {
    throw new RequestError("Missing host header");
  }
  let scheme;
  if (incoming instanceof Http2ServerRequest) {
    scheme = incoming.scheme;
    if (!(scheme === "http" || scheme === "https")) {
      throw new RequestError("Unsupported scheme");
    }
  } else {
    scheme = incoming.socket && incoming.socket.encrypted ? "https" : "http";
  }
  const url = new URL(`${scheme}://${host}${incomingUrl}`);
  if (url.hostname.length !== host.length && url.hostname !== host.replace(/:\d+$/, "")) {
    throw new RequestError("Invalid host header");
  }
  req[urlKey] = url.href;
  return req;
};
var responseCache = /* @__PURE__ */ Symbol("responseCache");
var getResponseCache = /* @__PURE__ */ Symbol("getResponseCache");
var cacheKey = /* @__PURE__ */ Symbol("cache");
var GlobalResponse = global.Response;
var Response2 = class _Response {
  #body;
  #init;
  [getResponseCache]() {
    delete this[cacheKey];
    return this[responseCache] ||= new GlobalResponse(this.#body, this.#init);
  }
  constructor(body, init) {
    let headers;
    this.#body = body;
    if (init instanceof _Response) {
      const cachedGlobalResponse = init[responseCache];
      if (cachedGlobalResponse) {
        this.#init = cachedGlobalResponse;
        this[getResponseCache]();
        return;
      } else {
        this.#init = init.#init;
        headers = new Headers(init.#init.headers);
      }
    } else {
      this.#init = init;
    }
    if (typeof body === "string" || typeof body?.getReader !== "undefined" || body instanceof Blob || body instanceof Uint8Array) {
      headers ||= init?.headers || { "content-type": "text/plain; charset=UTF-8" };
      this[cacheKey] = [init?.status || 200, body, headers];
    }
  }
  get headers() {
    const cache = this[cacheKey];
    if (cache) {
      if (!(cache[2] instanceof Headers)) {
        cache[2] = new Headers(cache[2]);
      }
      return cache[2];
    }
    return this[getResponseCache]().headers;
  }
  get status() {
    return this[cacheKey]?.[0] ?? this[getResponseCache]().status;
  }
  get ok() {
    const status = this.status;
    return status >= 200 && status < 300;
  }
};
["body", "bodyUsed", "redirected", "statusText", "trailers", "type", "url"].forEach((k) => {
  Object.defineProperty(Response2.prototype, k, {
    get() {
      return this[getResponseCache]()[k];
    }
  });
});
["arrayBuffer", "blob", "clone", "formData", "json", "text"].forEach((k) => {
  Object.defineProperty(Response2.prototype, k, {
    value: function() {
      return this[getResponseCache]()[k]();
    }
  });
});
Object.setPrototypeOf(Response2, GlobalResponse);
Object.setPrototypeOf(Response2.prototype, GlobalResponse.prototype);
async function readWithoutBlocking(readPromise) {
  return Promise.race([readPromise, Promise.resolve().then(() => Promise.resolve(void 0))]);
}
function writeFromReadableStreamDefaultReader(reader, writable, currentReadPromise) {
  const cancel = (error) => {
    reader.cancel(error).catch(() => {
    });
  };
  writable.on("close", cancel);
  writable.on("error", cancel);
  (currentReadPromise ?? reader.read()).then(flow, handleStreamError);
  return reader.closed.finally(() => {
    writable.off("close", cancel);
    writable.off("error", cancel);
  });
  function handleStreamError(error) {
    if (error) {
      writable.destroy(error);
    }
  }
  function onDrain() {
    reader.read().then(flow, handleStreamError);
  }
  function flow({ done, value }) {
    try {
      if (done) {
        writable.end();
      } else if (!writable.write(value)) {
        writable.once("drain", onDrain);
      } else {
        return reader.read().then(flow, handleStreamError);
      }
    } catch (e) {
      handleStreamError(e);
    }
  }
}
function writeFromReadableStream(stream, writable) {
  if (stream.locked) {
    throw new TypeError("ReadableStream is locked.");
  } else if (writable.destroyed) {
    return;
  }
  return writeFromReadableStreamDefaultReader(stream.getReader(), writable);
}
var buildOutgoingHttpHeaders = (headers) => {
  const res = {};
  if (!(headers instanceof Headers)) {
    headers = new Headers(headers ?? void 0);
  }
  const cookies = [];
  for (const [k, v] of headers) {
    if (k === "set-cookie") {
      cookies.push(v);
    } else {
      res[k] = v;
    }
  }
  if (cookies.length > 0) {
    res["set-cookie"] = cookies;
  }
  res["content-type"] ??= "text/plain; charset=UTF-8";
  return res;
};
var X_ALREADY_SENT = "x-hono-already-sent";
var webFetch = global.fetch;
if (typeof global.crypto === "undefined") {
  global.crypto = crypto;
}
global.fetch = (info, init) => {
  init = {
    // Disable compression handling so people can return the result of a fetch
    // directly in the loader without messing with the Content-Encoding header.
    compress: false,
    ...init
  };
  return webFetch(info, init);
};
var outgoingEnded = /* @__PURE__ */ Symbol("outgoingEnded");
var handleRequestError = () => new Response(null, {
  status: 400
});
var handleFetchError = (e) => new Response(null, {
  status: e instanceof Error && (e.name === "TimeoutError" || e.constructor.name === "TimeoutError") ? 504 : 500
});
var handleResponseError = (e, outgoing) => {
  const err = e instanceof Error ? e : new Error("unknown error", { cause: e });
  if (err.code === "ERR_STREAM_PREMATURE_CLOSE") {
    console.info("The user aborted a request.");
  } else {
    console.error(e);
    if (!outgoing.headersSent) {
      outgoing.writeHead(500, { "Content-Type": "text/plain" });
    }
    outgoing.end(`Error: ${err.message}`);
    outgoing.destroy(err);
  }
};
var flushHeaders = (outgoing) => {
  if ("flushHeaders" in outgoing && outgoing.writable) {
    outgoing.flushHeaders();
  }
};
var responseViaCache = async (res, outgoing) => {
  let [status, body, header] = res[cacheKey];
  if (header instanceof Headers) {
    header = buildOutgoingHttpHeaders(header);
  }
  if (typeof body === "string") {
    header["Content-Length"] = Buffer.byteLength(body);
  } else if (body instanceof Uint8Array) {
    header["Content-Length"] = body.byteLength;
  } else if (body instanceof Blob) {
    header["Content-Length"] = body.size;
  }
  outgoing.writeHead(status, header);
  if (typeof body === "string" || body instanceof Uint8Array) {
    outgoing.end(body);
  } else if (body instanceof Blob) {
    outgoing.end(new Uint8Array(await body.arrayBuffer()));
  } else {
    flushHeaders(outgoing);
    await writeFromReadableStream(body, outgoing)?.catch(
      (e) => handleResponseError(e, outgoing)
    );
  }
  ;
  outgoing[outgoingEnded]?.();
};
var isPromise = (res) => typeof res.then === "function";
var responseViaResponseObject = async (res, outgoing, options = {}) => {
  if (isPromise(res)) {
    if (options.errorHandler) {
      try {
        res = await res;
      } catch (err) {
        const errRes = await options.errorHandler(err);
        if (!errRes) {
          return;
        }
        res = errRes;
      }
    } else {
      res = await res.catch(handleFetchError);
    }
  }
  if (cacheKey in res) {
    return responseViaCache(res, outgoing);
  }
  const resHeaderRecord = buildOutgoingHttpHeaders(res.headers);
  if (res.body) {
    const reader = res.body.getReader();
    const values = [];
    let done = false;
    let currentReadPromise = void 0;
    if (resHeaderRecord["transfer-encoding"] !== "chunked") {
      let maxReadCount = 2;
      for (let i = 0; i < maxReadCount; i++) {
        currentReadPromise ||= reader.read();
        const chunk = await readWithoutBlocking(currentReadPromise).catch((e) => {
          console.error(e);
          done = true;
        });
        if (!chunk) {
          if (i === 1) {
            await new Promise((resolve) => setTimeout(resolve));
            maxReadCount = 3;
            continue;
          }
          break;
        }
        currentReadPromise = void 0;
        if (chunk.value) {
          values.push(chunk.value);
        }
        if (chunk.done) {
          done = true;
          break;
        }
      }
      if (done && !("content-length" in resHeaderRecord)) {
        resHeaderRecord["content-length"] = values.reduce((acc, value) => acc + value.length, 0);
      }
    }
    outgoing.writeHead(res.status, resHeaderRecord);
    values.forEach((value) => {
      ;
      outgoing.write(value);
    });
    if (done) {
      outgoing.end();
    } else {
      if (values.length === 0) {
        flushHeaders(outgoing);
      }
      await writeFromReadableStreamDefaultReader(reader, outgoing, currentReadPromise);
    }
  } else if (resHeaderRecord[X_ALREADY_SENT]) {
  } else {
    outgoing.writeHead(res.status, resHeaderRecord);
    outgoing.end();
  }
  ;
  outgoing[outgoingEnded]?.();
};
var getRequestListener = (fetchCallback, options = {}) => {
  const autoCleanupIncoming = options.autoCleanupIncoming ?? true;
  if (options.overrideGlobalObjects !== false && global.Request !== Request2) {
    Object.defineProperty(global, "Request", {
      value: Request2
    });
    Object.defineProperty(global, "Response", {
      value: Response2
    });
  }
  return async (incoming, outgoing) => {
    let res, req;
    try {
      req = newRequest(incoming, options.hostname);
      let incomingEnded = !autoCleanupIncoming || incoming.method === "GET" || incoming.method === "HEAD";
      if (!incomingEnded) {
        ;
        incoming[wrapBodyStream] = true;
        incoming.on("end", () => {
          incomingEnded = true;
        });
        if (incoming instanceof Http2ServerRequest2) {
          ;
          outgoing[outgoingEnded] = () => {
            if (!incomingEnded) {
              setTimeout(() => {
                if (!incomingEnded) {
                  setTimeout(() => {
                    incoming.destroy();
                    outgoing.destroy();
                  });
                }
              });
            }
          };
        }
      }
      outgoing.on("close", () => {
        const abortController = req[abortControllerKey];
        if (abortController) {
          if (incoming.errored) {
            req[abortControllerKey].abort(incoming.errored.toString());
          } else if (!outgoing.writableFinished) {
            req[abortControllerKey].abort("Client connection prematurely closed.");
          }
        }
        if (!incomingEnded) {
          setTimeout(() => {
            if (!incomingEnded) {
              setTimeout(() => {
                incoming.destroy();
              });
            }
          });
        }
      });
      res = fetchCallback(req, { incoming, outgoing });
      if (cacheKey in res) {
        return responseViaCache(res, outgoing);
      }
    } catch (e) {
      if (!res) {
        if (options.errorHandler) {
          res = await options.errorHandler(req ? e : toRequestError(e));
          if (!res) {
            return;
          }
        } else if (!req) {
          res = handleRequestError();
        } else {
          res = handleFetchError(e);
        }
      } else {
        return handleResponseError(e, outgoing);
      }
    }
    try {
      return await responseViaResponseObject(res, outgoing, options);
    } catch (e) {
      return handleResponseError(e, outgoing);
    }
  };
};
var handle = (app2) => {
  return getRequestListener(app2.fetch);
};

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form3 = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form3[key] = value;
    } else {
      handleParsingAllValues(form3, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form3).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form3, key, value);
        delete form3[key];
      }
    });
  }
  return form3;
}
var handleParsingAllValues = (form3, key, value) => {
  if (form3[key] !== void 0) {
    if (Array.isArray(form3[key])) {
      ;
      form3[key].push(value);
    } else {
      form3[key] = [form3[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form3[key] = value;
    } else {
      form3[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form3, key, value) => {
  let nestedForm = form3;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path2) => {
  const paths = path2.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path: path2 } = extractGroupsFromPath(routePath);
  const paths = splitPath(path2);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path2) => {
  const groups = [];
  path2 = path2.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path: path2 };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey2 = `${label}#${next}`;
    if (!patternCache[cacheKey2]) {
      if (match2[2]) {
        patternCache[cacheKey2] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey2, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey2] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey2];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path2 = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path2.includes("%25") ? path2.replace(/%25/g, "%2525") : path2);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path2) => {
  if (path2.charCodeAt(path2.length - 1) !== 63 || !path2.includes(":")) {
    return null;
  }
  const segments = path2.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path2 = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path2;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var escapeRe = /[&<>'"]/;
var stringBufferToString = async (buffer, callbacks) => {
  let str = "";
  callbacks ||= [];
  const resolvedBuffer = await Promise.all(buffer);
  for (let i = resolvedBuffer.length - 1; ; i--) {
    str += resolvedBuffer[i];
    i--;
    if (i < 0) {
      break;
    }
    let r = resolvedBuffer[i];
    if (typeof r === "object") {
      callbacks.push(...r.callbacks || []);
    }
    const isEscaped = r.isEscaped;
    r = await (typeof r === "object" ? r.toString() : r);
    if (typeof r === "object") {
      callbacks.push(...r.callbacks || []);
    }
    if (r.isEscaped ?? isEscaped) {
      str += r;
    } else {
      const buf = [str];
      escapeToBuffer(r, buf);
      str = buf[0];
    }
  }
  return raw(str, callbacks);
};
var escapeToBuffer = (str, buffer) => {
  const match2 = str.search(escapeRe);
  if (match2 === -1) {
    buffer[0] += str;
    return;
  }
  let escape;
  let index;
  let lastIndex = 0;
  for (index = match2; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        escape = "&quot;";
        break;
      case 39:
        escape = "&#39;";
        break;
      case 38:
        escape = "&amp;";
        break;
      case 60:
        escape = "&lt;";
        break;
      case 62:
        escape = "&gt;";
        break;
      default:
        continue;
    }
    buffer[0] += str.substring(lastIndex, index) + escape;
    lastIndex = index + 1;
  }
  buffer[0] += str.substring(lastIndex, index);
};
var resolveCallbackSync = (str) => {
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return str;
  }
  const buffer = [str];
  const context = {};
  callbacks.forEach((c) => c({ phase: HtmlEscapedCallbackPhase.Stringify, buffer, context }));
  return buffer[0];
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var Context = class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path2, ...handlers) => {
      for (const p of [path2].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path2, app2) {
    const subApp = this.basePath(path2);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path2) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path2);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path2, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path2);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path2, "*"), handler);
    return this;
  }
  #addRoute(method, path2, handler) {
    method = method.toUpperCase();
    path2 = mergePath(this._basePath, path2);
    const r = { basePath: this._basePath, path: path2, method, handler };
    this.router.add(method, path2, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path2 = this.getPath(request, { env });
    const matchResult = this.router.match(method, path2);
    const c = new Context(request, {
      path: path2,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input3, requestInit, Env, executionCtx) => {
    if (input3 instanceof Request) {
      return this.fetch(requestInit ? new Request(input3, requestInit) : input3, Env, executionCtx);
    }
    input3 = input3.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input3) ? input3 : `http://localhost${mergePath("/", input3)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path2) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path22) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path22];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path22.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  });
  this.match = match2;
  return match2(method, path2);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path2, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path2 = path2.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path2.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path2) {
  return wildcardRegExpCache[path2] ??= new RegExp(
    path2 === "*" ? "" : `^${path2.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path2, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path2] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path2, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path2) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path2) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path2)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path2, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path2 === "/*") {
      path2 = "*";
    }
    const paramCount = (path2.match(/\/:/g) || []).length;
    if (/\*$/.test(path2)) {
      const re = buildWildcardRegExp(path2);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path2] ||= findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || [];
        });
      } else {
        middleware[method][path2] ||= findMiddleware(middleware[method], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path2) || [path2];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path22 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path22] ||= [
            ...findMiddleware(middleware[m], path22) || findMiddleware(middleware[METHOD_NAME_ALL], path22) || []
          ];
          routes[m][path22].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path2) => [path2, r[method][path2]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path2) => [path2, r[METHOD_NAME_ALL][path2]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path2, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path2, handler]);
  }
  match(method, path2) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router2 = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router2.add(...routes[i2]);
        }
        res = router2.match(method, path2);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router2.match.bind(router2);
      this.#routers = [router2];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path2, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path2);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path2) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path2);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path2, handler) {
    const results = checkOptionalParameter(path2);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path2, handler);
  }
  match(method, path2) {
    return this.#node.search(method, path2);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/trailing-slash/index.js
var trimTrailingSlash = () => {
  return async function trimTrailingSlash2(c, next) {
    await next();
    if (c.res.status === 404 && (c.req.method === "GET" || c.req.method === "HEAD") && c.req.path !== "/" && c.req.path.at(-1) === "/") {
      const url = new URL(c.req.url);
      url.pathname = url.pathname.substring(0, url.pathname.length - 1);
      c.res = c.redirect(url.toString(), 301);
    }
  };
};

// node_modules/hono/dist/utils/color.js
function getColorEnabled() {
  const { process: process2, Deno } = globalThis;
  const isNoColor = typeof Deno?.noColor === "boolean" ? Deno.noColor : process2 !== void 0 ? (
    // eslint-disable-next-line no-unsafe-optional-chaining
    "NO_COLOR" in process2?.env
  ) : false;
  return !isNoColor;
}
async function getColorEnabledAsync() {
  const { navigator } = globalThis;
  const cfWorkers = "cloudflare:workers";
  const isNoColor = navigator !== void 0 && navigator.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(cfWorkers)).env ?? {});
    } catch {
      return false;
    }
  })() : !getColorEnabled();
  return !isNoColor;
}

// node_modules/hono/dist/middleware/logger/index.js
var humanize = (times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
};
var time = (start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
};
var colorStatus = async (status) => {
  const colorEnabled = await getColorEnabledAsync();
  if (colorEnabled) {
    switch (status / 100 | 0) {
      case 5:
        return `\x1B[31m${status}\x1B[0m`;
      case 4:
        return `\x1B[33m${status}\x1B[0m`;
      case 3:
        return `\x1B[36m${status}\x1B[0m`;
      case 2:
        return `\x1B[32m${status}\x1B[0m`;
    }
  }
  return `${status}`;
};
async function log(fn, prefix, method, path2, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path2}` : `${prefix} ${method} ${path2} ${await colorStatus(status)} ${elapsed}`;
  fn(out);
}
var logger = (fn = console.log) => {
  return async function logger2(c, next) {
    const { method, url } = c.req;
    const path2 = url.slice(url.indexOf("/", 8));
    await log(fn, "<--", method, path2);
    const start = Date.now();
    await next();
    await log(fn, "-->", method, path2, c.res.status, time(start));
  };
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  };
};

// src/database/config.js
import Database from "better-sqlite3";
import { join } from "path";
import fs from "fs";
var isProduction = process.env.VERCEL === "1";
var db;
var dbInitialized = false;
var initializeDatabase = () => {
  if (dbInitialized && db) return db;
  try {
    let dbPath;
    if (isProduction) {
      const tmpDbPath = "/tmp/alquran.db";
      const sourceDbPath = join(process.cwd(), "src", "database", "alquran.db");
      console.log("Production mode - copying DB to /tmp");
      if (!fs.existsSync(tmpDbPath)) {
        if (!fs.existsSync(sourceDbPath)) {
          throw new Error(`Source database not found: ${sourceDbPath}`);
        }
        fs.copyFileSync(sourceDbPath, tmpDbPath);
        console.log("Database copied to /tmp");
      }
      dbPath = tmpDbPath;
    } else {
      dbPath = join(process.cwd(), "src", "database", "alquran.db");
    }
    console.log(`Initializing database at: ${dbPath}`);
    db = new Database(dbPath, {
      readonly: true,
      fileMustExist: true
    });
    db.pragma("journal_mode = OFF");
    db.pragma("query_only = ON");
    db.pragma("synchronous = OFF");
    db.pragma("temp_store = MEMORY");
    db.pragma("cache_size = -8000");
    dbInitialized = true;
    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};
var query = async (sql, params = []) => {
  const database = initializeDatabase();
  const stmt = database.prepare(sql);
  return stmt.all(params);
};
var get = async (sql, params = []) => {
  const database = initializeDatabase();
  const stmt = database.prepare(sql);
  return stmt.get(params);
};

// node_modules/hono/dist/jsx/constants.js
var DOM_RENDERER = /* @__PURE__ */ Symbol("RENDERER");
var DOM_ERROR_HANDLER = /* @__PURE__ */ Symbol("ERROR_HANDLER");
var DOM_STASH = /* @__PURE__ */ Symbol("STASH");
var DOM_INTERNAL_TAG = /* @__PURE__ */ Symbol("INTERNAL");
var DOM_MEMO = /* @__PURE__ */ Symbol("MEMO");
var PERMALINK = /* @__PURE__ */ Symbol("PERMALINK");

// node_modules/hono/dist/jsx/dom/utils.js
var setInternalTagFlag = (fn) => {
  ;
  fn[DOM_INTERNAL_TAG] = true;
  return fn;
};

// node_modules/hono/dist/jsx/dom/context.js
var createContextProviderFunction = (values) => ({ value, children }) => {
  if (!children) {
    return void 0;
  }
  const props = {
    children: [
      {
        tag: setInternalTagFlag(() => {
          values.push(value);
        }),
        props: {}
      }
    ]
  };
  if (Array.isArray(children)) {
    props.children.push(...children.flat());
  } else {
    props.children.push(children);
  }
  props.children.push({
    tag: setInternalTagFlag(() => {
      values.pop();
    }),
    props: {}
  });
  const res = { tag: "", props, type: "" };
  res[DOM_ERROR_HANDLER] = (err) => {
    values.pop();
    throw err;
  };
  return res;
};
var createContext = (defaultValue) => {
  const values = [defaultValue];
  const context = createContextProviderFunction(values);
  context.values = values;
  context.Provider = context;
  globalContexts.push(context);
  return context;
};

// node_modules/hono/dist/jsx/context.js
var globalContexts = [];
var createContext2 = (defaultValue) => {
  const values = [defaultValue];
  const context = ((props) => {
    values.push(props.value);
    let string;
    try {
      string = props.children ? (Array.isArray(props.children) ? new JSXFragmentNode("", {}, props.children) : props.children).toString() : "";
    } finally {
      values.pop();
    }
    if (string instanceof Promise) {
      return string.then((resString) => raw(resString, resString.callbacks));
    } else {
      return raw(string);
    }
  });
  context.values = values;
  context.Provider = context;
  context[DOM_RENDERER] = createContextProviderFunction(values);
  globalContexts.push(context);
  return context;
};
var useContext = (context) => {
  return context.values.at(-1);
};

// node_modules/hono/dist/jsx/intrinsic-element/common.js
var deDupeKeyMap = {
  title: [],
  script: ["src"],
  style: ["data-href"],
  link: ["href"],
  meta: ["name", "httpEquiv", "charset", "itemProp"]
};
var domRenderers = {};
var dataPrecedenceAttr = "data-precedence";

// node_modules/hono/dist/jsx/intrinsic-element/components.js
var components_exports = {};
__export(components_exports, {
  button: () => button,
  form: () => form,
  input: () => input,
  link: () => link,
  meta: () => meta,
  script: () => script,
  style: () => style,
  title: () => title
});

// node_modules/hono/dist/jsx/children.js
var toArray = (children) => Array.isArray(children) ? children : [children];

// node_modules/hono/dist/jsx/intrinsic-element/components.js
var metaTagMap = /* @__PURE__ */ new WeakMap();
var insertIntoHead = (tagName, tag, props, precedence) => ({ buffer, context }) => {
  if (!buffer) {
    return;
  }
  const map = metaTagMap.get(context) || {};
  metaTagMap.set(context, map);
  const tags = map[tagName] ||= [];
  let duped = false;
  const deDupeKeys = deDupeKeyMap[tagName];
  if (deDupeKeys.length > 0) {
    LOOP: for (const [, tagProps] of tags) {
      for (const key of deDupeKeys) {
        if ((tagProps?.[key] ?? null) === props?.[key]) {
          duped = true;
          break LOOP;
        }
      }
    }
  }
  if (duped) {
    buffer[0] = buffer[0].replaceAll(tag, "");
  } else if (deDupeKeys.length > 0) {
    tags.push([tag, props, precedence]);
  } else {
    tags.unshift([tag, props, precedence]);
  }
  if (buffer[0].indexOf("</head>") !== -1) {
    let insertTags;
    if (precedence === void 0) {
      insertTags = tags.map(([tag2]) => tag2);
    } else {
      const precedences = [];
      insertTags = tags.map(([tag2, , precedence2]) => {
        let order = precedences.indexOf(precedence2);
        if (order === -1) {
          precedences.push(precedence2);
          order = precedences.length - 1;
        }
        return [tag2, order];
      }).sort((a, b) => a[1] - b[1]).map(([tag2]) => tag2);
    }
    insertTags.forEach((tag2) => {
      buffer[0] = buffer[0].replaceAll(tag2, "");
    });
    buffer[0] = buffer[0].replace(/(?=<\/head>)/, insertTags.join(""));
  }
};
var returnWithoutSpecialBehavior = (tag, children, props) => raw(new JSXNode(tag, props, toArray(children ?? [])).toString());
var documentMetadataTag = (tag, children, props, sort) => {
  if ("itemProp" in props) {
    return returnWithoutSpecialBehavior(tag, children, props);
  }
  let { precedence, blocking, ...restProps } = props;
  precedence = sort ? precedence ?? "" : void 0;
  if (sort) {
    restProps[dataPrecedenceAttr] = precedence;
  }
  const string = new JSXNode(tag, restProps, toArray(children || [])).toString();
  if (string instanceof Promise) {
    return string.then(
      (resString) => raw(string, [
        ...resString.callbacks || [],
        insertIntoHead(tag, resString, restProps, precedence)
      ])
    );
  } else {
    return raw(string, [insertIntoHead(tag, string, restProps, precedence)]);
  }
};
var title = ({ children, ...props }) => {
  const nameSpaceContext3 = getNameSpaceContext();
  if (nameSpaceContext3) {
    const context = useContext(nameSpaceContext3);
    if (context === "svg" || context === "head") {
      return new JSXNode(
        "title",
        props,
        toArray(children ?? [])
      );
    }
  }
  return documentMetadataTag("title", children, props, false);
};
var script = ({
  children,
  ...props
}) => {
  const nameSpaceContext3 = getNameSpaceContext();
  if (["src", "async"].some((k) => !props[k]) || nameSpaceContext3 && useContext(nameSpaceContext3) === "head") {
    return returnWithoutSpecialBehavior("script", children, props);
  }
  return documentMetadataTag("script", children, props, false);
};
var style = ({
  children,
  ...props
}) => {
  if (!["href", "precedence"].every((k) => k in props)) {
    return returnWithoutSpecialBehavior("style", children, props);
  }
  props["data-href"] = props.href;
  delete props.href;
  return documentMetadataTag("style", children, props, true);
};
var link = ({ children, ...props }) => {
  if (["onLoad", "onError"].some((k) => k in props) || props.rel === "stylesheet" && (!("precedence" in props) || "disabled" in props)) {
    return returnWithoutSpecialBehavior("link", children, props);
  }
  return documentMetadataTag("link", children, props, "precedence" in props);
};
var meta = ({ children, ...props }) => {
  const nameSpaceContext3 = getNameSpaceContext();
  if (nameSpaceContext3 && useContext(nameSpaceContext3) === "head") {
    return returnWithoutSpecialBehavior("meta", children, props);
  }
  return documentMetadataTag("meta", children, props, false);
};
var newJSXNode = (tag, { children, ...props }) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new JSXNode(tag, props, toArray(children ?? []))
);
var form = (props) => {
  if (typeof props.action === "function") {
    props.action = PERMALINK in props.action ? props.action[PERMALINK] : void 0;
  }
  return newJSXNode("form", props);
};
var formActionableElement = (tag, props) => {
  if (typeof props.formAction === "function") {
    props.formAction = PERMALINK in props.formAction ? props.formAction[PERMALINK] : void 0;
  }
  return newJSXNode(tag, props);
};
var input = (props) => formActionableElement("input", props);
var button = (props) => formActionableElement("button", props);

// node_modules/hono/dist/jsx/utils.js
var normalizeElementKeyMap = /* @__PURE__ */ new Map([
  ["className", "class"],
  ["htmlFor", "for"],
  ["crossOrigin", "crossorigin"],
  ["httpEquiv", "http-equiv"],
  ["itemProp", "itemprop"],
  ["fetchPriority", "fetchpriority"],
  ["noModule", "nomodule"],
  ["formAction", "formaction"]
]);
var normalizeIntrinsicElementKey = (key) => normalizeElementKeyMap.get(key) || key;
var styleObjectForEach = (style3, fn) => {
  for (const [k, v] of Object.entries(style3)) {
    const key = k[0] === "-" || !/[A-Z]/.test(k) ? k : k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    fn(
      key,
      v == null ? null : typeof v === "number" ? !key.match(
        /^(?:a|border-im|column(?:-c|s)|flex(?:$|-[^b])|grid-(?:ar|[^a])|font-w|li|or|sca|st|ta|wido|z)|ty$/
      ) ? `${v}px` : `${v}` : v
    );
  }
};

// node_modules/hono/dist/jsx/base.js
var nameSpaceContext = void 0;
var getNameSpaceContext = () => nameSpaceContext;
var toSVGAttributeName = (key) => /[A-Z]/.test(key) && // Presentation attributes are findable in style object. "clip-path", "font-size", "stroke-width", etc.
// Or other un-deprecated kebab-case attributes. "overline-position", "paint-order", "strikethrough-position", etc.
key.match(
  /^(?:al|basel|clip(?:Path|Rule)$|co|do|fill|fl|fo|gl|let|lig|i|marker[EMS]|o|pai|pointe|sh|st[or]|text[^L]|tr|u|ve|w)/
) ? key.replace(/([A-Z])/g, "-$1").toLowerCase() : key;
var emptyTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
var booleanAttributes = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "download",
  "formnovalidate",
  "hidden",
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
  "selected"
];
var childrenToStringToBuffer = (children, buffer) => {
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];
    if (typeof child === "string") {
      escapeToBuffer(child, buffer);
    } else if (typeof child === "boolean" || child === null || child === void 0) {
      continue;
    } else if (child instanceof JSXNode) {
      child.toStringToBuffer(buffer);
    } else if (typeof child === "number" || child.isEscaped) {
      ;
      buffer[0] += child;
    } else if (child instanceof Promise) {
      buffer.unshift("", child);
    } else {
      childrenToStringToBuffer(child, buffer);
    }
  }
};
var JSXNode = class {
  tag;
  props;
  key;
  children;
  isEscaped = true;
  localContexts;
  constructor(tag, props, children) {
    this.tag = tag;
    this.props = props;
    this.children = children;
  }
  get type() {
    return this.tag;
  }
  // Added for compatibility with libraries that rely on React's internal structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get ref() {
    return this.props.ref || null;
  }
  toString() {
    const buffer = [""];
    this.localContexts?.forEach(([context, value]) => {
      context.values.push(value);
    });
    try {
      this.toStringToBuffer(buffer);
    } finally {
      this.localContexts?.forEach(([context]) => {
        context.values.pop();
      });
    }
    return buffer.length === 1 ? "callbacks" in buffer ? resolveCallbackSync(raw(buffer[0], buffer.callbacks)).toString() : buffer[0] : stringBufferToString(buffer, buffer.callbacks);
  }
  toStringToBuffer(buffer) {
    const tag = this.tag;
    const props = this.props;
    let { children } = this;
    buffer[0] += `<${tag}`;
    const normalizeKey = nameSpaceContext && useContext(nameSpaceContext) === "svg" ? (key) => toSVGAttributeName(normalizeIntrinsicElementKey(key)) : (key) => normalizeIntrinsicElementKey(key);
    for (let [key, v] of Object.entries(props)) {
      key = normalizeKey(key);
      if (key === "children") {
      } else if (key === "style" && typeof v === "object") {
        let styleStr = "";
        styleObjectForEach(v, (property, value) => {
          if (value != null) {
            styleStr += `${styleStr ? ";" : ""}${property}:${value}`;
          }
        });
        buffer[0] += ' style="';
        escapeToBuffer(styleStr, buffer);
        buffer[0] += '"';
      } else if (typeof v === "string") {
        buffer[0] += ` ${key}="`;
        escapeToBuffer(v, buffer);
        buffer[0] += '"';
      } else if (v === null || v === void 0) {
      } else if (typeof v === "number" || v.isEscaped) {
        buffer[0] += ` ${key}="${v}"`;
      } else if (typeof v === "boolean" && booleanAttributes.includes(key)) {
        if (v) {
          buffer[0] += ` ${key}=""`;
        }
      } else if (key === "dangerouslySetInnerHTML") {
        if (children.length > 0) {
          throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
        }
        children = [raw(v.__html)];
      } else if (v instanceof Promise) {
        buffer[0] += ` ${key}="`;
        buffer.unshift('"', v);
      } else if (typeof v === "function") {
        if (!key.startsWith("on") && key !== "ref") {
          throw new Error(`Invalid prop '${key}' of type 'function' supplied to '${tag}'.`);
        }
      } else {
        buffer[0] += ` ${key}="`;
        escapeToBuffer(v.toString(), buffer);
        buffer[0] += '"';
      }
    }
    if (emptyTags.includes(tag) && children.length === 0) {
      buffer[0] += "/>";
      return;
    }
    buffer[0] += ">";
    childrenToStringToBuffer(children, buffer);
    buffer[0] += `</${tag}>`;
  }
};
var JSXFunctionNode = class extends JSXNode {
  toStringToBuffer(buffer) {
    const { children } = this;
    const props = { ...this.props };
    if (children.length) {
      props.children = children.length === 1 ? children[0] : children;
    }
    const res = this.tag.call(null, props);
    if (typeof res === "boolean" || res == null) {
      return;
    } else if (res instanceof Promise) {
      if (globalContexts.length === 0) {
        buffer.unshift("", res);
      } else {
        const currentContexts = globalContexts.map((c) => [c, c.values.at(-1)]);
        buffer.unshift(
          "",
          res.then((childRes) => {
            if (childRes instanceof JSXNode) {
              childRes.localContexts = currentContexts;
            }
            return childRes;
          })
        );
      }
    } else if (res instanceof JSXNode) {
      res.toStringToBuffer(buffer);
    } else if (typeof res === "number" || res.isEscaped) {
      buffer[0] += res;
      if (res.callbacks) {
        buffer.callbacks ||= [];
        buffer.callbacks.push(...res.callbacks);
      }
    } else {
      escapeToBuffer(res, buffer);
    }
  }
};
var JSXFragmentNode = class extends JSXNode {
  toStringToBuffer(buffer) {
    childrenToStringToBuffer(this.children, buffer);
  }
};
var jsx = (tag, props, ...children) => {
  props ??= {};
  if (children.length) {
    props.children = children.length === 1 ? children[0] : children;
  }
  const key = props.key;
  delete props["key"];
  const node = jsxFn(tag, props, children);
  node.key = key;
  return node;
};
var initDomRenderer = false;
var jsxFn = (tag, props, children) => {
  if (!initDomRenderer) {
    for (const k in domRenderers) {
      ;
      components_exports[k][DOM_RENDERER] = domRenderers[k];
    }
    initDomRenderer = true;
  }
  if (typeof tag === "function") {
    return new JSXFunctionNode(tag, props, children);
  } else if (components_exports[tag]) {
    return new JSXFunctionNode(
      components_exports[tag],
      props,
      children
    );
  } else if (tag === "svg" || tag === "head") {
    nameSpaceContext ||= createContext2("");
    return new JSXNode(tag, props, [
      new JSXFunctionNode(
        nameSpaceContext,
        {
          value: tag
        },
        children
      )
    ]);
  } else {
    return new JSXNode(tag, props, children);
  }
};

// node_modules/hono/dist/jsx/dom/intrinsic-element/components.js
var components_exports2 = {};
__export(components_exports2, {
  button: () => button2,
  clearCache: () => clearCache,
  composeRef: () => composeRef,
  form: () => form2,
  input: () => input2,
  link: () => link2,
  meta: () => meta2,
  script: () => script2,
  style: () => style2,
  title: () => title2
});

// node_modules/hono/dist/jsx/dom/render.js
var HONO_PORTAL_ELEMENT = "_hp";
var eventAliasMap = {
  Change: "Input",
  DoubleClick: "DblClick"
};
var nameSpaceMap = {
  svg: "2000/svg",
  math: "1998/Math/MathML"
};
var buildDataStack = [];
var refCleanupMap = /* @__PURE__ */ new WeakMap();
var nameSpaceContext2 = void 0;
var getNameSpaceContext2 = () => nameSpaceContext2;
var isNodeString = (node) => "t" in node;
var eventCache = {
  // pre-define events that are used very frequently
  onClick: ["click", false]
};
var getEventSpec = (key) => {
  if (!key.startsWith("on")) {
    return void 0;
  }
  if (eventCache[key]) {
    return eventCache[key];
  }
  const match2 = key.match(/^on([A-Z][a-zA-Z]+?(?:PointerCapture)?)(Capture)?$/);
  if (match2) {
    const [, eventName, capture] = match2;
    return eventCache[key] = [(eventAliasMap[eventName] || eventName).toLowerCase(), !!capture];
  }
  return void 0;
};
var toAttributeName = (element, key) => nameSpaceContext2 && element instanceof SVGElement && /[A-Z]/.test(key) && (key in element.style || // Presentation attributes are findable in style object. "clip-path", "font-size", "stroke-width", etc.
key.match(/^(?:o|pai|str|u|ve)/)) ? key.replace(/([A-Z])/g, "-$1").toLowerCase() : key;
var applyProps = (container, attributes, oldAttributes) => {
  attributes ||= {};
  for (let key in attributes) {
    const value = attributes[key];
    if (key !== "children" && (!oldAttributes || oldAttributes[key] !== value)) {
      key = normalizeIntrinsicElementKey(key);
      const eventSpec = getEventSpec(key);
      if (eventSpec) {
        if (oldAttributes?.[key] !== value) {
          if (oldAttributes) {
            container.removeEventListener(eventSpec[0], oldAttributes[key], eventSpec[1]);
          }
          if (value != null) {
            if (typeof value !== "function") {
              throw new Error(`Event handler for "${key}" is not a function`);
            }
            container.addEventListener(eventSpec[0], value, eventSpec[1]);
          }
        }
      } else if (key === "dangerouslySetInnerHTML" && value) {
        container.innerHTML = value.__html;
      } else if (key === "ref") {
        let cleanup;
        if (typeof value === "function") {
          cleanup = value(container) || (() => value(null));
        } else if (value && "current" in value) {
          value.current = container;
          cleanup = () => value.current = null;
        }
        refCleanupMap.set(container, cleanup);
      } else if (key === "style") {
        const style3 = container.style;
        if (typeof value === "string") {
          style3.cssText = value;
        } else {
          style3.cssText = "";
          if (value != null) {
            styleObjectForEach(value, style3.setProperty.bind(style3));
          }
        }
      } else {
        if (key === "value") {
          const nodeName = container.nodeName;
          if (nodeName === "INPUT" || nodeName === "TEXTAREA" || nodeName === "SELECT") {
            ;
            container.value = value === null || value === void 0 || value === false ? null : value;
            if (nodeName === "TEXTAREA") {
              container.textContent = value;
              continue;
            } else if (nodeName === "SELECT") {
              if (container.selectedIndex === -1) {
                ;
                container.selectedIndex = 0;
              }
              continue;
            }
          }
        } else if (key === "checked" && container.nodeName === "INPUT" || key === "selected" && container.nodeName === "OPTION") {
          ;
          container[key] = value;
        }
        const k = toAttributeName(container, key);
        if (value === null || value === void 0 || value === false) {
          container.removeAttribute(k);
        } else if (value === true) {
          container.setAttribute(k, "");
        } else if (typeof value === "string" || typeof value === "number") {
          container.setAttribute(k, value);
        } else {
          container.setAttribute(k, value.toString());
        }
      }
    }
  }
  if (oldAttributes) {
    for (let key in oldAttributes) {
      const value = oldAttributes[key];
      if (key !== "children" && !(key in attributes)) {
        key = normalizeIntrinsicElementKey(key);
        const eventSpec = getEventSpec(key);
        if (eventSpec) {
          container.removeEventListener(eventSpec[0], value, eventSpec[1]);
        } else if (key === "ref") {
          refCleanupMap.get(container)?.();
        } else {
          container.removeAttribute(toAttributeName(container, key));
        }
      }
    }
  }
};
var invokeTag = (context, node) => {
  node[DOM_STASH][0] = 0;
  buildDataStack.push([context, node]);
  const func = node.tag[DOM_RENDERER] || node.tag;
  const props = func.defaultProps ? {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...func.defaultProps,
    ...node.props
  } : node.props;
  try {
    return [func.call(null, props)];
  } finally {
    buildDataStack.pop();
  }
};
var getNextChildren = (node, container, nextChildren, childrenToRemove, callbacks) => {
  if (node.vR?.length) {
    childrenToRemove.push(...node.vR);
    delete node.vR;
  }
  if (typeof node.tag === "function") {
    node[DOM_STASH][1][STASH_EFFECT]?.forEach((data) => callbacks.push(data));
  }
  node.vC.forEach((child) => {
    if (isNodeString(child)) {
      nextChildren.push(child);
    } else {
      if (typeof child.tag === "function" || child.tag === "") {
        child.c = container;
        const currentNextChildrenIndex = nextChildren.length;
        getNextChildren(child, container, nextChildren, childrenToRemove, callbacks);
        if (child.s) {
          for (let i = currentNextChildrenIndex; i < nextChildren.length; i++) {
            nextChildren[i].s = true;
          }
          child.s = false;
        }
      } else {
        nextChildren.push(child);
        if (child.vR?.length) {
          childrenToRemove.push(...child.vR);
          delete child.vR;
        }
      }
    }
  });
};
var findInsertBefore = (node) => {
  for (; ; node = node.tag === HONO_PORTAL_ELEMENT || !node.vC || !node.pP ? node.nN : node.vC[0]) {
    if (!node) {
      return null;
    }
    if (node.tag !== HONO_PORTAL_ELEMENT && node.e) {
      return node.e;
    }
  }
};
var removeNode = (node) => {
  if (!isNodeString(node)) {
    node[DOM_STASH]?.[1][STASH_EFFECT]?.forEach((data) => data[2]?.());
    refCleanupMap.get(node.e)?.();
    if (node.p === 2) {
      node.vC?.forEach((n) => n.p = 2);
    }
    node.vC?.forEach(removeNode);
  }
  if (!node.p) {
    node.e?.remove();
    delete node.e;
  }
  if (typeof node.tag === "function") {
    updateMap.delete(node);
    fallbackUpdateFnArrayMap.delete(node);
    delete node[DOM_STASH][3];
    node.a = true;
  }
};
var apply = (node, container, isNew) => {
  node.c = container;
  applyNodeObject(node, container, isNew);
};
var findChildNodeIndex = (childNodes, child) => {
  if (!child) {
    return;
  }
  for (let i = 0, len = childNodes.length; i < len; i++) {
    if (childNodes[i] === child) {
      return i;
    }
  }
  return;
};
var cancelBuild = /* @__PURE__ */ Symbol();
var applyNodeObject = (node, container, isNew) => {
  const next = [];
  const remove = [];
  const callbacks = [];
  getNextChildren(node, container, next, remove, callbacks);
  remove.forEach(removeNode);
  const childNodes = isNew ? void 0 : container.childNodes;
  let offset;
  let insertBeforeNode = null;
  if (isNew) {
    offset = -1;
  } else if (!childNodes.length) {
    offset = 0;
  } else {
    const offsetByNextNode = findChildNodeIndex(childNodes, findInsertBefore(node.nN));
    if (offsetByNextNode !== void 0) {
      insertBeforeNode = childNodes[offsetByNextNode];
      offset = offsetByNextNode;
    } else {
      offset = findChildNodeIndex(childNodes, next.find((n) => n.tag !== HONO_PORTAL_ELEMENT && n.e)?.e) ?? -1;
    }
    if (offset === -1) {
      isNew = true;
    }
  }
  for (let i = 0, len = next.length; i < len; i++, offset++) {
    const child = next[i];
    let el;
    if (child.s && child.e) {
      el = child.e;
      child.s = false;
    } else {
      const isNewLocal = isNew || !child.e;
      if (isNodeString(child)) {
        if (child.e && child.d) {
          child.e.textContent = child.t;
        }
        child.d = false;
        el = child.e ||= document.createTextNode(child.t);
      } else {
        el = child.e ||= child.n ? document.createElementNS(child.n, child.tag) : document.createElement(child.tag);
        applyProps(el, child.props, child.pP);
        applyNodeObject(child, el, isNewLocal);
      }
    }
    if (child.tag === HONO_PORTAL_ELEMENT) {
      offset--;
    } else if (isNew) {
      if (!el.parentNode) {
        container.appendChild(el);
      }
    } else if (childNodes[offset] !== el && childNodes[offset - 1] !== el) {
      if (childNodes[offset + 1] === el) {
        container.appendChild(childNodes[offset]);
      } else {
        container.insertBefore(el, insertBeforeNode || childNodes[offset] || null);
      }
    }
  }
  if (node.pP) {
    delete node.pP;
  }
  if (callbacks.length) {
    const useLayoutEffectCbs = [];
    const useEffectCbs = [];
    callbacks.forEach(([, useLayoutEffectCb, , useEffectCb, useInsertionEffectCb]) => {
      if (useLayoutEffectCb) {
        useLayoutEffectCbs.push(useLayoutEffectCb);
      }
      if (useEffectCb) {
        useEffectCbs.push(useEffectCb);
      }
      useInsertionEffectCb?.();
    });
    useLayoutEffectCbs.forEach((cb) => cb());
    if (useEffectCbs.length) {
      requestAnimationFrame(() => {
        useEffectCbs.forEach((cb) => cb());
      });
    }
  }
};
var isSameContext = (oldContexts, newContexts) => !!(oldContexts && oldContexts.length === newContexts.length && oldContexts.every((ctx, i) => ctx[1] === newContexts[i][1]));
var fallbackUpdateFnArrayMap = /* @__PURE__ */ new WeakMap();
var build = (context, node, children) => {
  const buildWithPreviousChildren = !children && node.pC;
  if (children) {
    node.pC ||= node.vC;
  }
  let foundErrorHandler;
  try {
    children ||= typeof node.tag == "function" ? invokeTag(context, node) : toArray(node.props.children);
    if (children[0]?.tag === "" && children[0][DOM_ERROR_HANDLER]) {
      foundErrorHandler = children[0][DOM_ERROR_HANDLER];
      context[5].push([context, foundErrorHandler, node]);
    }
    const oldVChildren = buildWithPreviousChildren ? [...node.pC] : node.vC ? [...node.vC] : void 0;
    const vChildren = [];
    let prevNode;
    for (let i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        children.splice(i, 1, ...children[i].flat());
      }
      let child = buildNode(children[i]);
      if (child) {
        if (typeof child.tag === "function" && // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !child.tag[DOM_INTERNAL_TAG]) {
          if (globalContexts.length > 0) {
            child[DOM_STASH][2] = globalContexts.map((c) => [c, c.values.at(-1)]);
          }
          if (context[5]?.length) {
            child[DOM_STASH][3] = context[5].at(-1);
          }
        }
        let oldChild;
        if (oldVChildren && oldVChildren.length) {
          const i2 = oldVChildren.findIndex(
            isNodeString(child) ? (c) => isNodeString(c) : child.key !== void 0 ? (c) => c.key === child.key && c.tag === child.tag : (c) => c.tag === child.tag
          );
          if (i2 !== -1) {
            oldChild = oldVChildren[i2];
            oldVChildren.splice(i2, 1);
          }
        }
        if (oldChild) {
          if (isNodeString(child)) {
            if (oldChild.t !== child.t) {
              ;
              oldChild.t = child.t;
              oldChild.d = true;
            }
            child = oldChild;
          } else {
            const pP = oldChild.pP = oldChild.props;
            oldChild.props = child.props;
            oldChild.f ||= child.f || node.f;
            if (typeof child.tag === "function") {
              const oldContexts = oldChild[DOM_STASH][2];
              oldChild[DOM_STASH][2] = child[DOM_STASH][2] || [];
              oldChild[DOM_STASH][3] = child[DOM_STASH][3];
              if (!oldChild.f && ((oldChild.o || oldChild) === child.o || // The code generated by the react compiler is memoized under this condition.
              oldChild.tag[DOM_MEMO]?.(pP, oldChild.props)) && // The `memo` function is memoized under this condition.
              isSameContext(oldContexts, oldChild[DOM_STASH][2])) {
                oldChild.s = true;
              }
            }
            child = oldChild;
          }
        } else if (!isNodeString(child) && nameSpaceContext2) {
          const ns = useContext(nameSpaceContext2);
          if (ns) {
            child.n = ns;
          }
        }
        if (!isNodeString(child) && !child.s) {
          build(context, child);
          delete child.f;
        }
        vChildren.push(child);
        if (prevNode && !prevNode.s && !child.s) {
          for (let p = prevNode; p && !isNodeString(p); p = p.vC?.at(-1)) {
            p.nN = child;
          }
        }
        prevNode = child;
      }
    }
    node.vR = buildWithPreviousChildren ? [...node.vC, ...oldVChildren || []] : oldVChildren || [];
    node.vC = vChildren;
    if (buildWithPreviousChildren) {
      delete node.pC;
    }
  } catch (e) {
    node.f = true;
    if (e === cancelBuild) {
      if (foundErrorHandler) {
        return;
      } else {
        throw e;
      }
    }
    const [errorHandlerContext, errorHandler2, errorHandlerNode] = node[DOM_STASH]?.[3] || [];
    if (errorHandler2) {
      const fallbackUpdateFn = () => update([0, false, context[2]], errorHandlerNode);
      const fallbackUpdateFnArray = fallbackUpdateFnArrayMap.get(errorHandlerNode) || [];
      fallbackUpdateFnArray.push(fallbackUpdateFn);
      fallbackUpdateFnArrayMap.set(errorHandlerNode, fallbackUpdateFnArray);
      const fallback = errorHandler2(e, () => {
        const fnArray = fallbackUpdateFnArrayMap.get(errorHandlerNode);
        if (fnArray) {
          const i = fnArray.indexOf(fallbackUpdateFn);
          if (i !== -1) {
            fnArray.splice(i, 1);
            return fallbackUpdateFn();
          }
        }
      });
      if (fallback) {
        if (context[0] === 1) {
          context[1] = true;
        } else {
          build(context, errorHandlerNode, [fallback]);
          if ((errorHandler2.length === 1 || context !== errorHandlerContext) && errorHandlerNode.c) {
            apply(errorHandlerNode, errorHandlerNode.c, false);
            return;
          }
        }
        throw cancelBuild;
      }
    }
    throw e;
  } finally {
    if (foundErrorHandler) {
      context[5].pop();
    }
  }
};
var buildNode = (node) => {
  if (node === void 0 || node === null || typeof node === "boolean") {
    return void 0;
  } else if (typeof node === "string" || typeof node === "number") {
    return { t: node.toString(), d: true };
  } else {
    if ("vR" in node) {
      node = {
        tag: node.tag,
        props: node.props,
        key: node.key,
        f: node.f,
        type: node.tag,
        ref: node.props.ref,
        o: node.o || node
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      };
    }
    if (typeof node.tag === "function") {
      ;
      node[DOM_STASH] = [0, []];
    } else {
      const ns = nameSpaceMap[node.tag];
      if (ns) {
        nameSpaceContext2 ||= createContext("");
        node.props.children = [
          {
            tag: nameSpaceContext2,
            props: {
              value: node.n = `http://www.w3.org/${ns}`,
              children: node.props.children
            }
          }
        ];
      }
    }
    return node;
  }
};
var updateSync = (context, node) => {
  node[DOM_STASH][2]?.forEach(([c, v]) => {
    c.values.push(v);
  });
  try {
    build(context, node, void 0);
  } catch {
    return;
  }
  if (node.a) {
    delete node.a;
    return;
  }
  node[DOM_STASH][2]?.forEach(([c]) => {
    c.values.pop();
  });
  if (context[0] !== 1 || !context[1]) {
    apply(node, node.c, false);
  }
};
var updateMap = /* @__PURE__ */ new WeakMap();
var currentUpdateSets = [];
var update = async (context, node) => {
  context[5] ||= [];
  const existing = updateMap.get(node);
  if (existing) {
    existing[0](void 0);
  }
  let resolve;
  const promise = new Promise((r) => resolve = r);
  updateMap.set(node, [
    resolve,
    () => {
      if (context[2]) {
        context[2](context, node, (context2) => {
          updateSync(context2, node);
        }).then(() => resolve(node));
      } else {
        updateSync(context, node);
        resolve(node);
      }
    }
  ]);
  if (currentUpdateSets.length) {
    ;
    currentUpdateSets.at(-1).add(node);
  } else {
    await Promise.resolve();
    const latest = updateMap.get(node);
    if (latest) {
      updateMap.delete(node);
      latest[1]();
    }
  }
  return promise;
};
var createPortal = (children, container, key) => ({
  tag: HONO_PORTAL_ELEMENT,
  props: {
    children
  },
  key,
  e: container,
  p: 1
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});

// node_modules/hono/dist/jsx/hooks/index.js
var STASH_SATE = 0;
var STASH_EFFECT = 1;
var STASH_CALLBACK = 2;
var STASH_MEMO = 3;
var resolvedPromiseValueMap = /* @__PURE__ */ new WeakMap();
var isDepsChanged = (prevDeps, deps) => !prevDeps || !deps || prevDeps.length !== deps.length || deps.some((dep, i) => dep !== prevDeps[i]);
var updateHook = void 0;
var pendingStack = [];
var useState = (initialState) => {
  const resolveInitialState = () => typeof initialState === "function" ? initialState() : initialState;
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    return [resolveInitialState(), () => {
    }];
  }
  const [, node] = buildData;
  const stateArray = node[DOM_STASH][1][STASH_SATE] ||= [];
  const hookIndex = node[DOM_STASH][0]++;
  return stateArray[hookIndex] ||= [
    resolveInitialState(),
    (newState) => {
      const localUpdateHook = updateHook;
      const stateData = stateArray[hookIndex];
      if (typeof newState === "function") {
        newState = newState(stateData[0]);
      }
      if (!Object.is(newState, stateData[0])) {
        stateData[0] = newState;
        if (pendingStack.length) {
          const [pendingType, pendingPromise] = pendingStack.at(-1);
          Promise.all([
            pendingType === 3 ? node : update([pendingType, false, localUpdateHook], node),
            pendingPromise
          ]).then(([node2]) => {
            if (!node2 || !(pendingType === 2 || pendingType === 3)) {
              return;
            }
            const lastVC = node2.vC;
            const addUpdateTask = () => {
              setTimeout(() => {
                if (lastVC !== node2.vC) {
                  return;
                }
                update([pendingType === 3 ? 1 : 0, false, localUpdateHook], node2);
              });
            };
            requestAnimationFrame(addUpdateTask);
          });
        } else {
          update([0, false, localUpdateHook], node);
        }
      }
    }
  ];
};
var useCallback = (callback, deps) => {
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    return callback;
  }
  const [, node] = buildData;
  const callbackArray = node[DOM_STASH][1][STASH_CALLBACK] ||= [];
  const hookIndex = node[DOM_STASH][0]++;
  const prevDeps = callbackArray[hookIndex];
  if (isDepsChanged(prevDeps?.[1], deps)) {
    callbackArray[hookIndex] = [callback, deps];
  } else {
    callback = callbackArray[hookIndex][0];
  }
  return callback;
};
var use = (promise) => {
  const cachedRes = resolvedPromiseValueMap.get(promise);
  if (cachedRes) {
    if (cachedRes.length === 2) {
      throw cachedRes[1];
    }
    return cachedRes[0];
  }
  promise.then(
    (res) => resolvedPromiseValueMap.set(promise, [res]),
    (e) => resolvedPromiseValueMap.set(promise, [void 0, e])
  );
  throw promise;
};
var useMemo = (factory, deps) => {
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    return factory();
  }
  const [, node] = buildData;
  const memoArray = node[DOM_STASH][1][STASH_MEMO] ||= [];
  const hookIndex = node[DOM_STASH][0]++;
  const prevDeps = memoArray[hookIndex];
  if (isDepsChanged(prevDeps?.[1], deps)) {
    memoArray[hookIndex] = [factory(), deps];
  }
  return memoArray[hookIndex][0];
};

// node_modules/hono/dist/jsx/dom/hooks/index.js
var FormContext = createContext({
  pending: false,
  data: null,
  method: null,
  action: null
});
var actions = /* @__PURE__ */ new Set();
var registerAction = (action) => {
  actions.add(action);
  action.finally(() => actions.delete(action));
};

// node_modules/hono/dist/jsx/dom/intrinsic-element/components.js
var clearCache = () => {
  blockingPromiseMap = /* @__PURE__ */ Object.create(null);
  createdElements = /* @__PURE__ */ Object.create(null);
};
var composeRef = (ref, cb) => {
  return useMemo(
    () => (e) => {
      let refCleanup;
      if (ref) {
        if (typeof ref === "function") {
          refCleanup = ref(e) || (() => {
            ref(null);
          });
        } else if (ref && "current" in ref) {
          ref.current = e;
          refCleanup = () => {
            ref.current = null;
          };
        }
      }
      const cbCleanup = cb(e);
      return () => {
        cbCleanup?.();
        refCleanup?.();
      };
    },
    [ref]
  );
};
var blockingPromiseMap = /* @__PURE__ */ Object.create(null);
var createdElements = /* @__PURE__ */ Object.create(null);
var documentMetadataTag2 = (tag, props, preserveNodeType, supportSort, supportBlocking) => {
  if (props?.itemProp) {
    return {
      tag,
      props,
      type: tag,
      ref: props.ref
    };
  }
  const head = document.head;
  let { onLoad, onError, precedence, blocking, ...restProps } = props;
  let element = null;
  let created = false;
  const deDupeKeys = deDupeKeyMap[tag];
  let existingElements = void 0;
  if (deDupeKeys.length > 0) {
    const tags = head.querySelectorAll(tag);
    LOOP: for (const e of tags) {
      for (const key of deDupeKeyMap[tag]) {
        if (e.getAttribute(key) === props[key]) {
          element = e;
          break LOOP;
        }
      }
    }
    if (!element) {
      const cacheKey2 = deDupeKeys.reduce(
        (acc, key) => props[key] === void 0 ? acc : `${acc}-${key}-${props[key]}`,
        tag
      );
      created = !createdElements[cacheKey2];
      element = createdElements[cacheKey2] ||= (() => {
        const e = document.createElement(tag);
        for (const key of deDupeKeys) {
          if (props[key] !== void 0) {
            e.setAttribute(key, props[key]);
          }
          if (props.rel) {
            e.setAttribute("rel", props.rel);
          }
        }
        return e;
      })();
    }
  } else {
    existingElements = head.querySelectorAll(tag);
  }
  precedence = supportSort ? precedence ?? "" : void 0;
  if (supportSort) {
    restProps[dataPrecedenceAttr] = precedence;
  }
  const insert = useCallback(
    (e) => {
      if (deDupeKeys.length > 0) {
        let found = false;
        for (const existingElement of head.querySelectorAll(tag)) {
          if (found && existingElement.getAttribute(dataPrecedenceAttr) !== precedence) {
            head.insertBefore(e, existingElement);
            return;
          }
          if (existingElement.getAttribute(dataPrecedenceAttr) === precedence) {
            found = true;
          }
        }
        head.appendChild(e);
      } else if (existingElements) {
        let found = false;
        for (const existingElement of existingElements) {
          if (existingElement === e) {
            found = true;
            break;
          }
        }
        if (!found) {
          head.insertBefore(
            e,
            head.contains(existingElements[0]) ? existingElements[0] : head.querySelector(tag)
          );
        }
        existingElements = void 0;
      }
    },
    [precedence]
  );
  const ref = composeRef(props.ref, (e) => {
    const key = deDupeKeys[0];
    if (preserveNodeType === 2) {
      e.innerHTML = "";
    }
    if (created || existingElements) {
      insert(e);
    }
    if (!onError && !onLoad) {
      return;
    }
    let promise = blockingPromiseMap[e.getAttribute(key)] ||= new Promise(
      (resolve, reject) => {
        e.addEventListener("load", resolve);
        e.addEventListener("error", reject);
      }
    );
    if (onLoad) {
      promise = promise.then(onLoad);
    }
    if (onError) {
      promise = promise.catch(onError);
    }
    promise.catch(() => {
    });
  });
  if (supportBlocking && blocking === "render") {
    const key = deDupeKeyMap[tag][0];
    if (props[key]) {
      const value = props[key];
      const promise = blockingPromiseMap[value] ||= new Promise((resolve, reject) => {
        insert(element);
        element.addEventListener("load", resolve);
        element.addEventListener("error", reject);
      });
      use(promise);
    }
  }
  const jsxNode = {
    tag,
    type: tag,
    props: {
      ...restProps,
      ref
    },
    ref
  };
  jsxNode.p = preserveNodeType;
  if (element) {
    jsxNode.e = element;
  }
  return createPortal(
    jsxNode,
    head
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  );
};
var title2 = (props) => {
  const nameSpaceContext3 = getNameSpaceContext2();
  const ns = nameSpaceContext3 && useContext(nameSpaceContext3);
  if (ns?.endsWith("svg")) {
    return {
      tag: "title",
      props,
      type: "title",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref: props.ref
    };
  }
  return documentMetadataTag2("title", props, void 0, false, false);
};
var script2 = (props) => {
  if (!props || ["src", "async"].some((k) => !props[k])) {
    return {
      tag: "script",
      props,
      type: "script",
      ref: props.ref
    };
  }
  return documentMetadataTag2("script", props, 1, false, true);
};
var style2 = (props) => {
  if (!props || !["href", "precedence"].every((k) => k in props)) {
    return {
      tag: "style",
      props,
      type: "style",
      ref: props.ref
    };
  }
  props["data-href"] = props.href;
  delete props.href;
  return documentMetadataTag2("style", props, 2, true, true);
};
var link2 = (props) => {
  if (!props || ["onLoad", "onError"].some((k) => k in props) || props.rel === "stylesheet" && (!("precedence" in props) || "disabled" in props)) {
    return {
      tag: "link",
      props,
      type: "link",
      ref: props.ref
    };
  }
  return documentMetadataTag2("link", props, 1, "precedence" in props, true);
};
var meta2 = (props) => {
  return documentMetadataTag2("meta", props, void 0, false, false);
};
var customEventFormAction = /* @__PURE__ */ Symbol();
var form2 = (props) => {
  const { action, ...restProps } = props;
  if (typeof action !== "function") {
    ;
    restProps.action = action;
  }
  const [state, setState] = useState([null, false]);
  const onSubmit = useCallback(
    async (ev) => {
      const currentAction = ev.isTrusted ? action : ev.detail[customEventFormAction];
      if (typeof currentAction !== "function") {
        return;
      }
      ev.preventDefault();
      const formData = new FormData(ev.target);
      setState([formData, true]);
      const actionRes = currentAction(formData);
      if (actionRes instanceof Promise) {
        registerAction(actionRes);
        await actionRes;
      }
      setState([null, true]);
    },
    []
  );
  const ref = composeRef(props.ref, (el) => {
    el.addEventListener("submit", onSubmit);
    return () => {
      el.removeEventListener("submit", onSubmit);
    };
  });
  const [data, isDirty] = state;
  state[1] = false;
  return {
    tag: FormContext,
    props: {
      value: {
        pending: data !== null,
        data,
        method: data ? "post" : null,
        action: data ? action : null
      },
      children: {
        tag: "form",
        props: {
          ...restProps,
          ref
        },
        type: "form",
        ref
      }
    },
    f: isDirty
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  };
};
var formActionableElement2 = (tag, {
  formAction,
  ...props
}) => {
  if (typeof formAction === "function") {
    const onClick = useCallback((ev) => {
      ev.preventDefault();
      ev.currentTarget.form.dispatchEvent(
        new CustomEvent("submit", { detail: { [customEventFormAction]: formAction } })
      );
    }, []);
    props.ref = composeRef(props.ref, (el) => {
      el.addEventListener("click", onClick);
      return () => {
        el.removeEventListener("click", onClick);
      };
    });
  }
  return {
    tag,
    props,
    type: tag,
    ref: props.ref
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  };
};
var input2 = (props) => formActionableElement2("input", props);
var button2 = (props) => formActionableElement2("button", props);
Object.assign(domRenderers, {
  title: title2,
  script: script2,
  style: style2,
  link: link2,
  meta: meta2,
  form: form2,
  input: input2,
  button: button2
});

// node_modules/hono/dist/jsx/dom/jsx-dev-runtime.js
var jsxDEV = (tag, props, key) => {
  if (typeof tag === "string" && components_exports2[tag]) {
    tag = components_exports2[tag];
  }
  return {
    tag,
    type: tag,
    props,
    key,
    ref: props.ref
  };
};
var Fragment = (props) => jsxDEV("", props, void 0);

// node_modules/hono/dist/jsx/dom/components.js
var ErrorBoundary = (({ children, fallback, fallbackRender, onError }) => {
  const res = Fragment({ children });
  res[DOM_ERROR_HANDLER] = (err) => {
    if (err instanceof Promise) {
      throw err;
    }
    onError?.(err);
    return fallbackRender?.(err) || fallback;
  };
  return res;
});
var Suspense = (({
  children,
  fallback
}) => {
  const res = Fragment({ children });
  res[DOM_ERROR_HANDLER] = (err, retry) => {
    if (!(err instanceof Promise)) {
      throw err;
    }
    err.finally(retry);
    return fallback;
  };
  return res;
});

// node_modules/hono/dist/jsx/streaming.js
var StreamingContext = createContext2(null);
var suspenseCounter = 0;
var Suspense2 = async ({
  children,
  fallback
}) => {
  if (!Array.isArray(children)) {
    children = [children];
  }
  const nonce = useContext(StreamingContext)?.scriptNonce;
  let resArray = [];
  const stackNode = { [DOM_STASH]: [0, []] };
  const popNodeStack = (value) => {
    buildDataStack.pop();
    return value;
  };
  try {
    stackNode[DOM_STASH][0] = 0;
    buildDataStack.push([[], stackNode]);
    resArray = children.map(
      (c) => c == null || typeof c === "boolean" ? "" : c.toString()
    );
  } catch (e) {
    if (e instanceof Promise) {
      resArray = [
        e.then(() => {
          stackNode[DOM_STASH][0] = 0;
          buildDataStack.push([[], stackNode]);
          return childrenToString(children).then(popNodeStack);
        })
      ];
    } else {
      throw e;
    }
  } finally {
    popNodeStack();
  }
  if (resArray.some((res) => res instanceof Promise)) {
    const index = suspenseCounter++;
    const fallbackStr = await fallback.toString();
    return raw(`<template id="H:${index}"></template>${fallbackStr}<!--/$-->`, [
      ...fallbackStr.callbacks || [],
      ({ phase, buffer, context }) => {
        if (phase === HtmlEscapedCallbackPhase.BeforeStream) {
          return;
        }
        return Promise.all(resArray).then(async (htmlArray) => {
          htmlArray = htmlArray.flat();
          const content = htmlArray.join("");
          if (buffer) {
            buffer[0] = buffer[0].replace(
              new RegExp(`<template id="H:${index}"></template>.*?<!--/\\$-->`),
              content
            );
          }
          let html = buffer ? "" : `<template data-hono-target="H:${index}">${content}</template><script${nonce ? ` nonce="${nonce}"` : ""}>
((d,c,n) => {
c=d.currentScript.previousSibling
d=d.getElementById('H:${index}')
if(!d)return
do{n=d.nextSibling;n.remove()}while(n.nodeType!=8||n.nodeValue!='/$')
d.replaceWith(c.content)
})(document)
</script>`;
          const callbacks = htmlArray.map((html2) => html2.callbacks || []).flat();
          if (!callbacks.length) {
            return html;
          }
          if (phase === HtmlEscapedCallbackPhase.Stream) {
            html = await resolveCallback(html, HtmlEscapedCallbackPhase.BeforeStream, true, context);
          }
          return raw(html, callbacks);
        });
      }
    ]);
  } else {
    return raw(resArray.join(""));
  }
};
Suspense2[DOM_RENDERER] = Suspense;
var textEncoder = new TextEncoder();

// node_modules/hono/dist/jsx/components.js
var errorBoundaryCounter = 0;
var childrenToString = async (children) => {
  try {
    return children.flat().map((c) => c == null || typeof c === "boolean" ? "" : c.toString());
  } catch (e) {
    if (e instanceof Promise) {
      await e;
      return childrenToString(children);
    } else {
      throw e;
    }
  }
};
var ErrorBoundary2 = async ({ children, fallback, fallbackRender, onError }) => {
  if (!children) {
    return raw("");
  }
  if (!Array.isArray(children)) {
    children = [children];
  }
  const nonce = useContext(StreamingContext)?.scriptNonce;
  let fallbackStr;
  const fallbackRes = (error) => {
    onError?.(error);
    return (fallbackStr || fallbackRender?.(error) || "").toString();
  };
  let resArray = [];
  try {
    resArray = children.map(
      (c) => c == null || typeof c === "boolean" ? "" : c.toString()
    );
  } catch (e) {
    fallbackStr = await fallback?.toString();
    if (e instanceof Promise) {
      resArray = [
        e.then(() => childrenToString(children)).catch((e2) => fallbackRes(e2))
      ];
    } else {
      resArray = [fallbackRes(e)];
    }
  }
  if (resArray.some((res) => res instanceof Promise)) {
    fallbackStr ||= await fallback?.toString();
    const index = errorBoundaryCounter++;
    const replaceRe = RegExp(`(<template id="E:${index}"></template>.*?)(.*?)(<!--E:${index}-->)`);
    const caught = false;
    const catchCallback = ({ error: error2, buffer }) => {
      if (caught) {
        return "";
      }
      const fallbackResString = fallbackRes(error2);
      if (buffer) {
        buffer[0] = buffer[0].replace(replaceRe, fallbackResString);
      }
      return buffer ? "" : `<template data-hono-target="E:${index}">${fallbackResString}</template><script>
((d,c,n) => {
c=d.currentScript.previousSibling
d=d.getElementById('E:${index}')
if(!d)return
do{n=d.nextSibling;n.remove()}while(n.nodeType!=8||n.nodeValue!='E:${index}')
d.replaceWith(c.content)
})(document)
</script>`;
    };
    let error;
    const promiseAll = Promise.all(resArray).catch((e) => error = e);
    return raw(`<template id="E:${index}"></template><!--E:${index}-->`, [
      ({ phase, buffer, context }) => {
        if (phase === HtmlEscapedCallbackPhase.BeforeStream) {
          return;
        }
        return promiseAll.then(async (htmlArray) => {
          if (error) {
            throw error;
          }
          htmlArray = htmlArray.flat();
          const content = htmlArray.join("");
          let html = buffer ? "" : `<template data-hono-target="E:${index}">${content}</template><script${nonce ? ` nonce="${nonce}"` : ""}>
((d,c) => {
c=d.currentScript.previousSibling
d=d.getElementById('E:${index}')
if(!d)return
d.parentElement.insertBefore(c.content,d.nextSibling)
})(document)
</script>`;
          if (htmlArray.every((html2) => !html2.callbacks?.length)) {
            if (buffer) {
              buffer[0] = buffer[0].replace(replaceRe, content);
            }
            return html;
          }
          if (buffer) {
            buffer[0] = buffer[0].replace(
              replaceRe,
              (_all, pre, _, post) => `${pre}${content}${post}`
            );
          }
          const callbacks = htmlArray.map((html2) => html2.callbacks || []).flat();
          if (phase === HtmlEscapedCallbackPhase.Stream) {
            html = await resolveCallback(
              html,
              HtmlEscapedCallbackPhase.BeforeStream,
              true,
              context
            );
          }
          let resolvedCount = 0;
          const promises = callbacks.map(
            (c) => (...args) => c(...args)?.then((content2) => {
              resolvedCount++;
              if (buffer) {
                if (resolvedCount === callbacks.length) {
                  buffer[0] = buffer[0].replace(replaceRe, (_all, _pre, content3) => content3);
                }
                buffer[0] += content2;
                return raw("", content2.callbacks);
              }
              return raw(
                content2 + (resolvedCount !== callbacks.length ? "" : `<script>
((d,c,n) => {
d=d.getElementById('E:${index}')
if(!d)return
n=d.nextSibling
while(n.nodeType!=8||n.nodeValue!='E:${index}'){n=n.nextSibling}
n.remove()
d.remove()
})(document)
</script>`),
                content2.callbacks
              );
            }).catch((error2) => catchCallback({ error: error2, buffer }))
          );
          return raw(html, promises);
        }).catch((error2) => catchCallback({ error: error2, buffer }));
      }
    ]);
  } else {
    return raw(resArray.join(""));
  }
};
ErrorBoundary2[DOM_RENDERER] = ErrorBoundary;

// src/components/Search.jsx
var Search = () => {
  return /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `
        // Data pencarian
        var searchIndex = [
          { title: 'Introduction', path: '/#intro', category: 'General' },
          { title: 'Base URL', path: '/#intro', category: 'General' },
          { title: 'Al-Quran Indonesia', path: '/#quran', category: 'Quran' },
          { title: 'Daftar Surah', path: '/#quran', category: 'Quran', endpoint: '/surah' },
          { title: 'Detail Surah', path: '/#quran', category: 'Quran', endpoint: '/surah?surahId=114' },
          { title: 'Tafsir Kemenag', path: '/#quran', category: 'Quran', endpoint: '/tafsir?surahId=1' },
          { title: 'Ayat & Al-Quran', path: '/#ayah', category: 'Ayat' },
          { title: 'Ayat by Surah', path: '/#ayah', category: 'Ayat', endpoint: '/ayah/surah?surahId=1' },
          { title: 'Ayat by Juz', path: '/#ayah', category: 'Ayat', endpoint: '/ayah/juz?juzId=30' },
          { title: 'Ayat by Page', path: '/#ayah', category: 'Ayat', endpoint: '/ayah/page?page=604' },
          { title: 'Range Ayat', path: '/#ayah', category: 'Ayat', endpoint: '/ayah/range?surahId=1&start=1&end=7' },
          { title: 'Cari Ayat', path: '/#ayah', category: 'Ayat', endpoint: '/ayah/find?query=alhamdulillah' },
          { title: 'Resource Lainnya', path: '/other', category: 'Other' },
          { title: 'Asmaul Husna', path: '/other#asma', category: 'Other', endpoint: '/asma' },
          { title: 'Asbabun Nuzul', path: '/other#asbab', category: 'Other', endpoint: '/asbab' },
          { title: 'Juz Al-Quran', path: '/other#extra', category: 'Other', endpoint: '/juz' },
          { title: 'Detail Juz', path: '/other#extra', category: 'Other', endpoint: '/juz?juzId=30' },
          { title: 'Tema Al-Quran', path: '/other#extra', category: 'Other', endpoint: '/theme' },
          { title: 'Kata per Kata', path: '/other#extra', category: 'Other', endpoint: '/word?surahId=1' },
          { title: 'Kumpulan Doa', path: '/other#doa', category: 'Doa' },
          { title: 'Semua Doa', path: '/other#doa', category: 'Doa', endpoint: '/doa' },
          { title: 'Cari Doa', path: '/other#doa', category: 'Doa', endpoint: '/doa/find?query=makan' },
          { title: 'Dzikir Harian', path: '/other#dzikir', category: 'Dzikir' },
          { title: 'Dzikir by Type', path: '/other#dzikir', category: 'Dzikir', endpoint: '/dzikir?type=pagi' },
          { title: 'Hadits Arba\\'in', path: '/other#hadits', category: 'Hadits' },
          { title: 'Daftar Hadits', path: '/other#hadits', category: 'Hadits', endpoint: '/hadits' },
          { title: 'Detail Hadits', path: '/other#hadits', category: 'Hadits', endpoint: '/hadits?nomor=1' },
          { title: 'Cari Hadits', path: '/other#hadits', category: 'Hadits', endpoint: '/hadits/find?query=niat' },
          { title: 'Data Integrity', path: '/#integrity', category: 'Security' },
          { title: 'Integrity Chain', path: '/#integrity', category: 'Security', endpoint: '/integrity/chain' },
          { title: 'Verify Ayah', path: '/#integrity', category: 'Security', endpoint: '/integrity/verify/ayah?surahId=1&ayahId=1' },
          { title: 'Jadwal Sholat', path: '/other#sholat', category: 'Sholat' },
          { title: 'Daftar Kota Sholat', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/kota/semua' },
          { title: 'Cari Kota Sholat', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/kota/cari?nama=jakarta' },
          { title: 'Jadwal Sholat by Kota', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/jadwal?kotaId=1301' },
          { title: 'Jadwal Sholat by Koordinat', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/jadwal/koordinat?lat=-6.2&lon=106.8' },
          { title: 'Murottal Audio', path: '/other#murottal', category: 'Other' },
          { title: 'Daftar Qari', path: '/other#murottal', category: 'Other', endpoint: '/murotal/qari' },
          { title: 'Murottal by Surah', path: '/other#murottal', category: 'Other', endpoint: '/murotal?surahId=1' },
          { title: 'FAQ', path: '/#faq', category: 'General' },
          { title: 'Other Resources', path: '/other', category: 'Resources' },
          { title: 'GitHub Repository', path: 'https://github.com/vrush2000/muslim-all-in-one-api', category: 'External' }
        ];

        var selectedIndex = -1;

        // Fungsi Global Handle Search
        window.handleSearch = function(query) {
          var dropdown = document.getElementById('search-results-dropdown');
          var container = document.getElementById('search-results-content');
          if (!dropdown || !container) return;

          if (!query || query.trim() === '') {
            container.innerHTML = '<div class="text-center py-4 text-slate-400 text-xs">Type to search...</div>';
            dropdown.classList.add('hidden');
            selectedIndex = -1;
            return;
          }

          var q = query.toLowerCase();
          var filtered = searchIndex.filter(function(item) {
            return item.title.toLowerCase().indexOf(q) !== -1 || 
                   (item.endpoint && item.endpoint.toLowerCase().indexOf(q) !== -1) ||
                   item.category.toLowerCase().indexOf(q) !== -1;
          });

          if (filtered.length === 0) {
            container.innerHTML = '<div class="text-center py-8 text-slate-400 text-xs">No results found for "' + query + '"</div>';
            dropdown.classList.remove('hidden');
            selectedIndex = -1;
            return;
          }

          var html = '';
          for (var i = 0; i < filtered.length; i++) {
            var item = filtered[i];
            var activeClass = (i === 0) ? 'bg-emerald-50' : '';
            html += '<a href="' + item.path + '" onclick="window.hideResults()" class="search-result-item flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50 group transition-all duration-150 ' + activeClass + '" data-index="' + i + '">' +
                      '<div class="flex items-center gap-2">' +
                        '<div class="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">' +
                          '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>' +
                        '</div>' +
                        '<div>' +
                          '<div class="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">' + item.category + '</div>' +
                          '<div class="text-xs font-semibold text-slate-900">' + item.title + '</div>' +
                        '</div>' +
                      '</div>' +
                      '<div class="text-slate-300 group-hover:text-emerald-500">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>' +
                      '</div>' +
                    '</a>';
          }
          container.innerHTML = html;
          dropdown.classList.remove('hidden');
          selectedIndex = 0;
        };

        window.hideResults = function() {
          setTimeout(function() {
            var dropdown = document.getElementById('search-results-dropdown');
            if (dropdown) dropdown.classList.add('hidden');
          }, 200);
        };

        // Keyboard Navigation di Input
        document.addEventListener('keydown', function(e) {
          var dropdown = document.getElementById('search-results-dropdown');
          if (!dropdown || dropdown.classList.contains('hidden')) return;

          var items = document.querySelectorAll('.search-result-item');
          if (items.length === 0) return;

          if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelection();
          } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            items[selectedIndex].click();
          } else if (e.key === 'Escape') {
            window.hideResults();
          }
        });

        function updateSelection() {
          var items = document.querySelectorAll('.search-result-item');
          for (var i = 0; i < items.length; i++) {
            if (i === selectedIndex) {
              items[i].classList.add('bg-emerald-50');
              items[i].scrollIntoView({ block: 'nearest' });
            } else {
              items[i].classList.remove('bg-emerald-50');
            }
          }
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
          var container = document.querySelector('.group.w-40.md\\\\:w-64');
          if (container && !container.contains(e.target)) {
            window.hideResults();
          }
        });
      ` } }));
};

// src/components/Layout.jsx
import fs2 from "node:fs";
import path from "node:path";
var compiledCss = "";
try {
  const cssPath = path.resolve(process.cwd(), "src/compiled.css");
  if (fs2.existsSync(cssPath)) {
    compiledCss = fs2.readFileSync(cssPath, "utf-8");
  }
} catch (e) {
  console.error("Failed to load compiled CSS:", e);
}
var Layout = ({ children, title: title3 }) => {
  return /* @__PURE__ */ jsx("html", { lang: "en", class: "scroll-smooth" }, /* @__PURE__ */ jsx("head", null, /* @__PURE__ */ jsx("meta", { charset: "UTF-8" }), /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), /* @__PURE__ */ jsx("title", null, title3), /* @__PURE__ */ jsx(
    "link",
    {
      rel: "icon",
      href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23059669%22/><path d=%22M30 35v40c10-5 20-5 20 0V35c0-5-10-5-20 0zM70 35v40c-10-5-20-5-20 0V35c0-5 10-5 20 0z%22 fill=%22white%22/></svg>"
    }
  ), compiledCss ? /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: compiledCss } }) : /* @__PURE__ */ jsx("script", { src: "https://cdn.tailwindcss.com" }), /* @__PURE__ */ jsx(
    "link",
    {
      href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap",
      rel: "stylesheet"
    }
  ), /* @__PURE__ */ jsx(
    "link",
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/jsoneditor@9.10.0/dist/jsoneditor.min.css"
    }
  ), /* @__PURE__ */ jsx("script", { src: "https://cdn.jsdelivr.net/npm/jsoneditor@9.10.0/dist/jsoneditor.min.js" }), process.env.NODE_ENV === "development" && /* @__PURE__ */ jsx("script", { type: "module", src: "/@vite/client" }), /* @__PURE__ */ jsx("style", null, `
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .font-mono {
            font-family: 'JetBrains Mono', monospace;
          }
          .glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          }
          #mobile-menu {
            transition: all 0.3s ease-in-out;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
          }
          #mobile-menu.open {
            max-height: 800px;
            opacity: 1;
            padding: 1rem 0;
          }
          pre {
            background: #1e293b;
            color: #f8fafc;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
          }
          code {
            font-family: 'JetBrains Mono', monospace;
          }

          /* JSONEditor Custom Style for Modal */
          #modal-json-editor {
            border: none !important;
            height: 100% !important;
            width: 100% !important;
          }
          #modal-json-editor .jsoneditor {
            border: none !important;
          }
          #modal-json-editor .jsoneditor-menu {
            background-color: #1e293b !important;
            border-bottom: 1px solid #334155 !important;
          }
          #modal-json-editor .jsoneditor-navigation-bar {
            background-color: #1e293b !important;
            border-bottom: 1px solid #334155 !important;
          }
          #modal-json-editor .jsoneditor-outer {
            background-color: #0f172a !important;
            overflow: auto !important;
            position: relative !important;
          }
          #modal-json-editor .jsoneditor-tree {
            background-color: #0f172a !important;
            min-width: 100% !important;
          }
          #modal-json-editor .jsoneditor-tree-inner {
            min-width: max-content !important;
            padding-bottom: 50px !important;
          }
          #modal-json-editor .jsoneditor-content-wrapper {
            overflow: visible !important;
          }
          #modal-json-editor .jsoneditor-field,
          #modal-json-editor .jsoneditor-value {
            white-space: nowrap !important;
          }
          #modal-json-editor .jsoneditor-separator {
            background-color: transparent !important;
          }
          #modal-json-editor .jsoneditor-values {
            color: #10b981 !important;
          }
          #modal-json-editor .jsoneditor-readonly {
            color: #94a3b8 !important;
          }
          #modal-json-editor .jsoneditor-string {
            color: #10b981 !important;
          }
          #modal-json-editor .jsoneditor-number {
            color: #3b82f6 !important;
          }
          #modal-json-editor .jsoneditor-boolean {
            color: #f59e0b !important;
          }
          #modal-json-editor .jsoneditor-null {
            color: #ef4444 !important;
          }
          #modal-json-editor .jsoneditor-field {
            color: #e2e8f0 !important;
          }

          /* Custom Scrollbar for both wrapper and JSONEditor internals */
          .custom-scrollbar::-webkit-scrollbar,
          #modal-json-editor .jsoneditor-outer::-webkit-scrollbar,
          #modal-json-editor .jsoneditor-tree::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track,
          #modal-json-editor .jsoneditor-outer::-webkit-scrollbar-track,
          #modal-json-editor .jsoneditor-tree::-webkit-scrollbar-track {
            background: #0f172a;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb,
          #modal-json-editor .jsoneditor-outer::-webkit-scrollbar-thumb,
          #modal-json-editor .jsoneditor-tree::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover,
          #modal-json-editor .jsoneditor-outer::-webkit-scrollbar-thumb:hover,
          #modal-json-editor .jsoneditor-tree::-webkit-scrollbar-thumb:hover {
            background: #475569;
          }
        `)), /* @__PURE__ */ jsx("body", { class: "bg-slate-50 text-slate-900 min-h-screen flex flex-col" }, /* @__PURE__ */ jsx(Search, null), /* @__PURE__ */ jsx("header", { class: "sticky top-0 z-50 glass border-b border-slate-200" }, /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "flex justify-between h-16 items-center" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/",
      class: "flex items-center gap-2 group transition-all shrink-0"
    },
    /* @__PURE__ */ jsx("div", { class: "w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-200 transition-all" }, /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "h-5 w-5 text-white",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        }
      )
    )),
    /* @__PURE__ */ jsx("span", { class: "text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-teal-500 transition-all" }, "Muslim API")
  ), /* @__PURE__ */ jsx("div", { class: "flex items-center gap-1 md:gap-4 lg:gap-4" }, /* @__PURE__ */ jsx("div", { class: "relative group w-40 md:w-64" }, /* @__PURE__ */ jsx("div", { class: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" }, /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor"
    },
    /* @__PURE__ */ jsx(
      "path",
      {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      }
    )
  )), /* @__PURE__ */ jsx(
    "input",
    {
      type: "text",
      id: "search-input-header",
      oninput: "window.handleSearch(this.value)",
      onfocus: "window.handleSearch(this.value)",
      autocomplete: "off",
      placeholder: "Search...",
      class: "block w-full pl-10 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
    }
  ), /* @__PURE__ */ jsx(
    "div",
    {
      id: "search-results-dropdown",
      class: "absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 hidden overflow-hidden z-[100] max-h-[400px] overflow-y-auto"
    },
    /* @__PURE__ */ jsx("div", { id: "search-results-content", class: "p-2" }, /* @__PURE__ */ jsx("div", { class: "text-center py-4 text-slate-400 text-xs" }, "Type to search..."))
  )), /* @__PURE__ */ jsx("nav", { class: "hidden md:flex items-center space-x-8" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/",
      class: "text-slate-600 hover:text-emerald-600 font-medium transition-colors"
    },
    "Home"
  ), /* @__PURE__ */ jsx("div", { class: "relative group" }, /* @__PURE__ */ jsx("button", { class: "flex items-center gap-1 text-slate-600 group-hover:text-emerald-600 font-medium transition-colors py-4" }, "Documentation", /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-4 w-4 transition-transform group-hover:rotate-180",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor"
    },
    /* @__PURE__ */ jsx(
      "path",
      {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M19 9l-7 7-7-7"
      }
    )
  )), /* @__PURE__ */ jsx("div", { class: "absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-6 z-[100]" }, /* @__PURE__ */ jsx("div", { class: "grid grid-cols-3 gap-8" }, /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h5", { class: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-4" }, "Internal Services"), /* @__PURE__ */ jsx("ul", { class: "space-y-3" }, /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/docs",
      class: "group/item flex items-start gap-3"
    },
    /* @__PURE__ */ jsx("div", { class: "w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors" }, /* @__PURE__ */ jsx(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        }
      )
    )),
    /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("div", { class: "text-sm font-bold text-slate-900" }, "Al-Quran API"), /* @__PURE__ */ jsx("div", { class: "text-xs text-slate-500" }, "Teks & Tafsir Kemenag"))
  )), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other",
      class: "group/item flex items-start gap-3"
    },
    /* @__PURE__ */ jsx("div", { class: "w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors" }, /* @__PURE__ */ jsx(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        }
      )
    )),
    /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("div", { class: "text-sm font-bold text-slate-900" }, "Jadwal Sholat"), /* @__PURE__ */ jsx("div", { class: "text-xs text-slate-500" }, "Seluruh Indonesia"))
  )), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/status",
      class: "group/item flex items-start gap-3"
    },
    /* @__PURE__ */ jsx("div", { class: "w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover/item:bg-amber-600 group-hover/item:text-white transition-colors" }, /* @__PURE__ */ jsx(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        }
      )
    )),
    /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("div", { class: "text-sm font-bold text-slate-900" }, "System Status"), /* @__PURE__ */ jsx("div", { class: "text-xs text-slate-500" }, "Uptime & Latency"))
  )))), /* @__PURE__ */ jsx("div", { class: "col-span-2" }, /* @__PURE__ */ jsx("h5", { class: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-4" }, "Other API Resources"), /* @__PURE__ */ jsx("ul", { class: "grid grid-cols-2 gap-x-8 gap-y-4" }, /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other#hadits",
      class: "group/item flex items-start gap-3"
    },
    /* @__PURE__ */ jsx("div", { class: "w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover/item:bg-rose-600 group-hover/item:text-white transition-colors" }, /* @__PURE__ */ jsx(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        }
      )
    )),
    /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("div", { class: "text-sm font-bold text-slate-900" }, "Hadits & Tafsir"), /* @__PURE__ */ jsx("div", { class: "text-xs text-slate-500" }, "Kumpulan Kitab & Tafsir"))
  )), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other#doa",
      class: "group/item flex items-start gap-3"
    },
    /* @__PURE__ */ jsx("div", { class: "w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors" }, /* @__PURE__ */ jsx(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        }
      )
    )),
    /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("div", { class: "text-sm font-bold text-slate-900" }, "Doa & Dzikir"), /* @__PURE__ */ jsx("div", { class: "text-xs text-slate-500" }, "Harian & Pilihan"))
  )), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other#calendar",
      class: "group/item flex items-start gap-3"
    },
    /* @__PURE__ */ jsx("div", { class: "w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors" }, /* @__PURE__ */ jsx(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        }
      )
    )),
    /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("div", { class: "text-sm font-bold text-slate-900" }, "Kalender Hijriah"), /* @__PURE__ */ jsx("div", { class: "text-xs text-slate-500" }, "Konversi & Jadwal"))
  )), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other#asma",
      class: "group/item flex items-start gap-3"
    },
    /* @__PURE__ */ jsx("div", { class: "w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover/item:bg-amber-600 group-hover/item:text-white transition-colors" }, /* @__PURE__ */ jsx(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"
        }
      )
    )),
    /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("div", { class: "text-sm font-bold text-slate-900" }, "Asmaul Husna"), /* @__PURE__ */ jsx("div", { class: "text-xs text-slate-500" }, "99 Nama Allah"))
  )), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other#kemenag",
      class: "group/item flex items-start gap-3"
    },
    /* @__PURE__ */ jsx("div", { class: "w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors" }, /* @__PURE__ */ jsx(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        }
      )
    )),
    /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("div", { class: "text-sm font-bold text-slate-900" }, "Layanan Kemenag"), /* @__PURE__ */ jsx("div", { class: "text-xs text-slate-500" }, "SIMAS, Pesantren & Libur"))
  ))))))), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/playground",
      class: "px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-all shadow-sm hover:shadow-emerald-200"
    },
    "Playground"
  )), /* @__PURE__ */ jsx("div", { class: "md:hidden" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onclick: "document.getElementById('mobile-menu').classList.toggle('open')",
      class: "text-slate-600 hover:text-emerald-600 p-2 rounded-lg hover:bg-slate-100 transition-all"
    },
    /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "h-6 w-6",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M4 6h16M4 12h16M4 18h16"
        }
      )
    )
  )))), /* @__PURE__ */ jsx("div", { id: "mobile-menu", class: "md:hidden border-t border-slate-100" }, /* @__PURE__ */ jsx("nav", { class: "flex flex-col space-y-1 px-2 pb-4" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/",
      class: "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all"
    },
    "Home"
  ), /* @__PURE__ */ jsx("div", { class: "px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2" }, "Internal Services"), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/docs",
      class: "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
    },
    /* @__PURE__ */ jsx("div", { class: "w-1.5 h-1.5 rounded-full bg-emerald-500" }),
    " ",
    "Al-Quran API"
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other",
      class: "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
    },
    /* @__PURE__ */ jsx("div", { class: "w-1.5 h-1.5 rounded-full bg-blue-500" }),
    " Other APIs"
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/status",
      class: "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
    },
    /* @__PURE__ */ jsx("div", { class: "w-1.5 h-1.5 rounded-full bg-amber-500" }),
    " ",
    "System Status"
  ), /* @__PURE__ */ jsx("div", { class: "px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2" }, "External Resources"), /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://quran.kemenag.go.id/",
      target: "_blank",
      class: "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all"
    },
    "Quran Kemenag"
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://github.com/vrush2000/muslim-all-in-one-api",
      target: "_blank",
      class: "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all"
    },
    "GitHub Repository"
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/playground",
      class: "mt-4 text-center text-white bg-emerald-600 px-3 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100"
    },
    "Open Playground"
  ))))), /* @__PURE__ */ jsx("main", { class: "flex-grow" }, children), /* @__PURE__ */ jsx("div", { id: "api-preview-modal", class: "fixed inset-0 z-[200] hidden" }, /* @__PURE__ */ jsx(
    "div",
    {
      class: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm",
      onclick: "window.closeApiModal()"
    }
  ), /* @__PURE__ */ jsx("div", { class: "absolute inset-0 flex items-center justify-center p-2 sm:p-4 pointer-events-none" }, /* @__PURE__ */ jsx("div", { class: "bg-white w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden border border-slate-200" }, /* @__PURE__ */ jsx("div", { class: "flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50/50 shrink-0" }, /* @__PURE__ */ jsx("div", { class: "flex items-center gap-2 sm:gap-3 overflow-hidden" }, /* @__PURE__ */ jsx("div", { class: "w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 text-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0" }, /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5 sm:h-6 sm:w-6",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor"
    },
    /* @__PURE__ */ jsx(
      "path",
      {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      }
    )
  )), /* @__PURE__ */ jsx("div", { class: "overflow-hidden" }, /* @__PURE__ */ jsx("h3", { class: "text-sm sm:text-lg font-bold text-slate-900 truncate" }, "API Response Preview"), /* @__PURE__ */ jsx(
    "p",
    {
      id: "modal-endpoint-url",
      class: "text-[10px] sm:text-xs text-slate-500 font-mono mt-0.5 truncate max-w-[150px] sm:max-w-md md:max-w-xl"
    }
  ))), /* @__PURE__ */ jsx(
    "button",
    {
      onclick: "window.closeApiModal()",
      class: "p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all shrink-0"
    },
    /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "h-5 w-5 sm:h-6 sm:w-6",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M6 18L18 6M6 6l12 12"
        }
      )
    )
  )), /* @__PURE__ */ jsx("div", { class: "flex-grow p-4 sm:p-6 overflow-hidden flex flex-col gap-3 sm:gap-4" }, /* @__PURE__ */ jsx("div", { class: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0" }, /* @__PURE__ */ jsx("div", { class: "flex items-center gap-3" }, /* @__PURE__ */ jsx("span", { class: "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider" }, "GET"), /* @__PURE__ */ jsx(
    "span",
    {
      id: "modal-status-badge",
      class: "hidden inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider"
    }
  )), /* @__PURE__ */ jsx("div", { class: "flex items-center gap-2" }, /* @__PURE__ */ jsx(
    "button",
    {
      onclick: "window.copyModalResponse()",
      class: "flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] sm:text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200 sm:border-transparent rounded-lg transition-all"
    },
    /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "h-3.5 w-3.5 sm:h-4 sm:w-4",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
        }
      )
    ),
    "Copy JSON"
  ), /* @__PURE__ */ jsx(
    "a",
    {
      id: "modal-full-playground",
      href: "#",
      class: "flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] sm:text-sm font-medium text-emerald-600 hover:bg-emerald-50 border border-emerald-100 sm:border-transparent rounded-lg transition-all"
    },
    "Playground",
    /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "h-3.5 w-3.5 sm:h-4 sm:w-4",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M13 7l5 5m0 0l-5 5m5-5H6"
        }
      )
    )
  ))), /* @__PURE__ */ jsx("div", { class: "flex-grow overflow-hidden relative custom-scrollbar flex flex-col bg-[#0f172a] rounded-lg sm:rounded-xl border border-slate-700" }, /* @__PURE__ */ jsx(
    "pre",
    {
      id: "modal-json-pure",
      class: "flex-grow h-full w-full p-4 sm:p-6 text-emerald-400 font-mono text-[11px] sm:text-sm overflow-auto custom-scrollbar whitespace-pre"
    }
  ))), /* @__PURE__ */ jsx("div", { class: "px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 bg-slate-50/50 flex shrink-0" }, /* @__PURE__ */ jsx(
    "button",
    {
      onclick: "window.closeApiModal()",
      class: "w-full sm:w-auto sm:ml-auto px-6 py-2 bg-slate-900 text-white rounded-lg sm:rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
    },
    "Close Preview"
  ))))), /* @__PURE__ */ jsx(
    "script",
    {
      dangerouslySetInnerHTML: {
        __html: `
          let modalJsonData = null;
          
          window.openApiModal = async function(category, endpointId, url) {
            const modal = document.getElementById('api-preview-modal');
            const jsonDisplay = document.getElementById('modal-json-pure');
            const urlDisplay = document.getElementById('modal-endpoint-url');
            const playgroundLink = document.getElementById('modal-full-playground');
            const statusBadge = document.getElementById('modal-status-badge');
            
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            urlDisplay.textContent = url;
            playgroundLink.href = '/playground?category=' + category + '&endpoint=' + endpointId;
            
            jsonDisplay.textContent = 'Loading response...';
            statusBadge.classList.add('hidden');
            
            try {
              const start = performance.now();
              const response = await fetch(url);
              const data = await response.json();
              const end = performance.now();
              
              modalJsonData = data;
              jsonDisplay.textContent = JSON.stringify(data, null, 2);
              
              statusBadge.textContent = response.status + ' ' + response.statusText + ' (' + Math.round(end - start) + 'ms)';
              statusBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + 
                (response.ok ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800');
              statusBadge.classList.remove('hidden');
            } catch (error) {
              jsonDisplay.textContent = JSON.stringify({ error: 'Failed to fetch API', details: error.message }, null, 2);
              statusBadge.textContent = 'Error';
              statusBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800';
              statusBadge.classList.remove('hidden');
            }
          };
          
          window.closeApiModal = function() {
            const modal = document.getElementById('api-preview-modal');
            modal.classList.add('hidden');
            document.body.style.overflow = '';
          };
          
          window.copyModalResponse = function() {
            if (modalJsonData) {
              const json = JSON.stringify(modalJsonData, null, 2);
              navigator.clipboard.writeText(json).then(() => {
                const btn = event.currentTarget;
                const originalText = btn.innerHTML;
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Copied!';
                setTimeout(() => btn.innerHTML = originalText, 2000);
              });
            }
          };
          
          // Close modal on ESC key
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              window.closeApiModal();
              window.closeDonationModal();
            }
          });

          window.openDonationModal = function() {
            const modal = document.getElementById('donation-modal');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            window.resetDonationModal();
          };

          window.closeDonationModal = function() {
            const modal = document.getElementById('donation-modal');
            modal.classList.add('hidden');
            document.body.style.overflow = '';
          };

          window.resetDonationModal = function() {
            document.getElementById('qris-display-section').classList.add('hidden');
            document.getElementById('donation-options-section').classList.remove('hidden');
            document.getElementById('custom-amount').value = '';
            document.getElementById('qris-image').src = '';
            
            // Reset active state of preset buttons
            document.querySelectorAll('.preset-btn').forEach(btn => {
              btn.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-50');
            });
          };

          window.selectPreset = function(amount, btn) {
            document.getElementById('custom-amount').value = amount;
            
            // Highlight active button
            document.querySelectorAll('.preset-btn').forEach(b => {
              b.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-50');
            });
            btn.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-50');
          };

          window.generateDonationQR = async function() {
            const amount = document.getElementById('custom-amount').value;
            if (!amount || amount < 1000) {
              alert('Minimal donasi Rp 1.000');
              return;
            }

            const generateBtn = document.getElementById('generate-qris-btn');
            const originalText = generateBtn.innerHTML;
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...';

            try {
              const response = await fetch("/api/qris/generate?amount=" + amount);
              const result = await response.json();
              
              if (result.status) {
                document.getElementById('donation-options-section').classList.add('hidden');
                document.getElementById('qris-display-section').classList.remove('hidden');
                document.getElementById('qris-image').src = result.data.qr_image;
                document.getElementById('display-amount').textContent = 'Rp ' + parseInt(amount).toLocaleString('id-ID');
              } else {
                alert('Gagal generate QRIS: ' + result.message);
              }
            } catch (error) {
              alert('Terjadi kesalahan: ' + error.message);
            } finally {
              generateBtn.disabled = false;
              generateBtn.innerHTML = originalText;
            }
          };
        `
      }
    }
  ), /* @__PURE__ */ jsx(
    "div",
    {
      id: "donation-modal",
      class: "fixed inset-0 z-[100] hidden",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true"
    },
    /* @__PURE__ */ jsx("div", { class: "fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onclick: "window.closeDonationModal()" }),
    /* @__PURE__ */ jsx("div", { class: "fixed inset-0 z-10 overflow-y-auto" }, /* @__PURE__ */ jsx("div", { class: "flex min-h-full items-center justify-center p-4 text-center sm:p-0" }, /* @__PURE__ */ jsx("div", { class: "relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md" }, /* @__PURE__ */ jsx("div", { class: "bg-emerald-600 px-6 py-4 flex items-center justify-between" }, /* @__PURE__ */ jsx("h3", { class: "text-lg font-bold text-white flex items-center gap-2" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" })), "Dukung Muslim API"), /* @__PURE__ */ jsx(
      "button",
      {
        onclick: "window.closeDonationModal()",
        class: "text-emerald-100 hover:text-white transition-colors"
      },
      /* @__PURE__ */ jsx("svg", { class: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M6 18L18 6M6 6l12 12" }))
    )), /* @__PURE__ */ jsx("div", { class: "px-6 py-6" }, /* @__PURE__ */ jsx("div", { id: "donation-options-section" }, /* @__PURE__ */ jsx("p", { class: "text-slate-600 text-sm mb-6 text-center" }, "Pilih atau masukkan nominal donasi untuk mendukung pengembangan Muslim API."), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-3 gap-3 mb-6" }, [5e3, 1e4, 2e4, 5e4, 1e5, 25e4].map((amount) => /* @__PURE__ */ jsx(
      "button",
      {
        onclick: "window.selectPreset(" + amount + ", this)",
        class: "preset-btn py-2 px-1 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all"
      },
      amount >= 1e3 ? amount / 1e3 + "rb" : amount
    ))), /* @__PURE__ */ jsx("div", { class: "mb-6" }, /* @__PURE__ */ jsx("label", { class: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2" }, "Nominal Lain (Min Rp 1.000)"), /* @__PURE__ */ jsx("div", { class: "relative" }, /* @__PURE__ */ jsx("span", { class: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold" }, "Rp"), /* @__PURE__ */ jsx(
      "input",
      {
        id: "custom-amount",
        type: "number",
        placeholder: "0",
        class: "w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-bold text-slate-700"
      }
    ))), /* @__PURE__ */ jsx(
      "button",
      {
        id: "generate-qris-btn",
        onclick: "window.generateDonationQR()",
        class: "w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all transform hover:-translate-y-0.5"
      },
      "Lanjutkan ke Pembayaran"
    )), /* @__PURE__ */ jsx("div", { id: "qris-display-section", class: "hidden text-center" }, /* @__PURE__ */ jsx("div", { class: "mb-4" }, /* @__PURE__ */ jsx("div", { id: "display-amount", class: "text-2xl font-black text-slate-800" }, "Rp 0"), /* @__PURE__ */ jsx("div", { class: "text-xs text-slate-400 font-medium" }, "Scan QRIS untuk membayar"), /* @__PURE__ */ jsx("div", { class: "text-xs text-slate-400 font-medium" }, "dan akan diarahkan ke Hariistimewa.com - DANA")), /* @__PURE__ */ jsx("div", { class: "bg-white p-4 border-2 border-slate-100 rounded-2xl mb-6 inline-block shadow-sm" }, /* @__PURE__ */ jsx("img", { id: "qris-image", src: "", alt: "QRIS", class: "w-64 h-64" })), /* @__PURE__ */ jsx("div", { class: "bg-slate-50 p-4 rounded-xl mb-6 text-left" }, /* @__PURE__ */ jsx("div", { class: "flex items-start gap-3" }, /* @__PURE__ */ jsx("div", { class: "w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" }, "1"), /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-600" }, "Buka aplikasi pembayaran (Gopay, OVO, Dana, LinkAja, atau Mobile Banking).")), /* @__PURE__ */ jsx("div", { class: "flex items-start gap-3 mt-3" }, /* @__PURE__ */ jsx("div", { class: "w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" }, "2"), /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-600" }, "Pilih menu ", /* @__PURE__ */ jsx("b", null, "Scan/Bayar"), " lalu arahkan kamera ke QR Code di atas.")), /* @__PURE__ */ jsx("div", { class: "flex items-start gap-3 mt-3" }, /* @__PURE__ */ jsx("div", { class: "w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" }, "3"), /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-600" }, "Pastikan nominal sesuai dan selesaikan pembayaran."))), /* @__PURE__ */ jsx(
      "button",
      {
        onclick: "window.resetDonationModal()",
        class: "text-sm font-semibold text-emerald-600 hover:text-emerald-700"
      },
      "\u2190 Kembali Pilih Nominal"
    ))), /* @__PURE__ */ jsx("div", { class: "bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-center gap-4" }, /* @__PURE__ */ jsx("img", { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png", alt: "QRIS", class: "h-4 opacity-50" }), /* @__PURE__ */ jsx("div", { class: "w-px h-3 bg-slate-300" }), /* @__PURE__ */ jsx("span", { class: "text-[10px] text-slate-400 font-medium uppercase tracking-widest" }, "Aman \u2022 Terverifikasi")))))
  ), /* @__PURE__ */ jsx("footer", { class: "bg-white border-t border-slate-200 py-12 mt-12" }, /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8" }, /* @__PURE__ */ jsx("div", { class: "col-span-1 md:col-span-1" }, /* @__PURE__ */ jsx("div", { class: "flex items-center gap-2 mb-4" }, /* @__PURE__ */ jsx("div", { class: "w-6 h-6 bg-emerald-600 rounded flex items-center justify-center" }, /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-4 w-4 text-white",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor"
    },
    /* @__PURE__ */ jsx(
      "path",
      {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      }
    )
  )), /* @__PURE__ */ jsx("span", { class: "text-lg font-bold" }, "Muslim API")), /* @__PURE__ */ jsx("p", { class: "text-slate-500 text-sm leading-relaxed mb-4" }, "Penyedia layanan API Muslim gratis untuk mempermudah pengembang dalam membangun aplikasi islami."), /* @__PURE__ */ jsx("div", { class: "flex items-center gap-3" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://github.com/vrush2000/muslim-all-in-one-api",
      target: "_blank",
      class: "p-2 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 rounded-lg transition-all",
      title: "GitHub Repository"
    },
    /* @__PURE__ */ jsx(
      "svg",
      {
        class: "w-5 h-5",
        fill: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ jsx("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" })
    )
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/status",
      class: "p-2 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 rounded-lg transition-all",
      title: "System Status"
    },
    /* @__PURE__ */ jsx(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        }
      )
    )
  ))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "font-semibold text-slate-900 mb-4" }, "API Documentation"), /* @__PURE__ */ jsx("ul", { class: "space-y-2 text-sm text-slate-500" }, /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx("a", { href: "/docs", class: "hover:text-emerald-600" }, "Al-Quran API")), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx("a", { href: "/other#hadits", class: "hover:text-emerald-600" }, "Hadits & Doa")), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx("a", { href: "/other#sholat", class: "hover:text-emerald-600" }, "Jadwal Sholat")), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx("a", { href: "/other#kemenag", class: "hover:text-emerald-600" }, "Kemenag Data")), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx("a", { href: "/other#sejarah", class: "hover:text-emerald-600" }, "Sejarah Islam")), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/playground",
      class: "text-emerald-600 font-semibold hover:underline"
    },
    "API Playground"
  )))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "font-semibold text-slate-900 mb-4" }, "Official Sources"), /* @__PURE__ */ jsx("ul", { class: "space-y-2 text-sm text-slate-500" }, /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://quran.kemenag.go.id/",
      target: "_blank",
      class: "hover:text-emerald-600 flex items-center gap-1"
    },
    "Quran Kemenag",
    " ",
    /* @__PURE__ */ jsx(
      "svg",
      {
        class: "w-3 h-3",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ jsx("path", { d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" })
    )
  )), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://equran.id/",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "equran.id (Audio)"
  )), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://api.myquran.com/",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "MyQuran API (Jadwal Sholat)"
  )))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "font-semibold text-slate-900 mb-4" }, "Community Repos"), /* @__PURE__ */ jsx("ul", { class: "space-y-2 text-sm text-slate-500" }, /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://github.com/Otangid/muslim-api",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "Dataset keislaman (SQLite)"
  )), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://github.com/nasrul21/data-pesantren-indonesia",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "Data Pesantren"
  )), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://github.com/kresnasatya/api-harilibur",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "Libur Nasional"
  )), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://github.com/gadingnst/hadith-api",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "Koleksi Hadith"
  )))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "font-semibold text-slate-900 mb-4" }, "Inspiration"), /* @__PURE__ */ jsx("p", { class: "text-slate-500 text-sm leading-relaxed" }, "Original template by", " ", /* @__PURE__ */ jsx(
    "a",
    {
      href: "http://www.designstub.com/",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "Designstub"
  ))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "font-semibold text-slate-900 mb-4" }, "Support Project"), /* @__PURE__ */ jsx(
    "button",
    {
      onclick: "window.openDonationModal()",
      class: "w-full group flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:border-amber-300 transition-all shadow-sm hover:shadow-md cursor-pointer"
    },
    /* @__PURE__ */ jsx("div", { class: "w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform" }, /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "h-6 w-6",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      },
      /* @__PURE__ */ jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        }
      )
    )),
    /* @__PURE__ */ jsx("div", { class: "text-left" }, /* @__PURE__ */ jsx("div", { class: "text-[10px] text-amber-600 font-medium" }, "Dukung via QRIS"))
  ))), /* @__PURE__ */ jsx("div", { class: "border-t border-slate-100 mt-12 pt-8 text-center" }, /* @__PURE__ */ jsx("p", { class: "text-slate-500 text-sm mb-4" }, "Dikembangkan dengan \u2764\uFE0F untuk Ummat."), /* @__PURE__ */ jsx("p", { class: "text-slate-400 text-xs" }, "\xA9 ", (/* @__PURE__ */ new Date()).getFullYear(), " Muslim All-in-One API. Created by Vrush Studio."))))));
};

// src/components/Home.jsx
var ApiEndpoint = ({ method, path: path2, title: title3, responseJson, category, endpointId }) => /* @__PURE__ */ jsx("div", { class: "mb-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300" }, /* @__PURE__ */ jsx("div", { class: "px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center" }, /* @__PURE__ */ jsx("h4", { class: "font-semibold text-slate-900" }, title3), /* @__PURE__ */ jsx("div", { class: "flex gap-2" }, /* @__PURE__ */ jsx("span", { class: `px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${method === "GET" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}` }, method))), /* @__PURE__ */ jsx("div", { class: "p-6" }, /* @__PURE__ */ jsx("div", { class: "flex items-center gap-2 mb-6 group" }, /* @__PURE__ */ jsx("div", { class: "flex-grow flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 group-hover:border-emerald-200 transition-colors" }, /* @__PURE__ */ jsx("code", { class: "text-sm font-mono text-slate-600 truncate" }, path2)), /* @__PURE__ */ jsx("div", { class: "flex gap-2" }, /* @__PURE__ */ jsx(
  "button",
  {
    onclick: `window.openApiModal('${category}', '${endpointId}', '/v1${path2}')`,
    class: "p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all",
    title: "Try in Playground"
  },
  /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" }), /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }))
), /* @__PURE__ */ jsx(
  "button",
  {
    onclick: `navigator.clipboard.writeText(window.location.origin + '/v1${path2}')`,
    class: "p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all",
    title: "Copy URL"
  },
  /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8.5V11a.5.5 0 00-.5-.5H9.75a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h.75a.5.5 0 00.5-.5z" }))
))), /* @__PURE__ */ jsx("div", { class: "space-y-4" }, /* @__PURE__ */ jsx("details", { class: "group" }, /* @__PURE__ */ jsx("summary", { class: "flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors list-none" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 group-open:rotate-180 transition-transform", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 9l-7 7-7-7" })), "Example Response"), /* @__PURE__ */ jsx("div", { class: "mt-4 animate-in fade-in slide-in-from-top-2 duration-300" }, /* @__PURE__ */ jsx("pre", { class: "text-[11px] leading-relaxed shadow-inner" }, /* @__PURE__ */ jsx("code", null, responseJson)))))));
var SectionTitle = ({ title: title3, icon, id, color = "emerald" }) => /* @__PURE__ */ jsx("div", { id, class: "flex items-center gap-3 mb-8 scroll-mt-24" }, /* @__PURE__ */ jsx("div", { class: `w-10 h-10 bg-${color}-600 rounded-lg flex items-center justify-center shadow-lg shadow-${color}-100` }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: icon }))), /* @__PURE__ */ jsx("h2", { class: "text-2xl font-bold text-slate-900" }, title3));
var Home = ({ baseUrl }) => {
  return /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" }, /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 lg:grid-cols-4 gap-12" }, /* @__PURE__ */ jsx("aside", { class: "hidden lg:block col-span-1 sticky top-28 self-start" }, /* @__PURE__ */ jsx("div", { class: "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm" }, /* @__PURE__ */ jsx("h3", { class: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3" }, "Menu"), /* @__PURE__ */ jsx("nav", { class: "space-y-1" }, [
    { name: "Introduction", href: "#intro", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Quran", href: "#quran", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { name: "Integrity", href: "#integrity", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { name: "FAQ", href: "#faq", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
  ].map((item, index) => /* @__PURE__ */ jsx(
    "a",
    {
      key: index,
      href: item.href,
      class: "flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all group"
    },
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: item.icon })),
    item.name
  ))))), /* @__PURE__ */ jsx("div", { class: "col-span-1 lg:col-span-3" }, /* @__PURE__ */ jsx("section", { id: "intro", class: "mb-20 scroll-mt-24" }, /* @__PURE__ */ jsx("div", { class: "flex flex-wrap gap-3 mb-6" }, /* @__PURE__ */ jsx("div", { class: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold" }, /* @__PURE__ */ jsx("span", { class: "relative flex h-2 w-2" }, /* @__PURE__ */ jsx("span", { class: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ jsx("span", { class: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })), "v1.0.0 Stable"), /* @__PURE__ */ jsx("div", { class: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-3 w-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "3", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V12m0 9.472c-2.28 0-4.47-.636-6.342-1.742L12 12l6.342 7.73A11.955 11.955 0 0112 21.472z" })), "Verified Data Source: Kemenag RI")), /* @__PURE__ */ jsx("h1", { class: "text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6" }, "Muslim ", /* @__PURE__ */ jsx("span", { class: "text-emerald-600 block md:inline" }, "All-in-One API")), /* @__PURE__ */ jsx("p", { class: "text-xl text-slate-600 leading-relaxed mb-10 max-w-3xl" }, "Akses data keislaman terlengkap dengan performa tinggi. Dibangun untuk pengembang yang ingin membuat aplikasi islami."), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-10" }, /* @__PURE__ */ jsx("div", { class: "p-6 rounded-2xl border border-slate-200 bg-white shadow-sm" }, /* @__PURE__ */ jsx("div", { class: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }))), /* @__PURE__ */ jsx("h3", { class: "font-bold text-slate-900 mb-2" }, "Base URL"), /* @__PURE__ */ jsx("div", { class: "flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 group" }, /* @__PURE__ */ jsx("code", { class: "text-sm text-emerald-600 font-mono font-bold truncate" }, baseUrl), /* @__PURE__ */ jsx(
    "button",
    {
      onclick: `navigator.clipboard.writeText('${baseUrl}')`,
      class: "p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all shrink-0",
      title: "Copy Base URL"
    },
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" }))
  ))), /* @__PURE__ */ jsx("div", { class: "p-6 rounded-2xl border border-slate-200 bg-white shadow-sm" }, /* @__PURE__ */ jsx("div", { class: "w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }))), /* @__PURE__ */ jsx("h3", { class: "font-bold text-slate-900 mb-2" }, "Format"), /* @__PURE__ */ jsx("div", { class: "flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100" }, /* @__PURE__ */ jsx("code", { class: "text-sm text-blue-600 font-mono font-bold" }, "application/json"))))), /* @__PURE__ */ jsx(
    SectionTitle,
    {
      id: "quran",
      title: "Al-Quran Indonesia",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Daftar Surah",
      method: "GET",
      path: "/surah",
      category: "quran",
      endpointId: "list-surah",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan daftar surah.",
  "data": [
    {
      "number": "1",
      "name_id": "Al-Fatihah",
      "name_short": "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
      "number_of_verses": "7",
      "revelation_id": "Makkiyyah",
      "audio_full": {...}
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Detail Surah",
      method: "GET",
      path: "/surah?surahId=1",
      category: "quran",
      endpointId: "detail-surah",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan detail surah Al-Fatihah.",
  "data": {
    "number": "1",
    "sequence": "5",
    "number_of_verses": "7",
    "name_short": "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    "name_long": "\u0633\u064F\u0648\u0631\u064E\u0629\u064F \u0671\u0644\u0652\u0641\u064E\u0627\u062A\u0650\u062D\u064E\u0629\u0650",
    "name_en": "Al-Faatiha",
    "name_id": "Al-Fatihah",
    "translation_en": "The Opening",
    "translation_id": "Pembukaan",
    "revelation": "\u0645\u0643\u0629",
    "revelation_en": "Meccan",
    "revelation_id": "Makkiyyah",
    "tafsir": "...",
    "description": "...",
    "audio_url": "...",
    "audio_full": {
      "01": "https://cdn.equran.id/audio-full/Abdullah-Al-Juhany/001.mp3",
      "02": "https://cdn.equran.id/audio-full/Abdul-Muhsin-Al-Qasim/001.mp3",
      ...
    }
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Tafsir Kemenag",
      method: "GET",
      path: "/tafsir?surahId=1",
      category: "quran",
      endpointId: "tafsir",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan tafsir surah 1.",
  "data": [
    {
      "id": "1",
      "ayah": "1",
      "wajiz": "...",
      "tahlili": "..."
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Ayat by Surah",
      method: "GET",
      path: "/ayah/surah?surahId=1",
      category: "quran",
      endpointId: "ayah-surah",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan daftar seluruh ayat surah 1.",
  "data": [
    {
      "id": "1",
      "surah": "1",
      "ayah": "1",
      "arab": "...",
      "latin": "...",
      "page": "1",
      "juz": "1",
      "hizb": null,
      "asbab": "0",
      "audio": "...",
      "audio_partial": {
        "01": "https://cdn.equran.id/audio-partial/Abdullah-Al-Juhany/001001.mp3",
        "02": "https://cdn.equran.id/audio-partial/Abdul-Muhsin-Al-Qasim/001001.mp3",
        ...
      },
      "theme": null,
      "text": "...",
      "notes": null
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Spesifik Ayat",
      method: "GET",
      path: "/ayah/specific?surahId=1&ayahId=1",
      category: "quran",
      endpointId: "ayah-specific",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan ayat 1 surah 1.",
  "data": {
    "id": "1",
    "surah": "1",
    "ayah": "1",
    "arab": "...",
    "latin": "...",
    "page": "1",
    "juz": "1",
    "hizb": null,
    "asbab": "0",
    "audio": "...",
    "audio_partial": {
      "01": "https://cdn.equran.id/audio-partial/Abdullah-Al-Juhany/001001.mp3",
      ...
    },
    "theme": null,
    "text": "...",
    "notes": null
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Ayat by Juz",
      method: "GET",
      path: "/ayah/juz?juzId=30",
      category: "quran",
      endpointId: "ayah-juz",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan seluruh ayat pada juz 30.",
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Ayat by Page",
      method: "GET",
      path: "/ayah/page?page=604",
      category: "quran",
      endpointId: "ayah-page",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan seluruh ayat pada halaman 604.",
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Range Ayat",
      method: "GET",
      path: "/ayah/range?surahId=1&start=1&end=7",
      category: "quran",
      endpointId: "ayah-range",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan ayat surah 1 dari ayat 1 sampai 7.",
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Cari Ayat",
      method: "GET",
      path: "/ayah/find?query=alhamdulillah",
      category: "quran",
      endpointId: "ayah-find",
      responseJson: `{
  "status": true,
  "message": "Berhasil mencari ayat dengan kata kunci 'alhamdulillah'.",
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Juz Al-Quran",
      method: "GET",
      path: "/juz",
      category: "quran",
      endpointId: "juz-list",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan daftar juz.",
  "data": [
    {
      "number": "1",
      "name": "Juz 1"
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Detail Juz",
      method: "GET",
      path: "/juz?juzId=30",
      category: "quran",
      endpointId: "juz-detail",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan informasi juz 30.",
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Tema Al-Quran",
      method: "GET",
      path: "/theme",
      category: "quran",
      endpointId: "theme-list",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan daftar tema Al-Quran.",
  "data": [
    {
      "id": "1",
      "name": "Tiga Golongan Manusia..."
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Detail Tema",
      method: "GET",
      path: "/theme?themeId=1",
      category: "quran",
      endpointId: "theme-detail",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan ayat dengan tema 1.",
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Al-Quran Kata per Kata",
      method: "GET",
      path: "/word?surahId=1",
      category: "quran",
      endpointId: "word-ayah",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan data kata per kata surah 1.",
  "data": [
    {
      "id": "id",
      "surah": "1",
      "ayah": "1",
      "word": "1",
      "arab": "\u0628\u0650\u0633\u0652\u0645\u0650",
      "indo": "dengan nama"
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Word Spesifik Ayat",
      method: "GET",
      path: "/word?surahId=1&ayahId=1",
      category: "quran",
      endpointId: "word-ayah-specific",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan data kata per kata surah 1 ayat 1.",
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle,
    {
      id: "integrity",
      title: "Integrity & Blockchain",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      color: "emerald"
    }
  ), /* @__PURE__ */ jsx("div", { className: "bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6 rounded-r-lg" }, /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-800 font-medium" }, "\u{1F6E1}\uFE0F ", /* @__PURE__ */ jsx("strong", null, "Data Integrity Proof:"), ' Kami menggunakan teknologi cryptographic hashing (SHA-256) untuk memastikan kemurnian teks Al-Quran. Setiap Surah dan Ayah memiliki "Digital Fingerprint" yang unik. Jika ada perubahan satu karakter saja pada database kami, maka hash integrity akan berubah, memberitahukan pengguna bahwa data tidak lagi murni.')), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Integrity Chain (Blockchain)",
      method: "GET",
      path: "/integrity/chain",
      category: "integrity",
      endpointId: "integrity-chain",
      responseJson: `{
  "status": true,
  "message": "Data Integrity Chain (Proof of Authenticity) berhasil dibuat.",
  "network": "Muslim-API Data Ledger",
  "root_hash": "4f8a...",
  "chain": [
    {
      "block_height": 1,
      "hash": "8d3e...",
      "surah_number": "1",
      "surah_name": "Al-Fatihah",
      "ayah_count": 7,
      "content_hash": "a1b2...",
      "previous_hash": "0000...",
      "timestamp": "2025-12-24T00:00:00Z"
    },
    ...
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Verifikasi Ayah Spesifik",
      method: "GET",
      path: "/integrity/verify/ayah?surahId=1&ayahId=1",
      category: "integrity",
      endpointId: "integrity-verify",
      responseJson: `{
  "status": true,
  "message": "Berhasil memverifikasi integritas ayat 1 pada surah 1.",
  "data": {
    "surahId": "1",
    "ayahId": "1",
    "hash": "e3b0c442...",
    "timestamp": "2025-12-24T00:00:00Z"
  }
}`
    }
  ), /* @__PURE__ */ jsx("div", { class: "mb-20 p-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl overflow-hidden relative group" }, /* @__PURE__ */ jsx("div", { class: "absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-500" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-64 w-64", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }))), /* @__PURE__ */ jsx("div", { class: "relative z-10" }, /* @__PURE__ */ jsx("h3", { class: "text-2xl font-bold mb-3" }, "Butuh Resource Lainnya?"), /* @__PURE__ */ jsx("p", { class: "text-emerald-50 mb-6 max-w-lg" }, "Temukan API tambahan seperti Murottal, Jadwal Sholat, Kalender Hijriah, Hadits, Asmaul Husna, dan banyak lagi di halaman Resources."), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other",
      class: "inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
    },
    "Eksplor Other Resources",
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M14 5l7 7-7 7" }))
  ))), /* @__PURE__ */ jsx(
    SectionTitle,
    {
      id: "faq",
      title: "Pertanyaan Umum",
      icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "slate"
    }
  ), /* @__PURE__ */ jsx("div", { class: "space-y-4 mb-20" }, [
    {
      q: "Apa itu Muslim All-in-One API?",
      a: "Muslim All-in-One API adalah proyek open-source yang bertujuan menyediakan akses data keislaman (Al-Quran, Jadwal Sholat, Hadits, dll) dalam satu platform yang cepat, gratis, dan mudah digunakan oleh pengembang aplikasi."
    },
    {
      q: "Bagaimana keaslian dan akurasi data Al-Quran?",
      a: "Kami menjamin keaslian data Al-Quran dalam API ini. Data teks, terjemahan, dan tafsir (Wajiz & Tahlili) diwarisi dari dataset muslim-api-three milik Otangid yang telah diverifikasi sesuai dengan database Kemenag RI. Struktur data kami mencakup Tafsir Tahlili yang sangat mendalam, yang merupakan produk intelektual resmi dari Kementerian Agama RI dan mengikuti standar Mushaf Al-Quran Standar Indonesia (MSI)."
    },
    {
      q: "Bagaimana dengan performa dan keamanan?",
      a: "API ini sudah dilengkapi dengan 'Enterprise-grade Caching' (SWR) yang membuat respon sangat cepat lewat CDN. Kami juga menerapkan CORS policy and Rate Limiting untuk menjaga stabilitas server dari penggunaan berlebihan."
    },
    {
      q: "Apakah data ini sesuai dengan database Kemenag?",
      a: "Ya, benar. Secara teknis, dataset kami menggunakan skema 'Wajiz' dan 'Tahlili' yang hanya dimiliki oleh publikasi resmi Kemenag RI. Teks Arab yang digunakan juga mengikuti kaidah rasm utsmani standar Indonesia dengan tanda waqaf dan harakat yang telah disesuaikan untuk pengguna di Indonesia. Anda dapat membandingkan output API kami dengan situs resmi quran.kemenag.go.id untuk verifikasi mandiri."
    },
    {
      q: "Apakah data Hadits yang disediakan sahih?",
      a: "Untuk Hadits Arbain, kami menggunakan dataset dari muslim-api-three milik Otangid yang telah terverifikasi. Untuk koleksi hadits besar (Bukhari, Muslim, dll), kami mengintegrasikan data dari api.hadith.gading.dev yang mengambil sumber dari kitab-kitab hadits terkemuka dengan teks Arab dan terjemahan Indonesia yang kredibel."
    },
    {
      q: "Dari mana sumber data lainnya?",
      a: "Jadwal sholat bersumber dari Kemenag RI (via MyQuran API). Dataset Al-Quran, Doa, dan Dzikir diwarisi dari project milik Otangid (muslim-api-three). Audio murottal disediakan melalui CDN equran.id."
    },
    {
      q: "Bagaimana cara melakukan perubahan data atau memperbaiki typo?",
      a: "Data lokal seperti Al-Quran, Dzikir, dan Doa disimpan dalam database SQLite di `src/database/alquran.db`. Anda dapat melakukan koreksi langsung pada database tersebut menggunakan SQLite client. Berkat sistem Integrity & Blockchain kami, setiap perubahan pada teks Al-Quran akan secara otomatis mengubah 'Digital Fingerprint' (hash) pada sistem, sehingga transparansi data tetap terjaga."
    },
    {
      q: "Bagaimana jika saya menemukan kesalahan penulisan atau bug?",
      a: "Kami sangat menghargai laporan Anda. Jika Anda adalah pengguna API, silakan laporkan melalui Issue di repository GitHub kami. Jika Anda adalah pengembang, Anda dapat melakukan Pull Request atau memperbaiki data langsung di database lokal."
    },
    {
      q: "Apakah API ini gratis untuk digunakan?",
      a: "Ya, API ini 100% gratis untuk digunakan baik untuk proyek personal, pendidikan, maupun komersial tanpa perlu kunci API (API Key)."
    },
    {
      q: "Apakah ada batasan rate limit?",
      a: "Saat ini tidak ada batasan rate limit yang ketat, namun kami menyarankan untuk melakukan caching di sisi aplikasi Anda untuk performa terbaik dan menjaga keberlangsungan layanan."
    }
  ].map((faq, index) => /* @__PURE__ */ jsx("details", { key: index, class: "group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" }, /* @__PURE__ */ jsx("summary", { class: "flex items-center justify-between p-6 cursor-pointer list-none" }, /* @__PURE__ */ jsx("span", { class: "font-bold text-slate-900" }, faq.q), /* @__PURE__ */ jsx("span", { class: "text-emerald-500 transition-transform group-open:rotate-180" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 9l-7 7-7-7" })))), /* @__PURE__ */ jsx("div", { class: "px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4" }, faq.a)))), /* @__PURE__ */ jsx("div", { class: "bg-slate-900 rounded-3xl p-10 text-center text-white mb-20" }, /* @__PURE__ */ jsx("h2", { class: "text-3xl font-bold mb-4" }, "Siap untuk Membangun?"), /* @__PURE__ */ jsx("p", { class: "text-slate-400 mb-8 max-w-xl mx-auto" }, "Mulai integrasikan Muslim API ke dalam aplikasi Anda hari ini. Gratis, cepat, dan terpercaya."), /* @__PURE__ */ jsx("div", { class: "flex flex-wrap justify-center gap-4" }, /* @__PURE__ */ jsx("a", { href: "/playground", class: "bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20" }, "Coba di Playground"), /* @__PURE__ */ jsx("a", { href: "https://github.com/vrush2000/muslim-all-in-one-api", target: "_blank", class: "bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all border border-slate-700" }, "GitHub Repository"))))));
};

// src/components/Other.jsx
var ApiEndpoint2 = ({ method, path: path2, title: title3, responseJson, category, endpointId }) => /* @__PURE__ */ jsx("div", { class: "mb-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300" }, /* @__PURE__ */ jsx("div", { class: "px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center" }, /* @__PURE__ */ jsx("h4", { class: "font-semibold text-slate-900" }, title3), /* @__PURE__ */ jsx("div", { class: "flex gap-2" }, /* @__PURE__ */ jsx("span", { class: `px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${method === "GET" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}` }, method))), /* @__PURE__ */ jsx("div", { class: "p-6" }, /* @__PURE__ */ jsx("div", { class: "flex items-center gap-2 mb-6 group" }, /* @__PURE__ */ jsx("div", { class: "flex-grow flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 group-hover:border-emerald-200 transition-colors" }, /* @__PURE__ */ jsx("code", { class: "text-sm font-mono text-slate-600 truncate" }, path2)), /* @__PURE__ */ jsx("div", { class: "flex gap-2" }, /* @__PURE__ */ jsx(
  "button",
  {
    onclick: `window.openApiModal('${category}', '${endpointId}', '/v1${path2}')`,
    class: "p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all",
    title: "Try in Playground"
  },
  /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" }), /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }))
), /* @__PURE__ */ jsx(
  "button",
  {
    onclick: `navigator.clipboard.writeText(window.location.origin + '/v1${path2}')`,
    class: "p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all",
    title: "Copy URL"
  },
  /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8.5V11a.5.5 0 00-.5-.5H9.75a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h.75a.5.5 0 00.5-.5z" }))
))), /* @__PURE__ */ jsx("div", { class: "space-y-4" }, /* @__PURE__ */ jsx("details", { class: "group" }, /* @__PURE__ */ jsx("summary", { class: "flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors list-none" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 group-open:rotate-180 transition-transform", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 9l-7 7-7-7" })), "Example Response"), /* @__PURE__ */ jsx("div", { class: "mt-4 animate-in fade-in slide-in-from-top-2 duration-300" }, /* @__PURE__ */ jsx("pre", { class: "text-[11px] leading-relaxed shadow-inner" }, /* @__PURE__ */ jsx("code", null, responseJson)))))));
var SectionTitle2 = ({ title: title3, icon, id, color = "emerald" }) => {
  const colorClasses = {
    emerald: "bg-emerald-600 shadow-emerald-100",
    blue: "bg-blue-600 shadow-blue-100",
    amber: "bg-amber-600 shadow-amber-100",
    rose: "bg-rose-600 shadow-rose-100",
    purple: "bg-purple-600 shadow-purple-100",
    indigo: "bg-indigo-600 shadow-indigo-100",
    slate: "bg-slate-600 shadow-slate-100"
  };
  return /* @__PURE__ */ jsx("div", { id, class: "flex items-center gap-3 mb-8 scroll-mt-24" }, /* @__PURE__ */ jsx("div", { class: `w-10 h-10 ${colorClasses[color] || colorClasses.emerald} rounded-lg flex items-center justify-center shadow-lg` }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: icon }))), /* @__PURE__ */ jsx("h2", { class: "text-2xl font-bold text-slate-900" }, title3));
};
var Other = () => {
  return /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" }, /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 lg:grid-cols-4 gap-12" }, /* @__PURE__ */ jsx("aside", { class: "hidden lg:block col-span-1 sticky top-28 self-start" }, /* @__PURE__ */ jsx("div", { class: "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm" }, /* @__PURE__ */ jsx("h3", { class: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3" }, "Menu Other API"), /* @__PURE__ */ jsx("nav", { class: "space-y-1" }, [
    { name: "Murottal", href: "#murottal", icon: "M11 5.882V19.118a3.63 3.63 0 01-5.12 3.574L1 18.817V5.183L5.88 1.309a3.63 3.63 0 015.12 3.573z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { name: "Sholat", href: "#sholat", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Kalender", href: "#calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Hadits", href: "#hadits", icon: "M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Asmaul Husna", href: "#asma", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" },
    { name: "Asbabun Nuzul", href: "#asbab", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { name: "Dzikir", href: "#dzikir", icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" },
    { name: "Doa-doa", href: "#doa", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { name: "Kemenag", href: "#kemenag", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { name: "Sejarah", href: "#sejarah", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { name: "Juz & Tema", href: "#extra", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { name: "Tools Cerdas", href: "#tools", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    { name: "Resources", href: "#resources", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }
  ].map((item, index) => /* @__PURE__ */ jsx(
    "a",
    {
      key: index,
      href: item.href,
      class: "flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all group"
    },
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: item.icon })),
    item.name
  ))))), /* @__PURE__ */ jsx("div", { class: "col-span-1 lg:col-span-3" }, /* @__PURE__ */ jsx("div", { class: "max-w-3xl mb-12" }, /* @__PURE__ */ jsx("h1", { class: "text-4xl font-extrabold text-slate-900 tracking-tight mb-4" }, "Other Resources"), /* @__PURE__ */ jsx("p", { class: "text-lg text-slate-600" }, "Kumpulan resource dan API lainnya yang mungkin bermanfaat untuk pengembangan aplikasi Anda.")), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "murottal",
      title: "Murottal Audio",
      icon: "M11 5.882V19.118a3.63 3.63 0 01-5.12 3.574L1 18.817V5.183L5.88 1.309a3.63 3.63 0 015.12 3.573z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      color: "emerald"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Daftar Qari",
      method: "GET",
      path: "/murotal/qari",
      category: "murottal",
      endpointId: "murottal-qari",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan daftar qari.",
  "data": [
    {
      "id": "01",
      "name": "Abdullah-Al-Juhany"
    },
    ...
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Murottal by Surah",
      method: "GET",
      path: "/murotal?surahId=1",
      category: "murottal",
      endpointId: "murottal-surah",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan audio murottal surah 1.",
  "data": {
    "01": "https://cdn.equran.id/audio-full/Abdullah-Al-Juhany/001.mp3",
    "02": "https://cdn.equran.id/audio-full/Abdul-Muhsin-Al-Qasim/001.mp3",
    ...
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "sholat",
      title: "Jadwal Sholat",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "blue"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Cari Kota",
      method: "GET",
      path: "/sholat/kota/cari?nama=jakarta",
      category: "sholat",
      endpointId: "sholat-cari-kota",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan daftar kota.",
  "data": [
    {
      "id": "1301",
      "lokasi": "KOTA JAKARTA"
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Jadwal by Kota ID",
      method: "GET",
      path: "/sholat/jadwal?kotaId=1301&tanggal=2025-12-24",
      category: "sholat",
      endpointId: "sholat-jadwal-kota",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan jadwal sholat.",
  "data": {
    "id": "1301",
    "kabko": "KOTA JAKARTA",
    "prov": "DKI JAKARTA",
    "jadwal": {
      "2025-12-24": {
        "tanggal": "Rabu, 24/12/2025",
        "imsak": "04:05",
        "subuh": "04:15",
        "terbit": "05:34",
        "dhuha": "06:04",
        "dzuhur": "11:56",
        "ashar": "15:22",
        "maghrib": "18:10",
        "isya": "19:26"
      }
    }
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Jadwal by Koordinat",
      method: "GET",
      path: "/sholat/jadwal/koordinat?lat=-6.1751&lon=106.8272",
      category: "sholat",
      endpointId: "sholat-jadwal-koordinat",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan jadwal sholat berdasarkan koordinat.",
  "data": {
    "location": "Monumen Nasional, Jalan Medan Merdeka Barat, Gambir, Jakarta Pusat",
    "city_found": "Jakarta Pusat",
    "id": "1301",
    "kabko": "KOTA JAKARTA",
    "prov": "DKI JAKARTA",
    "jadwal": {
      "2025-12-24": {
        "tanggal": "Rabu, 24/12/2025",
        "imsak": "04:05",
        "subuh": "04:15",
        "terbit": "05:34",
        "dhuha": "06:04",
        "dzuhur": "11:56",
        "ashar": "15:22",
        "maghrib": "18:10",
        "isya": "19:26"
      }
    }
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "calendar",
      title: "Kalender Hijriah",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "emerald"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Masehi ke Hijriah & Jawa",
      method: "GET",
      path: "/calendar/hijri?date=2024-03-11&adj=-1",
      category: "other",
      endpointId: "calendar-hijri",
      responseJson: `{
  "status": true,
  "message": "Berhasil konversi Masehi ke Hijriah.",
  "data": {
    "masehi": "2024-03-11",
    "adjustment": -1,
    "hijri": {
      "day": 1,
      "month": 9,
      "month_name": "Ramadan",
      ...
    }
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Hijriah ke Masehi",
      method: "GET",
      path: "/calendar/masehi?day=1&month=9&year=1445",
      category: "other",
      endpointId: "calendar-masehi",
      responseJson: `{
  "status": true,
  "message": "Berhasil konversi Hijriah ke Masehi.",
  "data": {
    "hijri": {
      "day": 1,
      "month": 9,
      "year": 1445
    },
    "masehi": {
      "day": 11,
      "day_name": "Senin",
      "month": 3,
      "month_name": "Maret",
      "year": 2024,
      "formatted": "Senin, 11 Maret 2024"
    }
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "hadits",
      title: "Hadits",
      icon: "M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "orange"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Daftar Hadits Arbain",
      method: "GET",
      path: "/hadits",
      category: "hadits",
      endpointId: "hadits-list",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan daftar hadits arbain.",
  "data": [
    {
      "id": 1,
      "no": "1",
      "judul": "Niat dan Ikhlas",
      "arab": "\u0625\u0650\u0646\u064E\u0651\u0645\u064E\u0627 \u0627\u0644\u0623\u064E\u0639\u0652\u0645\u064E\u0627\u0644\u064F \u0628\u0650\u0627\u0644\u0646\u0650\u0651\u064A\u064E\u0651\u0627\u062A\u0650...",
      "indo": "Sesungguhnya setiap amal itu tergantung niatnya..."
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Daftar Kitab Hadits",
      method: "GET",
      path: "/hadits/books",
      category: "hadits",
      endpointId: "hadits-books",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan seluruh koleksi kitab hadits.",
  "data": [
    { "name": "Abudaud", "id": "abu-daud", "available": 4419 },
    ...
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "asma",
      title: "Asmaul Husna",
      icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z",
      color: "indigo"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Semua Asmaul Husna",
      method: "GET",
      path: "/asma",
      category: "other",
      endpointId: "asma-list",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan seluruh daftar Asmaul Husna.",
  "data": [
    {
      "id": "1",
      "latin": "Ar-Rahman",
      "arabic": "\u0627\u0644\u0631\u062D\u0645\u0646",
      "translation_id": "Yang Maha Pengasih"
    },
    ...
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "asbab",
      title: "Asbabun Nuzul",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "amber"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Daftar Asbabun Nuzul",
      method: "GET",
      path: "/asbab",
      category: "other",
      endpointId: "asbab-list",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan seluruh daftar asbabun nuzul.",
  "data": [
    {
      "id": "1",
      "surah": "1",
      "ayah": "1",
      "text": "..."
    },
    ...
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "dzikir",
      title: "Dzikir",
      icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
      color: "indigo"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Daftar Dzikir",
      method: "GET",
      path: "/dzikir",
      category: "other",
      endpointId: "dzikir",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan seluruh daftar dzikir.",
  "data": [
    {
      "id": 1,
      "title": "Dzikir Pagi",
      "arabic": "\u0623\u064E\u0635\u0652\u0628\u064E\u062D\u0652\u0646\u064E\u0627 \u0648\u064E\u0623\u064E\u0635\u0652\u0628\u064E\u062D\u064E \u0627\u0644\u0652\u0645\u064F\u0644\u0652\u0643\u064F \u0644\u0650\u0644\u064E\u0651\u0647\u0650...",
      "translation": "Kami telah memasuki waktu pagi...",
      "type": "pagi"
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "doa",
      title: "Doa-doa",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      color: "rose"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Daftar Doa",
      method: "GET",
      path: "/doa",
      category: "other",
      endpointId: "doa-list",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan seluruh daftar doa.",
  "data": [
    {
      "id": 1,
      "judul": "Doa Sebelum Makan",
      "arab": "...",
      "latin": "...",
      "indo": "..."
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "extra",
      title: "Juz, Tema & Word",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      color: "slate"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Juz Al-Quran",
      method: "GET",
      path: "/juz",
      category: "quran",
      endpointId: "juz-list",
      responseJson: `{ "status": true, "message": "Berhasil mendapatkan daftar juz.", "data": [...] }`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Tema Al-Quran",
      method: "GET",
      path: "/theme",
      category: "quran",
      endpointId: "theme-list",
      responseJson: `{ "status": true, "message": "Berhasil mendapatkan daftar tema Al-Quran.", "data": [...] }`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Kata per Kata",
      method: "GET",
      path: "/word?surahId=1",
      category: "quran",
      endpointId: "word-ayah",
      responseJson: `{ "status": true, "message": "Berhasil mendapatkan data kata per kata surah 1.", "data": [...] }`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "kemenag",
      title: "Layanan Kemenag",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      color: "emerald"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Daftar Masjid & Mushalla (Source: SIMAS)",
      method: "GET",
      path: "/kemenag/masjid",
      category: "kemenag",
      endpointId: "kemenag-masjid-list",
      responseJson: `{
  "status": true,
  "message": "Data masjid/mushalla berhasil diambil (Source: SIMAS Kemenag)",
  "total_data_source": "317.218 Masjid",
  "data": [
    {
      "id": 1,
      "nama": "Masjid Istiqlal",
      "jenis": "Masjid",
      "tipologi": "Nasional",
      "lokasi": "Jakarta Pusat, DKI Jakarta",
      "kapasitas": "200.000",
      "tahun_berdiri": "1978",
      "deskripsi": "Masjid terbesar di Asia Tenggara."
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Filter Masjid/Mushalla",
      method: "GET",
      path: "/kemenag/masjid?jenis=Masjid&tipologi=Agung&lokasi=semarang",
      category: "kemenag",
      endpointId: "kemenag-masjid-search",
      responseJson: `{
  "status": true,
  "message": "Data masjid/mushalla berhasil diambil (Source: SIMAS Kemenag)",
  "total_data_source": "317.218 Masjid",
  "data": [
    {
      "id": 5,
      "nama": "Masjid Agung Jawa Tengah",
      "jenis": "Masjid",
      "tipologi": "Agung",
      "lokasi": "Semarang, Jawa Tengah",
      "kapasitas": "15.000",
      "tahun_berdiri": "2006",
      "deskripsi": "Masjid dengan payung hidrolik raksasa seperti di Nabawi."
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Hari Libur Nasional",
      method: "GET",
      path: "/kemenag/libur?year=2025",
      category: "kemenag",
      endpointId: "kemenag-libur",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan daftar hari libur tahun 2025.",
  "data": {
    "year": "2025",
    "holidays": [
      {
        "tanggal": "2025-01-01",
        "keterangan": "Tahun Baru 2025 Masehi",
        "is_cuti": false
      }
    ]
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Daftar Provinsi (Pesantren)",
      method: "GET",
      path: "/kemenag/provinsi",
      category: "kemenag",
      endpointId: "kemenag-provinsi",
      responseJson: `{ "status": true, "message": "Berhasil mendapatkan daftar provinsi.", "data": [...] }`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Daftar Kabupaten (Pesantren)",
      method: "GET",
      path: "/kemenag/kabupaten?provinsiId=32",
      category: "kemenag",
      endpointId: "kemenag-kabupaten",
      responseJson: `{ "status": true, "message": "Berhasil mendapatkan daftar kabupaten untuk provinsi 32.", "data": [...] }`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Daftar Pesantren",
      method: "GET",
      path: "/kemenag/pesantren?kabupatenId=3201",
      category: "kemenag",
      endpointId: "kemenag-pesantren",
      responseJson: `{ "status": true, "message": "Berhasil mendapatkan daftar pesantren untuk kabupaten 3201.", "data": [...] }`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "sejarah",
      title: "Sejarah Islam",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "blue"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Sejarah Islam & Sirah Nabawiyah",
      method: "GET",
      path: "/sejarah",
      category: "sejarah",
      endpointId: "sejarah-list",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan seluruh daftar sejarah.",
  "data": [
    {
      "id": 1,
      "peristiwa": "Kelahiran Nabi Muhammad SAW",
      "tahun": "571 M",
      "kategori": "Sirah Nabawiyah",
      "sumber": "Ar-Rahiq Al-Makhtum"
    },
    ...
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Detail Peristiwa Sejarah",
      method: "GET",
      path: "/sejarah/detail?id=1",
      category: "sejarah",
      endpointId: "sejarah-detail",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan detail sejarah.",
  "data": {
    "id": 1,
    "peristiwa": "Kelahiran Nabi Muhammad SAW",
    "tahun": "571 M (Tahun Gajah)",
    "deskripsi": "...",
    "kategori": "Sirah Nabawiyah",
    "sumber": "Ar-Rahiq Al-Makhtum"
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "tools",
      title: "Tools & Fitur Cerdas",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      color: "purple"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Kutipan Harian (Ayat & Hadits)",
      method: "GET",
      path: "/tools/quotes/daily",
      category: "tools",
      endpointId: "tools-quotes-daily",
      responseJson: `{
  "status": true,
  "message": "Berhasil mengambil kutipan harian.",
  "data": {
    "ayat": {
      "arab": "...",
      "text": "...",
      "sumber": "QS. Al-Baqarah: 153"
    },
    "hadits": {
      "arab": "...",
      "text": "...",
      "sumber": "HR. Bukhari"
    }
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Kalkulator Zakat",
      method: "GET",
      path: "/tools/zakat?type=maal&amount=100000000",
      category: "tools",
      endpointId: "tools-zakat",
      responseJson: `{
  "status": true,
  "message": "Kalkulasi zakat berhasil.",
  "data": {
    "type": "maal",
    "amount": 100000000,
    "nishab": 85000000,
    "isWajib": true,
    "zakat": 2500000,
    "keterangan": "Nishab Zakat Maal adalah setara 85 gram emas per tahun. Tarif zakat 2,5%."
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Arah Kiblat (Qibla Direction)",
      method: "GET",
      path: "/tools/qibla?lat=-6.1751&lng=106.8272",
      category: "tools",
      endpointId: "tools-qibla",
      responseJson: `{
  "status": true,
  "message": "Berhasil menghitung arah kiblat.",
  "data": {
    "coordinates": { "lat": -6.1751, "lng": 106.8272 },
    "kaaba": { "lat": 21.4225, "lng": 39.8262 },
    "qibla_direction": 295.12,
    "unit": "degrees"
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Pencarian Semantik (AI Search)",
      method: "GET",
      path: "/tools/semantic-search?query=sabar",
      category: "tools",
      endpointId: "tools-semantic-search",
      responseJson: `{
  "status": true,
  "message": "Pencarian semantik untuk 'sabar' berhasil.",
  "data": {
    "query": "sabar",
    "quran": [
      {
        "arab": "...",
        "text": "...",
        "sumber": "..."
      },
      "..."
    ],
    "hadits": [
      {
        "arab": "...",
        "text": "...",
        "sumber": "..."
      },
      "..."
    ]
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "resources",
      title: "Resources",
      icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
      color: "slate"
    }
  ), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-12" }, [
    { name: "GitHub Repository", url: "https://github.com/vrush2000/muslim-all-in-one-api", desc: "Source code and documentation" },
    { name: "Quran Kemenag", url: "https://quran.kemenag.go.id/", desc: "Official Quran data from Kemenag RI" },
    { name: "MyQuran (Prayer Times)", url: "https://api.myquran.com/", desc: "Prayer times and Islamic schedule API" },
    { name: "equran.id (Audio)", url: "https://equran.id/", desc: "Quran audio and digital text" },
    { name: "Muslim API Dataset (Repo)", url: "https://github.com/Otangid/muslim-api", desc: "Alternative Muslim API provider" },
    { name: "Hadith Collection (Repo)", url: "https://github.com/gadingnst/hadith-api", desc: "Comprehensive Hadith collection API" },
    { name: "Data Pesantren (Repo)", url: "https://github.com/nasrul21/data-pesantren-indonesia", desc: "Database pesantren se-Indonesia (Source)" },
    { name: "Libur Nasional (Repo)", url: "https://github.com/kresnasatya/api-harilibur", desc: "Data hari libur nasional Indonesia (Source)" }
  ].map((resource) => /* @__PURE__ */ jsx(
    "a",
    {
      href: resource.url,
      target: "_blank",
      rel: "noopener noreferrer",
      class: "p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group"
    },
    /* @__PURE__ */ jsx("div", { class: "flex items-center justify-between mb-1" }, /* @__PURE__ */ jsx("h4", { class: "font-bold text-slate-900 group-hover:text-emerald-600 transition-colors" }, resource.name), /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 text-slate-400 group-hover:text-emerald-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }))),
    /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-500 leading-relaxed" }, resource.desc)
  ))))));
};

// src/components/Landing.jsx
var Landing = () => {
  const apiCategories = [
    {
      title: "Al-Quran Indonesia",
      description: "Akses 114 Surah lengkap dengan teks Arab, Latin, Terjemahan, dan Tafsir Kemenag (Wajiz & Tahlili).",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "emerald",
      link: "/docs#quran"
    },
    {
      title: "Jadwal Sholat",
      description: "Jadwal waktu sholat harian berdasarkan kota atau koordinat lokasi di seluruh Indonesia.",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "blue",
      link: "/other#sholat"
    },
    {
      title: "Hadits Arba'in",
      description: "Kumpulan Hadits Arba'in Nawawi lengkap dengan teks Arab, terjemahan Indonesia, dan penjelasan.",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "amber",
      link: "/other#hadits"
    },
    {
      title: "Doa Harian",
      description: "Kumpulan doa-doa harian, dzikir pagi petang, dan doa setelah sholat.",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      color: "rose",
      link: "/other#doa"
    },
    {
      title: "Murottal Audio",
      description: "Streaming audio murottal dari berbagai Qari ternama dunia dengan kualitas tinggi.",
      icon: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
      color: "purple",
      link: "/other#murottal"
    },
    {
      title: "Asmaul Husna",
      description: "Daftar 99 nama Allah yang indah beserta arti, makna, dan dalilnya.",
      icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z",
      color: "indigo",
      link: "/other#asma"
    },
    {
      title: "Kemenag Open Data",
      description: "Akses data publik Kemenag seperti daftar pesantren, masjid, dan hari libur nasional.",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      color: "teal",
      link: "/other#kemenag"
    },
    {
      title: "Sejarah Islam",
      description: "Akses data sejarah Islam dan Sirah Nabawiyah yang autentik dan terpercaya.",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "blue",
      link: "/other#sejarah"
    },
    {
      title: "Fitur Cerdas & Tools",
      description: "Kalkulator zakat, pencarian semantik AI, arah kiblat, dan kutipan harian otomatis.",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4.343 4.343l.707.707m1.286 1.286L4.343 4.343M12 21v-1m0-1c-2.761 0-5-2.239-5-5a5 5 0 015-5 5 5 0 015 5c0 2.761-2.239 5-5 5z",
      color: "emerald",
      link: "/playground?category=tools"
    }
  ];
  return /* @__PURE__ */ jsx("div", { class: "relative overflow-hidden" }, /* @__PURE__ */ jsx("section", { class: "relative pt-20 pb-24 md:pt-32 md:pb-40 bg-white" }, /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20" }, /* @__PURE__ */ jsx("div", { class: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-30" }, /* @__PURE__ */ jsx("span", { class: "flex h-2 w-2" }, /* @__PURE__ */ jsx("span", { class: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })), "Platform Data Islami Terlengkap"), /* @__PURE__ */ jsx("h1", { class: "text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000" }, "Muslim API ", /* @__PURE__ */ jsx("span", { class: "text-emerald-600 block md:inline-block" }, /* @__PURE__ */ jsx("span", { id: "dynamic-text" }, "All-in-One"), /* @__PURE__ */ jsx("span", { class: "animate-pulse" }, "|"))), /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `
            (function() {
              const phrases = [
                'All-in-One',
                'Data Al-Qur\\'an',
                'Pencarian AI',
                'Kalkulator Zakat',
                'Arah Kiblat',
                'Hadits Arba\\'in',
                'Tafsir Kemenag',
                'Jadwal Sholat',
                'Koleksi Doa',
                'Sejarah Islam'
              ];
              let i = 0;
              let j = 0;
              let currentPhrase = [];
              let isDeleting = false;
              let isEnd = false;
              
              function loop() {
                const el = document.getElementById('dynamic-text');
                if (!el) {
                  setTimeout(loop, 500);
                  return;
                }

                isEnd = false;
                
                if (i < phrases.length) {
                  if (!isDeleting && j <= phrases[i].length) {
                    currentPhrase.push(phrases[i][j]);
                    j++;
                    el.innerHTML = currentPhrase.join('');
                  }

                  if (isDeleting && j >= 0) {
                    currentPhrase.pop();
                    j--;
                    el.innerHTML = currentPhrase.join('');
                  }

                  if (j == phrases[i].length) {
                    isEnd = true;
                    isDeleting = true;
                  }

                  if (isDeleting && j <= 0) {
                    currentPhrase = [];
                    isDeleting = false;
                    i++;
                    if (i == phrases.length) i = 0;
                    j = 0;
                  }
                }
                const spedUp = Math.random() * (50 - 30) + 30;
                const normalSpeed = Math.random() * (150 - 100) + 100;
                const time = isEnd ? 2000 : isDeleting ? spedUp : normalSpeed;
                setTimeout(loop, time);
              }

              // Start the loop after a short delay to ensure DOM is ready
              setTimeout(loop, 100);
            })();
          ` } }), /* @__PURE__ */ jsx("p", { class: "text-xl md:text-2xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200" }, "Infrastruktur data keislaman digital yang cepat, gratis, dan andal. Dirancang untuk mempercepat inovasi dalam dakwah teknologi."), /* @__PURE__ */ jsx("div", { class: "flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/docs",
      class: "w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 hover:shadow-emerald-300 flex items-center justify-center gap-2"
    },
    "Mulai Dokumentasi",
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M14 5l7 7-7 7" }))
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://github.com/vrush2000/muslim-all-in-one-api",
      target: "_blank",
      class: "w-full sm:w-auto px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
    },
    "GitHub Project"
  ))), /* @__PURE__ */ jsx("div", { class: "absolute inset-0 z-0 pointer-events-none overflow-hidden" }, /* @__PURE__ */ jsx("div", { class: "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60" }), /* @__PURE__ */ jsx("div", { class: "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px] opacity-60" }))), /* @__PURE__ */ jsx("section", { class: "py-24 bg-slate-50 border-y border-slate-200" }, /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" }, /* @__PURE__ */ jsx("div", { class: "space-y-8" }, /* @__PURE__ */ jsx("div", { class: "inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold uppercase tracking-wider" }, "Visi & Latar Belakang"), /* @__PURE__ */ jsx("h2", { class: "text-3xl md:text-4xl font-bold text-slate-900" }, "Mengapa Muslim API?"), /* @__PURE__ */ jsx("div", { class: "space-y-6 text-lg text-slate-600 leading-relaxed" }, /* @__PURE__ */ jsx("p", null, "Di era digital saat ini, akses terhadap data keislaman yang akurat, cepat, dan mudah diintegrasikan adalah sebuah kebutuhan fundamental. Banyak pengembang menghadapi kesulitan dalam menemukan API yang menyediakan data lengkap tanpa batasan yang memberatkan."), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-8 mt-8" }, /* @__PURE__ */ jsx("div", { class: "space-y-3" }, /* @__PURE__ */ jsx("h4", { class: "font-bold text-slate-900 flex items-center gap-2 text-xl" }, /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-emerald-500 rounded-full" }), "Misi Kami"), /* @__PURE__ */ jsx("p", { class: "text-base" }, "Menjadi ", /* @__PURE__ */ jsx("span", { class: "text-emerald-600 font-semibold" }, '"Single Source of Truth"'), " untuk data keislaman digital di Indonesia. Kami menyediakan infrastruktur data yang andal bagi siapapun yang ingin berdakwah melalui teknologi.")), /* @__PURE__ */ jsx("div", { class: "space-y-3" }, /* @__PURE__ */ jsx("h4", { class: "font-bold text-slate-900 flex items-center gap-2 text-xl" }, /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-emerald-500 rounded-full" }), "Filosofi Terbuka"), /* @__PURE__ */ jsx("p", { class: "text-base" }, "Muslim API dibangun dengan semangat ", /* @__PURE__ */ jsx("span", { class: "text-emerald-600 font-semibold" }, "Open Source"), ". Kami percaya bahwa ilmu agama harus dapat diakses seluas-luasnya tanpa ada penghalang teknis atau biaya."))), /* @__PURE__ */ jsx("div", { class: "mt-8 pt-8 border-t border-slate-200 italic text-slate-500 text-center md:text-left" }, '"Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain."'))), /* @__PURE__ */ jsx("div", { class: "relative" }, /* @__PURE__ */ jsx("div", { class: "bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 relative z-10" }, /* @__PURE__ */ jsx("div", { class: "space-y-6" }, /* @__PURE__ */ jsx("div", { class: "flex items-start gap-4" }, /* @__PURE__ */ jsx("div", { class: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "font-bold text-slate-900 mb-1" }, "Data Terverifikasi"), /* @__PURE__ */ jsx("p", { class: "text-slate-500 text-sm" }, "Sumber data Al-Quran kami mengikuti standar Mushaf Al-Quran Standar Indonesia (MSI) Kemenag RI."))), /* @__PURE__ */ jsx("div", { class: "flex items-start gap-4" }, /* @__PURE__ */ jsx("div", { class: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M13 10V3L4 14h7v7l9-11h-7z" }))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "font-bold text-slate-900 mb-1" }, "High Availability"), /* @__PURE__ */ jsx("p", { class: "text-slate-500 text-sm" }, "Dibangun di atas infrastruktur serverless untuk memastikan API selalu tersedia kapanpun dibutuhkan."))), /* @__PURE__ */ jsx("div", { class: "flex items-start gap-4" }, /* @__PURE__ */ jsx("div", { class: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "font-bold text-slate-900 mb-1" }, "Blockchain Integrity"), /* @__PURE__ */ jsx("p", { class: "text-slate-500 text-sm" }, "Keaslian data dijamin melalui cryptographic hashing untuk menjaga kemurnian teks suci."))))), /* @__PURE__ */ jsx("div", { class: "absolute -bottom-6 -right-6 w-full h-full bg-emerald-600/5 rounded-3xl -z-0" }))))), /* @__PURE__ */ jsx("section", { class: "py-24 bg-white" }, /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "text-center mb-16" }, /* @__PURE__ */ jsx("h2", { class: "text-3xl md:text-4xl font-bold text-slate-900 mb-4" }, "Layanan API Kami"), /* @__PURE__ */ jsx("p", { class: "text-lg text-slate-600 max-w-2xl mx-auto" }, "Berbagai kategori API yang siap Anda integrasikan ke dalam aplikasi Anda secara instan.")), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, apiCategories.map((api, index) => /* @__PURE__ */ jsx(
    "a",
    {
      key: index,
      href: api.link,
      class: "group p-8 rounded-3xl border border-slate-200 bg-white hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-300 relative overflow-hidden"
    },
    /* @__PURE__ */ jsx("div", { class: `absolute top-0 right-0 w-24 h-24 bg-${api.color}-50 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500` }),
    /* @__PURE__ */ jsx("div", { class: `w-14 h-14 bg-${api.color}-100 rounded-2xl flex items-center justify-center text-${api.color}-600 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10` }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: api.icon }))),
    /* @__PURE__ */ jsx("h3", { class: "text-xl font-bold text-slate-900 mb-3 relative z-10" }, api.title),
    /* @__PURE__ */ jsx("p", { class: "text-slate-600 leading-relaxed mb-6 relative z-10" }, api.description),
    /* @__PURE__ */ jsx("div", { class: `flex items-center gap-2 text-${api.color}-600 font-bold relative z-10` }, "Lihat Dokumentasi", /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 group-hover:translate-x-1 transition-transform", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M9 5l7 7-7 7" })))
  ))), /* @__PURE__ */ jsx("div", { class: "mt-20 bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden" }, /* @__PURE__ */ jsx("div", { class: "absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none" }, /* @__PURE__ */ jsx("svg", { viewBox: "0 0 400 400", xmlns: "http://www.w3.org/2000/svg", class: "w-full h-full" }, /* @__PURE__ */ jsx("path", { fill: "#10B981", d: "M47.7,-63.9C61.1,-55.8,70.8,-41,75.9,-25.1C81,-9.1,81.6,7.9,76.5,23.1C71.4,38.3,60.6,51.6,47.2,60.4C33.8,69.1,17.9,73.3,1.4,71.4C-15.1,69.4,-30.2,61.4,-44.2,52.5C-58.1,43.7,-70.9,34.1,-76.3,21.1C-81.8,8,-79.9,-8.5,-73.3,-22.9C-66.7,-37.3,-55.4,-49.6,-42.4,-57.8C-29.4,-66,-14.7,-70.1,0.6,-71C15.9,-71.8,31.8,-69.5,47.7,-63.9Z", transform: "translate(200 200)" }))), /* @__PURE__ */ jsx("div", { class: "relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" }, /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h2", { class: "text-3xl md:text-5xl font-bold text-white mb-6 leading-tight" }, "Coba API secara langsung di ", /* @__PURE__ */ jsx("span", { class: "text-emerald-400" }, "Playground")), /* @__PURE__ */ jsx("p", { class: "text-xl text-slate-400 mb-10 leading-relaxed" }, "Tidak perlu setup environment. Cukup pilih endpoint, masukkan parameter, dan lihat hasilnya dalam sekejap. Rasakan kemudahan integrasi Muslim API sekarang juga."), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/playground",
      class: "inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
    },
    "Buka Playground",
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M13 10V3L4 14h7v7l9-11h-7z" }))
  )), /* @__PURE__ */ jsx("div", { class: "hidden lg:block" }, /* @__PURE__ */ jsx("div", { class: "bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl" }, /* @__PURE__ */ jsx("div", { class: "flex items-center gap-2 mb-4" }, /* @__PURE__ */ jsx("div", { class: "flex gap-1.5" }, /* @__PURE__ */ jsx("div", { class: "w-3 h-3 rounded-full bg-rose-500" }), /* @__PURE__ */ jsx("div", { class: "w-3 h-3 rounded-full bg-amber-500" }), /* @__PURE__ */ jsx("div", { class: "w-3 h-3 rounded-full bg-emerald-500" }))), /* @__PURE__ */ jsx("pre", { class: "bg-transparent p-0 text-emerald-400 text-sm font-mono leading-relaxed" }, `{
  "status": true,
  "message": "Berhasil mengambil data surah.",
  "data": {
    "surah": "Al-Fatihah",
    "ayat": 7,
    "revelation": "Makkiyah",
    "translation": "Pembukaan"
  }
} `))))))), /* @__PURE__ */ jsx("section", { class: "py-24 bg-slate-900 relative overflow-hidden" }, /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10" }, /* @__PURE__ */ jsx("h2", { class: "text-3xl md:text-5xl font-bold text-white mb-8" }, "Siap Membangun Masa Depan Dakwah Digital?"), /* @__PURE__ */ jsx("p", { class: "text-xl text-slate-400 mb-12 max-w-2xl mx-auto" }, "Bergabunglah dengan ribuan pengembang lainnya yang telah menggunakan Muslim API. Mulai secara gratis hari ini."), /* @__PURE__ */ jsx("div", { class: "flex flex-col sm:flex-row items-center justify-center gap-4" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/docs",
      class: "w-full sm:w-auto px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2"
    },
    "Dapatkan Akses API"
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other",
      class: "w-full sm:w-auto px-10 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
    },
    "Lihat Contoh"
  ))), /* @__PURE__ */ jsx("div", { class: "absolute top-0 left-0 w-full h-full pointer-events-none opacity-30" }, /* @__PURE__ */ jsx("div", { class: "absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900 rounded-full blur-[150px]" }), /* @__PURE__ */ jsx("div", { class: "absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900 rounded-full blur-[150px]" }))));
};

// src/components/Playground.jsx
var Playground = ({ baseUrl }) => {
  return /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" }, /* @__PURE__ */ jsx("div", { class: "mb-12" }, /* @__PURE__ */ jsx("h1", { class: "text-4xl font-extrabold text-slate-900 tracking-tight mb-4" }, "API Playground"), /* @__PURE__ */ jsx("p", { class: "text-lg text-slate-600" }, "Uji coba API secara interaktif. Pilih endpoint, masukkan parameter, dan lihat hasilnya secara langsung.")), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-8" }, /* @__PURE__ */ jsx("div", { class: "space-y-6" }, /* @__PURE__ */ jsx("div", { class: "bg-white rounded-3xl border border-slate-200 p-8 shadow-sm" }, /* @__PURE__ */ jsx("h3", { class: "text-xl font-bold text-slate-900 mb-6 flex items-center gap-2" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M13 10V3L4 14h7v7l9-11h-7z" })), "Konfigurasi Request"), /* @__PURE__ */ jsx("div", { class: "space-y-4" }, /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("label", { class: "block text-sm font-semibold text-slate-700 mb-2" }, "Pilih Kategori"), /* @__PURE__ */ jsx(
    "select",
    {
      id: "category-select",
      class: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer",
      onchange: "window.updateEndpoints(this.value)"
    },
    /* @__PURE__ */ jsx("option", { value: "quran" }, "Al-Quran Indonesia"),
    /* @__PURE__ */ jsx("option", { value: "sholat" }, "Jadwal Sholat"),
    /* @__PURE__ */ jsx("option", { value: "hadits" }, "Hadits"),
    /* @__PURE__ */ jsx("option", { value: "murottal" }, "Murottal Audio"),
    /* @__PURE__ */ jsx("option", { value: "kemenag" }, "Kemenag Open Data"),
    /* @__PURE__ */ jsx("option", { value: "sejarah" }, "Sejarah Islam"),
    /* @__PURE__ */ jsx("option", { value: "tools" }, "Tools & Fitur Cerdas"),
    /* @__PURE__ */ jsx("option", { value: "integrity" }, "Integrity & Blockchain"),
    /* @__PURE__ */ jsx("option", { value: "other" }, "Lainnya (Asmaul Husna, Doa, dll)")
  )), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("label", { class: "block text-sm font-semibold text-slate-700 mb-2" }, "Endpoint"), /* @__PURE__ */ jsx(
    "select",
    {
      id: "endpoint-select",
      class: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer font-mono text-sm",
      onchange: "window.updateParams(this.value)"
    }
  )), /* @__PURE__ */ jsx("div", { id: "params-container", class: "space-y-4 pt-4 border-t border-slate-100 hidden" }, /* @__PURE__ */ jsx("label", { class: "block text-sm font-semibold text-slate-700" }, "Parameter"), /* @__PURE__ */ jsx("div", { id: "params-fields", class: "grid grid-cols-1 md:grid-cols-2 gap-4" })), /* @__PURE__ */ jsx("div", { class: "pt-6" }, /* @__PURE__ */ jsx(
    "button",
    {
      id: "send-request",
      onclick: "window.sendRequest()",
      class: "w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 group"
    },
    "Kirim Request",
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5 group-hover:translate-x-1 transition-transform", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M14 5l7 7-7 7" }))
  )))), /* @__PURE__ */ jsx("div", { class: "bg-emerald-50 rounded-2xl p-6 border border-emerald-100" }, /* @__PURE__ */ jsx("h4", { class: "font-bold text-emerald-800 mb-2 flex items-center gap-2" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })), "Tips"), /* @__PURE__ */ jsx("p", { class: "text-sm text-emerald-700 leading-relaxed" }, "Gunakan playground ini untuk memahami struktur response JSON sebelum mengimplementasikannya di aplikasi Anda. Base URL yang digunakan adalah ", /* @__PURE__ */ jsx("code", { class: "font-bold" }, baseUrl), "."))), /* @__PURE__ */ jsx("div", { class: "flex flex-col h-full lg:max-h-[700px]" }, /* @__PURE__ */ jsx("div", { class: "bg-slate-900 rounded-3xl shadow-2xl flex-grow overflow-hidden flex flex-col h-full" }, /* @__PURE__ */ jsx("div", { class: "px-6 py-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shrink-0" }, /* @__PURE__ */ jsx("div", { class: "flex items-center gap-3" }, /* @__PURE__ */ jsx("div", { class: "flex gap-1.5" }, /* @__PURE__ */ jsx("div", { class: "w-3 h-3 rounded-full bg-rose-500" }), /* @__PURE__ */ jsx("div", { class: "w-3 h-3 rounded-full bg-amber-500" }), /* @__PURE__ */ jsx("div", { class: "w-3 h-3 rounded-full bg-emerald-500" })), /* @__PURE__ */ jsx("span", { class: "text-xs font-bold text-slate-400 uppercase tracking-widest ml-2" }, "JSON Response")), /* @__PURE__ */ jsx("div", { id: "status-badge", class: "hidden" }, /* @__PURE__ */ jsx("span", { class: "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" }, "200 OK"))), /* @__PURE__ */ jsx("div", { class: "flex-grow overflow-hidden relative custom-scrollbar flex flex-col" }, /* @__PURE__ */ jsx("div", { id: "loader", class: "absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center hidden z-10" }, /* @__PURE__ */ jsx("div", { class: "flex flex-col items-center gap-4" }, /* @__PURE__ */ jsx("div", { class: "w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" }), /* @__PURE__ */ jsx("span", { class: "text-emerald-500 font-medium animate-pulse" }, "Memuat data..."))), /* @__PURE__ */ jsx("div", { id: "json-viewer-container", class: "flex-grow h-full w-full" })), /* @__PURE__ */ jsx("div", { class: "px-6 py-3 bg-slate-800 border-t border-slate-700 flex justify-between items-center text-[10px] text-slate-500 font-mono shrink-0" }, /* @__PURE__ */ jsx("span", { id: "response-time" }, "Time: 0ms"), /* @__PURE__ */ jsx("span", { id: "response-size" }, "Size: 0B"))))), /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }

        /* JSONEditor Custom Style */
        .jsoneditor {
          border: none !important;
        }
        .jsoneditor-menu {
          background-color: #1e293b !important;
          border-bottom: 1px solid #334155 !important;
        }
        .jsoneditor-navigation-bar {
          background-color: #1e293b !important;
          border-bottom: 1px solid #334155 !important;
        }
        .jsoneditor-outer {
          background-color: #0f172a !important;
        }
        .jsoneditor-tree {
          background-color: #0f172a !important;
        }
        .jsoneditor-separator {
          background-color: transparent !important;
        }
        .jsoneditor-values {
          color: #10b981 !important;
        }
        .jsoneditor-readonly {
          color: #94a3b8 !important;
        }
        .jsoneditor-string {
          color: #10b981 !important;
        }
        .jsoneditor-number {
          color: #3b82f6 !important;
        }
        .jsoneditor-boolean {
          color: #f59e0b !important;
        }
        .jsoneditor-null {
          color: #ef4444 !important;
        }
        .jsoneditor-field {
          color: #e2e8f0 !important;
        }
        div.jsoneditor-tree-inner {
          padding-bottom: 50px !important;
        }
      ` } }), /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `
        let editor = null;
        
        // Initialize JSONEditor
        const container = document.getElementById('json-viewer-container');
        const options = {
          mode: 'view',
          mainMenuBar: false,
          navigationBar: false,
          statusBar: false,
          onEditable: function (node) {
            return false;
          }
        };
        
        if (typeof JSONEditor !== 'undefined') {
          editor = new JSONEditor(container, options);
          editor.set({ message: "Response akan muncul di sini..." });
          editor.expandAll();
        }

        const endpoints = {
          quran: [
            { id: 'list-surah', path: '/surah', name: 'Daftar Surah', params: [] },
            { id: 'detail-surah', path: '/surah', name: 'Detail Surah', params: [{ name: 'surahId', placeholder: '1-114', type: 'number', default: '1', hint: 'Contoh: 1 (Al-Fatihah), 114 (An-Nas)' }] },
            { id: 'tafsir', path: '/tafsir', name: 'Tafsir Kemenag', params: [{ name: 'surahId', placeholder: '1-114', type: 'number', default: '1', hint: 'ID Surah (1-114)' }] },
            { id: 'ayah-surah', path: '/ayah/surah', name: 'Ayat by Surah', params: [{ name: 'surahId', placeholder: '1-114', type: 'number', default: '1', hint: 'ID Surah (1-114)' }] },
            { id: 'ayah-specific', path: '/ayah/specific', name: 'Spesifik Ayat', params: [{ name: 'surahId', placeholder: '1', type: 'number', default: '1', hint: 'ID Surah' }, { name: 'ayahId', placeholder: '1', type: 'number', default: '1', hint: 'Nomor Ayat' }] },
            { id: 'ayah-juz', path: '/ayah/juz', name: 'Ayat by Juz', params: [{ name: 'juzId', placeholder: '1-30', type: 'number', default: '30', hint: 'Nomor Juz (1-30)' }] },
            { id: 'ayah-page', path: '/ayah/page', name: 'Ayat by Halaman', params: [{ name: 'page', placeholder: '1-604', type: 'number', default: '604', hint: 'Halaman Al-Quran (1-604)' }] },
            { id: 'ayah-range', path: '/ayah/range', name: 'Range Ayat', params: [{ name: 'surahId', placeholder: '1', type: 'number', default: '1' }, { name: 'start', placeholder: '1', type: 'number', default: '1' }, { name: 'end', placeholder: '7', type: 'number', default: '7' }] },
            { id: 'ayah-find', path: '/ayah/find', name: 'Cari Ayat (Query)', params: [{ name: 'query', placeholder: 'alhamdulillah', type: 'text', default: 'alhamdulillah', hint: 'Kata kunci pencarian' }] },
            { id: 'juz-list', path: '/juz', name: 'Daftar Juz', params: [] },
            { id: 'juz-detail', path: '/juz', name: 'Detail Juz', params: [{ name: 'juzId', placeholder: '1-30', type: 'number', default: '30', hint: 'Nomor Juz (1-30)' }] },
            { id: 'theme-list', path: '/theme', name: 'Daftar Tema', params: [] },
            { id: 'theme-detail', path: '/theme', name: 'Detail Tema', params: [{ name: 'themeId', placeholder: '1', type: 'number', default: '1', hint: 'ID Tema' }] },
            { id: 'word-ayah', path: '/word', name: 'Kata per Kata', params: [{ name: 'surahId', placeholder: '1', type: 'number', default: '1' }, { name: 'ayahId', placeholder: '1', type: 'number', default: '1' }] },
          ],
          sholat: [
            { id: 'sholat-semua-kota', path: '/sholat/kota/semua', name: 'Semua Kota', params: [] },
            { id: 'sholat-cari-kota', path: '/sholat/kota/cari', name: 'Cari Kota', params: [{ name: 'nama', placeholder: 'jakarta', type: 'text', default: 'jakarta', hint: 'Nama kota yang dicari' }] },
            { id: 'sholat-jadwal-kota', path: '/sholat/jadwal', name: 'Jadwal by Kota ID', params: [
              { 
                name: 'kotaId', 
                type: 'select', 
                default: '1301', 
                options: [
                  { value: '1301', label: '1301 - KOTA JAKARTA' },
                  { value: '1206', label: '1206 - KOTA BANDUNG' },
                  { value: '1638', label: '1638 - KOTA SURABAYA' },
                  { value: '1210', label: '1210 - KOTA BOGOR' },
                  { value: '1505', label: '1505 - KOTA SEMARANG' },
                  { value: '1412', label: '1412 - KOTA YOGYAKARTA' },
                  { value: '1433', label: '1433 - KOTA SURAKARTA (SOLO)' },
                  { value: '1107', label: '1107 - KOTA MALANG' },
                  { value: '0228', label: '0228 - KOTA MEDAN' },
                  { value: '2218', label: '2218 - KOTA MAKASSAR' },
                  { value: '1810', label: '1810 - KOTA BANJARMASIN' },
                  { value: '0412', label: '0412 - KOTA PEKANBARU' },
                  { value: '0816', label: '0816 - KOTA PALEMBANG' },
                  { value: '1708', label: '1708 - KOTA DENPASAR' },
                  { value: '1214', label: '1214 - KOTA BEKASI' },
                  { value: '1211', label: '1211 - KOTA DEPOK' },
                  { value: '1217', label: '1217 - KOTA TANGERANG' },
                  { value: '1218', label: '1218 - KOTA TANGERANG SELATAN' },
                ] 
              }, 
              { name: 'tanggal', placeholder: '2025-12-25', type: 'date', default: new Date().toISOString().split('T')[0] }
            ] },
            { id: 'sholat-jadwal-koordinat', path: '/sholat/jadwal/koordinat', name: 'Jadwal by Koordinat', params: [{ name: 'lat', placeholder: '-6.1751', type: 'text', default: '-6.1751' }, { name: 'lon', placeholder: '106.8272', type: 'text', default: '106.8272' }] },
            { id: 'sholat-next', path: '/sholat/next', name: 'Waktu Sholat Terdekat', params: [{ name: 'lat', placeholder: '-6.1751', type: 'text', default: '-6.1751' }, { name: 'lon', placeholder: '106.8272', type: 'text', default: '106.8272' }] },
          ],
          hadits: [
            { id: 'hadits-list', path: '/hadits', name: 'Daftar Hadits Arbain', params: [] },
            { id: 'hadits-detail', path: '/hadits', name: 'Detail Hadits Arbain', params: [{ name: 'nomor', placeholder: '1-42', type: 'number', default: '1', hint: 'Nomor Hadits (1-42)' }] },
            { id: 'hadits-books', path: '/hadits/books', name: 'Daftar Kitab Hadits', params: [] },
            { id: 'hadits-by-book', path: '/hadits/books/abu-daud', name: 'Hadits by Kitab', params: [{ name: 'range', placeholder: '1-10', type: 'text', default: '1-10', hint: 'Contoh: 1-10 (Hadits nomor 1 sampai 10)' }] },
            { id: 'hadits-cari', path: '/hadits/find', name: 'Cari Hadits (Query)', params: [{ name: 'query', placeholder: 'puasa', type: 'text', default: 'puasa' }] },
          ],
          murottal: [
            { id: 'murottal-qari', path: '/murotal/qari', name: 'Daftar Qari', params: [] },
            { id: 'murottal-surah', path: '/murotal', name: 'Audio by Surah', params: [
              { name: 'surahId', placeholder: '1-114', type: 'number', default: '1', hint: 'ID Surah (1-114)' }, 
              { 
                name: 'qariId', 
                type: 'select', 
                default: '05', 
                options: [
                  { value: '01', label: '01 - Abdullah Al-Juhany' },
                  { value: '02', label: '02 - Abdul-Muhsin Al-Qasim' },
                  { value: '03', label: '03 - Abdurrahman as-Sudais' },
                  { value: '04', label: '04 - Ibrahim Al-Dossari' },
                  { value: '05', label: '05 - Misyari Rasyid Al-Afasi' },
                  { value: '06', label: '06 - Yasser Al-Dosari' },
                ]
              }
            ] },
          ],
          kemenag: [
            { id: 'kemenag-libur', path: '/kemenag/libur', name: 'Hari Libur Nasional', params: [{ name: 'year', type: 'number', default: '2025', placeholder: '2025' }] },
            { id: 'kemenag-provinsi', path: '/kemenag/provinsi', name: 'Daftar Provinsi (Pesantren)', params: [] },
            { id: 'kemenag-kabupaten', path: '/kemenag/kabupaten', name: 'Daftar Kabupaten (Pesantren)', params: [{ name: 'provinsiId', type: 'number', default: '32', placeholder: '32', hint: 'ID Provinsi (Contoh: 32 untuk Jabar)' }] },
            { id: 'kemenag-pesantren', path: '/kemenag/pesantren', name: 'Daftar Pesantren', params: [{ name: 'kabupatenId', type: 'number', default: '3201', placeholder: '3201', hint: 'ID Kabupaten (Contoh: 3201 untuk Bogor)' }] },
            { id: 'kemenag-masjid', path: '/kemenag/masjid', name: 'Daftar Masjid Utama', params: [] },
            { id: 'kemenag-masjid-nearby', path: '/kemenag/masjid/nearby', name: 'Masjid Terdekat (Geo)', params: [{ name: 'lat', type: 'text', default: '-6.1751' }, { name: 'lng', type: 'text', default: '106.8272' }, { name: 'radius', type: 'number', default: '5', hint: 'Radius dalam KM' }] },
          ],
          sejarah: [
            { id: 'sejarah-list', path: '/sejarah', name: 'Daftar Sirah Nabawiyah', params: [] },
            { id: 'sejarah-today', path: '/sejarah/today', name: 'Peristiwa Hari Ini', params: [] },
            { id: 'sejarah-detail', path: '/sejarah/detail', name: 'Detail Sejarah', params: [{ name: 'id', type: 'number', default: '1', placeholder: '1' }] },
          ],
          tools: [
            { id: 'tools-quotes', path: '/tools/quotes/daily', name: 'Daily Quotes', params: [] },
            { id: 'tools-zakat', path: '/tools/zakat', name: 'Kalkulator Zakat', params: [
              { name: 'type', type: 'select', default: 'maal', options: [{value:'maal', label:'Zakat Maal'}, {value:'penghasilan', label:'Zakat Penghasilan'}, {value:'fitrah', label:'Zakat Fitrah'}] },
              { name: 'amount', type: 'number', default: '100000000', hint: 'Jumlah harta/pendapatan' },
              { name: 'hargaEmas', type: 'number', default: '1200000', hint: 'Harga emas per gram (opsional)' }
            ]},
            { id: 'tools-qibla', path: '/tools/qibla', name: 'Arah Kiblat', params: [{ name: 'lat', type: 'text', default: '-6.1751' }, { name: 'lng', type: 'text', default: '106.8272' }] },
            { id: 'tools-search', path: '/tools/semantic-search', name: 'Pencarian Semantik (AI)', params: [{ name: 'query', type: 'text', default: 'sabar', hint: 'Cari di Quran & Hadits' }] },
          ],
          integrity: [
            { id: 'integrity-chain', path: '/integrity/chain', name: 'Integrity Chain', params: [] },
            { id: 'integrity-verify', path: '/integrity/verify/ayah', name: 'Verifikasi Ayah', params: [{ name: 'surahId', placeholder: '1', type: 'number', default: '1' }, { name: 'ayahId', placeholder: '1', type: 'number', default: '1' }] },
          ],
          other: [
            { id: 'asma-list', path: '/asma', name: 'Semua Asmaul Husna', params: [] },
            { id: 'asma-detail', path: '/asma', name: 'Detail Asmaul Husna', params: [{ name: 'id', placeholder: '1-99', type: 'number', default: '1', hint: 'Nomor 1-99' }] },
            { id: 'doa-list', path: '/doa', name: 'Daftar Doa', params: [] },
            { id: 'doa-detail', path: '/doa', name: 'Detail Doa', params: [{ name: 'id', placeholder: '1-30', type: 'number', default: '1', hint: 'ID Doa (1-30+)' }] },
            { id: 'dzikir', path: '/dzikir', name: 'Dzikir Pagi Petang', params: [] },
            { id: 'asbab-list', path: '/asbab', name: 'Daftar Asbabun Nuzul', params: [] },
            { id: 'asbab-detail', path: '/asbab', name: 'Detail Asbabun Nuzul', params: [{ name: 'id', placeholder: 'ID', type: 'number', default: '1' }] },
            { id: 'calendar-hijri', path: '/calendar/hijri', name: 'Konversi ke Hijriah', params: [{ name: 'date', placeholder: '2025-12-25', type: 'date', default: new Date().toISOString().split('T')[0], hint: 'Format: YYYY-MM-DD' }, { name: 'adj', placeholder: '0', type: 'number', default: '0', hint: 'Koreksi hari (-2 s/d 2)' }] },
            { id: 'calendar-masehi', path: '/calendar/masehi', name: 'Konversi ke Masehi', params: [{ name: 'day', placeholder: '1', type: 'number', default: '1' }, { name: 'month', placeholder: '1', type: 'number', default: '1' }, { name: 'year', placeholder: '1447', type: 'number', default: '1447' }] },
          ]
        };

        let currentCategory = 'quran';
        let currentEndpoint = null;
        let isInitialLoad = true;

        window.updateEndpoints = (category) => {
          currentCategory = category;
          const select = document.getElementById('endpoint-select');
          const data = endpoints[category];
          select.innerHTML = data.map(ep => '<option value="' + ep.id + '">' + ep.name + ' (' + ep.path + ')</option>').join('');
          window.updateParams(data[0].id);
        };

        window.updateParams = (endpointId) => {
          const endpoint = endpoints[currentCategory].find(ep => ep.id === endpointId);
          currentEndpoint = endpoint;
          const container = document.getElementById('params-container');
          const fields = document.getElementById('params-fields');
          
          if (endpoint.params.length > 0) {
            container.classList.remove('hidden');
            fields.innerHTML = endpoint.params.map(param => {
              if (param.type === 'select') {
                const optionsHtml = param.options.map(opt => 
                  '<option value="' + opt.value + '" ' + (opt.value === param.default ? 'selected' : '') + '>' + opt.label + '</option>'
                ).join('');

                return '<div class="space-y-1">' +
                    '<label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">' + param.name + '</label>' +
                    '<div class="relative">' +
                      '<select name="' + param.name + '" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer pr-8">' +
                        optionsHtml +
                      '</select>' +
                      '<div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">' +
                        '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>' +
                      '</div>' +
                    '</div>' +
                    (param.hint ? '<p class="text-[10px] text-slate-400 italic leading-tight">' + param.hint + '</p>' : '') +
                  '</div>';
              }
              return '<div class="space-y-1">' +
                  '<label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">' + param.name + '</label>' +
                  '<input type="' + param.type + '" name="' + param.name + '" value="' + (param.default || '') + '" placeholder="' + param.placeholder + '" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />' +
                  (param.hint ? '<p class="text-[10px] text-slate-400 italic leading-tight">' + param.hint + '</p>' : '') +
                '</div>';
            }).join('');
          } else {
            container.classList.add('hidden');
            fields.innerHTML = '';
          }
        };

        window.sendRequest = async () => {
          const loader = document.getElementById('loader');
          const statusBadge = document.getElementById('status-badge');
          const responseTime = document.getElementById('response-time');
          const responseSize = document.getElementById('response-size');
          
          loader.classList.remove('hidden');
          const startTime = performance.now();

          try {
            const inputs = document.querySelectorAll('#params-fields input, #params-fields select');
            let path = currentEndpoint.path;
            const queryParams = new URLSearchParams();

            inputs.forEach(input => {
              if (path.includes(':' + input.name)) {
                path = path.replace(':' + input.name, encodeURIComponent(input.value));
              } else if (input.value) {
                queryParams.append(input.name, input.value);
              }
            });

            const queryString = queryParams.toString();
            const fullUrl = \`\${window.location.origin}/v1\${path}\${queryString ? '?' + queryString : ''}\`;
            
            const response = await fetch(fullUrl);
            const data = await response.json();
            const endTime = performance.now();

            if (editor) {
              editor.set(data);
              editor.expandAll();
            }

            // Update stats
            statusBadge.innerHTML = \`<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider \${response.ok ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}">\${response.status} \${response.statusText}</span>\`;
            statusBadge.classList.remove('hidden');
            responseTime.textContent = \`Time: \${Math.round(endTime - startTime)}ms\`;
            responseSize.textContent = \`Size: \${(JSON.stringify(data).length / 1024).toFixed(2)}KB\`;

          } catch (error) {
            if (editor) {
              editor.set({ error: error.message });
              editor.expandAll();
            }
          } finally {
            loader.classList.add('hidden');
          }
        };

        // Initialize from URL params if exists
        window.addEventListener('load', () => {
          const urlParams = new URLSearchParams(window.location.search);
          const category = urlParams.get('category') || 'quran';
          const endpointId = urlParams.get('endpoint');

          document.getElementById('category-select').value = category;
          window.updateEndpoints(category);

          if (endpointId) {
            document.getElementById('endpoint-select').value = endpointId;
            window.updateParams(endpointId);
            // Auto send request if directed from other pages
            setTimeout(() => window.sendRequest(), 500);
          }
        });
      ` } }), /* @__PURE__ */ jsx("script", { src: "https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.10.2/jsoneditor.min.js" }), /* @__PURE__ */ jsx("link", { href: "https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.10.2/jsoneditor.min.css", rel: "stylesheet", type: "text/css" }));
};

// src/components/Status.jsx
var Status = ({ baseUrl }) => {
  return /* @__PURE__ */ jsx("div", { class: "min-h-screen bg-slate-50 pb-20" }, /* @__PURE__ */ jsx("div", { class: "bg-gradient-to-b from-emerald-600 to-emerald-800 text-white pt-20 pb-32" }, /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" }, /* @__PURE__ */ jsx("div", { class: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs font-bold mb-6 backdrop-blur-sm" }, /* @__PURE__ */ jsx("span", { class: "relative flex h-2 w-2" }, /* @__PURE__ */ jsx("span", { class: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ jsx("span", { class: "relative inline-flex rounded-full h-2 w-2 bg-emerald-400" })), "SYSTEM STATUS: OPERATIONAL"), /* @__PURE__ */ jsx("h1", { class: "text-4xl md:text-5xl font-extrabold mb-6 tracking-tight" }, "API System Monitoring"), /* @__PURE__ */ jsx("p", { class: "text-emerald-100/80 text-lg max-w-2xl mx-auto leading-relaxed" }, "Real-time monitoring and health checks for all Muslim API services and external providers."))), /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20" }, /* @__PURE__ */ jsx("div", { id: "status-grid", class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, /* @__PURE__ */ jsx("div", { class: "col-span-full mb-4" }, /* @__PURE__ */ jsx("h2", { class: "text-xl font-bold text-slate-900 flex items-center gap-2" }, /* @__PURE__ */ jsx("div", { class: "w-2 h-6 bg-emerald-500 rounded-full" }), "Core & Internal Services")), /* @__PURE__ */ jsx(
    StatusCard,
    {
      name: "Core API Engine",
      endpoint: "/health",
      description: "Status inti sistem dan database",
      type: "internal"
    }
  ), /* @__PURE__ */ jsx(
    StatusCard,
    {
      name: "Al-Quran API",
      endpoint: "/surah",
      description: "Teks, terjemahan, dan tafsir Al-Quran",
      type: "internal"
    }
  ), /* @__PURE__ */ jsx(
    StatusCard,
    {
      name: "Jadwal Sholat API",
      endpoint: "/sholat/kota/semua",
      description: "Layanan data waktu sholat",
      type: "internal"
    }
  ), /* @__PURE__ */ jsx(
    StatusCard,
    {
      name: "Hadits API",
      endpoint: "/hadits?nomor=1",
      description: "Koleksi Hadits Arbain & 9 Imam",
      type: "internal"
    }
  ), /* @__PURE__ */ jsx(
    StatusCard,
    {
      name: "Sejarah API",
      endpoint: "/sejarah",
      description: "Sejarah Islam & Sirah Nabawiyah",
      type: "internal"
    }
  ), /* @__PURE__ */ jsx(
    StatusCard,
    {
      name: "Kemenag API",
      endpoint: "/kemenag/masjid",
      description: "Data Masjid, Pesantren, & Libur",
      type: "internal"
    }
  ), /* @__PURE__ */ jsx(
    StatusCard,
    {
      name: "Integrity System",
      endpoint: "/integrity/verify",
      description: "Blockchain-based data verification",
      type: "internal"
    }
  ), /* @__PURE__ */ jsx("div", { class: "col-span-full mt-8 mb-4" }, /* @__PURE__ */ jsx("h2", { class: "text-xl font-bold text-slate-900 flex items-center gap-2" }, /* @__PURE__ */ jsx("div", { class: "w-2 h-6 bg-blue-500 rounded-full" }), "External Data Providers")), /* @__PURE__ */ jsx(
    StatusCard,
    {
      name: "equran.id",
      endpoint: "https://equran.id/api/v2/surat",
      description: "Audio Murottal & Quran v2",
      type: "external"
    }
  ), /* @__PURE__ */ jsx(
    StatusCard,
    {
      name: "MyQuran API",
      endpoint: "https://api.myquran.com/v2/sholat/kota/semua",
      description: "Source data Jadwal Sholat",
      type: "external"
    }
  ), /* @__PURE__ */ jsx(
    StatusCard,
    {
      name: "Hadith Gading",
      endpoint: "https://api.hadith.gading.dev/books",
      description: "Source data Hadits Besar",
      type: "external"
    }
  ))), /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `
        (function() {
          window.baseUrl = "${baseUrl}";
          
          async function checkStatus(card) {
            const endpoint = card.dataset.endpoint;
            const type = card.dataset.type;
            
            let fullUrl;
            if (type === 'internal') {
              // Use relative paths to avoid Mixed Content issues
              fullUrl = endpoint === '/health' ? '/health' : '/v1' + endpoint;
            } else {
              fullUrl = endpoint;
            }
            
            const statusEl = card.querySelector('.status-indicator');
            const textEl = card.querySelector('.status-text');
            const latencyEl = card.querySelector('.latency-text');
            const uptimeEl = card.querySelector('.uptime-bar');
            
            const start = performance.now();
            try {
              const fetchOptions = type === 'internal' ? { mode: 'cors' } : { mode: 'no-cors' };
              const response = await fetch(fullUrl, fetchOptions);
              const latency = Math.round(performance.now() - start);
              
              const isOnline = type === 'internal' ? response.ok : true;
              
              if (isOnline) {
                statusEl.className = 'status-indicator w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
                textEl.innerText = 'Online';
                textEl.className = 'status-text text-sm font-bold text-emerald-600';
                latencyEl.innerText = latency + 'ms';
                updateUptimeBar(uptimeEl, true);
              } else {
                throw new Error('Offline');
              }
            } catch (error) {
              statusEl.className = 'status-indicator w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
              textEl.innerText = 'Offline';
              textEl.className = 'status-text text-sm font-bold text-red-600';
              latencyEl.innerText = '-- ms';
              updateUptimeBar(uptimeEl, false);
            }
          }

          function updateUptimeBar(el, isOnline) {
            const dots = el.querySelectorAll('.uptime-dot');
            const lastIndex = dots.length - 1;
            for(let i = 0; i < lastIndex; i++) {
              dots[i].className = dots[i+1].className;
            }
            dots[lastIndex].className = 'uptime-dot h-4 w-1 rounded-full ' + (isOnline ? 'bg-emerald-500' : 'bg-red-500');
          }

          function initStatus() {
            const cards = document.querySelectorAll('.status-card');
            cards.forEach(card => {
              checkStatus(card);
              setInterval(() => checkStatus(card), 30000);
            });
          }

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initStatus);
          } else {
            initStatus();
          }
          
          window.addEventListener('load', function() {
            const cards = document.querySelectorAll('.status-card');
            const firstCard = cards[0];
            if (firstCard) {
              const textEl = firstCard.querySelector('.status-text');
              if (textEl && textEl.innerText === 'Checking...') {
                initStatus();
              }
            }
          });
        })();
      ` } }));
};
var StatusCard = ({ name, endpoint, description, type }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      class: "status-card bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group",
      "data-endpoint": endpoint,
      "data-type": type
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-between items-start mb-4" }, /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h3", { class: "font-bold text-slate-900 group-hover:text-emerald-600 transition-colors" }, name), /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-500 mt-1" }, description)), /* @__PURE__ */ jsx("div", { class: "flex flex-col items-end" }, /* @__PURE__ */ jsx("div", { class: "flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100" }, /* @__PURE__ */ jsx("div", { class: "status-indicator w-3 h-3 rounded-full bg-slate-300 animate-pulse" }), /* @__PURE__ */ jsx("span", { class: "status-text text-sm font-bold text-slate-400 italic" }, "Checking...")), /* @__PURE__ */ jsx("span", { class: "latency-text text-[10px] font-mono text-slate-400 mt-2" }, "-- ms"))),
    /* @__PURE__ */ jsx("div", { class: "space-y-3" }, /* @__PURE__ */ jsx("div", { class: "flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider" }, /* @__PURE__ */ jsx("span", null, "Uptime (Last 24h)"), /* @__PURE__ */ jsx("span", null, "99.9%")), /* @__PURE__ */ jsx("div", { class: "uptime-bar flex gap-0.5 h-4" }, [...Array(40)].map((_, i) => /* @__PURE__ */ jsx("div", { key: i, class: "uptime-dot h-4 w-1 rounded-full bg-emerald-500/20" }))), /* @__PURE__ */ jsx("div", { class: "flex justify-between text-[10px] text-slate-300" }, /* @__PURE__ */ jsx("span", null, "24h ago"), /* @__PURE__ */ jsx("span", null, "Just now"))),
    /* @__PURE__ */ jsx("div", { class: "mt-6 pt-4 border-t border-slate-50" }, /* @__PURE__ */ jsx("div", { class: "flex items-center justify-between" }, /* @__PURE__ */ jsx("span", { class: "text-[10px] text-slate-400 font-mono truncate max-w-[180px]" }, endpoint), /* @__PURE__ */ jsx("div", { class: "flex gap-2" }, /* @__PURE__ */ jsx("div", { class: "w-1.5 h-1.5 rounded-full bg-emerald-400" }), /* @__PURE__ */ jsx("div", { class: "w-1.5 h-1.5 rounded-full bg-emerald-400" }), /* @__PURE__ */ jsx("div", { class: "w-1.5 h-1.5 rounded-full bg-emerald-400" }))))
  );
};

// src/routes/index.jsx
var router = new Hono2();
var getBaseUrl = (c) => {
  const url = new URL(c.req.url);
  const proto = c.req.header("x-forwarded-proto") || url.protocol.split(":")[0];
  return `${proto}://${url.host}/v1`;
};
router.get("/", (c) => {
  return c.html(
    /* @__PURE__ */ jsx(Layout, { title: "Muslim All-In-One API | Platform Data Islami Terlengkap" }, /* @__PURE__ */ jsx(Landing, null))
  );
});
router.get("/docs", (c) => {
  const baseUrl = getBaseUrl(c);
  return c.html(
    /* @__PURE__ */ jsx(Layout, { title: "Muslim API | Documentation" }, /* @__PURE__ */ jsx(Home, { baseUrl }))
  );
});
router.get("/other", (c) => {
  return c.html(
    /* @__PURE__ */ jsx(Layout, { title: "Muslim All-in-One API | Resources" }, /* @__PURE__ */ jsx(Other, null))
  );
});
router.get("/playground", (c) => {
  const baseUrl = getBaseUrl(c);
  return c.html(
    /* @__PURE__ */ jsx(Layout, { title: "Muslim API | Playground" }, /* @__PURE__ */ jsx(Playground, { baseUrl }))
  );
});
router.get("/status", (c) => {
  const baseUrl = getBaseUrl(c);
  return c.html(
    /* @__PURE__ */ jsx(Layout, { title: "Muslim API | System Status" }, /* @__PURE__ */ jsx(Status, { baseUrl }))
  );
});
var routes_default = router;

// src/routes/muslim/v1/asbab.js
var asbab = new Hono2();
asbab.get("/", async (c) => {
  try {
    const id = c.req.query("asbabId") || c.req.query("id");
    if (id == null) {
      const data = await query("SELECT * FROM asbab_nuzul ORDER BY CAST(id as INTEGER) ASC");
      if (!data) {
        return c.json({ status: false, message: "Daftar Asbabun Nuzul tidak tersedia.", data: [] }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan daftar Asbabun Nuzul.", data });
      }
    } else {
      const data = await get("SELECT * FROM asbab_nuzul WHERE id = ?", [id]);
      if (!data) {
        return c.json({ status: false, message: "Asbabun Nuzul tidak ditemukan.", data: {} }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan detail Asbabun Nuzul.", data });
      }
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data Asbabun Nuzul: " + error.message }, 500);
  }
});
var asbab_default = asbab;

// src/routes/muslim/v1/asma.js
var asma = new Hono2();
asma.get("/", async (c) => {
  try {
    const id = c.req.query("asmaId") || c.req.query("id");
    if (id != null) {
      const data = await query("SELECT * FROM asmaul_husna WHERE id = ?", [id]);
      if (!data || data.length === 0) {
        return c.json({ status: false, message: "Asmaul Husna tidak ditemukan.", data: {} }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan detail Asmaul Husna.", data: data[0] });
      }
    } else {
      const data = await query("SELECT * FROM asmaul_husna ORDER BY CAST(id as INTEGER) ASC");
      if (!data) {
        return c.json({ status: false, message: "Daftar Asmaul Husna tidak tersedia.", data: [] }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan daftar Asmaul Husna.", data });
      }
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data Asmaul Husna: " + error.message }, 500);
  }
});
var asma_default = asma;

// src/routes/muslim/v1/ayah.js
var ayah = new Hono2();
var formatAyah = (a) => {
  return {
    ...a,
    audio_partial: a.audio_partial ? JSON.parse(a.audio_partial) : {}
  };
};
ayah.get("/", async (c) => {
  try {
    const data = await query("SELECT * FROM ayah ORDER BY CAST(id as INTEGER) ASC");
    return c.json({ status: true, message: "Berhasil mendapatkan daftar seluruh ayat.", data: (data || []).map(formatAyah) });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan daftar ayat: " + error.message }, 500);
  }
});
ayah.get("/range", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    const start = c.req.query("start");
    const end = c.req.query("end");
    if (surahId != null && start != null && end != null) {
      const data = await query(
        "SELECT * FROM ayah WHERE surah = ? AND ayah BETWEEN CAST(? as INTEGER) and CAST(? as INTEGER) ORDER BY CAST(id as INTEGER) ASC",
        [surahId, start, end]
      );
      return c.json({ status: true, message: `Berhasil mendapatkan ayat dari surah ${surahId} rentang ${start}-${end}.`, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (surahId, start, end)."
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan rentang ayat: " + error.message }, 500);
  }
});
ayah.get("/surah", async (c) => {
  try {
    const id = c.req.query("surahId") || c.req.query("id");
    if (id != null) {
      const data = await query(
        "SELECT * FROM ayah WHERE surah = ? ORDER BY CAST(id as INTEGER) ASC",
        [id]
      );
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk surah ${id}.`, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (surahId)."
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan ayat juz: " + error.message }, 500);
  }
});
ayah.get("/juz", async (c) => {
  try {
    const id = c.req.query("juzId") || c.req.query("id");
    if (id != null) {
      const data = await query(
        "SELECT * FROM ayah WHERE juz = ? ORDER BY CAST(id as INTEGER) ASC",
        [id]
      );
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk juz ${id}.`, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (juzId)."
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan ayat halaman: " + error.message }, 500);
  }
});
ayah.get("/page", async (c) => {
  try {
    const id = c.req.query("page") || c.req.query("id");
    if (id != null) {
      const data = await query(
        "SELECT * FROM ayah WHERE page = ? ORDER BY CAST(id as INTEGER) ASC",
        [id]
      );
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk halaman ${id}.`, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (page)."
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});
ayah.get("/specific", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    const ayahId = c.req.query("ayahId");
    if (surahId != null && ayahId != null) {
      const data = await get(
        "SELECT * FROM ayah WHERE surah = ? AND ayah = ?",
        [surahId, ayahId]
      );
      if (!data) {
        return c.json({ status: false, message: `Ayat ${ayahId} pada surah ${surahId} tidak ditemukan.`, data: {} }, 404);
      } else {
        return c.json({ status: true, message: `Berhasil mendapatkan detail ayat ${ayahId} pada surah ${surahId}.`, data: formatAyah(data) });
      }
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (surahId, ayahId)."
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan detail ayat: " + error.message }, 500);
  }
});
ayah.get("/find", async (c) => {
  try {
    const q = c.req.query("query");
    if (q != null && q.length > 3) {
      const data = await query(
        "SELECT * FROM ayah WHERE text LIKE ? ORDER BY CAST(id as INTEGER) ASC",
        [`%${q}%`]
      );
      return c.json({ status: true, message: `Berhasil mencari ayat dengan kata kunci: ${q}.`, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (query). Harus lebih dari 3 karakter."
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mencari ayat: " + error.message }, 500);
  }
});
var ayah_default = ayah;

// src/routes/muslim/v1/calendar.js
var calendar = new Hono2();
var getCalendarData = async () => {
  const months = await query("SELECT type, month_index, name FROM calendar_months");
  const days = await query("SELECT type, day_index, name FROM calendar_days");
  return {
    islamicMonths: months.filter((m) => m.type === "islamic").sort((a, b) => a.month_index - b.month_index).map((m) => m.name),
    jawaMonths: months.filter((m) => m.type === "jawa").sort((a, b) => a.month_index - b.month_index).map((m) => m.name),
    gregorianMonths: months.filter((m) => m.type === "gregorian").sort((a, b) => a.month_index - b.month_index).map((m) => m.name),
    pasaran: days.filter((d) => d.type === "pasaran").sort((a, b) => a.day_index - b.day_index).map((d) => d.name),
    jawaDays: days.filter((d) => d.type === "jawa").sort((a, b) => a.day_index - b.day_index).map((d) => d.name),
    gregorianDays: days.filter((d) => d.type === "gregorian").sort((a, b) => a.day_index - b.day_index).map((d) => d.name)
  };
};
var g2h = (date, adjustment = 0, calData) => {
  let tempDate = new Date(date);
  if (adjustment !== 0) {
    tempDate.setDate(tempDate.getDate() + adjustment);
  }
  let d = tempDate.getDate();
  let m = tempDate.getMonth() + 1;
  let y = tempDate.getFullYear();
  if (m < 3) {
    y -= 1;
    m += 12;
  }
  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
  let l = jd - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j = Math.floor((10985 - l) / 5316) * Math.floor(50 * l / 17719) + Math.floor(l / 5670) * Math.floor(43 * l / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor(17719 * j / 50) - Math.floor(j / 16) * Math.floor(15238 * j / 43) + 29;
  let month = Math.floor(24 * l / 709);
  let day = l - Math.floor(709 * month / 24);
  let year = 30 * n + j - 30;
  const { islamicMonths, jawaMonths, pasaran, jawaDays } = calData;
  const baseDate = new Date(1970, 0, 1);
  const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / (1e3 * 60 * 60 * 24));
  const pasaranIndex = ((diffDays + 3) % 5 + 5) % 5;
  const jawaDayIndex = date.getDay();
  return {
    day,
    month,
    month_name: islamicMonths[month - 1],
    year,
    jawa: {
      day,
      month,
      month_name: jawaMonths[month - 1],
      year: year + 512,
      pasaran: pasaran[pasaranIndex],
      day_name: jawaDays[jawaDayIndex],
      formatted: `${jawaDays[jawaDayIndex]} ${pasaran[pasaranIndex]}, ${day} ${jawaMonths[month - 1]} ${year + 512}`
    },
    formatted: `${day} ${islamicMonths[month - 1]} ${year} AH`
  };
};
var h2g = (hDay, hMonth, hYear, calData) => {
  let jd = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 30 * hMonth - Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385;
  let l = jd + 68569;
  let n = Math.floor(4 * l / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  let i = Math.floor(4e3 * (l + 1) / 1461001);
  l = l - Math.floor(1461 * i / 4) + 31;
  let j = Math.floor(80 * l / 2447);
  let d = l - Math.floor(2447 * j / 80);
  l = Math.floor(j / 11);
  let m = j + 2 - 12 * l;
  let y = 100 * (n - 49) + i + l;
  const date = new Date(y, m - 1, d);
  const { gregorianDays: dayNames, gregorianMonths: monthNames } = calData;
  return {
    day: d,
    day_name: dayNames[date.getDay()],
    month: m,
    month_name: monthNames[m - 1],
    year: y,
    formatted: `${dayNames[date.getDay()]}, ${d} ${monthNames[m - 1]} ${y}`
  };
};
calendar.get("/hijri", async (c) => {
  try {
    const dateStr = c.req.query("date");
    const adj = parseInt(c.req.query("adj")) || 0;
    let date;
    if (dateStr) {
      date = new Date(dateStr);
    } else {
      date = /* @__PURE__ */ new Date();
    }
    if (isNaN(date.getTime())) {
      return c.json({ status: false, message: "Format tanggal tidak valid. Gunakan YYYY-MM-DD." }, 400);
    }
    const calData = await getCalendarData();
    const hijri = g2h(date, adj, calData);
    return c.json({
      status: true,
      message: "Berhasil mengonversi tanggal Masehi ke Hijriah.",
      data: {
        masehi: date.toISOString().split("T")[0],
        adjustment: adj,
        hijri
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mengonversi tanggal: " + error.message }, 500);
  }
});
calendar.get("/masehi", async (c) => {
  try {
    const day = parseInt(c.req.query("day"));
    const month = parseInt(c.req.query("month"));
    const year = parseInt(c.req.query("year"));
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return c.json({ status: false, message: "Parameter tidak lengkap atau tidak valid. Membutuhkan day, month, dan year." }, 400);
    }
    if (month < 1 || month > 12 || day < 1 || day > 30) {
      return c.json({ status: false, message: "Nilai tanggal Hijriah tidak valid." }, 400);
    }
    const calData = await getCalendarData();
    const masehi = h2g(day, month, year, calData);
    return c.json({
      status: true,
      message: "Berhasil mengonversi tanggal Hijriah ke Masehi.",
      data: {
        hijri: {
          day,
          month,
          year
        },
        masehi
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mengonversi tanggal: " + error.message }, 500);
  }
});
var calendar_default = calendar;

// src/routes/muslim/v1/doa.js
var doa = new Hono2();
doa.get("/", async (c) => {
  try {
    const source = c.req.query("source");
    if (source != null) {
      const data = await query(
        "SELECT * FROM doa WHERE source = ? ORDER BY judul ASC",
        [source]
      );
      return c.json({ status: true, message: `Berhasil mendapatkan doa dari sumber: ${source}.`, data: data || [] });
    } else {
      const data = await query("SELECT * FROM doa ORDER BY judul ASC");
      return c.json({ status: true, message: "Berhasil mendapatkan daftar doa.", data: data || [] });
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data doa: " + error.message }, 500);
  }
});
doa.get("/find", async (c) => {
  try {
    const q = c.req.query("query");
    if (q != null) {
      const data = await query(
        "SELECT * FROM doa WHERE judul LIKE ? ORDER BY judul ASC",
        [`%${q}%`]
      );
      return c.json({ status: true, message: `Berhasil mencari doa dengan kata kunci: ${q}.`, data: data || [] });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (query)."
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mencari doa: " + error.message }, 500);
  }
});
var doa_default = doa;

// src/routes/muslim/v1/dzikir.js
var dzikir = new Hono2();
dzikir.get("/", async (c) => {
  try {
    const type = c.req.query("type");
    if (type != null) {
      const data = await query(
        "SELECT * FROM dzikir WHERE type = ?",
        [type]
      );
      return c.json({ status: true, message: `Berhasil mendapatkan dzikir tipe: ${type}.`, data: data || [] });
    } else {
      const data = await query("SELECT * FROM dzikir");
      return c.json({ status: true, message: "Berhasil mendapatkan daftar dzikir.", data: data || [] });
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data dzikir: " + error.message }, 500);
  }
});
var dzikir_default = dzikir;

// src/config.js
var API_CONFIG = {
  SHOLAT: {
    MYQURAN: "https://api.myquran.com/v2/sholat",
    NOMINATIM: "https://nominatim.openstreetmap.org/reverse"
  },
  HADITS: {
    GADING: "https://api.hadith.gading.dev"
  },
  KEMENAG: {
    HARI_LIBUR: "https://api-harilibur.vercel.app/api",
    PESANTREN: "https://api-pesantren-indonesia.vercel.app"
  }
};

// src/routes/muslim/v1/hadits.js
var hadits = new Hono2();
var GADING_API_BASE = API_CONFIG.HADITS.GADING;
hadits.get("/", async (c) => {
  try {
    const nomor = c.req.query("nomor");
    if (nomor != null) {
      const data = await get("SELECT * FROM hadits WHERE no = ?", [nomor]);
      if (!data) {
        return c.json({ status: false, message: "Hadits tidak ditemukan.", data: {} }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan detail Hadits Arbain.", data });
      }
    } else {
      const data = await query("SELECT * FROM hadits ORDER BY CAST(no as INTEGER) ASC");
      return c.json({ status: true, message: "Berhasil mendapatkan daftar Hadits Arbain.", data: data || [] });
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data hadits: " + error.message }, 500);
  }
});
hadits.get("/books", async (c) => {
  try {
    const response = await fetch(`${GADING_API_BASE}/books`);
    const data = await response.json();
    if (!response.ok || data.code && data.code !== 200) {
      return c.json({
        status: false,
        message: "Gagal mengambil daftar kitab hadits dari API sumber.",
        error: data.message || "Unknown error"
      }, response.status || 502);
    }
    return c.json({
      status: true,
      message: "Berhasil mendapatkan daftar kitab hadits.",
      data: data.data || data
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan daftar kitab hadits: " + error.message }, 500);
  }
});
hadits.get("/books/:name", async (c) => {
  try {
    const name = c.req.param("name");
    const range = c.req.query("range");
    const url = range ? `${GADING_API_BASE}/books/${name}?range=${range}` : `${GADING_API_BASE}/books/${name}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok || data.code && data.code !== 200) {
      return c.json({
        status: false,
        message: `Gagal mengambil daftar hadits dari kitab ${name} dari API sumber.`,
        error: data.message || "Unknown error"
      }, response.status || 502);
    }
    return c.json({
      status: true,
      message: `Berhasil mendapatkan daftar hadits dari kitab ${name}.`,
      data: data.data || data
    });
  } catch (error) {
    return c.json({ status: false, message: `Gagal mendapatkan daftar hadits dari kitab ${c.req.param("name")}: ` + error.message }, 500);
  }
});
hadits.get("/books/:name/:number", async (c) => {
  try {
    const name = c.req.param("name");
    const number = c.req.param("number");
    const response = await fetch(`${GADING_API_BASE}/books/${name}/${number}`);
    const data = await response.json();
    if (!response.ok || data.code && data.code !== 200) {
      return c.json({
        status: false,
        message: `Gagal mengambil detail hadits nomor ${number} dari kitab ${name} dari API sumber.`,
        error: data.message || "Unknown error"
      }, response.status || 502);
    }
    return c.json({
      status: true,
      message: `Berhasil mendapatkan detail hadits nomor ${number} dari kitab ${name}.`,
      data: data.data || data
    });
  } catch (error) {
    return c.json({ status: false, message: `Gagal mendapatkan detail hadits dari kitab ${c.req.param("name")}: ` + error.message }, 500);
  }
});
hadits.get("/find", async (c) => {
  try {
    const q = c.req.query("query");
    if (q != null) {
      const data = await query(
        "SELECT * FROM hadits WHERE judul LIKE ? ORDER BY CAST(no as INTEGER) ASC",
        [`%${q}%`]
      );
      return c.json({ status: true, message: `Berhasil mencari hadits dengan kata kunci: ${q}.`, data: data || [] });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (query)."
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mencari hadits: " + error.message }, 500);
  }
});
var hadits_default = hadits;

// src/routes/muslim/v1/juz.js
var juz = new Hono2();
juz.get("/", async (c) => {
  try {
    const juzId = c.req.query("juzId") || c.req.query("id");
    if (juzId != null) {
      const data = await get("SELECT * FROM juz WHERE number = ?", [juzId]);
      if (!data) {
        return c.json({ status: false, message: "Juz tidak ditemukan.", data: {} }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan detail juz.", data });
      }
    } else {
      const data = await query("SELECT * FROM juz ORDER BY CAST (number as INTEGER) ASC");
      return c.json({ status: true, message: "Berhasil mendapatkan daftar seluruh juz.", data: data || [] });
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data juz: " + error.message }, 500);
  }
});
var juz_default = juz;

// src/routes/muslim/v1/murotal.js
var murotal = new Hono2();
murotal.get("/qari", async (c) => {
  try {
    const data = await query("SELECT * FROM qari ORDER BY id ASC");
    return c.json({
      status: true,
      message: "Berhasil mendapatkan daftar qari.",
      data
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan daftar qari: " + error.message }, 500);
  }
});
murotal.get("/", async (c) => {
  try {
    const qariId = c.req.query("qariId") || "05";
    const surahId = c.req.query("surahId");
    const qari = await get("SELECT * FROM qari WHERE id = ?", [qariId]);
    if (surahId) {
      const data = await query("SELECT number, name_id, name_short, audio_full FROM surah WHERE number = ?", [surahId]);
      if (data.length === 0) {
        return c.json({ status: false, message: "Surah tidak ditemukan." }, 404);
      }
      const surah2 = data[0];
      const audioFull = JSON.parse(surah2.audio_full || "{}");
      return c.json({
        status: true,
        message: `Berhasil mendapatkan murotal surah ${surah2.name_id} untuk qari ${qari ? qari.name : qariId}.`,
        data: {
          surahId: surah2.number,
          name: surah2.name_id,
          name_short: surah2.name_short,
          qariId,
          audio_url: audioFull[qariId] || null
        }
      });
    }
    const allSurahs = await query("SELECT number, name_id, name_short, audio_full FROM surah ORDER BY CAST(number as INTEGER) ASC");
    const result = allSurahs.map((s) => {
      const audioFull = JSON.parse(s.audio_full || "{}");
      return {
        surahId: s.number,
        name: s.name_id,
        name_short: s.name_short,
        audio_url: audioFull[qariId] || null
      };
    });
    return c.json({
      status: true,
      message: `Berhasil mendapatkan daftar murotal untuk qari ${qari ? qari.name : qariId}.`,
      qari: qari || { id: qariId, name: "Unknown" },
      data: result
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data murotal: " + error.message }, 500);
  }
});
var murotal_default = murotal;

// src/routes/muslim/v1/integrity.js
import crypto2 from "crypto";
var integrity = new Hono2();
var generateHash = (data) => {
  return crypto2.createHash("sha256").update(JSON.stringify(data)).digest("hex");
};
integrity.get("/chain", async (c) => {
  try {
    const surahs = await query("SELECT number, name_id FROM surah ORDER BY CAST(number as INTEGER) ASC");
    let chain = [];
    let previousHash = "0".repeat(64);
    for (const surah2 of surahs) {
      const ayahs = await query(
        "SELECT arab, text FROM ayah WHERE surah = ? ORDER BY CAST(ayah as INTEGER) ASC",
        [surah2.number]
      );
      const blockData = {
        surah_number: surah2.number,
        surah_name: surah2.name_id,
        ayah_count: ayahs.length,
        content_hash: generateHash(ayahs),
        // Hash of all ayahs in this surah
        previous_hash: previousHash,
        version: "1.0.0",
        timestamp: "2025-12-24T00:00:00Z"
        // Standardized for this version
      };
      const blockHash = generateHash(blockData);
      chain.push({
        block_height: chain.length + 1,
        hash: blockHash,
        ...blockData
      });
      previousHash = blockHash;
    }
    return c.json({
      status: true,
      message: "Data Integrity Chain (Proof of Authenticity) berhasil dibuat.",
      network: "Muslim-API Data Ledger",
      root_hash: previousHash,
      chain
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data integrity chain: " + error.message }, 500);
  }
});
integrity.get("/verify", async (c) => {
  try {
    const surah2 = await query("SELECT number, name_id FROM surah WHERE number = 1");
    const ayahs = await query(
      "SELECT arab, text FROM ayah WHERE surah = 1 ORDER BY CAST(ayah as INTEGER) ASC"
    );
    const isDataValid = surah2 && surah2.length > 0 && ayahs && ayahs.length > 0;
    return c.json({
      status: true,
      message: isDataValid ? "Integritas sistem terverifikasi." : "Sistem Online (Pengecekan data tertunda).",
      check: "Surah Al-Fatihah",
      integrity: isDataValid ? "Healthy" : "Warning",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    return c.json({
      status: true,
      message: "Sistem Online (Error pada pengecekan integritas).",
      integrity: "Error",
      error: error.message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
integrity.get("/verify/ayah", async (c) => {
  const surahId = c.req.query("surahId");
  const ayahId = c.req.query("ayahId");
  if (!surahId || !ayahId) {
    return c.json({ status: false, message: "Parameter surahId dan ayahId diperlukan." }, 400);
  }
  try {
    const data = await get(
      "SELECT arab, text FROM ayah WHERE surah = ? AND ayah = ?",
      [surahId, ayahId]
    );
    if (!data) {
      return c.json({ status: false, message: `Ayat ${ayahId} pada surah ${surahId} tidak ditemukan.`, data: {} }, 404);
    }
    return c.json({
      status: true,
      message: `Berhasil memverifikasi integritas ayat ${ayahId} pada surah ${surahId}.`,
      data: {
        surahId,
        ayahId,
        hash: generateHash(data),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal memverifikasi integritas ayat: " + error.message }, 500);
  }
});
var integrity_default = integrity;

// src/routes/muslim/v1/sholat.js
var sholat = new Hono2();
var BASE_API = API_CONFIG.SHOLAT.MYQURAN;
var kotaCache = null;
sholat.get("/kota/semua", async (c) => {
  try {
    if (kotaCache) return c.json({ status: true, message: "Berhasil mendapatkan daftar kota (dari cache).", data: kotaCache });
    const response = await fetch(`${BASE_API}/kota/semua`);
    const data = await response.json();
    if (data.status) {
      kotaCache = data.data;
      return c.json({ status: true, message: "Berhasil mendapatkan daftar kota.", data: data.data });
    }
    return c.json({ status: false, message: "Gagal mengambil data kota dari API sumber." }, 502);
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan daftar kota: " + error.message }, 500);
  }
});
sholat.get("/kota/cari", async (c) => {
  const query2 = c.req.query("nama");
  if (!query2) return c.json({ status: false, message: "Parameter nama diperlukan." }, 400);
  try {
    const response = await fetch(`${BASE_API}/kota/cari/${query2}`);
    const data = await response.json();
    if (!response.ok || !data.status) {
      return c.json({
        status: false,
        message: `Gagal mencari kota dengan kata kunci: ${query2} dari API sumber.`,
        error: data.message || "Unknown error"
      }, response.status || 502);
    }
    return c.json({
      status: true,
      message: `Berhasil mencari kota dengan kata kunci: ${query2}.`,
      data: data.data || []
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mencari kota: " + error.message }, 500);
  }
});
sholat.get("/jadwal", async (c) => {
  const kotaId = c.req.query("kotaId");
  const tanggal = c.req.query("tanggal") || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  if (!kotaId) return c.json({ status: false, message: "Parameter kotaId diperlukan." }, 400);
  try {
    const response = await fetch(`${BASE_API}/jadwal/${kotaId}/${tanggal}`);
    const data = await response.json();
    if (!response.ok || !data.status) {
      return c.json({
        status: false,
        message: `Gagal mengambil jadwal sholat untuk kota ID ${kotaId} dari API sumber.`,
        error: data.message || "Unknown error"
      }, response.status || 502);
    }
    return c.json({
      status: true,
      message: `Berhasil mendapatkan jadwal sholat untuk kota ID ${kotaId} pada tanggal ${tanggal}.`,
      data: data.data ? data.data.jadwal : null
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan jadwal sholat: " + error.message }, 500);
  }
});
sholat.get("/jadwal/koordinat", async (c) => {
  const lat = c.req.query("lat");
  const lon = c.req.query("lon");
  const tanggal = c.req.query("tanggal") || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  if (!lat || !lon) {
    return c.json({ status: false, message: "Parameter lat dan lon diperlukan." }, 400);
  }
  try {
    const geoRes = await fetch(`${API_CONFIG.SHOLAT.NOMINATIM}?format=json&lat=${lat}&lon=${lon}&zoom=10`, {
      headers: { "User-Agent": "Muslim-API/1.0" }
    });
    if (!geoRes.ok) {
      return c.json({ status: false, message: "Gagal mendapatkan data lokasi dari Nominatim." }, 502);
    }
    const geoData = await geoRes.json();
    const address = geoData.address || {};
    const city = address.city || address.town || address.municipality || address.county;
    if (!city) {
      return c.json({ status: false, message: "Lokasi tidak ditemukan." }, 404);
    }
    const cleanCityName = city.replace(/Kota |Kabupaten /g, "").trim();
    const kotaRes = await fetch(`${BASE_API}/kota/cari/${cleanCityName}`);
    const kotaData = await kotaRes.json();
    if (!kotaRes.ok || !kotaData.status || !kotaData.data || kotaData.data.length === 0) {
      return c.json({
        status: false,
        message: `Kota ${cleanCityName} tidak terdaftar di database Kemenag.`,
        location: city
      }, 404);
    }
    const kotaId = kotaData.data[0].id;
    const jadwalRes = await fetch(`${BASE_API}/jadwal/${kotaId}/${tanggal}`);
    const data = await jadwalRes.json();
    if (!jadwalRes.ok || !data.status) {
      return c.json({ status: false, message: "Gagal mengambil jadwal dari API sumber." }, 502);
    }
    return c.json({
      status: true,
      message: `Berhasil mendapatkan jadwal sholat untuk lokasi ${city} (${lat}, ${lon}).`,
      data: {
        location: city,
        coordinates: { lat, lon },
        jadwal: data.data ? data.data.jadwal : null
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan jadwal sholat berdasarkan koordinat: " + error.message }, 500);
  }
});
sholat.get("/next", async (c) => {
  const lat = c.req.query("lat");
  const lon = c.req.query("lon");
  if (!lat || !lon) {
    return c.json({ status: false, message: "Parameter lat dan lon diperlukan." }, 400);
  }
  try {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const cityRes = await fetch(`${API_CONFIG.SHOLAT.NOMINATIM}?format=json&lat=${lat}&lon=${lon}&zoom=10`, {
      headers: { "User-Agent": "Muslim-API/1.0" }
    });
    if (!cityRes.ok) {
      return c.json({ status: false, message: "Gagal mendapatkan data lokasi dari Nominatim." }, 502);
    }
    const geoData = await cityRes.json();
    const address = geoData.address || {};
    const city = address.city || address.town || address.municipality || address.county;
    if (!city) {
      return c.json({ status: false, message: "Lokasi tidak ditemukan." }, 404);
    }
    const cleanCityName = city.replace(/Kota |Kabupaten /g, "").trim();
    const kotaRes = await fetch(`${BASE_API}/kota/cari/${cleanCityName}`);
    const kotaData = await kotaRes.json();
    if (!kotaRes.ok || !kotaData.status || !kotaData.data || kotaData.data.length === 0) {
      return c.json({ status: false, message: `Kota ${cleanCityName} tidak terdaftar.` }, 404);
    }
    const kotaId = kotaData.data[0].id;
    const jadwalRes = await fetch(`${BASE_API}/jadwal/${kotaId}/${today}`);
    const jadwalData = await jadwalRes.json();
    if (!jadwalRes.ok || !jadwalData.status) return c.json({ status: false, message: "Gagal mengambil jadwal dari API sumber." }, 502);
    const jadwal = jadwalData.data.jadwal;
    const now = /* @__PURE__ */ new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const times = [
      { name: "Imsak", time: jadwal.imsak },
      { name: "Subuh", time: jadwal.subuh },
      { name: "Terbit", time: jadwal.terbit },
      { name: "Dhuha", time: jadwal.dhuha },
      { name: "Dzuhur", time: jadwal.dzuhur },
      { name: "Ashar", time: jadwal.ashar },
      { name: "Maghrib", time: jadwal.maghrib },
      { name: "Isya", time: jadwal.isya }
    ];
    let nextPrayer = null;
    for (const t of times) {
      const [h, m] = t.time.split(":").map(Number);
      const prayerMinutes = h * 60 + m;
      if (prayerMinutes > currentTime) {
        const diff = prayerMinutes - currentTime;
        nextPrayer = {
          name: t.name,
          time: t.time,
          remaining_minutes: diff,
          remaining_hours: Math.floor(diff / 60),
          remaining_minutes_only: diff % 60
        };
        break;
      }
    }
    if (!nextPrayer) {
      nextPrayer = { name: "Subuh (Besok)", time: times[1].time, message: "Waktu Isya telah lewat" };
    }
    return c.json({
      status: true,
      message: "Waktu sholat terdekat berhasil didapatkan.",
      data: {
        current_time: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        next_prayer: nextPrayer,
        location: city,
        jadwal_today: jadwal
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan waktu sholat terdekat: " + error.message }, 500);
  }
});
var sholat_default = sholat;

// src/routes/muslim/v1/surah.js
var surah = new Hono2();
var formatSurah = (s) => {
  return {
    ...s,
    audio_full: s.audio_full ? JSON.parse(s.audio_full) : {}
  };
};
surah.get("/", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    if (surahId != null) {
      const data = await get("SELECT * FROM surah WHERE number = ?", [surahId]);
      if (!data) {
        return c.json({ status: false, message: "Surah tidak ditemukan.", data: {} }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan detail surah.", data: formatSurah(data) });
      }
    } else {
      const data = await query("SELECT * FROM surah ORDER BY CAST(number as INTEGER) ASC");
      if (!data) {
        return c.json({ status: false, message: "Daftar surah tidak tersedia.", data: [] }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan daftar surah.", data: data.map(formatSurah) });
      }
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data surah: " + error.message }, 500);
  }
});
var surah_default = surah;

// src/routes/muslim/v1/tafsir.js
var tafsir = new Hono2();
tafsir.get("/", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    if (surahId != null) {
      const data = await query("SELECT * FROM tafsir WHERE id = ?", [surahId]);
      if (!data || data.length === 0) {
        return c.json({ status: false, message: "Tafsir surah tidak ditemukan.", data: {} }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan detail tafsir surah.", data: data[0] });
      }
    } else {
      const data = await query("SELECT * FROM tafsir ORDER BY CAST(id as INTEGER) ASC");
      return c.json({ status: true, message: "Berhasil mendapatkan daftar tafsir surah.", data: data || [] });
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data tafsir: " + error.message }, 500);
  }
});
var tafsir_default = tafsir;

// src/routes/muslim/v1/theme.js
var theme = new Hono2();
theme.get("/", async (c) => {
  try {
    const themeId = c.req.query("themeId") || c.req.query("id");
    if (themeId != null) {
      const data = await get("SELECT * FROM theme WHERE id = ?", [themeId]);
      if (!data) {
        return c.json({ status: false, message: "Tema tidak ditemukan.", data: {} }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan detail tema.", data });
      }
    } else {
      const data = await query("SELECT * FROM theme ORDER BY CAST(id as INTEGER) ASC");
      return c.json({ status: true, message: "Berhasil mendapatkan daftar seluruh tema.", data: data || [] });
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data tema: " + error.message }, 500);
  }
});
var theme_default = theme;

// src/routes/muslim/v1/word.js
var word = new Hono2();
word.get("/", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    const ayahId = c.req.query("ayahId");
    let sql = "SELECT * FROM word";
    let params = [];
    if (surahId != null && ayahId != null) {
      sql += " WHERE surah = ? AND ayah = ?";
      params = [surahId, ayahId];
    } else if (surahId != null) {
      sql += " WHERE surah = ?";
      params = [surahId];
    }
    sql += " ORDER BY CAST(surah as INTEGER), CAST(ayah as INTEGER), CAST(word as INTEGER) ASC";
    const data = await query(sql, params);
    return c.json({ status: true, message: "Berhasil mendapatkan daftar kata.", data: data || [] });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data kata: " + error.message }, 500);
  }
});
var word_default = word;

// src/routes/muslim/v1/admin.js
var admin = new Hono2();
var API_KEY = process.env.ADMIN_API_KEY || "muslim-api-admin-secret";
admin.use("*", async (c, next) => {
  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    return c.json({
      status: false,
      message: "Pembaruan admin dinonaktifkan di Vercel Production. Harap gunakan strategi Pembaruan Lokal + Git Push."
    }, 403);
  }
  const apiKey = c.req.header("x-api-key");
  if (apiKey !== API_KEY) {
    return c.json({ status: false, message: "Tidak diizinkan: API Key tidak valid atau tidak ada." }, 401);
  }
  await next();
});
admin.patch("/ayah", async (c) => {
  try {
    const { surahId, ayahId, arab, text, latin } = await c.req.json();
    if (!surahId || !ayahId) {
      return c.json({ status: false, message: "surahId dan ayahId diperlukan." }, 400);
    }
    const oldData = await get(
      "SELECT arab, text, latin FROM ayah WHERE surah = ? AND ayah = ?",
      [surahId, ayahId]
    );
    if (!oldData) {
      return c.json({ status: false, message: "Ayat tidak ditemukan." }, 404);
    }
    const updates = [];
    const params = [];
    if (arab) {
      updates.push("arab = ?");
      params.push(arab);
    }
    if (text) {
      updates.push("text = ?");
      params.push(text);
    }
    if (latin) {
      updates.push("latin = ?");
      params.push(latin);
    }
    if (updates.length === 0) {
      return c.json({ status: false, message: "Tidak ada bidang yang disediakan untuk diperbarui." }, 400);
    }
    params.push(surahId, ayahId);
    await query(
      `UPDATE ayah SET ${updates.join(", ")} WHERE surah = ? AND ayah = ?`,
      params
    );
    const newData = await get(
      "SELECT arab, text, latin FROM ayah WHERE surah = ? AND ayah = ?",
      [surahId, ayahId]
    );
    return c.json({
      status: true,
      message: "Berhasil memperbarui ayat.",
      diff: {
        before: oldData,
        after: newData
      },
      integrity_status: "Hash akan diperbarui otomatis pada pengecekan integritas berikutnya."
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal memperbarui ayat: " + error.message }, 500);
  }
});
admin.patch("/dzikir", async (c) => {
  try {
    const { id, title: title3, arabic, translation } = await c.req.json();
    if (!id) return c.json({ status: false, message: "Parameter id diperlukan." }, 400);
    const oldData = await get("SELECT title, arabic, translation FROM dzikir WHERE id = ?", [id]);
    if (!oldData) return c.json({ status: false, message: "Dzikir tidak ditemukan.", data: {} }, 404);
    const updates = [];
    const params = [];
    if (title3) {
      updates.push("title = ?");
      params.push(title3);
    }
    if (arabic) {
      updates.push("arabic = ?");
      params.push(arabic);
    }
    if (translation) {
      updates.push("translation = ?");
      params.push(translation);
    }
    if (updates.length === 0) return c.json({ status: false, message: "Tidak ada data yang diubah." }, 400);
    params.push(id);
    await query(
      `UPDATE dzikir SET ${updates.join(", ")} WHERE id = ?`,
      params
    );
    const newData = await get("SELECT title, arabic, translation FROM dzikir WHERE id = ?", [id]);
    return c.json({
      status: true,
      message: "Berhasil memperbarui dzikir.",
      diff: {
        before: oldData,
        after: newData
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal memperbarui dzikir: " + error.message }, 500);
  }
});
admin.patch("/doa", async (c) => {
  try {
    const { id, judul, arab, indo } = await c.req.json();
    if (!id) return c.json({ status: false, message: "id diperlukan." }, 400);
    const oldData = await get("SELECT judul, arab, indo FROM doa WHERE id = ?", [id]);
    if (!oldData) return c.json({ status: false, message: "Doa tidak ditemukan." }, 404);
    const updates = [];
    const params = [];
    if (judul) {
      updates.push("judul = ?");
      params.push(judul);
    }
    if (arab) {
      updates.push("arab = ?");
      params.push(arab);
    }
    if (indo) {
      updates.push("indo = ?");
      params.push(indo);
    }
    if (updates.length === 0) return c.json({ status: false, message: "Tidak ada bidang untuk diperbarui." }, 400);
    params.push(id);
    await query(`UPDATE doa SET ${updates.join(", ")} WHERE id = ?`, params);
    const newData = await get("SELECT judul, arab, indo FROM doa WHERE id = ?", [id]);
    return c.json({
      status: true,
      message: "Berhasil memperbarui doa.",
      diff: {
        before: oldData,
        after: newData
      }
    });
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});
var admin_default = admin;

// src/routes/muslim/v1/kemenag.js
var kemenag = new Hono2();
kemenag.get("/libur", async (c) => {
  const year = c.req.query("year") || (/* @__PURE__ */ new Date()).getFullYear().toString();
  try {
    const response = await fetch(`${API_CONFIG.KEMENAG.HARI_LIBUR}?year=${year}`);
    if (!response.ok) {
      return c.json({ status: false, message: `Data libur tahun ${year} tidak ditemukan` }, 404);
    }
    const data = await response.json();
    const mappedData = data.map((item) => ({
      tanggal: item.holiday_date,
      keterangan: item.holiday_name,
      is_cuti: !item.is_national_holiday
    }));
    return c.json({
      status: true,
      message: `Berhasil mendapatkan daftar hari libur tahun ${year}.`,
      data: {
        year,
        holidays: mappedData
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data libur: " + error.message }, 500);
  }
});
kemenag.get("/provinsi", async (c) => {
  try {
    const response = await fetch(`${API_CONFIG.KEMENAG.PESANTREN}/provinsi.json`);
    if (!response.ok) return c.json({ status: false, message: "Gagal mengambil data provinsi." }, response.status);
    const data = await response.json();
    return c.json({ status: true, message: "Berhasil mendapatkan daftar provinsi.", data });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data provinsi: " + error.message }, 500);
  }
});
kemenag.get("/kabupaten", async (c) => {
  const provinsiId = c.req.query("provinsiId");
  if (!provinsiId) return c.json({ status: false, message: "Parameter provinsiId diperlukan." }, 400);
  try {
    const response = await fetch(`${API_CONFIG.KEMENAG.PESANTREN}/kabupaten/${provinsiId}.json`);
    if (!response.ok) return c.json({ status: false, message: `Gagal mengambil data kabupaten untuk provinsi ID ${provinsiId}.` }, response.status);
    const data = await response.json();
    return c.json({ status: true, message: `Berhasil mendapatkan daftar kabupaten untuk provinsi ${provinsiId}.`, data });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data kabupaten: " + error.message }, 500);
  }
});
kemenag.get("/pesantren", async (c) => {
  const kabupatenId = c.req.query("kabupatenId");
  if (!kabupatenId) return c.json({ status: false, message: "Parameter kabupatenId diperlukan." }, 400);
  try {
    const response = await fetch(`${API_CONFIG.KEMENAG.PESANTREN}/pesantren/${kabupatenId}.json`);
    if (!response.ok) return c.json({ status: false, message: `Data pesantren untuk kabupaten ID ${kabupatenId} tidak ditemukan.` }, response.status);
    const data = await response.json();
    return c.json({ status: true, message: `Berhasil mendapatkan daftar pesantren untuk kabupaten ${kabupatenId}.`, data });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data pesantren: " + error.message }, 500);
  }
});
kemenag.get("/masjid", async (c) => {
  try {
    const search = c.req.query("search");
    const lokasi = c.req.query("lokasi");
    const jenis = c.req.query("jenis");
    const tipologi = c.req.query("tipologi");
    let sql = "SELECT * FROM masjid";
    let params = [];
    let conditions = [];
    if (search) {
      conditions.push("(nama LIKE ? OR deskripsi LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (lokasi) {
      conditions.push("lokasi LIKE ?");
      params.push(`%${lokasi}%`);
    }
    if (jenis) {
      conditions.push("jenis = ?");
      params.push(jenis);
    }
    if (tipologi) {
      conditions.push("tipologi = ?");
      params.push(tipologi);
    }
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    const data = await query(sql, params);
    return c.json({
      status: true,
      message: search || lokasi || jenis || tipologi ? `Berhasil mencari masjid dengan kriteria tertentu.` : `Berhasil mendapatkan daftar seluruh masjid.`,
      data
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan daftar masjid: " + error.message }, 500);
  }
});
kemenag.get("/masjid/detail", async (c) => {
  const id = c.req.query("id");
  if (!id) return c.json({ status: false, message: "Parameter id diperlukan." }, 400);
  try {
    const data = await query("SELECT * FROM masjid WHERE id = ?", [id]);
    if (data.length === 0) {
      return c.json({ status: false, message: "Masjid tidak ditemukan.", data: {} }, 404);
    }
    return c.json({ status: true, message: "Berhasil mendapatkan detail masjid.", data: data[0] });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan detail masjid: " + error.message }, 500);
  }
});
kemenag.get("/masjid/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const sql = "SELECT * FROM masjid WHERE id = ?";
    const data = await query(sql, [id]);
    if (data.length === 0) {
      return c.json({ status: false, message: "Masjid tidak ditemukan.", data: {} }, 404);
    }
    return c.json({
      status: true,
      message: "Berhasil mendapatkan detail masjid.",
      data: data[0]
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan detail masjid: " + error.message }, 500);
  }
});
kemenag.get("/masjid/nearby", async (c) => {
  try {
    const lat = parseFloat(c.req.query("lat"));
    const lng = parseFloat(c.req.query("lng"));
    const radius = parseFloat(c.req.query("radius") || 5);
    if (isNaN(lat) || isNaN(lng)) {
      return c.json({ status: false, message: "Parameter lat dan lng diperlukan." }, 400);
    }
    const data = await query(`
      SELECT * FROM (
        SELECT *, 
        (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude)))) AS distance
        FROM masjid
        WHERE latitude BETWEEN ${lat - radius / 111} AND ${lat + radius / 111}
        AND longitude BETWEEN ${lng - radius / (111 * Math.cos(lat * Math.PI / 180))} AND ${lng + radius / (111 * Math.cos(lat * Math.PI / 180))}
      ) AS t
      WHERE distance <= ${radius}
      ORDER BY distance ASC
      LIMIT 20
    `);
    return c.json({
      status: true,
      message: `Berhasil menemukan masjid dalam radius ${radius}km.`,
      data
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mencari masjid terdekat: " + error.message }, 500);
  }
});
var kemenag_default = kemenag;

// src/routes/muslim/v1/sejarah.js
var sejarah = new Hono2();
sejarah.get("/", async (c) => {
  try {
    const kategori = c.req.query("kategori");
    let sql = "SELECT * FROM sejarah";
    let params = [];
    if (kategori) {
      sql += " WHERE kategori LIKE ?";
      params.push(`%${kategori}%`);
    }
    const data = await query(sql, params);
    return c.json({
      status: true,
      message: kategori ? `Berhasil mendapatkan daftar sejarah kategori ${kategori}.` : "Berhasil mendapatkan seluruh daftar sejarah.",
      data
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan daftar sejarah: " + error.message }, 500);
  }
});
sejarah.get("/detail", async (c) => {
  try {
    const id = c.req.query("id");
    if (!id) return c.json({ status: false, message: "Parameter id diperlukan." }, 400);
    const item = await get("SELECT * FROM sejarah WHERE id = ?", [id]);
    if (!item) return c.json({ status: false, message: "Data sejarah tidak ditemukan.", data: {} }, 404);
    return c.json({ status: true, message: "Berhasil mendapatkan detail sejarah.", data: item });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan detail sejarah: " + error.message }, 500);
  }
});
sejarah.get("/today", async (c) => {
  try {
    const today = /* @__PURE__ */ new Date();
    const day = today.getDate();
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember"
    ];
    const month = monthNames[today.getMonth()];
    const data = await query(`
      SELECT * FROM sejarah 
      WHERE tahun LIKE ? OR tahun LIKE ? OR deskripsi LIKE ?
      LIMIT 10
    `, [`%${day} ${month}%`, `%${month}%`, `%${day} ${month}%`]);
    return c.json({
      status: true,
      message: `Berhasil mendapatkan peristiwa sejarah untuk hari ini (${day} ${month}).`,
      data: {
        events: data,
        today: `${day} ${month}`
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan peristiwa sejarah hari ini: " + error.message }, 500);
  }
});
var sejarah_default = sejarah;

// src/routes/muslim/v1/tools.js
var tools = new Hono2();
tools.get("/quotes/daily", async (c) => {
  try {
    const ayat = await get(`
      SELECT *
      FROM ayah
      ORDER BY RANDOM() LIMIT 1
    `);
    const surahData = await get(`SELECT * FROM surah WHERE number = ?`, [ayat.surah]);
    const surahName = surahData.name_id || surahData.name_en || surahData.name_long;
    const hadits2 = await get(`
      SELECT *
      FROM hadits
      ORDER BY RANDOM() LIMIT 1
    `);
    return c.json({
      status: true,
      message: "Berhasil mengambil kutipan harian.",
      data: {
        ayat: {
          arab: ayat.arab,
          text: ayat.text,
          sumber: `QS. ${surahName}: ${ayat.ayah}`
        },
        hadits: {
          arab: hadits2.arab,
          text: hadits2.indo,
          sumber: `HR. ${hadits2.judul || "Hadits"}`
        }
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mengambil kutipan harian: " + error.message }, 500);
  }
});
tools.get("/zakat", (c) => {
  const type = c.req.query("type");
  const amount = parseFloat(c.req.query("amount") || 0);
  const hargaEmas = parseFloat(c.req.query("hargaEmas") || 12e5);
  if (!type) {
    return c.json({
      status: false,
      message: "Parameter type (maal/penghasilan/fitrah) diperlukan."
    }, 400);
  }
  if (isNaN(amount) || amount <= 0) {
    return c.json({
      status: false,
      message: "Parameter amount harus berupa angka valid dan lebih besar dari 0."
    }, 400);
  }
  let result = {
    status: true,
    message: "Kalkulasi zakat berhasil.",
    data: {
      type,
      amount,
      nishab: 0,
      isWajib: false,
      zakat: 0
    }
  };
  if (type === "maal") {
    const nishabEmas = 85 * hargaEmas;
    result.data.nishab = nishabEmas;
    result.data.isWajib = amount >= nishabEmas;
    result.data.zakat = result.data.isWajib ? amount * 0.025 : 0;
    result.data.keterangan = "Nishab Zakat Maal adalah setara 85 gram emas per tahun. Tarif zakat 2,5%.";
  } else if (type === "penghasilan") {
    const nishabEmasBulan = 85 * hargaEmas / 12;
    result.data.nishab = nishabEmasBulan;
    result.data.isWajib = amount >= nishabEmasBulan;
    result.data.zakat = result.data.isWajib ? amount * 0.025 : 0;
    result.data.keterangan = "Nishab Zakat Penghasilan setara 85 gram emas per tahun (dibagi 12 bulan). Tarif 2,5%.";
  } else if (type === "fitrah") {
    const hargaBeras = parseFloat(c.req.query("hargaBeras") || 15e3);
    const jumlahOrang = parseInt(c.req.query("jumlahOrang") || 1);
    const zakatPerOrang = 2.5 * hargaBeras;
    result.data.nishab = 0;
    result.data.isWajib = true;
    result.data.zakat = zakatPerOrang * jumlahOrang;
    result.data.keterangan = `Zakat Fitrah adalah 2.5kg beras per jiwa. Estimasi Rp${zakatPerOrang.toLocaleString("id-ID")} per jiwa.`;
  } else {
    return c.json({ status: false, message: "Tipe zakat tidak valid. Gunakan: maal, penghasilan, atau fitrah." }, 400);
  }
  return c.json(result);
});
tools.get("/qibla", async (c) => {
  const lat = parseFloat(c.req.query("lat"));
  const lng = parseFloat(c.req.query("lng"));
  if (isNaN(lat) || isNaN(lng)) {
    return c.json({ status: false, message: "Parameter lat dan lng diperlukan dan harus berupa angka." }, 400);
  }
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  const dL = (kaabaLng - lng) * Math.PI / 180;
  const phi1 = lat * Math.PI / 180;
  const phi2 = kaabaLat * Math.PI / 180;
  const q = Math.atan2(Math.sin(dL), Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dL));
  const direction = (q * 180 / Math.PI + 360) % 360;
  return c.json({
    status: true,
    message: "Berhasil menghitung arah kiblat.",
    data: {
      coordinates: { lat, lng },
      kaaba: { lat: kaabaLat, lng: kaabaLng },
      qibla_direction: direction,
      unit: "degrees"
    }
  });
});
tools.get("/semantic-search", async (c) => {
  const query2 = c.req.query("query");
  if (!query2) return c.json({ status: false, message: "Parameter query diperlukan." }, 400);
  try {
    const quranResults = await query(`
      SELECT *
      FROM ayah
      WHERE text LIKE ? OR theme LIKE ?
    `, [`%${query2}%`, `%${query2}%`]);
    const formattedQuran = await Promise.all(quranResults.map(async (r) => {
      const s = await get(`SELECT * FROM surah WHERE number = ?`, [r.surah]);
      return {
        arab: r.arab,
        text: r.text,
        sumber: `QS. ${s.name_id || s.name_en || s.name_long}: ${r.ayah}`
      };
    }));
    const haditsResults = await query(`
      SELECT *
      FROM hadits
      WHERE indo LIKE ? OR judul LIKE ?
    `, [`%${query2}%`, `%${query2}%`]);
    return c.json({
      status: true,
      message: `Pencarian semantik untuk '${query2}' berhasil.`,
      data: {
        query: query2,
        quran: formattedQuran,
        hadits: haditsResults.map((r) => ({
          arab: r.arab,
          text: r.indo,
          sumber: `HR. ${r.judul || "Hadits"}`
        }))
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Pencarian semantik gagal: " + error.message }, 500);
  }
});
var tools_default = tools;

// src/routes/muslim/v1/index.js
var v1 = new Hono2();
v1.route("/asbab", asbab_default);
v1.route("/asma", asma_default);
v1.route("/ayah", ayah_default);
v1.route("/calendar", calendar_default);
v1.route("/doa", doa_default);
v1.route("/dzikir", dzikir_default);
v1.route("/hadits", hadits_default);
v1.route("/juz", juz_default);
v1.route("/murotal", murotal_default);
v1.route("/integrity", integrity_default);
v1.route("/sholat", sholat_default);
v1.route("/surah", surah_default);
v1.route("/tafsir", tafsir_default);
v1.route("/theme", theme_default);
v1.route("/word", word_default);
v1.route("/admin", admin_default);
v1.route("/kemenag", kemenag_default);
v1.route("/sejarah", sejarah_default);
v1.route("/tools", tools_default);
v1.get("/", (c) => {
  return c.json({
    status: true,
    message: "Selamat datang di Muslim API v1. Berikut adalah daftar endpoint yang tersedia.",
    data: {
      quran: {
        surah: {
          daftarSurah: {
            pattern: "/v1/surah"
          },
          infoSurah: {
            pattern: "/v1/surah?surahId={surahId}",
            contoh: "/v1/surah?surahId=114"
          }
        },
        ayah: {
          range: {
            pattern: "/v1/ayah/range?surahId={surahId}&start={start}&end={end}",
            contoh: "/v1/ayah/range?surahId=1&start=1&end=7"
          },
          spesifikSurah: {
            pattern: "/v1/ayah/surah?surahId={surahId}",
            contoh: "/v1/ayah/surah?surahId=1"
          },
          spesifikJuz: {
            pattern: "/v1/ayah/juz?juzId={juzId}",
            contoh: "/v1/ayah/juz?juzId=30"
          },
          spesifikHalaman: {
            pattern: "/v1/ayah/page?page={page}",
            contoh: "/v1/ayah/page?page=604"
          },
          spesifikAyat: {
            pattern: "/v1/ayah/specific?surahId={surahId}&ayahId={ayahId}",
            contoh: "/v1/ayah/specific?surahId=1&ayahId=1"
          },
          cari: {
            pattern: "/v1/ayah/find?query={query}",
            contoh: "/v1/ayah/find?query=alhamdulillah"
          }
        },
        juz: {
          semua: {
            pattern: "/v1/juz"
          },
          spesifik: {
            pattern: "/v1/juz?juzId={juzId}",
            contoh: "/v1/juz?juzId=30"
          }
        },
        asbabNujul: {
          semua: {
            pattern: "/v1/asbab"
          },
          spesifik: {
            pattern: "/v1/asbab?id={asbabId}",
            contoh: "/v1/asbab?id=1"
          }
        },
        asmaulHusna: {
          semua: {
            pattern: "/v1/asma"
          },
          spesifik: {
            pattern: "/v1/asma?id={asmaId}",
            contoh: "/v1/asma?id=1"
          }
        },
        murotal: {
          qari: {
            pattern: "/v1/murotal/qari"
          },
          semua: {
            pattern: "/v1/murotal"
          },
          spesifikQari: {
            pattern: "/v1/murotal?qariId={qariId}",
            contoh: "/v1/murotal?qariId=05"
          },
          spesifikSurah: {
            pattern: "/v1/murotal?surahId={surahId}&qariId={qariId}",
            contoh: "/v1/murotal?surahId=1&qariId=05"
          }
        },
        jadwalSholat: {
          semuaKota: {
            pattern: "/v1/sholat/kota/semua"
          },
          cariKota: {
            pattern: "/v1/sholat/kota/cari?nama={namaKota}",
            contoh: "/v1/sholat/kota/cari?nama=jakarta"
          },
          jadwalByKota: {
            pattern: "/v1/sholat/jadwal?kotaId={kotaId}&tanggal={YYYY-MM-DD}",
            contoh: "/v1/sholat/jadwal?kotaId=58a2fc6ed39fd083f55d4182bf88826d&tanggal=2025-12-24"
          },
          jadwalByKoordinat: {
            pattern: "/v1/sholat/jadwal/koordinat?lat={latitude}&lon={longitude}",
            contoh: "/v1/sholat/jadwal/koordinat?lat=-6.1751&lon=106.8272"
          },
          sholatTerdekat: {
            pattern: "/v1/sholat/next?lat={lat}&lon={lon}",
            contoh: "/v1/sholat/next?lat=-6.1751&lon=106.8272"
          }
        },
        calendar: {
          masehiToHijri: {
            pattern: "/v1/calendar/hijri?date={YYYY-MM-DD}",
            contoh: "/v1/calendar/hijri?date=2024-03-11"
          },
          hijriToMasehi: {
            pattern: "/v1/calendar/masehi?day={day}&month={month}&year={year}",
            contoh: "/v1/calendar/masehi?day=1&month=9&year=1445"
          }
        },
        tafsir: {
          semua: {
            pattern: "/v1/tafsir"
          },
          spesifikSurah: {
            pattern: "/v1/tafsir?surahId={surahId}",
            contoh: "/v1/tafsir?surahId=1"
          }
        },
        theme: {
          semua: {
            pattern: "/v1/theme"
          },
          spesifik: {
            pattern: "/v1/theme?themeId={themeId}",
            contoh: "/v1/theme?themeId=1"
          }
        },
        kataPerKata: {
          semua: {
            pattern: "/v1/word"
          },
          spesifikSurah: {
            pattern: "/v1/word?surahId={surahId}",
            contoh: "/v1/word?surahId=1"
          },
          spesifikAyat: {
            pattern: "/v1/word?surahId={surahId}&ayahId={ayahId}",
            contoh: "/v1/word?surahId=1&ayahId=1"
          }
        }
      },
      doa: {
        semua: {
          pattern: "/v1/doa"
        },
        spesifikSumber: {
          pattern: "/v1/doa?source={source}",
          contoh: "/v1/doa?source=quran"
        },
        cari: {
          pattern: "/v1/doa/find?query={query}",
          contoh: "/v1/doa/find?query=makan"
        }
      },
      dzikir: {
        semua: {
          pattern: "/v1/dzikir"
        },
        spesifikTipe: {
          pattern: "/v1/dzikir?type={type}",
          contoh: "/v1/dzikir?type=pagi"
        }
      },
      hadits: {
        semua: {
          pattern: "/v1/hadits"
        },
        spesifikNomor: {
          pattern: "/v1/hadits?nomor={nomor}",
          contoh: "/v1/hadits?nomor=1"
        },
        cari: {
          pattern: "/v1/hadits/find?query={query}",
          contoh: "/v1/hadits/find?query=niat"
        }
      },
      sejarah: {
        semua: {
          pattern: "/v1/sejarah"
        },
        spesifik: {
          pattern: "/v1/sejarah?id={sejarahId}",
          contoh: "/v1/sejarah?id=1"
        }
      },
      kemenag: {
        hariLibur: {
          pattern: "/v1/kemenag/libur?year={year}",
          contoh: "/v1/kemenag/libur?year=2025"
        },
        pesantren: {
          provinsi: {
            pattern: "/v1/kemenag/provinsi"
          },
          kabupaten: {
            pattern: "/v1/kemenag/kabupaten?provinsiId={provinsiId}",
            contoh: "/v1/kemenag/kabupaten?provinsiId=13"
          },
          daftar: {
            pattern: "/v1/kemenag/pesantren?kabupatenId={kabupatenId}",
            contoh: "/v1/kemenag/pesantren?kabupatenId=1301"
          }
        },
        masjid: {
          daftar: {
            pattern: "/v1/kemenag/masjid?search={query}&lokasi={lokasi}",
            contoh: "/v1/kemenag/masjid?search=istiqlal"
          },
          detail: {
            pattern: "/v1/kemenag/masjid/detail?id={id}",
            contoh: "/v1/kemenag/masjid/detail?id=1"
          },
          terdekat: {
            pattern: "/v1/kemenag/masjid/nearby?lat={lat}&lng={lng}&radius={radius}",
            contoh: "/v1/kemenag/masjid/nearby?lat=-6.1702&lng=106.8315"
          }
        }
      },
      tools: {
        quotesHarian: {
          pattern: "/v1/tools/quotes/daily"
        },
        zakat: {
          pattern: "/v1/tools/zakat?type={type}&amount={amount}",
          contoh: "/v1/tools/zakat?type=maal&amount=100000000"
        },
        qibla: {
          pattern: "/v1/tools/qibla?lat={lat}&lng={lng}",
          contoh: "/v1/tools/qibla?lat=-6.1751&lng=106.8272"
        },
        semanticSearch: {
          pattern: "/v1/tools/semantic-search?query={query}",
          contoh: "/v1/tools/semantic-search?query=sabar"
        }
      },
      integrity: {
        chain: {
          pattern: "/v1/integrity/chain"
        },
        verify: {
          pattern: "/v1/integrity/verify"
        },
        verifyAyah: {
          pattern: "/v1/integrity/verify/ayah?surahId={surahId}&ayahId={ayahId}",
          contoh: "/v1/integrity/verify/ayah?surahId=1&ayahId=1"
        }
      }
    }
  });
});
var v1_default = v1;

// src/app.jsx
var app = new Hono2();
app.use("*", trimTrailingSlash());
app.use("*", logger());
app.use("*", cors());
app.get("/health", async (c) => {
  let dbStatus = "disconnected";
  try {
    const result = await query("SELECT 1");
    if (result) dbStatus = "connected";
  } catch (e) {
    dbStatus = "error: " + e.message;
  }
  return c.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    version: "1.0.0",
    services: {
      database: dbStatus,
      uptime: process.uptime()
    },
    env: process.env.NODE_ENV || "development"
  });
});
app.get("/v1/*", async (c, next) => {
  await next();
  if (c.res.ok && c.req.method === "GET") {
    c.res.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  }
});
var rateLimitMap = /* @__PURE__ */ new Map();
app.use("/v1/*", async (c, next) => {
  const ip = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "local";
  const userAgent = c.req.header("user-agent") || "unknown";
  const method = c.req.method;
  const path2 = c.req.path;
  if (process.env.NODE_ENV === "production") {
    console.log(`[HIT] ${(/* @__PURE__ */ new Date()).toISOString()} | IP: ${ip} | Path: ${path2} | UA: ${userAgent}`);
    return await next();
  }
  const now = Date.now();
  const windowMs = 60 * 1e3;
  const maxRequests = 100;
  const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
  } else {
    clientData.count++;
  }
  rateLimitMap.set(ip, clientData);
  if (clientData.count > maxRequests) {
    console.warn(`[BLOCKED] ${(/* @__PURE__ */ new Date()).toISOString()} | IP: ${ip} | Reason: Rate Limit Exceeded`);
    return c.json({
      status: 429,
      message: "Anda diblokir sementara karena melakukan terlalu banyak permintaan (spamming). Silakan coba lagi dalam 1 menit.",
      reason: "Rate limit exceeded",
      client_info: { ip, user_agent: userAgent }
    }, 429);
  }
  console.log(`[HIT] ${(/* @__PURE__ */ new Date()).toISOString()} | IP: ${ip} | Method: ${method} | Path: ${path2}`);
  await next();
});
app.route("/v1", v1_default);
app.route("/", routes_default);
app.notFound((c) => {
  return c.json({ status: 404, message: "Not Found" }, 404);
});
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ status: 500, message: err.message }, 500);
});
var app_default = app;

// vercel-entry.js
var vercel_entry_default = handle(app_default);
export {
  vercel_entry_default as default
};
