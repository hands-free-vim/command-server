// import { createCursorlessEngine } from "@cursorless/cursorless-engine";
// import { NeovimExtensionContext } from "./ide/neovim/NeovimExtensionContext";
import { NvimPlugin } from "neovim";
import { activate } from "./extension";
import { commandRunner } from "./singletons/commandRunner.singleton";
// import { injectContext } from "./singletons/context.singleton";

/**
 * Extension entrypoint called by node-client on command-server startup.
 * - Register the functions that are exposed to neovim.
 *   Note that these function need to start with a capital letter to be callable from neovim.
 */
export default function entry(plugin: NvimPlugin) {
  // Set your plugin to dev mode, which will cause the module to be reloaded on each invocation
  // plugin.setOptions({ dev: false });
  plugin.setOptions({ dev: true });

  plugin.registerFunction("CommandServerTest", () => test(plugin), {
    sync: false,
  });

  plugin.registerFunction(
    "CommandServerLoadExtension",
    () => loadExtension(plugin),
    { sync: false },
  );
  
  plugin.registerFunction(
    "CommandServerRunCommand",
    () => commandRunner().runCommand(),
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
function loadExtension(plugin: NvimPlugin) {
  const currentDate: Date = new Date();
  const currentDateStr: string = currentDate.toLocaleString();

  console.warn("loadExtension(command-server): " + currentDateStr);
  // plugin.nvim.setLine(currentDateStr);

  // const extensionContext = new NeovimExtensionContext(plugin);
  // injectContext(extensionContext);
  activate(/* extensionContext */);
}
