using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace AuthSystem.API.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        // UserID aur ConnectionID ko track karne ke liye
        private static readonly ConcurrentDictionary<string, string> OnlineUsers = new();


        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier; // JWT Token se User ID uthata hai
            if (!string.IsNullOrEmpty(userId))
            {
                OnlineUsers.TryAdd(userId, Context.ConnectionId);
                // Sab ko batayein ke ye user online aa gaya hai
                await Clients.All.SendAsync("UserStatusChanged", userId, true);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                OnlineUsers.TryRemove(userId, out _);
                // Sab ko batayein ke ye user offline ho gaya hai
                await Clients.All.SendAsync("UserStatusChanged", userId, false);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}