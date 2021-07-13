<script>
   import { createEventDispatcher } from 'svelte';
   import { slide } from 'svelte/transition';

   // Components
   import { Button, Label } from '../material/button';
   import { ArrowDropDown } from '../material/button/icons';
   import { Anchor, Icon, Item, Menu, Text } from '../material/menu';
   import { LinearProgress } from '../material/progress';

   // Properties
   export let user = undefined;
   export let loading = false;

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let open = false;
</script>

<header>
   <div class="box">
      <div class="logo">
         <img src="public/img/vantage-logo.svg" alt="Vantage Logo" />
      </div>
      <p>
         <span class="hw">Hollister-Whitney</span>
         <span>Engineering Calculator</span>
      </p>
   </div>

   {#if user}
      <div class="right">
         <i class="material-icons">person</i>

         <Anchor>
            <Button on:click={() => (open = !open)}>
               <Label>{`${user.firstName} ${user.lastName}`}</Label>
               <ArrowDropDown />
            </Button>
            <Menu bind:open>
               <Item on:click={() => dispatch('changePage', 'MyAccount')}>
                  <Icon>account_circle</Icon>
                  <Text>My Account</Text>
               </Item>

               {#if user.admin}
                  <Item on:click={() => dispatch('changePage', 'AdminTools')}>
                     <Icon class="material-icons">build</Icon>
                     <Text>Admin Tools</Text>
                  </Item>

                  <Item on:click={() => dispatch('changePage', 'SignUp')}>
                     <Icon class="material-icons">person_add</Icon>
                     <Text>Create New User</Text>
                  </Item>
               {/if}

               <Item on:click={() => dispatch('logout')}>
                  <Icon class="material-icons">logout</Icon>
                  <Text>Logout</Text>
               </Item>
            </Menu>
         </Anchor>
      </div>
   {/if}
</header>

{#if loading}
   <div class="sticky" transition:slide>
      <LinearProgress indeterminate />
   </div>
{/if}

<style lang="scss">
   div.sticky {
      position: sticky;
      top: 0;
      z-index: 50;
   }

   header {
      align-items: center;
      background-color: #333333;
      box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
      color: #ffffff;
      display: flex;
      font-size: 20px;
      height: 60px;
      justify-content: space-between;
      left: 0;
      padding: 10px;
      position: relative;
      top: 0;
      z-index: 3;
   }

   @media print {
      header {
         display: none;
      }
   }

   .box {
      margin-left: 210px;
   }

   .hw {
      display: none;
   }

   .logo {
      align-items: center;
      background: #ffffff;
      display: flex;
      height: 100%;
      left: 0px;
      margin: 0;
      padding: 20px;
      position: absolute;
      top: 0px;

      & > * {
         z-index: 1;
      }

      &:after {
         background: #ffffff;
         content: '';
         height: 100%;
         position: absolute;
         right: -35px;
         top: 0;
         transform: skewX(-27deg);
         width: 50px;
         z-index: 0;
      }
   }

   img {
      width: 120px;
      border: none;
      display: block;
      max-width: 100%;
   }

   p {
      font-size: 18px;
   }

   .right {
      display: flex;
      align-items: center;
   }

   @media (min-width: 800px) {
      .hw {
         display: inline;
      }
   }
</style>
