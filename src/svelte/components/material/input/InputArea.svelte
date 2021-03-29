<script>
   // Components
   import { round } from './round.js';
   import HelperText from './HelperText.svelte';
   import Input from './Input.svelte';

   // Properties
   export let disabled = false;
   export let disableValidation = false;
   export let display = false;
   export let helperText = '';
   export let invalid = false;
   export let label = '';
   export let list = '';
   export let max = undefined;
   export let metric = false;
   export let min = 0;
   export let required = false;
   export let step = 0.01;
   export let value = ''; // in²
   export let variant = 'filled';

   // Constants
   const parameters = {
      disableValidation,
      display,
      label,
      list,
      max,
      min,
      required,
      step,
      suffix: 'ft²',
      type: 'number',
      variant,
   };

   // Variables
   let squareFeet = 0;

   // Reactive Variables
   $: metricValue = round(value * 0.00064516, 4);

   // Reactive Rules
   $: if (value) {
      squareFeet = round(value / 144, 2);
   }

   // Events
   const onChange = (event) => {
      value = round(event.target.valueAsNumber * 144, 4);
   };
</script>

<div class:metric-wrapper={metric}>
   <Input bind:disabled bind:invalid value={squareFeet} on:change={onChange} {...parameters}>
      <span slot="helperText">
         {#if helperText}
            <HelperText validation>{helperText}</HelperText>
         {/if}
      </span>
   </Input>

   {#if metric}
      <span class="metric-value">{`(${metricValue} m²)`}</span>
   {/if}
</div>
