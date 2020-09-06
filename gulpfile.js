var gulp        = require('gulp'),
    del         = require('del'),
    browserSync = require('browser-sync').create(),
    concat      = require('gulp-concat'),
    imagemin    = require('gulp-imagemin'),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
	ts          = require('gulp-typescript'),	
    uglify      = require('gulp-uglify');



// Definici�n de direcotrios origen
var srcPaths = {
    images:   'src/img/',
    scripts:  'src/ts/',
    styles:   'src/sass/',
	vendor:   'src/vendor/',
	data:     'src/data/',
    files:    'src/'
};


// Definici�n de directorios destino
var distPaths = {
    images:   'dist/img/',
    scripts:  'dist/js/',
    styles:   'dist/css/',
	vendor:   'dist/vendor/',
	data:     'dist/data/',
    files:    'dist/'
};


// Limpieza del directorio dist
gulp.task('clean', function(cb) {
  del([ distPaths.files+'*.html', distPaths.images+'**/*',distPaths.vendor+'**/*',distPaths.data+'**/*', distPaths.scripts+'*.js', distPaths.styles+'*.css'], cb);
});


// Copia de los cambios en los ficheros html en el directorio dist.
gulp.task('html', function() {
    return gulp.src([srcPaths.files+'*.html'])
        .pipe(gulp.dest(distPaths.files))
        .pipe(browserSync.stream());
});


// Copia de los cambios en la carpeta vendor
gulp.task('vendor', function() {        
    return gulp.src([srcPaths.vendor+'/**/*'])
        .pipe(gulp.dest(distPaths.vendor))
        .pipe(browserSync.stream());
});

// Copia de los cambios en la carpeta vendor
gulp.task('data', function() {        
    return gulp.src([srcPaths.data+'/**/*'])
        .pipe(gulp.dest(distPaths.data))
        .pipe(browserSync.stream());
});



/* 
* Procesamiento de im�genes para comprimir / optimizar las mismas.
*/ 
gulp.task('imagemin', function() {
    return gulp.src([srcPaths.images+'**/*'])        
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
        }))
        .pipe(gulp.dest(distPaths.images))
        .pipe(browserSync.stream());
});


/* 
* Procesamiento de ficheros SCSS para la generaci�n de los ficheros
* CSS correspondientes. Los sourcemaps en este caso se generan dentro 
* del propio fichero.
*/ 
gulp.task('css', function() {
    return gulp.src([srcPaths.styles+'**/*.scss'])
        .pipe(sourcemaps.init())
            .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPaths.styles))
        .pipe(browserSync.stream());
});


/* 
* Procesamiento de ficheros JS mediante JSHint para detecci�n de errores.
* Este proceso es previo al tratamiento de los ficheros JS para la 
* obtenci�n del fichero concatenado y minificado.
*/ 
gulp.task('lint', function() {
  return gulp.src([srcPaths.scripts+'**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});


/* 
* Procesamiento de ficheros JS para la generaci�n de un fichero 
* final �nico y minificado. Los sourcemaps se generan en una 
* carpeta independiente en vez de en el propio fichero.
*/ 

var tsProject = ts.createProject('tsconfig.json');

gulp.task('js', ['lint'], function() {
    return gulp.src([srcPaths.scripts+'TodoItem.ts', srcPaths.scripts+'TodoList.ts'])   
		.pipe(ts({
			//noImplicitAny: true
			}))
			//si introduzco esta modificaci�n falla. 
			//Al final en el pACKAGE.JSON he a�adido las versiones de jquery y store que venia en el proyecto
	//.pipe(tsProject())
	    .pipe(concat('all.min.js'))        
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(distPaths.scripts))
        .pipe(browserSync.stream());
});




/*
* Tarea para lanzar el proceso de servidor mediante BrowserSync.
* Antes de comenzar la propia tarea ejecuta las tareas de las que tiene
* dependencia: html, imagemin, css y js necesarias para disponer
* del proyecto en dist, ya que cada vez que se lanza gulp, se hace una
* limpieza de dicho directorio.
*
* En este caso se trabaja con un servidor local mediante un proxy
* y se define la ruta de partida, as� como los navegadores a lanzar
* en caso de estar disponibles en el equipo.
*
* Adicionalmente se crean los watchers para procesar los cambios que se
* puedan producir en los archivos sensibles para el proyecto.
*/
gulp.task('serve', ['html', 'imagemin', 'css', 'js','vendor'], function() {
    browserSync.init({
        logLevel: "info",
        browser: ["Firefox"],
        proxy: "localhost:80",
        startPath: "UocPractica1/todoApp/dist/"
    });

    gulp.watch(srcPaths.files+'*.html', ['html']);
    gulp.watch(srcPaths.images+'**/*', ['imagemin']);   
    gulp.watch(srcPaths.styles+'**/*.scss', ['css']);
    gulp.watch(srcPaths.scripts+'**/*.js', ['js']);
});

/* 
* Definci�n de la tarea por defecto que en este caso limpia el directorio destino
* y lanza la tarea de servidor.
*/
gulp.task('default', ['clean', 'serve'], function() {});