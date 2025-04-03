const request = require("supertest");

const app = require("../../app");

describe("Test Get /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
    // expect(response.statusCode).toBe(200);
  });
});

describe("Test POST /launch", () => {
  const launchData = {
    mission: "USS enterPol",
    rocket: "Nciu IUH 19",
    target: "Kepler ",
    launchDate: "Jan 4,2028",
  };
  const launchDataWithoutDate = {
    mission: "USS enterPol",
    rocket: "Nciu IUH 19",
    target: "Kepler ",
  };
  const dataWithInvalidDate = {
    mission: "USS enterPol",
    rocket: "Nciu IUH 19",
    target: "Kepler ",
    launchDate: "notDate",
  };

  // POST request -> ✅ date is right
  test("It should respond with 201 success", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(launchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(responseDate).toBe(requestDate);
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  // Post request -> ✅ all required properties are there
  test("It should catch missing Required Properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    // json Object response == response.body
    expect(response.body).toStrictEqual({
      error: "Missing require Input in Launch",
    });
  });

  // testing with invalid date
  test("It should catch invalid Dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(dataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid Launch Date",
    });
  });
});
