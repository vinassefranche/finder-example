# Finder example

The purpose of this is to demonstrate how the finder concept can improve the performance of fetching data

## How to use
### setup
- run `yarn`
- run `docker-compose up -d` to start the database container
- run `yarn create-tables` to create the tables in the database
- run `yarn insert-data` to insert some data in the tables

#### run the different ways of fetching the data
- `yarn get-all-with-repositories`: uses the aggregates repositories one by one to fetch everything
- `yarn get-all-with-full-finder`: uses a finder that retrieves all the data from the database in one call but still deserializes the full aggregates
- `yarn get-all-with-simple-finder`: use a finder that retrieves all the data from the database in one call and only retrieves that necessary data to build the output

All of them will log a message like `Time to retrieve all houses data: XXX.XXXms`. You can compare the performance of each way by comparing these milliseconds

## Results
Here's the results of my run on my machine (the absolute values don't mean anything. It's only interesting to look at the relative improvements)
- `yarn get-all-with-repositories`: ~1.4s
- `yarn get-all-with-full-finder`: ~1.7s
- `yarn get-all-with-simple-finder`: ~25ms

We can see that using a finder that deserializes everything is not really better than fetching all the aggregates with their repositories. There might be an improvement with a database that is distant from the server running as these numbers are with a database and the scripts running in the same local machine. However, it's unlikely to be a huge improvement.
Fetching only the necessary data is much better. The numbers are this different because I deliberately built my aggregates with a lot of data that is useless in the get all example but it shows that it can be a good solution to some data fetching performance issues.