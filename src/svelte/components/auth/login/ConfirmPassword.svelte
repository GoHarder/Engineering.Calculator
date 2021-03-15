<script>
   import { createEventDispatcher, onDestroy } from 'svelte';

   //  Components
   import A from '../../common/A.svelte';
   import PasswordRequire from '../../common/PasswordRequire.svelte';
   import { HelperText, Input, InputIcon, InputPassword } from '../../material/input';
   import { Button, Label } from '../../material/button';
   import { Check, Replay } from '../../material/button/icons';
   import { Actions, Banner, Text } from '../../material/banner';

   // Stores
   import loadingStore from '../../../stores/loading.js';

   // Parameters
   export let reset = undefined;

   // Constants
   const dispatch = createEventDispatcher();
   const clearLoading = loadingStore.subscribe(() => {});

   // Variables
   let resetCode = '';
   let password = '';
   let newPassword = '';

   let formError = '';
   let resetCodeError = '';
   let passwordError = '';
   let newPasswordError = '';
   let openBanner = false;

   // Reactive Variables
   $: id = reset ? reset.id : undefined;
   $: token = reset ? reset.token : undefined;

   // Events
   const changeForm = () => {
      dispatch('changeForm', 'LoginForm');
   };

   const resend = () => {
      dispatch('changeForm', 'ForgotPassword');
   };

   const resetPassword = async () => {
      loadingStore.set(true);
      formError = '';
      resetCodeError = '';
      passwordError = '';
      newPasswordError = '';

      if (password === newPassword && reset) {
         const body = JSON.stringify({
            reset: resetCode,
            newPassword,
         });

         const res = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
               Authorization: token,
               'Content-Type': 'application/json',
            },
            body,
         });

         if (res.ok) {
            loadingStore.set(false);
            openBanner = true;

            setTimeout(() => {
               dispatch('changeForm', 'LoginForm');
            }, 5000);
         } else {
            const body = await res.json();
            const error = body.error;

            if (Array.isArray(error)) {
               if (error.length > 1) {
                  passwordError = error?.password ? error.password : 'Invalid Password';
                  newPasswordError = error?.password ? error.newPassword : 'Invalid Password';
               } else {
                  resetCodeError = 'Invalid code';
               }
            } else {
               passwordError = error?.password ? error.password : 'Invalid Password';
               newPasswordError = error?.password ? error.newPassword : 'Invalid Password';

               if (error?.form) {
                  formError = error.form;
                  openBanner = true;
               }
            }

            loadingStore.set(false);
         }
      } else {
         passwordError = 'Passwords do not match';
         newPasswordError = 'Passwords do not match';
      }
   };

   // Lifecycle
   onDestroy(() => {
      clearLoading();
   });
</script>

<Banner bind:open={openBanner} centered>
   {#if !formError}
      <Text>Password was reset.</Text>
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

<p class="p-1">A reset code has been sent to your email account. Please enter it below to complete verification and set your new password.</p>
<div class="main">
   <div class="box-1">
      <Input bind:value={resetCode} invalid={resetCodeError} label="Enter Code" required>
         <span slot="trailingIcon">
            <InputIcon on:click={resend} button title="Resend Code" trailing>undo</InputIcon>
         </span>
         <span slot="helperText">
            <HelperText validation>{resetCodeError}</HelperText>
         </span>
      </Input>

      <InputPassword bind:value={password} helperText={passwordError} invalid={passwordError} label="New Password" required />

      <InputPassword bind:value={newPassword} helperText={newPasswordError} invalid={newPasswordError} label="Confirm New Password" required />

      <div class="row">
         <A on:click={changeForm}>Back to Login</A>

         <Button on:click={resetPassword} variant="contained">
            <Label>Reset Password</Label>
            <Replay />
         </Button>
      </div>
   </div>
   <div class="box-2">
      <p class="input-label-1">Password Requirements</p>
      <PasswordRequire {password} />
   </div>
</div>

<style lang="scss">
   .input-label-1 {
      font-size: 18px;
      font-weight: 700;
      color: #343434;
      margin: 0;
      margin-top: 6px;
   }

   .row {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
   }

   .p-1 {
      margin-top: 0;
   }

   .main {
      display: flex;
   }

   .box-1 {
      width: 350px;
      margin-right: 25px;
   }

   .box-2 {
      min-width: 325px;
   }
</style>
