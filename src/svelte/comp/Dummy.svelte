<script>
  // Svelte Imports
  import { createEventDispatcher } from "svelte";

  // Stores
  import tokenStore from "../stores/token.js";

  // Constants
  const dispatch = createEventDispatcher();

  // Events
  const logOut = () => tokenStore.destroy();
</script>

<main>
  <p>This is a dummy page</p>

  <button on:click={logOut}>log out</button>
</main>
