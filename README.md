## Query 1: Retrieving the address of the building, the beginning and the end of the intervention for a specific intervention.
Here is the query you need to enter:
{
  interventions(id: 1) {
    address {
      number_and_street
      city
      state
      country
    }
    start_of_intervention
    end_of_intervention
  }
}


## Query 2: Retrieving customer information and the list of interventions that took place for a specific building.
Here is the query you need to enter:
{
  buildings(id: 5) {
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

## update what ever in the elevator full template
mutation {
  updateElevator(input:{
    id: 212
		serial_number: 123123
    model: "nice"
    elevator_type: "corporate"
    status: "Active"
    commission_date: "2002-01-01"
    date_of_last_inspection: "1001-09-01"
    certificate_of_inspection: "123123"
    informations: "allo"
    notes: "bonjour"
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