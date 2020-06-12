import { getParameters } from "codesandbox/lib/api/define";

const packageJSON = require("@carbon/charts/package.json");
const libraryVersion = packageJSON.version;
const carbonComponentsVersion =
	packageJSON.devDependencies["carbon-components"];

const ibmPlexFontCSS = `@import "https://fonts.googleapis.com/css?family=IBM+Plex+Sans+Condensed|IBM+Plex+Sans:400,600&display=swap";
`;

export const createChartSandbox = (chartTemplate: any) => {
	const files = {};

	Object.keys(chartTemplate).forEach(
		(filePath) => (files[filePath] = { content: chartTemplate[filePath] })
	);

	return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${getParameters(
		{ files }
	)}`;
};

export const createVanillaChartApp = (demo: any) => {
	const chartData = JSON.stringify(demo.data, null, "\t");
	const chartOptions = JSON.stringify(demo.options, null, "\t");
	const chartComponent = demo.chartType.vanilla;

	const indexHtml = `<html>
	<head>
		<title>Parcel Sandbox</title>
		<meta charset="UTF-8" />
		<link href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans+Condensed|IBM+Plex+Sans:400,600&display=swap" rel="stylesheet">
	</head>
	<body>
		<div id="app" style="width: 100%; height: 100%;"></div>

		<script src="src/index.js"></script>
	</body>
</html>`;
	const indexJs = `import "@carbon/charts/styles.css";
import { ${chartComponent} } from "@carbon/charts";

const data = ${chartData};

const options = ${chartOptions};

// Grab chart holder HTML element and initialize the chart
const chartHolder = document.getElementById("app");
new ${chartComponent}(chartHolder, {
	data,
	options
});
`;
	const packageJson = {
		scripts: {
			start: "parcel index.html --open",
			build: "parcel build index.html"
		},
		dependencies: {
			"@carbon/charts": libraryVersion,
			"carbon-components": carbonComponentsVersion,
			d3: "5.9.2"
		},
		devDependencies: {
			"parcel-bundler": "^1.6.1"
		}
	};

	return {
		"index.html": indexHtml,
		"src/index.js": indexJs,
		"package.json": packageJson
	};
};

export const createReactChartApp = (demo: any) => {
	const chartData = JSON.stringify(demo.data, null, "\t");
	const chartOptions = JSON.stringify(demo.options, null, "\t");
	const chartComponent = demo.chartType.vanilla;

	const indexHtml = `<div id="root"></div>
  `;

	const indexJs = `import React from "react";
import ReactDOM from "react-dom";
import { ${chartComponent} } from "@carbon/charts-react";
import "@carbon/charts/styles.css";
// Or
// import "@carbon/charts/styles/styles.scss";

// IBM Plex should either be imported in your project by using Carbon
// or consumed manually through an import
import "./ibm-plex-font.css";

class App extends React.Component {
	state = {
		data: ${chartData},
		options: ${chartOptions}
	};

	render = () => (
		<${chartComponent}
			data={this.state.data}
			options={this.state.options}>
		</${chartComponent}>
	);
}
ReactDOM.render(<App />, document.getElementById("root"));
  `;
	const packageJson = {
		dependencies: {
			"@carbon/charts": libraryVersion,
			"@carbon/charts-react": libraryVersion,
			d3: "5.12.0",
			react: "16.12.0",
			"react-dom": "16.12.0",
			"react-scripts": "3.0.1",
			"carbon-components": carbonComponentsVersion
		}
	};

	return {
		"src/index.html": indexHtml,
		"src/index.js": indexJs,
		"src/ibm-plex-font.css": ibmPlexFontCSS,
		"package.json": packageJson
	};
};

export const createAngularChartApp = (demo: any) => {
	const chartData = JSON.stringify(demo.data, null, "\t\t");
	const chartOptions = JSON.stringify(demo.options, null, "\t\t");
	const chartComponent = demo.chartType.angular;

	const appComponentHtml = `<${chartComponent} [data]="data" [options]="options"></${chartComponent}>`;
	const appComponentTs = `import { Component } from "@angular/core";

import "@carbon/charts/styles.css";

// IBM Plex should either be imported in your project by using Carbon
// or consumed manually through an import
import "./ibm-plex-font.css";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html"
})
export class AppComponent {
	data = ${chartData};
	options = ${chartOptions};
}`;

	const appModule = `import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ChartsModule } from "@carbon/charts-angular";
