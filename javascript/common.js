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

  function setMainOffsetTop() {
    var headerInnerHeight = $(".header__inner").outerHeight() || 0;
    var headerSubHeight = $(".header_sub__inner").outerHeight() || 0;
    var total = headerInnerHeight + headerSubHeight + "px";
    var $main = $(".main");
    if ($main.length) {
      $main.css({
        "padding-top": total,
        "margin-top": "",
      });

      // On PC (not SP), also apply the same padding to .main_movieParagraph_wrap
      var isSp =
        window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
      if (!isSp) {
        var $movieParagraphWrap = $(".main_movieParagraph_wrap");
        if ($movieParagraphWrap.length) {
          $movieParagraphWrap.css({
            "padding-top": total,
          });
        }
      }
    }
  }

  setMainOffsetTop();
  $(window).on("load resize", setMainOffsetTop);
  // Watch for .is-move on .main_heading_wrap and toggle .is-visible on .main_movieParagraph_wrap
  (function () {
    var $heading = $(".main_heading_wrap");
    var $movieParagraph = $(".main_movieParagraph_wrap");
    if (!$heading.length || !$movieParagraph.length) return;
    var headingEl = $heading.get(0);

    // Use MutationObserver to detect class changes
    try {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class"
          ) {
            var hasMove = mutation.target.classList.contains("is-move");
            var insideTop =
              mutation.target.closest && mutation.target.closest(".top_page");
            if (insideTop) {
              if (hasMove) {
                $movieParagraph.addClass("is-visible");
              } else {
                $movieParagraph.removeClass("is-visible");
              }
            }
          }
        });
      });

      observer.observe($heading.get(0), {
        attributes: true,
        attributeFilter: ["class"],
      });
    } catch (e) {
      // Fallback for very old browsers: poll every 200ms
      var prevHas =
        headingEl &&
        headingEl.classList &&
        headingEl.classList.contains("is-move");
      setInterval(function () {
        if (!headingEl) return;
        var nowHas = headingEl.classList.contains("is-move");
        if (nowHas !== prevHas) {
          var insideTop = headingEl.closest && headingEl.closest(".top_page");
          if (nowHas && insideTop) $movieParagraph.addClass("is-visible");
          else $movieParagraph.removeClass("is-visible");
          prevHas = nowHas;
        }
      }, 200);
    }
  })();
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

