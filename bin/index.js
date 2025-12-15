#!/usr/bin/env node
const { parseArguments } = require("../src/cli.js");
const { readFile } = require("../src/file-manager.js");

async function main() {
  try {
    const options = parseArguments();
    const paths = await readFile(options.input);

    console.log("Paths: ", paths);
    console.log("Options:", options);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
