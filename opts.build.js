const prod = false//! process.env.DEBUG

export default {
  entryPoints: ['src/index.js'],
  format: 'esm',
  bundle: true,
  minify: false,
  sourcemap: !prod,
  external: ['socket:*', 'node:*', 'backend:*']
}
