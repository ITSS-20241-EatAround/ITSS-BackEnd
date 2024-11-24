
using MimeKit;
using MailKit.Net.Smtp;

namespace Gateway.Helpers
{
    public class MailHelpers : IMailService
    {
        private readonly IConfiguration _configuration;
        public MailHelpers(IConfiguration configuration)
        {

            _configuration = configuration;

        }
        public async Task SendMail(MailRequest mailRequest)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_configuration["Emailsettings:DisplayName"], _configuration["Emailsettings:Email"]));
            email.To.Add(MailboxAddress.Parse(mailRequest.toEmail));
            email.Subject = mailRequest.subject;
            var builder = new BodyBuilder();
            builder.HtmlBody = mailRequest.body;
            email.Body = builder.ToMessageBody();
            using var smtp = new SmtpClient();
            try
            {
                smtp.Connect(_configuration["Emailsettings:Host"], Int32.Parse(_configuration["Emailsettings:Port"]), MailKit.Security.SecureSocketOptions.StartTls);
                smtp.Authenticate(_configuration["Emailsettings:Email"], _configuration["Emailsettings:Password"]);
                await smtp.SendAsync(email);
            }
            catch (Exception ex) { throw; }
            finally
            {
                await smtp.DisconnectAsync(true);
                smtp.Dispose();
            }
        }
    }
}
