export const customerCancellationReasons = [
  "ordered_by_mistake",
  "changed_my_mind",
  "taking_too_long",
  "wrong_item",
  "checkout_or_payment_issue",
  "another_reason",
  "prefer_not_to_say",
] as const;

export type CustomerCancellationReason = (typeof customerCancellationReasons)[number];

export const customerCancellationReasonLabels: Record<CustomerCancellationReason, string> = {
  ordered_by_mistake: "I ordered by mistake",
  changed_my_mind: "I changed my mind",
  taking_too_long: "It is taking too long",
  wrong_item: "I selected the wrong item",
  checkout_or_payment_issue: "There was a checkout or payment issue",
  another_reason: "Another reason",
  prefer_not_to_say: "I prefer not to say",
};
