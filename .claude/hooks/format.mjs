import { readFile, writeFile } from 'node:fs/promises';
import * as prettier from 'prettier';

// Claude Code sends the tool call as JSON on stdin; formats the file it just edited.
let input = '';
for await (const chunk of process.stdin) input += chunk;

const filePath = JSON.parse(input).tool_input?.file_path;

if (filePath) {
  const { ignored, inferredParser } = await prettier.getFileInfo(filePath, {
    ignorePath: '.prettierignore',
  });

  if (!ignored && inferredParser) {
    const options = await prettier.resolveConfig(filePath);
    const source = await readFile(filePath, 'utf8');
    const formatted = await prettier.format(source, { ...options, filepath: filePath });
    if (formatted !== source) await writeFile(filePath, formatted);
  }
}
