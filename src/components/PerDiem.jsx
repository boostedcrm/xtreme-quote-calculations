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
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Box,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
let meals = [
  {
    id: 1,
    Name: "75+ Miles",
    costPerDay: 12,
  },
  {
    id: 2,
    Name: "Overnight",
    costPerDay: 25,
  },
];
const PerDiem = ({
  dealData,
  control,
  watch,
  getValues,
  register,
  setValue,
}) => {
  // const { control, handleSubmit, register, getValues } = useForm({
  //   defaultValues: {
  //     materials: [
  //       { name: "", size: "", coverage: "", amount: "", pricePer: "" },
  //     ],
  //   },
  // });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "perdiem",
  });

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

  function calculateTotalPerdiemCost(fields) {
    let totalperdiemCost = fields.reduce((acc, field, i) => {
      const amount = getValues(`perdiem[${i}].perdiemSubtotal`);
      return acc + (amount || 0);
    }, 0);
    setValue(`totalperdiemCost`, Number(totalperdiemCost.toFixed(2)));
    calculateTotalCost();
  }

  return (
    <Box>
      {/* <Typography
        variant="h5"
        sx={{
          padding: "25px 10px 5px 10px",
        }}
      >
        Per Diem
      </Typography>
      <hr /> */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Meal Type</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Crew Size</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Days</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Cost Per Day</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell sx={{ width: "150px", paddingTop: 3 }}>
                <Controller
                  name={`perdiem[${index}].name`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={meals}
                      getOptionLabel={(option) => option?.Name}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="" size="small" />
                      )}
                      onChange={(_, data) => {
                        if (data) {
                          const crewSize = Number(
                            getValues(`perdiem[${index}].crewSize`) || 1
                          );
                          const days = Number(
                            getValues(`perdiem[${index}].days`) || 1
                          );
                          update(index, {
                            ...fields[index],
                            crewSize: crewSize,
                            days: days,
                            costPerDay: data?.costPerDay || 0,
                            perdiemSubtotal: crewSize * days * data?.costPerDay,
                          });
                        } else {
                          update(index, {
                            ...fields[index],
                            name: {},
                            crewSize: 0,
                            days: 0,
                            costPerDay: data?.costPerDay || 0,
                            perdiemSubtotal: 0,
                          });
                        }

                        calculateTotalPerdiemCost(fields);
                        field.onChange(data);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`perdiem[${index}].crewSize`}
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
                        let crewSize = Number(e.target.value || 0);
                        let days = Number(
                          getValues(`perdiem[${index}].days`) || 0
                        );
                        let costPerDay = Number(
                          getValues(`perdiem[${index}].costPerDay`) || 0
                        );

                        let perdiemSubtotal = crewSize * days * costPerDay;

                        setValue(
                          `perdiem[${index}].perdiemSubtotal`,
                          Number(perdiemSubtotal.toFixed(2))
                        );

                        calculateTotalPerdiemCost(fields);

                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`perdiem[${index}].days`}
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
                        let days = Number(e.target.value || 0);
                        let crewSize = Number(
                          getValues(`perdiem[${index}].crewSize`) || 0
                        );
                        let costPerDay = Number(
                          getValues(`perdiem[${index}].costPerDay`) || 0
                        );

                        let perdiemSubtotal = crewSize * days * costPerDay;

                        setValue(
                          `perdiem[${index}].perdiemSubtotal`,
                          Number(perdiemSubtotal.toFixed(2))
                        );

                        calculateTotalPerdiemCost(fields);
                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`perdiem[${index}].costPerDay`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label=""
                      variant="outlined"
                      {...field}
                      size={"small"}
                      InputProps={{
                        readOnly: true,
                        startAdornment: <Typography>$</Typography>,
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                {renderTextField(
                  `perdiem[${index}].perdiemSubtotal`,
                  "",
                  "",
                  control
                )}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    remove(index);
                    calculateTotalPerdiemCost(fields);
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
            name: null,
            size: "",
            coverage: "",
            amount: "",
            pricePer: "",
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
              label="Total Per Diem Cost"
              {...register("totalperdiemCost")}
              size="small"
              fullWidth
              margin="normal"
              type="number"
              InputProps={{
                readOnly: true,
                startAdornment: <Typography>$</Typography>,
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PerDiem;

const renderShiftSelect = (name, label, defaultValue, control, items) => (
  <Grid item xs={6}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          select
          label=""
          variant="outlined"
          {...field}
          size="small"
          sx={{ width: "130px" }}
        >
          {items.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  </Grid>
);

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
        <TextField label="" variant="outlined" {...field} size={size} />
      )}
    />
  </Grid>
);
