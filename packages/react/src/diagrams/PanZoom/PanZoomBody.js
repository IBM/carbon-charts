import React, {useRef, useLayoutEffect} from 'react';
import settings from 'carbon-components/src/globals/js/settings';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select, event } from 'd3-selection';

const { prefix } = settings;

export default ({
	children,
	outerDimensions = { height: "100%", width: "100%" },
	onTransform = () => {},
	scaleExtent = [0.25, 1.5],
	transform = {
		x: 0,
		y: 0,
		k: 1
	}
}) => {
	const namespace = `${prefix}--cc--panzoom`;
	const outerRef = useRef(null);
	const innerRef = useRef(null);
	const panZoomRef = useRef(null);

	const {k,x,y} = transform;

	const pz = zoom()
		.scaleExtent(scaleExtent)
		.on("zoom", () => {
			const {x,y,k} = event.transform;
			innerRef.current.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
			innerRef.current.style.transformOrigin = "0 0";

			onTransform(event.transform);
	});

	useLayoutEffect(() => {
		panZoomRef.current = select(outerRef.current);

		panZoomRef.current
			.call(pz)
			.call(pz.transform, zoomIdentity.translate(x, y).scale(k))

		return () => {
			pz.on("zoom", null);
		}
	}, []);

	useLayoutEffect(() => {
		panZoomRef.current.call(pz.transform, zoomIdentity.translate(x, y).scale(k));
	}, [x,y,k]);

	return (
		<div ref={outerRef} className={namespace} style={{ height: outerDimensions.height, width: outerDimensions.width, overflow: "hidden" }}>
			<div ref={innerRef} style={{ height: "100%", width: "100%" }}>
				{children}
			</div>
		</div>
	);
};
