namespace Gateway.Helpers
{
    public static class FileHelper
    {
        public static string saveFile(IFormFile file)
        {
            try
            {
                var fileName = file.FileName;
                var extensionName = Path.GetExtension(fileName);
                while (true)
                {
                    string newFilename = Guid.NewGuid().ToString() + extensionName;
                    fileName = Path.Combine(Directory.GetCurrentDirectory(), "Resources", newFilename);
                    if (File.Exists(fileName))
                    {
                        continue;
                    }
                    using (var stream = new FileStream(fileName, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return newFilename;
                }
            }
            catch (Exception e)
            {
                return string.Empty;
            }
        }

        public static FileStream getFile(string fileName)
        {
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Resources", fileName);
            if (!File.Exists(imagePath)) return null;
            return File.OpenRead(imagePath);
        }

        public static bool removeFile(string fileName)
        {
            try
            {
                var file = Path.Combine(Directory.GetCurrentDirectory(), "Resources", fileName);
                if (!File.Exists(file)) return false;
                File.Delete(file);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
