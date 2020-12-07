var Generator = require('yeoman-generator');
module.exports = class extends Generator {
  async initPackage() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      }
    ]);
    const pkgJson = {
      name: answers.name,
      license: "MIT",
      version: "1.0.0",
      description: "",
      main: "src/index.js",
      scripts: {
        test: "mocha --require @babel/register",
        coverage: "nyc npm run test",
        start: "webpack-dev-server",
        build: "webpack --progress"
      },
      devDependencies: {
      },
      dependencies: {
      },
    }
    this.log("app name", answers.name);
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall(['vue'], { 'save': true });
    this.npmInstall([
      'vue-loader',
      'vue-template-compiler',
      'vue-style-loader',
      'css-loader',
      'webpack@4.44.2',
      'webpack-cli@3.3.12',
      'copy-webpack-plugin',
      'webpack-dev-server',
      'mocha',
      'nyc',
      'babel-loader',
      '@babel/cli',
      '@babel/core',
      '@babel/preset-env',
      '@babel/register',
      'babel-plugin-istanbul',
      '@istanbuljs/nyc-config-babel',
    ], { 'save-dev': true });

    this.fs.copyTpl(
      this.templatePath('HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue'),
      { title: 'Templating with Yeoman' }
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      { title: answers.name }
    );
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc')
    );
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc')
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
    this.fs.copyTpl(
      this.templatePath('sample-test.js'),
      this.destinationPath('test/test.js')
    );
  }
};