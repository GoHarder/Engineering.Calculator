<script>
   import { afterUpdate, createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { MDCTextField } from '@material/textfield';

   // Components
   import Email from './Email.svelte';
   import Number from './Number.svelte';
   import Password from './Password.svelte';
   import Text from './Text.svelte';
   import { IconButton } from '../../button';
   import { Link } from '../../button/icons';
   import DataList from '../../../common/DataList.svelte';

   // Parameters
   export let calc = 0;
   export let disabled = false;
   export let disableValidation = false;
   export let display = false;
   export let focused = false;
   export let invalid = undefined;
   export let label = '';
   export let link = false;
   export let list = '';
   export let defaultList = false;
   export let max = undefined;
   export let maxLength = undefined;
   export let min = undefined;
   export let minLength = undefined;
   export let pattern = undefined;
   export let prefix = '';
   export let reset = false;
   export let override = false;
   export let required = false;
   export let step = undefined;
   export let suffix = '';
   export let type = 'text';
   export let value = '';
   export let variant = 'filled';

   // Constants
   const dispatch = createEventDispatcher();

   $: parameters = {
      display,
      invalid,
      list: defaultList ? list : '',
      max,
      maxLength,
      min,
      minLength,
      pattern,
      step,
   };

   const comps = {
      email: Email,
      number: Number,
      password: Password,
      text: Text,
   };

   const comp = comps[type];

   // Variables
   let bind1 = undefined;
   let bind2 = undefined;
   let TextField = undefined;

   // Reactive Variables
   $: labelClass = [
      'mdc-text-field',
      display ? 'mdc-text-field--display' : '',
      `mdc-text-field--${variant}`,
      $$slots.leadingIcon || reset ? 'mdc-text-field--with-leading-icon' : '',
      $$slots.trailingIcon ? 'mdc-text-field--with-trailing-icon' : '',
   ].join(' ');

   $: classes = ['input-root', $$slots.helperText ? '' : 'bump', 'mdc-menu-surface--anchor'].join(' ');

   // Reactive Rules
   $: if (TextField) {
      TextField.disabled = disabled;

      if (disableValidation) TextField.valid = !invalid;
   }

   $: if (!override && reset) value = calc;

   $: if (link?.location) display = true;

   // Events
   const onFocus = (event) => {
      event.target.select();
      focused = true;
   };

   const onBlur = () => {
      if (value !== calc) override = true;
      focused = false;
   };

   const onClick = () => {
      override = false;
   };

   const onSelect = (event) => (value = event.detail);

   // Lifecycle
   onMount(() => {
      if (invalid === true || invalid === false) {
         disableValidation = true;
      }

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

   afterUpdate(() => {
      if (!disableValidation) invalid = !TextField.valid;
   });

   onDestroy(() => {
      TextField.destroy();
   });
</script>

<div class={classes}>
   <div bind:this={bind2} class="input-wrapper">
      <label bind:this={bind1} class={labelClass} for="input">
         <span class="mdc-text-field__ripple" />
         <span class="mdc-floating-label">{label}</span>

         {#if reset}
            {#if override}
               <i on:click={onClick} class="material-icons mdc-text-field__icon mdc-text-field__icon--leading" title="Reset To Calculation" tabindex="0" role="button">
                  replay
               </i>
            {:else}
               <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading"> create </i>
            {/if}
         {:else}
            <slot name="leadingIcon" />
         {/if}

         {#if prefix}
            <span class="mdc-text-field__affix mdc-text-field__affix--prefix">{prefix}</span>
         {/if}
         <svelte:component this={comp} bind:value on:focus={onFocus} on:change on:blur={onBlur} {...parameters} />
         <slot name="trailingIcon" />
         {#if suffix}
            <span class="mdc-text-field__affix mdc-text-field__affix--suffix">{suffix}</span>
         {/if}
         <span class="mdc-line-ripple" />
      </label>
      <slot name="helperText" />
   </div>

   {#if !defaultList}
      <DataList on:select={onSelect} {list} {focused} />
   {/if}

   {#if link && link.location}
      <IconButton on:click={() => dispatch('link', link)} title={link.location}>
         <Link />
      </IconButton>
   {/if}
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
      .input-root {
         flex-grow: 1;
         width: calc(50% - 50px);
         margin-bottom: 0;
      }
   }

   .input-root {
      display: flex;
      align-items: baseline;
      flex-grow: 1;
      .input-wrapper {
         flex-grow: 1;
      }
   }

   .bump {
      margin-bottom: 19px;
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

      &.mdc-text-field--display {
         @include textfield.fill-color(rgba($color: #000000, $alpha: 0));
         // @include textfield.bottom-line-color(rgba($color: #000000, $alpha: 0.02));
         // @include textfield.line-ripple-color(rgba($color: #000000, $alpha: 0.02));
         pointer-events: none;

         .mdc-text-field__ripple {
            display: none;
         }
      }

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
