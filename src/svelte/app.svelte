<script>
  // Common Components
  import Header from "./comp/common/Header.svelte";
  import Footer from "./comp/common/Footer.svelte";

  // Auth Components
  import Login from "./comp/auth/Login.svelte";

  // Constants
  const comps = {
    Login
  };

  // Variables
  let comp = Login;
</script>

<Header />
<svelte:component this={comp} />
<Footer />
