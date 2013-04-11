basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/lib/angular/angular.js',
  'app/lib/angular/angular-*.js',
  'test/lib/angular/angular-mocks.js',
  'app/js/**/jquery.min.js',
  'app/js/**/defaults.js',
  'app/js/**/*.js',
  'test/unit/**/*.js'
];

frameworks = ["jasmine"];

exclude = [
  'app/js/bootstrap.min.js',
];

reporters = ['dots', 'coverage'];
preprocessors = {
  '**/app*.js': 'coverage',
};

autoWatch = true;

browsers = ['Chrome'];
