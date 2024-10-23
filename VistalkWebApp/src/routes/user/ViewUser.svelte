<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { UserDto, UserProfileDto } from "./type";
  import { onMount } from "svelte";
    import { getImageUrl, getUserDetails } from "./repo";
    import UserScoreChart from "$lib/components/UserScoreChart.svelte";

  export let modelOpen: boolean;
  export let userView: UserDto;

  let userDetail:UserProfileDto;
  let weeklyScores:number[] = [];
  let labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let imageUrl:string | null = null;
  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  onMount(async () => {
    const fetchUserData = async () => {
      try {
        if (userView.userPlayerId) {
          const response = await getUserDetails(userView.userPlayerId);
          userDetail = response.data;
          const fileBlob = await getImageUrl(userDetail.imagePath || "");
            const newFile = new Blob();
            imageUrl = URL.createObjectURL(fileBlob || newFile);

          weeklyScores = [
            userDetail.weeklyScoreGraph["Monday"] || 0,
            userDetail.weeklyScoreGraph["Tuesday"] || 0,
            userDetail.weeklyScoreGraph["Wednesday"] || 0,
            userDetail.weeklyScoreGraph["Thursday"] || 0,
            userDetail.weeklyScoreGraph["Friday"] || 0,
            userDetail.weeklyScoreGraph["Saturday"] || 0,
            userDetail.weeklyScoreGraph["Sunday"] || 0,
          ];

        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };
    
    await fetchUserData();
  });
</script>

{#if modelOpen && userDetail}
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center mt-24 px-4 text-center md:items-center sm:block sm:p-0">
      <div 
        on:click={closeModal}
        class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-40" 
        aria-hidden="true"
      ></div>

      <div 
        class="inline-block w-full max-w-xl p-8 my-20 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl 2xl:max-w-2xl"
        style="opacity: {modelOpen ? 1 : 0}; transform: {modelOpen ? 'translateY(0)' : 'translateY(4rem)'};"
      >
        <button 
          on:click={closeModal}
          class="text-gray-600 focus:outline-none hover:text-gray-700 absolute top-3 right-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <div class="flex flex-col items-center mb-5">
          {#if userDetail.imagePath}
            <img src="{imageUrl}" class="w-32 h-32 rounded-full mb-5 border-4 border-yellow-300" alt="User Profile Image" />
          {:else}
            <svg width="128" height="128" viewBox="0 0 1792 1792" class="mb-5">
              <path fill="black" d="M1523 1339q-22-155-87.5-257.5T1251 963q-67 74-159.5 115.5T896 1120t-195.5-41.5T541 963q-119 16-184.5 118.5T269 1339q106 150 271 237.5t356 87.5t356-87.5t271-237.5m-243-699q0-159-112.5-271.5T896 256T624.5 368.5T512 640t112.5 271.5T896 1024t271.5-112.5T1280 640m512 256q0 182-71 347.5t-190.5 286T1245 1721t-349 71q-182 0-348-71t-286-191t-191-286T0 896t71-348t191-286T548 71T896 0t348 71t286 191t191 286t71 348" />
            </svg>
          {/if}
          <h2 class="text-2xl font-bold">{userDetail.name}</h2>
          <p class="text-base">{userDetail.email}</p>
        </div>

        <div class="flex flex-col items-center">
          {#if userDetail.isSubscribed}
            <button class="bg-white text-[#f7c188] font-bold text-lg px-4 py-2 rounded-full">
              {`Subscribed until ${userDetail.expirationDate ? new Date(userDetail.expirationDate).toLocaleDateString() : ""}`}
            </button>
          {:else}
            <button class="bg-white text-[#f7c188] font-bold text-lg px-4 py-2 rounded-full">
              Not Subscribed
            </button>
          {/if}
        </div>

        <div class="mt-5">
          <div class="flex flex-row justify-around">
            <div class="text-center">
              <p class="text-[#f7c188] font-bold text-2xl">{userDetail.unitsUnlocked || 0}</p>
              <p class="text-gray-500 text-xs font-bold">Units Unlocked</p>
            </div>
            <div class="text-center">
              <p class="text-[#f7c188] font-bold text-2xl">{userDetail.totalScoreWeekly || 0}</p>
              <p class="text-gray-500 text-xs font-bold">Total Weekly Score</p>
            </div>
            <div class="text-center">
              <p class="text-[#f7c188] font-bold text-2xl">{userDetail.highestScore || 0}</p>
              <p class="text-gray-500 text-xs font-bold">High Score</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center mt-5">
          {#if weeklyScores.length != 0}
          <UserScoreChart {weeklyScores} {labels} />
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
