# Muli-Rate Pricing

## Tech Stack

React.js Application with the Tanstack Start, using Drizzle-ORM, Sqlite, Tanstack-Query.

## About the Project:

### Calcultation:

I opted to use the `.toFixed()` method in javacript that use round to nearest (half-up) rounding, but I use the full length of number to calculate subtotal, total tax... and I only round the results and not the input values.

Given that I opted for SQLite my options for safe storage of monetary data is limited so I opted to store data in Integer value.

### Finalization is done through the _/document/$id_ page

### Possible improvements

- I would use the _numeric_ Datatype (that's not available on Sqlite) in the Database, which is less familiar to me but I know it is more appropriate when dealing financial data.
