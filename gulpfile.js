/*global require*/
"use strict";

var gulp = require('gulp'),
  path = require('path'),
  data = require('gulp-data'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  notify = require("gulp-notify"),
  images = require('gulp-image');

/*
 * Directories here
 */
var paths = {
  public: './public/',
  sass: './src/assets/sass/',
  css: './public/assets/css/',
  scripts:  './src/assets/js/**/*.js',
  data: './src/_data/',
  images: [
        './src/assets/images/**/*'
  ],
};

/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */
gulp.task('pug', function () {
  return gulp.src('./src/*.pug')
    .pipe(data(function (file) {
      return require(paths.data + path.basename(file.path) + '.json');
    }))
    .pipe(pug({
      pretty: true
    }))
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(paths.public));
});



/**
 * Wait for pug and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'pug', 'scripts','copy', 'images'], function () {
  browserSync({
    server: {
      baseDir: paths.public
    },
    notify: false,
    port: 9999,
  });
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
  return gulp.src(paths.sass + '*.scss')
    .pipe(sass({
      includePaths: [paths.sass],
      outputStyle: 'expanded'
    }))
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});
/**
 * Build Script
 *
 */
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(gulp.dest('./public/assets/js/'))
        .pipe(notify({ message: 'scripts built' }))
        .pipe(browserSync.reload({
          stream: true
        }));;
});
// move & compress images
gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('./public/assets/images/'))
        .pipe(notify({ message: 'images built'}))
        .pipe(browserSync.reload({
          stream: true
        }));;
});

gulp.task('copy', function() {
  gulp.src(['./src/assets/libs/**/*'])
        .pipe(gulp.dest('./public/assets/libs/'))
    gulp.src(['./src/assets/fonts/**/*'])
        .pipe(gulp.dest('./public/assets/fonts/'))
        .pipe(browserSync.reload({
          stream: true
        }));
});

// compile static assets
gulp.task('statics', ['copy', 'images'], function() {

});
/**
 * Recompile .pug files and live reload the browser
 */
gulp.task('rebuild', ['sass', 'pug', 'scripts','copy', 'images'], function () {
  browserSync.reload();
});
/**
 * Watch scss files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(paths.sass + '**/*.scss', ['sass']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.statics, ['copy']);
  gulp.watch('./src/**/*.pug', ['rebuild']);
});

// Build task compile sass and pug.
gulp.task('build', ['sass', 'pug', 'scripts']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch', 'pug','sass']);
