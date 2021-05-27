<script>
   import { onMount } from 'svelte';
   import { slide } from 'svelte/transition';
   import { round, floor } from '../lib/round.js';

   // Components
   import HelperText from './HelperText.svelte';
   import Input from './input/Input.svelte';

   // Properties
   export let calc = 0;
   export let disabled = false;
   export let disableValidation = false;
   export let display = false;
   export let focused = false;
   export let helperText = '';
   export let invalid = false;
   export let label = '';
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

   // Methods
   // Constants
   const parameters1 = {
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

   const parameters2 = {
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

   // Variables
   let feet = 0;
   let inches = 0;
   let feetFocused = false;
   let inchFocused = false;
   let options = [];

   // Subscriptions
   // Reactive Variables
   $: metricValue = round(value * 0.0254, 2);

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

   // Events
   const onFeet = (event) => {
      value = round(event.target.valueAsNumber * 12 + inches, 4);
   };

   const onInches = (event) => {
      value = round(feet * 12 + event.target.valueAsNumber, 4);
   };

   // Lifecycle
   onMount(() => {
      const optionSearch = document?.getElementById(list)?.querySelectorAll('option') ?? [];
      const data = [];
      optionSearch.forEach((option) => data.push({ text: option.text, value: parseFloat(option.value) }));
      options = data;
   });
</script>

<div class="split mdc-menu-surface--anchor" class:metric-wrapper={metric}>
   <Input bind:disabled bind:invalid bind:override bind:focused={feetFocused} on:change={onFeet} value={feet} calc={feet} {...parameters1}>
      <span slot="helperText">
         {#if helperText}
            <HelperText validation>{helperText}</HelperText>
         {/if}
      </span>
   </Input>
   <Input bind:disabled bind:invalid bind:override bind:focused={inchFocused} on:change={onInches} value={inches} {...parameters2} />

   {#if list && focused}
      <div class="mdc-menu mdc-menu-surface mdc-menu-surface-custom mdc-menu-surface--open" in:slide out:slide={{ delay: 250 }}>
         <ul class="mdc-list" tabindex="-1">
            {#each options as option (option.text)}
               <li class="mdc-list-item" on:click={() => (value = option.value)}>
                  <span class="mdc-list-item__ripple" />
                  <span class="mdc-list-item__text">{option.text}</span>
               </li>
            {/each}
         </ul>
      </div>
   {/if}

   {#if metric}
      <span class="metric-value">{`(${metricValue} m)`}</span>
   {/if}
</div>

<style lang="scss" global>
   .mdc-menu-surface-custom {
      top: 100%;
      right: 0;
   }
</style>
