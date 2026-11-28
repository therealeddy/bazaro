// Runs before every Bash command (PreToolUse). Exit code 2 blocks the command and
// sends the message on stderr back to Claude. Catches the dangerous git flags in any
// position, which the prefix-based "deny" rules in settings.json can't do.
let input = '';
for await (const chunk of process.stdin) input += chunk;

const command = JSON.parse(input).tool_input?.command ?? '';

// Quoted strings stay as one token, so a commit message can't trigger a false positive.
// Separators (;, &&, ||, |, &, line breaks) are their own tokens even without spaces around.
const SEPARATOR = /^(?:&&|\|\||[;|&\n])$/;
const tokens = command.match(/"[^"]*"|'[^']*'|&&|\|\||[;|&\n]|[^\s;|&"']+/g) ?? [];

const segments = [[]];
for (const token of tokens) {
  if (SEPARATOR.test(token)) segments.push([]);
  else segments.at(-1).push(token);
}

const PROTECTED_BRANCHES = ['develop', 'main'];

// Short flags can be grouped: `-fu` is `-f -u`, `-nm` is `-n -m`.
function hasShortFlag(flags, letter) {
  return flags.some((flag) => /^-[a-zA-Z]+$/.test(flag) && flag.includes(letter));
}

function checkGit(subcommand, rest) {
  const flags = rest.filter((arg) => arg.startsWith('-'));
  const values = rest.filter((arg) => !arg.startsWith('-'));

  if (subcommand === 'push') {
    if (
      flags.some((flag) => ['--force', '--mirror', '--delete'].some((f) => flag.startsWith(f))) ||
      hasShortFlag(flags, 'f') ||
      hasShortFlag(flags, 'd')
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
    (flags.some((flag) => ['--no-verify', '--amend'].includes(flag)) || hasShortFlag(flags, 'n'))
  ) {
    return 'commit com --no-verify ou --amend';
  }

  if (subcommand === 'add' && (flags.includes('--force') || hasShortFlag(flags, 'f'))) {
    return 'git add forçado (pode incluir arquivos do .gitignore, como o .env)';
  }

  return null;
}

function findProblem(args) {
  for (
    let gitIndex = args.indexOf('git');
    gitIndex !== -1;
    gitIndex = args.indexOf('git', gitIndex + 1)
  ) {
    let i = gitIndex + 1;
    while (args[i]?.startsWith('-')) i += ['-C', '-c'].includes(args[i]) ? 2 : 1;
    const problem = checkGit(args[i], args.slice(i + 1));
    if (problem) return problem;
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
