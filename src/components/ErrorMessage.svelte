<script>
  import { fly } from "svelte/transition";
  export let error;
</script>

<style>
  section {
    text-align: center;
    font-size: 22px;
    color: var(--faint-text);
    font-weight: 900;
    opacity: 0.8;
    line-height: 1.5;
    max-width: var(--space-40x);
    margin: auto;
    margin-top: 0px;
  }

  div.error-call {
    font-size: 18px;
    font-weight: normal;
    padding-top: var(--space-4x);
  }

  .error {
    font-style: italic;
  }
</style>

<section class=transition-message in:fly={{ y: 20, duration: 1000 }}>
    Oops! Something went wrong.
  <div class="error-call error">{error}</div>
  <div class="error-call">Reach out to us on <a href='https://mozilla.slack.com/archives/CKMUVLPSL'>#gud</a> and we'll get it resolved.</div>
</section>
