import process from "node:process";

function indexOfDoubleCrlf(buf) {
  for (let i = 0; i < buf.length - 3; i++) {
    if (buf[i] === 13 && buf[i + 1] === 10 && buf[i + 2] === 13 && buf[i + 3] === 10) {
      return i;
    }
  }
  return -1;
}

function writeMessage(obj) {
  const json = JSON.stringify(obj);
  const payload = Buffer.from(json, "utf8");
  const header = Buffer.from(`Content-Length: ${payload.length}\r\n\r\n`, "utf8");
  process.stdout.write(Buffer.concat([header, payload]));
}

function skipWs(buf) {
  let i = 0;
  while (i < buf.length && (buf[i] === 32 || buf[i] === 9 || buf[i] === 10 || buf[i] === 13)) i++;
  return i === 0 ? buf : buf.subarray(i);
}

/**
 * @param {(msg: object) => Promise<object | null>} handler
 */
export function startStdio(handler) {
  process.stdin.resume();
  process.stdin.on("error", (error) => {
    console.error("spearkit mcp stdin error:", error);
  });

  let buf = Buffer.alloc(0);
  let running = false;
  let dirty = false;

  const consume = async (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch (error) {
      writeMessage({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: `Parse error: ${error instanceof Error ? error.message : error}` },
      });
      return;
    }
    try {
      const response = await handler(msg);
      if (response) writeMessage(response);
    } catch (error) {
      writeMessage({
        jsonrpc: "2.0",
        id: msg.id ?? null,
        error: { code: -32603, message: error instanceof Error ? error.message : String(error) },
      });
    }
  };

  async function drainOnce() {
    while (buf.length > 0) {
      buf = skipWs(buf);
      if (buf.length === 0) break;

      const head = buf.subarray(0, Math.min(buf.length, 20)).toString("utf8").toLowerCase();
      if (head.startsWith("content-length:")) {
        const headerEnd = indexOfDoubleCrlf(buf);
        if (headerEnd === -1) break;
        const header = buf.subarray(0, headerEnd).toString("utf8");
        const match = /Content-Length:\s*(\d+)/i.exec(header);
        if (!match) {
          buf = buf.subarray(headerEnd + 4);
          continue;
        }
        const length = Number(match[1]);
        const bodyStart = headerEnd + 4;
        if (buf.length < bodyStart + length) break;
        const raw = buf.subarray(bodyStart, bodyStart + length).toString("utf8");
        buf = buf.subarray(bodyStart + length);
        await consume(raw);
        continue;
      }

      if (buf[0] !== 0x7b) {
        const nl = buf.indexOf(0x0a);
        if (nl === -1) break;
        buf = buf.subarray(nl + 1);
        continue;
      }

      const nl = buf.indexOf(0x0a);
      if (nl === -1) break;
      const line = buf.subarray(0, nl).toString("utf8").replace(/\r$/, "").trim();
      buf = buf.subarray(nl + 1);
      if (line.startsWith("{")) await consume(line);
    }
  }

  async function drain() {
    if (running) return;
    running = true;
    try {
      while (dirty) {
        dirty = false;
        await drainOnce();
      }
    } finally {
      running = false;
      if (dirty) void drain();
    }
  }

  process.stdin.on("data", (chunk) => {
    buf = Buffer.concat([buf, chunk]);
    dirty = true;
    void drain();
  });
}
