const { Command } = require("commander");

function parseArguments() {
  const program = new Command();

  program
    .name("img-squash")
    .description("CLI to compress images in a directory");

  program
    .requiredOption(
      "-i, --input <path>",
      "input directory path containing images"
    )
    .option(
      "-o, --output <path>",
      "(optional) output directory containing then compressed images"
    )
    .option("-q, --quality <number>", "Quality of compression (1-100)", "80");

  program.parse(process.argv);

  return program.opts();
}

module.exports = { parseArguments };
