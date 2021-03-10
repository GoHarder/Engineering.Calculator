<!-- TODO: 3-10-2021 2:45 PM - add error trapping -->
<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Project Components
   import PasswordRequire from '../../common/PasswordRequire.svelte';

   // SMUI Components
   // import Paper from '@smui/paper';
   // import Textfield from '@smui/textfield';
   // import Button, { Label, Icon as BtnIcon } from '@smui/button';
   // import Snackbar, { Actions, Label as SnackLabel } from '@smui/snackbar';
   // import IconButton from '@smui/icon-button';
   import { HelperText, Input, InputPassword } from '../../material/input';
   import { Button, Label } from '../../material/button';
   import { Close, Save } from '../../material/button/icons';

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
         setTimeout(() => {
            dispatch('changePage', 'Home');
         }, 10250);
      } else {
         const body = await res.json();

         console.log(body);
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

<!-- <Snackbar class={msgClass} bind:this={msgSnackbar} labelText={message} timeoutMs={10 * 1000}>
   <SnackLabel />
   <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
   </Actions>
</Snackbar> -->

<main>
   <p class="title-1">My Account</p>
   <p class="title-2">Hollister-Whitney Engineering Calculations</p>

   <div class="paper n1">
      <Input bind:value={firstName} label="First Name">
         <span slot="helperText">
            <HelperText validation>Invalid Email</HelperText>
         </span>
      </Input>

      <Input bind:value={lastName} label="Last Name">
         <span slot="helperText">
            <HelperText validation>Invalid Email</HelperText>
         </span>
      </Input>

      <Input bind:value={email} label="Email" type="email">
         <span slot="helperText">
            <HelperText validation>Invalid Email</HelperText>
         </span>
      </Input>

      <div class="password-section">
         <div class="box-1">
            <InputPassword bind:value={newPassword1} helperText="" label="New Password" />

            <InputPassword bind:value={newPassword2} helperText="" label="Confirm New Password" />
         </div>

         <div class="box-2">
            <p class="input-label">Password Requirements</p>

            <PasswordRequire password={newPassword1} />
         </div>
      </div>
   </div>

   <div class="paper n2">
      <p class="bottom-text">Enter current password to confirm settings</p>

      <InputPassword bind:value={password} helperText="" label="Current Password" required />

      <div class="button-section">
         <Button on:click={cancel} color="secondary" variant="outlined">
            <Label>Cancel</Label>
            <Close />
         </Button>

         <Button on:click={save} variant="contained">
            <Label>Save</Label>
            <Save />
         </Button>
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

   .input-label {
      font-size: 18px;
      font-weight: 700;
      color: #343434;
      margin-bottom: 0;
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
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
   }

   .paper {
      padding: 16px;
      box-shadow: $mdc-elevation-3;
      background-color: #ffffff;
      width: 700px;
      &.n1 {
         border-top: 5px solid $mdc-theme-primary;
      }
      &.n2 {
         margin: 15px 0;
      }
   }
</style>
