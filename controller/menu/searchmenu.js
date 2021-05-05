class SearchMenu {
  static init() {
    SearchMenu.registerEvents();
  }

  static registerEvents() {
    let input = $("#searchmenu > input:text");
    input.on("input", function (event) {
      Eventhandler.onInput(event);
    });
  }
}

class Eventhandler {
  static onInput(event) {
    let input = $(event.target);
    let result = Database.searchTables(input.val());

    let tbody = $("#searchmenu > table > tbody");
    tbody.children().remove();

    if (result.length == 0) return;
    $(result).each(function () {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.textContent = this.name;
      tr.append(td);
      tbody.append(tr);
    });
  }
}

module.exports = SearchMenu;
