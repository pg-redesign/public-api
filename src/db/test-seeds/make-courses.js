console.log(process.env.NODE_ENV);
exports.seed = knex => knex("courses")
  .del()
  .then(() => knex("courses").insert(
    JSON.parse(
      JSON.stringify([
        {
          name: "pollution",
          price: 1695,
          start_date: new Date("October 24, 2020"),
          end_date: new Date("October 31, 2020"),
          location: {
            city: "Salem",
            state: "MA",
            country: "USA",
            map_url: "https://maps.google.com",
          },
        },
        {
          name: "remediation",
          price: 300,
          start_date: new Date("October 24, 1974"),
          end_date: new Date("October 31, 1974"),
          location: {
            city: "Princeton",
            state: "NJ",
            country: "USA",
            map_url: "https://maps.google.com",
          },
        },
      ]),
    ),
  ));
