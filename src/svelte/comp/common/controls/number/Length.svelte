<script>
   // Modules
   import { round, floor } from '../../../../../js/modules/round';

   // SMUI Components
   import Textfield from '@smui/textfield';
   import Icon from '@smui/textfield/icon/index';

   // Properties
   export let value = 0;
   export let metric = false;

   // Methods
   const setValue = () => (value = round(feet * 12 + inches, 4));

   // Variables
   let feet = floor(value / 12);
   let inches = value - round(feet * 12);

   // Reactive Variables
   $: metricValue = round(value * 0.0254, 3);
   $: inputClass = `input${metric ? '-metric' : ''} split`;

   // Events
   const onFeet = () => setValue();

   const onInches = () => {
      if (inches >= 12) {
         setValue();
         feet = floor(value / 12);
         inches = value - round(feet * 12);
      }

      if (inches < 0) {
         feet -= 1;
         inches += 12;
         setValue();
      }
   };

   // Events
   const onFocus = (event) => event.target.select();
</script>

<div class="vantage-input">
   <div class={inputClass}>
      <div class="ft">
         <Textfield class="medium" type="number" bind:value={feet} on:change={onFeet} on:focus={onFocus} fullwidth withTrailingIcon>
            <Icon class="label">ft</Icon>
         </Textfield>
      </div>

      <div class="in">
         <Textfield class="medium" type="number" bind:value={inches} on:change={onInches} on:focus={onFocus} fullwidth withTrailingIcon input$step={0.0001}>
            <Icon class="label">in</Icon>
         </Textfield>
      </div>
   </div>

   {#if metric}
      <p class="metric-value">({metricValue} m)</p>
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
