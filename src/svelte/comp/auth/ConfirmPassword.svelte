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

  let email = "";
  let password = "";
  let longToken = false;

  // Events
  const changeForm = event => {
    event.preventDefault();
    dispatch("changeForm", "LoginForm");
  };

  const resetPassword = event => {
    event.preventDefault();
    console.log("TODO: send request to update password");
    dispatch("changeForm", "LoginForm");
  };
</script>

<style lang="scss">
  .input-label-1,
  .input-label-2 {
    font-size: 18px;
    font-weight: 700;
    color: #343434;
  }
  .input-label {
    &-1 {
      margin: 0;
      margin-top: 6px;
    }
    &-2 {
      margin: 0;
      margin-top: 14px;
    }
  }
  .row {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

<p class="input-label-1">Verification Code</p>

<Textfield bind:value={email} fullwidth label="Enter Code" />

<p class="input-label-2">New Password</p>

<Textfield
  bind:value={email}
  fullwidth
  label="Enter Password"
  type="password" />

<p class="input-label-2">Confirm New Password</p>

<Textfield
  bind:value={email}
  fullwidth
  label="Confirm Password"
  type="password" />

<div class="row">
  <A on:click={changeForm}>Back to Login</A>
  <Button
    on:click={resetPassword}
    class="text-transform-none"
    color="secondary"
    variant="raised">
    <Label>Reset Password</Label>
    <Icon class="material-icons">check</Icon>
  </Button>
</div>
