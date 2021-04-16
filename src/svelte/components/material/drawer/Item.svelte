<script>
   // Properties
   export let activated = false;

   let spanClass = ['mdc-list-item', activated ? 'mdc-list-item--activated' : ''].join(' ').trim();
</script>

<span class={spanClass} on:click>
   <span class="mdc-list-item__ripple" />
   <span class="mdc-list-item__text"><slot /></span>
</span>
