// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import * as vscode from 'vscode';
import * as path from 'path';
import * as child_process from 'child_process';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "easy-scf-tool" is now active!');
vscode.window.showInformationMessage("message!!!!!!!!!!!!!!!!!!")
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand('easy-scf-tool.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from easy-scf-tool!');
	// });
	  const disposable = vscode.commands.registerCommand('extension.convertToEasyH5', (fileUri: vscode.Uri) => {
    if (!fileUri) {
      vscode.window.showErrorMessage('请右键点击文件使用此功能！');
      return;
    }
    const inputFile = fileUri.fsPath;  // 获取文件完整路径
    const outputFile = inputFile + '.h5';  // 输出文件名
    // 调用外部命令
    const command = `easy-scf-tool-r -i "${inputFile}" -o "${outputFile}"`;
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: '正在转换文件...',
        cancellable: false,
      },
      async (progress) => {
        return new Promise((resolve) => {
          child_process.exec(command, (error, stdout, stderr) => {
            if (error) {
              vscode.window.showErrorMessage(`转换失败: ${stderr || error.message}`);
              resolve(false);
              return;
            }
            vscode.window.showInformationMessage(`转换成功！输出文件: ${outputFile}`);
            resolve(true);
          });
        });
      }
    );
  });

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
