<script>
   // Svelte Imports
   import { fade } from 'svelte/transition';

   // Common Components
   import Header from './components/common/Header.svelte';
   import Footer from './components/common/Footer.svelte';

   // Auth Components
   import Login from './components/auth/login/Login.svelte';
   import Home from './components/home/Home.svelte';
   // import MyAccount from './comp/auth/my-account/MyAccount.svelte';
   // import SignUp from './comp/auth/sign-up/SignUp.svelte';
   // import Project from './comp/project/Project.svelte';
   // import Workbook from './comp/workbook/Workbook.svelte';

   // Stores
   import tokenStore from './stores/token.js';
   import projStore from './stores/project';

   // Constants
   const comps = {
      Login,
      Home,
      // MyAccount,
      // SignUp,
      // Project,
      // Workbook,
   };

   // Variables
   let token = null;
   let comp = Login;
   let user = undefined;
   let show = false;

   // Subscriptions
   tokenStore.subscribe((store) => (token = store));

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
            // NOTE: for development
            // comp = Workbook;
            show = true;
         }
      } else {
         // Set the page to the login screen
         show = true;
      }
   };

   const open = async (calcId) => {
      const res = await fetch(`/api/proj/${calcId}`).catch(() => {});

      const body = await res.json();

      if (res.ok) {
         projStore.set(body);
      } else {
         projStore.set(undefined);
      }
   };

   // Reactive rules
   $: if (token) {
      getUser();
   } else {
      user = undefined;
      comp = Login;
      show = true;
   }

   // Events
   const logout = () => {
      tokenStore.destroy();
      user = undefined;
      comp = Login;
   };

   const changePage = (event) => {
      if (typeof event.detail === 'string') {
         comp = comps[event.detail];
      } else {
         // NOTE: 2-18-2021 11:36 AM - may have other selections other than open
         const { comp: newComp, calcId } = event.detail;

         open(calcId);

         comp = comps[newComp];
      }
   };
</script>

<Header />
{#if show}
   <div transition:fade>
      <svelte:component this={comp} on:changePage={changePage} {...user} {token} />
   </div>
{/if}
<Footer />
