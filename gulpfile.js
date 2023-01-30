import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import csso from 'postcss-csso';
import {deleteAsync} from 'del';
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import optipng from 'imagemin-optipng';
import { buffer } from 'stream/consumers';
import pngquant from 'imagemin-pngquant';
import convWebp from 'gulp-webp';

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

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(imagemin([
      mozjpeg({quality: 75}),
      optipng({optimizationLevel: 2, buffer}),
      pngquant({speed: 10})
    ]))
    .pipe(gulp.dest('build/img'))
}

const webp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(convWebp())
    .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
}

// svg

const svg = () => {
  return gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
    .pipe(svgmin())
    .pipe(gulp.dest('build/img'))
}

// export const sprite = () => {
//   return gulp.src('source/img/icons/*.svg')
//     .pipe(svgmin())
//     .pipe(svgstore())
//     .pipe(gulp.dest('build/img'))
// }

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(gulp.dest('build/img'));
}

// Copy

const copy = (done) => {
  gulp.src([
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
  return deleteAsync('./build')
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload()
  done()
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('sourse/js/*.js', gulp.series(sctipts))
  gulp.watch('source/*.html').on(html, reload);
}

// gulp.task('build', gulp.series(clean, copy, gulp.parallel(styles, svg, sprite, sctipts, html), cleanCssMap))

export const build = gulp.series(
  clean,
  copy,
  gulp.parallel(
    styles,
    svg,
    sprite,
    sctipts,
    optimizeImages,
    webp,
    html
  )
)

export default gulp.series(
  clean,
  copy,
  gulp.parallel(
    styles,
    svg,
    sprite,
    sctipts,
    copyImages,
    webp,
    html
  ),
  server,
  watcher
);
