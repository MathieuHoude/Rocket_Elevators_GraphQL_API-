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
