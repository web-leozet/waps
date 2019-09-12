var syntax = 'sass',
	gulpversion = '3' // Syntax: sass or scss;

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cleancss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	notify = require("gulp-notify"),
	imagemin = require("gulp-imagemin"),
	imageminJR = require("imagemin-jpeg-recompress"),
	imageminSvgo = require("imagemin-svgo"),
	pngquant = require("imagemin-pngquant"),
	del = require("del"),
	cache = require("gulp-cache"),
	rsync = require('gulp-rsync'),
	smartgrid = require('smart-grid');


gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('app/' + syntax + '/**/*.' + syntax + '')
		.pipe(sourcemaps.init()) //Sourcemaps - карта стилей
		.pipe(sass({
			outputStyle: 'expanded'
		}).on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
		// .pipe(cleancss({
		// 	level: {
		// 		1: {
		// 			specialComments: 0
		// 		}
		// 	}
		// })) // Opt., comment out when debugging // минимизация css
		.pipe(sourcemaps.write('.')) //Sourcemaps - карта стилей
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream())
});

gulp.task('js', function() {
	return gulp.src([
			'app/libs/jquery/dist/jquery.min.js',
			'app/libs/bootstrap/dist/js/bootstrap.min.js',
			'app/libs/bootstrapvalidator/dist/js/bootstrapValidator.min.js',
			'app/js/common.js', // Always at the end
		])
		.pipe(concat('scripts.min.js'))
		// .pipe(uglify()) // Mifify js (opt.)
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('rsync', function() {
	return gulp.src('app/**')
		.pipe(rsync({
			root: 'app/',
			hostname: 'username@yousite.com',
			destination: 'yousite/public_html/',
			// include: ['*.htaccess'], // Includes files to deploy
			exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
});

gulp.task("img", function() {
	gulp.src("app/img/**/*")
		.pipe(imagemin([
			imageminJR({
				method: "ms-ssim"
			}),
			pngquant({
				progressive: true,
				svgoPlugins: [{
					removeViewBox: false
				}],
				use: [pngquant()],
				interlaced: true
			}),
			imageminSvgo({
				plugins: [{
					removeViewBox: false
				}]
			})
		]))
		.pipe(gulp.dest("./dist/img"))
});



gulp.task("clean", function() {
	return del.sync("dist");
});

gulp.task("clean", function() {
	return cache.clearAll();
});


gulp.task("build", ["clean", "img", "styles", "js"], function() {

	var buildCss = gulp.src([
			"app/css/main.min.css",
		])
		.pipe(gulp.dest("dist/css"));


	var buildJs = gulp.src("app/js/scripts.min.js")
		.pipe(gulp.dest("dist/js"));


	var buildFonts = gulp.src("app/fonts/**/*")
		.pipe(gulp.dest("dist/fonts"));


	var buildHtml = gulp.src("app/*.html")
		.pipe(gulp.dest("dist"));

});


if (gulpversion == 3) {
	gulp.task('watch', ['styles', 'js', 'browser-sync'], function() {
		gulp.watch('app/' + syntax + '/**/*.' + syntax + '', ['styles']);
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
		gulp.watch('app/*.html', browserSync.reload)
	});
	gulp.task('default', ['watch']);
}

if (gulpversion == 4) {
	gulp.task('watch', function() {
		gulp.watch('app/' + syntax + '/**/*.' + syntax + '', gulp.parallel('styles'));
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('js'));
		gulp.watch('app/*.html', browserSync.reload)
	});

	gulp.task('default', gulp.parallel('watch', 'styles', 'js', 'browser-sync'));
}