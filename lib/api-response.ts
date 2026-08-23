export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export function successResponse<T>(
  data: T,
  init?: ResponseInit,
): Response {
  return Response.json({ success: true, data } satisfies ApiSuccess<T>, init);
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
): Response {
  return Response.json(
    { success: false, error: { code, message } } satisfies ApiFailure,
    { status },
  );
}
