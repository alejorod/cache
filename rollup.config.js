import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/cache.js',
  format: 'umd',
  dest: 'lib/fn-cache.js',
  plugins: [ babel({
    babelrc: false,
    presets: [ 'es2015-rollup' ]
  }), uglify() ],
  moduleName: 'fnCache'
};
