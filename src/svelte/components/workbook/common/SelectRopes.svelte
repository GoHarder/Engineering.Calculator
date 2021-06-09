<script>
   import * as gTables from '../modules/js/tables';

   // Components
   import Fieldset from './Fieldset.svelte';
   import { Input, InputLength } from '../../material/input';
   import { Option, Select } from '../../material/select';

   // Properties
   export let link = undefined;
   export let metric = false;
   export let ropePitch = 0;
   export let ropePitchOverride = false;
   export let ropeSize = 0.375;
   export let ropeQty = 4;

   // Reactive Rules
   $: ropePitchCalc = ropeSize + 0.25;
</script>

<Fieldset title="Ropes">
   <Input bind:value={ropeQty} on:link label="Quantity" link={{ cmd: 'changeModule', location: link }} type="number" min={4} />

   <Select bind:value={ropeSize} on:link label="Size" link={{ cmd: 'changeModule', location: link }}>
      {#each gTables.ropeSizes as { name, value }}
         <Option text={name} {value} />
      {/each}
   </Select>

   <InputLength
      bind:value={ropePitch}
      bind:override={ropePitchOverride}
      bind:calc={ropePitchCalc}
      on:link
      label="Pitch"
      link={{ cmd: 'changeModule', location: link }}
      reset
      {metric}
   />
</Fieldset>
