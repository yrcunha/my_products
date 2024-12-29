import pino from "pino";
import pretty from "pino-pretty";
import { createWriteStream } from "node:fs";

const transport = pino.multistream([
  { stream: pretty({ ignore: "node_version", sync: true }) },
  { stream: createWriteStream(`${process.cwd()}/app.log`, { flags: "a" }) },
]);

export default pino(
  {
    level: process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      bindings: (bindings) => ({ pid: bindings.pid, hostname: bindings.hostname, node_version: process.version }),
      level: (label) => ({ level: label.toUpperCase() }),
    },
    redact: {
      paths: [
        "[*].authorization",
        "[*][*].authorization",
        "[*].cookie",
        "[*][*].cookie",
        "[*].password",
        "[*][*].password",
      ],
      remove: true,
    },
  },
  transport,
);
