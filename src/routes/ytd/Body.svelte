<script>
import { store } from '../../stores/store'
import PageTitle from '../../components/PageTitle.svelte';
import { Calendar } from '@graph-paper/icons'

</script>

<main>

  <PageTitle>
    <span slot=icon>
      <Calendar size={16} />
    </span>
    <span slot=view>year-to-date</span>
    <span slot=title>{$store.usage}</span>
    <div slot=description>
      This is a test.
    </div>
  </PageTitle>



</main>
