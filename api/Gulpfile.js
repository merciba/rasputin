'use strict'

const gulp = require('gulp')
let plugins = require('gulp-load-plugins')()
const nodemon = require('gulp-nodemon')
const apidoc = require('gulp-apidoc')
const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'

const vendorJS = [
	'./bower_components/angular/angular.js',
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/lodash/lodash.js',
    './bower_components/bootstrap/dist/js/bootstrap.js',
    './bower_components/toastr/toastr.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js',
    './bower_components/angular-messages/angular-messages.js',
    './bower_components/oboe/dist/oboe-browser.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    './bower_components/angular-oboe/dist/angular-oboe.min.js',
    './bower_components/angular-local-storage/dist/angular-local-storage.min.js',
    './bower_components/angular-animate/angular-animate.min.js',
    './bower_components/toastr/toastr.min.js',
    './bower_components/lodash/lodash.js'
]

const vendorCSS = [
	'./bower_components/bootstrap/dist/css/bootstrap.css',
    './bower_components/toastr/toastr.css',
    './bower_components/bootstrap-select/dist/css/bootstrap-select.min.css',
    './bower_components/toastr/toastr.min.css'
]

gulp.task('compile: rasputin.js', function () {
    return gulp.src([
    	'./src/browser/index.js',
        './src/browser/**/**/*.js'
    ])
        .pipe(plugins.plumber())
        .pipe(plugins.jshint())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify({mangle: false}))
        .pipe(plugins.concat('rasputin.js'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('./public'));
})

gulp.task('compile: vendor.js', function () {
    return gulp.src(vendorJS)
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('vendor.js'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('./public'));
})

gulp.task('compile: rasputin.css', function () {
    return gulp.src('./src/browser/scss/rasputin.scss')
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('./public'));
})

gulp.task('compile: vendor.css', function () {
    return gulp.src(vendorCSS)
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('vendor.css'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('./public'));
})

gulp.task('compile: templates.js', function () {
    return gulp.src('./src/browser/**/**/*.html')
        .pipe(plugins.plumber())
        .pipe(plugins.jshint())
        .pipe(plugins.angularTemplatecache('templates.js', { module: 'rasputin.templates', standalone: true}))
        .pipe(gulp.dest('./public'));
})

gulp.task('compile: index.html', function () {
    return gulp.src('./src/browser/index.html')
        .pipe(plugins.plumber())
        .pipe(gulp.dest('./public'));
})

gulp.task('copy: assets', function () {
    return gulp.src('./src/browser/**/**/*.*')
        .pipe(plugins.plumber())
        .pipe(gulp.dest('./public'));
})

gulp.task('apidoc', function(done) {
	apidoc({
		src: "src/",
		dest: "docs/"
	}, done)
})

gulp.task('build', [
	'compile: rasputin.js', 
	'compile: vendor.js', 
	'compile: rasputin.css',
	'compile: vendor.css',
	'compile: templates.js',
	'compile: index.html',
	'copy: assets',
	'apidoc'
]) 

gulp.task('development', function () {
	nodemon({
		script: 'src/index.js',
		ext: 'js scss html',
		env: { 'NODE_ENV': 'development' },
		ignore: ['node_modules/', 'public/']
	})
	.on('start', ['build'])
	.on('change', ['build'])
})

gulp.task('default', [environment])