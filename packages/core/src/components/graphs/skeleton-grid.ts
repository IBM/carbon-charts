// MISC Imports
import { Skeleton } from "./skeleton";

export class SkeletonGrid extends Skeleton {
	render() {
		const areDataEmpty = this.model.isDataEmpty();

		// if data are empty, draw the skeleton,
		// otherwise remove the skeleton
		if (areDataEmpty) {
			this.renderSkeleton();
		} else {
			this.removeSkeleton();
		}
	}

	renderSkeleton(animate = true) {
		this.setScales();
		this.drawBackdrop();
		this.drawXGrid(animate);
		this.drawYGrid(animate);
		this.setStyle();
	}
}
