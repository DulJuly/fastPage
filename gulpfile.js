/**
 * Created by Leevare on 2018/8/21 13:59
 */
const gulp = require('gulp'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  cleanCss = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  jshint = require('gulp-jshint'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  pump = require('pump'),
  rename = require('gulp-rename'),
  webserver = require('gulp-webserver'),
  clean = require('gulp-clean'),
  errorNotifier = require('gulp-error-notifier')

gulp.task('serve', function () {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      open: true,
      directoryListing: false
    }))
})

gulp.task('templates', function () {
  const src = './src/templates/*.jade',
    dist = './dist'

  gulp.src(src)
    .pipe(errorNotifier())
    .pipe(jade())
    .pipe(gulp.dest(dist))
})

gulp.task('style', function () {
  const src = './src/scss/*.scss',
    dist = './dist/css/'

  gulp.src(src)
    .pipe(errorNotifier())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(gulp.dest(dist))

})

gulp.task('script', function () {
  const src = './src/js/*.js',
    dist = './dist/js/'

  gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist))
})

gulp.task('compress', function (cb) {
  const src = './src/js/*.js',
    dist = './dist/js/'

  pump([
    gulp.src(src),
    babel(),
    concat('main.js'),
    rename({ suffix: '.min' }),
    uglify(),
    gulp.dest(dist)
  ], cb)
})

gulp.task('clean', function () {
  const target = './dist/*'

  gulp.src(target, { read: false })
    .pipe(clean())
})

gulp.task('build', ['templates', 'style', 'compress'])

gulp.task('watch', function () {
  gulp.watch('./src/templates/*.jade', ['templates'])
  gulp.watch('./src/scss/*.scss', ['style'])
  gulp.watch('./src/js/*.js', ['script'])
})

gulp.task('default', function () {
  gulp.start('templates', 'style', 'script', 'serve', 'watch')
})