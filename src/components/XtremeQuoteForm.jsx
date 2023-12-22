import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const XtremeQuoteForm = ({ dealData }) => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  // console.log({ dealData: dealData?.Sales_Person?.name });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          "Contact_Name",
          "Contact Name",
          dealData?.Contact_Name?.name || "",
          control
        )}
      </Grid>
      <Grid container spacing={2}>
        {renderTextField("Assigned_To", "Assigned To", dealData?.Assigned_To?.name, control)}
        {renderTextField("Salesperson", "Sales person", dealData?.Sales_Person?.name, control)}
      </Grid>
      <Grid container spacing={2}>
        {renderTextField("vendor_type", "Vendor Type", dealData?.Vendor_Type1 || "", control)}
        {renderTextField("Quote_Status", "Quote Status", dealData?.Quote_Status || "", control)}
      </Grid>
      <Grid container spacing={2}>
        {renderTextField("Quote_Type", "Quote Type", dealData?.Quote_Type || "", control)}
        {renderTextField("Total_Square_Feet", "Total Square Feet", "", control)}
      </Grid>
      {/* <Button type="submit" variant="contained" color="primary" style={{ marginTop: 16 }}>
        Submit Quote
      </Button> */}
    </form>
  );
};

export default XtremeQuoteForm;

const renderTextField = (
  name,
  label,
  defaultValue,
  control,
  size = "small",
  labelWidth = 180
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
                <div style={{ width: "180px", flexShrink: 0 }}>
                  <label>{label}</label>
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    disablePast
                    {...field}
                    inputProps={{
                      style: {
                        height: 18,
                      },
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
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: "223px" }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            )}
          />
        }
      />
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
