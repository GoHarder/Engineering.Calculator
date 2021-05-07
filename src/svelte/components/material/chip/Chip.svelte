<script>
   // Parameters
   export { className as class };
   export let title = '';

   // Variables
   let className = '';
   let divClass = ['mdc-chip', className].join(' ');
</script>

<div class={divClass} role="row" {title}>
   <div class="mdc-chip__ripple" />
   <span role="gridcell">
      <span role="button" tabindex="0" class="mdc-chip__primary-action">
         <span class="mdc-chip__text"><slot /></span>
      </span>
   </span>
</div>

<style lang="scss" global>
   @use "@material/chips/mdc-chips";
</style>
