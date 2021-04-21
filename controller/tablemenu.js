const { Table } = require("../model/table");

// FIX Call methods tablemenu-specific
class Tablemenu {
  static registerEvent(tableMenuContainer) {
    $(tableMenuContainer).on("click", function (event) {
      Eventhandler.onClick(event);
    });
  }

  static registerEventMenuItem(tr) {
    $(tr).on("click", function (event) {
      Eventhandler.onClickMenuItem(event);
    });
  }

  static isOpen(tableMenu) {
    return tableMenu.hasClass("visible");
  }

  static closeAll() {
    $(".tableMenu").removeClass("visible");
    $(".tableMenu").toggle(false);
  }

  static open(tableMenu) {
    Tablemenu.closeAll();
    tableMenu.addClass("visible");
    tableMenu.toggle(true);
  }
}

class Eventhandler {
  static onClick(event) {
    let element = $(event.target);
    let tableMenu = element.parents("caption").children(".tableMenu");
    if (!Tablemenu.isOpen(tableMenu)) {
      Tablemenu.open(tableMenu);
    } else {
      Tablemenu.closeAll();
    }
  }

  static onClickMenuItem(event) {
    let table = $(event.target).parents(".table");
    TableJS.Table.remove(table);
    Tablemenu.closeAll();
  }
}

module.exports = { Tablemenu, Eventhandler };
