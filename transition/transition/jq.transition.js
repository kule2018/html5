/**
 * jq.transition.js
 * 扩展为jq的插件
 * types = ['te-flip1', 'te-flip2', 'te-flip3', 'te-flip4',
 'te-rotation1', 'te-rotation2', 'te-rotation3', 'te-rotation4', 'te-rotation5',
 'te-multiflip1', 'te-multiflip2', 'te-multiflip3',
 'te-cube1', 'te-cube2', 'te-cube3', 'te-cube4',
 'te-unfold1', 'te-unfold2'],
 */

(function ($) {
    $.fn.transition = function (options) {
        $.fn.transition.deflunt = {
            type: 'te-cube'
        };

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.transition.deflunt, options);

            //初始化html
            var $teWrapper = $(this),
                imgSrcs = opts.imgSrcs,
                currentIndex = 0,
                optsType = opts.type,
                type,
                html = '<div class="te-cover">\
                        <img src="' + imgSrcs[currentIndex] + '" />\
                    </div>\
                    <div class="te-transition">';

            switch (optsType) {
                case 'te-cube':
                {
                    html += '<div class="te-cube-front te-cube-face te-front"></div>\
                        <div class="te-cube-top te-cube-face te-back"></div>\
                        <div class="te-cube-bottom te-cube-face te-back"></div>\
                        <div class="te-cube-right te-cube-face te-back"></div>\
                        <div class="te-cube-left te-cube-face te-back"></div>';
                    break;
                }
                case 'te-flip':
                {
                    html += '<div class="te-card">\
							<div class="te-front"></div>\
							<div class="te-back"></div>\
						</div>';
                    break;
                }
            }

            html += '</div>';
            $teWrapper.html(html);

            //定义变量
            var $teCover = $teWrapper.find('div.te-cover'),
                $teTransition = $teWrapper.find('.te-transition'),
                imgCount = imgSrcs.length,
                isAnimating = false,

            //初始化函数
                init = function () {
                    $teWrapper.swipeListener({
                        vthreshold: 30,
                        hthreshold: 50,
                        callBack: function (dir) {
                            if (dir.left) {
                                type = optsType + '3';
                                showNext(1);
                            }
                            else if (dir.right) {
                                type = optsType + '4';
                                showNext(-1);
                            }
                            else if (dir.up) {
                                type = optsType + '2';
                                showNext(1);
                            }
                            else if (dir.down) {
                                type = optsType + '1';
                                showNext(-1);
                            }
                        }
                    });

                    $teWrapper.on('webkitAnimationStart', function (e) {
                        isAnimating = true;
                    }).on('webkitAnimationEnd', function (e) {
                        $teCover.removeClass('te-hide');
                        $teWrapper.removeClass('te-perspective');
                        $teTransition.removeClass('te-show');
                        isAnimating = false;
                    });

                },

                showNext = function (flag) {
                    //当前动画未结束,禁止进行下一个动画
                    if (isAnimating) {
                        return;
                    }
                    $teWrapper.addClass('te-perspective');
                    $teTransition.removeClass().addClass('te-transition').addClass(type).addClass('te-show');
                    $teCover.addClass('te-hide');
                    updateImages(flag);
                },

                updateImages = function (flag) {

                    var $back = $teTransition.find('div.te-back'),
                        $front = $teTransition.find('div.te-front'),
                        backImg,
                        currentImg,
                        frontImg;

                    if (flag === 1) {
                        if (currentIndex++ === imgCount - 1) {
                            currentIndex = 0;
                        }

                        backImg = currentImg = imgSrcs[currentIndex];
                        frontImg = currentIndex == 0 ? imgSrcs[imgCount - 1] : imgSrcs[currentIndex - 1];
                    }
                    else if (flag === -1) {
                        if (currentIndex-- === 0) {
                            currentIndex = imgCount - 1;
                        }

                        backImg = currentImg = imgSrcs[currentIndex];
                        frontImg = currentIndex == imgCount - 1 ? imgSrcs[0] : imgSrcs[currentIndex + 1];
                    }

                    $back.html('<img src="' + backImg + '"/>');
                    $front.html('<img src="' + frontImg + '"/>');

                    $teCover.find('img').attr('src', currentImg);

                };

            //初始化
            init();
        });
    }
})($);