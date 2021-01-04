<script>
import { Button, ButtonGroup } from '@graph-paper/button';
  import {
    Stack,
    Tile,
  } from "@graph-paper/icons";

    import ThreeByThree from '../icons/ThreeByThree.svelte'
import { store } from '../../stores/store';


  function changeSize(size) {
    return () => {
      store.setField('graphSize', size);
    };
  }
</script>

<ButtonGroup level="medium" compact>
  <Button
      tooltip={'Render graphs in a smaller size'}
      toggled={$store.graphSize === 'small'} on:click={changeSize('small')}>
    <ThreeByThree size={16} />
  </Button>
  <Button
    tooltip={'Render graphs in a larger size'}
    toggled={$store.graphSize === 'medium'}  on:click={changeSize('medium')}>
    <Tile size={16} />
  </Button>
  <Button
    tooltip={'Render graphs as one big graph per row'}
    toggled={$store.graphSize === 'large'}  on:click={changeSize('large')}>
    <Stack size={16} />
  </Button>
</ButtonGroup>
