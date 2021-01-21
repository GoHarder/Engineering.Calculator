<script>
  // Common Components
  import Header from "./comp/common/Header.svelte";
  import Footer from "./comp/common/Footer.svelte";

  // Auth Components
  import Login from "./comp/auth/Login.svelte";

  import Dummy from "./comp/Dummy.svelte";

  // Stores
  import tokenStore from "./stores/token.js";

  // Constants
  const comps = {
    Login,
    Dummy
  };

  // Variables
  let token = null;
  let comp = Login;

  tokenStore.subscribe(store => (token = store));

  $: if (!token) {
    comp = Login;
  } else {
    comp = Dummy;
  }
</script>

<Header />
<svelte:component this={comp} />
<Footer />
