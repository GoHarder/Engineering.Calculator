<script>
   // SMUI Components
   import Checkbox from '@smui/checkbox';

   // Properties
   export let checked = false;
   export let label = '';
   export let style = 1;
   export let bullet = false;

   // Events
   const onClick = () => (checked = !checked);
</script>

<div class={`checkbox n${style}`}>
   <div class="label-container" on:click={onClick}>
      {#if bullet}
         <span class="bullet" />
      {/if}
      <span class="label">{label}</span>
   </div>
   <div class="input-container">
      <Checkbox bind:checked />
   </div>
</div>

<style lang="scss">
   .checkbox {
      cursor: pointer;
      width: 100%;
      max-height: inherit;
      display: flex;
      flex-direction: row;
      align-items: center;
      font: inherit;

      &.n1 {
         .label-container {
            justify-content: flex-start;
            display: flex;
            align-items: center;
            width: 90%;
            max-width: 90%;
            min-width: 90%;
         }
         .input-container {
            max-width: 400px;
            display: flex;
            justify-content: flex-end;
            margin-left: 8px;
            width: 10%;
            max-width: 10%;
            min-width: 10%;
         }
      }
   }

   .bullet {
      display: inline-block;
      margin-right: 8px;
      height: 6px;
      width: 6px;
      background-color: rgba(0, 0, 0, 0.54);
      border-radius: 50%;
   }
   .label {
      color: rgba(0, 0, 0, 0.54);
      font-weight: bold;
   }
</style>
