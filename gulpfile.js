/**
 * Project Name: ha-cunkute
 * Description: Home Assistant with WebSocket by Keite Tran
 * Creator: Tran Ngoc Anh - VietVbb Team (Keite)
 * Email: mr.ngocanhtran.com@gmail.com
 * HomePage: https://facebook.com/mr.ngocanhtran
 */

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const gulpIf = require('gulp-if');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const fileinclude = require('gulp-file-include');
const del = require('del');
const useref = require('gulp-useref');
const htmlmin = require('gulp-htmlmin');
const headerComment = require('gulp-header-comment');

// Copy required plugin file
gulp.task('copy-required-file', ['images', 'javascript'], function () {
	// Copying CSS to /dist
	gulp.src([
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/weathericons/css/weather-icons.min.css',
			'node_modules/toastr/build/toastr.min.css',
			'node_modules/sweetalert2/dist/sweetalert2.min.css',
		]).pipe(concat('./plugin.min.css'))
		.pipe(gulp.dest("dist/assets/css"));

	// CSS map file
	gulp.src([
		'node_modules/bootstrap/dist/css/bootstrap.min.css.map',
	]).pipe(gulp.dest("dist/assets/css/"));

	// Copying Fonts to /dist
	gulp.src([
		'node_modules/weathericons/font/*'
	]).pipe(gulp.dest("dist/assets/font"));

	// Copying javascript to /dist
	gulp.src([
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/popper.js/dist/umd/popper.min.js',
			'node_modules/bootstrap/dist/js/bootstrap.min.js',
			'node_modules/feather-icons/dist/feather.min.js',
			'node_modules/toastr/build/toastr.min.js',
			'node_modules/chart.js/dist/Chart.min.js',
			'node_modules/js-cookie/src/js.cookie.js',
			'node_modules/chartjs-plugin-annotation/chartjs-plugin-annotation.min.js',
			'node_modules/sweetalert2/dist/sweetalert2.min.js',
			'node_modules/crypto-js/crypto-js.js',
			'src/plugins/pulltorefresh.js',
			'src/plugins/jquery.sparkline.min.js'
		]).pipe(uglify()).pipe(concat('./plugin.min.js'))
		.pipe(gulp.dest("dist/assets/js"));
});

// Compile SCSS into CSS
gulp.task('scss', function () {
	return gulp.src(['src/scss/**/*.scss'])
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 5 version']
			})
		])).pipe(cssnano())
		.pipe(concat('./all.min.css'))
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(browserSync.stream());
});

// Copying javascript to /dist
gulp.task('javascript', function () {
	return gulp.src('src/js/**/*')
		.pipe(uglify())
		.pipe(concat('./core.min.js'))
		.pipe(gulp.dest("dist/assets/js"));
});

// Copying images to /dist
gulp.task('images', function () {
	// Images file
	gulp.src(['src/img/*.png']).pipe(gulp.dest("./dist/assets/img/"));

	// Icons file
	gulp.src(['src/icons/*']).pipe(gulp.dest("./dist/"));

	// SVG file
	gulp.src(['src/svg/*']).pipe(gulp.dest("./dist/assets/svg/"));
});

// Compile Html file to /dist
gulp.task('html', function () {
	return gulp.src(['src/*.html'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		})).pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream());
});

// Clean /dist folder
gulp.task('clean', function () {
	return del.sync('dist');
});

// Static Server + watching scss/html/assets
gulp.task('default', function (callback) {
	// Run task
	runSequence('copy-required-file', 'scss', 'html', callback);

	// Init server 
	browserSync.init({
		server: ["./dist"],
		files: ["./dist/assets/**/*"]
	});

	// watch file state change
	gulp.watch(['src/scss/*'], ['scss']);
	gulp.watch(['src/img/**/*'], ['images']);
	gulp.watch(['src/js/**/*'], ['javascript']);
	gulp.watch(['src/*.html', 'src/views/**/*.html'], ['html']);

	// Push event reload to browser
	gulp.on('change', browserSync.reload);
});

// Build project
gulp.task('build', function () {
	runSequence('clean', ['copy-required-file', 'scss', 'html'], 'comments');
});


// Add header file comment
gulp.task('comments', function () {
	var headerCommentTemp = `
		Project Name: <%= pkg.name %>
		Description: <%= pkg.description %>
		Creator: <%= pkg.author %> - VietVbb Team (Keite)
		Email: <%= pkg.email %>
		HomePage: <%= pkg.homepage %>
	`;
	gulp.src('dist/**/*')
		.pipe(gulpIf('*.js', headerComment(headerCommentTemp)))
		.pipe(gulpIf('*.css', headerComment(headerCommentTemp)))
		.pipe(gulpIf('*.html', headerComment(headerCommentTemp)))
		.pipe(gulp.dest('dist/'));
});