var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/promise-limit/index.js
var require_promise_limit = __commonJS({
  "node_modules/promise-limit/index.js"(exports, module) {
    function limiter(count) {
      var outstanding = 0;
      var jobs = [];
      function remove() {
        outstanding--;
        if (outstanding < count) {
          dequeue();
        }
      }
      function dequeue() {
        var job = jobs.shift();
        semaphore.queue = jobs.length;
        if (job) {
          run(job.fn).then(job.resolve).catch(job.reject);
        }
      }
      function queue(fn) {
        return new Promise(function(resolve, reject) {
          jobs.push({ fn, resolve, reject });
          semaphore.queue = jobs.length;
        });
      }
      function run(fn) {
        outstanding++;
        try {
          return Promise.resolve(fn()).then(function(result) {
            remove();
            return result;
          }, function(error) {
            remove();
            throw error;
          });
        } catch (err) {
          remove();
          return Promise.reject(err);
        }
      }
      var semaphore = function(fn) {
        if (outstanding >= count) {
          return queue(fn);
        } else {
          return run(fn);
        }
      };
      return semaphore;
    }
    function map(items, mapper) {
      var failed = false;
      var limit = this;
      return Promise.all(items.map(function() {
        var args = arguments;
        return limit(function() {
          if (!failed) {
            return mapper.apply(void 0, args).catch(function(e) {
              failed = true;
              throw e;
            });
          }
        });
      }));
    }
    function addExtras(fn) {
      fn.queue = 0;
      fn.map = map;
      return fn;
    }
    module.exports = function(count) {
      if (count) {
        return addExtras(limiter(count));
      } else {
        return addExtras(function(fn) {
          return fn();
        });
      }
    };
  }
});

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports, module) {
    module.exports = {
      name: "dotenv",
      version: "17.2.3",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run tests/**/*.js --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run tests/**/*.js --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module) {
    var fs3 = __require("fs");
    var path3 = __require("path");
    var os = __require("os");
    var crypto3 = __require("crypto");
    var packageJson = require_package();
    var version2 = packageJson.version;
    var TIPS = [
      "\u{1F510} encrypt with Dotenvx: https://dotenvx.com",
      "\u{1F510} prevent committing .env to code: https://dotenvx.com/precommit",
      "\u{1F510} prevent building .env in docker: https://dotenvx.com/prebuild",
      "\u{1F4E1} add observability to secrets: https://dotenvx.com/ops",
      "\u{1F465} sync secrets across teammates & machines: https://dotenvx.com/ops",
      "\u{1F5C2}\uFE0F backup and recover secrets: https://dotenvx.com/ops",
      "\u2705 audit secrets and track compliance: https://dotenvx.com/ops",
      "\u{1F504} add secrets lifecycle management: https://dotenvx.com/ops",
      "\u{1F511} add access controls to secrets: https://dotenvx.com/ops",
      "\u{1F6E0}\uFE0F  run anywhere with `dotenvx run -- yourcommand`",
      "\u2699\uFE0F  specify custom .env file path with { path: '/custom/path/.env' }",
      "\u2699\uFE0F  enable debug logging with { debug: true }",
      "\u2699\uFE0F  override existing env vars with { override: true }",
      "\u2699\uFE0F  suppress all logs with { quiet: true }",
      "\u2699\uFE0F  write to custom object with { processEnv: myObject }",
      "\u2699\uFE0F  load multiple .env files with { path: ['.env.local', '.env'] }"
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === "string") {
        return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text) {
      return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
    }
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match2;
      while ((match2 = LINE.exec(lines)) != null) {
        const key = match2[1];
        let value = match2[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.error(`[dotenv@${version2}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version2}][DEBUG] ${message}`);
    }
    function _log(message) {
      console.log(`[dotenv@${version2}] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs3.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path3.resolve(process.cwd(), ".env.vault");
      }
      if (fs3.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path3.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
      const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (debug || !quiet) {
        _log("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path3.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
      let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path4 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs3.readFileSync(path4, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path4} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path3.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`Failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injecting env (${keysCount}) from ${shortPaths.join(",")} ${dim(`-- tip: ${_getRandomTip()}`)}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto3.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      const populated = {};
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
      }
      return populated;
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/dotenv/lib/env-options.js"(exports, module) {
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_QUIET != null) {
      options.quiet = process.env.DOTENV_CONFIG_QUIET;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module.exports = options;
  }
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/dotenv/lib/cli-options.js"(exports, module) {
    var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
    module.exports = function optionMatcher(args) {
      const options = args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
      if (!("quiet" in options)) {
        options.quiet = "true";
      }
      return options;
    };
  }
});

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
var newRequestFromIncoming = (method, url2, headers, incoming, abortController) => {
  const init = {
    method,
    headers,
    signal: abortController.signal
  };
  if (method === "TRACE") {
    init.method = "GET";
    const req = new Request2(url2, init);
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
  return new Request2(url2, init);
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
      const url22 = new URL(incomingUrl);
      req[urlKey] = url22.href;
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
  const url2 = new URL(`${scheme}://${host}${incomingUrl}`);
  if (url2.hostname.length !== host.length && url2.hostname !== host.replace(/:\d+$/, "")) {
    throw new RequestError("Invalid host header");
  }
  req[urlKey] = url2.href;
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
var splitPath = (path3) => {
  const paths = path3.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path: path3 } = extractGroupsFromPath(routePath);
  const paths = splitPath(path3);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path3) => {
  const groups = [];
  path3 = path3.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path: path3 };
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
  const url2 = request.url;
  const start = url2.indexOf("/", url2.indexOf(":") + 4);
  let i = start;
  for (; i < url2.length; i++) {
    const charCode = url2.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url2.indexOf("?", i);
      const path3 = url2.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path3.includes("%25") ? path3.replace(/%25/g, "%2525") : path3);
    } else if (charCode === 63) {
      break;
    }
  }
  return url2.slice(start, i);
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
var checkOptionalParameter = (path3) => {
  if (path3.charCodeAt(path3.length - 1) !== 63 || !path3.includes(":")) {
    return null;
  }
  const segments = path3.split("/");
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
var _getQueryParam = (url2, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url2.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url2.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url2.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url2.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url2.indexOf("&", valueIndex);
        return _decodeURI(url2.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url2.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url2);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url2);
  let keyIndex = url2.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url2.indexOf("&", keyIndex + 1);
    let valueIndex = url2.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url2.slice(
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
      value = url2.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
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
var getQueryParams = (url2, key) => {
  return _getQueryParam(url2, key, true);
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
  constructor(request, path3 = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path3;
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
  json = (object2, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object2),
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
    this.on = (method, path3, ...handlers) => {
      for (const p of [path3].flat()) {
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
  route(path3, app2) {
    const subApp = this.basePath(path3);
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
  basePath(path3) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path3);
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
  mount(path3, applicationHandler, options) {
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
      const mergedPath = mergePath(this._basePath, path3);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url2 = new URL(request.url);
        url2.pathname = url2.pathname.slice(pathPrefixLength) || "/";
        return new Request(url2, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path3, "*"), handler);
    return this;
  }
  #addRoute(method, path3, handler) {
    method = method.toUpperCase();
    path3 = mergePath(this._basePath, path3);
    const r = { basePath: this._basePath, path: path3, method, handler };
    this.router.add(method, path3, [handler, r]);
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
    const path3 = this.getPath(request, { env });
    const matchResult = this.router.match(method, path3);
    const c = new Context(request, {
      path: path3,
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
function match(method, path3) {
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
  return match2(method, path3);
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
  insert(path3, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path3 = path3.replace(/\{[^}]+\}/g, (m) => {
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
    const tokens = path3.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
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
function buildWildcardRegExp(path3) {
  return wildcardRegExpCache[path3] ??= new RegExp(
    path3 === "*" ? "" : `^${path3.replace(
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
    const [pathErrorCheckOnly, path3, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path3] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path3, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path3) : e;
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
function findMiddleware(middleware, path3) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path3)) {
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
  add(method, path3, handler) {
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
    if (path3 === "/*") {
      path3 = "*";
    }
    const paramCount = (path3.match(/\/:/g) || []).length;
    if (/\*$/.test(path3)) {
      const re = buildWildcardRegExp(path3);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path3] ||= findMiddleware(middleware[m], path3) || findMiddleware(middleware[METHOD_NAME_ALL], path3) || [];
        });
      } else {
        middleware[method][path3] ||= findMiddleware(middleware[method], path3) || findMiddleware(middleware[METHOD_NAME_ALL], path3) || [];
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
    const paths = checkOptionalParameter(path3) || [path3];
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
      const ownRoute = r[method] ? Object.keys(r[method]).map((path3) => [path3, r[method][path3]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path3) => [path3, r[METHOD_NAME_ALL][path3]])
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
  add(method, path3, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path3, handler]);
  }
  match(method, path3) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router3 = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router3.add(...routes[i2]);
        }
        res = router3.match(method, path3);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router3.match.bind(router3);
      this.#routers = [router3];
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
  insert(method, path3, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path3);
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
  search(method, path3) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path3);
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
  add(method, path3, handler) {
    const results = checkOptionalParameter(path3);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path3, handler);
  }
  match(method, path3) {
    return this.#node.search(method, path3);
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
      const url2 = new URL(c.req.url);
      url2.pathname = url2.pathname.substring(0, url2.pathname.length - 1);
      c.res = c.redirect(url2.toString(), 301);
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
async function log(fn, prefix, method, path3, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path3}` : `${prefix} ${method} ${path3} ${await colorStatus(status)} ${elapsed}`;
  fn(out);
}
var logger = (fn = console.log) => {
  return async function logger2(c, next) {
    const { method, url: url2 } = c.req;
    const path3 = url2.slice(url2.indexOf("/", 8));
    await log(fn, "<--", method, path3);
    const start = Date.now();
    await next();
    await log(fn, "-->", method, path3, c.res.status, time(start));
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

// src/utils/jsonHandler.js
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// node_modules/@libsql/core/lib-esm/api.js
var LibsqlError = class extends Error {
  /** Machine-readable error code. */
  code;
  /** Raw numeric error code */
  rawCode;
  constructor(message, code, rawCode, cause) {
    if (code !== void 0) {
      message = `${code}: ${message}`;
    }
    super(message, { cause });
    this.code = code;
    this.rawCode = rawCode;
    this.name = "LibsqlError";
  }
};

// node_modules/@libsql/core/lib-esm/uri.js
function parseUri(text) {
  const match2 = URI_RE.exec(text);
  if (match2 === null) {
    throw new LibsqlError(`The URL '${text}' is not in a valid format`, "URL_INVALID");
  }
  const groups = match2.groups;
  const scheme = groups["scheme"];
  const authority = groups["authority"] !== void 0 ? parseAuthority(groups["authority"]) : void 0;
  const path3 = percentDecode(groups["path"]);
  const query = groups["query"] !== void 0 ? parseQuery(groups["query"]) : void 0;
  const fragment = groups["fragment"] !== void 0 ? percentDecode(groups["fragment"]) : void 0;
  return { scheme, authority, path: path3, query, fragment };
}
var URI_RE = (() => {
  const SCHEME = "(?<scheme>[A-Za-z][A-Za-z.+-]*)";
  const AUTHORITY = "(?<authority>[^/?#]*)";
  const PATH = "(?<path>[^?#]*)";
  const QUERY = "(?<query>[^#]*)";
  const FRAGMENT = "(?<fragment>.*)";
  return new RegExp(`^${SCHEME}:(//${AUTHORITY})?${PATH}(\\?${QUERY})?(#${FRAGMENT})?$`, "su");
})();
function parseAuthority(text) {
  const match2 = AUTHORITY_RE.exec(text);
  if (match2 === null) {
    throw new LibsqlError("The authority part of the URL is not in a valid format", "URL_INVALID");
  }
  const groups = match2.groups;
  const host = percentDecode(groups["host_br"] ?? groups["host"]);
  const port = groups["port"] ? parseInt(groups["port"], 10) : void 0;
  const userinfo = groups["username"] !== void 0 ? {
    username: percentDecode(groups["username"]),
    password: groups["password"] !== void 0 ? percentDecode(groups["password"]) : void 0
  } : void 0;
  return { host, port, userinfo };
}
var AUTHORITY_RE = (() => {
  return new RegExp(`^((?<username>[^:]*)(:(?<password>.*))?@)?((?<host>[^:\\[\\]]*)|(\\[(?<host_br>[^\\[\\]]*)\\]))(:(?<port>[0-9]*))?$`, "su");
})();
function parseQuery(text) {
  const sequences = text.split("&");
  const pairs = [];
  for (const sequence of sequences) {
    if (sequence === "") {
      continue;
    }
    let key;
    let value;
    const splitIdx = sequence.indexOf("=");
    if (splitIdx < 0) {
      key = sequence;
      value = "";
    } else {
      key = sequence.substring(0, splitIdx);
      value = sequence.substring(splitIdx + 1);
    }
    pairs.push({
      key: percentDecode(key.replaceAll("+", " ")),
      value: percentDecode(value.replaceAll("+", " "))
    });
  }
  return { pairs };
}
function percentDecode(text) {
  try {
    return decodeURIComponent(text);
  } catch (e) {
    if (e instanceof URIError) {
      throw new LibsqlError(`URL component has invalid percent encoding: ${e}`, "URL_INVALID", void 0, e);
    }
    throw e;
  }
}
function encodeBaseUrl(scheme, authority, path3) {
  if (authority === void 0) {
    throw new LibsqlError(`URL with scheme ${JSON.stringify(scheme + ":")} requires authority (the "//" part)`, "URL_INVALID");
  }
  const schemeText = `${scheme}:`;
  const hostText = encodeHost(authority.host);
  const portText = encodePort(authority.port);
  const userinfoText = encodeUserinfo(authority.userinfo);
  const authorityText = `//${userinfoText}${hostText}${portText}`;
  let pathText = path3.split("/").map(encodeURIComponent).join("/");
  if (pathText !== "" && !pathText.startsWith("/")) {
    pathText = "/" + pathText;
  }
  return new URL(`${schemeText}${authorityText}${pathText}`);
}
function encodeHost(host) {
  return host.includes(":") ? `[${encodeURI(host)}]` : encodeURI(host);
}
function encodePort(port) {
  return port !== void 0 ? `:${port}` : "";
}
function encodeUserinfo(userinfo) {
  if (userinfo === void 0) {
    return "";
  }
  const usernameText = encodeURIComponent(userinfo.username);
  const passwordText = userinfo.password !== void 0 ? `:${encodeURIComponent(userinfo.password)}` : "";
  return `${usernameText}${passwordText}@`;
}

// node_modules/js-base64/base64.mjs
var version = "3.7.8";
var VERSION = version;
var _hasBuffer = typeof Buffer === "function";
var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var b64chs = Array.prototype.slice.call(b64ch);
var b64tab = ((a) => {
  let tab = {};
  a.forEach((c, i) => tab[c] = i);
  return tab;
})(b64chs);
var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
var _fromCC = String.fromCharCode.bind(String);
var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
var _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
var _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
var btoaPolyfill = (bin) => {
  let u32, c0, c1, c2, asc = "";
  const pad = bin.length % 3;
  for (let i = 0; i < bin.length; ) {
    if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
      throw new TypeError("invalid character found");
    u32 = c0 << 16 | c1 << 8 | c2;
    asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
  }
  return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
var _btoa = typeof btoa === "function" ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
var _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
  const maxargs = 4096;
  let strs = [];
  for (let i = 0, l = u8a.length; i < l; i += maxargs) {
    strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
  }
  return _btoa(strs.join(""));
};
var fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
var cb_utob = (c) => {
  if (c.length < 2) {
    var cc = c.charCodeAt(0);
    return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  } else {
    var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
    return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  }
};
var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
var utob = (u) => u.replace(re_utob, cb_utob);
var _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
var encode = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
var encodeURI2 = (src) => encode(src, true);
var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
var cb_btou = (cccc) => {
  switch (cccc.length) {
    case 4:
      var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
      return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
    case 3:
      return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
    default:
      return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
  }
};
var btou = (b) => b.replace(re_btou, cb_btou);
var atobPolyfill = (asc) => {
  asc = asc.replace(/\s+/g, "");
  if (!b64re.test(asc))
    throw new TypeError("malformed base64.");
  asc += "==".slice(2 - (asc.length & 3));
  let u24, r1, r2;
  let binArray = [];
  for (let i = 0; i < asc.length; ) {
    u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
    if (r1 === 64) {
      binArray.push(_fromCC(u24 >> 16 & 255));
    } else if (r2 === 64) {
      binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255));
    } else {
      binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255));
    }
  }
  return binArray.join("");
};
var _atob = typeof atob === "function" ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
var _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
var toUint8Array = (a) => _toUint8Array(_unURI(a));
var _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
var _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/"));
var decode = (src) => _decode(_unURI(src));
var isValid = (src) => {
  if (typeof src !== "string")
    return false;
  const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
  return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
var _noEnum = (v) => {
  return {
    value: v,
    enumerable: false,
    writable: true,
    configurable: true
  };
};
var extendString = function() {
  const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
  _add("fromBase64", function() {
    return decode(this);
  });
  _add("toBase64", function(urlsafe) {
    return encode(this, urlsafe);
  });
  _add("toBase64URI", function() {
    return encode(this, true);
  });
  _add("toBase64URL", function() {
    return encode(this, true);
  });
  _add("toUint8Array", function() {
    return toUint8Array(this);
  });
};
var extendUint8Array = function() {
  const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
  _add("toBase64", function(urlsafe) {
    return fromUint8Array(this, urlsafe);
  });
  _add("toBase64URI", function() {
    return fromUint8Array(this, true);
  });
  _add("toBase64URL", function() {
    return fromUint8Array(this, true);
  });
};
var extendBuiltins = () => {
  extendString();
  extendUint8Array();
};
var gBase64 = {
  version,
  VERSION,
  atob: _atob,
  atobPolyfill,
  btoa: _btoa,
  btoaPolyfill,
  fromBase64: decode,
  toBase64: encode,
  encode,
  encodeURI: encodeURI2,
  encodeURL: encodeURI2,
  utob,
  btou,
  decode,
  isValid,
  fromUint8Array,
  toUint8Array,
  extendString,
  extendUint8Array,
  extendBuiltins
};

// node_modules/@libsql/core/lib-esm/util.js
var supportedUrlLink = "https://github.com/libsql/libsql-client-ts#supported-urls";
function transactionModeToBegin(mode) {
  if (mode === "write") {
    return "BEGIN IMMEDIATE";
  } else if (mode === "read") {
    return "BEGIN TRANSACTION READONLY";
  } else if (mode === "deferred") {
    return "BEGIN DEFERRED";
  } else {
    throw RangeError('Unknown transaction mode, supported values are "write", "read" and "deferred"');
  }
}
var ResultSetImpl = class {
  columns;
  columnTypes;
  rows;
  rowsAffected;
  lastInsertRowid;
  constructor(columns, columnTypes, rows, rowsAffected, lastInsertRowid) {
    this.columns = columns;
    this.columnTypes = columnTypes;
    this.rows = rows;
    this.rowsAffected = rowsAffected;
    this.lastInsertRowid = lastInsertRowid;
  }
  toJSON() {
    return {
      columns: this.columns,
      columnTypes: this.columnTypes,
      rows: this.rows.map(rowToJson),
      rowsAffected: this.rowsAffected,
      lastInsertRowid: this.lastInsertRowid !== void 0 ? "" + this.lastInsertRowid : null
    };
  }
};
function rowToJson(row) {
  return Array.prototype.map.call(row, valueToJson);
}
function valueToJson(value) {
  if (typeof value === "bigint") {
    return "" + value;
  } else if (value instanceof ArrayBuffer) {
    return gBase64.fromUint8Array(new Uint8Array(value));
  } else {
    return value;
  }
}

// node_modules/@libsql/core/lib-esm/config.js
var inMemoryMode = ":memory:";
function expandConfig(config, preferHttp) {
  if (typeof config !== "object") {
    throw new TypeError(`Expected client configuration as object, got ${typeof config}`);
  }
  let { url: url2, authToken: authToken2, tls, intMode, concurrency } = config;
  concurrency = Math.max(0, concurrency || 20);
  intMode ??= "number";
  let connectionQueryParams = [];
  if (url2 === inMemoryMode) {
    url2 = "file::memory:";
  }
  const uri = parseUri(url2);
  const originalUriScheme = uri.scheme.toLowerCase();
  const isInMemoryMode = originalUriScheme === "file" && uri.path === inMemoryMode && uri.authority === void 0;
  let queryParamsDef;
  if (isInMemoryMode) {
    queryParamsDef = {
      cache: {
        values: ["shared", "private"],
        update: (key, value) => connectionQueryParams.push(`${key}=${value}`)
      }
    };
  } else {
    queryParamsDef = {
      tls: {
        values: ["0", "1"],
        update: (_, value) => tls = value === "1"
      },
      authToken: {
        update: (_, value) => authToken2 = value
      }
    };
  }
  for (const { key, value } of uri.query?.pairs ?? []) {
    if (!Object.hasOwn(queryParamsDef, key)) {
      throw new LibsqlError(`Unsupported URL query parameter ${JSON.stringify(key)}`, "URL_PARAM_NOT_SUPPORTED");
    }
    const queryParamDef = queryParamsDef[key];
    if (queryParamDef.values !== void 0 && !queryParamDef.values.includes(value)) {
      throw new LibsqlError(`Unknown value for the "${key}" query argument: ${JSON.stringify(value)}. Supported values are: [${queryParamDef.values.map((x) => '"' + x + '"').join(", ")}]`, "URL_INVALID");
    }
    if (queryParamDef.update !== void 0) {
      queryParamDef?.update(key, value);
    }
  }
  const connectionQueryParamsString = connectionQueryParams.length === 0 ? "" : `?${connectionQueryParams.join("&")}`;
  const path3 = uri.path + connectionQueryParamsString;
  let scheme;
  if (originalUriScheme === "libsql") {
    if (tls === false) {
      if (uri.authority?.port === void 0) {
        throw new LibsqlError('A "libsql:" URL with ?tls=0 must specify an explicit port', "URL_INVALID");
      }
      scheme = preferHttp ? "http" : "ws";
    } else {
      scheme = preferHttp ? "https" : "wss";
    }
  } else {
    scheme = originalUriScheme;
  }
  if (scheme === "http" || scheme === "ws") {
    tls ??= false;
  } else {
    tls ??= true;
  }
  if (scheme !== "http" && scheme !== "ws" && scheme !== "https" && scheme !== "wss" && scheme !== "file") {
    throw new LibsqlError(`The client supports only "libsql:", "wss:", "ws:", "https:", "http:" and "file:" URLs, got ${JSON.stringify(uri.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (intMode !== "number" && intMode !== "bigint" && intMode !== "string") {
    throw new TypeError(`Invalid value for intMode, expected "number", "bigint" or "string", got ${JSON.stringify(intMode)}`);
  }
  if (uri.fragment !== void 0) {
    throw new LibsqlError(`URL fragments are not supported: ${JSON.stringify("#" + uri.fragment)}`, "URL_INVALID");
  }
  if (isInMemoryMode) {
    return {
      scheme: "file",
      tls: false,
      path: path3,
      intMode,
      concurrency,
      syncUrl: config.syncUrl,
      syncInterval: config.syncInterval,
      readYourWrites: config.readYourWrites,
      offline: config.offline,
      fetch: config.fetch,
      authToken: void 0,
      encryptionKey: void 0,
      authority: void 0
    };
  }
  return {
    scheme,
    tls,
    authority: uri.authority,
    path: path3,
    authToken: authToken2,
    intMode,
    concurrency,
    encryptionKey: config.encryptionKey,
    syncUrl: config.syncUrl,
    syncInterval: config.syncInterval,
    readYourWrites: config.readYourWrites,
    offline: config.offline,
    fetch: config.fetch
  };
}

// node_modules/@libsql/isomorphic-ws/node.mjs
import { WebSocket } from "ws";

// node_modules/@libsql/hrana-client/lib-esm/client.js
var Client = class {
  /** @private */
  constructor() {
    this.intMode = "number";
  }
  /** Representation of integers returned from the database. See {@link IntMode}.
   *
   * This value is inherited by {@link Stream} objects created with {@link openStream}, but you can
   * override the integer mode for every stream by setting {@link Stream.intMode} on the stream.
   */
  intMode;
};

// node_modules/@libsql/hrana-client/lib-esm/errors.js
var ClientError = class extends Error {
  /** @private */
  constructor(message) {
    super(message);
    this.name = "ClientError";
  }
};
var ProtoError = class extends ClientError {
  /** @private */
  constructor(message) {
    super(message);
    this.name = "ProtoError";
  }
};
var ResponseError = class extends ClientError {
  code;
  /** @internal */
  proto;
  /** @private */
  constructor(message, protoError) {
    super(message);
    this.name = "ResponseError";
    this.code = protoError.code;
    this.proto = protoError;
    this.stack = void 0;
  }
};
var ClosedError = class extends ClientError {
  /** @private */
  constructor(message, cause) {
    if (cause !== void 0) {
      super(`${message}: ${cause}`);
      this.cause = cause;
    } else {
      super(message);
    }
    this.name = "ClosedError";
  }
};
var WebSocketUnsupportedError = class extends ClientError {
  /** @private */
  constructor(message) {
    super(message);
    this.name = "WebSocketUnsupportedError";
  }
};
var WebSocketError = class extends ClientError {
  /** @private */
  constructor(message) {
    super(message);
    this.name = "WebSocketError";
  }
};
var HttpServerError = class extends ClientError {
  status;
  /** @private */
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "HttpServerError";
  }
};
var ProtocolVersionError = class extends ClientError {
  /** @private */
  constructor(message) {
    super(message);
    this.name = "ProtocolVersionError";
  }
};
var InternalError = class extends ClientError {
  /** @private */
  constructor(message) {
    super(message);
    this.name = "InternalError";
  }
};
var MisuseError = class extends ClientError {
  /** @private */
  constructor(message) {
    super(message);
    this.name = "MisuseError";
  }
};

// node_modules/@libsql/hrana-client/lib-esm/encoding/json/decode.js
function string(value) {
  if (typeof value === "string") {
    return value;
  }
  throw typeError(value, "string");
}
function stringOpt(value) {
  if (value === null || value === void 0) {
    return void 0;
  } else if (typeof value === "string") {
    return value;
  }
  throw typeError(value, "string or null");
}
function number(value) {
  if (typeof value === "number") {
    return value;
  }
  throw typeError(value, "number");
}
function boolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  throw typeError(value, "boolean");
}
function array(value) {
  if (Array.isArray(value)) {
    return value;
  }
  throw typeError(value, "array");
}
function object(value) {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  throw typeError(value, "object");
}
function arrayObjectsMap(value, fun) {
  return array(value).map((elemValue) => fun(object(elemValue)));
}
function typeError(value, expected) {
  if (value === void 0) {
    return new ProtoError(`Expected ${expected}, but the property was missing`);
  }
  let received = typeof value;
  if (value === null) {
    received = "null";
  } else if (Array.isArray(value)) {
    received = "array";
  }
  return new ProtoError(`Expected ${expected}, received ${received}`);
}
function readJsonObject(value, fun) {
  return fun(object(value));
}

// node_modules/@libsql/hrana-client/lib-esm/encoding/json/encode.js
var ObjectWriter = class {
  #output;
  #isFirst;
  constructor(output) {
    this.#output = output;
    this.#isFirst = false;
  }
  begin() {
    this.#output.push("{");
    this.#isFirst = true;
  }
  end() {
    this.#output.push("}");
    this.#isFirst = false;
  }
  #key(name) {
    if (this.#isFirst) {
      this.#output.push('"');
      this.#isFirst = false;
    } else {
      this.#output.push(',"');
    }
    this.#output.push(name);
    this.#output.push('":');
  }
  string(name, value) {
    this.#key(name);
    this.#output.push(JSON.stringify(value));
  }
  stringRaw(name, value) {
    this.#key(name);
    this.#output.push('"');
    this.#output.push(value);
    this.#output.push('"');
  }
  number(name, value) {
    this.#key(name);
    this.#output.push("" + value);
  }
  boolean(name, value) {
    this.#key(name);
    this.#output.push(value ? "true" : "false");
  }
  object(name, value, valueFun) {
    this.#key(name);
    this.begin();
    valueFun(this, value);
    this.end();
  }
  arrayObjects(name, values, valueFun) {
    this.#key(name);
    this.#output.push("[");
    for (let i = 0; i < values.length; ++i) {
      if (i !== 0) {
        this.#output.push(",");
      }
      this.begin();
      valueFun(this, values[i]);
      this.end();
    }
    this.#output.push("]");
  }
};
function writeJsonObject(value, fun) {
  const output = [];
  const writer = new ObjectWriter(output);
  writer.begin();
  fun(writer, value);
  writer.end();
  return output.join("");
}

// node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/util.js
var VARINT = 0;
var FIXED_64 = 1;
var LENGTH_DELIMITED = 2;
var FIXED_32 = 5;

// node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/decode.js
var MessageReader = class {
  #array;
  #view;
  #pos;
  constructor(array2) {
    this.#array = array2;
    this.#view = new DataView(array2.buffer, array2.byteOffset, array2.byteLength);
    this.#pos = 0;
  }
  varint() {
    let value = 0;
    for (let shift = 0; ; shift += 7) {
      const byte = this.#array[this.#pos++];
      value |= (byte & 127) << shift;
      if (!(byte & 128)) {
        break;
      }
    }
    return value;
  }
  varintBig() {
    let value = 0n;
    for (let shift = 0n; ; shift += 7n) {
      const byte = this.#array[this.#pos++];
      value |= BigInt(byte & 127) << shift;
      if (!(byte & 128)) {
        break;
      }
    }
    return value;
  }
  bytes(length) {
    const array2 = new Uint8Array(this.#array.buffer, this.#array.byteOffset + this.#pos, length);
    this.#pos += length;
    return array2;
  }
  double() {
    const value = this.#view.getFloat64(this.#pos, true);
    this.#pos += 8;
    return value;
  }
  skipVarint() {
    for (; ; ) {
      const byte = this.#array[this.#pos++];
      if (!(byte & 128)) {
        break;
      }
    }
  }
  skip(count) {
    this.#pos += count;
  }
  eof() {
    return this.#pos >= this.#array.byteLength;
  }
};
var FieldReader = class {
  #reader;
  #wireType;
  constructor(reader) {
    this.#reader = reader;
    this.#wireType = -1;
  }
  setup(wireType) {
    this.#wireType = wireType;
  }
  #expect(expectedWireType) {
    if (this.#wireType !== expectedWireType) {
      throw new ProtoError(`Expected wire type ${expectedWireType}, got ${this.#wireType}`);
    }
    this.#wireType = -1;
  }
  bytes() {
    this.#expect(LENGTH_DELIMITED);
    const length = this.#reader.varint();
    return this.#reader.bytes(length);
  }
  string() {
    return new TextDecoder().decode(this.bytes());
  }
  message(def) {
    return readProtobufMessage(this.bytes(), def);
  }
  int32() {
    this.#expect(VARINT);
    return this.#reader.varint();
  }
  uint32() {
    return this.int32();
  }
  bool() {
    return this.int32() !== 0;
  }
  uint64() {
    this.#expect(VARINT);
    return this.#reader.varintBig();
  }
  sint64() {
    const value = this.uint64();
    return value >> 1n ^ -(value & 1n);
  }
  double() {
    this.#expect(FIXED_64);
    return this.#reader.double();
  }
  maybeSkip() {
    if (this.#wireType < 0) {
      return;
    } else if (this.#wireType === VARINT) {
      this.#reader.skipVarint();
    } else if (this.#wireType === FIXED_64) {
      this.#reader.skip(8);
    } else if (this.#wireType === LENGTH_DELIMITED) {
      const length = this.#reader.varint();
      this.#reader.skip(length);
    } else if (this.#wireType === FIXED_32) {
      this.#reader.skip(4);
    } else {
      throw new ProtoError(`Unexpected wire type ${this.#wireType}`);
    }
    this.#wireType = -1;
  }
};
function readProtobufMessage(data, def) {
  const msgReader = new MessageReader(data);
  const fieldReader = new FieldReader(msgReader);
  let value = def.default();
  while (!msgReader.eof()) {
    const key = msgReader.varint();
    const tag = key >> 3;
    const wireType = key & 7;
    fieldReader.setup(wireType);
    const tagFun = def[tag];
    if (tagFun !== void 0) {
      const returnedValue = tagFun(fieldReader, value);
      if (returnedValue !== void 0) {
        value = returnedValue;
      }
    }
    fieldReader.maybeSkip();
  }
  return value;
}

// node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/encode.js
var MessageWriter = class _MessageWriter {
  #buf;
  #array;
  #view;
  #pos;
  constructor() {
    this.#buf = new ArrayBuffer(256);
    this.#array = new Uint8Array(this.#buf);
    this.#view = new DataView(this.#buf);
    this.#pos = 0;
  }
  #ensure(extra) {
    if (this.#pos + extra <= this.#buf.byteLength) {
      return;
    }
    let newCap = this.#buf.byteLength;
    while (newCap < this.#pos + extra) {
      newCap *= 2;
    }
    const newBuf = new ArrayBuffer(newCap);
    const newArray = new Uint8Array(newBuf);
    const newView = new DataView(newBuf);
    newArray.set(new Uint8Array(this.#buf, 0, this.#pos));
    this.#buf = newBuf;
    this.#array = newArray;
    this.#view = newView;
  }
  #varint(value) {
    this.#ensure(5);
    value = 0 | value;
    do {
      let byte = value & 127;
      value >>>= 7;
      byte |= value ? 128 : 0;
      this.#array[this.#pos++] = byte;
    } while (value);
  }
  #varintBig(value) {
    this.#ensure(10);
    value = value & 0xffffffffffffffffn;
    do {
      let byte = Number(value & 0x7fn);
      value >>= 7n;
      byte |= value ? 128 : 0;
      this.#array[this.#pos++] = byte;
    } while (value);
  }
  #tag(tag, wireType) {
    this.#varint(tag << 3 | wireType);
  }
  bytes(tag, value) {
    this.#tag(tag, LENGTH_DELIMITED);
    this.#varint(value.byteLength);
    this.#ensure(value.byteLength);
    this.#array.set(value, this.#pos);
    this.#pos += value.byteLength;
  }
  string(tag, value) {
    this.bytes(tag, new TextEncoder().encode(value));
  }
  message(tag, value, fun) {
    const writer = new _MessageWriter();
    fun(writer, value);
    this.bytes(tag, writer.data());
  }
  int32(tag, value) {
    this.#tag(tag, VARINT);
    this.#varint(value);
  }
  uint32(tag, value) {
    this.int32(tag, value);
  }
  bool(tag, value) {
    this.int32(tag, value ? 1 : 0);
  }
  sint64(tag, value) {
    this.#tag(tag, VARINT);
    this.#varintBig(value << 1n ^ value >> 63n);
  }
  double(tag, value) {
    this.#tag(tag, FIXED_64);
    this.#ensure(8);
    this.#view.setFloat64(this.#pos, value, true);
    this.#pos += 8;
  }
  data() {
    return new Uint8Array(this.#buf, 0, this.#pos);
  }
};
function writeProtobufMessage(value, fun) {
  const w = new MessageWriter();
  fun(w, value);
  return w.data();
}

// node_modules/@libsql/hrana-client/lib-esm/id_alloc.js
var IdAlloc = class {
  // Set of all allocated ids
  #usedIds;
  // Set of all free ids lower than `#usedIds.size`
  #freeIds;
  constructor() {
    this.#usedIds = /* @__PURE__ */ new Set();
    this.#freeIds = /* @__PURE__ */ new Set();
  }
  // Returns an id that was free, and marks it as used.
  alloc() {
    for (const freeId2 of this.#freeIds) {
      this.#freeIds.delete(freeId2);
      this.#usedIds.add(freeId2);
      if (!this.#usedIds.has(this.#usedIds.size - 1)) {
        this.#freeIds.add(this.#usedIds.size - 1);
      }
      return freeId2;
    }
    const freeId = this.#usedIds.size;
    this.#usedIds.add(freeId);
    return freeId;
  }
  free(id) {
    if (!this.#usedIds.delete(id)) {
      throw new InternalError("Freeing an id that is not allocated");
    }
    this.#freeIds.delete(this.#usedIds.size);
    if (id < this.#usedIds.size) {
      this.#freeIds.add(id);
    }
  }
};

// node_modules/@libsql/hrana-client/lib-esm/util.js
function impossible(value, message) {
  throw new InternalError(message);
}

// node_modules/@libsql/hrana-client/lib-esm/value.js
function valueToProto(value) {
  if (value === null) {
    return null;
  } else if (typeof value === "string") {
    return value;
  } else if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new RangeError("Only finite numbers (not Infinity or NaN) can be passed as arguments");
    }
    return value;
  } else if (typeof value === "bigint") {
    if (value < minInteger || value > maxInteger) {
      throw new RangeError("This bigint value is too large to be represented as a 64-bit integer and passed as argument");
    }
    return value;
  } else if (typeof value === "boolean") {
    return value ? 1n : 0n;
  } else if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  } else if (value instanceof Uint8Array) {
    return value;
  } else if (value instanceof Date) {
    return +value.valueOf();
  } else if (typeof value === "object") {
    return "" + value.toString();
  } else {
    throw new TypeError("Unsupported type of value");
  }
}
var minInteger = -9223372036854775808n;
var maxInteger = 9223372036854775807n;
function valueFromProto(value, intMode) {
  if (value === null) {
    return null;
  } else if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return value;
  } else if (typeof value === "bigint") {
    if (intMode === "number") {
      const num = Number(value);
      if (!Number.isSafeInteger(num)) {
        throw new RangeError("Received integer which is too large to be safely represented as a JavaScript number");
      }
      return num;
    } else if (intMode === "bigint") {
      return value;
    } else if (intMode === "string") {
      return "" + value;
    } else {
      throw new MisuseError("Invalid value for IntMode");
    }
  } else if (value instanceof Uint8Array) {
    return value.slice().buffer;
  } else if (value === void 0) {
    throw new ProtoError("Received unrecognized type of Value");
  } else {
    throw impossible(value, "Impossible type of Value");
  }
}

// node_modules/@libsql/hrana-client/lib-esm/result.js
function stmtResultFromProto(result) {
  return {
    affectedRowCount: result.affectedRowCount,
    lastInsertRowid: result.lastInsertRowid,
    columnNames: result.cols.map((col) => col.name),
    columnDecltypes: result.cols.map((col) => col.decltype)
  };
}
function rowsResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  const rows = result.rows.map((row) => rowFromProto(stmtResult.columnNames, row, intMode));
  return { ...stmtResult, rows };
}
function rowResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  let row;
  if (result.rows.length > 0) {
    row = rowFromProto(stmtResult.columnNames, result.rows[0], intMode);
  }
  return { ...stmtResult, row };
}
function valueResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  let value;
  if (result.rows.length > 0 && stmtResult.columnNames.length > 0) {
    value = valueFromProto(result.rows[0][0], intMode);
  }
  return { ...stmtResult, value };
}
function rowFromProto(colNames, values, intMode) {
  const row = {};
  Object.defineProperty(row, "length", { value: values.length });
  for (let i = 0; i < values.length; ++i) {
    const value = valueFromProto(values[i], intMode);
    Object.defineProperty(row, i, { value });
    const colName = colNames[i];
    if (colName !== void 0 && !Object.hasOwn(row, colName)) {
      Object.defineProperty(row, colName, { value, enumerable: true, configurable: true, writable: true });
    }
  }
  return row;
}
function errorFromProto(error) {
  return new ResponseError(error.message, error);
}

// node_modules/@libsql/hrana-client/lib-esm/sql.js
var Sql = class {
  #owner;
  #sqlId;
  #closed;
  /** @private */
  constructor(owner, sqlId) {
    this.#owner = owner;
    this.#sqlId = sqlId;
    this.#closed = void 0;
  }
  /** @private */
  _getSqlId(owner) {
    if (this.#owner !== owner) {
      throw new MisuseError("Attempted to use SQL text opened with other object");
    } else if (this.#closed !== void 0) {
      throw new ClosedError("SQL text is closed", this.#closed);
    }
    return this.#sqlId;
  }
  /** Remove the SQL text from the server, releasing resouces. */
  close() {
    this._setClosed(new ClientError("SQL text was manually closed"));
  }
  /** @private */
  _setClosed(error) {
    if (this.#closed === void 0) {
      this.#closed = error;
      this.#owner._closeSql(this.#sqlId);
    }
  }
  /** True if the SQL text is closed (removed from the server). */
  get closed() {
    return this.#closed !== void 0;
  }
};
function sqlToProto(owner, sql) {
  if (sql instanceof Sql) {
    return { sqlId: sql._getSqlId(owner) };
  } else {
    return { sql: "" + sql };
  }
}

// node_modules/@libsql/hrana-client/lib-esm/queue.js
var Queue = class {
  #pushStack;
  #shiftStack;
  constructor() {
    this.#pushStack = [];
    this.#shiftStack = [];
  }
  get length() {
    return this.#pushStack.length + this.#shiftStack.length;
  }
  push(elem) {
    this.#pushStack.push(elem);
  }
  shift() {
    if (this.#shiftStack.length === 0 && this.#pushStack.length > 0) {
      this.#shiftStack = this.#pushStack.reverse();
      this.#pushStack = [];
    }
    return this.#shiftStack.pop();
  }
  first() {
    return this.#shiftStack.length !== 0 ? this.#shiftStack[this.#shiftStack.length - 1] : this.#pushStack[0];
  }
};

// node_modules/@libsql/hrana-client/lib-esm/stmt.js
var Stmt = class {
  /** The SQL statement text. */
  sql;
  /** @private */
  _args;
  /** @private */
  _namedArgs;
  /** Initialize the statement with given SQL text. */
  constructor(sql) {
    this.sql = sql;
    this._args = [];
    this._namedArgs = /* @__PURE__ */ new Map();
  }
  /** Binds positional parameters from the given `values`. All previous positional bindings are cleared. */
  bindIndexes(values) {
    this._args.length = 0;
    for (const value of values) {
      this._args.push(valueToProto(value));
    }
    return this;
  }
  /** Binds a parameter by a 1-based index. */
  bindIndex(index, value) {
    if (index !== (index | 0) || index <= 0) {
      throw new RangeError("Index of a positional argument must be positive integer");
    }
    while (this._args.length < index) {
      this._args.push(null);
    }
    this._args[index - 1] = valueToProto(value);
    return this;
  }
  /** Binds a parameter by name. */
  bindName(name, value) {
    this._namedArgs.set(name, valueToProto(value));
    return this;
  }
  /** Clears all bindings. */
  unbindAll() {
    this._args.length = 0;
    this._namedArgs.clear();
    return this;
  }
};
function stmtToProto(sqlOwner, stmt, wantRows) {
  let inSql;
  let args = [];
  let namedArgs = [];
  if (stmt instanceof Stmt) {
    inSql = stmt.sql;
    args = stmt._args;
    for (const [name, value] of stmt._namedArgs.entries()) {
      namedArgs.push({ name, value });
    }
  } else if (Array.isArray(stmt)) {
    inSql = stmt[0];
    if (Array.isArray(stmt[1])) {
      args = stmt[1].map((arg) => valueToProto(arg));
    } else {
      namedArgs = Object.entries(stmt[1]).map(([name, value]) => {
        return { name, value: valueToProto(value) };
      });
    }
  } else {
    inSql = stmt;
  }
  const { sql, sqlId } = sqlToProto(sqlOwner, inSql);
  return { sql, sqlId, args, namedArgs, wantRows };
}

// node_modules/@libsql/hrana-client/lib-esm/batch.js
var Batch = class {
  /** @private */
  _stream;
  #useCursor;
  /** @private */
  _steps;
  #executed;
  /** @private */
  constructor(stream, useCursor) {
    this._stream = stream;
    this.#useCursor = useCursor;
    this._steps = [];
    this.#executed = false;
  }
  /** Return a builder for adding a step to the batch. */
  step() {
    return new BatchStep(this);
  }
  /** Execute the batch. */
  execute() {
    if (this.#executed) {
      throw new MisuseError("This batch has already been executed");
    }
    this.#executed = true;
    const batch = {
      steps: this._steps.map((step) => step.proto)
    };
    if (this.#useCursor) {
      return executeCursor(this._stream, this._steps, batch);
    } else {
      return executeRegular(this._stream, this._steps, batch);
    }
  }
};
function executeRegular(stream, steps, batch) {
  return stream._batch(batch).then((result) => {
    for (let step = 0; step < steps.length; ++step) {
      const stepResult = result.stepResults.get(step);
      const stepError = result.stepErrors.get(step);
      steps[step].callback(stepResult, stepError);
    }
  });
}
async function executeCursor(stream, steps, batch) {
  const cursor = await stream._openCursor(batch);
  try {
    let nextStep = 0;
    let beginEntry = void 0;
    let rows = [];
    for (; ; ) {
      const entry = await cursor.next();
      if (entry === void 0) {
        break;
      }
      if (entry.type === "step_begin") {
        if (entry.step < nextStep || entry.step >= steps.length) {
          throw new ProtoError("Server produced StepBeginEntry for unexpected step");
        } else if (beginEntry !== void 0) {
          throw new ProtoError("Server produced StepBeginEntry before terminating previous step");
        }
        for (let step = nextStep; step < entry.step; ++step) {
          steps[step].callback(void 0, void 0);
        }
        nextStep = entry.step + 1;
        beginEntry = entry;
        rows = [];
      } else if (entry.type === "step_end") {
        if (beginEntry === void 0) {
          throw new ProtoError("Server produced StepEndEntry but no step is active");
        }
        const stmtResult = {
          cols: beginEntry.cols,
          rows,
          affectedRowCount: entry.affectedRowCount,
          lastInsertRowid: entry.lastInsertRowid
        };
        steps[beginEntry.step].callback(stmtResult, void 0);
        beginEntry = void 0;
        rows = [];
      } else if (entry.type === "step_error") {
        if (beginEntry === void 0) {
          if (entry.step >= steps.length) {
            throw new ProtoError("Server produced StepErrorEntry for unexpected step");
          }
          for (let step = nextStep; step < entry.step; ++step) {
            steps[step].callback(void 0, void 0);
          }
        } else {
          if (entry.step !== beginEntry.step) {
            throw new ProtoError("Server produced StepErrorEntry for unexpected step");
          }
          beginEntry = void 0;
          rows = [];
        }
        steps[entry.step].callback(void 0, entry.error);
        nextStep = entry.step + 1;
      } else if (entry.type === "row") {
        if (beginEntry === void 0) {
          throw new ProtoError("Server produced RowEntry but no step is active");
        }
        rows.push(entry.row);
      } else if (entry.type === "error") {
        throw errorFromProto(entry.error);
      } else if (entry.type === "none") {
        throw new ProtoError("Server produced unrecognized CursorEntry");
      } else {
        throw impossible(entry, "Impossible CursorEntry");
      }
    }
    if (beginEntry !== void 0) {
      throw new ProtoError("Server closed Cursor before terminating active step");
    }
    for (let step = nextStep; step < steps.length; ++step) {
      steps[step].callback(void 0, void 0);
    }
  } finally {
    cursor.close();
  }
}
var BatchStep = class {
  /** @private */
  _batch;
  #conds;
  /** @private */
  _index;
  /** @private */
  constructor(batch) {
    this._batch = batch;
    this.#conds = [];
    this._index = void 0;
  }
  /** Add the condition that needs to be satisfied to execute the statement. If you use this method multiple
   * times, we join the conditions with a logical AND. */
  condition(cond) {
    this.#conds.push(cond._proto);
    return this;
  }
  /** Add a statement that returns rows. */
  query(stmt) {
    return this.#add(stmt, true, rowsResultFromProto);
  }
  /** Add a statement that returns at most a single row. */
  queryRow(stmt) {
    return this.#add(stmt, true, rowResultFromProto);
  }
  /** Add a statement that returns at most a single value. */
  queryValue(stmt) {
    return this.#add(stmt, true, valueResultFromProto);
  }
  /** Add a statement without returning rows. */
  run(stmt) {
    return this.#add(stmt, false, stmtResultFromProto);
  }
  #add(inStmt, wantRows, fromProto) {
    if (this._index !== void 0) {
      throw new MisuseError("This BatchStep has already been added to the batch");
    }
    const stmt = stmtToProto(this._batch._stream._sqlOwner(), inStmt, wantRows);
    let condition;
    if (this.#conds.length === 0) {
      condition = void 0;
    } else if (this.#conds.length === 1) {
      condition = this.#conds[0];
    } else {
      condition = { type: "and", conds: this.#conds.slice() };
    }
    const proto = { stmt, condition };
    return new Promise((outputCallback, errorCallback) => {
      const callback = (stepResult, stepError) => {
        if (stepResult !== void 0 && stepError !== void 0) {
          errorCallback(new ProtoError("Server returned both result and error"));
        } else if (stepError !== void 0) {
          errorCallback(errorFromProto(stepError));
        } else if (stepResult !== void 0) {
          outputCallback(fromProto(stepResult, this._batch._stream.intMode));
        } else {
          outputCallback(void 0);
        }
      };
      this._index = this._batch._steps.length;
      this._batch._steps.push({ proto, callback });
    });
  }
};
var BatchCond = class _BatchCond {
  /** @private */
  _batch;
  /** @private */
  _proto;
  /** @private */
  constructor(batch, proto) {
    this._batch = batch;
    this._proto = proto;
  }
  /** Create a condition that evaluates to true when the given step executes successfully.
   *
   * If the given step fails error or is skipped because its condition evaluated to false, this
   * condition evaluates to false.
   */
  static ok(step) {
    return new _BatchCond(step._batch, { type: "ok", step: stepIndex(step) });
  }
  /** Create a condition that evaluates to true when the given step fails.
   *
   * If the given step succeeds or is skipped because its condition evaluated to false, this condition
   * evaluates to false.
   */
  static error(step) {
    return new _BatchCond(step._batch, { type: "error", step: stepIndex(step) });
  }
  /** Create a condition that is a logical negation of another condition.
   */
  static not(cond) {
    return new _BatchCond(cond._batch, { type: "not", cond: cond._proto });
  }
  /** Create a condition that is a logical AND of other conditions.
   */
  static and(batch, conds) {
    for (const cond of conds) {
      checkCondBatch(batch, cond);
    }
    return new _BatchCond(batch, { type: "and", conds: conds.map((e) => e._proto) });
  }
  /** Create a condition that is a logical OR of other conditions.
   */
  static or(batch, conds) {
    for (const cond of conds) {
      checkCondBatch(batch, cond);
    }
    return new _BatchCond(batch, { type: "or", conds: conds.map((e) => e._proto) });
  }
  /** Create a condition that evaluates to true when the SQL connection is in autocommit mode (not inside an
   * explicit transaction). This requires protocol version 3 or higher.
   */
  static isAutocommit(batch) {
    batch._stream.client()._ensureVersion(3, "BatchCond.isAutocommit()");
    return new _BatchCond(batch, { type: "is_autocommit" });
  }
};
function stepIndex(step) {
  if (step._index === void 0) {
    throw new MisuseError("Cannot add a condition referencing a step that has not been added to the batch");
  }
  return step._index;
}
function checkCondBatch(expectedBatch, cond) {
  if (cond._batch !== expectedBatch) {
    throw new MisuseError("Cannot mix BatchCond objects for different Batch objects");
  }
}

// node_modules/@libsql/hrana-client/lib-esm/describe.js
function describeResultFromProto(result) {
  return {
    paramNames: result.params.map((p) => p.name),
    columns: result.cols,
    isExplain: result.isExplain,
    isReadonly: result.isReadonly
  };
}

// node_modules/@libsql/hrana-client/lib-esm/stream.js
var Stream = class {
  /** @private */
  constructor(intMode) {
    this.intMode = intMode;
  }
  /** Execute a statement and return rows. */
  query(stmt) {
    return this.#execute(stmt, true, rowsResultFromProto);
  }
  /** Execute a statement and return at most a single row. */
  queryRow(stmt) {
    return this.#execute(stmt, true, rowResultFromProto);
  }
  /** Execute a statement and return at most a single value. */
  queryValue(stmt) {
    return this.#execute(stmt, true, valueResultFromProto);
  }
  /** Execute a statement without returning rows. */
  run(stmt) {
    return this.#execute(stmt, false, stmtResultFromProto);
  }
  #execute(inStmt, wantRows, fromProto) {
    const stmt = stmtToProto(this._sqlOwner(), inStmt, wantRows);
    return this._execute(stmt).then((r) => fromProto(r, this.intMode));
  }
  /** Return a builder for creating and executing a batch.
   *
   * If `useCursor` is true, the batch will be executed using a Hrana cursor, which will stream results from
   * the server to the client, which consumes less memory on the server. This requires protocol version 3 or
   * higher.
   */
  batch(useCursor = false) {
    return new Batch(this, useCursor);
  }
  /** Parse and analyze a statement. This requires protocol version 2 or higher. */
  describe(inSql) {
    const protoSql = sqlToProto(this._sqlOwner(), inSql);
    return this._describe(protoSql).then(describeResultFromProto);
  }
  /** Execute a sequence of statements separated by semicolons. This requires protocol version 2 or higher.
   * */
  sequence(inSql) {
    const protoSql = sqlToProto(this._sqlOwner(), inSql);
    return this._sequence(protoSql);
  }
  /** Representation of integers returned from the database. See {@link IntMode}.
   *
   * This value affects the results of all operations on this stream.
   */
  intMode;
};

// node_modules/@libsql/hrana-client/lib-esm/cursor.js
var Cursor = class {
};

// node_modules/@libsql/hrana-client/lib-esm/ws/cursor.js
var fetchChunkSize = 1e3;
var fetchQueueSize = 10;
var WsCursor = class extends Cursor {
  #client;
  #stream;
  #cursorId;
  #entryQueue;
  #fetchQueue;
  #closed;
  #done;
  /** @private */
  constructor(client2, stream, cursorId) {
    super();
    this.#client = client2;
    this.#stream = stream;
    this.#cursorId = cursorId;
    this.#entryQueue = new Queue();
    this.#fetchQueue = new Queue();
    this.#closed = void 0;
    this.#done = false;
  }
  /** Fetch the next entry from the cursor. */
  async next() {
    for (; ; ) {
      if (this.#closed !== void 0) {
        throw new ClosedError("Cursor is closed", this.#closed);
      }
      while (!this.#done && this.#fetchQueue.length < fetchQueueSize) {
        this.#fetchQueue.push(this.#fetch());
      }
      const entry = this.#entryQueue.shift();
      if (this.#done || entry !== void 0) {
        return entry;
      }
      await this.#fetchQueue.shift().then((response) => {
        if (response === void 0) {
          return;
        }
        for (const entry2 of response.entries) {
          this.#entryQueue.push(entry2);
        }
        this.#done ||= response.done;
      });
    }
  }
  #fetch() {
    return this.#stream._sendCursorRequest(this, {
      type: "fetch_cursor",
      cursorId: this.#cursorId,
      maxCount: fetchChunkSize
    }).then((resp) => resp, (error) => {
      this._setClosed(error);
      return void 0;
    });
  }
  /** @private */
  _setClosed(error) {
    if (this.#closed !== void 0) {
      return;
    }
    this.#closed = error;
    this.#stream._sendCursorRequest(this, {
      type: "close_cursor",
      cursorId: this.#cursorId
    }).catch(() => void 0);
    this.#stream._cursorClosed(this);
  }
  /** Close the cursor. */
  close() {
    this._setClosed(new ClientError("Cursor was manually closed"));
  }
  /** True if the cursor is closed. */
  get closed() {
    return this.#closed !== void 0;
  }
};

// node_modules/@libsql/hrana-client/lib-esm/ws/stream.js
var WsStream = class _WsStream extends Stream {
  #client;
  #streamId;
  #queue;
  #cursor;
  #closing;
  #closed;
  /** @private */
  static open(client2) {
    const streamId = client2._streamIdAlloc.alloc();
    const stream = new _WsStream(client2, streamId);
    const responseCallback = () => void 0;
    const errorCallback = (e) => stream.#setClosed(e);
    const request = { type: "open_stream", streamId };
    client2._sendRequest(request, { responseCallback, errorCallback });
    return stream;
  }
  /** @private */
  constructor(client2, streamId) {
    super(client2.intMode);
    this.#client = client2;
    this.#streamId = streamId;
    this.#queue = new Queue();
    this.#cursor = void 0;
    this.#closing = false;
    this.#closed = void 0;
  }
  /** Get the {@link WsClient} object that this stream belongs to. */
  client() {
    return this.#client;
  }
  /** @private */
  _sqlOwner() {
    return this.#client;
  }
  /** @private */
  _execute(stmt) {
    return this.#sendStreamRequest({
      type: "execute",
      streamId: this.#streamId,
      stmt
    }).then((response) => {
      return response.result;
    });
  }
  /** @private */
  _batch(batch) {
    return this.#sendStreamRequest({
      type: "batch",
      streamId: this.#streamId,
      batch
    }).then((response) => {
      return response.result;
    });
  }
  /** @private */
  _describe(protoSql) {
    this.#client._ensureVersion(2, "describe()");
    return this.#sendStreamRequest({
      type: "describe",
      streamId: this.#streamId,
      sql: protoSql.sql,
      sqlId: protoSql.sqlId
    }).then((response) => {
      return response.result;
    });
  }
  /** @private */
  _sequence(protoSql) {
    this.#client._ensureVersion(2, "sequence()");
    return this.#sendStreamRequest({
      type: "sequence",
      streamId: this.#streamId,
      sql: protoSql.sql,
      sqlId: protoSql.sqlId
    }).then((_response) => {
      return void 0;
    });
  }
  /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
   * explicit transaction). This requires protocol version 3 or higher.
   */
  getAutocommit() {
    this.#client._ensureVersion(3, "getAutocommit()");
    return this.#sendStreamRequest({
      type: "get_autocommit",
      streamId: this.#streamId
    }).then((response) => {
      return response.isAutocommit;
    });
  }
  #sendStreamRequest(request) {
    return new Promise((responseCallback, errorCallback) => {
      this.#pushToQueue({ type: "request", request, responseCallback, errorCallback });
    });
  }
  /** @private */
  _openCursor(batch) {
    this.#client._ensureVersion(3, "cursor");
    return new Promise((cursorCallback, errorCallback) => {
      this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
    });
  }
  /** @private */
  _sendCursorRequest(cursor, request) {
    if (cursor !== this.#cursor) {
      throw new InternalError("Cursor not associated with the stream attempted to execute a request");
    }
    return new Promise((responseCallback, errorCallback) => {
      if (this.#closed !== void 0) {
        errorCallback(new ClosedError("Stream is closed", this.#closed));
      } else {
        this.#client._sendRequest(request, { responseCallback, errorCallback });
      }
    });
  }
  /** @private */
  _cursorClosed(cursor) {
    if (cursor !== this.#cursor) {
      throw new InternalError("Cursor was closed, but it was not associated with the stream");
    }
    this.#cursor = void 0;
    this.#flushQueue();
  }
  #pushToQueue(entry) {
    if (this.#closed !== void 0) {
      entry.errorCallback(new ClosedError("Stream is closed", this.#closed));
    } else if (this.#closing) {
      entry.errorCallback(new ClosedError("Stream is closing", void 0));
    } else {
      this.#queue.push(entry);
      this.#flushQueue();
    }
  }
  #flushQueue() {
    for (; ; ) {
      const entry = this.#queue.first();
      if (entry === void 0 && this.#cursor === void 0 && this.#closing) {
        this.#setClosed(new ClientError("Stream was gracefully closed"));
        break;
      } else if (entry?.type === "request" && this.#cursor === void 0) {
        const { request, responseCallback, errorCallback } = entry;
        this.#queue.shift();
        this.#client._sendRequest(request, { responseCallback, errorCallback });
      } else if (entry?.type === "cursor" && this.#cursor === void 0) {
        const { batch, cursorCallback } = entry;
        this.#queue.shift();
        const cursorId = this.#client._cursorIdAlloc.alloc();
        const cursor = new WsCursor(this.#client, this, cursorId);
        const request = {
          type: "open_cursor",
          streamId: this.#streamId,
          cursorId,
          batch
        };
        const responseCallback = () => void 0;
        const errorCallback = (e) => cursor._setClosed(e);
        this.#client._sendRequest(request, { responseCallback, errorCallback });
        this.#cursor = cursor;
        cursorCallback(cursor);
      } else {
        break;
      }
    }
  }
  #setClosed(error) {
    if (this.#closed !== void 0) {
      return;
    }
    this.#closed = error;
    if (this.#cursor !== void 0) {
      this.#cursor._setClosed(error);
    }
    for (; ; ) {
      const entry = this.#queue.shift();
      if (entry !== void 0) {
        entry.errorCallback(error);
      } else {
        break;
      }
    }
    const request = { type: "close_stream", streamId: this.#streamId };
    const responseCallback = () => this.#client._streamIdAlloc.free(this.#streamId);
    const errorCallback = () => void 0;
    this.#client._sendRequest(request, { responseCallback, errorCallback });
  }
  /** Immediately close the stream. */
  close() {
    this.#setClosed(new ClientError("Stream was manually closed"));
  }
  /** Gracefully close the stream. */
  closeGracefully() {
    this.#closing = true;
    this.#flushQueue();
  }
  /** True if the stream is closed or closing. */
  get closed() {
    return this.#closed !== void 0 || this.#closing;
  }
};

// node_modules/@libsql/hrana-client/lib-esm/shared/json_encode.js
function Stmt2(w, msg) {
  if (msg.sql !== void 0) {
    w.string("sql", msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.number("sql_id", msg.sqlId);
  }
  w.arrayObjects("args", msg.args, Value);
  w.arrayObjects("named_args", msg.namedArgs, NamedArg);
  w.boolean("want_rows", msg.wantRows);
}
function NamedArg(w, msg) {
  w.string("name", msg.name);
  w.object("value", msg.value, Value);
}
function Batch2(w, msg) {
  w.arrayObjects("steps", msg.steps, BatchStep2);
}
function BatchStep2(w, msg) {
  if (msg.condition !== void 0) {
    w.object("condition", msg.condition, BatchCond2);
  }
  w.object("stmt", msg.stmt, Stmt2);
}
function BatchCond2(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "ok" || msg.type === "error") {
    w.number("step", msg.step);
  } else if (msg.type === "not") {
    w.object("cond", msg.cond, BatchCond2);
  } else if (msg.type === "and" || msg.type === "or") {
    w.arrayObjects("conds", msg.conds, BatchCond2);
  } else if (msg.type === "is_autocommit") {
  } else {
    throw impossible(msg, "Impossible type of BatchCond");
  }
}
function Value(w, msg) {
  if (msg === null) {
    w.stringRaw("type", "null");
  } else if (typeof msg === "bigint") {
    w.stringRaw("type", "integer");
    w.stringRaw("value", "" + msg);
  } else if (typeof msg === "number") {
    w.stringRaw("type", "float");
    w.number("value", msg);
  } else if (typeof msg === "string") {
    w.stringRaw("type", "text");
    w.string("value", msg);
  } else if (msg instanceof Uint8Array) {
    w.stringRaw("type", "blob");
    w.stringRaw("base64", gBase64.fromUint8Array(msg));
  } else if (msg === void 0) {
  } else {
    throw impossible(msg, "Impossible type of Value");
  }
}

// node_modules/@libsql/hrana-client/lib-esm/ws/json_encode.js
function ClientMsg(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "hello") {
    if (msg.jwt !== void 0) {
      w.string("jwt", msg.jwt);
    }
  } else if (msg.type === "request") {
    w.number("request_id", msg.requestId);
    w.object("request", msg.request, Request3);
  } else {
    throw impossible(msg, "Impossible type of ClientMsg");
  }
}
function Request3(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "open_stream") {
    w.number("stream_id", msg.streamId);
  } else if (msg.type === "close_stream") {
    w.number("stream_id", msg.streamId);
  } else if (msg.type === "execute") {
    w.number("stream_id", msg.streamId);
    w.object("stmt", msg.stmt, Stmt2);
  } else if (msg.type === "batch") {
    w.number("stream_id", msg.streamId);
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "open_cursor") {
    w.number("stream_id", msg.streamId);
    w.number("cursor_id", msg.cursorId);
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "close_cursor") {
    w.number("cursor_id", msg.cursorId);
  } else if (msg.type === "fetch_cursor") {
    w.number("cursor_id", msg.cursorId);
    w.number("max_count", msg.maxCount);
  } else if (msg.type === "sequence") {
    w.number("stream_id", msg.streamId);
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "describe") {
    w.number("stream_id", msg.streamId);
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "store_sql") {
    w.number("sql_id", msg.sqlId);
    w.string("sql", msg.sql);
  } else if (msg.type === "close_sql") {
    w.number("sql_id", msg.sqlId);
  } else if (msg.type === "get_autocommit") {
    w.number("stream_id", msg.streamId);
  } else {
    throw impossible(msg, "Impossible type of Request");
  }
}

// node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_encode.js
function Stmt3(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
  for (const arg of msg.args) {
    w.message(3, arg, Value2);
  }
  for (const arg of msg.namedArgs) {
    w.message(4, arg, NamedArg2);
  }
  w.bool(5, msg.wantRows);
}
function NamedArg2(w, msg) {
  w.string(1, msg.name);
  w.message(2, msg.value, Value2);
}
function Batch3(w, msg) {
  for (const step of msg.steps) {
    w.message(1, step, BatchStep3);
  }
}
function BatchStep3(w, msg) {
  if (msg.condition !== void 0) {
    w.message(1, msg.condition, BatchCond3);
  }
  w.message(2, msg.stmt, Stmt3);
}
function BatchCond3(w, msg) {
  if (msg.type === "ok") {
    w.uint32(1, msg.step);
  } else if (msg.type === "error") {
    w.uint32(2, msg.step);
  } else if (msg.type === "not") {
    w.message(3, msg.cond, BatchCond3);
  } else if (msg.type === "and") {
    w.message(4, msg.conds, BatchCondList);
  } else if (msg.type === "or") {
    w.message(5, msg.conds, BatchCondList);
  } else if (msg.type === "is_autocommit") {
    w.message(6, void 0, Empty);
  } else {
    throw impossible(msg, "Impossible type of BatchCond");
  }
}
function BatchCondList(w, msg) {
  for (const cond of msg) {
    w.message(1, cond, BatchCond3);
  }
}
function Value2(w, msg) {
  if (msg === null) {
    w.message(1, void 0, Empty);
  } else if (typeof msg === "bigint") {
    w.sint64(2, msg);
  } else if (typeof msg === "number") {
    w.double(3, msg);
  } else if (typeof msg === "string") {
    w.string(4, msg);
  } else if (msg instanceof Uint8Array) {
    w.bytes(5, msg);
  } else if (msg === void 0) {
  } else {
    throw impossible(msg, "Impossible type of Value");
  }
}
function Empty(_w, _msg) {
}

// node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_encode.js
function ClientMsg2(w, msg) {
  if (msg.type === "hello") {
    w.message(1, msg, HelloMsg);
  } else if (msg.type === "request") {
    w.message(2, msg, RequestMsg);
  } else {
    throw impossible(msg, "Impossible type of ClientMsg");
  }
}
function HelloMsg(w, msg) {
  if (msg.jwt !== void 0) {
    w.string(1, msg.jwt);
  }
}
function RequestMsg(w, msg) {
  w.int32(1, msg.requestId);
  const request = msg.request;
  if (request.type === "open_stream") {
    w.message(2, request, OpenStreamReq);
  } else if (request.type === "close_stream") {
    w.message(3, request, CloseStreamReq);
  } else if (request.type === "execute") {
    w.message(4, request, ExecuteReq);
  } else if (request.type === "batch") {
    w.message(5, request, BatchReq);
  } else if (request.type === "open_cursor") {
    w.message(6, request, OpenCursorReq);
  } else if (request.type === "close_cursor") {
    w.message(7, request, CloseCursorReq);
  } else if (request.type === "fetch_cursor") {
    w.message(8, request, FetchCursorReq);
  } else if (request.type === "sequence") {
    w.message(9, request, SequenceReq);
  } else if (request.type === "describe") {
    w.message(10, request, DescribeReq);
  } else if (request.type === "store_sql") {
    w.message(11, request, StoreSqlReq);
  } else if (request.type === "close_sql") {
    w.message(12, request, CloseSqlReq);
  } else if (request.type === "get_autocommit") {
    w.message(13, request, GetAutocommitReq);
  } else {
    throw impossible(request, "Impossible type of Request");
  }
}
function OpenStreamReq(w, msg) {
  w.int32(1, msg.streamId);
}
function CloseStreamReq(w, msg) {
  w.int32(1, msg.streamId);
}
function ExecuteReq(w, msg) {
  w.int32(1, msg.streamId);
  w.message(2, msg.stmt, Stmt3);
}
function BatchReq(w, msg) {
  w.int32(1, msg.streamId);
  w.message(2, msg.batch, Batch3);
}
function OpenCursorReq(w, msg) {
  w.int32(1, msg.streamId);
  w.int32(2, msg.cursorId);
  w.message(3, msg.batch, Batch3);
}
function CloseCursorReq(w, msg) {
  w.int32(1, msg.cursorId);
}
function FetchCursorReq(w, msg) {
  w.int32(1, msg.cursorId);
  w.uint32(2, msg.maxCount);
}
function SequenceReq(w, msg) {
  w.int32(1, msg.streamId);
  if (msg.sql !== void 0) {
    w.string(2, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(3, msg.sqlId);
  }
}
function DescribeReq(w, msg) {
  w.int32(1, msg.streamId);
  if (msg.sql !== void 0) {
    w.string(2, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(3, msg.sqlId);
  }
}
function StoreSqlReq(w, msg) {
  w.int32(1, msg.sqlId);
  w.string(2, msg.sql);
}
function CloseSqlReq(w, msg) {
  w.int32(1, msg.sqlId);
}
function GetAutocommitReq(w, msg) {
  w.int32(1, msg.streamId);
}

// node_modules/@libsql/hrana-client/lib-esm/shared/json_decode.js
function Error2(obj) {
  const message = string(obj["message"]);
  const code = stringOpt(obj["code"]);
  return { message, code };
}
function StmtResult(obj) {
  const cols = arrayObjectsMap(obj["cols"], Col);
  const rows = array(obj["rows"]).map((rowObj) => arrayObjectsMap(rowObj, Value3));
  const affectedRowCount = number(obj["affected_row_count"]);
  const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
  const lastInsertRowid = lastInsertRowidStr !== void 0 ? BigInt(lastInsertRowidStr) : void 0;
  return { cols, rows, affectedRowCount, lastInsertRowid };
}
function Col(obj) {
  const name = stringOpt(obj["name"]);
  const decltype = stringOpt(obj["decltype"]);
  return { name, decltype };
}
function BatchResult(obj) {
  const stepResults = /* @__PURE__ */ new Map();
  array(obj["step_results"]).forEach((value, i) => {
    if (value !== null) {
      stepResults.set(i, StmtResult(object(value)));
    }
  });
  const stepErrors = /* @__PURE__ */ new Map();
  array(obj["step_errors"]).forEach((value, i) => {
    if (value !== null) {
      stepErrors.set(i, Error2(object(value)));
    }
  });
  return { stepResults, stepErrors };
}
function CursorEntry(obj) {
  const type = string(obj["type"]);
  if (type === "step_begin") {
    const step = number(obj["step"]);
    const cols = arrayObjectsMap(obj["cols"], Col);
    return { type: "step_begin", step, cols };
  } else if (type === "step_end") {
    const affectedRowCount = number(obj["affected_row_count"]);
    const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
    const lastInsertRowid = lastInsertRowidStr !== void 0 ? BigInt(lastInsertRowidStr) : void 0;
    return { type: "step_end", affectedRowCount, lastInsertRowid };
  } else if (type === "step_error") {
    const step = number(obj["step"]);
    const error = Error2(object(obj["error"]));
    return { type: "step_error", step, error };
  } else if (type === "row") {
    const row = arrayObjectsMap(obj["row"], Value3);
    return { type: "row", row };
  } else if (type === "error") {
    const error = Error2(object(obj["error"]));
    return { type: "error", error };
  } else {
    throw new ProtoError("Unexpected type of CursorEntry");
  }
}
function DescribeResult(obj) {
  const params = arrayObjectsMap(obj["params"], DescribeParam);
  const cols = arrayObjectsMap(obj["cols"], DescribeCol);
  const isExplain = boolean(obj["is_explain"]);
  const isReadonly = boolean(obj["is_readonly"]);
  return { params, cols, isExplain, isReadonly };
}
function DescribeParam(obj) {
  const name = stringOpt(obj["name"]);
  return { name };
}
function DescribeCol(obj) {
  const name = string(obj["name"]);
  const decltype = stringOpt(obj["decltype"]);
  return { name, decltype };
}
function Value3(obj) {
  const type = string(obj["type"]);
  if (type === "null") {
    return null;
  } else if (type === "integer") {
    const value = string(obj["value"]);
    return BigInt(value);
  } else if (type === "float") {
    return number(obj["value"]);
  } else if (type === "text") {
    return string(obj["value"]);
  } else if (type === "blob") {
    return gBase64.toUint8Array(string(obj["base64"]));
  } else {
    throw new ProtoError("Unexpected type of Value");
  }
}

// node_modules/@libsql/hrana-client/lib-esm/ws/json_decode.js
function ServerMsg(obj) {
  const type = string(obj["type"]);
  if (type === "hello_ok") {
    return { type: "hello_ok" };
  } else if (type === "hello_error") {
    const error = Error2(object(obj["error"]));
    return { type: "hello_error", error };
  } else if (type === "response_ok") {
    const requestId = number(obj["request_id"]);
    const response = Response3(object(obj["response"]));
    return { type: "response_ok", requestId, response };
  } else if (type === "response_error") {
    const requestId = number(obj["request_id"]);
    const error = Error2(object(obj["error"]));
    return { type: "response_error", requestId, error };
  } else {
    throw new ProtoError("Unexpected type of ServerMsg");
  }
}
function Response3(obj) {
  const type = string(obj["type"]);
  if (type === "open_stream") {
    return { type: "open_stream" };
  } else if (type === "close_stream") {
    return { type: "close_stream" };
  } else if (type === "execute") {
    const result = StmtResult(object(obj["result"]));
    return { type: "execute", result };
  } else if (type === "batch") {
    const result = BatchResult(object(obj["result"]));
    return { type: "batch", result };
  } else if (type === "open_cursor") {
    return { type: "open_cursor" };
  } else if (type === "close_cursor") {
    return { type: "close_cursor" };
  } else if (type === "fetch_cursor") {
    const entries = arrayObjectsMap(obj["entries"], CursorEntry);
    const done = boolean(obj["done"]);
    return { type: "fetch_cursor", entries, done };
  } else if (type === "sequence") {
    return { type: "sequence" };
  } else if (type === "describe") {
    const result = DescribeResult(object(obj["result"]));
    return { type: "describe", result };
  } else if (type === "store_sql") {
    return { type: "store_sql" };
  } else if (type === "close_sql") {
    return { type: "close_sql" };
  } else if (type === "get_autocommit") {
    const isAutocommit = boolean(obj["is_autocommit"]);
    return { type: "get_autocommit", isAutocommit };
  } else {
    throw new ProtoError("Unexpected type of Response");
  }
}

// node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_decode.js
var Error3 = {
  default() {
    return { message: "", code: void 0 };
  },
  1(r, msg) {
    msg.message = r.string();
  },
  2(r, msg) {
    msg.code = r.string();
  }
};
var StmtResult2 = {
  default() {
    return {
      cols: [],
      rows: [],
      affectedRowCount: 0,
      lastInsertRowid: void 0
    };
  },
  1(r, msg) {
    msg.cols.push(r.message(Col2));
  },
  2(r, msg) {
    msg.rows.push(r.message(Row));
  },
  3(r, msg) {
    msg.affectedRowCount = Number(r.uint64());
  },
  4(r, msg) {
    msg.lastInsertRowid = r.sint64();
  }
};
var Col2 = {
  default() {
    return { name: void 0, decltype: void 0 };
  },
  1(r, msg) {
    msg.name = r.string();
  },
  2(r, msg) {
    msg.decltype = r.string();
  }
};
var Row = {
  default() {
    return [];
  },
  1(r, msg) {
    msg.push(r.message(Value4));
  }
};
var BatchResult2 = {
  default() {
    return { stepResults: /* @__PURE__ */ new Map(), stepErrors: /* @__PURE__ */ new Map() };
  },
  1(r, msg) {
    const [key, value] = r.message(BatchResultStepResult);
    msg.stepResults.set(key, value);
  },
  2(r, msg) {
    const [key, value] = r.message(BatchResultStepError);
    msg.stepErrors.set(key, value);
  }
};
var BatchResultStepResult = {
  default() {
    return [0, StmtResult2.default()];
  },
  1(r, msg) {
    msg[0] = r.uint32();
  },
  2(r, msg) {
    msg[1] = r.message(StmtResult2);
  }
};
var BatchResultStepError = {
  default() {
    return [0, Error3.default()];
  },
  1(r, msg) {
    msg[0] = r.uint32();
  },
  2(r, msg) {
    msg[1] = r.message(Error3);
  }
};
var CursorEntry2 = {
  default() {
    return { type: "none" };
  },
  1(r) {
    return r.message(StepBeginEntry);
  },
  2(r) {
    return r.message(StepEndEntry);
  },
  3(r) {
    return r.message(StepErrorEntry);
  },
  4(r) {
    return { type: "row", row: r.message(Row) };
  },
  5(r) {
    return { type: "error", error: r.message(Error3) };
  }
};
var StepBeginEntry = {
  default() {
    return { type: "step_begin", step: 0, cols: [] };
  },
  1(r, msg) {
    msg.step = r.uint32();
  },
  2(r, msg) {
    msg.cols.push(r.message(Col2));
  }
};
var StepEndEntry = {
  default() {
    return {
      type: "step_end",
      affectedRowCount: 0,
      lastInsertRowid: void 0
    };
  },
  1(r, msg) {
    msg.affectedRowCount = r.uint32();
  },
  2(r, msg) {
    msg.lastInsertRowid = r.uint64();
  }
};
var StepErrorEntry = {
  default() {
    return {
      type: "step_error",
      step: 0,
      error: Error3.default()
    };
  },
  1(r, msg) {
    msg.step = r.uint32();
  },
  2(r, msg) {
    msg.error = r.message(Error3);
  }
};
var DescribeResult2 = {
  default() {
    return {
      params: [],
      cols: [],
      isExplain: false,
      isReadonly: false
    };
  },
  1(r, msg) {
    msg.params.push(r.message(DescribeParam2));
  },
  2(r, msg) {
    msg.cols.push(r.message(DescribeCol2));
  },
  3(r, msg) {
    msg.isExplain = r.bool();
  },
  4(r, msg) {
    msg.isReadonly = r.bool();
  }
};
var DescribeParam2 = {
  default() {
    return { name: void 0 };
  },
  1(r, msg) {
    msg.name = r.string();
  }
};
var DescribeCol2 = {
  default() {
    return { name: "", decltype: void 0 };
  },
  1(r, msg) {
    msg.name = r.string();
  },
  2(r, msg) {
    msg.decltype = r.string();
  }
};
var Value4 = {
  default() {
    return void 0;
  },
  1(r) {
    return null;
  },
  2(r) {
    return r.sint64();
  },
  3(r) {
    return r.double();
  },
  4(r) {
    return r.string();
  },
  5(r) {
    return r.bytes();
  }
};

// node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_decode.js
var ServerMsg2 = {
  default() {
    return { type: "none" };
  },
  1(r) {
    return { type: "hello_ok" };
  },
  2(r) {
    return r.message(HelloErrorMsg);
  },
  3(r) {
    return r.message(ResponseOkMsg);
  },
  4(r) {
    return r.message(ResponseErrorMsg);
  }
};
var HelloErrorMsg = {
  default() {
    return { type: "hello_error", error: Error3.default() };
  },
  1(r, msg) {
    msg.error = r.message(Error3);
  }
};
var ResponseErrorMsg = {
  default() {
    return { type: "response_error", requestId: 0, error: Error3.default() };
  },
  1(r, msg) {
    msg.requestId = r.int32();
  },
  2(r, msg) {
    msg.error = r.message(Error3);
  }
};
var ResponseOkMsg = {
  default() {
    return {
      type: "response_ok",
      requestId: 0,
      response: { type: "none" }
    };
  },
  1(r, msg) {
    msg.requestId = r.int32();
  },
  2(r, msg) {
    msg.response = { type: "open_stream" };
  },
  3(r, msg) {
    msg.response = { type: "close_stream" };
  },
  4(r, msg) {
    msg.response = r.message(ExecuteResp);
  },
  5(r, msg) {
    msg.response = r.message(BatchResp);
  },
  6(r, msg) {
    msg.response = { type: "open_cursor" };
  },
  7(r, msg) {
    msg.response = { type: "close_cursor" };
  },
  8(r, msg) {
    msg.response = r.message(FetchCursorResp);
  },
  9(r, msg) {
    msg.response = { type: "sequence" };
  },
  10(r, msg) {
    msg.response = r.message(DescribeResp);
  },
  11(r, msg) {
    msg.response = { type: "store_sql" };
  },
  12(r, msg) {
    msg.response = { type: "close_sql" };
  },
  13(r, msg) {
    msg.response = r.message(GetAutocommitResp);
  }
};
var ExecuteResp = {
  default() {
    return { type: "execute", result: StmtResult2.default() };
  },
  1(r, msg) {
    msg.result = r.message(StmtResult2);
  }
};
var BatchResp = {
  default() {
    return { type: "batch", result: BatchResult2.default() };
  },
  1(r, msg) {
    msg.result = r.message(BatchResult2);
  }
};
var FetchCursorResp = {
  default() {
    return { type: "fetch_cursor", entries: [], done: false };
  },
  1(r, msg) {
    msg.entries.push(r.message(CursorEntry2));
  },
  2(r, msg) {
    msg.done = r.bool();
  }
};
var DescribeResp = {
  default() {
    return { type: "describe", result: DescribeResult2.default() };
  },
  1(r, msg) {
    msg.result = r.message(DescribeResult2);
  }
};
var GetAutocommitResp = {
  default() {
    return { type: "get_autocommit", isAutocommit: false };
  },
  1(r, msg) {
    msg.isAutocommit = r.bool();
  }
};

// node_modules/@libsql/hrana-client/lib-esm/ws/client.js
var subprotocolsV2 = /* @__PURE__ */ new Map([
  ["hrana2", { version: 2, encoding: "json" }],
  ["hrana1", { version: 1, encoding: "json" }]
]);
var subprotocolsV3 = /* @__PURE__ */ new Map([
  ["hrana3-protobuf", { version: 3, encoding: "protobuf" }],
  ["hrana3", { version: 3, encoding: "json" }],
  ["hrana2", { version: 2, encoding: "json" }],
  ["hrana1", { version: 1, encoding: "json" }]
]);
var WsClient = class extends Client {
  #socket;
  // List of callbacks that we queue until the socket transitions from the CONNECTING to the OPEN state.
  #openCallbacks;
  // Have we already transitioned from CONNECTING to OPEN and fired the callbacks in #openCallbacks?
  #opened;
  // Stores the error that caused us to close the client (and the socket). If we are not closed, this is
  // `undefined`.
  #closed;
  // Have we received a response to our "hello" from the server?
  #recvdHello;
  // Subprotocol negotiated with the server. It is only available after the socket transitions to the OPEN
  // state.
  #subprotocol;
  // Has the `getVersion()` function been called? This is only used to validate that the API is used
  // correctly.
  #getVersionCalled;
  // A map from request id to the responses that we expect to receive from the server.
  #responseMap;
  // An allocator of request ids.
  #requestIdAlloc;
  // An allocator of stream ids.
  /** @private */
  _streamIdAlloc;
  // An allocator of cursor ids.
  /** @private */
  _cursorIdAlloc;
  // An allocator of SQL text ids.
  #sqlIdAlloc;
  /** @private */
  constructor(socket, jwt) {
    super();
    this.#socket = socket;
    this.#openCallbacks = [];
    this.#opened = false;
    this.#closed = void 0;
    this.#recvdHello = false;
    this.#subprotocol = void 0;
    this.#getVersionCalled = false;
    this.#responseMap = /* @__PURE__ */ new Map();
    this.#requestIdAlloc = new IdAlloc();
    this._streamIdAlloc = new IdAlloc();
    this._cursorIdAlloc = new IdAlloc();
    this.#sqlIdAlloc = new IdAlloc();
    this.#socket.binaryType = "arraybuffer";
    this.#socket.addEventListener("open", () => this.#onSocketOpen());
    this.#socket.addEventListener("close", (event) => this.#onSocketClose(event));
    this.#socket.addEventListener("error", (event) => this.#onSocketError(event));
    this.#socket.addEventListener("message", (event) => this.#onSocketMessage(event));
    this.#send({ type: "hello", jwt });
  }
  // Send (or enqueue to send) a message to the server.
  #send(msg) {
    if (this.#closed !== void 0) {
      throw new InternalError("Trying to send a message on a closed client");
    }
    if (this.#opened) {
      this.#sendToSocket(msg);
    } else {
      const openCallback = () => this.#sendToSocket(msg);
      const errorCallback = () => void 0;
      this.#openCallbacks.push({ openCallback, errorCallback });
    }
  }
  // The socket transitioned from CONNECTING to OPEN
  #onSocketOpen() {
    const protocol = this.#socket.protocol;
    if (protocol === void 0) {
      this.#setClosed(new ClientError("The `WebSocket.protocol` property is undefined. This most likely means that the WebSocket implementation provided by the environment is broken. If you are using Miniflare 2, please update to Miniflare 3, which fixes this problem."));
      return;
    } else if (protocol === "") {
      this.#subprotocol = { version: 1, encoding: "json" };
    } else {
      this.#subprotocol = subprotocolsV3.get(protocol);
      if (this.#subprotocol === void 0) {
        this.#setClosed(new ProtoError(`Unrecognized WebSocket subprotocol: ${JSON.stringify(protocol)}`));
        return;
      }
    }
    for (const callbacks of this.#openCallbacks) {
      callbacks.openCallback();
    }
    this.#openCallbacks.length = 0;
    this.#opened = true;
  }
  #sendToSocket(msg) {
    const encoding = this.#subprotocol.encoding;
    if (encoding === "json") {
      const jsonMsg = writeJsonObject(msg, ClientMsg);
      this.#socket.send(jsonMsg);
    } else if (encoding === "protobuf") {
      const protobufMsg = writeProtobufMessage(msg, ClientMsg2);
      this.#socket.send(protobufMsg);
    } else {
      throw impossible(encoding, "Impossible encoding");
    }
  }
  /** Get the protocol version negotiated with the server, possibly waiting until the socket is open. */
  getVersion() {
    return new Promise((versionCallback, errorCallback) => {
      this.#getVersionCalled = true;
      if (this.#closed !== void 0) {
        errorCallback(this.#closed);
      } else if (!this.#opened) {
        const openCallback = () => versionCallback(this.#subprotocol.version);
        this.#openCallbacks.push({ openCallback, errorCallback });
      } else {
        versionCallback(this.#subprotocol.version);
      }
    });
  }
  // Make sure that the negotiated version is at least `minVersion`.
  /** @private */
  _ensureVersion(minVersion, feature) {
    if (this.#subprotocol === void 0 || !this.#getVersionCalled) {
      throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the version supported by the WebSocket server is not yet known. Use Client.getVersion() to wait until the version is available.`);
    } else if (this.#subprotocol.version < minVersion) {
      throw new ProtocolVersionError(`${feature} is supported on protocol version ${minVersion} and higher, but the WebSocket server only supports version ${this.#subprotocol.version}`);
    }
  }
  // Send a request to the server and invoke a callback when we get the response.
  /** @private */
  _sendRequest(request, callbacks) {
    if (this.#closed !== void 0) {
      callbacks.errorCallback(new ClosedError("Client is closed", this.#closed));
      return;
    }
    const requestId = this.#requestIdAlloc.alloc();
    this.#responseMap.set(requestId, { ...callbacks, type: request.type });
    this.#send({ type: "request", requestId, request });
  }
  // The socket encountered an error.
  #onSocketError(event) {
    const eventMessage = event.message;
    const message = eventMessage ?? "WebSocket was closed due to an error";
    this.#setClosed(new WebSocketError(message));
  }
  // The socket was closed.
  #onSocketClose(event) {
    let message = `WebSocket was closed with code ${event.code}`;
    if (event.reason) {
      message += `: ${event.reason}`;
    }
    this.#setClosed(new WebSocketError(message));
  }
  // Close the client with the given error.
  #setClosed(error) {
    if (this.#closed !== void 0) {
      return;
    }
    this.#closed = error;
    for (const callbacks of this.#openCallbacks) {
      callbacks.errorCallback(error);
    }
    this.#openCallbacks.length = 0;
    for (const [requestId, responseState] of this.#responseMap.entries()) {
      responseState.errorCallback(error);
      this.#requestIdAlloc.free(requestId);
    }
    this.#responseMap.clear();
    this.#socket.close();
  }
  // We received a message from the socket.
  #onSocketMessage(event) {
    if (this.#closed !== void 0) {
      return;
    }
    try {
      let msg;
      const encoding = this.#subprotocol.encoding;
      if (encoding === "json") {
        if (typeof event.data !== "string") {
          this.#socket.close(3003, "Only text messages are accepted with JSON encoding");
          this.#setClosed(new ProtoError("Received non-text message from server with JSON encoding"));
          return;
        }
        msg = readJsonObject(JSON.parse(event.data), ServerMsg);
      } else if (encoding === "protobuf") {
        if (!(event.data instanceof ArrayBuffer)) {
          this.#socket.close(3003, "Only binary messages are accepted with Protobuf encoding");
          this.#setClosed(new ProtoError("Received non-binary message from server with Protobuf encoding"));
          return;
        }
        msg = readProtobufMessage(new Uint8Array(event.data), ServerMsg2);
      } else {
        throw impossible(encoding, "Impossible encoding");
      }
      this.#handleMsg(msg);
    } catch (e) {
      this.#socket.close(3007, "Could not handle message");
      this.#setClosed(e);
    }
  }
  // Handle a message from the server.
  #handleMsg(msg) {
    if (msg.type === "none") {
      throw new ProtoError("Received an unrecognized ServerMsg");
    } else if (msg.type === "hello_ok" || msg.type === "hello_error") {
      if (this.#recvdHello) {
        throw new ProtoError("Received a duplicated hello response");
      }
      this.#recvdHello = true;
      if (msg.type === "hello_error") {
        throw errorFromProto(msg.error);
      }
      return;
    } else if (!this.#recvdHello) {
      throw new ProtoError("Received a non-hello message before a hello response");
    }
    if (msg.type === "response_ok") {
      const requestId = msg.requestId;
      const responseState = this.#responseMap.get(requestId);
      this.#responseMap.delete(requestId);
      if (responseState === void 0) {
        throw new ProtoError("Received unexpected OK response");
      }
      this.#requestIdAlloc.free(requestId);
      try {
        if (responseState.type !== msg.response.type) {
          console.dir({ responseState, msg });
          throw new ProtoError("Received unexpected type of response");
        }
        responseState.responseCallback(msg.response);
      } catch (e) {
        responseState.errorCallback(e);
        throw e;
      }
    } else if (msg.type === "response_error") {
      const requestId = msg.requestId;
      const responseState = this.#responseMap.get(requestId);
      this.#responseMap.delete(requestId);
      if (responseState === void 0) {
        throw new ProtoError("Received unexpected error response");
      }
      this.#requestIdAlloc.free(requestId);
      responseState.errorCallback(errorFromProto(msg.error));
    } else {
      throw impossible(msg, "Impossible ServerMsg type");
    }
  }
  /** Open a {@link WsStream}, a stream for executing SQL statements. */
  openStream() {
    return WsStream.open(this);
  }
  /** Cache a SQL text on the server. This requires protocol version 2 or higher. */
  storeSql(sql) {
    this._ensureVersion(2, "storeSql()");
    const sqlId = this.#sqlIdAlloc.alloc();
    const sqlObj = new Sql(this, sqlId);
    const responseCallback = () => void 0;
    const errorCallback = (e) => sqlObj._setClosed(e);
    const request = { type: "store_sql", sqlId, sql };
    this._sendRequest(request, { responseCallback, errorCallback });
    return sqlObj;
  }
  /** @private */
  _closeSql(sqlId) {
    if (this.#closed !== void 0) {
      return;
    }
    const responseCallback = () => this.#sqlIdAlloc.free(sqlId);
    const errorCallback = (e) => this.#setClosed(e);
    const request = { type: "close_sql", sqlId };
    this._sendRequest(request, { responseCallback, errorCallback });
  }
  /** Close the client and the WebSocket. */
  close() {
    this.#setClosed(new ClientError("Client was manually closed"));
  }
  /** True if the client is closed. */
  get closed() {
    return this.#closed !== void 0;
  }
};

// node_modules/@libsql/isomorphic-fetch/node.js
var _Request = Request;
var _Headers = Headers;
var _fetch = fetch;

// node_modules/@libsql/hrana-client/lib-esm/queue_microtask.js
var _queueMicrotask;
if (typeof queueMicrotask !== "undefined") {
  _queueMicrotask = queueMicrotask;
} else {
  const resolved = Promise.resolve();
  _queueMicrotask = (callback) => {
    resolved.then(callback);
  };
}

// node_modules/@libsql/hrana-client/lib-esm/byte_queue.js
var ByteQueue = class {
  #array;
  #shiftPos;
  #pushPos;
  constructor(initialCap) {
    this.#array = new Uint8Array(new ArrayBuffer(initialCap));
    this.#shiftPos = 0;
    this.#pushPos = 0;
  }
  get length() {
    return this.#pushPos - this.#shiftPos;
  }
  data() {
    return this.#array.slice(this.#shiftPos, this.#pushPos);
  }
  push(chunk) {
    this.#ensurePush(chunk.byteLength);
    this.#array.set(chunk, this.#pushPos);
    this.#pushPos += chunk.byteLength;
  }
  #ensurePush(pushLength) {
    if (this.#pushPos + pushLength <= this.#array.byteLength) {
      return;
    }
    const filledLength = this.#pushPos - this.#shiftPos;
    if (filledLength + pushLength <= this.#array.byteLength && 2 * this.#pushPos >= this.#array.byteLength) {
      this.#array.copyWithin(0, this.#shiftPos, this.#pushPos);
    } else {
      let newCap = this.#array.byteLength;
      do {
        newCap *= 2;
      } while (filledLength + pushLength > newCap);
      const newArray = new Uint8Array(new ArrayBuffer(newCap));
      newArray.set(this.#array.slice(this.#shiftPos, this.#pushPos), 0);
      this.#array = newArray;
    }
    this.#pushPos = filledLength;
    this.#shiftPos = 0;
  }
  shift(length) {
    this.#shiftPos += length;
  }
};

// node_modules/@libsql/hrana-client/lib-esm/http/json_decode.js
function PipelineRespBody(obj) {
  const baton = stringOpt(obj["baton"]);
  const baseUrl = stringOpt(obj["base_url"]);
  const results = arrayObjectsMap(obj["results"], StreamResult);
  return { baton, baseUrl, results };
}
function StreamResult(obj) {
  const type = string(obj["type"]);
  if (type === "ok") {
    const response = StreamResponse(object(obj["response"]));
    return { type: "ok", response };
  } else if (type === "error") {
    const error = Error2(object(obj["error"]));
    return { type: "error", error };
  } else {
    throw new ProtoError("Unexpected type of StreamResult");
  }
}
function StreamResponse(obj) {
  const type = string(obj["type"]);
  if (type === "close") {
    return { type: "close" };
  } else if (type === "execute") {
    const result = StmtResult(object(obj["result"]));
    return { type: "execute", result };
  } else if (type === "batch") {
    const result = BatchResult(object(obj["result"]));
    return { type: "batch", result };
  } else if (type === "sequence") {
    return { type: "sequence" };
  } else if (type === "describe") {
    const result = DescribeResult(object(obj["result"]));
    return { type: "describe", result };
  } else if (type === "store_sql") {
    return { type: "store_sql" };
  } else if (type === "close_sql") {
    return { type: "close_sql" };
  } else if (type === "get_autocommit") {
    const isAutocommit = boolean(obj["is_autocommit"]);
    return { type: "get_autocommit", isAutocommit };
  } else {
    throw new ProtoError("Unexpected type of StreamResponse");
  }
}
function CursorRespBody(obj) {
  const baton = stringOpt(obj["baton"]);
  const baseUrl = stringOpt(obj["base_url"]);
  return { baton, baseUrl };
}

// node_modules/@libsql/hrana-client/lib-esm/http/protobuf_decode.js
var PipelineRespBody2 = {
  default() {
    return { baton: void 0, baseUrl: void 0, results: [] };
  },
  1(r, msg) {
    msg.baton = r.string();
  },
  2(r, msg) {
    msg.baseUrl = r.string();
  },
  3(r, msg) {
    msg.results.push(r.message(StreamResult2));
  }
};
var StreamResult2 = {
  default() {
    return { type: "none" };
  },
  1(r) {
    return { type: "ok", response: r.message(StreamResponse2) };
  },
  2(r) {
    return { type: "error", error: r.message(Error3) };
  }
};
var StreamResponse2 = {
  default() {
    return { type: "none" };
  },
  1(r) {
    return { type: "close" };
  },
  2(r) {
    return r.message(ExecuteStreamResp);
  },
  3(r) {
    return r.message(BatchStreamResp);
  },
  4(r) {
    return { type: "sequence" };
  },
  5(r) {
    return r.message(DescribeStreamResp);
  },
  6(r) {
    return { type: "store_sql" };
  },
  7(r) {
    return { type: "close_sql" };
  },
  8(r) {
    return r.message(GetAutocommitStreamResp);
  }
};
var ExecuteStreamResp = {
  default() {
    return { type: "execute", result: StmtResult2.default() };
  },
  1(r, msg) {
    msg.result = r.message(StmtResult2);
  }
};
var BatchStreamResp = {
  default() {
    return { type: "batch", result: BatchResult2.default() };
  },
  1(r, msg) {
    msg.result = r.message(BatchResult2);
  }
};
var DescribeStreamResp = {
  default() {
    return { type: "describe", result: DescribeResult2.default() };
  },
  1(r, msg) {
    msg.result = r.message(DescribeResult2);
  }
};
var GetAutocommitStreamResp = {
  default() {
    return { type: "get_autocommit", isAutocommit: false };
  },
  1(r, msg) {
    msg.isAutocommit = r.bool();
  }
};
var CursorRespBody2 = {
  default() {
    return { baton: void 0, baseUrl: void 0 };
  },
  1(r, msg) {
    msg.baton = r.string();
  },
  2(r, msg) {
    msg.baseUrl = r.string();
  }
};

// node_modules/@libsql/hrana-client/lib-esm/http/cursor.js
var HttpCursor = class extends Cursor {
  #stream;
  #encoding;
  #reader;
  #queue;
  #closed;
  #done;
  /** @private */
  constructor(stream, encoding) {
    super();
    this.#stream = stream;
    this.#encoding = encoding;
    this.#reader = void 0;
    this.#queue = new ByteQueue(16 * 1024);
    this.#closed = void 0;
    this.#done = false;
  }
  async open(response) {
    if (response.body === null) {
      throw new ProtoError("No response body for cursor request");
    }
    this.#reader = response.body.getReader();
    const respBody = await this.#nextItem(CursorRespBody, CursorRespBody2);
    if (respBody === void 0) {
      throw new ProtoError("Empty response to cursor request");
    }
    return respBody;
  }
  /** Fetch the next entry from the cursor. */
  next() {
    return this.#nextItem(CursorEntry, CursorEntry2);
  }
  /** Close the cursor. */
  close() {
    this._setClosed(new ClientError("Cursor was manually closed"));
  }
  /** @private */
  _setClosed(error) {
    if (this.#closed !== void 0) {
      return;
    }
    this.#closed = error;
    this.#stream._cursorClosed(this);
    if (this.#reader !== void 0) {
      this.#reader.cancel();
    }
  }
  /** True if the cursor is closed. */
  get closed() {
    return this.#closed !== void 0;
  }
  async #nextItem(jsonFun, protobufDef) {
    for (; ; ) {
      if (this.#done) {
        return void 0;
      } else if (this.#closed !== void 0) {
        throw new ClosedError("Cursor is closed", this.#closed);
      }
      if (this.#encoding === "json") {
        const jsonData = this.#parseItemJson();
        if (jsonData !== void 0) {
          const jsonText = new TextDecoder().decode(jsonData);
          const jsonValue = JSON.parse(jsonText);
          return readJsonObject(jsonValue, jsonFun);
        }
      } else if (this.#encoding === "protobuf") {
        const protobufData = this.#parseItemProtobuf();
        if (protobufData !== void 0) {
          return readProtobufMessage(protobufData, protobufDef);
        }
      } else {
        throw impossible(this.#encoding, "Impossible encoding");
      }
      if (this.#reader === void 0) {
        throw new InternalError("Attempted to read from HTTP cursor before it was opened");
      }
      const { value, done } = await this.#reader.read();
      if (done && this.#queue.length === 0) {
        this.#done = true;
      } else if (done) {
        throw new ProtoError("Unexpected end of cursor stream");
      } else {
        this.#queue.push(value);
      }
    }
  }
  #parseItemJson() {
    const data = this.#queue.data();
    const newlineByte = 10;
    const newlinePos = data.indexOf(newlineByte);
    if (newlinePos < 0) {
      return void 0;
    }
    const jsonData = data.slice(0, newlinePos);
    this.#queue.shift(newlinePos + 1);
    return jsonData;
  }
  #parseItemProtobuf() {
    const data = this.#queue.data();
    let varintValue = 0;
    let varintLength = 0;
    for (; ; ) {
      if (varintLength >= data.byteLength) {
        return void 0;
      }
      const byte = data[varintLength];
      varintValue |= (byte & 127) << 7 * varintLength;
      varintLength += 1;
      if (!(byte & 128)) {
        break;
      }
    }
    if (data.byteLength < varintLength + varintValue) {
      return void 0;
    }
    const protobufData = data.slice(varintLength, varintLength + varintValue);
    this.#queue.shift(varintLength + varintValue);
    return protobufData;
  }
};

// node_modules/@libsql/hrana-client/lib-esm/http/json_encode.js
function PipelineReqBody(w, msg) {
  if (msg.baton !== void 0) {
    w.string("baton", msg.baton);
  }
  w.arrayObjects("requests", msg.requests, StreamRequest);
}
function StreamRequest(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "close") {
  } else if (msg.type === "execute") {
    w.object("stmt", msg.stmt, Stmt2);
  } else if (msg.type === "batch") {
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "sequence") {
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "describe") {
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "store_sql") {
    w.number("sql_id", msg.sqlId);
    w.string("sql", msg.sql);
  } else if (msg.type === "close_sql") {
    w.number("sql_id", msg.sqlId);
  } else if (msg.type === "get_autocommit") {
  } else {
    throw impossible(msg, "Impossible type of StreamRequest");
  }
}
function CursorReqBody(w, msg) {
  if (msg.baton !== void 0) {
    w.string("baton", msg.baton);
  }
  w.object("batch", msg.batch, Batch2);
}

// node_modules/@libsql/hrana-client/lib-esm/http/protobuf_encode.js
function PipelineReqBody2(w, msg) {
  if (msg.baton !== void 0) {
    w.string(1, msg.baton);
  }
  for (const req of msg.requests) {
    w.message(2, req, StreamRequest2);
  }
}
function StreamRequest2(w, msg) {
  if (msg.type === "close") {
    w.message(1, msg, CloseStreamReq2);
  } else if (msg.type === "execute") {
    w.message(2, msg, ExecuteStreamReq);
  } else if (msg.type === "batch") {
    w.message(3, msg, BatchStreamReq);
  } else if (msg.type === "sequence") {
    w.message(4, msg, SequenceStreamReq);
  } else if (msg.type === "describe") {
    w.message(5, msg, DescribeStreamReq);
  } else if (msg.type === "store_sql") {
    w.message(6, msg, StoreSqlStreamReq);
  } else if (msg.type === "close_sql") {
    w.message(7, msg, CloseSqlStreamReq);
  } else if (msg.type === "get_autocommit") {
    w.message(8, msg, GetAutocommitStreamReq);
  } else {
    throw impossible(msg, "Impossible type of StreamRequest");
  }
}
function CloseStreamReq2(_w, _msg) {
}
function ExecuteStreamReq(w, msg) {
  w.message(1, msg.stmt, Stmt3);
}
function BatchStreamReq(w, msg) {
  w.message(1, msg.batch, Batch3);
}
function SequenceStreamReq(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
}
function DescribeStreamReq(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
}
function StoreSqlStreamReq(w, msg) {
  w.int32(1, msg.sqlId);
  w.string(2, msg.sql);
}
function CloseSqlStreamReq(w, msg) {
  w.int32(1, msg.sqlId);
}
function GetAutocommitStreamReq(_w, _msg) {
}
function CursorReqBody2(w, msg) {
  if (msg.baton !== void 0) {
    w.string(1, msg.baton);
  }
  w.message(2, msg.batch, Batch3);
}

// node_modules/@libsql/hrana-client/lib-esm/http/stream.js
var HttpStream = class extends Stream {
  #client;
  #baseUrl;
  #jwt;
  #fetch;
  #baton;
  #queue;
  #flushing;
  #cursor;
  #closing;
  #closeQueued;
  #closed;
  #sqlIdAlloc;
  /** @private */
  constructor(client2, baseUrl, jwt, customFetch) {
    super(client2.intMode);
    this.#client = client2;
    this.#baseUrl = baseUrl.toString();
    this.#jwt = jwt;
    this.#fetch = customFetch;
    this.#baton = void 0;
    this.#queue = new Queue();
    this.#flushing = false;
    this.#closing = false;
    this.#closeQueued = false;
    this.#closed = void 0;
    this.#sqlIdAlloc = new IdAlloc();
  }
  /** Get the {@link HttpClient} object that this stream belongs to. */
  client() {
    return this.#client;
  }
  /** @private */
  _sqlOwner() {
    return this;
  }
  /** Cache a SQL text on the server. */
  storeSql(sql) {
    const sqlId = this.#sqlIdAlloc.alloc();
    this.#sendStreamRequest({ type: "store_sql", sqlId, sql }).then(() => void 0, (error) => this._setClosed(error));
    return new Sql(this, sqlId);
  }
  /** @private */
  _closeSql(sqlId) {
    if (this.#closed !== void 0) {
      return;
    }
    this.#sendStreamRequest({ type: "close_sql", sqlId }).then(() => this.#sqlIdAlloc.free(sqlId), (error) => this._setClosed(error));
  }
  /** @private */
  _execute(stmt) {
    return this.#sendStreamRequest({ type: "execute", stmt }).then((response) => {
      return response.result;
    });
  }
  /** @private */
  _batch(batch) {
    return this.#sendStreamRequest({ type: "batch", batch }).then((response) => {
      return response.result;
    });
  }
  /** @private */
  _describe(protoSql) {
    return this.#sendStreamRequest({
      type: "describe",
      sql: protoSql.sql,
      sqlId: protoSql.sqlId
    }).then((response) => {
      return response.result;
    });
  }
  /** @private */
  _sequence(protoSql) {
    return this.#sendStreamRequest({
      type: "sequence",
      sql: protoSql.sql,
      sqlId: protoSql.sqlId
    }).then((_response) => {
      return void 0;
    });
  }
  /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
   * explicit transaction). This requires protocol version 3 or higher.
   */
  getAutocommit() {
    this.#client._ensureVersion(3, "getAutocommit()");
    return this.#sendStreamRequest({
      type: "get_autocommit"
    }).then((response) => {
      return response.isAutocommit;
    });
  }
  #sendStreamRequest(request) {
    return new Promise((responseCallback, errorCallback) => {
      this.#pushToQueue({ type: "pipeline", request, responseCallback, errorCallback });
    });
  }
  /** @private */
  _openCursor(batch) {
    return new Promise((cursorCallback, errorCallback) => {
      this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
    });
  }
  /** @private */
  _cursorClosed(cursor) {
    if (cursor !== this.#cursor) {
      throw new InternalError("Cursor was closed, but it was not associated with the stream");
    }
    this.#cursor = void 0;
    _queueMicrotask(() => this.#flushQueue());
  }
  /** Immediately close the stream. */
  close() {
    this._setClosed(new ClientError("Stream was manually closed"));
  }
  /** Gracefully close the stream. */
  closeGracefully() {
    this.#closing = true;
    _queueMicrotask(() => this.#flushQueue());
  }
  /** True if the stream is closed. */
  get closed() {
    return this.#closed !== void 0 || this.#closing;
  }
  /** @private */
  _setClosed(error) {
    if (this.#closed !== void 0) {
      return;
    }
    this.#closed = error;
    if (this.#cursor !== void 0) {
      this.#cursor._setClosed(error);
    }
    this.#client._streamClosed(this);
    for (; ; ) {
      const entry = this.#queue.shift();
      if (entry !== void 0) {
        entry.errorCallback(error);
      } else {
        break;
      }
    }
    if ((this.#baton !== void 0 || this.#flushing) && !this.#closeQueued) {
      this.#queue.push({
        type: "pipeline",
        request: { type: "close" },
        responseCallback: () => void 0,
        errorCallback: () => void 0
      });
      this.#closeQueued = true;
      _queueMicrotask(() => this.#flushQueue());
    }
  }
  #pushToQueue(entry) {
    if (this.#closed !== void 0) {
      throw new ClosedError("Stream is closed", this.#closed);
    } else if (this.#closing) {
      throw new ClosedError("Stream is closing", void 0);
    } else {
      this.#queue.push(entry);
      _queueMicrotask(() => this.#flushQueue());
    }
  }
  #flushQueue() {
    if (this.#flushing || this.#cursor !== void 0) {
      return;
    }
    if (this.#closing && this.#queue.length === 0) {
      this._setClosed(new ClientError("Stream was gracefully closed"));
      return;
    }
    const endpoint = this.#client._endpoint;
    if (endpoint === void 0) {
      this.#client._endpointPromise.then(() => this.#flushQueue(), (error) => this._setClosed(error));
      return;
    }
    const firstEntry = this.#queue.shift();
    if (firstEntry === void 0) {
      return;
    } else if (firstEntry.type === "pipeline") {
      const pipeline = [firstEntry];
      for (; ; ) {
        const entry = this.#queue.first();
        if (entry !== void 0 && entry.type === "pipeline") {
          pipeline.push(entry);
          this.#queue.shift();
        } else if (entry === void 0 && this.#closing && !this.#closeQueued) {
          pipeline.push({
            type: "pipeline",
            request: { type: "close" },
            responseCallback: () => void 0,
            errorCallback: () => void 0
          });
          this.#closeQueued = true;
          break;
        } else {
          break;
        }
      }
      this.#flushPipeline(endpoint, pipeline);
    } else if (firstEntry.type === "cursor") {
      this.#flushCursor(endpoint, firstEntry);
    } else {
      throw impossible(firstEntry, "Impossible type of QueueEntry");
    }
  }
  #flushPipeline(endpoint, pipeline) {
    this.#flush(() => this.#createPipelineRequest(pipeline, endpoint), (resp) => decodePipelineResponse(resp, endpoint.encoding), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (respBody) => handlePipelineResponse(pipeline, respBody), (error) => pipeline.forEach((entry) => entry.errorCallback(error)));
  }
  #flushCursor(endpoint, entry) {
    const cursor = new HttpCursor(this, endpoint.encoding);
    this.#cursor = cursor;
    this.#flush(() => this.#createCursorRequest(entry, endpoint), (resp) => cursor.open(resp), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (_respBody) => entry.cursorCallback(cursor), (error) => entry.errorCallback(error));
  }
  #flush(createRequest, decodeResponse, getBaton, getBaseUrl2, handleResponse, handleError) {
    let promise;
    try {
      const request = createRequest();
      const fetch2 = this.#fetch;
      promise = fetch2(request);
    } catch (error) {
      promise = Promise.reject(error);
    }
    this.#flushing = true;
    promise.then((resp) => {
      if (!resp.ok) {
        return errorFromResponse(resp).then((error) => {
          throw error;
        });
      }
      return decodeResponse(resp);
    }).then((r) => {
      this.#baton = getBaton(r);
      this.#baseUrl = getBaseUrl2(r) ?? this.#baseUrl;
      handleResponse(r);
    }).catch((error) => {
      this._setClosed(error);
      handleError(error);
    }).finally(() => {
      this.#flushing = false;
      this.#flushQueue();
    });
  }
  #createPipelineRequest(pipeline, endpoint) {
    return this.#createRequest(new URL(endpoint.pipelinePath, this.#baseUrl), {
      baton: this.#baton,
      requests: pipeline.map((entry) => entry.request)
    }, endpoint.encoding, PipelineReqBody, PipelineReqBody2);
  }
  #createCursorRequest(entry, endpoint) {
    if (endpoint.cursorPath === void 0) {
      throw new ProtocolVersionError(`Cursors are supported only on protocol version 3 and higher, but the HTTP server only supports version ${endpoint.version}.`);
    }
    return this.#createRequest(new URL(endpoint.cursorPath, this.#baseUrl), {
      baton: this.#baton,
      batch: entry.batch
    }, endpoint.encoding, CursorReqBody, CursorReqBody2);
  }
  #createRequest(url2, reqBody, encoding, jsonFun, protobufFun) {
    let bodyData;
    let contentType;
    if (encoding === "json") {
      bodyData = writeJsonObject(reqBody, jsonFun);
      contentType = "application/json";
    } else if (encoding === "protobuf") {
      bodyData = writeProtobufMessage(reqBody, protobufFun);
      contentType = "application/x-protobuf";
    } else {
      throw impossible(encoding, "Impossible encoding");
    }
    const headers = new _Headers();
    headers.set("content-type", contentType);
    if (this.#jwt !== void 0) {
      headers.set("authorization", `Bearer ${this.#jwt}`);
    }
    return new _Request(url2.toString(), { method: "POST", headers, body: bodyData });
  }
};
function handlePipelineResponse(pipeline, respBody) {
  if (respBody.results.length !== pipeline.length) {
    throw new ProtoError("Server returned unexpected number of pipeline results");
  }
  for (let i = 0; i < pipeline.length; ++i) {
    const result = respBody.results[i];
    const entry = pipeline[i];
    if (result.type === "ok") {
      if (result.response.type !== entry.request.type) {
        throw new ProtoError("Received unexpected type of response");
      }
      entry.responseCallback(result.response);
    } else if (result.type === "error") {
      entry.errorCallback(errorFromProto(result.error));
    } else if (result.type === "none") {
      throw new ProtoError("Received unrecognized type of StreamResult");
    } else {
      throw impossible(result, "Received impossible type of StreamResult");
    }
  }
}
async function decodePipelineResponse(resp, encoding) {
  if (encoding === "json") {
    const respJson = await resp.json();
    return readJsonObject(respJson, PipelineRespBody);
  }
  if (encoding === "protobuf") {
    const respData = await resp.arrayBuffer();
    return readProtobufMessage(new Uint8Array(respData), PipelineRespBody2);
  }
  await resp.body?.cancel();
  throw impossible(encoding, "Impossible encoding");
}
async function errorFromResponse(resp) {
  const respType = resp.headers.get("content-type") ?? "text/plain";
  let message = `Server returned HTTP status ${resp.status}`;
  if (respType === "application/json") {
    const respBody = await resp.json();
    if ("message" in respBody) {
      return errorFromProto(respBody);
    }
    return new HttpServerError(message, resp.status);
  }
  if (respType === "text/plain") {
    const respBody = (await resp.text()).trim();
    if (respBody !== "") {
      message += `: ${respBody}`;
    }
    return new HttpServerError(message, resp.status);
  }
  await resp.body?.cancel();
  return new HttpServerError(message, resp.status);
}

// node_modules/@libsql/hrana-client/lib-esm/http/client.js
var checkEndpoints = [
  {
    versionPath: "v3-protobuf",
    pipelinePath: "v3-protobuf/pipeline",
    cursorPath: "v3-protobuf/cursor",
    version: 3,
    encoding: "protobuf"
  }
  /*
  {
      versionPath: "v3",
      pipelinePath: "v3/pipeline",
      cursorPath: "v3/cursor",
      version: 3,
      encoding: "json",
  },
  */
];
var fallbackEndpoint = {
  versionPath: "v2",
  pipelinePath: "v2/pipeline",
  cursorPath: void 0,
  version: 2,
  encoding: "json"
};
var HttpClient = class extends Client {
  #url;
  #jwt;
  #fetch;
  #closed;
  #streams;
  /** @private */
  _endpointPromise;
  /** @private */
  _endpoint;
  /** @private */
  constructor(url2, jwt, customFetch, protocolVersion = 2) {
    super();
    this.#url = url2;
    this.#jwt = jwt;
    this.#fetch = customFetch ?? _fetch;
    this.#closed = void 0;
    this.#streams = /* @__PURE__ */ new Set();
    if (protocolVersion == 3) {
      this._endpointPromise = findEndpoint(this.#fetch, this.#url);
      this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error) => this.#setClosed(error));
    } else {
      this._endpointPromise = Promise.resolve(fallbackEndpoint);
      this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error) => this.#setClosed(error));
    }
  }
  /** Get the protocol version supported by the server. */
  async getVersion() {
    if (this._endpoint !== void 0) {
      return this._endpoint.version;
    }
    return (await this._endpointPromise).version;
  }
  // Make sure that the negotiated version is at least `minVersion`.
  /** @private */
  _ensureVersion(minVersion, feature) {
    if (minVersion <= fallbackEndpoint.version) {
      return;
    } else if (this._endpoint === void 0) {
      throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the version supported by the HTTP server is not yet known. Use Client.getVersion() to wait until the version is available.`);
    } else if (this._endpoint.version < minVersion) {
      throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the HTTP server only supports version ${this._endpoint.version}.`);
    }
  }
  /** Open a {@link HttpStream}, a stream for executing SQL statements. */
  openStream() {
    if (this.#closed !== void 0) {
      throw new ClosedError("Client is closed", this.#closed);
    }
    const stream = new HttpStream(this, this.#url, this.#jwt, this.#fetch);
    this.#streams.add(stream);
    return stream;
  }
  /** @private */
  _streamClosed(stream) {
    this.#streams.delete(stream);
  }
  /** Close the client and all its streams. */
  close() {
    this.#setClosed(new ClientError("Client was manually closed"));
  }
  /** True if the client is closed. */
  get closed() {
    return this.#closed !== void 0;
  }
  #setClosed(error) {
    if (this.#closed !== void 0) {
      return;
    }
    this.#closed = error;
    for (const stream of Array.from(this.#streams)) {
      stream._setClosed(new ClosedError("Client was closed", error));
    }
  }
};
async function findEndpoint(customFetch, clientUrl) {
  const fetch2 = customFetch;
  for (const endpoint of checkEndpoints) {
    const url2 = new URL(endpoint.versionPath, clientUrl);
    const request = new _Request(url2.toString(), { method: "GET" });
    const response = await fetch2(request);
    await response.arrayBuffer();
    if (response.ok) {
      return endpoint;
    }
  }
  return fallbackEndpoint;
}

// node_modules/@libsql/hrana-client/lib-esm/index.js
function openWs(url2, jwt, protocolVersion = 2) {
  if (typeof WebSocket === "undefined") {
    throw new WebSocketUnsupportedError("WebSockets are not supported in this environment");
  }
  var subprotocols = void 0;
  if (protocolVersion == 3) {
    subprotocols = Array.from(subprotocolsV3.keys());
  } else {
    subprotocols = Array.from(subprotocolsV2.keys());
  }
  const socket = new WebSocket(url2, subprotocols);
  return new WsClient(socket, jwt);
}
function openHttp(url2, jwt, customFetch, protocolVersion = 2) {
  return new HttpClient(url2 instanceof URL ? url2 : new URL(url2), jwt, customFetch, protocolVersion);
}

// node_modules/@libsql/client/lib-esm/hrana.js
var HranaTransaction = class {
  #mode;
  #version;
  // Promise that is resolved when the BEGIN statement completes, or `undefined` if we haven't executed the
  // BEGIN statement yet.
  #started;
  /** @private */
  constructor(mode, version2) {
    this.#mode = mode;
    this.#version = version2;
    this.#started = void 0;
  }
  execute(stmt) {
    return this.batch([stmt]).then((results) => results[0]);
  }
  async batch(stmts) {
    const stream = this._getStream();
    if (stream.closed) {
      throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
    }
    try {
      const hranaStmts = stmts.map(stmtToHrana);
      let rowsPromises;
      if (this.#started === void 0) {
        this._getSqlCache().apply(hranaStmts);
        const batch = stream.batch(this.#version >= 3);
        const beginStep = batch.step();
        const beginPromise = beginStep.run(transactionModeToBegin(this.#mode));
        let lastStep = beginStep;
        rowsPromises = hranaStmts.map((hranaStmt) => {
          const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
          if (this.#version >= 3) {
            stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
          }
          const rowsPromise = stmtStep.query(hranaStmt);
          rowsPromise.catch(() => void 0);
          lastStep = stmtStep;
          return rowsPromise;
        });
        this.#started = batch.execute().then(() => beginPromise).then(() => void 0);
        try {
          await this.#started;
        } catch (e) {
          this.close();
          throw e;
        }
      } else {
        if (this.#version < 3) {
          await this.#started;
        } else {
        }
        this._getSqlCache().apply(hranaStmts);
        const batch = stream.batch(this.#version >= 3);
        let lastStep = void 0;
        rowsPromises = hranaStmts.map((hranaStmt) => {
          const stmtStep = batch.step();
          if (lastStep !== void 0) {
            stmtStep.condition(BatchCond.ok(lastStep));
          }
          if (this.#version >= 3) {
            stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
          }
          const rowsPromise = stmtStep.query(hranaStmt);
          rowsPromise.catch(() => void 0);
          lastStep = stmtStep;
          return rowsPromise;
        });
        await batch.execute();
      }
      const resultSets = [];
      for (const rowsPromise of rowsPromises) {
        const rows = await rowsPromise;
        if (rows === void 0) {
          throw new LibsqlError("Statement in a transaction was not executed, probably because the transaction has been rolled back", "TRANSACTION_CLOSED");
        }
        resultSets.push(resultSetFromHrana(rows));
      }
      return resultSets;
    } catch (e) {
      throw mapHranaError(e);
    }
  }
  async executeMultiple(sql) {
    const stream = this._getStream();
    if (stream.closed) {
      throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
    }
    try {
      if (this.#started === void 0) {
        this.#started = stream.run(transactionModeToBegin(this.#mode)).then(() => void 0);
        try {
          await this.#started;
        } catch (e) {
          this.close();
          throw e;
        }
      } else {
        await this.#started;
      }
      await stream.sequence(sql);
    } catch (e) {
      throw mapHranaError(e);
    }
  }
  async rollback() {
    try {
      const stream = this._getStream();
      if (stream.closed) {
        return;
      }
      if (this.#started !== void 0) {
      } else {
        return;
      }
      const promise = stream.run("ROLLBACK").catch((e) => {
        throw mapHranaError(e);
      });
      stream.closeGracefully();
      await promise;
    } catch (e) {
      throw mapHranaError(e);
    } finally {
      this.close();
    }
  }
  async commit() {
    try {
      const stream = this._getStream();
      if (stream.closed) {
        throw new LibsqlError("Cannot commit the transaction because it is already closed", "TRANSACTION_CLOSED");
      }
      if (this.#started !== void 0) {
        await this.#started;
      } else {
        return;
      }
      const promise = stream.run("COMMIT").catch((e) => {
        throw mapHranaError(e);
      });
      stream.closeGracefully();
      await promise;
    } catch (e) {
      throw mapHranaError(e);
    } finally {
      this.close();
    }
  }
};
async function executeHranaBatch(mode, version2, batch, hranaStmts, disableForeignKeys = false) {
  if (disableForeignKeys) {
    batch.step().run("PRAGMA foreign_keys=off");
  }
  const beginStep = batch.step();
  const beginPromise = beginStep.run(transactionModeToBegin(mode));
  let lastStep = beginStep;
  const stmtPromises = hranaStmts.map((hranaStmt) => {
    const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
    if (version2 >= 3) {
      stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
    }
    const stmtPromise = stmtStep.query(hranaStmt);
    lastStep = stmtStep;
    return stmtPromise;
  });
  const commitStep = batch.step().condition(BatchCond.ok(lastStep));
  if (version2 >= 3) {
    commitStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
  }
  const commitPromise = commitStep.run("COMMIT");
  const rollbackStep = batch.step().condition(BatchCond.not(BatchCond.ok(commitStep)));
  rollbackStep.run("ROLLBACK").catch((_) => void 0);
  if (disableForeignKeys) {
    batch.step().run("PRAGMA foreign_keys=on");
  }
  await batch.execute();
  const resultSets = [];
  await beginPromise;
  for (const stmtPromise of stmtPromises) {
    const hranaRows = await stmtPromise;
    if (hranaRows === void 0) {
      throw new LibsqlError("Statement in a batch was not executed, probably because the transaction has been rolled back", "TRANSACTION_CLOSED");
    }
    resultSets.push(resultSetFromHrana(hranaRows));
  }
  await commitPromise;
  return resultSets;
}
function stmtToHrana(stmt) {
  let sql;
  let args;
  if (Array.isArray(stmt)) {
    [sql, args] = stmt;
  } else if (typeof stmt === "string") {
    sql = stmt;
  } else {
    sql = stmt.sql;
    args = stmt.args;
  }
  const hranaStmt = new Stmt(sql);
  if (args) {
    if (Array.isArray(args)) {
      hranaStmt.bindIndexes(args);
    } else {
      for (const [key, value] of Object.entries(args)) {
        hranaStmt.bindName(key, value);
      }
    }
  }
  return hranaStmt;
}
function resultSetFromHrana(hranaRows) {
  const columns = hranaRows.columnNames.map((c) => c ?? "");
  const columnTypes = hranaRows.columnDecltypes.map((c) => c ?? "");
  const rows = hranaRows.rows;
  const rowsAffected = hranaRows.affectedRowCount;
  const lastInsertRowid = hranaRows.lastInsertRowid !== void 0 ? hranaRows.lastInsertRowid : void 0;
  return new ResultSetImpl(columns, columnTypes, rows, rowsAffected, lastInsertRowid);
}
function mapHranaError(e) {
  if (e instanceof ClientError) {
    const code = mapHranaErrorCode(e);
    return new LibsqlError(e.message, code, void 0, e);
  }
  return e;
}
function mapHranaErrorCode(e) {
  if (e instanceof ResponseError && e.code !== void 0) {
    return e.code;
  } else if (e instanceof ProtoError) {
    return "HRANA_PROTO_ERROR";
  } else if (e instanceof ClosedError) {
    return e.cause instanceof ClientError ? mapHranaErrorCode(e.cause) : "HRANA_CLOSED_ERROR";
  } else if (e instanceof WebSocketError) {
    return "HRANA_WEBSOCKET_ERROR";
  } else if (e instanceof HttpServerError) {
    return "SERVER_ERROR";
  } else if (e instanceof ProtocolVersionError) {
    return "PROTOCOL_VERSION_ERROR";
  } else if (e instanceof InternalError) {
    return "INTERNAL_ERROR";
  } else {
    return "UNKNOWN";
  }
}

// node_modules/@libsql/client/lib-esm/sql_cache.js
var SqlCache = class {
  #owner;
  #sqls;
  capacity;
  constructor(owner, capacity) {
    this.#owner = owner;
    this.#sqls = new Lru();
    this.capacity = capacity;
  }
  // Replaces SQL strings with cached `hrana.Sql` objects in the statements in `hranaStmts`. After this
  // function returns, we guarantee that all `hranaStmts` refer to valid (not closed) `hrana.Sql` objects,
  // but _we may invalidate any other `hrana.Sql` objects_ (by closing them, thus removing them from the
  // server).
  //
  // In practice, this means that after calling this function, you can use the statements only up to the
  // first `await`, because concurrent code may also use the cache and invalidate those statements.
  apply(hranaStmts) {
    if (this.capacity <= 0) {
      return;
    }
    const usedSqlObjs = /* @__PURE__ */ new Set();
    for (const hranaStmt of hranaStmts) {
      if (typeof hranaStmt.sql !== "string") {
        continue;
      }
      const sqlText = hranaStmt.sql;
      if (sqlText.length >= 5e3) {
        continue;
      }
      let sqlObj = this.#sqls.get(sqlText);
      if (sqlObj === void 0) {
        while (this.#sqls.size + 1 > this.capacity) {
          const [evictSqlText, evictSqlObj] = this.#sqls.peekLru();
          if (usedSqlObjs.has(evictSqlObj)) {
            break;
          }
          evictSqlObj.close();
          this.#sqls.delete(evictSqlText);
        }
        if (this.#sqls.size + 1 <= this.capacity) {
          sqlObj = this.#owner.storeSql(sqlText);
          this.#sqls.set(sqlText, sqlObj);
        }
      }
      if (sqlObj !== void 0) {
        hranaStmt.sql = sqlObj;
        usedSqlObjs.add(sqlObj);
      }
    }
  }
};
var Lru = class {
  // This maps keys to the cache values. The entries are ordered by their last use (entires that were used
  // most recently are at the end).
  #cache;
  constructor() {
    this.#cache = /* @__PURE__ */ new Map();
  }
  get(key) {
    const value = this.#cache.get(key);
    if (value !== void 0) {
      this.#cache.delete(key);
      this.#cache.set(key, value);
    }
    return value;
  }
  set(key, value) {
    this.#cache.set(key, value);
  }
  peekLru() {
    for (const entry of this.#cache.entries()) {
      return entry;
    }
    return void 0;
  }
  delete(key) {
    this.#cache.delete(key);
  }
  get size() {
    return this.#cache.size;
  }
};

// node_modules/@libsql/client/lib-esm/ws.js
var import_promise_limit = __toESM(require_promise_limit(), 1);
function _createClient(config) {
  if (config.scheme !== "wss" && config.scheme !== "ws") {
    throw new LibsqlError(`The WebSocket client supports only "libsql:", "wss:" and "ws:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (config.encryptionKey !== void 0) {
    throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
  }
  if (config.scheme === "ws" && config.tls) {
    throw new LibsqlError(`A "ws:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
  } else if (config.scheme === "wss" && !config.tls) {
    throw new LibsqlError(`A "wss:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
  }
  const url2 = encodeBaseUrl(config.scheme, config.authority, config.path);
  let client2;
  try {
    client2 = openWs(url2, config.authToken);
  } catch (e) {
    if (e instanceof WebSocketUnsupportedError) {
      const suggestedScheme = config.scheme === "wss" ? "https" : "http";
      const suggestedUrl = encodeBaseUrl(suggestedScheme, config.authority, config.path);
      throw new LibsqlError(`This environment does not support WebSockets, please switch to the HTTP client by using a "${suggestedScheme}:" URL (${JSON.stringify(suggestedUrl)}). For more information, please read ${supportedUrlLink}`, "WEBSOCKETS_NOT_SUPPORTED");
    }
    throw mapHranaError(e);
  }
  return new WsClient2(client2, url2, config.authToken, config.intMode, config.concurrency);
}
var maxConnAgeMillis = 60 * 1e3;
var sqlCacheCapacity = 100;
var WsClient2 = class {
  #url;
  #authToken;
  #intMode;
  // State of the current connection. The `hrana.WsClient` inside may be closed at any moment due to an
  // asynchronous error.
  #connState;
  // If defined, this is a connection that will be used in the future, once it is ready.
  #futureConnState;
  closed;
  protocol;
  #isSchemaDatabase;
  #promiseLimitFunction;
  /** @private */
  constructor(client2, url2, authToken2, intMode, concurrency) {
    this.#url = url2;
    this.#authToken = authToken2;
    this.#intMode = intMode;
    this.#connState = this.#openConn(client2);
    this.#futureConnState = void 0;
    this.closed = false;
    this.protocol = "ws";
    this.#promiseLimitFunction = (0, import_promise_limit.default)(concurrency);
  }
  async limit(fn) {
    return this.#promiseLimitFunction(fn);
  }
  async execute(stmtOrSql, args) {
    let stmt;
    if (typeof stmtOrSql === "string") {
      stmt = {
        sql: stmtOrSql,
        args: args || []
      };
    } else {
      stmt = stmtOrSql;
    }
    return this.limit(async () => {
      const streamState = await this.#openStream();
      try {
        const hranaStmt = stmtToHrana(stmt);
        streamState.conn.sqlCache.apply([hranaStmt]);
        const hranaRowsPromise = streamState.stream.query(hranaStmt);
        streamState.stream.closeGracefully();
        const hranaRowsResult = await hranaRowsPromise;
        return resultSetFromHrana(hranaRowsResult);
      } catch (e) {
        throw mapHranaError(e);
      } finally {
        this._closeStream(streamState);
      }
    });
  }
  async batch(stmts, mode = "deferred") {
    return this.limit(async () => {
      const streamState = await this.#openStream();
      try {
        const normalizedStmts = stmts.map((stmt) => {
          if (Array.isArray(stmt)) {
            return {
              sql: stmt[0],
              args: stmt[1] || []
            };
          }
          return stmt;
        });
        const hranaStmts = normalizedStmts.map(stmtToHrana);
        const version2 = await streamState.conn.client.getVersion();
        streamState.conn.sqlCache.apply(hranaStmts);
        const batch = streamState.stream.batch(version2 >= 3);
        const resultsPromise = executeHranaBatch(mode, version2, batch, hranaStmts);
        const results = await resultsPromise;
        return results;
      } catch (e) {
        throw mapHranaError(e);
      } finally {
        this._closeStream(streamState);
      }
    });
  }
  async migrate(stmts) {
    return this.limit(async () => {
      const streamState = await this.#openStream();
      try {
        const hranaStmts = stmts.map(stmtToHrana);
        const version2 = await streamState.conn.client.getVersion();
        const batch = streamState.stream.batch(version2 >= 3);
        const resultsPromise = executeHranaBatch("deferred", version2, batch, hranaStmts, true);
        const results = await resultsPromise;
        return results;
      } catch (e) {
        throw mapHranaError(e);
      } finally {
        this._closeStream(streamState);
      }
    });
  }
  async transaction(mode = "write") {
    return this.limit(async () => {
      const streamState = await this.#openStream();
      try {
        const version2 = await streamState.conn.client.getVersion();
        return new WsTransaction(this, streamState, mode, version2);
      } catch (e) {
        this._closeStream(streamState);
        throw mapHranaError(e);
      }
    });
  }
  async executeMultiple(sql) {
    return this.limit(async () => {
      const streamState = await this.#openStream();
      try {
        const promise = streamState.stream.sequence(sql);
        streamState.stream.closeGracefully();
        await promise;
      } catch (e) {
        throw mapHranaError(e);
      } finally {
        this._closeStream(streamState);
      }
    });
  }
  sync() {
    throw new LibsqlError("sync not supported in ws mode", "SYNC_NOT_SUPPORTED");
  }
  async #openStream() {
    if (this.closed) {
      throw new LibsqlError("The client is closed", "CLIENT_CLOSED");
    }
    const now = /* @__PURE__ */ new Date();
    const ageMillis = now.valueOf() - this.#connState.openTime.valueOf();
    if (ageMillis > maxConnAgeMillis && this.#futureConnState === void 0) {
      const futureConnState = this.#openConn();
      this.#futureConnState = futureConnState;
      futureConnState.client.getVersion().then((_version) => {
        if (this.#connState !== futureConnState) {
          if (this.#connState.streamStates.size === 0) {
            this.#connState.client.close();
          } else {
          }
        }
        this.#connState = futureConnState;
        this.#futureConnState = void 0;
      }, (_e) => {
        this.#futureConnState = void 0;
      });
    }
    if (this.#connState.client.closed) {
      try {
        if (this.#futureConnState !== void 0) {
          this.#connState = this.#futureConnState;
        } else {
          this.#connState = this.#openConn();
        }
      } catch (e) {
        throw mapHranaError(e);
      }
    }
    const connState = this.#connState;
    try {
      if (connState.useSqlCache === void 0) {
        connState.useSqlCache = await connState.client.getVersion() >= 2;
        if (connState.useSqlCache) {
          connState.sqlCache.capacity = sqlCacheCapacity;
        }
      }
      const stream = connState.client.openStream();
      stream.intMode = this.#intMode;
      const streamState = { conn: connState, stream };
      connState.streamStates.add(streamState);
      return streamState;
    } catch (e) {
      throw mapHranaError(e);
    }
  }
  #openConn(client2) {
    try {
      client2 ??= openWs(this.#url, this.#authToken);
      return {
        client: client2,
        useSqlCache: void 0,
        sqlCache: new SqlCache(client2, 0),
        openTime: /* @__PURE__ */ new Date(),
        streamStates: /* @__PURE__ */ new Set()
      };
    } catch (e) {
      throw mapHranaError(e);
    }
  }
  async reconnect() {
    try {
      for (const st of Array.from(this.#connState.streamStates)) {
        try {
          st.stream.close();
        } catch {
        }
      }
      this.#connState.client.close();
    } catch {
    }
    if (this.#futureConnState) {
      try {
        this.#futureConnState.client.close();
      } catch {
      }
      this.#futureConnState = void 0;
    }
    const next = this.#openConn();
    const version2 = await next.client.getVersion();
    next.useSqlCache = version2 >= 2;
    if (next.useSqlCache) {
      next.sqlCache.capacity = sqlCacheCapacity;
    }
    this.#connState = next;
    this.closed = false;
  }
  _closeStream(streamState) {
    streamState.stream.close();
    const connState = streamState.conn;
    connState.streamStates.delete(streamState);
    if (connState.streamStates.size === 0 && connState !== this.#connState) {
      connState.client.close();
    }
  }
  close() {
    this.#connState.client.close();
    this.closed = true;
    if (this.#futureConnState) {
      try {
        this.#futureConnState.client.close();
      } catch {
      }
      this.#futureConnState = void 0;
    }
    this.closed = true;
  }
};
var WsTransaction = class extends HranaTransaction {
  #client;
  #streamState;
  /** @private */
  constructor(client2, state, mode, version2) {
    super(mode, version2);
    this.#client = client2;
    this.#streamState = state;
  }
  /** @private */
  _getStream() {
    return this.#streamState.stream;
  }
  /** @private */
  _getSqlCache() {
    return this.#streamState.conn.sqlCache;
  }
  close() {
    this.#client._closeStream(this.#streamState);
  }
  get closed() {
    return this.#streamState.stream.closed;
  }
};

// node_modules/@libsql/client/lib-esm/http.js
var import_promise_limit2 = __toESM(require_promise_limit(), 1);
function _createClient2(config) {
  if (config.scheme !== "https" && config.scheme !== "http") {
    throw new LibsqlError(`The HTTP client supports only "libsql:", "https:" and "http:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (config.encryptionKey !== void 0) {
    throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
  }
  if (config.scheme === "http" && config.tls) {
    throw new LibsqlError(`A "http:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
  } else if (config.scheme === "https" && !config.tls) {
    throw new LibsqlError(`A "https:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
  }
  const url2 = encodeBaseUrl(config.scheme, config.authority, config.path);
  return new HttpClient2(url2, config.authToken, config.intMode, config.fetch, config.concurrency);
}
var sqlCacheCapacity2 = 30;
var HttpClient2 = class {
  #client;
  protocol;
  #url;
  #intMode;
  #customFetch;
  #concurrency;
  #authToken;
  #promiseLimitFunction;
  /** @private */
  constructor(url2, authToken2, intMode, customFetch, concurrency) {
    this.#url = url2;
    this.#authToken = authToken2;
    this.#intMode = intMode;
    this.#customFetch = customFetch;
    this.#concurrency = concurrency;
    this.#client = openHttp(this.#url, this.#authToken, this.#customFetch);
    this.#client.intMode = this.#intMode;
    this.protocol = "http";
    this.#promiseLimitFunction = (0, import_promise_limit2.default)(this.#concurrency);
  }
  async limit(fn) {
    return this.#promiseLimitFunction(fn);
  }
  async execute(stmtOrSql, args) {
    let stmt;
    if (typeof stmtOrSql === "string") {
      stmt = {
        sql: stmtOrSql,
        args: args || []
      };
    } else {
      stmt = stmtOrSql;
    }
    return this.limit(async () => {
      try {
        const hranaStmt = stmtToHrana(stmt);
        let rowsPromise;
        const stream = this.#client.openStream();
        try {
          rowsPromise = stream.query(hranaStmt);
        } finally {
          stream.closeGracefully();
        }
        const rowsResult = await rowsPromise;
        return resultSetFromHrana(rowsResult);
      } catch (e) {
        throw mapHranaError(e);
      }
    });
  }
  async batch(stmts, mode = "deferred") {
    return this.limit(async () => {
      try {
        const normalizedStmts = stmts.map((stmt) => {
          if (Array.isArray(stmt)) {
            return {
              sql: stmt[0],
              args: stmt[1] || []
            };
          }
          return stmt;
        });
        const hranaStmts = normalizedStmts.map(stmtToHrana);
        const version2 = await this.#client.getVersion();
        let resultsPromise;
        const stream = this.#client.openStream();
        try {
          const sqlCache = new SqlCache(stream, sqlCacheCapacity2);
          sqlCache.apply(hranaStmts);
          const batch = stream.batch(false);
          resultsPromise = executeHranaBatch(mode, version2, batch, hranaStmts);
        } finally {
          stream.closeGracefully();
        }
        const results = await resultsPromise;
        return results;
      } catch (e) {
        throw mapHranaError(e);
      }
    });
  }
  async migrate(stmts) {
    return this.limit(async () => {
      try {
        const hranaStmts = stmts.map(stmtToHrana);
        const version2 = await this.#client.getVersion();
        let resultsPromise;
        const stream = this.#client.openStream();
        try {
          const batch = stream.batch(false);
          resultsPromise = executeHranaBatch("deferred", version2, batch, hranaStmts, true);
        } finally {
          stream.closeGracefully();
        }
        const results = await resultsPromise;
        return results;
      } catch (e) {
        throw mapHranaError(e);
      }
    });
  }
  async transaction(mode = "write") {
    return this.limit(async () => {
      try {
        const version2 = await this.#client.getVersion();
        return new HttpTransaction(this.#client.openStream(), mode, version2);
      } catch (e) {
        throw mapHranaError(e);
      }
    });
  }
  async executeMultiple(sql) {
    return this.limit(async () => {
      try {
        let promise;
        const stream = this.#client.openStream();
        try {
          promise = stream.sequence(sql);
        } finally {
          stream.closeGracefully();
        }
        await promise;
      } catch (e) {
        throw mapHranaError(e);
      }
    });
  }
  sync() {
    throw new LibsqlError("sync not supported in http mode", "SYNC_NOT_SUPPORTED");
  }
  close() {
    this.#client.close();
  }
  async reconnect() {
    try {
      if (!this.closed) {
        this.#client.close();
      }
    } finally {
      this.#client = openHttp(this.#url, this.#authToken, this.#customFetch);
      this.#client.intMode = this.#intMode;
    }
  }
  get closed() {
    return this.#client.closed;
  }
};
var HttpTransaction = class extends HranaTransaction {
  #stream;
  #sqlCache;
  /** @private */
  constructor(stream, mode, version2) {
    super(mode, version2);
    this.#stream = stream;
    this.#sqlCache = new SqlCache(stream, sqlCacheCapacity2);
  }
  /** @private */
  _getStream() {
    return this.#stream;
  }
  /** @private */
  _getSqlCache() {
    return this.#sqlCache;
  }
  close() {
    this.#stream.close();
  }
  get closed() {
    return this.#stream.closed;
  }
};

// node_modules/@libsql/client/lib-esm/web.js
function createClient(config) {
  return _createClient3(expandConfig(config, true));
}
function _createClient3(config) {
  if (config.scheme === "ws" || config.scheme === "wss") {
    return _createClient(config);
  } else if (config.scheme === "http" || config.scheme === "https") {
    return _createClient2(config);
  } else {
    throw new LibsqlError(`The client that uses Web standard APIs supports only "libsql:", "wss:", "ws:", "https:" and "http:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
}

// node_modules/dotenv/config.js
(function() {
  require_main().config(
    Object.assign(
      {},
      require_env_options(),
      require_cli_options()(process.argv)
    )
  );
})();

// src/utils/db.js
var url = process.env.TURSO_DATABASE_URL;
var authToken = process.env.TURSO_AUTH_TOKEN;
var client = createClient({
  url,
  authToken
});
async function dbQuery(sql, args = []) {
  try {
    const result = await client.execute({ sql, args });
    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
}
async function dbGet(sql, args = []) {
  const result = await dbQuery(sql, args);
  return result.rows[0] || null;
}
async function dbAll(sql, args = []) {
  const result = await dbQuery(sql, args);
  return result.rows;
}

// src/utils/jsonHandler.js
var DATA_PATH = path.join(process.cwd(), "src/data");
async function readJson(filePath) {
  try {
    const fullPath = path.join(DATA_PATH, filePath);
    const data = await fs.readFile(fullPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON from ${filePath}:`, error.message);
    return null;
  }
}
async function writeJson(filePath, data) {
  try {
    const fullPath = path.join(DATA_PATH, filePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Error writing JSON to ${filePath}:`, error.message);
    return false;
  }
}
async function getSurahList() {
  return await readJson("quran/surah.json");
}
async function getSurahDetail(number2) {
  const surahs = await getSurahList();
  return surahs ? surahs.find((s) => s.number == number2) : null;
}
async function getAyahBySurah(surahNumber) {
  return await readJson(`quran/ayah/${surahNumber}.json`);
}
async function getDoa() {
  return await readJson("common/doa.json");
}
async function getAsmaulHusna() {
  return await readJson("common/asmaul_husna.json");
}
async function getDzikir() {
  return await readJson("common/dzikir.json");
}
async function getHaditsArbain() {
  return await readJson("hadits/arbain.json");
}
async function getThemes() {
  return await readJson("quran/themes.json");
}
async function getJuz() {
  return await readJson("quran/juz.json");
}
async function getTafsir() {
  return await readJson("quran/tafsir.json");
}
async function getWord() {
  return await readJson("quran/word.json");
}
async function getAsbabNuzul() {
  return await readJson("quran/asbab_nuzul.json");
}
async function getSejarah() {
  return await readJson("common/sejarah.json");
}
async function getQari() {
  return await readJson("common/qari.json");
}
async function getCalendarMonths() {
  return await readJson("common/calendar_months.json");
}
async function getCalendarDays() {
  return await readJson("common/calendar_days.json");
}
async function getMasjid() {
  return await readJson("common/masjid.json");
}
async function getPuasa() {
  return await readJson("common/puasa.json");
}
async function getFiqhPuasa() {
  return await readJson("common/fiqh_puasa.json");
}
async function getAnalytics() {
  try {
    const totalReads = await dbGet("SELECT value FROM global_stats WHERE key = 'total_reads'");
    const globalKhatam = await dbGet("SELECT value FROM global_stats WHERE key = 'global_khatam'");
    const lastUpdated = await dbGet("SELECT last_updated FROM global_stats WHERE key = 'total_reads'");
    const trendingSurahs = await dbAll("SELECT item_id, count FROM item_stats WHERE type = 'surah'");
    const trendingAyahs = await dbAll("SELECT item_id, count FROM item_stats WHERE type = 'ayah'");
    const surahMap = {};
    trendingSurahs.forEach((row) => surahMap[row.item_id] = row.count);
    const ayahMap = {};
    trendingAyahs.forEach((row) => ayahMap[row.item_id] = row.count);
    return {
      trending_surahs: surahMap,
      trending_ayahs: ayahMap,
      global_khatam: globalKhatam ? globalKhatam.value : 0,
      total_reads: totalReads ? totalReads.value : 0,
      last_updated: lastUpdated ? lastUpdated.last_updated : (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    console.error("Failed to get analytics from DB:", error);
    return {
      trending_surahs: {},
      trending_ayahs: {},
      global_khatam: 0,
      total_reads: 0,
      last_updated: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}
async function updateAnalytics(type, id) {
  try {
    if (type === "surah" || type === "ayah") {
      await dbQuery(`
        INSERT INTO item_stats (type, item_id, count, last_updated) 
        VALUES (?, ?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(type, item_id) DO UPDATE SET 
          count = count + 1,
          last_updated = CURRENT_TIMESTAMP
      `, [type, id]);
      await dbQuery(`
        UPDATE global_stats 
        SET value = value + 1, last_updated = CURRENT_TIMESTAMP 
        WHERE key = 'total_reads'
      `);
    } else if (type === "khatam") {
      await dbQuery(`
        UPDATE global_stats 
        SET value = value + 1, last_updated = CURRENT_TIMESTAMP 
        WHERE key = 'global_khatam'
      `);
    }
    return true;
  } catch (error) {
    console.error("Failed to update analytics in DB:", error);
    return false;
  }
}
async function getLocalHadits(bookName) {
  return await readJson(`hadits/${bookName}.json`);
}

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
    let string2;
    try {
      string2 = props.children ? (Array.isArray(props.children) ? new JSXFragmentNode("", {}, props.children) : props.children).toString() : "";
    } finally {
      values.pop();
    }
    if (string2 instanceof Promise) {
      return string2.then((resString) => raw(resString, resString.callbacks));
    } else {
      return raw(string2);
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
  const string2 = new JSXNode(tag, restProps, toArray(children || [])).toString();
  if (string2 instanceof Promise) {
    return string2.then(
      (resString) => raw(string2, [
        ...resString.callbacks || [],
        insertIntoHead(tag, resString, restProps, precedence)
      ])
    );
  } else {
    return raw(string2, [insertIntoHead(tag, string2, restProps, precedence)]);
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
          { title: 'Introduction', path: '/docs#intro', category: 'General' },
          { title: 'Base URL', path: '/docs#intro', category: 'General' },
          { title: 'Al-Quran Indonesia', path: '/docs#quran', category: 'Quran' },
          { title: 'Daftar Surah', path: '/docs#quran', category: 'Quran', endpoint: '/surah' },
          { title: 'Detail Surah', path: '/docs#quran', category: 'Quran', endpoint: '/surah?surahId=114' },
          { title: 'Tafsir Kemenag', path: '/docs#quran', category: 'Quran', endpoint: '/tafsir?surahId=1' },
          { title: 'Ayat & Al-Quran', path: '/docs#ayah', category: 'Ayat' },
          { title: 'Ayat by Surah', path: '/docs#ayah', category: 'Ayat', endpoint: '/ayah/surah?surahId=1' },
          { title: 'Ayat by Juz', path: '/docs#ayah', category: 'Ayat', endpoint: '/ayah/juz?juzId=30' },
          { title: 'Ayat by Page', path: '/docs#ayah', category: 'Ayat', endpoint: '/ayah/page?page=604' },
          { title: 'Range Ayat', path: '/docs#ayah', category: 'Ayat', endpoint: '/ayah/range?surahId=1&start=1&end=7' },
          { title: 'Cari Ayat', path: '/docs#ayah', category: 'Ayat', endpoint: '/ayah/find?query=puasa' },
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
          { title: 'Data Integrity', path: '/docs#integrity', category: 'Security' },
          { title: 'Integrity Chain', path: '/docs#integrity', category: 'Security', endpoint: '/integrity/chain' },
          { title: 'Verify Ayah', path: '/docs#integrity', category: 'Security', endpoint: '/integrity/verify/ayah?surahId=1&ayahId=1' },
          { title: 'Jadwal Sholat', path: '/other#sholat', category: 'Sholat' },
          { title: 'Daftar Kota Sholat', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/kota/semua' },
          { title: 'Cari Kota Sholat', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/kota/cari?nama=jakarta' },
          { title: 'Jadwal Sholat by Kota', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/jadwal?kotaId=1301' },
          { title: 'Jadwal Sholat by Koordinat', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/jadwal/koordinat?lat=-6.2&lon=106.8' },
          { title: 'Sejarah Islam', path: '/other#sejarah', category: 'Sejarah' },
          { title: 'Daftar Sejarah', path: '/other#sejarah', category: 'Sejarah', endpoint: '/sejarah' },
          { title: 'Detail Sejarah', path: '/other#sejarah', category: 'Sejarah', endpoint: '/sejarah/detail?id=1' },
          { title: 'Puasa & Fiqh', path: '/other#puasa', category: 'Puasa' },
          { title: 'Daftar Puasa (Wajib & Sunnah)', path: '/other#puasa', category: 'Puasa', endpoint: '/puasa' },
          { title: 'Cari Puasa', path: '/other#puasa', category: 'Puasa', endpoint: '/puasa/find?query=ramadhan' },
          { title: 'Filter Tipe Puasa', path: '/other#puasa', category: 'Puasa', endpoint: '/puasa/type/wajib' },
          { title: 'Fiqh & Adab Puasa (70 Masalah)', path: '/other#puasa', category: 'Puasa', endpoint: '/puasa/fiqh' },
          { title: 'Tools & Fitur Cerdas', path: '/other#tools', category: 'Tools' },
          { title: 'Kalkulator Waris (Faraidh)', path: '/other#tools', category: 'Tools', endpoint: '/tools/faraidh' },
          { title: 'Kalkulator Zakat', path: '/other#tools', category: 'Tools', endpoint: '/tools/zakat' },
          { title: 'Pencarian Semantik (Quran, Hadits, Puasa, Fiqh)', path: '/other#tools', category: 'Tools', endpoint: '/tools/semantic-search?query=ramadhan' },
          { title: 'Arah Kiblat', path: '/other#tools', category: 'Tools', endpoint: '/tools/qibla' },
          { title: 'Daily Quotes (Ayat/Hadits)', path: '/other#tools', category: 'Tools', endpoint: '/tools/quotes/daily' },
          { title: 'Murottal Audio', path: '/other#murottal', category: 'Other' },
          { title: 'Daftar Qari', path: '/other#murottal', category: 'Other', endpoint: '/murotal/qari' },
          { title: 'Murottal by Surah', path: '/other#murottal', category: 'Other', endpoint: '/murotal?surahId=1' },
          { title: 'FAQ', path: '/docs#faq', category: 'General' },
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
            container.innerHTML = '<div class="py-4 text-xs text-center text-slate-400">Type to search...</div>';
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
            container.innerHTML = '<div class="py-8 text-xs text-center text-slate-400">No results found for "' + query + '"</div>';
            dropdown.classList.remove('hidden');
            selectedIndex = -1;
            return;
          }

          var html = '';
          for (var i = 0; i < filtered.length; i++) {
            var item = filtered[i];
            var activeClass = (i === 0) ? 'bg-emerald-50' : '';
            html += '<a href="' + item.path + '" onclick="window.hideResults()" class="flex justify-between items-center p-2 rounded-lg transition-all duration-150 search-result-item hover:bg-emerald-50 group' + activeClass + '" data-index="' + i + '">' +
                      '<div class="flex gap-2 items-center">' +
                        '<div class="flex justify-center items-center w-6 h-6 rounded transition-colors bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600">' +
                          '<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>' +
                        '</div>' +
                        '<div>' +
                          '<div class="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">' + item.category + '</div>' +
                          '<div class="text-xs font-semibold text-slate-900">' + item.title + '</div>' +
                        '</div>' +
                      '</div>' +
                      '<div class="text-slate-300 group-hover:text-emerald-500">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>' +
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
import path2 from "node:path";
var compiledCss = "";
try {
  const cssPath = path2.resolve(process.cwd(), "src/compiled.css");
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
        `)), /* @__PURE__ */ jsx("body", { class: "flex flex-col min-h-screen bg-slate-50 text-slate-900" }, /* @__PURE__ */ jsx(Search, null), /* @__PURE__ */ jsx("header", { class: "sticky top-0 z-50 border-b glass border-slate-200" }, /* @__PURE__ */ jsx("div", { class: "px-4 mx-auto max-w-7xl sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "flex justify-between items-center h-16" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/",
      class: "flex gap-2 items-center transition-all group shrink-0"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-8 h-8 bg-emerald-600 rounded-lg transition-all group-hover:shadow-lg group-hover:shadow-emerald-200" }, /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "w-5 h-5 text-white",
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
    /* @__PURE__ */ jsx("span", { class: "text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 transition-all group-hover:from-emerald-500 group-hover:to-teal-500" }, "Muslim API")
  ), /* @__PURE__ */ jsx("div", { class: "flex gap-1 items-center md:gap-4 lg:gap-4" }, /* @__PURE__ */ jsx("div", { class: "relative w-40 group md:w-64" }, /* @__PURE__ */ jsx("div", { class: "flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none" }, /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "w-4 h-4 transition-colors text-slate-400 group-focus-within:text-emerald-500",
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
      class: "block py-1.5 pr-3 pl-10 w-full text-sm rounded-lg border transition-all bg-slate-100 border-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
    }
  ), /* @__PURE__ */ jsx(
    "div",
    {
      id: "search-results-dropdown",
      class: "absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 hidden overflow-hidden z-[100] max-h-[400px] overflow-y-auto"
    },
    /* @__PURE__ */ jsx("div", { id: "search-results-content", class: "p-2" }, /* @__PURE__ */ jsx("div", { class: "py-4 text-xs text-center text-slate-400" }, "Type to search..."))
  )), /* @__PURE__ */ jsx("nav", { class: "hidden items-center space-x-8 md:flex" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/",
      class: "font-medium transition-colors text-slate-600 hover:text-emerald-600"
    },
    "Home"
  ), /* @__PURE__ */ jsx("div", { class: "relative group" }, /* @__PURE__ */ jsx("button", { class: "flex gap-1 items-center py-4 font-medium transition-colors text-slate-600 group-hover:text-emerald-600" }, "Documentation", /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "w-4 h-4 transition-transform group-hover:rotate-180",
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
  )), /* @__PURE__ */ jsx("div", { class: "absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-6 z-[100]" }, /* @__PURE__ */ jsx("div", { class: "grid grid-cols-3 gap-8" }, /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h5", { class: "mb-4 text-xs font-bold tracking-wider uppercase text-slate-400" }, "Internal Services"), /* @__PURE__ */ jsx("ul", { class: "space-y-3" }, /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/docs",
      class: "flex gap-3 items-start group/item"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-8 h-8 text-emerald-600 bg-emerald-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white" }, /* @__PURE__ */ jsx(
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
      class: "flex gap-3 items-start group/item"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-8 h-8 text-blue-600 bg-blue-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white" }, /* @__PURE__ */ jsx(
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
      class: "flex gap-3 items-start group/item"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-8 h-8 text-amber-600 bg-amber-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-amber-600 group-hover/item:text-white" }, /* @__PURE__ */ jsx(
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
  )))), /* @__PURE__ */ jsx("div", { class: "col-span-2" }, /* @__PURE__ */ jsx("h5", { class: "mb-4 text-xs font-bold tracking-wider uppercase text-slate-400" }, "Other API Resources"), /* @__PURE__ */ jsx("ul", { class: "grid grid-cols-2 gap-y-4 gap-x-8" }, /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other#hadits",
      class: "flex gap-3 items-start group/item"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-8 h-8 text-rose-600 bg-rose-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-rose-600 group-hover/item:text-white" }, /* @__PURE__ */ jsx(
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
      class: "flex gap-3 items-start group/item"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-8 h-8 text-purple-600 bg-purple-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-purple-600 group-hover/item:text-white" }, /* @__PURE__ */ jsx(
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
      class: "flex gap-3 items-start group/item"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-8 h-8 text-indigo-600 bg-indigo-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white" }, /* @__PURE__ */ jsx(
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
      class: "flex gap-3 items-start group/item"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-8 h-8 text-amber-600 bg-amber-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-amber-600 group-hover/item:text-white" }, /* @__PURE__ */ jsx(
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
      class: "flex gap-3 items-start group/item"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-8 h-8 text-emerald-600 bg-emerald-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white" }, /* @__PURE__ */ jsx(
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
      class: "px-4 py-1.5 font-medium text-white bg-emerald-600 rounded-lg shadow-sm transition-all hover:bg-emerald-700 hover:shadow-emerald-200"
    },
    "Playground"
  )), /* @__PURE__ */ jsx("div", { class: "md:hidden" }, /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onclick: "document.getElementById('mobile-menu').classList.toggle('open')",
      class: "p-2 rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-slate-100"
    },
    /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "w-6 h-6",
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
  )))), /* @__PURE__ */ jsx("div", { id: "mobile-menu", class: "border-t md:hidden border-slate-100" }, /* @__PURE__ */ jsx("nav", { class: "flex flex-col px-2 pb-4 space-y-1" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/",
      class: "px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
    },
    "Home"
  ), /* @__PURE__ */ jsx("div", { class: "px-3 py-2 mt-2 text-xs font-bold tracking-wider uppercase text-slate-400" }, "Internal Services"), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/docs",
      class: "flex gap-2 items-center px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
    },
    /* @__PURE__ */ jsx("div", { class: "w-1.5 h-1.5 bg-emerald-500 rounded-full" }),
    " ",
    "Al-Quran API"
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other",
      class: "flex gap-2 items-center px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
    },
    /* @__PURE__ */ jsx("div", { class: "w-1.5 h-1.5 bg-blue-500 rounded-full" }),
    " Other APIs"
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/status",
      class: "flex gap-2 items-center px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
    },
    /* @__PURE__ */ jsx("div", { class: "w-1.5 h-1.5 bg-amber-500 rounded-full" }),
    " ",
    "System Status"
  ), /* @__PURE__ */ jsx("div", { class: "px-3 py-2 mt-2 text-xs font-bold tracking-wider uppercase text-slate-400" }, "External Resources"), /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://quran.kemenag.go.id/",
      target: "_blank",
      class: "px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
    },
    "Quran Kemenag"
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://github.com/vrush2000/muslim-all-in-one-api",
      target: "_blank",
      class: "px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
    },
    "GitHub Repository"
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/playground",
      class: "px-3 py-2.5 mt-4 font-bold text-center text-white bg-emerald-600 rounded-xl shadow-lg transition-all shadow-emerald-100"
    },
    "Open Playground"
  ))))), /* @__PURE__ */ jsx("main", { class: "flex-grow" }, children), /* @__PURE__ */ jsx("div", { id: "api-preview-modal", class: "fixed inset-0 z-[200] hidden" }, /* @__PURE__ */ jsx(
    "div",
    {
      class: "absolute inset-0 backdrop-blur-sm bg-slate-900/60",
      onclick: "window.closeApiModal()"
    }
  ), /* @__PURE__ */ jsx("div", { class: "flex absolute inset-0 justify-center items-center p-2 pointer-events-none sm:p-4" }, /* @__PURE__ */ jsx("div", { class: "bg-white w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden border border-slate-200" }, /* @__PURE__ */ jsx("div", { class: "flex justify-between items-center px-4 py-3 border-b sm:px-6 sm:py-4 border-slate-100 bg-slate-50/50 shrink-0" }, /* @__PURE__ */ jsx("div", { class: "flex overflow-hidden gap-2 items-center sm:gap-3" }, /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-8 h-8 text-emerald-600 bg-emerald-100 rounded-lg sm:w-10 sm:h-10 sm:rounded-xl shrink-0" }, /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "w-5 h-5 sm:h-6 sm:w-6",
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
  )), /* @__PURE__ */ jsx("div", { class: "overflow-hidden" }, /* @__PURE__ */ jsx("h3", { class: "text-sm font-bold truncate sm:text-lg text-slate-900" }, "API Response Preview"), /* @__PURE__ */ jsx(
    "p",
    {
      id: "modal-endpoint-url",
      class: "text-[10px] sm:text-xs text-slate-500 font-mono mt-0.5 truncate max-w-[150px] sm:max-w-md md:max-w-xl"
    }
  ))), /* @__PURE__ */ jsx(
    "button",
    {
      onclick: "window.closeApiModal()",
      class: "p-1.5 rounded-lg transition-all sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0"
    },
    /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "w-5 h-5 sm:h-6 sm:w-6",
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
  )), /* @__PURE__ */ jsx("div", { class: "flex overflow-hidden flex-col flex-grow gap-3 p-4 sm:p-6 sm:gap-4" }, /* @__PURE__ */ jsx("div", { class: "flex flex-col gap-3 justify-between sm:flex-row sm:items-center shrink-0" }, /* @__PURE__ */ jsx("div", { class: "flex gap-3 items-center" }, /* @__PURE__ */ jsx("span", { class: "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider" }, "GET"), /* @__PURE__ */ jsx(
    "span",
    {
      id: "modal-status-badge",
      class: "hidden inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider"
    }
  )), /* @__PURE__ */ jsx("div", { class: "flex gap-2 items-center" }, /* @__PURE__ */ jsx(
    "button",
    {
      onclick: "window.copyModalResponse()",
      class: "flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] sm:text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200 sm:border-transparent rounded-lg transition-all"
    },
    /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "w-3.5 h-3.5 sm:h-4 sm:w-4",
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
        class: "w-3.5 h-3.5 sm:h-4 sm:w-4",
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
  ))), /* @__PURE__ */ jsx("div", { class: "flex px-4 py-3 border-t sm:px-6 sm:py-4 border-slate-100 bg-slate-50/50 shrink-0" }, /* @__PURE__ */ jsx(
    "button",
    {
      onclick: "window.closeApiModal()",
      class: "px-6 py-2 w-full font-bold text-white rounded-lg shadow-lg transition-all sm:w-auto sm:ml-auto bg-slate-900 sm:rounded-xl hover:bg-slate-800 shadow-slate-200"
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
              statusBadge.className = 'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full' + 
                (response.ok ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800');
              statusBadge.classList.remove('hidden');
            } catch (error) {
              jsonDisplay.textContent = JSON.stringify({ error: 'Failed to fetch API', details: error.message }, null, 2);
              statusBadge.textContent = 'Error';
              statusBadge.className = 'inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded-full';
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
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Copied!';
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
          };

          window.selectPreset = function(amount) {
            document.getElementById('custom-amount').value = amount;
            window.generateDonationQR();
          };

          window.generateDonationQR = async function() {
            const amount = document.getElementById('custom-amount').value;
            if (!amount || amount < 1000) {
              alert('Pilih atau masukan nominal donasi');
              return;
            }

            const generateBtn = document.getElementById('generate-qris-btn');
            const originalText = generateBtn.innerHTML;
            generateBtn.disabled = true;
            generateBtn.innerHTML = 'Generating...';

            try {
              const response = await fetch("/api/qris/generate?amount=" + amount);
              const result = await response.json();

              if (result.status === 200) {
                document.getElementById('donation-options-section').classList.add('hidden');
                document.getElementById('qris-display-section').classList.remove('hidden');
                document.getElementById('qris-image').src = result.data.qr_image;
                document.getElementById('display-amount').textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
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
  ), /* @__PURE__ */ jsx("footer", { class: "py-12 mt-12 bg-white border-t border-slate-200" }, /* @__PURE__ */ jsx("div", { class: "px-4 mx-auto max-w-7xl sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-4" }, /* @__PURE__ */ jsx("div", { class: "col-span-1 md:col-span-1" }, /* @__PURE__ */ jsx("div", { class: "flex gap-2 items-center mb-4" }, /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-6 h-6 bg-emerald-600 rounded" }, /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "w-4 h-4 text-white",
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
  )), /* @__PURE__ */ jsx("span", { class: "text-lg font-bold" }, "Muslim API")), /* @__PURE__ */ jsx("p", { class: "mb-4 text-sm leading-relaxed text-slate-500" }, "Penyedia layanan API Muslim gratis untuk mempermudah pengembang dalam membangun aplikasi islami."), /* @__PURE__ */ jsx("div", { class: "flex gap-3 items-center" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://github.com/vrush2000/muslim-all-in-one-api",
      target: "_blank",
      class: "p-2 rounded-lg transition-all bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600",
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
      class: "p-2 rounded-lg transition-all bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600",
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
  ))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "mb-4 font-semibold text-slate-900" }, "API Documentation"), /* @__PURE__ */ jsx("ul", { class: "space-y-2 text-sm text-slate-500" }, /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx("a", { href: "/docs", class: "hover:text-emerald-600" }, "Al-Quran API")), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx("a", { href: "/other#hadits", class: "hover:text-emerald-600" }, "Hadits & Doa")), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx("a", { href: "/other#sholat", class: "hover:text-emerald-600" }, "Jadwal Sholat")), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx("a", { href: "/other#kemenag", class: "hover:text-emerald-600" }, "Kemenag Data")), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx("a", { href: "/other#sejarah", class: "hover:text-emerald-600" }, "Sejarah Islam")), /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/playground",
      class: "font-semibold text-emerald-600 hover:underline"
    },
    "API Playground"
  )))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "mb-4 font-semibold text-slate-900" }, "Official Sources"), /* @__PURE__ */ jsx("ul", { class: "space-y-2 text-sm text-slate-500" }, /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://quran.kemenag.go.id/",
      target: "_blank",
      class: "flex gap-1 items-center hover:text-emerald-600"
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
  )))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "mb-4 font-semibold text-slate-900" }, "Community Repos"), /* @__PURE__ */ jsx("ul", { class: "space-y-2 text-sm text-slate-500" }, /* @__PURE__ */ jsx("li", null, /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://github.com/Otangid/muslim-api",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "Dataset keislaman"
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
  )))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "mb-4 font-semibold text-slate-900" }, "Inspiration"), /* @__PURE__ */ jsx("p", { class: "text-sm leading-relaxed text-slate-500" }, "Original template by", " ", /* @__PURE__ */ jsx(
    "a",
    {
      href: "http://www.designstub.com/",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "Designstub"
  ))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "mb-4 font-semibold text-slate-900" }, "Support Project"), /* @__PURE__ */ jsx(
    "div",
    {
      onclick: "window.openDonationModal()",
      class: "flex gap-3 items-center p-3 mb-3 w-full bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 shadow-sm transition-all cursor-pointer group hover:border-emerald-300 hover:shadow-md"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-10 h-10 text-white bg-emerald-600 rounded-lg shadow-lg transition-transform shadow-emerald-200 group-hover:scale-110" }, /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "w-6 h-6",
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
          d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        }
      )
    )),
    /* @__PURE__ */ jsx("div", { class: "text-left" }, /* @__PURE__ */ jsx("div", { class: "text-[10px] text-emerald-600 font-medium" }, "Donasi via QRIS"), /* @__PURE__ */ jsx("div", { class: "text-xs font-bold text-slate-900" }, "Support Developer"))
  ))), /* @__PURE__ */ jsx("div", { class: "pt-8 mt-12 text-center border-t border-slate-100" }, /* @__PURE__ */ jsx("p", { class: "mb-4 text-sm text-slate-500" }, "Dikembangkan dengan \u2764\uFE0F untuk Ummat."), /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-400" }, "\xA9 ", (/* @__PURE__ */ new Date()).getFullYear(), " Muslim All-in-One API. Created by Vrush Studio.")))), /* @__PURE__ */ jsx(
    "div",
    {
      id: "donation-modal",
      class: "fixed inset-0 z-[100] hidden overflow-y-auto",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center px-4 pt-4 pb-20 min-h-screen text-center sm:block sm:p-0" }, /* @__PURE__ */ jsx(
      "div",
      {
        class: "fixed inset-0 backdrop-blur-sm transition-opacity bg-slate-900/60",
        onclick: "window.closeDonationModal()",
        style: "z-index: -1;"
      }
    ), /* @__PURE__ */ jsx(
      "span",
      {
        class: "hidden sm:inline-block sm:align-middle sm:h-screen",
        "aria-hidden": "true"
      },
      "\u200B"
    ), /* @__PURE__ */ jsx("div", { class: "inline-block overflow-hidden relative z-10 text-left align-bottom bg-white rounded-3xl border shadow-2xl transition-all transform sm:my-8 sm:align-middle sm:max-w-md sm:w-full border-slate-100" }, /* @__PURE__ */ jsx("div", { class: "flex relative z-20 justify-between items-center px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600" }, /* @__PURE__ */ jsx("div", { class: "flex gap-3 items-center text-white" }, /* @__PURE__ */ jsx("div", { class: "p-2 rounded-lg backdrop-blur-md bg-white/20" }, /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "w-5 h-5",
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
    )), /* @__PURE__ */ jsx("h3", { class: "text-lg font-bold leading-6", id: "modal-title" }, "Dukung Muslim API")), /* @__PURE__ */ jsx(
      "button",
      {
        onclick: "window.closeDonationModal()",
        class: "transition-colors text-white/80 hover:text-white"
      },
      /* @__PURE__ */ jsx(
        "svg",
        {
          class: "w-6 h-6",
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
    )), /* @__PURE__ */ jsx("div", { class: "px-6 py-6" }, /* @__PURE__ */ jsx("div", { id: "donation-options-section" }, /* @__PURE__ */ jsx("p", { class: "mb-6 text-sm text-center text-slate-600" }, "Pilih atau masukkan nominal donasi untuk mendukung pengembangan Muslim API."), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-3 gap-3 mb-6" }, [5e3, 1e4, 2e4, 5e4, 1e5, 25e4].map((amount) => /* @__PURE__ */ jsx(
      "button",
      {
        onclick: `window.selectPreset(${amount})`,
        class: "relative z-20 px-2 py-3 text-sm font-bold rounded-xl border transition-all preset-btn bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      },
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
    ))), /* @__PURE__ */ jsx("div", { class: "relative z-20 mb-6" }, /* @__PURE__ */ jsx("div", { class: "flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none" }, /* @__PURE__ */ jsx("span", { class: "font-bold text-slate-400" }, "Rp")), /* @__PURE__ */ jsx(
      "input",
      {
        type: "number",
        id: "custom-amount",
        class: "block py-4 pr-4 pl-12 w-full text-lg font-bold rounded-2xl border transition-all bg-slate-50 border-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
        placeholder: "Nominal lainnya..."
      }
    )), /* @__PURE__ */ jsx(
      "button",
      {
        id: "generate-qris-btn",
        onclick: "window.generateDonationQR()",
        class: "flex relative z-20 gap-2 justify-center items-center py-4 w-full font-bold text-white rounded-2xl shadow-xl transition-all bg-slate-900 hover:bg-slate-800 shadow-slate-200"
      },
      "Generate QRIS"
    )), /* @__PURE__ */ jsx("div", { id: "qris-display-section", class: "hidden text-center" }, /* @__PURE__ */ jsx("div", { class: "mb-4" }, /* @__PURE__ */ jsx("div", { id: "display-amount", class: "text-2xl font-black text-slate-800" }, "Rp 0"), /* @__PURE__ */ jsx("div", { class: "text-xs font-medium text-slate-400" }, "Scan QRIS untuk membayar"), /* @__PURE__ */ jsx("div", { class: "text-xs font-medium text-slate-400" }, "dan akan diarahkan ke Hariistimewa.com - DANA")), /* @__PURE__ */ jsx("div", { class: "inline-block p-4 mb-6 bg-white rounded-2xl border-2 shadow-sm border-slate-100" }, /* @__PURE__ */ jsx("img", { id: "qris-image", src: "", alt: "QRIS", class: "w-64 h-64" })), /* @__PURE__ */ jsx("div", { class: "p-4 mb-6 text-left rounded-xl bg-slate-50" }, /* @__PURE__ */ jsx("div", { class: "flex gap-3 items-start" }, /* @__PURE__ */ jsx("div", { class: "w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" }, "1"), /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-600" }, "Buka aplikasi pembayaran (Gopay, OVO, Dana, LinkAja, atau Mobile Banking).")), /* @__PURE__ */ jsx("div", { class: "flex gap-3 items-start mt-3" }, /* @__PURE__ */ jsx("div", { class: "w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" }, "2"), /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-600" }, "Pilih menu ", /* @__PURE__ */ jsx("b", null, "Scan/Bayar"), " lalu arahkan kamera ke QR Code di atas.")), /* @__PURE__ */ jsx("div", { class: "flex gap-3 items-start mt-3" }, /* @__PURE__ */ jsx("div", { class: "w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" }, "3"), /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-600" }, "Pastikan nominal sesuai dan selesaikan pembayaran."))), /* @__PURE__ */ jsx(
      "button",
      {
        onclick: "window.resetDonationModal()",
        class: "text-sm font-bold text-emerald-600 hover:underline"
      },
      "Ganti Nominal"
    )))))
  ), /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `
          window.openDonationModal = function() {
            document.getElementById('donation-modal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
          }

          window.closeDonationModal = function() {
            document.getElementById('donation-modal').classList.add('hidden');
            document.body.style.overflow = 'auto';
            window.resetDonationModal();
          }

          window.selectPreset = function(amount) {
            const input = document.getElementById('custom-amount');
            input.value = amount;
            
            // Highlight selected preset
            document.querySelectorAll('.preset-btn').forEach(btn => {
              btn.classList.remove('border-emerald-500', 'bg-emerald-50', 'ring-2', 'ring-emerald-500/20');
            });
            
            event.currentTarget.classList.add('border-emerald-500', 'bg-emerald-50', 'ring-2', 'ring-emerald-500/20');
          }

          window.generateDonationQR = async function() {
            const amountInput = document.getElementById('custom-amount');
            const amount = parseInt(amountInput.value);
            const btn = document.getElementById('generate-qris-btn');
            
            if (!amount || amount < 1000) {
              alert('Pilh atau masukkan nominal donasi');
              return;
            }

            btn.disabled = true;
            btn.innerHTML = '<svg class="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...';

            try {
              const response = await fetch('/api/qris/generate?amount=' + amount);
              const result = await response.json();

              if (result.status === 200) {
                document.getElementById('donation-options-section').classList.add('hidden');
                document.getElementById('qris-display-section').classList.remove('hidden');
                
                document.getElementById('display-amount').innerText = new Intl.NumberFormat('id-ID', { 
                  style: 'currency', 
                  currency: 'IDR', 
                  minimumFractionDigits: 0 
                }).format(amount);
                
                document.getElementById('qris-image').src = result.data.qr_image;
              } else {
                alert('Gagal generate QRIS: ' + result.message);
              }
            } catch (error) {
              console.error('Error:', error);
              alert('Terjadi kesalahan saat generate QRIS');
            } finally {
              btn.disabled = false;
              btn.innerHTML = 'Generate QRIS';
            }
          }

          window.resetDonationModal = function() {
            document.getElementById('donation-options-section').classList.remove('hidden');
            document.getElementById('qris-display-section').classList.add('hidden');
            document.getElementById('custom-amount').value = '';
            document.querySelectorAll('.preset-btn').forEach(btn => {
              btn.classList.remove('border-emerald-500', 'bg-emerald-50', 'ring-2', 'ring-emerald-500/20');
            });
          }

          // Close on ESC
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
              window.closeDonationModal();
            }
          });
        ` } })));
};

// src/components/Home.jsx
var ApiEndpoint = ({ method, path: path3, title: title3, responseJson, category, endpointId }) => /* @__PURE__ */ jsx("div", { class: "overflow-hidden mb-8 bg-white rounded-xl border shadow-sm transition-all duration-300 border-slate-200 hover:shadow-md" }, /* @__PURE__ */ jsx("div", { class: "flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50" }, /* @__PURE__ */ jsx("h4", { class: "font-semibold text-slate-900" }, title3), /* @__PURE__ */ jsx("div", { class: "flex gap-2" }, /* @__PURE__ */ jsx("span", { class: `px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${method === "GET" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}` }, method))), /* @__PURE__ */ jsx("div", { class: "p-6" }, /* @__PURE__ */ jsx("div", { class: "flex gap-2 items-center mb-6 group" }, /* @__PURE__ */ jsx("div", { class: "flex flex-grow gap-2 items-center px-3 py-2 rounded-lg border transition-colors bg-slate-100 border-slate-200 group-hover:border-emerald-200" }, /* @__PURE__ */ jsx("code", { class: "font-mono text-sm truncate text-slate-600" }, path3)), /* @__PURE__ */ jsx("div", { class: "flex gap-2" }, /* @__PURE__ */ jsx(
  "button",
  {
    onclick: `window.openApiModal('${category}', '${endpointId}', '/v1${path3}')`,
    class: "p-2 rounded-lg transition-all text-slate-400 hover:text-blue-600 hover:bg-blue-50",
    title: "Try in Playground"
  },
  /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" }), /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }))
), /* @__PURE__ */ jsx(
  "button",
  {
    onclick: `navigator.clipboard.writeText(window.location.origin + '/v1${path3}')`,
    class: "p-2 rounded-lg transition-all text-slate-400 hover:text-emerald-600 hover:bg-emerald-50",
    title: "Copy URL"
  },
  /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8.5V11a.5.5 0 00-.5-.5H9.75a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h.75a.5.5 0 00.5-.5z" }))
))), /* @__PURE__ */ jsx("div", { class: "space-y-4" }, /* @__PURE__ */ jsx("details", { class: "group" }, /* @__PURE__ */ jsx("summary", { class: "flex gap-2 items-center text-sm font-medium list-none transition-colors cursor-pointer text-slate-500 hover:text-emerald-600" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-4 h-4 transition-transform group-open:rotate-180", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 9l-7 7-7-7" })), "Example Response"), /* @__PURE__ */ jsx("div", { class: "mt-4 duration-300 animate-in fade-in slide-in-from-top-2" }, /* @__PURE__ */ jsx("pre", { class: "text-[11px] leading-relaxed shadow-inner" }, /* @__PURE__ */ jsx("code", null, responseJson)))))));
var SectionTitle = ({ title: title3, icon, id, color = "emerald" }) => /* @__PURE__ */ jsx("div", { id, class: "flex gap-3 items-center mb-8 scroll-mt-24" }, /* @__PURE__ */ jsx("div", { class: `flex justify-center items-center w-10 h-10 rounded-lg shadow-lg bg-${color}-600 shadow-${color}-100` }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-6 h-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: icon }))), /* @__PURE__ */ jsx("h2", { class: "text-2xl font-bold text-slate-900" }, title3));
var Home = ({ baseUrl }) => {
  return /* @__PURE__ */ jsx("div", { class: "px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-12 lg:grid-cols-4" }, /* @__PURE__ */ jsx("aside", { class: "hidden sticky top-28 col-span-1 self-start lg:block" }, /* @__PURE__ */ jsx("div", { class: "p-6 bg-white rounded-2xl border shadow-sm border-slate-200" }, /* @__PURE__ */ jsx("h3", { class: "px-3 mb-4 text-xs font-bold tracking-wider uppercase text-slate-400" }, "Menu"), /* @__PURE__ */ jsx("nav", { class: "space-y-1" }, [
    { name: "Introduction", href: "#intro", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Quran", href: "#quran", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { name: "Integrity", href: "#integrity", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { name: "FAQ", href: "#faq", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
  ].map((item, index) => /* @__PURE__ */ jsx(
    "a",
    {
      key: index,
      href: item.href,
      class: "flex gap-3 items-center px-3 py-2 text-sm font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 group"
    },
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-4 h-4 transition-colors text-slate-400 group-hover:text-emerald-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: item.icon })),
    item.name
  ))))), /* @__PURE__ */ jsx("div", { class: "col-span-1 lg:col-span-3" }, /* @__PURE__ */ jsx("section", { id: "intro", class: "mb-20 scroll-mt-24" }, /* @__PURE__ */ jsx("div", { class: "flex flex-wrap gap-3 mb-6" }, /* @__PURE__ */ jsx("div", { class: "inline-flex gap-2 items-center px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full" }, /* @__PURE__ */ jsx("span", { class: "flex relative w-2 h-2" }, /* @__PURE__ */ jsx("span", { class: "inline-flex absolute w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping" }), /* @__PURE__ */ jsx("span", { class: "inline-flex relative w-2 h-2 bg-emerald-500 rounded-full" })), "v1.0.0 Stable"), /* @__PURE__ */ jsx("div", { class: "inline-flex gap-2 items-center px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "3", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V12m0 9.472c-2.28 0-4.47-.636-6.342-1.742L12 12l6.342 7.73A11.955 11.955 0 0112 21.472z" })), "Verified Data Source: Kemenag RI")), /* @__PURE__ */ jsx("h1", { class: "mb-6 text-4xl font-extrabold tracking-tight md:text-5xl text-slate-900" }, "Muslim ", /* @__PURE__ */ jsx("span", { class: "block text-emerald-600 md:inline" }, "All-in-One API")), /* @__PURE__ */ jsx("p", { class: "mb-10 max-w-3xl text-xl leading-relaxed text-slate-600" }, "Akses data keislaman terlengkap dengan performa tinggi. Dibangun untuk pengembang yang ingin membuat aplikasi islami."), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-6 mb-10 md:grid-cols-2" }, /* @__PURE__ */ jsx("div", { class: "p-6 bg-white rounded-2xl border shadow-sm border-slate-200" }, /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center mb-4 w-10 h-10 text-emerald-600 bg-emerald-100 rounded-xl" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }))), /* @__PURE__ */ jsx("h3", { class: "mb-2 font-bold text-slate-900" }, "Base URL"), /* @__PURE__ */ jsx("div", { class: "flex gap-2 justify-between items-center p-2 rounded-lg border bg-slate-50 border-slate-100 group" }, /* @__PURE__ */ jsx("code", { class: "font-mono text-sm font-bold text-emerald-600 truncate" }, baseUrl), /* @__PURE__ */ jsx(
    "button",
    {
      onclick: `navigator.clipboard.writeText('${baseUrl}')`,
      class: "p-1.5 rounded-md transition-all text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 shrink-0",
      title: "Copy Base URL"
    },
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" }))
  ))), /* @__PURE__ */ jsx("div", { class: "p-6 bg-white rounded-2xl border shadow-sm border-slate-200" }, /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center mb-4 w-10 h-10 text-blue-600 bg-blue-100 rounded-xl" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }))), /* @__PURE__ */ jsx("h3", { class: "mb-2 font-bold text-slate-900" }, "Format"), /* @__PURE__ */ jsx("div", { class: "flex gap-2 items-center p-2 rounded-lg border bg-slate-50 border-slate-100" }, /* @__PURE__ */ jsx("code", { class: "font-mono text-sm font-bold text-blue-600" }, "application/json"))))), /* @__PURE__ */ jsx(
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
    SectionTitle,
    {
      id: "ayah",
      title: "Ayat & Al-Quran",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "emerald"
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
      path: "/ayah/find?query=puasa",
      category: "quran",
      endpointId: "ayah-find",
      responseJson: `{
  "status": true,
  "message": "Berhasil mencari ayat dengan kata kunci 'puasa'.",
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
      title: "Integrity Chain",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      color: "emerald"
    }
  ), /* @__PURE__ */ jsx("div", { className: "p-4 mb-6 bg-emerald-50 rounded-r-lg border-l-4 border-emerald-500" }, /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm font-medium text-emerald-800" }, "\u{1F6E1}\uFE0F ", /* @__PURE__ */ jsx("strong", null, "Data Integrity Proof:"), ' Kami menggunakan teknologi cryptographic hashing (SHA-256) untuk memastikan kemurnian teks Al-Quran. Setiap Surah dan Ayah memiliki "Digital Fingerprint" yang unik. Jika ada perubahan satu karakter saja pada data kami, maka hash integrity akan berubah.'), /* @__PURE__ */ jsx("details", { class: "text-xs text-emerald-700 cursor-pointer" }, /* @__PURE__ */ jsx("summary", { class: "font-bold hover:underline" }, "Cara Verifikasi Mandiri (Standard Industri)"), /* @__PURE__ */ jsx("div", { class: "p-4 mt-3 space-y-3 rounded-lg bg-white/50" }, /* @__PURE__ */ jsx("p", null, "Anda dapat memverifikasi keaslian data secara manual:"), /* @__PURE__ */ jsx("ol", { class: "space-y-1 list-decimal list-inside" }, /* @__PURE__ */ jsx("li", null, "Ambil data mentah dari ", /* @__PURE__ */ jsx("code", { class: "px-1 bg-emerald-100 rounded" }, "/v1/ayah/surah?surahId=1")), /* @__PURE__ */ jsx("li", null, "Ekstrak field ", /* @__PURE__ */ jsx("code", { class: "px-1 bg-emerald-100 rounded" }, "arab"), " dan ", /* @__PURE__ */ jsx("code", { class: "px-1 bg-emerald-100 rounded" }, "text")), /* @__PURE__ */ jsx("li", null, "Lakukan hashing SHA-256 pada array tersebut"), /* @__PURE__ */ jsx("li", null, "Bandingkan dengan ", /* @__PURE__ */ jsx("code", { class: "px-1 bg-emerald-100 rounded" }, "content_hash"), " di ", /* @__PURE__ */ jsx("code", { class: "px-1 bg-emerald-100 rounded" }, "/v1/integrity/chain"))), /* @__PURE__ */ jsx("div", { class: "mt-2" }, /* @__PURE__ */ jsx("p", { class: "mb-1 font-bold" }, "Snippet Node.js:"), /* @__PURE__ */ jsx("pre", { class: "overflow-x-auto p-2 text-emerald-400 rounded-md bg-slate-900" }, `const crypto = require('crypto');
const data = ayahs.map(a => ({ arab: a.arab, text: a.text }));
const hash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');`))))), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Integrity Chain (Proof of Authenticity)",
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
    "local_data": {
      "arab": "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631" + "\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650",
      "text": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
    },
    "hash": "e3b0c442...",
    "comparison": {
      "status": "Success",
      "source": "Kemenag (via EQuran.id)",
      "is_match": true,
      "details": {
        "arab_match": true,
        "translation_match": true
      },
      "external_data": {
        "arab": "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631" + "\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650",
        "text": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
      }
    },
    "external_verification_url": "https://quran.kemenag.go.id/quran/per-ayat/surah/1?from=1&to=1",
    "timestamp": "2025-12-24T00:00:00Z"
  }
}`
    }
  ), /* @__PURE__ */ jsx("div", { class: "mt-12 mb-6" }, /* @__PURE__ */ jsx("h3", { class: "pl-4 text-2xl font-bold text-emerald-800 border-l-4 border-emerald-500" }, "Spiritual Analytics (Global)"), /* @__PURE__ */ jsx("p", { class: "mt-2 text-slate-600" }, "Statistik penggunaan global untuk melihat tren pembacaan Al-Qur'an dan laporan khatam kolektif.")), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Global Analytics",
      method: "GET",
      path: "/analytics",
      category: "analytics",
      endpointId: "analytics-global",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan statistik spiritual global.",
  "data": {
    "total_reads": 1250,
    "global_khatam_count": 5,
    "trending_surahs": [
      { "id": "1", "name": "Al-Fatihah", "reads": 450 },
      { "id": "18", "name": "Al-Kahf", "reads": 320 }
    ],
    "last_updated": "2025-12-24T00:00:00Z"
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint,
    {
      title: "Lapor Khatam (Post)",
      method: "POST",
      path: "/analytics/khatam",
      category: "analytics",
      endpointId: "analytics-khatam",
      responseJson: `{
  "status": true,
  "message": "Alhamdulillah! Satu khatam baru telah tercatat dalam statistik global. Semoga berkah."
}`
    }
  ), /* @__PURE__ */ jsx("div", { class: "overflow-hidden relative p-8 mb-20 text-white bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-xl group" }, /* @__PURE__ */ jsx("div", { class: "absolute -right-10 -bottom-10 opacity-10 transition-transform duration-500 group-hover:scale-110" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-64 h-64", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }))), /* @__PURE__ */ jsx("div", { class: "relative z-10" }, /* @__PURE__ */ jsx("h3", { class: "mb-3 text-2xl font-bold" }, "Butuh Resource Lainnya?"), /* @__PURE__ */ jsx("p", { class: "mb-6 max-w-lg text-emerald-50" }, "Temukan API tambahan seperti Murottal, Jadwal Sholat, Kalender Hijriah, Hadits, Asmaul Husna, dan banyak lagi di halaman Resources."), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other",
      class: "inline-flex gap-2 items-center px-6 py-3 font-bold text-emerald-700 bg-white rounded-xl shadow-lg transition-colors hover:bg-emerald-50"
    },
    "Eksplor Other Resources",
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M14 5l7 7-7 7" }))
  ))), /* @__PURE__ */ jsx(
    SectionTitle,
    {
      id: "widgets",
      title: "Widget Dashboard",
      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
      color: "blue"
    }
  ), /* @__PURE__ */ jsx("div", { class: "p-8 mb-12 bg-white rounded-2xl border shadow-sm border-slate-200" }, /* @__PURE__ */ jsx("p", { class: "mb-8 text-slate-600" }, "Ingin memasang jadwal sholat atau ayat harian di website Anda? Gunakan kode embed sederhana di bawah ini. Anda dapat menyesuaikan tampilan melalui parameter URL."), /* @__PURE__ */ jsx("div", { class: "space-y-10" }, /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "flex gap-2 items-center mb-4 font-bold text-slate-900" }, /* @__PURE__ */ jsx("span", { class: "flex justify-center items-center w-8 h-8 text-sm text-blue-600 bg-blue-100 rounded-lg" }, "1"), "Widget Jadwal Sholat"), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-6 lg:grid-cols-2" }, /* @__PURE__ */ jsx("div", { class: "space-y-4" }, /* @__PURE__ */ jsx("p", { class: "text-sm text-slate-500" }, "Salin kode di bawah ini ke dalam HTML Anda:"), /* @__PURE__ */ jsx("div", { class: "relative group" }, /* @__PURE__ */ jsx("pre", { class: "overflow-x-auto p-4 text-xs rounded-xl bg-slate-900 text-slate-300" }, `<iframe 
  src="${baseUrl.replace("/v1", "")}/widget/sholat?city=jakarta" 
  width="300" 
  height="400" 
  frameborder="0"
></iframe>`), /* @__PURE__ */ jsx(
    "button",
    {
      onclick: `navigator.clipboard.writeText('<iframe src="${baseUrl.replace("/v1", "")}/widget/sholat?city=jakarta" width="300" height="400" frameborder="0"></iframe>')`,
      class: "absolute top-2 right-2 p-2 text-white rounded-lg opacity-0 transition-all bg-white/10 hover:bg-white/20 group-hover:opacity-100"
    },
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" }))
  ))), /* @__PURE__ */ jsx("div", { class: "bg-slate-50 rounded-xl p-2 border border-slate-200 flex items-center justify-center min-h-[420px] overflow-hidden" }, /* @__PURE__ */ jsx(
    "iframe",
    {
      src: `${baseUrl.replace("/v1", "")}/widget/sholat?city=jakarta`,
      width: "300",
      height: "400",
      frameborder: "0",
      class: "rounded-xl shadow-lg"
    }
  )))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "flex gap-2 items-center mb-4 font-bold text-slate-900" }, /* @__PURE__ */ jsx("span", { class: "flex justify-center items-center w-8 h-8 text-sm text-emerald-600 bg-emerald-100 rounded-lg" }, "2"), "Widget Ayat Harian"), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-6 lg:grid-cols-2" }, /* @__PURE__ */ jsx("div", { class: "space-y-4" }, /* @__PURE__ */ jsx("p", { class: "text-sm text-slate-500" }, "Salin kode di bawah ini ke dalam HTML Anda:"), /* @__PURE__ */ jsx("div", { class: "relative group" }, /* @__PURE__ */ jsx("pre", { class: "overflow-x-auto p-4 text-xs rounded-xl bg-slate-900 text-slate-300" }, `<iframe 
  src="${baseUrl.replace("/v1", "")}/widget/ayat" 
  width="400" 
  height="300" 
  frameborder="0"
></iframe>`), /* @__PURE__ */ jsx(
    "button",
    {
      onclick: `navigator.clipboard.writeText('<iframe src="${baseUrl.replace("/v1", "")}/widget/ayat" width="400" height="300" frameborder="0"></iframe>')`,
      class: "absolute top-2 right-2 p-2 text-white rounded-lg opacity-0 transition-all bg-white/10 hover:bg-white/20 group-hover:opacity-100"
    },
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" }))
  ))), /* @__PURE__ */ jsx("div", { class: "bg-slate-50 rounded-xl p-2 border border-slate-200 flex items-center justify-center min-h-[320px] overflow-hidden" }, /* @__PURE__ */ jsx(
    "iframe",
    {
      src: `${baseUrl.replace("/v1", "")}/widget/ayat`,
      width: "400",
      height: "300",
      frameborder: "0",
      class: "rounded-xl shadow-lg"
    }
  )))))), /* @__PURE__ */ jsx(
    SectionTitle,
    {
      id: "faq",
      title: "Pertanyaan Umum",
      icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "slate"
    }
  ), /* @__PURE__ */ jsx("div", { class: "mb-20 space-y-4" }, [
    {
      q: "Apa itu Muslim All-in-One API?",
      a: "Muslim All-in-One API adalah proyek open-source yang bertujuan menyediakan akses data keislaman (Al-Quran, Jadwal Sholat, Hadits, dll) dalam satu platform yang cepat, gratis, dan mudah digunakan oleh pengembang aplikasi."
    },
    {
      q: "Bagaimana keaslian dan akurasi data Al-Quran?",
      a: "Kami menjamin keaslian data Al-Quran dalam API ini. Data teks, terjemahan, dan tafsir (Wajiz & Tahlili) diwarisi dari dataset muslim-api-three milik Otangid yang telah diverifikasi sesuai dengan data resmi Kemenag RI. Struktur data kami mencakup Tafsir Tahlili yang sangat mendalam, yang merupakan produk intelektual resmi dari Kementerian Agama RI dan mengikuti standar Mushaf Al-Quran Standar Indonesia (MSI)."
    },
    {
      q: "Bagaimana dengan performa dan keamanan?",
      a: "API ini sudah dilengkapi dengan 'Enterprise-grade Caching' (SWR) yang membuat respon sangat cepat lewat CDN. Kami juga menerapkan CORS policy and Rate Limiting untuk menjaga stabilitas server dari penggunaan berlebihan."
    },
    {
      q: "Apakah data ini sesuai dengan sumber resmi Kemenag?",
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
      q: "Bagaimana jika saya menemukan perbedaan dengan mushaf resmi Kemenag?",
      a: "Meskipun kami berusaha 100% akurat, kesalahan manusia dalam entry data bisa saja terjadi. Jika Anda menemukan perbedaan teks atau tanda baca dengan quran.kemenag.go.id, silakan laporkan melalui GitHub Issues. Kami menyediakan endpoint Admin khusus untuk melakukan koreksi instan secara lokal sebelum di-push ke server, sehingga perbaikan dapat dilakukan dengan sangat cepat tanpa menunggu siklus rilis yang lama."
    },
    {
      q: "Bagaimana cara melakukan perubahan data atau memperbaiki typo?",
      a: "Data lokal seperti Al-Quran, Dzikir, dan Doa disimpan dalam format JSON di folder `src/data`. Anda dapat melakukan koreksi langsung pada file tersebut. Berkat sistem Integrity Chain kami, setiap perubahan pada teks Al-Quran akan secara otomatis mengubah 'Digital Fingerprint' (hash) pada sistem, sehingga transparansi data tetap terjaga."
    },
    {
      q: "Bagaimana jika saya menemukan kesalahan penulisan atau bug?",
      a: "Kami sangat menghargai laporan Anda. Jika Anda adalah pengguna API, silakan laporkan melalui Issue di repository GitHub kami. Jika Anda adalah pengembang, Anda dapat melakukan Pull Request atau memperbaiki data langsung di file JSON lokal."
    },
    {
      q: "Apakah API ini gratis untuk digunakan?",
      a: "Ya, API ini 100% gratis untuk digunakan baik untuk proyek personal, pendidikan, maupun komersial tanpa perlu kunci API (API Key)."
    },
    {
      q: "Apakah ada batasan rate limit?",
      a: "Saat ini tidak ada batasan rate limit yang ketat, namun kami menyarankan untuk melakukan caching di sisi aplikasi Anda untuk performa terbaik dan menjaga keberlangsungan layanan."
    }
  ].map((faq, index) => /* @__PURE__ */ jsx("details", { key: index, class: "overflow-hidden bg-white rounded-2xl border shadow-sm group border-slate-200" }, /* @__PURE__ */ jsx("summary", { class: "flex justify-between items-center p-6 list-none cursor-pointer" }, /* @__PURE__ */ jsx("span", { class: "font-bold text-slate-900" }, faq.q), /* @__PURE__ */ jsx("span", { class: "text-emerald-500 transition-transform group-open:rotate-180" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 9l-7 7-7-7" })))), /* @__PURE__ */ jsx("div", { class: "px-6 pt-4 pb-6 leading-relaxed border-t text-slate-600 border-slate-50" }, faq.a)))), /* @__PURE__ */ jsx("div", { class: "p-10 mb-20 text-center text-white rounded-3xl bg-slate-900" }, /* @__PURE__ */ jsx("h2", { class: "mb-4 text-3xl font-bold" }, "Siap untuk Membangun?"), /* @__PURE__ */ jsx("p", { class: "mx-auto mb-8 max-w-xl text-slate-400" }, "Mulai integrasikan Muslim API ke dalam aplikasi Anda hari ini. Gratis, cepat, dan terpercaya."), /* @__PURE__ */ jsx("div", { class: "flex flex-wrap gap-4 justify-center" }, /* @__PURE__ */ jsx("a", { href: "/playground", class: "px-8 py-3 font-bold text-white bg-emerald-600 rounded-xl shadow-lg transition-all hover:bg-emerald-700 shadow-emerald-900/20" }, "Coba di Playground"), /* @__PURE__ */ jsx("a", { href: "https://github.com/vrush2000/muslim-all-in-one-api", target: "_blank", class: "px-8 py-3 font-bold text-white rounded-xl border transition-all bg-slate-800 hover:bg-slate-700 border-slate-700" }, "GitHub Repository"))))));
};

// src/components/Other.jsx
var ApiEndpoint2 = ({
  method,
  path: path3,
  title: title3,
  responseJson,
  category,
  endpointId
}) => /* @__PURE__ */ jsx("div", { class: "overflow-hidden mb-8 bg-white rounded-xl border shadow-sm transition-all duration-300 border-slate-200 hover:shadow-md" }, /* @__PURE__ */ jsx("div", { class: "flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50" }, /* @__PURE__ */ jsx("h4", { class: "font-semibold text-slate-900" }, title3), /* @__PURE__ */ jsx("div", { class: "flex gap-2" }, /* @__PURE__ */ jsx(
  "span",
  {
    class: `px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${method === "GET" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`
  },
  method
))), /* @__PURE__ */ jsx("div", { class: "p-6" }, /* @__PURE__ */ jsx("div", { class: "flex gap-2 items-center mb-6 group" }, /* @__PURE__ */ jsx("div", { class: "flex flex-grow gap-2 items-center px-3 py-2 rounded-lg border transition-colors bg-slate-100 border-slate-200 group-hover:border-emerald-200" }, /* @__PURE__ */ jsx("code", { class: "font-mono text-sm truncate text-slate-600" }, path3)), /* @__PURE__ */ jsx("div", { class: "flex gap-2" }, /* @__PURE__ */ jsx(
  "button",
  {
    onclick: `window.openApiModal('${category}', '${endpointId}', '/v1${path3}')`,
    class: "p-2 rounded-lg transition-all text-slate-400 hover:text-blue-600 hover:bg-blue-50",
    title: "Try in Playground"
  },
  /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "w-5 h-5",
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
  )
), /* @__PURE__ */ jsx(
  "button",
  {
    onclick: `navigator.clipboard.writeText(window.location.origin + '/v1${path3}')`,
    class: "p-2 rounded-lg transition-all text-slate-400 hover:text-emerald-600 hover:bg-emerald-50",
    title: "Copy URL"
  },
  /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "w-5 h-5",
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
        d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8.5V11a.5.5 0 00-.5-.5H9.75a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h.75a.5.5 0 00.5-.5z"
      }
    )
  )
))), /* @__PURE__ */ jsx("div", { class: "space-y-4" }, /* @__PURE__ */ jsx("details", { class: "group" }, /* @__PURE__ */ jsx("summary", { class: "flex gap-2 items-center text-sm font-medium list-none transition-colors cursor-pointer text-slate-500 hover:text-emerald-600" }, /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    class: "w-4 h-4 transition-transform group-open:rotate-180",
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
), "Example Response"), /* @__PURE__ */ jsx("div", { class: "mt-4 duration-300 animate-in fade-in slide-in-from-top-2" }, /* @__PURE__ */ jsx("pre", { class: "text-[11px] leading-relaxed shadow-inner" }, /* @__PURE__ */ jsx("code", null, responseJson)))))));
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
  return /* @__PURE__ */ jsx("div", { id, class: "flex gap-3 items-center mb-8 scroll-mt-24" }, /* @__PURE__ */ jsx(
    "div",
    {
      class: `w-10 h-10 ${colorClasses[color] || colorClasses.emerald} rounded-lg flex items-center justify-center shadow-lg`
    },
    /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "w-6 h-6 text-white",
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
          d: icon
        }
      )
    )
  ), /* @__PURE__ */ jsx("h2", { class: "text-2xl font-bold text-slate-900" }, title3));
};
var Other = () => {
  return /* @__PURE__ */ jsx("div", { class: "px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-12 lg:grid-cols-4" }, /* @__PURE__ */ jsx("aside", { class: "hidden sticky top-28 col-span-1 self-start lg:block" }, /* @__PURE__ */ jsx("div", { class: "p-6 bg-white rounded-2xl border shadow-sm border-slate-200" }, /* @__PURE__ */ jsx("h3", { class: "px-3 mb-4 text-xs font-bold tracking-wider uppercase text-slate-400" }, "Menu Other API"), /* @__PURE__ */ jsx("nav", { class: "space-y-1" }, [
    {
      name: "Murottal",
      href: "#murottal",
      icon: "M11 5.882V19.118a3.63 3.63 0 01-5.12 3.574L1 18.817V5.183L5.88 1.309a3.63 3.63 0 015.12 3.573z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    },
    {
      name: "Sholat",
      href: "#sholat",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      name: "Kalender",
      href: "#calendar",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    },
    {
      name: "Hadits",
      href: "#hadits",
      icon: "M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    },
    {
      name: "Asmaul Husna",
      href: "#asma",
      icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"
    },
    {
      name: "Asbabun Nuzul",
      href: "#asbab",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    },
    {
      name: "Dzikir",
      href: "#dzikir",
      icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    },
    {
      name: "Doa-doa",
      href: "#doa",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    },
    {
      name: "Kemenag",
      href: "#kemenag",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    },
    {
      name: "Sejarah",
      href: "#sejarah",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    },
    {
      name: "Puasa Sunnah",
      href: "#puasa",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      name: "Juz & Tema",
      href: "#extra",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    },
    {
      name: "Tools Cerdas",
      href: "#tools",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    },
    {
      name: "Widget Dashboard",
      href: "#widgets",
      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    },
    {
      name: "Resources",
      href: "#resources",
      icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    }
  ].map((item, index) => /* @__PURE__ */ jsx(
    "a",
    {
      key: index,
      href: item.href,
      class: "flex gap-3 items-center px-3 py-2 text-sm font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 group"
    },
    /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "w-4 h-4 transition-colors text-slate-400 group-hover:text-emerald-500",
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
          d: item.icon
        }
      )
    ),
    item.name
  ))))), /* @__PURE__ */ jsx("div", { class: "col-span-1 lg:col-span-3" }, /* @__PURE__ */ jsx("div", { class: "mb-12 max-w-3xl" }, /* @__PURE__ */ jsx("h1", { class: "mb-4 text-4xl font-extrabold tracking-tight text-slate-900" }, "Other Resources"), /* @__PURE__ */ jsx("p", { class: "text-lg text-slate-600" }, "Kumpulan resource dan API lainnya yang mungkin bermanfaat untuk pengembangan aplikasi Anda.")), /* @__PURE__ */ jsx(
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
      title: "Cari Hadits (Query)",
      method: "GET",
      path: "/hadits/find?query=puasa&book=bukhari",
      category: "hadits",
      endpointId: "hadits-find",
      responseJson: `{
  "status": true,
  "message": "Berhasil mencari hadits di kitab Sahih Bukhari dengan kata kunci: puasa.",
  "data": [
    {
      "no": 1901,
      "judul": "Sahih Bukhari",
      "arab": "...",
      "indo": "...",
      "sumber": "HR. Bukhari No. 1901"
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
    { "id": "arbain", "name": "Hadits Arbain Nawawi", "available": 42 },
    { "id": "bukhari", "name": "HR. Bukhari", "available": "Lokal (JSON)" },
    { "id": "muslim", "name": "HR. Muslim", "available": "Lokal (JSON)" }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Detail Hadits per Kitab",
      method: "GET",
      path: "/hadits/books/bukhari/1",
      category: "hadits",
      endpointId: "hadits-book-detail",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan detail hadits nomor 1 dari kitab Sahih Bukhari.",
  "data": {
    "number": 1,
    "arab": "...",
    "id": "Semua perbuatan tergantung niatnya...",
    "name": "HR. Bukhari"
  }
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
      id: "puasa",
      title: "Puasa & Fiqh",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "emerald"
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Daftar Puasa (Wajib & Sunnah)",
      method: "GET",
      path: "/puasa",
      category: "puasa",
      endpointId: "puasa-all",
      responseJson: `{
  "status": true,
  "message": "Berhasil mengambil daftar puasa.",
  "data": [
    {
      "id": 1,
      "nama": "Puasa Senin Kamis",
      "deskripsi": "Puasa sunnah yang dilaksanakan pada hari Senin dan Kamis setiap minggunya.",
      "hukum": "Sunnah",
      "dalil": "...",
      "type": "mingguan"
    },
    {
      "id": 8,
      "nama": "Puasa Ramadhan",
      "deskripsi": "Puasa wajib yang dilaksanakan selama satu bulan penuh di bulan Ramadhan.",
      "hukum": "Wajib (Fardhu 'Ain)",
      "dalil": "...",
      "type": "tahunan",
      "jadwal_hijri": "Ramadhan (sebulan penuh)"
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "70 Masalah Terkait Puasa (Fiqh & Adab)",
      method: "GET",
      path: "/puasa/fiqh",
      category: "puasa",
      endpointId: "puasa-fiqh",
      responseJson: `{
  "status": true,
  "message": "Berhasil mengambil 70 Masalah Terkait Puasa (Fiqh & Adab).",
  "data": [
    {
      "category": "Definisi & Keutamaan",
      "points": [
        {
          "id": 1,
          "title": "Pengertian Puasa",
          "content": "..."
        }
      ]
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Cari Puasa",
      method: "GET",
      path: "/puasa/find?query=ramadhan",
      category: "puasa",
      endpointId: "puasa-find",
      responseJson: `{
  "status": true,
  "message": "Berhasil mencari puasa dengan kata kunci: ramadhan",
  "data": [
    {
      "id": 8,
      "nama": "Puasa Ramadhan",
      "deskripsi": "...",
      "hukum": "Wajib",
      "type": "tahunan"
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Filter by Tipe",
      method: "GET",
      path: "/puasa/type/mingguan",
      category: "puasa",
      endpointId: "puasa-type",
      responseJson: `{
  "status": true,
  "message": "Berhasil mendapatkan daftar puasa sunnah untuk tipe: mingguan",
  "data": [
    {
      "id": 1,
      "nama": "Puasa Senin Kamis",
      ...
    }
  ]
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
      "sumber": "Hadits Arbain No. 1: Amalan Bergantung pada Niat"
    }
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Kalkulator Waris (Faraidh)",
      method: "GET",
      path: "/tools/faraidh?totalHarta=120000000&suami=1&anakLk=1&anakPr=1",
      category: "tools",
      endpointId: "tools-faraidh",
      responseJson: `{
  "status": true,
  "message": "Kalkulasi waris berhasil.",
  "data": {
    "total_harta": 120000000,
    "rincian": [
      { "ahli_waris": "Suami", "jumlah": 1, "bagian_persen": "25.00%", "nominal": 30000000 },
      { "ahli_waris": "Anak Laki-laki", "jumlah": 1, "bagian_persen": "50.00%", "nominal": 60000000 },
      { "ahli_waris": "Anak Perempuan", "jumlah": 1, "bagian_persen": "25.00%", "nominal": 30000000 }
    ],
    "zakat_harta": 3000000,
    "keterangan": "Perhitungan ini menggunakan standar ilmu Faraidh (KHI)...",
    "sumber": "Kompilasi Hukum Islam (KHI) & Fiqh Mawaris"
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    ApiEndpoint2,
    {
      title: "Kalkulator Zakat",
      method: "GET",
      path: "/tools/zakat?type=penghasilan&amount=10000000",
      category: "tools",
      endpointId: "tools-zakat",
      responseJson: `{
  "status": true,
  "message": "Kalkulasi zakat berhasil.",
  "data": {
    "type": "penghasilan",
    "amount": 10000000,
    "nishab": 8500000,
    "isWajib": true,
    "zakat": 250000,
    "keterangan": "Nishab Zakat Penghasilan setara 85 gram emas...",
    "sumber": "BAZNAS (Badan Amil Zakat Nasional)"
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
      title: "Pencarian Semantik (Cross-Source)",
      method: "GET",
      path: "/tools/semantic-search?query=puasa",
      category: "tools",
      endpointId: "tools-semantic-search",
      responseJson: `{
  "status": true,
  "message": "Pencarian semantik untuk 'puasa' berhasil.",
  "data": {
    "query": "puasa",
    "quran": [
      {
        "arab": "...",
        "text": "Hai orang-orang yang beriman, diwajibkan atas kamu berpuasa...",
        "sumber": "QS. Al-Baqarah: 183"
      }
    ],
    "hadits": [
      {
        "arab": "...",
        "text": "Puasa adalah perisai...",
        "sumber": "HR. Bukhari No. 1894"
      }
    ],
    "puasa": [
      {
        "text": "Puasa Ramadhan: Puasa wajib yang dilaksanakan selama satu bulan penuh...",
        "dalil": "QS. Al-Baqarah: 183",
        "sumber": "Fitur Puasa (Wajib (Fardhu 'Ain))"
      }
    ],
    "fiqh": [
      {
        "text": "Keutamaan Puasa",
        "content": "Puasa memiliki banyak keutamaan, di antaranya adalah sebagai penghapus dosa...",
        "sumber": "70 Masalah Puasa - Sumber: islamqa.info"
      }
    ]
  }
}`
    }
  ), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "widgets",
      title: "Widget Dashboard",
      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
      color: "blue"
    }
  ), /* @__PURE__ */ jsx("div", { class: "p-6 mb-12 bg-white rounded-2xl border shadow-sm border-slate-200" }, /* @__PURE__ */ jsx("div", { class: "flex flex-col gap-6 md:flex-row" }, /* @__PURE__ */ jsx("div", { class: "flex-1" }, /* @__PURE__ */ jsx("h3", { class: "mb-4 text-lg font-bold text-slate-800" }, "Cara Menggunakan Widget"), /* @__PURE__ */ jsx("p", { class: "mb-4 text-sm leading-relaxed text-slate-600" }, "Anda dapat menyematkan widget Muslim API ke dalam website Anda sendiri dengan mudah. Cukup salin kode di samping dan tempelkan di bagian manapun di website Anda."), /* @__PURE__ */ jsx("div", { class: "space-y-3" }, /* @__PURE__ */ jsx("div", { class: "flex gap-3 items-start" }, /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center mt-1 w-5 h-5 font-bold text-white bg-blue-500 rounded-full text-[10px]" }, "1"), /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-500" }, "Pilih widget yang sesuai dengan kebutuhan Anda.")), /* @__PURE__ */ jsx("div", { class: "flex gap-3 items-start" }, /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center mt-1 w-5 h-5 font-bold text-white bg-blue-500 rounded-full text-[10px]" }, "2"), /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-500" }, "Sesuaikan parameter (kota, tema, dll) jika diperlukan.")), /* @__PURE__ */ jsx("div", { class: "flex gap-3 items-start" }, /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center mt-1 w-5 h-5 font-bold text-white bg-blue-500 rounded-full text-[10px]" }, "3"), /* @__PURE__ */ jsx("p", { class: "text-xs text-slate-500" }, "Copy-paste kode IFrame ke dalam HTML website Anda.")))), /* @__PURE__ */ jsx("div", { class: "flex-1" }, /* @__PURE__ */ jsx("div", { class: "p-4 rounded-xl bg-slate-900" }, /* @__PURE__ */ jsx("div", { class: "flex justify-between items-center mb-2" }, /* @__PURE__ */ jsx("span", { class: "text-[10px] font-medium text-slate-400 uppercase tracking-wider" }, "Embed Code"), /* @__PURE__ */ jsx("button", { class: "text-[10px] text-blue-400 hover:text-blue-300 transition-colors" }, "Copy Code")), /* @__PURE__ */ jsx("pre", { class: "overflow-x-auto text-[11px] text-blue-300 font-mono" }, `<iframe 
  src="https://muslim-api.vercel.app/widget/jadwal-sholat?kota=jakarta" 
  width="100%" 
  height="400" 
  frameborder="0"
></iframe>`))))), /* @__PURE__ */ jsx(
    SectionTitle2,
    {
      id: "resources",
      title: "Other Resources",
      icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
      color: "emerald"
    }
  ), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-4 mb-12 md:grid-cols-2" }, [
    {
      name: "GitHub Repository",
      url: "https://github.com/vrush2000/muslim-all-in-one-api",
      desc: "Source code and documentation"
    },
    {
      name: "Quran Kemenag",
      url: "https://quran.kemenag.go.id/",
      desc: "Official Quran data from Kemenag RI"
    },
    {
      name: "MyQuran (Prayer Times)",
      url: "https://api.myquran.com/",
      desc: "Prayer times and Islamic schedule API"
    },
    {
      name: "equran.id (Audio)",
      url: "https://equran.id/",
      desc: "Quran audio and digital text"
    },
    {
      name: "Muslim API Dataset (Repo)",
      url: "https://github.com/Otangid/muslim-api",
      desc: "Alternative Muslim API provider"
    },
    {
      name: "Hadith Collection (Repo)",
      url: "https://github.com/gadingnst/hadith-api",
      desc: "Comprehensive Hadith collection API"
    },
    {
      name: "Data Pesantren (Repo)",
      url: "https://github.com/nasrul21/data-pesantren-indonesia",
      desc: "Kumpulan data pesantren se-Indonesia (Source)"
    },
    {
      name: "Libur Nasional (Repo)",
      url: "https://github.com/kresnasatya/api-harilibur",
      desc: "Data hari libur nasional Indonesia (Source)"
    },
    {
      name: "Puasa Sunnah (Source)",
      url: "https://github.com/granitebps/puasa-sunnah-api",
      desc: "Referensi data puasa sunnah"
    }
  ].map((resource) => /* @__PURE__ */ jsx(
    "a",
    {
      href: resource.url,
      target: "_blank",
      rel: "noopener noreferrer",
      class: "p-4 bg-white rounded-xl border transition-all border-slate-200 hover:border-emerald-500 hover:shadow-md group"
    },
    /* @__PURE__ */ jsx("div", { class: "flex justify-between items-center mb-1" }, /* @__PURE__ */ jsx("h4", { class: "font-bold transition-colors text-slate-900 group-hover:text-emerald-600" }, resource.name), /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "w-4 h-4 text-slate-400 group-hover:text-emerald-500",
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
          d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        }
      )
    )),
    /* @__PURE__ */ jsx("p", { class: "text-xs leading-relaxed text-slate-500" }, resource.desc)
  ))))));
};

// src/components/Landing.jsx
var Landing = ({ sejarah: sejarah2 }) => {
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
  return /* @__PURE__ */ jsx("div", { class: "overflow-hidden relative" }, /* @__PURE__ */ jsx("section", { class: "relative pt-20 pb-24 bg-white md:pt-32 md:pb-40" }, /* @__PURE__ */ jsx("div", { class: "relative z-20 px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "inline-flex relative z-30 gap-2 items-center px-4 py-2 mb-8 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-full duration-700 animate-in fade-in slide-in-from-bottom-4" }, /* @__PURE__ */ jsx("span", { class: "flex w-2 h-2" }, /* @__PURE__ */ jsx("span", { class: "inline-flex relative w-2 h-2 bg-emerald-500 rounded-full" })), "Platform Data Islami Terlengkap"), /* @__PURE__ */ jsx("h1", { class: "mb-8 text-4xl font-extrabold tracking-tight duration-1000 sm:text-5xl md:text-7xl text-slate-900 animate-in fade-in slide-in-from-bottom-6" }, "Muslim API ", /* @__PURE__ */ jsx("span", { class: "block text-emerald-600 md:inline-block" }, /* @__PURE__ */ jsx("span", { id: "dynamic-text" }, "All-in-One"), /* @__PURE__ */ jsx("span", { class: "animate-pulse" }, "|"))), /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `
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
          ` } }), /* @__PURE__ */ jsx("p", { class: "mx-auto mb-12 max-w-3xl text-xl leading-relaxed duration-1000 delay-200 md:text-2xl text-slate-600 animate-in fade-in slide-in-from-bottom-8" }, "Infrastruktur data keislaman digital yang cepat, gratis, dan andal. Dirancang untuk mempercepat inovasi dalam dakwah teknologi."), /* @__PURE__ */ jsx("div", { class: "flex flex-col gap-4 justify-center items-center duration-1000 delay-300 sm:flex-row animate-in fade-in slide-in-from-bottom-10" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/docs",
      class: "flex gap-2 justify-center items-center px-8 py-4 w-full text-lg font-bold text-white bg-emerald-600 rounded-2xl shadow-xl transition-all sm:w-auto hover:bg-emerald-700 shadow-emerald-200 hover:shadow-emerald-300"
    },
    "Mulai Dokumentasi",
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M14 5l7 7-7 7" }))
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://github.com/vrush2000/muslim-all-in-one-api",
      target: "_blank",
      class: "flex gap-2 justify-center items-center px-8 py-4 w-full text-lg font-bold rounded-2xl transition-all sm:w-auto bg-slate-100 text-slate-900 hover:bg-slate-200"
    },
    "GitHub Project"
  ))), /* @__PURE__ */ jsx("div", { class: "overflow-hidden absolute inset-0 z-0 pointer-events-none" }, /* @__PURE__ */ jsx("div", { class: "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60" }), /* @__PURE__ */ jsx("div", { class: "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px] opacity-60" }))), /* @__PURE__ */ jsx("section", { class: "py-24 bg-slate-50 border-y border-slate-200" }, /* @__PURE__ */ jsx("div", { class: "px-4 mx-auto max-w-7xl sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-16 items-center lg:grid-cols-2" }, /* @__PURE__ */ jsx("div", { class: "space-y-8" }, /* @__PURE__ */ jsx("div", { class: "inline-block px-4 py-1.5 text-sm font-bold tracking-wider text-emerald-700 uppercase bg-emerald-100 rounded-lg" }, "Visi & Latar Belakang"), /* @__PURE__ */ jsx("h2", { class: "text-3xl font-bold md:text-4xl text-slate-900" }, "Mengapa Muslim API?"), /* @__PURE__ */ jsx("div", { class: "space-y-6 text-lg leading-relaxed text-slate-600" }, /* @__PURE__ */ jsx("p", null, "Di era digital saat ini, akses terhadap data keislaman yang akurat, cepat, dan mudah diintegrasikan adalah sebuah kebutuhan fundamental. Banyak pengembang menghadapi kesulitan dalam menemukan API yang menyediakan data lengkap tanpa batasan yang memberatkan."), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-8 mt-8 md:grid-cols-2" }, /* @__PURE__ */ jsx("div", { class: "space-y-3" }, /* @__PURE__ */ jsx("h4", { class: "flex gap-2 items-center text-xl font-bold text-slate-900" }, /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-emerald-500 rounded-full" }), "Misi Kami"), /* @__PURE__ */ jsx("p", { class: "text-base" }, "Menjadi ", /* @__PURE__ */ jsx("span", { class: "font-semibold text-emerald-600" }, '"Single Source of Truth"'), " untuk data keislaman digital di Indonesia. Kami menyediakan infrastruktur data yang andal bagi siapapun yang ingin berdakwah melalui teknologi.")), /* @__PURE__ */ jsx("div", { class: "space-y-3" }, /* @__PURE__ */ jsx("h4", { class: "flex gap-2 items-center text-xl font-bold text-slate-900" }, /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-emerald-500 rounded-full" }), "Filosofi Terbuka"), /* @__PURE__ */ jsx("p", { class: "text-base" }, "Muslim API dibangun dengan semangat ", /* @__PURE__ */ jsx("span", { class: "font-semibold text-emerald-600" }, "Open Source"), ". Kami percaya bahwa ilmu agama harus dapat diakses seluas-luasnya tanpa ada penghalang teknis atau biaya."))), /* @__PURE__ */ jsx("div", { class: "pt-8 mt-8 italic text-center border-t border-slate-200 text-slate-500 md:text-left" }, '"Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain."'))), /* @__PURE__ */ jsx("div", { class: "relative" }, /* @__PURE__ */ jsx("div", { class: "relative z-10 p-8 bg-white rounded-3xl border shadow-2xl border-slate-200" }, /* @__PURE__ */ jsx("div", { class: "space-y-6" }, /* @__PURE__ */ jsx("div", { class: "flex gap-4 items-start" }, /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-10 h-10 bg-emerald-100 rounded-xl shrink-0" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-6 h-6 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "mb-1 font-bold text-slate-900" }, "Data Terverifikasi"), /* @__PURE__ */ jsx("p", { class: "text-sm text-slate-500" }, "Sumber data Al-Quran kami mengikuti standar Mushaf Al-Quran Standar Indonesia (MSI) Kemenag RI."))), /* @__PURE__ */ jsx("div", { class: "flex gap-4 items-start" }, /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-10 h-10 bg-emerald-100 rounded-xl shrink-0" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-6 h-6 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M13 10V3L4 14h7v7l9-11h-7z" }))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "mb-1 font-bold text-slate-900" }, "High Availability"), /* @__PURE__ */ jsx("p", { class: "text-sm text-slate-500" }, "Dibangun di atas infrastruktur serverless untuk memastikan API selalu tersedia kapanpun dibutuhkan."))), /* @__PURE__ */ jsx("div", { class: "flex gap-4 items-start" }, /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center w-10 h-10 bg-emerald-100 rounded-xl shrink-0" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-6 h-6 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }))), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h4", { class: "mb-1 font-bold text-slate-900" }, "Data Integrity Chain"), /* @__PURE__ */ jsx("p", { class: "text-sm text-slate-500" }, "Keaslian data dijamin melalui cryptographic hashing untuk menjaga kemurnian teks suci secara transparan."))))), /* @__PURE__ */ jsx("div", { class: "absolute -right-6 -bottom-6 w-full h-full rounded-3xl bg-emerald-600/5 -z-0" }))))), /* @__PURE__ */ jsx("section", { class: "py-24 bg-white" }, /* @__PURE__ */ jsx("div", { class: "px-4 mx-auto max-w-7xl sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "mb-16 text-center" }, /* @__PURE__ */ jsx("h2", { class: "mb-4 text-3xl font-bold md:text-4xl text-slate-900" }, "Layanan API Kami"), /* @__PURE__ */ jsx("p", { class: "mx-auto max-w-2xl text-lg text-slate-600" }, "Berbagai kategori API yang siap Anda integrasikan ke dalam aplikasi Anda secara instan.")), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" }, apiCategories.map((api, index) => /* @__PURE__ */ jsx(
    "a",
    {
      key: index,
      href: api.link,
      class: "overflow-hidden relative p-8 bg-white rounded-3xl border transition-all duration-300 group border-slate-200 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-100"
    },
    /* @__PURE__ */ jsx("div", { class: `absolute top-0 right-0 w-24 h-24 bg-${api.color}-50 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500` }),
    /* @__PURE__ */ jsx("div", { class: `w-14 h-14 bg-${api.color}-100 rounded-2xl flex items-center justify-center text-${api.color}-600 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10` }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-8 h-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: api.icon }))),
    /* @__PURE__ */ jsx("h3", { class: "relative z-10 mb-3 text-xl font-bold text-slate-900" }, api.title),
    /* @__PURE__ */ jsx("p", { class: "relative z-10 mb-6 leading-relaxed text-slate-600" }, api.description),
    /* @__PURE__ */ jsx("div", { class: `flex items-center gap-2 text-${api.color}-600 font-bold relative z-10` }, "Lihat Dokumentasi", /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-4 h-4 transition-transform group-hover:translate-x-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M9 5l7 7-7 7" })))
  ))), /* @__PURE__ */ jsx("div", { class: "mt-32 mb-20" }, /* @__PURE__ */ jsx("div", { class: "mb-16 text-center" }, /* @__PURE__ */ jsx("div", { class: "inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text-blue-700 uppercase bg-blue-100 rounded-lg" }, "Timeline Peradaban"), /* @__PURE__ */ jsx("h2", { class: "mb-6 text-3xl font-bold md:text-5xl text-slate-900" }, "Sejarah & Sirah Nabawiyah"), /* @__PURE__ */ jsx("p", { class: "mx-auto max-w-2xl text-lg text-slate-600" }, "Telusuri jejak sejarah Islam melalui timeline interaktif yang bersumber dari Sirah Nabawiyah yang autentik.")), /* @__PURE__ */ jsx("div", { class: "relative" }, /* @__PURE__ */ jsx("div", { class: "hidden absolute left-1/2 w-0.5 h-full transform -translate-x-1/2 bg-slate-200 md:block" }), /* @__PURE__ */ jsx("div", { class: "relative space-y-12" }, sejarah2 && sejarah2.slice(0, 8).map((item, index) => /* @__PURE__ */ jsx("div", { key: item.id, class: `flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}` }, /* @__PURE__ */ jsx("div", { class: "w-full md:w-1/2" }, /* @__PURE__ */ jsx("div", { class: `p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative ${index % 2 === 1 ? "md:text-right" : "md:text-left"}` }, /* @__PURE__ */ jsx("div", { class: `inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${index % 2 === 0 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}` }, item.tahun), /* @__PURE__ */ jsx("h3", { class: "mb-3 text-2xl font-bold text-slate-900" }, item.peristiwa), /* @__PURE__ */ jsx("p", { class: "mb-4 leading-relaxed text-slate-600" }, item.deskripsi), /* @__PURE__ */ jsx("div", { class: "text-xs italic font-medium text-slate-400" }, "Sumber: ", item.sumber), /* @__PURE__ */ jsx("div", { class: `absolute top-1/2 w-4 h-4 bg-white border-4 border-emerald-500 rounded-full z-10 hidden md:block ${index % 2 === 0 ? "-right-10" : "-left-10"} transform -translate-y-1/2` }))), /* @__PURE__ */ jsx("div", { class: "w-full md:w-1/2" }, /* @__PURE__ */ jsx("div", { class: "relative group overflow-hidden rounded-3xl aspect-[16/9] shadow-lg" }, /* @__PURE__ */ jsx(
    "img",
    {
      src: item.image_url || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800",
      alt: item.peristiwa,
      class: "object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
    }
  ), /* @__PURE__ */ jsx("div", { class: "absolute inset-0 bg-gradient-to-t to-transparent opacity-60 from-slate-900/60" })))))), /* @__PURE__ */ jsx("div", { class: "mt-12 text-center" }, /* @__PURE__ */ jsx("a", { href: "/other#sejarah", class: "inline-flex gap-2 items-center px-8 py-4 font-bold text-white bg-blue-600 rounded-2xl transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200" }, "Lihat Seluruh Timeline", /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M17 8l4 4m0 0l-4 4m4-4H3" }))))), /* @__PURE__ */ jsx("div", { class: "mt-40 p-12 bg-slate-900 rounded-[3rem] relative overflow-hidden" }, /* @__PURE__ */ jsx("div", { class: "absolute top-0 right-0 -mt-32 -mr-32 w-64 h-64 rounded-full blur-3xl bg-emerald-500/10" }), /* @__PURE__ */ jsx("div", { class: "absolute bottom-0 left-0 -mb-32 -ml-32 w-64 h-64 rounded-full blur-3xl bg-blue-500/10" }), /* @__PURE__ */ jsx("div", { class: "grid relative z-10 grid-cols-1 gap-16 items-center lg:grid-cols-2" }, /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("div", { class: "inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-emerald-400 uppercase rounded-lg bg-emerald-500/10" }, "Integrasi Mudah"), /* @__PURE__ */ jsx("h2", { class: "mb-6 text-4xl font-bold text-white md:text-5xl" }, "Pasang Widget Islami di Website Anda"), /* @__PURE__ */ jsx("p", { class: "mb-10 text-xl leading-relaxed text-slate-400" }, "Tingkatkan engagement pengunjung website Anda dengan memasang widget Jadwal Sholat dan Ayat Harian yang elegan, ringan, dan responsif. Cukup copy-paste kode embed."), /* @__PURE__ */ jsx("ul", { class: "mb-10 space-y-4" }, [
    "Desain Modern & Minimalis",
    "Ringan & Cepat (Tanpa library berat)",
    "Otomatis Update Setiap Hari",
    "Responsif di Semua Ukuran Layar"
  ].map((feat, i) => /* @__PURE__ */ jsx("li", { key: i, class: "flex gap-3 items-center text-slate-300" }, /* @__PURE__ */ jsx("svg", { class: "w-6 h-6 text-emerald-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M5 13l4 4L19 7" })), feat))), /* @__PURE__ */ jsx("a", { href: "/docs", class: "inline-flex gap-2 items-center px-8 py-4 font-bold text-white bg-emerald-600 rounded-2xl transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-900/40" }, "Dapatkan Kode Embed", /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" })))), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-6 sm:grid-cols-2" }, /* @__PURE__ */ jsx("div", { class: "p-6 rounded-3xl border backdrop-blur-sm bg-white/5 border-white/10" }, /* @__PURE__ */ jsx("div", { class: "w-full aspect-[3/4] bg-emerald-600/20 rounded-2xl mb-4 flex items-center justify-center overflow-hidden" }, /* @__PURE__ */ jsx("div", { class: "p-4 w-full h-full" }, /* @__PURE__ */ jsx("div", { class: "mb-4 w-full h-8 bg-emerald-600 rounded-lg" }), /* @__PURE__ */ jsx("div", { class: "space-y-3" }, [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx("div", { key: i, class: "flex justify-between items-center px-2 w-full h-6 rounded-md bg-white/10" }, /* @__PURE__ */ jsx("div", { class: "w-12 h-2 rounded bg-white/20" }), /* @__PURE__ */ jsx("div", { class: "w-8 h-2 rounded bg-white/30" })))))), /* @__PURE__ */ jsx("h4", { class: "font-bold text-center text-white" }, "Widget Sholat")), /* @__PURE__ */ jsx("div", { class: "p-6 rounded-3xl border backdrop-blur-sm bg-white/5 border-white/10" }, /* @__PURE__ */ jsx("div", { class: "w-full aspect-[3/4] bg-blue-600/20 rounded-2xl mb-4 flex items-center justify-center" }, /* @__PURE__ */ jsx("div", { class: "flex flex-col justify-center p-6 w-full h-full text-center" }, /* @__PURE__ */ jsx("div", { class: "mb-8 w-full h-4 bg-blue-600 rounded-lg" }), /* @__PURE__ */ jsx("div", { class: "mx-auto mb-3 w-3/4 h-2 rounded bg-white/20" }), /* @__PURE__ */ jsx("div", { class: "mx-auto w-1/2 h-2 rounded bg-white/10" }))), /* @__PURE__ */ jsx("h4", { class: "font-bold text-center text-white" }, "Widget Ayat")))))), /* @__PURE__ */ jsx("div", { class: "mt-20 bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden" }, /* @__PURE__ */ jsx("div", { class: "absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none" }, /* @__PURE__ */ jsx("svg", { viewBox: "0 0 400 400", xmlns: "http://www.w3.org/2000/svg", class: "w-full h-full" }, /* @__PURE__ */ jsx("path", { fill: "#10B981", d: "M47.7,-63.9C61.1,-55.8,70.8,-41,75.9,-25.1C81,-9.1,81.6,7.9,76.5,23.1C71.4,38.3,60.6,51.6,47.2,60.4C33.8,69.1,17.9,73.3,1.4,71.4C-15.1,69.4,-30.2,61.4,-44.2,52.5C-58.1,43.7,-70.9,34.1,-76.3,21.1C-81.8,8,-79.9,-8.5,-73.3,-22.9C-66.7,-37.3,-55.4,-49.6,-42.4,-57.8C-29.4,-66,-14.7,-70.1,0.6,-71C15.9,-71.8,31.8,-69.5,47.7,-63.9Z", transform: "translate(200 200)" }))), /* @__PURE__ */ jsx("div", { class: "grid relative z-10 grid-cols-1 gap-12 items-center lg:grid-cols-2" }, /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("h2", { class: "mb-6 text-3xl font-bold leading-tight text-white md:text-5xl" }, "Coba API secara langsung di ", /* @__PURE__ */ jsx("span", { class: "text-emerald-400" }, "Playground")), /* @__PURE__ */ jsx("p", { class: "mb-10 text-xl leading-relaxed text-slate-400" }, "Tidak perlu setup environment. Cukup pilih endpoint, masukkan parameter, dan lihat hasilnya dalam sekejap. Rasakan kemudahan integrasi Muslim API sekarang juga."), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/playground",
      class: "inline-flex gap-3 items-center px-8 py-4 text-lg font-bold text-white bg-emerald-500 rounded-2xl shadow-xl transition-all hover:bg-emerald-400 shadow-emerald-500/20"
    },
    "Buka Playground",
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M13 10V3L4 14h7v7l9-11h-7z" }))
  )), /* @__PURE__ */ jsx("div", { class: "hidden lg:block" }, /* @__PURE__ */ jsx("div", { class: "p-6 rounded-3xl border shadow-2xl backdrop-blur-xl bg-slate-800/50 border-slate-700" }, /* @__PURE__ */ jsx("div", { class: "flex gap-2 items-center mb-4" }, /* @__PURE__ */ jsx("div", { class: "flex gap-1.5" }, /* @__PURE__ */ jsx("div", { class: "w-3 h-3 bg-rose-500 rounded-full" }), /* @__PURE__ */ jsx("div", { class: "w-3 h-3 bg-amber-500 rounded-full" }), /* @__PURE__ */ jsx("div", { class: "w-3 h-3 bg-emerald-500 rounded-full" }))), /* @__PURE__ */ jsx("pre", { class: "p-0 font-mono text-sm leading-relaxed text-emerald-400 bg-transparent" }, `{
  "status": true,
  "message": "Berhasil mengambil data surah.",
  "data": {
    "surah": "Al-Fatihah",
    "ayat": 7,
    "revelation": "Makkiyah",
    "translation": "Pembukaan"
  }
} `))))))), /* @__PURE__ */ jsx("section", { class: "overflow-hidden relative py-24 bg-slate-900" }, /* @__PURE__ */ jsx("div", { class: "relative z-10 px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("h2", { class: "mb-8 text-3xl font-bold text-white md:text-5xl" }, "Siap Membangun Masa Depan Dakwah Digital?"), /* @__PURE__ */ jsx("p", { class: "mx-auto mb-12 max-w-2xl text-xl text-slate-400" }, "Bergabunglah dengan ribuan pengembang lainnya yang telah menggunakan Muslim API. Mulai secara gratis hari ini."), /* @__PURE__ */ jsx("div", { class: "flex flex-col gap-4 justify-center items-center sm:flex-row" }, /* @__PURE__ */ jsx(
    "a",
    {
      href: "/docs",
      class: "flex gap-2 justify-center items-center px-10 py-4 w-full text-lg font-bold text-white bg-emerald-600 rounded-2xl shadow-xl transition-all sm:w-auto hover:bg-emerald-500 shadow-emerald-900/20"
    },
    "Dapatkan Akses API"
  ), /* @__PURE__ */ jsx(
    "a",
    {
      href: "/other",
      class: "flex gap-2 justify-center items-center px-10 py-4 w-full text-lg font-bold text-white rounded-2xl border backdrop-blur-sm transition-all sm:w-auto bg-white/10 border-white/20 hover:bg-white/20"
    },
    "Lihat Contoh"
  ))), /* @__PURE__ */ jsx("div", { class: "absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" }, /* @__PURE__ */ jsx("div", { class: "absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900 rounded-full blur-[150px]" }), /* @__PURE__ */ jsx("div", { class: "absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900 rounded-full blur-[150px]" }))));
};

// src/components/Playground.jsx
var Playground = ({ baseUrl }) => {
  return /* @__PURE__ */ jsx("div", { class: "px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx("div", { class: "mb-12" }, /* @__PURE__ */ jsx("h1", { class: "mb-4 text-4xl font-extrabold tracking-tight text-slate-900" }, "API Playground"), /* @__PURE__ */ jsx("p", { class: "text-lg text-slate-600" }, "Uji coba API secara interaktif. Pilih endpoint, masukkan parameter, dan lihat hasilnya secara langsung.")), /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 gap-8 lg:grid-cols-2" }, /* @__PURE__ */ jsx("div", { class: "space-y-6" }, /* @__PURE__ */ jsx("div", { class: "p-8 bg-white rounded-3xl border shadow-sm border-slate-200" }, /* @__PURE__ */ jsx("h3", { class: "flex gap-2 items-center mb-6 text-xl font-bold text-slate-900" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-6 h-6 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M13 10V3L4 14h7v7l9-11h-7z" })), "Konfigurasi Request"), /* @__PURE__ */ jsx("div", { class: "space-y-4" }, /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("label", { class: "block mb-2 text-sm font-semibold text-slate-700" }, "Pilih Kategori"), /* @__PURE__ */ jsx(
    "select",
    {
      id: "category-select",
      class: "px-4 py-3 w-full rounded-xl border transition-all cursor-pointer bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
      onchange: "window.updateEndpoints(this.value)"
    },
    /* @__PURE__ */ jsx("option", { value: "quran" }, "Al-Quran Indonesia"),
    /* @__PURE__ */ jsx("option", { value: "sholat" }, "Jadwal Sholat"),
    /* @__PURE__ */ jsx("option", { value: "hadits" }, "Hadits"),
    /* @__PURE__ */ jsx("option", { value: "murottal" }, "Murottal Audio"),
    /* @__PURE__ */ jsx("option", { value: "kemenag" }, "Kemenag Open Data"),
    /* @__PURE__ */ jsx("option", { value: "sejarah" }, "Sejarah Islam"),
    /* @__PURE__ */ jsx("option", { value: "puasa" }, "Puasa & Fiqh"),
    /* @__PURE__ */ jsx("option", { value: "tools" }, "Tools & Fitur Cerdas"),
    /* @__PURE__ */ jsx("option", { value: "integrity" }, "Integrity Chain"),
    /* @__PURE__ */ jsx("option", { value: "analytics" }, "Spiritual Analytics"),
    /* @__PURE__ */ jsx("option", { value: "other" }, "Lainnya (Asmaul Husna, Doa, dll)")
  )), /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("label", { class: "block mb-2 text-sm font-semibold text-slate-700" }, "Endpoint"), /* @__PURE__ */ jsx(
    "select",
    {
      id: "endpoint-select",
      class: "px-4 py-3 w-full font-mono text-sm rounded-xl border transition-all cursor-pointer bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
      onchange: "window.updateParams(this.value)"
    }
  )), /* @__PURE__ */ jsx("div", { id: "params-container", class: "hidden pt-4 space-y-4 border-t border-slate-100" }, /* @__PURE__ */ jsx("label", { class: "block text-sm font-semibold text-slate-700" }, "Parameter"), /* @__PURE__ */ jsx("div", { id: "params-fields", class: "grid grid-cols-1 gap-4 md:grid-cols-2" })), /* @__PURE__ */ jsx("div", { class: "pt-6" }, /* @__PURE__ */ jsx(
    "button",
    {
      id: "send-request",
      onclick: "window.sendRequest()",
      class: "flex gap-2 justify-center items-center py-4 w-full text-lg font-bold text-white bg-emerald-600 rounded-2xl shadow-xl transition-all hover:bg-emerald-700 shadow-emerald-200 group"
    },
    "Kirim Request",
    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-5 h-5 transition-transform group-hover:translate-x-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M14 5l7 7-7 7" }))
  )))), /* @__PURE__ */ jsx("div", { class: "p-6 bg-emerald-50 rounded-2xl border border-emerald-100" }, /* @__PURE__ */ jsx("h4", { class: "flex gap-2 items-center mb-2 font-bold text-emerald-800" }, /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })), "Tips"), /* @__PURE__ */ jsx("p", { class: "text-sm leading-relaxed text-emerald-700" }, "Gunakan playground ini untuk memahami struktur response JSON sebelum mengimplementasikannya di aplikasi Anda. Base URL yang digunakan adalah ", /* @__PURE__ */ jsx("code", { class: "font-bold" }, baseUrl), "."))), /* @__PURE__ */ jsx("div", { class: "flex flex-col h-full lg:max-h-[700px]" }, /* @__PURE__ */ jsx("div", { class: "flex overflow-hidden flex-col flex-grow h-full rounded-3xl shadow-2xl bg-slate-900" }, /* @__PURE__ */ jsx("div", { class: "flex justify-between items-center px-6 py-4 border-b bg-slate-800 border-slate-700 shrink-0" }, /* @__PURE__ */ jsx("div", { class: "flex gap-3 items-center" }, /* @__PURE__ */ jsx("div", { class: "flex gap-1.5" }, /* @__PURE__ */ jsx("div", { class: "w-3 h-3 bg-rose-500 rounded-full" }), /* @__PURE__ */ jsx("div", { class: "w-3 h-3 bg-amber-500 rounded-full" }), /* @__PURE__ */ jsx("div", { class: "w-3 h-3 bg-emerald-500 rounded-full" })), /* @__PURE__ */ jsx("span", { class: "ml-2 text-xs font-bold tracking-widest uppercase text-slate-400" }, "JSON Response")), /* @__PURE__ */ jsx("div", { id: "status-badge", class: "hidden" }, /* @__PURE__ */ jsx("span", { class: "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" }, "200 OK"))), /* @__PURE__ */ jsx("div", { class: "flex overflow-hidden relative flex-col flex-grow custom-scrollbar" }, /* @__PURE__ */ jsx("div", { id: "loader", class: "flex hidden absolute inset-0 z-10 justify-center items-center backdrop-blur-sm bg-slate-900/80" }, /* @__PURE__ */ jsx("div", { class: "flex flex-col gap-4 items-center" }, /* @__PURE__ */ jsx("div", { class: "w-10 h-10 rounded-full border-4 animate-spin border-emerald-500/20 border-t-emerald-500" }), /* @__PURE__ */ jsx("span", { class: "font-medium text-emerald-500 animate-pulse" }, "Memuat data..."))), /* @__PURE__ */ jsx("div", { id: "json-viewer-container", class: "flex-grow w-full h-full" })), /* @__PURE__ */ jsx("div", { class: "px-6 py-3 bg-slate-800 border-t border-slate-700 flex justify-between items-center text-[10px] text-slate-500 font-mono shrink-0" }, /* @__PURE__ */ jsx("span", { id: "response-time" }, "Time: 0ms"), /* @__PURE__ */ jsx("span", { id: "response-size" }, "Size: 0B"))))), /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: `
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
            { id: 'ayah-find', path: '/ayah/find', name: 'Cari Ayat (Query)', params: [{ name: 'query', placeholder: 'puasa', type: 'text', default: 'puasa', hint: 'Kata kunci pencarian' }] },
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
          puasa: [
            { id: 'puasa-all', path: '/puasa', name: 'Daftar Puasa (Wajib & Sunnah)', params: [] },
            { id: 'puasa-fiqh', path: '/puasa/fiqh', name: 'Fiqh & Adab Puasa (70 Masalah)', params: [] },
            { id: 'puasa-find', path: '/puasa/find', name: 'Cari Puasa', params: [{ name: 'query', type: 'text', default: 'bidh', placeholder: 'bidh' }] },
            { id: 'puasa-type', path: '/puasa/type/mingguan', name: 'Filter by Tipe', params: [
              { name: 'type', type: 'select', default: 'mingguan', options: [
                { value: 'mingguan', label: 'Mingguan' },
                { value: 'bulanan', label: 'Bulanan' },
                { value: 'tahunan', label: 'Tahunan' }
              ]}
            ]},
          ],
          tools: [
            { id: 'tools-quotes', path: '/tools/quotes/daily', name: 'Daily Quotes', params: [] },
            { id: 'tools-zakat', path: '/tools/zakat', name: 'Kalkulator Zakat', params: [
              { name: 'type', type: 'select', default: 'maal', options: [{value:'maal', label:'Zakat Maal'}, {value:'penghasilan', label:'Zakat Penghasilan'}, {value:'fitrah', label:'Zakat Fitrah'}] },
              { name: 'amount', type: 'number', default: '100000000', hint: 'Jumlah harta/pendapatan' },
              { name: 'hargaEmas', type: 'number', default: '1200000', hint: 'Harga emas per gram (opsional)' },
              { name: 'hargaBeras', type: 'number', default: '15000', hint: 'Harga beras per kg (Zakat Fitrah)' },
              { name: 'jumlahOrang', type: 'number', default: '1', hint: 'Jumlah jiwa (Zakat Fitrah)' }
            ]},
            { id: 'tools-faraidh', path: '/tools/faraidh', name: 'Kalkulator Waris (Faraidh)', params: [
              { name: 'totalHarta', type: 'number', default: '120000000', hint: 'Total harta warisan' },
              { name: 'suami', type: 'number', default: '1', hint: 'Jumlah suami (0-1)' },
              { name: 'istri', type: 'number', default: '0', hint: 'Jumlah istri' },
              { name: 'anakLk', type: 'number', default: '1', hint: 'Jumlah anak laki-laki' },
              { name: 'anakPr', type: 'number', default: '1', hint: 'Jumlah anak perempuan' },
              { name: 'ayah', type: 'select', default: 'false', options: [{value:'true', label:'Ada'}, {value:'false', label:'Tidak Ada'}] },
              { name: 'ibu', type: 'select', default: 'false', options: [{value:'true', label:'Ada'}, {value:'false', label:'Tidak Ada'}] }
            ]},
            { id: 'tools-qibla', path: '/tools/qibla', name: 'Arah Kiblat', params: [{ name: 'lat', type: 'text', default: '-6.1751' }, { name: 'lng', type: 'text', default: '106.8272' }] },
            { id: 'tools-search', path: '/tools/semantic-search', name: 'Pencarian Semantik (AI)', params: [{ name: 'query', type: 'text', default: 'sabar', hint: 'Cari di Quran & Hadits' }] },
          ],
          integrity: [
            { id: 'integrity-chain', path: '/integrity/chain', name: 'Integrity Chain', params: [] },
            { id: 'integrity-verify', path: '/integrity/verify/ayah', name: 'Verifikasi Ayah', params: [{ name: 'surahId', placeholder: '1', type: 'number', default: '1' }, { name: 'ayahId', placeholder: '1', type: 'number', default: '1' }] },
          ],
          analytics: [
            { id: 'analytics-global', path: '/analytics', name: 'Global Spiritual Analytics', params: [] },
            { id: 'analytics-khatam', path: '/analytics/khatam', name: 'Lapor Khatam (Post)', params: [], method: 'POST' },
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
                      '<select name="' + param.name + '" class="px-3 py-2 pr-8 w-full text-sm bg-white rounded-lg border transition-all appearance-none cursor-pointer border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">' +
                        optionsHtml +
                      '</select>' +
                      '<div class="flex absolute inset-y-0 right-0 items-center px-2 pointer-events-none text-slate-400">' +
                        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>' +
                      '</div>' +
                    '</div>' +
                    (param.hint ? '<p class="text-[10px] text-slate-400 italic leading-tight">' + param.hint + '</p>' : '') +
                  '</div>';
              }
              return '<div class="space-y-1">' +
                  '<label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">' + param.name + '</label>' +
                  '<input type="' + param.type + '" name="' + param.name + '" value="' + (param.default || '') + '" placeholder="' + param.placeholder + '" class="px-3 py-2 w-full text-sm bg-white rounded-lg border transition-all border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />' +
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
            
            const fetchOptions = {
              method: currentEndpoint.method || 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            };
            
            const response = await fetch(fullUrl, fetchOptions);
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
      description: "Status inti sistem",
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
      description: "Data integrity verification chain",
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
  const url2 = new URL(c.req.url);
  const proto = c.req.header("x-forwarded-proto") || url2.protocol.split(":")[0];
  return `${proto}://${url2.host}/v1`;
};
router.get("/", async (c) => {
  const sejarah2 = await getSejarah();
  return c.html(
    /* @__PURE__ */ jsx(Layout, { title: "Muslim All-In-One API | Platform Data Islami Terlengkap" }, /* @__PURE__ */ jsx(Landing, { sejarah: sejarah2 }))
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
    const allAsbab = await getAsbabNuzul();
    if (!allAsbab) return c.json({ status: false, message: "Daftar Asbabun Nuzul tidak tersedia.", data: [] }, 404);
    if (id == null) {
      const sortedData = [...allAsbab].sort((a, b) => parseInt(a.id) - parseInt(b.id));
      return c.json({ status: true, message: "Berhasil mendapatkan daftar Asbabun Nuzul.", data: sortedData });
    } else {
      const data = allAsbab.find((a) => a.id == id);
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
    const allAsma = await getAsmaulHusna();
    if (!allAsma) return c.json({ status: false, message: "Daftar Asmaul Husna tidak tersedia.", data: [] }, 404);
    if (id != null) {
      const data = allAsma.find((a) => a.id == id);
      if (!data) {
        return c.json({ status: false, message: "Asmaul Husna tidak ditemukan.", data: {} }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan detail Asmaul Husna.", data });
      }
    } else {
      const sortedData = [...allAsma].sort((a, b) => parseInt(a.id) - parseInt(b.id));
      return c.json({ status: true, message: "Berhasil mendapatkan daftar Asmaul Husna.", data: sortedData });
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data Asmaul Husna: " + error.message }, 500);
  }
});
var asma_default = asma;

// src/routes/muslim/v1/ayah.js
var ayah = new Hono2();
var formatAyah = (a) => {
  if (!a) return a;
  return {
    ...a,
    audio_partial: typeof a.audio_partial === "string" ? JSON.parse(a.audio_partial) : a.audio_partial || {}
  };
};
ayah.get("/", async (c) => {
  try {
    const surahList = await getSurahList();
    let allAyahs = [];
    for (const s of surahList) {
      const ayahs = await getAyahBySurah(s.number);
      if (ayahs) allAyahs.push(...ayahs);
    }
    return c.json({ status: true, message: "Berhasil mendapatkan daftar seluruh ayat.", data: allAyahs.map(formatAyah) });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan daftar ayat: " + error.message }, 500);
  }
});
ayah.get("/range", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    const start = parseInt(c.req.query("start"));
    const end = parseInt(c.req.query("end"));
    if (surahId != null && !isNaN(start) && !isNaN(end)) {
      const ayahs = await getAyahBySurah(surahId);
      if (!ayahs) {
        return c.json({ status: false, message: "Surah tidak ditemukan." }, 404);
      }
      const data = ayahs.filter((a) => {
        const num = parseInt(a.ayah);
        return num >= start && num <= end;
      });
      return c.json({ status: true, message: `Berhasil mendapatkan ayat dari surah ${surahId} rentang ${start}-${end}.`, data: data.map(formatAyah) });
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
      const data = await getAyahBySurah(id);
      if (!data) {
        return c.json({ status: false, message: `Surah ${id} tidak ditemukan.`, data: [] }, 404);
      }
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk surah ${id}.`, data: data.map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (surahId)."
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan ayat surah: " + error.message }, 500);
  }
});
ayah.get("/juz", async (c) => {
  try {
    const id = c.req.query("juzId") || c.req.query("id");
    if (id != null) {
      const surahList = await getSurahList();
      let juzAyahs = [];
      for (const s of surahList) {
        const ayahs = await getAyahBySurah(s.number);
        if (ayahs) {
          const filtered = ayahs.filter((a) => a.juz == id);
          juzAyahs.push(...filtered);
        }
      }
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk juz ${id}.`, data: juzAyahs.map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (juzId)."
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan ayat juz: " + error.message }, 500);
  }
});
ayah.get("/page", async (c) => {
  try {
    const id = c.req.query("page") || c.req.query("id");
    if (id != null) {
      const surahList = await getSurahList();
      let pageAyahs = [];
      for (const s of surahList) {
        const ayahs = await getAyahBySurah(s.number);
        if (ayahs) {
          const filtered = ayahs.filter((a) => a.page == id);
          pageAyahs.push(...filtered);
        }
      }
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk halaman ${id}.`, data: pageAyahs.map(formatAyah) });
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
      const ayahs = await getAyahBySurah(surahId);
      if (!ayahs) {
        return c.json({ status: false, message: `Surah ${surahId} tidak ditemukan.`, data: {} }, 404);
      }
      const data = ayahs.find((a) => a.ayah == ayahId);
      if (!data) {
        return c.json({ status: false, message: `Ayat ${ayahId} pada surah ${surahId} tidak ditemukan.`, data: {} }, 404);
      } else {
        const formatted = formatAyah(data);
        formatted.external_verification = `https://quran.kemenag.go.id/quran/per-ayat/surah/${surahId}?from=${ayahId}&to=${ayahId}`;
        updateAnalytics("ayah", `${surahId}:${ayahId}`).catch((err) => console.error("Analytics error:", err));
        return c.json({ status: true, message: `Berhasil mendapatkan detail ayat ${ayahId} pada surah ${surahId}.`, data: formatted });
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
      const surahList = await getSurahList();
      let results = [];
      const queryLower = q.toLowerCase();
      for (const s of surahList) {
        const ayahs = await getAyahBySurah(s.number);
        if (ayahs) {
          const matched = ayahs.filter((a) => a.text && a.text.toLowerCase().includes(queryLower));
          results.push(...matched);
        }
        if (results.length >= 100) break;
      }
      if (results.length === 0) {
        return c.json({
          status: false,
          message: `Tidak ada ayat yang ditemukan dengan kata kunci: ${q}.`,
          data: []
        }, 404);
      }
      return c.json({ status: true, message: `Berhasil mencari ayat dengan kata kunci: ${q}.`, data: results.map(formatAyah) });
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
  const months = await getCalendarMonths();
  const days = await getCalendarDays();
  if (!months || !days) {
    throw new Error("Data kalender tidak tersedia.");
  }
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
    const allDoa = await getDoa();
    if (!allDoa) return c.json({ status: false, message: "Daftar doa tidak tersedia.", data: [] }, 404);
    if (source != null) {
      const data = allDoa.filter((d) => d.source === source).sort((a, b) => a.judul.localeCompare(b.judul));
      return c.json({ status: true, message: `Berhasil mendapatkan doa dari sumber: ${source}.`, data });
    } else {
      const data = [...allDoa].sort((a, b) => a.judul.localeCompare(b.judul));
      return c.json({ status: true, message: "Berhasil mendapatkan daftar doa.", data });
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data doa: " + error.message }, 500);
  }
});
doa.get("/find", async (c) => {
  try {
    const q = c.req.query("query");
    if (q != null) {
      const allDoa = await getDoa();
      if (!allDoa) return c.json({ status: false, message: "Daftar doa tidak tersedia.", data: [] }, 404);
      const queryLower = q.toLowerCase();
      const data = allDoa.filter((d) => d.judul.toLowerCase().includes(queryLower)).sort((a, b) => a.judul.localeCompare(b.judul));
      if (data.length === 0) {
        return c.json({
          status: false,
          message: `Tidak ada doa yang ditemukan dengan kata kunci: ${q}.`,
          data: []
        }, 404);
      }
      return c.json({ status: true, message: `Berhasil mencari doa dengan kata kunci: ${q}.`, data });
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
    const allDzikir = await getDzikir();
    if (!allDzikir) return c.json({ status: false, message: "Daftar dzikir tidak tersedia.", data: [] }, 404);
    if (type != null) {
      const data = allDzikir.filter((d) => d.type === type);
      return c.json({ status: true, message: `Berhasil mendapatkan dzikir tipe: ${type}.`, data });
    } else {
      return c.json({ status: true, message: "Berhasil mendapatkan daftar dzikir.", data: allDzikir });
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data dzikir: " + error.message }, 500);
  }
});
var dzikir_default = dzikir;

// src/routes/muslim/v1/hadits.js
var hadits = new Hono2();
var bookFileMapping = {
  "bukhari": "bukhari",
  "muslim": "muslim",
  "abu-daud": "abu-daud",
  "abudawud": "abu-daud",
  "ibnu-majah": "ibnu-majah",
  "ibnmajah": "ibnu-majah",
  "tirmidzi": "tirmidzi",
  "tirmidhi": "tirmidzi",
  "ahmad": "ahmad",
  "darimi": "darimi",
  "malik": "malik",
  "nasai": "nasai"
};
var bookDisplayNames = {
  "bukhari": "Sahih Bukhari",
  "muslim": "Sahih Muslim",
  "abu-daud": "Sunan Abu Daud",
  "ibnu-majah": "Sunan Ibnu Majah",
  "tirmidzi": "Sunan Tirmidzi",
  "ahmad": "Musnad Ahmad",
  "darimi": "Sunan Darimi",
  "malik": "Muwatha Malik",
  "nasai": "Sunan Nasai"
};
hadits.get("/", async (c) => {
  try {
    const nomor = c.req.query("nomor");
    const allArbain = await getHaditsArbain();
    if (!allArbain) return c.json({ status: false, message: "Daftar hadits tidak tersedia.", data: [] }, 404);
    if (nomor != null) {
      const data = allArbain.find((h) => h.no == nomor);
      if (!data) {
        return c.json({ status: false, message: "Hadits tidak ditemukan.", data: {} }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan detail Hadits Arbain.", data });
      }
    } else {
      const sortedData = [...allArbain].sort((a, b) => parseInt(a.no) - parseInt(b.no));
      return c.json({ status: true, message: "Berhasil mendapatkan daftar Hadits Arbain.", data: sortedData });
    }
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data hadits: " + error.message }, 500);
  }
});
hadits.get("/books", (c) => {
  const books = Object.entries(bookDisplayNames).map(([id, name]) => ({
    id,
    name: `HR. ${name.replace("Sahih ", "").replace("Sunan ", "").replace("Musnad ", "").replace("Muwatha ", "")}`,
    available: "Lokal (JSON)"
  }));
  return c.json({
    status: true,
    message: "Berhasil mendapatkan seluruh koleksi kitab hadits.",
    data: [
      { id: "arbain", name: "Hadits Arbain Nawawi", available: 42 },
      ...books
    ]
  });
});
hadits.get("/books/:name", async (c) => {
  try {
    const name = c.req.param("name").toLowerCase();
    const page = parseInt(c.req.query("page") || 1);
    const limit = 50;
    const offset = (page - 1) * limit;
    const targetBookFile = bookFileMapping[name];
    if (!targetBookFile) {
      return c.json({ status: false, message: `Kitab ${name} tidak ditemukan.` }, 404);
    }
    const allHadits = await getLocalHadits(targetBookFile);
    if (!allHadits) {
      return c.json({ status: false, message: `Gagal memuat data kitab ${name}.` }, 500);
    }
    const displayName = bookDisplayNames[targetBookFile] || name;
    const paginatedData = allHadits.slice(offset, offset + limit).map((h) => ({
      number: h.number,
      arab: h.arab,
      id: h.id,
      name: `HR. ${displayName.replace("Sahih ", "").replace("Sunan ", "").replace("Musnad ", "").replace("Muwatha ", "")}`
    }));
    return c.json({
      status: true,
      message: `Berhasil mendapatkan daftar hadits dari kitab ${displayName} (Halaman ${page}).`,
      data: {
        book: displayName,
        total: allHadits.length,
        page,
        limit,
        hadiths: paginatedData
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan daftar hadits: " + error.message }, 500);
  }
});
hadits.get("/books/:name/:number", async (c) => {
  try {
    const name = c.req.param("name").toLowerCase();
    const number2 = parseInt(c.req.param("number"));
    const targetBookFile = bookFileMapping[name];
    if (!targetBookFile) {
      return c.json({ status: false, message: `Kitab ${name} tidak ditemukan.` }, 404);
    }
    const allHadits = await getLocalHadits(targetBookFile);
    if (!allHadits) {
      return c.json({ status: false, message: `Gagal memuat data kitab ${name}.` }, 500);
    }
    const hadith = allHadits.find((h) => h.number === number2);
    if (!hadith) {
      return c.json({ status: false, message: `Hadits nomor ${number2} tidak ditemukan di kitab ${name}.` }, 404);
    }
    const displayName = bookDisplayNames[targetBookFile] || name;
    return c.json({
      status: true,
      message: `Berhasil mendapatkan detail hadits nomor ${number2} dari kitab ${displayName}.`,
      data: {
        number: hadith.number,
        arab: hadith.arab,
        id: hadith.id,
        // Bahasa Indonesia
        name: `HR. ${displayName.replace("Sahih ", "").replace("Sunan ", "").replace("Musnad ", "").replace("Muwatha ", "")}`
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan detail hadits: " + error.message }, 500);
  }
});
hadits.get("/find", async (c) => {
  try {
    const q = c.req.query("query");
    const book = c.req.query("book");
    if (!q) {
      return c.json({
        status: false,
        message: "Parameter query diperlukan."
      }, 400);
    }
    if (!book || book.toLowerCase() === "arbain") {
      const allArbain = await getHaditsArbain();
      if (!allArbain || allArbain.length === 0) {
        return c.json({
          status: false,
          message: `Daftar hadits Arbain tidak tersedia.`,
          data: []
        }, 404);
      }
      const queryLower = q.toLowerCase();
      const results = allArbain.filter(
        (r) => r.judul && r.judul.toLowerCase().includes(queryLower) || r.indo && r.indo.toLowerCase().includes(queryLower)
      );
      if (results.length === 0) {
        return c.json({
          status: false,
          message: `Tidak ada hadits Arbain yang ditemukan dengan kata kunci: ${q}.`,
          data: []
        }, 404);
      }
      return c.json({
        status: true,
        message: `Berhasil mencari hadits Arbain dengan kata kunci: ${q}.`,
        data: results.map((r) => ({
          ...r,
          sumber: `Hadits Arbain No. ${r.no}: ${r.judul}`
        }))
      });
    } else {
      const targetBookFile = bookFileMapping[book.toLowerCase()];
      if (!targetBookFile) {
        return c.json({
          status: false,
          message: `Pencarian untuk buku '${book}' belum didukung. Gunakan: arbain, bukhari, muslim, abu-daud, ibnu-majah, tirmidzi, ahmad, darimi, malik, atau nasai.`
        }, 400);
      }
      const allHadits = await getLocalHadits(targetBookFile);
      if (!allHadits) {
        return c.json({
          status: false,
          message: `Gagal membaca data hadits untuk kitab ${book}.`
        }, 500);
      }
      const searchTerms = q.toLowerCase().split(" ");
      const results = allHadits.filter((h) => {
        const text = (h.id || "").toLowerCase();
        return searchTerms.every((term) => text.includes(term));
      }).slice(0, 50);
      if (results.length === 0) {
        return c.json({
          status: false,
          message: `Tidak ada hadits ditemukan di kitab ${book} dengan kata kunci: ${q}.`,
          data: []
        }, 404);
      }
      const displayName = bookDisplayNames[targetBookFile] || book;
      return c.json({
        status: true,
        message: `Berhasil mencari hadits di kitab ${displayName} dengan kata kunci: ${q}.`,
        data: results.map((h) => ({
          no: h.number,
          judul: displayName,
          arab: h.arab,
          indo: h.id,
          // Field 'id' adalah terjemahan Indonesia
          sumber: `HR. ${displayName.replace("Sahih ", "").replace("Sunan ", "").replace("Musnad ", "").replace("Muwatha ", "")} No. ${h.number}`
        }))
      });
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
    const allJuz = await getJuz();
    if (!allJuz) return c.json({ status: false, message: "Daftar juz tidak tersedia.", data: [] }, 404);
    if (juzId != null) {
      const data = allJuz.find((j) => j.number == juzId);
      if (!data) {
        return c.json({ status: false, message: "Juz tidak ditemukan.", data: {} }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan detail juz.", data });
      }
    } else {
      const sortedData = [...allJuz].sort((a, b) => parseInt(a.number) - parseInt(b.number));
      return c.json({ status: true, message: "Berhasil mendapatkan daftar seluruh juz.", data: sortedData });
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
    const data = await getQari();
    if (!data) return c.json({ status: false, message: "Daftar qari tidak tersedia.", data: [] }, 404);
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
    const allQari = await getQari();
    const qari = allQari ? allQari.find((q) => q.id == qariId) : null;
    if (surahId) {
      const allSurahs2 = await getSurahList();
      const surah2 = allSurahs2 ? allSurahs2.find((s) => s.number == surahId) : null;
      if (!surah2) {
        return c.json({ status: false, message: "Surah tidak ditemukan." }, 404);
      }
      const audioFull = typeof surah2.audio_full === "string" ? JSON.parse(surah2.audio_full || "{}") : surah2.audio_full || {};
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
    const allSurahs = await getSurahList();
    if (!allSurahs) return c.json({ status: false, message: "Daftar surah tidak tersedia.", data: [] }, 404);
    const result = allSurahs.sort((a, b) => parseInt(a.number) - parseInt(b.number)).map((s) => {
      const audioFull = typeof s.audio_full === "string" ? JSON.parse(s.audio_full || "{}") : s.audio_full || {};
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
    const allSurahs = await getSurahList();
    if (!allSurahs) return c.json({ status: false, message: "Data surah tidak tersedia." }, 404);
    const surahs = [...allSurahs].sort((a, b) => parseInt(a.number) - parseInt(b.number));
    let chain = [];
    let previousHash = "0".repeat(64);
    for (const surah2 of surahs) {
      const ayahsData = await getAyahBySurah(surah2.number);
      if (!ayahsData) continue;
      const ayahs = ayahsData.sort((a, b) => parseInt(a.ayah) - parseInt(b.ayah)).map((a) => ({ arab: a.arab, text: a.text }));
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
      algorithm: "SHA-256",
      structure: "Array of Objects { arab, text }",
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
    const allSurahs = await getSurahList();
    const surah2 = allSurahs ? allSurahs.find((s) => s.number == 1) : null;
    const ayahs = await getAyahBySurah(1);
    const isDataValid = surah2 && ayahs && ayahs.length > 0;
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
    const ayahs = await getAyahBySurah(surahId);
    const data = ayahs ? ayahs.find((a) => a.ayah == ayahId) : null;
    if (!data) {
      return c.json({ status: false, message: `Ayat ${ayahId} pada surah ${surahId} tidak ditemukan.`, data: {} }, 404);
    }
    const verificationData = { arab: data.arab, text: data.text };
    let comparison = {
      status: "Comparison source unavailable",
      source: "Kemenag (via EQuran.id)",
      is_match: null,
      external_data: null
    };
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3e3);
      const response = await fetch(`https://equran.id/api/v2/surat/${surahId}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const json = await response.json();
        const externalAyah = json.data && json.data.ayat ? json.data.ayat.find((a) => a.nomorAyat == ayahId) : null;
        if (externalAyah) {
          const normalize = (str) => str.replace(/\s+/g, " ").trim();
          const arabMatch = normalize(externalAyah.teksArab) === normalize(data.arab);
          const textMatch = normalize(externalAyah.teksIndonesia) === normalize(data.text);
          comparison = {
            status: "Success",
            source: "Kemenag (via EQuran.id)",
            is_match: arabMatch && textMatch,
            details: {
              arab_match: arabMatch,
              translation_match: textMatch
            },
            external_data: {
              arab: externalAyah.teksArab,
              text: externalAyah.teksIndonesia
            }
          };
        }
      }
    } catch (e) {
      comparison.status = "Error: " + e.message;
    }
    return c.json({
      status: true,
      message: `Berhasil memverifikasi integritas ayat ${ayahId} pada surah ${surahId}.`,
      data: {
        surahId,
        ayahId,
        local_data: verificationData,
        hash: generateHash(verificationData),
        comparison,
        external_verification_url: `https://quran.kemenag.go.id/quran/per-ayat/surah/${surahId}?from=${ayahId}&to=${ayahId}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal memverifikasi integritas ayat: " + error.message }, 500);
  }
});
var integrity_default = integrity;

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
  const query = c.req.query("nama");
  if (!query) return c.json({ status: false, message: "Parameter nama diperlukan." }, 400);
  try {
    const response = await fetch(`${BASE_API}/kota/cari/${query}`);
    const data = await response.json();
    if (!response.ok || !data.status) {
      return c.json({
        status: false,
        message: `Gagal mencari kota dengan kata kunci: ${query} dari API sumber.`,
        error: data.message || "Unknown error"
      }, response.status || 502);
    }
    if (!data.data || data.data.length === 0) {
      return c.json({
        status: false,
        message: `Tidak ada kota yang ditemukan dengan kata kunci: ${query}.`,
        data: []
      }, 404);
    }
    return c.json({
      status: true,
      message: `Berhasil mencari kota dengan kata kunci: ${query}.`,
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
    const cleanCityName = city.replace(/Kota Adm. |Kota |Kabupaten |Kab. /g, "").trim();
    const kotaRes = await fetch(`${BASE_API}/kota/cari/${cleanCityName}`);
    const kotaData = await kotaRes.json();
    if (!kotaRes.ok || !kotaData.status || !kotaData.data || kotaData.data.length === 0) {
      return c.json({
        status: false,
        message: `Kota ${cleanCityName} tidak ditemukan dalam daftar wilayah Kemenag.`,
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
    const cleanCityName = city.replace(/Kota Adm. |Kota |Kabupaten |Kab. /g, "").trim();
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
  if (!s) return s;
  return {
    ...s,
    audio_full: typeof s.audio_full === "string" ? JSON.parse(s.audio_full) : s.audio_full || {}
  };
};
surah.get("/", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    if (surahId != null) {
      const data = await getSurahDetail(surahId);
      if (!data) {
        return c.json({ status: false, message: "Surah tidak ditemukan.", data: {} }, 404);
      } else {
        updateAnalytics("surah", surahId).catch((err) => console.error("Analytics error:", err));
        return c.json({ status: true, message: "Berhasil mendapatkan detail surah.", data: formatSurah(data) });
      }
    } else {
      const data = await getSurahList();
      if (!data) {
        return c.json({ status: false, message: "Daftar surah tidak tersedia.", data: [] }, 404);
      } else {
        const sortedData = [...data].sort((a, b) => parseInt(a.number) - parseInt(b.number));
        return c.json({ status: true, message: "Berhasil mendapatkan daftar surah.", data: sortedData.map(formatSurah) });
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
    const allTafsir = await getTafsir();
    if (!allTafsir) return c.json({ status: false, message: "Daftar tafsir tidak tersedia.", data: [] }, 404);
    if (surahId != null) {
      const data = allTafsir.find((t) => t.id == surahId);
      if (!data) {
        return c.json({ status: false, message: "Tafsir surah tidak ditemukan.", data: {} }, 404);
      } else {
        return c.json({ status: true, message: "Berhasil mendapatkan detail tafsir surah.", data });
      }
    } else {
      const sortedData = [...allTafsir].sort((a, b) => parseInt(a.id) - parseInt(b.id));
      return c.json({ status: true, message: "Berhasil mendapatkan daftar tafsir surah.", data: sortedData });
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
    const allThemes = await getThemes();
    if (!allThemes) return c.json({ status: false, message: "Daftar tema tidak tersedia.", data: [] }, 404);
    if (themeId != null) {
      const themeData = allThemes.find((t) => t.id == themeId);
      if (!themeData) {
        return c.json({ status: false, message: "Tema tidak ditemukan.", data: [] }, 404);
      }
      const surahList = await getSurahList();
      let themeVerses = [];
      for (const s of surahList) {
        const ayahs = await getAyahBySurah(s.number);
        if (ayahs) {
          const filtered = ayahs.filter((a) => {
            if (!a.theme) return false;
            const themes = a.theme.split(",").map((t) => t.trim());
            return themes.includes(themeId.toString());
          });
          themeVerses.push(...filtered);
        }
      }
      const formatAyah2 = (a) => ({
        ...a,
        audio_partial: typeof a.audio_partial === "string" ? JSON.parse(a.audio_partial) : a.audio_partial || {}
      });
      return c.json({
        status: true,
        message: `Berhasil mendapatkan ayat dengan tema: ${themeData.name}.`,
        data: themeVerses.map(formatAyah2)
      });
    } else {
      const sortedThemes = [...allThemes].sort((a, b) => parseInt(a.id) - parseInt(b.id));
      return c.json({ status: true, message: "Berhasil mendapatkan daftar seluruh tema.", data: sortedThemes });
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
    const allWords = await getWord();
    if (!allWords) return c.json({ status: false, message: "Daftar kata tidak tersedia.", data: [] }, 404);
    let data = allWords;
    if (surahId != null && ayahId != null) {
      data = allWords.filter((w) => w.surah == surahId && w.ayah == ayahId);
    } else if (surahId != null) {
      data = allWords.filter((w) => w.surah == surahId);
    }
    const sortedData = [...data].sort((a, b) => {
      const surahDiff = parseInt(a.surah) - parseInt(b.surah);
      if (surahDiff !== 0) return surahDiff;
      const ayahDiff = parseInt(a.ayah) - parseInt(b.ayah);
      if (ayahDiff !== 0) return ayahDiff;
      return parseInt(a.word) - parseInt(b.word);
    });
    return c.json({ status: true, message: "Berhasil mendapatkan daftar kata.", data: sortedData });
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
    const ayahs = await getAyahBySurah(surahId);
    if (!ayahs) {
      return c.json({ status: false, message: "Surah tidak ditemukan." }, 404);
    }
    const index = ayahs.findIndex((a) => a.ayah == ayahId);
    if (index === -1) {
      return c.json({ status: false, message: "Ayat tidak ditemukan." }, 404);
    }
    const oldData = { ...ayahs[index] };
    if (arab) ayahs[index].arab = arab;
    if (text) ayahs[index].text = text;
    if (latin) ayahs[index].latin = latin;
    const success = await writeJson(`quran/ayah/${surahId}.json`, ayahs);
    if (!success) {
      return c.json({ status: false, message: "Gagal menyimpan perubahan ke file JSON." }, 500);
    }
    return c.json({
      status: true,
      message: "Berhasil memperbarui ayat.",
      diff: {
        before: { arab: oldData.arab, text: oldData.text, latin: oldData.latin },
        after: { arab: ayahs[index].arab, text: ayahs[index].text, latin: ayahs[index].latin }
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
    const dzikirs = await getDzikir();
    if (!dzikirs) return c.json({ status: false, message: "Daftar dzikir tidak tersedia." }, 500);
    const index = dzikirs.findIndex((d) => d.id == id);
    if (index === -1) return c.json({ status: false, message: "Dzikir tidak ditemukan." }, 404);
    const oldData = { ...dzikirs[index] };
    if (title3) dzikirs[index].title = title3;
    if (arabic) dzikirs[index].arabic = arabic;
    if (translation) dzikirs[index].translation = translation;
    const success = await writeJson("common/dzikir.json", dzikirs);
    if (!success) {
      return c.json({ status: false, message: "Gagal menyimpan perubahan ke file JSON." }, 500);
    }
    return c.json({
      status: true,
      message: "Berhasil memperbarui dzikir.",
      diff: {
        before: { title: oldData.title, arabic: oldData.arabic, translation: oldData.translation },
        after: { title: dzikirs[index].title, arabic: dzikirs[index].arabic, translation: dzikirs[index].translation }
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal memperbarui dzikir: " + error.message }, 500);
  }
});
admin.patch("/doa", async (c) => {
  try {
    const { id, title: title3, arabic, translation } = await c.req.json();
    if (!id) return c.json({ status: false, message: "Parameter id diperlukan." }, 400);
    const doas = await getDoa();
    if (!doas) return c.json({ status: false, message: "Daftar doa tidak tersedia." }, 500);
    const index = doas.findIndex((d) => d.id == id);
    if (index === -1) return c.json({ status: false, message: "Doa tidak ditemukan." }, 404);
    const oldData = { ...doas[index] };
    if (title3) doas[index].title = title3;
    if (arabic) doas[index].arabic = arabic;
    if (translation) doas[index].translation = translation;
    const success = await writeJson("common/doa.json", doas);
    if (!success) {
      return c.json({ status: false, message: "Gagal menyimpan perubahan ke file JSON." }, 500);
    }
    return c.json({
      status: true,
      message: "Berhasil memperbarui doa.",
      diff: {
        before: { title: oldData.title, arabic: oldData.arabic, translation: oldData.translation },
        after: { title: doas[index].title, arabic: doas[index].arabic, translation: doas[index].translation }
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal memperbarui doa: " + error.message }, 500);
  }
});
var admin_default = admin;

// src/routes/muslim/v1/kemenag.js
var kemenag = new Hono2();
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}
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
    const allMasjid = await getMasjid();
    if (!allMasjid) return c.json({ status: false, message: "Daftar masjid tidak tersedia.", data: [] }, 404);
    let data = allMasjid;
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (m) => m.nama && m.nama.toLowerCase().includes(searchLower) || m.deskripsi && m.deskripsi.toLowerCase().includes(searchLower)
      );
    }
    if (lokasi) {
      const lokasiLower = lokasi.toLowerCase();
      data = data.filter((m) => m.lokasi && m.lokasi.toLowerCase().includes(lokasiLower));
    }
    if (jenis) {
      data = data.filter((m) => m.jenis === jenis);
    }
    if (tipologi) {
      data = data.filter((m) => m.tipologi === tipologi);
    }
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
    const allMasjid = await getMasjid();
    const data = allMasjid ? allMasjid.find((m) => m.id == id) : null;
    if (!data) {
      return c.json({ status: false, message: "Masjid tidak ditemukan.", data: {} }, 404);
    }
    return c.json({ status: true, message: "Berhasil mendapatkan detail masjid.", data });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan detail masjid: " + error.message }, 500);
  }
});
kemenag.get("/masjid/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const allMasjid = await getMasjid();
    const data = allMasjid ? allMasjid.find((m) => m.id == id) : null;
    if (!data) {
      return c.json({ status: false, message: "Masjid tidak ditemukan.", data: {} }, 404);
    }
    return c.json({
      status: true,
      message: "Berhasil mendapatkan detail masjid.",
      data
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
    const allMasjid = await getMasjid();
    if (!allMasjid) return c.json({ status: false, message: "Daftar masjid tidak tersedia.", data: [] }, 404);
    const data = allMasjid.map((m) => {
      const distance = getDistance(lat, lng, parseFloat(m.latitude), parseFloat(m.longitude));
      return { ...m, distance };
    }).filter((m) => m.distance <= radius).sort((a, b) => a.distance - b.distance).slice(0, 20);
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
    const allSejarah = await getSejarah();
    if (!allSejarah) return c.json({ status: false, message: "Daftar sejarah tidak tersedia.", data: [] }, 404);
    let data = allSejarah;
    if (kategori) {
      const kategoriLower = kategori.toLowerCase();
      data = allSejarah.filter((s) => s.kategori && s.kategori.toLowerCase().includes(kategoriLower));
    }
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
    const allSejarah = await getSejarah();
    if (!allSejarah) return c.json({ status: false, message: "Daftar sejarah tidak tersedia.", data: {} }, 404);
    const item = allSejarah.find((s) => s.id == id || s.id && s.id.toString() === id.toString());
    if (!item) return c.json({ status: false, message: `Data sejarah dengan ID ${id} tidak ditemukan.`, data: {} }, 404);
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
    const allSejarah = await getSejarah();
    if (!allSejarah) return c.json({ status: false, message: "Daftar sejarah tidak tersedia.", data: [] }, 404);
    const searchStr = `${day} ${month}`;
    const searchMonth = month;
    const data = allSejarah.filter((s) => {
      const deskripsiLower = (s.deskripsi || "").toLowerCase();
      const tahunLower = (s.tahun || "").toLowerCase();
      const searchStrLower = searchStr.toLowerCase();
      const monthLower = searchMonth.toLowerCase();
      return tahunLower.includes(searchStrLower) || tahunLower.includes(monthLower) || deskripsiLower.includes(searchStrLower);
    });
    let finalData = data;
    if (finalData.length === 0) {
      finalData = allSejarah.filter(
        (s) => s.tahun && s.tahun.toLowerCase().includes(month.toLowerCase()) || s.deskripsi && s.deskripsi.toLowerCase().includes(month.toLowerCase())
      );
    }
    return c.json({
      status: true,
      message: `Berhasil mendapatkan peristiwa sejarah untuk hari ini (${day} ${month}).`,
      data: {
        events: finalData.slice(0, 10),
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
    const surahList = await getSurahList();
    if (!surahList) throw new Error("Daftar surah tidak tersedia");
    const randomSurah = surahList[Math.floor(Math.random() * surahList.length)];
    const ayahs = await getAyahBySurah(randomSurah.number);
    if (!ayahs) throw new Error("Daftar ayat tidak tersedia");
    const randomAyah = ayahs[Math.floor(Math.random() * ayahs.length)];
    const surahName = randomSurah.name_id || randomSurah.name_en || randomSurah.name_long;
    const allArbain = await getHaditsArbain();
    const randomHadits = allArbain ? allArbain[Math.floor(Math.random() * allArbain.length)] : null;
    return c.json({
      status: true,
      message: "Berhasil mengambil kutipan harian.",
      data: {
        ayat: {
          arab: randomAyah.arab,
          text: randomAyah.text,
          sumber: `QS. ${surahName}: ${randomAyah.ayah}`
        },
        hadits: randomHadits ? {
          arab: randomHadits.arab,
          text: randomHadits.indo,
          sumber: `Hadits Arbain No. ${randomHadits.no}: ${randomHadits.judul}`
        } : null
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
    result.data.sumber = "BAZNAS (Badan Amil Zakat Nasional)";
  } else if (type === "penghasilan") {
    const nishabEmasBulan = 85 * hargaEmas / 12;
    result.data.nishab = nishabEmasBulan;
    result.data.isWajib = amount >= nishabEmasBulan;
    result.data.zakat = result.data.isWajib ? amount * 0.025 : 0;
    result.data.keterangan = "Nishab Zakat Penghasilan setara 85 gram emas per tahun (dibagi 12 bulan). Tarif 2,5%.";
    result.data.sumber = "Peraturan Menteri Agama No. 31 Tahun 2019 & BAZNAS";
  } else if (type === "fitrah") {
    const hargaBeras = parseFloat(c.req.query("hargaBeras") || 15e3);
    const jumlahOrang = parseInt(c.req.query("jumlahOrang") || 1);
    const zakatPerOrang = 2.5 * hargaBeras;
    result.data.nishab = 0;
    result.data.isWajib = true;
    result.data.zakat = zakatPerOrang * jumlahOrang;
    result.data.keterangan = `Zakat Fitrah adalah 2.5kg beras per jiwa. Estimasi Rp${zakatPerOrang.toLocaleString("id-ID")} per jiwa.`;
    result.data.sumber = "Ketentuan Fiqh (Zakat Fitrah 2.5kg/3.5 liter beras)";
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
  const query = c.req.query("query");
  if (!query) return c.json({ status: false, message: "Parameter query diperlukan." }, 400);
  try {
    const queryLower = query.toLowerCase();
    const searchTerms = queryLower.split(" ");
    const surahList = await getSurahList();
    let quranResults = [];
    for (const s of surahList) {
      const ayahs = await getAyahBySurah(s.number);
      if (ayahs) {
        const matches = ayahs.filter((a) => {
          const text = (a.text || "").toLowerCase();
          return searchTerms.every((term) => text.includes(term));
        }).slice(0, 5);
        if (matches.length > 0) {
          const surahName = s.name_id || s.name_en || s.name_long;
          quranResults.push(...matches.map((a) => ({
            arab: a.arab,
            text: a.text,
            sumber: `QS. ${surahName}: ${a.ayah}`
          })));
        }
      }
      if (quranResults.length >= 10) break;
    }
    const allArbain = await getHaditsArbain();
    const arbainMatches = allArbain ? allArbain.filter((h) => {
      const text = (h.judul + " " + h.indo).toLowerCase();
      return searchTerms.every((term) => text.includes(term));
    }).slice(0, 5) : [];
    const formattedArbain = arbainMatches.map((h) => ({
      arab: h.arab,
      text: h.indo,
      sumber: `Hadits Arbain No. ${h.no}: ${h.judul}`
    }));
    let globalHadits = [];
    const allBooks = [
      "bukhari",
      "muslim",
      "abu-daud",
      "tirmidzi",
      "nasai",
      "ibnu-majah",
      "ahmad",
      "darimi",
      "malik"
    ];
    for (const book of allBooks) {
      const allHadits = await getLocalHadits(book);
      if (allHadits) {
        const matches = allHadits.filter((h) => {
          const text = (h.id || "").toLowerCase();
          return searchTerms.every((term) => text.includes(term));
        }).slice(0, 2);
        const bookName = book.split("-").map((word2) => word2.charAt(0).toUpperCase() + word2.slice(1)).join(" ");
        globalHadits.push(...matches.map((h) => ({
          arab: h.arab,
          text: h.id,
          sumber: `HR. ${bookName} No. ${h.number}`
        })));
      }
      if (globalHadits.length >= 15) break;
    }
    const totalHadits = [...formattedArbain, ...globalHadits];
    const allPuasa = await getPuasa();
    const puasaMatches = allPuasa ? allPuasa.filter((p) => {
      const text = (p.nama + " " + p.deskripsi + " " + p.dalil).toLowerCase();
      return searchTerms.every((term) => text.includes(term));
    }).slice(0, 5) : [];
    const formattedPuasa = puasaMatches.map((p) => ({
      text: `${p.nama}: ${p.deskripsi}`,
      dalil: p.dalil,
      sumber: `Fitur Puasa (${p.hukum})`
    }));
    const allFiqh = await getFiqhPuasa();
    let fiqhResults = [];
    if (allFiqh) {
      for (const category of allFiqh) {
        const matches = category.points.filter((pt) => {
          const text = (pt.title + " " + pt.content).toLowerCase();
          return searchTerms.every((term) => text.includes(term));
        }).slice(0, 3);
        fiqhResults.push(...matches.map((pt) => ({
          text: pt.title,
          content: pt.content,
          sumber: `70 Masalah Puasa - Sumber: islamqa.info`
        })));
        if (fiqhResults.length >= 10) break;
      }
    }
    if (quranResults.length === 0 && totalHadits.length === 0 && formattedPuasa.length === 0 && fiqhResults.length === 0) {
      return c.json({
        status: false,
        message: `Tidak ada hasil pencarian semantik untuk '${query}'.`,
        data: {
          query,
          quran: [],
          hadits: [],
          puasa: [],
          fiqh: []
        }
      }, 404);
    }
    return c.json({
      status: true,
      message: `Pencarian semantik untuk '${query}' berhasil.`,
      data: {
        query,
        quran: quranResults,
        hadits: totalHadits,
        puasa: formattedPuasa,
        fiqh: fiqhResults
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Pencarian semantik gagal: " + error.message }, 500);
  }
});
tools.get("/faraidh", (c) => {
  try {
    const totalHarta = parseFloat(c.req.query("totalHarta") || 0);
    const suami = parseInt(c.req.query("suami") || 0);
    const istri = parseInt(c.req.query("istri") || 0);
    const anakLk = parseInt(c.req.query("anakLk") || 0);
    const anakPr = parseInt(c.req.query("anakPr") || 0);
    const ayah2 = c.req.query("ayah") === "true";
    const ibu = c.req.query("ibu") === "true";
    if (totalHarta <= 0) {
      return c.json({ status: false, message: "Total harta harus lebih besar dari 0." }, 400);
    }
    if (suami > 0 && istri > 0) {
      return c.json({ status: false, message: "Tidak mungkin ada suami dan istri secara bersamaan dalam satu kasus waris." }, 400);
    }
    let results = [];
    let denominators = [];
    const adaAnak = anakLk > 0 || anakPr > 0;
    let furud = {
      suami: 0,
      istri: 0,
      ibu: 0,
      ayah: 0,
      anakPr: 0
    };
    if (suami > 0) {
      furud.suami = adaAnak ? 1 / 4 : 1 / 2;
    }
    if (istri > 0) {
      furud.istri = adaAnak ? 1 / 8 : 1 / 4;
    }
    if (ibu) {
      furud.ibu = adaAnak ? 1 / 6 : 1 / 3;
    }
    if (ayah2) {
      if (anakLk > 0) {
        furud.ayah = 1 / 6;
      } else if (anakPr > 0) {
        furud.ayah = 1 / 6;
      } else {
        furud.ayah = 0;
      }
    }
    if (anakLk === 0 && anakPr > 0) {
      if (anakPr === 1) {
        furud.anakPr = 1 / 2;
      } else {
        furud.anakPr = 2 / 3;
      }
    }
    let totalFurud = furud.suami + furud.istri + furud.ibu + furud.ayah + furud.anakPr;
    let sisa = 1 - totalFurud;
    let asabah = {
      ayah: 0,
      anakLk: 0,
      anakPr: 0
    };
    if (sisa > 0) {
      if (ayah2 && anakLk === 0) {
        asabah.ayah = sisa;
        sisa = 0;
      } else if (anakLk > 0) {
        const totalRasio = anakLk * 2 + anakPr;
        const perBagian = sisa / totalRasio;
        asabah.anakLk = perBagian * 2 * anakLk;
        asabah.anakPr = perBagian * anakPr;
        sisa = 0;
      }
    }
    if (totalFurud > 1) {
      const faktorAul = 1 / totalFurud;
      furud.suami *= faktorAul;
      furud.istri *= faktorAul;
      furud.ibu *= faktorAul;
      furud.ayah *= faktorAul;
      furud.anakPr *= faktorAul;
      totalFurud = 1;
    }
    if (totalFurud < 1 && anakLk === 0 && !ayah2) {
      let raddBeneficiaries = furud.ibu + furud.anakPr;
      if (raddBeneficiaries > 0) {
        const faktorRadd = (1 - (furud.suami + furud.istri)) / raddBeneficiaries;
        furud.ibu *= faktorRadd;
        furud.anakPr *= faktorRadd;
      }
    }
    const addResult = (nama, rasio, jumlah = 1) => {
      if (rasio > 0) {
        results.push({
          ahli_waris: nama,
          jumlah,
          bagian_persen: (rasio * 100).toFixed(2) + "%",
          nominal: Math.floor(totalHarta * rasio)
        });
      }
    };
    addResult("Suami", furud.suami);
    addResult("Istri", furud.istri, istri);
    addResult("Ibu", furud.ibu);
    addResult("Ayah", furud.ayah + asabah.ayah);
    addResult("Anak Laki-laki", asabah.anakLk, anakLk);
    addResult("Anak Perempuan", furud.anakPr + asabah.anakPr, anakPr);
    return c.json({
      status: true,
      message: "Kalkulasi waris berhasil.",
      data: {
        total_harta: totalHarta,
        rincian: results,
        zakat_harta: totalHarta >= 85e6 ? Math.floor(totalHarta * 0.025) : 0,
        // Reminder zakat jika mencapai nishab
        keterangan: "Perhitungan ini menggunakan standar ilmu Faraidh (KHI). Sangat disarankan untuk berkonsultasi dengan ahli agama/KUA setempat.",
        sumber: "Kompilasi Hukum Islam (KHI) & Fiqh Mawaris"
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal menghitung waris: " + error.message }, 500);
  }
});
var tools_default = tools;

// src/routes/muslim/v1/analytics.js
var analytics = new Hono2();
analytics.get("/", async (c) => {
  try {
    const stats = await getAnalytics();
    const surahList = await getSurahList();
    const trendingSurahs = Object.entries(stats.trending_surahs).map(([id, count]) => {
      const surah2 = surahList ? surahList.find((s) => s.number == id) : null;
      return {
        id,
        name: surah2 ? surah2.name_id : "Unknown",
        reads: count
      };
    }).sort((a, b) => b.reads - a.reads).slice(0, 10);
    return c.json({
      status: true,
      message: "Berhasil mendapatkan statistik spiritual global.",
      data: {
        total_reads: stats.total_reads,
        global_khatam_count: stats.global_khatam,
        trending_surahs: trendingSurahs,
        last_updated: stats.last_updated
      }
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mendapatkan data analitik: " + error.message }, 500);
  }
});
analytics.post("/khatam", async (c) => {
  try {
    const success = await updateAnalytics("khatam");
    if (success) {
      return c.json({
        status: true,
        message: "Alhamdulillah! Satu khatam baru telah tercatat dalam statistik global. Semoga berkah."
      });
    }
    return c.json({ status: false, message: "Gagal mencatat khatam." }, 500);
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});
var analytics_default = analytics;

// src/routes/muslim/v1/puasa.js
var puasa = new Hono2();
puasa.get("/", async (c) => {
  try {
    const data = await getPuasa();
    if (!data) throw new Error("Data puasa tidak tersedia");
    return c.json({
      status: true,
      message: "Berhasil mengambil daftar puasa.",
      data
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mengambil data puasa: " + error.message }, 500);
  }
});
puasa.get("/fiqh", async (c) => {
  try {
    const data = await getFiqhPuasa();
    if (!data) throw new Error("Data fiqh puasa tidak tersedia");
    return c.json({
      status: true,
      message: "Berhasil mengambil 70 Masalah Terkait Puasa (Fiqh & Adab).",
      data
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mengambil data fiqh puasa: " + error.message }, 500);
  }
});
puasa.get("/find", async (c) => {
  const query = c.req.query("query");
  if (!query) return c.json({ status: false, message: "Parameter query diperlukan." }, 400);
  try {
    const data = await getPuasa();
    const filtered = data.filter(
      (p) => p.nama.toLowerCase().includes(query.toLowerCase()) || p.deskripsi.toLowerCase().includes(query.toLowerCase())
    );
    return c.json({
      status: true,
      message: `Berhasil mencari puasa dengan query: ${query}`,
      data: filtered
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mencari data puasa: " + error.message }, 500);
  }
});
puasa.get("/type/:type", async (c) => {
  const type = c.req.param("type");
  try {
    const data = await getPuasa();
    const filtered = data.filter((p) => p.type === type);
    return c.json({
      status: true,
      message: `Berhasil mengambil daftar puasa tipe: ${type}`,
      data: filtered
    });
  } catch (error) {
    return c.json({ status: false, message: "Gagal mengambil data puasa: " + error.message }, 500);
  }
});
var puasa_default = puasa;

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
v1.route("/analytics", analytics_default);
v1.route("/puasa", puasa_default);
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
            contoh: "/v1/ayah/find?query=puasa"
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
      puasa: {
        semua: {
          pattern: "/v1/puasa"
        },
        fiqh: {
          pattern: "/v1/puasa/fiqh"
        },
        cari: {
          pattern: "/v1/puasa/find?query={query}",
          contoh: "/v1/puasa/find?query=bidh"
        },
        filterTipe: {
          pattern: "/v1/puasa/type/{type}",
          contoh: "/v1/puasa/type/mingguan"
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
          pattern: "/v1/tools/zakat?type={type}&amount={amount}&hargaEmas={hargaEmas}&hargaBeras={hargaBeras}&jumlahOrang={jumlahOrang}",
          contoh: "/v1/tools/zakat?type=maal&amount=100000000"
        },
        faraidh: {
          pattern: "/v1/tools/faraidh?totalHarta={totalHarta}&suami={suami}&istri={istri}&anakLk={anakLk}&anakPr={anakPr}&ayah={ayah}&ibu={ibu}",
          contoh: "/v1/tools/faraidh?totalHarta=120000000&suami=1&anakLk=1&anakPr=1"
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
      analytics: {
        global: {
          pattern: "/v1/analytics"
        },
        laporKhatam: {
          pattern: "/v1/analytics/khatam",
          method: "POST"
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

// src/utils/qris.js
function generateCRC16(data) {
  let crc = 65535;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 32768) !== 0) {
        crc = (crc << 1 ^ 4129) & 65535;
      } else {
        crc = crc << 1 & 65535;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
function createDynamicQRIS(staticQris, amount) {
  if (!staticQris) throw new Error("QRIS statis diperlukan");
  let baseQris = staticQris.slice(0, -4);
  if (baseQris.endsWith("6304")) {
    baseQris = baseQris.slice(0, -4);
  }
  const parts = [];
  let pos = 0;
  while (pos < baseQris.length) {
    const tag = baseQris.substring(pos, pos + 2);
    const len = parseInt(baseQris.substring(pos + 2, pos + 4));
    const val = baseQris.substring(pos + 4, pos + 4 + len);
    parts.push({ tag, len, val });
    pos += 4 + len;
  }
  const tag01 = parts.find((p) => p.tag === "01");
  if (tag01) {
    tag01.val = "12";
    tag01.len = 2;
  }
  const amountStr = amount.toString();
  const tag54 = parts.find((p) => p.tag === "54");
  if (tag54) {
    tag54.val = amountStr;
    tag54.len = amountStr.length;
  } else {
    const index58 = parts.findIndex((p) => parseInt(p.tag) > 54);
    const newTag = { tag: "54", len: amountStr.length, val: amountStr };
    if (index58 !== -1) {
      parts.splice(index58, 0, newTag);
    } else {
      parts.push(newTag);
    }
  }
  let dynamicQris = parts.sort((a, b) => a.tag.localeCompare(b.tag)).map((p) => p.tag + p.len.toString().padStart(2, "0") + p.val).join("");
  dynamicQris += "6304";
  const crc = generateCRC16(dynamicQris);
  return dynamicQris + crc;
}

// node_modules/qrcode-generator/dist/qrcode.mjs
var qrcode = function(typeNumber, errorCorrectionLevel) {
  const PAD0 = 236;
  const PAD1 = 17;
  let _typeNumber = typeNumber;
  const _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
  let _modules = null;
  let _moduleCount = 0;
  let _dataCache = null;
  const _dataList = [];
  const _this = {};
  const makeImpl = function(test, maskPattern) {
    _moduleCount = _typeNumber * 4 + 17;
    _modules = (function(moduleCount) {
      const modules = new Array(moduleCount);
      for (let row = 0; row < moduleCount; row += 1) {
        modules[row] = new Array(moduleCount);
        for (let col = 0; col < moduleCount; col += 1) {
          modules[row][col] = null;
        }
      }
      return modules;
    })(_moduleCount);
    setupPositionProbePattern(0, 0);
    setupPositionProbePattern(_moduleCount - 7, 0);
    setupPositionProbePattern(0, _moduleCount - 7);
    setupPositionAdjustPattern();
    setupTimingPattern();
    setupTypeInfo(test, maskPattern);
    if (_typeNumber >= 7) {
      setupTypeNumber(test);
    }
    if (_dataCache == null) {
      _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
    }
    mapData(_dataCache, maskPattern);
  };
  const setupPositionProbePattern = function(row, col) {
    for (let r = -1; r <= 7; r += 1) {
      if (row + r <= -1 || _moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c += 1) {
        if (col + c <= -1 || _moduleCount <= col + c) continue;
        if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
          _modules[row + r][col + c] = true;
        } else {
          _modules[row + r][col + c] = false;
        }
      }
    }
  };
  const getBestMaskPattern = function() {
    let minLostPoint = 0;
    let pattern = 0;
    for (let i = 0; i < 8; i += 1) {
      makeImpl(true, i);
      const lostPoint = QRUtil.getLostPoint(_this);
      if (i == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }
    return pattern;
  };
  const setupTimingPattern = function() {
    for (let r = 8; r < _moduleCount - 8; r += 1) {
      if (_modules[r][6] != null) {
        continue;
      }
      _modules[r][6] = r % 2 == 0;
    }
    for (let c = 8; c < _moduleCount - 8; c += 1) {
      if (_modules[6][c] != null) {
        continue;
      }
      _modules[6][c] = c % 2 == 0;
    }
  };
  const setupPositionAdjustPattern = function() {
    const pos = QRUtil.getPatternPosition(_typeNumber);
    for (let i = 0; i < pos.length; i += 1) {
      for (let j = 0; j < pos.length; j += 1) {
        const row = pos[i];
        const col = pos[j];
        if (_modules[row][col] != null) {
          continue;
        }
        for (let r = -2; r <= 2; r += 1) {
          for (let c = -2; c <= 2; c += 1) {
            if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
              _modules[row + r][col + c] = true;
            } else {
              _modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  };
  const setupTypeNumber = function(test) {
    const bits = QRUtil.getBCHTypeNumber(_typeNumber);
    for (let i = 0; i < 18; i += 1) {
      const mod = !test && (bits >> i & 1) == 1;
      _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
    }
    for (let i = 0; i < 18; i += 1) {
      const mod = !test && (bits >> i & 1) == 1;
      _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  };
  const setupTypeInfo = function(test, maskPattern) {
    const data = _errorCorrectionLevel << 3 | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);
    for (let i = 0; i < 15; i += 1) {
      const mod = !test && (bits >> i & 1) == 1;
      if (i < 6) {
        _modules[i][8] = mod;
      } else if (i < 8) {
        _modules[i + 1][8] = mod;
      } else {
        _modules[_moduleCount - 15 + i][8] = mod;
      }
    }
    for (let i = 0; i < 15; i += 1) {
      const mod = !test && (bits >> i & 1) == 1;
      if (i < 8) {
        _modules[8][_moduleCount - i - 1] = mod;
      } else if (i < 9) {
        _modules[8][15 - i - 1 + 1] = mod;
      } else {
        _modules[8][15 - i - 1] = mod;
      }
    }
    _modules[_moduleCount - 8][8] = !test;
  };
  const mapData = function(data, maskPattern) {
    let inc = -1;
    let row = _moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    const maskFunc = QRUtil.getMaskFunction(maskPattern);
    for (let col = _moduleCount - 1; col > 0; col -= 2) {
      if (col == 6) col -= 1;
      while (true) {
        for (let c = 0; c < 2; c += 1) {
          if (_modules[row][col - c] == null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = (data[byteIndex] >>> bitIndex & 1) == 1;
            }
            const mask = maskFunc(row, col - c);
            if (mask) {
              dark = !dark;
            }
            _modules[row][col - c] = dark;
            bitIndex -= 1;
            if (bitIndex == -1) {
              byteIndex += 1;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || _moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  };
  const createBytes = function(buffer, rsBlocks) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcdata = new Array(rsBlocks.length);
    const ecdata = new Array(rsBlocks.length);
    for (let r = 0; r < rsBlocks.length; r += 1) {
      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (let i = 0; i < dcdata[r].length; i += 1) {
        dcdata[r][i] = 255 & buffer.getBuffer()[i + offset];
      }
      offset += dcCount;
      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (let i = 0; i < ecdata[r].length; i += 1) {
        const modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
      }
    }
    let totalCodeCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalCodeCount += rsBlocks[i].totalCount;
    }
    const data = new Array(totalCodeCount);
    let index = 0;
    for (let i = 0; i < maxDcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < dcdata[r].length) {
          data[index] = dcdata[r][i];
          index += 1;
        }
      }
    }
    for (let i = 0; i < maxEcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < ecdata[r].length) {
          data[index] = ecdata[r][i];
          index += 1;
        }
      }
    }
    return data;
  };
  const createData = function(typeNumber2, errorCorrectionLevel2, dataList) {
    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectionLevel2);
    const buffer = qrBitBuffer();
    for (let i = 0; i < dataList.length; i += 1) {
      const data = dataList[i];
      buffer.put(data.getMode(), 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
      data.write(buffer);
    }
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalDataCount += rsBlocks[i].dataCount;
    }
    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw "code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")";
    }
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD0, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD1, 8);
    }
    return createBytes(buffer, rsBlocks);
  };
  _this.addData = function(data, mode) {
    mode = mode || "Byte";
    let newData = null;
    switch (mode) {
      case "Numeric":
        newData = qrNumber(data);
        break;
      case "Alphanumeric":
        newData = qrAlphaNum(data);
        break;
      case "Byte":
        newData = qr8BitByte(data);
        break;
      case "Kanji":
        newData = qrKanji(data);
        break;
      default:
        throw "mode:" + mode;
    }
    _dataList.push(newData);
    _dataCache = null;
  };
  _this.isDark = function(row, col) {
    if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
      throw row + "," + col;
    }
    return _modules[row][col];
  };
  _this.getModuleCount = function() {
    return _moduleCount;
  };
  _this.make = function() {
    if (_typeNumber < 1) {
      let typeNumber2 = 1;
      for (; typeNumber2 < 40; typeNumber2++) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, _errorCorrectionLevel);
        const buffer = qrBitBuffer();
        for (let i = 0; i < _dataList.length; i++) {
          const data = _dataList[i];
          buffer.put(data.getMode(), 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
          data.write(buffer);
        }
        let totalDataCount = 0;
        for (let i = 0; i < rsBlocks.length; i++) {
          totalDataCount += rsBlocks[i].dataCount;
        }
        if (buffer.getLengthInBits() <= totalDataCount * 8) {
          break;
        }
      }
      _typeNumber = typeNumber2;
    }
    makeImpl(false, getBestMaskPattern());
  };
  _this.createTableTag = function(cellSize, margin) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    let qrHtml = "";
    qrHtml += '<table style="';
    qrHtml += " border-width: 0px; border-style: none;";
    qrHtml += " border-collapse: collapse;";
    qrHtml += " padding: 0px; margin: " + margin + "px;";
    qrHtml += '">';
    qrHtml += "<tbody>";
    for (let r = 0; r < _this.getModuleCount(); r += 1) {
      qrHtml += "<tr>";
      for (let c = 0; c < _this.getModuleCount(); c += 1) {
        qrHtml += '<td style="';
        qrHtml += " border-width: 0px; border-style: none;";
        qrHtml += " border-collapse: collapse;";
        qrHtml += " padding: 0px; margin: 0px;";
        qrHtml += " width: " + cellSize + "px;";
        qrHtml += " height: " + cellSize + "px;";
        qrHtml += " background-color: ";
        qrHtml += _this.isDark(r, c) ? "#000000" : "#ffffff";
        qrHtml += ";";
        qrHtml += '"/>';
      }
      qrHtml += "</tr>";
    }
    qrHtml += "</tbody>";
    qrHtml += "</table>";
    return qrHtml;
  };
  _this.createSvgTag = function(cellSize, margin, alt, title3) {
    let opts = {};
    if (typeof arguments[0] == "object") {
      opts = arguments[0];
      cellSize = opts.cellSize;
      margin = opts.margin;
      alt = opts.alt;
      title3 = opts.title;
    }
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    alt = typeof alt === "string" ? { text: alt } : alt || {};
    alt.text = alt.text || null;
    alt.id = alt.text ? alt.id || "qrcode-description" : null;
    title3 = typeof title3 === "string" ? { text: title3 } : title3 || {};
    title3.text = title3.text || null;
    title3.id = title3.text ? title3.id || "qrcode-title" : null;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    let c, mc, r, mr, qrSvg = "", rect;
    rect = "l" + cellSize + ",0 0," + cellSize + " -" + cellSize + ",0 0,-" + cellSize + "z ";
    qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
    qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : "";
    qrSvg += ' viewBox="0 0 ' + size + " " + size + '" ';
    qrSvg += ' preserveAspectRatio="xMinYMin meet"';
    qrSvg += title3.text || alt.text ? ' role="img" aria-labelledby="' + escapeXml([title3.id, alt.id].join(" ").trim()) + '"' : "";
    qrSvg += ">";
    qrSvg += title3.text ? '<title id="' + escapeXml(title3.id) + '">' + escapeXml(title3.text) + "</title>" : "";
    qrSvg += alt.text ? '<description id="' + escapeXml(alt.id) + '">' + escapeXml(alt.text) + "</description>" : "";
    qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
    qrSvg += '<path d="';
    for (r = 0; r < _this.getModuleCount(); r += 1) {
      mr = r * cellSize + margin;
      for (c = 0; c < _this.getModuleCount(); c += 1) {
        if (_this.isDark(r, c)) {
          mc = c * cellSize + margin;
          qrSvg += "M" + mc + "," + mr + rect;
        }
      }
    }
    qrSvg += '" stroke="transparent" fill="black"/>';
    qrSvg += "</svg>";
    return qrSvg;
  };
  _this.createDataURL = function(cellSize, margin) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    return createDataURL(size, size, function(x, y) {
      if (min <= x && x < max && min <= y && y < max) {
        const c = Math.floor((x - min) / cellSize);
        const r = Math.floor((y - min) / cellSize);
        return _this.isDark(r, c) ? 0 : 1;
      } else {
        return 1;
      }
    });
  };
  _this.createImgTag = function(cellSize, margin, alt) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    let img = "";
    img += "<img";
    img += ' src="';
    img += _this.createDataURL(cellSize, margin);
    img += '"';
    img += ' width="';
    img += size;
    img += '"';
    img += ' height="';
    img += size;
    img += '"';
    if (alt) {
      img += ' alt="';
      img += escapeXml(alt);
      img += '"';
    }
    img += "/>";
    return img;
  };
  const escapeXml = function(s) {
    let escaped = "";
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charAt(i);
      switch (c) {
        case "<":
          escaped += "&lt;";
          break;
        case ">":
          escaped += "&gt;";
          break;
        case "&":
          escaped += "&amp;";
          break;
        case '"':
          escaped += "&quot;";
          break;
        default:
          escaped += c;
          break;
      }
    }
    return escaped;
  };
  const _createHalfASCII = function(margin) {
    const cellSize = 1;
    margin = typeof margin == "undefined" ? cellSize * 2 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    let y, x, r1, r2, p;
    const blocks = {
      "\u2588\u2588": "\u2588",
      "\u2588 ": "\u2580",
      " \u2588": "\u2584",
      "  ": " "
    };
    const blocksLastLineNoMargin = {
      "\u2588\u2588": "\u2580",
      "\u2588 ": "\u2580",
      " \u2588": " ",
      "  ": " "
    };
    let ascii = "";
    for (y = 0; y < size; y += 2) {
      r1 = Math.floor((y - min) / cellSize);
      r2 = Math.floor((y + 1 - min) / cellSize);
      for (x = 0; x < size; x += 1) {
        p = "\u2588";
        if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
          p = " ";
        }
        if (min <= x && x < max && min <= y + 1 && y + 1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
          p += " ";
        } else {
          p += "\u2588";
        }
        ascii += margin < 1 && y + 1 >= max ? blocksLastLineNoMargin[p] : blocks[p];
      }
      ascii += "\n";
    }
    if (size % 2 && margin > 0) {
      return ascii.substring(0, ascii.length - size - 1) + Array(size + 1).join("\u2580");
    }
    return ascii.substring(0, ascii.length - 1);
  };
  _this.createASCII = function(cellSize, margin) {
    cellSize = cellSize || 1;
    if (cellSize < 2) {
      return _createHalfASCII(margin);
    }
    cellSize -= 1;
    margin = typeof margin == "undefined" ? cellSize * 2 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    let y, x, r, p;
    const white = Array(cellSize + 1).join("\u2588\u2588");
    const black = Array(cellSize + 1).join("  ");
    let ascii = "";
    let line = "";
    for (y = 0; y < size; y += 1) {
      r = Math.floor((y - min) / cellSize);
      line = "";
      for (x = 0; x < size; x += 1) {
        p = 1;
        if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
          p = 0;
        }
        line += p ? white : black;
      }
      for (r = 0; r < cellSize; r += 1) {
        ascii += line + "\n";
      }
    }
    return ascii.substring(0, ascii.length - 1);
  };
  _this.renderTo2dContext = function(context, cellSize) {
    cellSize = cellSize || 2;
    const length = _this.getModuleCount();
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        context.fillStyle = _this.isDark(row, col) ? "black" : "white";
        context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  };
  return _this;
};
qrcode.stringToBytes = function(s) {
  const bytes = [];
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charCodeAt(i);
    bytes.push(c & 255);
  }
  return bytes;
};
qrcode.createStringToBytes = function(unicodeData, numChars) {
  const unicodeMap = (function() {
    const bin = base64DecodeInputStream(unicodeData);
    const read = function() {
      const b = bin.read();
      if (b == -1) throw "eof";
      return b;
    };
    let count = 0;
    const unicodeMap2 = {};
    while (true) {
      const b0 = bin.read();
      if (b0 == -1) break;
      const b1 = read();
      const b2 = read();
      const b3 = read();
      const k = String.fromCharCode(b0 << 8 | b1);
      const v = b2 << 8 | b3;
      unicodeMap2[k] = v;
      count += 1;
    }
    if (count != numChars) {
      throw count + " != " + numChars;
    }
    return unicodeMap2;
  })();
  const unknownChar = "?".charCodeAt(0);
  return function(s) {
    const bytes = [];
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charCodeAt(i);
      if (c < 128) {
        bytes.push(c);
      } else {
        const b = unicodeMap[s.charAt(i)];
        if (typeof b == "number") {
          if ((b & 255) == b) {
            bytes.push(b);
          } else {
            bytes.push(b >>> 8);
            bytes.push(b & 255);
          }
        } else {
          bytes.push(unknownChar);
        }
      }
    }
    return bytes;
  };
};
var QRMode = {
  MODE_NUMBER: 1 << 0,
  MODE_ALPHA_NUM: 1 << 1,
  MODE_8BIT_BYTE: 1 << 2,
  MODE_KANJI: 1 << 3
};
var QRErrorCorrectionLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2
};
var QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
};
var QRUtil = (function() {
  const PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ];
  const G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
  const G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
  const G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
  const _this = {};
  const getBCHDigit = function(data) {
    let digit = 0;
    while (data != 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  };
  _this.getBCHTypeInfo = function(data) {
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
      d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
    }
    return (data << 10 | d) ^ G15_MASK;
  };
  _this.getBCHTypeNumber = function(data) {
    let d = data << 12;
    while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
      d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
    }
    return data << 12 | d;
  };
  _this.getPatternPosition = function(typeNumber) {
    return PATTERN_POSITION_TABLE[typeNumber - 1];
  };
  _this.getMaskFunction = function(maskPattern) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return function(i, j) {
          return (i + j) % 2 == 0;
        };
      case QRMaskPattern.PATTERN001:
        return function(i, j) {
          return i % 2 == 0;
        };
      case QRMaskPattern.PATTERN010:
        return function(i, j) {
          return j % 3 == 0;
        };
      case QRMaskPattern.PATTERN011:
        return function(i, j) {
          return (i + j) % 3 == 0;
        };
      case QRMaskPattern.PATTERN100:
        return function(i, j) {
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
        };
      case QRMaskPattern.PATTERN101:
        return function(i, j) {
          return i * j % 2 + i * j % 3 == 0;
        };
      case QRMaskPattern.PATTERN110:
        return function(i, j) {
          return (i * j % 2 + i * j % 3) % 2 == 0;
        };
      case QRMaskPattern.PATTERN111:
        return function(i, j) {
          return (i * j % 3 + (i + j) % 2) % 2 == 0;
        };
      default:
        throw "bad maskPattern:" + maskPattern;
    }
  };
  _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
    let a = qrPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i += 1) {
      a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
    }
    return a;
  };
  _this.getLengthInBits = function(mode, type) {
    if (1 <= type && type < 10) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10;
        case QRMode.MODE_ALPHA_NUM:
          return 9;
        case QRMode.MODE_8BIT_BYTE:
          return 8;
        case QRMode.MODE_KANJI:
          return 8;
        default:
          throw "mode:" + mode;
      }
    } else if (type < 27) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12;
        case QRMode.MODE_ALPHA_NUM:
          return 11;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 10;
        default:
          throw "mode:" + mode;
      }
    } else if (type < 41) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14;
        case QRMode.MODE_ALPHA_NUM:
          return 13;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 12;
        default:
          throw "mode:" + mode;
      }
    } else {
      throw "type:" + type;
    }
  };
  _this.getLostPoint = function(qrcode2) {
    const moduleCount = qrcode2.getModuleCount();
    let lostPoint = 0;
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        let sameCount = 0;
        const dark = qrcode2.isDark(row, col);
        for (let r = -1; r <= 1; r += 1) {
          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }
          for (let c = -1; c <= 1; c += 1) {
            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }
            if (r == 0 && c == 0) {
              continue;
            }
            if (dark == qrcode2.isDark(row + r, col + c)) {
              sameCount += 1;
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }
    ;
    for (let row = 0; row < moduleCount - 1; row += 1) {
      for (let col = 0; col < moduleCount - 1; col += 1) {
        let count = 0;
        if (qrcode2.isDark(row, col)) count += 1;
        if (qrcode2.isDark(row + 1, col)) count += 1;
        if (qrcode2.isDark(row, col + 1)) count += 1;
        if (qrcode2.isDark(row + 1, col + 1)) count += 1;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount - 6; col += 1) {
        if (qrcode2.isDark(row, col) && !qrcode2.isDark(row, col + 1) && qrcode2.isDark(row, col + 2) && qrcode2.isDark(row, col + 3) && qrcode2.isDark(row, col + 4) && !qrcode2.isDark(row, col + 5) && qrcode2.isDark(row, col + 6)) {
          lostPoint += 40;
        }
      }
    }
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount - 6; row += 1) {
        if (qrcode2.isDark(row, col) && !qrcode2.isDark(row + 1, col) && qrcode2.isDark(row + 2, col) && qrcode2.isDark(row + 3, col) && qrcode2.isDark(row + 4, col) && !qrcode2.isDark(row + 5, col) && qrcode2.isDark(row + 6, col)) {
          lostPoint += 40;
        }
      }
    }
    let darkCount = 0;
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount; row += 1) {
        if (qrcode2.isDark(row, col)) {
          darkCount += 1;
        }
      }
    }
    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;
    return lostPoint;
  };
  return _this;
})();
var QRMath = (function() {
  const EXP_TABLE = new Array(256);
  const LOG_TABLE = new Array(256);
  for (let i = 0; i < 8; i += 1) {
    EXP_TABLE[i] = 1 << i;
  }
  for (let i = 8; i < 256; i += 1) {
    EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
  }
  for (let i = 0; i < 255; i += 1) {
    LOG_TABLE[EXP_TABLE[i]] = i;
  }
  const _this = {};
  _this.glog = function(n) {
    if (n < 1) {
      throw "glog(" + n + ")";
    }
    return LOG_TABLE[n];
  };
  _this.gexp = function(n) {
    while (n < 0) {
      n += 255;
    }
    while (n >= 256) {
      n -= 255;
    }
    return EXP_TABLE[n];
  };
  return _this;
})();
var qrPolynomial = function(num, shift) {
  if (typeof num.length == "undefined") {
    throw num.length + "/" + shift;
  }
  const _num = (function() {
    let offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset += 1;
    }
    const _num2 = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i += 1) {
      _num2[i] = num[i + offset];
    }
    return _num2;
  })();
  const _this = {};
  _this.getAt = function(index) {
    return _num[index];
  };
  _this.getLength = function() {
    return _num.length;
  };
  _this.multiply = function(e) {
    const num2 = new Array(_this.getLength() + e.getLength() - 1);
    for (let i = 0; i < _this.getLength(); i += 1) {
      for (let j = 0; j < e.getLength(); j += 1) {
        num2[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
      }
    }
    return qrPolynomial(num2, 0);
  };
  _this.mod = function(e) {
    if (_this.getLength() - e.getLength() < 0) {
      return _this;
    }
    const ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));
    const num2 = new Array(_this.getLength());
    for (let i = 0; i < _this.getLength(); i += 1) {
      num2[i] = _this.getAt(i);
    }
    for (let i = 0; i < e.getLength(); i += 1) {
      num2[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
    }
    return qrPolynomial(num2, 0).mod(e);
  };
  return _this;
};
var QRRSBlock = (function() {
  const RS_BLOCK_TABLE = [
    // L
    // M
    // Q
    // H
    // 1
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    // 2
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    // 3
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    // 4
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    // 5
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    // 6
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    // 7
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    // 8
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    // 9
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    // 10
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
    // 11
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],
    // 12
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],
    // 13
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],
    // 14
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],
    // 15
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12, 7, 37, 13],
    // 16
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],
    // 17
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],
    // 18
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],
    // 19
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],
    // 20
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],
    // 21
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],
    // 22
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],
    // 23
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],
    // 24
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],
    // 25
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],
    // 26
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],
    // 27
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],
    // 28
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],
    // 29
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],
    // 30
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],
    // 31
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],
    // 32
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],
    // 33
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],
    // 34
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],
    // 35
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],
    // 36
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],
    // 37
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],
    // 38
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],
    // 39
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],
    // 40
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16]
  ];
  const qrRSBlock = function(totalCount, dataCount) {
    const _this2 = {};
    _this2.totalCount = totalCount;
    _this2.dataCount = dataCount;
    return _this2;
  };
  const _this = {};
  const getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
    switch (errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return void 0;
    }
  };
  _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
    const rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
    if (typeof rsBlock == "undefined") {
      throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
    }
    const length = rsBlock.length / 3;
    const list = [];
    for (let i = 0; i < length; i += 1) {
      const count = rsBlock[i * 3 + 0];
      const totalCount = rsBlock[i * 3 + 1];
      const dataCount = rsBlock[i * 3 + 2];
      for (let j = 0; j < count; j += 1) {
        list.push(qrRSBlock(totalCount, dataCount));
      }
    }
    return list;
  };
  return _this;
})();
var qrBitBuffer = function() {
  const _buffer = [];
  let _length = 0;
  const _this = {};
  _this.getBuffer = function() {
    return _buffer;
  };
  _this.getAt = function(index) {
    const bufIndex = Math.floor(index / 8);
    return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
  };
  _this.put = function(num, length) {
    for (let i = 0; i < length; i += 1) {
      _this.putBit((num >>> length - i - 1 & 1) == 1);
    }
  };
  _this.getLengthInBits = function() {
    return _length;
  };
  _this.putBit = function(bit) {
    const bufIndex = Math.floor(_length / 8);
    if (_buffer.length <= bufIndex) {
      _buffer.push(0);
    }
    if (bit) {
      _buffer[bufIndex] |= 128 >>> _length % 8;
    }
    _length += 1;
  };
  return _this;
};
var qrNumber = function(data) {
  const _mode = QRMode.MODE_NUMBER;
  const _data = data;
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _data.length;
  };
  _this.write = function(buffer) {
    const data2 = _data;
    let i = 0;
    while (i + 2 < data2.length) {
      buffer.put(strToNum(data2.substring(i, i + 3)), 10);
      i += 3;
    }
    if (i < data2.length) {
      if (data2.length - i == 1) {
        buffer.put(strToNum(data2.substring(i, i + 1)), 4);
      } else if (data2.length - i == 2) {
        buffer.put(strToNum(data2.substring(i, i + 2)), 7);
      }
    }
  };
  const strToNum = function(s) {
    let num = 0;
    for (let i = 0; i < s.length; i += 1) {
      num = num * 10 + chatToNum(s.charAt(i));
    }
    return num;
  };
  const chatToNum = function(c) {
    if ("0" <= c && c <= "9") {
      return c.charCodeAt(0) - "0".charCodeAt(0);
    }
    throw "illegal char :" + c;
  };
  return _this;
};
var qrAlphaNum = function(data) {
  const _mode = QRMode.MODE_ALPHA_NUM;
  const _data = data;
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _data.length;
  };
  _this.write = function(buffer) {
    const s = _data;
    let i = 0;
    while (i + 1 < s.length) {
      buffer.put(
        getCode(s.charAt(i)) * 45 + getCode(s.charAt(i + 1)),
        11
      );
      i += 2;
    }
    if (i < s.length) {
      buffer.put(getCode(s.charAt(i)), 6);
    }
  };
  const getCode = function(c) {
    if ("0" <= c && c <= "9") {
      return c.charCodeAt(0) - "0".charCodeAt(0);
    } else if ("A" <= c && c <= "Z") {
      return c.charCodeAt(0) - "A".charCodeAt(0) + 10;
    } else {
      switch (c) {
        case " ":
          return 36;
        case "$":
          return 37;
        case "%":
          return 38;
        case "*":
          return 39;
        case "+":
          return 40;
        case "-":
          return 41;
        case ".":
          return 42;
        case "/":
          return 43;
        case ":":
          return 44;
        default:
          throw "illegal char :" + c;
      }
    }
  };
  return _this;
};
var qr8BitByte = function(data) {
  const _mode = QRMode.MODE_8BIT_BYTE;
  const _data = data;
  const _bytes = qrcode.stringToBytes(data);
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _bytes.length;
  };
  _this.write = function(buffer) {
    for (let i = 0; i < _bytes.length; i += 1) {
      buffer.put(_bytes[i], 8);
    }
  };
  return _this;
};
var qrKanji = function(data) {
  const _mode = QRMode.MODE_KANJI;
  const _data = data;
  const stringToBytes2 = qrcode.stringToBytes;
  !(function(c, code) {
    const test = stringToBytes2(c);
    if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
      throw "sjis not supported.";
    }
  })("\u53CB", 38726);
  const _bytes = stringToBytes2(data);
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return ~~(_bytes.length / 2);
  };
  _this.write = function(buffer) {
    const data2 = _bytes;
    let i = 0;
    while (i + 1 < data2.length) {
      let c = (255 & data2[i]) << 8 | 255 & data2[i + 1];
      if (33088 <= c && c <= 40956) {
        c -= 33088;
      } else if (57408 <= c && c <= 60351) {
        c -= 49472;
      } else {
        throw "illegal char at " + (i + 1) + "/" + c;
      }
      c = (c >>> 8 & 255) * 192 + (c & 255);
      buffer.put(c, 13);
      i += 2;
    }
    if (i < data2.length) {
      throw "illegal char at " + (i + 1);
    }
  };
  return _this;
};
var byteArrayOutputStream = function() {
  const _bytes = [];
  const _this = {};
  _this.writeByte = function(b) {
    _bytes.push(b & 255);
  };
  _this.writeShort = function(i) {
    _this.writeByte(i);
    _this.writeByte(i >>> 8);
  };
  _this.writeBytes = function(b, off, len) {
    off = off || 0;
    len = len || b.length;
    for (let i = 0; i < len; i += 1) {
      _this.writeByte(b[i + off]);
    }
  };
  _this.writeString = function(s) {
    for (let i = 0; i < s.length; i += 1) {
      _this.writeByte(s.charCodeAt(i));
    }
  };
  _this.toByteArray = function() {
    return _bytes;
  };
  _this.toString = function() {
    let s = "";
    s += "[";
    for (let i = 0; i < _bytes.length; i += 1) {
      if (i > 0) {
        s += ",";
      }
      s += _bytes[i];
    }
    s += "]";
    return s;
  };
  return _this;
};
var base64EncodeOutputStream = function() {
  let _buffer = 0;
  let _buflen = 0;
  let _length = 0;
  let _base64 = "";
  const _this = {};
  const writeEncoded = function(b) {
    _base64 += String.fromCharCode(encode2(b & 63));
  };
  const encode2 = function(n) {
    if (n < 0) {
      throw "n:" + n;
    } else if (n < 26) {
      return 65 + n;
    } else if (n < 52) {
      return 97 + (n - 26);
    } else if (n < 62) {
      return 48 + (n - 52);
    } else if (n == 62) {
      return 43;
    } else if (n == 63) {
      return 47;
    } else {
      throw "n:" + n;
    }
  };
  _this.writeByte = function(n) {
    _buffer = _buffer << 8 | n & 255;
    _buflen += 8;
    _length += 1;
    while (_buflen >= 6) {
      writeEncoded(_buffer >>> _buflen - 6);
      _buflen -= 6;
    }
  };
  _this.flush = function() {
    if (_buflen > 0) {
      writeEncoded(_buffer << 6 - _buflen);
      _buffer = 0;
      _buflen = 0;
    }
    if (_length % 3 != 0) {
      const padlen = 3 - _length % 3;
      for (let i = 0; i < padlen; i += 1) {
        _base64 += "=";
      }
    }
  };
  _this.toString = function() {
    return _base64;
  };
  return _this;
};
var base64DecodeInputStream = function(str) {
  const _str = str;
  let _pos = 0;
  let _buffer = 0;
  let _buflen = 0;
  const _this = {};
  _this.read = function() {
    while (_buflen < 8) {
      if (_pos >= _str.length) {
        if (_buflen == 0) {
          return -1;
        }
        throw "unexpected end of file./" + _buflen;
      }
      const c = _str.charAt(_pos);
      _pos += 1;
      if (c == "=") {
        _buflen = 0;
        return -1;
      } else if (c.match(/^\s$/)) {
        continue;
      }
      _buffer = _buffer << 6 | decode2(c.charCodeAt(0));
      _buflen += 6;
    }
    const n = _buffer >>> _buflen - 8 & 255;
    _buflen -= 8;
    return n;
  };
  const decode2 = function(c) {
    if (65 <= c && c <= 90) {
      return c - 65;
    } else if (97 <= c && c <= 122) {
      return c - 97 + 26;
    } else if (48 <= c && c <= 57) {
      return c - 48 + 52;
    } else if (c == 43) {
      return 62;
    } else if (c == 47) {
      return 63;
    } else {
      throw "c:" + c;
    }
  };
  return _this;
};
var gifImage = function(width, height) {
  const _width = width;
  const _height = height;
  const _data = new Array(width * height);
  const _this = {};
  _this.setPixel = function(x, y, pixel) {
    _data[y * _width + x] = pixel;
  };
  _this.write = function(out) {
    out.writeString("GIF87a");
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(128);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(255);
    out.writeByte(255);
    out.writeByte(255);
    out.writeString(",");
    out.writeShort(0);
    out.writeShort(0);
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(0);
    const lzwMinCodeSize = 2;
    const raster = getLZWRaster(lzwMinCodeSize);
    out.writeByte(lzwMinCodeSize);
    let offset = 0;
    while (raster.length - offset > 255) {
      out.writeByte(255);
      out.writeBytes(raster, offset, 255);
      offset += 255;
    }
    out.writeByte(raster.length - offset);
    out.writeBytes(raster, offset, raster.length - offset);
    out.writeByte(0);
    out.writeString(";");
  };
  const bitOutputStream = function(out) {
    const _out = out;
    let _bitLength = 0;
    let _bitBuffer = 0;
    const _this2 = {};
    _this2.write = function(data, length) {
      if (data >>> length != 0) {
        throw "length over";
      }
      while (_bitLength + length >= 8) {
        _out.writeByte(255 & (data << _bitLength | _bitBuffer));
        length -= 8 - _bitLength;
        data >>>= 8 - _bitLength;
        _bitBuffer = 0;
        _bitLength = 0;
      }
      _bitBuffer = data << _bitLength | _bitBuffer;
      _bitLength = _bitLength + length;
    };
    _this2.flush = function() {
      if (_bitLength > 0) {
        _out.writeByte(_bitBuffer);
      }
    };
    return _this2;
  };
  const getLZWRaster = function(lzwMinCodeSize) {
    const clearCode = 1 << lzwMinCodeSize;
    const endCode = (1 << lzwMinCodeSize) + 1;
    let bitLength = lzwMinCodeSize + 1;
    const table = lzwTable();
    for (let i = 0; i < clearCode; i += 1) {
      table.add(String.fromCharCode(i));
    }
    table.add(String.fromCharCode(clearCode));
    table.add(String.fromCharCode(endCode));
    const byteOut = byteArrayOutputStream();
    const bitOut = bitOutputStream(byteOut);
    bitOut.write(clearCode, bitLength);
    let dataIndex = 0;
    let s = String.fromCharCode(_data[dataIndex]);
    dataIndex += 1;
    while (dataIndex < _data.length) {
      const c = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;
      if (table.contains(s + c)) {
        s = s + c;
      } else {
        bitOut.write(table.indexOf(s), bitLength);
        if (table.size() < 4095) {
          if (table.size() == 1 << bitLength) {
            bitLength += 1;
          }
          table.add(s + c);
        }
        s = c;
      }
    }
    bitOut.write(table.indexOf(s), bitLength);
    bitOut.write(endCode, bitLength);
    bitOut.flush();
    return byteOut.toByteArray();
  };
  const lzwTable = function() {
    const _map = {};
    let _size = 0;
    const _this2 = {};
    _this2.add = function(key) {
      if (_this2.contains(key)) {
        throw "dup key:" + key;
      }
      _map[key] = _size;
      _size += 1;
    };
    _this2.size = function() {
      return _size;
    };
    _this2.indexOf = function(key) {
      return _map[key];
    };
    _this2.contains = function(key) {
      return typeof _map[key] != "undefined";
    };
    return _this2;
  };
  return _this;
};
var createDataURL = function(width, height, getPixel) {
  const gif = gifImage(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      gif.setPixel(x, y, getPixel(x, y));
    }
  }
  const b = byteArrayOutputStream();
  gif.write(b);
  const base64 = base64EncodeOutputStream();
  const bytes = b.toByteArray();
  for (let i = 0; i < bytes.length; i += 1) {
    base64.writeByte(bytes[i]);
  }
  base64.flush();
  return "data:image/gif;base64," + base64;
};
var qrcode_default = qrcode;
var stringToBytes = qrcode.stringToBytes;

// src/routes/qris.js
var router2 = new Hono2();
var STATIC_QRIS = "00020101021126570011ID.DANA.WWW011893600915314378691502091437869150303UMI51440014ID.CO.QRIS.WWW0215ID10210738442970303UMI5204899953033605802ID5916Hariistimewa.com6015Kota Jakarta Se6105128206304D1F0";
router2.get("/generate", async (c) => {
  const amount = parseInt(c.req.query("amount"));
  if (!amount || isNaN(amount)) {
    return c.json({ status: 400, message: "Amount is required and must be a number" }, 400);
  }
  try {
    const qrisDynamic = createDynamicQRIS(STATIC_QRIS, amount);
    const qr = qrcode_default(0, "M");
    qr.addData(qrisDynamic);
    qr.make();
    const svgTag = qr.createSvgTag(6, 2);
    const qrImage = `data:image/svg+xml;base64,${Buffer.from(svgTag).toString("base64")}`;
    return c.json({
      status: 200,
      data: {
        amount,
        qris_string: qrisDynamic,
        qr_image: qrImage
      }
    });
  } catch (error) {
    console.error("QRIS Error:", error);
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var qris_default = router2;

// src/components/widgets/WidgetLayout.jsx
var WidgetLayout = ({ children, title: title3 }) => {
  return /* @__PURE__ */ jsx("html", { lang: "id" }, /* @__PURE__ */ jsx("head", null, /* @__PURE__ */ jsx("meta", { charset: "UTF-8" }), /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), /* @__PURE__ */ jsx("title", null, title3), /* @__PURE__ */ jsx("script", { src: "https://cdn.tailwindcss.com" }), /* @__PURE__ */ jsx("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Amiri&display=swap", rel: "stylesheet" }), /* @__PURE__ */ jsx("style", null, `
          body { font-family: 'Inter', sans-serif; }
          .font-arabic { font-family: 'Amiri', serif; }
        `)), /* @__PURE__ */ jsx("body", { class: "bg-transparent m-0 p-0 overflow-hidden" }, children));
};

// src/components/widgets/SholatWidget.jsx
var SholatWidget = ({ data, city, baseUrl }) => {
  const displayUrl = baseUrl ? baseUrl.replace(/^https?:\/\//, "") : "muslim-api.vercel.app";
  const fullUrl = baseUrl || "https://muslim-api.vercel.app";
  if (!data) return /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center p-4 h-screen font-medium text-center text-emerald-800 bg-emerald-50" }, "Gagal memuat jadwal sholat. Pastikan parameter kota benar.");
  const times = [
    { name: "Imsak", time: data.imsak },
    { name: "Subuh", time: data.subuh },
    { name: "Terbit", time: data.terbit },
    { name: "Dzuhur", time: data.dzuhur },
    { name: "Ashar", time: data.ashar },
    { name: "Maghrib", time: data.maghrib },
    { name: "Isya", time: data.isya }
  ];
  return /* @__PURE__ */ jsx("div", { class: "min-h-screen font-sans bg-white" }, /* @__PURE__ */ jsx("div", { class: "p-4 text-white bg-emerald-600" }, /* @__PURE__ */ jsx("h2", { class: "text-lg font-bold" }, "Jadwal Sholat"), /* @__PURE__ */ jsx("p", { class: "text-xs opacity-90" }, city, " - ", data.tanggal)), /* @__PURE__ */ jsx("div", { class: "p-3 space-y-2" }, times.map((item) => /* @__PURE__ */ jsx("div", { key: item.name, class: "flex justify-between items-center pb-1.5 border-b border-slate-50 last:border-0" }, /* @__PURE__ */ jsx("span", { class: "text-sm font-medium text-slate-600" }, item.name), /* @__PURE__ */ jsx("span", { class: "text-sm font-bold text-emerald-700" }, item.time)))), /* @__PURE__ */ jsx("div", { class: "p-2 mt-auto text-center bg-slate-50" }, /* @__PURE__ */ jsx("a", { href: fullUrl, target: "_blank", class: "text-[10px] text-slate-400 hover:text-emerald-600 transition-colors" }, displayUrl)));
};

// src/components/widgets/AyatWidget.jsx
var AyatWidget = ({ data, baseUrl }) => {
  const displayUrl = baseUrl ? baseUrl.replace(/^https?:\/\//, "") : "muslim-api.vercel.app";
  const fullUrl = baseUrl || "https://muslim-api.vercel.app";
  if (!data) return /* @__PURE__ */ jsx("div", { class: "flex justify-center items-center p-4 h-screen font-medium text-center text-blue-800 bg-blue-50" }, "Gagal memuat ayat harian.");
  return /* @__PURE__ */ jsx("div", { class: "flex flex-col min-h-screen font-sans bg-white" }, /* @__PURE__ */ jsx("div", { class: "p-4 text-white bg-blue-600" }, /* @__PURE__ */ jsx("h2", { class: "text-lg font-bold" }, "Ayat Harian"), /* @__PURE__ */ jsx("p", { class: "text-xs opacity-90" }, data.surah_name, " : ", data.ayah)), /* @__PURE__ */ jsx("div", { class: "flex flex-col flex-grow justify-center p-4 text-center" }, /* @__PURE__ */ jsx("p", { class: "mb-2 font-serif text-xl leading-loose text-slate-900", dir: "rtl" }, data.arab), /* @__PURE__ */ jsx("p", { class: "text-xs italic leading-relaxed text-slate-600" }, '"', data.translation, '"')), /* @__PURE__ */ jsx("div", { class: "p-2 mt-auto text-center bg-slate-50" }, /* @__PURE__ */ jsx("a", { href: fullUrl, target: "_blank", class: "text-[10px] text-slate-400 hover:text-blue-600 transition-colors" }, displayUrl)));
};

// src/routes/widget.jsx
var widget = new Hono2();
widget.get("/sholat", async (c) => {
  const cityName = c.req.query("city") || "jakarta";
  const BASE_API2 = API_CONFIG.SHOLAT.MYQURAN;
  try {
    const kotaRes = await fetch(`${BASE_API2}/kota/cari/${cityName}`);
    const kotaData = await kotaRes.json();
    if (!kotaData.status || !kotaData.data || kotaData.data.length === 0) {
      return c.html(
        /* @__PURE__ */ jsx(WidgetLayout, { title: "Jadwal Sholat Widget" }, /* @__PURE__ */ jsx(SholatWidget, { data: null, city: cityName }))
      );
    }
    const kota = kotaData.data[0];
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const jadwalRes = await fetch(`${BASE_API2}/jadwal/${kota.id}/${today}`);
    const jadwalData = await jadwalRes.json();
    if (!jadwalData.status || !jadwalData.data || !jadwalData.data.jadwal) {
      throw new Error("Jadwal tidak ditemukan");
    }
    return c.html(
      /* @__PURE__ */ jsx(WidgetLayout, { title: `Jadwal Sholat ${kota.lokasi}` }, /* @__PURE__ */ jsx(SholatWidget, { data: jadwalData.data.jadwal, city: kota.lokasi, baseUrl: new URL(c.req.url).origin }))
    );
  } catch (error) {
    return c.html(
      /* @__PURE__ */ jsx(WidgetLayout, { title: "Jadwal Sholat Widget" }, /* @__PURE__ */ jsx(SholatWidget, { data: null, city: cityName, baseUrl: new URL(c.req.url).origin }))
    );
  }
});
widget.get("/ayat", async (c) => {
  const baseUrl = new URL(c.req.url).origin;
  try {
    const surahList = await getSurahList();
    const randomSurah = surahList[Math.floor(Math.random() * surahList.length)];
    const ayahs = await getAyahBySurah(randomSurah.number);
    const randomAyah = ayahs[Math.floor(Math.random() * ayahs.length)];
    const data = {
      surah_name: randomSurah.name_id,
      surah_number: randomSurah.number,
      ayah: randomAyah.ayah,
      arab: randomAyah.arab,
      translation: randomAyah.translation_id || randomAyah.text
    };
    return c.html(
      /* @__PURE__ */ jsx(WidgetLayout, { title: "Ayat Harian Widget" }, /* @__PURE__ */ jsx(AyatWidget, { data, baseUrl }))
    );
  } catch (error) {
    console.error("Widget Ayat Error:", error);
    return c.html(
      /* @__PURE__ */ jsx(WidgetLayout, { title: "Ayat Harian Widget" }, /* @__PURE__ */ jsx(AyatWidget, { data: null, baseUrl }))
    );
  }
});
var widget_default = widget;

// src/app.jsx
var app = new Hono2();
app.use("*", trimTrailingSlash());
app.use("*", logger());
app.use("*", cors());
app.get("/health", async (c) => {
  let jsonStatus = "disconnected";
  try {
    const result = await getSurahList();
    if (result) jsonStatus = "connected";
  } catch (e) {
    jsonStatus = "error: " + e.message;
  }
  return c.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    version: "1.0.0",
    services: {
      storage: jsonStatus,
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
  const path3 = c.req.path;
  if (process.env.NODE_ENV === "production") {
    console.log(`[HIT] ${(/* @__PURE__ */ new Date()).toISOString()} | IP: ${ip} | Path: ${path3} | UA: ${userAgent}`);
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
  console.log(`[HIT] ${(/* @__PURE__ */ new Date()).toISOString()} | IP: ${ip} | Method: ${method} | Path: ${path3}`);
  await next();
});
app.route("/v1", v1_default);
app.route("/api/qris", qris_default);
app.route("/widget", widget_default);
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
