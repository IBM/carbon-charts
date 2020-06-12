import colors from "./colors";

// TODO - Some hardcoded values aren't available
// in @carbon/colors yet. We should look at adding those
// colors
export const WHITE = [
	colors.purple(70),
	colors.cyan(50),
	colors.teal(70),
	colors.magenta(70),
	colors.red(50),
	colors.red(90),
	colors.green(60),
	colors.blue(80),
	colors.magenta(50),
	"#b28600", // Yellow 50
	colors.teal(50),
	colors.cyan(90),
	"#8a3800", // Orange 70
	colors.purple(50)
];

export const DARK = [
	colors.purple(60),
	colors.cyan(40),
	colors.teal(60),
	colors.magenta(40),
	colors.red(50),
	colors.red(10),
	colors.green(30),
	colors.blue(50),
	colors.magenta(60),
	"#d2a106", // Yellow 40
	colors.teal(40),
	colors.cyan(20),
	"#ba4e00", // Orange 60
	colors.purple(30)
];

export const G10 = WHITE;
export const G90 = DARK;
export const G100 = DARK;

export const DEFAULT = WHITE;
