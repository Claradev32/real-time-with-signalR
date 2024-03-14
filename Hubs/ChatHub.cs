using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging; // Required for logging

namespace SignalRApp.Hubs
{
    public class UserMessage
    {
        public required string Sender { get; set; }
        public required string Content { get; set; }
        public DateTime SentTime { get; set; }
    }

    public class MessagingHub : Hub
    {
        private static readonly List<UserMessage> MessageHistory = new List<UserMessage>();
        private readonly ILogger<MessagingHub> _logger; // Logger instance

        // Constructor to inject the logger
        public MessagingHub(ILogger<MessagingHub> logger)
        {
            _logger = logger;
             _logger.LogInformation($"Message from");
        }

        public async Task PostMessage(string content)
        {
            var senderId = Context.ConnectionId;
            var userMessage = new UserMessage
            {
                Sender = senderId,
                Content = content,
                SentTime = DateTime.UtcNow
            };

            MessageHistory.Add(userMessage);
            _logger.LogInformation($"Message from {senderId}: {content}"); // Log message sending
            await Clients.Others.SendAsync("ReceiveMessage", senderId, content, userMessage.SentTime);
        }

        public async Task RetrieveMessageHistory()
        {
            _logger.LogInformation("Retrieving message history"); // Log message history retrieval
            await Clients.Caller.SendAsync("MessageHistory", MessageHistory);
        }
    }
}
