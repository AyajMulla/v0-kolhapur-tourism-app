const fs = require('fs');

const FILE_PATH = 'e:\\KolhapurTourism\\v0-kolhapur-tourism-app\\data\\tourism-data.js';

const coordsDict = {
    "gaganbawada-hills": "[16.5492, 73.8180]",
    "karul-ghat-viewpoint": "[16.5451, 73.8042]",
    "bawada-waterfalls": "[16.5500, 73.8120]",
    "jyotiba-temple": "[16.7865, 74.1751]",
    "kaneri-math": "[16.6186, 74.2690]",
    "manoli-waterfall": "[16.5828, 73.8569]",
    "manoli-dam": "[16.5828, 73.8569]",
    "vishalgad-fort": "[16.8906, 73.8184]",
    "kagal-lake": "[16.5801, 74.3218]",
    "kagal-industrial-area-park": "[16.5925, 74.3015]",
    "ramling-temple": "[16.7441, 74.4468]",
    "hupari-temple": "[16.6210, 74.4172]",
    "narsobawadi": "[16.6669, 74.5888]",
    "kopeshwar-temple": "[16.6713, 74.6547]",
    "krishna-river-ghat-shirol": "[16.7324, 74.6110]",
    "karambali-dam": "[16.2268, 74.3414]",
    "hiranyakeshi-temple": "[16.2201, 74.3522]",
    "mahagaon-backwaters": "[16.2345, 74.3255]",
    "tilari-dam": "[15.8203, 74.1500]",
    "swapnavel-point": "[15.8250, 74.1480]",
    "nangartas-waterfall": "[15.8350, 74.1420]",
    "amboli-ghat-view": "[15.9610, 73.9984]",
    "ramling-temple-ajara": "[16.1167, 74.2000]",
    "bhudargad-fort": "[16.2941, 74.0044]",
    "bhudargad-hill-view": "[16.2955, 74.0055]",
    "gargoti-city-view-point": "[16.3134, 74.1205]"
};

let content = fs.readFileSync(FILE_PATH, 'utf8');

for (const [id, coords] of Object.entries(coordsDict)) {
    // We look for id: "something" and then inject coordinates right after image: "/something.jpg",
    const regex = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?image:\\s*"[^"]*",)`, 'g');
    
    // Check if coordinates already exist in this block to avoid double injection
    content = content.replace(regex, (match) => {
        if (match.includes("coordinates:")) return match;
        return `${match}\n        coordinates: ${coords},`;
    });
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log("Successfully injected coordinates!");
