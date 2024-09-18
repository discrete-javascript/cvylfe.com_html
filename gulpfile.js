const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const del = require('del');
const connect = require('gulp-connect');
const htmlReplace = require('gulp-html-replace');

// Paths
const paths = {
  src: {
    js: 'src/**/*.js',
    css: 'src/**/*.css',
    html: 'src/**/*.html',
  },
  dist: {
    base: 'dist/',
    js: 'dist/js',
    css: 'dist/css',
    html: 'dist/',
  },
};

// Clean the dist directory
gulp.task('clean', () => {
  return del([paths.dist.base]);
});

// Minify and obfuscate JavaScript, create source maps
gulp.task('scripts', () => {
  return gulp
    .src(paths.src.js)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(connect.reload());
});

// Minify CSS, create source maps
gulp.task('styles', () => {
  return gulp
    .src(paths.src.css)
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(connect.reload());
});

// Update HTML to use minified files
gulp.task('html', () => {
  return gulp
    .src(paths.src.html)
    .pipe(
      htmlReplace({
        css: 'css/style.min.css', // Assuming you have a single CSS file; modify as needed
        js: 'js/script.min.js', // Modify for your JS file structure
      })
    )
    .pipe(gulp.dest(paths.dist.html))
    .pipe(connect.reload());
});

// Start a local server
gulp.task('serve', () => {
  connect.server({
    root: paths.dist.base,
    livereload: true,
    port: 8080, // Port for local server
  });
});

// Watch for changes in source files
gulp.task('watch', () => {
  gulp.watch(paths.src.js, gulp.series('scripts'));
  gulp.watch(paths.src.css, gulp.series('styles'));
  gulp.watch(paths.src.html, gulp.series('html'));
});

// Build task to clean and rebuild everything
gulp.task(
  'build',
  gulp.series('clean', gulp.parallel('scripts', 'styles', 'html'))
);

// Default task to build and serve
gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
