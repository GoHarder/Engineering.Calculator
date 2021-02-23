<script>
   // SMUI Components
   import Textfield from '@smui/textfield';

   // Properties
   export let value = 0;
   export let precision = 1;

   // Events
   const onFocus = (event) => event.target.select();
</script>

<Textfield class="medium" type="number" bind:value on:focus={onFocus} fullwidth withTrailingIcon input$step={precision} />
