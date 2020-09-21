// Internal Imports
import { Component } from "../component";
import { Events, ToolbarControlTypes } from "../../interfaces";
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

	// Use a random number to create overflow menu item unique ID
	// so they don't interfere the other overflow menu item in a page
	overflowMenuItemId = Math.floor(Math.random() * 99999999999);

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
		const { buttonList, overflowMenuItemList } = this.getControlConfigs();

		// overflow button is required only if overflow menu item list is valid
		if (!!overflowMenuItemList) {
			buttonList.push(this.getOverflowButtonConfig());
		}

		// loading or empty state
		if (isDataLoading || buttonList.length === 0) {
			// put an empty rect to keep space unchanged
			DOMUtils.appendOrSelect(container, "svg.toolbar-loading-spacer")
				.append("rect")
				.attr("height", Configuration.toolbar.height)
				.attr("width", buttonSize * 3) // value doesn't matter but can't be empty
				.attr("opacity", 0);
		} else {
			// render toolbar buttons sequentially
			let buttonXPosition = 0;
			buttonList.forEach((button) => {
				// zoom in icon and event
				const buttonContainer = DOMUtils.appendOrSelect(
					container,
					`svg.${button.id}`
				).classed("toolbar-button", true);

				// add button background rect
				const buttonBackground = DOMUtils.appendOrSelect(
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
					.attr("viewBox", "0 0 32 32");

				buttonIcon.html(button.iconSVGContent());
				if (button.shouldBeDisabled()) {
					buttonContainer.classed("toolbar-button--disabled", true);
					buttonIcon.classed("toolbar-button-icon--disabled", true);
					buttonBackground.classed(
						"toolbar-button-background--disabled",
						true
					);
					buttonContainer.on("click", null);
				} else {
					buttonContainer.classed("toolbar-button--disabled", false);
					buttonIcon.classed("toolbar-button-icon--disabled", false);
					buttonBackground.classed(
						"toolbar-button-background--disabled",
						false
					);
					buttonContainer.on("click", button.clickFunction);
				}
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
				const element = document.getElementById(
					menuItem.id + this.overflowMenuItemId
				);
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
			const menuItemClasses = "bx--overflow-menu-options__option".concat(
				menuItem.shouldBeDisabled()
					? " bx--overflow-menu-options__option--disabled" // class for disabled menu item
					: ""
			);
			overflowMenuHtml += `<li class="${menuItemClasses}">
						<button class="bx--overflow-menu-options__btn" role="menuitem"
							data-floating-menu-primary-focus
							id="${menuItem.id + this.overflowMenuItemId}">
							<div class="bx--overflow-menu-options__option-content">
								${menuItem.text}
							</div>
						</button>
					</li>`;
		});

		overflowMenuHtml += `</ul></div>`;
		return overflowMenuHtml;
	}

	getControlConfigs() {
		const isZoomBarEnabled =
			this.services.zoom.isZoomBarEnabled() &&
			!this.services.zoom.isEmptyState();

		const maxIcons = Tools.getProperty(
			this.model.getOptions(),
			"toolbar",
			"maxIcons"
		);
		const controlsInOrder = Tools.getProperty(
			this.model.getOptions(),
			"toolbar",
			"controlsInOrder"
		);
		const controlList = [];
		controlsInOrder.forEach((control) => {
			let controlConfig;
			switch (control.type) {
				case ToolbarControlTypes.ZOOM_IN:
					if (isZoomBarEnabled) {
						controlConfig = this.getZoomInConfig();
					}
					break;
				case ToolbarControlTypes.ZOOM_OUT:
					if (isZoomBarEnabled) {
						controlConfig = this.getZoomOutConfig();
					}
					break;
				case ToolbarControlTypes.RESET_ZOOM:
					if (isZoomBarEnabled) {
						controlConfig = this.getResetZoomConfig();
					}
					break;

				// add more toolbar controls here

				default:
					throw Error(
						"Not supported toolbar control type: " + control.type
					);
			}

			// add to list if config is valid
			if (controlConfig) {
				controlConfig.text = control.text;
				controlList.push(controlConfig);
			}
		});

		if (controlList.length <= maxIcons) {
			return {
				buttonList: controlList
			};
		} else {
			return {
				// leave one button for overflow button
				buttonList: controlList.splice(0, maxIcons - 1),
				overflowMenuItemList: controlList
			};
		}
	}

	getOverflowMenuItems() {
		const { overflowMenuItemList } = this.getControlConfigs();
		if (!!overflowMenuItemList) {
			return overflowMenuItemList;
		} else {
			return [];
		}
	}

	// add more toolbar control configuration here

	getZoomInConfig() {
		return {
			id: "toolbar-zoomIn",
			shouldBeDisabled: () => this.services.zoom.isMinZoomDomain(),
			iconSVGContent: () => this.getZoomInIconSVGContent(),
			clickFunction: () => this.services.zoom.zoomIn()
		};
	}

	getZoomOutConfig() {
		return {
			id: "toolbar-zoomOut",
			shouldBeDisabled: () => this.services.zoom.isMaxZoomDomain(),
			iconSVGContent: () => this.getZoomOutIconSVGContent(),
			clickFunction: () => this.services.zoom.zoomOut()
		};
	}

	getResetZoomConfig() {
		return {
			id: "toolbar-resetZoom",
			shouldBeDisabled: () => this.services.zoom.isMaxZoomDomain(),
			iconSVGContent: () => this.getResetZoomIconSVGContent(),
			clickFunction: () => this.services.zoom.resetZoomDomain()
		};
	}

	getOverflowButtonConfig() {
		return {
			id: "toolbar-overflow-menu",
			shouldBeDisabled: () => {
				return false;
			},
			iconSVGContent: () => this.getOverflowIconSVGContent(),
			clickFunction: () => this.toggleOverflowMenu()
		};
	}

	// add more icons here
	// svg icon must be with 32x32 viewBox

	getOverflowIconSVGContent() {
		return `<circle cx="16" cy="8" r="2"></circle>
				<circle cx="16" cy="16" r="2"></circle>
				<circle cx="16" cy="24" r="2"></circle>`;
	}

	getZoomInIconSVGContent() {
		return `<polygon points="19 13 15 13 15 9 13 9 13 13 9 13 9 15 13 15 13 19 15 19 15 15 19 15 19 13"/>
    			<path d="M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z"/>`;
	}

	getZoomOutIconSVGContent() {
		return `<rect x="9" y="13" width="10" height="2"/>
				<path d="M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z"/>`;
	}

	getResetZoomIconSVGContent() {
		return `<path d="M22.4478,21A10.855,10.855,0,0,0,25,14,10.99,10.99,0,0,0,6,6.4658V2H4v8h8V8H7.332a8.9768,8.9768,0,1,1-2.1,8H3.1912A11.0118,11.0118,0,0,0,14,25a10.855,10.855,0,0,0,7-2.5522L28.5859,30,30,28.5859Z"/>`;
	}
}
