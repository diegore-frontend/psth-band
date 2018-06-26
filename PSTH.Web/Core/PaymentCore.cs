using System;
using System.Collections.Generic;
using System.Linq;
using PayPal.PayPalAPIInterfaceService;
using PayPal.PayPalAPIInterfaceService.Model;
using PSTH.Web.Helpers;
using PSTH.Web.Models;

namespace PSTH.Web.Core
{
    public class PaymentCore
    {
        Dictionary<string, string> _payPalConfiguration;

        public PaymentCore(Dictionary<string, string> payPalConfiguration)
        {
            this._payPalConfiguration = payPalConfiguration;
        }

        public PaymentInfoType GetTransactionStatus(string transactionId, out string error)
        {
            // Create request object
            GetTransactionDetailsRequestType request = new GetTransactionDetailsRequestType();
            // (Required) Unique identifier of a transaction.
            // Note: The details for some kinds of transactions cannot be retrieved with GetTransactionDetails. You cannot obtain details of bank transfer withdrawals, for example.
            request.TransactionID = transactionId;

            // Invoke the API
            GetTransactionDetailsReq wrapper = new GetTransactionDetailsReq();
            wrapper.GetTransactionDetailsRequest = request;

            // Configuration map containing signature credentials and other required configuration.
            // For a full list of configuration parameters refer in wiki page 
            // [https://github.com/paypal/sdk-core-dotnet/wiki/SDK-Configuration-Parameters]

            // Create the PayPalAPIInterfaceServiceService service object to make the API call
            PayPalAPIInterfaceServiceService service = new PayPalAPIInterfaceServiceService(_payPalConfiguration);

            int numReintento = 0;
            bool esLlamadaCorrecta = false;
            GetTransactionDetailsResponseType transactionDetails = null;

            do
            {
                numReintento += 1;

                // # API call 
                // Invoke the GetTransactionDetails method in service wrapper object  
                transactionDetails = service.GetTransactionDetails(wrapper);

                // Check for API return status

                if (!transactionDetails.Ack.Equals(AckCodeType.FAILURE) ||
                !(transactionDetails.Errors != null && transactionDetails.Errors.Count > 0))
                {
                    esLlamadaCorrecta = true;
                }


            } while (!esLlamadaCorrecta && (numReintento <= 5));


            if (esLlamadaCorrecta)
            {
                error = string.Empty;
                return transactionDetails.PaymentTransactionDetails.PaymentInfo;
            }
            //Error
            error = transactionDetails.Errors != null || transactionDetails.Errors.Count > 0
                ? transactionDetails.Errors.FirstOrDefault().LongMessage
                : "Imposible obtener el status de la transacción de PayPal.";

            return null;
        }

