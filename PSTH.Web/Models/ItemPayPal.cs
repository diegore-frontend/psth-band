using System.ComponentModel.DataAnnotations;

namespace PSTH.Web.Models
{
    public class ItemPayPal
    {
        public string Email { get; set; }
        public string Key { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }

        [Required]
        public float Price { get; set; }
    }
}