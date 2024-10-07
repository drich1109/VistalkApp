<script lang="ts">
  export let isLoading: boolean;
</script>

{#if isLoading}
  <tr>
    <td colspan="4" class="loader-cell"> <!-- Adjust the colspan based on your table structure -->
      <div class="loader-container">

            <div class="dots">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
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
</style>
