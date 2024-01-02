import React, { useState } from "react";
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
  const { control, handleSubmit, register, watch, getValues, setValue } =
    useForm({
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

  const updateDeal = (data, dealData) => {
    let apiData = {
      Clarification20: JSON.stringify({
        ...data,
        EstPerformDate: data?.EstPerformDate.toISO()
          .toString()
          .substring(0, 10),
        QuoteDueDate: data?.QuoteDueDate.toISO().toString().substring(0, 10),
      }),
      id: dealData?.id,
    };
    var config = {
      Entity: "Deals",
      APIData: apiData,
      Trigger: ["workflow"], // ["workflow"]
    };
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

  const updateDealAndDisable = (apiData, dealData) => {
    var config = {
      Entity: "Deals",
      APIData: apiData,
      Trigger: ["workflow"], // ["workflow"]
    };
    ZOHO.CRM.API.updateRecord(config)
      .then(function (data) {
        console.log({ updateDealAndDisable: data });
        handleClose();
      })
      .catch((error) => {
        console.log({ updateDealAndDisableError: error });
        handleClose();
      });
  };

  const onSubmit = (data) => {
    console.log({ onSubmit: data });
    activeStep === steps.length - 1;
    if (activeStep === steps.length - 1) {
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
      createMaterial(materials, dealData);
      createLabor(labor, dealData);
      createEquipment(equipment, dealData);
      createLodging(lodging, dealData);
      createPerDiem(perdiem, dealData);
      createRentalEquipment(rentalequipment, dealData);
      createVehicleExpense(vehicleexpense, dealData);

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
        Est_Perform_Date: data?.EstPerformDate.toISO()
          .toString()
          .substring(0, 10),
        Est_Perform_Date1: data?.EstPerformDate.toISO()
          .toString()
          .substring(0, 10),
        Estimated_Perform_Date: data?.EstPerformDate.toISO()
          .toString()
          .substring(0, 10),
        Quote_Due_Date: data?.QuoteDueDate.toISO().toString().substring(0, 10),
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
          EstPerformDate: data?.EstPerformDate.toISO()
            .toString()
            .substring(0, 10),
          QuoteDueDate: data?.QuoteDueDate.toISO().toString().substring(0, 10),
        }),
        id: dealData?.id,
      };

      // Service: "some",
      // Vendor_Type1: "some",
      // Quoting_Notes: "some",
      // Rate_Per_Sq_Ft: "some",
      // Bid_to_Customer: "some",

      updateDealAndDisable(updateDealData);
    } else {
      updateDeal(data, dealData);
    }
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
              watch={watch}
              setValue={setValue}
              getValues={getValues}
              register={register}
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
          <Button type="submit" variant="contained" color="success">
            Save
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" type="submit">
              Update Deal
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ArrowRightAltIcon />}
            >
              Next
            </Button>
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
