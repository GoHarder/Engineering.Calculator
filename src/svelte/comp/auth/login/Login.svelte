<script>
   // Project Components
   import LoginForm from './LoginForm.svelte';
   import ForgotPassword from './ForgotPassword.svelte';
   import ConfirmPassword from './ConfirmPassword.svelte';

   // SMUI Components
   import Paper from '@smui/paper';
   import Snackbar, { Actions, Label } from '@smui/snackbar';
   import IconButton from '@smui/icon-button';

   // Constants
   const comps = {
      LoginForm,
      ForgotPassword,
      ConfirmPassword,
   };

   // Variables
   let comp = LoginForm;
   let errorSnackbar;
   let errorMessage;
   let reset;

   // Reactive Variables
   $: signInText = comp === LoginForm ? 'Sign In' : 'Forgot Password';

   // Events
   const changeForm = (event) => (comp = comps[event.detail]);

   const showError = (event) => {
      let { error } = { ...event.detail };

      error = Array.isArray(error) ? error[0] : error;

      errorMessage = `${error.charAt(0).toUpperCase() + error.slice(1)}.`;

      errorSnackbar.open();
   };
</script>

<Snackbar class="error" bind:this={errorSnackbar} labelText={errorMessage} timeoutMs={10 * 1000}>
   <Label />
   <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
   </Actions>
</Snackbar>

<main>
   <p class="sign-in-text">{signInText}</p>
   <p class="title-text">Hollister-Whitney Engineering Calculator</p>
   <form>
      <Paper elevation={3} square>
         <svelte:component this={comp} bind:reset on:changeForm={changeForm} on:error={showError} />
      </Paper>
   </form>
</main>

<style>
   main {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
   }
   .sign-in-text {
      text-align: center;
      font-size: 30px;
      font-weight: 400;
      margin-top: 60px;
      margin-bottom: 5px;
      color: #676767;
   }
   .title-text {
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
</style>
