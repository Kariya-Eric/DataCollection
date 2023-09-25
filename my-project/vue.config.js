const path = require('path')
const webpack = require('webpack')
const packageJson = require('./package.json')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())

function resolve(dir) {
  return path.join(__dirname, dir)
}

function getGitHash() {
  try {
    return GitRevision.version()
  } catch (e) {}
  return 'unknown'
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin({
        contextRegExp: /^\.\/locale$/,
        resourceRegExp: /moment$/
      }),
      new webpack.DefinePlugin({
        APP_VERSION: `"${packageJson.version}"`,
        GIT_HASH: JSON.stringify(getGitHash()),
        BUILD_DATE: buildDate
      })
    ]
  },

  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))
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
          'border-radius-base': '4px'
        },

        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: 3000
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

module.exports = vueConfig
