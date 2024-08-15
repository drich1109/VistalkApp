<script lang="ts">
    import { goto } from '$app/navigation';
    import { createEventDispatcher } from 'svelte';
    import { page } from '$app/stores';
    import { loggedInUser } from '$lib/store'; 

    $: activePage = $page.url.pathname;

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

{#if $loggedInUser}
<aside class="sidebar {isExpanded ? 'expanded' : 'collapsed'}">
    <div class="sidebar-content">
        <div class="sidebar-header">
          
            <div class="flex items-justify justify-center gap-4">
                <svg width="45" height="45" viewBox="0 0 201 191" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin-top: 27px;">
                    <path d="M199.617 95.2774C199.617 147.297 155.204 189.555 100.309 189.555C45.4129 189.555 1 147.297 1 95.2774C1 43.2573 45.4129 1 100.309 1C155.204 1 199.617 43.2573 199.617 95.2774Z" stroke="white" stroke-width="2"/>
                    <path d="M191.592 95.2774C191.592 143.088 150.772 181.933 100.308 181.933C49.8446 181.933 9.02454 143.088 9.02454 95.2774C9.02454 47.4669 49.8446 8.62219 100.308 8.62219C150.772 8.62219 191.592 47.4669 191.592 95.2774Z" stroke="white" stroke-width="2"/>
                    <rect y="4" width="197" height="183" fill="url(#pattern0_1723_1367)"/>
                    <defs>
                    <pattern id="pattern0_1723_1367" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_1723_1367" transform="matrix(0.002 0 0 0.00215301 0 -0.0382514)"/>
                    </pattern>
                   
                    </defs>
                    </svg>
                    {#if isExpanded}
                        <span class="title text-white text-4xl text-center font-bold mt-8">Vistalk</span>
                    {/if}
            </div>
           
            <button class="toggle-button" on:click={toggleSidebar}>
                {#if isExpanded}
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 50 50">
                    <path fill="white" d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"/>
                    <path fill="white" d="M25.3 34.7L15.6 25l9.7-9.7l1.4 1.4l-8.3 8.3l8.3 8.3z"/>
                    <path fill="white" d="M17 24h17v2H17z"/>
                </svg>
                {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 50 50">
                    <path fill="white" d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"/>
                      <path fill="white" d="M24.7 15.3L34.4 25l-9.7 9.7l-1.4-1.4l8.3-8.3l-8.3-8.3z"/>
                    <path fill="white" d="M17 24h17v2H17z"/>
                </svg>
                {/if}
            </button>
        </div>

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <nav class="navigation">
            <a class="nav-link" on:click={() => goto('/dashboard')}>
                <i class="fas fa-tachometer-alt"></i>
                {#if isExpanded}
                    <span class="nav-text ">Dashboard</span>
                {/if}
            </a>
            <a class="nav-link {activePage === '/user' ? 'active' : ''}" on:click={() => goto('/user')}>
                <i class="fas fa-box"></i>
                {#if isExpanded}
                    <span class="nav-text">User</span>
                {/if}
            </a>
            <a class="nav-link {activePage === '/contents' ? 'active' : ''}"  on:click={() => goto('/contents')}>
                <i class="fas fa-book"></i>
                {#if isExpanded}
                    <span class="nav-text">Contents</span>
                {/if}
            </a>
            <a class="nav-link {activePage === '/section' ? 'active' : ''}" on:click={() => goto('/section')}>
                <i class="fas fa-list"></i>
                {#if isExpanded}
                    <span class="nav-text">Section</span>
                {/if}
            </a>
            <a class="nav-link {activePage === '/question' ? 'active' : ''}"  on:click={() => goto('/question')}>
                <i class="fas fa-question"></i>
                {#if isExpanded}
                    <span class="nav-text">Question</span>
                {/if}
            </a>

            <a class="nav-link {activePage === '/shop' ? 'active' : ''}"  on:click={() => goto('/shop')}>
                <i class="fas fa-shop"></i>
                {#if isExpanded}
                    <span class="nav-text">Shop</span>
            <a class="nav-link {activePage === '/questionTemplate' ? 'active' : ''}"  on:click={() => goto('/questionTemplate')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path fill="currentColor" d="M11 8.018a.75.75 0 0 1-.75.732c-.75 0-.75-.751-.75-.751V7.99a1 1 0 0 1 .008-.134a2.2 2.2 0 0 1 .42-1.067c.454-.613 1.27-1.062 2.585-1.039c.95.017 1.793.415 2.321 1.07c.537.667.718 1.57.362 2.459c-.362.905-1.181 1.265-1.652 1.471l-.05.023c-.28.123-.413.187-.493.251l-.001.001v.724a.75.75 0 0 1-1.5.001V11c0-.523.252-.897.563-1.147c.25-.2.565-.338.786-.436l.038-.017c.542-.239.8-.387.917-.679a.92.92 0 0 0-.138-.96c-.222-.275-.629-.502-1.179-.511c-.935-.016-1.245.285-1.353.432a.7.7 0 0 0-.134.33zm1.25 7.482a1 1 0 1 0 0-2a1 1 0 0 0 0 2M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5zm1.5 0V18H19V4.5a1 1 0 0 0-1-1H6.5a1 1 0 0 0-1 1"/></svg>
                {#if isExpanded}
                    <span class="nav-text">Question Template</span>
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

{/if}

<style>
    .sidebar {
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #99BC85;
        overflow: visible;
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
    position: absolute;
    right: -15px; /* Adjust based on how much you want to hang */
    top: 7%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: #99BC85; /* Match with sidebar color */
    border-radius: 50%;
    z-index: 9999;
}

.toggle-button:hover {
    color: #e0e0e0;
}

.toggle-button svg {
    width: 1.5em;
    height: 1.5em;
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
        cursor:pointer;
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

    .nav-link.active {
    background-color: #151515; /* Bright green color */
    }
</style>
