/*-------------------------------------

  グローバルナビカレント表示

--------------------------------------*/
$(function(){
  // ディレクトリ名と同じナビゲーションをアクティブに
  let now = location.href.replace(/\?.*$/,"").split('/');//現在のURLを配列で取得
  //let dir = now[3];
  let dir = now[3].replace(".html","");

  let navClass = ".navigation__selector-item.-" + dir;
  $(navClass).addClass("-active");

  // トップの場合
  if(!dir) {
    $(".navigation__selector-item.-top").addClass("-active");
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
// slide
//
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

$(".opening__btn img").on("click", function(){
  $(".opening").hide();
});



//-------------------------------------------
//
// colorbox for other
//
//-------------------------------------------
$(function(){
  $(".other__item a").colorbox({
    rel:'slideshow',
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