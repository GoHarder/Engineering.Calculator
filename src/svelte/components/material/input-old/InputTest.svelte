<script>
   import { createEventDispatcher, afterUpdate, onMount } from 'svelte';
   import { MDCTextField } from '@material/textfield';

   // Parameters
   export let disabled = false;
   export let invalid = false;
   export let label = '';
   export let leadingIcon = false;
   export let list = undefined;
   export let required = false;
   export let trailingIcon = false;
   export let useNativeValidation = false;
   export let value = '';
   export let width = '';

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let bind;
   let inst = undefined;
   let compStyle = `width: ${width};`;

   $: labelClass = [
      'mdc-text-field',
      'mdc-text-field--filled',
      leadingIcon ? 'mdc-text-field--with-leading-icon' : '',
      $$slots.trailingIcon ? 'mdc-text-field--with-trailing-icon' : '',
   ].join(' ');

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
      inst = new MDCTextField(bind);
      inst.required = required;
      inst.useNativeValidation = useNativeValidation;

      if ($$slots.trailingIcon) {
         const input = bind.querySelector('input');
         const icon = bind.querySelector('.mdc-text-field__icon--trailing');
         const wrapper = icon.parentNode;

         input.parentNode.insertBefore(icon, input.nextSibling);

         wrapper.remove();
      }
   });
</script>

<label bind:this={bind} class={labelClass} style={compStyle}>
   <span class="mdc-text-field__ripple" />
   <span class="mdc-floating-label">{label}</span>
   <input class="mdc-text-field__input" type="text" bind:value on:focus={onFocus} {list} />
   <slot name="trailingIcon" />
   <span class="mdc-line-ripple" />
</label>
