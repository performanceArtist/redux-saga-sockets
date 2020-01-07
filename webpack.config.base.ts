const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    app: './src/client/main.tsx',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@root': path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          minSize: 0,
        },
      },
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        loader: ['ts-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: 'style-loader',
          },
          'css-loader?url=false',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.join(__dirname, 'src')],
              }
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/client/app.html',
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};

export default config;
