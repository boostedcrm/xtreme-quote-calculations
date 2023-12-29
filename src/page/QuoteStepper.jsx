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

  const onSubmit = (data) => {
    console.log({ onSubmit: data });
    let apiData = { Clarification20: JSON.stringify(data), id: dealData?.id };
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
