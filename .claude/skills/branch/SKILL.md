---
name: branch
description: Sugere o nome da branch a partir da descrição do trabalho, seguindo o Gitflow do projeto, e cria a branch a partir da base certa depois que o usuário aprovar.
argument-hint: <o que você quer fazer>
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git fetch:*), Bash(git tag --list:*), Bash(git log:*), Bash(git switch:*), Bash(git pull:*)
---

# Criar branch

O que o usuário quer fazer: $ARGUMENTS

Se a descrição estiver vazia, pergunte o que ele quer fazer e pare.

## 1. Escolher o tipo, a base e o nome

| Tipo        | Quando                                                      | Base      |
| ----------- | ----------------------------------------------------------- | --------- |
| `feature/*` | funcionalidade nova                                         | `develop` |
| `fix/*`     | correção de algo que ainda não está em produção             | `develop` |
| `chore/*`   | configuração, dependências, ferramentas, testes, docs       | `develop` |
| `ci/*`      | workflows do GitHub Actions                                 | `develop` |
| `release/*` | levar o que está na `develop` pra produção                  | `develop` |
| `hotfix/*`  | correção urgente de um bug que já está em produção (`main`) | `main`    |

- `feature`, `fix`, `chore` e `ci`: nome curto em inglês, kebab-case, dizendo o que muda (ex.: `feature/store-signup`, `fix/slug-error-message`).
- `release` e `hotfix`: o nome é a versão (`release/0.3.0`, `hotfix/0.2.2`). Rode `git fetch --tags` e pegue a maior tag com `git tag --list 'v*' --sort=-v:refname | head -1`. Se não houver tag, pergunte a versão.
  - `release`: leia `git log <maior tag>..origin/develop --format=%B`. Algum `feat` → sobe o minor (`0.2.1` → `0.3.0`); só `fix` e o resto → sobe o patch. Se aparecer breaking change (`feat!:` ou `BREAKING CHANGE`), avise e pergunte a versão. Se não houver commit novo, avise que não há o que lançar e pare.
  - `hotfix`: sobe o patch da maior tag.
- Se ficar em dúvida entre dois tipos (ex.: `fix` ou `hotfix`), pergunte em vez de chutar.

## 2. Mostrar e esperar aprovação

Mostre o nome, a base e, em uma linha, por que esse tipo. Rode `git status --short`: se houver mudanças não commitadas, diga que elas vão junto pra branch nova. Espere o usuário aprovar ou sugerir outro nome. Não crie nada antes disso.

## 3. Criar a branch

Depois da aprovação:

1. `git fetch origin`
2. `git switch <base>` e `git pull --ff-only`
3. `git switch -c <nome>`

Se algum passo der erro, pare e avise o usuário com a mensagem do erro. Não tente contornar nem force nada. No fim, confirme a branch atual com `git branch --show-current`.

Não dê push: a branch vai pro remoto quando o PR for aberto (`/pr`).
