using Microsoft.EntityFrameworkCore;
using SplitPay.API.Models;

namespace SplitPay.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Grupo> Grupos => Set<Grupo>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
}