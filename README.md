# psd2code cli

将 psd 文件解析成为代码的命令行工具

### 安装

```
orz i @gz/psd2code-cli -g

```

## 用法

初始化:在当前目录下生成配置文件文件夹 `p2cConfig`

```shell
$ p2c init

```

解析 psd 生成代码

```shell
$ p2c <psdPath>
```

### 配置

配置文件 `p2cConfig/config`;
生成代码的模板`p2cConfig/Temp.vue`

在模板文件中 可以能使用的 ejs 模板标签： `<%- variable %>`,
variable:

- html
- js
- scss
- css
- styledComponents
- jsx
- wxml
- wxss
- name 文件名

#### example:

```html
<!-- Temp.vue -->
<template><%- html %></template>

<style>
  <%- css %>
</style>
```

### psd 命名规则

[示例文件](https://cdn2.h5no1.com/static-cdn/psd2code/psd2code.zip?v=1)

#### 命名规范

- PSD 图层名 `comp_name.<ext>`
- 生成的 CSS 类名 .comp-name
- 生成的组件名称 CompName

#### 图片组件

以 .png 或者 .jpg 结尾的图层或者图层组

comp_name.png  
comp_name.jpg

#### 文本组件

以 `_$t` 结尾的图层
`comp_name_$t`

#### 容器组件

以 `_$c`结尾的图层组，容器组件将使用改图层组中的最后一个子元素进行渲染，即

- 使用最后一个子元素的宽度和高度作为尺寸
- 使用最后一个子元素的图片作为背景
- 使用最后一个子元素的名称作为组件名称
- 自动移除最后一个子元素

容器组件在 PSD 中可以随意命名，也可以没有名字
`<any>_$c`

#### 安全区域

以 `_$safe` 结尾的图层组，用于单屏页面的适配。

- 将安全区域内的元素包裹在一个 `<div class="safe-area"></div>` 的容器中

- 将所有元素包裹在一个 `<div class="page-wrap"></div>` 容器中

- 在样式文件中自动加入以下代码

```css
.page-wrap {
}
.safe-area {
  position: relative;
  width: 100%;
  height: 160.8vw; /* 1206px in vw */
}
@media (min-aspect-ratio: 750 / 1206) {
  .safe-area {
    height: 100%;
  }
}
```

安全区域在 PSD 中可以随意命名，也可以没有名字
`<any>_$safe`
