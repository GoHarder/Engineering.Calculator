<script>
  // Svelte Imports
  import { createEventDispatcher } from "svelte";

  // Project Components
  import A from "../common/A.svelte";

  // SMUI Components
  import Textfield, { Input, Textarea } from "@smui/textfield";
  import Button, { Label, Icon } from "@smui/button";

  // Constants
  const dispatch = createEventDispatcher();

  // Variables
  let email = "";

  // Events
  const changeForm = event => {
    event.preventDefault();
    dispatch("changeForm", "LoginForm");
  };

  const sendEmail = event => {
    event.preventDefault();
    dispatch("changeForm", "ConfirmPassword");
    console.log("TODO: 1-25-2021 8:17 AM - Send email to reset password");
  };
</script>

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
  }
</style>

<p class="input-label">Email</p>

<Textfield bind:value={email} fullwidth label="Enter Email" type="email" />

<div class="row">
  <A on:click={changeForm}>Back to Login</A>

  <Button
    on:click={sendEmail}
    class="text-transform-none"
    color="secondary"
    variant="raised">
    <Label>Send</Label>
    <Icon class="material-icons">email</Icon>
  </Button>
</div>
