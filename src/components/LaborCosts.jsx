import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useEffect, useState } from "react";

const LaborCosts = ({
  dealData,
  ZOHO,
  control,
  getValues,
  register,
  setValue,
}) => {
  const [labor, SetLabor] = useState([]);

  useEffect(() => {
    async function getData() {
      ZOHO.CRM.API.getAllRecords({
        Entity: "Labor_Master",
        sort_order: "asc",
        per_page: 200,
        page: 1,
      }).then(function (data) {
        console.log({ labour: data.data });
        SetLabor(data.data);
      });
    }
    getData();
  }, [ZOHO]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "labor",
  });
  // const totalManHours = watch("totalManHours");
  // const performCalculations = watch("performCalculations");

  const onSubmit = (data) => {
    console.log(data);
  };

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

    // let miscellaneousCost1 =
    //   equipmentTotal +
    //   totallodgingCost +
    //   totalperdiemCost +
    //   totalrentalEquipmenCost +
    //   totalVehicleExpenseCost;

    let miscellaneousCost =
      (equipmentTotal + totalVehicleExpenseCost) * 1.2 +
      (totallodgingCost + totalperdiemCost + totalrentalEquipmenCost);

    setValue(`miscellaneousCost`, Number(miscellaneousCost.toFixed(2)));
    setValue(`travelAndMisc`, Number(miscellaneousCost.toFixed(2)));
    let totalCost = miscellaneousCost + materialTotalCost + totalLaborCost;
    // let onlytotalCost =
    //   materialTotalCost +
    //   totalLaborCost +
    //   totallodgingCost +
    //   totalperdiemCost +
    //   totalrentalEquipmenCost +
    //   (equipmentTotal + totalVehicleExpenseCost) * 1.2;

    setValue(`totalCost`, Number(totalCost.toFixed(2)));

    let SquareFeet = Number(
      getValues(`SquareFeet`) || dealData?.SquareFeet || 1
    );
    const bidToCustomer = Number(getValues(`bidToCustomer`) || 0);

    let Revenue_Per_Square_Ft = bidToCustomer / SquareFeet;
    setValue(`Revenue_Per_Square_Ft`, Number(Revenue_Per_Square_Ft.toFixed(2)));

    let grossProfitGoal = (totalCost - miscellaneousCost * 1.2) * 2;
    setValue(`grossProfitGoal`, Number(grossProfitGoal.toFixed(2)));

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
    console.log({ grossProfitAmount, minimumBidToCustomer, grossProfitPct });
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

  function calculateTotalLaborCost(fields) {
    let totalManHours = 0;

    fields.forEach((element, i) => {
      let men = Number(getValues(`labor[${i}].men`) || 0);

      let days = Number(getValues(`labor[${i}].days`) || 0);
      let hoursPerDay = Number(getValues(`labor[${i}].hoursPerDay`) || 0);

      totalManHours = totalManHours + men * days * hoursPerDay;
    });

    setValue(`totalManHours`, Number(totalManHours.toFixed(2)));

    let laborTotal = fields.reduce((acc, field, index) => {
      const amount = getValues(`labor[${index}].rowTotal`);
      return acc + (amount || 0);
    }, 0);
    setValue(`totalLaborCost`, Number(laborTotal.toFixed(2)));
    calculateTotalCost();
  }

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Resource Title</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Time Frame (Day/Week Task)
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Days</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Hours Per Day</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Men</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Cost Per Hour</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Labor Cost</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell sx={{ width: "150px", paddingTop: 3 }}>
                <Controller
                  name={`labor[${index}].resourceTitle`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={labor}
                      getOptionLabel={(option) => option?.Name}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="" size="small" />
                      )}
                      onChange={(_, data) => {
                        let timeFrame = Number(
                          getValues(`labor[${index}].timeFrame`) || 0
                        );

                        let men = Number(getValues(`labor[${index}].men`) || 0);

                        let days = Number(
                          getValues(`labor[${index}].days`) || 0
                        );
                        let hoursPerDay = Number(
                          getValues(`labor[${index}].hoursPerDay`) || 0
                        );
                        update(index, {
                          ...fields[index],
                          timeFrame: timeFrame,
                          days: days,
                          hoursPerDay: hoursPerDay,
                          men: men,
                          costPerHour: data?.Rate || 0,
                          rowTotal: Number(
                            (
                              days *
                              hoursPerDay *
                              men *
                              (data?.Rate || 0)
                            ).toFixed(2)
                          ),
                        });
                        calculateTotalLaborCost(fields);
                        return field.onChange(data);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`labor[${index}].timeFrame`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={""}
                      variant="outlined"
                      size="small"
                      margin="normal"
                      fullWidth
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`labor[${index}].days`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={""}
                      variant="outlined"
                      size="small"
                      margin="normal"
                      fullWidth
                      type="number"
                      onChange={(e) => {
                        let rowTotal =
                          Number(e.target.value || 0) *
                          Number(
                            getValues(`labor[${index}].hoursPerDay`) || 0
                          ) *
                          Number(getValues(`labor[${index}].men`) || 0) *
                          Number(getValues(`labor[${index}].costPerHour`) || 0);

                        setValue(
                          `labor[${index}].rowTotal`,
                          Number(rowTotal.toFixed(2))
                        );

                        let totalManHours = 0;

                        fields.forEach((element, i) => {
                          let men = Number(getValues(`labor[${i}].men`) || 0);

                          let days = Number(getValues(`labor[${i}].days`) || 0);
                          let hoursPerDay = Number(
                            getValues(`labor[${i}].hoursPerDay`) || 0
                          );
                          if (i === index) {
                            days = Number(e.target.value || 0);
                          }
                          totalManHours =
                            totalManHours + men * days * hoursPerDay;
                        });

                        setValue(
                          `totalManHours`,
                          Number(totalManHours.toFixed(2))
                        );

                        let laborTotal = fields.reduce((acc, field, index) => {
                          const amount = getValues(`labor[${index}].rowTotal`);
                          return acc + (amount || 0);
                        }, 0);
                        setValue(
                          `totalLaborCost`,
                          Number(laborTotal.toFixed(2))
                        );

                        calculateTotalCost();
                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`labor[${index}].hoursPerDay`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={""}
                      variant="outlined"
                      size="small"
                      margin="normal"
                      fullWidth
                      type="number"
                      onChange={(e) => {
                        let rowTotal =
                          Number(e.target.value || 0) *
                          Number(getValues(`labor[${index}].days`) || 0) *
                          Number(getValues(`labor[${index}].men`) || 0) *
                          Number(getValues(`labor[${index}].costPerHour`) || 0);

                        setValue(
                          `labor[${index}].rowTotal`,
                          Number(rowTotal.toFixed(2))
                        );

                        let totalManHours = 0;

                        fields.forEach((element, i) => {
                          let men = Number(getValues(`labor[${i}].men`) || 0);

                          let days = Number(getValues(`labor[${i}].days`) || 0);
                          let hoursPerDay = Number(
                            getValues(`labor[${i}].hoursPerDay`) || 0
                          );
                          if (i === index) {
                            hoursPerDay = Number(e.target.value || 0);
                          }
                          totalManHours =
                            totalManHours + men * days * hoursPerDay;
                        });

                        setValue(
                          `totalManHours`,
                          Number(totalManHours.toFixed(2))
                        );

                        let laborTotal = fields.reduce((acc, field, index) => {
                          const amount = getValues(`labor[${index}].rowTotal`);
                          return acc + (amount || 0);
                        }, 0);
                        setValue(
                          `totalLaborCost`,
                          Number(laborTotal.toFixed(2))
                        );

                        calculateTotalCost();
                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`labor[${index}].men`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={""}
                      variant="outlined"
                      size="small"
                      margin="normal"
                      fullWidth
                      type="number"
                      onChange={(e) => {
                        let rowTotal =
                          Number(e.target.value || 0) *
                          Number(getValues(`labor[${index}].days`) || 0) *
                          Number(
                            getValues(`labor[${index}].hoursPerDay`) || 0
                          ) *
                          Number(getValues(`labor[${index}].costPerHour`) || 0);

                        setValue(
                          `labor[${index}].rowTotal`,
                          Number(rowTotal.toFixed(2))
                        );

                        let totalManHours = 0;

                        fields.forEach((element, i) => {
                          let men = Number(getValues(`labor[${i}].men`) || 0);
                          if (i === index) {
                            men = Number(e.target.value || 0);
                          }
                          let days = Number(getValues(`labor[${i}].days`) || 0);
                          let hoursPerDay = Number(
                            getValues(`labor[${i}].hoursPerDay`) || 0
                          );
                          totalManHours =
                            totalManHours + men * days * hoursPerDay;
                        });

                        setValue(
                          `totalManHours`,
                          Number(totalManHours.toFixed(2))
                        );

                        let laborTotal = fields.reduce((acc, field, index) => {
                          const amount = getValues(`labor[${index}].rowTotal`);
                          return acc + (amount || 0);
                        }, 0);
                        setValue(
                          `totalLaborCost`,
                          Number(laborTotal.toFixed(2))
                        );

                        calculateTotalCost();
                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`labor[${index}].costPerHour`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={""}
                      variant="outlined"
                      size="small"
                      margin="normal"
                      fullWidth
                      type="number"
                      onChange={(e) => {
                        let rowTotal =
                          Number(e.target.value || 0) *
                          Number(getValues(`labor[${index}].days`) || 0) *
                          Number(
                            getValues(`labor[${index}].hoursPerDay`) || 0
                          ) *
                          Number(getValues(`labor[${index}].men`) || 0);

                        setValue(
                          `labor[${index}].rowTotal`,
                          Number(rowTotal.toFixed(2))
                        );

                        let laborTotal = fields.reduce((acc, field, index) => {
                          const amount = getValues(`labor[${index}].rowTotal`);
                          return acc + (amount || 0);
                        }, 0);
                        setValue(
                          `totalLaborCost`,
                          Number(laborTotal.toFixed(2))
                        );

                        calculateTotalCost();
                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <TextField
                  {...register(`labor[${index}].rowTotal`)}
                  size="small"
                  fullWidth
                  type="number"
                />
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    remove(index);
                    calculateTotalLaborCost(fields);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={() =>
          append({
            resourceTitle: null,
            timeFrame: 0,
            days: 0,
            hoursPerDay: 0,
            men: 0,
            costPerHour: 0,
            rowTotal: 0,
          })
        }
      >
        Add New
      </Button>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {" "}
            <TextField
              label="Total Man Hours"
              {...register("totalManHours")}
              size="small"
              fullWidth
              margin="normal"
              type="number"
              InputProps={{
                readOnly: true,
                startAdornment: <Typography></Typography>,
              }}

              // value={totalManHours}
            />
          </Grid>
          <Grid item xs={6}>
            {" "}
            <TextField
              label="Total Labor Cost"
              {...register("totalLaborCost")}
              size="small"
              fullWidth
              margin="normal"
              type="number"
              InputProps={{
                readOnly: true,
                startAdornment: <Typography></Typography>,
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LaborCosts;
