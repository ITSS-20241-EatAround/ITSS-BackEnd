using Gateway.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Controllers
{
    [Route("api/v1/mail")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly IMailService _mailService;

        public MailController(IMailService mailService)
        {
            _mailService = mailService;   
        }

        [HttpPost]
        public async Task<IActionResult> SendMail([FromBody] MailRequest request)
        {
            try
            {
                await _mailService.SendMail(request).ConfigureAwait(false);
                return Ok(new
                {
                    Status = true,
                    Message = "Sent mail successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Status = false,
                    Error = ex.StackTrace,
                    ex.Message
                });
            }
        }
    }
}
