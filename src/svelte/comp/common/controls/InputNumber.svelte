<script>
   // Project Components
   import Default from './number/Default.svelte';
   import Length from './number/Length.svelte';
   import Speed from './number/Speed.svelte';
   import Weight from './number/Weight.svelte';
   import Area from './number/Area.svelte';

   // Properties
   export let value = 0;
   export let label = '';
   export let style = 1;
   export let type = 'default';
   export let bullet = false;
   export let metric = false;
   export let precision = 1;
   export let disabled = false;
   export let labelWidth = 0;
   export let display = false;
   export let fancy = false;

   const comps = {
      default: Default,
      length: Length,
      speed: Speed,
      weight: Weight,
      area: Area,
   };

   $: comp = comps[type];

   $: if (display) {
      disabled = true;
   }
</script>

<div class={`input-number n${style}`}>
   <div class="label-container" style={labelWidth ? `min-width: ${labelWidth}px;` : null}>
      {#if bullet}
         <span class="bullet" />
      {/if}
      <span class="label">{label}</span>
   </div>
   <div class={`input-container${bullet ? '-bullet' : ''}`}>
      <svelte:component this={comp} bind:value {metric} {precision} {disabled} {display} {style} />
   </div>
</div>

<style lang="scss">
   .input-number {
      .label-container {
         display: flex;
         align-items: center;
         flex-direction: row;
      }

      &.n1 {
         display: flex;
         justify-content: space-between;

         .input-container {
            flex-grow: 1;
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
