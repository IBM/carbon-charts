const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackExcludeAssetsPlugin = require("html-webpack-exclude-assets-plugin");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: "development",
	devtool: "sourcemap",
	entry: {
		"index": "./demo/index.ts",
		// "styles": "./src/styles/styles.scss",
		// "styles-g10": "./src/styles/styles-g10.scss",
		// "styles-g90": "./src/styles/styles-g90.scss",
		// "styles-g100": "./src/styles/styles-g100.scss",
	},
	output: {
		path: __dirname + "/demo/bundle",
		filename: "[name].js",
		chunkFilename: "[name].chunk.js",
		libraryTarget: "umd",
		library: "Charts"
	},
	optimization: {
		splitChunks: {
			chunks: "all"
		}
	},
	resolve: {
		// Add ".ts" and ".tsx" as a resolvable extension.
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".json", ".js"]
	},
	module: {
		rules: [
			// all files with a ".ts" or ".tsx" extension will be handled by "ts-loader"
			{ test: /\.ts$/, loader: "ts-loader?configFile=tsconfig-demo.json" },
			{ test: /\.html?$/, loader: "html-loader" },
			{
				test: /\.s?css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					"css-loader",
					{
						loader: "sass-loader",
						options: {
							sassOptions: {
								includePaths: [path.resolve(__dirname + "/../../node_modules")]
							}
						}
					}
				]
			},
			{
				test: /\.(jpg|png|gif|eot|ttf|woff|woff2)$/,
				loader: "url-loader"
			},
			{
				test: /\.svg?$/,
				loader: "raw-loader"
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
		new HtmlWebpackPlugin({
			template: "./demo/index.html",
			excludeAssets: [/styles-.*.css/]
		}),
		new HtmlWebpackExcludeAssetsPlugin(),
		new CopyWebpackPlugin([
			{ from: "demo/assets" }
		])
	],
	devServer: {
		contentBase: "./demo",
		host: "0.0.0.0",
		port: process.env.PORT || 9007,
		historyApiFallback: true,
		disableHostCheck: true
	}
};
