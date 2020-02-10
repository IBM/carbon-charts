export const setOrUpdateParam = (name, value) => {
    const params = new URLSearchParams(location.search)

    // Remove any existing "theme" param
    if (params.has(name)) {
        params.delete(name);
    }

    params.append(name, value);

    location.search = params.toString();
};

// Theme selector
const initializeThemeSelector = () => {
    const dropdownOptions = Array.prototype.slice.call(
        document.querySelectorAll("div.theme-selector a.bx--dropdown-link")
    );

    // Set click listeners for the dropdown options
    dropdownOptions.forEach(dropdownOption => {
        dropdownOption.addEventListener("click", e => {
            e.preventDefault();

            setOrUpdateParam("theme", e.target.parentNode.getAttribute("data-value"));
        });
    });

    // Set state for current theme
	const params = new URLSearchParams(location.search);
	if (params.has("theme")) {
		const themeName = params.get("theme");

		if (themeName !== "DEFAULT") {
			// Add theme CSS bundle
			const linkElement = document.createElement("link");
			linkElement.setAttribute("rel", "stylesheet");
			linkElement.setAttribute("type", "text/css");
			linkElement.setAttribute("href", `styles-${themeName}.css`);
			document.head.appendChild(linkElement);

			// Add classname to body for demo site theming
			document.body.classList.add(`carbon--dark-${themeName}`);
		}

		// Update selected dropdown item
		const dropdownDefaultOption = document.querySelector("div.theme-selector li.bx--dropdown-text");
		const selectedOption = dropdownOptions.find(option => option.parentNode.getAttribute("data-value") === themeName);
		dropdownDefaultOption.innerHTML = selectedOption.innerText;
	}
};

export const initializeDemoOptions = () => {
    initializeThemeSelector();
};
