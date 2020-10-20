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
  .arguments('[psdPath]')
  .action(function (psdPath) {
    const p2cConfigPath = path.join(process.cwd(), 'p2cConfig/config.js');
    // 调试阶段直接调用源码
    // var CodeGenerator = require('../src/cli/psd2code.js');

    const name = require('../package.json').name.replace('@gz/', '');
    var CodeGenerator = require('../dist/' + name)[name];

    CodeGenerator = CodeGenerator.default || CodeGenerator;
    if (psdPath) {
      CodeGenerator({
        psdPath,
        ...program.opts(),
        cliRootPath: path.resolve(__dirname, '../'),
        customConfig: fs.existsSync(p2cConfigPath) ? require(p2cConfigPath) : ''
      });
    } else {
      if (!fs.existsSync(p2cConfigPath)) throw new Error('缺少配置文件');
      const customConfig = require(p2cConfigPath);
      let psdPath = customConfig.psdPath;
      if (typeof psdPath === 'string') psdPath = [psdPath];
      psdPath.forEach(element => {
        CodeGenerator({
          psdPath: element,
          ...program.opts(),
          cliRootPath: path.resolve(__dirname, '../'),
          customConfig: JSON.parse(JSON.stringify(customConfig))
        });
      });
    }
  });

program
  .command('init')
  .description('生成配置文件')
  .action(() => {
    require('../src/cli/init')();
  });

program.parse(process.argv);
