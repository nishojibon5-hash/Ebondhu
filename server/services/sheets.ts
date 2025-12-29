import { google, sheets_v4 } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

let sheetsInstance: sheets_v4.Sheets | null = null;

function getAuth() {
  const credentials = {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url:
      "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  };

  // Validate credentials
  if (!credentials.client_email) {
    console.error("Missing GOOGLE_CLIENT_EMAIL environment variable");
    throw new Error(
      "Google credentials incomplete: missing client_email. Please set GOOGLE_CLIENT_EMAIL in environment variables.",
    );
  }

  if (!credentials.private_key) {
    console.error("Missing GOOGLE_PRIVATE_KEY environment variable");
    throw new Error(
      "Google credentials incomplete: missing private_key. Please set GOOGLE_PRIVATE_KEY in environment variables.",
    );
  }

  if (!credentials.project_id) {
    console.error("Missing GOOGLE_PROJECT_ID environment variable");
    throw new Error(
      "Google credentials incomplete: missing project_id. Please set GOOGLE_PROJECT_ID in environment variables.",
    );
  }

  try {
    return google.auth.fromJSON(credentials);
  } catch (error) {
    console.error("Error creating Google auth:", error);
    throw error;
  }
}

export function getSheetsAPI() {
  if (!sheetsInstance) {
    const auth = getAuth();
    sheetsInstance = google.sheets({ version: "v4", auth });
  }
  return sheetsInstance;
}

const SPREADSHEET_ID = process.env.VITE_GOOGLE_SHEETS_ID || "";

// Sheet names for different data types
export const SHEET_NAMES = {
  USERS: "Users",
  TRANSACTIONS: "Transactions",
  FEATURE_FLAGS: "FeatureFlags",
  BANNERS: "Banners",
  REQUESTS: "Requests",
  MEMBERS: "Members",
  WORKERS: "Workers",
  SOMITI: "Somiti",
  SOMITI_DETAILS: "SomitiDetails",
  TASKS: "Tasks",
  NOTIFICATIONS: "Notifications",
  PAYOUT_WALLETS: "PayoutWallets",
};

export async function initializeSheets() {
  const sheets = getSheetsAPI();

  // Get existing sheets
  const result = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const existingSheets = result.data.sheets?.map((s) => s.properties?.title) || [];

  // Create missing sheets
  const requests: any[] = [];
  Object.values(SHEET_NAMES).forEach((sheetName) => {
    if (!existingSheets.includes(sheetName)) {
      requests.push({
        addSheet: {
          properties: {
            title: sheetName,
          },
        },
      });
    }
  });

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests,
      },
    });
  }

  // Initialize headers for each sheet
  await initializeSheetHeaders();
}

async function initializeSheetHeaders() {
  const sheets = getSheetsAPI();

  const headers: Record<string, string[]> = {
    [SHEET_NAMES.USERS]: [
      "id",
      "phone",
      "name",
      "pin",
      "balance",
      "createdAt",
      "updatedAt",
    ],
    [SHEET_NAMES.TRANSACTIONS]: [
      "id",
      "phone",
      "type",
      "amount",
      "description",
      "timestamp",
      "status",
    ],
    [SHEET_NAMES.FEATURE_FLAGS]: ["key", "value", "updatedAt"],
    [SHEET_NAMES.BANNERS]: ["id", "image", "link", "createdAt"],
    [SHEET_NAMES.REQUESTS]: [
      "id",
      "phone",
      "type",
      "amount",
      "status",
      "createdAt",
    ],
    [SHEET_NAMES.MEMBERS]: [
      "id",
      "somitiId",
      "phone",
      "name",
      "photo",
      "createdAt",
    ],
    [SHEET_NAMES.WORKERS]: [
      "id",
      "somitiId",
      "phone",
      "name",
      "photo",
      "createdAt",
    ],
    [SHEET_NAMES.SOMITI]: ["id", "phone", "name", "createdAt", "updatedAt"],
    [SHEET_NAMES.SOMITI_DETAILS]: [
      "id",
      "somitiId",
      "totalMembers",
      "monthlyAmount",
      "description",
    ],
    [SHEET_NAMES.TASKS]: [
      "id",
      "somitiId",
      "title",
      "description",
      "earnAmount",
      "createdAt",
    ],
    [SHEET_NAMES.NOTIFICATIONS]: [
      "id",
      "phone",
      "title",
      "message",
      "read",
      "createdAt",
    ],
    [SHEET_NAMES.PAYOUT_WALLETS]: [
      "key",
      "enabled",
      "reserve",
      "updatedAt",
    ],
  };

  for (const [sheetName, headerRow] of Object.entries(headers)) {
    try {
      const range = `${sheetName}!A1:Z1`;
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
      });

      if (!result.data.values || result.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range,
          valueInputOption: "RAW",
          requestBody: {
            values: [headerRow],
          },
        });
      }
    } catch (error) {
      console.error(`Error initializing headers for ${sheetName}:`, error);
    }
  }
}

export async function appendRow(sheetName: string, values: any[]) {
  const sheets = getSheetsAPI();

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: "RAW",
    requestBody: {
      values: [values],
    },
  });

  return response.data;
}

export async function getRows(sheetName: string) {
  const sheets = getSheetsAPI();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
  });

  const rows = response.data.values || [];
  if (rows.length === 0) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });
    return obj;
  });
}

export async function updateRow(
  sheetName: string,
  rowIndex: number,
  values: any[],
) {
  const sheets = getSheetsAPI();

  // rowIndex is 0-based for data, but sheets are 1-based with headers
  const actualRow = rowIndex + 2;
  const range = `${sheetName}!A${actualRow}:Z${actualRow}`;

  const response = await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [values],
    },
  });

  return response.data;
}

export async function deleteRow(sheetName: string, rowIndex: number) {
  const sheets = getSheetsAPI();

  // Get current data
  const rows = await getRows(sheetName);
  if (rowIndex < 0 || rowIndex >= rows.length) {
    throw new Error("Row index out of bounds");
  }

  // Remove the row and rewrite the sheet
  const newRows = rows.filter((_, i) => i !== rowIndex);

  // Clear the sheet and rewrite
  const headers = Object.keys(rows[0]);
  const range = `${sheetName}!A:Z`;

  const values = [headers, ...newRows.map((row) => headers.map((h) => row[h]))];

  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });

  if (newRows.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });
  }
}

export async function findRow(
  sheetName: string,
  searchField: string,
  searchValue: string,
) {
  const rows = await getRows(sheetName);
  return rows.find((row) => row[searchField] === searchValue);
}

export async function findRows(
  sheetName: string,
  searchField: string,
  searchValue: string,
) {
  const rows = await getRows(sheetName);
  return rows.filter((row) => row[searchField] === searchValue);
}
