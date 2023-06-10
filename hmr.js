import esbuild from 'esbuild'

const target = process.argv[2]
const prod = process.argv.find(s => s.includes('--prod'))
console.log('creating hot heload on', target)

const params = {
  entryPoints: ['src/index.js'],
  format: 'esm',
  bundle: true,
  minify: !!prod,
  sourcemap: !prod,
  external: ['socket:*'],
  outdir: target
}

await esbuild.build(params)
const build = await esbuild.context(params)
await build.watch({

})
