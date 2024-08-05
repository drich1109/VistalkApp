<script lang="ts">
    import SideBar from '$lib/components/SideBar.svelte';
    import { getLoggedInUser } from '$lib/auth/oidcService';
    import { onMount } from 'svelte';
    import { loggedInUser } from '$lib/store';
    import '../app.css';
    import type { LoggedInUser } from '../types/types';

    let user: LoggedInUser | null = null;

    async function getUser() {
        user = await getLoggedInUser();
    }

    onMount(() => {
        getUser();
    });

    function logout(): void {
        loggedInUser.set(null);        
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }

    let isSidebarExpanded = true;

    // Function to handle sidebar toggle
    function handleSidebarToggle() {
        isSidebarExpanded = !isSidebarExpanded;
    }
</script>
{#if $loggedInUser}
<div class="layout">
    <SideBar on:logout={logout} on:toggleSidebar={handleSidebarToggle} />
    <main class="content" class:collapsed={!isSidebarExpanded} class:expanded={isSidebarExpanded}>
        <slot />
    </main>
</div>
{:else}
<slot />
{/if}
<style>
    .layout {
        display: flex;
        height: 100vh;
    }

    .content {
        flex: 1;
        transition: margin-left 0.3s ease;
        padding: 20px;
        background-color: #f4f4f4;
    }

    .content.collapsed {
        margin-left: 80px;
    }

    .content.expanded {
        margin-left: 250px;
    }
</style>
