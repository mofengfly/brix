module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            name: 'Brix',
            banner: '/*! <%= meta.name %> - v<%= pkg.version %>\n' + '* <%= pkg.homepage %>\n' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        },
        lint: {
            files: ['grunt.js']
        },
        concat: {
            brix_js: {
                src: ['<banner:meta.banner>', "src/core/mustache.js", "src/core/mu.js", "src/core/tmpler.js", "src/core/dataset.js", "src/core/chunk.js", "src/core/brick.js", "src/core/pagelet.js"],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        min: {
            brix: {
                src: ['<banner:meta.banner>', 'dist/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>-min.js'
            }
        },
        less: {
            brix: {
                src: ['src/style/brix.less'],
                dest: 'dist/<%= pkg.name %>.css'
            },
            brix_min: {
                src: ['src/style/brix.less'],
                dest: 'dist/<%= pkg.name %>-min.css',
                options: {
                  yuicompress: true
                }
            }
        },
        brixless:{
            gallerysrc:{
                src:'src/gallery/',
                dest:'src/gallery/'
            },
            gallerydes:{
                src:'src/gallery/',
                dest:'dist/gallery/'
            },
            gallerydes_min:{
                src:'src/gallery/',
                dest:'dist/gallery/',
                options: {
                  yuicompress: true
                }
            }
        },
        brixjs:{
            gallerysrc:{
                src:'src/gallery/',
                dest:'dist/gallery/'
            },
            gallerydes:{
                src:'src/gallery/',
                dest:'dist/gallery/',
                options: {
                  compress: true
                }
            }
        },
        watch: {
            watchless:{
                files: 'src/gallery/**/*.less',
                tasks: 'brixless'
            },
            watchjs:{
                files: 'src/gallery/**/index.js',
                tasks: 'brixjs'
            },
            watchcss:{
                files: 'src/style/*.less',
                tasks: 'less'
            }
        },
        jshint: {
            options: {
                browser: true,
                curly: true,
                eqeqeq: false,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true
            },
            globals: {
                exports: true,
                module: false,
                KISSY: true,
                console: true,
                print: true,
                document: true,
                window: true
            }
        },
        uglify: {
            codegen: {
                ascii_only: true
            }
        }
    });

    //npm install grunt-less
    grunt.loadNpmTasks('grunt-less');

    //tasks
    grunt.loadTasks('tasks');

    // Default task.
    grunt.registerTask('default', 'lint concat min less brixless brixjs watch');
};
