<script lang="ts">
    export let isLoading: boolean;
    export let triviaList: string[] = [
      "Did you know? Learning a second language can improve your memory and problem-solving skills!",
      "Fun fact! Bilingual people are better at multitasking!",
      "Did you know? Learning new languages can delay the onset of dementia!",
      "Fun fact! Over half of the world’s population is bilingual or multilingual!",
      "Did you know? Learning languages can improve your decision-making skills!"
    ];
    
    let currentTriviaIndex = 0;
  
    // Rotate trivia every 5 seconds
    const rotateTrivia = () => {
      setInterval(() => {
        currentTriviaIndex = (currentTriviaIndex + 1) % triviaList.length;
      }, 5000);
    };
  
    $: if (isLoading) {
      rotateTrivia();
    }
  </script>
  
  {#if isLoading}
    <div class="loader-container">
      <!-- Floating birds and objects -->
      <div class="floating bird bird1"></div>
      <div class="floating bird bird2"></div>
      <div class="floating bubble bubble1"></div>
      <div class="floating bubble bubble2"></div>
      <div class="floating bubble bubble3"></div>
  
      <div class="loader-box">
        <div class="loader"></div>
      </div>
      <p class="trivia-message">{triviaList[currentTriviaIndex]}</p>
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
      background: linear-gradient(135deg, #a8e6cf, #dcedc1, #ffd3b6); /* Soft green and peach colors */
      z-index: 1000;
      text-align: center;
      overflow: hidden; /* Hide elements floating outside */
    }
  
    /* Bird animation */
    .bird {
      width: 50px;
      height: 50px;
      background: url('/images/bird-icon.png') no-repeat center center; /* Use your bird icon here */
      background-size: contain;
      position: absolute;
      animation: fly 10s linear infinite;
    }
  
    .bird1 {
      top: 10%;
      left: -10%;
      animation-delay: 0s;
    }
  
    .bird2 {
      top: 40%;
      left: -15%;
      animation-delay: 2s;
    }
  
    /* Bubble animation */
    .bubble {
      width: 30px;
      height: 30px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      position: absolute;
      animation: float 7s ease-in-out infinite;
    }
  
    .bubble1 {
      bottom: 10%;
      left: 10%;
    }
  
    .bubble2 {
      bottom: 20%;
      left: 50%;
    }
  
    .bubble3 {
      bottom: 30%;
      left: 80%;
    }
  
    @keyframes fly {
      0% {
        transform: translateX(0) translateY(0) scale(1);
      }
      50% {
        transform: translateX(150vw) translateY(-30vh) scale(1.1); /* Flying across the screen */
      }
      100% {
        transform: translateX(0) translateY(0) scale(1);
      }
    }
  
    @keyframes float {
      0% {
        transform: translateY(0) scale(1);
        opacity: 0.7;
      }
      50% {
        transform: translateY(-50vh) scale(1.2);
        opacity: 1;
      }
      100% {
        transform: translateY(0) scale(1);
        opacity: 0.7;
      }
    }
  
    .loader-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      animation: pulse 2s infinite;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
    }
  
    .loader {
      border: 6px solid #f3f3f3;
      border-top: 6px solid #2ecc71;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }
  
    .trivia-message {
      font-size: 1.4rem;
      color: #2ecc71;
      max-width: 80%;
      margin: 20px auto 0;
      padding: 0 20px;
      animation: fadeIn 2s ease-in-out;
      font-family: 'Quicksand', sans-serif;
      font-weight: 600;
    }
  
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
  </style>
  