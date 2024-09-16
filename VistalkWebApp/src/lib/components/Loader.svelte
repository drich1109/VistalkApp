<script lang="ts">
  export let isLoading: boolean;
</script>

{#if isLoading}
  <div class="loader-container">
    <div class="loader-box">
      <div class="chat-box">
        <div class="dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .loader-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #dcdcdc; /* Plain gray background */
    z-index: 1000;
    text-align: center;
    overflow: hidden; /* Hide elements floating outside */
  }

  .loader-box {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 80px; /* Adjusted box width */
    height: 60px; /* Adjusted box height */
  }

  .chat-box {
    width: 100%;
    height: 100%;
    background-color: #fff; /* White background for the chat box */
    border-radius: 15px; /* Rounded corners */
    border: 1px solid #ccc; /* Light border for the chat box */
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2); /* Slight shadow for depth */
    position: relative;
    padding: 5px; /* Padding inside the chat box */
  }

  .chat-box::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #fff; /* Triangle for the chat bubble arrow */
  }

  .dots {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dot {
    width: 10px; /* Slightly larger dot size */
    height: 10px; /* Slightly larger dot size */
    background-color: #99BC85; /* Color of the dots */
    border-radius: 50%;
    margin: 0 4px; /* Adjusted margin */
    animation: bounce 1.5s infinite ease-in-out;
  }

  .dot:nth-child(2) {
    animation-delay: 0.3s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.6s;
  }

  @keyframes bounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
  }
</style>
