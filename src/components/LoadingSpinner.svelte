<script>
import { fly } from 'svelte/transition';
</script>

<style>


.loading-data {
  font-weight: bold;
  border-radius: 5px;
}

.loading-message {
  opacity: 0.8;
  margin-bottom: var(--pad);
}

.loading-data svg {
  width: 3.75em;
  transform-origin: center;
  animation: rotate-loader 2s linear infinite;
}

.loading-data circle {
  fill: none;
  stroke: #fc2f70;
  stroke-width: 2;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash-loader 1.5s ease-in-out infinite;
}

@keyframes rotate-loader {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash-loader {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dashoffset: -125px;
  }
}

</style>

<div in:fly={{ y: 30, duration: 200 }} class="loading-data transition-message">
  <div class="loading-message">Loading data ...</div>
  <div class="loading-spinner">
    <svg viewBox="25 25 50 50">
      <circle cx="50" cy="50" r="20" />
    </svg>
  </div>
</div>
