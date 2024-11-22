import { createRouter } from "@hattip/router";
import { z } from "zod";
import { isAfter } from "date-fns";
import { BalanceService } from "#services";
import {
  createErrorResponse,
  createSuccessResponse,
} from "#lib/responseFormatter";

const balanceService = new BalanceService();
const router = createRouter();

// Get user balance
router.get("/api/balance", async (context) => {
  try {
    const userId = context.user.id;

    const balance = await balanceService.getBalance(userId);

    return createSuccessResponse({ balance });
  } catch (error) {
    return createErrorResponse(error);
  }
});

// Get balance history
router.get("/api/balance/history", async (context) => {
  try {
    const params = context.url.searchParams;

    const { startDate, endDate } = z
      .object({
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
      })
      .parse(params);

    // Validate date range
    if (startDate && endDate && !isAfter(endDate, startDate)) {
      throw new Error("End date must be after start date");
    }

    const history = await balanceService.getBalanceHistory({
      userId: context.user.id,
      startDate,
      endDate,
    });

    return createSuccessResponse(history);
  } catch (error) {
    return createErrorResponse(error);
  }
});

export default router;