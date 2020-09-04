// Internal Imports
import { Component } from "../component";
import { Events } from "../../interfaces";
import { Tools } from "../../tools";
import { DOMUtils } from "../../services";
import * as Configuration from "../../configuration";

// D3 Imports
import { event, select } from "d3-selection";

// import the settings for the css prefix
import settings from "carbon-components/es/globals/js/settings";

export class Toolbar extends Component {
	type = "toolbar";

	// overflow menu button to control background color
	overflowButton: any;

	// ul options list element
	overflowMenu: any;

	// x, y coordinate of overflow menu
	overflowMenuX = 0;
	overflowMenuY = 0;

	// Give every Reset zoom menu item an unique ID
	// so they don't interfere the other Reset zoom menu item in a page
	resetZoomMenuItemId =
		"resetZoomMenuItem-" + Math.floor(Math.random() * 99999999999);

	init() {
		const options = this.model.getOptions();

		// Grab the tooltip element
		const holder = select(this.services.domUtils.getHolder());
		const chartPrefix = Tools.getProperty(options, "style", "prefix");

		this.overflowMenu = DOMUtils.appendOrSelect(
			holder,
			`div.${settings.prefix}--${chartPrefix}--overflowMenu`
		);

		this.overflowMenu.style("max-width", null);

		// listen to show overflow menu event to render the overflow menu
		this.services.events.addEventListener(
			Events.Toolbar.SHOW_OVERFLOW_MENU,
			() => {
				this.overflowMenu.html(this.getOverflowMenuHTML());
			}
		);

		// listen to hide overflow menu event to hide the overflow menu
		this.services.events.addEventListener(
			Events.Toolbar.HIDE_OVERFLOW_MENU,
			() => {
				this.overflowMenu.html(null);
			}
		);
		// hide overflow menu if user clicks on somewhere in web page
		document.body.addEventListener("click", () =>
			this.showOverflowMenu(false)
		);
	}

	render(animate = true) {
		const isDataLoading = Tools.getProperty(
			this.model.getOptions(),
			"data",
			"loading"
		);

		// size of toolbar button with background
		const buttonSize = Configuration.toolbar.buttonSize;

		const svg = this.getContainerSVG();
		const { width } = DOMUtils.getSVGElementSize(
			this.services.domUtils.getMainSVG(),
			{
				useAttrs: true
			}
		);

		// overflow menu width is 160px
		// it's set by Carbon component
		const overflowMenuWidth = 160;
		// no good solution to get correct Toolbar position
		// parent x doesn't work well
		// assume the overflow icon has right alignment in layout
		this.overflowMenuX = width - overflowMenuWidth;
		this.overflowMenuY =
			parseFloat(this.parent.node().getAttribute("y")) + buttonSize;

		const container = DOMUtils.appendOrSelect(svg, "svg.toolbar-container")
			.attr("width", "100%")
			.attr("height", Configuration.toolbar.height)
			.attr("opacity", 1);

		// clean children first
		container.html(null);

		// get the toolbar buttons
		const toolbarButtonList = this.getToolbarButtons();

		// loading or empty state
		if (isDataLoading || toolbarButtonList.length === 0) {
			// put an empty rect to keep space unchanged
			DOMUtils.appendOrSelect(container, "svg.toolbar-loading-spacer")
				.append("rect")
				.attr("height", Configuration.toolbar.height)
				.attr("width", buttonSize * 3) // value doesn't matter but can't be empty
				.attr("opacity", 0);
		} else {
			// render toolbar buttons sequentially
			let buttonXPosition = 0;
			toolbarButtonList.forEach((button) => {
				// zoom in icon and event
				const buttonContainer = DOMUtils.appendOrSelect(
					container,
					`svg.${button.id}`
				);
				buttonContainer.classed("toolbar-button", true);
				// add button background rect
				DOMUtils.appendOrSelect(
					buttonContainer,
					"rect.toolbar-button-background"
				)
					.attr("x", buttonXPosition)
					.attr("y", 0)
					.attr("width", buttonSize)
					.attr("height", buttonSize);

				const buttonIcon = DOMUtils.appendOrSelect(
					buttonContainer,
					"svg.toolbar-button-icon"
				)
					.attr(
						"x",
						buttonXPosition + Configuration.toolbar.iconPadding
					)
					.attr("y", Configuration.toolbar.iconPadding)
					.attr("width", Configuration.toolbar.iconSize)
					.attr("height", Configuration.toolbar.iconSize)
					.attr("viewBox", "0 0 15 15");

				buttonIcon.html(button.iconSVGContent());
				buttonContainer.on("click", button.clickFunction);
				buttonXPosition += buttonSize;
			});

			this.overflowButton = this.getContainerSVG().select(
				"svg.toolbar-overflow-menu"
			);

			if (this.isOverflowMenuOpen()) {
				// keep overflow menu displayed
				this.showOverflowMenu(true);
			}
		}
	}

	isOverflowMenuOpen() {
		return (
			this.overflowMenu
				.selectAll("ul.bx--overflow-menu-options--open")
				.size() > 0
		);
	}

	// show/hide overflow menu
	showOverflowMenu(show: boolean) {
		// update overflow button background
		if (this.overflowButton) {
			this.overflowButton.classed("toolbar-button--hovered", show);
		}
		if (show) {
			this.services.events.dispatchEvent(
				Events.Toolbar.SHOW_OVERFLOW_MENU
			);
		} else {
			this.services.events.dispatchEvent(
				Events.Toolbar.HIDE_OVERFLOW_MENU
			);
		}
	}

