class Placeholder {
  static init() {
    $("#placeholder").on("click", (event) => Eventhandler.onClick(event));
  }
}

class Eventhandler {
  static onClick(event) {
    let lastElement = $("#content").children().last(".pageElement");
    if (!lastElement.hasClass("textline")) {
      var textline = Textline.create();
      $("#content").append(textline);
    }
    Textline.focusLast();
  }
}

module.exports = Placeholder;
