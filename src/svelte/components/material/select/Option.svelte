<script>
   // Properties
   export let disabled = false;
   export let hidden = false;
   export let selected = false;
   export let text = '';
   export let value = text;
</script>

<option {disabled} {hidden} {selected} {value}>{text}</option>

<style>
   option:disabled {
      color: rgba(0, 0, 0, 0.3);
   }
</style>
