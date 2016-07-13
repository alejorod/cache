import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/cache.js',
  format: 'umd',
  dest: 'dist/index.js',
  plugins: [ babel(), uglify() ],
  moduleName: 'cache'
};
