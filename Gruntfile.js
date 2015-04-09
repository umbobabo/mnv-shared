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
    }
  });

  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-grunticon');
  //TODO implement svgmin to reduce svg sizes
  //'svgmin',
  grunt.registerTask('icons', ['grunticon:sharedIcons']);
};