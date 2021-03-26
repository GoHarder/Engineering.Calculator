<script>
   // Parameters
   export let display = false;
   export let list = '';
   export let max = undefined;
   export let maxLength = undefined;
   export let min = undefined;
   export let minLength = undefined;
   export let pattern = undefined;
   export let step = undefined;
   export let value = '';

   // Constants
   const parameters = {
      list,
      max,
      maxLength,
      min,
      minLength,
      pattern,
      step,
   };

   const displayValue = value;

   // Events
   const onChange = () => {
      value = displayValue;
   };
</script>

{#if display}
   <input class="mdc-text-field__input display" bind:value on:focus on:change={onChange} tabindex="-1" type="number" {...parameters} />
{:else}
   <input class="mdc-text-field__input" bind:value on:focus on:change type="number" {...parameters} />
{/if}
