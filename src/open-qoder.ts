import { closeMainWindow, showHUD } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default async function Command() {
  try {
    await closeMainWindow();
    await execAsync('open -n -b "com.qoder.ide"');
    await showHUD("Opening new Qoder window...");
  } catch {
    await showHUD("Failed to open Qoder. Please make sure Qoder is installed.");
  }
}
