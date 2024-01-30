import React, { useState } from "react";
import { DateTime } from "luxon";

import {
  Box,
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import XtremeQuoteForm from "../components/XtremeQuoteForm";
import MaterialCosts from "../components/MaterialCosts";
import LaborCosts from "../components/LaborCosts";
import EquipmentCost from "../components/EquipmentCost";
import Lodging from "../components/Lodging";
import PerDiem from "../components/PerDiem";
import RentalEquipment from "../components/RentalEquipment";
import VehicleExpense from "../components/VehicleExpense";
import Calculation from "../components/Calculation";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useForm } from "react-hook-form";

function getSteps() {
  return [
    "Basic Info",
    "Material",
    "Labor",
    "Equipment",
    "Lodging",
    "Per Diem",
    "Rental Equipment",
    "Vehicle Expense",
    "Calculation",
  ];
}

export default function QuoteCalculation({
  taskList,
  setPage,
  handleClose,
  dealData,
  products,
  ZOHO,
  checklistData,
  quoteType,
  bluprintData,
}) {
  const {
    control,
    handleSubmit,
    register,
    unregister,
    watch,
    getValues,
    setValue,
  } = useForm({
    defaultValues: dealData?.Clarification20
      ? { step: 0, ...JSON.parse(dealData.Clarification20) }
      : { step: 0 },
  });

  const [activeStep, setActiveStep] = useState(
    JSON.parse(dealData.Clarification20)?.step || 0
  );

  const [loading, setLoading] = useState(false);
  const steps = getSteps();

  const handleStep = (step) => () => {
    setValue("step", step);
    setActiveStep(step);
  };

  const handleCalculate = () => {
    setPage("Home");
  };

  const handleNext = () => {
    setValue("step", activeStep + 1);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  const handleBack = () => {
    setValue("step", activeStep - 1);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const createMaterial = async (materials, dealData) => {
    var subformData = materials?.map((material) => {
      return {
        Name1: material?.product?.Product_Name,
        Size: material?.size || "" + "",
        Coverage: Number(material?.coverage) || 0,
        Price_Per: Number(material?.pricePer) || 0,
        Amount: Number(material?.amount) || 0,
        Material_Total: Number(material?.total) || 0,
      };
    });
    console.log({ subformData });
    var materialData = {
      Subform_4: subformData,
      Name: dealData?.Deal_Name + "-sandbox",
      Deal_Name: dealData?.id + "",
    };

    if (dealData?.Material_Quote_ID) {
      // Update Material_Quote
      var config = {
        Entity: "Material_Quote",
        APIData: {
          id: dealData?.Material_Quote_ID,
          ...materialData,
        },
        Trigger: ["workflow"],
      };
      return ZOHO.CRM.API.updateRecord(config)
        .then(function (data) {
          let id = data?.[0]?.details?.id || "";
          return { id: dealData?.Material_Quote_ID };
        })
        .catch((err) => {
          return { id: dealData?.Material_Quote_ID };
        });
    } else {
      // Create a new one

      return ZOHO.CRM.API.insertRecord({
        Entity: "Material_Quote",
        APIData: materialData,
        Trigger: ["workflow"],
      })
        .then(function (data) {
          let id = data?.data?.[0]?.details?.id || "";
          return { id: id };
        })
        .catch((err) => {
          return { id: "" };
        });
    }
  };

  const createLabor = async (labors, dealData) => {
    var Subform_5 = labors?.map((labor) => {
      return {
        Name1: labor?.resourceTitle?.Name,
        Time_Frame_Day_Week_Task: labor?.timeFrame || "" + "",
        Days: Number(labor?.days) || 0,
        Hours_Per_Day: Number(labor?.hoursPerDay) || 0,
        Men: Number(labor?.men) || 0,
        Cost_Per_Hour: Number(labor?.costPerHour) || 0,
        Total: Number(labor?.rowTotal) || 0,
      };
    });

    var laborData = {
      Subform_5: Subform_5,
      Name: dealData?.Deal_Name + "-sandbox",
      Deal_Name: dealData?.id + "",
    };

    if (dealData?.Labour_Quote_ID) {
      // Update Material_Quote
      var config = {
        Entity: "Labours_Quote",
        APIData: {
          id: dealData?.Labour_Quote_ID,
          ...laborData,
        },
        Trigger: ["workflow"],
      };
      return ZOHO.CRM.API.updateRecord(config)
        .then(function (data) {
          let id = data?.[0]?.details?.id || "";
          return { id: dealData?.Labour_Quote_ID };
        })
        .catch((err) => {
          return { id: dealData?.Labour_Quote_ID };
        });
    } else {
      // Create a new one

      return ZOHO.CRM.API.insertRecord({
        Entity: "Labours_Quote",
        APIData: laborData,
        Trigger: ["workflow"],
      })
        .then(function (data) {
          let id = data?.data?.[0]?.details?.id || "";
          return { id: id };
        })
        .catch((err) => {
          return { id: "" };
        });
    }

    // ZOHO.CRM.API.insertRecord({
    //   Entity: "Labours_Quote",
    //   APIData: laborData,
    //   Trigger: ["workflow"],
    // })
    //   .then(function (data) {
    //     console.log({ createLabor: data });
    //   })
    //   .catch(function (error) {
    //     console.log({ createLaborError: error });
    //   });
  };

  const createEquipment = async (labors, dealData) => {
    var Subform_6 = labors?.map((labor) => {
      return {
        Name1: labor?.name?.Name,
        Days: Number(labor?.days) || 0,
        Direct_Cost_Per_Hour: Number(labor?.directCostPerHour) || 0,
        Hours_Per_Day: Number(labor?.hoursPerDay) || 0,
        Quantity: Number(labor?.quantity) || 0,
      };
    });

    let laborData = {
      Name: dealData?.Deal_Name + "-sandbox",
      Deal_Name: dealData?.id + "",
      Subform_6: Subform_6,
    };

    // ZOHO.CRM.API.insertRecord({
    //   Entity: "Equipments_Quote",
    //   APIData: laborData,
    //   Trigger: ["workflow"],
    // })
    //   .then(function (data) {
    //     console.log({ createEquipment: data });
    //   })
    //   .catch(function (error) {
    //     console.log({ createEquipmentError: error });
    //   });

    if (dealData?.Equipment_Quote_ID) {
      // Update Material_Quote
      var config = {
        Entity: "Equipments_Quote",
        APIData: {
          id: dealData?.Equipment_Quote_ID,
          ...laborData,
        },
        Trigger: ["workflow"],
      };
      return ZOHO.CRM.API.updateRecord(config)
        .then(function (data) {
          let id = data?.[0]?.details?.id || "";
          return { id: dealData?.Equipment_Quote_ID };
        })
        .catch((err) => {
          return { id: dealData?.Equipment_Quote_ID };
        });
    } else {
      // Create a new one

      return ZOHO.CRM.API.insertRecord({
        Entity: "Equipments_Quote",
        APIData: laborData,
        Trigger: ["workflow"],
      })
        .then(function (data) {
          let id = data?.data?.[0]?.details?.id || "";
          return { id: id };
        })
        .catch((err) => {
          return { id: "" };
        });
    }
  };

  const createLodging = async (labors, dealData) => {
    var Subform_7 = labors?.map((labor) => {
      return {
        Days: Number(labor?.days) || 0,
        Crew_Size: Number(labor?.crewSize) || 0,
        Cost_Per_Room: Number(labor?.costPerRoom) || 0,
        Quantity: Number(labor?.numberOfRooms) || 0,
        Total: Number(labor?.lodgingSubTotal) || 0,
      };
    });

    var laborData = {
      Name: dealData?.Deal_Name + "-sandbox",
      Deal_Lookup: dealData?.id + "",
      Subform_7: Subform_7,
    };

    // ZOHO.CRM.API.insertRecord({
    //   Entity: "Lodging",
    //   APIData: laborData,
    //   Trigger: ["workflow"],
    // })
    //   .then(function (data) {
    //     console.log({ createLodging: data });
    //   })
    //   .catch(function (error) {
    //     console.log({ createLodgingError: error });
    //   });

    if (dealData?.Lodging_ID) {
      // Update Material_Quote
      var config = {
        Entity: "Lodging",
        APIData: {
          id: dealData?.Lodging_ID,
          ...laborData,
        },
        Trigger: ["workflow"],
      };
      return ZOHO.CRM.API.updateRecord(config)
        .then(function (data) {
          let id = data?.[0]?.details?.id || "";
          return { id: dealData?.Lodging_ID };
        })
        .catch((err) => {
          return { id: dealData?.Lodging_ID };
        });
    } else {
      // Create a new one

      return ZOHO.CRM.API.insertRecord({
        Entity: "Lodging",
        APIData: laborData,
        Trigger: ["workflow"],
      })
        .then(function (data) {
          let id = data?.data?.[0]?.details?.id || "";
          return { id: id };
        })
        .catch((err) => {
          return { id: "" };
        });
    }
  };

  const createPerDiem = async (labors, dealData) => {
    var Subform_8 = labors?.map((labor) => {
      return {
        Name: labor?.name?.Name,
        Deal_Lookup: dealData?.id,
        Meal_Type: labor?.name?.Name + "",
        Crew_Size: Number(labor?.crewSize) || 0,
        Days: Number(labor?.days) || 0,
        Cost_Per_Day: Number(labor?.costPerDay) || 0,
        Total: Number(labor?.perdiemSubtotal) || 0,
      };
    });

    var laborData = {
      Name: dealData?.Deal_Name + "-sandbox",
      Deal_Lookup: dealData?.id + "",
      Subform_8: Subform_8,
    };

    // ZOHO.CRM.API.insertRecord({
    //   Entity: "Per_Diem",
    //   APIData: laborData,
    //   Trigger: ["workflow"],
    // })
    //   .then(function (data) {
    //     console.log({ createPerDiem: data });
    //   })
    //   .catch(function (error) {
    //     console.log({ createPerDiemError: error });
    //   });
    // Per_Diem_ID

    if (dealData?.Per_Diem_ID) {
      // Update Material_Quote
      var config = {
        Entity: "Per_Diem",
        APIData: {
          id: dealData?.Per_Diem_ID,
          ...laborData,
        },
        Trigger: ["workflow"],
      };
      return ZOHO.CRM.API.updateRecord(config)
        .then(function (data) {
          let id = data?.[0]?.details?.id || "";
          return { id: dealData?.Per_Diem_ID };
        })
        .catch((err) => {
          return { id: dealData?.Per_Diem_ID };
        });
    } else {
      // Create a new one

      return ZOHO.CRM.API.insertRecord({
        Entity: "Per_Diem",
        APIData: laborData,
        Trigger: ["workflow"],
      })
        .then(function (data) {
          let id = data?.data?.[0]?.details?.id || "";
          return { id: id };
        })
        .catch((err) => {
          return { id: "" };
        });
    }
  };

  const createRentalEquipment = (labors, dealData) => {
    var Subform_9 = labors?.map((labor) => {
      return {
        Name1: labor?.equipmentName,
        Deal_Lookup: dealData?.id,
        Rate: Number(labor?.rate) || 0,
        Total: Number(labor?.rentalEquipmentSubtotal) || 0,
        Total_Rental_Equipment_Cost:
          Number(labor?.rentalEquipmentSubtotal) || 0,
      };
    });

    var laborData = {
      Name: dealData?.Deal_Name + "-sandbox",
      Deal_Lookup: dealData?.id,
      Subform_9: Subform_9,
    };

    // ZOHO.CRM.API.insertRecord({
    //   Entity: "Rental_Equipment",
    //   APIData: laborData,
    //   Trigger: ["workflow"],
    // })
    //   .then(function (data) {
    //     console.log({ createRentalEquipment: data });
    //   })
    //   .catch(function (error) {
    //     console.log({ createRentalEquipmentError: error });
    //   });

    if (dealData?.Rental_Equip_ID) {
      // Update Material_Quote
      var config = {
        Entity: "Rental_Equipment",
        APIData: {
          id: dealData?.Rental_Equip_ID,
          ...laborData,
        },
        Trigger: ["workflow"],
      };
      return ZOHO.CRM.API.updateRecord(config)
        .then(function (data) {
          let id = data?.[0]?.details?.id || "";
          return { id: dealData?.Rental_Equip_ID };
        })
        .catch((err) => {
          return { id: dealData?.Rental_Equip_ID };
        });
    } else {
      // Create a new one

      return ZOHO.CRM.API.insertRecord({
        Entity: "Rental_Equipment",
        APIData: laborData,
        Trigger: ["workflow"],
      })
        .then(function (data) {
          let id = data?.data?.[0]?.details?.id || "";
          return { id: id };
        })
        .catch((err) => {
          return { id: "" };
        });
    }
  };

  const createVehicleExpense = async (labors, dealData) => {
    var Subform_10 = labors?.map((labor) => {
      return {
        Mileage: Number(labor?.mileage) || 0,
        Rate: Number(labor?.rate) || 0,
        Total: Number(labor?.vehicleExpenseSubtotal) || 0,
      };
    });

    var laborData = {
      Name: dealData?.Deal_Name + "-sandbox",
      Deal_Name: dealData?.id,
      Subform_10: Subform_10,
    };

    // ZOHO.CRM.API.insertRecord({
    //   Entity: "Vehicle_Expense",
    //   APIData: laborData,
    //   Trigger: ["workflow"],
    // })
    //   .then(function (data) {
    //     console.log({ createVehicleExpense: data });
    //   })
    //   .catch(function (error) {
    //     console.log({ createVehicleExpenseError: error });
    //   });
    //   // Vehicle_Exp_ID

    if (dealData?.Vehicle_Exp_ID) {
      // Update Material_Quote
      var config = {
        Entity: "Vehicle_Expense",
        APIData: {
          id: dealData?.Vehicle_Exp_ID,
          ...laborData,
        },
        Trigger: ["workflow"],
      };
      return ZOHO.CRM.API.updateRecord(config)
        .then(function (data) {
          let id = data?.[0]?.details?.id || "";
          return { id: dealData?.Vehicle_Exp_ID };
        })
        .catch((err) => {
          return { id: dealData?.Vehicle_Exp_ID };
        });
    } else {
      // Create a new one

      return ZOHO.CRM.API.insertRecord({
        Entity: "Vehicle_Expense",
        APIData: laborData,
        Trigger: ["workflow"],
      })
        .then(function (data) {
          let id = data?.data?.[0]?.details?.id || "";
          return { id: id };
        })
        .catch((err) => {
          return { id: "" };
        });
    }
  };

  const saveQuoteData = () => {
    let data = getValues();
    console.log({ data });
    let apiData = {
      Clarification20: JSON.stringify({
        ...data,
        Est_Perform_Date: DateTime.fromISO(
          data?.Est_Perform_Date ||
            dealData?.Est_Perform_Date ||
            DateTime.now().setZone("utc")
        )
          .toISO()
          .toString()
          .substring(0, 10),
        Quote_Due_Date: DateTime.fromISO(
          data?.Quote_Due_Date ||
            dealData?.Quote_Due_Date ||
            DateTime.now().setZone("utc")
        )
          .toISO()
          .toString()
          .substring(0, 10),
      }),
      id: dealData?.id,
    };
    if (data?.Sent_for_Review) {
      apiData["Quote_Status"] = "In Review";
      // apiData["Pipeline"] = "Open";
      apiData["Stage"] = "In Review";
    } else {
      apiData["Quote_Status"] = "In Progress";
      // apiData["Pipeline"] = "Open";
      apiData["Stage"] = "In Progress";
    }

    var config = {
      Entity: "Deals",
      APIData: apiData,
      Trigger: ["workflow"], // ["workflow"]
    };
    ZOHO.CRM.API.updateRecord(config)
      .then(function (updatedData) {
        console.log({ updateRecord: updatedData });
        if (data?.Sent_for_Review && dealData?.Quote_Status === "In Progress") {
          let description =
            "Hello " +
            dealData?.Owner?.name +
            ", You have been selected to review the quote for " +
            dealData?.Account_Name?.name +
            " " +
            dealData?.Deal_Name +
            " has been submitted to the estimating department.";

          description =
            "Hello " +
            dealData?.Owner?.name +
            ", You have been selected to review the quote for " +
            dealData?.Account_Name?.name +
            " for " +
            dealData?.Deal_Name +
            ". Please review, write comments in the notes section, uncheck the 'Submit For Review' checkbox, and update the quote when finished. Click the subject link in the task to open the quote.";

          let module = "Undefined";
          if (dealData?.SourceForm == "Concrete") {
            module = "CustomModule5";
          } else if (dealData?.SourceForm == "Honing") {
            module = "CustomModule4";
          } else if (dealData?.SourceForm == "Coating") {
            module = "CustomModule3";
          }

          let se_module = "Deal";
          if (dealData?.SourceForm == "Concrete") {
            se_module = "Concrete_Bid_Checklists";
          } else if (dealData?.SourceForm == "Honing") {
            se_module = "Honing_Bid_Checklists";
          } else if (dealData?.SourceForm == "Coating") {
            se_module = "Coating_Bid_Checklists";
          }

          let Subject_Link = `https://crmsandbox.zoho.com/crm/boostedcrmsandbox/tab/${module}/${dealData?.BidID}`;
          let task_map = {
            Subject: "Quote Review.",
            $se_module: "Deals",
            Status: "Not Started",
            Priority: "High",
            Send_Notification_Email: true,
            Subject_Link: Subject_Link,
            Description: description,
            What_Id: dealData?.id,
          };

          ZOHO.CRM.API.insertRecord({
            Entity: "Tasks",
            APIData: task_map,
            Trigger: ["workflow"],
          })
            .then(function (data) {
              console.log(data);
              handleClose();
            })
            .catch(function (error) {
              console.log(error);
              handleClose();
            });
        } else {
          handleClose();
        }
      })
      .catch((error) => {
        console.log({ error: error });
        handleClose();
      });
  };

  const tempSave = (data, dealData) => {
    // let data = getValues();
    let apiData = {
      Clarification20: JSON.stringify({
        ...data,
        Est_Perform_Date: DateTime.fromISO(
          data?.Est_Perform_Date ||
            dealData?.Est_Perform_Date ||
            DateTime.now().setZone("utc")
        )
          .toISO()
          .toString()
          .substring(0, 10),
        Quote_Due_Date: DateTime.fromISO(
          data?.Quote_Due_Date ||
            dealData?.Quote_Due_Date ||
            DateTime.now().setZone("utc")
        )
          .toISO()
          .toString()
          .substring(0, 10),
      }),
      id: dealData?.id,
    };
    var config = {
      Entity: "Deals",
      APIData: apiData,
      Trigger: ["workflow"], // ["workflow"]
    };
    console.log({ apiData });
    ZOHO.CRM.API.updateRecord(config)
      .then(function (data) {
        console.log({ updateRecord: data });
        handleClose();
      })
      .catch((error) => {
        console.log({ error: error });
        handleClose();
      });
  };

  const updateDealAndDisable = async (apiData, dealData) => {
    let transition_id = bluprintData?.id;
    // 5031174000000562343
    var BlueprintData = {
      blueprint: [
        {
          transition_id: transition_id,
          data: {
            ...apiData,
            Quote_Calculator: bluprintData?.stage,
          },
        },
      ],
    };
    var config = {
      Entity: "Deals",
      RecordID: dealData?.id,
      BlueprintData: BlueprintData,
    };

    ZOHO.CRM.API.updateBluePrint(config)
      .then(function (data) {
        console.log({ updateBluePrint: data });
        // handleClose();
      })
      .catch(function (error) {
        console.log({ updateBluePrintEerror: error });
        // handleClose();
      });

    // var config = {
    //   Entity: "Deals",
    //   APIData: apiData,
    //   Trigger: ["workflow"],
    // };

    // ZOHO.CRM.API.updateRecord(config)
    //   .then(function (data) {
    //     console.log({ updateDealAndDisable: data });
    //     // ZOHO.CRM.BLUEPRINT.proceed();

    //     // handleClose();
    //   })
    //   .catch((error) => {
    //     console.log({ updateDealAndDisableError: error });
    //     // handleClose();
    //   });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    console.log({ onSubmit: data });
    // Create quote and update deal

    //  materialsSubTotal,
    let updateDealData = {};
    const {
      materials = [],
      labor = [],
      equipment = [],
      lodging = [],
      perdiem = [],
      rentalequipment = [],
      vehicleexpense = [],
      Clarifications = [],
    } = data;
    // Material_Quote
    if (materials?.length >= 1) {
      const materialData = await createMaterial(materials, dealData);
      updateDealData["Material_Quote_ID"] = materialData?.id || "";
      console.log({ updateDealData });
    }

    if (labor?.length >= 1) {
      // createLabor(labor, dealData);

      const LabourData = await createLabor(labor, dealData);
      updateDealData["Labour_Quote_ID"] = LabourData?.id || "";
      console.log({ updateDealData });
    }

    if (equipment?.length >= 1) {
      const LabourData = await createEquipment(equipment, dealData);
      updateDealData["Equipment_Quote_ID"] = LabourData?.id || "";
      console.log({ updateDealData });
    }
    if (lodging?.length >= 1) {
      const LabourData = await createLodging(lodging, dealData);
      updateDealData["Lodging_ID"] = LabourData?.id || "";
      console.log({ updateDealData });
    }
    if (perdiem?.length >= 1) {
      const LabourData = await createPerDiem(perdiem, dealData);
      updateDealData["Per_Diem_ID"] = LabourData?.id || "";
      console.log({ updateDealData });
    }

    if (rentalequipment?.length >= 1) {
      const LabourData = await createRentalEquipment(rentalequipment, dealData);
      updateDealData["Rental_Equip_ID"] = LabourData?.id || "";
      console.log({ updateDealData });
    }

    if (vehicleexpense?.length >= 1) {
      // createVehicleExpense(vehicleexpense, dealData);
      const LabourData = await createVehicleExpense(vehicleexpense, dealData);
      updateDealData["Vehicle_Exp_ID"] = LabourData?.id || "";
      console.log({ updateDealData });
    }
    /*
     */
    let clarificationObject = {};
    Clarifications.forEach((Clarification, index) => {
      clarificationObject[`Clarification${index + 1}`] = Clarification?.name;
    });
    updateDealData = {
      ...updateDealData,
      ...clarificationObject,
      Materials_Cost: Number(data?.materialTotalCost) || 0,
      Total_Manhours: Number(data?.totalManHours) || 0,
      Labor_Cost: Number(data?.totalLaborCost) || 0,
      Total_Equipment_Hours: Number(data?.totalEquipmentHours) || 0,
      Equipment_Cost: Number(data?.equipmentTotal) || 0,
      Miscellaneous_Cost: Number(data?.miscellaneousCost) || 0,
      Rev_Per_Manhour: Number(data?.totalManHours) || 0,
      Quoted_Gross_Profit: Number(data?.grossProfitPct) || 0,
      Quoted_Gross_Profit_Amount: Number(data?.grossProfitAmount) || 0,
      Amount: Number(data?.bidToCustomer) || 0,
      Minimum_Bid_to_the_Customer: Number(data?.minimumBidToCustomer) || 0,
      Est_Perform_Date: DateTime.fromISO(
        data?.Est_Perform_Date ||
          dealData?.Est_Perform_Date ||
          DateTime.now().setZone("utc")
      )
        .toISO()
        .toString()
        .substring(0, 10),
      Est_Perform_Date1: DateTime.fromISO(
        data?.Est_Perform_Date ||
          dealData?.Est_Perform_Date ||
          DateTime.now().setZone("utc")
      )
        .toISO()
        .toString()
        .substring(0, 10),
      Estimated_Perform_Date: DateTime.fromISO(
        data?.Est_Perform_Date ||
          dealData?.Est_Perform_Date ||
          DateTime.now().setZone("utc")
      )
        .toISO()
        .toString()
        .substring(0, 10),
      Quote_Due_Date: DateTime.fromISO(
        data?.Quote_Due_Date ||
          dealData?.Quote_Due_Date ||
          DateTime.now().setZone("utc")
      )
        .toISO()
        .toString()
        .substring(0, 10),
      Actual_Materials_Cost: 0,
      Total_Man_Hours: 0,
      Actual_Equipment_Cost: 0,
      Actual_Equipment_Hours: 0,
      Total_Square_Feet: 0,
      Change_Order_Manhours: 0,
      Actual_Change_Order_Cost: 0,
      Final_Gross_Profit: 0,
      Final_Total_Cost: 0,
      Actual_Gross_Profit_Percentage: 0,
      Clarification20: JSON.stringify({
        ...data,
        Est_Perform_Date: DateTime.fromISO(
          data?.Est_Perform_Date || DateTime.now().setZone("utc")
        )
          .toISO()
          .toString()
          .substring(0, 10),
        Quote_Due_Date: DateTime.fromISO(
          data?.Quote_Due_Date || DateTime.now().setZone("utc")
        )
          .toISO()
          .toString()
          .substring(0, 10),
      }),
      Is_Quote_Completed: data?.Is_Quote_Completed,
      id: dealData?.id
    };

    if (data?.Is_Quote_Completed) {
      updateDealData["Quote_Status"] = "Completed";
      // apiData["Pipeline"] = "Open";
      updateDealData["Stage"] = "Open";
    } else if (data?.Sent_for_Review) {
      updateDealData["Quote_Status"] = "In Review";
      // apiData["Pipeline"] = "Open";
      if (!dealData?.Is_Quote_Completed) {
        updateDealData["Stage"] = "In Review";
      }
    } else {
      updateDealData["Quote_Status"] = "In Progress";
      // apiData["Pipeline"] = "Open";
      updateDealData["Stage"] = "In Progress";
    }

    console.log({ final: updateDealData });
    await updateDealAndDisable(updateDealData, dealData);
    // tempSave(updateDealData, dealData);

    let taskSubject = "Your quote has been submitted for review";
    let taskFound = taskList.includes(taskSubject);
    if (data?.Sent_for_Review && !taskFound) {
      let description =
        "Hello " +
        dealData?.Owner?.name +
        ", the Bid Checklist for " +
        dealData?.Account_Name?.name +
        " " +
        dealData?.Deal_Name +
        " has been submitted to the estimating department.";
      let task_map = {
        Subject: taskSubject,
        $se_module: "Deals",
        Description: description,
        What_Id: dealData?.id,
      };

      ZOHO.CRM.API.insertRecord({
        Entity: "Tasks",
        APIData: task_map,
        Trigger: ["workflow"],
      })
        .then(function (data) {
          console.log(data);
          handleClose();
        })
        .catch(function (error) {
          console.log(error);
          handleClose();
        });
    } else {
      handleClose();
    }
    /*
     */
  };

  return (
    <Box sx={{ width: "100%" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step
              key={label}
              onClick={handleStep(index)}
              sx={{ cursor: "pointer" }}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box>
          <br />
          {activeStep === 0 && (
            <XtremeQuoteForm
              dealData={dealData}
              control={control}
              watch={watch}
              checklistData={checklistData}
              quoteType={quoteType}
            />
          )}
          {activeStep === 1 && (
            <MaterialCosts
              dealData={dealData}
              products={products}
              control={control}
              watch={watch}
              getValues={getValues}
              setValue={setValue}
              register={register}
            />
          )}
          {activeStep === 2 && (
            <LaborCosts
              dealData={dealData}
              ZOHO={ZOHO}
              control={control}
              watch={watch}
              getValues={getValues}
              setValue={setValue}
              register={register}
            />
          )}
          {activeStep === 3 && (
            <EquipmentCost
              dealData={dealData}
              ZOHO={ZOHO}
              control={control}
              watch={watch}
              getValues={getValues}
              setValue={setValue}
              register={register}
            />
          )}
          {activeStep === 4 && (
            <Lodging
              dealData={dealData}
              control={control}
              watch={watch}
              getValues={getValues}
              register={register}
              setValue={setValue}
            />
          )}
          {activeStep === 5 && (
            <PerDiem
              dealData={dealData}
              control={control}
              watch={watch}
              getValues={getValues}
              register={register}
              setValue={setValue}
            />
          )}
          {activeStep === 6 && (
            <RentalEquipment
              dealData={dealData}
              control={control}
              watch={watch}
              getValues={getValues}
              setValue={setValue}
              register={register}
            />
          )}
          {activeStep === 7 && (
            <VehicleExpense
              dealData={dealData}
              control={control}
              watch={watch}
              getValues={getValues}
              register={register}
              setValue={setValue}
            />
          )}
          {activeStep === 8 && (
            <Calculation
              ZOHO={ZOHO}
              control={control}
              dealData={dealData}
              watch={watch}
              setValue={setValue}
              getValues={getValues}
              register={register}
              unregister={unregister}
              checklistData={checklistData}
              quoteType={quoteType}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2, gap: 2 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button onClick={handleClose}>Cancel</Button>

          {/* {!dealData?.Quote_Calculator && (
            <Button variant="contained" color="success" onClick={saveQuoteData}>
              Save
            </Button>
          )} */}

          {activeStep === steps.length - 1 ? (
            <Box sx={{ m: 1, position: "relative" }}>
              <Button variant="contained" disabled={loading} type="submit">
                Accept terms
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Box>
          ) : (
            <></>
          )}

          {activeStep != steps.length - 1 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ArrowRightAltIcon />}
            >
              Next
            </Button>
          ) : (
            <></>
          )}
        </Box>
        {activeStep === steps.length && (
          <Box>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - Calculate to go back.
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        )}
      </form>
    </Box>
  );
}
