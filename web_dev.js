import esbuild from 'esbuild'
import fs from 'fs/promises'

const build = await esbuild.context({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: false,
  sourcemap: true,
  format: 'esm',
  outdir: 'www'
})

await build.watch()
const { host, port } = await build.serve({
  servedir: 'www',
  port: 8080
})
console.log(`running on http://${host}:${port}`)

for await (const change of fs.watch('src')) {
  console.log(change, 'changed')
  await Promise.all([
    fs.cp('src/index.html', 'www/index.html')
  ])
  build.rebuild()
}
