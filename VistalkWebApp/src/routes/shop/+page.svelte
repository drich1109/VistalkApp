<script lang="ts">
    import { redirectIfLoggedIn } from '$lib/shortcuts';
    import { onMount } from 'svelte';

    onMount(async () => {
        await redirectIfLoggedIn(''); // Redirect to login if not logged in
    });
</script>

test