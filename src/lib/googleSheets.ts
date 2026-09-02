// Google Sheets & Drive API integration for Badass Designs
import firebaseConfig from "../../firebase-applet-config.json";

export interface SheetPreorder {
  orderId: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  product: string;
  quantity: number;
  size: string;
  color: string;
  totalAmount: number;
  depositAmount: number;
  balanceDue: number;
  status: string;
  rowIndex?: number;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  connectedAt?: string;
  userEmail?: string;
}

export const OAUTH_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  firebaseConfig.oAuthClientId ||
  "952360047224-8tcs9thlh9o0n0th1tt4pr8q0pgm0b9d.apps.googleusercontent.com";

export const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
].join(" ");

const DEFAULT_SHEET_TITLE = "Badass Designs - Preorder & Streetwear Registry";

const SHEET_HEADERS = [
  "Order ID",
  "Timestamp",
  "Customer Name",
  "Email",
  "Phone / WhatsApp",
  "Delivery Location",
  "Product",
  "Quantity",
  "Size",
  "Colorway",
  "Total Amount (FCFA)",
  "Deposit Paid (FCFA)",
  "Balance Due (FCFA)",
  "Order Status",
];

// In-memory token cache
let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

// Load stored config
export function getSavedSheetsConfig(): GoogleSheetsConfig | null {
  try {
    const raw = localStorage.getItem("badass_google_sheets_config");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSheetsConfig(config: GoogleSheetsConfig | null) {
  if (!config) {
    localStorage.removeItem("badass_google_sheets_config");
    localStorage.removeItem("badass_google_access_token");
  } else {
    localStorage.setItem("badass_google_sheets_config", JSON.stringify(config));
  }
}

export function getCachedAccessToken(): string | null {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }
  try {
    const saved = localStorage.getItem("badass_google_access_token");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.token && parsed.expiresAt > Date.now()) {
        cachedAccessToken = parsed.token;
        tokenExpiresAt = parsed.expiresAt;
        return cachedAccessToken;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function setCachedAccessToken(token: string, expiresInSec: number = 3600) {
  cachedAccessToken = token;
  tokenExpiresAt = Date.now() + (expiresInSec - 60) * 1000;
  try {
    localStorage.setItem(
      "badass_google_access_token",
      JSON.stringify({ token, expiresAt: tokenExpiresAt })
    );
  } catch {
    // ignore
  }
}

// Request access token using Google Identity Services (GSI)
export function requestGoogleAccessToken(promptConsent: boolean = false): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if token is still valid
    const existing = getCachedAccessToken();
    if (existing && !promptConsent) {
      resolve(existing);
      return;
    }

    const google = (window as any).google;
    if (!google || !google.accounts || !google.accounts.oauth2) {
      reject(new Error("Google Identity Services script not loaded. Please check your internet connection."));
      return;
    }

    try {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: OAUTH_CLIENT_ID,
        scope: SCOPES,
        prompt: promptConsent ? "consent" : "",
        callback: (tokenResponse: any) => {
          if (tokenResponse.error) {
            console.error("GSI Token Error:", tokenResponse);
            reject(new Error(tokenResponse.error_description || tokenResponse.error || "Failed to authenticate with Google."));
            return;
          }
          if (tokenResponse.access_token) {
            const expiresIn = tokenResponse.expires_in ? parseInt(tokenResponse.expires_in, 10) : 3600;
            setCachedAccessToken(tokenResponse.access_token, expiresIn);
            resolve(tokenResponse.access_token);
          } else {
            reject(new Error("No access token returned from Google."));
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: promptConsent ? "consent" : "" });
    } catch (err: any) {
      reject(new Error(err.message || "Failed to initialize Google OAuth token client."));
    }
  });
}

// Initialize headers and formatting on a sheet
export async function setupSheetHeaders(accessToken: string, spreadsheetId: string): Promise<void> {
  // Check if header row already exists
  const checkRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:N1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const checkData = await checkRes.json();
  const existingValues = checkData.values;

  if (!existingValues || existingValues.length === 0 || !existingValues[0] || existingValues[0].length === 0) {
    // Write headers
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:N1?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          range: "Sheet1!A1:N1",
          majorDimension: "ROWS",
          values: [SHEET_HEADERS],
        }),
      }
    );
  }

  // Apply bold styling and frozen header row via batchUpdate
  try {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId: 0,
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
                fields: "gridProperties.frozenRowCount",
              },
            },
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: SHEET_HEADERS.length,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.08, green: 0.08, blue: 0.08 },
                    textFormat: {
                      foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                      bold: true,
                      fontSize: 10,
                    },
                    horizontalAlignment: "CENTER",
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
              },
            },
          ],
        }),
      }
    );
  } catch (styleErr) {
    console.warn("Could not apply sheet header styling (non-blocking):", styleErr);
  }
}

// Create a new Google Spreadsheet in the user's Google Drive
export async function createGoogleSpreadsheet(
  accessToken: string,
  title: string = DEFAULT_SHEET_TITLE
): Promise<GoogleSheetsConfig> {
  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: "Sheet1",
            gridProperties: {
              frozenRowCount: 1,
              columnCount: 20,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errJson = await createRes.json();
    throw new Error(errJson.error?.message || "Failed to create Google Spreadsheet.");
  }

  const spreadsheet = await createRes.json();
  const spreadsheetId = spreadsheet.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write and style headers
  await setupSheetHeaders(accessToken, spreadsheetId);

  const config: GoogleSheetsConfig = {
    spreadsheetId,
    spreadsheetTitle: title,
    spreadsheetUrl,
    connectedAt: new Date().toISOString(),
  };

  saveSheetsConfig(config);
  return config;
}

