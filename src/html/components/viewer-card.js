const age = `
<div class="tu-channel-data tw-flex-row">
	<div class="tw-inline-flex">
		<div class="tw-tooltip-wrapper tw-inline-flex">
			<figure class="tw-svg">
				<svg class="tw-svg__asset tw-svg__asset--inherit tw-svg__asset--heart" width="16px" height="16px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px">
				<path clip-rule="evenodd" d="M8,15c-3.866,0-7-3.134-7-7s3.134-7,7-7s7,3.134,7,7S11.866,15,8,15z M8,3C5.238,3,3,5.238,3,8s2.238,5,5,5s5-2.238,5-5S10.762,3,8,3z M7.293,8.707L7,8l1-4l0.902,3.607L11,11L7.293,8.707z" fill-rule="evenodd"></path>
			</figure>
			<div class="tw-tooltip tw-tooltip--up tw-tooltip--align-left tu-created-on" data-a-target="tw-tooltip-label" role="tooltip"></div>
		</div>
		<span class="viewer-card__profile-age tw-align-top tw-pd-l-05"></span>
	</div>
	<div class="tw-inline-flex">
		<div class="tw-tooltip-wrapper tw-inline-flex">
			<figure class="tw-svg">
				<svg class="tw-svg__asset tw-svg__asset--inherit tw-svg__asset--heart" width="16px" height="16px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px">
					<path clip-rule="evenodd" d="M8,14L1,7V4l2-2h3l2,2l2-2h3l2,2v3L8,14z" fill-rule="evenodd"></path>
				</svg>
			</figure>
			<div class="tw-tooltip tw-tooltip--up tw-tooltip--align-left" data-a-target="tw-tooltip-label" role="tooltip">Folowers</div>
		</div>
		<span class="viewer-card__followers tw-align-top tw-pd-l-05"></span>
	</div>
	<div class="tw-inline-flex">
		<div class="tw-tooltip-wrapper tw-inline-flex">
			<figure class="tw-svg">
				<svg class="tw-svg__asset tw-svg__asset--glyphviews tw-svg__asset--inherit" width="16px" height="16px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px">
					<path clip-rule="evenodd" d="M11,13H5L1,9V8V7l4-4h6l4,4v1v1L11,13z M8,5C6.344,5,5,6.343,5,8c0,1.656,1.344,3,3,3c1.657,0,3-1.344,3-3C11,6.343,9.657,5,8,5z M8,9C7.447,9,7,8.552,7,8s0.447-1,1-1s1,0.448,1,1S8.553,9,8,9z" fill-rule="evenodd"></path>
				</svg>
			</figure>
			<div class="tw-tooltip tw-tooltip--up tw-tooltip--align-left" data-a-target="tw-tooltip-label" role="tooltip">Channel Views</div>
		</div>
		<span class="viewer-card__views tw-align-top tw-pd-l-05"></span>
	</div>
</div>`;

const tuCard = `
<div class="tu-viewer-card tw-mg-l-1 tw-align-left">
	<div class="tw-flex tw-flex-row">
		<h4 class="tw-c-text-overlay tw-flex">
			<a class="tu-viewer-card-link tw-link tw-link--hover-underline-none tw-link--inherit" target="_blank" href=""></a>
		</h4>
		<div class="tw-flex">
			<div class="tw-flex tw-absolute">
				<div class="tw-tooltip-wrapper tw-inline-flex">
					<button class="tw-flex tu-name-history-button" data-toggle="tu-name-history-balloon">
						<figure class="tw-svg">
							<svg class="tw-svg__asset tw-svg__asset--glypharrdown tw-svg__asset--inherit" width="16px" height="16px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px">
								<path d="M3 5h10l-5 6"></path>
							</svg>
						</figure>
					</button>
					<div class="tw-tooltip tw-tooltip--up tw-tooltip--align-left" data-a-target="tw-tooltip-label" role="tooltip">Name History</div>
				</div>
				<div class="tw-balloon tw-balloon tw-balloon--down tw-balloon--center tw-block tw-absolute tw-hide tu-name-history-balloon">
					<div class="tw-balloon__tail tw-overflow-hidden tw-absolute" style="height: 6px">
						<div class="tw-balloon__tail-symbol tw-border-t tw-border-r tw-border-b tw-border-l tw-border-radius-small tw-c-background tw-absolute"></div>
					</div>
					<div class="tw-border-t tw-border-r tw-border-b tw-border-l tw-elevation-1 tw-border-radius-small tw-c-background">
						<div class="tw-c-text tw-flex tw-flex-wrap tw-pd-1">
							<div class="tu-name-history-list">
								<h5>Name History</h5>
								<p class="tw-pd-l-1">loading...</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<p class="tu-channel-data-placeholder">Channel data loading...</p>
</div>`;

export default {
    age,
    tuCard
};