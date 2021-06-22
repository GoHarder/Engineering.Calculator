<script>
   import { createEventDispatcher, onMount } from 'svelte';
   import { round, floor } from '../lib/round.js';

   // Components
   import HelperText from './HelperText.svelte';
   import Input from './input/Input.svelte';
   import { IconButton } from '../button';
   import { Link } from '../button/icons';
   import DataList from '../../common/DataList.svelte';

   // Properties
   export let calc = 0;
   export let disabled = false;
   export let disableValidation = false;
   export let display = false;
   export let focused = false;
   export let helperText = '';
   export let invalid = false;
   export let label = '';
   export let link = false;
   export let list = '';
   export let override = false;
   export let max = undefined;
   export let metric = false;
   export let min = 0;
   export let reset = false;
   export let required = false;
   export let step = 1;
   export let value = '';
   export let variant = 'filled';

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let feet = 0;
   let inches = 0;
   let feetFocused = false;
   let inchFocused = false;
   let options = [];

   // Reactive Variables
   $: metricValue = round(value * 0.0254, 2);
   $: classes = ['input-root', 'split', 'mdc-menu-surface--anchor', helperText ? '' : 'bump'].join(' ');

   $: parameters1 = {
      disableValidation,
      display,
      label,
      max,
      min,
      reset,
      required,
      step,
      suffix: 'ft',
      type: 'number',
      variant,
   };

   $: parameters2 = {
      disableValidation,
      display,
      label: '',
      max: 12,
      min,
      required,
      step: 0.0001,
      suffix: 'in',
      type: 'number',
      variant,
   };

   // Reactive Rules
   $: if (feetFocused || inchFocused) {
      focused = feetFocused || inchFocused;
   } else {
      setTimeout(() => {
         focused = feetFocused || inchFocused;
      }, 0.25);
   }

   $: if (value) {
      feet = floor(value / 12);
      inches = round(value % 12, 4);
   }

   $: if (!override && reset) value = calc;

   $: if (link?.location) {
      parameters1.display = true;
      parameters2.display = true;
   }

   // Events
   const onFeet = (event) => {
      feet = event.target.valueAsNumber;
      value = round(event.target.valueAsNumber * 12 + inches, 4);
   };

   const onInches = (event) => {
      inches = event.target.valueAsNumber;
      value = round(feet * 12 + event.target.valueAsNumber, 4);
   };

   const onSelect = (event) => (value = event.detail);

   // Lifecycle
   onMount(() => {
      const optionSearch = document?.getElementById(list)?.querySelectorAll('option') ?? [];
      const data = [];
      optionSearch.forEach((option) => data.push({ text: option.text, value: parseFloat(option.value) }));
      options = data;
   });
</script>

<div class={classes}>
   <Input bind:disabled bind:invalid bind:override bind:focused={feetFocused} on:change={onFeet} value={feet} calc={floor(calc / 12)} {...parameters1}>
      <span slot="helperText">
         {#if helperText}
            <HelperText validation>{helperText}</HelperText>
         {/if}
      </span>
   </Input>
   <Input bind:disabled bind:invalid bind:override bind:focused={inchFocused} on:change={onInches} value={inches} calc={round(calc % 12, 4)} {...parameters2}>
      <span slot="helperText">
         {#if helperText}
            <HelperText validation>{' '}</HelperText>
         {/if}
      </span>
   </Input>

   <DataList on:select={onSelect} {list} {focused} />

   {#if metric}
      <span class="metric-value">{`(${metricValue} m)`}</span>
   {/if}

   {#if link && link.location}
      <IconButton on:click={() => dispatch('link', link)} title={link.location}>
         <Link />
      </IconButton>
   {/if}
</div>
