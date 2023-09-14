# Webpack für Oxid

Dieses Paket erleichtert die Konfiguration von Webpack für Oxid.

### Yarn

Dieses Paket benötigt [Yarn](https://classic.yarnpkg.com/en/docs/install). Grundsätzlich sollte auch NPM möglich sein, dazu werden allerdings noch weitere Konfigurationen nötig, um die Scripts zu nutzen.

### Installation

Zur Installation werden die Dateien aus [/example](https://github.com/Sioweb/OxidWebpack/tree/master/example) benötigt. Laden Sie die Dateien in den Root von Oxid und führen sie anschließend den Befehl `yarn && yarn build` in Ihrer Konsole aus.

### Entwicklung

#### $ yarn build

`yarn build`, erzeugt einen build im `productive` Mode.

#### $ yarn local

`yarn local` erzeugt einen build im `development` Mode.

#### $ yarn watch

`yarn watch` überwacht Anpassungen, in allen registrierten Assets. `development` Mode, ist aktiv.

### [{oxscript}] / [{oxstyle}]

Viele Module, verwenden [{oxscript add=""}], womit Javascript-Snippets im Code eingefügt werden können. Dadurch kann es nun zu Problemen führen, da dieses Snippets oft jQuery verwenden. Durch Webpack, wird allerdings kein jQuery mehr als einzelne Datei geladen. Alle Javascripts, werden am Ende des DOMs geladen.

Um das zu verhindern, muss das Modul [Oxid Scripts](https://github.com/Sioweb/OxidScripts) installiert werden. Das Modul bündelt sämtliche Snippts zu einer Funktion, die am Ende der Seite gespeichert und um Theme in `/entry/main_after.js` ausgefürt wird. 

### Symfony Kernel

Aktuell benötigt das Paket Module und Themes, welche für [Symfony Kernel](https://github.com/OXIDprojects/oxid-symfony-kernel) optimiert wurden.
