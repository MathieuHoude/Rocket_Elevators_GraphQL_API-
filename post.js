var {connection, query} = require('./mysql.js');


//--------------------Create Function--------------------
async function addressCreate({input}) {
    if(input.type_of_address === undefined || input.status === undefined || input.entity === undefined || input.number_and_street === undefined || input.suite_or_apartment === undefined || input.city === undefined || input.state === undefined || input.postal_code === undefined || input.notes === undefined){input.status = "Please fill all the fields"; return input;}
	connection.query('INSERT INTO addresses ( type_of_address, status, entity, number_and_street, suite_or_apartment, city, state, postal_code, notes, created_at, updated_at) VALUES ( "'+input.type_of_address+'", "'+input.status+'", "'+ input.entity+'", "'+input.number_and_street+'", "'+ input.suite_or_apartment +'", "'+ input.city +'",  "'+ input.state+'", "'+ input.postal_code+'", "'+ input.notes+'", NOW(), NOW());');
	return input;
}

async function elevatorCreate({input}) {
	if(input.serial_number === undefined || input.model === undefined || input.elevator_type === undefined || input.status === undefined || input.commission_date === undefined || input.date_of_last_inspection === undefined || input.certificate_of_inspection === undefined || input.informations === undefined || input.notes === undefined || input.column_id === undefined){input.status = "Please fill all the fields"; return input;}
	connection.query('INSERT INTO elevators ( serial_number, model, elevator_type, status, commission_date, date_of_last_inspection, certificate_of_inspection, informations, notes, column_id, created_at, updated_at) VALUES ( '+input.serial_number+', "'+input.model+'", "'+ input.elevator_type+'", "'+input.status+'", "'+ input.commission_date +'", "'+ input.date_of_last_inspection +'",  "'+ input.certificate_of_inspection+'", "'+ input.informations+'", "'+ input.notes+'", '+ input.column_id+', NOW(), NOW());');
	return input;
}

async function buildingCreate({input}) {
	if(input.admin_full_name === undefined || input.admin_phone === undefined || input.admin_email === undefined || input.full_name_STA === undefined || input.phone_TA === undefined || input.email_TA === undefined || input.address_id === undefined || input.customer_id === undefined){input.admin_full_name = "Please fill the entire field";return input}
	connection.query('INSERT INTO buildings ( admin_full_name, admin_phone, admin_email, full_name_STA, phone_TA, email_TA, address_id, customer_id, created_at, updated_at) VALUES ( "'+input.admin_full_name+'", "'+input.admin_phone+'", "'+ input.admin_email+'", "'+input.full_name_STA+'", "'+ input.phone_TA +'", "'+ input.email_TA +'",  '+ input.address_id+', '+ input.customer_id+', NOW(), NOW());');
	return input;
}

async function columnCreate({input}) {
	if(input.column_type === undefined || input.number_of_floors === undefined || input.status === undefined || input.informations === undefined || input.notes === undefined || input.battery_id === undefined){input.status = "Please fill all the fields!"; return input;}
	connection.query('INSERT INTO columns ( column_type, number_of_floors, status, informations, notes, battery_id, created_at, updated_at) VALUES ( "'+input.column_type+'", '+input.number_of_floors+', "'+ input.status+'", "'+input.informations+'", "'+ input.notes +'", '+ input.battery_id +', NOW(), NOW());');
	return input;
}

async function batteryCreate({input}) {
	if(input.battery_type === undefined || input.status === undefined || input.commission_date === undefined || input.date_of_last_inspect === undefined || input.certificate_of_operations === undefined || input.informations === undefined || input.notes === undefined || input.building_id === undefined || input.employee_id === undefined){input.status = "Please fill the entire field";return input}
	connection.query('INSERT INTO batteries ( battery_type, status, commission_date, date_of_last_inspect, certificate_of_operations, informations, notes, building_id, employee_id, created_at, updated_at) VALUES ( "'+input.battery_type+'", "'+input.status+'", "'+ input.commission_date+'", "'+input.date_of_last_inspect+'", "'+ input.certificate_of_operations +'", "'+ input.informations +'",  "'+ input.notes+'", "'+ input.building_id+'", '+ input.employee_id+', NOW(), NOW());');
	return input;
}
//--------------------Create Function--------------------


module.exports = {addressCreate, elevatorCreate, buildingCreate, columnCreate, batteryCreate}