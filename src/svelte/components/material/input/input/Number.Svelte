<script>
   // Parameters
   export let display = false;
   // export let invalid = false;
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

   // Variables
   let input = undefined;

   // Reactive Rules
   // if (display && invalid) {
   //    console.log(input);
   // }
</script>

{#if display}
   <input class="mdc-text-field__input" bind:this={input} {value} tabindex="-1" type="number" />
{:else}
   <input class="mdc-text-field__input" bind:value on:focus on:change on:blur type="number" {...parameters} />
{/if}
