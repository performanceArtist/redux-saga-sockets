const merge = require('webpack-merge');
import baseConfig from './webpack.config.base';

export default merge(baseConfig, { module: {} });
