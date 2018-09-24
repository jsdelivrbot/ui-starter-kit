// Global require
"use strict";

var gulp = require('gulp'),
  path = require('path'),
  data = require('gulp-data'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  notify = require("gulp-notify"),
  images = require('gulp-image'),
  clean = require('gulp-clean');

// Directories here
var paths = {
  public: './public/',
  publicExamples: './public/examples/',
  sass: './src/assets/scss/',
  examples: './src/examples/',
  css: './public/assets/css/',
  scripts:  './src/assets/js/**/*.js',
  data: './src/_data/',
  images: [
    './src/assets/images/**/*'
  ],
};


// Clean output directory
gulp.task('clean-html-example', function() {
  return gulp.src(paths.publicExamples + '**/*.html', { read: false })
    .pipe(clean());
});

/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */
gulp.task('pug', function () {
  return gulp.src('./src/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(paths.public));
});
gulp.task('pugExample', ['clean-html-example'], function () {
  return gulp.src('./src/examples/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(paths.publicExamples));
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
gulp.task('sassExample', function () {
  return gulp.src(paths.examples + '**/*.scss')
    .pipe(sass({
      includePaths: [paths.examples],
      outputStyle: 'expanded'
    }))
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest(paths.publicExamples))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Build Script
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
      .pipe(gulp.dest('./public/assets/js/'))
      .pipe(browserSync.reload({
        stream: true
      }));
});
// Build Script Example Folder
gulp.task('scriptsExample', function() {
    return gulp.src(paths.examples + '**/*.js')
      .pipe(gulp.dest(paths.publicExamples))
      .pipe(browserSync.reload({
        stream: true
      }));
});

// Move & compress images
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('./public/assets/images/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
gulp.task('imagesExample', function() {
  return gulp.src(paths.examples + '**/*.{gif,jpg,png,svg}')
    .pipe(gulp.dest(paths.publicExamples))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('copy', function() {
  gulp.src('./src/assets/libs/**/*')
    .pipe(gulp.dest('./public/assets/libs/'))
  gulp.src('./src/examples/**/*.details')
    .pipe(gulp.dest('./public/examples/'));
});


/**
 * Wait for pug and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'sassExample', 'pug', 'pugExample', 'scripts', 'scriptsExample', 'copy', 'images', 'imagesExample'], function () {
  browserSync({
    ui: {
      port: 8888
    },
    server: {
      baseDir: paths.public
    },
    notify: false,
    port: 9999,
  });
});


// compile static assets
gulp.task('statics', ['copy', 'images', 'imagesExample'], function() {

});
/**
 * Recompile .pug files and live reload the browser
 */
gulp.task('rebuild', ['sass', 'sassExample', 'pug', 'pugExample', 'scripts', 'scriptsExample', 'copy', 'images', 'imagesExample'], function () {
  browserSync.reload();
});
/**
 * Watch scss files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(paths.sass + '**/*.scss', ['sass', 'sassExample']);
  gulp.watch(paths.examples + '**/*.scss', ['sassExample', 'sass']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.examples + '**/*.js', ['scriptsExample']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.examples + '**/*.{gif,jpg,png,svg}', ['imagesExample']);
  gulp.watch(paths.statics, ['copy']);
  gulp.watch(paths.examples + '**/*.details', ['copy']);
  gulp.watch('./src/**/*.pug', ['rebuild']);
});

// Build task compile sass and pug.
gulp.task('build', ['sass', 'sassExample', 'pug', 'pugExample', 'scripts', 'scriptsExample']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch', 'pug', 'pugExample','sass', 'sassExample']);
