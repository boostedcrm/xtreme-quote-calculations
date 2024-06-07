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

const RentalEquipment = ({
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

  function calculateTotalRentalEquipmentCost(fields) {
    let totalrentalEquipmenCost = fields.reduce((acc, field, index) => {
      const amount = getValues(
        `rentalequipment[${index}].rentalEquipmentSubtotal`
      );
      return acc + (amount || 0);
    }, 0);

    setValue(
      `totalrentalEquipmenCost`,
      Number(totalrentalEquipmenCost.toFixed(2))
    );
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
        Rental Equipment
      </Typography>
      <hr /> */}
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
              <TableCell sx={{ paddingTop: 3 }}>
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

                        setValue(
                          `rentalequipment[${index}].tax`,
                          Number(tax.toFixed(2))
                        );
                        setValue(
                          `rentalequipment[${index}].rentalEquipmentSubtotal`,
                          Number(rentalEquipmentSubtotal.toFixed(2))
                        );

                        calculateTotalRentalEquipmentCost(fields);

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
                  control,
                  "small",
                  true
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
              label="Total Rental Equipment Cost"
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
  readOnly = false
) => (
  <Grid item xs={6}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          label=""
          variant="outlined"
          {...field}
          size={size}
          InputProps={{
            readOnly: readOnly,
          }}
        />
      )}
    />
  </Grid>
);
