module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],

    files: [
      '../dist/moon-router.js',
      '../node_modules/moonjs/dist/moon.min.js',
      '../node_modules/chai/chai.js',
      './core/util.js',
      './core/instance/*.js',
      './core/route/*.js'
    ],

    exclude: [
    ],

    reporters: ['spec'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['PhantomJS'],

    singleRun: true,

    concurrency: Infinity
  })
}
