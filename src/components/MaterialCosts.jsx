import React, { useCallback, useMemo, useState } from "react";
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
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const defaultMaterial = {
  name: "",
  size: "",
  coverage: "",
  amount: "",
  pricePer: "",
};

const MaterialRow = ({
  control,
  register,
  index,
  remove,
  getValues,
  products,
}) => {
  const [product, setProduct] = useState(null);

  console.log({ product: product });
  return (
    <TableRow key={index}>
      <TableCell sx={{ width: "150px" }}>
        <Controller
          name={`materials[${index}].product`}
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={products}
              getOptionLabel={(option) => option.Product_Name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Material" size="small" />
              )}
              onChange={(_, data) => field.onChange(data)}
            />
          )}
        />
      </TableCell>
      <TableCell>
        {renderTextField(
          `materials[${index}].size`,
          "",
          product?.Product_Name || "",
          control
        )}
      </TableCell>
      <TableCell>
        {renderTextField(
          `materials[${index}].coverage`,
          "",
          product?.Product_Name || "",
          control
        )}
      </TableCell>
      <TableCell>
        {renderTextField(
          `materials[${index}].amount`,
          "",
          product?.Product_Name || "",
          control
        )}
      </TableCell>
      <TableCell>
        <TextField
          {...register(`materials[${index}].pricePer`)}
          size="small"
          fullWidth
        />
      </TableCell>
      <TableCell>
        <TextField size="small" fullWidth InputProps={{ readOnly: true }} />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => remove(index)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const MaterialCosts = ({ products, control, getValues, register }) => {
  // const { control, handleSubmit, register, getValues } = useForm({
  //   defaultValues: {
  //     materials: [defaultMaterial],
  //   },
  // });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials",
  });

  // const onSubmit = (data) => console.log(data);

  const handleAddNew = useCallback(() => append(defaultMaterial), [append]);

  const materialTotal = useMemo(() => {
    return fields.reduce((acc, field, index) => {
      const amount = getValues(`materials[${index}].amount`);
      const pricePer = getValues(`materials[${index}].pricePer`);
      return acc + (amount && pricePer ? amount * pricePer : 0);
    }, 0);
  }, [fields, getValues]);

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            {[
              "Material",
              "Size",
              "Coverage",
              "Amount",
              "Price Per",
              "Material Total",
              "Actions",
            ].map((header) => (
              <TableCell
                key={header}
                sx={{ fontWeight: "bold" }}
                align="center"
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((item, index) => (
            <MaterialRow
              key={index}
              control={control}
              register={register}
              index={index}
              remove={remove}
              getValues={getValues}
              products={products}
            />
          ))}
        </TableBody>
      </Table>
      <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddNew}>
        Add New
      </Button>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item xs={3}>
          {" "}
          <TextField
            label="Mateiral Subtotal"
            size="small"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
              startAdornment: <Typography>$</Typography>,
            }}
          />
        </Grid>
        <Grid item xs={3}>
          {" "}
          <TextField
            label="Waste and Ship Cost"
            size="small"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
              startAdornment: <Typography>$</Typography>,
            }}
          />
        </Grid>
        <Grid item xs={3}>
          {" "}
          <TextField
            label="Material Tax"
            size="small"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
              startAdornment: <Typography>$</Typography>,
            }}
          />
        </Grid>
        <Grid item xs={3}>
          {" "}
          <TextField
            label="Material Cost"
            size="small"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
              startAdornment: <Typography>$</Typography>,
            }}
          />
        </Grid>
        <Box sx={{ padding: "5px 20px" }}>
          <FormControlLabel
            control={<Checkbox {...register("performCalculations")} />}
            label="Perform calculations."
          />
        </Box>
      </Grid>
    </Box>
  );
};

export default MaterialCosts;

const renderTextField = (name, label, defaultValue, control) => (
  <Grid item xs={4}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          variant="outlined"
          size="small"
          margin="normal"
          fullWidth
        />
      )}
    />
  </Grid>
);

const renderAutocomplete = (
  name,
  label,
  defaultValue,
  control,
  options, // Array of options for the autocomplete
  setProduct
) => (
  <Grid item xs={4}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={options}
          getOptionLabel={(option) => option.Product_Name}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant="outlined"
              size="small"
              margin="normal"
              fullWidth
            />
          )}
          onChange={(_, data) => {
            field.onChange(data);
            setProduct(data);
          }}
        />
      )}
    />
  </Grid>
);
