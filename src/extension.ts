import * as vscode from 'vscode';
import * as child_process from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    // 创建一个 OutputChannel 用于显示日志
    const outputChannel = vscode.window.createOutputChannel('Easy H5 Converter');

    // 注册第一个命令：转换为 H5
    const disposable1 = vscode.commands.registerCommand('extension.convertToEasyH5', async (fileUri: vscode.Uri) => {
        if (!fileUri) {
            vscode.window.showErrorMessage('请右键点击文件使用此功能！');
            return;
        }
        const inputFile = fileUri.fsPath;
        const outputFile = inputFile + '.h5';
        await convertFile(inputFile, outputFile, 'easy-scf-tool-r', outputChannel);
    });

    // 注册第二个命令：转换为 H5ad
    const disposable2 = vscode.commands.registerCommand('extension.convertToH5AD', async (fileUri: vscode.Uri) => {
        if (!fileUri) {
            vscode.window.showErrorMessage('请右键点击文件使用此功能！');
            return;
        }
        const inputFile = fileUri.fsPath;
        const outputFile = inputFile + '.h5ad';
        await convertFile(inputFile, outputFile, 'easy-scf-tool', outputChannel);
    });

    context.subscriptions.push(disposable1, disposable2, outputChannel);
}

async function convertFile(inputFile: string, outputFile: string, commandPrefix: string, outputChannel: vscode.OutputChannel) {
    outputChannel.clear();
    outputChannel.show(true);

    const command = `${commandPrefix} -i "${inputFile}" -o "${outputFile}"`;
    
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: `正在转换文件到 ${outputFile.split('.').pop()}...`,
            cancellable: false,
        },
        async (progress) => {
            return new Promise((resolve) => {
                const process = child_process.exec(command);
                
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
}

export function deactivate() {}
