<script>
  // Components
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";

  import Button from "./comp/base/Button.svelte";
</script>

<Header />

<Button color="primary" endIcon="login" size="large" variant="contained">
  Login
</Button>

<Footer />
