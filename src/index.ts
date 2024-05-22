import { NvimPlugin } from "neovim";
import { activate } from "./extension";
import { commandRunner } from "./singletons/commandRunner.singleton";

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
 * Load the command-server.
 */
async function loadExtension(plugin: NvimPlugin) {
  console.log("loadExtension(command-server): start");
  await activate();
  console.log("loadExtension(command-server): done");
}

async function runCommand() {
  console.log("runCommand(command-server): start");
  commandRunner().runCommand();
  console.log("runCommand(command-server): done");
}
