const actions = `
<div class="tw-c-background-alt-2 tw-border-t tw-full-width tw-flex tw-justify-content-between tu-tools">
    <div class="tw-inline-flex tw-flex-row">
        <div class="tw-inline-flex">
            <button class="tw-button-icon">
                <span class="tw-button__text tu-timeout" data-tu-timeout="1">Purge</span>
            </button>
        </div>
    </div>
    <div class="tw-inline-flex tw-flex-row">
        <div class="tw-inline-flex">
            <button class="tw-button-icon tu-timeout" data-tu-timeout="300">
                <span class="tw-button__text">5m</span>
            </button>
            <button class="tw-button-icon tu-timeout" data-tu-timeout="600">
                <span class="tw-button__text">10m</span>
            </button>
            <button class="tw-button-icon tu-timeout" data-tu-timeout="3600">
                <span class="tw-button__text">1h</span>
            </button>
            <button class="tw-button-icon tu-timeout" data-tu-timeout="43200">
                <span class="tw-button__text">12h</span>
            </button>
            <button class="tw-button-icon tu-timeout" data-tu-timeout="86400">
                <span class="tw-button__text">1d</span>
            </button>
            <button class="tw-button-icon tu-timeout" data-tu-timeout="604800">
                <span class="tw-button__text">1w</span>
            </button>
        </div>
    </div>
</div>

<div class="tw-c-background tw-full-width tw-flex">
    <div class="tw-inline-flex tw-flex-row">
        <div class="tw-inline-flex tw-pd-1">
            <select class="tu-ban-reason">
                <option value="">Select a Ban Reason</option>
                <option value="One-Man Spam">1) One-Man Spam</option>
                <option value="Posting Bad Links">2) Posting Bad Links</option>
                <option value="Ban Evasion">3) Ban Evasion</option>
                <option value="Threats / Personal Info">4) Threats / Personal Info</option>
                <option value="Hate / Harassment">5) Hate / Harassment</option>
                <option value="Ignoring Broadcaster / Moderators">6) Ignoring Broadcaster / Moderators</option>
            </select>
        </div>
    </div>
</div>`;

export default {
    actions
};
