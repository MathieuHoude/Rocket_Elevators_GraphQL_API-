## Query 1: Retrieving the address of the building, the beginning and the end of the intervention for a specific intervention.
Here is the query you need to enter:
{
  interventions(id: 1) {
    address {
      id
      latitude
      longitude
      type_of_address
      status
      entity
      number_and_street
      suite_or_apartment
      city
      state
      postal_code
      notes
    }
    start_of_intervention
    end_of_intervention
  }
}


## Query 2: Retrieving customer information and the list of interventions that took place for a specific building.
Here is the query you need to enter:
{
  buildings(id: 3) {
    customer {
      company_name
      full_name_company_contact
      company_contact_phone
      company_contact_email
    }
    interventions {
      start_of_intervention
      end_of_intervention  
      status
      result
      report
    }
  }
}


## Query 3: Retrieval of all interventions carried out by a specified employee with the buildings associated with these interventions including the details (Table BuildingDetails) associated with these buildings.
Here is the query you need to enter:
{
  employees(id: 1) {
    first_name
    last_name
    interventions {
      start_of_intervention
      end_of_intervention
      building {
        admin_full_name
        admin_phone
        admin_email
      }
      building_details {
        building_id
        info_key
        value
      }
    }
  }
}


## create a new elevator:
mutation {
  createElevator(input:{
    serial_number: 69, 
    model: "what ever model", 
    elevator_type: "premium", 
    status: "Active", 
    commission_date: "2020-08-06",
    date_of_last_inspection: "2020-08-06",
    certificate_of_inspection: "thisisrealitellyou", 
    informations: "blabla", 
    notes: "blabla2", 
    column_id: 10
  	} ) {
      serial_number
      model
      elevator_type
      status
      commission_date
      informations
      notes
      column_id
  }
}



## update what ever in the elevator full template
mutation {
  updateElevator(input:{
    id: 212
		serial_number: 123123
    model: "Standard"
    elevator_type: "corporate"
    status: "Active"
    commission_date: "2002-01-01"
    date_of_last_inspection: "1001-09-01"
    certificate_of_inspection: "123123"
    informations: "some infos"
    notes: "some notes"
    column_id: 170
  	} ) {
    id
    serial_number
    model
    elevator_type
    status
    commission_date
    date_of_last_inspection
    certificate_of_inspection
    informations
    notes
    column_id
  }
}


## get info for elevators 
{
  elevators(id: 1) {
    id
    serial_number
    model
    elevator_type
    status
    commission_date
    date_of_last_inspection
    certificate_of_inspection
    informations
    notes
    column_id
    created_at
    updated_at
  }
}



## get info for column 
{
  columns(id: 1) {
    id
  	column_type
    number_of_floors
    status
    informations
    notes
    battery_id
    created_at
    updated_at
  }
}

## create a new column
mutation {
  createColumn(input:{
    column_type: "Commercial"
    number_of_floors: 10
    status: "Inactive"
    informations: "first elevator for mister bob"
    notes: "nothing to add"
    battery_id: 2
  	} ) {
    column_type
    number_of_floors
    status
    informations
    notes
    battery_id
  }
}

## update column
mutation {
  updateColumn(input:{
    id: 275
    column_type: "Residential"
    number_of_floors: 32
    status: "Active"
    informations: "some info here"
    notes: "some notes here"
    battery_id: 3
  	} ) {
    id
    column_type
    number_of_floors
    status
    informations
    notes
    battery_id
  }
}

## create battery
mutation {
  createBattery(input:{
    battery_type: "Commercial"
    status: "Inactive"
    commission_date: "2020-08-06"
    date_of_last_inspect: "2020-08-06"
    certificate_of_operations: "12ag0123b0ad"
    informations: "yes"
    notes: "no"
    building_id: 10
    employee_id: 3
  	} ) {
    battery_type
    status
    commission_date
    date_of_last_inspect
    certificate_of_operations
    informations
    notes
    building_id
    employee_id
  }
}

## update Battery
mutation {
  updateBattery(input:{
    id: 93
    battery_type: "Hybrid"
  	status: "Inactive"
    commission_date: "2020-08-07"
    date_of_last_inspect: "2020-08-07"
    certificate_of_operations: "1230dsa754"
    informations: "some info here"
    notes: "some notes here"
    building_id: 10
    employee_id: 2
  	} ) {
    id
    battery_type
    status
    commission_date
    date_of_last_inspect
    certificate_of_operations
    informations
    notes
    building_id
    employee_id
  }
}

