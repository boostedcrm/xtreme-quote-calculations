import React, { useState } from "react";
import { DateTime } from "luxon";

import {
  Box,
  Button,
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
  setPage,
  handleClose,
  dealData,
  products,
  ZOHO,
  checklistData,
  quoteType,
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

  const createMaterial = (materials, dealData) => {
    var materialData = materials?.map((material) => {
      return {
        Name: material?.product?.Product_Name,
        Size: material?.size || "" + "",
        Deal_Name: dealData?.id,
        Coverage: Number(material?.coverage) || 0,
        Price_Per: Number(material?.pricePer) || 0,
        Amount: Number(material?.amount) || 0,
        Material_Total: Number(material?.total) || 0,
      };
    });

    ZOHO.CRM.API.insertRecord({
      Entity: "Material_Quote",
      APIData: materialData,
      Trigger: ["workflow"],
    }).then(function (data) {
      console.log({ createMaterial: data });
    });
  };

  const createLabor = (labors, dealData) => {
    var laborData = labors?.map((labor) => {
      return {
        Name: labor?.resourceTitle?.Name,
        Deal_Name: dealData?.id,
        Time_Frame_Day_Week_Task: labor?.timeFrame || "" + "",
        Days: Number(labor?.days) || 0,
        Hours_Per_Day: Number(labor?.hoursPerDay) || 0,
        Men: Number(labor?.men) || 0,
        Cost_Per_Hour: Number(labor?.costPerHour) || 0,
        Total: Number(labor?.rowTotal) || 0,
      };
    });

    ZOHO.CRM.API.insertRecord({
      Entity: "Labours_Quote",
      APIData: laborData,
      Trigger: ["workflow"],
    })
      .then(function (data) {
        console.log({ createLabor: data });
      })
      .catch(function (error) {
        console.log({ createLaborError: error });
      });
  };

  const createEquipment = (labors, dealData) => {
    var laborData = labors?.map((labor) => {
      return {
        Name: labor?.name?.Name,
        Deal_Name: dealData?.id,
        Days: Number(labor?.days) || 0,
        Direct_Cost_Per_Hour: Number(labor?.directCostPerHour) || 0,
        Hours_Per_Day: Number(labor?.hoursPerDay) || 0,
        Quantity: Number(labor?.quantity) || 0,
      };
    });

    ZOHO.CRM.API.insertRecord({
      Entity: "Equipments_Quote",
      APIData: laborData,
      Trigger: ["workflow"],
    })
      .then(function (data) {
        console.log({ createEquipment: data });
      })
      .catch(function (error) {
        console.log({ createEquipmentError: error });
      });
  };

  const createLodging = (labors, dealData) => {
    var laborData = labors?.map((labor) => {
      return {
        Name: dealData?.Deal_Name,
        Deal_Lookup: dealData?.id,
        Days: Number(labor?.days) || 0,
        Crew_Size: Number(labor?.crewSize) || 0,
        Cost_Per_Room: Number(labor?.costPerRoom) || 0,
        Quantity: Number(labor?.numberOfRooms) || 0,
        Total: Number(labor?.lodgingSubTotal) || 0,
      };
    });

    ZOHO.CRM.API.insertRecord({
      Entity: "Lodging",
      APIData: laborData,
      Trigger: ["workflow"],
    })
      .then(function (data) {
        console.log({ createLodging: data });
      })
      .catch(function (error) {
        console.log({ createLodgingError: error });
      });
  };

  const createPerDiem = (labors, dealData) => {
    var laborData = labors?.map((labor) => {
      return {
        Name: labor?.name?.Name,
        Deal_Lookup: dealData?.id,
        Days: Number(labor?.days) || 0,
        Cost_Per_Day: Number(labor?.costPerDay) || 0,
        Crew_Size: Number(labor?.crewSize) || 0,
        Meal_Type: labor?.name?.Name + "",
        Total: Number(labor?.perdiemSubtotal) || 0,
      };
    });

    ZOHO.CRM.API.insertRecord({
      Entity: "Per_Diem",
      APIData: laborData,
      Trigger: ["workflow"],
    })
      .then(function (data) {
        console.log({ createPerDiem: data });
      })
      .catch(function (error) {
        console.log({ createPerDiemError: error });
      });
  };

  const createRentalEquipment = (labors, dealData) => {
    var laborData = labors?.map((labor) => {
      return {
        Name: labor?.equipmentName,
        Deal_Lookup: dealData?.id,
        Rate: Number(labor?.rate) || 0,
        Total: Number(labor?.rentalEquipmentSubtotal) || 0,
        Total_Rental_Equipment_Cost:
          Number(labor?.rentalEquipmentSubtotal) || 0,
      };
    });

    ZOHO.CRM.API.insertRecord({
      Entity: "Rental_Equipment",
      APIData: laborData,
      Trigger: ["workflow"],
    })
      .then(function (data) {
        console.log({ createRentalEquipment: data });
      })
      .catch(function (error) {
        console.log({ createRentalEquipmentError: error });
      });
  };

  const createVehicleExpense = (labors, dealData) => {
    var laborData = labors?.map((labor) => {
      return {
        Name: dealData?.Deal_Name || "Test",
        Deal_Name: dealData?.id,
        Mileage: Number(labor?.mileage) || 0,
        Rate: Number(labor?.rate) || 0,
        Total: Number(labor?.vehicleExpenseSubtotal) || 0,
      };
    });

    ZOHO.CRM.API.insertRecord({
      Entity: "Vehicle_Expense",
      APIData: laborData,
      Trigger: ["workflow"],
    })
      .then(function (data) {
        console.log({ createVehicleExpense: data });
      })
      .catch(function (error) {
        console.log({ createVehicleExpenseError: error });
      });
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

  const updateDealAndDisable = (apiData, dealData) => {
    let transition_id = "5031174000000562282";
    var BlueprintData = {
      blueprint: [
        {
          transition_id: transition_id,
          data: {
            ...apiData,
            Quote_Calculator: "Calculate Quote",
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
        handleClose();
      })
      .catch(function (error) {
        console.log({ updateBluePrintEerror: error });
        handleClose();
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

  const onSubmit = (data) => {
    console.log({ onSubmit: data });
    // Create quote and update deal

    //  materialsSubTotal,
    const {
      materials = [],
      labor = [],
      equipment = [],
      lodging = [],
      perdiem = [],
      rentalequipment = [],
      vehicleexpense = [],
    } = data;
    // Material_Quote
    if (materials?.length >= 1) {
      createMaterial(materials, dealData);
    }
    if (labor?.length >= 1) {
      createLabor(labor, dealData);
    }
    if (equipment?.length >= 1) {
      createEquipment(equipment, dealData);
    }
    if (lodging?.length >= 1) {
      createLodging(lodging, dealData);
    }
    if (perdiem?.length >= 1) {
      createPerDiem(perdiem, dealData);
    }
    if (rentalequipment?.length >= 1) {
      createRentalEquipment(rentalequipment, dealData);
    }
    if (vehicleexpense?.length >= 1) {
      createVehicleExpense(vehicleexpense, dealData);
    }

    let updateDealData = {
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
      id: dealData?.id,
    };

    
    updateDealData["Quote_Status"] = "Completed";
    // apiData["Pipeline"] = "Open";
    updateDealData["Stage"] = "Quote Completed";

    data?.Clarifications?.forEach((element, index) => {
      updateDealData[`Clarification${index + 1}`] = element?.name;
    });
    updateDealAndDisable(updateDealData, dealData);

    // if (data?.Sent_for_Review) {
    // } else {
    //   handleClose();
    // }

    // Service: "some",
    // Vendor_Type1: "some",
    // Quoting_Notes: "some",
    // Rate_Per_Sq_Ft: "some",
    // Bid_to_Customer: "some",
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
              control={control}
              watch={watch}
              getValues={getValues}
              register={register}
              setValue={setValue}
            />
          )}
          {activeStep === 5 && (
            <PerDiem
              control={control}
              watch={watch}
              getValues={getValues}
              register={register}
              setValue={setValue}
            />
          )}
          {activeStep === 6 && (
            <RentalEquipment
              control={control}
              watch={watch}
              getValues={getValues}
              setValue={setValue}
              register={register}
            />
          )}
          {activeStep === 7 && (
            <VehicleExpense
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

          {!dealData?.Quote_Calculator && (
            <Button variant="contained" color="success" onClick={saveQuoteData}>
              Save
            </Button>
          )}

          {activeStep === steps.length - 1 && !dealData?.Quote_Calculator ? (
            <Button variant="contained" type="submit">
              Update Deal
            </Button>
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
