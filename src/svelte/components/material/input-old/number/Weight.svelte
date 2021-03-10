<script>
   import { createEventDispatcher, onMount } from 'svelte';
   import { MDCTextField } from '@material/textfield';

   // Parameters
   export let disabled = false;
   export let invalid = false;
   export let label = '';
   export let list = undefined;
   export let required = false;
   export let step = 1;
   export let min = undefined;
   export let max = undefined;
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
   <input class="mdc-text-field__input" type="number" bind:value on:focus={onFocus} {list} {step} {min} {max} />
   <span class="mdc-text-field__affix mdc-text-field__affix--suffix" style="padding-left: 0;">lb</span>
   <span class="mdc-line-ripple" />
</label>
