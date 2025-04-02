import { src, dest, series, parallel, watch as gulpWatch } from 'gulp';
import ejs from "gulp-ejs";
import rename from "gulp-rename";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify"
import sourcemaps from "gulp-sourcemaps"; // ← これがあるか確認！
import browserSync from "browser-sync";
import autoprefixer from "gulp-autoprefixer";
import groupCssMediaQueries from "gulp-group-css-media-queries";
import rev from "gulp-rev";
import revReplace from "gulp-rev-replace";
import revDel from "gulp-rev-delete-original";
import { navData, snsData, projectImageData, featureData, flowData, contactData } from "./src/data/data.js";

const sass = gulpSass(dartSass);
const bs = browserSync.create();

// EJSコンパイル
const CompileEjs = () => {
    return src("src/views/index.ejs")
        .pipe(
            ejs(
                { navData, snsData, projectImageData, featureData, flowData, contactData },
                {},
                { ext: ".html" }
            )
        )
        .pipe(rename({ extname: ".html" }))
        .pipe(revReplace({ manifest: src("dist/rev-manifest.json", { allowEmpty: true }) })) // マニフェストを安全に参照
        .pipe(dest("dist"));
};

// SASSのコンパイル
const CompileSass = () => {
    return src("src/styles/style.scss")
       .pipe(sass().on("error", sass.logError)) // SASSのコンパイル
        .pipe(autoprefixer({ overrideBrowserslist: ["last 2 versions"], grid: true, cascade: false })) // ベンダープレフィックス追加
        .pipe(groupCssMediaQueries()) // メディアクエリをグループ化
        .pipe(cleanCSS()) // CSSを圧縮
        .pipe(rename("style.css"))
        .pipe(dest("dist/css"))
        .pipe(rev()) // ハッシュ付きファイル名を生成
        .pipe(dest("dist/css"))
        .pipe(rev.manifest("dist/rev-manifest.json", { merge: true })) // マニフェストを更新
        .pipe(dest(".")) // マニフェストをルートディレクトリに書き出し
        .pipe(revDel()); // 不要なファイルを削除
};

// JSファイルのコピー（圧縮＆ソースマップなし）
const MinifyJs = () => {
    return src("src/js/index.js")
        .pipe(sourcemaps.init()) // ソースマップの初期化
        .pipe(uglify()) // JS を圧縮
        .pipe(sourcemaps.write(".")) // ソースマップの書き出し
        .pipe(dest("dist/js")) // 圧縮後の JS を保存
        .pipe(bs.stream()); // 変更を即時適用
};

// 画像のコピー
const CopyImages = () => {
    return src("src/img/**/*", { encoding: false }).pipe(dest("dist/img"));
};

// faviconコピー
const CopyFavicon = () => {
    return src("favicon.ico", { encoding: false }).pipe(dest("dist"));
};

// 動画のコピー
const CopyVideo = () => {
    return src("src/video/video-bg.mp4", { encoding: false }).pipe(dest("dist/video"));
};

// ライブリロード設定
const Server = () => {
    bs.init({
        server: {
            baseDir: "dist"
        },
        files: ["dist/**/*"], // 変更ファイルを監視
        open: true,
        notify: false,
    });

    gulpWatch("src/styles/**/*.scss", series(CompileSass, CompileEjs));
    gulpWatch("src/views/**/*.ejs", CompileEjs);
    gulpWatch("src/js/**/*.js", series(MinifyJs, (done) => {
        bs.reload(); // 明示的にリロード
        done();
    }));
};

// ビルドタスク
export const build = series(parallel(CompileSass, MinifyJs), CompileEjs, CopyImages, CopyFavicon, CopyVideo);

// Watchタスク
export const watch = series(build, Server);

// Defaultタスク
export default watch;
