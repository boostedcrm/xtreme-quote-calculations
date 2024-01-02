import { useForm, Controller } from "react-hook-form";
import { DateTime } from "luxon";

import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const XtremeQuoteForm = ({ dealData, checklistData, quoteType, control }) => {
  const [totalSqft, setTotalSqft] = useState(0);

  useEffect(() => {
    if (quoteType != null) {
      const checklistType = quoteType.split(" ")[1];
      if (checklistType === "Polish" && checklistData?.Polished_SQFT != null) {
        setTotalSqft(checklistData?.Polished_SQFT);
      }
    }
  }, []);
  // console.log({ dealData: dealData?.Sales_Person?.name });

  return (
    <Box>
      <Grid container spacing={2}>
        {renderTextField(
          "Quote_Title",
          "Quote Title",
          dealData?.Deal_Name || "",
          control
        )}
        {renderTextField(
          "Prepare_For",
          "Prepare For",
          dealData?.Account_Name?.name || "",
          control
        )}
      </Grid>
      <Grid container spacing={2}>
        {renderTextField(
          "Account_Name",
          "Account Name",
          dealData?.Account_Name?.name || "",
          control
        )}
        {renderTextField(
          "Contact Name",
          "Contact Name",
          dealData?.Contact_Name?.name || "",
          control
        )}
      </Grid>
      <Grid container spacing={2}>
        {renderTextField(
          "Assigned To",
          "Assigned To",
          dealData?.Assigned_To?.name,
          control
        )}
        {renderTextField(
          "Sales person",
          "Sales person",
          dealData?.Sales_Person?.name,
          control
        )}
      </Grid>
      <Grid container spacing={2}>
        {renderTextField(
          "Vendor-Type",
          "Vendor Type",
          dealData?.Vendor_Type || dealData?.Vendor_Type1 || "",
          control
        )}
        {renderTextField(
          "Quote Status",
          "Quote Status",
          dealData?.Quote_Status || "",
          control
        )}
      </Grid>
      <Grid container spacing={2}>
        {renderTextField(
          "Quote Type",
          "Quote Type",
          dealData?.Quote_Type || "",
          control
        )}
        {renderTextField(
          "Total_Square_Feet",
          "Total Square Feet",
          totalSqft,
          control
        )}
      </Grid>
      <br />
      <Grid container gap={12}>
        {/* {renderDatePicker("EstPerformDate", "Est Perform Date", "", control)} */}
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <Controller
            control={control}
            name={`EstPerformDate`}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <DatePicker
                disabled={true}
                  label="Est Perform Date"
                  value={
                    DateTime.fromISO(field?.value) ||
                    DateTime.now().setZone("utc")
                  }
                  inputRef={
                    DateTime.fromISO(field?.ref) ||
                    DateTime.now().setZone("utc")
                  }
                  // value={DateTime.now().setZone("utc")}
                  // inputRef={DateTime.now().setZone("utc")}
                  // minDate={DateTime.now().setZone("utc")}
                  // maxDate={DateTime.fromISO(
                  //   getValues(`subform[${index}].dueDate`)
                  // )}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                />
              );
            }}
          />
        </LocalizationProvider>

        {/* {renderDatePicker("QuoteDueDate", "Quote Due Date", "", control)} */}
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <Controller
            control={control}
            name={`QuoteDueDate`}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <DatePicker
                  disabled={true}
                  label="Quote Due Date"
                  value={
                    DateTime.fromISO(field?.value) ||
                    DateTime.now().setZone("utc")
                  }
                  inputRef={
                    DateTime.fromISO(field?.ref) ||
                    DateTime.now().setZone("utc")
                  }
                  // value={DateTime.now().setZone("utc")}
                  // inputRef={DateTime.now().setZone("utc")}
                  // minDate={DateTime.now().setZone("utc")}
                  // maxDate={DateTime.fromISO(
                  //   getValues(`subform[${index}].dueDate`)
                  // )}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                />
              );
            }}
          />
        </LocalizationProvider>
      </Grid>
    </Box>
  );
};

