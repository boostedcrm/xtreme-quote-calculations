return_map = Map();
record_resp = zoho.crm.getRecordById("Coating_Bid_Checklists",record_id);
info {"record_resp":record_resp};
// Deal Id
Terrazzo_Deal_Id = ifnull(record_resp.get("Terrazzo_Deal_Id"),"");
Tile_Grout_Deal_Id = ifnull(record_resp.get("Tile_Grout_Deal_Id"),"");
VCT_LVT_Deal_Id = ifnull(record_resp.get("VCT_LVT_Deal_Id"),"");
//////////////////////////////////////////////////////////////////////
// Check Polish_Deal_Id
Name = ifnull(record_resp.get("Name"),"");
Contact_Person = ifnull(record_resp.get("Contact_Person"),Map());
contact_person_name = ifnull(Contact_Person.get("name"),"");
Account_Name = ifnull(record_resp.get("Account_Name"),Map());
Account_Id = ifnull(Account_Name.get("id"),"");
Create_Date = ifnull(record_resp.get("Create_Date1"),"");
Est_Perform_Date = ifnull(record_resp.get("Est_Perform_Date"),"");
Quote_Due_Date = ifnull(record_resp.get("Quote_Due_Date"),"");
Terrazzo = ifnull(record_resp.get("Terrazzo"),false);
Tile_Grout = ifnull(record_resp.get("Tile_Grout"),false);
VCT_LVT = ifnull(record_resp.get("VCT_LVT"),false);
deal_map = {"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date};
if(Terrazzo)
{
	if(Terrazzo_Deal_Id == "")
	{
		Terrazzo_SQFT = ifnull(record_resp.get("Terrazzo_SQFT"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Terrazzo";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		// Create a new deal for Polish_Deal_Id
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"Terrazzo_SqFt":Terrazzo_SQFT};
		deal_map.put("Coating_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
        // Concrete
deal_map.put("Deal_Type", "Standard");
deal_map.put("Vendor_Type", ifnull(record_resp.get("Vendor_Type"),""));
deal_map.put("Contact_Name", ifnull(ifnull(record_resp.get("Contact_Person"),Map() ).get("id"), "") );

deal_map.put("Est_Perform_Date1", Est_Perform_Date);
deal_map.put("Estimated_Perform_Date", Est_Perform_Date);

deal_map.put("Type_of_Service", "Terrazzo"); // Terrazzo/VCT & LVT/Tile & Grout
deal_map.put("Quote_Type", "Coating Terrazzo"); // Coating Terrazzo / Coating VCT & LVT / Coating Tile & Grout

		Polish_Deal_resp = zoho.crm.createRecord("Deals",deal_map);
		info {"Polish_Deal_resp":Polish_Deal_resp};
		Terrazzo_Deal_Id = ifnull(Polish_Deal_resp.get("id"),"");
		return_map.put("Terrazzo_Deal_Id",Terrazzo_Deal_Id + "");
	}
	else
	{
		// Update Polish_Deal_Id
		Terrazzo_SQFT = ifnull(record_resp.get("Terrazzo_SQFT"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Terrazzo";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		// Create a new deal for Polish_Deal_Id
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"Terrazzo_SqFt":Terrazzo_SQFT};
		deal_map.put("Coating_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
        // Concrete
deal_map.put("Deal_Type", "Standard");
deal_map.put("Vendor_Type", ifnull(record_resp.get("Vendor_Type"),""));
deal_map.put("Contact_Name", ifnull(ifnull(record_resp.get("Contact_Person"),Map() ).get("id"), "") );

deal_map.put("Est_Perform_Date1", Est_Perform_Date);
deal_map.put("Estimated_Perform_Date", Est_Perform_Date);

deal_map.put("Type_of_Service", "Terrazzo"); // Terrazzo/VCT & LVT/Tile & Grout
deal_map.put("Quote_Type", "Coating Terrazzo"); // Coating Terrazzo / Coating VCT & LVT / Coating Tile & Grout

		Polish_Deal_resp = zoho.crm.updateRecord("Deals",Terrazzo_Deal_Id,deal_map);
		return_map.put("Terrazzo_Deal_Id",Terrazzo_Deal_Id + "");
	}
}
else if(Terrazzo == false && Terrazzo_Deal_Id != "")
{
	return_map.put("Terrazzo_Deal_Id","");
	deleteRecordMap = Map();
	deleteRecordMap.put("module","Deals");
	deleteRecordMap.put("id",Terrazzo_Deal_Id);
	deleteResp = zoho.crm.invokeConnector("crm.delete",deleteRecordMap);
	info deleteResp;
}
//////////////////////////////////////////////////////////////////////
// Check Striping_Deal_Id
if(Tile_Grout)
{
	if(Tile_Grout_Deal_Id == "")
	{
		// Create a new deal for Striping_Deal_Id
		// Create a new deal for Epoxy_Deal_Id
		T_G_SQFT = ifnull(record_resp.get("T_G_SQFT"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Tile & Grout";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		// Create a new deal for Polish_Deal_Id
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"Tile_SqFt":T_G_SQFT};
		deal_map.put("Coating_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
        // Concrete
deal_map.put("Deal_Type", "Standard");
deal_map.put("Vendor_Type", ifnull(record_resp.get("Vendor_Type"),""));
deal_map.put("Contact_Name", ifnull(ifnull(record_resp.get("Contact_Person"),Map() ).get("id"), "") );

deal_map.put("Est_Perform_Date1", Est_Perform_Date);
deal_map.put("Estimated_Perform_Date", Est_Perform_Date);

deal_map.put("Type_of_Service", "Tile & Grout"); // Terrazzo/VCT & LVT/Tile & Grout
deal_map.put("Quote_Type", "Coating Tile & Grout"); // Coating Terrazzo / Coating VCT & LVT / Coating Tile & Grout

		Striping_Deal_resp = zoho.crm.createRecord("Deals",deal_map);
		info {"Striping_Deal_resp":Striping_Deal_resp};
		Tile_Grout_Deal_Id = ifnull(Striping_Deal_resp.get("id"),"");
		return_map.put("Tile_Grout_Deal_Id",Tile_Grout_Deal_Id + "");
	}
	else
	{
		// Create a new deal for Epoxy_Deal_Id
		T_G_SQFT = ifnull(record_resp.get("T_G_SQFT"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Tile & Grout";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		// Create a new deal for Polish_Deal_Id
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"Tile_SqFt":T_G_SQFT};
		deal_map.put("Coating_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
        // Concrete
deal_map.put("Deal_Type", "Standard");
deal_map.put("Vendor_Type", ifnull(record_resp.get("Vendor_Type"),""));
deal_map.put("Contact_Name", ifnull(ifnull(record_resp.get("Contact_Person"),Map() ).get("id"), "") );

deal_map.put("Est_Perform_Date1", Est_Perform_Date);
deal_map.put("Estimated_Perform_Date", Est_Perform_Date);

deal_map.put("Type_of_Service", "Tile & Grout"); // Terrazzo/VCT & LVT/Tile & Grout
deal_map.put("Quote_Type", "Coating Tile & Grout"); // Coating Terrazzo / Coating VCT & LVT / Coating Tile & Grout

		Striping_Deal_resp = zoho.crm.updateRecord("Deals",Tile_Grout_Deal_Id,deal_map);
		return_map.put("Tile_Grout_Deal_Id",Tile_Grout_Deal_Id + "");
	}
}
else if(Tile_Grout == false && Tile_Grout_Deal_Id != "")
{
	return_map.put("Tile_Grout_Deal_Id","");
	deleteRecordMap = Map();
	deleteRecordMap.put("module","Deals");
	deleteRecordMap.put("id",Tile_Grout_Deal_Id);
	deleteResp = zoho.crm.invokeConnector("crm.delete",deleteRecordMap);
	info deleteResp;
}
//////////////////////////////////////////////////////////////////////
// Check Other_Deal_Id
if(VCT_LVT)
{
	if(VCT_LVT_Deal_Id == "")
	{
		// Create a new deal for Other_Deal_Id
		VCT_LVT_SQFT = ifnull(record_resp.get("VCT_LVT_SQFT"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Other";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"VCT_SqFt":VCT_LVT_SQFT};
		deal_map.put("Coating_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
        // Concrete
deal_map.put("Deal_Type", "Standard");
deal_map.put("Vendor_Type", ifnull(record_resp.get("Vendor_Type"),""));
deal_map.put("Contact_Name", ifnull(ifnull(record_resp.get("Contact_Person"),Map() ).get("id"), "") );

deal_map.put("Est_Perform_Date1", Est_Perform_Date);
deal_map.put("Estimated_Perform_Date", Est_Perform_Date);

deal_map.put("Type_of_Service", "VCT & LVT"); // Terrazzo/VCT & LVT/Tile & Grout
deal_map.put("Quote_Type", "Coating VCT & LVT"); // Coating Terrazzo / Coating VCT & LVT / Coating Tile & Grout

		Other_Deal_resp = zoho.crm.createRecord("Deals",deal_map);
		info {"Other_Deal_resp":Other_Deal_resp};
		VCT_LVT_Deal_Id = ifnull(Other_Deal_resp.get("id"),"");
		return_map.put("VCT_LVT_Deal_Id",VCT_LVT_Deal_Id + "");
	}
	else
	{
		// Create a new deal for Other_Deal_Id
		VCT_LVT_SQFT = ifnull(record_resp.get("VCT_LVT_SQFT"),0).round(0);
		deal_name = Name + "-" + contact_person_name + "-" + "Other";
		deal_name = ifnull(record_resp.get("Job_Deal_Name"),deal_name);
		deal_map = {"Deal_Name":deal_name,"Account_Name":Account_Id,"Create_Date":Create_Date,"Est_Perform_Date":Est_Perform_Date,"Quote_Due_Date":Quote_Due_Date,"VCT_SqFt":VCT_LVT_SQFT};
		deal_map.put("Coating_Bid_Checklist",record_id + "");
		deal_map.put("Check_if_Weekend_Work",ifnull(record_resp.get("Check_if_Weekend_Work"),false));
		deal_map.put("Facility_Type",ifnull(record_resp.get("Facility_Type"),""));
		deal_map.put("Job_Zip_Code",ifnull(record_resp.get("Job_Zip_Code"),""));
		deal_map.put("Job_Site_Name",ifnull(record_resp.get("Facility_Name"),""));
		deal_map.put("Job_City",ifnull(record_resp.get("Job_City"),""));
		deal_map.put("Job_Street_Address",ifnull(record_resp.get("Job_Street_Address"),""));
		deal_map.put("Locked__s",ifnull(record_resp.get("Locked__s"),false));
        // Concrete
        
deal_map.put("Deal_Type", "Standard");
deal_map.put("Vendor_Type", ifnull(record_resp.get("Vendor_Type"),""));
deal_map.put("Contact_Name", ifnull(ifnull(record_resp.get("Contact_Person"),Map() ).get("id"), "") );

deal_map.put("Est_Perform_Date1", Est_Perform_Date);
deal_map.put("Estimated_Perform_Date", Est_Perform_Date);

deal_map.put("Type_of_Service", "VCT & LVT"); // Terrazzo/VCT & LVT/Tile & Grout
deal_map.put("Quote_Type", "Coating VCT & LVT"); // Coating Terrazzo / Coating VCT & LVT / Coating Tile & Grout

		Other_Deal_resp = zoho.crm.updateRecord("Deals",VCT_LVT_Deal_Id,deal_map);
		return_map.put("VCT_LVT_Deal_Id",VCT_LVT_Deal_Id + "");
	}
}
else if(VCT_LVT == false && VCT_LVT_Deal_Id != "")
{
	return_map.put("VCT_LVT_Deal_Id","");
	deleteRecordMap = Map();
	deleteRecordMap.put("module","Deals");
	deleteRecordMap.put("id",VCT_LVT_Deal_Id);
	deleteResp = zoho.crm.invokeConnector("crm.delete",deleteRecordMap);
	info deleteResp;
}
zoho.crm.updateRecord("Coating_Bid_Checklists",record_id,return_map);
/*
*/