## get info for batteries
{
  batteries(id: 93) {
    id
  	battery_type
    status
    commission_date
    date_of_last_inspect
    certificate_of_operations
    informations
    notes
    building_id
    employee_id
  }
}

## create a building
mutation {
  createBuilding(input:{
    admin_full_name: "bob"
    admin_phone: "514-941-0399"
    admin_email: "bob.marley@gmail.com"
    full_name_STA: "chris"
    phone_TA: "413-251-7455"
    email_TA: "chris@gmail.com"
    address_id: 10
    customer_id: 10
  	} ) {
    admin_full_name
    admin_phone
    admin_email
    full_name_STA
    phone_TA
    email_TA
    address_id
    customer_id
  }
}

## update a building
mutation {
  updateBuilding(input:{
   	id: 100
    admin_full_name: "Jean"
    admin_phone: "401-205-1236"
    admin_email: "jean@gmail.com"
    full_name_STA: "Pedro"
    phone_TA: "510-205-1253"
    email_TA: "pedro@gmail.com"
    address_id: 10
    customer_id: 10
  	} ) {
    id
    admin_full_name
    admin_phone
    admin_email
    full_name_STA
    phone_TA
    email_TA
    address_id
    customer_id
  }
}

## get info single building
{
  singlebuilding(id: 93) {
    id
    admin_full_name
    admin_phone
    admin_email
    full_name_STA
    phone_TA
    email_TA
    address_id
    customer_id
    created_at
    updated_at
  }
}

## get info for an address
{
  address(id: 10) {
    id
    latitude
    longitude
    type_of_address
    status
    entity
    number_and_street
    suite_or_apartment
    city
    state
    postal_code
    notes
    created_at
    updated_at
  }
}

## create an address
mutation {
  createAddress(input:{
    type_of_address: "Shipping"
    status: "Active"
    entity: "Building"
    number_and_street: "8700 Main St"
    suite_or_apartment: "Apt. 304"
    city: "Fairborn"
    state: "OH"
    postal_code: "45324"
    notes: "some notes"
  	} ) {
    type_of_address
    status
    entity
    number_and_street
    suite_or_apartment
    city
    state
    postal_code
    notes
  }
}

## update an address
mutation {
  updateAddress(input:{
   	id: 101
    latitude: 39.82137
    longitude: -84.020305
    type_of_address: "Shipping"
    status: "Active"
    entity: "Building"
    number_and_street: "8700 Main St"
    suite_or_apartment: "Apt. 300"
    city: "Fairborn"
    state: "OH"
    postal_code: "45324"
    country: "USA"
    notes: "notes"
    
  	} ) {
    id
    latitude
    longitude
    type_of_address
    status
    entity
    number_and_street
    suite_or_apartment
    city
    state
    postal_code
    country
    notes
    
  }
}

# call rest api in graphql
## get status of elevator:
{
  elevators(id: 10) {
    id
  	status
  }
}
## update status elevator:
mutation {
  updateElevator(input:{
    id: 950,
    status: "Inactive"
  	} ) {
      id
    	status
  }
}

## get status of column
{
  columns(id: 10) {
    id
  	status
  }
}
## update status of columm
mutation {
  updateColumn(input:{
    id: 10,
    status: "Inactive"
  	} ) {
      id
    	status
  }
}

## get status of battery
{
  batteries(id: 10) {
    id
  	status
  }
}
## update status of battery
mutation {
  updateBattery(input:{
    id: 10,
    status: "Inactive"
  	} ) {
      id
    	status
  }
}

## get list of all inactive elevators
{
	inactiveelevators {
    id
    serial_number
    model
    elevator_type
    status
    commission_date
    date_of_last_inspection
    certificate_of_inspection
    informations
    notes
    column_id
    created_at
    updated_at
  }
}

## get a list a building that has atleast 1 intervention
{
	interventionBuildings {
    id
    admin_full_name
    admin_phone
    admin_email
    full_name_STA
    phone_TA
    email_TA
    address_id
    customer_id
    created_at
    updated_at
    
  }
}

## get a list of leads that are not yet clients in the pas 30 days
{
	leads {
    id
    Full_Name
    Compagny_Name
    Email
    Phone
    Project_Name
    Project_Description
    Department
    Message
    File_name
    created_at
    updated_at    
  }
}