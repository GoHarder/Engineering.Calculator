<script>
   // Properties
   export let options = [];
   export let value = '';
   export let label = '';
   export let style = 1;
   export let bullet = false;
   export let disabled = false;
</script>

<div class={`select n${style}`}>
   <div class="label-container">
      {#if bullet}
         <span class="bullet" />
      {/if}
      <span class="label">{label}</span>
   </div>
   <div class={`input-container${bullet ? '-bullet' : ''}`}>
      <select bind:value class="select-css" {disabled}>
         {#each options as option}
            <option value={option.value ? option.value : option.text}>{option.text}</option>
         {/each}
      </select>
   </div>
</div>

<style lang="scss">
   .select-css {
      cursor: pointer;
      display: block;
      font-size: 16px;
      font-family: sans-serif;
      color: #444;
      line-height: 1.3;
      padding: 8px 4px;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      border: none;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.42);
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
      background-repeat: no-repeat, repeat;
      background-position: right 0.7em top 50%, 0 0;
      background-position: right 4px top 50%, 0 0;
   }
   .select-css::-ms-expand {
      display: none;
   }
   .select-css:hover {
      border-color: rgba($color: #000000, $alpha: 0.87);
   }
   .select-css:focus {
      border-color: rgba($color: #000000, $alpha: 0.87);
      outline: none;
   }
   .select-css option {
      font-weight: normal;
      padding: 8px;
   }

   .select {
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
