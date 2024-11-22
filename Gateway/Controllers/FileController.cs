using Gateway.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Controllers
{
    [Route("/")]
    [ApiController]
    public class FileController : ControllerBase
    {
        [HttpGet]
        public  async Task<IActionResult> GetImageFromServer([FromQuery] string name)
        {
            var file = FileHelper.getFile(name);
            if (file == null)
            {
                return NotFound(new
                {
                    Content = "Invalid file name",
                    Message = "File name not found or not exist"
                });
            }
            return File(file, "image/jpeg");
        }


        [HttpPost]
        public async Task<IActionResult> PostImageToServer(IFormFile file) 
        {
            var newFile = FileHelper.saveFile(file);
            if (string.IsNullOrEmpty(newFile))
            {
                return BadRequest(new {
                    Content = "Invalid format file",
                    Message = "File is not JPEG or image format"
                });
            }
            return Ok(new
            {
                Data = newFile,
                Message = "Upload file successfully"
            });
        }
    }
}
