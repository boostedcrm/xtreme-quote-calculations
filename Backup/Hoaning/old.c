return_map = Map();
record_resp = zoho.crm.getRecordById("Honing_Bid_Checklists",record_id);
info {"record_resp":record_resp};
// Deal Id
Deal_Id = ifnull(record_resp.get("Deal_Id"),"");
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
if(Deal_Id == "")
{
	Honing_SQFT = ifnull(record_resp.get("Honing_SQFT"),0).round(0);
	deal_name = Name + "-" + contact_person_name + "-" + "";
	deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
	// Create a new deal for Polish_Deal_Id
	deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date};
	deal_map.put("Honing_Bid_Checklist",record_id + "");
	deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
	deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
	deal_map.put("When_is_the_optimal_time_for_completion",ifnull(record_resp.get("When_is_the_optimal_time_for_completion"),""));
	deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
	deal_map.put("Job_State",ifnull(record_resp.get("Job_State"),""));
	deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
	deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
	deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
	deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
	deal_map.put("Vendor_Type",ifnull(record_resp.get("Vendor_Type"),""));
	Polish_Deal_resp = zoho.crm.createRecord("Deals",deal_map);
	info {"Polish_Deal_resp":Polish_Deal_resp};
	Deal_Id = ifnull(Polish_Deal_resp.get("id"),"");
}
else
{
	// Update Polish_Deal_Id
	Polished_SQFT = ifnull(record_resp.get("Polished_SQFT"),0).round(0);
	deal_name = Name + "-" + contact_person_name + "-" + "";
	deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
	// Create a new deal for Polish_Deal_Id
	deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date};
	deal_map.put("Honing_Bid_Checklist",record_id + "");
	deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
	deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
	deal_map.put("When_is_the_optimal_time_for_completion",ifnull(record_resp.get("When_is_the_optimal_time_for_completion"),""));
	deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
	deal_map.put("Job_State",ifnull(record_resp.get("Job_State"),""));
	deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
	deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
	deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
	deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
	deal_map.put("Vendor_Type",ifnull(record_resp.get("Vendor_Type"),""));
	Polish_Deal_resp = zoho.crm.updateRecord("Deals",Deal_Id,deal_map);
}
return_map = {"Deal_Id":Deal_Id};
zoho.crm.updateRecord("Honing_Bid_Checklists",record_id,return_map);
/*
*/