import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(".");
const port = Number(process.argv[2] || 4173);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function resolveRequestPath(pathname) {
  const cleanPath = decodeURIComponent(pathname).replace(/^\/+/, "");
  const candidates = cleanPath
    ? [cleanPath, `${cleanPath}.html`, resolve(cleanPath, "index.html")]
    : ["index.html"];

  for (const candidate of candidates) {
    const filePath = resolve(root, candidate);
    if (!filePath.startsWith(`${root}${sep}`) && filePath !== root) continue;
    try {
      if (statSync(filePath).isFile()) return filePath;
    } catch {
      // Try the next static-route candidate.
    }
  }
  return null;
}

createServer((request, response) => {
  const filePath = resolveRequestPath(new URL(request.url, `http://${request.headers.host}`).pathname);
  if (!filePath) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Star Speaker preview: http://127.0.0.1:${port}/`);
});
