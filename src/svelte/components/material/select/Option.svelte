<script>
   // Properties
   export let text = '';
   export let value = text;
   export let disabled = false;
   export let selected = false;
</script>

<option {disabled} {selected} {value}>{text}</option>

<style>
   option:disabled {
      color: rgba(0, 0, 0, 0.3);
   }
</style>
