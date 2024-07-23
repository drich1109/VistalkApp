<script lang="ts">
    import { onMount } from 'svelte';
    import type { SampleType } from './type';
    import { getSampleItems } from './repo';

    let data:SampleType[] = [];

    onMount(async () => {
        data = await getSampleItems();
    });
</script>

<h1>Sample Item Type</h1>
<ul>
    {#each data as item}
        <li>{item.name}</li>
    {/each}
</ul>
