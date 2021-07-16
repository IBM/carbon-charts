import React, {useRef, useState} from 'react';

export default ({
	children,
	outerDimensions = { height: "100%", width: "100%" },
	innerDimensions = {},
	initialTransform = {
		x: 0,
		y: 0,
		k: 1
	},
	scaleExtent = [0.25, 1.5]
}) => {
	const [transform, setTransform] = useState(initialTransform);

	const onTransform = (transform) => {
		setTransform(transform);
	};

	const onZoomIn = () => {
		if (transform.k < scaleExtent[1]) {
			setTransform({
				...transform,
				k: transform.k + 0.25
			})
		}
	}

	const onZoomOut = () => {
		if (transform.k > scaleExtent[0]) {
			setTransform({
				...transform,
				k: transform.k - 0.25
			})
		}
	}

	const onReset = () => {
		setTransform({
			x: 0,
			y: 0,
			k: 1
		})
	}

	return (
		<React.Fragment>
			{children({
				innerDimensions,
				outerDimensions,
				onReset,
				onTransform,
				onZoomIn,
				onZoomOut,
				scaleExtent,
				transform
			})}
		</React.Fragment>
	);
};
