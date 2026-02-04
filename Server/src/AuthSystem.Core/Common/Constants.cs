namespace AuthSystem.Core.Common;

/// <summary>
/// Application-wide role constants for authorization.
/// </summary>
public static class AppRoles
{
    public const string Admin = "Admin";
    public const string User = "User";
    
    public static readonly IReadOnlyList<string> AllRoles = [Admin, User];
}

/// <summary>
/// JWT and authentication related constants.
/// </summary>
public static class AuthConstants
{
    public const string RefreshTokenCookieName = "refreshToken";
    public const int AccessTokenExpiryMinutes = 15;
    public const int RefreshTokenExpiryDays = 7;
}
