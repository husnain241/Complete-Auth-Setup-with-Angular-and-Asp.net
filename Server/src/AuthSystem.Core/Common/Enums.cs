namespace AuthSystem.Core.Common;

/// <summary>
/// Result types for authentication operations.
/// </summary>
public enum AuthResultType
{
    Success,
    InvalidCredentials,
    UserNotFound,
    UserLockedOut,
    EmailNotConfirmed,
    InvalidToken,
    TokenExpired,
    UnknownError
}
