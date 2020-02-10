// Karma configuration
module.exports = function (config) {
	const browsers = ["ChromeHeadless", "FirefoxHeadless"];
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: "./",
		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ["jasmine"],
		// list of plugins we want to load
		plugins: [
			"karma-jasmine",
			"karma-webpack",
			"karma-chrome-launcher",
			"karma-firefox-launcher",
			"karma-safari-launcher"
		],
		// list of files / patterns to load in the browser
		files: [
			"**/*.spec.ts"
		],
		// list of files / patterns to exclude
		exclude: [
			"node_modules"
		],
		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			"**/*.ts": ["webpack"]
		},
		// webpack config
		webpack: {
			mode: "development",
			module: {
				rules: [
					{
						test: /\.ts$/,
						loader: "ts-loader",
						options: {
							transpileOnly: true
						}
					},
					{
						test: /\.html?$/,
						loader: "html-loader"
					},
					{
						test: /\.scss$/,
						use: [
							"style-loader",
							"css-loader",
							"postcss-loader",
							"sass-loader"
						]
					},
					{
						test: /\.svg?$/,
						loader: "raw-loader"
					}
				]
			},
			resolve: {
				extensions: [".ts", ".js"]
			}
		},
		// test results reporter to use
		// possible values: "dots", "progress"
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ["progress"],
		// web server port
		port: 9876,
		// enable / disable colors in the output (reporters and logs)
		colors: true,
		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,
		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: !process.env.CI,
		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers,
		browserConsoleLogOptions: {
			terminal: true,
			level: "warn"
		},
		customLaunchers: {
			FirefoxHeadless: {
				base: "Firefox",
				flags: ["-headless"]
			},
			ChromeNoSandbox: {
				base: "ChromeHeadless",
				flags: ["--no-sandbox"]
			}
		},
		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: !!process.env.CI,
		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	});
}
