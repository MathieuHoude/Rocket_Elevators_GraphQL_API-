
var {connection, query} = require('./mysql.js');
var { querypg, pgconnection } = require('./pg.js');


//--------------------Get Function--------------------
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
//--------------------Get Function--------------------

module.exports = {specifyEmployee, specifyIntervention, specifyBuilding, specifyElevator, specifyColumn, specifyBattery, getInactiveElevators, getInterventionBuildings, getLeads, specifySingleBuilding, specifyAddress}