        public PaymentResponse Payment(string token, string payerId)
        {

            // Configuration map containing signature credentials and other required configuration.
            // For a full list of configuration parameters refer in wiki page 
            // [https://github.com/paypal/sdk-core-dotnet/wiki/SDK-Configuration-Parameters]

            // Create the PayPalAPIInterfaceServiceService service object to make the API call
            PayPalAPIInterfaceServiceService service = new PayPalAPIInterfaceServiceService(_payPalConfiguration);

            GetExpressCheckoutDetailsReq getECWrapper = new GetExpressCheckoutDetailsReq();
            // (Required) A timestamped token, the value of which was returned by SetExpressCheckout response.
            // Character length and limitations: 20 single-byte characters
            getECWrapper.GetExpressCheckoutDetailsRequest = new GetExpressCheckoutDetailsRequestType(token);
            // # API call 
            // Invoke the GetExpressCheckoutDetails method in service wrapper object
            GetExpressCheckoutDetailsResponseType getECResponse = service.GetExpressCheckoutDetails(getECWrapper);

            // Create request object
            DoExpressCheckoutPaymentRequestType request = new DoExpressCheckoutPaymentRequestType();
            DoExpressCheckoutPaymentRequestDetailsType requestDetails = new DoExpressCheckoutPaymentRequestDetailsType();
            request.DoExpressCheckoutPaymentRequestDetails = requestDetails;

            requestDetails.ButtonSource = "PTSH";

            requestDetails.PaymentDetails = getECResponse.GetExpressCheckoutDetailsResponseDetails.PaymentDetails;
            // (Required) The timestamped token value that was returned in the SetExpressCheckout response and passed in the GetExpressCheckoutDetails request.
            requestDetails.Token = token;
            // (Required) Unique PayPal buyer account identification number as returned in the GetExpressCheckoutDetails response
            requestDetails.PayerID = payerId;
            // (Required) How you want to obtain payment. It is one of the following values:
            // * Authorization – This payment is a basic authorization subject to settlement with PayPal Authorization and Capture.
            // * Order – This payment is an order authorization subject to settlement with PayPal Authorization and Capture.
            // * Sale – This is a final sale for which you are requesting payment.
            // Note: You cannot set this value to Sale in the SetExpressCheckout request and then change this value to Authorization in the DoExpressCheckoutPayment request.
            requestDetails.PaymentAction = PaymentActionCodeType.SALE;

            // Invoke the API
            DoExpressCheckoutPaymentReq wrapper = new DoExpressCheckoutPaymentReq();
            wrapper.DoExpressCheckoutPaymentRequest = request;
            // # API call 
            // Invoke the DoExpressCheckoutPayment method in service wrapper object
            DoExpressCheckoutPaymentResponseType doECResponse = service.DoExpressCheckoutPayment(wrapper);

            // Check for API return status

            if (doECResponse.Ack.Equals(AckCodeType.FAILURE) ||
                (doECResponse.Errors != null && doECResponse.Errors.Any()))
            {
                return null;
            }
            string transactionId = doECResponse.DoExpressCheckoutPaymentResponseDetails.PaymentInfo[0].TransactionID;

            if (doECResponse.DoExpressCheckoutPaymentResponseDetails.PaymentInfo[0].PendingReason != null && doECResponse.DoExpressCheckoutPaymentResponseDetails.PaymentInfo[0].PendingReason != PendingStatusCodeType.NONE)
            {
                CancelTransaction(transactionId);

                throw new Exception(
                    doECResponse.DoExpressCheckoutPaymentResponseDetails.PaymentInfo[0].PendingReason.ToString() + transactionId);
            }
            return new PaymentResponse
            {
                TransactionId = transactionId,
                Price = float.Parse(requestDetails.PaymentDetails[0].OrderTotal.value)
            };
        }

        public class PaymentResponse
        {
            public string TransactionId { get; set; }
            public float Price { get; set; }
        }

        private string CancelTransaction(string transactionId)
        {
            // Create request object
            ManagePendingTransactionStatusRequestType request =
                new ManagePendingTransactionStatusRequestType();
            // (Required) The transaction ID of the payment transaction.
            request.TransactionID = transactionId;
            // (Required) The operation you want to perform on the transaction. It is one of the following values:
            // * Accept – Accepts the payment
            // * Deny – Rejects the payment
            request.Action = FMFPendingTransactionActionType.DENY;

            // Invoke the API
            ManagePendingTransactionStatusReq wrapper = new ManagePendingTransactionStatusReq();
            wrapper.ManagePendingTransactionStatusRequest = request;

            // Configuration map containing signature credentials and other required configuration.
            // For a full list of configuration parameters refer in wiki page 
            // [https://github.com/paypal/sdk-core-dotnet/wiki/SDK-Configuration-Parameters]

            // Create the PayPalAPIInterfaceServiceService service object to make the API call
            PayPalAPIInterfaceServiceService service = new PayPalAPIInterfaceServiceService(_payPalConfiguration);

            // # API call 
            // Invoke the ManagePendingTransactionStatus method in service wrapper object  
            ManagePendingTransactionStatusResponseType manageProfileStatusResponse =
                    service.ManagePendingTransactionStatus(wrapper);

            if (manageProfileStatusResponse.Ack.Equals(AckCodeType.FAILURE) ||
                (manageProfileStatusResponse.Errors != null && manageProfileStatusResponse.Errors.Any()))
            {
                return string.Empty;
            }
            return manageProfileStatusResponse.Status;

        }

