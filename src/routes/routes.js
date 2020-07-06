import { Explore, Calendar as YTDIcon } from "@graph-paper/icons";
import ExploreSidebar from "./explore/Sidebar.svelte";
import ExploreBody from "./explore/Body.svelte";

// import YTDSidebar from "./ytd/Sidebar.svelte";
import YTDBody from "./ytd/Body.svelte";

const routes = {};

function add({
  path,
  label,
  sidebar,
  body,
  icon,
  description,
  disabled = false,
}) {
  routes[path] = {
    path,
    label,
    sidebar,
    body,
    icon,
    description,
    disabled,
  };
}

add({
  path: "explore",
  label: "Explore",
  sidebar: ExploreSidebar,
  body: ExploreBody,
  icon: Explore,
  description: "Slice growth metrics by various dimensions",
});
add({
  path: "ytd",
  label: "Year-To-Date",
  sidebar: ExploreSidebar,
  body: YTDBody,
  icon: YTDIcon,
  description: "Coming soon",
  disabled: true,
});

export default routes;
