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

## License

Most of this repository is licensed under [AGPL‑3.0‑or‑later](LICENSE), same as Vikunja.
The contents of [`desktop/`](desktop/) are licensed under [GPL‑3.0‑or‑later](desktop/LICENSE).

Background images from Unsplash are distributed under the [Unsplash License](https://unsplash.com/license).
