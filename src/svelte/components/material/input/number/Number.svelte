<script>
   import Speed from './Speed.svelte';
   import Weight from './Weight.svelte';

   export let disabled = false;
   export let invalid = false;
   export let label = '';
   export let list = undefined;
   export let required = false;
   export let step = 1;
   export let max = undefined;
   export let min = undefined;
   export let unit = 'weight';
   export let useNatValid = false;
   export let value = undefined;

   const components = {
      speed: Speed,
      weight: Weight,
   };

   $: component = components[unit];
</script>

<svelte:component this={component} bind:disabled bind:invalid bind:value {label} {list} {required} {step} {max} {min} useNativeValidation={useNatValid} />

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

      // @include textfield.height(50px);
      // @include textfield.label-color(green);

      .mdc-floating-label {
         left: 8px; // 16px
      }

      input[type='number'] {
         text-align: right;
      }
   }
</style>
