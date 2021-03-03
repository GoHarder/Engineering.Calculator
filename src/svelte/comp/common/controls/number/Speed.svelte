<script>
   // Modules
   import { round } from '../../../../../js/modules/round';

   // SMUI Components
   import Textfield from '@smui/textfield';
   import Icon from '@smui/textfield/icon/index';

   // Properties
   export let value = 0;
   export let precision = 3;
   export let metric = false;
   export let disabled = false;
   export let style = 0;

   // Reactive Variables
   $: metricValue = round(value * 0.00508, 3);
   $: inputClass = `input${metric ? ' metric' : ''}`;

   // Events
   const onFocus = (event) => event.target.select();
</script>

<div class={`vantage-input ${style ? `n${style}` : ''}`}>
   <div class={inputClass}>
      <Textfield class="medium" type="number" bind:value on:focus={onFocus} {disabled} fullwidth withTrailingIcon input$step={precision} input$min="0">
         <Icon class="label">ft/min</Icon>
      </Textfield>
   </div>

   {#if metric}
      <p class="metric-value">{`(${metricValue} m/sec)`}</p>
   {/if}
</div>
