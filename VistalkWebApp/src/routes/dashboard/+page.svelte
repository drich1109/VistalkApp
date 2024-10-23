<script lang="ts">
    import LineChart from "$lib/components/LineChart.svelte";
    import Piechart from "$lib/components/Piechart.svelte";
    import { onMount } from "svelte";
    import type { LeaderBoardDto, StatusDto, UserLanguage } from "./types";
    import { getLeaderBoards, getStatusVista, getSubscriptionData, getUserLanguage, resetLeaderBoard } from "./repo";

    let leaderboardData: LeaderBoardDto[] = [];
    let inActiveData: StatusDto | undefined;
    let activeInactiveData: { name: string; y: number }[] = [];
    let userLanguage: UserLanguage[] = []; 
    let languageUsageData: { name: string; y: number }[] = [];
    const subscriptionCategories = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const subscriptionData: { name: string; data: number[] }[] = [];

    onMount(loadData);

    async function loadData() {
        try {
            const result = await getLeaderBoards();
            leaderboardData = result.data || [];  

            const result2 = await getStatusVista();
            inActiveData = result2.data;
            activeInactiveData = inActiveData ? [
                { name: 'Active Users', y: inActiveData.active },
                { name: 'Inactive Users', y: inActiveData.inactive },
            ] : [];

            const result3 = await getUserLanguage();
            userLanguage = result3.data || [];
            languageUsageData = userLanguage.map((language) => ({
                name: language.languageName,
                y: language.userCount,
            }));

            const results = await getSubscriptionData(); 

            subscriptionData.length = 0; 

            results.data.forEach(row => {
                const monthIndex = row.month - 1; 
                const typeName = row.type; 

                const typeIndex = subscriptionData.findIndex(item => item.name === typeName);

                if (typeIndex === -1) {
                    subscriptionData.push({ name: typeName, data: Array(12).fill(0) });
                }

                subscriptionData.find(item => item.name === typeName)!.data[monthIndex] = row.subscriptionCount || 0; 
            });

            console.log(subscriptionData);
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }

    async function reset() {
        const userConfirmed = confirm("Resetting the leaderboard will cause deletion of vistas' data scores. Are you sure you want to continue?");
        
        if (userConfirmed) {
            await resetLeaderBoard();
            alert("Leaderboard has been reset successfully.");
            await loadData(); 
        } else {
            alert("Reset canceled.");
        }
    }
</script>


<div>
    <div class="gap-4 flex flex-col sm:flex-row justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg">
        <p class="font-['Helvetica'] text-black text-xl font-bold">Dashboard</p>
    </div>

    <div class="flex mt-4">
        <div class="w-[70%] pr-4">
            <div class="flex flex-col sm:flex-row justify-between gap-4">
                <div class="bg-[rgba(0,0,0,0.2)] rounded-lg p-4 w-full shadow-lg">
                    {#if activeInactiveData.length > 0} 
                    <Piechart chartTitle="Active vs Inactive Users" data={activeInactiveData} />
                    {/if}
                </div>
                <div class="bg-[rgba(0,0,0,0.2)] rounded-lg p-4 w-full shadow-lg">
                    {#if languageUsageData.length > 0} 
                    <Piechart chartTitle="Language Usage" data={languageUsageData} />
                    {/if}
                </div>
            </div>
            
            <div class="mt-4">
                <div class="bg-[rgba(0,0,0,0.2)] rounded-lg p-4 w-full shadow-lg mt-6">
                {#if subscriptionData.length > 0 && subscriptionCategories.length > 0 }
                    <LineChart 
                        chartTitle="Monthly Subscription Types" 
                        categories={subscriptionCategories} 
                        seriesData={subscriptionData}
                    />
                {/if}
                </div>    
            </div>
        </div>

        <div class="w-[30%] bg-white rounded-xl py-4 px-4 shadow-lg"> 
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-['Helvetica'] text-black text-xl font-bold">Weekly Leaderboard</h3>
                <button class="font-['Helvetica'] text-black text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition duration-200" on:click={reset}>
                    Reset Leaderboard
                </button>
            </div>
            <ul class="space-y-2">
                {#each leaderboardData as user, index} 
                    <li class="flex justify-between items-center bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition duration-200">
                        <span class="font-semibold text-black">{index + 1}. {user.name}</span>
                        <span class="text-blue-600 font-bold">{user.totalScoreWeekly || 0}</span>
                    </li>
                {/each}
            </ul>
        </div>
        
    </div>
</div>
