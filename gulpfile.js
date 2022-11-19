const gulp          = require('gulp');
const plumber       = require('gulp-plumber');
const rename        = require('gulp-rename');
const autoPrefixer  = require('gulp-autoprefixer');
const concat        = require('gulp-concat');
const sass          = require('gulp-sass')(require('sass'));
const ejs           = require('gulp-ejs');
const browserSync   = require('browser-sync');
const sassGlob      = require('gulp-sass-glob-use-forward');
const beautify      = require('gulp-beautify');
const changed       = require('gulp-changed');
const imagemin      = require('gulp-imagemin');
const fs            = require('fs');
const csv2json      = require('gulp-csv2json');
const gulpStylelint = require('gulp-stylelint');
const webp          = require('gulp-webp');
//const named         = require('vinyl-named');
const tap           = require('gulp-tap');
const path          = require("path");

const mockDirectory = "_pub";
//const wpDirectory   = "app/public/wp-content/themes/jfn"


//----------------------------------
//
// sassコンパイル
//
//----------------------------------
gulp.task('sassLint',() => {
  return gulp.src(['_src/scss/**/*.scss','!_src/scss/main.scss'],{ base: '_src' })
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted);
        this.emit('end');
      }
    }))
    .pipe(gulpStylelint({
      //reporters: [
      //  {formatter: 'verbose', console: true}
      //],
      fix: true
    }))
    .pipe(gulp.dest('_src'));
});

gulp.task('sassCompile',() => {
  return gulp.src(['_src/scss/**/*.scss'])
    .pipe(sassGlob())
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted);
        this.emit('end');
      }
    }))
    .pipe(sass.sync({
      includePaths: ['node_modules', 'assets/sass'],
      outputStyle: 'expanded'
    }))
    .pipe(autoPrefixer({
      grid: "autoplace",
      cascade: false
    }))
    .pipe(beautify.css({
      indent_size: 2,
      end_with_newline: false,
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(mockDirectory))
    .pipe(browserSync.stream());
});

gulp.task('sass', gulp.series('sassLint', 'sassCompile'));


//----------------------------------
//
// csv -> json
//
//----------------------------------
gulp.task('json', () => {
  return gulp.src('_src/data/**/*.csv')
  .pipe(csv2json())
  .pipe(rename({extname: '.json'}))
  .pipe(gulp.dest('_src/data/'))
});


//----------------------------------
//
// パリピのファイルリスト取得
//
//----------------------------------

let otherPhoto = [];

gulp.task("otherpath", function() {
  otherPhoto.length = 0; //配列を初期化する
  return gulp.src(["_src/images/**/day*_other_thumb/*"])
  .pipe(tap(function (file,t) {
    otherPhoto.push(path.parse(file.path));
  }))
});


//----------------------------------
//
// ejsコンパイル
//
//----------------------------------
gulp.task('ejsFunc', (done) => {
  const json   = JSON.parse(fs.readFileSync("_src/data/data.json"));
  //const artist = JSON.parse(fs.readFileSync("_src/data/artist.json"));

  return gulp.src(['_src/ejs/**/*.ejs','!' + '_src/ejs/**/_*.ejs'])
  .pipe(plumber({
    errorHandler: function (err) {
      console.log(err);
      this.emit('end');
    }
  }))
  .pipe(ejs({
    data: json,
    //dataArtist: artist,
    dataOther: otherPhoto
  }))
  .pipe(rename({ extname: '.html' }))
  .pipe(beautify.html({
    indent_size: 2,
    preserve_newlines: true,
    max_preserve_newlines: 0,
    end_with_newline: false,
    unformatted: 'svg,script,head'
  }))
  .pipe(gulp.dest(mockDirectory))
  .pipe(browserSync.stream());
});


gulp.task('ejsArtist', (done) => {
  const json = JSON.parse(fs.readFileSync("_src/data/artist.json")); // JSONの読み込み

  for (var key in json) {
    gulp.src("./_src/ejs/_artist-template.ejs")
      .pipe(ejs({
        data: json[key], //ファイル量産の時に使う
        jsonArtist: json[key].file //ファイル内のループに使う
      }))
      .pipe(rename(json[key].stage + json[key].order + '.html'))
      .pipe(gulp.dest(mockDirectory + "/artist/"));
  }
  done();
});


//gulp.task('ejs', gulp.series('json', 'otherpath', 'ejsFunc', 'ejsArtist'));
gulp.task('ejs', gulp.series('json', 'otherpath', 'ejsFunc'));


//----------------------------------
//
// 画像圧縮＆Webp化
//
//----------------------------------
gulp.task( 'imagemin',(done) => {
  gulp.src(['_src/images/**/*.+(jpg|jpeg|png|gif|svg|ico)'])
    .pipe(changed(mockDirectory + '/images/'))
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {
            cleanupIDs: false, //svgのIDを削除しない
            removeViewBox: false, //viewBox属性を削除しない（widthとheight属性がある場合）
            collapseGroups: false //重複や不要な<g>タグを削除しない
          }
        ]
      })
    ]))
    .pipe(gulp.dest(mockDirectory + '/images/'));
  gulp.src(['_src/images/**/*.+(jpg|jpeg|png)'])
    .pipe(rename(function (path) {
      path.basename += path.extname;
    }))
    .pipe(webp())
    .pipe(gulp.dest(mockDirectory + '/images/'));
  done();
});







//----------------------------------
//
// ファイルを各所にコピー
//
//----------------------------------
gulp.task('copy', (done) => {
  gulp.src(['_src/js/*.js'],{ base: '_src' })
    .pipe(gulp.dest(mockDirectory));
  gulp.src(['_src/htaccess/.*'])
    .pipe(gulp.dest(mockDirectory));
  done();
});


//----------------------------------
//
// ファイル変更の監視
//
//----------------------------------
gulp.task('watch', () => {
  gulp.watch('_src/scss/**/*.scss', gulp.task('sass'));
  gulp.watch(['_src/data/*.csv','_src/ejs/**/*.ejs'], gulp.task('ejs'));
  gulp.watch('_src/images/**/*.+(jpg|jpeg|png|gif|svg)', gulp.task('imagemin'));
  gulp.watch(['_src/js/**/*'], gulp.task('copy'));
});


//----------------------------------
//
// ローカルサーバ
//
//----------------------------------

// htmlのみ
gulp.task('server_ejs', (done) => {
  browserSync.init({
    server: {
      baseDir: mockDirectory
    },
    files: [
	    mockDirectory + "/**/*",
    ]
  });
  done();
});




//----------------------------------
//
// タスクまとめ
//
//----------------------------------

// 一括コンパイル
gulp.task('build', gulp.parallel('ejs', 'sass', 'imagemin', 'copy'));


gulp.task('default', gulp.parallel('watch', 'server_ejs'));
