# RMS Tasks

Task management for [Rochester Makerspace](https://rocmakers.org/).

This repository is a fork of [Vikunja](https://vikunja.io/), the open-source, self-hostable task manager. We run it for the makerspace and keep a small set of local changes (branding and deploy tweaks) on top of upstream.

Upstream: [go-vikunja/vikunja](https://github.com/go-vikunja/vikunja). Install docs, API reference, and project background live on [vikunja.io](https://vikunja.io/).

## Local development

You need Go 1.27, Node.js 24+, [pnpm](https://pnpm.io/), and [Mage](https://magefile.org/) (`go install github.com/magefile/mage@latest`; put `$(go env GOPATH)/bin` on your `PATH`). From the repo root, `devenv shell` installs those tools if you use Nix.

SQLite is the default database. Run the API and the Vue frontend as two processes.

### API

```bash
mage build
VIKUNJA_SERVICE_PUBLICURL=http://localhost:3456 ./vikunja
```

The API listens on `:3456`. `publicurl` is required because CORS is on by default. Registration is enabled, so you can create an account from the UI.

### Frontend

```bash
cd frontend
pnpm install
cp .env.local.example .env.local
```

In `.env.local`, set `DEV_PROXY=http://localhost:3456`, then:

```bash
pnpm dev
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). Vite proxies `/api` to the local backend. The `tasks` hostname is already allowed on the Vite dev server if you use that locally.

## Dump and restore

`vikunja dump` / `vikunja restore` copy a whole instance (users, teams, files, DB). That is not the UI export under **Settings**, which is one user’s projects only. Restore wipes the target — stop the API first.

Dump on the production host (full binary path required; `-p /tmp` because `/app/vikunja` is not writable):

```bash
docker compose exec vikunja /app/vikunja/vikunja dump -p /tmp -f vikunja-dump.zip
docker compose cp vikunja:/tmp/vikunja-dump.zip .
```

Restore locally. Dump `VERSION` and `./vikunja version` must match exactly, so stamp the build. `--preserve-config` keeps this repo’s `config.yml`. Confirm with `Yes, I understand`.

```bash
RELEASE_VERSION="$(unzip -p vikunja-dump.zip VERSION)" mage build
VIKUNJA_SERVICE_PUBLICURL=http://localhost:3456 ./vikunja restore --preserve-config vikunja-dump.zip
```

## Repository layout

### Dotfiles / tooling

- `.claude` — Claude Code skills and settings
- `.cursor` — Cursor IDE project config
- `.devcontainer` — VS Code/GitHub Codespaces container setup
- `.dockerignore` — files excluded from Docker image builds
- `.editorconfig` — shared editor indentation/formatting rules
- `.github` — GitHub Actions, issue templates, funding
- `.gitignore` — files git should ignore
- `.golangci.yml` — Go linter configuration
- `.opensourcefinder-verify` — Open Source Finder listing verification token
- `.vscode` — VS Code launch/settings/extensions
- `.zed` — Zed editor tasks

### Docs / license

- `AGENTS.md` — AI/contributor instructions for this repo
- `CHANGELOG.md` — version history
- `CLAUDE.md` — symlink to `AGENTS.md`
- `CONTRIBUTING.md` — how to contribute
- `LICENSE` — AGPLv3 license text

### App source

- `pkg/` — Go API backend (models, routes, services)
- `frontend/` — Vue.js web client
- `desktop/` — Electron desktop wrapper
- `veans` — related Go CLI/tooling project
- `main.go` — Go entrypoint; runs `pkg/cmd`
- `magefile.go` — Mage build/dev/test/release tasks
- `go.mod` / `go.sum` — Go module dependencies

### Config

- `config.yml` — local runtime config
- `config.yml.sample` — sample config for installs
- `config-raw.json` — source used to generate the sample config

### Packaging / deploy

- `Dockerfile` — container image for Vikunja
- `nfpm.yaml` — Linux package (deb/rpm/apk) spec
- `vikunja.service` — systemd unit
- `vikunja.initd` — OpenRC init script
- `build/` — packaging scripts (post-install, reprepro)
- `publiccode.yml` — public-sector software catalog metadata

### Dev environment

- `devenv.nix` / `devenv.yaml` / `devenv.lock` — Nix devenv environment
- `mise.toml` — pinned Node, pnpm, and Go versions
- `conductor.json` — Conductor worktree setup (direnv)
- `paseo.json` — Paseo worktree setup (config + frontend install)
- `tsconfig.json` — root TS parser pointing at `frontend/`

### i18n / deps / changelog tooling

- `crowdin.yml` — Crowdin translation sync
- `renovate.json` — Renovate dependency-update bot
- `cliff.toml` — git-cliff changelog generation
- `code-header-template.txt` — AGPL header stamped onto source files

### Examples / extras

- `contrib/` — extra scripts (e.g. translation cleanup)
- `examples/` — example plugins
- `rest/` — Bruno HTTP API request collection

## License

Most of this repository is licensed under [AGPL‑3.0‑or‑later](LICENSE), same as Vikunja.
The contents of [`desktop/`](desktop/) are licensed under [GPL‑3.0‑or‑later](desktop/LICENSE).

Background images from Unsplash are distributed under the [Unsplash License](https://unsplash.com/license).
