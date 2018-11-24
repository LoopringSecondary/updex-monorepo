import path from 'path'
export default {
  // extraBabelPresets:['@babel/preset-env',"@babel/preset-react"],
  extraBabelIncludes:[
    path.resolve(__dirname, '../../packages'),
  ],
  "extraBabelPlugins": [
    // ["import", { "libraryName": "antd-mobile", "libraryDirectory": "es", "style": true },'antd-mobile'],
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true },'antd'],
    // ["@babel/transform-runtime",{regenerator:true}],
  ],
  hash:true,
  // multipage:true,
  // entry:'./src/assets/css/themes/*.less',
  // outputPath:'dist/themes',
  // hash:false,
  // output:{
  //  path:'dist/themes',
  //  filename:'[name].css',
  // },
  // entry:{
  //   index:['./src/index.js','./src/assets/css/themes/theme-white.less']
  // },
  // extraBabelPresets: ["@babel/env",'@babel/react'],
  disableCSSModules: true,
  
  "alias":{
    // "LoopringJS":`loopring.js/lib`,
    "LoopringJS":path.resolve(__dirname, './node_modules/loopring.js/lib'),
    "LoopringUI":path.resolve(__dirname, '../../packages/common/loopringui'),
    // "LoopringUI":`${__dirname}/packages/common/loopringui`,
    // "common":`${__dirname}/packages/common`,
    "common":path.resolve(__dirname, '../../packages/common'),
    "assets":path.resolve(__dirname, '../../packages/assets'),
    // "modules":`${__dirname}/packages/modules`,
    "modules":path.resolve(__dirname, '../../packages/modules'),
    // "mobile":`${__dirname}/src/dex`,
    "mobile":path.resolve(__dirname, './src/dex'),
    "root":path.resolve(__dirname, './'),
  },
  extraResolveModules:[path.resolve(__dirname, './node_modules/'),path.resolve(__dirname, '../../packages'),],
  "theme": {
    // "@font-family-no-number"  : "Roboto ,PingFang SC",
    // "@font-family"            : "@font-family-no-number",
    "@primary-color": "#C59949",
    "@link-color": "#1c60ff",
    "@border-radius-base": "0px",
    "@line-height-base" : 1.6,
    "@normal-color" :"#eee",
    "@border-color-base" : "hsv(0, 0, 90%)",
  },
  "html": {
    "template": "./public/index.ejs",
    "favicon": path.resolve(__dirname, '../../packages/assets/images/favicon-up.ico'),
    // "favicon": './src/assets/images/favicon-up.ico'
  },
  sass:{},
  ignoreMomentLocale:true,
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  ignoreMomentLocale:true,
}


