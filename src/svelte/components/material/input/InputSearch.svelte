<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   import Input from './input/Input.svelte';
   import Icon from './Icon.svelte';

   // Parameters
   export let disabled = false;
   export let disableValidation = false;
   export let invalid = false;
   export let label = 'Search';
   export let list = '';
   export let maxLength = undefined;
   export let minLength = undefined;
   export let pattern = undefined;
   export let value = '';

   // Constants
   const dispatch = createEventDispatcher();

   const parameters = {
      disableValidation,
      label,
      list,
      maxLength,
      minLength,
      pattern,
      variant: 'filled',
   };

   const onEnter = (event) => {
      if (event.keyCode === 13) {
         dispatch('click');
      }
   };
</script>

<svelte:window on:keydown={onEnter} />

<Input bind:disabled bind:invalid bind:value {...parameters}>
   <span slot="leadingIcon">
      <Icon on:click button title="Search" leading>search</Icon>
   </span>
</Input>
