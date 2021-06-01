<script>
   import { createEventDispatcher } from 'svelte';

   // Components
   import { round } from '../lib/round.js';
   import HelperText from './HelperText.svelte';
   import Input from './input/Input.svelte';
   import { IconButton } from '../button';
   import { Link } from '../button/icons';

   // Properties
   export let disabled = false;
   export let disableValidation = false;
   export let display = false;
   export let helperText = '';
   export let invalid = false;
   export let label = '';
   export let link = false;
   export let list = '';
   export let max = undefined;
   export let metric = false;
   export let min = 0;
   export let required = false;
   export let step = 0.01;
   export let value = ''; // in²
   export let variant = 'filled';

   // Constants
   const dispatch = createEventDispatcher();
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
   $: classes = ['input-root', helperText ? '' : 'bump'].join(' ');

   // Reactive Rules
   $: if (value) {
      squareFeet = round(value / 144, 2);
   }

   $: if (link?.location) parameters.display = true;

   // Events
   const onChange = (event) => {
      value = round(event.target.valueAsNumber * 144, 4);
   };
</script>

<div class={classes}>
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

   {#if link && link.location}
      <IconButton on:click={() => dispatch('link', link)} title={link.location}>
         <Link />
      </IconButton>
   {/if}
</div>
