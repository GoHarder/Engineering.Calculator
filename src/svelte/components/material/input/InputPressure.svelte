<script>
   // Components
   import { round } from './round.js';
   import HelperText from './HelperText.svelte';
   import Input from './Input.svelte';

   // Properties
   export let disabled = false;
   export let disableValidation = false;
   export let helperText = '';
   export let invalid = false;
   export let label = '';
   export let list = '';
   export let max = undefined;
   export let metric = false;
   export let min = 0;
   export let required = false;
   export let step = 0.01;
   export let value = ''; // lb/in²
   export let variant = 'filled';

   // Constants
   const parameters = {
      disableValidation,
      label,
      list,
      max,
      min,
      required,
      step,
      suffix: 'lb/ft²',
      type: 'number',
      variant,
   };

   // Variables
   let psf = 0;

   // Reactive Variables
   $: metricValue = round(value * 4.88242764, 4);

   // Reactive Rules
   $: if (value) {
      psf = round(value * 144, 2);
   }

   // Events
   const onChange = (event) => {
      value = round(event.target.valueAsNumber / 144, 4);
   };
</script>

<div class:metric-wrapper={metric}>
   <Input bind:disabled bind:invalid value={psf} on:change={onChange} {...parameters}>
      <span slot="helperText">
         {#if helperText}
            <HelperText validation>{helperText}</HelperText>
         {/if}
      </span>
   </Input>

   {#if metric}
      <span class="metric-value">{`(${metricValue} kg/m²)`}</span>
   {/if}
</div>
