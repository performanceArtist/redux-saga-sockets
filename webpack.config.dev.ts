const merge = require('webpack-merge');
import baseConfig from './webpack.config.base';

module.exports = merge(baseConfig, {
  devServer: {
    port: 3000,
    open: true,
    publicPath: '/',
    historyApiFallback: true,
    disableHostCheck: true,
  },
});
