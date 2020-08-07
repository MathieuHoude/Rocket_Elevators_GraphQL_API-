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

    input InterventionInput {
      id: Int
      start_of_intervention: DateTime
      end_of_intervention: DateTime
      result: String
      report: String
      status: String
      elevator_id: Int
      created_at: DateTime
      updated_at: DateTime
    }

    input ElevatorInput {
		id: Int
		serial_number: Int
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

    type Query {
        buildings(id: Int!): Building
        interventions(id: Int!): Intervention
        employees(id: Int!): Employee
    }

    type Mutation {
        createIntervention(input: InterventionInput): Intervention
        updateIntervention(input: InterventionInput): Intervention
        createElevator(input: ElevatorInput): Elevator
        updateElevator(input: ElevatorInput): Elevator
    }

    type Elevator {
      id: Int
      serial_number: Int
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
      id: Int
      building_id: Int!
      building: Building
      building_details: [BuildingDetail]
      start_of_intervention: DateTime
      end_of_intervention: DateTime
      elevator_id: Int
      employee_id: Int!
      status: String
      report: String
      result: String
      created_at: DateTime
      updated_at: DateTime
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
      user_id: Int
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

class Elevator {
  constructor(id, serial_number, model, elevator_type, status, commission_date, date_of_last_inspection, certificate_of_inspection, informations, notes, column_id ) {
	this.id = id;
	this.serial_number = serial_number;
    this.model = model;
    this.elevator_type = elevator_type;
    this.status = status;
    this.commission_date = commission_date;
    this.date_of_last_inspection = date_of_last_inspection;
    this.certificate_of_inspection = certificate_of_inspection;
    this.informations = informations;
    this.notes = notes;
    this.column_id = column_id;
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
  createIntervention: ({input}) => {
    connection.query('INSERT INTO interventions (id, start_of_intervention, end_of_intervention, result, report, status, elevator_id, created_at, updated_at) VALUES ('+input.id+', "'+input.start_of_intervention+'", "'+ input.end_of_intervention+'", "'+input.result+'", "'+input.report+'", "'+input.status+'", '+ input.elevator_id+ ', NOW(), NOW())');
    return input;
  },
	updateIntervention: ({input}) => {	
		var update_id, update_soi, update_eoi, update_result, update_report, update_status, update_eid;
		result = query('SELECT * FROM interventions WHERE id = ' + input.id)
		.then(e => {
      //check if the field has info in it and change the values accordingly
			if(input.id === undefined) {update_id = e[0].id}else{update_id = input.id}
			if(input.start_of_intervention === undefined) {update_soi = e[0].start_of_intervention.toISOString()}else{update_soi = input.start_of_intervention}
			if(input.end_of_intervention === undefined) {update_eoi = e[0].end_of_intervention.toISOString()}else{update_eoi = input.end_of_intervention}
			if(input.result === undefined) {update_result = e[0].result}else{update_result = input.result}
			if(input.report === undefined) {update_report = e[0].report}else{update_report = input.report}
			if(input.status === undefined) {update_status = e[0].status}else{update_status = input.status}
			if(input.elevator_id === undefined) {update_eid = e[0].elevator_id}else{update_eid = input.elevator_id}
			connection.query('UPDATE interventions SET id = '+ update_id +', start_of_intervention = "'+ update_soi+'", end_of_intervention = "'+update_eoi+'", result = "'+ update_result+'", report = "'+update_report+'", status = "'+update_status+'", elevator_id = '+update_eid+', updated_at = NOW() WHERE id = '+input.id+';');
			
		})
		return input;
	},
	//create a new elevator
	createElevator: ({input}) => {
		connection.query('INSERT INTO elevators ( serial_number, model, elevator_type, status, commission_date, date_of_last_inspection, certificate_of_inspection, informations, notes, column_id, created_at, updated_at) VALUES ( '+input.serial_number+', "'+input.model+'", "'+ input.elevator_type+'", "'+input.status+'", "'+ input.commission_date +'", "'+ input.date_of_last_inspection +'",  "'+ input.certificate_of_inspection+'", "'+ input.informations+'", "'+ input.notes+'", '+ input.column_id+', NOW(), NOW());');
    	return input;
	},

	//update the elevator demanded
	updateElevator: ({input}) => {	
		if(input.status.toLowerCase() !== "intervention" && input.status.toLowerCase() !== "active" && input.status.toLowerCase() !== "inactive") {
			input.status = "Please enter a valid status!"
			return input
		}
		var sinformations, sserial_number, smodel, selevator_type, sstatus, dcommission_date, ddate_of_last_inspection, scertificate_of_inspection, snotes, icolumn_id;
		result = query('SELECT * FROM elevators WHERE id = ' + input.id)
		.then(e => {
			// console.log(e)
			//info = e.informations
			//info = input.informations
    
      //check if the field has info in it and change the values accordingly
			if(input.serial_number === undefined) {sserial_number = e[0].serial_number}else{sserial_number = input.serial_number}
			if(input.model === undefined) {smodel = e[0].model}else{smodel = input.model}
			if(input.elevator_type === undefined) {selevator_type = e[0].elevator_type}else{selevator_type = input.elevator_type}
			if(input.status === undefined) {sstatus = e[0].status}else{sstatus = input.status}
			if(input.commission_date === undefined) {dcommission_date = e[0].commission_date.toISOString().split('T')[0];}else{dcommission_date = input.commission_date}
			if(input.date_of_last_inspection === undefined) {ddate_of_last_inspection = e[0].date_of_last_inspection.toISOString().split('T')[0];}else{ddate_of_last_inspection = input.date_of_last_inspection}
			if(input.certificate_of_inspection === undefined) {scertificate_of_inspection = e[0].certificate_of_inspection}else{scertificate_of_inspection = input.certificate_of_inspection}
			if(input.informations === undefined) {sinformations = e[0].informations}else{sinformations = input.informations}
			if(input.notes === undefined) {snotes = e[0].notes}else{snotes = input.notes}
      if(input.column_id === undefined) {icolumn_id = e[0].column_id}else{icolumn_id = input.column_id}
      
			connection.query('UPDATE elevators SET serial_number = "'+ sserial_number +'", model = "'+ smodel+'", elevator_type = "'+selevator_type+'", status = "'+ sstatus+'", commission_date = "'+dcommission_date+'", date_of_last_inspection = "'+ddate_of_last_inspection+'", certificate_of_inspection = "'+scertificate_of_inspection+'", informations = "'+sinformations+'", notes = "'+snotes+'", column_id = '+icolumn_id+' ,updated_at = NOW() WHERE id = '+input.id+';');
			

		})
		return input;
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
app.listen(4000);