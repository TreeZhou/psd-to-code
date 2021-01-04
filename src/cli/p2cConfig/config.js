module.exports = {
  renderTempPath: ['Temp.vue'], //渲染模板名， strind | string[]
  psdPath: [], //psd路径,strind | string[]
  outPath: './',
  imgType: 'png',
  absolute: '', //项目绝对路径，默认当前目录
  imgPathPrefix: './image/',
  usePostcssAutoBg: false,
  useAutoBgMacro: true,
  prependVwFn: true,
  vwBase: 750, //vwFn的基础宽度
  reactType: 'styled',
  usePsdName: false //不使用psd的名字作为文件名，支持renderTempPath使用多文件
};