// メニュー（ハンバーガー）トグル: モバイル表示のみで動作させる
(function () {
  var MOBILE_QUERY = "(max-width: 768px)";
  var bodyLockPos = 0;

  // 実際のトグル処理（namespace付きイベントを使う）
  function toggleMenuHandler(e) {
    e.preventDefault();
    $("#g_menu_btn, .g_nav").toggleClass("active");

    if ($("#g_menu_btn, .g_nav").hasClass("active")) {
      bodyLockPos = $(window).scrollTop();
      // body を固定（既存の振る舞いを保持）
      function bodyLockFn() {
        $("body").addClass("bodyLock").css({ top: -bodyLockPos });
      }
      // 少し遅延して bodyLock を適用
      setTimeout(bodyLockFn, 500);
    } else {
      // bodyLock を解除して元の位置に戻す
      $("body").removeClass("bodyLock").css({ top: 0 });
      window.scrollTo(0, bodyLockPos);
    }
  }

  // バインド／アンバインド制御
  function bindIfMobile() {
    var isMobile = window.matchMedia && window.matchMedia(MOBILE_QUERY).matches;
    // 名前空間付きで安全に管理
    $("#g_menu_btn, .g_nav__inner").off("click.menuToggle");
    if (isMobile) {
      $("#g_menu_btn, .g_nav__inner").on("click.menuToggle", toggleMenuHandler);
    }
  }

  // 初期とリサイズ時に判定（リサイズはデバウンス）
  var resizeTimer = null;
  $(window).on("load resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(bindIfMobile, 150);
  });

  // DOM ready 時にも判定
  bindIfMobile();
})();

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
  // 動的に .main_heading_wrap の transition-delay + transition-duration を計算して
  // その長さ（要素の現在のトランジションが終わるまでの時間）を待ってから
  // is-playing / is-move の付与と動画再生を行う
  (function () {
    // id="youtube-player" を持つiframe要素を取得（存在しなくても mainHeading の計算は行う）
    var player = document.getElementById("youtube-player");
    var videoBg = player ? player.closest(".video-bg") : null;
    var mainHeading = document.querySelector(".main_heading_wrap");

    function parseTimeList(s) {
      if (!s) return [0];
      return s.split(",").map(function (v) {
        v = v.trim();
        if (v.indexOf("ms") > -1) return parseFloat(v);
        if (v.indexOf("s") > -1) return parseFloat(v) * 1000;
        var n = parseFloat(v);
        return isNaN(n) ? 0 : n;
      });
    }

    var waitMs = 0;
    if (mainHeading) {
      // helper to compute max delay+duration for a computed-style string pair
      function computeMaxFromStyles(durationStr, delayStr) {
        var durations = parseTimeList(durationStr);
        var delays = parseTimeList(delayStr);
        var max = 0;
        for (var i = 0; i < durations.length; i++) {
          var d = durations[i] || 0;
          var delay = delays[i] || delays[delays.length - 1] || 0;
          var tot = d + delay;
          if (tot > max) max = tot;
        }
        return max;
      }

      // main element
      var cs = window.getComputedStyle(mainHeading);
      waitMs = Math.max(
        waitMs,
        computeMaxFromStyles(
          cs.transitionDuration || "",
          cs.transitionDelay || ""
        )
      );

      // ::before and ::after (some styles may be on pseudo-elements)
      try {
        var csBefore = window.getComputedStyle(mainHeading, "::before");
        if (csBefore) {
          waitMs = Math.max(
            waitMs,
            computeMaxFromStyles(
              csBefore.transitionDuration || "",
              csBefore.transitionDelay || ""
            )
          );
        }
      } catch (ignore) {}

      try {
        var csAfter = window.getComputedStyle(mainHeading, "::after");
        if (csAfter) {
          waitMs = Math.max(
            waitMs,
            computeMaxFromStyles(
              csAfter.transitionDuration || "",
              csAfter.transitionDelay || ""
            )
          );
        }
      } catch (ignore) {}
    }

    // 任意の固定待機時間に変更: 6秒
    var scheduleMs = 6000;

    setTimeout(function () {
      // At schedule: send play command to the iframe and wait for a play confirmation
      // from the YouTube iframe (onStateChange with info=1). Only when we get that
      // confirmation we add `.is-playing` so the poster does not fade out before playback.
      var playConfirmed = false;

      function handleMessage(ev) {
        var data = ev.data;
        try {
          if (typeof data === "string") data = JSON.parse(data);
        } catch (ignore) {
          return;
        }
        if (!data || typeof data !== "object") return;
        // YouTube posts messages with event:'onStateChange' and info: <state>
        var isState =
          data.event === "onStateChange" || data.event === "onStateChange";
        var info =
          data.info !== undefined
            ? data.info
            : data.data !== undefined
            ? data.data
            : null;
        if (isState && info === 1) {
          playConfirmed = true;
          if (videoBg && !videoBg.classList.contains("is-playing")) {
            videoBg.classList.add("is-playing");
          }
          window.removeEventListener("message", handleMessage);
        }
      }

      // Listen for postMessage events from iframe
      window.addEventListener("message", handleMessage, false);

      // Send play command (if available)
      if (player && player.contentWindow) {
        player.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*"
        );
      }

      // Fallback: if no confirmation arrives within 3000ms, show video anyway
      setTimeout(function () {
        if (!playConfirmed) {
          if (videoBg && !videoBg.classList.contains("is-playing")) {
            videoBg.classList.add("is-playing");
          }
          window.removeEventListener("message", handleMessage);
        }
      }, 3000);

      // 計算した待ち時間の後に .is-move を付与する（従来通り）
      if (mainHeading && !mainHeading.classList.contains("is-move")) {
        mainHeading.classList.add("is-move");
      }
    }, scheduleMs);
  })();
});

// Lazy-load background images for elements with data-bg (uses IntersectionObserver)
(function () {
  function loadBg(el) {
    var bg = el.getAttribute("data-bg");
    if (!bg) return;
    el.style.backgroundImage = "url(" + bg + ")";
    el.removeAttribute("data-bg");
  }

  function initLazyBg() {
    var els = document.querySelectorAll("[data-bg]");
    if (els.length === 0) return;

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              loadBg(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: "200px 0px", threshold: 0.01 }
      );

      els.forEach(function (el) {
        io.observe(el);
      });
    } else {
      // Fallback: load all immediately
      els.forEach(function (el) {
        loadBg(el);
      });
    }
  }

  // Run on DOMContentLoaded so elements present in HTML are found
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLazyBg);
  } else {
    initLazyBg();
  }
})();
