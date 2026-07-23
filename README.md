# CvGenerator

<p align="center">
  <img src="https://img.shields.io/badge/.NET-9.0-512BD4?style=for-the-badge&logo=dotnet" alt=".NET 9" />
  <img src="https://img.shields.io/badge/ASP.NET-MVC-512BD4?style=for-the-badge" alt="ASP.NET MVC" />
  <img src="https://img.shields.io/badge/UI-Razor%20%2B%20Tailwind-38BDF8?style=for-the-badge" alt="Razor + Tailwind" />
</p>

A lightweight CV generator that renders a polished résumé from structured data.

## 🏗️ Architecture

```text
[cv-data.json] --> [HomeController] --> [Index.cshtml] --> Browser
```

- [CvGeneratorNetServer/Program.cs](CvGeneratorNetServer/Program.cs) starts the ASP.NET Core app
- [CvGeneratorNetServer/Controllers/HomeController.cs](CvGeneratorNetServer/Controllers/HomeController.cs) loads CV data
- [CvGeneratorNetServer/Views/Home/Index.cshtml](CvGeneratorNetServer/Views/Home/Index.cshtml) renders the page
- [CvGeneratorNetServer/wwwroot/cv-data.json](CvGeneratorNetServer/wwwroot/cv-data.json) holds the CV content

## 🚀 Run

```powershell
cd CvGeneratorNetServer
dotnet run
```

Open the local URL shown in the terminal.

## 📁 Repo notes

- [CvGeneratorNetServer](CvGeneratorNetServer) – main app
- [.gitignore](.gitignore) – ignores build output and private data
- [README.md](README.md) – project docs