export default XtremeQuoteForm;

const renderTextField = (
  name,
  label,
  defaultValue,
  control,
  disabled = true
) => (
  <Grid item xs={4}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
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

const renderSelectField = (name, label, defaultValue, control) => (
  <Grid item xs={6}>
    <FormControl variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select label={label} {...field}>
            <MenuItem value="GC">GC</MenuItem>
            {/* Add more <MenuItem> components as needed */}
          </Select>
        )}
      />
    </FormControl>
  </Grid>
);

const renderShiftSelect = (
  name,
  label,
  defaultValue,
  control,
  items,
  labelWidth = 180
) => (
  <Grid item xs={6}>
    <FormControlLabel
      labelPlacement="start"
      control={
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <div style={{ display: "flex" }}>
              <div style={{ width: labelWidth, flexShrink: 0 }}>
                <label>{label}</label>
              </div>
              <TextField
                select
                label=""
                variant="outlined"
                {...field}
                size="small"
                sx={{ width: "223px" }}
              >
                {items.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          )}
        />
      }
    />
  </Grid>
);

const renderCheckboxField = (
  name,
  label,
  defaultValue,
  control,
  labelWidth = 170
) => (
  <Grid item xs={6}>
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <div style={{ display: "flex" }}>
              <div style={{ width: labelWidth, flexShrink: 0 }}>
                <label>{label}</label>
              </div>
              <Checkbox {...field} />
            </div>
          )}
        />
      }
      label=""
      labelPlacement="start"
    />
  </Grid>
);

const renderMultiTextField = (
  name,
  label,
  defaultValue,
  control,
  size = "small",
  labelWidth = 180
) => (
  <Grid item xs={6}>
    <FormControlLabel
      labelPlacement="start"
      control={
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <div style={{ display: "flex" }}>
              <div style={{ width: labelWidth, flexShrink: 0 }}>
                <label>{label}</label>
              </div>
              <TextField
                label=""
                variant="outlined"
                {...field}
                size="small"
                multiline
                rows={4}
                sx={{ width: "223px" }}
                onFocus={(e) => {
                  e.target.rows = 4; // Expand to 4 rows on focus
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    e.target.rows = 1; // Shrink to 1 row if the input is empty
                  }
                }}
              />
            </div>
          )}
        />
      }
    />
  </Grid>
);

const renderDatePicker = (name, label, defaultValue, control) => {
  return (
    <Grid item>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <DatePicker
              disablePast
              label={label}
              {...field}
              InputProps={{
                style: { height: "18px" }, // Reduces the height of the input field
              }}
              onChange={(newValue) => {
                field.onChange(dayjs(newValue).format("YYYY-MM-DD"));
              }}
              PopperProps={{
                placement: "right-end",
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  sx={{
                    borderLeft: "3px solid red",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderLeftColor: "transparent",
                      },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderLeftColor: "transparent",
                      },
                  }}
                  fullWidth
                  size="small" // Keeps the input field small
                  InputLabelProps={{ shrink: true }}
                  // Additional styling can be applied here
                  inputProps={{
                    style: { fontSize: 12 }, // Smaller font size for the input field
                  }}
                />
              )}
            />
          )}
        />
      </LocalizationProvider>
    </Grid>
  );
};

const renderMultiSelect = (
  name,
  label,
  defaultValue,
  control,
  items,
  labelWidth = 180
) => {
  return (
    <Grid item xs={6}>
      <FormControlLabel
        labelPlacement="start"
        control={
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <div style={{ display: "flex" }}>
                <div style={{ width: labelWidth, flexShrink: 0 }}>
                  <label>{label}</label>
                </div>
                <TextField
                  select
                  label=""
                  variant="outlined"
                  {...field}
                  size="small"
                  sx={{ width: "223px" }}
                >
                  {items.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            )}
          />
        }
      />
    </Grid>
  );
};
