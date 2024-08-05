<script lang="ts">
    import { getLoggedInUser } from '$lib/auth/oidcService';
    import { onMount } from 'svelte';
    import type { LoggedInUser } from '../types/types';
    
    let user: LoggedInUser | null = null;

    async function getUser()
    {
        user = await getLoggedInUser();
    }

    onMount(() => {
        getUser();
    });

    function scrollToSection(sectionId: string) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    import LoginModal from './Login.svelte';
    let showModal = false;

    const openModal = () => {
    showModal = true;
    }
    const closeModal = () => {
    showModal = false;
    }

    async function handleLogin(event: CustomEvent) {
        user = event.detail.user;
    }

    export function logout(): void {
        user=null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }
</script>
{#if showModal}
<LoginModal on:close={closeModal} on:login={handleLogin}/>
{/if}
{#if user == null}
<header class="fixed top-0 w-full bg-white z-50">
    <nav class="text-black py-0 px-80 flex justify-between items-center shadow-lg">
        <ul class="flex">
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <li class="mr-4">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <span class="hover:text-[#99BC85] font-bold cursor-pointer" on:click={() => scrollToSection('about-us')}>About Us</span>
            </li>
        </ul>
        <div class="flex justify-center items-center">
            <img src="vis logo.png" alt="Logo" class="max-w-full h-auto max-h-20">
        </div>
        <ul class="flex">
            <li class="ml-4">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span class="hover:text-[#99BC85] font-bold cursor-pointer" on:click={() => scrollToSection('the-developers')}>The Developers</span>
            </li>
        </ul>
    </nav>
</header>
<section class="bg-main-color py-32 px-4 relative">
    <div class="max-w-4xl mx-auto flex items-center">
        <div class="mt-16">
            <h2 class="text-6xl font-bold mb-4 ml-20">VISTALK</h2>
            <p class="ml-20">Your all-in-one gateway to efficient</p>
            <p class="ml-28">Visayan communication.</p>
            <span class="flex justify-center mr-16">
                <button on:click={openModal} class="ml-32 bg-[#99BC85] hover:bg-black text-white font-bold py-2 px-4 rounded mt-4">Log In</button> 
            </span>
        </div>
        <div class="absolute right-0 top-20" style="margin-right: 8rem;">
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src="Group 1.png" alt="Image" class="mr-16 mt-12 w-80 h-auto">
        </div>
    </div>
</section>

<section id="about-us" class="mt-24 py-8 px-4 flex items-top">
    <div class="max-w-4xl mx-auto flex items-center">
        <div class="relative">
            <div class="bg-main-2 h-72 w-72 rounded-lg absolute top-32 right-4"></div>
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src="9 (1).png" alt="Image" class="w-[72em] h-[36em] mr-36 mt-24 relative z-10">
        </div>
        <div class="ml-9">
            <h2 class="text-3xl font-bold mb-6 mt-24">About Us</h2>
            <p class="mb-6 text-justify indent-8">Welcome to Vistalk, where language meets culture and communication knows no boundaries.</p>
            <p class="mb-6 text-justify indent-8">At Vistalk, we believe that language learning is more than just acquiring words and phrases; it's about embracing a new world of understanding and connection. Our mission is to foster cultural appreciation and facilitate meaningful interactions by providing a platform for learning Visayan languages.</p>
            <p class="mb-6 text-justify indent-8">Driven by a passion for linguistic diversity, we are dedicated to creating an inclusive environment where learners from all walks of life can embark on a journey of discovery. Whether you're a traveler eager to immerse yourself in local customs or a language enthusiast seeking to expand your horizons, Vistalk is here to empower you.</p>
            <p class="text-justify indent-8">Our team is comprised of language experts, educators, and technology enthusiasts united by a common goal: to make language learning accessible, engaging, and enjoyable for everyone. We are committed to harnessing the latest advancements in technology to deliver innovative learning experiences that adapt to your unique needs and preferences.</p>
        </div>
    </div>
</section>
<section class="py-8 px-4">
    <div class="max-w-4xl mx-auto flex items-center">
        <div class="ml-9">
            <ul class="custom-list">
                <li class="mb-2 mt-40 text-3xl font-bold">Adventurous Gameplay</li>
                <ul class="list-disc">
                    <li class="ml-4">Explore sections with lessons to complete.</li>
                    <li class="ml-4">Study before embarking on adventures.</li>
                    <li class="ml-4">Buy Power-ups from shop</li>
                </ul>
                <li class="mb-2 mt-6 text-3xl font-bold">Interactive Arena</li>
                <ul class="list-disc">
                    <li class="ml-4">Engage in 1v1 matches against other users.</li>
                    <li class="ml-4">Matchmaking based on similar rank medals for fair competition.</li>
                    <li class="ml-4">Receive Awards and Win games to increase rank and play with higher ranked players</li>
                </ul>
                <li class="mb-2 mt-6 text-3xl font-bold">Comprehensive Dictionary</li>
                <ul class="list-disc">
                    <li class="ml-4">Quick search for translations or word meanings.</li>
                    <li class="ml-4">Accessible tool for on-the-go language reference.</li>
                </ul>
                <li class="mb-2 mt-6 text-3xl font-bold">Subscription Benefits</li>
                <ul class="list-disc">
                    <li class="ml-4">Unlock additional sections for expanded learning.   </li>
                    <li class="ml-4">Receive exclusive rewards to enhance your language journey.</li>
                </ul>
            </ul>
        </div>
        <div class="relative">
            <div class="bg-main-2 h-80 w-80 rounded-lg absolute top-56 left-44"></div>
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src="8 (1).png" alt="Image" class="w-[40em] h-[40em] ml-24 mt-44 relative z-10">
        </div>
    </div>
</section>
<section id="the-developers" class="py-8 px-4">
    <div class="max-w-4xl mx-auto text-center mt-28 mb-16">
        <h2 class="text-3xl font-bold ">The Developers</h2>
        <div class="grid grid-cols-5 gap-8 mt-16">
            <div class="relative">
                <img src="dota2.png" alt="" class="h-36 w-36 rounded-lg">
                <p class="mt-2 text-xl italic">Joshua Caranzo</p>
            </div>
            <div class="relative">
                <img src="dota2.png" alt="" class="h-36 w-36 rounded-lg">
                <p class="mt-2 text-xl italic">Beatrice Abigail Alindao</p>
            </div>
            <div class="relative">
                <img src="dota2.png" alt="" class="h-36 w-36 rounded-lg">
                <p class="mt-2 text-xl italic">Aldrich Batisla-on</p>
            </div>
            <div class="relative">
                <img src="dota2.png" alt="" class="h-36 w-36 rounded-lg">
                <p class="mt-2 text-xl italic">Justin Louise Cañada</p>
            </div>
            <div class="relative">
                <img src="dota2.png" alt="" class="h-36 w-36 rounded-lg">
                <p class="mt-2 text-xl italic">Cesar Ian Sacare</p>
            </div>
        </div>
    </div>
</section>
<section class="bg-main py-8 px-4">
    <div class="max-w-4xl mx-auto text-center">
    </div>
</section>

{:else}
<p>Welcome, {user.name}!</p>
<button on:click={logout}>Logout</button>
{/if}
<style>
    .bg-main-color {
        background-color: #D4E7C5;
    }
    .bg-main{
        background-color: #99BC85;
    }
    .bg-main-2{
        background-color: #E1F0DA;
    }  
</style>
