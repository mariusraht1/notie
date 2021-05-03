// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.$ = window.jQuery = require("jquery");
const ipcRenderer = require("electron").ipcRenderer;
const Path = require("path");

// Utilities
const General = require("../utils/general.js");
const Crypto = require("../utils/crypto.js");
const File = require("../utils/file.js");

// Controller
const Settings = require("../controller/settings.js");
const Document = require("../controller/document.js");

const Searchmenu = require("../controller/menu/searchmenu.js");
const Navbar = require("../controller/menu/navbar.js");
const Pagemenu = require("../controller/menu/pagemenu.js");
const Blockmenu = require("../controller/menu/blockmenu.js");
const Tablemenu = require("../controller/menu/tablemenu.js");

// Database
const Database = require("../controller/database/database.js");
const Page_DB = require("../controller/database/page_db.js");
const Table_DB = require("../controller/database/table_db.js");
const Textline_DB = require("../controller/database/textline_db.js");

// Model
const Enums = require("../model/enums.js");
const Page = require("../model/page.js");
const Textline = require("../model/textline.js");
const Placeholder = require("../model/placeholder.js");
const Table = require("../model/table.js");

class Renderer {
  static init() {
    ipcRenderer.send("setAppVersion");

    Renderer.registerEvents();

    let settings = ipcRenderer.sendSync("getSettings");
    Settings.CACHE = settings.CACHE;
    Settings.DATA = settings.DATA;

    if (File.isDir(Settings.CACHE.DATABASE)) {
      Settings.ENC_DATABASE = Path.join(
        Settings.CACHE.DATABASE,
        Settings.DEFAULT_ENC_DB_FILENAME
      );
      Settings.DEC_DATABASE = Path.join(
        Settings.CACHE_FOLDER,
        Settings.DEFAULT_DEC_DB_FILENAME
      );
    } else {
      Settings.ENC_DATABASE = Settings.CACHE.DATABASE;
      Settings.DEC_DATABASE =
        Path.join(
          Settings.CACHE_FOLDER,
          Path.parse(Settings.CACHE.DATABASE).name
        ) + ".db";
    }

    console.log("ENC_DATABASE: " + Settings.ENC_DATABASE);
    console.log("DEC_DATABASE: " + Settings.DEC_DATABASE);
    console.log(Settings.CACHE);
    console.log(Settings.DATA);

    Database.init();

    Navbar.init();
    Page.init();

    Document.init();
    Blockmenu.init();
    Pagemenu.init();

    // Searchmenu.init();
  }

  static registerEvents() {
    ipcRenderer.on("update-downloaded", function (event, text) {
      console.log("update-downloaded");
      var container = document.getElementById("btnUpdateApp");
      container.removeAttribute("disabled");
    });
    ipcRenderer.on("update-available", function (event, text) {
      console.log("update-available");
    });
    ipcRenderer.on("error", function (event, text) {
      console.log("error", text);
    });
    ipcRenderer.on("prog-made", function (event, text) {
      console.log("prog-made");
      console.log(text);
    });
    ipcRenderer.on("update-not-available", function (event, text) {
      console.log("update-not-available");
    });

    $(window).on("beforeunload", function (event) {
      try {
        event.preventDefault();

        Page.saveCurrentContent();
        Database.close();
        Settings.save();
      } catch (e) {}
    });

    $("#btnUpdateApp").on("click", function (event) {
      ipcRenderer.send("quitAndInstall");
    });

    $("#btnTest").on("click", function (event) {});

    $("#btnRestart").on("click", function (event) {
      Eventhandler.onClickBtnRestart(event);
    });
  }
}

class Eventhandler {
  static onClickBtnRestart(event) {
    $(window).trigger("beforeunload");
    ipcRenderer.send("exit", true);
  }
}

Renderer.init();

// DEBUG Test table build
// const Table = require("./model/table.js");
// Table.create($("#content"), {
//   caption: "Untitled",
//   columns: [
//     { name: "Name", type: "text", width: "120px" },
//     { name: "Tags", type: "checkbox", width: "20px" },
//     { name: "Status", type: "text", width: "120px" },
//   ],
//   rows: [
//     {
//       Name: "Hallo Welt 1",
//       Tags: true,
//       Status: "Offen und in Bearbeitung",
//     },
//     {
//       Name: "Hallo Welt 2",
//       Tags: false,
//       Status: "Geschlossen und abgeschlossen",
//     },
//   ],
// });
