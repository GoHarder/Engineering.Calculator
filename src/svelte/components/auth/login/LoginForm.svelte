<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Project Components
   import A from '../../common/A.svelte';
   import { Checkbox } from '../../material/checkbox';
   import { HelperText, Input, InputPassword } from '../../material/input';
   import { Button, Label } from '../../material/button';

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
      <svg slot="icon-2" class="mdc-button__icon" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
         <g>
            <rect fill="none" height="24" width="24" />
         </g>
         <g>
            <path d="M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z" />
         </g>
      </svg>
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
