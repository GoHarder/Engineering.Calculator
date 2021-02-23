<script>
   // SMUI Components
   import Textfield from '@smui/textfield';

   // Properties
   export let value = '';
   export let label = '';
   export let style = 1;
   export let bullet = false;
</script>

<div class={`input-text n${style}`}>
   <div class="label-container">
      {#if bullet}
         <span class="bullet" />
      {/if}
      <span class="label">{label}</span>
   </div>
   <div class={`input-container${bullet ? '-bullet' : ''}`}>
      <Textfield class="medium" bind:value fullwidth />
   </div>
</div>

<style lang="scss">
   .input-text {
      .label-container {
         display: flex;
         align-items: center;
         flex-direction: row;
      }

      &.n4 {
         .label-container {
            padding-bottom: 12px;
         }

         .input-container {
            &-bullet {
               margin-left: 14px;
            }
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
