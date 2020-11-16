// Internal Imports
import { Component } from "../component";
import { Events, Roles, ToolbarControlTypes } from "../../interfaces";
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
			this.updateOverflowMenu(false)
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
		const parentY = parseFloat(this.parent.node().getAttribute("y"));

		const svg = this.getContainerSVG();

		// TODO -- adjust toolbar Y position to align title component
		// before layout component supports vertical alignment center
		const Y_OFFSET = -6;
		svg.attr("transform", `translate(0, ${parentY + Y_OFFSET})`);

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
		this.overflowMenuY = parentY + Y_OFFSET + buttonSize;
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
				// button container
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
					.attr("viewBox", "0 0 32 32")
					.attr("role", Roles.IMG);

				buttonIcon.html(button.iconSVGContent);
				if (button.shouldBeDisabled && button.shouldBeDisabled()) {
					buttonContainer
						.classed("toolbar-button--disabled", true)
						.classed("toolbar-button--focusable", false)
						.attr("tabindex", -1)
						.attr("role", null);
					buttonIcon.classed("toolbar-button-icon--disabled", true);
					buttonBackground.classed(
						"toolbar-button-background--disabled",
						true
					);
					buttonContainer.on("click", null).on("keyup", null);
				} else {
					buttonContainer
						.classed("toolbar-button--disabled", false)
						.classed("toolbar-button--focusable", true)
						.attr("tabindex", 0)
						.attr("role", Roles.BUTTON);
					buttonIcon.classed("toolbar-button-icon--disabled", false);
					buttonBackground.classed(
						"toolbar-button-background--disabled",
						false
					);
					buttonContainer
						.on("click", button.clickFunction)
						.on("keyup", () => {
							if (
								(event.key && event.key === "Enter") ||
								event.key === " "
							) {
								event.preventDefault();

								button.clickFunction();
							}
						});
				}
				buttonXPosition += buttonSize;
			});

			this.overflowButton = this.getContainerSVG().select(
				"svg.toolbar-overflow-menu"
			);

			if (this.isOverflowMenuOpen()) {
				// keep overflow menu displayed
				this.updateOverflowMenu(true);
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
	updateOverflowMenu(show: boolean) {
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

	focusOnPreviousEnabledMenuItem(currentItemIndex) {
		const overflowMenuItems = this.getOverflowMenuItems();
		let previousItemIndex = overflowMenuItems.length;
		for (let i = currentItemIndex - 1; i >= 0; i--) {
			const previousOverflowMenuItem = overflowMenuItems[i];
			if (!previousOverflowMenuItem.shouldBeDisabled()) {
				previousItemIndex = i;
				break;
			}
		}
		// only if previous enabled menu item found
		if (previousItemIndex < overflowMenuItems.length) {
			const previousItemNode = select(
				"#" +
					overflowMenuItems[previousItemIndex].id +
					this.overflowMenuItemId
			).node();
			if ("focus" in previousItemNode) {
				previousItemNode.focus();
			}
		}
	}

	focusOnNextEnabledMenuItem(currentItemIndex) {
		const overflowMenuItems = this.getOverflowMenuItems();
		let nextItemIndex = -1;
		for (let i = currentItemIndex + 1; i < overflowMenuItems.length; i++) {
			const nextOverflowMenuItem = overflowMenuItems[i];
			if (!nextOverflowMenuItem.shouldBeDisabled()) {
				nextItemIndex = i;
				break;
			}
		}
		// only if next enabled menu item found
		if (nextItemIndex > -1) {
			const nextItemNode = select(
				"#" +
					overflowMenuItems[nextItemIndex].id +
					this.overflowMenuItemId
			).node();
			if ("focus" in nextItemNode) {
				nextItemNode.focus();
			}
		}
	}

	toggleOverflowMenu() {
		if (this.isOverflowMenuOpen()) {
			// hide overflow menu
			this.updateOverflowMenu(false);
		} else {
			// show overflow menu
			this.updateOverflowMenu(true);

			// setup overflow menu item event listener
			const self = this;
			const overflowMenuItems = this.getOverflowMenuItems();
			overflowMenuItems.forEach((menuItem, index) => {
				const element = select(
					"#" + menuItem.id + this.overflowMenuItemId
				);
				if (element !== null) {
					element.on("click", () => {
						// call the specified function
						menuItem.clickFunction();

						// hide overflow menu
						self.updateOverflowMenu(false);
					});
					element.on("keyup", () => {
						if (event.key === "Enter") {
							// call the specified function
							menuItem.clickFunction();
						} else if (event.key === "ArrowUp") {
							// focus on previous menu item
							self.focusOnPreviousEnabledMenuItem(index);
						} else if (event.key === "ArrowDown") {
							// focus on next menu item
							self.focusOnNextEnabledMenuItem(index);
						}
						// Not hide overflow menu by keyboard arrow up/down event
					});
				}
			});

			// default to focus on the first enabled menu item
			self.focusOnNextEnabledMenuItem(-1);
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
				tabindex="-1" role="${Roles.MENU}" aria-label="Menu" data-floating-menu-direction="bottom"
				style="left:${this.overflowMenuX}px; top:${this.overflowMenuY}px;">`;

		// generate html for each overflow menu items
		overflowMenuItems.forEach((menuItem, index) => {
			const menuItemClasses = "bx--overflow-menu-options__option".concat(
				menuItem.shouldBeDisabled()
					? " bx--overflow-menu-options__option--disabled" // class for disabled menu item
					: ""
			);
			overflowMenuHtml += `<li class="${menuItemClasses}" role="${
				Roles.MENU_ITEM
			}">
				<button class="bx--overflow-menu-options__btn"
					data-floating-menu-primary-focus="${index === 0}"
					tabindex="-1" index="${index}" title="${menuItem.text}"
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
		const numberOfIcons = Tools.getProperty(
			this.model.getOptions(),
			"toolbar",
			"numberOfIcons"
		);
		const controls = Tools.getProperty(
			this.model.getOptions(),
			"toolbar",
			"controls"
		);
		const controlList = [];
		controls.forEach((control) => {
			const controlConfig = this.getControlConfigByType(control.type);

			// add to list if config is valid
			if (controlConfig) {
				controlConfig.text = control.text ? control.text : control.type;
				controlList.push(controlConfig);
			}
		});

		if (controlList.length <= numberOfIcons) {
			return {
				buttonList: controlList
			};
		}

		return {
			// leave one button for overflow button
			buttonList: controlList.splice(0, numberOfIcons - 1),
			overflowMenuItemList: controlList
		};
	}

	getOverflowMenuItems() {
		const { overflowMenuItemList } = this.getControlConfigs();
		if (!!overflowMenuItemList) {
			return overflowMenuItemList;
		} else {
			return [];
		}
	}

	// special button config for overflow button
	getOverflowButtonConfig() {
		return {
			id: "toolbar-overflow-menu",
			shouldBeDisabled: () => false,
			iconSVGContent: `<circle cx="16" cy="8" r="2"></circle>
							 <circle cx="16" cy="16" r="2"></circle>
							 <circle cx="16" cy="24" r="2"></circle>`,
			clickFunction: () => this.toggleOverflowMenu()
		};
	}

	getControlConfigByType(controlType: ToolbarControlTypes) {
		const isZoomBarEnabled =
			this.services.zoom.isZoomBarEnabled() &&
			!this.services.zoom.isEmptyState();

		let controlConfig;
		switch (controlType) {
			case ToolbarControlTypes.ZOOM_IN:
				if (isZoomBarEnabled) {
					controlConfig = {
						id: "toolbar-zoomIn",
						shouldBeDisabled: () =>
							this.services.zoom.isMinZoomDomain(),
						iconSVGContent: this.getControlIconByType(controlType),
						clickFunction: () => this.services.zoom.zoomIn()
					};
				}
				break;
			case ToolbarControlTypes.ZOOM_OUT:
				if (isZoomBarEnabled) {
					controlConfig = {
						id: "toolbar-zoomOut",
						shouldBeDisabled: () =>
							this.services.zoom.isMaxZoomDomain(),
						iconSVGContent: this.getControlIconByType(controlType),
						clickFunction: () => this.services.zoom.zoomOut()
					};
				}
				break;
			case ToolbarControlTypes.RESET_ZOOM:
				if (isZoomBarEnabled) {
					controlConfig = {
						id: "toolbar-resetZoom",
						shouldBeDisabled: () =>
							this.services.zoom.isMaxZoomDomain(),
						iconSVGContent: this.getControlIconByType(controlType),
						clickFunction: () =>
							this.services.zoom.resetZoomDomain()
					};
				}
				break;
			case ToolbarControlTypes.MAKE_FULLSCREEN:
				controlConfig = {
					id: "toolbar-makefullscreen",
					iconSVGContent: this.getControlIconByType(controlType),
					shouldBeDisabled: () => false,
					clickFunction: () => {
						this.services.domUtils.toggleFullscreen();
					}
				};
				break;
			case ToolbarControlTypes.SHOW_AS_DATATABLE:
				controlConfig = {
					id: "toolbar-showasdatatable",
					iconSVGContent: this.getControlIconByType(controlType),
					shouldBeDisabled: false,
					clickFunction: () =>
						this.services.events.dispatchEvent(Events.Modal.SHOW)
				};
				break;
			default:
				throw Error(
					"Not supported toolbar control type: " + controlType
				);
		}
		return controlConfig;
	}

	getControlIconByType(controlType: ToolbarControlTypes) {
		switch (controlType) {
			case ToolbarControlTypes.ZOOM_IN:
				return `<polygon points="19 13 15 13 15 9 13 9 13 13 9 13 9 15 13 15 13 19 15 19 15 15 19 15 19 13"/>
    					<path d="M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z"/>`;
			case ToolbarControlTypes.ZOOM_OUT:
				return `<rect x="9" y="13" width="10" height="2"/>
						<path d="M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z"/>`;
			case ToolbarControlTypes.RESET_ZOOM:
				return `<path d="M22.4478,21A10.855,10.855,0,0,0,25,14,10.99,10.99,0,0,0,6,6.4658V2H4v8h8V8H7.332a8.9768,8.9768,0,1,1-2.1,8H3.1912A11.0118,11.0118,0,0,0,14,25a10.855,10.855,0,0,0,7-2.5522L28.5859,30,30,28.5859Z"/>`;
			case ToolbarControlTypes.MAKE_FULLSCREEN:
				return `<polygon points="21 2 21 4 26.59 4 17 13.58 18.41 15 28 5.41 28 11 30 11 30 2 21 2"/><polygon points="15 18.42 13.59 17 4 26.59 4 21 2 21 2 30 11 30 11 28 5.41 28 15 18.42"/>`;
			case ToolbarControlTypes.SHOW_AS_DATATABLE:
				return `<rect x="4" y="6" width="18" height="2"/><rect x="4" y="12" width="18" height="2"/><rect x="4" y="18" width="18" height="2"/><rect x="4" y="24" width="18" height="2"/><rect x="26" y="6" width="2" height="2"/><rect x="26" y="12" width="2" height="2"/><rect x="26" y="18" width="2" height="2"/><rect x="26" y="24" width="2" height="2"/>`;
			default:
				throw Error(
					"Not supported toolbar control type: " + controlType
				);
		}
	}
}
