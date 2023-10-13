const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin({
        contextRegExp: /^\.\/locale$/,
        resourceRegExp: /moment$/
      })
    ]
  },

  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src')).set('@api', resolve('src/api')).set('@assets', resolve('src/assets')).set('@views', resolve('src/views'))
    const svgRule = config.module.rule('svg')
    config.module.rules.delete('svg')

    config.module
      .rule('svg')
      .oneOf('svg_as_component')
      .resourceQuery(/inline/)
      .test(/\.(svg)(\?.*)?$/)
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: {
          plugins: [{ prefixIds: true }, { cleanupIDs: true }, { convertShapeToPath: false }, { convertStyleToAttrs: true }]
        }
      })
      .end()
      .end()
      .oneOf('svg_as_regular')
      .merge(svgRule.toConfig())
      .end()
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#2F68BD',
          'link-color': '#2F68BD',
          'error-color': '#E23322',
          'success-color': '#2B9E77',
          'border-radius-base': '4px',
          'card-shadow': '0px 4px 28px rgba(68, 57, 168, 0.15)',
          'card-radius': '4px',
          'vxe-primary-color': '#2F68BD'
        },
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: 3000
  },
  publicPath: '/',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    preview: {
      entry: 'src/preview.js',
      template: 'public/preview.html',
      filename: 'preview.html',
      chunks: ['chunk-vendors', 'chunk-common', 'preview']
    }
  },
  runtimeCompiler: true,
  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

module.exports = vueConfig
