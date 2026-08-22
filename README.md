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

Use `vikunja dump` / `vikunja restore` to copy a **whole instance**: users, teams, project shares, task assignments, files, and the database.

That is not the same as **Settings → Export your Vikunja data**. The UI export is a personal zip of one user’s projects and tasks. Importing it does not create other accounts, shares, or assignments (except the importer, if their email or username matches).

Restore **wipes the target instance**. Stop the API first so it is not using `vikunja.db`.

### Dump from Docker (production)

`dump` is a subcommand of the Vikunja binary. `docker compose exec` skips the image entrypoint, so `docker compose exec vikunja dump` fails with “executable file not found”.

On the production host, from the compose directory:

```bash
docker compose exec vikunja /app/vikunja/vikunja dump -p /tmp -f vikunja-dump.zip
docker compose cp vikunja:/tmp/vikunja-dump.zip .
```

`-p /tmp` is required on the official image: `/app/vikunja` is not writable. If the service is not named `vikunja`, use the name from `docker compose ps`.

Copy the zip onto the machine where you will restore (for example `scp` into this repo).

On a non-Docker install, from the directory with `config.yml`:

```bash
VIKUNJA_SERVICE_PUBLICURL=http://localhost:3456 ./vikunja dump -p . -f vikunja-dump.zip
```

`publicurl` is required because CORS is on by default. The zip lands next to the binary unless you pass `-p`.

### Restore locally

The dump’s `VERSION` and this binary must match **exactly**, including `dev`. Check both:

```bash
unzip -p vikunja-dump.zip VERSION
./vikunja version
```

A `mage build` binary is stamped from git (`git describe`), so it usually will not match a production release. Stamp the local build with the dump’s version, then restore:

```bash
mage build
# if versions differ:
RELEASE_VERSION="$(unzip -p vikunja-dump.zip VERSION)" mage build

# stop any running ./vikunja process first
VIKUNJA_SERVICE_PUBLICURL=http://localhost:3456 ./vikunja restore --preserve-config vikunja-dump.zip
```

`--preserve-config` keeps this repo’s `config.yml` instead of overwriting it with the production Docker config. When prompted, type exactly:

```text
Yes, I understand
```

Then start the API again as in [Local development](#local-development). Log in with the production users; they came over with the dump.

If restore fails with `service.publicurl is required when cors.enable is true`, you omitted `VIKUNJA_SERVICE_PUBLICURL`. If it fails with a version mismatch, the two version strings above are not identical.

## License

Most of this repository is licensed under [AGPL‑3.0‑or‑later](LICENSE), same as Vikunja.
The contents of [`desktop/`](desktop/) are licensed under [GPL‑3.0‑or‑later](desktop/LICENSE).

Background images from Unsplash are distributed under the [Unsplash License](https://unsplash.com/license).
