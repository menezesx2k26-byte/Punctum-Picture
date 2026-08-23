import { execFileSync } from "node:child_process";

const required = ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required secret: ${key}`);
    process.exit(2);
  }
}

function run(args) {
  console.log(`> npx wrangler ${args.join(" ")}`);
  execFileSync("npx", ["wrangler", ...args], {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
}

console.log("Cloudflare migration probe: read-only checks only.");
run(["whoami"]);
run(["d1", "list"]);
run(["r2", "bucket", "list"]);
console.log("Probe complete. No resources were created or modified.");
