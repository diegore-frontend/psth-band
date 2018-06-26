using System.Linq;
using System.Web.Mvc;
using PSTH.Web.Models.Context;

namespace PSTH.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            using (var context = new PSTHContext())
            {
                var total = context.Payments.Sum(x => x.Price);

                return View(new IndexViewModel()
                {
                    Total = total
                });
            }
        }
    }

    public class IndexViewModel
    {
        public float Total { get; set; }
    }
}