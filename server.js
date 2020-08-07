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

    type Query {
        buildings(id: Int!): Building
        interventions(id: Int!): Intervention
        employees(id: Int!): Employee
		elevators(id: Int!): Elevator
		columns(id: Int!): Column
		batteries(id: Int!): Battery
    }

    type Mutation {
        createElevator(input: ElevatorInput): Elevator
		updateElevator(input: ElevatorInput): Elevator
		createColumn(input: ColumnInput): Column
		updateColumn(input: ColumnInput): Column
		createBattery(input: BatteryInput): Battery
		updateBattery(input: BatteryInput): Battery
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






//--------------------all get query---------------------------
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
//--------------------all get query---------------------------







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
      
			connection.query('UPDATE elevators SET serial_number = "'+ input.serial_number +'", model = "'+ input.model+'", elevator_type = "'+input,elevator_type+'", status = "'+ input,status+'", commission_date = "'+input,commission_date+'", date_of_last_inspection = "'+input.date_of_last_inspection+'", certificate_of_inspection = "'+input.certificate_of_inspection+'", informations = "'+input.informations+'", notes = "'+input.notes+'", column_id = '+input.column_id+' ,updated_at = NOW() WHERE id = '+input.id+';');
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

	buildings: specifyBuilding,
	interventions: specifyIntervention,
	employees: specifyEmployee,
	elevators: specifyElevator,
	columns: specifyColumn,
	batteries: specifyBattery,
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(PORT);