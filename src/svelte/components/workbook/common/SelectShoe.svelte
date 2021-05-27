<script>
   import { slide } from 'svelte/transition';
   import { getFromArray } from '../modules/js/functions';

   // Components
   import { Option, Select } from '../../material/select';
   import { InputLength, InputWeight } from '../../material/input';

   // Properties

   // - Bound
   export let shoe;
   export let shoeHeight = 0;
   export let shoeModel;
   export let shoeWeight = 0;

   // - Read Only
   export let metric;
   export let railSize;
   export let shoes;

   // Variables
   let options = [{ text: 'Other', disabled: false }];

   // Reactive Rules
   $: shoe = getFromArray(shoeModel, shoes);

   $: if (shoe && shoeModel !== 'Other') {
      shoeHeight = shoe.railContactHeight;
      shoeWeight = shoe.weight;
   }

   $: if (shoes && railSize) {
      options = [...shoes].map((shoe) => {
         return {
            text: shoe.name,
            disabled: !shoe.railSizes.includes(railSize),
         };
      });

      options = options.filter((shoe) => (shoe.text === '371-CS' && !shoe.disabled) === false);

      options = [...options, { text: 'Other', disabled: false }];
   }
</script>

<div class="input-bump">
   <Select bind:value={shoeModel} label="Shoe Model">
      {#each options as { text, disabled } (text)}
         <Option {disabled} selected={shoeModel === text} {text} />
      {/each}
   </Select>
</div>

{#if shoeModel === 'Other'}
   <div class="input-bump" transition:slide>
      <InputWeight bind:value={shoeWeight} label="Weight per Shoe" {metric} />
   </div>

   <div class="input-bump" transition:slide>
      <InputLength bind:value={shoeHeight} label="Shoe Height" {metric} />
   </div>
{/if}
