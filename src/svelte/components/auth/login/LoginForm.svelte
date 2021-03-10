<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Project Components
   import A from '../../common/A.svelte';
   import { Checkbox } from '../../material/checkbox';
   import { HelperText, Input, InputPassword } from '../../material/input';
   import { Button, Label } from '../../material/button';
   import { Login } from '../../material/button/icons';

   // Stores
   import token from '../../../stores/token.js';

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let email = '';
   let password = '';
   let longToken = false;
   let invalidEmail = false;
   let invalidPassword = false;
   let emailMsg = 'Email is invalid';
   let passwordMsg = 'Password is invalid';

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
      const res = await fetch('/api/tokens', {
         method: 'POST',
         body: JSON.stringify({ email, password, longToken }),
         headers: { 'Content-Type': 'application/json' },
      }).catch(() => {});

      const body = await res.json();

      invalidEmail = false;
      invalidPassword = false;
      emailMsg = 'Email is invalid';
      passwordMsg = 'Password is invalid';

      if (res.ok) {
         token.set(body.token);
      } else {
         const errors = body.error;
         const msg = body.msg;

         invalidEmail = errors.includes('email');
         invalidPassword = errors.includes('password');

         if (msg) {
            emailMsg = msg.email ? msg.email : emailMsg;
            passwordMsg = msg.password ? msg.password : passwordMsg;
         }
      }
   };
</script>

<svelte:window on:keydown={onEnter} />

<div class="row n1">
   <Input bind:value={email} invalid={invalidEmail} label="Email" required type="email">
      <span slot="helperText">
         <HelperText validation>{emailMsg}</HelperText>
      </span>
   </Input>
</div>
<div class="row n2">
   <InputPassword bind:value={password} helperText={passwordMsg} invalid={invalidPassword} label="Password" required />
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
