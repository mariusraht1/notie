const General = require("../utils/general");

const placeholderText = "Type '/' for commands";
class Textline {
  static createByPageId(pageId) {
    let htmlElements = [];
    let textlines = Page_DB.getTextlines(pageId);
    $(textlines).each(function (index, textline) {
      let htmlElement = Textline.create(textline);
      htmlElements.push(htmlElement);
    });

    return htmlElements;
  }

  static create(textline) {
    if (!textline) {
      textline = { id: "", text: "" };
    }

    let htmlTextline = document.createElement("div");
    htmlTextline.contentEditable = "true";
    htmlTextline.className = "pageElement textline";
    $(htmlTextline).html(textline.text);
    if (!textline.id || textline.id.length == 0) {
      $(htmlTextline).data("uuid", Crypto.generateUUID(6));
    } else {
      $(htmlTextline).data("uuid", textline.id);
    }
    // css wouldn't recognize this attribute if we'd set it with jquery
    htmlTextline.dataset.placeholder = placeholderText;

    Textline.registerEvents(htmlTextline);

    return htmlTextline;
  }

  static registerEvents(htmlTextline) {
    $(htmlTextline).on("keydown", (event) => Eventhandler.onKeydown(event));
    $(htmlTextline).on("focus", (event) => Eventhandler.onFocus(event));
  }

  static appendBefore(element) {
    $(Eventhandler.activeTextline).before(element);
    $(Eventhandler.activeTextline).text("");
    General.focus($(Eventhandler.activeTextline));
  }

  static focusFirst() {
    let textline = $(".textline:first");
    General.focus(textline);
  }

  static focusLast() {
    let textline = $(".textline:last");
    General.focus(textline);
  }

  static delete(textline) {
    let isFirstTextline = textline.is(".textline:first");

    Textline_DB.delete(true, [], [textline.data("uuid")]);
    textline.remove();

    if (isFirstTextline) General.focus($("#pageName"));
  }

  static save(textline) {
    Textline_DB.update(true, [], {
      id: textline.data("uuid"),
      text: textline.text(),
    });
  }
}
class Eventhandler {
  activeTextline;

  static onFocus(event) {
    Eventhandler.activeTextline = $(event.target);
  }

  static onKeydown(event) {
    // Ignore certain characters
    if (event.key == "Shift") return;

    var textline = $(event.target);
    switch (event.key) {
      case "ArrowUp":
        var prevElement = textline.prev();
        General.focus(prevElement);
        event.preventDefault();
        break;
      case "ArrowDown":
        var nextElement = textline.next();
        General.focus(nextElement);
        event.preventDefault();
        break;
      case "Backspace":
        var prevElement = textline.prev();
        var selectedTextLength = General.getSelectedTextLength();

        if (General.getCursorPosition(textline) == 0 && selectedTextLength == 0) {
          var prevElementTextLength = prevElement.text().length;
          if (textline.text().length > 0 && selectedTextLength == 0) {
            prevElement.text(prevElement.text() + textline.text());
          }

          Textline.delete(textline);

          if (prevElement.is(".textline")) {
            General.moveCursorTo(prevElement, prevElementTextLength);
          }
          event.preventDefault();
        }
        break;
      case "Enter":
        if (BlockMenu.isOpen()) {
          var row = $(".clickable.active").eq(0);
          var elementType = row.data("type");
          Page.addElement(elementType);
          BlockMenu.close();
        } else {
          var newTextline = Textline.create();
          textline.after(newTextline);
          General.focus($(newTextline));
        }
        event.preventDefault();
        break;
      case "/":
        BlockMenu.open();
        break;
      default:
        textline.data("previousValue", textline.text());
        break;
    }

    // OPT Optimize blockMenu opening (e.g. also on backspace)
    let regex = /^[\w\s]+$/;
    if (event.key.match(regex) || event.key == "Escape") {
      BlockMenu.close();
    }
  }
}

module.exports = Textline;
