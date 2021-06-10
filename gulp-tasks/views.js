"use strict";

import { paths } from "../gulpfile.babel";
import gulp from "gulp";
import pug from "gulp-pug";
import browsersync from "browser-sync";

gulp.task("views", () => {
    return gulp.src(paths.views.src)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(paths.views.dist))
        .pipe(browsersync.stream());
});