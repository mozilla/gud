<script>
  import { onMount } from 'svelte'
  import page from 'page';
  import Sidebar from "./components/Sidebar.svelte";
  import routes from './routes/routes';
  import { store } from './stores/store';
  import { storeToQuery } from './stores/cache';

  function updateQueryString(query) {
    if (window.history.replaceState) {
      let hash = window.location.hash.split('?')[0];
      if (hash.length === 0 || hash === '#!/') {
        hash = '';
      }
      const newURL = `${window.location.origin}${window.location.pathname}${hash}?${query}`
      window.history.replaceState(null, null, newURL);
    }
  }

  let mounted = false;
  onMount(() => { mounted = true });

  let currentView;
  let bodyComponent;
  let sidebarComponent;

  function useComponent(thisView = undefined) {
    return (ctx, next) => {
      const params = ctx.params;
      const urlView = params.view;
      currentView = thisView || urlView;
      store.setField('mode', currentView);
      bodyComponent = routes[currentView].body;
      sidebarComponent = routes[currentView].sidebar;
      next('wonderful');
    }
  }

  function updateAfterMoving(ctx, next) {
    ctx.path += '?' + storeToQuery($store);
    ctx.save();
  }

  page('/', useComponent('explore'), updateAfterMoving);
  page('/:view', useComponent(), updateAfterMoving);
  page({ hashbang: true });

  $: if (mounted) {
    updateQueryString(storeToQuery($store));
  }

</script>

<style>
  div {
    display: grid;
    grid-template-columns: calc(var(--space-1x) * 36) auto;
    min-width: calc(100vw - var(--space-4x)) !important;
  }
</style>

<div id='gud'>
  <Sidebar>
    <svelte:component this={sidebarComponent} />
  </Sidebar>
  <svelte:component this={bodyComponent} />
</div>
