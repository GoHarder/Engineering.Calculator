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
   export let step = 1;
   export let value = '';
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
      suffix: 'ft/min',
      type: 'number',
      variant,
   };

   // Reactive Variables
   $: metricValue = round(value * 0.00508, 4);
   $: classes = ['input-root', helperText ? '' : 'bump'].join(' ');

   // Reactive Rules
   $: if (link?.location) parameters.display = true;
</script>

<div class={classes}>
   <Input bind:disabled bind:invalid bind:value {...parameters}>
      <span slot="helperText">
         {#if helperText}
            <HelperText validation>{helperText}</HelperText>
         {/if}
      </span>
   </Input>

   {#if metric}
      <span class="metric-value">{`(${metricValue} m/sec)`}</span>
   {/if}

   {#if link && link.location}
      <IconButton on:click={() => dispatch('link', link)} title={link.location}>
         <Link />
      </IconButton>
   {/if}
</div>
