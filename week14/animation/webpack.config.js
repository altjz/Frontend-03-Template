const path = require('path');

module.exports = {
  entry: "./main.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "main.js",
  },
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                { pragma: "createElement"}
              ]
            ]
          }
        },
      }
    ]
  }
}