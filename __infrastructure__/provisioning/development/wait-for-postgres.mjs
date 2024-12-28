#!/usr/bin/env node
import { exec } from "node:child_process";

function checkPostgres() {
  exec("docker exec my_products pg_isready --host localhost", (_, stdout) => {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      setTimeout(checkPostgres, 1000);
      return;
    }
    console.log("\n🟢 Postgres is now available to accept connections!");
  });
}

(() => {
  process.stdout.write("🔴 Waiting for postgres to accept connections! ");
  checkPostgres();
})();
