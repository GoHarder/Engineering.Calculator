<style lang="scss">
  header {
    align-items: center;
    background-color: #333333;
    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
      0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
    color: #ffffff;
    display: flex;
    font-size: 20px;
    height: 60px;
    justify-content: space-between;
    left: 0;
    padding: 10px;
    position: relative;
    top: 0;
    z-index: 3;
  }

  .box {
    margin-left: 210px;
  }

  .logo {
    align-items: center;
    background: #ffffff;
    display: flex;
    height: 100%;
    left: 0px;
    margin: 0;
    padding: 20px;
    position: absolute;
    top: 0px;

    & > * {
      z-index: 1;
    }

    &:after {
      background: #ffffff;
      content: "";
      height: 100%;
      position: absolute;
      right: -35px;
      top: 0;
      transform: skewX(-27deg);
      width: 50px;
      z-index: 0;
    }
  }

  img {
    width: 120px;
    border: none;
    display: block;
    max-width: 100%;
  }

  p {
    font-size: 18px;
  }
</style>

<header>
  <div class="box">
    <div class="logo">
      <img src="public/img/vantage-logo.png" alt="Vantage Logo" />
    </div>
    <p>Hollister-Whitney Engineering Calculations</p>
  </div>
</header>
