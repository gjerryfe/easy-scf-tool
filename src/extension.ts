import * as vscode from 'vscode';
import * as child_process from 'child_process';
export function activate(context: vscode.ExtensionContext) {
    // 创建一个 OutputChannel 用于显示日志
    const outputChannel = vscode.window.createOutputChannel('Easy H5 Converter');
    const disposable = vscode.commands.registerCommand('extension.convertToEasyH5', async (fileUri: vscode.Uri) => {
        if (!fileUri) {
            vscode.window.showErrorMessage('请右键点击文件使用此功能！');
            return;
        }
        const inputFile = fileUri.fsPath;
        const outputFile = inputFile + '.h5';
        // 显示 OutputChannel
        outputChannel.clear();
        outputChannel.show(true);  // 保持焦点
        const command = `easy-scf-tool-r -i "${inputFile}" -o "${outputFile}"`;
        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: '正在转换文件...',
                cancellable: false,
            },
            async (progress) => {
                return new Promise((resolve) => {
                    const process = child_process.exec(command);
                    // 实时输出日志到 OutputChannel
                    process.stdout?.on('data', (data) => {
                        outputChannel.append(data.toString());
                    });
                    process.stderr?.on('data', (data) => {
                        outputChannel.append(data.toString());
                    });
                    process.on('close', (code) => {
                        if (code === 0) {
                            vscode.window.showInformationMessage(`转换成功！输出文件: ${outputFile}`);
                        } else {
                            vscode.window.showErrorMessage('转换失败，请检查日志！');
                        }
                        resolve(true);
                    });
                });
            }
        );
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(outputChannel);  // 确保插件卸载时关闭 OutputChannel
}
export function deactivate() {}