<script>
   export let button = false;
   export let leading = false;
   export let tabindex = 0;
   export let title = '';
   export let trailing = false;
</script>

<i
   on:click
   class="material-icons mdc-text-field__icon"
   class:mdc-text-field__icon--leading={leading}
   class:mdc-text-field__icon--trailing={trailing}
   {tabindex}
   {title}
   role={button ? 'button' : ''}
>
   <slot />
</i>
