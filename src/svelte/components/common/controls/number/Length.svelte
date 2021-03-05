<script>
   // Modules
   import { round, floor } from '../../../../../js/modules/round';

   // SMUI Components
   import Textfield from '@smui/textfield';
   import Icon from '@smui/textfield/icon/index';

   // Properties
   export let value = 0;
   export let metric = false;
   export let disabled = false;
   export let style = 0;

   // Methods
   const setValue = () => {
      value = round(feet * 12 + inches, 4);
   };

   // Variables
   let feet = 0;
   let inches = 0;

   // Reactive Variables
   $: metricValue = round(value * 0.0254, 3);
   $: inputClass = `input${metric ? ' metric' : ''} split`;

   // Reactive Rules
   $: if (value) {
      feet = floor(value / 12);

      inches = round(value - feet * 12, 4);
   }

   // Events
   const onFeet = (event) => {
      feet = event.target.valueAsNumber;

      setValue();
   };

   const onInches = (event) => {
      inches = event.target.valueAsNumber;

      setValue();
   };

   const onFocus = (event) => event.target.select();
</script>

<div class={`vantage-input ${style ? `n${style}` : ''}`}>
   <div class={inputClass}>
      <div class="ft">
         <Textfield class="medium" type="number" value={feet} on:change={onFeet} on:focus={onFocus} {disabled} fullwidth withTrailingIcon input$min="0">
            <Icon class="label">ft</Icon>
         </Textfield>
      </div>

      <div class="in">
         <Textfield
            class="medium"
            type="number"
            value={inches}
            on:change={onInches}
            on:focus={onFocus}
            {disabled}
            fullwidth
            withTrailingIcon
            input$step={0.0001}
            input$min="0"
         >
            <Icon class="label">in</Icon>
         </Textfield>
      </div>
   </div>

   {#if metric}
      <p class="metric-value">{`(${metricValue} m)`}</p>
   {/if}
</div>

<style>
   .ft {
      padding-right: 8px;
      flex-basis: 50%;
   }
   .in {
      padding-left: 8px;
      flex-basis: 50%;
   }
</style>
