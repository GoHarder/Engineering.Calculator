<script>
   // Svelte Imports
   import { onMount } from 'svelte';
   import { fade } from 'svelte/transition';

   // Common Components
   import Header from './comp/common/Header.svelte';
   import Footer from './comp/common/Footer.svelte';

   // Auth Components
   import Login from './comp/auth/login/Login.svelte';
   import Home from './comp/home/Home.svelte';
   import MyAccount from './comp/auth/my-account/MyAccount.svelte';

   // Stores
   import tokenStore from './stores/token.js';

   // Constants
   const comps = {
      Login,
      Home,
      MyAccount,
   };

   // Variables
   let token = null;
   let comp = Login;
   let user = undefined;
   let show = false;

   // Subscriptions
   tokenStore.subscribe((store) => (token = store));

   // Reactive rules
   $: if (token) {
      getUser();
   } else {
      user = undefined;
      comp = Login;
      show = true;
   }

   // Methods
   const getUser = async () => {
      // Check if there is a token and user data isn't loaded
      if (token && !user) {
         const res = await fetch('/api/users', {
            headers: { Authorization: token },
         }).catch(() => {
            return { ok: false };
         });

         // Check if response was good
         if (res.ok) {
            // Set the user data
            user = await res.json();
            // Set the page to the home screen
            comp = Home;
            show = true;
         }
      } else {
         // Set the page to the login screen
         show = true;
      }
   };

   // Events
   const logout = (event) => {
      tokenStore.destroy();
      user = undefined;
      comp = Login;
   };

   const changePage = (event) => (comp = comps[event.detail]);

   // Lifecycle
   onMount(() => {
      getUser();
   });
</script>

<Header on:logout={logout} on:changePage={changePage} {user} loading={!show} />
{#if show}
   <div transition:fade>
      <svelte:component this={comp} on:changePage={changePage} {...user} {token} />
   </div>
{/if}
<Footer />
