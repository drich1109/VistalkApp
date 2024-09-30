<script lang="ts">
    import { goto } from '$app/navigation';
    import { createEventDispatcher } from 'svelte';
    import { page } from '$app/stores';
    import { loggedInUser } from '$lib/store'; 

    $: activePage = $page.url.pathname;

    let isExpanded = false; // Set initial state
    let isMenuOpen = false;
    let contentMarginTop = '0px'; // Initial margin for the main content

    const dispatch = createEventDispatcher();

    function toggleSidebar() {
        isExpanded = !isExpanded;
        dispatch('toggleNavbar', isExpanded);
        adjustContentMargin();
    }

    // Toggle burger menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        adjustContentMargin();
    }

    // Close the menu
    function closeMenu() {
        if (isMenuOpen) {
            toggleMenu(); // Close the menu
        }
    }

    // Adjust content margin based on menu state
    function adjustContentMargin() {
        contentMarginTop = isMenuOpen ? '60px' : '0px'; // Adjust '60px' based on the height of the top bar
    }

    // Logout function
    async function handleLogout() {
        dispatch('logout');
        goto('/'); // Redirect to login after logout
    }

    // Navigate and close the menu
    function navigateAndClose(path: string) {
        goto(path);
        closeMenu();
    }
</script>

{#if $loggedInUser}
    <aside class="navbar {isExpanded ? 'expanded' : 'collapsed'}">
        <div class="navbar-content">
            <div class="navbar-header">         
                <div class="flex items-justify justify-center gap-4">
                    <!-- Your SVG logo here -->
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
                    <span class="title text-white text-4xl text-center font-bold mt-8">Vistalk</span>
                </div>
            </div>
            <button on:click={toggleMenu} class="toggle-button mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
        </div>
        {#if isMenuOpen}
        <div class="dropdown-menu">
            <nav class="navigation">
                <a class="nav-link" on:click={() => navigateAndClose('/dashboard')}>
                    <i class="fas fa-tachometer-alt"></i>
                    <span class="nav-text">Dashboard</span>
                </a>
                <a class="nav-link {activePage === '/user' ? 'active' : ''}" on:click={() => navigateAndClose('/user')}>
                    <i class="fas fa-box"></i>
                    <span class="nav-text">User</span>
                </a>
                <a class="nav-link {activePage === '/contents' ? 'active' : ''}" on:click={() => navigateAndClose('/contents')}>
                    <i class="fas fa-book"></i>
                    <span class="nav-text">Contents</span>
                </a>
                <a class="nav-link {activePage === '/section' ? 'active' : ''}" on:click={() => navigateAndClose('/section')}>
                    <i class="fas fa-list"></i>
                    <span class="nav-text">Section</span>
                </a>
                <a class="nav-link {activePage === '/shop' ? 'active' : ''}" on:click={() => navigateAndClose('/shop')}>
                    <i class="fas fa-shop"></i>
                    <span class="nav-text">Shop</span>
                </a>
                <a class="nav-link {activePage === '/feedback' ? 'active' : ''}"  on:click={() => goto('/feedback')}>
                    <i class="fas fa-comments"></i>
                    <span class="nav-text">Feedback</span>
                </a>
                <a class="button is-light mobile-logout-button" on:click={handleLogout}>
                    <i class="fas fa-sign-out-alt"></i>
                    <span class="nav-text">Logout</span>
                </a>
            </nav>
        </div>
        {/if}
    </aside>
{/if}


<style>
    .navbar {
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #99BC85;
        overflow: visible;
        z-index: 1000;
        transition: width 0.3s ease, padding 0.3s ease;
    }

    .navbar.expanded {
        width: 250px;
    }

    .navbar.collapsed {
        width: 80px;
    }

    .navbar-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 20px;
        color: white;
        font-family: 'Arial', sans-serif;
        transition: opacity 0.3s ease;
        position: relative;
    }

    .navbar-header {
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
        right: 20px; /* Position fixed from the right */
        top: 20px; /* Position fixed from the top */
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        background-color: #99BC85; 
        border-radius: 50%;
        z-index: 9999;
    }

    .toggle-button svg {
        width: 1.5em;
        height: 1.5em;
    }

    .dropdown-menu {
        position: absolute;
        top: 90px; /* Adjust this based on the height of your top bar */
        left: 0;
        width: 100%; /* Set to 100% of the parent element or adjust to your needs */
        max-width: 300px; /* Adjust the maximum width as needed */
        height: auto; /* Adjust height as needed, or use a specific value */
        background-color: #99BC85;
        display: flex;
        flex-direction: column;
        padding: 20px; /* Adjust padding as needed */
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: opacity 0.3s ease;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .dropdown-menu {
            width: 100%;
            max-width: none; /* Remove the max-width for small screens */
            padding: 10px; /* Adjust padding for smaller screens */
        }
    }

    .navigation {
        display: flex;
        flex-direction: column;
        
        overflow-x: auto;
        white-space: nowrap;
    }

    .nav-link {
        display: flex;
        
        text-decoration: none;
        color: white;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 10px;
        transition: background-color 0.3s ease;
        cursor: pointer;
    }

    .nav-link i {
        font-size: 1.2em;
        margin-right: 10px;
    }

    .nav-text {
        display: inline;
        font-size: 1em;
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
    
    .mobile-logout-button{
        display: flex;
        align-items: center;
        margin-top: auto;
        color: #ffffff;
        border: none;
        padding: 10px;
        cursor: pointer;
        
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
        .navbar.expanded {
            width: 100%;
            height: auto;
            background-color: #99BC85; 
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .navbar.collapsed {
            width: 100%;
            height: auto;
            background-color: #99BC85; 
        }

        .navbar-content {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
        }
        .nav-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: white;
            padding: 10px;
            border-radius: 4px;
            margin: 0 5px;
            transition: background-color 0.3s ease;
            cursor: pointer;
        }

        .nav-link:hover {
            background-color: #8aab72;
        }
    }

    .nav-link.active {
        background-color: #151515; /* Bright green color */
    }
</style>
