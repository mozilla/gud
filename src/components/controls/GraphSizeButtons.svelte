<script>
import { Button, ButtonGroup } from '@graph-paper/button';
  import {
    Stack,
    Tile,

  } from "@graph-paper/icons";

    import ThreeByThree from '../ThreeByThree.svelte'
import { store } from '../../stores/store';


  function changeSize(size) {
    return () => {
      store.setField('graphSize', size);
    };
  }
</script>

<ButtonGroup level="medium" compact>
  <Button toggled={$store.graphSize === 'small'} on:click={changeSize('small')}>
    <ThreeByThree size={16} />
  </Button>
  <Button toggled={$store.graphSize === 'medium'}  on:click={changeSize('medium')}>
    <Tile size={16} />
  </Button>
  <Button  toggled={$store.graphSize === 'large'}  on:click={changeSize('large')}>
    <Stack size={16} />
  </Button>
</ButtonGroup>
