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

const ExquipmentCost = ({
  dealData,
  ZOHO,
  control,
  watch,
  getValues,
  register,
  setValue,
}) => {
  const [equipments, setEquipments] = useState([]);
  useEffect(() => {
    async function getData() {
      ZOHO.CRM.API.getAllRecords({
        Entity: "Equipment_Master",
        sort_order: "asc",
        per_page: 200,
        page: 1,
      }).then(function (data) {
        // console.log({products:});
        setEquipments(data.data);
      });
    }
    getData();
  }, [ZOHO]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "equipment",
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

    let totalManHours = Number(getValues(`totalManHours`) || 0);
    let Quoted_Rev_Per_Manhour = totalCost / totalManHours;
    setValue(
      `Quoted_Rev_Per_Manhour`,
      Number(Quoted_Rev_Per_Manhour.toFixed(2))
    );

    let SquareFeet = Number(
      getValues(`SquareFeet`) || dealData?.SquareFeet || 1
    );
    let Revenue_Per_Square_Ft = totalCost / SquareFeet;
    setValue(`Revenue_Per_Square_Ft`, Number(Revenue_Per_Square_Ft.toFixed(2)));
    
    let commissionPercentage = Number(getValues(`commissionPercentage`) || 0);

    let commission =
      (commissionPercentage / 100) *
      (grossProfitGoal + miscellaneousCost * 1.2);
    let minimumBidToCustomer =
      grossProfitGoal + miscellaneousCost * 1.2 + commission;
    let grossProfitAmount = minimumBidToCustomer - (totalCost + commission);

    setValue(`commission`, Number(commission.toFixed(2)));
    setValue(`minimumBidToCustomer`, Number(minimumBidToCustomer.toFixed(2)));
    setValue(
      `grossProfitAmount`,
      Number(grossProfitAmount.toFixed(2))
    );
    const bidToCustomer = Number(getValues(`bidToCustomer`) || 0);
    const finalComission = (commissionPercentage / 100) * bidToCustomer;
    const finalTotalCost = totalCost + finalComission;
    const finalGrossProfit = bidToCustomer - finalTotalCost;
    setValue(`finalCommission`, finalComission);
    setValue(`finalTotalCost`, finalTotalCost);
    setValue(`finalGrossProfit`, finalGrossProfit);
  }

  function calculateTotalEquipmentCost(fields) {
    let totalEquipmentHours = 0;

    fields.forEach((element, i) => {
      let days = Number(getValues(`equipment[${i}].days`) || 0);
      let hoursPerDay = Number(getValues(`equipment[${i}].hoursPerDay`) || 0);

      totalEquipmentHours = totalEquipmentHours + days * hoursPerDay;
    });

    setValue(`totalEquipmentHours`, totalEquipmentHours.toFixed(2));

    let equipmentTotal = fields.reduce((acc, field, index) => {
      const amount = Number(getValues(`equipment[${index}].equipmentSubTotal`));
      return acc + (amount || 0);
    }, 0);
    setValue(`equipmentTotal`, equipmentTotal.toFixed(2));
    calculateTotalCost();
  }

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Equipment Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Days</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Hours Per Day</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Direct Cost Per Hour
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Total Equipment Cost
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell sx={{ width: "150px", paddingTop: 3 }}>
                <Controller
                  name={`equipment[${index}].name`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={equipments}
                      getOptionLabel={(option) => option?.Name}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="" size="small" />
                      )}
                      onChange={(_, data) => {
                        console.log({ equip: data });
                        if (data) {
                          let quantity = Number(
                            getValues(`equipment[${index}].quantity`) || 0
                          );
                          let days = Number(
                            getValues(`equipment[${index}].days`) || 0
                          );
                          let hoursPerDay = Number(
                            getValues(`equipment[${index}].hoursPerDay`) || 0
                          );
                          let directCostPerHour = Number(data?.Rate);

                          update(index, {
                            ...fields[index],
                            quantity: quantity,
                            days: days,
                            hoursPerDay: hoursPerDay,
                            directCostPerHour: directCostPerHour,
                            equipmentSubTotal: Number(
                              (
                                quantity *
                                days *
                                hoursPerDay *
                                directCostPerHour
                              ).toFixed(2)
                            ),
                          });
                        } else {
                          update(index, {
                            ...fields[index],
                            quantity: 0,
                            days: 0,
                            hoursPerDay: 0,
                            directCostPerHour: 0,
                            equipmentSubTotal: 0,
                          });
                        }

                        calculateTotalEquipmentCost(fields);
                        field.onChange(data);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`equipment[${index}].quantity`}
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
                        let equipmentSubTotal =
                          Number(e.target.value || 0) *
                          Number(getValues(`equipment[${index}].days`) || 0) *
                          Number(
                            getValues(`equipment[${index}].hoursPerDay`) || 0
                          ) *
                          Number(
                            getValues(
                              `equipment[${index}].directCostPerHour`
                            ) || 0
                          );

                        setValue(
                          `equipment[${index}].equipmentSubTotal`,
                          Number(equipmentSubTotal.toFixed(2))
                        );

                        let equipmentTotal = fields.reduce(
                          (acc, field, index) => {
                            const amount = getValues(
                              `equipment[${index}].equipmentSubTotal`
                            );
                            return acc + (amount || 0);
                          },
                          0
                        );
                        setValue(
                          `equipmentTotal`,
                          Number(equipmentTotal.toFixed(2))
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
                  name={`equipment[${index}].days`}
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
                        let equipmentSubTotal =
                          Number(e.target.value || 0) *
                          Number(
                            getValues(`equipment[${index}].quantity`) || 0
                          ) *
                          Number(
                            getValues(`equipment[${index}].hoursPerDay`) || 0
                          ) *
                          Number(
                            getValues(
                              `equipment[${index}].directCostPerHour`
                            ) || 0
                          );

                        setValue(
                          `equipment[${index}].equipmentSubTotal`,
                          Number(equipmentSubTotal.toFixed(2))
                        );

                        let totalEquipmentHours = 0;

                        fields.forEach((element, i) => {
                          let days = Number(
                            getValues(`equipment[${i}].days`) || 0
                          );
                          let hoursPerDay = Number(
                            getValues(`equipment[${i}].hoursPerDay`) || 0
                          );
                          if (i === index) {
                            days = Number(e.target.value || 0);
                          }
                          totalEquipmentHours =
                            totalEquipmentHours + days * hoursPerDay;
                        });

                        setValue(
                          `totalEquipmentHours`,
                          Number(totalEquipmentHours.toFixed(2))
                        );

                        let equipmentTotal = fields.reduce(
                          (acc, field, index) => {
                            const amount = getValues(
                              `equipment[${index}].equipmentSubTotal`
                            );
                            return acc + (amount || 0);
                          },
                          0
                        );
                        setValue(
                          `equipmentTotal`,
                          Number(equipmentTotal.toFixed(2))
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
                  name={`equipment[${index}].hoursPerDay`}
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
                        let equipmentSubTotal =
                          Number(e.target.value || 0) *
                          Number(
                            getValues(`equipment[${index}].quantity`) || 0
                          ) *
                          Number(getValues(`equipment[${index}].days`) || 0) *
                          Number(
                            getValues(
                              `equipment[${index}].directCostPerHour`
                            ) || 0
                          );

                        setValue(
                          `equipment[${index}].equipmentSubTotal`,
                          Number(equipmentSubTotal.toFixed(2))
                        );

                        let totalEquipmentHours = 0;

                        fields.forEach((element, i) => {
                          let days = Number(
                            getValues(`equipment[${i}].days`) || 0
                          );
                          let hoursPerDay = Number(
                            getValues(`equipment[${i}].hoursPerDay`) || 0
                          );
                          if (i === index) {
                            hoursPerDay = Number(e.target.value || 0);
                          }
                          totalEquipmentHours =
                            totalEquipmentHours + days * hoursPerDay;
                        });

                        setValue(
                          `totalEquipmentHours`,
                          Number(totalEquipmentHours.toFixed(2))
                        );

                        let equipmentTotal = fields.reduce(
                          (acc, field, index) => {
                            const amount = getValues(
                              `equipment[${index}].equipmentSubTotal`
                            );
                            return acc + (amount || 0);
                          },
                          0
                        );
                        setValue(
                          `equipmentTotal`,
                          Number(equipmentTotal.toFixed(2))
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
                  name={`equipment[${index}].directCostPerHour`}
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
                        let equipmentSubTotal =
                          Number(e.target.value || 0) *
                          Number(
                            getValues(`equipment[${index}].quantity`) || 0
                          ) *
                          Number(getValues(`equipment[${index}].days`) || 0) *
                          Number(
                            getValues(`equipment[${index}].hoursPerDay`) || 0
                          );

                        setValue(
                          `equipment[${index}].equipmentSubTotal`,
                          Number(equipmentSubTotal.toFixed(2))
                        );

                        let totalEquipmentHours = 0;

                        let equipmentTotal = fields.reduce(
                          (acc, field, index) => {
                            const amount = getValues(
                              `equipment[${index}].equipmentSubTotal`
                            );
                            return acc + (amount || 0);
                          },
                          0
                        );
                        setValue(
                          `equipmentTotal`,
                          Number(equipmentTotal.toFixed(2))
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
                  {...register(`equipment[${index}].equipmentSubTotal`)}
                  size="small"
                  fullWidth
                  type="number"
                  InputProps={{
                    readOnly: true,
                    startAdornment: <Typography>$</Typography>,
                  }}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    remove(index);
                    calculateTotalEquipmentCost(fields);
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
            quantity: 0,
            days: 0,
            hoursPerDay: 0,
            directCostPerHour: 0,
            equipmentSubTotal: 0,
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
              label="Total Equipment Hours"
              {...register("totalEquipmentHours")}
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
              label="Total Equipment Cost"
              {...register("equipmentTotal")}
              size="small"
              fullWidth
              margin="normal"
              type="number"
              InputProps={{
                readOnly: true,
                startAdornment: <Typography>$</Typography>,
              }}
              // value={totalManHours}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ExquipmentCost;

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
