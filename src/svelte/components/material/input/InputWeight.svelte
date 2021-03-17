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
   export let step = 1;
   export let value = '';
   export let variant = 'filled';

   // Methods
   // Constants
   const parameters = {
      disableValidation,
      label,
      list,
      max,
      min,
      required,
      step,
      suffix: 'lb',
      type: 'number',
      variant,
   };

   // Variables
   // Subscriptions
   // Reactive Variables
   $: metricValue = round(value * 0.453592, 1);

   // Reactive Rules
   // Events

   // Lifecycle
</script>

<div class:metric-wrapper={metric}>
   <Input bind:disabled bind:invalid bind:value {...parameters}>
      <span slot="helperText">
         {#if helperText}
            <HelperText validation>{helperText}</HelperText>
         {/if}
      </span>
   </Input>

   {#if metric}
      <span class="metric-value">{`(${metricValue} kg)`}</span>
   {/if}
</div>
