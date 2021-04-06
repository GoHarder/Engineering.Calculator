<script>
   // Properties
   export let label = '';
   export let options = [];
</script>

<optgroup {label}>
   {#each options as option}
      <option value={option.value ? option.value : option.text}>{option.text}</option>
   {/each}
</optgroup>
