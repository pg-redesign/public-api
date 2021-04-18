# dev workflow

## adding forms

> **!! all forms must have a corresponding graphql input type and validation schema !!**

use the input type to structure the inputs before formalizing it with its validating schema

Steps to add new form schema:

1. define the graphql input type in `api/type-defs/inputs.graphql`
2. add validation schema in `schemas/forms/{formName}.js`

   - reuse other schemas whenever possible by spreading
   - override entries with customizations for this particular form

3. add entry to `schemas/enums.js` (`FormTypes`)

   - format: `formName: "FORM_NAME"`

4. in `schemas/forms/index.js`import the form schema and add the entry

- format: `[enums.FormTypes.formName]: formName,`

5. copy the graphql format (capitalized) to `api/type-defs/enums.graphql`

<!-- TODO: add `getFormSchema` tests to ensure all found -->
