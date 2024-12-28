#!/usr/bin/env node
import { spawn } from "node:child_process";

function handleExit() {
  const stopProcess = spawn("npm", ["run", "services:stop"], {
    stdio: "inherit",
  });

  stopProcess.on("close", (code) => {
    console.log(`\n🔴 Services stopped...`);
    process.exit(code);
  });
}

async function runCommand(command, args) {
  return new Promise((resolve) => {
    const startProcess = spawn(command, args, { stdio: "inherit" });
    startProcess.on("close", (code) => {
      if (code === 0) return resolve();
      handleExit(code);
    });
    startProcess.on("error", handleExit);
  });
}

async function runWebService() {
  console.log("🔧 Starting services...");
  await runCommand("npm", ["run", "services:up"]);
  await runCommand("npm", ["run", "services:wait:database"]);
  await runCommand("npm", ["run", "migrates:up"]);

  console.log("\n🟢 Services started successfully!");
  console.log("🟢 Starting WEB service...\n");
  spawn("npm", ["run", "start:dev"], { stdio: "inherit" }).on("error", handleExit);
}

(async () => {
  process.on("SIGINT", handleExit);
  process.on("SIGTERM", handleExit);
  await runWebService();
})();
