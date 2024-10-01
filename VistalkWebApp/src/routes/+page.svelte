<script lang="ts">
    import { getLoggedInUser } from '$lib/auth/oidcService';
    import { onMount } from 'svelte';
    import type { LoggedInUser } from '../types/types';
    import LoginModal from './Login.svelte';
    import { loggedInUser } from '$lib/store';
    
    let user: LoggedInUser | null = null;
    let getUserLogIn = false;

    async function getUser() {
        user = await getLoggedInUser();
        loggedInUser.set(user);
    }

    function scrollToSection(sectionId: string) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    let showModal = false;

    onMount(async () => {
        if(getUserLogIn == true)
            await getUser();
    });

    const openModal = () => {
        showModal = true;
    };

    const closeModal = () => {
        showModal = false;
    }

    async function handleLogin(event: CustomEvent) {
        loggedInUser.set(event.detail.user);
        getUserLogIn = true;
    }

</script>

{#if showModal}
<LoginModal on:close={closeModal} on:login={handleLogin} />
{/if}

{#if $loggedInUser}
<p>Welcome, {$loggedInUser.name}!</p>
{:else}
<header class="fixed top-0 w-full bg-white z-50 shadow-lg">
    <nav class="text-black py-4 px-4 md:px-20 flex justify-between items-center">
        <ul class="flex">
            <li class="mr-4">
                <span class="hover:text-[#99BC85] font-bold cursor-pointer" on:click={() => scrollToSection('about-us')}>About Us</span>
            </li>
        </ul>
        <div class="flex justify-center items-center">
            <img src="vis logo.png" alt="Logo" class="h-12 md:h-16">
        </div>
        <ul class="flex">
            <li class="ml-4">
                <span class="hover:text-[#99BC85] font-bold cursor-pointer" on:click={() => scrollToSection('the-developers')}>The Developers</span>
            </li>
        </ul>
    </nav>
</header>

<section class="bg-[#D4E7C5] h-90 md:h-95 px-4 relative">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center h-full">
        <div class="text-center md:text-left">
            <h2 class="text-4xl md:text-6xl font-bold mb-4">VISTALK</h2>
            <p>Your all-in-one gateway to efficient</p>
            <p>Visayan communication.</p>
            <button on:click={openModal} class="bg-[#99BC85] hover:bg-black text-white font-bold py-2 px-4 rounded mt-4">Log In</button>
        </div>
        <div class="mt-8 md:mt-0 md:ml-12 md:relative md:mt-24 md:left-80"> <!-- Moved to the right -->
            <img src="Group 1.png" alt="Image" class="w-full h-auto max-w-xs md:max-w-md">
        </div>
    </div>
</section>

<section id="about-us" class="py-16 md:py-24 px-4">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-start">
        <div class="relative">
            <div class="bg-[#E1F0DA] h-40 w-40 md:h-72 md:w-72 rounded-lg absolute top-1/2 -translate-y-1/2 right-4"></div>
            <img src="9 (1).png" alt="Image" class="relative w-full max-w-lg md:max-w-2xl h-auto mt-8 md:mt-16">
        </div>
        <div class="ml-0 md:ml-9 mt-8 md:mt-0 text-center md:text-left">
            <h2 class="text-2xl md:text-3xl font-bold mb-4">About Us</h2>
            <p class="mb-4 text-justify">Welcome to Vistalk, where language meets culture and communication knows no boundaries.</p>
            <p class="mb-4 text-justify">At Vistalk, we believe that language learning is more than just acquiring words and phrases; it's about embracing a new world of understanding and connection.</p>
            <p class="mb-4 text-justify">Driven by a passion for linguistic diversity, we are dedicated to creating an inclusive environment where learners can embark on a journey of discovery.</p>
            <p class="text-justify">Our team is comprised of language experts, educators, and technology enthusiasts united by a common goal.</p>
        </div>
    </div>
</section>

<section class="py-16 px-4">
    <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
            <ul class="list-none">
                <li class="text-2xl md:text-3xl font-bold mb-4">Adventurous Gameplay</li>
                <ul class="list-disc pl-4">
                    <li>Explore sections with lessons to complete.</li>
                    <li>Study before embarking on adventures.</li>
                    <li>Buy Power-ups from shop.</li>
                </ul>
                <li class="text-2xl md:text-3xl font-bold mt-8 mb-4">Interactive Arena</li>
                <ul class="list-disc pl-4">
                    <li>Engage in 1v1 matches against other users.</li>
                    <li>Matchmaking based on rank medals for fair competition.</li>
                    <li>Receive awards and increase rank by winning games.</li>
                </ul>
                <li class="text-2xl md:text-3xl font-bold mt-8 mb-4">Comprehensive Dictionary</li>
                <ul class="list-disc pl-4">
                    <li>Quick search for translations or word meanings.</li>
                    <li>An accessible tool for on-the-go language reference.</li>
                </ul>
                <li class="text-2xl md:text-3xl font-bold mt-8 mb-4">Subscription Benefits</li>
                <ul class="list-disc pl-4">
                    <li>Unlock additional sections for expanded learning.</li>
                    <li>Receive exclusive rewards for language journeys.</li>
                </ul>
            </ul>
        </div>
        <div class="relative">
            <div class="bg-[#E1F0DA] h-40 w-40 md:h-80 md:w-80 rounded-lg absolute top-16 md:top-32 left-16"></div>
            <img src="8 (1).png" alt="Image" class="relative w-full h-auto max-w-xs md:max-w-lg">
        </div>
    </div>
</section>

<section id="the-developers" class="py-16 px-4">
    <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl font-bold mb-8">The Developers</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
                <img src="dota2.png" alt="Joshua Caranzo" class="h-36 w-36 rounded-lg mx-auto">
                <p class="mt-2 text-lg italic">Joshua Caranzo</p>
            </div>
            <div>
                <img src="dota2.png" alt="Beatrice Abigail Alindao" class="h-36 w-36 rounded-lg mx-auto">
                <p class="mt-2 text-lg italic">Beatrice Abigail Alindao</p>
            </div>
            <div>
                <img src="dota2.png" alt="Aldrich Batisla-on" class="h-36 w-36 rounded-lg mx-auto">
                <p class="mt-2 text-lg italic">Aldrich Batisla-on</p>
            </div>
            <div>
                <img src="dota2.png" alt="Justin Louise Cañada" class="h-36 w-36 rounded-lg mx-auto">
                <p class="mt-2 text-lg italic">Justin Louise Cañada</p>
            </div>
            <div>
                <img src="dota2.png" alt="Cesar Ian Sacare" class="h-36 w-36 rounded-lg mx-auto">
                <p class="mt-2 text-lg italic">Cesar Ian Sacare</p>
            </div>
        </div>
    </div>
</section>

<section class="bg-[#99BC85] py-8 px-4">
    <div class="max-w-4xl mx-auto text-center">
        <!-- Additional content here -->
    </div>
</section>
{/if}
