<script>
   import { createEventDispatcher } from 'svelte';

   // Components
   import A from '../../common/A.svelte';
   import ProjectTab from './ProjectTab.svelte';
   import { Button, Label } from '../../material/button';
   import { ArrowBackIos, ArrowForwardIos } from '../../material/button/icons';

   // Properties
   export let activeTab = 0;
   export let validForm = true;

   // Constants
   const dispatch = createEventDispatcher();

   // Events
   const onTab = (index) => {
      if (index === activeTab + 1) dispatch('onNext');
      if (index === activeTab - 1) dispatch('onBack');
   };
</script>

<main>
   <div class="head">
      <A on:click={() => dispatch('onHome')}>Home</A>

      <div class="title">
         <i class="material-icons">engineering</i>

         <h6>Configuration</h6>
      </div>
   </div>

   <div class="paper n1">
      <div class="tabs">
         <ProjectTab on:click={() => onTab(1)} label="Project Summary" index={1} {activeTab} />

         <ProjectTab on:click={() => onTab(2)} label="Requirements" index={2} {activeTab} />

         <ProjectTab on:click={() => onTab(3)} label="Calculation Modules" index={3} {activeTab} />
      </div>

      <slot />
   </div>

   <div class="paper n2">
      {#if activeTab > 1}
         <Button on:click={() => dispatch('onBack')} variant="contained" color="secondary">
            <ArrowBackIos />
            <Label>Back</Label>
         </Button>
      {/if}

      <Button on:click={() => dispatch('onNext')} disabled={!validForm} variant="contained">
         <Label>{activeTab === 3 ? 'Start' : 'Next'}</Label>
         <ArrowForwardIos />
      </Button>
   </div>
</main>

<style lang="scss">
   @use './src/scss/vantage-theme';

   main {
      padding: 16px;
      width: 100%;
      height: 100%;
      margin: 0 auto;
   }

   .head {
      padding-bottom: 16px;
   }

   .title {
      display: flex;
      align-items: center;
      h6 {
         font: {
            weight: 600;
            size: 1.25rem;
         }
         line-height: 1.6;
         margin: 0 0 0 8px;
      }
   }

   .paper {
      @include vantage-theme.vantage-paper;
      &.n1 {
         @include vantage-theme.vantage-border;
         padding: 0 0 16px;
         min-height: calc(100vh - 270px);
      }
      &.n2 {
         margin: 4px 0 30px;
         padding: 16px;
         display: flex;
         justify-content: flex-end;
         column-gap: 16px;
      }
   }

   .tabs {
      background-color: #f5f5f5;
      display: flex;
      padding: 16px 16px 0;
   }

   @media (min-width: 786px) {
      main {
         padding: 16px;
      }
   }

   @media (min-width: 1600px) {
      main {
         max-width: 1600px;
      }
   }
</style>
