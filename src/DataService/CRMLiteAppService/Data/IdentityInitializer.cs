using System;
using CRMLiteAppService.Helpers;
using CRMLiteAppService.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace CRMLiteAppService.Data
{
	public class IdentityInitializer
	{
		private readonly ApplicationDbContext _context;
		private readonly UserManager<AppUser> _userManager;
		private readonly RoleManager<IdentityRole> _roleManager;


		public IdentityInitializer(
			ApplicationDbContext context,
			UserManager<AppUser> userManager,
			RoleManager<IdentityRole> roleManager)
		{
			_context = context;
			_userManager = userManager;
			_roleManager = roleManager;
		}

		public void Initialize()
		{
			if (_context.Database.EnsureCreated())
			{
				if (!_roleManager.RoleExistsAsync(Constants.Strings.JwtClaims.ApiAccess).Result)
				{
					var resultado = _roleManager.CreateAsync(
						new IdentityRole(Constants.Strings.JwtClaims.ApiAccess)).Result;
					if (!resultado.Succeeded)
					{
						throw new Exception(
							$"Error to create role {Constants.Strings.JwtClaims.ApiAccess}.");
					}
				}

				CreateUser(
					new AppUser()
					{
						UserName = "admin_api",
						Email = "admin-api@teste.com.br",
						EmailConfirmed = true
					}, "AdminAPI01!", Constants.Strings.JwtClaims.ApiAccess);

				CreateUser(
					new AppUser()
					{
						UserName = "usrinvalid_api",
						Email = "usrinvalid-api@teste.com.br",
						EmailConfirmed = true
					}, "UsrInvAPI01!");
			}
		}

		private void CreateUser(
			AppUser user,
			string password,
			string initialRole = null)
		{
			if (_userManager.FindByNameAsync(user.UserName).Result == null)
			{
				var resultado = _userManager
					.CreateAsync(user, password).Result;

				if (resultado.Succeeded &&
					!String.IsNullOrWhiteSpace(initialRole))
				{
					_userManager.AddToRoleAsync(user, initialRole).Wait();
				}
			}
		}
	}
}
