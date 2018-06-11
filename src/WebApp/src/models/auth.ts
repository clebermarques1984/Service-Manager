/**
 * Represents the JWT sent by the server
 */
export default interface IAuth {
  /**
   * User ID
   */
  id: string;
  /**
   * JWT Token
   */
  auth_token: string;
  /**
   * Timespan the token will be valid for in milliseconds
   */
  expires_in: number;
}
