# Bazaro

Marketplace multi-tenant de produtos digitais. Cada lojista tem uma loja, servida no próprio subdomínio (`<slug>.usebazaro.com`).

## Stack

Monorepo com pnpm workspaces + Turborepo, Node 24, TypeScript em tudo.

| Pasta                 | O que é                                                         | Porta | Deploy  |
| --------------------- | --------------------------------------------------------------- | ----- | ------- |
| `apps/api`            | API em Express                                                  | 3333  | Railway |
| `apps/dashboard`      | Painel do lojista, SPA React + Vite                             | 5173  | Vercel  |
| `apps/landing`        | Site institucional, Next.js                                     | 3000  | Vercel  |
| `apps/storefront`     | Páginas das lojas, Next.js                                      | 3001  | Vercel  |
| `packages/shared`     | Código compartilhado entre os apps                              |       |         |
| `packages/monitoring` | Configuração do Sentry pra cada plataforma                      |       |         |
| `packages/config`     | Presets de ESLint e tsconfig (só ferramenta de desenvolvimento) |       |         |

## Comandos

Rodar da raiz:

- `pnpm dev`: todos os apps em modo watch
- `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build`
- `pnpm turbo run <task> --filter=@bazaro/<app>`: só um app
- `pnpm docker:up` / `pnpm docker:down`: Postgres e Redis locais

Antes de dizer que uma mudança está pronta, rodar `pnpm format:check`, `pnpm lint` e `pnpm typecheck`. Testes e build ficam pro CI.

## Regras de código

- Tudo do projeto em inglês: código, nomes de arquivos e pastas, commits. Só as descrições de PR e este arquivo são em português.
- Comentários curtos só quando explicam o porquê de algo que não é óbvio; não comentar o que o código já diz.
- O estilo é do Prettier e do ESLint; não brigar com eles.

## Dependências

- Versão usada por mais de um pacote, ou que precisa andar junto com outra, vai no `catalog` do `pnpm-workspace.yaml` e é referenciada como `"catalog:"`.
- Nunca adicionar exceção no `minimumReleaseAge` do pnpm. Se a versão é nova demais, usar uma anterior.
- Código que roda em produção vai em `packages/shared` ou `packages/monitoring`, nunca em `packages/config`.

## Variáveis de ambiente

Cada app tem o seu `.env` na própria pasta, só pro ambiente local. O `.env` pode ser lido e editado, mas nunca vai pro Git; o `.env.example` mostra quais variáveis existem.

Onde ficam os valores:

| Ambiente       | API                             | Fronts                                                            |
| -------------- | ------------------------------- | ----------------------------------------------------------------- |
| Local          | `apps/api/.env`                 | `.env` de cada app                                                |
| Dev e produção | Variáveis do serviço no Railway | Vars e secrets do GitHub Actions, passadas no build pelo `cd.yml` |

O que é público e o que pode ser segredo (token, senha, chave):

- **Next**: variável sem prefixo só existe no servidor e pode ser segredo. Com `NEXT_PUBLIC_`, vai pro JavaScript do navegador e qualquer pessoa consegue ver.
- **Vite (dashboard)**: não tem servidor, todo o código roda no navegador. Só as `VITE_` chegam no código, e todas são públicas. Sem prefixo, a variável só existe no build (`vite.config.ts`).
- **API**: tudo roda no servidor, pode ser segredo.

Ao criar uma variável nova:

1. Adicionar no `.env.example` do app.
2. Se o front usa no build, adicionar no `turbo.json` (`env`, ou `passThroughEnv` se for segredo), senão o Turborepo não repassa.
3. Avisar que o valor precisa ser configurado em dev e produção (Railway ou GitHub).

## Git e entrega

- Gitflow: `feature/*`, `fix/*`, `chore/*` e `ci/*` saem da `develop`; `release/x.y.z` vai da `develop` pra `main`; `hotfix/x.y.z` sai da `main` e é mergeado na `main` e de volta na `develop`.
- Commits no formato Conventional Commits (`tipo: descrição`). O commitlint, no hook `commit-msg` do Husky, recusa commit fora do padrão.
- `develop` e `main` só mudam por PR, com o check `ci` passando e a branch atualizada.
- Título do PR no formato Conventional Commits; descrição em português.
- Merge na `develop` publica em dev (`dev.usebazaro.com`); merge na `main` publica em produção (`usebazaro.com`) depois de uma aprovação manual.

## Monitoramento

Os erros vão pro Sentry pelo `@bazaro/monitoring`. Nunca importar `@sentry/*` direto num app; o que faltar entra no pacote.
