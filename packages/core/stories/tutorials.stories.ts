import { storiesOf } from "@storybook/html";
import { withKnobs, object } from "@storybook/addon-knobs";

import marked from "marked";
import "../demo/styles.scss";

// Syntax highlighting
const hljs = require("highlight.js/lib/highlight.js");
hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'));

const tutorialStories = storiesOf("Tutorials", module).addDecorator(withKnobs);

// Loop through the demos for the group
tutorialStories.add("Tabular data format", () => {
	// container creation
	const container = document.createElement("div");
	container.setAttribute("class", "container tutorial");

    container.innerHTML = marked(`
# Tabular data format

We've recently updated the default \`@carbon/charts\` data format to be of a tabular nature.

This means more flexibility for our users in terms of the shape of the data they can provide to the library.

**If you're looking to use @carbon/charts@0.30.8 and above, we recommend updating your data type as it should be a quick and easy switch.**

\`\`\`js
// Before
const simpleBarData = {
    labels: ["Qty", "More", "Sold", "Restocking", "Misc"],
    datasets: [
        {
            data: [
                65000,
                29123,
                35213,
                51213,
                16932
            ]
        }
    ]
};

// After
const simpleBarData = [
    { group: "Qty", value: 65000 },
    { group: "More", value: 29123 },
    { group: "Sold", value: 35213 },
    { group: "Restocking", value: 51213 },
    { group: "Misc", value: 16932 }
];
\`\`\`

As you might have noticed in the examples above, the charting data provided in the existing format was an \`object\` that described labels, datasets and datapoints.

Now in the new format you would provide an **array where each element is a datapoint.**

Now we need to introduce some new fields into our \`axes\` options in order to map keys within our datapoints to axis values.

##### Additions to charting options:
*Note:* **This section does not apply to any non-axis charting components (e.g. pie & donut)**

We'd still need a way to know which keys map to your values (\`rangeIdentifier\`) and which map to the labels you'd be showing on an axis (\`domainIdentifier\`).

These identifiers can be set through the \`mapsTo\` option within each axis, and are defeaulted to \`value\` & (\`key\` or \`date\` - depending on whether your datapoints include dates).

**Although the library will set fallback \`mapsTo\` defaults, you should always set your own.**

\`\`\`js
const simpleBarOptions = {
    title: "Simple bar (discrete)",
    axes: {
        left: {
            mapsTo: "value"
        },
        bottom: {
            mapsTo: "group",
            scaleType: "labels"
        }
    }
};
\`\`\`

##### Non-axis chart types:
In the case of pie & donut the library will always look for the \`value\` key within your datapoints:
\`\`\`js
export const pieData = [
	{ group: "2V2N 9KYPM version 1", value: 20000 },
	{ group: "L22I P66EP L22I P66EP L22I P66EP", value: 65000 },
	{ group: "JQAI 2M4L1", value: 75000 },
	{ group: "J9DZ F37AP", value: 1200 },
	{ group: "YEL48 Q6XK YEL48", value: 10000 },
	{ group: "Misc", value: 25000 }
];
\`\`\`

##### Customizable options:
You're able to customize the \`groupMapsTo\` which is used to determine the key within your data that identifies the grouping of the datapoints.

\`\`\`js
const simpleBarOptions = {
    data: {
		groupMapsTo: "category"
	}
};

const simpleBarData = [
    { category: "Qty", value: 65000 },
    { category: "More", value: 29123 },
    { category: "Sold", value: 35213 },
    { category: "Restocking", value: 51213 },
    { category: "Misc", value: 16932 }
];
\`\`\`

For bubble charts you're able to customize the "radius" identifier:
\`\`\`js
export const bubbleDoubleLinearOptions = {
	title: "Bubble (linear)",
	axes: {
		bottom: {
			title: "No. of employees",
			mapsTo: "sales",
			includeZero: false
		},
		left: {
			title: "Annual sales",
			mapsTo: "profit",
			includeZero: false
		}
	},
	bubble: {
		radiusMapsTo: "surplus"
	}
};

const bubbleDoubleLinearData = [
	{ group: "Dataset 1", sales: 10000, profit: 32100, surplus: 50000 },
	{ group: "Dataset 1", sales: 12000, profit: 23500, surplus: 34000 },
	{ group: "Dataset 1", sales: 14000, profit: 53100, surplus: 63000 },
	{ group: "Dataset 1", sales: 15000, profit: 42300, surplus: 43000 },
	{ group: "Dataset 1", sales: 16000, profit: 12300, surplus: 55000 },
	{ group: "Dataset 2", sales: 11000, profit: 12400, surplus: 25000 },
	{ group: "Dataset 2", sales: 13000, profit: 34500, surplus: 35000 },
	{ group: "Dataset 2", sales: 13500, profit: 23100, surplus: 55000 },
	{ group: "Dataset 2", sales: 15500, profit: 63200, surplus: 35000 },
	{ group: "Dataset 2", sales: 15750, profit: 24300, surplus: 64000 }
];
\`\`\`

**Default value for \`radiusMapsTo\` is \`radius\`**

##### Color scale

You're also able to provide a custom \`color range\` to be used within the color scale.
\`\`\`
const simpleBarOptions = {
	color: {
		scale: {
			"Dataset 1": "blue",
			"Dataset 2": "red"
		} // Other data groups would use default colors
	}
};
\`\`\`
    `);

    container.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightBlock(block);
    });

    return container;
});

