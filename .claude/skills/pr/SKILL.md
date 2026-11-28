---
name: pr
description: Revisa a branch atual com o subagente reviewer, escreve o título e a descrição do PR seguindo o template, sugere os commits e, com a aprovação do usuário, commita, dá push e abre o PR.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(git diff:*), Bash(git branch:*), Bash(git fetch:*), Bash(git add:*), Bash(git commit -m:*), Bash(git push origin:*), Bash(gh pr create:*), Bash(gh pr view:*)
---

# Abrir pull request

## 1. Conferir a branch

- `git branch --show-current`. Se for `develop` ou `main`, pare: essas branches só mudam por PR. Sugira usar `/branch` primeiro.
- Base: `release/*` e `hotfix/*` vão pra `main`; o resto vai pra `develop`.
- `git fetch origin` e leia tudo o que a branch muda em relação a `origin/<base>`: os commits (`git log --oneline origin/<base>..HEAD`), o diff commitado (`git diff origin/<base>...HEAD`) e o que ainda não foi commitado (`git status --short` e `git diff`, incluindo arquivos novos).
- Se não houver nenhuma mudança, avise e pare.

## 2. Revisar com o reviewer

Chame o subagente `reviewer` pra revisar todas essas mudanças, commitadas ou não. Mostre o que ele encontrou:

- Se ele apontar problemas, pergunte se o usuário quer corrigir antes de seguir. Se quiser, corrija, rode `pnpm format:check`, `pnpm lint` e `pnpm typecheck`, e volte pro início do passo 2.
- Se não encontrar nada, diga isso em uma linha e siga.

## 3. Título e descrição

- Título no formato Conventional Commits, em inglês (`tipo: descrição`), resumindo a branch inteira.
- Descrição em português, preenchendo as seções de `.github/pull_request_template.md` sem os comentários `<!-- -->`. Curta: explicar o porquê, não repetir o diff. Em "Como testar", só o que foi testado de verdade; o resto vira passo pro revisor. Sem linha de assinatura ou de "gerado por IA".

Mostre e espere o usuário aprovar ou pedir ajuste.

## 4. Commits

Se houver mudanças não commitadas, sugira como dividir em commits: cada um com uma mensagem Conventional Commits em inglês e a lista de arquivos. Um commit por assunto (ex.: refactor separado de feature); se for tudo um assunto só, um commit basta. Nunca inclua `.env` nem arquivos de fora do escopo da branch.

Mostre e espere a aprovação. Se não houver nada pra commitar, pule pro passo 5.

## 5. Executar

Só depois de tudo aprovado:

1. Pra cada commit: `git add <arquivos do commit>` (ou `git add .` se o commit leva tudo) e `git commit -m "<mensagem>"`.
2. `git push origin <branch>`.
3. Salve a descrição num arquivo temporário e rode `gh pr create --base <base> --title "<título>" --body-file <arquivo>`.
4. Responda com o link do PR e lembre que a revisão automática (`Claude review`) e o `ci` vão rodar nele.

Use só esses comandos, do jeito que estão. Se algum der erro (hook do commitlint recusou, push rejeitado, etc.), pare e avise o usuário com a mensagem do erro. Não tente contornar e não force nada (`--force`, `--no-verify`, `--amend`).

## Casos especiais

- `release/*`: antes de abrir o PR, rode `git log --oneline origin/<branch>..origin/main` (ou `HEAD..origin/main` se a branch ainda não está no remoto). Se houver commits, avise que a `main` tem commits que a branch não tem e que o PR vai ficar bloqueado até a branch ser atualizada; pergunte como o usuário quer seguir. Depois do merge na `main`, falta criar a tag da versão (`vX.Y.Z`).
- `hotfix/*`: depois do merge na `main`, falta criar a tag da versão (`vX.Y.Z`) e abrir um segundo PR da mesma branch pra `develop`. Avise e ofereça abrir (`gh pr create --base develop --head <branch>`). Antes de abrir esse segundo PR, rode `git log --oneline HEAD..origin/develop`: se houver commits, avise que a branch precisa ser atualizada com a `develop` antes do merge e pergunte como o usuário quer seguir.
