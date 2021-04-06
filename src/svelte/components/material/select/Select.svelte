<!-- TODO: 3-16-2021 8:51 AM - optional: style menu -->
<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCTextField } from '@material/textfield';

   import { Anchor, Icon, Item, Menu, Text } from '../menu';

   // Components
   import OptGroup from './OptGroup.svelte';

   // Parameters
   export let disabled = false;
   export let disableValidation = false;
   export let groups = undefined;
   export let invalid = false;
   export let label = '';
   export let options = [];
   export let required = false;
   export let selected = 0;
   export let value = options[selected];
   export let variant = 'filled';

   // Constants
   const parameters = {
      disabled,
      disableValidation,
      invalid,
      label,
      required,
      variant,
   };

   // Variables
   let bind1;
   let TextField;
   let sortedOptions = [];

   // Reactive Variables
   $: labelClass = ['mdc-text-field', variant === 'filled' ? 'mdc-text-field--filled' : 'mdc-text-field--outlined'].join(' ');
   $: grouped = groups && groups.groupBy in options[0];

   // Reactive Rules
   $: if (TextField) {
      TextField.disabled = disabled;
      TextField.valid = !invalid;
   }

   $: if (grouped) {
      options.reduce((objs, option) => {
         objs
            .find((obj) => {
               return obj.value === option[groups.groupBy];
            })
            .options.push(option);

         return objs;
      }, groups.objs);

      sortedOptions = groups.objs;
   } else {
      sortedOptions = options;
   }

   // Lifecycle
   onMount(() => {
      TextField = new MDCTextField(bind1);
      TextField.required = required;
      TextField.useNativeValidation = !disableValidation;
   });

   onDestroy(() => {
      TextField.destroy();
   });
</script>

<!-- <Anchor> -->
<label bind:this={bind1} class={labelClass}>
   <span class="mdc-text-field__ripple" />
   <span class="mdc-floating-label">{label}</span>
   <select bind:value class="mdc-text-field__input" {...parameters} {disabled}>
      {#if grouped}
         {#each sortedOptions as optionGroup}
            <OptGroup label={optionGroup.label} options={optionGroup.options} />
         {/each}
      {:else}
         {#each sortedOptions as option}
            <option value={option.value ? option.value : option.text}>{option.text}</option>
         {/each}
      {/if}
   </select>
   <!-- <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" role="button"> arrow_drop_down </i> -->
   <span class="mdc-line-ripple" />
</label>
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
   }

   select:focus {
      background-image: linear-gradient(45deg, transparent 50%, #ffcb30 50%), linear-gradient(135deg, #ffcb30 50%, transparent 50%);
   }
</style>
