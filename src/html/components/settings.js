const gui = `
<div class="tu-settings-gui tw-overflow-hidden tw-border-1 tw-absolute tw-c-background tw-elevation-4 tw-hide">
	<div class="tu-settings-header tw-flex tw-theme--dark tw-justify-content-between tw-pd-1 tw-border-b">
		<div class="tw-flex tw-flex-row tw-c-text">
			<figure class="tw-svg tw-mg-r-1">
				<svg class="tw-svg__asset tw-svg__asset--close tw-svg__asset--inherit" width="32px" height="32px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px">
					<path d="M9.76,2.904v8.527H6.241V2.904H1.056V0.472h13.887v2.433H9.76z"></path>
					<path d="M11.425,4.569h3.52v10.959H5.631c-0.672,0-1.289-0.076-1.855-0.232c-0.564-0.154-1.048-0.383-1.447-0.688 c-0.4-0.305-0.712-0.68-0.937-1.127c-0.224-0.449-0.336-0.961-0.336-1.537V4.569h3.521v7.135c0,0.459,0.145,0.807,0.432,1.041 s0.703,0.352,1.248,0.352h5.169V4.569z"></path>
				</svg>
			</figure>
			<h2 style="line-height:42px;">Twitch Utils</h2>
		</div>
		<div class="tw-flex">
			<button class="tu-settings-close tw-button-icon" data-toggle="tu-settings-gui">
				<span class="tw-button-icon__icon">
					<figure class="tw-svg">
						<svg class="tw-svg__asset tw-svg__asset--close tw-svg__asset--inherit" width="32px" height="32px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px">
							<path d="M8 6.586L3.757 2.343 2.343 3.757 6.586 8l-4.243 4.243 1.414 1.414L8 9.414l4.243 4.243 1.414-1.414L9.414 8l4.243-4.243-1.414-1.414" fill-rule="evenodd"></path>
						</svg>
					</figure>
				</span>
			</button>
		</div>
	</div>
	<ul class="tu-settings-tab-container tw-flex tw-c-background-alt-2">
	</ul>
	<div class="tu-settings-main">
	</div>
</div>`;

export const tab = `
<li class="tw-pd-1 tw-mg-l-1 tw-mg-t-1 tw-border-l tw-border-t tw-border-r">
</li>`;

export const tabContent = `
<div class="tab-content scrollable-area" data-simplebar>
	<div class="simplebar-scroll-content">
		<div class="simplebar-content">
			<div class="tw-pd-1">
			</div>
		</div>
	</div>
</div>`;

export function checkbox(name, label, desc, def) {
    let checkbox = `
	<div class="tw-mg-b-1">
		<div class="tw-checkbox tw-pd-1">
			<input type="checkbox" class="tw-checkbox__input" id="${name}">
			<label class="tw-checkbox__label" for="${name}">${label}</label>

		</div>
		<p class="tw-pd-l-3 tu-settings-desc">${desc}</p>
	</div>`;
	return checkbox;
}

export function section(name, n) {
	let sectionBreak;
	if (n > 1) {
		sectionBreak = `<div class="tw-border-t tw-mg-b-1"></div>`;
	}
	let heading = `<h3>${name}</h3>`;

	return sectionBreak ? sectionBreak + heading : heading;
}

export default {
    gui,
    tab,
    tabContent,
    checkbox
};
