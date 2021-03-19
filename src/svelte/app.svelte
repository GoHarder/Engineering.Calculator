<script>
   // Svelte Imports
   import { onDestroy } from 'svelte';
   import { fade } from 'svelte/transition';

   // Common Components
   import Header from './components/common/Header.svelte';
   import Footer from './components/common/Footer.svelte';

   // Page Components
   import Login from './components/auth/login/Login.svelte';
   import Home from './components/home/Home.svelte';
   import MyAccount from './components/auth/my-account/MyAccount.svelte';
   import SignUp from './components/auth/sign-up/SignUp.svelte';
   import ProjectSummary from './components/project/project-summary/ProjectSummary.svelte';
   import Requirements from './components/project/requirements/Requirements.svelte';
   import CalculationModules from './components/project/calculation-modules/CalculationModules.svelte';
   import Workbook from './components/workbook/Workbook.svelte';

   // Stores
   import tokenStore from './stores/token';
   import projStore from './stores/project';
   import loadingStore from './stores/loading';

   // Constants
   const comps = {
      Login,
      Home,
      MyAccount,
      SignUp,
      ProjectSummary,
      Requirements,
      CalculationModules,
      Workbook,
   };

   // Variables
   let comp = Login;
   let loading = false;
   let show = false;
   let token = null;
   let user = undefined;

   // Subscriptions
   const clearToken = tokenStore.subscribe((store) => (token = store));
   const clearLoading = loadingStore.subscribe((store) => (loading = store));

   // Methods
   const getUser = async (setComp = Home) => {
      // Check if there is a token and user data isn't loaded
      if (token && !user) {
         loading = true;

         const res = await fetch('/api/users', {
            headers: { Authorization: token },
         }).catch(() => {
            return { ok: false };
         });

         if (res.ok) {
            // Set the user data
            user = await res.json();

            // Used when user updates settings
            if (typeof setComp === 'string') setComp = comps[setComp];

            // Set the page to the next screen
            comp = setComp;

            // Show the page and stop the loading animation
            show = true;
            loading = false;
         }
      } else {
         // Set the page to the login screen
         show = true;
      }
   };

   const open = async (detail) => {
      // Show the loading animation
      loading = true;

      // Request the server for the calculator data
      const res = await fetch(`/api/proj/${detail.calcId}`).catch(() => {
         return { ok: false };
      });

      if (res.ok) {
         // Get the body of the request at set it in the project store
         const body = await res.json();
         projStore.set(body);

         // Stop the loading animation
         loading = false;

         // Change the page to the workbook area
         comp = Workbook;
      } else {
         // TODO: 3-19-2021 10:22 AM - show user that the workbook failed to load
         loading = false;
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
         // If theres more instructions that just changing pages run it
         switch (event.detail.run) {
            case 'getUser':
               user = undefined;
               getUser(event.detail.comp);
               break;

            case 'open':
               open(event.detail);
               break;
         }
      }
   };

   // Lifecycle
   onDestroy(() => {
      clearToken();
      clearLoading();
   });
</script>

<Header on:changePage={changePage} on:logout={logout} {user} {loading} />
{#if show}
   <div transition:fade>
      <svelte:component this={comp} on:changePage={changePage} {...user} {token} />
   </div>
{/if}
<Footer />
