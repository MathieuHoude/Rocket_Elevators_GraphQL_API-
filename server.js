var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var query = require('./mysql.js');
var { querypg, pgconnection } = require('./pg.js');
pgconnection();
var PORT = process.env.PORT || 5000;

var schema = buildSchema(`
    scalar DateTime
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



async function specifyIntervention({id}) {

  intervention = await querypg('SELECT * FROM "fact_intervention" WHERE id = ' + id)
  resolve = intervention[0]
  address = await query('SELECT a.id, a.latitude, a.longitude, a.type_of_address, a.status, a.entity, a.number_and_street, a.suite_or_apartment, a.city, a.state, a.postal_code, a.country, a.notes, a.created_at, a.updated_at FROM addresses a JOIN buildings ON buildings.address_id = a.id WHERE buildings.id = ' + resolve.building_id);
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
	
	
	var interventions = await querypg('SELECT * FROM "fact_intervention" WHERE employee_id = ' + id)
	var building_info = await query("SELECT b.id, b.admin_full_name, b.admin_phone, b.admin_email, b.full_name_STA, b.phone_TA, b.email_TA, b.address_id, b.customer_id, b.created_at, b.updated_at FROM buildings b JOIN batteries ON batteries.building_id = b.id WHERE batteries.employee_id =" + id)



	console.log(building_info)
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