<script>
   import { createEventDispatcher, onDestroy } from 'svelte';

   // Components
   import A from '../../common/A.svelte';
   import { Checkbox } from '../../material/checkbox';
   import { HelperText, Input, InputPassword } from '../../material/input';
   import { Button, Label } from '../../material/button';
   import { Login } from '../../material/button/icons';

   // Stores
   import tokenStore from '../../../stores/token.js';
   import loadingStore from '../../../stores/loading.js';

   // Constants
   const dispatch = createEventDispatcher();
   const clearToken = tokenStore.subscribe(() => {});
   const clearLoading = loadingStore.subscribe(() => {});

   // Variables
   let email = '';
   let password = '';
   let longToken = false;

   let emailError = '';
   let passwordError = '';

   // Events
   const changeForm = () => {
      dispatch('changeForm', 'ForgotPassword');
   };

   const onEnter = (event) => {
      if (event.keyCode === 13) {
         signIn();
      }
   };

   const signIn = async () => {
      loadingStore.set(true);
      emailError = '';
      passwordError = '';

      const res = await fetch('/api/tokens', {
         method: 'POST',
         body: JSON.stringify({ email, password, longToken }),
         headers: { 'Content-Type': 'application/json' },
      }).catch(() => {});

      const body = await res.json();

      if (res.ok) {
         tokenStore.set(body.token);
         loadingStore.set(false);
      } else {
         emailError = body?.error?.email ? body.error.email : 'Invalid email';
         passwordError = body?.error?.password ? body.error.password : 'Invalid password';
         loadingStore.set(false);
      }
   };

   // Lifecycle
   onDestroy(() => {
      clearLoading();
      clearToken();
   });
</script>

<svelte:window on:keydown={onEnter} />

<div class="row n1">
   <Input bind:value={email} invalid={emailError} label="Email" required type="email">
      <span slot="helperText">
         <HelperText validation>{emailError}</HelperText>
      </span>
   </Input>
</div>
<div class="row n2">
   <InputPassword bind:value={password} helperText={passwordError} invalid={passwordError} label="Password" required />
</div>

<div class="row n3">
   <Checkbox bind:checked={longToken} label="Keep me signed in" />

   <span class="pipe">|</span>

   <A on:click={changeForm}>Forgot Password?</A>
</div>

<div class="row n4">
   <Button on:click={signIn} variant="contained">
      <Label>Sign In</Label>
      <Login />
   </Button>
</div>

<style lang="scss">
   .row {
      margin: 8px 0;
      text-align: center;

      &.n1 {
         margin-top: 0;
      }
      &.n3 {
         display: flex;
         justify-content: center;
         align-items: center;
         span {
            color: #d3d3d3;
            padding: 0 10px;
         }
      }
      &.n4 {
         margin-bottom: 0;
      }
   }
</style>
