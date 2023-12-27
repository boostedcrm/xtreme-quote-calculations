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

const Lodging = ({ control, watch, getValues, register, setValue }) => {
  // const { control, handleSubmit, register, getValues } = useForm({
  //   defaultValues: {
  //     materials: [
  //       { name: "", size: "", coverage: "", amount: "", pricePer: "" },
  //     ],
  //   },
  // });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "lodging",
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

  function calculateTotalLoadingCost(fields) {
    let totallodgingCost = fields.reduce((acc, field, index) => {
      const amount = getValues(`lodging[${index}].lodgingSubTotal`);
      return acc + (amount || 0);
    }, 0);
    setValue(`totallodgingCost`, totallodgingCost);
    calculateTotalCost();
  }

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          padding: "25px 10px 5px 10px",
        }}
      >
        Lodging
      </Typography>
      <hr />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Crew Size</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Days</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Cost Per Room</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Number of Rooms</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>
                <Controller
                  name={`lodging[${index}].crewSize`}
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
                        let numberOfRooms = Math.ceil(
                          Number(e.target.value || 0) / 2
                        );
                        setValue(
                          `lodging[${index}].numberOfRooms`,
                          numberOfRooms
                        );

                        let days = Number(
                          getValues(`lodging[${index}].days`) || 0
                        );
                        let costPerRoom = Number(
                          getValues(`lodging[${index}].costPerRoom`) || 0
                        );

                        let lodgingSubTotal =
                          numberOfRooms * days * costPerRoom;

                        setValue(
                          `lodging[${index}].lodgingSubTotal`,
                          lodgingSubTotal
                        );

                        let totallodgingCost = fields.reduce(
                          (acc, field, index) => {
                            const amount = getValues(
                              `lodging[${index}].lodgingSubTotal`
                            );
                            return acc + (amount || 0);
                          },
                          0
                        );
                        setValue(`totallodgingCost`, totallodgingCost);
                        calculateTotalCost();

                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`lodging[${index}].days`}
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
                        let costPerRoom = Number(
                          getValues(`lodging[${index}].costPerRoom`) || 0
                        );

                        let numberOfRooms = Number(
                          getValues(`lodging[${index}].numberOfRooms`) || 0
                        );

                        let lodgingSubTotal =
                          numberOfRooms * days * costPerRoom;

                        setValue(
                          `lodging[${index}].lodgingSubTotal`,
                          lodgingSubTotal
                        );
                        calculateTotalLoadingCost(fields);

                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`lodging[${index}].costPerRoom`}
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
                        let costPerRoom = Number(e.target.value || 0);
                        let days = Number(
                          getValues(`lodging[${index}].days`) || 0
                        );

                        let numberOfRooms = Number(
                          getValues(`lodging[${index}].numberOfRooms`) || 0
                        );

                        let lodgingSubTotal =
                          numberOfRooms * days * costPerRoom;

                        setValue(
                          `lodging[${index}].lodgingSubTotal`,
                          lodgingSubTotal
                        );

                        calculateTotalLoadingCost(fields);


                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                {renderTextField(
                  `lodging[${index}].numberOfRooms`,
                  "",
                  "",
                  control
                )}
              </TableCell>
              <TableCell>
                {renderTextField(
                  `lodging[${index}].lodgingSubTotal`,
                  "",
                  "",
                  control
                )}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    remove(index);
                    calculateTotalLoadingCost(fields);
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
            crewSize: 0,
            days: 0,
            costPerRoom: 160,
            numberOfRooms: 0,
            lodgingSubTotal: 0,
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
              label="Total Loading Cost"
              {...register("totallodgingCost")}
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

export default Lodging;

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
