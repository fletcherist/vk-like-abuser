import gulp from 'gulp'
import zip from 'gulp-zip'
import clean from 'gulp-clean'
import htmlreplace from 'gulp-html-replace'
import csso from 'gulp-csso'
import rename from 'gulp-rename'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'
import babel from 'gulp-babel'

import postcss from 'gulp-postcss'
import cssVariables from 'postcss-css-variables'
import autoprefixer from 'autoprefixer'


const BUNDLE_PRODUCTION_NAME = 'bundle.min.js'
const JS_ASSETS_PRODUCTION_NAME = 'assets.min.js'

const PATHS = {
  STYLES: 'src/styles',
  JS: `src/**/*.js`
}

gulp.task('default', () => {
  return gulp.watch(['src/**', 'index.html'], gulp.series(
    'clean',
    gulp.parallel('html', 'styles', 'assets', 'js', 'manifest-icon')
  ))
})

gulp.task('clean', () => {
  return gulp.src(`dist/*`)
    .pipe(clean())
})
/*
  Compiling js libraries, such as
  d3, vuejs socketio in one file.
*/
gulp.task('assets', () => {
  return gulp.src(`scripts/*`)
    .pipe(gulp.dest('dist/scripts'))
})

/*
  Compiling javascript sources to bundle
*/
gulp.task('js', () => {
  return gulp.src(PATHS.JS)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/src'))
})

/*
  Compiling & minifying css styles
*/
gulp.task('styles', () => {
  return gulp.src(`${PATHS.STYLES}/*`)
    .pipe(concat('styles.css'))
    .pipe(postcss([cssVariables, autoprefixer]))
    .pipe(csso())
    .pipe(gulp.dest(`dist/${PATHS.STYLES}`))
})

/*
  Moving index.html to dist
  with replacing scripts & styles paths
*/
gulp.task('html', () => {
  return gulp.src('index.html')
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
