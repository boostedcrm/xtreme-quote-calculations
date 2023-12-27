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

const RentalEquipment = ({ control, watch, getValues, register, setValue }) => {
  // const { control, handleSubmit, register, getValues } = useForm({
  //   defaultValues: {
  //     materials: [
  //       { name: "", size: "", coverage: "", amount: "", pricePer: "" },
  //     ],
  //   },
  // });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "rentalequipment",
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
  }

  function calculateTotalRentalEquipmentCost(fields) {
    let totalrentalEquipmenCost = fields.reduce((acc, field, index) => {
      const amount = getValues(
        `rentalequipment[${index}].rentalEquipmentSubtotal`
      );
      return acc + (amount || 0);
    }, 0);

    setValue(`totalrentalEquipmenCost`, totalrentalEquipmenCost);
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
        Rental Equipment
      </Typography>
      <hr />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Equipment Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Rate</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tax</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>
                {renderTextField(
                  `rentalequipment[${index}].equipmentName`,
                  "Equipment Name",
                  "",
                  control
                )}
              </TableCell>
              <TableCell>
                <Controller
                  name={`rentalequipment[${index}].rate`}
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
                        let tax = rate * 0.06;

                        let rentalEquipmentSubtotal = rate + tax;

                        setValue(`rentalequipment[${index}].tax`, tax);
                        setValue(
                          `rentalequipment[${index}].rentalEquipmentSubtotal`,
                          rentalEquipmentSubtotal
                        );

                        calculateTotalRentalEquipmentCost(fields)

                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                {renderTextField(
                  `rentalequipment[${index}].tax`,
                  "",
                  "",
                  control
                )}
              </TableCell>
              <TableCell>
                {renderTextField(
                  `rentalequipment[${index}].rentalEquipmentSubtotal`,
                  "",
                  "",
                  control
                )}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    remove(index);
                    calculateTotalRentalEquipmentCost(fields);
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
            equipmentName: "",
            rate: "",
            tax: "",
            rentalEquipmentSubtotal: "",
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
              label="Total Rental Equipmen Cost"
              {...register("totalrentalEquipmenCost")}
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

export default RentalEquipment;

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
