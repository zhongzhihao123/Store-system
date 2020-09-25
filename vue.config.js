module.exports = {
  lintOnSave: false,
  //通过chinWebpack来自定义打包入口，可以判断是生产环境还是开发环境，来引入不同的入口文件
  chainWebpack:config => {
    //生产环境
    config.when(process.env.NODE_ENV === 'production',config => {
      config.entry('app').clear().add('./src/main-prod.js')
    })

    //通过externals加载外部CDN资源
    config.set('externals',{
      vue:'Vue',
      'vue-router':'VueRouter',
      axios:'axios',
      lodash:'_',
      echarts:'echarts',
      nprogress:'NProgress',
      'vue-quill-editor':'VueQuillEditor'
    })

    //判断是不是发布环境，追加一个属性然后可以改变页面index.html的结构,如果是发布环境，则追加一个isProd属性
    config.plugin('html').tap(args => {
      args[0].isProd = true
      return args
    })


    //开发环境
    config.when(process.env.NODE_ENV === 'development',config => {
      config.entry('app').clear().add('./src/main-dev.js')

      //判断是不是发布环境，追加一个属性然后可以改变页面index.html的结构,如果是发布环境，则追加一个isProd属性
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}