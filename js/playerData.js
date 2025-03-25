// Spielerdaten-Management
class PlayerData {
    constructor() {
        this.coins = 0;
        this.unlockedBirds = { "default": true };
        this.currentBird = "default";
        this.unlockedBackgrounds = { "day": true };
        this.currentBackground = "day";
        this.unlockedParticles = { "default": true };
        this.currentParticleEffect = "default";
        
        this.loadData();
    }
    
    // Lädt Spielerdaten aus dem lokalen Speicher
    loadData() {
        try {
            const savedData = localStorage.getItem('flapOfDoomData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.coins = data.coins || 0;
                this.unlockedBirds = data.unlockedBirds || { "default": true };
                this.currentBird = data.currentBird || "default";
                this.unlockedBackgrounds = data.unlockedBackgrounds || { "day": true };
                this.currentBackground = data.currentBackground || "day";
                this.unlockedParticles = data.unlockedParticles || { "default": true };
                this.currentParticleEffect = data.currentParticleEffect || "default";
            }
        } catch (e) {
            console.error("Fehler beim Laden der Spielerdaten:", e);
            // Setze Standardwerte bei Fehler
            this.resetToDefaults();
        }
    }
    
    // Speichert Spielerdaten im lokalen Speicher
    saveData() {
        try {
            const data = {
                coins: this.coins,
                unlockedBirds: this.unlockedBirds,
                currentBird: this.currentBird,
                unlockedBackgrounds: this.unlockedBackgrounds,
                currentBackground: this.currentBackground,
                unlockedParticles: this.unlockedParticles,
                currentParticleEffect: this.currentParticleEffect
            };
            localStorage.setItem('flapOfDoomData', JSON.stringify(data));
        } catch (e) {
            console.error("Fehler beim Speichern der Spielerdaten:", e);
        }
    }
    
    // Fügt Münzen hinzu und speichert
    addCoins(amount) {
        this.coins += amount;
        this.saveData();
    }
    
    // Setzt Standardwerte
    resetToDefaults() {
        this.coins = 0;
        this.unlockedBirds = { "default": true };
        this.currentBird = "default";
        this.unlockedBackgrounds = { "day": true };
        this.currentBackground = "day";
        this.unlockedParticles = { "default": true };
        this.currentParticleEffect = "default";
    }
    
    // Speichert einen Highscore
    saveScore(name, score) {
        const currentDate = new Date().toLocaleDateString('de-DE');
        const scoreData = {
            name: name,
            score: score,
            date: currentDate
        };
        
        try {
            // Sende Daten an den Server, falls verfügbar
            this.sendScoreToServer(scoreData);
        } catch (e) {
            console.error("Fehler beim Senden des Scores:", e);
            // Lokales Speichern als Fallback
            this.saveScoreLocally(scoreData);
        }
    }
    
    // Sendet Score an den Server
    async sendScoreToServer(scoreData) {
        try {
            const response = await fetch('https://api.magrora.de/json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scoreData)
            });
            
            if (response.ok) {
                console.log("Score erfolgreich an Server gesendet!");
                // Öffne die Highscores-Seite
                window.open('https://api.magrora.de/flapofdoom', '_blank');
            } else {
                console.error("Fehler beim Senden des Scores:", response.status);
                this.saveScoreLocally(scoreData);
            }
        } catch (e) {
            console.error("Netzwerkfehler beim Senden des Scores:", e);
            this.saveScoreLocally(scoreData);
        }
    }
    
    // Speichert Score lokal
    saveScoreLocally(scoreData) {
        let highScores = [];
        try {
            const savedScores = localStorage.getItem('flapOfDoomHighscores');
            if (savedScores) {
                highScores = JSON.parse(savedScores);
            }
        } catch (e) {
            highScores = [];
        }
        
        highScores.push(scoreData);
        highScores.sort((a, b) => b.score - a.score);
        
        localStorage.setItem('flapOfDoomHighscores', JSON.stringify(highScores));
        
        // Erstelle HTML für lokale Anzeige
        this.createHighscoreHTML(highScores);
    }
    
    // Erstellt eine HTML-Datei für Highscores
    createHighscoreHTML(scores) {
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>FlapOfDoom Highscores</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #1e90ff, #70a1ff);
                    margin: 0;
                    padding: 20px;
                    color: white;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 20px;
                    backdrop-filter: blur(10px);
                }
                h1 {
                    text-align: center;
                    color: white;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    overflow: hidden;
                }
                th, td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                }
                th {
                    background: rgba(0, 0, 0, 0.2);
                    font-weight: bold;
                }
                tr:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .rank {
                    font-weight: bold;
                    color: #ffd700;
                }
                .date {
                    color: #a0a0a0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🏆 FlapOfDoom Highscores 🏆</h1>
                <table>
                    <tr>
                        <th>Rang</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Datum</th>
                    </tr>
                    ${scores.slice(0, 10).map((score, i) => `
                    <tr>
                        <td class="rank">#${i+1}</td>
                        <td>${score.name}</td>
                        <td>${score.score}</td>
                        <td class="date">${score.date}</td>
                    </tr>
                    `).join('')}
                </table>
            </div>
        </body>
        </html>
        `;
        
        // In modernen Browsern können wir keine Dateien direkt schreiben,
        // daher öffnen wir ein neues Fenster mit dem HTML-Inhalt
        const newWindow = window.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    }
}

// Erstelle eine globale Instanz
const playerData = new PlayerData();
