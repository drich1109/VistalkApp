<script lang="ts">
    import { redirectIfLoggedIn } from '$lib/shortcuts';
    import { onMount } from 'svelte';
    import type { FeedbackDto } from './type';
    import { getFeedbackList } from './repo';
    import type { CallResultDto } from '../../types/types';
    import Pagination from '$lib/components/Pagination.svelte';

    let feedbackList: FeedbackDto[] = [];
    let pageNo: number = 1;

    let searchString: string | null = null;
    let startDate: string;
    let endDate: string;

    let openModal: boolean = false;

    let feedbackListCallResult: CallResultDto<FeedbackDto[]> = {
        message: "",
        data: [],
        isSuccess: true,
        data2: [],
        totalCount: 0
    };

    onMount(async () => {
        // Initialize startDate and endDate to default values
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7); // One week ago

        // Convert dates to 'YYYY-MM-DD' format
        startDate = oneWeekAgo.toISOString().slice(0, 10);
        endDate = currentDate.toISOString().slice(0, 10);

        await redirectIfLoggedIn('');
        refresh();
    });

    function handlePageChange(event: CustomEvent) {
        const selectElement = event.detail as HTMLSelectElement;
        pageNo = parseInt(selectElement.toString());
        refresh();
    }

    async function refresh() {
        feedbackListCallResult = await getFeedbackList(pageNo, startDate, endDate, searchString);
        feedbackList = feedbackListCallResult.data;
    }

    $: {
        if (startDate != null || endDate != null)
            refresh();
    }

    function closeModal() {
        openModal = false;
    }

    function openViewModal() {
        openModal = true;
    }

    $: {
        if (searchString != null) refresh();
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    }
</script>

{#if openModal == true}
    <!-- ViewFeedback component can be added here if needed -->
{/if}

<div class="gap-4 flex flex-col sm:flex-row justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg">
    <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Feedback List</p>
    <div class="flex-grow flex justify-center">
        <div class="flex items-center border border-[#B9B9B9] rounded-xl px-12 py-1 bg-white">
            <input type="text" bind:value={searchString} placeholder="Search" class="outline-none text-gray-600 placeholder-[#99BC85]">
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" class="text-[#99BC85]" width="1.5em" height="1.5em" viewBox="0 0 12 12" fill="none">
                    <path d="M8.46342 8.52L10.2 10.2M5.69999 3.6C6.6941 3.6 7.49999 4.40589 7.49999 5.4M9.63999 5.72C9.63999 7.88496 7.88494 9.64 5.71999 9.64C3.55503 9.64 1.79999 7.88496 1.79999 5.72C1.79999 3.55505 3.55503 1.8 5.71999 1.8C7.88494 1.8 9.63999 3.55505 9.63999 5.72Z" stroke="#99BC85" stroke-linecap="round"/>
                </svg> 
            </button>
        </div>
    </div>
    <div class="flex-grow flex justify-center gap-4">
        <div class="flex items-center border border-[#B9B9B9] rounded-xl px-4 py-1 bg-white">
            <input type="date" bind:value={startDate} class="outline-none text-gray-600 placeholder-[#99BC85]" placeholder="Start Date">
        </div>
        <div class="flex items-center border border-[#B9B9B9] rounded-xl px-4 py-1 bg-white">
            <input type="date" bind:value={endDate} class="outline-none text-gray-600 placeholder-[#99BC85]" placeholder="End Date">
        </div>
    </div>
</div>

<div class="flex mt-6">
    <table class="bg-white w-full shadow-lg rounded-xl">
        <thead class="font-['Cambria'] bg-[#99BC85] text-white text-center">
            <tr class="first:rounded-t-xl last:rounded-b-xl">
                <th class="px-4 py-2">User Name</th>
                <th class="px-4 py-2">Feedback</th>
                <th class="px-4 py-2">Date</th>
                <th class="px-4 py-2">Actions</th>
            </tr>
        </thead>
        <tbody class="text-center text-sm">
            {#if feedbackList != null}
                {#each feedbackList as feedback}
                    <tr class="border-t-2 mx-4">
                        <td class="px-4 py-2">{feedback.name}</td>
                        <td class="px-4 py-2">{feedback.feedbackText}</td>
                        <td class="px-4 py-2">{formatDate(feedback.feedbackDate)}</td>
                    </tr>
                {/each}
            {:else}
                <tr class="border-t-2 mx-4">
                    <td class="px-4 py-2" colspan="4">No Feedback Found</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>

{#if feedbackListCallResult.totalCount}
    <Pagination totalCount={feedbackListCallResult.totalCount} {pageNo} on:handlePageChange={handlePageChange}></Pagination>
{/if}

<style>
    tbody tr:hover {
        background-color: #e0e0e0;
    }
</style>
