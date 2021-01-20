<script>
  // Svelte Imports
  import { createEventDispatcher } from "svelte";

  // Project Components
  import A from "../common/A.svelte";

  // SMUI Components
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon/index";
  import Button, { Label } from "@smui/button";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import LineRipple from "@smui/line-ripple";

  // Constants
  const dispatch = createEventDispatcher();

  // Variables
  let email = "";
  let password = "";
  let longToken = false;
  let showPassword = false;

  // Events
  const toggleShowPassword = () => (showPassword = !showPassword);

  const changeForm = event => {
    event.preventDefault();
    dispatch("changeForm", "ForgotPassword");
  };

  const signIn = event => {
    event.preventDefault();
    console.log("TODO: hook up sign in");
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
  .row-3 {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0;
  }
  .row-4 {
    text-align: center;
  }
  .pipe {
    color: #d3d3d3;
    padding: 0 10px;
  }
</style>

<p class="input-label-1">Email</p>

<Textfield bind:value={email} fullwidth label="Enter Email" type="email" />

<p class="input-label-2">Password</p>

{#if showPassword}
  <Textfield
    bind:value={password}
    fullwidth
    label="Enter Password"
    withTrailingIcon>
    <Icon on:click={toggleShowPassword} role="button" class="material-icons">
      visibility
    </Icon>
  </Textfield>
{:else}
  <Textfield
    bind:value={password}
    fullwidth
    label="Enter Password"
    type="password"
    withTrailingIcon>
    <Icon on:click={toggleShowPassword} role="button" class="material-icons">
      visibility_off
    </Icon>
  </Textfield>
{/if}

<div class="row-3">
  <FormField>
    <Checkbox bind:checked={longToken} />
    <span slot="label">Keep me signed in</span>
  </FormField>

  <span class="pipe">|</span>

  <A on:click={changeForm}>Forgot Password?</A>
</div>

<div class="row-4">
  <Button
    on:click={signIn}
    class="text-transform-none"
    color="secondary"
    variant="raised">
    <Label>Sign In</Label>
    <Icon class="material-icons">login</Icon>
  </Button>
</div>
