import App from "./App.svelte";
import "@graph-paper/core/style.css";

const app = new App({
  target: document.body,
  props: {
    name: "Growth & Usage Dashboard"
  }
});

export default app;
