<!-- // TODO: 2-17-2021 7:59 AM - load data into form -->
<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // SMUI Components
   import Button, { Label, Icon as BtnIcon } from '@smui/button';
   import Paper from '@smui/paper';
   import Icon from '@smui/textfield/icon/index';

   // Project Components
   import A from '../common/A.svelte';
   import CalculationModules from './calculation_modules/CalculationModules.svelte';
   import ProjectSummary from './ProjectSummary.svelte';
   import Requirements from './Requirements.svelte';
   import ProjectTab from './ProjectTab.svelte';

   export let _id = '';

   // Constants
   const dispatch = createEventDispatcher();
   const comps = {
      _1: ProjectSummary,
      _2: Requirements,
      _3: CalculationModules,
   };

   // Variables
   let activeTab = 1;

   // Reactive Variables
   $: comp = comps[`_${activeTab}`];

   // Events
   const onReturn = () => dispatch('changePage', 'Home');

   const onSwitchTab = (event) => (activeTab = event.detail);
</script>

<main>
   <div class="head">
      <A on:click={onReturn}>Home</A>
      <div class="title">
         <Icon class="material-icons">engineering</Icon>
         <h6>Configuration</h6>
      </div>
   </div>

   <div class="main">
      <Paper class="project-paper" elevation={3} square>
         <div class="tabs">
            <ProjectTab label="Project Summary" index={1} {activeTab} on:switch={onSwitchTab} />
            <ProjectTab label="Requirements" index={2} {activeTab} on:switch={onSwitchTab} />
            <ProjectTab label="Calculation Modules" index={3} {activeTab} on:switch={onSwitchTab} />
         </div>
         <div class="form">
            <svelte:component this={comp} creator={_id} />
         </div>
      </Paper>
      <div class="spacer">
         <Paper class="project-paper" elevation={3} square>
            <div class="buttons">
               <div>
                  {#if activeTab !== 1}
                     <Button on:click={() => activeTab--} class="text-transform-none" variant="raised">
                        <BtnIcon class="material-icons">arrow_back_ios</BtnIcon>
                        <Label>Back</Label>
                     </Button>
                  {/if}

                  {#if activeTab !== 3}
                     <Button on:click={() => activeTab++} class="text-transform-none" color="secondary" variant="raised">
                        <Label>Next</Label>
                        <BtnIcon class="material-icons">arrow_forward_ios</BtnIcon>
                     </Button>
                  {/if}

                  {#if activeTab === 3}
                     <Button on:click={() => console.log('TODO: 2-16-2021 11:19 AM - hook up start button')} class="text-transform-none" color="secondary" variant="raised">
                        <Label>Start</Label>
                        <BtnIcon class="material-icons">arrow_forward_ios</BtnIcon>
                     </Button>
                  {/if}
               </div>
            </div>
         </Paper>
      </div>
   </div>
</main>

<style lang="scss">
   :global {
      .project-paper {
         padding: 0;
      }
   }
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
   .main {
      border-top: solid 5px #ffcb30;
      width: 100%;
   }
   .tabs {
      background-color: #f5f5f5;
      display: flex;
      padding: 16px 16px 0;
   }
   .form {
      padding: 16px;
      height: calc(100vh - 375px);
      overflow-y: auto;
   }
   .buttons {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
   }
   .spacer {
      margin-top: 4px;
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
