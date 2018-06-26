using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using PSTH.Web.Core;
using PSTH.Web.Helpers;
using PSTH.Web.Models;
using PSTH.Web.Models.Context;
using PSTH.Web.Models.Entities;
using Resources;

namespace PSTH.Web.Controllers
{
    public class PaymentController : Controller
    {
        private readonly PaymentCore _paymentCore;
        public PaymentController()
        {
            Dictionary<string, string> payPalConfiguration = new Dictionary<string, string>
            {
                {"account1.apiUsername", AppSettings.PayPalUserName},
                {"account1.apiPassword", AppSettings.PayPalPassword},
                {"account1.apiSignature", AppSettings.PayPalSignature},
                {"mode", AppSettings.PayPalType.ToLower()}
            };

            _paymentCore = new PaymentCore(payPalConfiguration);
        }

        [HttpPost]
        public ActionResult Payment(ItemPayPal model)
        {
            if (model != null && model.Price > 0)
            {
                if (AppSettings.IsPaymentTest)
                {
                    model.Price = AppSettings.PaymentAmount;
                }

                model.Description = model.Name ?? "Donación";
                model.Quantity = 1;

                List<ItemPayPal> items = new List<ItemPayPal> { model };
                var token = _paymentCore.GenerateOrder(items);
                HttpCookie payPalTokenCookie = new HttpCookie("_c3P-Pt5", token)
                {
                    Expires = DateTime.Now.AddMinutes(10)
                };
                Response.Cookies.Add(payPalTokenCookie);
                return Redirect(string.Concat(AppSettings.PayPalUrl, token));
            }

            TempData["type"] = "warning";
            TempData["message"] = Messages.PaymentWrong;
            return RedirectToHome();
        }

        private ActionResult RedirectToHome()
        {
            return RedirectToAction("Index", "Home");
        }

        [Route("callback-ok")]
        public ActionResult CallbackOk()
        {
            try
            {
                var token = Request.QueryString["token"];
                var payerId = Request.QueryString["PayerID"];

                if (!string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(payerId))
                {
                    if (!string.IsNullOrEmpty(Request.Cookies["_c3P-Pt5"]?.Value))
                    {
                        var paymentResponse = _paymentCore.Payment(token, payerId);
                        if (paymentResponse != null)
                        {
                            var paymentInfoType = _paymentCore.GetTransactionStatus(paymentResponse.TransactionId, out string error);
                            if (paymentInfoType.PaymentStatus.ToString() == "COMPLETED")
                            {
                                try
                                {
                                    using (var context = new PSTHContext())
                                    {
                                        var price = float.Parse(paymentInfoType.GrossAmount.value);
                                        context.Payments.Add(new Payment
                                        {
                                            Price = price / 100
                                        });
                                        context.SaveChanges();
                                    }
                                }
                                catch (Exception e)
                                {
                                    /**/
                                }

                                TempData["type"] = "success";
                                TempData["message"] = Messages.PaymentSuccess;
                                return RedirectToHome();
                            }
                        }
                    }
                }
            }
            catch
            {
                /**/
            }
            TempData["type"] = "warning";
            TempData["message"] = Messages.PaymentWrong;
            return RedirectToHome();
        }

        [Route("callback-fail")]
        public ActionResult CallbackFail()
        {
            TempData["type"] = "warning";
            TempData["message"] = Messages.PaymentWrong;
            return RedirectToHome();
        }
    }
}