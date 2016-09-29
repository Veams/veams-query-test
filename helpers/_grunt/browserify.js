var libs = [
	'exoskeleton',
	'handlebars',
	'respimage',
];

module.exports = {
	options: {
		transform: [
			['babelify',
				{
					compact: true,
					ignore: [
						'<%= paths.dev %>/js/vendor/'
					],
					presets: ['es2015', 'stage-0']
				}
			],
			['aliasify',
				{
					aliases: {
						'backbone': 'exoskeleton'
					},
					global: true,
					verbose: true
				}
			]
		],
		ignore: ['jquery']
	},
	vendor: {
		src: ['.'],
		dest: '<%= paths.dev %>/js/vendor/libs.js',
		options: {
			debug: false,
			alias: libs
		}
	},
	dev: {
		options: {
			external: libs,
			browserifyOptions: {
				debug: true
			},
			watch: true
		},
		files: {
			'<%= paths.dev %>/js/main.js': '<%= paths.src %>/js/main.js'
		}
	},
	dist: {
		files: {
			'<%= paths.dev %>/js/main.js': '<%= paths.src %>/js/main.js'
		}
	}
};