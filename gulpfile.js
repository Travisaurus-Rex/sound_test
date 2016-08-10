var gulp   = require('gulp'),
	gutil  = require('gulp-util'),
	sass   = require('gulp-sass'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	pump   = require('pump');

var browserSync = require('browser-sync');

var input  = './app/styles/**/*.scss',
	output = './public/css';

gulp.task('compress', function(cb) {
	pump([
			gulp.src('app/scripts/*.js'),
			uglify(),
			gulp.dest('dist')
		],
		cb
	);
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: './'
		},
	})
});

gulp.task('watch', ['browserSync'], function() {
	gulp.watch(input, ['sass']);
});

gulp.task('sass', function() {
	return gulp
	// find all .scss files from stylesheets folder
	.src(input)
	// run sass on those files
	.pipe(sass())
	// write the resulting css in the output folder
	.pipe(gulp.dest(output))
	// restart the browser
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('lint', function() {
	return gulp.src('./app/scripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('default', function() {
	gutil.log('Gulp is running.');
});