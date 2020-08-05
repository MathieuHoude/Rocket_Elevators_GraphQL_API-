var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var query = require('./mysql.js');
var { querypg, pgconnection } = require('./pg.js');
pgconnection();


var schema = buildSchema(`
    type Query {
        buildings(id: Int!): Building
        interventions(id: Int!): Intervention
        employees(id: Int!): Employee
    }

    type Building {
      id: Int!
      admin_full_name: String
      admin_phone: String
      admin_email: String
      full_name_STA: String
      phone_TA: String
      email_TA: String
      address_id: Int
      customer: Customer
      address: Address
      building_details: [BuildingDetail]
      interventions: [Intervention]
  }

    type Intervention {
      id: Int!
      building_id: Int!
      building_details: [BuildingDetail]
      start_of_intervention: String
      end_of_intervention: String
      employee_id: Int!
      status: String
      report: String
      result: String
      address: Address
  }
    
    type Address {
        number_and_street: String
        city: String
        state: String
        country: String
    }

    type Customer {
        id: Int!
        company_name: String
        full_name_company_contact: String
        company_contact_phone: String
        company_contact_email: String
    }

    type Employee {
      id: Int!
      email: String
      first_name: String
      last_name: String
      title: String
      interventions: [Intervention]
      building: [Building]
      buildingDetail: [BuildingDetail]
  }

    type BuildingDetail {
      building_id: Int!
      info_key: String
      value: String
      
  }
`);


//
async function specifyIntervention({id}) {

  intervention = await querypg('SELECT * FROM "fact_intervention" WHERE id = ' + id)
  resolve = intervention[0]
  address = await query('SELECT * FROM addresses JOIN buildings ON buildings.address_id = addresses.id WHERE buildings.id = ' + resolve.building_id);
  resolve['address']= address[0];
  return resolve
};

async function specifyBuilding({id}) {

  res1 = await query('SELECT * FROM buildings WHERE id = ' + id )
  resolve = res1[0]
  interventions = await querypg('SELECT * FROM "fact_intervention" WHERE building_id = ' + id )
  customer = await query('SELECT * FROM customers WHERE id = ' + resolve.customer_id)

  resolve['customer']= customer[0];
  resolve['interventions']= interventions;

  return resolve
};


async function specifyEmployee({id}) {
  var employees = await query('SELECT * FROM employees WHERE id = ' + id )
  resolve = employees[0]
  
  interventions = await querypg('SELECT * FROM "fact_intervention" WHERE employee_id = ' + id)
  console.log(interventions)
  result = interventions[0]

  building_details = await query('SELECT * FROM building_details WHERE building_id = ' + result.building_id)
  console.log(building_details)

  resolve['interventions']= interventions;
  resolve['building_details']= building_details;
  return resolve
  
};


var root = {
  buildings: specifyBuilding,
  interventions: specifyIntervention,
  employees: specifyEmployee,
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);