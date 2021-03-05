<script>
   import { onMount } from 'svelte';

   import { MDCTextField } from '@material/textfield';

   import Number from './number/Number.svelte';

   export let type = 'number';

   const components = {
      number: Number,
   };

   $: component = components[type];

   // export let value = '';
   // export let disabled = false;
   // export let useNativeValidation = false;
   // export let invalid = false;
   // export let required = false;

   let component;
   let inst = undefined;

   $: if (inst) {
      inst.disabled = disabled;
      inst.valid = !invalid;
   }

   onMount(() => {
      inst = new MDCTextField(component);
      inst.required = required;
      inst.useNativeValidation = useNativeValidation;
   });
</script>

<svelte:component this={component} />

<style lang="scss" global>
   @use "@material/floating-label/mdc-floating-label";
   @use "@material/line-ripple/mdc-line-ripple";
   @use "@material/notched-outline/mdc-notched-outline";
   @use "@material/textfield";
   @include textfield.core-styles;
</style>
