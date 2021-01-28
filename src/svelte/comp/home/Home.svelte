<script>
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";

  const workbooks = [
    {
      contract: "435180",
      job: "VMAC Tuskegee, Bldg. 120",
      customer: "Diversified Elevator Service",
      layout: "L-8293",
      created: "12-Oct-2020",
      opened: "25-Jan-2021",
      user: "Gregory Harder",
      car: "P1"
    },
    {
      contract: "423741",
      job: "Exchange Place Station",
      customer: "Mid-American Elevator",
      layout: "L-8143",
      created: "13-Oct-2020",
      opened: "15-Oct-2020",
      user: "Gregory Harder",
      car: "55"
    },
    {
      contract: "420993",
      job: "James A. Haley VAMC Tampa Bed Tower",
      customer: "Skyline Elevator",
      layout: "L-8110-2",
      created: "13-Oct-2020",
      opened: "15-Oct-2020",
      user: "Gregory Harder",
      car: "42"
    },
    {
      contract: "418833",
      job: "33-02 Skillman Avenue",
      customer: "Liberty Elevator",
      layout: "L-8069",
      created: "12-Oct-2020",
      opened: "15-Oct-2020",
      user: "Gregory Harder",
      car: "A2"
    },
    {
      contract: "419777",
      job: "Space X Cape Canaveral",
      customer: "Otis Elevator",
      layout: "L-8089",
      created: "12-Oct-2020",
      opened: "15-Oct-2020",
      user: "Gregory Harder",
      car: "1"
    },
    {
      contract: "452140",
      job: "Purdue Gateway",
      customer: "American Elevator",
      layout: "L-8527-1",
      created: "12-Oct-2020",
      opened: "15-Oct-2020",
      user: "Gregory Harder",
      car: "3"
    },
    {
      contract: "451668",
      job: "111 Canal Street",
      customer: "Anderson Elevator Company",
      layout: "L-8522",
      created: "12-Oct-2020",
      opened: "15-Oct-2020",
      user: "Gregory Harder",
      car: "S2"
    },
    {
      contract: "446104",
      job: "West Virginia Building 5 Freight",
      customer: "West Virginia Elevator",
      layout: "L-8452",
      created: "12-Oct-2020",
      opened: "15-Oct-2020",
      user: "Gregory Harder",
      car: "6"
    },
    {
      contract: "451008A",
      job: "WRNMMD P114 Med. Ctr.",
      customer: "Delaware Elevator",
      layout: "L-8517-6",
      created: "12-Oct-2020",
      opened: "15-Oct-2020",
      user: "Gregory Harder",
      car: "H1 H2"
    },
    {
      contract: "420520",
      job: "WCK2-A",
      customer: "Lift Solutions",
      layout: "L-8098",
      created: "12-Oct-2020",
      opened: "15-Oct-2020",
      user: "Gregory Harder",
      car: "FE-1"
    },
    {
      contract: "418879",
      job: "JW Marriot Tampa West Lot",
      customer: "Lift Solutions",
      layout: "L-8071",
      created: "12-Oct-2020",
      opened: "15-Oct-2020",
      user: "Gregory Harder",
      car: "BSE-3"
    },
    {
      contract: "445562",
      job: "Emory HSRB II",
      customer: "Premier Elevator",
      layout: "L-8441-3",
      created: "12-Oct-2020",
      opened: "15-Oct-2020",
      user: "Gregory Harder",
      car: "4"
    }
  ];
</script>

<main>
  <DataTable>
    <Head>
      <Row>
        <Cell title="name">Contract Number</Cell>
        <Cell>Job Name</Cell>
        <Cell>Customer</Cell>
        <Cell>Laout Number</Cell>
      </Row>
    </Head>
    <Body>
      {#each workbooks as { contract, job, customer, layout, created, opened, user, car }}
        <Row>
          <Cell>{contract}</Cell>
          <Cell>{job}</Cell>
          <Cell>{customer}</Cell>
          <Cell>{layout}</Cell>
          <Cell>{created}</Cell>
          <Cell>{opened}</Cell>
          <Cell>{user}</Cell>
          <Cell>{car}</Cell>
        </Row>
      {/each}
    </Body>
  </DataTable>
</main>
