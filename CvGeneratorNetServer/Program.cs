using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

var builder = WebApplication.CreateBuilder(args);

// ============================================================
// FUTURE INTEGRATIONS & DEPENDENCY INJECTION 
// (Uncomment these as you build Phase 2 and beyond)
// ============================================================

// 1. Gen AI Integrations (e.g., auto-tailoring CV summaries based on job descriptions)
// builder.Services.AddSingleton<IOpenAIService, CustomGenAIService>();

// 2. External API Integrations (e.g., Jira issue tracking for project milestones)
// builder.Services.AddHttpClient("JiraClient", client => {
//     client.BaseAddress = new Uri("https://your-domain.atlassian.net/rest/api/3/");
// });

// 3. Infrastructure Automation / CI/CD Webhooks
// builder.Services.AddHostedService<PipelineMonitoringBackgroundService>();


// Add services to the container (MVC architecture).
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

// This efficiently serves your style.css and cv-data.json from the wwwroot folder
app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();