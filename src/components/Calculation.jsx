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
  TableRow,
  TableCell,
} from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";

export default function Calculation({
  ZOHO,
  control,
  watch,
  getValues,
  dealData,
  register,
  unregister,
  setValue,
  checklistData,
  quoteType,
}) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "Clarifications",
  });

  const watchAllFields = watch();

  const [clarifications, setClarifications] = useState(null);
  const [typeOfQuote, setQuoteType] = useState(null);

  function calculateTotalCost() {
    let materialTotalCost = Number(getValues(`materialTotalCost`) || 0);
    let equipmentTotal = Number(getValues(`equipmentTotal`) || 0);
    let totalLaborCost = Number(getValues(`totalLaborCost`) || 0);

    let totallodgingCost = Number(getValues(`totallodgingCost`) || 0);
    let totalperdiemCost = Number(getValues(`totalperdiemCost`) || 0);
    let totalrentalEquipmenCost = Number(
      getValues(`totalrentalEquipmenCost`) || 0
    );
    let totalVehicleExpenseCost = Number(
      getValues(`totalVehicleExpenseCost`) || 0
    );

    let miscellaneousCost =
      equipmentTotal +
      totallodgingCost +
      totalperdiemCost +
      totalrentalEquipmenCost +
      totalVehicleExpenseCost;

    setValue(`miscellaneousCost`, Number((miscellaneousCost * 1.2).toFixed(2)));
    setValue(`travelAndMisc`, Number((miscellaneousCost * 1.2).toFixed(2)));
    let totalCost = miscellaneousCost + materialTotalCost + totalLaborCost;
    setValue(`totalCost`, Number(totalCost.toFixed(2)));

    let grossProfitGoal = (totalCost - miscellaneousCost * 1.2) * 2;
    setValue(`grossProfitGoal`, Number(grossProfitGoal.toFixed(2)));

    let SquareFeet = Number(
      getValues(`SquareFeet`) || dealData?.SquareFeet || 1
    );
    const bidToCustomer = Number(getValues(`bidToCustomer`) || 0);

    // let Revenue_Per_Square_Ft = totalCost / SquareFeet; Previous Calcualtion
    let Revenue_Per_Square_Ft = bidToCustomer / SquareFeet;
    setValue(`Revenue_Per_Square_Ft`, Number(Revenue_Per_Square_Ft.toFixed(2)));

    let commissionPercentage = Number(getValues(`commissionPercentage`) || 0);

    let commission =
      (commissionPercentage / 100) *
      (grossProfitGoal + miscellaneousCost * 1.2);
    let minimumBidToCustomer =
      grossProfitGoal + miscellaneousCost * 1.2 + commission;
    let grossProfitAmount = minimumBidToCustomer - (totalCost + commission);

    let totalManHours = Number(getValues(`totalManHours`) || 0);
    if (totalManHours === 0) {
      setValue("Quoted_Rev_Per_Manhour", 0);
    } else {
      let Quoted_Rev_Per_Manhour = minimumBidToCustomer / totalManHours;
      setValue(
        "Quoted_Rev_Per_Manhour",
        Number(Quoted_Rev_Per_Manhour.toFixed(2))
      );
    }

    setValue(`commission`, Number(commission.toFixed(2)));
    setValue(`minimumBidToCustomer`, Number(minimumBidToCustomer.toFixed(2)));
    setValue(`grossProfitAmount`, Number(grossProfitAmount.toFixed(2)));
    const finalComission = (commissionPercentage / 100) * bidToCustomer;
    const finalTotalCost = totalCost + finalComission;
    const finalGrossProfit = bidToCustomer - finalTotalCost;
    setValue(`finalCommission`, finalComission);
    setValue(`finalTotalCost`, Number(finalTotalCost.toFixed(2)));
    setValue(`finalGrossProfit`, Number(finalGrossProfit.toFixed(2)));
    let grossProfitPct = (grossProfitAmount / minimumBidToCustomer) * 100;
    setValue(`grossProfitPct`, Number(grossProfitPct.toFixed(2)));
    if (bidToCustomer === 0 || bidToCustomer === null) {
      setValue("totalCostPercentage", 0);
      setValue("actualGrossProfitPercentage", 0);
    } else {
      let totalCostPercentage = (finalTotalCost / bidToCustomer) * 100;
      setValue("totalCostPercentage", Number(totalCostPercentage.toFixed(2)));

      let actualGrossProfitPercentage =
        (finalGrossProfit / bidToCustomer) * 100;
      setValue(
        "actualGrossProfitPercentage",
        Number(actualGrossProfitPercentage.toFixed(2))
      );
    }
  }

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
          const filteredCarificationsData = clarifications.data.filter(
            (item) => {
              // Handle the specific case for "Concrete"
              if (
                dealData?.SourceForm === "Concrete" ||
                dealData?.SourceForm === "Honing"
              ) {
                return item.Type === "Concrete/Honing";
              }

              // For other types, perform a regular match
              return item.Type === dealData?.SourceForm;
            }
          );

          let sorted_filteredCarificationsData =
            filteredCarificationsData?.sort(
              (a, b) => a.Sequence_Number - b.Sequence_Number
            );
          // setClarifications((prev) => filteredCarificationsData);
          if (
            !dealData?.Clarification20 &&
            getValues("Clarifications")?.length == 0
          ) {
            for (let i = 0; i < sorted_filteredCarificationsData?.length; i++) {
              const element = sorted_filteredCarificationsData[i];
              let temp = { name: element?.Description };
              append(temp);
            }
            // filteredCarificationsData.forEach((element, index) => {
            //   let temp = { name: element?.Description };
            //   append(temp);
            // });
          }
        }
        calculateTotalCost();
      } catch (clarificationError) {
        console.error({ clarificationError });
      }
    }
    getData();
  }, []);

  const removeClarification = (index) => {
    const newClarifications = clarifications.filter((_, i) => i !== index);

    // unregister(`Clarifications${index}`);
    setClarifications(newClarifications);
  };

  return (
    <Box p={2}>
      <Grid container style={{ marginBottom: "15px" }}>
        {/* {renderTextField(
          `miscellaneousCost`,
          "Miscellaneous cost",
          "",
          control
        )} */}
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
      <Grid container style={{ marginBottom: "15px" }}>
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
        {/* <Grid item xs={6}>

        </Grid> */}
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
      <Grid container sx={{ marginBottom: "15px" }}>
        <Grid item xs={6} sx={{ padding: "0" }}>
          <Controller
            name={`commissionPercentage`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{
                  width: 350, // Set the width to 350px
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "red", // Change the outline color to red
                    },
                  },
                }} // Set the width to 300px
                label={"Commission Percentage"}
                variant="outlined"
                size="small"
                // margin="normal"
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
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="Revenue_Per_Square_Ft"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Revenue Per Square Ft"
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
      <Grid container style={{ marginBottom: "15px" }}>
        <Grid item xs={6}>
          <Controller
            name="Quoted_Rev_Per_Manhour"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Revenue Per Man Hour"
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
            name={`bidToCustomer`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{
                  width: 350, // Set the width to 350px
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "red", // Change the outline color to red
                    },
                  },
                }} // Set the width to 300px
                label={"Bid To Customer"}
                variant="outlined"
                size="small"
                type="number"
                onChange={(e) => {
                  let totalCost = Number(getValues(`totalCost`) || 5);
                  let commissionPercentage = Number(
                    getValues(`commissionPercentage`) || 5
                  );
                  let bidToCustomer = Number(e.target.value) || 0;

                  let SquareFeet = Number(
                    getValues(`SquareFeet`) || dealData?.SquareFeet || 1
                  );

                  let Revenue_Per_Square_Ft = bidToCustomer / SquareFeet;
                  setValue(
                    `Revenue_Per_Square_Ft`,
                    Number(Revenue_Per_Square_Ft.toFixed(2))
                  );

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

                  // ------------
                  if (bidToCustomer === 0 || bidToCustomer === null) {
                    setValue("totalCostPercentage", 0);
                    setValue("actualGrossProfitPercentage", 0);
                  } else {
                    let totalCostPercentage =
                      (finalTotalCost / bidToCustomer) * 100;
                    setValue(
                      "totalCostPercentage",
                      Number(totalCostPercentage.toFixed(2))
                    );

                    let actualGrossProfitPercentage =
                      (finalGrossProfit / bidToCustomer) * 100;
                    setValue(
                      "actualGrossProfitPercentage",
                      Number(actualGrossProfitPercentage.toFixed(2))
                    );
                  }
                  field.onChange(e.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
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
      <Grid container style={{ marginBottom: "15px" }}>
        <Grid xs={6}>
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
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginBottom: "15px" }}>
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
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
        {/* Replace with actual label */}
      </Grid>
      <Grid container style={{ marginBottom: "15px" }}>
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
            name="actualGrossProfitPercentage"
            control={control}
            render={({ field }) => (
              <TextField
                label="Actual Gross Profit Percentage"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
      </Grid>
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
      <Grid container style={{ marginBottom: "15px" }}>
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
      </Grid>
      <Grid container style={{ marginBottom: "15px" }}>
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
        <Grid item xs={6}></Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6}>
          <Controller
            name="serviceOnQuote"
            control={control}
            defaultValue={dealData?.Service || ""}
            render={({ field }) => (
              <TextField
                label="Service (appears on quote)"
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Controller
            name="ServiceDescription"
            control={control}
            defaultValue={dealData?.ServiceDescription || ""}
            render={({ field }) => (
              <TextField
                label="Service Description"
                variant="outlined"
                multiline
                minRows={3}
                {...field}
                size="small"
                sx={{ width: 350 }} // Set the width to 300px
                InputLabelProps={{
                  shrink: true,
                }}
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
      {/* {clarifications !== null &&
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
        ))} */}

      {fields.map((item, index) => (
        <TableRow key={item.id}>
          <TableCell>
            {renderMultiTextField(
              `Clarifications[${index}].name`,
              `Clarifications ${index + 1}`,
              clarifications?.[index]?.Description,
              control,
              600
            )}
          </TableCell>
          <TableCell>
            <Button
              onClick={() => {
                remove(index);
                // calculateTotalRentalEquipmentCost(fields);
              }}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))}
      {watchAllFields?.Clarifications?.length !== 19 && (
        <Button
          // startIcon={<AddCircleOutlineIcon />}
          onClick={() =>
            append({
              name: "",
            })
          }
        >
          Add New
        </Button>
      )}
      <Box>
        <Controller
          name="Sent_for_Review"
          control={control}
          render={({ field }) => (
            <div style={{ display: "flex" }}>
              <div>
                <label>{"Send for Review"}</label>
              </div>
              <Checkbox
                defaultChecked={field?.value ? true : false}
                {...field}
              />
            </div>
          )}
        />
        {/* {renderCheckboxField(
          "Sent_for_Review", // name of the field
          "Send for Review", // label
          control, // form control from react-hook-form
          170 // optional label width, default is 170 if not provided
        )} */}
        {renderMultiTextField("review_note", "Review Note", "", control, 350)}
        <Controller
          name="Is_Quote_Completed"
          control={control}
          render={({ field }) => (
            <div style={{ display: "flex" }}>
              <div>
                <label>{"Quote Completed"}</label>
              </div>
              <Checkbox
                defaultChecked={field?.value ? true : false}
                {...field}
              />
            </div>
          )}
        />
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

const renderCheckboxField = (name, label, control, labelWidth = 170) => (
  <Grid item xs={6}>
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          // defaultValue={defaultValue}
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
