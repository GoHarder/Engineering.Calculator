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
   const parameters1 = {
      disableValidation,
      label,
      list,
      max,
      min,
      required,
      step,
      suffix: 'ft',
      type: 'number',
      variant,
   };

   const parameters2 = {
      disableValidation,
      label: '',
      list,
      max: 12,
      min,
      required,
      step: 0.0001,
      suffix: 'in',
      type: 'number',
      variant,
   };

   // Variables
   // Subscriptions
   // Reactive Variables
   $: metricValue = round(value * 0.0254, 2);

   // Reactive Rules
   // Events
   const onFocus = (event) => event.target.select();

   // Lifecycle
</script>

<div class="split" class:metric-wrapper={metric}>
   <Input bind:disabled bind:invalid bind:value on:focus={onFocus} {...parameters1}>
      <span slot="helperText">
         {#if helperText}
            <HelperText validation>{helperText}</HelperText>
         {/if}
      </span>
   </Input>
   <Input bind:disabled bind:invalid bind:value on:focus={onFocus} {...parameters2} />

   {#if metric}
      <span class="metric-value">{`(${metricValue} m)`}</span>
   {/if}
</div>
