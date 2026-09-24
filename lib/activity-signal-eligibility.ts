export type ActivitySignalEligibility = {
  established: boolean;
  eligible: boolean;
  reason: "not_established";
};

/**
 * Eligibility is intentionally unresolved until an approved server-side
 * mechanism exists. Unknown eligibility must never permit collection.
 */
export async function getActivitySignalEligibility(_userId: string): Promise<ActivitySignalEligibility> {
  void _userId;
  return {
    established: false,
    eligible: false,
    reason: "not_established",
  };
}

export async function isUserEligibleForActivitySignals(userId: string): Promise<boolean> {
  const decision = await getActivitySignalEligibility(userId);
  return decision.established && decision.eligible;
}
