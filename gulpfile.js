//************* */ Initialize modules*****************
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require("gulp");
// Importing all the Gulp-related packages we want to use
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
let rename = require("gulp-rename");
let uglify = require("gulp-uglify-es").default;
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const replace = require("gulp-replace");
const browserSync = require("browser-sync").create();

// File paths
const files = {
  scssPath: "./src/scss/**/*.scss",
  jsPath: "./src/js/**/*.js",
  htmlPath: "./dist/*.html"
};

// Sass task: compiles the style.scss file into style.css
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(sourcemaps.write(".")) // write sourcemaps file in current directory
    .pipe(dest("dist/css")); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return src([
    files.jsPath
    //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
  ])
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(concat("index-min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write()) // write sourcemaps file in current directory
    .pipe(dest("dist/js"));
}

// Cachebust
// caches the css and js sources
function cacheBustTask() {
  var cbString = new Date().getTime();
  return src([files.htmlPath])
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("./dist"));
}

// Watch task: init browser-sync, watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
    // browser: ["C:Program Files (x86)/Google/Chrome Dev/Application/chrome.exe"]
  });
  watch(
    [files.scssPath, files.jsPath],
    { interval: 1000, usePolling: true }, //Makes docker work
    series(parallel(scssTask, jsTask), cacheBustTask)
  );
  watch([files.scssPath, files.jsPath, files.htmlPath]).on(
    "change",
    browserSync.reload
  );
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(parallel(scssTask, jsTask), cacheBustTask, watchTask);
