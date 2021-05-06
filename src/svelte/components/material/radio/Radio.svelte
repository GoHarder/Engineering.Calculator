<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCFormField } from '@material/form-field';
   import { MDCRadio } from '@material/radio';

   // Properties
   export let group = undefined;
   export let label = '';
   export let value = '';

   // Constants
   let div1 = undefined;
   let div2 = undefined;
   let Radio = undefined;
   let FormField = undefined;

   // Lifecycle
   onMount(() => {
      Radio = new MDCRadio(div2);
      FormField = new MDCFormField(div1);
   });

   onDestroy(() => {
      Radio.destroy();
      FormField.destroy();
   });
</script>

<div bind:this={div1} class="mdc-form-field">
   <div bind:this={div2} class="mdc-radio">
      <input class="mdc-radio__native-control" type="radio" id={`radio-${label.toLowerCase()}`} bind:group {value} />
      <div class="mdc-radio__background">
         <div class="mdc-radio__outer-circle" />
         <div class="mdc-radio__inner-circle" />
      </div>
      <div class="mdc-radio__ripple" />
   </div>
   <label for={`radio-${label.toLowerCase()}`}>{label}</label>
</div>

<style lang="scss" global>
   @use "@material/theme" with (
      $secondary:  #4d4d4d,
      $primary: #ffcb30,
   );
   @use '@material/radio/styles';
</style>
