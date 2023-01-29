import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import csso from 'postcss-csso';
import del from 'del';
import squoosh from 'gulp-libsquoosh';

//HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// java script

const sctipts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
}

// Images

export const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

export const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
}

// svg

const svg = () => {
  return gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'))
}

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore({ inlineSvg: true}))
    .pipe(gulp.dest('build/img'))
}

// Copy

export const copy = (done) => {
  gulp.src([
    // 'source/fonts/**/*.{woff,woff2}',
    'source/fonts/**',
    'source/*ico',
    './*.webmanifest'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done()
}

// Styles

const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Clean

const clean = () => {
  return del('build')
}

const cleanCssMap = () => {
  return del('build/css/style.css.map')
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

gulp.task('build', gulp.series(clean, copy, gulp.parallel(styles, svg, sprite, sctipts, optimizeImages, html), cleanCssMap))

// export const build = gulp.series(
//   clean,
//   copy,
//   gulp.parallel(
//     styles,
//     svg,
//     sprite,
//     sctipts,
//     optimizeImages,
//     html
//   ),
//   gulp.series(
//     cleanCssMap,
//   )
// )

export default gulp.series(
  clean,
  copy,
  gulp.parallel(
    styles,
    svg,
    sprite,
    sctipts,
    copyImages,
    html
  ),
  server,
  watcher
);
