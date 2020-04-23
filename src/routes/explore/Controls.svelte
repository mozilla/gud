<script>
import { store } from '../../stores/store';
import DatePicker from '../../components/controls/DatePicker.svelte';

</script>

<div class="body-controls gafc col-gap-2x">
  <DatePicker
    startDate={$store.startDate}
    endDate={$store.endDate}
    on:applyDates={(evt) => {
      const { start, end } = evt.detail;
      store.setField('startDate', start);
      store.setField('endDate', end);
    }} />
</div>
