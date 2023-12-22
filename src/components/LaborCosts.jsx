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

const LaborCosts = ({ ZOHO, control, getValues, register }) => {
  const [labor, SetLabor] = useState(null);
  useEffect(() => {
    async function getData() {
      ZOHO.CRM.API.getAllRecords({
        Entity: "Labor_Master",
        sort_order: "asc",
        per_page: 200,
        page: 1,
      }).then(function (data) {
        // console.log({products:});
        SetLabor(data.data);
      });
    }
    getData();
  }, [ZOHO]);
  console.log({ labor });
  // const { control, handleSubmit, register, watch } = useForm({
  //   defaultValues: {
  //     labor: [
  //       {
  //         resourceTitle: "",
  //         timeFrame: "",
  //         days: "",
  //         hoursPerDay: "",
  //         men: "",
  //         costPerHour: "",
  //       },
  //     ],
  //   },
  // });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "labor",
  });
  // const totalManHours = watch("totalManHours");
  // const performCalculations = watch("performCalculations");

  const onSubmit = (data) => {
    console.log(data);
  };

  const calculateLaborCost = () => {
    // if (!performCalculations) return 0;
    // return fields
    //   .reduce((total, field) => {
    //     const days = field.days || 0;
    //     const hoursPerDay = field.hoursPerDay || 0;
    //     const men = field.men || 0;
    //     const costPerHour = field.costPerHour || 0;
    //     return total + days * hoursPerDay * men * costPerHour;
    //   }, 0)
    //   .toFixed(2);
  };

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
                    name={`materials[${index}].product`}
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
                        onChange={(_, data) => field.onChange(data)}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    {...register(`labor[${index}].timeFrame`)}
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    {...register(`labor[${index}].days`)}
                    size="small"
                    fullWidth
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    {...register(`labor[${index}].hoursPerDay`)}
                    size="small"
                    fullWidth
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    {...register(`labor[${index}].men`)}
                    size="small"
                    fullWidth
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    {...register(`labor[${index}].costPerHour`)}
                    size="small"
                    fullWidth
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    value={calculateLaborCost(index)}
                    InputProps={{ readOnly: true }}
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
              resourceTitle: "",
              timeFrame: "",
              days: "",
              hoursPerDay: "",
              men: "",
              costPerHour: "",
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
                }}
                // value={totalManHours}
              />
            </Grid>
            <Grid item xs={6}>
              {" "}
              <TextField
                label="Labor Cost"
                size="small"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
                value={calculateLaborCost()}
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

export default LaborCosts;
