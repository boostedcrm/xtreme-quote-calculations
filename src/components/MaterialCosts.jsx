import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  total: 0,
};

const MaterialRow = ({
  fields,
  item,
  control,
  register,
  index,
  remove,
  getValues,
  setValue,
  products,
  update,
}) => {
  const [product, setProduct] = useState(null);

  function setAllValue(fields) {
    let materialsSubTotal = fields.reduce((acc, field, index) => {
      const amount = getValues(`materials[${index}].total`);
      return acc + (amount || 0);
    }, 0);

    let materialTax = materialsSubTotal * 0.06;
    let materialWasteShipCost = materialsSubTotal * 0.16;
    let materialTotalCost =
      materialsSubTotal + materialWasteShipCost + materialTax;

    setValue(`materialsSubTotal`, materialsSubTotal);

    setValue(`materialWasteShipCost`, materialWasteShipCost);

    setValue(`materialTax`, materialTax);

    setValue(`materialTotalCost`, materialTotalCost);
  }

  return (
    <TableRow key={item.id}>
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
              onChange={(_, data) => {
                update(index, {
                  ...fields[index],
                  size: data?.Size,
                  coverage: data?.Coverage_Rate_per_Gallon || 0,
                  pricePer: data?.Unit_Price || 0,
                  amount: 0,
                  total: 0,
                });
                return field.onChange(data);
              }}
            />
          )}
        />
      </TableCell>
      <TableCell>
        {renderTextField(
          `materials[${index}].size`,
          "",
          product?.Product_Name || "",
          control,
          true
        )}
      </TableCell>
      <TableCell>
        {renderTextField(
          `materials[${index}].coverage`,
          "",
          product?.Product_Name || "",
          control,
          true
        )}
      </TableCell>
      <TableCell>
        <Grid item xs={4}>
          <Controller
            name={`materials[${index}].amount`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={""}
                variant="outlined"
                size="small"
                margin="normal"
                type="number"
                fullWidth
                onChange={(e) => {
                  setValue(
                    `materials[${index}].total`,
                    Number(e.target.value) *
                      Number(getValues(`materials[${index}].pricePer`))
                  );
                  setAllValue(fields);
                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </Grid>
      </TableCell>
      <TableCell>
        <Grid item xs={4}>
          <Controller
            name={`materials[${index}].pricePer`}
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
                required
                InputProps={{
                  startAdornment: <Typography>$</Typography>,
                }}
                onChange={(e) => {
                  setValue(
                    `materials[${index}].total`,
                    Number(e.target.value) *
                      Number(getValues(`materials[${index}].amount`))
                  );
                  setAllValue(fields);
                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </Grid>
      </TableCell>
      <TableCell>
        {renderTextField(`materials[${index}].total`, "", "", control, true)}
      </TableCell>
      <TableCell>
        <IconButton
          onClick={() => {
            remove(index);
            setAllValue(fields);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const MaterialCosts = ({
  products,
  control,
  getValues,
  register,
  setValue,
}) => {
  

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "materials",
  });


  const handleAddNew = useCallback(() => append(defaultMaterial), [append]);

  const materialTotal = useMemo(() => {
    return fields.reduce((acc, field, index) => {
      const amount = getValues(`materials[${index}].amount`);
      const pricePer = getValues(`materials[${index}].pricePer`);
      return acc + (amount && pricePer ? amount * pricePer : 0);
    }, 0);
  }, [fields, getValues]);

  useEffect(() => {
    console.log({ fields });
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
              fields={fields}
              key={index}
              item={item}
              control={control}
              register={register}
              index={index}
              remove={remove}
              getValues={getValues}
              products={products}
              setValue={setValue}
              update={update}
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
          <Controller
            name={`materialsSubTotal`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={"Materials Sub Total"}
                variant="outlined"
                size="small"
                margin="normal"
                fullWidth
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          {" "}
          <Controller
            name={`materialWasteShipCost`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={"Waste and Ship Cost"}
                variant="outlined"
                size="small"
                margin="normal"
                fullWidth
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          {" "}
          <Controller
            name={`materialTax`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={"Material Tax"}
                variant="outlined"
                size="small"
                margin="normal"
                fullWidth
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          {" "}
          <Controller
            name={`materialTotalCost`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={"Material Cost"}
                variant="outlined"
                size="small"
                margin="normal"
                fullWidth
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaterialCosts;

const renderTextField = (
  name,
  label,
  defaultValue,
  control,
  readOnly = false
) => (
  <Grid item xs={4}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          InputProps={{
            readOnly: readOnly,
          }}
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
