import { parse } from 'papaparse';

export enum TableType {
	markdown, jira
}

export function csv2table(text: string, type: TableType): string {
	const csv  = parse(text);
	const rows = csv.data as Array<Array<String>>;

	// Caluculate  column sizes
	let width: number[] = [];
	rows.forEach((line, i) => {
		line.forEach((element, j) => {
			const value = element.trim();
			if (width.length <= j) {
				width[j] = value.length < 4 ? 4 : value.length;
			} else if (width[j] < value.length) {
				width[j] = value.length;
			}
		});
	});

	// Build table
	let table = "";
	switch (type) {
		case TableType.markdown:
			rows.forEach((line, i) => {
				if (line.length === 1 && line[0].trim() === "") {
					return;
				}
				line.forEach((element, j) => {
					const value = element.trim();
					table = table + "|" + value;
					if (value.length < width[j]) {
						for (let k = 0; k < width[j] - value.length; k++) {
							table = table + " ";
						}
					}
				});
				table = table + "|\n";
				if (i === 0) {
					for (const w of width) {
						table = table + "|";
						for (let k = 0; k < w; k++) {
							table = table + "-";
						}
					}
					table = table + "|\n";
				}
			});
			break;
		case TableType.jira:
			rows.forEach((line, i) => {
				if (line.length === 1 && line[0].trim() === "") {
					return;
				}
				line.forEach((element, j) => {
					const value = element.trim();
					if (i === 0) {
						table = table + "||" + value;
					} else {
						table = table + "|" + value;
					}
				});
				if (i === 0) {
					table = table + "||\n";
				} else {
					table = table + "|\n";
				}
			});
			break;
	}

	return table;
}
