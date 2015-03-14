declare var require;

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var ts          = require('gulp-typescript');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var traceur     = require('gulp-traceur');
var filter      = require('gulp-filter');
var bowerFiles  = require('main-bower-files');

var sassOptions  = {};
var bowerOptions = {};

var tsProject = ts.createProject({
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

var paths = {
  scripts_ts:  'src/assets/scripts/**/*.ts',
  styles_sass: 'src/assets/styles/**/*.{sass, scss}',
  bower:       bowerFiles(bowerOptions)
};

var dest_paths = {
  scripts: 'dist/scripts',
  styles:  'dist/styles',
  bower:   'dist/bower_components'
}

var filter_paths = {
  scripts: 'dist/scripts/**/*.js',
  styles:  'dist/styles/**/*.css',
  bower:   'dist/bower_components/**/*'
}

gulp.task('styles', () => {
  return gulp.src([
    paths.styles_sass
  ])
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest_paths.styles))
    .pipe(filter(filter_paths.styles))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', () => {
  return gulp.src([
    paths.scripts_ts
  ])
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject))
    .pipe(traceur(traceurOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest_paths.scripts))
    .pipe(filter(filter_paths.scripts))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('bower', () => {
  return gulp.src([
    paths.bower
  ])
    .pipe(gulp.dest(dest_paths.bower))
    .pipe(filter(filter_paths.bower))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('serve', ['default'], () => {
  browserSync({
    server: 'dist'
  });

  gulp.watch([
    paths.styles_sass
  ], ['styles']);

  gulp.watch([
    paths.scripts_ts
  ],  ['scripts']);

  gulp.watch([
    paths.bower
  ], ['bower']);
});

gulp.task('default', [
  'bower', 'scripts', 'styles'
]);
