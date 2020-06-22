<script>
import { fly } from 'svelte/transition';
</script>

<div in:fly={{ y: 30, duration: 200 }} class="loading-data">
  <div class="loading-message">Loading data ...</div>
  <div class="loading-spinner">
    <svg viewBox="25 25 50 50">
      <circle cx="50" cy="50" r="20" />
    </svg>
  </div>
</div>
