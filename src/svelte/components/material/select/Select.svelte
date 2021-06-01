<script>
   import { afterUpdate, onDestroy, onMount } from 'svelte';
   import { MDCTextField } from '@material/textfield';
   import { createEventDispatcher } from 'svelte';

   // Components
   import HelperText from '../input/HelperText.svelte';
   import { IconButton } from '../button';
   import { Link } from '../button/icons';
   import { Anchor, Icon, Item, Menu, Text } from '../menu';

   // Parameters
   export let disabled = false;
   export let disableValidation = false;
   export let display = false;
   export let helperText = '';
   export let invalid = false;
   export let label = '';
   export let link = false;
   export let required = false;
   export let value = '';
   export let variant = 'filled';

   // Constants
   const dispatch = createEventDispatcher();
   const parameters = {
      disabled,
      disableValidation,
      invalid,
      label,
      required,
      variant,
   };

   // Variables
   let _label;
   let TextField;
   let askSelect = false;

   // Reactive Variables
   $: labelClass = ['mdc-text-field', variant === 'filled' ? 'mdc-text-field--filled' : 'mdc-text-field--outlined', display ? 'mdc-text-field--display' : ''].join(' ');
   $: classes = ['input-root', helperText ? '' : 'bump'].join(' ');

   // Reactive Rules
   $: if (TextField) {
      TextField.disabled = disabled;
      TextField.valid = !invalid;
   }

   $: if (link?.location) display = true;

   // Lifecycle
   onMount(() => {
      TextField = new MDCTextField(_label);
      TextField.required = required;
      TextField.useNativeValidation = !disableValidation;
   });

   afterUpdate(() => {
      askSelect = true;

      const options = _label.querySelectorAll('option');

      options.forEach((option) => {
         if (!option.disabled && option.value === `${value}`) askSelect = false;
      });
   });

   onDestroy(() => {
      TextField.destroy();
   });
</script>

<!-- TODO: 3-16-2021 8:51 AM - optional: style menu -->

<!-- <Anchor> -->

<div class={classes}>
   <label bind:this={_label} class={labelClass}>
      <span class="mdc-text-field__ripple" />
      <span class="mdc-floating-label mdc-floating-label--float-above">{label}</span>
      <select bind:value class="mdc-text-field__input" {...parameters} {disabled}>
         {#if !value || askSelect}
            <option value=" " disabled hidden selected>Select</option>
         {/if}
         <slot />
      </select>
      <span class="mdc-line-ripple" />
   </label>

   {#if helperText}
      <HelperText validation>{helperText}</HelperText>
   {/if}

   {#if link && link.location}
      <IconButton on:click={() => dispatch('link', link)} title={link.location}>
         <Link />
      </IconButton>
   {/if}
</div>

<!-- <Menu bind:open> -->
<!-- <Item on:click={() => console.log('ding')}> -->
<!-- <Text>My Account</Text> -->
<!-- </Item> -->
<!-- </Menu> -->

<!-- </Anchor> -->
<style lang="scss">
   @import './src/scss/vantage-theme';

   select {
      background-image: linear-gradient(45deg, transparent 50%, #4d4d4d 50%), linear-gradient(135deg, #4d4d4d 50%, transparent 50%);
      background-position: calc(100% - 15px) 50%, calc(100% - 10px) 50%;
      background-size: 5px 5px, 5px 5px;
      background-repeat: no-repeat;
      cursor: pointer;
   }

   select:focus {
      background-image: linear-gradient(45deg, transparent 50%, #ffcb30 50%), linear-gradient(135deg, #ffcb30 50%, transparent 50%);
   }

   .mdc-text-field--display > select {
      background-image: none;
   }
</style>
