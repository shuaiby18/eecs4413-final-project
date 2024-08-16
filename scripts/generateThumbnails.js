const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Paths
const modelsDirectory = path.join(__dirname, "../public/models/characters");
const thumbnailsDirectory = path.join(__dirname, "../public/thumbnails");

// Ensure the thumbnails directory exists
if (!fs.existsSync(thumbnailsDirectory)) {
    fs.mkdirSync(thumbnailsDirectory, { recursive: true });
}

// Read all GLB files in the models directory
fs.readdir(modelsDirectory, (err, files) => {
    if (err) {
        return console.error("Error reading models directory:", err);
    }

    // Filter only GLB files
    const glbFiles = files.filter(file => file.endsWith(".glb"));

    // Loop through each GLB file and generate a thumbnail
    glbFiles.forEach(file => {
        const inputPath = path.join(modelsDirectory, file);
        const outputPath = path.join(thumbnailsDirectory, file.replace(".glb", "-thumbnail.png"));

        console.log(`Generating thumbnail for: ${file}`);

        // Execute the screenshot-glb command
        exec(`npx screenshot-glb -i ${inputPath} -o ${outputPath} -w 600 -h 400`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error generating thumbnail for ${file}:`, error);
                return;
            }
            if (stderr) {
                console.error(`Error output for ${file}:`, stderr);
                return;
            }
            console.log(`Thumbnail saved for ${file} at ${outputPath}`);
        });
    });
});
