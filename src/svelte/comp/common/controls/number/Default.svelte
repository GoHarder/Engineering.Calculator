<script>
   // SMUI Components
   import Textfield from '@smui/textfield';

   // Properties
   export let value = 0;
   export let precision = 1;
   export let disabled = false;
   export let style = 0;

   // Events
   const onFocus = (event) => event.target.select();
</script>

<div class={`vantage-input ${style ? `n${style}` : ''}`}>
   <div class="input">
      <Textfield class="medium" type="number" bind:value on:focus={onFocus} {disabled} fullwidth input$step={precision} />
   </div>
</div>
