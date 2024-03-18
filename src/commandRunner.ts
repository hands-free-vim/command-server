// import { Minimatch } from "minimatch";
// import * as vscode from "vscode";

import { any } from "./regex";
import { Request } from "./types";
import { Io } from "./io";
import { handleCommand } from "@cursorless/cursorless-neovim";

export default class CommandRunner {
  private allowRegex!: RegExp;
  private denyRegex!: RegExp | null;
  private backgroundWindowProtection!: boolean;

  constructor(private io: Io) {
    this.reloadConfiguration = this.reloadConfiguration.bind(this);
    this.runCommand = this.runCommand.bind(this);

    this.reloadConfiguration();
    // vscode.workspace.onDidChangeConfiguration(this.reloadConfiguration);
  }

  reloadConfiguration() {
    // const allowList = vscode.workspace
    //   .getConfiguration("command-server")
    //   .get<string[]>("allowList")!;

    // this.allowRegex = any(
    //   ...allowList.map((glob) => new Minimatch(glob).makeRe())
    // );

    // const denyList = vscode.workspace
    //   .getConfiguration("command-server")
    //   .get<string[]>("denyList")!;

    // this.denyRegex =
    //   denyList.length === 0
    //     ? null
    //     : any(...denyList.map((glob) => new Minimatch(glob).makeRe()));

    // this.backgroundWindowProtection = vscode.workspace
    //   .getConfiguration("command-server")
    //   .get<boolean>("backgroundWindowProtection")!;
  }

  /**
   * Reads a command from the request file and executes it.  Writes information
   * about command execution to the result of the command to the response file,
   * If requested, will wait for command to finish, and can also write command
   * output to response file.  See also documentation for Request / Response
   * types.
   */
  async runCommand() {
    await this.io.prepareResponse();

    let request: Request;

    try {
      request = await this.io.readRequest();
    } catch (err) {
      await this.io.closeResponse();
      throw err;
    }

    const { commandId, args, uuid, returnCommandOutput, waitForFinish } =
      request;

    const warnings = [];

    try {
      // if (!vscode.window.state.focused) {
      //   if (this.backgroundWindowProtection) {
      //     throw new Error("This editor is not active");
      //   } else {
      //     warnings.push("This editor is not active");
      //   }
      // }
      warnings.push("Neovim not implemented yet");

      if (!commandId.match(this.allowRegex)) {
        throw new Error("Command not in allowList");
      }

      if (this.denyRegex != null && commandId.match(this.denyRegex)) {
        throw new Error("Command in denyList");
      }

      // TODO: lookup table here to forward to cursorless or not?
      // this is if we want the command-server to support executing lua functions/commands
      // based on command ids for talon-vim.
      // Note: this might not be useful because we can do it directly with neovim RPC
      const commandPromise = handleCommand(commandId, ...args);

      let commandReturnValue = null;

      if (returnCommandOutput) {
        commandReturnValue = await commandPromise;
      } else if (waitForFinish) {
        await commandPromise;
      }

      await this.io.writeResponse({
        error: null,
        uuid,
        returnValue: commandReturnValue,
        warnings,
      });
    } catch (err) {
      await this.io.writeResponse({
        error: (err as Error).message,
        uuid,
        warnings,
      });
    }

    await this.io.closeResponse();
  }
}