	toggleOverflowMenu() {
		if (this.isOverflowMenuOpen()) {
			// hide overflow menu
			this.showOverflowMenu(false);
		} else {
			// show overflow menu
			this.showOverflowMenu(true);

			// setup overflow menu item event listener
			const self = this;
			const overflowMenuItems = this.getOverflowMenuItems();
			overflowMenuItems.forEach((menuItem) => {
				const element = document.getElementById(menuItem.elementId);
				if (element !== null) {
					element.addEventListener("click", () => {
						// call the specified function
						menuItem.clickFunction();

						// hide overflow menu
						self.showOverflowMenu(false);
					});
				}
			});
		}
		event.stopImmediatePropagation();
	}

	getOverflowMenuHTML() {
		const overflowMenuItems = this.getOverflowMenuItems();
		// don't render whole overflow menu if no overflow menu item
		if (!overflowMenuItems || overflowMenuItems.length === 0) {
			return "";
		}

		let overflowMenuHtml;
		overflowMenuHtml = `<div data-floating-menu-container="true" data-floating-menu-direction="bottom" role="main">
			<ul class="bx--overflow-menu-options bx--overflow-menu--flip bx--overflow-menu-options--open"
				tabindex="-1" role="menu" aria-label="Menu" data-floating-menu-direction="bottom"
				style="left:${this.overflowMenuX}px; top:${this.overflowMenuY}px;">`;

		// generate html for each overflow menu items
		overflowMenuItems.forEach((menuItem) => {
			overflowMenuHtml += `<li class="bx--overflow-menu-options__option">
						<button class="bx--overflow-menu-options__btn" role="menuitem"
							data-floating-menu-primary-focus
							id="${menuItem.elementId}">
							<div class="bx--overflow-menu-options__option-content">
								${menuItem.text}
							</div>
						</button>
					</li>`;
		});

		overflowMenuHtml += `</ul></div>`;
		return overflowMenuHtml;
	}

	getOverflowMenuItems() {
		const overflowMenuItems = [];
		const isZoomBarEnabled =
			this.services.zoom.isZoomBarEnabled() &&
			!this.services.zoom.isEmptyState();
		const isResetZoomEnabled = Tools.getProperty(
			this.model.getOptions(),
			"toolbar",
			"overflowMenuItems",
			"resetZoom",
			"enabled"
		);
		if (isZoomBarEnabled && isResetZoomEnabled) {
			overflowMenuItems.push(this.getResetZoomMenuItemConfig());
		}

		// add more overflow menu item configurations here

		return overflowMenuItems;
	}

	getResetZoomMenuItemConfig() {
		const resetZoomText = Tools.getProperty(
			this.model.getOptions(),
			"toolbar",
			"overflowMenuItems",
			"resetZoom",
			"text"
		);
		return {
			elementId: this.resetZoomMenuItemId, // this id needs to be unique in the whole web page
			text: resetZoomText,
			clickFunction: () => this.services.zoom.resetZoomDomain()
		};
	}

	getToolbarButtons() {
		const toolbarButtonList = [];
		const isZoomBarEnabled =
			this.services.zoom.isZoomBarEnabled() &&
			!this.services.zoom.isEmptyState();
		// add zoom in/out button only if zoom bar is enabled
		if (isZoomBarEnabled) {
			toolbarButtonList.push(this.getZoomInButtonConfig());
			toolbarButtonList.push(this.getZoomOutButtonConfig());
		}
		// add overflow icon button only if overflow menu item is available
		if (this.getOverflowMenuItems().length > 0) {
			toolbarButtonList.push(this.getOverflowButtonConfig());
		}

		// add more toolbar button configurations here

		return toolbarButtonList;
	}

	getZoomInButtonConfig() {
		return {
			id: "toolbar-zoomIn",
			iconSVGContent: () => this.getZoomInIconSVGContent(),
			clickFunction: () => this.services.zoom.zoomIn()
		};
	}

	getZoomOutButtonConfig() {
		return {
			id: "toolbar-zoomOut",
			iconSVGContent: () => this.getZoomOutIconSVGContent(),
			clickFunction: () => this.services.zoom.zoomOut()
		};
	}

	getOverflowButtonConfig() {
		return {
			id: "toolbar-overflow-menu",
			iconSVGContent: () => this.getOverflowIconSVGContent(),
			clickFunction: () => this.toggleOverflowMenu()
		};
	}

	getZoomInIconSVGContent() {
		return `<polygon points="9,6 7,6 7,4 6,4 6,6 4,6 4,7 6,7 6,9 7,9 7,7 9,7"/>
					<path d="M10.7,10C11.5,9,12,7.8,12,6.5C12,3.5,9.5,1,6.5,1S1,3.5,1,6.5S3.5,12,6.5,12c1.3,0,2.5-0.5,3.5-1.3l3.8,3.8l0.7-0.7
						L10.7,10z M6.5,11C4,11,2,9,2,6.5S4,2,6.5,2S11,4,11,6.5S9,11,6.5,11L6.5,11z"/>`;
	}

	getZoomOutIconSVGContent() {
		return `<rect x="4" y="6" width="5" height="1"/>
				<path d="M10.7,10C11.5,9,12,7.8,12,6.5C12,3.5,9.5,1,6.5,1S1,3.5,1,6.5S3.5,12,6.5,12c1.3,0,2.5-0.5,3.5-1.3l3.8,3.8l0.7-0.7
					L10.7,10z M6.5,11C4,11,2,9,2,6.5S4,2,6.5,2S11,4,11,6.5S9,11,6.5,11L6.5,11z"/>`;
	}

	getOverflowIconSVGContent() {
		return `<circle cx="8" cy="3" r="1"/>
				<circle cx="8" cy="8" r="1"/>
				<circle cx="8" cy="13" r="1"/>`;
	}
}
