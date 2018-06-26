using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PSTH.Web.Models.Entities
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public float Price { get; set; }

        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime RegisterDate { get; set; }
    }
}