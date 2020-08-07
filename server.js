var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var schema = require('./schema.js')
var { querypg, pgconnection } = require('./pg.js');
var PORT = process.env.PORT || 5000;
var {specifyEmployee, specifyIntervention, specifyBuilding, specifyElevator, specifyColumn, specifyBattery, getInactiveElevators, getInterventionBuildings, getLeads, specifySingleBuilding, specifyAddress} = require('./get.js')
var { addressUpdate, elevatorUpdate, columnUpdate, batteryUpdate, buildingUpdate } = require('./put.js')
var {addressCreate, elevatorCreate, buildingCreate, columnCreate, batteryCreate} = require('./post.js')
pgconnection();


// call appropriate function depending on what is demanded
var root = {
	createElevator: elevatorCreate,
	updateElevator: elevatorUpdate,
	createColumn: columnCreate,
	updateColumn: columnUpdate,
	createBattery: batteryCreate,
	updateBattery: batteryUpdate,
	createBuilding: buildingCreate,
	updateBuilding: buildingUpdate,
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