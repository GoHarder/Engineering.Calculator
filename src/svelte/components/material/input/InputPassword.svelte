<script>
   import HelperText from './HelperText.svelte';
   import Input from './Input.svelte';
   import Icon from './Icon.svelte';

   // Parameters
   export let disabled = false;
   export let disableValidation = false;
   export let helperText = '';
   export let invalid = false;
   export let label = '';
   export let list = '';
   export let required = false;
   export let value = '';
   export let variant = 'filled';

   // Constants
   const parameters = {
      disableValidation,
      label,
      list,
      required,
      variant,
   };

   // Variables
   let show = false;

   // Events
   const onClick = () => {
      show = !show;
   };
</script>

{#if !show}
   <Input bind:disabled bind:invalid bind:value {...parameters} type="password">
      <span slot="trailingIcon">
         <Icon on:click={onClick} button title="Show Password" trailing>visibility</Icon>
      </span>
      <span slot="helperText">
         <HelperText validation>{helperText}</HelperText>
      </span>
   </Input>
{:else}
   <Input bind:disabled bind:invalid bind:value {...parameters}>
      <span slot="trailingIcon">
         <Icon on:click={onClick} button title="Hide Password" trailing>visibility_off</Icon>
      </span>
      <span slot="helperText">
         <HelperText validation>{helperText}</HelperText>
      </span>
   </Input>
{/if}
