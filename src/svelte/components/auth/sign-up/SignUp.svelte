<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Components
   import { HelperText, Input } from '../../material/input';
   import { Button, Label } from '../../material/button';
   import { Check, Close, Replay } from '../../material/button/icons';
   import { Actions, Banner, Text } from '../../material/banner';

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let firstName = '';
   let lastName = '';
   let email = '';
   let openBanner = false;

   let formError = '';
   let firstNameError = '';
   let lastNameError = '';
   let emailError = '';

   // Events
   const onCancel = () => {
      dispatch('changePage', 'Home');
   };

   const onReset = () => {
      firstName = '';
      lastName = '';
      email = '';
      formError = '';
      firstNameError = '';
      lastNameError = '';
      emailError = '';
   };

   const onCreate = async () => {
      formError = '';
      firstNameError = '';
      lastNameError = '';
      emailError = '';

      const res = await fetch('/api/users', {
         method: 'POST',
         body: JSON.stringify({ firstName, lastName, email }),
         headers: { 'Content-Type': 'application/json' },
      }).catch(() => {});
      const body = await res.json();
      if (res.ok) {
         openBanner = true;
         onReset();
      } else {
         firstNameError = body?.error?.firstName ? body.error.firstName : 'Invalid first name';
         lastNameError = body?.error?.lastName ? body.error.lastName : 'Invalid first name';
         emailError = body?.error?.email ? body.error.email : 'Invalid email';

         if (body?.error?.form) {
            formError = body.error.form;
            openBanner = true;
         }
      }
   };
</script>

<Banner bind:open={openBanner} centered>
   {#if !formError}
      <Text>User was created.</Text>
   {:else}
      <Text>
         <span style="color: #b00020;">
            {formError}
         </span>
      </Text>
   {/if}
   <Actions>
      <Button color="primary" class="mdc-banner__primary-action" variant="contained">
         <Label>Ok</Label>
         <Check />
      </Button>
   </Actions>
</Banner>

<main>
   <p class="title-1">Create New User</p>
   <p class="title-2">Hollister-Whitney Engineering Calculator</p>

   <div class="paper">
      <div class="row n1">
         <Input bind:value={firstName} invalid={firstNameError} label="First Name">
            <span slot="helperText">
               <HelperText validation>{firstNameError}</HelperText>
            </span>
         </Input>
      </div>

      <div class="row n2">
         <Input bind:value={lastName} invalid={lastNameError} label="Last Name">
            <span slot="helperText">
               <HelperText validation>{lastNameError}</HelperText>
            </span>
         </Input>
      </div>
      <div class="row n3">
         <Input bind:value={email} invalid={emailError} label="Email" type="email">
            <span slot="helperText">
               <HelperText validation>{emailError}</HelperText>
            </span>
         </Input>
      </div>

      <div class="row n4">
         <div class="box n1">
            <Button on:click={onCancel} color="secondary" variant="outlined">
               <Label>Cancel</Label>
               <Close />
            </Button>
         </div>
         <div class="box n2">
            <Button on:click={onReset} color="secondary" variant="contained">
               <Label>Reset</Label>
               <Replay />
            </Button>
            <Button on:click={onCreate} color="primary" variant="contained">
               <Label>Create</Label>
               <Check />
            </Button>
         </div>
      </div>
   </div>
</main>

<style lang="scss">
   @import './src/scss/vantage-theme';

   main {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
   }
   .title-1 {
      text-align: center;
      font-size: 30px;
      font-weight: 400;
      margin-top: 60px;
      margin-bottom: 5px;
      color: #676767;
   }
   .title-2 {
      margin-top: 4px;
      text-align: center;
      font-weight: 600;
      font-size: 24px;
      color: #343434;
   }
   .paper {
      @include vantage-paper;
      width: 560px;
      padding: 16px;
   }

   .row {
      margin: 16px 0;
      &.n1 {
         margin: 0 0 16px;
      }
      &.n4 {
         margin: 16px 0 0;
         display: flex;
         justify-content: space-between;
         align-items: center;
      }
   }
</style>
