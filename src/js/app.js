/**
 * Project Name: ha-cunkute
 * Description: Home Assistant with WebSocket by Keite Tran
 * Creator: Tran Ngoc Anh - VietVbb Team (Keite)
 * Email: mr.ngocanhtran.com@gmail.com
 * HomePage: https://facebook.com/mr.ngocanhtran
 */


var app = (function () {
  "use strict";
  var res = {};
  res.getParam = function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
  };
  res.log = function (msg) {
    if (config.debug) {
      console.log('App log:', msg);
    }
  };

  res.error = function (msg) {
    if (config.debug) {
      console.error('App error:', msg);
    }
  };

  //暗号化
  res.encryption = function (str) {
    var target = encodeURIComponent(str);
    var key = encodeURIComponent(config.passphrase);
    var encrypted = CryptoJS.AES.encrypt(target, key);
    var encryptedstr = encrypted.toString();
    return encryptedstr;
  };

  //復号化
  res.decryption = function (str) {
    var key = encodeURIComponent(config.passphrase);
    var decrypted = CryptoJS.AES.decrypt(str, key);
    var decryptedstr = decrypted.toString(CryptoJS.enc.Utf8);
    decryptedstr = decodeURIComponent(decryptedstr);
    return decryptedstr;
  };


  // Set Switch Button State
  // -------------------------------------
  res.setSwitchBtnState = function (that, status) {
    if (that.length <= 0) return;

    if (status === config.const.on) {
      return that.prop('checked', true);
    }
    return that.prop('checked', false);
  };


  // Get Switch Button State
  // -------------------------------------
  res.getSwitchBtnState = function (that) {
    if (that.is(':checked')) {
      return config.const.on;
    }
    return config.const.off;
  };


  // Disable panel
  // -------------------------------------
  res.grayPanel = function (that, show) {
    if (!show) {
      that.find('.grayPanel').addClass('hidden');
    } else {
      that.find('.grayPanel').removeClass('hidden');
      that.find('.grayPanel .alert').html('Thiết bị đang tắt, hãy bật thiết bị để thiết lập cài đặt.');
    }
  };

  // changeLightIconStatus
  // -------------------------------------
  res.changeLightIconStatus = function (that, status) {
    if (status === config.const.on) {
      return that.find('img').attr('src', 'assets/svg/lamp-on.svg');
    }
    return that.find('img').attr('src', 'assets/svg/lamp-off.svg');
  };

  /*
   * Create random string
   * @returns {String}
   */
  res.makeRandomString = function (numchar) {
    if (numchar == null) numchar = 5;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var text = "";
    for (var i = 0; i < numchar; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  res.makeRandomNumber = function (numchar) {
    if (numchar == null) numchar = 5;
    var possible = "0123456789";
    var text = "";
    for (var i = 0; i < numchar; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  res.loginModal = function (state) {
    if (state) {
      $('login-modal').modal('show');
    } else {
      $('login-modal').modal('hide');
    }
  };

  /*
   * App loaded
   * @returns {null}
   */
  res.loadReady = function () {
    $('.container-fluid, app-bg').css({
      display: 'block'
    });
    $('loading-modal').css({
      display: 'none'
    });
  };

  /**
   * Add loadding effect for ajax action
   * @param {bool} state show or hide loadding component
   * @param {string} text to loadding
   * @return {null}
   * ------------------------------
   */
  res.loadding = function (state, text) {
    var modal = $('loading-modal');
    modal.find('span.text').text('Loadding..');
    if (state) {
      modal.modal('show');
      if (text !== null) {
        modal.find('span.text').text(text);
      }
    } else {
      modal.modal('hide');
    }
  };

  res.bubbleGroup = function () {
    var bNumber = 30;
    var bGroup = $('.bubble-group');
    for (var i = 0; i <= bNumber; i++) {
      var randX = Math.floor(Math.random() * 214) + 1;
      var randY = Math.floor(Math.random() * 1328) + 1;
      bGroup.find('svg g').append('<ellipse cx="' + randX + '" cy="' + randY + '" opacity=".19999999" rx="8" ry="8"></ellipse>');
    }
  };

  res.navDatetime = function () {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    $('.navDatetime>.time').html(h + ":" + checkNumber(m) + ":" + checkNumber(s));

    var date = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    $('.navDatetime>.day').html(year + "/" + checkNumber(month) + "/" + checkNumber(date));

    var t = setTimeout(res.navDatetime, 500);

    // add zero in front of numbers < 10
    function checkNumber(i) {
      if (i < 10)
        i = "0" + i;
      return i;
    }
  };

  // Modal to center page
  // ------------------------------
  res.modalToCenter = function () {
    var modal = $(this);
    var dialog = modal.find('.modal-dialog');
    modal.css('display', 'block');
    dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
  };

  // Custom confirm alert
  // ------------------------------
  res.confirm = function (text, title, type) {
    var data = {
      title: title,
      text: text,
      type: type,
      showCancelButton: true,
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    };

    if (title == null) {
      data.title = 'Yêu cầu xác nhận!';
    }
    return swal(data);
  };

  res.alert = function (text, title, type) {
    var data = {
      title: title,
      html: text,
      type: type
    };
    if (title == null) {
      data.title = 'Thông báo !';
    }
    return swal(data);
  };


  return res;
})();