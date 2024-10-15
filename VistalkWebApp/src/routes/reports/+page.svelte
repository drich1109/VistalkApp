<script lang="ts">
    import { onMount } from "svelte";
    import type { CallResultDto } from "../../types/types";
    import type { ReportsDto } from "./type";
    import { redirectIfLoggedIn } from "$lib/shortcuts";
    import { getReportList, reportResponded } from "./repo";
    import Pagination from "$lib/components/Pagination.svelte";



    let reportList: ReportsDto[] = [];
    let pageNo: number = 1;
    let hasResponded: boolean =false;
    let searchString: string | null = null;
    let startDate: string;
    let endDate: string;

    let reportListCallResult: CallResultDto<ReportsDto[]> = {
        message: "",
        data: [],
        isSuccess: true,
        data2: [],
        totalCount: 0
    };
    onMount(async () => {
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);

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
        reportListCallResult = await getReportList(pageNo, hasResponded, startDate, endDate, searchString);
        reportList = reportListCallResult.data;
    }

    $: {
        if (startDate != null || endDate != null) refresh();
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

    async function setResponded(id:number){ await reportResponded(id); refresh();}
</script>

<div
    class="gap-4 flex flex-col sm:flex-row justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg"
>
    <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Report List</p>
    <div class="flex-grow flex justify-center">
        <div
            class="flex items-center border border-[#B9B9B9] rounded-xl px-12 py-1 bg-white"
        >
            <input
                type="text"
                bind:value={searchString}
                placeholder="Search"
                class="outline-none text-gray-600 placeholder-[#99BC85]"
            />
            <button>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="text-[#99BC85]"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 12 12"
                    fill="none"
                >
                    <path
                        d="M8.46342 8.52L10.2 10.2M5.69999 3.6C6.6941 3.6 7.49999 4.40589 7.49999 5.4M9.63999 5.72C9.63999 7.88496 7.88494 9.64 5.71999 9.64C3.55503 9.64 1.79999 7.88496 1.79999 5.72C1.79999 3.55505 3.55503 1.8 5.71999 1.8C7.88494 1.8 9.63999 3.55505 9.63999 5.72Z"
                        stroke="#99BC85"
                        stroke-linecap="round"
                    />
                </svg>
            </button>
        </div>
    </div>
    <div class="flex gap-4">
        <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" bind:checked={hasResponded} on:change={refresh}/>
            <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-lime-800"
            ></div>
            <span class="ms-3 text-sm font-medium text-black dark:text-black"
                >See Responded</span
            >
        </label>
        <div
            class="flex items-center border border-[#B9B9B9] rounded-xl px-4 py-1 bg-white"
        >
            <input
                type="date"
                bind:value={startDate}
                class="outline-none text-gray-600 placeholder-[#99BC85]"
                placeholder="Start Date"
            />
        </div>
        <div
            class="flex items-center border border-[#B9B9B9] rounded-xl px-4 py-1 bg-white"
        >
            <input
                type="date"
                bind:value={endDate}
                class="outline-none text-gray-600 placeholder-[#99BC85]"
                placeholder="End Date"
            />
        </div>
    </div>
</div>

<div class="mt-6 overflow-x-auto">
    <table class="bg-white w-full shadow-lg rounded-xl min-w-[640px]">
        <thead class="font-['Cambria'] bg-[#99BC85] text-white text-center">
            <tr class="first:rounded-t-xl last:rounded-b-xl">
                <th class="px-4 py-2 first:rounded-tl-xl last:rounded-tr-xl"
                    >User Name</th
                >
                <th class="px-4 py-2">Email</th>
                <th class="px-4 py-2">Reports</th>
                <th class="px-4 py-2">Date</th>
                <th class="px-4 py-2 first:rounded-tl-xl last:rounded-tr-xl"
                    >Actions</th
                >
            </tr>
        </thead>
        <tbody class="text-center text-sm">
            {#if reportList != null}
                {#each reportList as report}
                <tr class="border-t-2 mx-4">
                    <td class="px-4 py-2">{report.name}</td>
                    <td class="px-4 py-2">{report.email}</td>
                    <td class="px-4 py-2">{report.reportText}</td>
                    <td class="px-4 py-2">{formatDate(report.reportDate)}</td>
                    <td class="px-4 py-2">
                        <input on:click={() => setResponded(report.reportID)}
                            type="checkbox"
                            class="form-checkbox h-4 w-4 text-[#99BC85] rounded focus:ring-[#99BC85]"
                        />
                    </td>
                </tr>
                {/each}
                {:else}
                <tr class="border-t-2 mx-4">
                    <td class="px-4 py-2" colspan="6">No Reports Found</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>

{#if reportListCallResult.totalCount}
            <Pagination totalCount = {reportListCallResult.totalCount} {pageNo} on:handlePageChange={handlePageChange}></Pagination>
        {/if}

<style>
    tbody tr:hover {
        background-color: #e0e0e0;
    }
</style>
