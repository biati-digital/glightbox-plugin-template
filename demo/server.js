import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";

const PORT = 8123;

const MIME_TYPES = {
    default: "application/octet-stream",
    html: "text/html; charset=UTF-8",
    js: "application/javascript",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpg",
    gif: "image/gif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
};

const STATIC_PATH = path.join(process.cwd());
const toBool = [() => true, () => false];

const prepareFile = async (url) => {
    const paths = [STATIC_PATH, url];
    let filePath = path.join(...paths);
    let indexPath = path.join(process.cwd(), "demo", "index.html");
    if (url.endsWith("/")) {
        filePath = indexPath;
    };
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const exists = await fs.promises.access(filePath).then(...toBool);
    const found = !pathTraversal && exists;
    const streamPath = found ? filePath : indexPath;
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
};

http.createServer(async (req, res) => {
    const file = await prepareFile(req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { "Content-Type": mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);