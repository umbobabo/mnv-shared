module.exports = function(grunt) {
  grunt.initConfig({
    svgmin: {
        options: {
            plugins: [
                {
                    removeViewBox: false
                }, {
                    removeUselessStrokeAndFill: false
                }
            ]
        },
        dist: {
            files: {
                'images/icons/zoom-out.svg': 'images/icons/tmp/zoom-out.svg'
            }
        }
    },
    grunticon: {
      sharedIcons: {
          files: [{
              expand: true,
              //cwd: 'images/icons/tmp',
              cwd: 'images/icons',
              src: ['*.svg'],
              dest: "css/icons"
          }],
          options: {
          }
      }
    },
    watch: {
      scripts: {
        files: 'js/*.js'
      },
      sass: {
        files: ['css/components/overlay/*.scss'],
        tasks: ['sass:dev']
      }
    },
    sass: {
      dev: {
        files: {
          'css/components/overlay/style.css': 'css/components/overlay/package.scss'
        }
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src : ['css/*.*', 'js/*.*']
        },
        options: {
          watchTask: true // < VERY important
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-grunticon');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-sass');
  grunt.registerTask('default', ['sass:dev', 'browserSync', 'watch']);
  //TODO implement svgmin to reduce svg sizes
  //'svgmin',
  grunt.registerTask('icons', ['grunticon:sharedIcons']);
};