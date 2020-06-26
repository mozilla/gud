import ExploreSidebar from "./explore/Sidebar.svelte";
import ExploreBody from "./explore/Body.svelte";

// import YTDSidebar from "./ytd/Sidebar.svelte";
import YTDBody from "./ytd/Body.svelte";

const routes = {};

function add(view, s, b) {
  routes[view] = { body: b, sidebar: s };
}

add("explore", ExploreSidebar, ExploreBody);
add("ytd", ExploreSidebar, YTDBody);

export default routes;
