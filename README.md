# ROCKET ELEVATORS GRAPHQL API

## Week 8
We were given a list of questions which we were to answer using queries in GraphQL API. We used Node and Express to implement the API and it makes queries using both a Postgres and MySQL table. We also implemented the ability to create, update and query multiple fields from the mySQL table via GraphQL.

## Our Team
  - Olivier Godbout - Team Leader
  - Samuel Chabot  - Collaborator 
  - Colin Larke - Collaborator 
  - James Allan Jean-Jacques - Collaborator

 ## INSTRUCTIONS TO FOLLOW
 
 ## 1 - Click link to get open Postman and access the collections needed for the queries
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3f98d5e6a531e3025b47)


## 2 - On the left panel click Collections and Open the Folder W8-OlivierGodbout
The sub-folder GraphQL-BaseRequirements contains the queries you'll want to run, open it up and select one. After selecting a query you can click on the upper body tab to open  and view the query.
 You can change the parameter number next to id to change your query.
 `"type-of-query"(id:<CHANGE ME!>) {`
 ![View of Postman](https://i.imgur.com/M546XR8.png)
 
## 3 - When your parameter is set click the blue send button to run the query. You can view the results by clicking the lower Body tab in the response panel.
![View of Postman](https://i.imgur.com/Y3zz9kZ.png)

## You can also take queries from Postman and run them directly in the GraphQL interface of our Heroku deployment
*https://rocket-elevators-graphql.herokuapp.com/graphql* \
Simply copy the body from the query in Postman and paste it into the left panel of the GraphQL interface then click the play button to do the query.
![View of GraphQL on Heroku](https://i.imgur.com/YELRXGl.png)

## BONUS - We also implemented Create, Get, and Update functions for the addresses, buildings, elevators, columns and batteries fields of the MySQL database. 
To access them open the respective folder of the query you'd like to run, GraphQL Get, Update or Create.\

For Create queries click on the body tab and fill out each of the fields with the appropriate type. **It is important to not leave any fields blank!**

For Update queries you may change any of the parameters you wish, as long as they are of the same type.




