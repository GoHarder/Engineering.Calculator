<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Project Components
   import A from '../../common/A.svelte';
   import PasswordRequire from '../../common/PasswordRequire.svelte';
   import { HelperText, Input, InputIcon, InputPassword } from '../../material/input';
   import { Button, Label } from '../../material/button';
   import { Replay } from '../../material/button/icons';

   // Parameters
   export let reset = undefined;

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let resetCode = '';
   let password = '';
   let newPassword = '';
   let invalidResetCode = false;
   let invalidPassword = false;
   let invalidNewPassword = false;
   let resetCodeMsg = 'Invalid Code';
   let passwordMsg = 'Invalid Password';
   let newPasswordMsg = 'Invalid Password';

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

         invalidResetCode = false;
         invalidPassword = false;
         invalidNewPassword = false;
         resetCodeMsg = 'Invalid Code';
         passwordMsg = 'Invalid Password';
         newPasswordMsg = 'Invalid Password';

         if (res.ok) {
            dispatch('changeForm', 'LoginForm');
         } else {
            const body = await res.json();

            const errors = body.error;
            const msg = body.msg;

            invalidResetCode = errors.includes('password');
            invalidPassword = errors.includes('newPassword');
            invalidNewPassword = errors.includes('newPassword');
         }
      } else {
         invalidPassword = true;
         invalidNewPassword = true;
         passwordMsg = 'Passwords do not match';
         newPasswordMsg = 'Passwords do not match';
      }
   };
</script>

<p class="p-1">A reset code has been sent to your email account. Please enter it below to complete verification and set your new password.</p>
<div class="main">
   <div class="box-1">
      <Input bind:value={resetCode} invalid={invalidResetCode} label="Enter Code" required>
         <span slot="trailingIcon">
            <InputIcon on:click={resend} button title="Resend Code" trailing>undo</InputIcon>
         </span>
         <span slot="helperText">
            <HelperText validation>{resetCodeMsg}</HelperText>
         </span>
      </Input>

      <InputPassword bind:value={password} helperText={passwordMsg} invalid={invalidPassword} label="New Password" required />

      <InputPassword bind:value={newPassword} helperText={newPasswordMsg} invalid={invalidNewPassword} label="Confirm New Password" required />

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
