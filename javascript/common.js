$(function () {
  var pos = 0;
  var footFixed = $(".foot_fixed_block_wrap");
  // var contactFixed = $(".contact_fixed_block");
  var contactFixedH = $(".contact_fixed_block").height();

  $(window).on("scroll", function () {
    if ($(this).scrollTop() < pos) {
      //上にスクロールしたとき
      footFixed.removeClass("hide");
      footFixed.css("bottom", "0");
    } else if ($(this).scrollTop() < 100) {
      footFixed.removeClass("hide");
      footFixed.css("bottom", "0");
    } else {
      //下にスクロールしたとき
      footFixed.addClass("hide");
      footFixed.css("bottom", -contactFixedH + "px");
    }
    pos = $(this).scrollTop();
  });
});

// footer に .foot_fixed_block_wrap の高さ分の padding-bottom を追加（スマホ時）
(function () {
  function updateFooterPadding() {
    var $source = $(".header_sub");
    var $target = $(".footer_copyright");
    if ($target.length === 0 || $source.length === 0) return;

    var isSp =
      window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
    if (isSp) {
      // visible で高さが 0 の可能性があるため、outerHeight を使用
      var h = $source.outerHeight() || 0;
      $target.css("padding-bottom", h + "px");
    } else {
      $target.css("padding-bottom", "");
    }
  }

  // 実行タイミング: load, resize, DOM ready（画像読み込み等で高さが変わる可能性がある）
  $(window).on("load resize", updateFooterPadding);
  $(document).ready(updateFooterPadding);
})();

$(function () {
  var windowHeight = $(window).height();
  var contentsHeight = $(".container").innerHeight();

  function setMainPaddingTop() {
    var headerInnerHeight = $(".header__inner").outerHeight() || 0;
    var headerSubHeight = $(".header_sub__inner").outerHeight() || 0;
    $(".main").css("padding-top", headerInnerHeight + headerSubHeight + "px");
  }

  setMainPaddingTop();
  $(window).on("load resize", setMainPaddingTop);
  /*
  // brand_pattern をページと一緒にスクロールさせる（fixed にしない）
  function updateBrandPattern() {
    var $bp = $(".brand_pattern");
    // コンテナの高さ（コンテンツ全体を覆うように）
    var containerH = $(".container").outerHeight() || $(document).height();
    $bp.appendTo(".container").css({
      position: "absolute", // fixed ではなく absolute にしてページと一緒に移動
      top: 0,
      left: 0,
      width: "100%",
      height: containerH + "px",
      "z-index": -1,
      "pointer-events": "none",
      "background-repeat": "repeat",
      "background-position": "center",
      "background-size": "auto",
    });
  }

  // 初期とウィンドウ変更時に更新（画像ロードで高さが変わる場合は load でも）
  updateBrandPattern();
  $(window).on("load resize", updateBrandPattern);
  */
});

$("#g_menu_btn, .g_nav__inner").on("click", function () {
  $("#g_menu_btn, .g_nav").toggleClass("active");

  if ($("#g_menu_btn, .g_nav").hasClass("active")) {
    bodyLockPos = $(window).scrollTop();
    console.log(bodyLockPos);
    function bodyLockFn() {
      $("body").addClass("bodyLock").css(
        {
          top: -bodyLockPos,
        },
        5000
      );
    }
    setTimeout(bodyLockFn, 500);
  } else {
    $("body").removeClass("bodyLock").css({
      top: 0,
    });
    window.scrollTo(0, bodyLockPos);
  }
});

// 変更: アンカークリックとハッシュ遷移の滑らかスクロールを即時ジャンプに変更
$(function () {
  // クリック時の挙動（SP/PCのオフセット対応は既存ロジックを使用）
  $(document).on("click", 'a[href^="#"]', function (e) {
    e.preventDefault();
    var href = $(this).attr("href");
    var target = $(href);
    if (!target.length) return false;

    // SPかPCかでオフセット計算
    function isMobile() {
      return window.matchMedia("(max-width: 768px)").matches;
    }
    var headerHeight = $("header").outerHeight() || 0;
    var logoHeight = $(".a1_logo").outerHeight() || 0;
    var mobileOffset = headerHeight + logoHeight + 20;
    var pcOffset =
      ($(".header__inner").outerHeight() || 0) +
      ($(".header_sub__inner").outerHeight() || 0);
    var offset = isMobile() ? mobileOffset : pcOffset;

    // 即時ジャンプ（アニメーションなし）
    var position = target.offset().top - offset;
    $("html, body").scrollTop(position);
    return false;
  });

  // ページロード時のハッシュ処理（即時ジャンプ）
  $(function () {
    var urlHash = location.hash;
    if (urlHash) {
      var target = $(urlHash);
      if (target.length) {
        var headerHeight = $("header").outerHeight() || 0;
        var logoHeight = $(".a1_logo").outerHeight() || 0;
        var mobileOffset = headerHeight + logoHeight + 20;
        var pcOffset =
          ($(".header__inner").outerHeight() || 0) +
          ($(".header_sub__inner").outerHeight() || 0);
        var offset = window.matchMedia("(max-width: 768px)").matches
          ? mobileOffset
          : pcOffset;
        var position = target.offset().top - offset;
        $("html, body").scrollTop(position);
      }
    }
  });
});

// ページのすべてのリソース（画像など）の読み込みが完了したときに実行
window.addEventListener("load", function () {
  // 1秒（1000ミリ秒）後に動画を再生する
  setTimeout(function () {
    // id="youtube-player" を持つiframe要素を取得
    var player = document.getElementById("youtube-player");

    // プレーヤー要素が存在し、コンテンツウィンドウにアクセスできる場合
    if (player && player.contentWindow) {
      var videoBg = player.closest(".video-bg");
      if (videoBg) {
        // is-playingクラスを付与して、CSSで表示を切り替える
        videoBg.classList.add("is-playing");
      }
      // YouTube IFrame Player APIの再生コマンドを送信して動画を再生
      player.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
    }
  }, 3000); // 1秒後に実行
});