        public string GenerateOrder(List<ItemPayPal> items)
        {
            // Create request object
            SetExpressCheckoutRequestType request = new SetExpressCheckoutRequestType();

            SetExpressCheckoutRequestDetailsType ecDetails = new SetExpressCheckoutRequestDetailsType();



            /* Populate payment requestDetails. 
			 * SetExpressCheckout allows parallel payments of upto 10 payments. 
			 * This samples shows just one payment.
			 */
            PaymentDetailsType paymentDetails = new PaymentDetailsType();
            ecDetails.PaymentDetails.Add(paymentDetails);
            // (Required) Total cost of the transaction to the buyer. If shipping cost and tax charges are known, include them in this value. If not, this value should be the current sub-total of the order. If the transaction includes one or more one-time purchases, this field must be equal to the sum of the purchases. Set this field to 0 if the transaction does not include a one-time purchase such as when you set up a billing agreement for a recurring payment that is not immediately charged. When the field is set to 0, purchase-specific fields are ignored.
            double orderTotal = 0.0;
            // Sum of cost of all items in this order. For digital goods, this field is required.
            double itemTotal = 0.0;
            CurrencyCodeType currency = CurrencyCodeType.MXN;


            //(Optional) Description of items the buyer is purchasing.
            // Note:
            // The value you specify is available only if the transaction includes a purchase.
            // This field is ignored if you set up a billing agreement for a recurring payment 
            // that is not immediately charged.
            // Character length and limitations: 127 single-byte alphanumeric characters

            paymentDetails.OrderDescription = "";

            // How you want to obtain payment. When implementing parallel payments, 
            // this field is required and must be set to Order.
            // When implementing digital goods, this field is required and must be set to Sale.
            // If the transaction does not include a one-time purchase, this field is ignored. 
            // It is one of the following values:
            //   Sale – This is a final sale for which you are requesting payment (default).
            //   Authorization – This payment is a basic authorization subject to settlement with PayPal Authorization and Capture.
            //   Order – This payment is an order authorization subject to settlement with PayPal Authorization and Capture.
            paymentDetails.PaymentAction = PaymentActionCodeType.SALE;

            paymentDetails.ButtonSource = "PTSH";

            foreach (ItemPayPal item in items)
            {
                PaymentDetailsItemType details = new PaymentDetailsItemType()
                {
                    Name = item.Name,
                    Amount = new BasicAmountType(currency, ((decimal)item.Price).ToString()),
                    Quantity = item.Quantity
                };

                // Indicates whether an item is digital or physical. For digital goods, this field is required and must be set to Digital. It is one of the following values:
                //   1.Digital
                //   2.Physical
                //  This field is available since version 65.1. 
                //itemDetails.ItemCategory = ItemCategoryType.DIGITAL;

                itemTotal += Convert.ToDouble(details.Amount.value) * details.Quantity.Value;

                //(Optional) Item description.
                // Character length and limitations: 127 single-byte characters
                // This field is introduced in version 53.0. 

                details.Description = item.Description;

                paymentDetails.PaymentDetailsItem.Add(details);
            }

            orderTotal += itemTotal;
            paymentDetails.ItemTotal = new BasicAmountType(currency, itemTotal.ToString());
            paymentDetails.OrderTotal = new BasicAmountType(currency, orderTotal.ToString());
            paymentDetails.Custom = "9998";
            paymentDetails.InvoiceID = null;

            ecDetails.ReturnURL = AppSettings.PayPalCallbackOk;
            ecDetails.CancelURL = AppSettings.PayPalCallbackFail;
            ecDetails.NoShipping = "1";
            ecDetails.AllowNote = "0";
            ecDetails.cppCartBorderColor = "0b5ba1";

            // (Optional) URL for the image you want to appear at the top left of the payment page. The image has a maximum size of 750 pixels wide by 90 pixels high. PayPal recommends that you provide an image that is stored on a secure (https) server. If you do not specify an image, the business name displays.
            ecDetails.cppHeaderImage = "";

            request.SetExpressCheckoutRequestDetails = ecDetails;

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


            // Invoke the API
            SetExpressCheckoutReq wrapper = new SetExpressCheckoutReq();
            wrapper.SetExpressCheckoutRequest = request;

            System.Net.ServicePointManager.Expect100Continue = false;

            // Configuration map containing signature credentials and other required configuration.
            // For a full list of configuration parameters refer in wiki page 
            // [https://github.com/paypal/sdk-core-dotnet/wiki/SDK-Configuration-Parameters]

            // Create the PayPalAPIInterfaceServiceService service object to make the API call
            PayPalAPIInterfaceServiceService service = new PayPalAPIInterfaceServiceService(_payPalConfiguration);

            //wrapper.SetExpressCheckoutRequest.Version = "84.0";
            // # API call 
            // Invoke the SetExpressCheckout method in service wrapper object  
            SetExpressCheckoutResponseType setECResponse = service.SetExpressCheckout(wrapper);

            // Check for API return status

            if (setECResponse.Ack.Equals(AckCodeType.FAILURE) || (setECResponse.Errors != null && setECResponse.Errors.Any()))
            {
                return string.Empty;
            }
            return setECResponse.Token;
        }
    }
}