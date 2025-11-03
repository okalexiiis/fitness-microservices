export type ContentfulStatusCode =
  // 1xx Informativos
  | 100 // Continue
  | 101 // Switching Protocols
  | 102 // Processing (WebDAV)

  // 2xx Satisfactorio
  | 200 // OK
  | 201 // Created
  | 202 // Accepted
  | 203 // Non-Authoritative Information
  | 204 // No Content
  | 205 // Reset Content
  | 206 // Partial Content
  | 207 // Multi-Status (WebDAV)

  // 3xx Redirección
  | 300 // Multiple Choices
  | 301 // Moved Permanently
  | 302 // Found
  | 304 // Not Modified
  | 307 // Temporary Redirect
  | 308 // Permanent Redirect

  // 4xx Error del Cliente
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 405 // Method Not Allowed
  | 408 // Request Timeout
  | 429 // Too Many Requests (Contentful usa mucho este para el límite de tasas)

  // 5xx Error del Servidor
  | 500 // Internal Server Error
  | 501 // Not Implemented
  | 502 // Bad Gateway
  | 503 // Service Unavailable
  | 504 // Gateway Timeout;
