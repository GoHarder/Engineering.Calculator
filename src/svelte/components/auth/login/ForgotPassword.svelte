<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Project Components
   import A from '../../common/A.svelte';
   import { HelperText, Input } from '../../material/input';
   import { Button, Label } from '../../material/button';

   // Parameters
   export let reset = undefined;

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let email = '';
   let invalidEmail = false;
   let emailMsg = 'Email is invalid';

   // Events
   const changeForm = () => {
      dispatch('changeForm', 'LoginForm');
   };

   const sendEmail = async () => {
      const res = await fetch(`/api/users?email=${email}`, {
         headers: { 'Content-Type': 'application/json' },
      });

      const body = await res.json();

      emailMsg = 'Email is invalid';
      invalidEmail = false;

      if (res.ok) {
         reset = body;
         dispatch('changeForm', 'ConfirmPassword');
      } else {
         const { status, statusText } = res;
         const errors = body.error;

         console.log(errors);

         // dispatch('error', { status, statusText, errors });

         invalidEmail = true;
         emailMsg = errors;
      }
   };
</script>

<!-- <Input bind:value={email} bind:invalid={invalidEmail} label="Email" type="email" width="100%" />
<HelperText validation>{emailMsg}</HelperText> -->

<Input bind:value={email} invalid={invalidEmail} label="Email" required type="email">
   <span slot="helperText">
      <HelperText validation>{emailMsg}</HelperText>
   </span>
</Input>

<div class="row">
   <A on:click={changeForm}>Back to Login</A>

   <Button on:click={sendEmail} variant="contained">
      <Label>Send Reset Email</Label>
      <svg slot="icon-2" class="mdc-button__icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
         <path d="M0 0h24v24H0z" fill="none" />
         <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
   </Button>
</div>

<style lang="scss">
   .row {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
   }
</style>
