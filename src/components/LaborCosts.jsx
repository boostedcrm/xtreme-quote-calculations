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

const LaborCosts = ({ ZOHO, control, getValues, register, setValue }) => {
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

    let miscellaneousCost =
      totallodgingCost +
      totalperdiemCost +
      totalrentalEquipmenCost +
      totalVehicleExpenseCost;

    setValue(`miscellaneousCost`, miscellaneousCost);
    let totalCost =
      miscellaneousCost + materialTotalCost + equipmentTotal + totalLaborCost;
    setValue(`totalCost`, totalCost);
    
    let grossProfitGoal = (totalCost - miscellaneousCost)/(50/100)
    setValue(`grossProfitGoal`, grossProfitGoal);
  }

  function calculateTotalLaborCost(fields) {
    let totalManHours = 0;

    fields.forEach((element, i) => {
      let men = Number(getValues(`labor[${i}].men`) || 0);

      let days = Number(getValues(`labor[${i}].days`) || 0);
      let hoursPerDay = Number(getValues(`labor[${i}].hoursPerDay`) || 0);

      totalManHours = totalManHours + men * days * hoursPerDay;
    });

    setValue(`totalManHours`, totalManHours);

    let laborTotal = fields.reduce((acc, field, index) => {
      const amount = getValues(`labor[${index}].rowTotal`);
      return acc + (amount || 0);
    }, 0);
    setValue(`totalLaborCost`, laborTotal);
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
              <TableCell sx={{ width: "150px" }}>
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
                          rowTotal:
                            timeFrame *
                            days *
                            hoursPerDay *
                            men *
                            (data?.Rate || 0),
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
                      type="number"
                      onChange={(e) => {
                        let rowTotal =
                          Number(e.target.value || 0) *
                          Number(getValues(`labor[${index}].days`) || 0) *
                          Number(
                            getValues(`labor[${index}].hoursPerDay`) || 0
                          ) *
                          Number(getValues(`labor[${index}].men`) || 0) *
                          Number(getValues(`labor[${index}].costPerHour`) || 0);

                        setValue(`labor[${index}].rowTotal`, rowTotal);

                        let laborTotal = fields.reduce((acc, field, index) => {
                          const amount = getValues(`labor[${index}].rowTotal`);
                          return acc + (amount || 0);
                        }, 0);
                        setValue(`totalLaborCost`, laborTotal);

                        calculateTotalCost();
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
                          Number(getValues(`labor[${index}].timeFrame`) || 0) *
                          Number(
                            getValues(`labor[${index}].hoursPerDay`) || 0
                          ) *
                          Number(getValues(`labor[${index}].men`) || 0) *
                          Number(getValues(`labor[${index}].costPerHour`) || 0);

                        setValue(`labor[${index}].rowTotal`, rowTotal);

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

                        setValue(`totalManHours`, totalManHours);

                        let laborTotal = fields.reduce((acc, field, index) => {
                          const amount = getValues(`labor[${index}].rowTotal`);
                          return acc + (amount || 0);
                        }, 0);
                        setValue(`totalLaborCost`, laborTotal);

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
                          Number(getValues(`labor[${index}].timeFrame`) || 0) *
                          Number(getValues(`labor[${index}].days`) || 0) *
                          Number(getValues(`labor[${index}].men`) || 0) *
                          Number(getValues(`labor[${index}].costPerHour`) || 0);

                        setValue(`labor[${index}].rowTotal`, rowTotal);

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

                        setValue(`totalManHours`, totalManHours);

                        let laborTotal = fields.reduce((acc, field, index) => {
                          const amount = getValues(`labor[${index}].rowTotal`);
                          return acc + (amount || 0);
                        }, 0);
                        setValue(`totalLaborCost`, laborTotal);

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
                          Number(getValues(`labor[${index}].timeFrame`) || 0) *
                          Number(getValues(`labor[${index}].days`) || 0) *
                          Number(
                            getValues(`labor[${index}].hoursPerDay`) || 0
                          ) *
                          Number(getValues(`labor[${index}].costPerHour`) || 0);

                        setValue(`labor[${index}].rowTotal`, rowTotal);

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

                        setValue(`totalManHours`, totalManHours);

                        let laborTotal = fields.reduce((acc, field, index) => {
                          const amount = getValues(`labor[${index}].rowTotal`);
                          return acc + (amount || 0);
                        }, 0);
                        setValue(`totalLaborCost`, laborTotal);

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
                          Number(getValues(`labor[${index}].timeFrame`) || 0) *
                          Number(getValues(`labor[${index}].days`) || 0) *
                          Number(
                            getValues(`labor[${index}].hoursPerDay`) || 0
                          ) *
                          Number(getValues(`labor[${index}].men`) || 0);

                        setValue(`labor[${index}].rowTotal`, rowTotal);

                        let laborTotal = fields.reduce((acc, field, index) => {
                          const amount = getValues(`labor[${index}].rowTotal`);
                          return acc + (amount || 0);
                        }, 0);
                        setValue(`totalLaborCost`, laborTotal);

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
            resourceTitle: "",
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
