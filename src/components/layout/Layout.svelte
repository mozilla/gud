<style>
.layout {
  --sidebar-width: calc(var(--space-base) * 30);
  display: grid;
  grid-template-columns: var(--sidebar-width) auto;
  align-items: stretch;
  min-height: 100vh;
}
</style>

<div class="layout">
  <slot></slot>
</div>
