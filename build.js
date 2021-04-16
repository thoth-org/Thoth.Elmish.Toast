#!/usr/bin/env node

const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const concurrently = require('concurrently')
const chalk = require("chalk")
var shell = require("shelljs")
const path = require("path")

const info = chalk.blueBright
const warn = chalk.yellow
const error = chalk.red
const success = chalk.green
const log = console.log
const resolve = (...args) => path.resolve(__dirname, ...args)

const demoProjectPath = resolve("demo")

// Make shellsjs throw if there is an error in a command
// It makes it easy to stop the build script when an error occured without having to try/catch or test each invocation
shell.config.fatal = true

const shellExecInDemoProject = (command) => {
    shell.exec(
        command,
        {
            cwd: demoProjectPath
        }
    )
}


const clean = () => {
    shell.rm("-rf", resolve("demo", "fableBuild"))
}

const demoWatchHandler = async () => {
    clean()

    shellExecInDemoProject("npm install")

    await concurrently(
        [
            {
                command: "npx webpack serve --mode development",
                cwd: demoProjectPath
            },
            {
                command: "dotnet fable src/Demo.fsproj --outDir fableBuild --watch",
                cwd: demoProjectPath
            }
        ],
        {
            prefix: "none" // Disable name prefix
        }
    )
}

const demoBuildHandler = async () => {
    clean()

    shellExecInDemoProject("npm install")

    shellExecInDemoProject("dotnet fable src/Demo.fsproj --outDir fableBuild --watch")

    shellExecInDemoProject("npx webpack --mode production")
}

yargs(hideBin(process.argv))
    .completion()
    .strict()
    .help()
    .alias("help", "h")
    .command(
        "demo",
        "Commands related to the Demo project",
        (yargs) => {
            return yargs
                    .command(
                        "watch",
                        "Start Demo in watch mode.",
                        () => {},
                        demoWatchHandler
                    )
                    .command(
                        "build",
                        "Build Demo project using production mode",
                        () => {},
                        demoBuildHandler
                    )
        }
    )
    // .command(
    //     "clean",
    //     "Delete all the compiled or cached files from dotnet, Fable.",
    //     () => {},
    //     async () => {
    //         await cleanCompiledFiles()
    //     }
    // )
    // .command(
    //     "publish",
    //     `1. Clean files
    //     2. For each package make a fresh compilation and run tests
    //     3. Update the version in the fsproj using the changelog as reference
    //     4. Generate the packages
    //     5. Publish new packages on NuGet

    //     Note: If an error occured, after updating the version in the fsproj the process will try to revert the changes on the current fsproj file.
    //     `,
    //     () => { },
    //     publishHandler
    // )
    .version(false)
    .argv
