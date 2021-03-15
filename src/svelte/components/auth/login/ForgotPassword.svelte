<script>
   import { createEventDispatcher, onDestroy } from 'svelte';

   //  Components
   import A from '../../common/A.svelte';
   import { HelperText, Input } from '../../material/input';
   import { Button, Label } from '../../material/button';
   import { MailOutline } from '../../material/button/icons';

   // Stores
   import loadingStore from '../../../stores/loading.js';

   // Parameters
   export let reset = undefined;

   // Constants
   const dispatch = createEventDispatcher();
   const clearLoading = loadingStore.subscribe(() => {});

   // Variables
   let email = '';
   let emailError = '';

   // Events
   const changeForm = () => {
      dispatch('changeForm', 'LoginForm');
   };

   const sendEmail = async () => {
      emailError = '';
      loadingStore.set(true);

      const res = await fetch(`/api/users?email=${email}`, {
         headers: { 'Content-Type': 'application/json' },
      });

      const body = await res.json();

      if (res.ok) {
         reset = body;
         loadingStore.set(false);
         dispatch('changeForm', 'ConfirmPassword');
      } else {
         loadingStore.set(false);
         emailError = body.error;
      }
   };

   // Lifecycle
   onDestroy(() => {
      clearLoading();
   });
</script>

<Input bind:value={email} invalid={emailError} label="Email" required type="email">
   <span slot="helperText">
      <HelperText validation>{emailError}</HelperText>
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
