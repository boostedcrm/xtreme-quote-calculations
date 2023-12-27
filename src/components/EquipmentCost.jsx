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

  function calculateTotalEquipmentCost(fields) {
    let totalEquipmentHours = 0;

    fields.forEach((element, i) => {
      let days = Number(getValues(`equipment[${i}].days`) || 0);
      let hoursPerDay = Number(getValues(`equipment[${i}].hoursPerDay`) || 0);

      totalEquipmentHours = totalEquipmentHours + days * hoursPerDay;
    });

    setValue(`totalEquipmentHours`, totalEquipmentHours);

    let equipmentTotal = fields.reduce((acc, field, index) => {
      const amount = getValues(`equipment[${index}].equipmentSubTotal`);
      return acc + (amount || 0);
    }, 0);
    setValue(`equipmentTotal`, equipmentTotal);
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
              <TableCell sx={{ width: "150px" }}>
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
                          let directCostPerHour = Number(
                            getValues(
                              `equipment[${index}].directCostPerHour`
                            ) || 5
                          );

                          update(index, {
                            ...fields[index],
                            quantity: quantity,
                            days: days,
                            hoursPerDay: hoursPerDay,
                            directCostPerHour: directCostPerHour,
                            equipmentSubTotal:
                              quantity * days * hoursPerDay * directCostPerHour,
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
                          equipmentSubTotal
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
                        setValue(`equipmentTotal`, equipmentTotal);

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
                          equipmentSubTotal
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

                        setValue(`totalEquipmentHours`, totalEquipmentHours);

                        let equipmentTotal = fields.reduce(
                          (acc, field, index) => {
                            const amount = getValues(
                              `equipment[${index}].equipmentSubTotal`
                            );
                            return acc + (amount || 0);
                          },
                          0
                        );
                        setValue(`equipmentTotal`, equipmentTotal);

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
                          equipmentSubTotal
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

                        setValue(`totalEquipmentHours`, totalEquipmentHours);

                        let equipmentTotal = fields.reduce(
                          (acc, field, index) => {
                            const amount = getValues(
                              `equipment[${index}].equipmentSubTotal`
                            );
                            return acc + (amount || 0);
                          },
                          0
                        );
                        setValue(`equipmentTotal`, equipmentTotal);

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
                          equipmentSubTotal
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
                        setValue(`equipmentTotal`, equipmentTotal);

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
            name: {},
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
              label="Total Exquipment Hours"
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
              label="Total Exquipment Cost"
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
