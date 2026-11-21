export type WaiterRequestType = 'call' | 'bill' | 'water' | 'clean';

export type WaiterRequest = {
  type: WaiterRequestType;
  table: string | null;
  note?: string;
};

/**
 * Sends a waiter request to the restaurant.
 *
 * TODO: the bomain backend has no waiter-request endpoint yet. Until one exists,
 * this only simulates a short network delay — nothing reaches the staff.
 */
export async function sendWaiterRequest(_request: WaiterRequest): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 700));
}
