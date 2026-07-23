using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace CvGeneratorNetServer.Models
{
    public class CvData
    {
        public PersonalInfo? Personal { get; set; }
        public List<Experience>? Experiences { get; set; }
        public List<Education>? Education { get; set; }
        public List<string>? Skills { get; set; }
        // Add other lists like Interests, Languages, etc.
        public List<Language>? Languages { get; set; }
        public List<string>? Interests { get; set; }
        public List<Project>? Projects { get; set; }
        public List<Achievement>? Achievements { get; set; }
    }

    public class PersonalInfo
    {
        public string? Name { get; set; }
        public string? Title { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? LinkedIn { get; set; }
        public string? Github { get; set; }
        public string? Location { get; set; }
        public string[]? About { get; set; }

        public string? EmailLink => string.IsNullOrWhiteSpace(Email) ? null : $"mailto:{Email}";
        public string? LinkedInLink => string.IsNullOrWhiteSpace(LinkedIn) ? null : LinkedIn;
        public string? GithubLink => string.IsNullOrWhiteSpace(Github) ? null : Github;
    }

    public class Experience
    {
        public string? Position { get; set; }
        public string? Company { get; set; }
        [JsonConverter(typeof(NullableDateOnlyConverter))]
        public DateOnly? StartYear { get; set; }
        [JsonConverter(typeof(NullableDateOnlyConverter))]
        public DateOnly? EndYear { get; set; }
        public List<string>? Description { get; set; }
    }

    public class Education
    {
        public string? Institution { get; set; }
        public string? Degree { get; set; }
        public string? FieldOfStudy { get; set; }
        [JsonConverter(typeof(NullableDateOnlyConverter))]
        public DateOnly? StartYear { get; set; }
        [JsonConverter(typeof(NullableDateOnlyConverter))]
        public DateOnly? EndYear { get; set; }
    }

    // Add this to your existing classes
    public class Project
    {
        public string? Name { get; set; }
        public string? Url { get; set; }
        public List<string>? Description { get; set; } = new();
    }

    public class Achievement
    {
        public string? Title { get; set; }
        [JsonConverter(typeof(NullableDateOnlyConverter))]
        public DateOnly? Date { get; set; }
        public string? Issuer { get; set; }
        public string? Description { get; set; }
    }

    public class Language
    {
        // We map the JSON key "language" to the C# property "Name"
        [JsonPropertyName("language")]
        public string? Name { get; set; }
        
        // We map the JSON key "proficiency" to "Proficiency"
        [JsonPropertyName("proficiency")]
        public string? Proficiency { get; set; }
    }
    public class NullableDateOnlyConverter : JsonConverter<DateOnly?>
    {
        public override DateOnly? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null)
            {
                return null;
            }

            if (reader.TokenType == JsonTokenType.String)
            {
                var value = reader.GetString();
                if (string.IsNullOrWhiteSpace(value) || string.Equals(value, "Present", StringComparison.OrdinalIgnoreCase))
                {
                    return null;
                }

                if (DateOnly.TryParse(value, out var date))
                {
                    return date;
                }

                if (int.TryParse(value, out var year))
                {
                    return new DateOnly(year, 1, 1);
                }
            }

            if (reader.TokenType == JsonTokenType.Number && reader.TryGetInt32(out var numericYear))
            {
                return new DateOnly(numericYear, 1, 1);
            }

            return null;
        }

        public override void Write(Utf8JsonWriter writer, DateOnly? value, JsonSerializerOptions options)
        {
            if (value is null)
            {
                writer.WriteNullValue();
                return;
            }

            writer.WriteStringValue(value.Value.ToString("yyyy-MM-dd"));
        }
    }
}