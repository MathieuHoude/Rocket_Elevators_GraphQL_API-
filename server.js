var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var query = require('./mysql.js');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'rocketApp_development'    
});
var { querypg, pgconnection } = require('./pg.js');
const { Connection } = require('pg');
pgconnection();
var PORT = process.env.PORT || 5000;

var schema = buildSchema(`
    scalar DateTime

    input EmployeeInput {
      id: Int
      user_id: Int
      email: String
      first_name: String
      last_name: String
      title: String

    }

    type Query {
        buildings(id: Int!): Building
        interventions(id: Int!): Intervention
        employees(id: Int!): Employee
    }

    type Mutation {
        createEmployee(input: EmployeeInput): Employee
        updateEmployee(input: EmployeeInput): Employee
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
	  building: Building
      building_details: [BuildingDetail]
      start_of_intervention: DateTime
      end_of_intervention: DateTime
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
      building_id: Int
      info_key: String
      value: String
      
  }
`);

class Employee {
  constructor(id,user_id,email, first_name, last_name, title) {
    this.id = id;
    this.user_id = user_id;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.title = title;
  }
}


async function specifyIntervention({id}) {

  var intervention = await querypg('SELECT * FROM "fact_intervention" WHERE id = ' + id)
  var resolve = intervention[0]
  var address = await query('SELECT * FROM addresses JOIN buildings ON buildings.address_id = addresses.id WHERE buildings.id = ' + resolve.building_id);
  resolve['address']= address[0];
  return resolve
};

async function specifyBuilding({id}) {

  var res1 = await query('SELECT * FROM buildings WHERE id = ' + id )
  var resolve = res1[0]
  var interventions = await querypg('SELECT * FROM "fact_intervention" WHERE building_id = ' + id )
  var customer = await query('SELECT * FROM customers WHERE id = ' + resolve.customer_id)

  resolve['customer']= customer[0];
  resolve['interventions']= interventions;

  return resolve
};


async function specifyEmployee({id}) {
	var employees = await query('SELECT * FROM employees WHERE id = ' + id )
	
	
	var interventions = await querypg('SELECT * FROM "fact_intervention" WHERE employee_id = ' + id)

	var building_info = await query("SELECT * FROM buildings JOIN batteries ON batteries.building_id = buildings.id WHERE batteries.employee_id =" + id)

	var building_details = await query("SELECT building_details.building_id, building_details.info_key, building_details.value FROM building_details JOIN buildings ON building_details.building_id = buildings.id JOIN batteries ON batteries.building_id = buildings.id JOIN employees ON batteries.employee_id = employees.id WHERE employees.id =" + id)


	//creating a new object with the informations required
	let interventionsArr = []
	interventions.forEach(intervention => {
		building_detailsArr = []
		//get all of the building_details associated with the building and put it in the object
		building_details.forEach(building => {
			building = JSON.stringify(building)
			building = JSON.parse(building)
			if(building.building_id === intervention.building_id) {
				building_detailsArr.push(building)
			}
		})
		//go trough all of the building and get their infos
		building_info.forEach(building => {
			building = JSON.stringify(building)
			building = JSON.parse(building)
			if(building.id === intervention.building_id) {
				interventionsArr.push({
					...intervention,
					building: building,
					building_details: building_detailsArr
				})
			}
		})
	})

	//returning the whole object
	resolve = {
		...employees[0],
		interventions: interventionsArr
	}
	return resolve
};


var root = {
  createEmployee: ({input}) => {
    connection.query('INSERT INTO employees (id, user_id, first_name, last_name , email ,title) VALUES ('+input.id+', '+input.user_id+', "'+ input.first_name+'", "'+input.last_name+'", "'+input.email+'", "'+input.title+'")');
    return new Employee(id, input);
  },
  updateEmployee: ({id, input}) => {
    if (!connection[id]) {
      throw new Error('no message exists with id ' + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
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
app.listen(PORT);