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
   // import Project from './components/project-old/Project.svelte';
   import ProjectSummary from './components/project/project-summary/ProjectSummary.svelte';
   import Requirements from './components/project/requirements/Requirements.svelte';

   // import Workbook from './comp/workbook/Workbook.svelte';

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
      // Project,
      ProjectSummary,
      Requirements,
      // Workbook,
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

         // Check if response was good
         if (res.ok) {
            // Set the user data
            user = await res.json();
            // Set the page to the home screen

            if (typeof setComp === 'string') {
               setComp = comps[setComp];
            }

            comp = setComp;

            show = true;
            loading = false;
         }
      } else {
         // Set the page to the login screen
         show = true;
      }
   };

   const open = async (calcId) => {
      loading = true;

      const res = await fetch(`/api/proj/${calcId}`).catch(() => {});

      const body = await res.json();

      if (res.ok) {
         projStore.set(body);

         loading = false;
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
         // console.log(event.detail);

         switch (event.detail.run) {
            case 'getUser':
               user = undefined;
               getUser(event.detail.comp);
               break;

            case 'open':
               open(event.detail.calcId);
               comp = comps[event.detail.comp];
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
