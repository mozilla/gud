<style>

  header {
    padding-top: var(--space-2x);
    padding-left: var(--space-2x);
    color: var(--cool-gray-700);
    padding-bottom: var(--space-6x);
    display: grid;
    grid-template-columns: auto max-content;
    grid-template-rows: auto auto;
    grid-template-areas: 'title nav'
                         'description nav'
  }

  .view {
    color: var(--cool-gray-400);
    font-weight: normal;
  }

  .view:after {
    content: ' / ';
  }

  h1 {
    margin: 0px;
    padding: 0px;
    font-size: var(--text-06);
    grid-area: title;
    color: var(--cool-gray-700);
  }

  header .description {
    font-size: var(--text-03);
    max-width: calc(var(--space-1x) * 120);
    grid-area: description;
  }

  header .nav {
    grid-area: nav;
  }

</style>


    <header>
      <h1>
        <span style='color: var(--cool-gray-400);'>
          <slot name='icon' />
        </span>
       <span class=view>
        <slot name=view></slot>
      </span> <slot name=title></slot></h1>
      <div class=description><slot name=description /></div>
      <div class=nav>
        <slot name=controls />
      </div>
    </header>
