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

  console.log({ product: product });
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
                  size: 5 + data?.Usage_Unit,
                  coverage: data?.Coverage_Rate_per_Gallon || 0,
                  pricePer: data?.Unit_Price || 0,
                  amount: 0,
                  total: 0
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
                fullWidth
                onChange={(e) => {
                  // console.log({data: e});
                  // e.preventDefault;
                  // update(index, {
                  //   ...fields[index],
                  //   total:
                  //     Number(e.target.value) * Number(fields[index]?.pricePer),
                  // });

                  setValue(
                    `materials[${index}].total`,
                    Number(e.target.value) * Number(getValues(`materials[${index}].pricePer`) )
                  );
                  setValue(
                    `materialsSubTotal`,
                    fields.reduce((acc, field, index) => {
                      const amount = getValues(`materials[${index}].total`);
                      
                      return acc + (amount || 0);
                    }, 0)
                  );

                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </Grid>

        {/* {renderTextField(
          `materials[${index}].amount`,
          "",
          product?.Product_Name || "",
          control
        )} */}
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
                onChange={(e) => {
                  // console.log({data: e});
                  // e.preventDefault;
                  // update(index, {
                  //   ...fields[index],
                  //   total:
                  //     Number(e.target.value) * Number(fields[index]?.pricePer),
                  // });

                  setValue(
                    `materials[${index}].total`,
                    Number(e.target.value) * Number(getValues(`materials[${index}].amount`))
                  );

                  setValue(
                    `materialsSubTotal`,
                    fields.reduce((acc, field, index) => {
                      const amount = getValues(`materials[${index}].total`);
                      
                      return acc + (amount || 0);
                    }, 0)
                  );

                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </Grid>
      </TableCell>
      <TableCell>
        {/* <TextField size="small" fullWidth InputProps={{ readOnly: true }} /> */}
        {renderTextField(`materials[${index}].total`, "", "", control, true)}
      </TableCell>
      <TableCell>
        <IconButton onClick={() => remove(index)}>
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
  // const { control, handleSubmit, register, getValues } = useForm({
  //   defaultValues: {
  //     materials: [defaultMaterial],
  //   },
  // });

  const { fields, append, remove, update } = useFieldArray({
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
          {/* <TextField
            name={"materialsSubTotal"}
            label="Mateiral Subtotal"
            size="small"
            fullWidth
            margin="normal"
            value={materialTotal}
            InputProps={{
              readOnly: true,
              startAdornment: <Typography>$</Typography>,
            }}
          /> */}
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

const renderTextField = (
  name,
  label,
  defaultValue,
  control,
  disable = false
) => (
  <Grid item xs={4}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disable}
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
