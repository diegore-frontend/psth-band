using System;
using System.Configuration;

namespace PSTH.Web.Helpers
{
    public static class AppSettings
    {
        public static string Host => GetValue<string>("Email.Host");
        public static int Port => GetValue<int>("Email.Port");
        public static string UserName => GetValue<string>("Email.User.Name");
        public static string Password => GetValue<string>("Email.User.Password");
        public static string From => GetValue<string>("Email.From");
        public static string Display => GetValue<string>("Email.DisplayName");


        public static string PayPalUserName => GetValue<string>(string.Concat(PayPalType, ".PayPal.UserName"));
        public static string PayPalPassword => GetValue<string>(string.Concat(PayPalType, ".PayPal.Password"));
        public static string PayPalSignature => GetValue<string>(string.Concat(PayPalType, ".PayPal.Signature"));
        public static string PayPalUrl => GetValue<string>(string.Concat(PayPalType, ".PayPal.Url"));
        public static string PayPalCallbackOk => GetValue<string>("PayPal.Callback.Ok");
        public static string PayPalCallbackFail => GetValue<string>("PayPal.Callback.Fail");
        public static string PayPalType => GetValue<string>("PayPal.Type");
        public static string RoutePresent => GetValue<string>("Route.Present");
        public static string RouteMailConfirmationPayment => GetValue<string>("Route.Mail.Confirmation.Payment");
        public static string RouteMailConfirmation => GetValue<string>("Route.Mail.Confirmation");

        public static bool IsPaymentTest => GetValue<bool>("Is.Payment.Test");
        public static float PaymentAmount => GetValue<float>("Payment.Amount");

        public static float Meta => GetValue<float>("Meta");

        private static TValue GetValue<TValue>(string appSettingsKey)
        {
            try
            {
                string value = ConfigurationManager.AppSettings[appSettingsKey];
                if (!string.IsNullOrEmpty(value))
                {
                    return (TValue)Convert.ChangeType(value, typeof(TValue));
                }
            }
            catch
            {
                /**/
            }
            return default(TValue);
        }
    }
}