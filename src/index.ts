// import { createCursorlessEngine } from "@cursorless/cursorless-engine";
// import { NeovimExtensionContext } from "./ide/neovim/NeovimExtensionContext";
import { NvimPlugin } from "neovim";
import { activate } from "./extension";
import { commandRunner } from "./singletons/commandRunner.singleton";
// import { injectContext } from "./singletons/context.singleton";

// const random = Math.random();
// console.warn(`index.ts: random=${random}`);
// console.warn(`index.ts: __filename=${__filename}`);

/**
 * Extension entrypoint called by node-client on command-server startup.
 * - Register the functions that are exposed to neovim.
 *   Note that these function need to start with a capital letter to be callable from neovim.
 */
export default function entry(plugin: NvimPlugin) {
  // We make sure the command-server extension is only loaded once,
  // as otherwise we will run our first copy when loading the extension
  // and a different new copy for running each command
  // NOTE: this is the case because all the files are rolled up into a single index.cjs file
  // and node-client would reload that index.cjs file if "dev" was set to "true"
  plugin.setOptions({ dev: false });

  plugin.registerFunction("CommandServerTest", () => test(plugin), {
    sync: false,
  });

  plugin.registerFunction(
    "CommandServerLoadExtension",
    async () => await loadExtension(plugin),
    { sync: false },
  );
  
  plugin.registerFunction(
    "CommandServerRunCommand",
    () => runCommand(),
    { sync: false },
  );
}

/**
 * Test that command-server is loaded
 */
function test(plugin: NvimPlugin) {
  const currentDate: Date = new Date();
  const currentDateStr: string = currentDate.toLocaleString();

  console.warn("test(): " + currentDateStr);
}

/**
 * Load the command-server.
 */
async function loadExtension(plugin: NvimPlugin) {
  console.warn("loadExtension(command-server): start");
  // console.warn(
  //   `index.ts: loadExtension(): random=${random}`,
  // );
  await activate();
  console.warn("loadExtension(command-server): done");
}

async function runCommand() {
  console.warn("runCommand(command-server): start");
  // console.warn(
  //   `index.ts: runCommand(): random=${random}`,
  // );
  commandRunner().runCommand();
  console.warn("runCommand(command-server): done");
}
