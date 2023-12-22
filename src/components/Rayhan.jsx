import React, { useCallback, useEffect, useState } from "react";
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

const defaultMaterial = { firstName: "bill", lastName: "luo" };

export default function Rayhan({ products }) {
  const { register, control, handleSubmit, reset, trigger, setError } = useForm(
    {
      //   defaultValues: {},
    }
  );
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "test",
  });

  const [tempData, setTempData] = useState([]);
  const handleAddNew = useCallback(() => append(defaultMaterial), [append]);

  useEffect(() => {
    console.log({ fields });
    setTempData(fields);
  }, [fields]);

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
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
              <TableRow key={item?.id}>
                <TableCell sx={{ width: "150px" }}>
                  <Controller
                    name={`test[${index}].product`}
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={products}
                        getOptionLabel={(option) => option.Product_Name}
                        // isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Material"
                            size="small"
                          />
                        )}
                        onChange={(_, data) => {
                          console.log({ data, field, _ });
                          update(index, {
                            ...tempData[index],
                            firstName: data?.Product_Name,
                          });
                          return field.onChange(data);
                        }}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    render={({ field }) => <input {...field} />}
                    name={`test.${index}.firstName`}
                    control={control}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    render={({ field }) => <input {...field} />}
                    name={`test.${index}.lastName`}
                    control={control}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            <button type="button" onClick={() => remove(index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleAddNew}>
        append
      </button>
      <input type="submit" />
    </form>
  );
}
