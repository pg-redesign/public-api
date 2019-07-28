const runTest = async (config) => {
  const {
    client,
    testServer,

    query,
    mutation,
    variables,
    testContext,
    expectedData,
    expectedErrors,
  } = config;

  if (testContext) {
    testServer.mergeContext(testContext);
  }

  const res = query
    ? await client.query({ query, variables })
    : await client.mutate({ mutation, variables });

  if (expectedData) {
    expect(res.data).toEqual(expectedData);
  }

  if (expectedErrors === true) {
    expect(res.errors).toBeDefined();
  } else if (expectedErrors === false || expectedErrors === undefined) {
    expect(res.errors).toBeUndefined();
  } else {
    expect(res.errors).toEqual(expectedErrors);
  }
};

const runTests = (tests) => {
  tests.forEach(testConfig => test(testConfig.test, () => runTest(testConfig)));
};

module.exports = {
  runTest,
  runTests,
};
