<script lang="ts">
    export let isDanger: boolean;
    export let message: string;
    export let title: string;

    let visible = true;
    let fadingOut = false; 

    function startFadeOut() {
        fadingOut = true;
        setTimeout(() => visible = false, 500); 
    }

    setTimeout(startFadeOut, 5000); 
</script>

<style>
    .message-box {
        opacity: 1;
        visibility: visible;
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    }

    .message-box.fade-out {
        animation: fade-out 0.5s ease-out forwards;
    }

    .message-box.show {
        animation: fade-in 0.5s ease-out;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fade-out {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
</style>

{#if visible}
    <div class={`message-box ${fadingOut ? 'fade-out' : 'show'}`}>
        {#if isDanger}
            <!-- svelte-ignore a11y-missing-attribute -->
            <div class="shadow-md p-1 flex flex-row rounded-lg bg-white ">
                <div class="bg-red-500 inline-block rounded-lg p-1 mr-1"></div>
                <b class="mr-2">{title}</b>
                <p>{message}</p>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <a class="h-3 w-3 text-gray-500 inline-block p-1 mr-2" on:click={() => startFadeOut()}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </a>
            </div>
        {:else}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <div class="shadow-md p-1 flex flex-row rounded-lg bg-white ">
                <div class="bg-green-500 inline-block rounded-lg p-1 mr-1"></div>
                <b class="mr-2">{title}</b>
                <p>{message}</p>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <a class="h-3 w-3 text-gray-500 inline-block p-1 mr-2" on:click={() => startFadeOut()}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </a>
            </div>
        {/if}
    </div>
{/if}
