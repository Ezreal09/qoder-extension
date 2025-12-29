import { ActionPanel, Action, Form, showToast, Toast, closeMainWindow, popToRoot, LaunchProps } from "@raycast/api";
import { useState } from "react";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface InstallExtensionArguments {
  extensionId: string;
}

export default function Command(props: LaunchProps<{ arguments: InstallExtensionArguments }>) {
  const [extensionId, setExtensionId] = useState(props.arguments.extensionId || "");
  const [isLoading, setIsLoading] = useState(false);

  async function installExtension() {
    if (!extensionId.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Extension ID is required",
        message: "Please enter a valid extension ID",
      });
      return;
    }

    setIsLoading(true);

    try {
      await showToast({
        style: Toast.Style.Animated,
        title: "Installing extension...",
        message: `Installing ${extensionId}`,
      });

      // Use Qoder CLI to install extension
      const command = `open "qoder://extension/${extensionId}"`;
      await execAsync(command);

      await showToast({
        style: Toast.Style.Success,
        title: "Extension installation started",
        message: `${extensionId} will be installed in Qoder`,
      });

      await closeMainWindow();
      await popToRoot();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to install extension",
        message: error instanceof Error ? error.message : "Please make sure Qoder is installed",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Install Extension" onSubmit={installExtension} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="extensionId"
        title="Extension ID"
        placeholder="e.g., publisher.extension-name"
        value={extensionId}
        onChange={setExtensionId}
        info="Enter the extension ID from the Qoder marketplace"
      />
      <Form.Description
        title="Examples"
        text="• ms-python.python&#10;• esbenp.prettier-vscode&#10;• dbaeumer.vscode-eslint"
      />
    </Form>
  );
}
