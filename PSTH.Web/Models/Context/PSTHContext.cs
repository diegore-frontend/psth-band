using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using PSTH.Web.Models.Entities;

namespace PSTH.Web.Models.Context
{
    public class PSTHContext : DbContext
    {
        public PSTHContext()
        : base("name=PSTHEntities")
        {

        }

        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            base.OnModelCreating(modelBuilder);
        }
    }
}