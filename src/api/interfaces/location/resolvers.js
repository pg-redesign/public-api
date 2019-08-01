const baseResolvers = {
  concatenated: (location) => {
    const { city, state, country } = location;
    return `${city}, ${state}, ${country}`;
  },
};

module.exports = {
  Location: {
    /*
     * to disable the need for a __resolveType
     * - you can pass resolverValidationOptions.requireResolversForResolveType = false
     * - ONLY works if you define the return type of the field as being the specific implementing Type
     *
     * ex: Course.location: Location (interface type, generic)
     * - requires a __resolveType resolver because its a generic interface type
     * Course.location: CourseLocation (implementing type, specific)
     * - does not because it specifies the implementing type already
     */
    __resolveType: (location) => {
      // use a unique field on the implementing Type to determine which to resolve
      if (location.mapUrl) return "CourseLocation";
      return "StudentLocation";
    },
  },

  StudentLocation: {
    // since this is a base implementing type (does not add any fields over the interface)
    // no inline spreading is necessary to access all its fields
    ...baseResolvers,
  },

  CourseLocation: {
    ...baseResolvers,
    // access using inline spread
    // ...on CourseLocation { courses }
    courses: (location, args) => {
      const { courseFilters = {} } = args;
      return location.getCourses(courseFilters);
    },
  },
};
