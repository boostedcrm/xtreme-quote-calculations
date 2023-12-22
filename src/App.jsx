import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import logo from "../public/logo.png";
import CloseIcon from "@mui/icons-material/Close";
import QuoteCalculation from "./page/QuoteCalculation";
import QuoteStepper from "./page/QuoteStepper";

const ZOHO = window.ZOHO;

function App() {
  const [dealID, setDealID] = useState(null);
  const [zohoLoaded, setZohoLoaded] = useState(false);
  const [page, setPage] = useState("Home");
  const [concreteItems, setConcreteItems] = useState([]);
  const [honingItems, setHoningItems] = useState([]);
  const [coatingItems, setCoatingItems] = useState([]);
  const [dealData, setDealData] = useState(null);
  const [products, setProducts] = useState([])

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      //Custom Bussiness logic goes here
      setDealID(data.EntityId);
    });
    /*
     * initializing the widget.
     */
    ZOHO.embeddedApp.init().then(() => {
      setZohoLoaded(true);
      ZOHO.CRM.UI.Resize({ height: "600", width: "1200" }).then(function (
        data
      ) {
        console.log(data);
      });
    });
  }, []);

  useEffect(() => {
    async function getData() {
      if (zohoLoaded) {
        console.log({ dealID });
        ZOHO.CRM.API.getRecord({
          Entity: "Deals",
          approved: "both",
          RecordID: dealID,
        }).then(function (data) {
          setDealData(data?.data[0]);
        });
        ZOHO.CRM.API.getAllRecords({
          Entity: "Products",
          sort_order: "asc",
          per_page: 200,
          page: 1,
        }).then(function (data) {
          // console.log({products:});
          setProducts(data.data)
        });
      }
    }
    getData();
  }, [zohoLoaded, dealID]);

  const handleClose = async () => {
    await ZOHO.CRM.UI.Popup.close().then(function (data) {
      console.log(data);
    });
  };

  if (!zohoLoaded) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // gap: 2,
          pb: 3,
        }}
      >
        <img src={logo} alt="logo" height={100} />
        <Typography variant="h4" align="center" fontWeight="bold">
          Calculate Quote Rayhan Widget
        </Typography>
        <Box>
          <CloseIcon
            sx={{ cursor: "pointer", fontSize: "35px" }}
            onClick={handleClose}
          />
        </Box>
      </Box>
      {/* <QuoteCalculation setPage={setPage} handleClose={handleClose} /> */}
      {dealData !== null && (
        <QuoteStepper
          setPage={setPage}
          handleClose={handleClose}
          dealData={dealData}
          products={products}
          ZOHO={ZOHO}
        />
      )}
    </Box>
  );
}

export default App;
