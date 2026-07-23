# CvGenerator

CvGenerator is an ASP.NET Core MVC application for rendering a CV from structured JSON data.

## Current architecture

The project is currently organized around a single .NET web application inside [CvGeneratorNetServer](CvGeneratorNetServer):

- [CvGeneratorNetServer/Program.cs](CvGeneratorNetServer/Program.cs) configures the ASP.NET Core pipeline, MVC services, static asset hosting, and routing.
- [CvGeneratorNetServer/Controllers/HomeController.cs](CvGeneratorNetServer/Controllers/HomeController.cs) loads CV data from the JSON file and passes it into the Razor view.
- [CvGeneratorNetServer/Views/Home/Index.cshtml](CvGeneratorNetServer/Views/Home/Index.cshtml) renders the CV page using the model and Tailwind styling.
- [CvGeneratorNetServer/wwwroot/cv-data.json](CvGeneratorNetServer/wwwroot/cv-data.json) stores the CV content used by the view.
- [CvGeneratorNetServer/wwwroot/style.css](CvGeneratorNetServer/wwwroot/style.css) contains custom CV presentation styling.

## Project layout

- [CvGeneratorNetServer](CvGeneratorNetServer) – main ASP.NET MVC application
- [.gitignore](.gitignore) – repository ignore rules for build outputs and private data
- [README.md](README.md) – project documentation
- [StartCvGeneratorServer.exe](StartCvGeneratorServer.exe) – packaged local executable wrapper
- [StartCvGeneratorServer.pdb](StartCvGeneratorServer.pdb) – debugging symbols for the wrapper binary

## Run locally

From the project root, start the application with:

```powershell
cd CvGeneratorNetServer
dotnet run
```

Then open the local URL shown by the ASP.NET Core host (typically `https://localhost:5001` or `http://localhost:5000`, depending on your environment).

## Notes

- The application uses MVC + Razor views rather than a simple static HTML page.
- Generated build folders such as `bin/` and `obj/` are ignored and should not be committed.
- The CV input data file is currently excluded from version control in [.gitignore](.gitignore).
