// MISC Imports
import { Skeleton } from "./skeleton";

export class SkeletonDonut extends Skeleton {
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

	renderSkeleton() {
    const outerRadius = this.computeOuterRadius();
    const innerRadius = this.computeInnerRadius();
    this.drawRing(outerRadius, innerRadius);
		this.setStyle("shimmer-areas");
	}
}
