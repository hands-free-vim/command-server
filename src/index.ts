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
  // Contrary to cursorless-neovim, setting "dev" to "false" is not really relevant
  // because it will only apply to the index.js file, because the files are not rolled up into a single file
  // so the other files will be imported at run time and will not be reloaded. 
  // That being said it doesn't hurt to set it to "false" anyway
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
