import gulp from 'gulp'
import zip from 'gulp-zip'
import clean from 'gulp-clean'
import htmlreplace from 'gulp-html-replace'
import csso from 'gulp-csso'
import rename from 'gulp-rename'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'
import babel from 'gulp-babel'

const STYLES_DEV_NAME = 'styles.css'

const STYLES_PRODUCTION_NAME = 'styles.min.css'
const BUNDLE_PRODUCTION_NAME = 'bundle.min.js'
const JS_ASSETS_PRODUCTION_NAME = 'assets.min.js'

gulp.task('default', () => {

})

gulp.task('clean', () => {
  return gulp.src(`dist`)
    .pipe(clean())
})
/*
  Compiling js libraries, such as
  d3, vuejs socketio in one file.
*/
gulp.task('assets', () => {
  return gulp.src(`scripts/*`)
    .pipe(concat(JS_ASSETS_PRODUCTION_NAME))
    .pipe(gulp.dest('dist'))
})

/*
  Compiling javascript sources to bundle
*/
gulp.task('js', () => {
  return gulp.src(`src/**/*.js`)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(concat(BUNDLE_PRODUCTION_NAME))
    .pipe(gulp.dest('dist'))
})

/*
  Compiling & minifying css styles
*/
gulp.task('styles', () => {
  return gulp.src(`src/${STYLES_DEV_NAME}`)
    .pipe(csso())
    .pipe(rename(STYLES_PRODUCTION_NAME))
    .pipe(gulp.dest('dist'))
})

/*
  Moving index.html to dist
  with replacing scripts & styles paths
*/
gulp.task('html', () => {
  return gulp.src('index.html')
    .pipe(htmlreplace({
      'css': STYLES_PRODUCTION_NAME,
      'assets': JS_ASSETS_PRODUCTION_NAME,
      'js': BUNDLE_PRODUCTION_NAME
    }))
    .pipe(gulp.dest('dist'))
})

/*
  Zip dist folder
*/
gulp.task('zip', () => {
  return gulp.src('dist/*')
    .pipe(zip('test.zip'))
})

gulp.task('manifest-icon', () => {
  return gulp.src(['icon.png', 'manifest.json'])
    .pipe(gulp.dest('dist'))
})

gulp.task('deploy', gulp.series(
  'clean',
  gulp.parallel('html', 'styles', 'assets', 'js', 'manifest-icon'),
   'zip'
))
