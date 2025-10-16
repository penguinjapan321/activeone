$(function () {
  var $table = $("#inquiry_form.inquiry_form");
  if (!$table.length) return;

  // 新しいULを作成（id/classを引き継ぐ）
  var $ul = $("<ul/>", {
    id: $table.attr("id"),
    class: ((($table.attr("class") || "") + " inquiry_list form_ul").trim()),
  });

  // tr列挙（tbodyの有無どちらも対応）
  var $rows = $table.find("> tr, > tbody > tr");

  $rows.each(function () {
    var $tr = $(this);
    var $th = $tr.find("> th");
    var $td = $tr.find("> td");

    // li を生成（require クラスなどは li に引き継ぐ）
    var $li = $("<li/>", { class: $tr.attr("class") || "" });

    // ラベル部分（thのHTMLをそのまま使うと * 表記も維持される）
    var $label = $('<div class="label"/>').html($th.html() || $th.text());
    var $field = $('<div class="field"/>');

    // ご住所の内側tableも ul/li に変換
    // .responsive > table.table がある場合は個別に処理
    var $innerTable = $td.find("> .responsive > table.table");
    if ($innerTable.length) {
      var $addrUl = $('<ul class="address_list"/>');
      var $addrRows = $innerTable.find("> tbody > tr, > tr");

      $addrRows.each(function () {
        var $ar = $(this);
        var $t0 = $ar.find("> td").eq(0);
        var $t1 = $ar.find("> td").eq(1);

        var $addrLi = $('<li class="address_item"/>');
        var $addrLabel = $('<div class="sub_label"/>').text(
          ($t0.text() || "").trim()
        );
        var $addrField = $('<div class="sub_field"/>');

        // td右側の中身（input/select/リンク/スクリプトなど）をそのまま移動
        // contents() で子ノードを丸ごと移動することでイベント/属性を維持
        $addrField.append($t1.contents());
        $addrLi.append($addrLabel, $addrField);
        $addrUl.append($addrLi);
      });

      // .responsive の外側ラッパを作り直して field に配置
      var $responsiveWrap = $('<div class="responsive"/>').append($addrUl);

      // 元の住所行のtd内にある（内側tableの後ろの）スクリプト等も移動する
      // 内側tableの直後〜td末尾のノードを field に移す
      var moved = false;
      $td.contents().each(function () {
        if (this === $innerTable.get(0)) {
          moved = true;
          return; // 次からスクリプト等の残りを拾う
        }
        if (moved) {
          $responsiveWrap.append(this);
        }
      });

      $field.append($responsiveWrap);
    } else {
      // 通常の行は td の中身をそのまま field に移動（ハイフンやスクリプトも含めて）
      $field.append($td.contents());
    }

    $li.append($label, $field);
    $ul.append($li);
  });

  // 元の table を ul で置き換え
  $table.replaceWith($ul);
});

// .contact_form 内の form に自動で .h-adr を付与し、必要なら p-country-name も補完
$(function () {
  var $form = $(".contact_form").find("form").first();
  if (!$form.length) return;

  if (!$form.hasClass("h-adr")) {
    $form.addClass("h-adr");
  }

  // yubinbango 対応のため、国名スパンが無ければ追加（重複追加はしない）
  if ($form.find(".p-country-name").length === 0) {
    $form.prepend(
      '<span class="p-country-name" style="display:none">Japan</span>'
    );
  }
});
