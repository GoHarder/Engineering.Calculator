<script>
   // SMUI Components
   import Button, { Label, Icon as BtnIcon } from '@smui/button';
   import Dialog, { Title, Content, Actions, InitialFocus } from '@smui/dialog';

   // Properties
   export let status;
   export let statusText;
   export let errors = [];

   // Variables
   let errorDialog;

   $: if (errors.length > 0) errorDialog.open();
</script>

<Dialog bind:this={errorDialog}>
   <Title style="color: #b00020" id="event-title">{`Error: ${status} - ${statusText}`}</Title>
   <Content id="event-content">
      {#each errors as error}
         <span class="error-line">{error}</span>
      {/each}
   </Content>

   <Actions>
      <Button action="all" default use={[InitialFocus]} class="text-transform-none" color="secondary" variant="raised">
         <Label>Ok</Label>
      </Button>
   </Actions>
</Dialog>

<style>
   .error-line {
      display: block;
   }
</style>
