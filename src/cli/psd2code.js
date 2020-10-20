import ReactDOMServer from 'react-dom/server.js';
import generatorImage from './generatorImage.js';
import parsePsd from './parsePsd.js';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import prettier from 'prettier';
const treeToHtml = require('tree-to-code/lib/html').default;
const treeToCSS = require('tree-to-code/lib/css').default;
const treeToSCSS = require('tree-to-code/lib/scss').default;
const treeToStyled = require('tree-to-code/lib/styled').default;
const treeToJSX = require('tree-to-code/lib/jsx').default;
const treeToWxml = require('tree-to-code/lib/wxml').default;
const treeToWXSS = require('tree-to-code/lib/wxss').default;

const codeRenderMap = {
  html: treeToHtml,
  css: treeToCSS,
  scss: treeToSCSS,
  'styled-components': treeToStyled,
  jsx: treeToJSX,
  wxml: treeToWxml,
  wxss: treeToWXSS
};

const getRenderTemp = tempFilePath => fs.readFileSync(tempFilePath).toString();

function dealOption(options) {
  let { psdPath, cliRootPath, customConfig } = options;
  let _options = JSON.parse(JSON.stringify(require('./p2cConfig/config.js')));
  if (customConfig) {
    Object.assign(_options, customConfig);
  } else {
    _options.renderTempPath = [
      path.join(cliRootPath, 'src/cli/p2cConfig/' + _options.renderTempPath[0])
    ];
  }

  if (!path.isAbsolute(_options.absolute)) _options.absolute = process.cwd();

  if (typeof _options.renderTempPath === 'string') {
    _options.renderTempPath = [_options.renderTempPath];
  }
  _options.renderTempPath = _options.renderTempPath.map(item => {
    if (!path.isAbsolute(item)) {
      return path.join(_options.absolute, 'p2cConfig', item);
    }
    return item;
  });

  if (!path.isAbsolute(psdPath))
    psdPath = path.join(_options.absolute, psdPath);

  const name = path.basename(psdPath, '.psd');

  if (!path.isAbsolute(_options.outPath))
    _options.outPath = path.join(_options.absolute, _options.outPath, name);
  Object.assign(_options, {
    psdPath,
    name
  });
  console.log(chalk.yellow('配置：'));
  console.log(_options);
  return _options;
}

function getCode(treeExp, type, _options) {
  const Entities = require('html-entities').XmlEntities;
  const entities = new Entities();
  let code = codeRenderMap[type](treeExp, {
    ..._options,
    doc: {
      width: treeExp.document.width,
      height: treeExp.document.height
    }
  });
  code = ReactDOMServer.renderToString(code);
  code = entities.decode(entities.decode(code));
  code = code.replace(/<!-- -->/g, '');
  return code;
}

const psd2code = async options => {
  const _options = dealOption(options);
  if (!fs.existsSync(_options.outPath)) fs.mkdirSync(_options.outPath);

  let { docTree } = await parsePsd(_options.psdPath);
  generatorImage({
    docTree,
    outPath: _options.outPath,
    imgType: _options.imgType
  });

  const treeExp = docTree.export();
  const html = getCode(treeExp, 'html', _options);
  const css = getCode(treeExp, 'css', _options);
  const scss = getCode(treeExp, 'scss', _options);
  const styledComponents = getCode(treeExp, 'styled-components', _options);
  const jsx = getCode(treeExp, 'jsx', _options);
  const wxml = getCode(treeExp, 'wxml', _options);
  const wxss = getCode(treeExp, 'wxss', _options);

  _options.renderTempPath.forEach(tempFilePath => {
    let tmp = ejs.render(getRenderTemp(tempFilePath), {
      html,
      scss,
      css,
      styledComponents,
      jsx,
      wxml,
      wxss,
      name: _options.name
    });

    tmp = prettier.format(tmp, {
      parser: 'html',
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      quoteProps: 'as-needed',
      jsxSingleQuote: false,
      trailingComma: 'none',
      bracketSpacing: true,
      jsxBracketSameLine: false,
      arrowParens: 'avoid',
      htmlWhitespaceSensitivity: 'ignore',
      endOfLine: 'auto'
    });

    fs.writeFileSync(
      `${_options.outPath}/${_options.name}${path.extname(tempFilePath)}`,
      tmp
    );
  });
};

export default psd2code;
