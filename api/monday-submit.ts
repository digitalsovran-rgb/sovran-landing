import type { VercelRequest, VercelResponse } from '@vercel/node';

const MONDAY_API_URL = 'https://api.monday.com/v2';
const BOARD_ID = 5098314640;

const COLUMN_IDS = {
  firstName: 'text_mm5q24an',
  email: 'email_mm51mezw',
  phone: 'phone_mm51yhe7',
  extensionType: 'dropdown_mm47dr86',
  budget: 'numeric_mm47arbw',
  leadSource: 'dropdown_mm47gc2c',
  notes: 'text_mm47r0fc',
};

const LEAD_SOURCE_VALUE = 'Extend Landing Page';

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 500;

type MondayResult = { ok: true; id: string } | { ok: false; error: string };

function extractFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  return parts[0];
}

// Converts a budget-range option (e.g. "Under £150K", "£150K – £500K", "£1M+") into a single
// representative number: strips £/commas, takes the first numeric run, and multiplies by 1000
// only when that run is immediately followed by "K" — per the exact algorithm specified for
// this integration. Note this does not special-case an "M" suffix (only "£1M+" in the current
// form options would hit that path), so that option currently resolves to the bare number 1
// rather than 1000000 — flagged as a known gap rather than silently extended beyond spec.
function extractBudgetNumber(budgetText: string): number {
  const stripped = budgetText.replace(/[£,]/g, '');
  const match = stripped.match(/\d+/);
  if (!match || match.index === undefined) return 0;
  const numEnd = match.index + match[0].length;
  const followedByK = stripped[numEnd]?.toUpperCase() === 'K';
  const num = parseInt(match[0], 10);
  return followedByK ? num * 1000 : num;
}

function buildNotes(services: string[], timeline: string, postcode: string): string {
  return `Services: ${services.join(', ')} | Timeline: ${timeline} | Postcode: ${postcode}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createMondayItem(
  apiToken: string,
  itemName: string,
  columnValues: Record<string, unknown>
): Promise<MondayResult> {
  const query = `
    mutation CreateItem($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
      create_item(
        board_id: $boardId,
        item_name: $itemName,
        column_values: $columnValues,
        create_labels_if_missing: true
      ) {
        id
      }
    }
  `;

  const variables = {
    boardId: BOARD_ID,
    itemName,
    columnValues: JSON.stringify(columnValues),
  };

  let lastError = 'Unknown error';

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    console.log(
      `[monday-submit] attempt ${attempt}/${RETRY_ATTEMPTS} — request:`,
      JSON.stringify({ boardId: BOARD_ID, itemName, columnValues })
    );

    try {
      const response = await fetch(MONDAY_API_URL, {
        method: 'POST',
        headers: {
          // Monday's v2 API expects the raw token in this header — no "Bearer " prefix.
          Authorization: apiToken,
          'Content-Type': 'application/json',
          'API-Version': '2024-01',
        },
        body: JSON.stringify({ query, variables }),
      });

      const data: any = await response.json().catch(() => null);
      console.log(
        `[monday-submit] attempt ${attempt}/${RETRY_ATTEMPTS} — response status ${response.status}:`,
        JSON.stringify(data)
      );

      if (response.ok && data?.data?.create_item?.id) {
        return { ok: true, id: String(data.data.create_item.id) };
      }

      lastError =
        data?.errors?.[0]?.message ?? `Monday API returned status ${response.status}`;
      console.error(`[monday-submit] attempt ${attempt}/${RETRY_ATTEMPTS} failed:`, lastError);
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Unknown fetch error';
      console.error(`[monday-submit] attempt ${attempt}/${RETRY_ATTEMPTS} threw:`, lastError);
    }

    if (attempt < RETRY_ATTEMPTS) {
      await sleep(RETRY_DELAY_MS);
    }
  }

  return { ok: false, error: lastError };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const apiToken = process.env.MONDAY_API_TOKEN;
  if (!apiToken) {
    console.error('[monday-submit] MONDAY_API_TOKEN is not configured');
    res.status(500).json({ ok: false, error: 'Monday API token is not configured' });
    return;
  }

  const { name, email, phone, extensionType, budget, services, timeline, postcode } =
    req.body ?? {};

  const fullName = typeof name === 'string' ? name : '';
  const firstName = extractFirstName(fullName);
  const budgetNumber = extractBudgetNumber(typeof budget === 'string' ? budget : '');
  const notes = buildNotes(
    Array.isArray(services) ? services : [],
    typeof timeline === 'string' ? timeline : '',
    typeof postcode === 'string' ? postcode : ''
  );
  const phoneDigits = typeof phone === 'string' ? phone.replace(/[^\d]/g, '') : '';

  const columnValues: Record<string, unknown> = {
    [COLUMN_IDS.firstName]: firstName,
    [COLUMN_IDS.email]: { email: email ?? '', text: email ?? '' },
    [COLUMN_IDS.phone]: { phone: phoneDigits, countryShortName: 'GB' },
    [COLUMN_IDS.extensionType]: { labels: [extensionType ?? ''] },
    [COLUMN_IDS.budget]: budgetNumber,
    [COLUMN_IDS.leadSource]: { labels: [LEAD_SOURCE_VALUE] },
    [COLUMN_IDS.notes]: notes,
  };

  const result = await createMondayItem(apiToken, fullName, columnValues);

  if (result.ok) {
    res.status(200).json(result);
  } else {
    res.status(502).json(result);
  }
}
