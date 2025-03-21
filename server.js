{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red38\green38\blue38;\red242\green242\blue242;}
{\*\expandedcolortbl;;\cssrgb\c20000\c20000\c20000;\cssrgb\c96078\c96078\c96078;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs26 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 require("dotenv").config();\
const express = require("express");\
const axios = require("axios");\
const cors = require("cors");\
\
const app = express();\
const PORT = process.env.PORT || 5000;\
\
app.use(cors());\
\
const BASE_URL = `https://$\{process.env.CURRENT_RMS_SUBDOMAIN\}.current-rms.com/api/v1/orders`;\
const HEADERS = \{\
  "X-AUTH-TOKEN": process.env.CURRENT_RMS_API_KEY,\
  "Content-Type": "application/json",\
\};\
\
// Function to fetch job data\
const fetchJobs = async () => \{\
  try \{\
    const response = await axios.get(BASE_URL, \{ headers: HEADERS \});\
    const jobs = response.data.orders;\
\
    // Filter Jobs\
    const today = new Date().toISOString().split("T")[0]; // Get today's date\
    const jobsToPrepare = jobs.filter(\
      (job) => job.status === "Draft" && job.start_date.includes(today)\
    );\
    const preparedJobs = jobs.filter((job) => job.status === "Prepared");\
    const bookedOutJobs = jobs.filter((job) => job.status === "Checked Out");\
\
    return \{ jobsToPrepare, preparedJobs, bookedOutJobs \};\
  \} catch (error) \{\
    console.error("Error fetching jobs:", error);\
    return null;\
  \}\
\};\
\
// API Route\
app.get("/jobs", async (req, res) => \{\
  const data = await fetchJobs();\
  if (data) \{\
    res.json(data);\
  \} else \{\
    res.status(500).json(\{ error: "Failed to fetch jobs" \});\
  \}\
\});\
\
// Start Server\
app.listen(PORT, () => console.log(`Server running on port $\{PORT\}`));\
}