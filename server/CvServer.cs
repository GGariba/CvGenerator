using System.Net;
using System.Net.Sockets;
using System.Diagnostics;

// Minimal static file server for CV Generator (double-click exe after build)
string root = AppContext.BaseDirectory;
int port = 3456;
string url = $"http://localhost:{port}/";

Console.WriteLine("CV Generator - Local Server");
Console.WriteLine($"Serving: {root}");
Console.WriteLine($"Open:    {url}");
Console.WriteLine("Press Ctrl+C to stop.\n");

try
{
    Process.Start(new ProcessStartInfo { FileName = url, UseShellExecute = true });
}
catch { /* browser open is optional */ }

var listener = new HttpListener();
listener.Prefixes.Add(url);
listener.Start();

while (true)
{
    var context = await listener.GetContextAsync();
    _ = Task.Run(() => HandleRequest(context, root));
}

static void HandleRequest(HttpListenerContext context, string root)
{
    try
    {
        string path = context.Request.Url!.AbsolutePath;
        if (path == "/") path = "/index.html";
        string filePath = Path.Combine(root, path.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

        if (!filePath.StartsWith(root, StringComparison.OrdinalIgnoreCase) || !File.Exists(filePath))
        {
            context.Response.StatusCode = 404;
            context.Response.Close();
            return;
        }

        byte[] data = File.ReadAllBytes(filePath);
        context.Response.ContentType = GetContentType(filePath);
        context.Response.ContentLength64 = data.Length;
        context.Response.OutputStream.Write(data, 0, data.Length);
        context.Response.Close();
    }
    catch
    {
        context.Response.StatusCode = 500;
        context.Response.Close();
    }
}

static string GetContentType(string path)
{
    string ext = Path.GetExtension(path).ToLowerInvariant();
    return ext switch
    {
        ".html" => "text/html",
        ".css" => "text/css",
        ".js" => "application/javascript",
        ".json" => "application/json",
        ".svg" => "image/svg+xml",
        ".png" => "image/png",
        ".jpg" or ".jpeg" => "image/jpeg",
        _ => "application/octet-stream"
    };
}
