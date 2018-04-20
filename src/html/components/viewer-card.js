const age = '<p id="viewer-card__profile-age">Created on: loading..</p>';

const history = `<div class="tw-flex">
	<div class="tw-flex tw-absolute">
		<button class="tw-flex" id="tmt-name-history-button" data-toggle="tmt-name-history-balloon">
			<figure class="tw-svg">
				<svg class="tw-svg__asset tw-svg__asset--glypharrdown tw-svg__asset--inherit" width="16px" height="16px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px">
					<path d="M3 5h10l-5 6"></path>
				</svg>
			</figure>
		</button>
		<div class="tw-balloon tw-balloon tw-balloon--down tw-balloon--right tw-block tw-absolute tmt-hidden" id="tmt-name-history-balloon">
			<div class="tw-balloon__tail tw-overflow-hidden tw-absolute">
				<div class="tw-balloon__tail-symbol tw-border-t tw-border-r tw-border-b tw-border-l tw-border-radius-small tw-c-background tw-absolute"></div>
			</div>
			<div class="tw-border-t tw-border-r tw-border-b tw-border-l tw-elevation-1 tw-border-radius-small tw-c-background">
				<div class="tw-c-text tw-flex tw-flex-wrap tw-pd-1">
					<div id="tmt-name-history-list">
						<h5>Name History</h5>
						<p class="tw-pd-l-1">loading...</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`;

export default {
    age,
    history
};
