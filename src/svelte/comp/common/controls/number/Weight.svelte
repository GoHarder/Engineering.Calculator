<script>
   // Modules
   import { round } from '../../../../../js/modules/round';

   // SMUI Components
   import Textfield from '@smui/textfield';
   import Icon from '@smui/textfield/icon/index';

   // Properties
   export let value = 0;
   export let precision = 1;
   export let metric = false;

   // Reactive Variables
   $: metricValue = round(value * 0.453592, 1);
   $: inputClass = `input${metric ? '-metric' : ''}`;

   // Events
   const onFocus = (event) => event.target.select();
</script>

<div class="vantage-input">
   <div class={inputClass}>
      <Textfield class="medium" type="number" bind:value on:focus={onFocus} fullwidth withTrailingIcon input$step={precision}>
         <Icon class="label">lb</Icon>
      </Textfield>
   </div>

   {#if metric}
      <p class="metric-value">({metricValue} kg)</p>
   {/if}
</div>
