<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Project Components
   import A from '../../common/A.svelte';

   // SMUI Components
   import Textfield from '@smui/textfield';
   import Button, { Label, Icon } from '@smui/button';

   // Parameters
   export let reset = undefined;

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let email = '';

   // Events
   const changeForm = (event) => {
      event.preventDefault();
      dispatch('changeForm', 'LoginForm');
   };

   const sendEmail = async (event) => {
      event.preventDefault();

      const res = await fetch(`/api/users?email=${email}`, {
         headers: { 'Content-Type': 'application/json' },
      });

      const body = await res.json();

      if (res.ok) {
         reset = body;
         dispatch('changeForm', 'ConfirmPassword');
      } else {
         const { status, statusText } = res;
         const errors = body.error;

         dispatch('error', { status, statusText, errors });
      }
   };
</script>

<p class="input-label">Email</p>

<Textfield bind:value={email} fullwidth label="Enter Email" type="email" />

<div class="row">
   <A on:click={changeForm}>Back to Login</A>

   <Button on:click={sendEmail} class="text-transform-none" color="secondary" variant="raised">
      <Label>Send Reset Email</Label>
      <Icon class="material-icons">email</Icon>
   </Button>
</div>

<style lang="scss">
   .input-label {
      margin: 0;
      margin-top: 6px;
      font-size: 18px;
      font-weight: 700;
      color: #343434;
   }

   .row {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 500px;
   }
</style>
