import { type BuildConfig, build } from 'bun'

const cfg: BuildConfig = {
	entrypoints: ['src/index.js'],
	minify: true,
	outdir: 'dist',
	target: 'node',
}

const res = await build(cfg)
if (!res.success) {
	console.error(res.logs)
	process.exit(1)
}
