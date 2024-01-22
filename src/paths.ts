import { tmpdir, userInfo } from "os";
import { join } from "path";

export function getCommunicationDirPath() {
  const info = userInfo();

  // NB: On Windows, uid < 0, and the tmpdir is user-specific, so we don't
  // bother with a suffix
  const suffix = info.uid >= 0 ? `-${info.uid}` : "";

  return join(tmpdir(), `vscode-command-server${suffix}`);
}

export function getSignalDirPath(): string {
  return join(getCommunicationDirPath(), "signals");
}

export function getRequestPath() {
  return join(getCommunicationDirPath(), "request.json");
}

export function getResponsePath() {
  return join(getCommunicationDirPath(), "response.json");
}
