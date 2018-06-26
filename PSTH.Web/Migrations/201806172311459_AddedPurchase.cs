namespace PSTH.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddedPurchase : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Payment",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    Price = c.Single(nullable: false),
                    RegisterDate = c.DateTime(nullable: false, defaultValueSql: "GETDATE()"),
                })
                .PrimaryKey(t => t.Id);

        }

        public override void Down()
        {
            DropTable("dbo.Payment");
        }
    }
}
