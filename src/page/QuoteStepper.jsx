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
  const { control, handleSubmit, register, watch, getValues, setValue } =
    useForm({
      defaultValues: {
        materialsSubTotal: 1466.76,
        materialWasteShipCost: 234.6816,
        materialTax: 88.0056,
        materialTotalCost: 1789.4472,
        materials: [
          {
            name: "",
            size: "2.75 kit",
            coverage: 500,
            amount: "3",
            pricePer: 304.32,
            total: 912.96,
            id: "d18e269a-f76f-4e67-84d8-3c01b7302df6",
            product: {
              Product_Category: null,
              Qty_in_Demand: 0,
              Owner: {
                name: "Xtreme Coating Solutions",
                id: "5031174000000442001",
                email: "info@xtreme-coat.com",
              },
              $currency_symbol: "$",
              $field_states: null,
              Size: "2.75 kit",
              $photo_id: null,
              $review_process: {
                approve: false,
                reject: false,
                resubmit: false,
              },
              Tax: [],
              Cost: null,
              Product_Active: false,
              $review: null,
              $state: "save",
              $process_flow: false,
              $locked_for_me: false,
              id: "5031174000000641057",
              $approved: true,
              $approval: {
                delegate: false,
                approve: false,
                reject: false,
                resubmit: false,
              },
              Modified_Time: "2023-12-22T13:30:39-05:00",
              Created_Time: "2023-12-21T08:26:06-05:00",
              Measured_By: "Gal",
              Product_Name: "4660 (urethane) Topcoat",
              $taxable: false,
              $editable: true,
              Coverage_Rate_per_Gallon: 500,
              $orchestration: false,
              Usage_Unit: "Gal",
              Qty_Ordered: 0,
              $in_merge: false,
              $status: "cm_9-9",
              Locked__s: false,
              Qty_in_Stock: 0,
              Tag: [],
              $approval_state: "approved",
              Unit_Price: 304.32,
              Taxable: false,
              Reorder_Level: 0,
            },
          },
          {
            name: "",
            size: "3 gal",
            coverage: 630,
            amount: "2",
            pricePer: 276.9,
            total: 553.8,
            id: "f8428563-d1ee-43fa-9cf1-c4ade846c8d0",
            product: {
              Product_Category: "Concrete",
              Qty_in_Demand: 0,
              Owner: {
                name: "Xtreme Coating Solutions",
                id: "5031174000000442001",
                email: "info@xtreme-coat.com",
              },
              $currency_symbol: "$",
              $field_states: null,
              Size: "3 gal",
              $photo_id: null,
              $review_process: {
                approve: false,
                reject: false,
                resubmit: false,
              },
              Tax: [],
              Cost: null,
              Product_Active: false,
              $review: null,
              $state: "save",
              $process_flow: false,
              $locked_for_me: false,
              id: "5031174000000641064",
              $approved: true,
              $approval: {
                delegate: false,
                approve: false,
                reject: false,
                resubmit: false,
              },
              Modified_Time: "2023-12-22T13:30:39-05:00",
              Created_Time: "2023-12-21T08:26:06-05:00",
              Measured_By: "Gal",
              Product_Name: "8020 Crown Polymers Polyaspartic",
              $taxable: false,
              $editable: true,
              Coverage_Rate_per_Gallon: 630,
              $orchestration: false,
              Usage_Unit: "Gal",
              Qty_Ordered: 0,
              $in_merge: false,
              $status: "cm_9-9",
              Locked__s: false,
              Qty_in_Stock: 0,
              Tag: [],
              $approval_state: "approved",
              Unit_Price: 276.9,
              Taxable: false,
              Reorder_Level: 0,
            },
          },
        ],
        miscellaneousCost: 1693.1000000000001,
        totalCost: 10802.5472,
        grossProfitGoal: 18218.8944,
        totalManHours: 60,
        totalLaborCost: 7200,
        labor: [
          {
            resourceTitle: {
              Owner: {
                name: "Xtreme Coating Solutions",
                id: "5031174000000442001",
                email: "info@xtreme-coat.com",
              },
              Email: null,
              $currency_symbol: "$",
              $field_states: null,
              $photo_id: null,
              $review_process: {
                approve: false,
                reject: false,
                resubmit: false,
              },
              Name: "Project Manager",
              Last_Activity_Time: null,
              Record_Image: null,
              Modified_By: {
                name: "Xtreme Coating Solutions",
                id: "5031174000000442001",
                email: "info@xtreme-coat.com",
              },
              $review: null,
              $state: "save",
              Unsubscribed_Mode: null,
              $process_flow: false,
              $locked_for_me: false,
              id: "5031174000000651028",
              Email_Opt_Out: false,
              $approved: true,
              $approval: {
                delegate: false,
                approve: false,
                reject: false,
                resubmit: false,
              },
              Modified_Time: "2023-12-21T13:48:50-05:00",
              Created_Time: "2023-12-21T13:48:50-05:00",
              Rate: 60,
              Unsubscribed_Time: null,
              $editable: true,
              $orchestration: false,
              $in_merge: false,
              $status: "c_9",
              Locked__s: false,
              Created_By: {
                name: "Xtreme Coating Solutions",
                id: "5031174000000442001",
                email: "info@xtreme-coat.com",
              },
              Tag: [],
              $zia_owner_assignment: "owner_recommendation_unavailable",
              Secondary_Email: null,
              $approval_state: "approved",
            },
            timeFrame: "2",
            days: "3",
            hoursPerDay: "4",
            men: "5",
            costPerHour: 60,
            rowTotal: 7200,
            id: "85cae270-2569-4ff3-8813-5fbec982796d",
          },
        ],
        totalEquipmentHours: 12,
        equipmentTotal: 120,
        equipment: [
          {
            name: {
              Owner: {
                name: "Xtreme Coating Solutions",
                id: "5031174000000442001",
                email: "info@xtreme-coat.com",
              },
              Email: null,
              $currency_symbol: "$",
              $field_states: null,
              $photo_id: null,
              $review_process: {
                approve: false,
                reject: false,
                resubmit: false,
              },
              Name: "Edco Edge Grinder",
              Last_Activity_Time: null,
              Record_Image: null,
              Modified_By: {
                name: "Xtreme Coating Solutions",
                id: "5031174000000442001",
                email: "info@xtreme-coat.com",
              },
              $review: null,
              $state: "save",
              Unsubscribed_Mode: null,
              $process_flow: false,
              $locked_for_me: false,
              id: "5031174000000650033",
              Email_Opt_Out: false,
              $approved: true,
              $approval: {
                delegate: false,
                approve: false,
                reject: false,
                resubmit: false,
              },
              Modified_Time: "2023-12-21T13:47:22-05:00",
              Created_Time: "2023-12-21T13:47:22-05:00",
              Rate: 5,
              Unsubscribed_Time: null,
              $editable: true,
              $orchestration: false,
              $in_merge: false,
              $status: "c_9",
              Locked__s: false,
              Created_By: {
                name: "Xtreme Coating Solutions",
                id: "5031174000000442001",
                email: "info@xtreme-coat.com",
              },
              Tag: [],
              $zia_owner_assignment: "owner_recommendation_unavailable",
              Secondary_Email: null,
              $approval_state: "approved",
            },
            quantity: "2",
            days: "3",
            hoursPerDay: "4",
            directCostPerHour: 5,
            equipmentSubTotal: 120,
            id: "81270508-4cab-4b44-8c76-699d7db9cd7a",
          },
        ],
        totallodgingCost: 1440,
        lodging: [
          {
            crewSize: "6",
            days: "3",
            costPerRoom: 160,
            numberOfRooms: 3,
            lodgingSubTotal: 1440,
          },
        ],
        totalperdiemCost: 120,
        perdiem: [
          {
            name: {
              id: 1,
              Name: "75+ Miles",
              costPerDay: 12,
            },
            size: "",
            coverage: "",
            amount: "",
            pricePer: "",
            id: "086312e7-0a32-4d32-866b-5cadb44a043c",
            crewSize: "5",
            days: "2",
            costPerDay: 12,
            perdiemSubtotal: 120,
          },
        ],
        totalrentalEquipmenCost: 127.2,
        rentalequipment: [
          {
            equipmentName: "tst",
            rate: "120",
            tax: 7.199999999999999,
            rentalEquipmentSubtotal: 127.2,
          },
        ],
        totalVehicleExpenseCost: 5.8999999999999995,
        vehicleexpense: [
          {
            mileage: "10",
            rate: 0.59,
            vehicleExpenseSubtotal: 5.8999999999999995,
          },
        ],
        field2: "2242.78",
        travelAndMisc: "2242.78",
        field3: "2242.78",
        commission: 995.59972,
        commissionPercentage: "5",
        minimumBidToCustomer: 20907.594119999998,
        field4: "",
        grossProfitAmount: 9109.447199999997,
        grossProfitPct: "",
        commissionPercentageFinal: "",
        finalCommission: "",
        totalCostPercentage: "",
        finalTotalCost: "",
        actualGrossProfitPercentage: "",
        finalGrossProfit: "",
        revenuePerSquareFoot: "",
        revenuePerManHour: "",
        serviceOnQuote: "Fountain Restoration",
        ratePerSquareFootCurrency: "8.97",
        Classification_1:
          "Residential Customers - A deposit of 50% of the total project price is required prior to scheduling a date for the project to be performed. The balance is due upon project completion.",
        Classification_2:
          "Residential Customers - A deposit of 50% of the total project price is required prior to scheduling a date for the project to be performed. The balance is due upon project completion.",
        Classification_3:
          "Pricing may be adjusted pending examination of the floor following the demo/removal of any tile, VCT or carpet.",
        Classification_4:
          "Customer to provide standard electric, water, lighting and containers for disposal of any grinding debris",
        Classification_5: "Dry times",
        Classification_6: "Anything discussed or talked about reference here",
        Classification_7:
          "Customer is responsible for providing access (elevator, lift, etc.) to any floors / work areas that are above grade for Xtreme's materials, equipment and personnel.",
        Classification_8:
          "Work area each day is to be free and clear of other trades and or any moveable obstruction",
        Classification_9:
          "Customer is responsible for protecting the floor. Xtreme is not responsible for damages that occur while not onsite, or due to other trades",
        Classification_10: "Quartz color to be approved before mobilization",
        Classification_11: "Stain color to be approved before mobilization",
        Classification_12:
          "Epoxy chip size and color to be approved before mobilization",
        Classification_13:
          "Grout coat is not included in the above proposal. If required it will be performed at $0.95/SF",
        Classification_14: "Grout coat is included in the above proposal",
        Classification_15:
          "Patching and repair is not included in the above proposal, if required it will be performed at T&M",
        Classification_16:
          "Patching and repair is included in the above proposal",
        Classification_17:
          "Joint fill is not included in the above price. If required this will be performed at $3.00/LF. Joint fill is defined as control joints / saw cuts and does not include expansion, isolation or construction joints.",
        Classification_18:
          "Joint fill is included in the above SF price. Joint fill is defined as control joints / saw cuts and does not include expansion, isolation or construction joints.",
        Classification_19:
          "Pricing is based on the entire scope of work above being performed. Any change in the above scope will result in a price revision.",
        Classification_20:
          "Pricing is based on one mobilization. Each additional MOB will result in a charge of $______/MOB",
        Classification_21: "Any additional information or discussion",
        Classification_22: "Matte coat / Gloss coat",
        Classification_23: "Walls are included / Walls are not included.",
        Classification_24:
          "12 hour cure time is required (no foot traffic for 12 hours once coating is applied).",
        Classification_25:
          "Work area each day is to be free and clear of other trades and or any moveable obstruction.",
        Classification_26:
          "Xtreme is not responsible for damages incurred while not onsite, or due to other trades.",
        Classification_27:
          "Pricing is based on the entire scope of work above being performed. Any change in the above scope will result in a price revision.",
        Classification_28:
          "Pricing is based on a site visit and field measurements or plans submitted by _____________________________.",
        Classification_29:
          "Pricing is based on one mobilization. Each additional MOB will result in a charge of $500 / MOB locally, $750 / MOB over 50 miles, and $1,000 / MOB over 100 miles.",
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
    console.log({ onSubmit: data });
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
