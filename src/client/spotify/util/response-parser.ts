export const getJsonResponse = <T>(response: Response): Promise<T> => response.json();

export const getTextResponse = (response: Response): Promise<string> => response.text();
