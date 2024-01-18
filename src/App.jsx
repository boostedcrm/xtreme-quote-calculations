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
  const [dealData, setDealData] = useState(null);
  const [products, setProducts] = useState([]);
  const [quoteDistributions, setQuoteDistributions] = useState([]);
  const [quoteType, setQuoteType] = useState(null);
  const [checklistData, setCheckListData] = useState(null);

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
          console.log({dealData: data?.data[0]});
          setDealData(data?.data[0]);
          if (data?.data[0] !== undefined) {
            var config = {
              Entity: "Deals",
              RecordID: dealID,
            };

            ZOHO.CRM.API.getBluePrint(config).then(function (data) {
              console.log({ getBluePrint: data });
            });
            const dealData = data?.data[0];
            console.log({ dealData });
            let previousData = JSON.parse(dealData?.Clarification20 || "{}");
            console.log({ previousData });
            const Quote_Type = dealData.Quote_Type;

            if (Quote_Type != null) {
              const quoteType = Quote_Type.split(" ")[0];
              setQuoteType((prev) => Quote_Type);
              if (
                quoteType === "Concrete" &&
                dealData?.Concrete_Bid_Checklist?.id !== null
              ) {
                ZOHO.CRM.API.getRecord({
                  Entity: "Concrete_Bid_Checklists",
                  approved: "both",
                  RecordID: dealData?.Concrete_Bid_Checklist?.id,
                }).then(function (data) {
                  console.log({ Concrete_Bid_Checklists: data });
                  setCheckListData((prev) => data.data[0]);
                });
              }

              if (
                quoteType === "Coating" &&
                dealData?.Coating_Bid_Checklist?.id !== null
              ) {
                ZOHO.CRM.API.getRecord({
                  Entity: "Coating_Bid_Checklists",
                  approved: "both",
                  RecordID: dealData?.Coating_Bid_Checklist?.id,
                }).then(function (data) {
                  setCheckListData(data.data[0]);
                });
              }

              if (
                quoteType === "Honing" &&
                dealData?.Honing_Bid_Checklist?.id !== null
              ) {
                ZOHO.CRM.API.getRecord({
                  Entity: "Honing_Bid_Checklists",
                  approved: "both",
                  RecordID: dealData?.Honing_Bid_Checklist?.id,
                }).then(function (data) {
                  // console.log({ Honing_Bid_Checklists: data });
                  setCheckListData(data.data[0]);
                });
              }
            }
          }
        });

        ZOHO.CRM.API.getAllRecords({
          Entity: "Products",
          sort_order: "asc",
          per_page: 200,
          page: 1,
        }).then(function (data) {
          console.log({ products: data.data });
          setProducts(data.data);
        });
      }
    }
    getData();
  }, [zohoLoaded, dealID]);

  const handleClose = async () => {
    await ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
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
          Calculate Quote Widget
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
          // quoteDistributions={quoteDistributions}
          checklistData={checklistData}
          quoteType={quoteType}
        />
      )}
    </Box>
  );
}

export default App;
