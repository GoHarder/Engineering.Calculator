<script>
   import Email from './email/Email.svelte';
   import Number from './number/Number.svelte';
   import Password from './password/Password.svelte';
   import Text from './text/Text.svelte';

   export { className as class };
   export let disabled = false;
   export let invalid = false;
   export let label = '';
   export let leadingIcon = false;
   export let list = undefined;
   export let required = false;
   export let step = 1;
   export let trailingIcon = false;
   export let type = 'text';
   export let max = undefined;
   export let min = undefined;
   export let unit = 'default';
   export let useNatValid = true;
   export let value = undefined;
   export let width = '';

   let className;

   const components = {
      email: Email,
      number: Number,
      password: Password,
      text: Text,
   };

   const properties = {
      className,
      label,
      leadingIcon,
      list,
      required,
      step,
      trailingIcon,
      unit,
      max,
      min,
      useNatValid,
      width,
   };

   $: component = components[type];
</script>

<svelte:component this={component} bind:disabled bind:invalid bind:value {...properties}>
   <slot name="trailing-icon" />
</svelte:component>

<style lang="scss">
   @use "@material/theme" with (
      $primary: #ffcb30,
      $secondary: #4d4d4d,
   );
   @use "@material/floating-label/mdc-floating-label";
   @use "@material/line-ripple/mdc-line-ripple";
   @use "@material/notched-outline/mdc-notched-outline";
   @use "@material/textfield";
   @import './src/scss/vantage-theme';
   @include textfield.core-styles;

   .mdc-text-field {
      @include textfield.fill-color(rgba($color: #000000, $alpha: 0.02));
      @include textfield.shape-radius(0);
      @include textfield.label-color($mdc-theme-secondary);

      padding: 0 8px; // 0 16px

      + .mdc-text-feild-helper-line {
         padding: 0 8px;
      }
      .mdc-floating-label {
         left: 8px; // 16px
      }

      .mdc-text-field__icon {
         padding: 12px 0;
      }

      input[type='number'] {
         text-align: right;
      }
   }
</style>
