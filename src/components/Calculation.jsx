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
          "2242.78",
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
        {renderTextField(`field2`, "Label for Field 2", "2242.78", control)}{" "}
        {/* Replace with actual label */}
        {renderTextField(
          `travelAndMisc`,
          "Travel and Misc",
          "2242.78",
          control
        )}
        {renderTextField(`field3`, "Label for Field 3", "2242.78", control)}{" "}
        {/* Replace with actual label */}
        {renderTextField(`commission`, "Commission", "2242.78", control)}
        {renderTextField(
          `commissionPercentage`,
          "Commission Percentage",
          "5.00",
          control
        )}
        {renderTextField(
          `minimumBidToCustomer`,
          "Minimum Bid to Customer",
          "",
          control
        )}
        {renderTextField(`field4`, "Label for Field 4", "", control)}{" "}
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
        {renderTextField(`bidToCustomer`, "Bid To Customer", "", control)}
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
          <Box key={index} sx={{display: "flex", gap : 2,marginBottom: 2, alignItems: "center"}}>
            {renderMultiTextField(
              `Classification_${index + 1}`,
              `Classification ${index + 1}`,
              clarification.Description,
              control,
              600
            )}
            <DeleteIcon sx={{cursor: "pointer"}} onClick={() => removeClarification(index)}/>
          </Box>
        ))}
              <Box>
        {/* <FormControlLabel
          control={
            <Checkbox onChange={(event) => updateSendForSignature(event)} />
          }
          label="Send for Review"
          style={{ marginBottom: "8px" }}
        /> */}
        {renderCheckboxField(
          "Sent_for_Review", // name of the field
          "Send for Review", // label
          false, // default value
          control, // form control from react-hook-form
          170 // optional label width, default is 170 if not provided
        )}
        {renderMultiTextField("review_note", "Review Note", "", control, 350)}
      </Box>
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



const renderCheckboxField = (
  name,
  label,
  defaultValue,
  control,
  labelWidth = 170
) => (
  <Grid item xs={6}>
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <div style={{ display: "flex" }}>
              <div style={{ width: labelWidth, flexShrink: 0 }}>
                <label>{label}</label>
              </div>
              <Checkbox {...field} />
            </div>
          )}
        />
      }
      label=""
      labelPlacement="start"
    />
  </Grid>
);