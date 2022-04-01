// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-scss-preprocessor')
    ],
    files: [
      {
        pattern: 'src/styles/styles.scss',
        watched: true,
        included: false,
        served: true
      },
      
    ],
    preprocessors: {
      'src/styles/styles.scss': ['scss']
    },
    sassPreprocessor: {
      source: 'src/styles/styles.scss',
      createSourceMaps: true,
      outputDir:  __dirname + '/test/',
      outputFile: 'styles.css'
    }   ,
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/cocacola-andina'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
