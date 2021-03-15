<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCTextField } from '@material/textfield';

   // Parameters
   export let disabled = false;
   export let disableValidation = false;
   export let invalid = false;
   export let label = '';
   export let list = '';
   export let max = undefined;
   export let maxLength = undefined;
   export let min = undefined;
   export let minLength = undefined;
   export let pattern = undefined;
   export let prefix = '';
   export let required = false;
   export let step = undefined;
   export let suffix = '';
   export let type = 'text';
   export let value = '';
   export let variant = 'filled';

   // Constants
   const parameters = {
      list,
      max,
      maxLength,
      min,
      minLength,
      pattern,
      step,
   };

   // Variables
   let bind1 = undefined;
   let bind2 = undefined;
   let TextField = undefined;

   // Reactive Variables
   $: labelClass = [
      'mdc-text-field',
      variant === 'filled' ? 'mdc-text-field--filled' : 'mdc-text-field--outlined',
      $$slots.leadingIcon ? 'mdc-text-field--with-leading-icon' : '',
      $$slots.trailingIcon ? 'mdc-text-field--with-trailing-icon' : '',
   ].join(' ');

   // Reactive Rules
   $: if (TextField) {
      TextField.disabled = disabled;
      TextField.valid = !invalid;
   }

   // Events
   const onChange = (event) => {
      value = type === 'number' ? event.target.valueAsNumber : event.target.value;
   };

   // Lifecycle
   onMount(() => {
      TextField = new MDCTextField(bind1);
      TextField.required = required;
      TextField.useNativeValidation = !disableValidation;

      if ($$slots.leadingIcon) {
         const label = bind1.querySelector('.mdc-floating-label');
         const icon = bind1.querySelector('.mdc-text-field__icon--leading');
         // wrapper = icon.parentNode;

         label.parentNode.insertBefore(icon, label.nextSibling);
      }

      if ($$slots.trailingIcon) {
         const input = bind1.querySelector('input');
         const icon = bind1.querySelector('.mdc-text-field__icon--trailing');
         // wrapper = icon.parentNode;

         input.parentNode.insertBefore(icon, input.nextSibling);
      }

      if ($$slots.helperText) {
         // bind1
         const text = bind2.querySelector('.mdc-text-field-helper-line');
         // wrapper = text.parentNode;

         if (text) {
            bind1.parentNode.insertBefore(text, bind1.nextSibling);
         }
      }
   });

   onDestroy(() => {
      TextField.destroy();
   });
</script>

<div bind:this={bind2} class="input-wrapper">
   <label bind:this={bind1} class={labelClass} for="input">
      <span class="mdc-text-field__ripple" />
      <span class="mdc-floating-label">{label}</span>
      <slot name="leadingIcon" />
      {#if prefix}
         <span class="mdc-text-field__affix mdc-text-field__affix--prefix">{prefix}</span>
      {/if}

      {#if type === 'text'}
         <input class="mdc-text-field__input" bind:value {...parameters} />
      {:else if type === 'number'}
         <input class="mdc-text-field__input" bind:value on:focus {...parameters} type="number" />
      {:else}
         <input class="mdc-text-field__input" on:change={onChange} {...parameters} {type} {value} />
      {/if}

      <slot name="trailingIcon" />
      {#if suffix}
         <span class="mdc-text-field__affix mdc-text-field__affix--suffix">{suffix}</span>
      {/if}
      <span class="mdc-line-ripple" />
   </label>
   <slot name="helperText" />
</div>

<style lang="scss" global>
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

   .split {
      display: flex;
      .input-wrapper {
         flex-grow: 1;
         width: 50%;
      }

      &.metric-wrapper .input-wrapper {
         width: calc(50% - 50px);
      }
   }
   .metric-wrapper {
      display: flex;
      align-items: baseline;

      .input-wrapper {
         flex-grow: 1;
      }
   }

   .metric-value {
      width: 100px;
      margin-left: 12px;
      color: gray;
      font-size: 14px;
   }

   .mdc-text-field {
      @include textfield.fill-color(rgba($color: #000000, $alpha: 0.02));
      @include textfield.shape-radius(0);
      @include textfield.label-color($mdc-theme-secondary);

      padding: 0 8px; // 0 16px
      width: 100%;
      + .mdc-text-feild-helper-line {
         padding: 0 8px;
      }
      .mdc-floating-label {
         left: 8px; // 16px
      }

      // .mdc-text-field__icon {
      //    padding: 12px 0;
      // }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
         -webkit-appearance: none;
         margin: 0;
      }

      input[type='number'] {
         text-align: right;
         -moz-appearance: textfield;
      }
      .mdc-text-field__icon.mdc-text-field__icon--leading {
         margin-left: 8px;
      }
   }
</style>
