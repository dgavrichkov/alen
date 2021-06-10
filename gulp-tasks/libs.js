"use strict";

import { paths } from "../gulpfile.babel";
import gulp from "gulp";


gulp.task("libs", () => {
    return gulp.src(paths.libs.src)
        .pipe(gulp.dest(paths.libs.dist));
});
