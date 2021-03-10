<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Project Components
   import PasswordRequire from '../../common/PasswordRequire.svelte';

   // SMUI Components
   import Paper from '@smui/paper';
   import Textfield from '@smui/textfield';
   import Button, { Label, Icon as BtnIcon } from '@smui/button';
   import Snackbar, { Actions, Label as SnackLabel } from '@smui/snackbar';
   import IconButton from '@smui/icon-button';

   // Parameters
   export let token = null;
   export let _id = undefined;
   export let firstName = undefined;
   export let lastName = undefined;
   export let email = undefined;

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let password = '';
   let newPassword1 = '';
   let newPassword2 = '';
   let msgSnackbar;
   let message = '';
   let msgClass = '';

   // Reactive Variables
   $: same = newPassword1 === newPassword2;
   $: filledIn = newPassword1 !== '' || newPassword2 !== '';
   $: newPassword = filledIn && same ? newPassword1 : '';

   // Methods
   const showError = (event) => {
      msgClass = 'error';

      let { error } = { ...event.detail };

      error = Array.isArray(error) ? error[0] : error;

      message = `${error.charAt(0).toUpperCase() + error.slice(1)}.`;

      msgSnackbar.open();
   };

   const showMsg = (msg) => {
      msgClass = 'good';
      message = msg;
      msgSnackbar.open();
   };

   const sendReq = async (body) => {
      body = JSON.stringify(body);

      const res = await fetch(`api/users/${_id}`, {
         method: 'PUT',
         headers: {
            Authorization: token,
            'Content-Type': 'application/json',
         },
         body,
      }).catch(() => {});

      if (res.ok) {
         showMsg('Saved! Returning to the main menu...');
         setTimeout(() => {
            dispatch('changePage', 'Home');
         }, 10250);
      } else {
         const body = await res.json();

         showError({ detail: body });
      }
   };

   // Events
   const cancel = (event) => {
      event.preventDefault();
      dispatch('changePage', 'Home');
   };

   const save = (event) => {
      event.preventDefault();

      let body = {
         firstName,
         lastName,
         email,
         password,
      };

      if (filledIn) {
         if (same) {
            body.newPassword = newPassword;
            sendReq(body);
         } else {
            showError({ detail: { error: 'passwords do not match' } });
         }
      } else {
         sendReq(body);
      }
   };
</script>

<Snackbar class={msgClass} bind:this={msgSnackbar} labelText={message} timeoutMs={10 * 1000}>
   <SnackLabel />
   <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
   </Actions>
</Snackbar>

<main>
   <p class="title-1">My Account</p>
   <p class="title-2">Hollister-Whitney Engineering Calculations</p>
   <form>
      <Paper elevation={3} square>
         <p class="input-label first">First Name</p>
         <Textfield bind:value={firstName} fullwidth label="First Name" />

         <p class="input-label">Last Name</p>
         <Textfield bind:value={lastName} fullwidth label="Last Name" />

         <p class="input-label">Email</p>
         <Textfield bind:value={email} fullwidth label="Enter Email" type="email" />

         <div class="password-section">
            <div class="box-1">
               <p class="input-label">New Password</p>

               <Textfield bind:value={newPassword1} fullwidth label="Enter New Password" type="password" />

               <p class="input-label">Confirm New Password</p>

               <Textfield bind:value={newPassword2} fullwidth label="Confirm New Password" type="password" />
            </div>

            <div class="box-2">
               <p class="input-label">Password Requirements</p>

               <PasswordRequire password={newPassword1} />
            </div>
         </div>
      </Paper>

      <div class="paper-2">
         <Paper elevation={3} square>
            <p class="bottom-text">Enter current password to confirm settings</p>

            <Textfield bind:value={password} fullwidth label="Current Password" type="password" />

            <div class="button-section">
               <Button on:click={cancel} class="text-transform-none" variant="outlined">
                  <Label>Cancel</Label>
                  <BtnIcon class="material-icons">close</BtnIcon>
               </Button>

               <Button on:click={save} class="text-transform-none" color="secondary" variant="raised">
                  <Label>Save</Label>
                  <BtnIcon class="material-icons">save</BtnIcon>
               </Button>
            </div>
         </Paper>
      </div>
   </form>
</main>

<style lang="scss">
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
      margin-top: 30px;
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
   form {
      max-width: 700px;
      border-top: 5px solid #ffcb30;
   }

   .input-label {
      font-size: 18px;
      font-weight: 700;
      color: #343434;
      margin-bottom: 0;

      &.first {
         margin-top: 0;
      }
   }

   .bottom-text {
      margin: 0;
   }

   .password-section {
      display: flex;

      .box-1 {
         width: 300px;
         margin-right: 25px;
      }
   }

   .button-section {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
   }

   .paper-2 {
      margin: 15px 0;
   }
</style>
