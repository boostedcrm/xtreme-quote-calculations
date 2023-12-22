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

const PerDiem = ({control,watch, getValues, register}) => {
  // const { control, handleSubmit, register, getValues } = useForm({
  //   defaultValues: {
  //     materials: [
  //       { name: "", size: "", coverage: "", amount: "", pricePer: "" },
  //     ],
  //   },
  // });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials",
  });

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          padding: "25px 10px 5px 10px",
        }}
      >
        Per Diem
      </Typography>
      <hr />
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
                <TableCell sx={{ width: "150px" }}>
                  <Controller
                    name={`materials[${index}].name`}
                    control={control}
                    render={({ field }) => (
                      <Select {...field} fullWidth size="small">
                        <MenuItem value="75+ Miles">75+ Miles</MenuItem>
                        <MenuItem value="Overnight">Overnight</MenuItem>
                        {/* Add your other options here */}
                      </Select>
                    )}
                  />
                </TableCell>
                <TableCell>
                  {renderTextField(
                    `labor[${index}].crewSize`,
                    "days",
                    "",
                    control
                  )}
                </TableCell>
                <TableCell>
                  {renderTextField(
                    `labor[${index}].costPerRoom`,
                    "",
                    "",
                    control
                  )}
                </TableCell>
                <TableCell>
                  {renderTextField(
                    `labor[${index}].numberOfRooms`,
                    "",
                    "",
                    control
                  )}
                </TableCell>
                <TableCell>
                  {renderTextField(`labor[${index}].total`, "", "", control)}
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
              name: "",
              size: "",
              coverage: "",
              amount: "",
              pricePer: "",
            })
          }
        >
          Add New
        </Button>
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
