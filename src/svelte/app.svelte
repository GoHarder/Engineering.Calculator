<script>
  // Common Components
  import Header from "./comp/common/Header.svelte";
  import Footer from "./comp/common/Footer.svelte";

  // Auth Components
  import Login from "./comp/auth/Login.svelte";
  import Home from "./comp/home/Home.svelte";

  import Dummy from "./comp/Dummy.svelte";

  // Stores
  import tokenStore from "./stores/token.js";

  // Constants
  const comps = {
    Login,
    Dummy,
    Home
  };

  // Variables
  let token = null;
  let comp = Login;
  let user = undefined;

  // Subscriptions
  tokenStore.subscribe(store => (token = store));

  // Reactive rules
  $: if (!token) {
    comp = Login;
    user = undefined;
  } else {
    getUser();
  }

  // Methods
  const getUser = async () => {
    // request the user data
    const res = await fetch("/api/users", {
      headers: { Authorization: token }
    });

    // Check the response and do actions
    if (res.ok) {
      // Set the user data
      user = await res.json();

      // Open the home menu
      comp = Home;
    } else {
      // Destory the token
      tokenStore.desroy();
    }
  };
</script>

<Header {user} />
<svelte:component this={comp} />
<Footer />
