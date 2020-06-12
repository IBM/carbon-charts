import { configure } from "@storybook/html";
import { setOptions } from "@storybook/addon-options";
import theme from "./theme";

setOptions({
	name: "Carbon Charts - Vanilla",
	showAddonPanel: true,
	sortStoriesByKind: true,
	panelPosition: "bottom",
	showDownPanel: true,
	theme
});

const req = require.context("../stories", true, /.stories.ts$/);
function loadStories() {
	req.keys().forEach((filename) => {
		req(filename);
	});
}

configure(loadStories, module);
