$(function () {
  var $table = $("#inquiry_form.inquiry_form");
  if (!$table.length) return;

  // th を label に変換するユーティリティ
  function buildLabelFromPair($labelCell, $fieldCell) {
    // 既存の label があればそれを優先して移動
    var $existing = $labelCell.find("> label").first();
    var $labelEl = $existing.length
      ? $existing
      : $("<label/>").html($labelCell.html());

    // for を可能なら付与（ペア側の最初の入力要素の id を使用）
    var $firstField =
      $fieldCell && $fieldCell.find("input, select, textarea").first();
    if ($firstField && $firstField.length) {
      var id = $firstField.attr("id");
      if (id && !$labelEl.attr("for")) {
        $labelEl.attr("for", id);
      }
    }
    return $labelEl;
  }

  // 新しいULを作成（id/classを引き継ぐ）
  var $ul = $("<ul/>", {
    id: $table.attr("id"),
    class: (($table.attr("class") || "") + " inquiry_list form_ul").trim(),
  });

  // tr列挙（tbodyの有無どちらも対応）
  var $rows = $table.find("> tr, > tbody > tr");

  $rows.each(function () {
    var $tr = $(this);
    var $th = $tr.find("> th");
    var $td = $tr.find("> td");

    // li を生成（元の tr クラスを引き継ぎ、.form_ul_li を追加）
    var liClass = (($tr.attr("class") || "") + " form_ul_li").trim();
    var $li = $("<li/>", { class: liClass });

    // ご住所の内側tableも ul/li に変換
    // .responsive > table.table がある場合は個別に処理
    var $innerTable = $td.find("> .responsive > table.table");
    if ($innerTable.length) {
      var $addrUl = $('<ul class="address-list"/>');
      var $addrRows = $innerTable.find("> tbody > tr, > tr");

      $addrRows.each(function () {
        var $ar = $(this);
        var $t0 = $ar.find("> td").eq(0);
        var $t1 = $ar.find("> td").eq(1);

        var $addrLi = $('<li class="address-item"/>');
        // 左TDは label 化、右TDは中身をそのまま移動
        var $addrLabel = buildLabelFromPair($t0, $t1);
        $addrLi.append($addrLabel, $t1.contents());
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

      // 見出し（th）は label に変換して li に追加
      if ($th.length) {
        var $label = buildLabelFromPair($th, $td);
        $li.append($label);
      }
      $li.append($responsiveWrap);
    } else {
      // 通常の行: th は label に変換、td は中身をそのまま移動
      if ($th.length) {
        var $label2 = buildLabelFromPair($th, $td);
        $li.append($label2);
      }
      if ($td.length) $li.append($td.contents());
    }
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
