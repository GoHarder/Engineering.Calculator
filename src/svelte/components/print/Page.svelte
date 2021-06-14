<script>
   // Components
   // Stores
   // Properties
   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Reactive Rules
   // Events
   // Lifecycle
</script>

<div class="page"><slot /></div>

<style lang="scss">
   @use './src/scss/vantage-theme';

   .page {
      @include vantage-theme.vantage-paper;
      position: relative;
      width: 8.5in;
      height: 11in;
      padding: 1em;
      margin: 1em auto;
      page-break-after: always;
      font-family: Arial, Helvetica, sans-serif;

      * {
         all: initial;
      }
   }

   @media print {
      .page {
         margin: 0;
         padding: 0;
         box-shadow: none;
      }
   }
</style>
