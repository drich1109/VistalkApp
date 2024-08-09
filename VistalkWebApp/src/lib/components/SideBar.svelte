


<script lang="ts">
    import { goto } from '$app/navigation';
    import { createEventDispatcher } from 'svelte';
    import { page } from '$app/stores';

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
                    <image id="image0_1723_1367" width="500" height="500" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAAAXNSR0IArs4c6QAAIABJREFUeF7t3QeYZFWZ//Hfe241QUCCsqKYFUVF1FVBUUFcd83pb2BVFAVWwiI5MwMDM8AwZIYkwYwYUcSw5sAaVky7iwkUMyZAkDjTdc/779N92+0pqm5191R1V53+1vPwGLh173k/75l565577jkmPggggAACCCAw9AI29BEQAAIIIIAAAgiIgk4nQAABBBBAIAMBCnoGSSQEBBBAAAEEKOj0AQQQQAABBDIQoKBnkERCQAABBBBAgIJOH0AAAQQQQCADAQp6BkkkBAQQQAABBCjo9AEEEEAAAQQyEKCgZ5BEQkAAAQQQQICCTh9AAAEEEEAgAwEKegZJJAQEEEAAAQQo6PQBBBBAAAEEMhCgoGeQREJAAAEEEECAgk4fQAABBBBAIAMBCnoGSSQEBBBAAAEEKOj0AQQQQAABBDIQoKBnkERCQAABBBBAgIJOH0AAAQQQQCADAQp6BkkkBAQQQAABBCjo9AEEEEAAAQQyEKCgZ5BEQkAAAQQQQICCTh9AAAEEEEAgAwEKegZJJAQEEEAAAQQo6PQBBBBAAAEEMhCgoGeQREJAAAEEEECAgk4fQAABBBBAIAMBCnoGSSQEBBBAAAEEKOj0AQQQQAABBDIQoKBnkERCQAABBBBAgIJOH0AAAQQQQCADAQp6BkkkBAQQQAABBCjo9AEEEEAAAQQyEKCgZ5BEQkAAAQQQQICCTh9AAAEEEEAgAwEKegZJJAQEEEAAAQQo6PQBBBBAAAEEMhCgoGeQREJAAAEEEECAgk4fQAABBBBAIAMBCnoGSSQEBBBAAAEEKOj0AQQQQAABBDIQoKBnkERCQAABBBBAgIJOH0AAAQQQQCADAQp6BkkkBAQQQAABBCjo9AEEEEAAAQQyEKCgZ5BEQkAAAQQQQICCTh9AAAEEEEAgAwEKegZJJAQEEEAAAQQo6PQBBBBAAAEEMhCgoGeQREJAAAEEEECAgk4fQAABBBBAIAMBCnoGSSQEBBBAAAEEKOj0AQQQQAABBDIQoKBnkERCQAABBBBAgIJOH0AAAQQQQCADAQp6BkkkBAQQQAABBCjo9AEEEEAAAQQyEKCgZ5BEQkAAAQQQQICCTh9AAAEEEEAgAwEKegZJJAQEEEAAAQQo6PQBBBBAAAEEMhCgoGeQREJAAAEEEECAgk4fQAABBBBAIAMBCnoGSSQEBBBAAAEEKOj0AQQQQAABBDIQoKBnkERCQAABBBBAgIJOH0AAAQQQQCADAQp6BkkkBAQQQAABBCjo9AEEEEAAAQQyEKCgZ5BEQkAAAQQQQICCTh9AAAEEEEAgAwEKegZJJAQEEEAAAQQo6PQBBBBAAAEEMhCgoGeQREJAAAEEEECAgk4fQAABBBBAIAMBCnoGSSQEBBBAAAEEKOj0AQQQQAABBDIQoKBnkERCQAABBBBAgIJOH0AAAQQQQCADAQp6BkkkBAQQQAABBCjo9AEEEEAAAQQyEKCgZ5BEQkAAAQQQQICCTh9AAAEEEEAgAwEKegZJJAQEEEAAAQQo6PQBBBBAAAEEMhCgoGeQREJAAAEEEECAgk4fQAABBBBAIAMBCnoGSSQEBBBAAAEEKOj0AQQQQAABBDIQoKBnkERCQAABBBBAgIJOH0AAAQQQQCADAQp6BkkkBAQQQAABBCjo9AEEEEAAAQQyEKCgZ5BEQkAAAQQQQICCTh9AAAEEEEAgAwEKegZJJAQEEEAAAQQo6PQBBBBAAAEEMhCgoGeQREJAAAEEEECAgk4fQAABBBBAIAMBCnoGSSQEBBBAAAEEKOj0AQQQQAABBDIQoKBnkERCQAABBBBAgIJOH0AAAQQQQCADAQp6BkkkBAQQQAABBCjo9AEEEEAAAQQyEKCgZ5BEQkAAAQQQQICCTh9AAAEEEEAgAwEKegZJJAQEEEAAAQQo6PQBBBBAAAEEMhCgoGeQREJAAAEEEECAgk4fQAABBBBAIAMBCnoGSSQEBBBAAAEEKOj0AQQQQAABBDIQoKBnkERCQAABBBBAgIJOH0AAAQQQQCADAQp6BkkkBAQQQAABBCjo9AEEEEAAAQQyEKCgZ5BEQkAAAQQQQICCTh9AAAEEEEAgAwEKegZJJAQEEEAAAQQo6PQBBBBAAAEEMhCgoGeQREJAAAEEEECAgk4fQAABBBBAIAMBCnoGSSQEBBBAAAEEKOj0AQQQQAABBDIQoKBnkERCQAABBBBAgIJOH0AAAQQQQCADAQp6BkkkBAQQQAABBCjo9AEEEEAAAQQyEKCgZ5BEQkAAAQQQQICCTh9AAAEEEEAgAwEKegZJJAQEEEAAAQQo6PQBBBBAAAEEMhCgoGeQREJAAAEE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BxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCjp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCjp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCjp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCjp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCjp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCjp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCjp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCvMvatoAAAKaSURBVDp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCjp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCjp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCjp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEKCg0wcQQAABBBDIQICCnkESCQEBBBBAAAEKOn0AAQQQQACBDAQo6BkkkRAQQAABBBCgoNMHEEAAAQQQyECAgp5BEgkBAQQQQAABCjp9AAEEEEAAgQwEKOgZJJEQEEAAAQQQoKDTBxBAAAEEEMhAgIKeQRIJAQEEEEAAAQo6fQABBBBAAIEMBCjoGSSREBBAAAEEEPj/zfloA2lZQ+YAAAAASUVORK5CYII="/>
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
                    <span class="nav-text">Dashboard</span>
                {/if}
            </a>
            <a class="nav-link {activePage === '/shop' ? 'active' : ''}" on:click={() => goto('/shop')}>
                <i class="fas fa-box"></i>
                {#if isExpanded}
                    <span class="nav-text">Item</span>
                {/if}
            </a>
            <a class="nav-link {activePage === '/contents' ? 'active' : ''}"  on:click={() => goto('/contents')}>
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
