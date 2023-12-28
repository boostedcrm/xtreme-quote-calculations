import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";

export default function Calculation({
  ZOHO,
  control,
  watch,
  getValues,
  register,
  setValue,
}) {
  const [clarifications, setClarifications] = useState(null);

  useEffect(() => {
    async function getData() {
      ZOHO.CRM.API.getAllRecords({
        Entity: "Clarifications",
        sort_order: "asc",
        per_page: 200,
        page: 1,
      }).then(function (data) {
        setClarifications(data?.data);
      });
    }
    getData();
  }, [ZOHO]);

  const removeClarification = (index) => {
    const newClarifications = clarifications.filter((_, i) => i !== index);
    setClarifications(newClarifications);
  };

  return (
    <Box p={2}>
      <Grid containe style={{ marginBottom: "15px" }}>
        {renderTextField(
          `miscellaneousCost`,
          "Miscellaneous cost",
          "",
          control
        )}
      </Grid>
      <Grid container spacing={2} style={{ marginBottom: "15px" }}>
        {renderTextField(`totalCost`, "Total Cost", "", control)}
      </Grid>
      <Grid container spacing={2} style={{ marginBottom: "15px" }}>
        {renderTextField(
          `grossProfitGoal`,
          "Gross Profit Goal at 50%",
          "2242.78",
          control
        )}
        {renderTextField(`field2`, "", "2242.78", control)}{" "}
        {/* Replace with actual label */}
        {renderTextField(
          `travelAndMisc`,
          "Travel and Misc",
          "2242.78",
          control
        )}
        {renderTextField(`field3`, "", "2242.78", control)}{" "}
        {/* Replace with actual label */}
      </Grid>
      <Grid container>
        {renderTextField(`commission`, "Commission", "", control)}
        <Grid item xs={6}>
          <Controller
            name={`commissionPercentage`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{ width: 350 }} // Set the width to 300px
                label={"Commission Percentage"}
                variant="outlined"
                size="small"
                margin="normal"
                type="number"
                onChange={(e) => {
                  let grossProfitGoal = Number(
                    getValues(`grossProfitGoal`) || 0
                  );
                  let Commission_Percentage = Number(e.target.value) || 5;
                  let miscellaneousCost = Number(
                    getValues(`miscellaneousCost`) || 0
                  );
                  let totalCost = Number(getValues(`totalCost`) || 0);

                  let commission =
                    (Commission_Percentage / 100) *
                    (grossProfitGoal + miscellaneousCost);
                  let minimumBidToCustomer =
                    grossProfitGoal + miscellaneousCost + commission;
                  let grossProfitAmount =
                    minimumBidToCustomer - (totalCost + commission);
                  setValue(`commission`, commission);
                  setValue(`minimumBidToCustomer`, minimumBidToCustomer);
                  setValue(`grossProfitAmount`, grossProfitAmount);

                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container>
      {renderTextField(
          `minimumBidToCustomer`,
          "Minimum Bid to Customer",
          "",
          control
        )}
        {renderTextField(`field4`, "", "", control)}{" "}
      </Grid>
      <br />
      <Grid container>
        {/* Replace with actual label */}
        {renderTextField(
          `grossProfitAmount`,
          "Gross Profit Amount",
          "2242.78",
          control
        )}
        {renderTextField(`grossProfitPct`, "Gross Profit Pct", "", control)}
      </Grid>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name={`bidToCustomer`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{ width: 350 }} // Set the width to 300px
                label={"Bid To Customer"}
                variant="outlined"
                size="small"
                margin="normal"
                type="number"
                onChange={(e) => {
                  let totalCost = Number(getValues(`totalCost`) || 5);
                  let commissionPercentage = Number(
                    getValues(`commissionPercentage`) || 5
                  );
                  let bidToCustomer = Number(e.target.value) || 0;

                  let finalCommission =
                    (commissionPercentage / 100) * bidToCustomer;

                  let finalTotalCost = totalCost + finalCommission;

                  let finalGrossProfit = bidToCustomer - finalTotalCost;
                  setValue(`finalTotalCost`, finalTotalCost);
                  setValue(`finalGrossProfit`, finalGrossProfit);
                  setValue(`finalCommission`, finalCommission);

                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </Grid>
        {renderTextField(
          `commissionPercentageFinal`,
          "Commission Percentage",
          "",
          control
        )}
        {renderTextField(`finalCommission`, "Final Commission", "", control)}
        {renderTextField(
          `totalCostPercentage`,
          "Total Cost Percentage",
          "",
          control
        )}
        {renderTextField(`finalTotalCost`, "Final Total Cost", "", control)}
        {renderTextField(
          `actualGrossProfitPercentage`,
          "Actual Gross Profit Percentage",
          "",
          control
        )}
      </Grid>
      <br />
      <Grid container spacing={2}>
        {renderTextField(`finalGrossProfit`, "Final Gross Profit", "", control)}
      </Grid>
      <br />
      <Grid container spacing={2}>
        {renderTextField(
          `revenuePerSquareFoot`,
          "Revenue Per Square Ft",
          "",
          control
        )}
        {renderTextField(
          `revenuePerManHour`,
          "Revenue Per Man Hour",
          "",
          control
        )}
      </Grid>
      <br />
      <Grid container spacing={2}>
        {renderTextField(
          `serviceOnQuote`,
          "Service (appears on quote)",
          "Fountain Restoration",
          control
        )}
        {renderTextField(
          `ratePerSquareFootCurrency`,
          "Rate Per Square Foot Currency",
          "8.97",
          control
        )}
      </Grid>
      <br />
      {clarifications !== null &&
        clarifications.length > 0 &&
        clarifications.map((clarification, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 2,
              marginBottom: 2,
              alignItems: "center",
            }}
          >
            {renderMultiTextField(
              `Clarifications${index + 1}`,
              `Clarifications ${index + 1}`,
              clarification.Description,
              control,
              600
            )}
            <DeleteIcon
              sx={{ cursor: "pointer" }}
              onClick={() => removeClarification(index)}
            />
          </Box>
        ))}
    </Box>
  );
}

const renderTextField = (
  name,
  label,
  defaultValue,
  control,
  size = "small",
  labelWidth = 180
) => (
  <Grid item xs={6}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          label={label}
          variant="outlined"
          {...field}
          size={size}
          sx={{ width: 350 }} // Set the width to 300px
        />
      )}
    />
  </Grid>
);

const renderMultiTextField = (name, label, defaultValue, control, width) => (
  <Grid item xs={6}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          label={label}
          variant="outlined"
          {...field}
          size="small"
          multiline
          rows={4}
          sx={{ width: width }}
        />
      )}
    />
  </Grid>
);
