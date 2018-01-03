var gulp = require('gulp');
var babel = require('gulp-babel');
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver');
var app = require('./app/app.js');


var stream = gulp.src('./app').pipe(webserver());


gulp.task("default", function() {
    gutil.log('Default')
})

gulp.task("babel", function() {
    return gulp.src("app/src/*.*")
        .pipe(babel())
        .pipe(gulp.dest("./dist/"));
})

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('./app/src/**', ['babel']);
});

gulp.task('webserver', function() {
    gulp.src('./app')
        .pipe(webserver({
            host: 'localhost',
            port: '8080',
            livereload: true,
            open: true
        }))
});

gulp.task('default', [ 'webserver', 'watch'])