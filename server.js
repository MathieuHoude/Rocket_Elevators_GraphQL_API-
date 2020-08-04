var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    type Query {
        interventions(building_id: Int!): Intervention
        buildings(id: Int!): Building
        employees(id: Int!): Employee
    }

    type Elevator {
        elevator_serial_number: String
        elevator_model: String
        building_type: String
        elevator_status: String
        elevator_commissioning_date: String
        elevator_last_inspection_date: String
        elevator_inspection_certificate: String
        elevator_information: String
        elevator_notes: String
        created_at: String
        updated_at: String
        column_id: Int
    }

    type Intervention {
        building_id: Int!
        building_details: [Building_detail]
        start_date_time_intervention: String
        end_date_time_intervention: String
        employee_id: Int!
        address: Address
    }

    type Building {
        id: Int!
        building_administrator_full_name: String
        address: Address
        customer: Customer
        building_details: [Building_detail]
        interventions: [Intervention]
    }
    
    type Address {
        street_number: String
        street_name: String
        suite_or_apartment: String
        city: String
        postal_code: String
        country: String
    }

    type Customer {
        company_name: String
        company_contact_full_name: String
    }

    type Employee {
        id: Int!
        firstname: String
        lastname: String
        building_details: [Building_detail]
        interventions: [Intervention]
    }

    type Building_detail {
        building_id: Int!
        information_key: String
        value: String
    }
`);


//
async function getInterventions({building_id}) {
  // get intervention
  var intervention = await querypg('SELECT * FROM "fact_intervention" WHERE building_id = ' + building_id)
  resolve = intervention[0]
  // get address
  address = await query('SELECT * FROM addresses WHERE entity_type = "Building" AND entity_id = ' + building_id)

  resolve['address']= address[0];

  return resolve
};

async function getBuildings({id}) {
  // get building
  var buildings = await query('SELECT * FROM buildings WHERE id = ' + id )
  resolve = buildings[0]

  // get interventions
  interventions = await querypg('SELECT * FROM "fact_intervention" WHERE building_id = ' + id)

  // get customer
  customer = await query('SELECT * FROM customers WHERE id = ' + resolve.customer_id)

  resolve['customer']= customer[0];
  resolve['interventions']= interventions;

  return resolve
};


async function getEmployees({id}) {
  // get employee
  var employees = await query('SELECT * FROM employees WHERE id = ' + id )
  resolve = employees[0]
  
  // get interventions
  interventions = await querypg('SELECT * FROM "fact_intervention" WHERE employee_id = ' + id)
  result = interventions[0]
  console.log(interventions)


  // get building details
  building_details = await query('SELECT * FROM building_details WHERE building_id = ' + result.building_id)
  console.log(building_details)

  resolve['interventions']= interventions;
  resolve['building_details']= building_details;

  return resolve
};


function query (queryString) {
  return new Promise((resolve, reject) => {
      con.query(queryString, function(err, result) {
          if (err) {
              return reject(err);
          } 
          return resolve(result)
      })
  })
};

// define what is querypg
function querypg (queryString) {
  return new Promise((resolve, reject) => {
      client.query(queryString, function(err, result) {
          if (err) {
              return reject(err);
          }
          return resolve(result.rows)
      })
  })
};
var root = {
  // Récupération de l’adresse de l’immeuble
  interventions: getInterventions,
  // Récupération de l’information du client
  buildings: getBuildings,
  // Récupération de toutes les interventions effectuées par un employé
  employees: getEmployees,
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');