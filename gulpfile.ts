declare var require;

var gulp        = require('gulp');
var $           = require('gulp-load-plugins');
var browserSync = require('browser-sync');
/*
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var traceur     = require('gulp-traceur');
var ts          = require('gulp-typescript');
*/

var paths = {
  scripts_ts:  'assets/scripts/**/*.ts',
  styles_sass: 'assets/styles/**/*.{sass, scss}'
};

var sassOptions = {};

var tsProject = $.typescript.createProject({
  target: 'ES6',
  module: 'commonjs',
  declarationFiles: false,
  noImplicitAny: false,
  removeComments: false,
  noLib: false,
  sortOutput: true
});

var traceurOptions = {
  modules: 'commonjs'
};

gulp.task('styles', () => {
  return gulp.src([
    paths.styles_sass
  ])
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/styles'))
    .pipe($.filter('**/*.css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', () => {
  return gulp.src([
    paths.scripts_ts
  ])
    .pipe($.sourcemaps.init())
    .pipe($.typescript(tsProject))
    .pipe($.traceur(traceurOptions))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/scripts'))
    .pipe($.filter('**/*.js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('serve', () => {
  browserSync({
    server: 'dist'
  });

  gulp.watch([paths.styles_sass], ['styles']);
  gulp.watch([paths.scripts_ts],  ['scripts']);
});
