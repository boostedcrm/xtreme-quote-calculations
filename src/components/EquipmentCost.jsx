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

const ExquipmentCost = ({ ZOHO, control, watch, getValues, register }) => {
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
                        field.onChange(data);
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <TextField
                  {...register(`equipment[${index}].quantity`)}
                  size="small"
                  fullWidth
                  type="number"
                />
              </TableCell>
              <TableCell>
                <TextField
                  {...register(`equipment[${index}].days`)}
                  size="small"
                  fullWidth
                  type="number"
                />
              </TableCell>
              <TableCell>
                <TextField
                  {...register(`equipment[${index}].hoursPerDay`)}
                  size="small"
                  fullWidth
                  type="number"
                />
              </TableCell>
              <TableCell>
                <TextField
                  {...register(`equipment[${index}].directCostPerHour`)}
                  defaultValue={5}
                  size="small"
                  fullWidth
                  type="number"
                />
              </TableCell>
              <TableCell>
                <TextField
                  {...register(`equipment[${index}].equipmentSubTotal`)}
                  size="small"
                  fullWidth
                  type="number"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => remove(index)}>
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
              }}
              // value={totalManHours}
            />
          </Grid>
          <Grid item xs={6}>
            {" "}
            <TextField
              label="Equipment Cost"
              size="small"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
                startAdornment: <Typography>$ </Typography>,
              }}
              // value={calculateLaborCost()}
            />
          </Grid>
        </Grid>
        <FormControlLabel
          control={<Checkbox {...register("performCalculations")} />}
          label="Perform calculations."
        />
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
