<script>
   // Properties
   export { className as class };

   // Variables
   let className = '';

   // Reactive Variables
   $: navClass = ['mdc-list', className].join(' ').trim();
</script>

<nav class={navClass}><slot /></nav>
