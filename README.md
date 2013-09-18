peep.carousel
---

**1.設置**

Zeptoとpeep.carouselのJS、CSSファイルを読み込む。

```
<link rel="stylesheet" type="text/css" href="peep.carousel/peep.carousel.css">
<script type="text/javascript" src="http://zeptojs.com/zepto.min.js"></script>
<script type="text/javascript" src="peep.carousel/peep.carousel.js"></script>
```

**2.HTMLコーディング**

カルーセルを`div`で囲み、クラスに`peep-carousel`、idに任意のIDを振る。

```
<div id="peep1" class="peep-carousel">
    <ul>
        <li><img src="img/sample01.jpg" width="94" height="94"></li>
        <li><img src="img/sample02.jpg" width="94" height="94"></li>
        <li><img src="img/sample03.jpg" width="94" height="94"></li>
        <li><img src="img/sample03.jpg" width="94" height="94"></li>
        .
        .
        .
    </ul>
</div>
```

**3.プラグイン呼び込み**

任意のIDを指定してpeep.carouselを呼び込む。

```
<script type="text/javascript">
$(function() {
    $('#peep1').peepCarousel();
});
</script>
```
