<script>
   // Components
   import { Chip } from '../../material/chip';

   // Properties
   export let label = 'title';
   export let index = 0;
   export let activeTab = 0;

   // Variables
   let chip = 'project-tab-chip-1';

   // Reactive Variables
   $: active = activeTab === index;

   // Reactive Rules
   $: if (index === activeTab) {
      chip = 'project-tab-chip-1';
   } else if (activeTab > index) {
      chip = 'project-tab-chip-2';
   } else {
      chip = 'project-tab-chip-3';
   }
</script>

<div class="base">
   <button on:click>
      <Chip class={chip}>{index}</Chip>
      <span class={`${active ? 'active' : 'inactive'}`}>{label}</span>
   </button>
   <div class={`separator ${active ? 'active' : 'inactive'}`} />
</div>

<style lang="scss">
   :global {
      .project-tab-chip {
         &-1 {
            background-color: rgba($color: #000000, $alpha: 0.87);
            color: #ffffff;
         }
         &-2 {
            background-color: #4d4d4d;
            color: #ffcb30;
         }
         &-3 {
            background-color: #ffcb30;
            color: rgba($color: #000000, $alpha: 0.87);
         }
      }
   }
   .base {
      flex-grow: 1;
   }
   button {
      padding: 16px;
      border: none;
      width: 100%;
      cursor: pointer;
      background-color: transparent;
      &:focus {
         outline: none;
      }
   }
   span {
      display: block;
      margin: 16px 0 0 0;

      font: {
         weight: 600;
         size: 18px;
      }
      line-height: 1.43;
      &.active {
         color: rgba($color: #000000, $alpha: 0.87);
      }
      &.inactive {
         color: #4d4d4d;
      }
   }
   .separator {
      height: 5px;
      width: 100%;
      background-color: #4d4d4d;
      &.active {
         background-color: #4d4d4d;
      }
      &.inactive {
         background-color: transparent;
      }
   }
</style>
