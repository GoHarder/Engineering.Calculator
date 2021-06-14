<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';

   // Components
   import TitlePage from './TitlePage.svelte';
   import Page from './Page.svelte';

   // Properties
   export let firstName = '';
   export let lastName = '';

   // Stores
   import projectStore from '../../stores/project';

   // Constants
   const dispatch = createEventDispatcher();
   const date = Date.now();
   const debug = false;

   // Variables
   let workbook = undefined;
   let title = 'Engineering Calculator';

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => (workbook = store));

   // Reactive Rules
   if (workbook.contract) {
      title = [
         `${workbook.customer}${workbook.customer ? ' -' : ''}`,
         `${workbook.contract ? '#' : ''}${workbook.contract}${workbook.contract ? ' -' : ''}`,
         `${workbook.layout ? '#' : ''}${workbook.layout}${workbook.layout ? ' -' : ''}`,
         `${firstName.charAt(0)}${lastName.charAt(0)}`,
      ].join(' ');
   }

   // Events
   const onAfterPrint = () => dispatch('changePage', 'Workbook');
   const noScroll = () => window.scrollTo(0, 0);

   // Lifecycle
   onMount(() => {
      console.log(workbook);

      if (!debug) {
         window.addEventListener('afterprint', onAfterPrint);
         window.addEventListener('scroll', noScroll);
         setTimeout(() => {
            window.print();
         }, 3500);
      }
   });

   onDestroy(() => {
      window.removeEventListener('scroll', noScroll);
      clearProject();
   });
</script>

<svelte:head>
   <title>{title}</title>
</svelte:head>

<div class="scrim">
   <div class="scrim-frame">
      <img src="public/img/loading.gif" alt="Loading" />
   </div>
</div>

<TitlePage {firstName} {lastName} {workbook} />

<style lang="scss" global>
   @use './src/scss/vantage-theme';
   .scrim {
      height: 100vh;
      background-color: #ffffff;
      display: flex;
      justify-content: center;
      img {
         margin: 0 auto;
      }
   }

   @media print {
      .scrim {
         display: none;
      }
   }
</style>
