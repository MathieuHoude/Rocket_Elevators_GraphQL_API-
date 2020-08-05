# Rocket_Elevators_GraphQL_API-
//Retrieving the address of the building, the beginning and the end of the intervention for a specific intervention.
{
  interventions(building_id: 1){
    address{
      number_and_street
      city
      state
      country
    }
    start_of_intervention
    end_of_intervention
  }
}


 // Retrieving customer information and the list of interventions that took place for a specific building
    {
  buildings(id:1){
    customer{
      id
      company_name
      full_name_company_contact
      company_contact_phone
      company_contact_email
    }
    interventions{
      id
      start_of_intervention
      end_of_intervention
    }
  }
}

// Retrieval of all interventions carried out by a specified employee with the buildings associated with these interventions including the details (Table BuildingDetails) associated with these buildings.

{
  employees(id:1){
    id
    email
    first_name
    last_name
    title
  }
  buildings(id:1){
    customer{
    company_name
    full_name_company_contact
    company_contact_phone
    company_contact_email
    }
    building_details{
      building_id
      info_key
      value
    }
    interventions{
      employee_id
      building_id
      start_of_intervention
      end_of_intervention
    }
  }
}