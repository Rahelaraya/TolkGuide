/* This code defines the AppDbContext class for Entity Framework Core, representing the database context for an application that manages users, interpreters, customers, languages, and bookings. It includes DbSet properties for each entity and configures relationships and keys in the OnModelCreating method.
 using Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Database;

    public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Interpreter> Interpreters => Set<Interpreter>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Language> Languages => Set<Language>();
    public DbSet<InterpreterLanguage> InterpreterLanguages => Set<InterpreterLanguage>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

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
    }
}

*/