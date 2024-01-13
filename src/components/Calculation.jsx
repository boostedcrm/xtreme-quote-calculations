import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";

export default function Calculation({
  ZOHO,
  control,
  watch,
  getValues,
  register,
  unregister,
  setValue,
  checklistData,
  quoteType,
}) {
  const [clarifications, setClarifications] = useState(null);
  const [typeOfQuote, setQuoteType] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const clarifications = await ZOHO.CRM.API.getAllRecords({
          Entity: "Clarifications",
          sort_order: "asc",
          per_page: 200,
          page: 1,
        });

        console.log({ clarifications });

        if (clarifications?.data) {
          let firstWordOfQuoteType = quoteType?.split(" ")[0];
          firstWordOfQuoteType = "Concrete";
          const filteredCarificationsData = clarifications.data.filter(
            (item) => {
              // Handle the specific case for "Concrete"
              if (firstWordOfQuoteType === "Concrete") {
                return item.Type === "Concrete/Honing";
              }
              // For other types, perform a regular match
              return item.Type === firstWordOfQuoteType;
            }
          );

          console.log({ filteredCarificationsData });

          setClarifications(filteredCarificationsData);
        }
      } catch (clarificationError) {
        console.error({ clarificationError });
      }
    }
    getData();
  }, [ZOHO]);

  const removeClarification = (index) => {
    const newClarifications = clarifications.filter((_, i) => i !== index);
    unregister(`Clarifications${index}`);
    setClarifications(newClarifications);
  };

  return (
    <Box p={2}>
      <Grid containe style={{ marginBottom: "15px" }}>
        {/* {renderTextField(
          `miscellaneousCost`,
          "Miscellaneous cost",
          "",
          control
        )} */}
        <Grid item xs={6}>
          <Controller
            name="miscellaneousCost"
            control={control}
            render={({ field }) => (
              <TextField
                label="Miscellaneous cost"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ marginBottom: "15px" }}>
        <Grid item xs={6}>
          <Controller
            name="totalCost"
            control={control}
            render={({ field }) => (
              <TextField
                label="Total Cost"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ marginBottom: "15px" }}>
        <Grid item xs={6}>
          <Controller
            name="grossProfitGoal"
            control={control}
            render={({ field }) => (
              <TextField
                label="Gross Profit Goal at 50%"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          {/* <Controller
            name="field2"
            control={control}
            defaultValue="2242.78"
            render={({ field }) => (
              <TextField
                label=""
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
              />
            )}
          />
            */}
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="travelAndMisc"
            control={control}
            render={({ field }) => (
              <TextField
                label="Travel and Misc"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
        {/* Replace with actual label */}
        {/* <Grid item xs={6}>
          <Controller
            name="field3"
            control={control}
            defaultValue="2242.78"
            render={({ field }) => (
              <TextField
                label=""
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
              />
            )}
          />
        </Grid> */}
        {/* Replace with actual label */}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name="commission"
            control={control}
            render={({ field }) => (
              <TextField
                label="Commission"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
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
                  setValue(`commission`, Number(commission.toFixed(2)));
                  setValue(
                    `minimumBidToCustomer`,
                    Number(minimumBidToCustomer.toFixed(2))
                  );
                  setValue(
                    `grossProfitAmount`,
                    Number(grossProfitAmount.toFixed(2))
                  );
                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6}>
          <Controller
            name="minimumBidToCustomer"
            control={control}
            render={({ field }) => (
              <TextField
                label="Minimum Bid to Customer"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
        {/* <Grid item xs={6}>
          <Controller
            name="field4"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label=""
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
              />
            )}
          />
        </Grid> */}
      </Grid>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name="grossProfitAmount"
            control={control}
            render={({ field }) => (
              <TextField
                label="Gross Profit Amount"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
        {/* Replace with actual label */}
        <Grid item xs={6}>
          <Controller
            name="grossProfitPct"
            control={control}
            render={({ field }) => (
              <TextField
                label="Gross Profit Pct"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
              />
            )}
          />
        </Grid>
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
                  setValue(`finalTotalCost`, Number(finalTotalCost.toFixed(2)));
                  setValue(
                    `finalGrossProfit`,
                    Number(finalGrossProfit.toFixed(2))
                  );
                  setValue(
                    `finalCommission`,
                    Number(finalCommission.toFixed(2))
                  );

                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          {/* <Controller
            name="commissionPercentageFinal"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Commission Percentage"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
              />
            )}
          /> */}
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="finalCommission"
            control={control}
            render={({ field }) => (
              <TextField
                label="Final Commission"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="totalCostPercentage"
            control={control}
            render={({ field }) => (
              <TextField
                label="Total Cost Percentage"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="finalTotalCost"
            control={control}
            render={({ field }) => (
              <TextField
                label="Final Total Cost"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="actualGrossProfitPercentage"
            control={control}
            render={({ field }) => (
              <TextField
                label="Actual Gross Profit Percentage"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
              />
            )}
          />
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name="finalGrossProfit"
            control={control}
            render={({ field }) => (
              <TextField
                label="Final Gross Profit"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <br />
      {/* <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name="revenuePerSquareFoot"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Revenue Per Square Ft"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="revenuePerManHour"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Revenue Per Man Hour"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
              />
            )}
          />
        </Grid>
      </Grid> */}
      <br />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name="serviceOnQuote"
            control={control}
            defaultValue="Fountain Restoration"
            render={({ field }) => (
              <TextField
                label="Service (appears on quote)"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
              />
            )}
          />
        </Grid>
        {/* <Grid item xs={6}>
          <Controller
            name="ratePerSquareFootCurrency"
            control={control}
            defaultValue="8.97"
            render={({ field }) => (
              <TextField
                label="Rate Per Square Foot Currency"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
              />
            )}
          />
        </Grid> */}
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
      <Box>
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
  size = "small"
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
