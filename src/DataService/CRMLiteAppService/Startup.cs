using System;
using System.Net;
using AutoMapper;
using CRMLiteAppService.Auth;
using CRMLiteAppService.Data;
using CRMLiteAppService.Extensions;
using CRMLiteAppService.Helpers;
using CRMLiteAppService.Models;
using CRMLiteAppService.Models.Entities;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;


namespace CRMLiteAppService
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			// Add framework services.
			services.AddDbContext<ApplicationDbContext>(options => options.UseInMemoryDatabase("WebApp"));

			services.AddSingleton<IJwtFactory, JwtFactory>();

			services.TryAddTransient<IHttpContextAccessor, HttpContextAccessor>();

			var signingConfigurations = new SigningConfigurations();
			services.AddSingleton(signingConfigurations);

			// jwt wire up
			// Get options from app settings
			var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));

			// Use .NET Secret Manager.
			//var signingKey = new SymmetricSecurityKey(
			//	Encoding.UTF8.GetBytes(jwtAppSettingOptions[nameof(JwtIssuerOptions.signingKey)]));

			// Configure JwtIssuerOptions
			services.Configure<JwtIssuerOptions>(options =>
			{
				options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
				options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
				options.SigningCredentials = signingConfigurations.SigningCredentials;
			});

			services.AddAuthentication(authOptions =>
				{
					authOptions.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
					authOptions.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
				})
				.AddJwtBearer(bearerOptions =>
				{
					bearerOptions.TokenValidationParameters = new TokenValidationParameters
					{
						// Clock skew compensates for server time drift.
						// Recommended 5 minutes or less:
						ClockSkew = TimeSpan.Zero,
						// Ensure the token has a valid key
						ValidateIssuerSigningKey = true,
						// Specify the key used to sign the token:
						IssuerSigningKey = signingConfigurations.Key,
						// Ensure the token hasn't expired:
						RequireExpirationTime = true,
						ValidateLifetime = true,
						// Ensure the token audience matches our audience value (default true):
						ValidateAudience = true,
						ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],
						// Ensure the token was issued by a trusted authorization server (default true):
						ValidateIssuer = true,
						ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

					};
				});

			// api user claim policy
			services.AddAuthorization(options =>
			{
				options.AddPolicy("ApiUser", policy =>
					policy.RequireClaim(Constants.Strings.JwtClaimIdentifiers.Rol, Constants.Strings.JwtClaims.ApiAccess));
			});

			// add identity
			var builder = services.AddIdentityCore<AppUser>(o =>
			{
				// configure identity options
				o.Password.RequireDigit = false;
				o.Password.RequireLowercase = false;
				o.Password.RequireUppercase = false;
				o.Password.RequireNonAlphanumeric = false;
				o.Password.RequiredLength = 6;
			});
			builder = new IdentityBuilder(builder.UserType, typeof(IdentityRole), builder.Services);
			builder.AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();

			services.AddCors(options =>
				options.AddPolicy("AllowAll", p => p.AllowAnyOrigin()
					//p.WithOrigins("http://localhost:8088") // to set an origin 
					.AllowAnyMethod()
					.AllowAnyHeader()));

			services.AddAutoMapper();

			services.AddMvc().AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<Startup>());
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			app.UseExceptionHandler(
				builder =>
				{
					builder.Run(
						async context =>
						{
							context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
							context.Response.Headers.Add("Access-Control-Allow-Origin", "*");

							var error = context.Features.Get<IExceptionHandlerFeature>();
							if (error != null)
							{
								context.Response.AddApplicationError(error.Error.Message);
								await context.Response.WriteAsync(error.Error.Message).ConfigureAwait(false);
							}
						});
				});

			app.UseCors("AllowAll");

			app.UseAuthentication();
			app.UseDefaultFiles();
			app.UseStaticFiles();
			app.UseMvc();
		}
	}
}
