var gulp = require('gulp');
var gts = require('gulp-typescript');

let project = gts.createProject('./tsconfig.json');

gulp.task('build', () => {
    gulp.src(['./index.ts', 'src/**/*.ts', 'typings/index.d.ts'])
        .pipe(gts(project)).js
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], () => {
    gulp.watch(['./index.ts', 'src/**/*.ts'], ['build']);
});