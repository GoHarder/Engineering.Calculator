<!-- TODO: 3-10-2021 2:45 PM - add error trapping -->
<script>
   import { createEventDispatcher, onDestroy } from 'svelte';

   // Components
   import PasswordRequire from '../../common/PasswordRequire.svelte';
   import { HelperText, Input, InputPassword } from '../../material/input';
   import { Button, Label } from '../../material/button';
   import { Check, Close, Save } from '../../material/button/icons';
   import SectionTitle from '../../common/SectionTitle.svelte';
   import { Actions, Banner, Text } from '../../material/banner';

   // Stores
   import loadingStore from '../../../stores/loading.js';

   // Parameters
   export let token = null;
   export let _id = undefined;
   export let firstName = undefined;
   export let lastName = undefined;
   export let email = undefined;

   // Methods
   const sendReq = async (body) => {
      body = JSON.stringify(body);

      const res = await fetch(`api/users/${_id}`, {
         method: 'PUT',
         headers: {
            Authorization: token,
            'Content-Type': 'application/json',
         },
         body,
      }).catch(() => {});

      if (res.ok) {
         openBanner = true;
         setTimeout(() => {
            dispatch('changePage', { comp: 'Home', run: 'getUser' });
         }, 10250);
      } else {
         const body = await res.json();
         const error = body.error;

         // console.log(error);

         if (Array.isArray(error)) {
            passwordError = error.includes('password') ? 'Invalid Password' : '';
            emailError = error.includes('email') ? 'Invalid Email' : '';
         } else {
            emailError = error?.email ? error.email : '';
            passwordError = error?.password ? error.password : '';
         }

         if (error?.form) {
            formError = error.form;
            openBanner = true;
         }
      }
   };

   // Constants
   const dispatch = createEventDispatcher();
   const clearLoading = loadingStore.subscribe(() => {});

   // Variables
   let password = '';
   let newPassword1 = '';
   let newPassword2 = '';

   let openBanner = false;
   let scrollY = 0;
   let formError = '';
   let emailError = '';
   let newPassword1Error = '';
   let newPassword2Error = '';
   let passwordError = '';

   // Reactive Variables
   $: same = newPassword1 === newPassword2;
   $: filledIn = newPassword1 !== '' || newPassword2 !== '';
   $: newPassword = filledIn && same ? newPassword1 : '';

   // Reactive Rules
   $: if (openBanner) {
      scrollY = 0;
   }

   // Events
   const cancel = () => dispatch('changePage', 'Home');

   const save = () => {
      formError = '';
      emailError = '';
      newPassword1Error = '';
      newPassword2Error = '';
      passwordError = '';

      let body = {
         firstName,
         lastName,
         email,
         password,
      };

      if (filledIn) {
         if (same) {
            body.newPassword = newPassword;
            sendReq(body);
         } else {
            newPassword1Error = 'Passwords do not match';
            newPassword2Error = 'Passwords do not match';
         }
      } else {
         sendReq(body);
      }
   };

   // Lifecycle
   onDestroy(() => {
      clearLoading();
   });
</script>

<svelte:window bind:scrollY />

<Banner bind:open={openBanner} centered>
   {#if !formError}
      <Text>Settings are saved. Returning to home screen.</Text>
   {:else}
      <Text>
         <span style="color: #b00020;">
            {formError}
         </span>
      </Text>
   {/if}
   <Actions>
      <Button color="primary" class="mdc-banner__primary-action" variant="contained">
         <Label>Ok</Label>
         <Check />
      </Button>
   </Actions>
</Banner>

<main>
   <p class="title-1">My Account</p>
   <p class="title-2">Hollister-Whitney Engineering Calculations</p>

   <div class="paper n1">
      <section class="n1">
         <SectionTitle>Personal Information</SectionTitle>

         <div class="box n1">
            <Input bind:value={firstName} label="First Name">
               <span slot="helperText">
                  <HelperText validation>Invalid first name</HelperText>
               </span>
            </Input>
         </div>
         <div class="box n2">
            <Input bind:value={lastName} label="Last Name">
               <span slot="helperText">
                  <HelperText validation>Invalid last name</HelperText>
               </span>
            </Input>
         </div>
         <div class="box n3">
            <Input bind:value={email} bind:invalid={emailError} label="Email" type="email">
               <span slot="helperText">
                  <HelperText validation>{emailError}</HelperText>
               </span>
            </Input>
         </div>
      </section>
      <section class="n2">
         <SectionTitle>Password</SectionTitle>

         <div class="box n4">
            <InputPassword bind:value={newPassword1} invalid={newPassword1Error} helperText={newPassword1Error} label="New Password" />
         </div>

         <div class="password-section">
            <div class="box-1">
               <InputPassword bind:value={newPassword2} invalid={newPassword2Error} helperText={newPassword2Error} label="Confirm New Password" />
            </div>

            <div class="box-2">
               <!-- <p class="input-label">Requirements</p> -->

               <PasswordRequire password={newPassword1} />
            </div>
         </div>
      </section>
   </div>

   <div class="paper n2">
      <p class="bottom-text">Enter current password to confirm settings</p>

      <InputPassword bind:value={password} helperText={passwordError} invalid={passwordError} label="Current Password" required />

      <div class="button-section">
         <Button on:click={cancel} color="secondary" variant="outlined">
            <Label>Cancel</Label>
            <Close />
         </Button>

         <Button on:click={save} variant="contained">
            <Label>Save</Label>
            <Save />
         </Button>
      </div>
   </div>
</main>

<style lang="scss">
   @import './src/scss/vantage-theme';
   main {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-bottom: 30px;
   }
   .title-1 {
      text-align: center;
      font-size: 30px;
      font-weight: 400;
      margin-top: 30px;
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

   section.n2 {
      margin-top: 8px;
   }
   .paper {
      padding: 16px;
      box-shadow: $mdc-elevation-3;
      background-color: #ffffff;
      width: 550px;
      &.n1 {
         border-top: 5px solid $mdc-theme-primary;
      }
      &.n2 {
         margin: 15px 0;
      }
   }

   .box {
      margin: 0;
      &.n1,
      &.n4 {
         margin-top: 16px;
      }
   }

   .input-label {
      font-size: 18px;
      font-weight: 300;
      color: #343434;
      margin: 0;
   }

   .bottom-text {
      margin: 0 0 16px;
   }

   .button-section {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
   }
</style>
