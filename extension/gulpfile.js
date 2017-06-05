const gulp = require('gulp')
const zip = require('gulp-zip')
const clean = require('gulp-clean')

gulp.task('default', () => {
  gulp.src('dist/*')
    .pipe(zip('test.zip'))
    .pipe(gulp.dest('dist'))
})
