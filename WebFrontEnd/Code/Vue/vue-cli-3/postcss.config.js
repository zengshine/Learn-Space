module.exports = {
  plugins: { 
    "postcss-import": {},
    "postcss-url": {},
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {
      utf8: false
    },
    "postcss-cssnext": {},
    "postcss-px-to-viewport": {
      viewportWidth: 750, // (Number) The width of the viewport.
      viewportHeight: 1334, // (Number) The height of the viewport.
      unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: 'vw', // (String) Expected units. 
      selectorBlackList: ['.ignore', '.hairlines',/['-px']$/ig], // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace. 
      mediaQuery: false // (Boolean) Allow px to be converted in media queries.
    },
    "cssnano": {
      "preset": "advanced",
      "autoprefixer": false, //由于cssnext和cssnano都具有autoprefixer,事实上只需要一个，所以把默认的autoprefixer删除掉，然后把cssnano中的autoprefixer设置为false
      "postcss-zindex": false, //暂时理解：只要启用该选项，z-index的值就会重置为1，所以必须设成false
    }
  }
};
