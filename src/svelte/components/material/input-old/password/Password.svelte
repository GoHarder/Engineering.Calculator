<script>
   import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
   import { MDCTextField } from '@material/textfield';

   // Parameters
   export let disabled = false;
   export let invalid = false;
   export let label = '';
   export let list = undefined;
   export let required = false;
   export let useNativeValidation = false;
   export let value = '';
   export let width = '';

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let component1;
   let component2;
   let inst = undefined;
   let show = false;
   let compStyle = `width: ${width};`;

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

   const onClick = () => {
      show = !show;
   };

   // Lifecycle
   afterUpdate(() => {
      if (!show) {
         inst = new MDCTextField(component1);
         inst.required = required;
         inst.useNativeValidation = useNativeValidation;
      } else {
         inst = new MDCTextField(component2);
         inst.required = required;
         inst.useNativeValidation = useNativeValidation;
      }
   });

   onMount(() => {
      inst = new MDCTextField(component1);
      inst.required = required;
      inst.useNativeValidation = useNativeValidation;
   });
</script>

{#if !show}
   <label bind:this={component1} class="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon" style={compStyle}>
      <span class="mdc-text-field__ripple" />
      <span class="mdc-floating-label">{label}</span>
      <input class="mdc-text-field__input" type="password" bind:value on:focus={onFocus} {list} />
      <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button" title="Show Password" on:click={onClick}>visibility</i>
      <span class="mdc-line-ripple" />
   </label>
{:else}
   <label bind:this={component2} class="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon" style={compStyle}>
      <span class="mdc-text-field__ripple" />
      <span class="mdc-floating-label">{label}</span>
      <input class="mdc-text-field__input" type="text" bind:value on:focus={onFocus} {list} />
      <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button" title="Hide Password" on:click={onClick}>visibility_off</i>
      <span class="mdc-line-ripple" />
   </label>
{/if}
