var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema, specifiedScalarTypes } = require('graphql');
var query = require('./mysql.js');
var mysql = require('mysql');



var connection = mysql.createConnection({
  host: 'codeboxx.cq6zrczewpu2.us-east-1.rds.amazonaws.com',
  user: 'codeboxx',
  password: 'Codeboxx1!',
  database: 'OlivierGodbout'    
});
var { querypg, pgconnection } = require('./pg.js');
const { Connection } = require('pg');
pgconnection();
var PORT = process.env.PORT || 5000;

var schema = buildSchema(`
	scalar DateTime
	scalar BigInt
	scalar Double

    input ElevatorInput {
		id: Int
		serial_number: BigInt
		model: String
		elevator_type: String
		status: String
		commission_date: DateTime
		date_of_last_inspection: DateTime
		certificate_of_inspection: String
		informations: String
		notes: String
		column_id: Int
		created_at: DateTime
		updated_at: DateTime
	}
	
	input ColumnInput {
		id: Int
		column_type: String
		number_of_floors: Int
		status: String
		informations: String
		notes: String
		battery_id: Int
		created_at: DateTime
		updated_at: DateTime
	}

	input BatteryInput {
		id: Int
		battery_type: String
		status: String
		commission_date: DateTime
		date_of_last_inspect: DateTime
		certificate_of_operations: String
		informations: String
		notes: String
		building_id: Int
		employee_id: Int
		created_at: DateTime
		updated_at: DateTime
	}

	input BuildingInput {
		id: Int
		admin_full_name: String
		admin_phone: String
		admin_email: String
		full_name_STA: String
		phone_TA: String
		email_TA: String
		address_id: Int
		customer_id: Int
		created_at: DateTime
		updated_at: DateTime
	}

	input AddressInput {
		id: Int
		latitude: Double
		longitude: Double
		type_of_address: String
		status: String
		entity: String
		number_and_street: String
		suite_or_apartment: String
		city: String
		state: String
		postal_code: String
		country: String
		notes: String
		created_at: DateTime
		updated_at: DateTime
	}

    type Query {
        buildings(id: Int!): Building
        interventions(id: Int!): Intervention
        employees(id: Int!): Employee
		elevators(id: Int!): Elevator
		columns(id: Int!): Column
		batteries(id: Int!): Battery
		inactiveelevators: [Elevator]
		interventionBuildings: [Building]
		leads: [Lead]
		singlebuilding(id: Int!): Building
		address(id: Int!): Address
    }

    type Mutation {
        createElevator(input: ElevatorInput): Elevator
		updateElevator(input: ElevatorInput): Elevator
		createColumn(input: ColumnInput): Column
		updateColumn(input: ColumnInput): Column
		createBattery(input: BatteryInput): Battery
		updateBattery(input: BatteryInput): Battery
		createBuilding(input: BuildingInput): Building
		updateBuilding(input: BuildingInput): Building
		createAddress(input: AddressInput): Address
		updateAddress(input: AddressInput): Address
	}

	type Lead {
		id: Int
		Full_Name: String
		Compagny_Name: String
		Email: String
		Phone: String
		Project_Name: String
		Project_Description: String
		Department: String
		Message: String
		File_name: String
		created_at: DateTime
		updated_at: DateTime
	}

	type Battery {
		id: Int
		battery_type: String
		status: String
		commission_date: DateTime
		date_of_last_inspect: DateTime
		certificate_of_operations: String
		informations: String
		notes: String
		building_id: Int
		employee_id: Int
		created_at: DateTime
		updated_at: DateTime
	}
	
	type Column {
		id: Int
		column_type: String
		number_of_floors: Int
		status: String
		informations: String
		notes: String
		battery_id: Int
		created_at: DateTime
		updated_at: DateTime
	}

    type Elevator {
      id: Int
      serial_number: BigInt
      model: String
      elevator_type: String
      status: String
      commission_date: DateTime
      date_of_last_inspection: DateTime
      certificate_of_inspection: String
      informations: String
      notes: String
      column_id: Int
      created_at: DateTime
      updated_at: DateTime
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
	  customer_id: Int
	  created_at: DateTime
	  updated_at: DateTime
  }

    type Intervention {
      id: Int
	  building_id: Int
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
        id: Int
		latitude: Double
		longitude: Double
		type_of_address: String
		status: String
		entity: String
		number_and_street: String
		suite_or_apartment: String
		city: String
		state: String
		postal_code: String
		country: String
		notes: String
		created_at: DateTime
		updated_at: DateTime
    }

    type Customer {
        id: Int!
        company_name: String
        full_name_company_contact: String
        company_contact_phone: String
        company_contact_email: String
    }

    type Employee {
      id: Int
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






//--------------------all get query---------------------------
async function specifyIntervention({id}) {
  var intervention = await querypg('SELECT * FROM "fact_intervention" WHERE id = ' + id)
  var resolve = intervention[0]
  var address = await query('SELECT a.id, a.latitude, a.longitude, a.type_of_address, a.status, a.entity, a.number_and_street, a.suite_or_apartment, a.city, a.state, a.postal_code, a.country, a.notes, a.created_at, a.updated_at FROM addresses a JOIN buildings ON buildings.address_id = a.id WHERE buildings.id = ' + resolve.building_id);
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
	var building_info = await query("SELECT b.id, b.admin_full_name, b.admin_phone, b.admin_email, b.full_name_STA, b.phone_TA, b.email_TA, b.address_id, b.customer_id, b.created_at, b.updated_at FROM buildings b JOIN batteries ON batteries.building_id = b.id WHERE batteries.employee_id =" + id)
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

async function specifyElevator({id}) {
	var intervention = await query('SELECT * FROM elevators WHERE id = ' + id)
	return resolve = intervention[0]
}

async function specifyColumn({id}) {
	var intervention = await query('SELECT * FROM columns WHERE id = ' + id)
	return resolve = intervention[0]
}

async function specifyBattery({id}) {
	var intervention = await query('SELECT * FROM batteries WHERE id = ' + id)
	return resolve = intervention[0]
}

async function getInactiveElevators() {
	var intervention = await query('SELECT * FROM elevators WHERE status != "active";')
	return intervention
}

async function getInterventionBuildings() {
	var intervention = await query('SELECT DISTINCT buildings.id, buildings.admin_full_name, buildings.admin_phone, buildings.admin_email, buildings.full_name_STA, buildings.phone_TA, buildings.email_TA, buildings.address_id, buildings.customer_id, buildings.created_at, buildings.updated_at FROM buildings JOIN batteries ON buildings.id = batteries.building_id JOIN columns ON batteries.id = columns.battery_id JOIN elevators ON columns.id = elevators.column_id WHERE batteries.status = "intervention" OR columns.status = "intervention" OR elevators.status = "intervention";')
	return intervention
}

async function getLeads() {
	var intervention = await query('SELECT DISTINCT leads.id, leads.Full_Name, leads.Compagny_Name, leads.Email, leads.Phone, leads.Project_Name, leads.Project_Description, leads.Department, leads.Message, leads.File_name, leads.created_at, leads.updated_at  FROM leads JOIN customers ON customers.company_contact_email != leads.Email WHERE DATEDIFF(NOW(), leads.created_at) <= 30  ORDER BY leads.created_at ;')
	return intervention
}

async function specifySingleBuilding({id}) {
	var intervention = await query('SELECT * FROM buildings WHERE id = ' + id)
	return resolve = intervention[0]
}

async function specifyAddress({id}) {
	var intervention = await query('SELECT * FROM addresses WHERE id = ' + id)
	return resolve = intervention[0]
}
//--------------------all get query---------------------------


//--------------------test outside function---------------------
async function addressCreate({input}) {
    if(input.type_of_address === undefined || input.status === undefined || input.entity === undefined || input.number_and_street === undefined || input.suite_or_apartment === undefined || input.city === undefined || input.state === undefined || input.postal_code === undefined || input.notes === undefined){input.status = "Please fill all the fields"; return input;}
	connection.query('INSERT INTO addresses ( type_of_address, status, entity, number_and_street, suite_or_apartment, city, state, postal_code, notes, created_at, updated_at) VALUES ( "'+input.type_of_address+'", "'+input.status+'", "'+ input.entity+'", "'+input.number_and_street+'", "'+ input.suite_or_apartment +'", "'+ input.city +'",  "'+ input.state+'", "'+ input.postal_code+'", "'+ input.notes+'", NOW(), NOW());');
	return input;
}



//---------------------update functions------------------
async function addressUpdate({input}) {
	if(input.status !== undefined && input.status.toLowerCase() !== "intervention" && input.status.toLowerCase() !== "active" && input.status.toLowerCase() !== "inactive") {
		input.status = "Please enter a valid status!"
		return input
	}
	result = query('SELECT * FROM addresses WHERE id = ' + input.id)
	.then(e => {
		  //check if the field has info in it and change the values accordingly
		if(input.latitude === undefined) {input.latitude = e[0].latitude}
		if(input.longitude === undefined) {input.longitude = e[0].longitude}
		if(input.type_of_address === undefined) {input.type_of_address = e[0].type_of_address}
		if(input.status === undefined) {input.status = e[0].status}
		if(input.entity === undefined) {input.entity = e[0].entity}
		if(input.number_and_street === undefined) {input.number_and_street = e[0].number_and_street}
		if(input.suite_or_apartment === undefined) {input.suite_or_apartment = e[0].suite_or_apartment}
		if(input.city === undefined) {input.city = e[0].city}
		if(input.state === undefined) {input.state = e[0].state}
		if(input.postal_code === undefined) {input.postal_code = e[0].postal_code}
		if(input.country === undefined) {input.country = e[0].country}
		if(input.notes === undefined) {input.notes = e[0].notes}
		connection.query('UPDATE addresses SET latitude = '+ input.latitude +', longitude = '+ input.longitude+', type_of_address = "'+input.type_of_address+'", status = "'+ input.status+'", entity = "'+input.entity+'", number_and_street = "'+input.number_and_street+'", suite_or_apartment = "'+input.suite_or_apartment+'", city = "'+input.city+'", state = "'+input.state+'", postal_code = "'+input.postal_code+'", country = "'+input.country+'", notes = "'+input.notes+'" ,updated_at = NOW() WHERE id = '+input.id+';');
	})
	return input;
}


var root = {
	//create a new elevator
	createElevator: ({input}) => {
		if(input.serial_number === undefined || input.model === undefined || input.elevator_type === undefined || input.status === undefined || input.commission_date === undefined || input.date_of_last_inspection === undefined || input.certificate_of_inspection === undefined || input.informations === undefined || input.notes === undefined || input.column_id === undefined){input.status = "Please fill all the fields"; return input;}
		connection.query('INSERT INTO elevators ( serial_number, model, elevator_type, status, commission_date, date_of_last_inspection, certificate_of_inspection, informations, notes, column_id, created_at, updated_at) VALUES ( '+input.serial_number+', "'+input.model+'", "'+ input.elevator_type+'", "'+input.status+'", "'+ input.commission_date +'", "'+ input.date_of_last_inspection +'",  "'+ input.certificate_of_inspection+'", "'+ input.informations+'", "'+ input.notes+'", '+ input.column_id+', NOW(), NOW());');
    	return input;
	},

	//update the elevator demanded
	updateElevator: ({input}) => {	
		if(input.status !== undefined && input.status.toLowerCase() !== "intervention" && input.status.toLowerCase() !== "active" && input.status.toLowerCase() !== "inactive") {
			input.status = "Please enter a valid status!"
			return input
		}
		result = query('SELECT * FROM elevators WHERE id = ' + input.id)
		.then(e => {
      		//check if the field has info in it and change the values accordingly
			if(input.serial_number === undefined) {input.serial_number = e[0].serial_number}
			if(input.model === undefined) {input.model = e[0].model}
			if(input.elevator_type === undefined) {input.elevator_type = e[0].elevator_type}
			if(input.status === undefined) {input.status = e[0].status}
			if(input.commission_date === undefined) {input.commission_date = e[0].commission_date.toISOString().split('T')[0];}
			if(input.date_of_last_inspection === undefined) {input.date_of_last_inspection = e[0].date_of_last_inspection.toISOString().split('T')[0];}
			if(input.certificate_of_inspection === undefined) {input.certificate_of_inspection = e[0].certificate_of_inspection}
			if(input.informations === undefined) {input.informations = e[0].informations}
			if(input.notes === undefined) {input.notes = e[0].notes}
     		if(input.column_id === undefined) {input.column_id = e[0].column_id}
      
			connection.query('UPDATE elevators SET serial_number = "'+ input.serial_number +'", model = "'+ input.model+'", elevator_type = "'+input.elevator_type+'", status = "'+ input.status+'", commission_date = "'+input.commission_date+'", date_of_last_inspection = "'+input.date_of_last_inspection+'", certificate_of_inspection = "'+input.certificate_of_inspection+'", informations = "'+input.informations+'", notes = "'+input.notes+'", column_id = '+input.column_id+' ,updated_at = NOW() WHERE id = '+input.id+';');
		})
		return input;
	},

	//create a new column
	createColumn: ({input}) => {
		if(input.column_type === undefined || input.number_of_floors === undefined || input.status === undefined || input.informations === undefined || input.notes === undefined || input.battery_id === undefined){input.status = "Please fill all the fields!"; return input;}
		connection.query('INSERT INTO columns ( column_type, number_of_floors, status, informations, notes, battery_id, created_at, updated_at) VALUES ( "'+input.column_type+'", '+input.number_of_floors+', "'+ input.status+'", "'+input.informations+'", "'+ input.notes +'", '+ input.battery_id +', NOW(), NOW());');
    	return input;
	},
	//update elevator demanded
	updateColumn: ({input}) => {
		if(input.status !== undefined && input.status.toLowerCase() !== "intervention" && input.status.toLowerCase() !== "active" && input.status.toLowerCase() !== "inactive") {
			input.status = "Please enter a valid status!"
			return input
		}
		result = query('SELECT * FROM columns WHERE id = ' + input.id)
		.then(e => {
      		//check if the field has info in it and change the values accordingly
			if(input.column_type === undefined) {input.column_type = e[0].column_type}
			if(input.number_of_floors === undefined) {input.number_of_floors = e[0].number_of_floors}
			if(input.status === undefined) {input.status = e[0].status}
			if(input.informations === undefined) {input.informations = e[0].informations}
			if(input.notes === undefined) {input.notes = e[0].notes}
			if(input.battery_id === undefined) {input.battery_id = e[0].battery_id}

			connection.query('UPDATE columns SET column_type = "'+ input.column_type+'", number_of_floors = '+input.number_of_floors+', status = "'+input.status+'", informations = "'+input.informations+'", notes = "'+input.notes+'", battery_id = '+input.battery_id+', updated_at = NOW() WHERE id = '+input.id+';');
		})
		return input;
	},

	//create a new battery
	createBattery: ({input}) => {
		if(input.battery_type === undefined || input.status === undefined || input.commission_date === undefined || input.date_of_last_inspect === undefined || input.certificate_of_operations === undefined || input.informations === undefined || input.notes === undefined || input.building_id === undefined || input.employee_id === undefined){input.status = "Please fill the entire field";return input}
		connection.query('INSERT INTO batteries ( battery_type, status, commission_date, date_of_last_inspect, certificate_of_operations, informations, notes, building_id, employee_id, created_at, updated_at) VALUES ( "'+input.battery_type+'", "'+input.status+'", "'+ input.commission_date+'", "'+input.date_of_last_inspect+'", "'+ input.certificate_of_operations +'", "'+ input.informations +'",  "'+ input.notes+'", "'+ input.building_id+'", '+ input.employee_id+', NOW(), NOW());');
    	return input;
	},

	//update the battery demanded
	updateBattery: ({input}) => {	
		if(input.status !== undefined && input.status.toLowerCase() !== "intervention" && input.status.toLowerCase() !== "active" && input.status.toLowerCase() !== "inactive") {
			input.status = "Please enter a valid status!"
			return input
		}
		result = query('SELECT * FROM batteries WHERE id = ' + input.id)
		.then(e => {
      		//check if the field has info in it and change the values accordingly
			if(input.battery_type === undefined) {input.battery_type = e[0].battery_type}
			if(input.status === undefined) {input.status = e[0].status}
			if(input.commission_date === undefined) {input.commission_date = e[0].commission_date.toISOString().split('T')[0];}
			if(input.date_of_last_inspect === undefined) {input.date_of_last_inspect = e[0].date_of_last_inspect.toISOString().split('T')[0];}
			if(input.certificate_of_operations === undefined) {input.certificate_of_operations = e[0].certificate_of_operations}
			if(input.informations === undefined) {input.informations = e[0].informations}
			if(input.notes === undefined) {input.notes = e[0].notes}
			if(input.building_id === undefined) {input.building_id = e[0].building_id}
     		if(input.employee_id === undefined) {input.employee_id = e[0].employee_id}
      
			connection.query('UPDATE batteries SET battery_type = "'+input.battery_type+'", status = "'+input.status+'", commission_date = "'+input.commission_date+'", date_of_last_inspect = "'+input.date_of_last_inspect+'", certificate_of_operations = "'+input.certificate_of_operations+'", informations = "'+input.informations+'", notes = "'+input.notes+'", building_id = "'+input.building_id+'", employee_id = "'+input.employee_id+'" ,updated_at = NOW() WHERE id = '+input.id+';');
		})
		return input;
	},

	//create a new building
	createBuilding: ({input}) => {
		if(input.admin_full_name === undefined || input.admin_phone === undefined || input.admin_email === undefined || input.full_name_STA === undefined || input.phone_TA === undefined || input.email_TA === undefined || input.address_id === undefined || input.customer_id === undefined){input.admin_full_name = "Please fill the entire field";return input}
		connection.query('INSERT INTO buildings ( admin_full_name, admin_phone, admin_email, full_name_STA, phone_TA, email_TA, address_id, customer_id, created_at, updated_at) VALUES ( "'+input.admin_full_name+'", "'+input.admin_phone+'", "'+ input.admin_email+'", "'+input.full_name_STA+'", "'+ input.phone_TA +'", "'+ input.email_TA +'",  '+ input.address_id+', '+ input.customer_id+', NOW(), NOW());');
    	return input;
	},

	//update the building demanded
	updateBuilding: ({input}) => {
		result = query('SELECT * FROM buildings WHERE id = ' + input.id)
		.then(e => {
      		//check if the field has info in it and change the values accordingly
			if(input.admin_full_name === undefined) {input.admin_full_name = e[0].admin_full_name}
			if(input.admin_phone === undefined) {input.admin_phone = e[0].admin_phone}
			if(input.admin_email === undefined) {input.admin_email = e[0].admin_email}
			if(input.full_name_STA === undefined) {input.full_name_STA = e[0].full_name_STA}
			if(input.phone_TA === undefined) {input.phone_TA = e[0].phone_TA}
			if(input.email_TA === undefined) {input.email_TA = e[0].email_TA}
			if(input.address_id === undefined) {input.address_id = e[0].address_id}
     		if(input.customer_id === undefined) {input.customer_id = e[0].customer_id}
      
			connection.query('UPDATE buildings SET admin_full_name = "'+input.admin_full_name+'", admin_phone = "'+input.admin_phone+'", admin_email = "'+input.admin_email+'", full_name_STA = "'+input.full_name_STA+'", phone_TA = "'+input.phone_TA+'", email_TA = "'+input.email_TA+'", address_id = '+input.address_id+', customer_id = "'+input.customer_id+'",updated_at = NOW() WHERE id = '+input.id+';');
		})
		return input;
	},

	updateAddress: addressUpdate,
	createAddress: addressCreate,
	buildings: specifyBuilding,
	interventions: specifyIntervention,
	employees: specifyEmployee,
	elevators: specifyElevator,
	columns: specifyColumn,
	batteries: specifyBattery,
	inactiveelevators: getInactiveElevators,
	interventionBuildings: getInterventionBuildings,
	leads: getLeads,
	singlebuilding: specifySingleBuilding,
	address: specifyAddress,
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(PORT);