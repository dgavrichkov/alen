"use strict";

import gulp from "gulp";

const requireDir = require("require-dir"),
    paths = {
        views: {
            src: [
                "./src/views/index.pug",
                "./src/views/pages/*.pug"
            ],
            dist: "./dist/",
            watch: [
                "./src/blocks/**/*.pug",
                "./src/views/**/*.pug"
            ]
        },
        styles: {
            src: "./src/styles/*.{scss,sass}",
            dist: "./dist/styles/",
            watch: [
                "./src/blocks/**/*.{scss,sass}",
                "./src/styles/**/*.{scss,sass}"
            ]
        },
        scripts: {
            src: "./src/js/index.js",
            dist: "./dist/js/",
            watch: [
                "./src/blocks/**/*.js",
                "./src/js/**/*.js"
            ]
        },
        libs: {
            src: "./src/js/import/libs/*.js",
            dist: "./dist/js/",
            watch: [
                "./src/blocks/**/*.js",
                "./src/js/**/*.js"
            ]
        },
        images: {
            src: [
                "./src/images/**/*.{jpg,jpeg,png,gif,tiff,svg,mp4,mp3}",
                "!./src/images/favicon/*.{jpg,jpeg,png,gif,tiff,mp4,mp3}"
            ],
            dist: "./dist/images/",
            watch: "./src/images/**/*.{jpg,jpeg,png,gif,svg,mp4,mp3}"
        },
        fonts: {
            src: "./src/fonts/**/*.{woff,woff2,otf,ttf}",
            dist: "./dist/fonts/",
            watch: "./src/fonts/**/*.{woff,woff2,otf,ttf}"
        },
        favicons: {
            src: "./src/images/favicon/*.{jpg,jpeg,png,gif,tiff}",
            dist: "./dist/images/favicons/",
        },
        gzip: {
            src: "./src/.htaccess",
            dist: "./dist/"
        }
    };

requireDir("./gulp-tasks/");

export { paths };

export const development = gulp.series("clean", "smart-grid",
    gulp.parallel(["views", "styles", "scripts", "libs", "images", "fonts", "favicons"]),
    gulp.parallel("serve"));

export const prod = gulp.series("clean",
    gulp.parallel(["views", "styles", "scripts", "libs", "images", "fonts", "favicons", "gzip"]));

export default development;
