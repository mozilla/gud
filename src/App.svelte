<script>
  import page from 'page';
  import Sidebar from "./components/Sidebar.svelte";
  import routes from './routes/routes';
  import { store } from './stores/store';
  import { storeToQuery } from './stores/cache';

  function updateQueryString(query) {
    if (window.history.replaceState) {
      const newURL = `${window.location.origin}${window.location.pathname}?${query}`;
      window.history.replaceState(null, null, newURL);
    }
  }



  let mounted = false;
  onMount(() => { mounted = true });

  $: if (mounted) {
    updateQueryString(storeToQuery($store));
  }

  let bodyComponent;
  let sidebarComponent;

  function useComponent(thisView = undefined) {
    return ({params}) => {
      const currentView = params.view;
      let view = thisView || currentView;
      bodyComponent = routes[view].body;
      sidebarComponent = routes[view].sidebar;
    }
  }
  page('/', useComponent('explore'));
  page('/:view', useComponent());
  page({ hashbang: true });

</script>

<style>
  div {
    display: grid;
    grid-template-columns: calc(var(--space-1x) * 36) auto;
    min-width: calc(100vw - var(--space-4x)) !important;
  }
</style>

<div>
  <Sidebar>
    <svelte:component this={sidebarComponent} />
  </Sidebar>
  <svelte:component this={bodyComponent} />
</div>
