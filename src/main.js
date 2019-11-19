import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    name: "Growth & Usage Dashboard"
  }
});

export default app;
