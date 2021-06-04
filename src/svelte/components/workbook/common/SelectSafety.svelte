<script>
   import { slide } from 'svelte/transition';
   import { getFromArray } from '../modules/js/functions';

   // Components
   import { Option, Select } from '../../material/select';
   import { InputLength, InputWeight } from '../../material/input';

   // Properties

   // - Bound
   export let optional = false;
   export let safety;
   export let safetyHeight = 0;
   export let safetyModel;
   export let safetyWeight = 0;

   // - Read Only
   export let metric;
   export let railSize;
   export let safeties;

   // Variables
   let options = [{ text: 'Other', disabled: false }];

   // Reactive Rules
   $: safety = getFromArray(safetyModel, safeties);

   $: if (safety && safetyModel !== 'Other') {
      safetyHeight = safety.height;
      safetyWeight = safety.weight;
   }

   $: if (safetyModel === 'None') {
      safetyHeight = 0;
      safetyWeight = 0;
   }

   $: if (safeties && railSize) {
      options = [...safeties].map((safety) => {
         return {
            text: safety.name,
            disabled: !safety.railSizes.includes(railSize),
         };
      });

      options = [...options, { text: 'Other', disabled: false }];
   }

   $: if (optional) {
      options = [{ text: 'None', disabled: false }, ...options];
   }
</script>

<Select bind:value={safetyModel} label="Safety Model">
   {#each options as { text, disabled } (text)}
      <Option {disabled} selected={safetyModel === text} {text} />
   {/each}
</Select>

{#if safetyModel === 'Other'}
   <div transition:slide|local>
      <InputWeight bind:value={safetyWeight} label="Safety Weight" step={0.01} {metric} />

      <InputLength bind:value={safetyHeight} label="Safety Height" {metric} />
   </div>
{/if}
