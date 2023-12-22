import React from "react";
import XtremeQuoteForm from "../components/XtremeQuoteForm";
import MaterialCosts from "../components/MaterialCosts";
import LaborCosts from "../components/LaborCosts";
import { Box, Button } from "@mui/material";
import ExquipmentCost from "../components/EquipmentCost";
import Lodging from "../components/Lodging";
import PerDiem from "../components/PerDiem";
import RentalEquipment from "../components/RentalEquipment";
import VehicleExpense from "../components/VehicleExpense";
import Calculation from "../components/Calculation";

export default function QuoteCalculation({ setPage, handleClose }) {

  return (
    <div>
      {" "}
      {/* step - 1 */}
      <XtremeQuoteForm />
       {/* step - 2 */}
      <MaterialCosts />
       {/* step - 3 */}
      <LaborCosts />
       {/* step - 4 */}
      <ExquipmentCost />
       {/* step - 5 */}
      <Lodging />
       {/* step - 6 */}
      <PerDiem />
       {/* step - 7 */}
      <RentalEquipment />
       {/* step - 8 */}
      <VehicleExpense />
       {/* step - 9 */}
      <Calculation />
      <Box sx={{ display: "flex", pl: 2, gap: 2 }}>
        <Button onClick={() => setPage("Home")} variant="contained">
          Calculate
        </Button>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
      </Box>
    </div>
  );
}
