<script>
import { store } from '../../stores/store'
import PageTitle from '../../components/PageTitle.svelte';
import { Calendar } from '@graph-paper/icons';

</script>

<main>

  <PageTitle>
    <span slot=icon>
      <Calendar size={16} />
    </span>
    <span slot=view>Year-To-Date</span>
    <span slot=title>{$store.usage}</span>

  </PageTitle>

  <div>Coming soon.</div>

</main>
