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

const RentalEquipment = ({ control, watch, getValues, register }) => {
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

  // const onSubmit = (data) => {
  //   console.log(data);
  // };

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
                  `labor[${index}].equipmentName`,
                  "Equipment Name",
                  "",
                  control
                )}
              </TableCell>
              <TableCell>
                {renderTextField(`labor[${index}].rate`, "Rate", "", control)}
              </TableCell>
              <TableCell>
                {renderTextField(`labor[${index}].tax`, "", "", control)}
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
