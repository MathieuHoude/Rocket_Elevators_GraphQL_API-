var {connection, query} = require('./mysql.js');
//--------------------update Function--------------------
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

async function elevatorUpdate({input}) {
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
}

async function columnUpdate({input}) {
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
}

async function batteryUpdate({input}) {
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
}

async function buildingUpdate({input}) {
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
}
//--------------------update Function--------------------

module.exports = { addressUpdate, elevatorUpdate, columnUpdate, batteryUpdate, buildingUpdate }