// Connect to an existing spreadsheet by ID or URL
export async function connectExistingSpreadsheet(
  accessToken: string,
  input: string
): Promise<GoogleSheetsConfig> {
  let spreadsheetId = input.trim();
  // Extract ID if URL is provided
  const match = spreadsheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    spreadsheetId = match[1];
  }

  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,spreadsheetId`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!metaRes.ok) {
    const errJson = await metaRes.json();
    throw new Error(
      errJson.error?.message ||
        "Could not access spreadsheet. Please check the Spreadsheet ID or verify permissions."
    );
  }

  const meta = await metaRes.json();
  const title = meta.properties?.title || "Google Spreadsheet";
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Ensure headers exist
  try {
    await setupSheetHeaders(accessToken, spreadsheetId);
  } catch (e) {
    console.warn("Could not check/write headers on existing sheet:", e);
  }

  const config: GoogleSheetsConfig = {
    spreadsheetId,
    spreadsheetTitle: title,
    spreadsheetUrl,
    connectedAt: new Date().toISOString(),
  };

  saveSheetsConfig(config);
  return config;
}

// Append a preorder record directly to the Google Sheet
export async function appendPreorderToGoogleSheet(
  accessToken: string,
  spreadsheetId: string,
  preorder: SheetPreorder
): Promise<{ rowNumber?: number }> {
  const rowValues = [
    preorder.orderId,
    preorder.timestamp,
    preorder.name,
    preorder.email,
    preorder.phone,
    preorder.location,
    preorder.product,
    preorder.quantity,
    preorder.size,
    preorder.color.replace("black/", "BLACK / ").toUpperCase(),
    preorder.totalAmount,
    preorder.depositAmount,
    preorder.balanceDue,
    preorder.status || "CONFIRMED_PREORDER",
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:N:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range: "Sheet1!A:N",
        majorDimension: "ROWS",
        values: [rowValues],
      }),
    }
  );

  if (!res.ok) {
    const errJson = await res.json();
    throw new Error(errJson.error?.message || "Failed to append record to Google Sheet.");
  }

  const data = await res.json();
  // Try to parse updated range
  let rowNumber: number | undefined;
  if (data.updates?.updatedRange) {
    const match = data.updates.updatedRange.match(/!A(\d+)/);
    if (match) {
      rowNumber = parseInt(match[1], 10);
    }
  }

  return { rowNumber };
}

// Fetch all preorder rows from Google Sheet
export async function fetchPreordersFromGoogleSheet(
  accessToken: string,
  spreadsheetId: string
): Promise<SheetPreorder[]> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:N?valueRenderOption=UNFORMATTED_VALUE`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const errJson = await res.json();
    throw new Error(errJson.error?.message || "Failed to read records from Google Sheet.");
  }

  const data = await res.json();
  const rows: any[][] = data.values || [];

  const preorders: SheetPreorder[] = [];
  rows.forEach((row, index) => {
    if (!row || row.length === 0 || !row[0]) return;
    const orderId = String(row[0] || "").trim();
    if (!orderId) return;

    const rawTimestamp = row[1];
    let timestamp = new Date().toISOString();
    if (rawTimestamp) {
      if (typeof rawTimestamp === "number") {
        timestamp = rawTimestamp > 100000000000
          ? new Date(rawTimestamp).toISOString()
          : new Date((rawTimestamp - 25569) * 86400 * 1000).toISOString();
      } else {
        timestamp = String(rawTimestamp);
      }
    }

    const totalAmount = Number(row[10]) || 5000;
    const depositAmount = Number(row[11]) || 3000;
    const balanceDue = Number(row[12]) || totalAmount - depositAmount;

    preorders.push({
      orderId,
      timestamp,
      name: String(row[2] || ""),
      email: String(row[3] || ""),
      phone: String(row[4] || ""),
      location: String(row[5] || ""),
      product: String(row[6] || "Vegeta Stencil Tee v3"),
      quantity: Number(row[7]) || 1,
      size: String(row[8] || "XL"),
      color: String(row[9] || "BLACK / WHITE").toLowerCase(),
      totalAmount,
      depositAmount,
      balanceDue,
      status: String(row[13] || "CONFIRMED_PREORDER"),
      rowIndex: index + 2, // 1-indexed row number in sheet
    });
  });

  // Return sorted by most recent
  return preorders.reverse();
}

// Delete a row from the Google Sheet (or clear values)
export async function deletePreorderFromGoogleSheet(
  accessToken: string,
  spreadsheetId: string,
  orderId: string
): Promise<boolean> {
  // First fetch the sheet to find the row index
  const list = await fetchPreordersFromGoogleSheet(accessToken, spreadsheetId);
  const found = list.find((item) => item.orderId === orderId);

  if (!found || !found.rowIndex) {
    return false;
  }

  // Clear that row
  const rowIdx = found.rowIndex;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A${rowIdx}:N${rowIdx}:clear`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.ok;
}
