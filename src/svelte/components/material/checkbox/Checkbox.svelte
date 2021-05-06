<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCFormField } from '@material/form-field';
   import { MDCCheckbox } from '@material/checkbox';

   export let checked = false;
   export let disabled = false;
   export let label = '';
   export let value = '';

   // Variables
   let bind1;
   let bind2;
   let Checkbox = undefined;
   let FormField = undefined;

   // Reactive Rules
   $: if (Checkbox) {
      Checkbox.disabled = disabled;
   }

   // Lifecycle
   onMount(() => {
      Checkbox = new MDCCheckbox(bind1);
      FormField = new MDCFormField(bind2);

      FormField.input = Checkbox;
      Checkbox.value = value;
   });

   onDestroy(() => {
      Checkbox.destroy();
      FormField.destroy();
   });
</script>

<div bind:this={bind2} class="mdc-form-field">
   <div bind:this={bind1} class="mdc-checkbox">
      <input type="checkbox" class="mdc-checkbox__native-control" id={`${label}-checkbox`} bind:checked />
      <div class="mdc-checkbox__background">
         <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
         </svg>
         <div class="mdc-checkbox__mixedmark" />
      </div>
      <div class="mdc-checkbox__ripple" />
   </div>
   <label for={`${label}-checkbox`}>{label}</label>
</div>

<style lang="scss" global>
   @use "@material/theme" with (
      $primary:  #4d4d4d,
      $secondary: #ffcb30,
   );
   @use "@material/checkbox";
   @use "@material/form-field";

   @include checkbox.core-styles;
   @include form-field.core-styles;

   .mdc-checkbox {
      @include checkbox.disabled-container-colors(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
   }
</style>
