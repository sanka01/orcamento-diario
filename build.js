//
// This is an example build script for Socket Runtime
// When you run 'ssc build', this script (node build.js) will be run
//
import fs from 'node:fs'
import path from 'node:path'
import optsBuild from './opts.build.js'
import esbuild from 'esbuild'

const cp = async (a, b) => fs.promises.cp(
  path.resolve(a),
  path.join(b, path.basename(a)),
  { recursive: true, force: true }
)

async function main () {
  const params = optsBuild

  const watch = process.argv.find(s => s.includes('--watch='))

  //
  // The second argument to this program will be the target-OS specifc
  // directory for where to copy your build artifacts
  //
  const target = path.resolve(process.argv[2])

  //
  //
  //
  if (!watch) {
    await esbuild.build({
      ...params,
      outdir: target
    })
  }
  if (process.argv.find(s => s.includes('--test'))) {
    await esbuild.build({
      ...params,
      entryPoints: ['test/index.js'],
      outdir: path.join(target, 'test')
    })
  }

  //
  // Not writing a package json to your project could be a security risk
  //
  await fs.promises.writeFile(path.join(target, 'package.json'), '{ "private": true }')

  if (!target) {
    console.log('Did not receive the build target path as an argument!')
    process.exit(1)
  }

  //
  // Copy some files into the new project
  //
  await Promise.all([
    cp('src/index.html', target),
    cp('src/icon.png', target)
  ])
}

main()
