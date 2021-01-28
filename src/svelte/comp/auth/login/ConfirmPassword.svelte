<script>
  // Svelte Imports
  import { createEventDispatcher } from "svelte";

  // Project Components
  import A from "../../common/A.svelte";
  import PasswordRequire from "../PasswordRequire.svelte";

  // SMUI Components
  import Textfield, { Input, Textarea } from "@smui/textfield";
  import Button, { Label, Icon as BtnIcon } from "@smui/button";
  import Icon from "@smui/textfield/icon/index";

  // Parameters
  export let reset = undefined;

  // Constants
  const dispatch = createEventDispatcher();

  // Variables
  let resetCode = "";
  let password = "";
  let newPassword = "";

  // Reactive Variables
  $: id = reset ? reset.id : undefined;
  $: token = reset ? reset.token : undefined;

  // Events
  const changeForm = event => {
    event.preventDefault();
    dispatch("changeForm", "LoginForm");
  };

  const resend = () => {
    dispatch("changeForm", "ForgotPassword");
  };

  const resetPassword = async event => {
    event.preventDefault();

    if (password === newPassword && reset) {
      const body = JSON.stringify({
        reset: resetCode,
        newPassword
      });

      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body
      });

      if (res.ok) {
        dispatch("changeForm", "LoginForm");
      } else {
        dispatch("error", { error: "invalid password" });
      }
    } else {
      dispatch("error", { error: "passwords do not match" });
    }
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

<p class="p-1">
  A reset code has been sent to your email account. Please enter it below to
  complete verification and set your new password.
</p>
<div class="main">
  <div class="box-1">
    <p class="input-label-1">Verification Code</p>

    <Textfield
      bind:value={resetCode}
      fullwidth
      label="Enter Code"
      withTrailingIcon>
      <Icon on:click={resend} role="button" class="material-icons">replay</Icon>
    </Textfield>

    <p class="input-label-2">New Password</p>

    <Textfield
      bind:value={password}
      fullwidth
      label="Enter Password"
      type="password" />

    <p class="input-label-2">Confirm New Password</p>

    <Textfield
      bind:value={newPassword}
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
        <BtnIcon class="material-icons">check</BtnIcon>
      </Button>
    </div>
  </div>
  <div class="box-2">
    <p class="input-label-1">Password Requirements</p>
    <PasswordRequire {password} />
  </div>
</div>
