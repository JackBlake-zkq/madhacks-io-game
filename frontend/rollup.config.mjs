import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    file: 'public/build/bundle.js',
    format: 'iife',
    name: 'app',
  },
  plugins: [
    svelte({
      include: 'src/**/*.svelte',
      compilerOptions: {
				dev: !production
			}
    }),
    resolve({ browser: true }),
    css({ output: 'bundle.css' })
  ],
};