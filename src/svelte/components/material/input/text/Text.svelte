<script>
   import { createEventDispatcher, onMount } from 'svelte';
   import { MDCTextField } from '@material/textfield';

   // Parameters
   export let disabled = false;
   export let invalid = false;
   export let label = '';
   export let list = undefined;
   export let required = false;
   export let useNativeValidation = false;
   export let value = '';

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let component;
   let inst = undefined;

   // Reactive Rules
   $: if (inst) {
      inst.disabled = disabled;
      inst.valid = !invalid;
   }

   // Events
   const onFocus = (event) => {
      event.target.select();
      dispatch('focus');
   };

   // Lifecycle
   onMount(() => {
      inst = new MDCTextField(component);
      inst.required = required;
      inst.useNativeValidation = useNativeValidation;
   });
</script>

<label bind:this={component} class="mdc-text-field mdc-text-field--filled">
   <span class="mdc-text-field__ripple" />
   <span class="mdc-floating-label">{label}</span>
   <input class="mdc-text-field__input" type="text" bind:value on:focus={onFocus} {list} />
   <span class="mdc-line-ripple" />
</label>
