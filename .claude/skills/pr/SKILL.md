---
name: pr
description: Escreve o título e a descrição de um pull request da branch atual seguindo o template do projeto e abre o PR com o gh quando o usuário confirmar.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(git diff:*), Bash(git branch:*)
---

# Abrir pull request

1. Descobrir a base pelo nome da branch atual (`git branch --show-current`):
   - `release/*` e `hotfix/*` vão pra `main`. Um hotfix também precisa de um segundo PR pra `develop` depois do merge; avisar o usuário.
   - O resto vai pra `develop`.
2. Ler o que a branch muda em relação à base:
   - `git log --oneline origin/<base>..HEAD`
   - `git diff origin/<base>...HEAD --stat` e depois o diff completo dos arquivos relevantes.
3. Escrever o título no formato Conventional Commits, em inglês, igual aos commits (`tipo: descrição`). Se a branch tem vários commits, o título resume todos.
4. Escrever a descrição em português, preenchendo as seções de `.github/pull_request_template.md` sem os comentários `<!-- -->`:
   - Curta e direta. Explicar o porquê, não repetir o diff linha por linha.
   - Em "Como testar", dizer só o que foi testado de verdade nesta sessão; o resto vira passo pro revisor.
   - Sem linha de assinatura ou de "gerado por IA".
5. Mostrar o título e a descrição pro usuário e esperar ele aprovar ou pedir ajuste.
6. Só depois da aprovação:
   - Conferir com `git status -sb` se a branch já está no remoto e sem commits pendentes de push. Se não estiver, pedir pro usuário dar push; nunca dar push por conta própria.
   - Salvar a descrição num arquivo temporário e rodar `gh pr create --base <base> --title "<título>" --body-file <arquivo>`.
   - Responder com o link do PR.
