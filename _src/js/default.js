/*-------------------------------------

  opening

--------------------------------------*/
function slider() {

  //-------------------------------------------
  // swiper setting
  //-------------------------------------------
  const swiper = new Swiper('.swiper', {
    effect: 'fade',
    fadeEffect: {
      crossFade: false
    },
    slidesPerView: 1,
    grabCursor: false,
    loop: true,
    momentumBounce: false,
    speed: 2000,
    autoplay: {
      delay: 8000
    },
  });


  //-------------------------------------------
  // random slide image
  //-------------------------------------------
  let randoms = []; // 重複チェック用配列

  // スライド写真20枚を選定
  let slideSrc = [
    "day1_other_photo/010_artist_tohr.jpg",
    "day1_other_photo/040_furu.jpg",
    "day1_other_photo/076_tohr.jpg",
    "day1_other_photo/162_artist_hira.jpg",
    "day1_other_photo/189_furu.jpg",
    "day1_other_photo/263_tohr.jpg",
    "day1_other_photo/277_tohr.jpg",
    "day1_other_photo/304_wata.jpg",
    "day1_other_photo/345_artist_hira.jpg",
    "day1_other_photo/423_artist_shim.jpg",
    "day1_other_photo/458_artist_wata.jpg",
    "day1_other_photo/484_kawa.jpg",
    "day2_other_photo/036_artist_hira.jpg",
    "day2_other_photo/160_artist_abek.jpg",
    "day2_other_photo/284_hira.jpg",
    "day2_other_photo/321_artist_wata.jpg",
    "day2_other_photo/675_artist_hira.jpg",
    "day3_other_photo/016_shim.jpg",
    "day3_other_photo/084_hira.jpg",
    "day3_other_photo/432_artist_abek.jpg",
    "day3_other_photo/704_artist_wata.jpg",
    "day3_other_photo/735_artist_hira.jpg",
    "day3_other_photo/794_artist_hira.jpg",
    "day3_other_photo/865_artist_abek.jpg",
    "day3_other_photo/875_furu.jpg"
  ];

  let min = 0, max = slideSrc.length; // 最小値と最大値

  // 重複チェックしながらスライドを7枚設定
  for(i = min; i <= 7; i++){
    while(true){
      let tmp = intRandom(min, max);
      if(!randoms.includes(tmp)){
        randoms.push(tmp);
        //swiper.appendSlide('<div class="swiper-slide slide__item"><img src="images/slide/' + tmp + '.jpg" alt=""></div>');
        swiper.appendSlide('<div class="swiper-slide slide__item"><img src="images/' + slideSrc[tmp] + '" alt=""></div>');
        break;
      }
    }

  }
  console.log(randoms);
}

// min以上max以下の整数値の乱数を返す
function intRandom(min, max){
  //let num = Math.floor( Math.random() * (max - min + 1)) + min;
  let num = Math.floor( Math.random() * max);
  //return ( '000' + num ).slice( -3 );
  return num;
}


// 全体ロード後、ローディングを外す
$(window).on("load",function(e){
  $(".loading").addClass("-sliderstart");

  // cookieが有効であればオープニングスライドを飛ばす
  if($.cookie('ringo2022pg') == 'visit') {
    $(".opening").hide();
  } else {
    $(".opening").show();
    slider();
  }
  //$(".opening").show();
  //slider();
});

//console.log(randoms);


//-------------------------------------------
// move page
//-------------------------------------------
$(".opening__btn img").on("click", function(){
  $(".opening").slideUp(800,"easeOutExpo");

  // Cookie追加
  if($.cookie('ringo2022pg') != 'visit') {
    let date = new Date();
    date.setTime(date.getTime() + (60 * 60 * 1000)); //1時間
    $.cookie('ringo2022pg', 'visit', { expires: date });
  }
});


/*-------------------------------------

  グローバルナビカレント表示

--------------------------------------*/
$(function(){
  // ディレクトリ名と同じナビゲーションをアクティブに
  let now = location.href.replace(/\?.*$/,"").split('/');//現在のURLを配列で取得
  //let dir = now[3];
  let dir = now[3].replace(".html","");

  let navClass = ".navigation__selector-item.-" + dir;
  let subnavClass = ".date__item.-" + dir;
  $(navClass).addClass("-active");
  $(subnavClass).addClass("-active");

  //$(subnavClass).addClass("-active");

  // トップの場合
  if(!dir) {
    $(".navigation__selector-item.-top, .date__item.-top").addClass("-active");
  }
});


//-------------------------------------------
//
// navigation
//
//-------------------------------------------
$(".navigation__hum, .navigaton__container a").on("click", function(){
  $(".navigation").toggleClass("is-open");
});


//-------------------------------------------
//
// filter
//
//-------------------------------------------
let widget = document.getElementById('js-filter');
let checkboxes = widget.querySelectorAll('.selector__item input[type="checkbox"]');
let checkedList = [];
let i = 0;
let leng = 0;
let filter = function () {
  checkedList = [];

  i = 0;
  leng = checkboxes.length;

  for (i; i < leng; i++) {
    if (checkboxes[i].checked) {
      checkedList.push(checkboxes[i].value);
    }
  }

  widget.setAttribute('data-filter-view', checkedList.join(' '));
};


i = 0;
leng = checkboxes.length;

for (i; i < leng; i++) {
  checkboxes[i].addEventListener('change', filter);
}



//-------------------------------------------
//
// フィルターされた時にcolorboxの写真グループを変更する
//
//-------------------------------------------
$("input").on("click",function(e){

  if($(this).prop('checked')){

    let val = $(this).val();
    $(':not(input[value="' + val + '"])').prop('checked',false);
    $('.other__item[data-tag="' + val + '"] a').attr("rel",val);

  } else {

    $('.other__item a').attr("rel","slideshow");

  }

});





//-------------------------------------------
//
// colorbox for other
//
//-------------------------------------------
$(function(){
  $(".other__item a").colorbox({
    //rel:'slideshow',
    transition: "fade",
    height:"90%",
    maxWidth:"95%",
    opacity:"0.95",
    fixed: true,
    returnFocus: true,
    scrolling: false,
    reposition: true,
    slideshow: true,
    slideshowSpeed: 6000
  });
});




/*-------------------------------------

  要素が見えた時にイベント発火

--------------------------------------*/
(function(w, d){
  if("IntersectionObserver" in w) {
    const boxes = document.querySelectorAll(".anim");
    const options = {
      root: null, // 今回はビューポートをルート要素とする
      rootMargin: "-25% 0px", // ビューポートの判定基準を調整
      threshold: 0 // 閾値
    };
    const observer = new IntersectionObserver(doWhenIntersect, options);

    // それぞれのboxを監視
    boxes.forEach(function(box) {
      observer.observe(box);
    });

    function doWhenIntersect(entries) {
      // 交差検知をしたもののなかで、isIntersectingがtrueのDOMにクラス付与
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-show");
        }
      });

    }
  }
}(window, document));