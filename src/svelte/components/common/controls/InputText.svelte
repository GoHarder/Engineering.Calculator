<script>
   // SMUI Components
   import Textfield from '@smui/textfield';

   // Properties
   export let value = '';
   export let label = '';
   export let style = 1;
   export let bullet = false;
   export let labelWidth = 0;
</script>

<div class={`input-text n${style}`}>
   <div class="label-container" style={labelWidth ? `min-width: ${labelWidth}px;` : null}>
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

      &.n1 {
         display: flex;
         justify-content: space-between;
         .label-container {
            flex-grow: 0;
         }
         .input-container {
            flex-grow: 1;
            // max-width: 60%;
         }
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
