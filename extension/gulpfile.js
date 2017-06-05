const gulp = require('gulp')
const zip = require('gulp-zip')
const clean = require('gulp-clean')
const htmlreplace = require('gulp-html-replace')
const csso = require('gulp-csso')
const rename = require('gulp-rename')

const STYLES_PRODUCTION_NAME = 'styles.min.css'
const BUNDLE_PRODUCTION_NAME = 'bundle.min.js'
const JS_ASSETS_PRODUCTION_NAME = 'assets.min.js'

gulp.task('default', () => {
  gulp.src('dist/*')
    .pipe(clean())
    .pipe(zip('test.zip'))
    // .pipe(gulp.dest('/'))

  /*
    Moving index.html to dist
    with replacing scripts & styles paths
  */
  gulp.src('index.html')
    .pipe(htmlreplace({
      'css': STYLES_PRODUCTION_NAME,
      'assets': 'js/assets.min.js',
      'js': 'js/bundle.min.js'
    }))
    .pipe(gulp.dest('dist'))

  gulp.src('src/styles.css')
    .pipe(csso())
    .pipe(rename(STYLES_PRODUCTION_NAME))
    .pipe(gulp.dest('dist'))
})
