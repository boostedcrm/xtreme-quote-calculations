return_map = Map();
record_resp = zoho.crm.getRecordById("Concrete_Bid_Checklists",record_id);
info {"record_resp":record_resp};
// Deal Id
Polish_Deal_Id = ifnull(record_resp.get("Polish_Deal_Id"),"");
Epoxy_Deal_Id = ifnull(record_resp.get("Epoxy_Deal_Id"),"");
Striping_Deal_Id = ifnull(record_resp.get("Striping_Deal_Id"),"");
Other_Deal_Id = ifnull(record_resp.get("Other_Deal_Id"),"");
//////////////////////////////////////////////////////////////////////
// Check Polish_Deal_Id
Name = ifnull(record_resp.get("Name"),"");
Contact_Person = ifnull(record_resp.get("Contact_Person"),Map());
contact_person_name = ifnull(Contact_Person.get("name"),"");
Account_Name = ifnull(record_resp.get("Account_Name"),Map());
Account_Id = ifnull(Account_Name.get("id"),"");
Create_Date = ifnull(record_resp.get("Create_Date"),"");
Est_Perform_Date = ifnull(record_resp.get("Est_Perform_Date"),"");
Quote_Due_Date = ifnull(record_resp.get("Quote_Due_Date"),"");
Polish = ifnull(record_resp.get("Polish"),false);
Epoxy = ifnull(record_resp.get("Epoxy"),false);
Striping = ifnull(record_resp.get("Striping"),false);
Other = ifnull(record_resp.get("Other"),false);
deal_map = {"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date};
if(Polish)
{
	if(Polish_Deal_Id == "")
	{
		Polished_SQFT = ifnull(record_resp.get("Polished_SQFT"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Polish";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		// Create a new deal for Polish_Deal_Id
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"Polish_SqFt":Polished_SQFT};
		deal_map.put("Concrete_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Service_Description",ifnull(record_resp.get("Physical_Job_Site_Details"),""));
		deal_map.put("When_is_the_optimal_time_for_completion",ifnull(record_resp.get("When_is_the_optimal_time_for_completion"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_State",ifnull(record_resp.get("Job_State"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
		deal_map.put("Vendor_Type",ifnull(record_resp.get("Vendor_Type"),""));
		// Concrete
		deal_map.put("Deal_Type","Standard");
		deal_map.put("Vendor_Type",ifnull(record_resp.get("Vendor_Type"),""));
		deal_map.put("Contact_Name",ifnull(ifnull(record_resp.get("Contact_Person"),Map()).get("id"),""));
		deal_map.put("Est_Perform_Date1",Est_Perform_Date);
		deal_map.put("Estimated_Perform_Date",Est_Perform_Date);
		deal_map.put("Type_of_Service","Polish");
		// Polish/Striping/Epoxy/Other
		deal_map.put("Quote_Type","Concrete Polish");
		// Concrete Polish / Concrete Epoxy / Concrete Striping / Concrete Other
		Polish_Deal_resp = zoho.crm.createRecord("Deals",deal_map);
		info {"Polish_Deal_resp":Polish_Deal_resp};
		Polish_Deal_Id = ifnull(Polish_Deal_resp.get("id"),"");
		return_map.put("Polish_Deal_Id",Polish_Deal_Id + "");
	}
	else
	{
		// Update Polish_Deal_Id
		Polished_SQFT = ifnull(record_resp.get("Polished_SQFT"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Polish";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		// Create a new deal for Polish_Deal_Id
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"Polish_SqFt":Polished_SQFT};
		deal_map.put("Concrete_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Service_Description",ifnull(record_resp.get("Physical_Job_Site_Details"),""));
		deal_map.put("When_is_the_optimal_time_for_completion",ifnull(record_resp.get("When_is_the_optimal_time_for_completion"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_State",ifnull(record_resp.get("Job_State"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
		// Concrete
		deal_map.put("Deal_Type","Standard");
		deal_map.put("Vendor_Type",ifnull(record_resp.get("Vendor_Type"),""));
		deal_map.put("Contact_Name",ifnull(ifnull(record_resp.get("Contact_Person"),Map()).get("id"),""));
		deal_map.put("Est_Perform_Date1",Est_Perform_Date);
		deal_map.put("Estimated_Perform_Date",Est_Perform_Date);
		deal_map.put("Type_of_Service","Polish");
		// Polish/Striping/Epoxy/Other
		deal_map.put("Quote_Type","Concrete Polish");
		// Concrete Polish / Concrete Epoxy / Concrete Striping / Concrete Other
		return_map.put("Polish_Deal_Id",Polish_Deal_Id + "");
		Polish_Deal_resp = zoho.crm.updateRecord("Deals",Polish_Deal_Id,deal_map);
	}
}
else if(Polish == false && Polish_Deal_Id != "")
{
	return_map.put("Polish_Deal_Id","");
	deleteRecordMap = Map();
	deleteRecordMap.put("module","Deals");
	deleteRecordMap.put("id",Polish_Deal_Id);
	deleteResp = zoho.crm.invokeConnector("crm.delete",deleteRecordMap);
	info deleteResp;
}
//////////////////////////////////////////////////////////////////////
// Check Epoxy_Deal_Id
if(Epoxy)
{
	if(Epoxy_Deal_Id == "")
	{
		// Create a new deal for Epoxy_Deal_Id
		Epoxy_SQFT = ifnull(record_resp.get("Epoxy_SQFT"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Epoxy";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		// Create a new deal for Polish_Deal_Id
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date};
		deal_map.put("Concrete_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Service_Description",ifnull(record_resp.get("Physical_Job_Site_Details"),""));
		deal_map.put("When_is_the_optimal_time_for_completion",ifnull(record_resp.get("When_is_the_optimal_time_for_completion"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_State",ifnull(record_resp.get("Job_State"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
		// Concrete
		deal_map.put("Deal_Type","Standard");
		deal_map.put("Vendor_Type",ifnull(record_resp.get("Vendor_Type"),""));
		deal_map.put("Contact_Name",ifnull(ifnull(record_resp.get("Contact_Person"),Map()).get("id"),""));
		deal_map.put("Est_Perform_Date1",Est_Perform_Date);
		deal_map.put("Estimated_Perform_Date",Est_Perform_Date);
		deal_map.put("Type_of_Service","Epoxy");
		// Polish/Striping/Epoxy/Other
		deal_map.put("Quote_Type","Concrete Epoxy");
		// Concrete Polish / Concrete Epoxy / Concrete Striping / Concrete Other
		Epoxy_Deal_resp = zoho.crm.createRecord("Deals",deal_map);
		info {"Epoxy_Deal_resp":Epoxy_Deal_resp};
		Epoxy_Deal_Id = ifnull(Epoxy_Deal_resp.get("id"),"");
		return_map.put("Epoxy_Deal_Id",Epoxy_Deal_Id + "");
	}
	else
	{
		// Update Epoxy_Deal_Id
		Polished_SQFT = ifnull(record_resp.get("Polished_SQFT"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Epoxy";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		// Create a new deal for Polish_Deal_Id
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date};
		deal_map.put("Concrete_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Service_Description",ifnull(record_resp.get("Physical_Job_Site_Details"),""));
		deal_map.put("When_is_the_optimal_time_for_completion",ifnull(record_resp.get("When_is_the_optimal_time_for_completion"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_State",ifnull(record_resp.get("Job_State"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
		// Concrete
		deal_map.put("Deal_Type","Standard");
		deal_map.put("Vendor_Type",ifnull(record_resp.get("Vendor_Type"),""));
		deal_map.put("Contact_Name",ifnull(ifnull(record_resp.get("Contact_Person"),Map()).get("id"),""));
		deal_map.put("Est_Perform_Date1",Est_Perform_Date);
		deal_map.put("Estimated_Perform_Date",Est_Perform_Date);
		deal_map.put("Type_of_Service","Epoxy");
		// Polish/Striping/Epoxy/Other
		deal_map.put("Quote_Type","Concrete Epoxy");
		// Concrete Polish / Concrete Epoxy / Concrete Striping / Concrete Other
		return_map.put("Epoxy_Deal_Id",Epoxy_Deal_Id + "");
		Epoxy_Deal_resp = zoho.crm.updateRecord("Deals",Epoxy_Deal_Id,deal_map);
	}
}
else if(Epoxy == false && Epoxy_Deal_Id != "")
{
	return_map.put("Epoxy_Deal_Id","");
	deleteRecordMap = Map();
	deleteRecordMap.put("module","Deals");
	deleteRecordMap.put("id",Epoxy_Deal_Id);
	deleteResp = zoho.crm.invokeConnector("crm.delete",deleteRecordMap);
	info deleteResp;
}
//////////////////////////////////////////////////////////////////////
// Check Striping_Deal_Id
if(Striping)
{
	if(Striping_Deal_Id == "")
	{
		// Create a new deal for Striping_Deal_Id
		// Create a new deal for Epoxy_Deal_Id
		Striping_SQFT = ifnull(record_resp.get("Striping_SQFT	"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Striping";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		// Create a new deal for Polish_Deal_Id
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"Striping_SqFt":Striping_SQFT};
		deal_map.put("Concrete_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Service_Description",ifnull(record_resp.get("Physical_Job_Site_Details"),""));
		deal_map.put("When_is_the_optimal_time_for_completion",ifnull(record_resp.get("When_is_the_optimal_time_for_completion"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_State",ifnull(record_resp.get("Job_State"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
		// Concrete
		deal_map.put("Deal_Type","Standard");
		deal_map.put("Vendor_Type",ifnull(record_resp.get("Vendor_Type"),""));
		deal_map.put("Contact_Name",ifnull(ifnull(record_resp.get("Contact_Person"),Map()).get("id"),""));
		deal_map.put("Est_Perform_Date1",Est_Perform_Date);
		deal_map.put("Estimated_Perform_Date",Est_Perform_Date);
		deal_map.put("Type_of_Service","Striping");
		// Polish/Striping/Epoxy/Other
		deal_map.put("Quote_Type","Concrete Striping");
		// Concrete Polish / Concrete Epoxy / Concrete Striping / Concrete Other
		Striping_Deal_resp = zoho.crm.createRecord("Deals",deal_map);
		info {"Striping_Deal_resp":Striping_Deal_resp};
		Striping_Deal_Id = ifnull(Striping_Deal_resp.get("id"),"");
		return_map.put("Striping_Deal_Id",Striping_Deal_Id + "");
	}
	else
	{
		// Update Striping_Deal_Id
		Striping_SQFT = ifnull(record_resp.get("Striping_SQFT	"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Striping";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		// Create a new deal for Striping_Deal_Id
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"Striping_SqFt":Striping_SQFT};
		deal_map.put("Concrete_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Service_Description",ifnull(record_resp.get("Physical_Job_Site_Details"),""));
		deal_map.put("When_is_the_optimal_time_for_completion",ifnull(record_resp.get("When_is_the_optimal_time_for_completion"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_State",ifnull(record_resp.get("Job_State"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
		// Concrete
		deal_map.put("Deal_Type","Standard");
		deal_map.put("Vendor_Type",ifnull(record_resp.get("Vendor_Type"),""));
		deal_map.put("Contact_Name",ifnull(ifnull(record_resp.get("Contact_Person"),Map()).get("id"),""));
		deal_map.put("Est_Perform_Date1",Est_Perform_Date);
		deal_map.put("Estimated_Perform_Date",Est_Perform_Date);
		deal_map.put("Type_of_Service","Striping");
		// Polish/Striping/Epoxy/Other
		deal_map.put("Quote_Type","Concrete Striping");
		// Concrete Polish / Concrete Epoxy / Concrete Striping / Concrete Other
		return_map.put("Striping_Deal_Id",Striping_Deal_Id + "");
		Striping_Deal_resp = zoho.crm.updateRecord("Deals",Striping_Deal_Id,deal_map);
	}
}
else if(Striping == false && Striping_Deal_Id != "")
{
	return_map.put("Striping_Deal_Id","");
	deleteRecordMap = Map();
	deleteRecordMap.put("module","Deals");
	deleteRecordMap.put("id",Striping_Deal_Id);
	deleteResp = zoho.crm.invokeConnector("crm.delete",deleteRecordMap);
	info deleteResp;
}
//////////////////////////////////////////////////////////////////////
// Check Other_Deal_Id
if(Other)
{
	if(Other_Deal_Id == "")
	{
		// Create a new deal for Other_Deal_Id
		Other_SQFT = ifnull(record_resp.get("Other_SQFT	"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Other";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"Other_SqFt	":Other_SQFT};
		deal_map.put("Concrete_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Service_Description",ifnull(record_resp.get("Physical_Job_Site_Details"),""));
		deal_map.put("When_is_the_optimal_time_for_completion",ifnull(record_resp.get("When_is_the_optimal_time_for_completion"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_State",ifnull(record_resp.get("Job_State"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
		// Concrete
		deal_map.put("Deal_Type","Standard");
		deal_map.put("Vendor_Type",ifnull(record_resp.get("Vendor_Type"),""));
		deal_map.put("Contact_Name",ifnull(ifnull(record_resp.get("Contact_Person"),Map()).get("id"),""));
		deal_map.put("Est_Perform_Date1",Est_Perform_Date);
		deal_map.put("Estimated_Perform_Date",Est_Perform_Date);
		deal_map.put("Type_of_Service","Other");
		// Polish/Striping/Epoxy/Other
		deal_map.put("Quote_Type","Concrete Other");
		// Concrete Polish / Concrete Epoxy / Concrete Striping / Concrete Other
		Other_Deal_resp = zoho.crm.createRecord("Deals",deal_map);
		info {"Other_Deal_resp":Other_Deal_resp};
		Other_Deal_Id = ifnull(Other_Deal_resp.get("id"),"");
		return_map.put("Other_Deal_Id",Other_Deal_Id + "");
	}
	else
	{
		// Update Other_Deal_Id
		// Create a new deal for Other_Deal_Id
		Other_SQFT = ifnull(record_resp.get("Other_SQFT	"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Other";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"Other_SqFt	":Other_SQFT};
		deal_map.put("Concrete_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Service_Description",ifnull(record_resp.get("Physical_Job_Site_Details"),""));
		deal_map.put("When_is_the_optimal_time_for_completion",ifnull(record_resp.get("When_is_the_optimal_time_for_completion"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_State",ifnull(record_resp.get("Job_State"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
		// Concrete
		deal_map.put("Deal_Type","Standard");
		deal_map.put("Vendor_Type",ifnull(record_resp.get("Vendor_Type"),""));
		deal_map.put("Contact_Name",ifnull(ifnull(record_resp.get("Contact_Person"),Map()).get("id"),""));
		deal_map.put("Est_Perform_Date1",Est_Perform_Date);
		deal_map.put("Estimated_Perform_Date",Est_Perform_Date);
		deal_map.put("Type_of_Service","Other");
		// Polish/Striping/Epoxy/Other
		deal_map.put("Quote_Type","Concrete Other");
		// Concrete Polish / Concrete Epoxy / Concrete Striping / Concrete Other
		return_map.put("Other_Deal_Id",Other_Deal_Id + "");
		Other_Deal_resp = zoho.crm.updateRecord("Deals",Other_Deal_Id,deal_map);
	}
}
else if(Other == false && Other_Deal_Id != "")
{
	return_map.put("Other_Deal_Id","");
	deleteRecordMap = Map();
	deleteRecordMap.put("module","Deals");
	deleteRecordMap.put("id",Other_Deal_Id);
	deleteResp = zoho.crm.invokeConnector("crm.delete",deleteRecordMap);
	info deleteResp;
}
zoho.crm.updateRecord("Concrete_Bid_Checklists",record_id,return_map);
/*
*/