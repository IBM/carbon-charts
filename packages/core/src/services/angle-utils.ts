export interface Point {
	x: number;
	y: number;
}

export type Angle = number;

// compute modulo values correctly also with a negative number
function mod(n: number, m: number): number {
	return ((n % m) + m) % m;
}

export function radialLabelPlacement(angleRadians: Angle) {
	const angle = mod(radToDeg(angleRadians), 360);

	let textAnchor: "start" | "middle" | "end" = "middle"; // *___   __*__   ___*
	let dominantBaseline: "baseline" | "middle" | "hanging" = "middle"; // __*   --*--   --.

	let quadrant = 0;

	if (isInRange(angle, [0, 90])) {
		quadrant = 0;
	} else if (isInRange(angle, [90, 180])) {
		quadrant = 1;
	} else if (isInRange(angle, [180, 270])) {
		quadrant = 2;
	} else if (isInRange(angle, [270, 360])) {
		quadrant = 3;
	}

	if (quadrant === 0) {
		textAnchor = "start";
		dominantBaseline = "hanging";
	} else if (quadrant === 1) {
		textAnchor = "end";
		dominantBaseline = "hanging";
	} else if (quadrant === 2) {
		textAnchor = "end";
		dominantBaseline = "baseline";
	} else if (quadrant === 3) {
		textAnchor = "start";
		dominantBaseline = "baseline";
	}

	let edge = null;

	if (isInRange(angle, [0, 10]) || isInRange(angle, [350, 0])) {
		edge = 0;
	} else if (isInRange(angle, [80, 100])) {
		edge = 1;
	} else if (isInRange(angle, [170, 190])) {
		edge = 2;
	} else if (isInRange(angle, [260, 280])) {
		edge = 3;
	}

	if (edge === 0) {
		textAnchor = "start";
		dominantBaseline = "middle";
	} else if (edge === 1) {
		textAnchor = "middle";
		dominantBaseline = "hanging";
	} else if (edge === 2) {
		textAnchor = "end";
		dominantBaseline = "middle";
	} else if (edge === 3) {
		textAnchor = "middle";
		dominantBaseline = "baseline";
	}

	return { textAnchor, dominantBaseline };
}

function isInRange(x: number, minMax: number[]): boolean {
	return x >= minMax[0] && x <= minMax[1];
}

export function radToDeg(rad: Angle): Angle {
	return rad * (180 / Math.PI);
}

export function degToRad(deg: Angle): Angle {
	return deg * (Math.PI / 180);
}

export function polarToCartesianCoords(a: Angle, r: number, t: Point = { x: 0, y: 0 }) {
	const x = r * Math.cos(a) + t.x;
	const y = r * Math.sin(a) + t.y;
	return { x, y };
}

// Return the distance between a point (described with polar coordinates)
// on a circumference and the vertical diameter.
// If the point is on the left if the diameter, its distance is positive,
// if it is on the right of the diameter, its distance is negative.
export function distanceBetweenPointOnCircAndVerticalDiameter(a: Angle, r: number) {
	return r * Math.sin(a - Math.PI / 2);
}
