const { createTestClient } = require("apollo-server-testing");

const testUtils = require("../../../test-utils");
const { connection } = require("../../../db/connection");

const { runTests } = testUtils.testRunner;
const { testServer, baseContext } = testUtils.testServer;
const { buildToken, buildAuthedRequestContext } = testUtils.builders;

const client = createTestClient(testServer);
testServer.mergeContext({ logger: { error: () => {} } }); // suppress log messages

describe("@admin directive resolver", () => {
  afterAll(() => connection.destroy());

  const invalidAuthTests = baseTestConfig => [
    {
      ...baseTestConfig,
      test: "missing Authorization header: throws AuthenticationError",
      expectedErrors: true,
      testContext: { req: { headers: {} } },
    },
    {
      ...baseTestConfig,
      test: "invalid token: throws AuthenticationError",
      expectedErrors: true,
      testContext: {
        req: { headers: { Authorization: "Bearer nonsense-token" } },
      },
    },
    {
      ...baseTestConfig,
      test: "invalid admin sub ID: throws AuthenticationError",
      expectedErrors: true,
      testContext: {
        req: {
          headers: {
            Authorization: `Bearer ${buildToken("nonsense-sub", baseContext)}`,
          },
        },
      },
    },
  ];

  const objectTypeFieldTests = () => {
    const variables = { emails: ["student@email.com"] };
    // @admin on Query.getStudents should apply to field
    const query = `
      query GetStudentData($emails: [EmailAddress!]!) {
        getStudents(emails: $emails) {
          id
        }
      }
    `;

    const baseTestConfig = {
      query,
      client,
      variables,
      testServer,
    };

    return [
      {
        ...baseTestConfig,
        test: "valid Bearer token and admin sub ID: resolves Students",
        expectedData: { getStudents: [] },
        testContext: buildAuthedRequestContext(baseContext),
      },
      ...invalidAuthTests(baseTestConfig),
    ];
  };

  const objectTypeTests = () => {
    // @admin on Payment Type should apply to Course.payments
    const query = `
        query GetUpcomingCourseStudents {
          getCourses {
            payments {
              id
            }
          }
        }
      `;

    const baseTestConfig = {
      query,
      client,
      testServer,
      variables: {},
    };

    return [
      {
        ...baseTestConfig,
        test:
          "valid Bearer token and admin sub ID: resolves Course.payments list",
        expectedData: { getCourses: [{ payments: [] }] },
        testContext: buildAuthedRequestContext(baseContext),
      },
      ...invalidAuthTests(baseTestConfig),
    ];
  };

  describe("@admin applied to an Object Type Field: Query.getStudent", () => runTests(objectTypeFieldTests()));
  describe("@admin applied to an Object Type: Payment (accessed by Course.payments)", () => runTests(objectTypeTests()));
});
