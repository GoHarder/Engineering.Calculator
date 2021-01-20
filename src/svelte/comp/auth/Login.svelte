<script>
  // Auth Components
  import LoginForm from "./LoginForm.svelte";
  import ForgotPassword from "./ForgotPassword.svelte";
  import ConfirmPassword from "./ConfirmPassword.svelte";

  // SMUI Components
  import Paper from "@smui/paper";

  // Constants
  const comps = {
    LoginForm,
    ForgotPassword,
    ConfirmPassword
  };

  // Variables
  let comp = LoginForm;

  // Reactive Variables
  $: signInText = comp === LoginForm ? "Sign In" : "Forgot Password";

  // Events
  const changeForm = event => (comp = comps[event.detail]);
</script>

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
    width: 555px;
    border-top: 5px solid #ffcb30;
  }
</style>

<main>
  <p class="sign-in-text">{signInText}</p>
  <p class="title-text">Hollister-Whitney Engineering Calculations</p>
  <form>
    <Paper elevation={3} square>
      <svelte:component this={comp} on:changeForm={changeForm} />
    </Paper>
  </form>
</main>
