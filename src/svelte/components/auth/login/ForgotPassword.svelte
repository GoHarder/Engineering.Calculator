<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Project Components
   import A from '../../common/A.svelte';
   import { HelperText, Input } from '../../material/input';
   import { Button, Label } from '../../material/button';
   import { MailOutline } from '../../material/button/icons';

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
         const errors = body.error;

         invalidEmail = true;
         emailMsg = errors;
      }
   };
</script>

<Input bind:value={email} invalid={invalidEmail} label="Email" required type="email">
   <span slot="helperText">
      <HelperText validation>{emailMsg}</HelperText>
   </span>
</Input>

<div class="row">
   <A on:click={changeForm}>Back to Login</A>

   <Button on:click={sendEmail} variant="contained">
      <Label>Send Reset Code</Label>
      <MailOutline />
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
