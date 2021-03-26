<script>
   // Parameters
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
</script>

<input class="mdc-text-field__input" bind:value on:focus on:change type="email" {...parameters} />
