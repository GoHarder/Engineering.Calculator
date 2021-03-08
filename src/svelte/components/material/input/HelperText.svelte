<script>
   export let persistent = false;
   export let validation = false;
</script>

<div class="mdc-text-field-helper-line" style="padding: 0 8px;">
   <div class="mdc-text-field-helper-text" class:mdc-text-field-helper-text--persistent={persistent} class:mdc-text-field-helper-text--validation-msg={validation}>
      <slot />
   </div>
</div>

<style lang="scss" global>
   .mdc-text-field-helper-line {
      padding: 0 8px; // 0 16px
   }
</style>
