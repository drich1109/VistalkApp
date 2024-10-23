<script lang="ts">
  export let isVisible: boolean;
  export let message: string; // Optional message
  
  let spinValue = 0; // Initial spin value
  let interval: number; // Store interval ID

  // Function to start the spinning animation
  function startSpinning() {
    interval = setInterval(() => {
      spinValue = (spinValue + 1) % 360; // Increment spin value
    }, 10); // Update every 10ms for smoother animation
  }

  // Function to stop the spinning animation
  function stopSpinning() {
    clearInterval(interval);
  }

  // Start or stop spinning based on visibility
  $: if (isVisible) {
    startSpinning();
  } else {
    stopSpinning();
  }

</script>

{#if isVisible}
  <tr>
    <td colspan="4" class="loader-cell"> <!-- Adjust the colspan based on your table structure -->
      <div class="items-center justify-center">
        <div class="donut-container" style="transform: rotate({spinValue}deg);">
          <div class="donut"></div>
          <div class="inner-circle"></div>
        </div>
        {#if message}
          <div class="message-text">{message}</div>
        {/if}
      </div>
    </td>
  </tr>
{/if}

<style>
  .loader-cell {
    text-align: center; /* Center content horizontally */
    vertical-align: middle; /* Center content vertically */
    padding: 20px; /* Add padding for spacing */
    height: 100px; /* Set a height to ensure vertical centering */
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

  .action-buttons {
    margin-top: 15px; /* Space between loader and buttons */
    display: flex;
    gap: 10px; /* Space between buttons */
  }

  .action-btn {
    background-color: #4CAF50; /* Green background */
    color: white; /* White text */
    border: none; /* Remove borders */
    border-radius: 5px; /* Rounded corners */
    padding: 10px 15px; /* Padding inside the button */
    cursor: pointer; /* Pointer cursor on hover */
    transition: background-color 0.3s; /* Smooth background transition */
  }

  .action-btn:hover {
    background-color: #45a049; /* Darker green on hover */
  }

  .donut-container {
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    border-radius: 50%; /* Make sure it's a circle */
    position: relative;
  }
  .donut {
    width: 100%;
    height: 100%;
    border-radius: 50%; /* Ensure the donut is circular */
    border: 1px transparent; /* Use transparent for the other sides */
    border-top-color: transparent; /* Top border is transparent */
    background: conic-gradient(#6addd0, #f7c188); /* Gradient fill */
  }
  .inner-circle {
    position: absolute;
    top: 10px; /* Adjusted for inner circle */
    left: 10px; /* Adjusted for inner circle */
    width: 60px;
    height: 60px;
    border-radius: 50%; /* Ensure the inner circle is circular */
    background-color: white;
  }
  .message-text {
    margin-top: 10px;
    color: black;
    font-size: 16px;
    text-align: center;
  }
</style>
