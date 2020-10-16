#!/usr/bin/env node

// 调试阶段直接调用源码
// require('@babel/register')({
//   presets: ['@babel/preset-react', '@babel/preset-env']
// });

require('@babel/polyfill');

var path = require('path');

var fs = require('fs');

var program = require('commander');
program
  .version('1.0.0')
  .arguments('<psdPath>')
  .action(function (psdPath) {
    const p2cConfigPath = path.join(process.cwd(), 'p2cConfig/config.js');
    // 调试阶段直接调用源码
    // var CodeGenerator = require('../src/cli/psd2code.js');
    const name = require('../package.json').name.replace('@gz/', '');
    var CodeGenerator = require('../dist/' + name)[name];
    CodeGenerator = CodeGenerator.default || CodeGenerator;

    CodeGenerator({
      psdPath,
      ...program.opts(),
      cliRootPath: path.resolve(__dirname, '../'),
      customConfig: fs.existsSync(p2cConfigPath) ? require(p2cConfigPath) : ''
    });
  });

program
  .command('init')
  .description('生成配置文件')
  .action(() => {
    require('../src/cli/init')();
  });

program.parse(process.argv);
