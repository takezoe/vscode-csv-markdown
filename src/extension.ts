// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { csv2table, TableType } from './csv2table';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-csv-markdown" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('vscode-csv-markdown.convert-csv-to-markdown', () => {
		replaceSelectionInEditor((text: string) => csv2table(text, TableType.markdown));
	}));
	context.subscriptions.push(vscode.commands.registerCommand('vscode-csv-markdown.convert-csv-to-jira', () => {
		replaceSelectionInEditor((text: string) => csv2table(text, TableType.jira));
	}));
}

function replaceSelectionInEditor(replacer: (text: string) => string): void {
	const editor = vscode.window.activeTextEditor;
	if (editor === null || editor === undefined) {
		return;
	}
	const selection = editor.selection;
	const text = editor.document.getText(selection);
	const replace = replacer(text);
	editor.edit(function (editBuilder) {
		editBuilder.replace(selection, replace);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
