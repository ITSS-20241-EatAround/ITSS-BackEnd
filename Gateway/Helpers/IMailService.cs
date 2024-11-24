namespace Gateway.Helpers
{
    public interface IMailService
    {
        public Task SendMail(MailRequest mailRequest);
    }

    public class MailRequest
    {
        public string? toEmail { get; set; }
        public string? subject { get; set; }
        public string? body { get; set; }
    }
}
