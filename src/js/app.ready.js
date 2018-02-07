/**
 * Project Name: ha-cunkute
 * Description: Home Assistant with WebSocket by Keite Tran
 * Creator: Tran Ngoc Anh - VietVbb Team (Keite)
 * Email: mr.ngocanhtran.com@gmail.com
 * HomePage: https://facebook.com/mr.ngocanhtran
 */

(function () {
  "use strict";
  $(document).ready(function () {

    // App load ready
    // ------------------------------
    app.loadReady(true);

    // feather icon setting
    feather.replace();

    // navbar time 
    app.navDatetime();

    // Run only with web app mode  
    if (("standalone" in window.navigator) && window.navigator.standalone === true) {
      // Add ios status bar
      $('body').addClass('iosShowStatusBar').prepend('<div class="iosStatusBar"></div>');

      // Rewrite redirect method woth javascript
      $(document).on("click", "a", function (e) {
        e.preventDefault();
        if ($(this).data("toggle") === 'modal') return;

        var href = $(this).attr("href");
        if (href != 'javascript:;') {
          window.location.href = href;
          return;
        }
      });
    }

    // Bootstrap tooltip setup
    // ------------------------------
    $('[data-toggle="ctooltip"]').tooltip({
      template: '<div class="tooltip custom" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
      placement: 'bottom'
    });

    // Bootstrap modal setup
    // ------------------------------
    $('loading-modal, login-modal, aircon-modal').modal({
      keyboard: false,
      backdrop: 'static',
      show: false
    });


    // Pull to refresh setup
    // Added custom trigger: onRelease, onPreRefresh
    // ------------------------------
    PullToRefresh.init({
      distReload: 60,
      classPrefix: 'app-top-',
      iconArrow: '&#8675;',
      iconRefreshing: '&hellip;',
      instructionsPullToRefresh: 'Pull down to refresh',
      instructionsReleaseToRefresh: 'Release to refresh',
      instructionsRefreshing: 'Refreshing..',
      refreshTimeout: 1000,
      getStyles: function () {
        return ".__PREFIX__ptr{box-shadow: inset 0 -3px 5px rgba(0, 0, 0, 0.12); pointer-events: none; font-size: 0.85em; font-weight: bold; top: 0; height: 0; transition: height 0.3s, min-height 0.3s; text-align: center; width: 100%; overflow: hidden; display: flex; align-items: flex-end; align-content: stretch;}.__PREFIX__box{padding: 0px; flex-basis: 100%;}.__PREFIX__pull{transition: none;}.__PREFIX__text{color: rgba(0, 0, 0, 0.3);}.__PREFIX__icon{color: rgba(0, 0, 0, 0.3); transition: transform .3s;}.__PREFIX__top{touch-action: pan-x pan-down pinch-zoom;}.__PREFIX__release .__PREFIX__icon{transform: rotate(180deg);}";
      },
      onRefresh: function () {
        window.location.reload();
      },
      onPreRefresh: function () {
        $('.modal').modal('hide');
        res.loadding(true);
      }
    });


  });
})();