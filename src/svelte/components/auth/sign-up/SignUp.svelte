<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // SMUI Components
   import Paper from '@smui/paper';
   import Button, { Label, Icon as BtnIcon } from '@smui/button';
   import Textfield from '@smui/textfield';

   // Project Components
   import ErrorDialog from '../../common/ErrorDialog.svelte';

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let firstName = '';
   let lastName = '';
   let email = '';
   let errors = [];
   let status = 200;
   let statusText = '';

   // Events
   const onCancel = (event) => {
      event.preventDefault();
      dispatch('changePage', 'Home');
   };

   const onReset = (event) => {
      event.preventDefault();

      firstName = '';
      lastName = '';
      email = '';
   };

   const onCreate = async (event) => {
      event.preventDefault();

      const res = await fetch('/api/users', {
         method: 'POST',
         body: JSON.stringify({ firstName, lastName, email }),
         headers: { 'Content-Type': 'application/json' },
      }).catch(() => {});

      const body = await res.json();

      if (res.ok) {
         dispatch('changePage', 'Home');
      } else {
         status = res.status;
         statusText = res.statusText;

         if (!Array.isArray(body.error)) body.error = [body.error];

         errors = body.error;
      }
   };
</script>

<main>
   <p class="title-1">Create New User</p>
   <p class="title-2">Hollister-Whitney Engineering Calculator</p>
   <form>
      <Paper elevation={3} square>
         <p class="input-label n1">First Name</p>
         <Textfield bind:value={firstName} fullwidth label="First Name" />

         <p class="input-label n2">Last Name</p>
         <Textfield bind:value={lastName} fullwidth label="Last Name" />

         <p class="input-label n2">Email</p>
         <Textfield bind:value={email} fullwidth label="Email" type="email" />

         <div class="btn-row">
            <div class="left">
               <Button on:click={onCancel} class="text-transform-none" variant="outlined">
                  <Label>Cancel</Label>
                  <BtnIcon class="material-icons">close</BtnIcon>
               </Button>
            </div>

            <div class="right">
               <Button on:click={onReset} class="text-transform-none" color="secondary" variant="raised">
                  <Label>Reset</Label>
                  <BtnIcon class="material-icons">replay</BtnIcon>
               </Button>
               <Button on:click={onCreate} class="text-transform-none" color="secondary" variant="raised">
                  <Label>Create</Label>
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                     <path d="M0 0h24v24H0z" fill="none" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                  </svg>
               </Button>
            </div>
         </div>
      </Paper>
   </form>
</main>

<ErrorDialog {status} {statusText} {errors} />

<style lang="scss">
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
   form {
      border-top: 5px solid #ffcb30;
      width: 555px;
   }
   .input-label {
      font-size: 18px;
      font-weight: 700;
      color: #343434;
      &.n1 {
         margin: 6px 0 0 0;
      }
      &.n2 {
         margin: 14px 0 0 0;
      }
   }

   .btn-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
   }
   svg {
      margin-left: 5px;
   }
</style>
