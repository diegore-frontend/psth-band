// Plugins

// Install comands:
// npm install --save-dev gulp
// npm install --save-dev gulp-concat
// npm install --save-dev gulp-livereload
// npm install --save-dev gulp-server-livereload
// npm install --save-dev gulp-notify
// npm install --save-dev gulp-stylus
// npm install --save-dev gulp-uglify
// npm install --save-dev nib

var gulp          = require('gulp');

	// Notifications
	header          = require('gulp-header'),
	notify          = require('gulp-notify'),
	pkg             = require('./package.json'),

	// Html
	nunjucksRender  = require('gulp-nunjucks-render'),

	// Stylesheets
	stylus          = require('gulp-stylus'),
	rupture         = require('rupture'),
	nib             = require('nib'),

	// Help
	plumber					= require('gulp-plumber'),

	// Server
	server          = require('gulp-server-livereload'),

	// Watching files
	livereload      = require('gulp-livereload');

	// Scripts
	uglify          = require('gulp-uglify'),
	concat          = require('gulp-concat'),

	// Settings
	filename        = 'psth-master',
	headerName			= ' Phoenix Survive the Hurricane - Croudfounding 2018';

// Default Task with Stylus
gulp.task('default', function() {
	gulp.start('nunjucks','stylus','scripts','watch','webserver');
});

function fileHeader(title) {
	return [
		'/*!',
		 title + ' - ' + pkg.version,
		 ' Copyright © 2016 - ' + new Date().getFullYear() + ' IA Interactive Team',
		 ' Desarrollado en IA Interactive',
		 ' http://ia.com.mx/',
		'*/\n'
	].join('\n')
}


const PATHS = {
	output: '',
	templates: 'Preprocess/nunjucks-templates/templates',
	pages: 'Preprocess/nunjucks-templates/pages',
	stylPath: 'Preprocess/stylus/',
}

// Partial HTML compiling actions
gulp.task('nunjucks', function() {
	return gulp.src(PATHS.pages + '/*.+(html)')
	.pipe(plumber())
	.pipe(nunjucksRender({
		path: [PATHS.templates],
		watch: true,
	}))
	.pipe(gulp.dest(PATHS.output));
});

// Stylesheets Compiling actions
gulp.task('stylus', function () {
	return gulp.src(PATHS.stylPath + filename + '.styl')
	.pipe(plumber())
	.pipe(stylus({
		use: [
			nib(),
			rupture()
		],
		compress: true
	}))
	.pipe(header(fileHeader(headerName)))
	.pipe(gulp.dest('Content/css/'))
	.pipe(notify({ message: 'CSS compiled! 🍻🍻' }));
});

// Stylesheets Compiling actions
gulp.task('skin-id', function () {
	return gulp.src(PATHS.stylPath + '/skins/skin.id.styl')
	.pipe(plumber())
	.pipe(stylus({
		use: [
			nib(),
			rupture()
		],
		compress: true
	}))
	.pipe(header(fileHeader('Skin ID -' + headerName)))
	.pipe(gulp.dest('Content/css/'))
	.pipe(notify({ message: 'CSS compiled! 🍻🍻' }));
});

// Specific Scripts Concatenating
gulp.task('scripts', function() {
	return gulp.src(['Preprocess/scripts/vendors/*.js','Preprocess/scripts/*.js'])
	.pipe(plumber())
	.pipe(concat('jquery.vendors.js'))
	.pipe(notify({ message: 'Javascript concatenated! 🍻🍻' }))
	.pipe(header(fileHeader(headerName + '- Vendors')))
	.pipe(uglify({
		preserveComments: 'some'
	}))
	.pipe(gulp.dest('Scripts/'));
});

// Server Connection
gulp.task('webserver', function() {
	gulp.src('')
	.pipe(plumber())
	.pipe(server({
		host: '0.0.0.0',
		livereload: true,
		directoryListing: false,
		open: true,
		port: 8080
	}))
	.pipe(notify({ message: 'Server running! 🍻🍻' }));
});

// Watching Files Stylus
gulp.task('watch', function() {
	// Stylus
	gulp.watch('Preprocess/stylus/**/*.styl', ['stylus']);
	// Scripts
	gulp.watch('Preprocess/scripts/**/*.js', ['scripts']);
	// Nunjucks
	gulp.watch([PATHS.pages + '/**/*.+(html|js|css)', PATHS.templates + '/**/*.+(html|js|css)'], ['nunjucks'])
});
