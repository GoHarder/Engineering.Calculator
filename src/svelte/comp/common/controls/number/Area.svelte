<script>
   // Modules
   import { round } from '../../../../../js/modules/round';

   // SMUI Components
   import Textfield from '@smui/textfield';
   import Icon from '@smui/textfield/icon/index';

   // Properties
   export let value = 0;
   export let precision = 4;
   export let metric = false;
   export let disabled = false;
   export let style = 0;
   export let display = false;

   // Variables
   let feet = 0;

   // Reactive Variables
   $: metricValue = round(value * 0.00064516, 4);
   $: inputClass = `input${metric ? ' metric' : ''}${display ? ' display' : ''}`;

   // Reactive Rules
   $: if (value) {
      feet = round(value / 144, 4);
   }

   // Events
   const onFocus = (event) => event.target.select();

   const onChange = (event) => {
      console.log(event);
   };
</script>

<div class={`vantage-input ${style ? `n${style}` : ''}`}>
   <div class={inputClass}>
      <Textfield class="medium" type="number" value={feet} on:focus={onFocus} on:change={onChange} {disabled} fullwidth withTrailingIcon input$step={precision} input$min="0">
         <Icon class="label">ft²</Icon>
      </Textfield>
   </div>

   {#if metric}
      <p class="metric-value">{`(${metricValue} m²)`}</p>
   {/if}
</div>
