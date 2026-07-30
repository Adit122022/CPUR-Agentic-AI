using HotelManagementWeb.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace HotelManagementWeb.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        // Constructor: Ye hamesha class ke naam jaisa hota hai
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        // 1. Home Page - Yahan Booking ka form dikhega
        public IActionResult Index()
        {
            return View();
        }

        // 2. Calculation Page - Form submit hone par ye chalega
        [HttpPost]
        public IActionResult Calculate(Booking model)
        {
            // Agar model khali nahi hai, toh Result page 
            return View("Result", model);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}