<script lang="ts">
	export let itemControlWidth = "inherit";
</script>

<div class="setting-item">
	<div class="setting-item-info">
		<div class="setting-item-name">
			<slot name="name" />
		</div>
		<div class="setting-item-description">
			<slot name="description" />
		</div>
	</div>
	<div class="setting-item-control" style="width: {itemControlWidth}%;">
		<slot name="control" />
	</div>
</div>
