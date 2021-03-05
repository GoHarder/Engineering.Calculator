<script>
   // Properties
   export let level = 1;
</script>

<p class={`level-${level}`}><slot /></p>

<style lang="scss">
   p {
      font-size: larger;
      font-weight: 600;
      padding: 0 0 1px;
      margin: 0;
   }

   .level {
      &-1 {
         border-bottom: 2px solid #ffcb30;
      }
      &-2 {
         font-weight: normal;
         border-bottom: 2px solid rgba($color: #000000, $alpha: 0.5);
      }
   }
</style>
