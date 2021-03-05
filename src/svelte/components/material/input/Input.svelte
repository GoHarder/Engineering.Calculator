<script>
   import Number from './number/Number.svelte';

   export let disabled = false;
   export let invalid = false;
   export let label = '';
   export let list = undefined;
   export let required = false;
   export let step = 1;
   export let type = 'number';
   export let max = undefined;
   export let min = undefined;
   export let unit = 'default';
   export let useNatValid = false;
   export let value = undefined;

   const components = {
      number: Number,
   };

   $: component = components[type];
</script>

<svelte:component this={component} bind:disabled bind:invalid bind:value {label} {list} {required} {step} {unit} {max} {min} {useNatValid} />

<style lang="scss" global>
   @use "@material/floating-label/mdc-floating-label";
   @use "@material/line-ripple/mdc-line-ripple";
   @use "@material/notched-outline/mdc-notched-outline";
   @use "@material/textfield";
   @include textfield.core-styles;

   .mdc-text-field {
      @include textfield.fill-color(rgba($color: #000000, $alpha: 0));
      @include textfield.shape-radius(0);
      @include textfield.label-color(#4d4d4d);
      @include textfield.hover-bottom-line-color(#ffcb30);
      @include textfield.line-ripple-color(#ffcb30);

      padding: 0 8px; // 0 16px

      .mdc-floating-label {
         left: 8px; // 16px
      }

      input[type='number'] {
         text-align: right;
      }
   }
</style>
