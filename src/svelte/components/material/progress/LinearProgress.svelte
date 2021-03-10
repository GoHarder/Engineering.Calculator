<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCLinearProgress } from '@material/linear-progress';

   // Parameteres
   export let indeterminate = false;

   // Variables
   let bind;
   let LinearProgress;

   // Reactive Variables
   $: divClass = ['mdc-linear-progress', indeterminate ? 'mdc-linear-progress--indeterminate' : ''].join(' ');

   // Lifecycle
   onMount(() => {
      LinearProgress = new MDCLinearProgress(bind);
   });

   onDestroy(() => {
      LinearProgress.destroy();
   });
</script>

<div bind:this={bind} role="progressbar" class={divClass} aria-label="Example Progress Bar" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0">
   <div class="mdc-linear-progress__buffer">
      <div class="mdc-linear-progress__buffer-bar" />
      <div class="mdc-linear-progress__buffer-dots" />
   </div>
   <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
      <span class="mdc-linear-progress__bar-inner" />
   </div>
   <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
      <span class="mdc-linear-progress__bar-inner" />
   </div>
</div>

<style lang="scss" global>
   @use "@material/theme" with (
      $primary: #ffcb30,
      $secondary: #4d4d4d,
   );
   @use "@material/linear-progress";
   @include linear-progress.core-styles;
</style>
