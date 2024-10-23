<script lang="ts">
    import { onMount } from "svelte";
    import type { CallResultDto } from "../../types/types";
    import type { DailyTaskDto } from "./type";
    import { redirectIfLoggedIn } from "$lib/shortcuts";
    import { deleteDailyTask, getDailyTask } from "./repo";
    import Pagination from "$lib/components/Pagination.svelte";
    import AddDailyTask from "./AddDailyTask.svelte";

    let openModal: boolean = false;
    let isAdd: boolean = false;
    let dailyTaskList: DailyTaskDto[] = [];
    let pageNo: number = 1;
    let searchString: string | null = null;
    let startDate: string;
    let endDate: string;

    let dailyTask: DailyTaskDto = {
        taskID: 0,
        rewardCoins: 0,
        taskDate: '',
        typeName: '',
        taskTypeId: 0,
        quantity: 0
    };

    let dailyTaskListCallResult: CallResultDto<DailyTaskDto[]> = {
        message: "",
        data: [],
        isSuccess: true,
        data2: [],
        totalCount: 0,
    };
    onMount(async () => {
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        startDate = oneWeekAgo.toISOString().slice(0, 10);
        endDate = currentDate.toISOString().slice(0, 10);

        await redirectIfLoggedIn("");
        refresh();
    });

    function handlePageChange(event: CustomEvent) {
        const selectElement = event.detail as HTMLSelectElement;
        pageNo = parseInt(selectElement.toString());
        refresh();
    }

    async function refresh() {
        dailyTaskListCallResult = await getDailyTask(
            pageNo,
            startDate,
            endDate,
            searchString,
        );
        dailyTaskList = dailyTaskListCallResult.data;
    }

    $: {
        if (startDate != null || endDate != null) refresh();
    }

    $: {
        if (searchString != null) refresh();
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    }

    function toggleModal(check: boolean, daily: DailyTaskDto | null) {
    openModal = true;
    isAdd = check;
    if (daily) {
        dailyTask = {
            ...daily,
            taskDate: new Date(daily.taskDate).toISOString().slice(0, 10),
        };
    } else {
        reinitialize();
    }
}


    function openAddDailyTask() {
        openModal = true;
        isAdd = true;
    }

    function modalClose() {
        openModal = false;
        reinitialize();
        refresh();
    }

    async function reinitialize() {
        dailyTask = {
            taskID: 0,
            rewardCoins: 0,
            taskDate: '',
            typeName: '',
            taskTypeId: 0,
            quantity: 0
        };
    }

    async function deleteTask(id:number) {
        const userConfirmed = confirm("Deleting daily task also deletes vistas record. Are you sure you want to continue?");
        
        if (userConfirmed) {
            await deleteDailyTask(id);
            await refresh();
        }
        else
        {
            return;
        }
    }
</script>

{#if openModal == true}
    <AddDailyTask modalOpen={openModal} {isAdd} {dailyTask} on:close={modalClose} on:refresh={refresh}></AddDailyTask>
{/if}

<div
    class="gap-4 flex flex-col sm:flex-row justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg"
>
    <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">
        Daily Task List
    </p>
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
    <div class="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0 gap-4">
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
        <button on:click={openAddDailyTask}
            class="flex items-center font-['Helvetica'] bg-[#99BC85] text-white py-2 px-3 rounded-xl text-sm shadow-lg hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="text-white mr-2"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
                ><path
                    fill="currentColor"
                    d="M13 6.5V11h4.5v2H13v4.5h-2V13H6.5v-2H11V6.5z"
                /></svg
            >
            Add Daily Task
        </button>
    </div>
</div>

<div class="flex mt-6">
    <table class="bg-white w-full shadow-lg rounded-xl">
        <thead class="font-['Cambria'] bg-[#99BC85] text-white text-center">
            <tr class="first:rounded-t-xl last:rounded-b-xl">
                <th class="px-4 py-2">Task Type Name</th>
                <th class="px-4 py-2">Rewards Coins</th>
                <th class="px-4 py-2">Task Date</th>
                <th class="px-4 py-2">Goal Number</th>  
                <th class="px-4 py-2">Actions</th>
            </tr>
        </thead>
        <tbody class="text-center text-sm">
            {#if dailyTaskList != null}
                {#each dailyTaskList as d}
                    <tr class="border-t-2 mx-4">
                        <td class="px-4 py-2">{d.typeName}</td>
                        <td class="px-4 py-2">{d.rewardCoins} vCoins</td>
                        <td class="px-4 py-2">{formatDate(d.taskDate)}</td>
                        <td class="px-4 py-2">{d.quantity}</td>
                        <td class="px-4 py-2">
                            <button on:click={(event) => { event.stopPropagation(); toggleModal(false,d)}}><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 16 16"><path fill="black" d="M15.49 7.3h-1.16v6.35H1.67V3.28H8V2H1.67A1.21 1.21 0 0 0 .5 3.28v10.37a1.21 1.21 0 0 0 1.17 1.25h12.66a1.21 1.21 0 0 0 1.17-1.25z"/><path fill="black" d="M10.56 2.87L6.22 7.22l-.44.44l-.08.08l-1.52 3.16a1.08 1.08 0 0 0 1.45 1.45l3.14-1.53l.53-.53l.43-.43l4.34-4.36l.45-.44l.25-.25a2.18 2.18 0 0 0 0-3.08a2.17 2.17 0 0 0-1.53-.63a2.2 2.2 0 0 0-1.54.63l-.7.69l-.45.44zM5.51 11l1.18-2.43l1.25 1.26zm2-3.36l3.9-3.91l1.3 1.31L8.85 9zm5.68-5.31a.9.9 0 0 1 .65.27a.93.93 0 0 1 0 1.31l-.25.24l-1.3-1.3l.25-.25a.88.88 0 0 1 .69-.25z"/></svg></button>
                            <button on:click={(event) => { event.stopPropagation(); deleteTask(d.taskID)}}><svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"/></svg></button>
                        </td>
                    </tr>
                {/each}
            {:else}
                <tr class="border-t-2 mx-4">
                    <td class="px-4 py-2" colspan="4">No Daily Task Found</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>

{#if dailyTaskListCallResult.totalCount}
    <Pagination
        totalCount={dailyTaskListCallResult.totalCount}
        {pageNo}
        on:handlePageChange={handlePageChange}
    ></Pagination>
{/if}

<style>
    tbody tr:hover {
        background-color: #e0e0e0;
    }
</style>