// Loop through the demos for the group
tutorialStories.add("Time axis", () => {
	// container creation
	const container = document.createElement("div");
	container.setAttribute("class", "container tutorial");

    container.innerHTML = marked(`
# Time axis
​
**This is a WIP tutorial written by Ilaria Venturini**

The behavior of the time axes can be managed by user changing the \`timeScale\` option values.
​

**What the user can set is:**
​
- how much to extend the domain using \`addSpaceOnEdges\`
- the language in which to show ticks changhing the \`localeObject\` object imported by \`date-fns\`
- whether to show the days of the month as day of month or day of week (\`showDayName\`)
- tick formatters (\`timeIntervalFormats\`)
​

**Default values are:**
​

\`\`\`js
options = {
	timeScale: {
		addSpaceOnEdges: 1,
		showDayName: false,
		localeObject: enUSLocaleObject,
		timeIntervalFormats: {
			"15seconds": { primary: "MMM d, pp", secondary: "pp" },
			"minute": { primary: "MMM d, p", secondary: "p" },
			"30minutes": { primary: "MMM d, p", secondary: "p" },
			"hourly": { primary: "MMM d, hh a", secondary: "hh a" },
			"daily": { primary: "MMM d", secondary: "d" },
			"weekly": { primary: "eee, MMM d", secondary: "eee" },
			"monthly": { primary: "MMM yyyy", secondary: "MMM" },
			"quarterly": { primary: "QQQ ''yy", secondary: "QQQ" },
			"yearly": { primary: "yyyy", secondary: "yyyy" }
		}
	}
}
\`\`\`
​
## \`addSpaceOnEdges\`

It represents how much space should be added to the current domain. The \`addSpacingToTimeDomain()\` function takes the current domain (\`[startDate, endDate]\`) and expands it if necessary:


- if \`addSpaceOnEdges = 0\`, the new domain will be the current one
- if \`addSpaceOnEdges = N\` (with \`N > 0\`):
	- if \`domain spans at least 2 years\` -> \`[startDate - N years, endDate + N years]\`
	- if \`domain spans at least 2 months\` -> \`[startDate - N months, endDate + N months]\`
	- ...
	- if \`domain spans at least 2 seconds\` -> \`[startDate - N seconds, endDate + N seconds]\`
	- else -> \`[startDate, endDate]\`.
​

## Time formats
​
In \`axis.ts\` we calculate the \`timeInterval\` which best represents ticks.

**The values ​​that \`timeInterval\` can assume are:**
​
\`\`\`js
const TIME_INTERVALS = [
	["15seconds", 15 * 1000],
	["minute", 60 * 1000],
	["30minutes", 30 * 60 * 1000],
	["hourly", 60 * 60 * 1000],
	["daily", 24 * 60 * 60 * 1000],
	["monthly", 30 * 24 * 60 * 60 * 1000],
	["quarterly", 3 * 30 * 24 * 60 * 60 * 1000],
	["yearly", 12 * 30 * 24 * 60 * 60 * 1000]
];
\`\`\`
​
Then the ticks are formatted using the formatter associated with the computed \`timeInterval\`.

For more information on formatters see the [date-fns](https://date-fns.org/v2.8.1/docs/format).
​
### \`showDayName\`
​
Among the \`TIME_INTERVALS\`, \`weekly\` is missing because it is not a real \`timeInterval\`, it's just a different way of showing days.


So if the data has \`timeInterval = daily\` the user can choose whether to show the data using day of month (1, 2, 3, ..., 31) or day of week (Monday, Tuesday, ..., Sunday):
​
[daily](https://user-images.githubusercontent.com/44204353/74938402-397c7100-53ee-11ea-8189-8dad6048b829.png)
[weekly](https://user-images.githubusercontent.com/44204353/74938406-3bdecb00-53ee-11ea-9dc8-1911994b3400.png)

​
By default \`showDayName = false\` so days are shown as days of month.
​
### \`timeIntervalFormats\`
​
The \`timeIntervalFormats\` object contains two formatters for each type of \`timeInterval\`:
- \`primary\`: is the formatter that formats the first tick and all of those ticks that represent a change from the previous tick
- \`secondary\`: is the formatter that formats the remaining ticks.
​

For more info see \`time-series.ts/isTickPrimary(...)\`.
​

What the user can do is modify all the formatters of all the \`timeInterval\`: if, for example, he prefers to use the h24 format and not the default h12 format, he can use these options:
​

\`\`\`js
"timeScale": {
	"timeIntervalFormats": {
		"hourly": {
			"primary": "MMM d, HH:mm",
			"secondary": "HH:mm"
		}
	}
}
\`\`\`
​
These leaves all the other formats (\`daily\`, \`monthly\`, \`hourly\`, ...) as default.
​
### \`localeObject\`
​
The \`localeObject\` object allow the user to change the language of the labels.

[Here](https://github.com/date-fns/date-fns/tree/master/src/locale) a list of available local codes.
    `);

    container.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightBlock(block);
    });

    return container;
});
