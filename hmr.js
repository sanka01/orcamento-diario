import esbuild from 'esbuild'
import optsBuild from './opts.build.js'

const target = process.argv[2]
console.log('creating hot heload on', target)

const params = optsBuild

await esbuild.build(params)
const build = await esbuild.context(params)
await build.watch({

})
