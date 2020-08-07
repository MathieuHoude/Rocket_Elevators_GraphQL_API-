var { buildSchema, specifiedScalarTypes } = require('graphql');


var schema = buildSchema(`
	scalar DateTime
	scalar BigInt
	scalar Double

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

	input BuildingInput {
		id: Int
		admin_full_name: String
		admin_phone: String
		admin_email: String
		full_name_STA: String
		phone_TA: String
		email_TA: String
		address_id: Int
		customer_id: Int
		created_at: DateTime
		updated_at: DateTime
	}

	input AddressInput {
		id: Int
		latitude: Double
		longitude: Double
		type_of_address: String
		status: String
		entity: String
		number_and_street: String
		suite_or_apartment: String
		city: String
		state: String
		postal_code: String
		country: String
		notes: String
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
		inactiveelevators: [Elevator]
		interventionBuildings: [Building]
		leads: [Lead]
		singlebuilding(id: Int!): Building
		address(id: Int!): Address
    }

    type Mutation {
        createElevator(input: ElevatorInput): Elevator
		updateElevator(input: ElevatorInput): Elevator
		createColumn(input: ColumnInput): Column
		updateColumn(input: ColumnInput): Column
		createBattery(input: BatteryInput): Battery
		updateBattery(input: BatteryInput): Battery
		createBuilding(input: BuildingInput): Building
		updateBuilding(input: BuildingInput): Building
		createAddress(input: AddressInput): Address
		updateAddress(input: AddressInput): Address
	}

	type Lead {
		id: Int
		Full_Name: String
		Compagny_Name: String
		Email: String
		Phone: String
		Project_Name: String
		Project_Description: String
		Department: String
		Message: String
		File_name: String
		created_at: DateTime
		updated_at: DateTime
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
	  customer_id: Int
	  created_at: DateTime
	  updated_at: DateTime
  }

    type Intervention {
      id: Int
	  building_id: Int
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
        id: Int
		latitude: Double
		longitude: Double
		type_of_address: String
		status: String
		entity: String
		number_and_street: String
		suite_or_apartment: String
		city: String
		state: String
		postal_code: String
		country: String
		notes: String
		created_at: DateTime
		updated_at: DateTime
    }

    type Customer {
        id: Int!
        company_name: String
        full_name_company_contact: String
        company_contact_phone: String
        company_contact_email: String
    }

    type Employee {
      id: Int
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

module.exports = schema;