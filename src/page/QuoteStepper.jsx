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
}) {
  const { control, handleSubmit, register, watch, getValues, setValue } = useForm({
    defaultValues: {
      labor: [
        {
          resourceTitle: "",
          timeFrame: "",
          days: "",
          hoursPerDay: "",
          men: "",
          costPerHour: "",
        },
      ],
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleCalculate = () => {
    setPage("Home");
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = (data) => {
    console.log(data);
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
              register={register}
            />
          )}
          {activeStep === 3 && (
            <EquipmentCost
              ZOHO={ZOHO}
              control={control}
              watch={watch}
              getValues={getValues}
              register={register}
            />
          )}
          {activeStep === 4 && (
            <Lodging
              control={control}
              watch={watch}
              getValues={getValues}
              register={register}
            />
          )}
          {activeStep === 5 && (
            <PerDiem
              control={control}
              watch={watch}
              getValues={getValues}
              register={register}
            />
          )}
          {activeStep === 6 && (
            <RentalEquipment
              control={control}
              watch={watch}
              getValues={getValues}
              register={register}
            />
          )}
          {activeStep === 7 && (
            <VehicleExpense
              control={control}
              watch={watch}
              getValues={getValues}
              register={register}
            />
          )}
          {activeStep === 8 && (
            <Calculation
            ZOHO={ZOHO}
              control={control}
              watch={watch}
              getValues={getValues}
              register={register}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2, gap: 2 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} variant="contained" color="success">
            Save
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" type="submit">
              Calculate
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
