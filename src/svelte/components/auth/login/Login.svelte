<script>
   // Project Components
   import LoginForm from './LoginForm.svelte';
   // import ForgotPassword from './ForgotPassword.svelte';
   // import ConfirmPassword from './ConfirmPassword.svelte';

   // SMUI Components
   // import Paper from '@smui/paper';

   // Project Components
   // import ErrorDialog from '../../common/ErrorDialog.svelte';

   // Constants
   const comps = {
      LoginForm,
      // ForgotPassword,
      // ConfirmPassword,
   };

   // Variables
   let comp = LoginForm;
   let reset;
   let status;
   let statusText;
   let errors = [];

   // Reactive Variables
   $: signInText = comp === LoginForm ? 'Sign In' : 'Forgot Password';

   // Events
   const changeForm = (event) => (comp = comps[event.detail]);

   const showError = (event) => {
      let { status: resStatus, statusText: resStatusText, errors: resErrors } = event.detail;

      status = resStatus;
      statusText = resStatusText;
      errors = Array.isArray(resErrors) ? resErrors : [resErrors];
   };
</script>

<main>
   <p class="title-1">{signInText}</p>
   <p class="title-2">Hollister-Whitney Engineering Calculator</p>
   <div class="form" />
   <div class="paper">
      <svelte:component this={comp} bind:reset on:changeForm={changeForm} on:error={showError} />
   </div>
</main>

<!-- <ErrorDialog {status} {statusText} {errors} /> -->
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
      padding: 16px;
      box-shadow: $mdc-elevation-3;
      border-top: 5px solid $mdc-theme-primary;
      background-color: #ffffff;
      width: 500px;
   }
</style>
