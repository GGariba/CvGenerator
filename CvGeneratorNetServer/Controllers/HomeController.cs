using System.IO;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using CvGeneratorNetServer.Models;

namespace CvGeneratorServer.Controllers
{
    public class HomeController : Controller
    {
        private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        public IActionResult Index()
        {
            // 1. Read the JSON file from the server
            var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "cv-data.json");
            
            CvData cvData = new CvData();
            if (System.IO.File.Exists(jsonPath))
            {
                var jsonText = System.IO.File.ReadAllText(jsonPath);
                cvData = JsonSerializer.Deserialize<CvData>(jsonText, JsonOptions) ?? new CvData();
            }

            // 2. Pass the strongly-typed data to the HTML template
            return View(cvData);
        }
    }
}