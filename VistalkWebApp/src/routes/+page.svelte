<script lang="ts">
    import { getLoggedInUser } from '$lib/auth/oidcService';
    import { onMount } from 'svelte';
    import type { LoggedInUser } from '../types/types';
    import { loggedInUser } from '$lib/store';
    import { initAuth } from '$lib/auth/auth';
    import { goto } from '$app/navigation';
    
    let user: LoggedInUser | null = null;
    let isLoading = true; // Loading state to track authentication status

    async function getUser() {
        user = await getLoggedInUser();
        loggedInUser.set(user);
        isLoading = false; // Update loading state after checking user
    }

    function scrollToSection(sectionId: string) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    onMount(async () => {
        await initAuth();
        await getUser(); // Call getUser on mount to check authentication
    });
</script>

{#if isLoading}
    <p>Loading...</p> <!-- Display a loading indicator while checking user status -->
{:else if $loggedInUser}
    <p>Welcome, {$loggedInUser.name}!</p>
{:else}
<header class="fixed top-0 w-full z-50 bg-gradient-to-r from-[#6addd0] to-[#f7c188]">
    <nav class="text-black py-4 w-[85%] px-4 md:px-20 flex justify-between items-center max-w-8xl mx-auto">
        <div class="flex justify-center items-center">
            <img src="FinalLogo.png" alt="Logo" class="h-12 md:h-12 rounded-full">
            <h2 class="text-3xl ml-2 font-bold" style="color: #ffffff; font-family: 'Dancing Script', cursive;">Vistalk</h2>
        </div>
        <div class="flex justify-center items-center">
            <ul class="flex">
                <li class="mr-4">
                    <span class="hover:underline font-bold cursor-pointer text-white text-xl" on:click={() => scrollToSection('about-us')}>About Us</span>
                </li>
            </ul>
            <ul class="flex">
                <li class="ml-4">
                    <span class="hover:underline font-bold cursor-pointer text-white text-xl" on:click={() => scrollToSection('the-developers')}>The Developers</span>
                </li>
            </ul>
        </div>
        <div class="flex justify-center items-center">
            <button on:click={() => goto('/login')} class="bg-white hover:text-[#f7c188] font-bold py-2 px-4 rounded-full">Log In</button>
        </div>
    </nav>
</header>

<section class="bg-gradient-to-r from-[#6addd0] to-[#f7c188] h-90 md:h-120 px-4 pt-32 relative">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center h-full md:py-24">
        <div class="text-center md:text-left">
            <h2 class="text-4xl md:text-3xl font-bold mb-4">ALL-IN-ONE GATEWAY TO MASTERING VISAYAN COMMUNICATION</h2>
            <p class="text-xl md:text-xl w-[70%] mb-4">
                Vistalk is a language learning app designed to break down language barriers, making communication easier and more enjoyable for everyone.
            </p>
                    </div>
        <div class="mt-8 md:mt-0">
            <img src="Group 1.png" alt="Image" class="w-full h-auto max-w-lg md:max-w-xl">
        </div>
    </div>
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center h-full">
        <button
            class="bg-white font-bold py-2 px-4 rounded-full mt-4 flex items-center justify-center relative overflow-hidden group"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 512 512" class="mr-2">
                <path fill="none" class="stroke-black transition duration-300 ease-in-out group-hover:stroke-[#99BC85]" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M336 176h40a40 40 0 0 1 40 40v208a40 40 0 0 1-40 40H136a40 40 0 0 1-40-40V216a40 40 0 0 1 40-40h40"/>
                <path fill="none" class="stroke-black transition duration-300 ease-in-out group-hover:stroke-[#99BC85]" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m176 272l80 80l80-80M256 48v288"/>
            </svg>
            <span class="text-black transition duration-300 ease-in-out hover:text-transparent bg-clip-text bg-gradient-to-r from-[#99BC85] to-[#f7c188]">
                Download Mobile App
            </span>
        </button>
    </div>    
</section>


<section id="about-us" class="bg-gradient-to-r from-[#6addd0] to-[#f7c188] py-32 px-4">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-start bg-gray-200 bg-opacity-40 rounded-lg p-6">
        <div class="relative">
            <div class="bg-[#E1F0DA] h-40 w-40 md:h-72 md:w-72 rounded-lg absolute top-1/2 -translate-y-1/2 right-4 mt-8"></div>
            <img src="9 (1).png" alt="Team working together" class="relative w-full max-w-lg md:max-w-2xl h-auto mt-8 md:mt-8 right-16">
        </div>
        <div class="ml-0 md:ml-9 mt-8 md:mt-0 text-center md:text-center">
            <h2 class="text-2xl md:text-3xl font-bold mb-4">ABOUT US</h2>
            <p class="mb-4 text-justify">
                We are a team of Information Technology students from the University of Cebu, passionate about bridging communication gaps and enhancing language learning experiences.
            </p>
            <p class="mb-4 text-justify">
                At Vistalk, we believe that language learning is more than just acquiring words and phrases; it's about embracing a new world of understanding and connection.
            </p>
            <p class="mb-4 text-justify">
                Driven by a passion for linguistic diversity, we developed **Vistalk**—a comprehensive language learning app tailored specifically for Visayan language learners. Our goal is to create a user-friendly platform that simplifies the learning process while fostering a sense of community among learners.
            </p>
            <p class="text-justify">
                Our team is comprised of language experts, educators, and technology enthusiasts united by a common goal: to empower individuals to connect, communicate, and thrive through the mastery of the Visayan language.
            </p>
        </div>
    </div>
</section>

<section id="why-vistalk" class="bg-gradient-to-r from-[#6addd0] to-[#f7c188] py-8 px-4">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-start bg-gray-200 bg-opacity-40 rounded-lg p-6">
        <div class="ml-0 md:ml-9 mt-8 md:mt-0 text-center md:text-center">
            <h2 class="text-2xl md:text-3xl font-bold mb-4">WHY VISTALK</h2>
            <p class="mb-4 text-justify">
                At Vistalk, we are committed to making language learning engaging and accessible. Our platform provides interactive lessons and real-life scenarios that help learners develop practical communication skills.
            </p>
            <p class="mb-4 text-justify">
                We utilize advanced technology to deliver personalized learning experiences, allowing users to learn at their own pace and revisit materials as needed. Our app offers features such as quizzes, games, and a vibrant community for learners to practice together.
            </p>
            <p class="mb-4 text-justify">
                Our focus on cultural context and linguistic nuances makes our approach unique. We aim to immerse users in the Visayan culture, enhancing their language skills through meaningful content and interactions.
            </p>
            <p class="text-justify">
                Join us at Vistalk to embark on a transformative journey that empowers you to connect deeply with the Visayan language and culture.
            </p>
        </div>
        <div class="relative">
            <div class="bg-[#E1F0DA] h-40 w-40 md:h-72 md:w-72 rounded-lg absolute top-1/2 -translate-y-1/2 left-8 mt-8"></div>
            <img  src="9 (1).png" alt="Team working together" class="relative w-full max-w-lg md:max-w-2xl h-auto mt-8 md:mt-8 left-16">

        </div>
    </div>
</section>

<section class="bg-gradient-to-r from-[#6addd0] to-[#f7c188] py-16 px-4">
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

<section id="the-developers" class="bg-gradient-to-r from-[#6addd0] to-[#f7c188] py-16 px-4">
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

<section class="bg-white py-8 px-4">
    <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-lg font-semibold mb-2">Stay Connected</h3>
        <p class="text-gray-600 mb-4">Subscribe to our newsletter for updates and offers.</p>
        <form class="mb-4">
            <input type="email" placeholder="Your Email" class="border border-gray-300 rounded-lg px-4 py-2 w-64" required>
            <button type="submit" class="bg-[#6addd0] text-white font-semibold rounded-lg px-4 py-2 ml-2">Subscribe</button>
        </form>
        <div class="flex justify-center space-x-4">
            <a href="#" class="text-gray-600 hover:text-[#6addd0]">Privacy Policy</a>
            <a href="#" class="text-gray-600 hover:text-[#6addd0]">Terms of Service</a>
            <a href="#" class="text-gray-600 hover:text-[#6addd0]">Contact Us</a>
        </div>
        <p class="mt-4 text-gray-500 text-sm">&copy; 2024 Vistalk. All rights reserved.</p>
    </div>
</section>


{/if}

