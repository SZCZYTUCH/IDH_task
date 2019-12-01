// Include gulp
const { src, dest, parallel, series  } = require('gulp');

// Include plugins
const nginclude = require('gulp-nginclude');
const jeditor = require('gulp-json-editor');
const gulpIf = require('gulp-if');
const useref = require('gulp-useref');
const cleanCSS = require('gulp-clean-css');
const cheerio = require('gulp-cheerio');
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-terser');

function isForRelease(){
    var paramExists = (process.argv.indexOf("--release") > -1);
    return paramExists;
};

function isJs(file){
    var isJsFile = ( (file.path.slice(-3)) === ".js" ) ;
    return isJsFile;
};

function isForReleaseJs(file){
    return ( (isForRelease()) && (isJs(file)) );
};

function isForReleaseJson(file){
    var isRelease = isForRelease();
    var isJson = ( (file.path.slice(-5)) === ".json" ) ;
    return isRelease && isJson;
};

function buildWithDebugTab(){
    var withDebugTab = (process.argv.indexOf("--debug_tab") > -1);
    return withDebugTab;
};

function editConfigJSON(json) {
    var isRelease = isForRelease();
    
    json.mode                  = (isRelease)? 'RELEASE' : 'DEV';

    json.enable_debug_tab = buildWithDebugTab();

    return json; // must return JSON object.
};

function DOMmanipulation($, file, done) {

    var scripts = $('script');
    var lastScript = scripts.last().text();
    var s = '';

    var list1 = lastScript.split('var framework = ').pop().split('/* FRAMEWORK SCRIPT LIST END */').shift();
    var listArr1 = eval(list1);
    s += '\n<!-- build:js scripts/framework.min.js -->';
    listArr1.forEach(function(item, i, array) {
        s += '\n<script type="text/javascript" src="'+item+'"></script>';
    });
    s += '\n<!-- endbuild -->\n';

    var list2 = lastScript.split('var minor_plugins = ').pop().split('/* MINOR_PLUGINS SCRIPT LIST END */').shift();
    var listArr2 = eval(list2);
    s += '\n<!-- build:js scripts/minor_plugins.min.js -->';
    listArr2.forEach(function(item, i, array) {
        s += '\n<script type="text/javascript" src="'+item+'"></script>';
    });
    s += '\n<!-- endbuild -->\n';

    var list3 = lastScript.split('var idh = ').pop().split('/* IDH SCRIPT LIST END */').shift();
    var listArr3 = eval(list3);
    s += '\n<!-- build:js scripts/idh.min.js -->';
    listArr3.forEach(function(item, i, array) {
        s += '\n<script type="text/javascript" src="'+item+'"></script>';
    });
    s += '\n<!-- endbuild -->\n';
    
    var reg1 = new RegExp(/(\/\* FRAMEWORK SCRIPT LIST START \*\/)[\s\S]*?(\/\* FRAMEWORK SCRIPT LIST END \*\/)/);
    var lastScript = lastScript.replace(reg1, '/* FRAMEWORK SCRIPT LIST START */\n\t\tvar framework = ["scripts/framework.min.js"];\n\t\t/* FRAMEWORK SCRIPT LIST END */');

    var reg1 = new RegExp(/(\/\* MINOR_PLUGINS SCRIPT LIST START \*\/)[\s\S]*?(\/\* MINOR_PLUGINS SCRIPT LIST END \*\/)/);
    var lastScript = lastScript.replace(reg1, '/* MINOR_PLUGINS SCRIPT LIST START */\n\t\tvar minor_plugins = ["scripts/minor_plugins.min.js"];\n\t\t/* MINOR_PLUGINS SCRIPT LIST END */');

    var reg1 = new RegExp(/(\/\* IDH SCRIPT LIST START \*\/)[\s\S]*?(\/\* IDH SCRIPT LIST END \*\/)/);
    var lastScript = lastScript.replace(reg1, '/* IDH SCRIPT LIST START */\n\t\tvar idh = ["scripts/idh.min.js"];\n\t\t/* IDH SCRIPT LIST END */');

    $('#scri').html(s);

    scripts.last().text(lastScript);

    done();
};

//removes unnecessary tag (this also fixes cheerios influence on link tags not beeing removed after useref traversal) //TODO watch for side effects
function removeDung($, file, done){
    $('#scri').remove();
    
    var head_children = $('head').contents();
    var start_splice = null;
    var end_splice = null;
    
    head_children.each(function (i, elem) {
        if (elem.data !== undefined){
            if (elem.data.toString().indexOf('build:css assets/css/styles.min.css') > -1){
                start_splice = i;
            }else if (elem.data.toString().indexOf('endbuild') > -1){
                end_splice = i+1;
            }
        }
    });
    
    head_children.splice(start_splice, (end_splice - start_splice), ($('<link rel="stylesheet" href="css/styles.min.css">'))[0] );
    
    $('head').html(head_children);

    done();  
};


//copy config file
function copy_config() {
    return src('app/cnf/**/*')
            .pipe(jeditor(editConfigJSON))
            .pipe(dest('www/cnf'));
}
//copy copy inner fonts
function copy_fonts() {
    return src(['node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.eot', 
                'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.svg',
                'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf',
                'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff',
                'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2'
                ])
        .pipe(dest('www/webfonts'));
};

//copy fonts
function copy_inner_fonts() {
    return src('app/assets/fonts/**/*')
        .pipe(dest('www/assets/fonts'));
};

//copy images
function copy_imgs() {
    return src('app/assets/images/**/*')
        .pipe(dest('www/assets/images'));
};

//copy cordova dummy scripts
function copy_cordova() {
    return src(['app/cordova.js', 'app/cordova_plugins.js'])
        .pipe(dest('www'));
};

//copy cordova dummy plugin scripts
function copy_cordova_plugins() {
    return src('app/plugins/**/*')
        .pipe(dest('www/plugins'));
};

//copy templates
function copy_templates() {
    return src(['app/templates/*',
                'app/templates/**/*'])
        //.pipe(htmlmin({collapseWhitespace: true, removeComments:true, caseSensitive:true}))
        .pipe(dest('www/templates'));
};

function conmini() {
    return src('app/index.html')
        .pipe(nginclude())
        .pipe(cheerio({run: DOMmanipulation, parserOptions: {decodeEntities: false}}))
        .pipe(useref())

        .pipe(gulpIf(isForReleaseJs, stripDebug()))
        .pipe(gulpIf(isForReleaseJs, uglify()))

        .pipe(gulpIf('*.css', cleanCSS({debug: true}, (details) => {
                //console.log(details);
                //console.log(`${details.name}: ${details.stats.originalSize}`);
                //console.log(`${details.name}: ${details.stats.minifiedSize}`);
        })))
        .pipe(gulpIf('index.html', cheerio({run: removeDung, parserOptions: {decodeEntities: false}})))
        .pipe(dest('www'));
};



//exports.copy_charts = copy_charts;
//exports.copy_config = copy_config;
//exports.copy_fonts = copy_fonts;
//exports.copy_imgs = copy_imgs;
//exports.copy_certificates = copy_certificates;
//exports.copy_templates = copy_templates;
//exports.conmini = conmini;


exports.compile = series(copy_config, copy_fonts, copy_inner_fonts, copy_imgs, copy_templates, copy_cordova, copy_cordova_plugins, conmini);