import { AppComponent } from "./app.component";
@NgModule({
	imports: [BrowserModule, ChartsModule],
	declarations: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {}`;

	const indexHtml = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Angular</title>
	</head>
	<body>
		<app-root></app-root>
	</body>
</html>`;

	const mainTs = `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch(err => console.log(err));
`;

	const angularCliJson = `{
	"apps": [
		{
			"root": "src",
			"outDir": "dist",
			"assets": ["assets", "favicon.ico"],
			"index": "index.html",
			"main": "main.ts",
			"polyfills": "polyfills.ts",
			"prefix": "app",
			"styles": ["styles.css"],
			"scripts": [],
			"environmentSource": "environments/environment.ts",
			"environments": {
				"dev": "environments/environment.ts",
				"prod": "environments/environment.prod.ts"
			}
		}
	]
}`;

	const packageJson = JSON.stringify(
		{
			dependencies: {
				"@angular/animations": "8.2.14",
				"@angular/common": "8.2.14",
				"@angular/compiler": "8.2.14",
				"@angular/core": "8.2.14",
				"@angular/forms": "8.2.14",
				"@angular/platform-browser": "8.2.14",
				"@angular/platform-browser-dynamic": "8.2.14",
				"@angular/router": "8.2.14",
				"@carbon/charts": libraryVersion,
				"@carbon/charts-angular": libraryVersion,
				"core-js": "3.6.0",
				d3: "5.15.0",
				rxjs: "6.5.3",
				"zone.js": "0.10.2"
			}
		},
		null,
		"\t"
	);

	return {
		"src/index.html": indexHtml,
		"src/main.ts": mainTs,
		"src/app/app.component.html": appComponentHtml,
		"src/app/app.component.ts": appComponentTs,
		"src/app/ibm-plex-font.css": ibmPlexFontCSS,
		"src/app/app.module.ts": appModule,
		".angular-cli.json": angularCliJson,
		"package.json": packageJson
	};
};

export const createVueChartApp = (demo: any) => {
	const chartData = JSON.stringify(demo.data, null, "\t\t");
	const chartOptions = JSON.stringify(demo.options, null, "\t\t");
	const chartComponent = demo.chartType.vue;

	const chartVue = `<script>
import Vue from "vue";
import "@carbon/charts/styles.css";
import chartsVue from "@carbon/charts-vue";

// IBM Plex should either be imported in your project by using Carbon
// or consumed manually through an import
import "../ibm-plex-font.css";

Vue.use(chartsVue);

export default {
	name: "Chart",
	components: {},
	data() {
		return {
			data: ${chartData},
			options: ${chartOptions}
		};
	},
	template: "<${chartComponent} :data='data' :options='options'></${chartComponent}>"
};
</script>
  `;

	const appVue = `<template>
	<div id="app">
		<Chart/>
	</div>
</template>
<script>
import Chart from "./components/chart";
export default {
	name: "App",
	components: {
		Chart
	}
};
</script>
  `;

	const mainJs = `import Vue from "vue";
import App from "./App.vue";
Vue.config.productionTip = false;
new Vue({
	render: h => h(App)
}).$mount("#app");
`;

	const packageJson = JSON.stringify(
		{
			dependencies: {
				"@carbon/charts": libraryVersion,
				"@carbon/charts-vue": libraryVersion,
				"@vue/cli-plugin-babel": "4.1.1",
				"carbon-components": carbonComponentsVersion,
				d3: "5.15.0",
				vue: "^2.6.11"
			}
		},
		null,
		"\t\t"
	);

	return {
		"src/components/chart.vue": chartVue,
		"src/ibm-plex-font.css": ibmPlexFontCSS,
		"src/App.vue": appVue,
		"src/main.js": mainJs,
		"package.json": packageJson
	};
};

export const createSvelteChartApp = (demo: any) => {
	const chartData = JSON.stringify(demo.data, null, "\t");
	const chartOptions = JSON.stringify(demo.options, null, "\t");

	let chartComponent = demo.chartType.vanilla;

	switch (chartComponent) {
		case "SimpleBarChart":
			chartComponent = "BarChartSimple";
			break;
		case "GroupedBarChart":
			chartComponent = "BarChartGrouped";
			break;
		case "StackedBarChart":
			chartComponent = "BarChartStacked";
			break;
	}

	const indexJs = `import App from "./App.svelte";

const app = new App({ target: document.body });

export default app;
`;

	const App = `<script>
  import { ${chartComponent} } from "@carbon/charts-svelte";
</script>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/@carbon/charts@0.30.10/styles.min.css" />
</svelte:head>

<${chartComponent}
	data={${chartData}}
	options={${chartOptions}}
	/>
`;

	const packageJson = {
		scripts: {
			build: "rollup -c",
			autobuild: "rollup -c -w",
			dev: "run-p start:dev autobuild",
			start: "sirv public",
			"start:dev": "sirv public --dev"
		},
		devDependencies: {
			"npm-run-all": "^4.1.5",
			rollup: "^1.10.1",
			"rollup-plugin-commonjs": "^9.3.4",
			"rollup-plugin-node-resolve": "^4.2.3",
			"rollup-plugin-svelte": "^5.0.3",
			"rollup-plugin-terser": "^4.0.4",
			"sirv-cli": "^0.3.1"
		},
		dependencies: {
			"@carbon/charts": libraryVersion,
			"@carbon/charts-svelte": libraryVersion,
			"carbon-components": carbonComponentsVersion,
			d3: "5.12.0",
			svelte: "3.20.x"
		}
	};

	const rollup = `import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "index.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/bundle.js"
  },
  plugins: [
    postcss(),
    svelte({
      dev: !production,
      css: css => {
        css.write("public/bundle.css");
      }
    }),
    resolve(),
    commonjs(),
    production && terser()
  ]
};
`;

	return {
		"App.svelte": App,
		"index.js": indexJs,
		"package.json": packageJson,
		"rollup.config.js": rollup
	};
};
