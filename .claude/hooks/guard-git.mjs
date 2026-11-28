// Runs before every Bash command (PreToolUse). Exit code 2 blocks the command and
// sends the message on stderr back to Claude. Catches the dangerous git flags in any
// position, which the prefix-based "deny" rules in settings.json can't do.
let input = '';
for await (const chunk of process.stdin) input += chunk;

const command = JSON.parse(input).tool_input?.command ?? '';

// Quoted strings stay as one token, so a commit message can't trigger a false positive.
const tokens = command.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];

const segments = [[]];
for (const token of tokens) {
  if (['&&', '||', ';', '|'].includes(token)) segments.push([]);
  else segments.at(-1).push(token);
}

const PROTECTED_BRANCHES = ['develop', 'main'];

function findProblem(args) {
  const gitIndex = args.indexOf('git');
  if (gitIndex === -1) return null;

  let i = gitIndex + 1;
  while (args[i]?.startsWith('-')) i += ['-C', '-c'].includes(args[i]) ? 2 : 1;
  const subcommand = args[i];
  const rest = args.slice(i + 1);
  const flags = rest.filter((arg) => arg.startsWith('-'));
  const values = rest.filter((arg) => !arg.startsWith('-'));

  if (subcommand === 'push') {
    if (
      flags.some(
        (flag) => flag.startsWith('--force') || ['-f', '--mirror', '--delete', '-d'].includes(flag),
      )
    ) {
      return 'push forçado, --mirror ou --delete';
    }
    if (values.some((value) => value.startsWith('+') || value.startsWith(':'))) {
      return 'refspec com + (força) ou : (apaga a branch)';
    }
    if (values.some((value) => PROTECTED_BRANCHES.includes(value.split(':').at(-1)))) {
      return 'push direto pra develop ou main (só mudam por PR)';
    }
  }

  if (
    subcommand === 'commit' &&
    flags.some((flag) => ['--no-verify', '-n', '--amend'].includes(flag))
  ) {
    return 'commit com --no-verify ou --amend';
  }

  if (subcommand === 'add' && flags.some((flag) => ['-f', '--force'].includes(flag))) {
    return 'git add forçado (pode incluir arquivos do .gitignore, como o .env)';
  }

  return null;
}

for (const segment of segments) {
  const problem = findProblem(segment);
  if (problem) {
    console.error(
      `Bloqueado pelo .claude/hooks/guard-git.mjs: ${problem}. Não tente contornar; avise o usuário.`,
    );
    process.exit(2);
  }
}
