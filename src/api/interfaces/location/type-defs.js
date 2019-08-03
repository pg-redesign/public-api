// define the base fields for a single source of truth
const baseFields = `
  """
  For Course Type: GoogleMaps URL of hotel / conference center
  """
  city: String!
  state: String!
  country: String!

  """
  Formatted as "city, state, country"
  """
  concatenated: String!
`;

// define the interface
const Location = `
  interface Location {
    ${baseFields}
  }
`;

// define the implementing type
// this is a "base implementing type" because it adds no additional fields
const StudentLocation = `
  type StudentLocation implements Location {
    ${baseFields}
  }
`;

// this one adds two additional fields
// the resolver for this type is like any other
// resolvers.CourseLocation: { courses: (...args) => {} }
const CourseLocation = `
  type CourseLocation implements Location {
    ${baseFields}
    id: ID!
    mapUrl: URL!
    courses: [Course!]!
  }
`;

module.exports = `
# Location interface
  ${Location}

# implementing Types
  ${CourseLocation}

  ${StudentLocation}
`;
