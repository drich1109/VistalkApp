<script lang="ts">
    import { goto } from '$app/navigation';
    import { createEventDispatcher } from 'svelte';

    let isExpanded = true;
    const dispatch = createEventDispatcher();

    // Toggle sidebar expansion
    function toggleSidebar() {
        isExpanded = !isExpanded;
        dispatch('toggleSidebar', isExpanded);
    }

    // Logout function
    async function handleLogout() {
        dispatch('logout');
        goto('/'); // Redirect to login after logout
    }
</script>

<aside class="sidebar {isExpanded ? 'expanded' : 'collapsed'}">
    <div class="sidebar-content">
        <div class="sidebar-header">
            {#if isExpanded}
                <span class="title">Vistalk</span>
            {/if}
            <button class="toggle-button" on:click={toggleSidebar}>
                {#if isExpanded}
                    &times; <!-- Close icon -->
                {:else}
                    &#9776; <!-- Menu icon -->
                {/if}
            </button>
        </div>

        <nav class="navigation">
            <a class="nav-link" on:click={() => goto('/dashboard')}>
                <i class="fas fa-tachometer-alt"></i>
                {#if isExpanded}
                    <span class="nav-text">Dashboard</span>
                {/if}
            </a>
            <a class="nav-link" on:click={() => goto('/shop')}>
                <i class="fas fa-box"></i>
                {#if isExpanded}
                    <span class="nav-text">Item</span>
                {/if}
            </a>
            <a class="nav-link" on:click={() => goto('/contents')}>
                <i class="fas fa-book"></i>
                {#if isExpanded}
                    <span class="nav-text">Contents</span>
                {/if}
            </a>
            <a class="nav-link" on:click={() => goto('/language')}>
                <i class="fas fa-language"></i>
                {#if isExpanded}
                    <span class="nav-text">Language</span>
                {/if}
            </a>
            <a class="nav-link" on:click={() => goto('/section')}>
                <i class="fas fa-list"></i>
                {#if isExpanded}
                    <span class="nav-text">Section</span>
                {/if}
            </a>
            <a class="nav-link" on:click={() => goto('/units')}>
                <i class="fas fa-th"></i>
                {#if isExpanded}
                    <span class="nav-text">Units</span>
                {/if}
            </a>
        </nav>

        <button class="button is-light logout-button" on:click={handleLogout}>
            <i class="fas fa-sign-out-alt"></i>
            {#if isExpanded}
                <span class="logout-text">Log Out</span>
            {/if}
        </button>
    </div>
</aside>


<style>
    .sidebar {
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #99BC85;
        overflow: hidden;
        z-index: 1000;
        transition: width 0.3s ease, padding 0.3s ease;
    }

    .sidebar.expanded {
        width: 250px;
    }

    .sidebar.collapsed {
        width: 80px;
    }

    .sidebar-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 20px;
        color: white;
        font-family: 'Arial', sans-serif;
        transition: opacity 0.3s ease;
    }

    .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .title {
        font-size: 1.2em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .toggle-button {
        background: none;
        border: none;
        color: white;
        font-size: 1.5em;
        cursor: pointer;
        transition: color 0.3s ease;
    }

    .toggle-button:hover {
        color: #e0e0e0;
    }

    .navigation {
        display: flex;
        flex-direction: column;
    }

    .nav-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: white;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 10px;
        transition: background-color 0.3s ease;
    }

    .nav-link i {
        font-size: 1.2em;
        margin-right: 10px;
    }

    .nav-text {
        display: inline;
    }

    .nav-link:hover {
        background-color: #8aab72;
    }

    .logout-button {
        display: flex;
        align-items: center;
        margin-top: auto;
        background-color: white;
        color: #99BC85;
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 1em;
        transition: background-color 0.3s ease;
    }

    .logout-button i {
        font-size: 1.2em;
        margin-right: 10px;
    }

    .logout-text {
        display: inline;
    }

    .logout-button:hover {
        background-color: #e0e0e0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .sidebar {
            width: 100%;
            height: auto;
            position: relative;
        }

        .sidebar.expanded {
            width: 100%;
        }

        .sidebar.collapsed {
            width: 100%;
        }
    }
</style>
