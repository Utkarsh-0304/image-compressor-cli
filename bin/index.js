#!/usr/bin/env node
const { parseArguments } = require("../src/cli.js");
const { compressImage } = require("../src/compressor.js");
const { prepareFileTasks } = require("../src/file-manager.js");
const chalk = require("chalk");

async function main() {
  try {
    const options = parseArguments();
    console.log(chalk.blue('Starting Image Compressor'));
    console.log(chalk.gray(`Mode: ${options.output ? 'Output to Folder': 'In-Place Overwrite'}`));

    const tasks = await prepareFileTasks(options.input, options.output);
    console.log(chalk.blue(`Found ${tasks.length} images. Processing...`));

    let successCount = 0;
    let totalSavedBytes = 0;
    
    await Promise.all(tasks.map(async (task) => {
      try {
        const result = await compressImage(task, options);

        successCount++;
        totalSavedBytes += result.saved;

        console.log(chalk.green(`${result.file} (-${(result.saved / 1024).toFixed(1)}) KB`));
        return result;
      }
      catch(err) {
        console.error(chalk.red(`Error: ${err.message}`));
        return null;
      }
    }))


    const mbSaved = (totalSavedBytes / 1024 / 1024).toFixed(2);
    console.log(chalk.blue('\n--- SUMMARY ---'));
    console.log(`Successfully processed: ${successCount} / ${tasks.length}`);
    console.log(`Total Space Saved: ${mbSaved} MB`);
  } catch (error) {
    const mbSaved = (totalSavedBytes / 1024 / 1024).toFixed(2);
    console.log(chalk.blue('\n--- SUMMARY ---'));
    console.log(`Successfully processed: ${successCount} / ${tasks.length}`);
    console.log(`Total Space Saved: ${mbSaved} MB`);
    process.exit(1);
  }
}

main();
