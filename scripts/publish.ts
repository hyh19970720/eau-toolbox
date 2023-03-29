import { execSync } from "node:child_process";
import pkg from "../package.json" assert { type: "json" };

const { version } = pkg;

let command = "npm publish --access public";

if (version.includes("beta")) {
  command += "--tag beta";
}

execSync(command, { stdio: "inherit" });
