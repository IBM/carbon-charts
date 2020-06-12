import { blue, cyan, green, magenta, purple, red, teal } from "@carbon/colors";

const getColor = (obj, shade) => obj[shade];

export default {
	blue: (shade) => getColor(blue, shade),
	cyan: (shade) => getColor(cyan, shade),
	green: (shade) => getColor(green, shade),
	magenta: (shade) => getColor(magenta, shade),
	purple: (shade) => getColor(purple, shade),
	red: (shade) => getColor(red, shade),
	teal: (shade) => getColor(teal, shade)
};
