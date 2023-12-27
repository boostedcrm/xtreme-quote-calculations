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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const VehicleExpense = ({ control, watch, getValues, register, setValue }) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "vehicleexpense",
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

  function calculateTotalVehicleExpenseCost(fields) {
    let totalVehicleExpenseCost = fields.reduce((acc, field, index) => {
      const amount = getValues(
        `vehicleexpense[${index}].vehicleExpenseSubtotal`
      );
      return acc + (amount || 0);
    }, 0);

    setValue(`totalVehicleExpenseCost`, totalVehicleExpenseCost);
    calculateTotalCost()
  }

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          padding: "25px 10px 5px 10px",
        }}
      >
        Vehicle Expenses
      </Typography>
      <hr />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Mileage</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Rate</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>
                <Controller
                  name={`vehicleexpense[${index}].mileage`}
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
                        let mileage = Number(e.target.value || 0);
                        let rate = Number(
                          getValues(`vehicleexpense[${index}].rate`) || 0
                        );

                        let vehicleExpenseSubtotal = rate * mileage;

                        setValue(
                          `vehicleexpense[${index}].vehicleExpenseSubtotal`,
                          vehicleExpenseSubtotal
                        );

                        calculateTotalVehicleExpenseCost(fields)

                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`vehicleexpense[${index}].rate`}
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
                        let rate = Number(e.target.value || 0);
                        let mileage = Number(
                          getValues(`vehicleexpense[${index}].mileage`) || 0
                        );

                        let vehicleExpenseSubtotal = rate * mileage;

                        setValue(
                          `vehicleexpense[${index}].vehicleExpenseSubtotal`,
                          vehicleExpenseSubtotal
                        );
                        calculateTotalVehicleExpenseCost(fields)

                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                {renderTextField(
                  `vehicleexpense[${index}].vehicleExpenseSubtotal`,
                  "total",
                  "",
                  control
                )}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    remove(index);
                    calculateTotalVehicleExpenseCost(fields);
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
            mileage: 0,
            rate: 0.59,
            vehicleExpenseSubtotal: 0,
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
              label="Total Vehicle Expense Cost"
              {...register("totalVehicleExpenseCost")}
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

export default VehicleExpense;

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
