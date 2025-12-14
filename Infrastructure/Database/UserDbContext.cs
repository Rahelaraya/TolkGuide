using Domain.Models;
using Infrastructure.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Infrastructure.Database
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
        {
        }

        // Från templaten (auth)
        public DbSet<User> Users { get; set; }

        // 🔹 TolkGuide-entiteter
        public DbSet<Interpreter> Interpreters => Set<Interpreter>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Language> Languages => Set<Language>();
        public DbSet<InterpreterLanguage> InterpreterLanguages => Set<InterpreterLanguage>();
        public DbSet<Booking> Bookings => Set<Booking>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-many Interpreter <-> Language
            modelBuilder.Entity<InterpreterLanguage>()
                .HasKey(x => new { x.InterpreterId, x.LanguageId });

            modelBuilder.Entity<InterpreterLanguage>()
                .HasOne(x => x.Interpreter)
                .WithMany(i => i.Languages)
                .HasForeignKey(x => x.InterpreterId);

            modelBuilder.Entity<InterpreterLanguage>()
                .HasOne(x => x.Language)
                .WithMany(l => l.InterpreterLanguages)
                .HasForeignKey(x => x.LanguageId);

            // Booking relations
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Customer)
                .WithMany(c => c.Bookings)
                .HasForeignKey(b => b.CustomerId);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Interpreter)
                .WithMany(i => i.Bookings)
                .HasForeignKey(b => b.InterpreterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Language)
                .WithMany()
                .HasForeignKey(b => b.LanguageId);
            modelBuilder.Entity<Customer>()
                .HasOne(c => c.User)
                .WithOne(u => u.Customer)
                .HasForeignKey<Customer>(c => c.UserId);

            modelBuilder.Entity<Interpreter>()
                .HasOne(i => i.User)
                .WithOne(u => u.Interpreter)
                .HasForeignKey<Interpreter>(i => i.UserId);

        }
    }
}

