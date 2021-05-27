<script>
   // Components
   import { Option, OptGroup } from '../../material/select';

   // Properties
   export let options = [];
   export let selected = '';

   // Reactive Variables
   $: stockedOptions = options.filter((option) => option.stockStatus === 'Stocked');
   $: availableOptions = options.filter((option) => option.stockStatus === 'Available');
   $: checkOptions = options.filter((option) => option.stockStatus === 'Check');
</script>

{#if stockedOptions.length > 0}
   <OptGroup label="Stocked">
      {#each stockedOptions as { disabled, text } (text)}
         <Option {disabled} selected={selected === text} {text} />
      {/each}
   </OptGroup>
{/if}

{#if availableOptions.length > 0}
   <OptGroup label="Available">
      {#each availableOptions as { disabled, text } (text)}
         <Option {disabled} selected={selected === text} {text} />
      {/each}
   </OptGroup>
{/if}

{#if checkOptions.length > 0}
   <OptGroup label="Check">
      {#each checkOptions as { disabled, text } (text)}
         <Option {disabled} selected={selected === text} {text} />
      {/each}
   </OptGroup>
{/if}
