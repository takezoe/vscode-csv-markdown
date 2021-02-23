// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { parse } from 'papaparse';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-csv-markdown" is now active!')

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-csv-markdown.convert-csv-to-markdown', () => {
		const editor = vscode.window.activeTextEditor
		if (editor == null) {
			return
		}
		const selection = editor.selection
		const text = editor.document.getText(selection)
		const csv  = parse(text)
		const rows = csv.data as Array<Array<String>>

		// Caluculate  column sizes
		let width: number[] = []
		rows.forEach((line, i) => {
			line.forEach((element, j) => {
				const value = element.trim()
				if (width.length <= j) {
					width[j] = value.length < 4 ? 4 : value.length
				} else if (width[j] < value.length) {
					width[j] = value.length
				}
			});
		});

		// Build table
		let table = "";
		rows.forEach((line, i) => {
			if (line.length == 1 && line[0].trim() == "") {
				return;
			}
			line.forEach((element, j) => {
				const value = element.trim()
				table = table + "|" + value
				if (value.length < width[j]) {
					for (let k = 0; k < width[j] - value.length; k++) {
						table = table + " "
					}
				}
			});
			table = table + "|\n"
			if (i == 0) {
				for (const w of width) {
					table = table + "|"
					for (let k = 0; k < w; k++) {
						table = table + "-"
					}
				}
				table = table + "|\n"
			}
		});

		editor.edit(function (editBuilder) {
			editBuilder.replace(selection, table)
  	});
	});

	context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {}
