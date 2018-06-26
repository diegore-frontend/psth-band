using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace PSTH.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute("Home", "", new { controller = "Home", action = "Index" });

            routes.MapRoute("PaymentOK", "callback-ok", new { controller = "Payment", action = "CallbackOk" });
            routes.MapRoute("PaymentKO", "callback-fail", new { controller = "Payment", action = "CallbackFail" });

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
