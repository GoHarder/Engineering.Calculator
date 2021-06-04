<script>
   import { createEventDispatcher, onMount } from 'svelte';
   import { slide } from 'svelte/transition';

   // Properties
   export let focused = false;
   export let list = [];

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let options = [];

   // Reactive Rules
   // Events
   const onSelect = (value) => dispatch('select', value);

   // Lifecycle
   onMount(() => {
      const optionSearch = document?.getElementById(list)?.querySelectorAll('option') ?? [];
      const data = [];
      optionSearch.forEach((option) => data.push({ text: option.text, value: option.value.match(/^[\d\.$]+/) ? parseFloat(option.value) : option.value }));
      options = data;
   });
</script>

{#if list && focused}
   <div class="mdc-menu mdc-menu-surface mdc-menu-surface-datalist mdc-menu-surface--open" in:slide out:slide={{ delay: 250 }}>
      <ul class="mdc-list" tabindex="-1">
         {#each options as option (option.text)}
            <li class="mdc-list-item" on:click={() => onSelect(option.value)}>
               <span class="mdc-list-item__ripple" />
               <span class="mdc-list-item__text">{option.text}</span>
            </li>
         {/each}
      </ul>
   </div>
{/if}

<style lang="scss" global>
   .mdc-menu-surface-datalist {
      top: 100%;
      right: 0;
      left: 0;
   }
</style>
