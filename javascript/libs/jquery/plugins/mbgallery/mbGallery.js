/*
 *         developed by Matteo Bicocchi on JQuery
 *         © 2002-2009 Open Lab srl, Matteo Bicocchi
 *			    www.open-lab.com - info@open-lab.com
 *       	version 1.0
 *       	tested on: 	Explorer and FireFox for PC
 *                  		FireFox and Safari for Mac Os X
 *                  		FireFox for Linux
 *         GPL (GPL-LICENSE.txt) licenses.
 */


jQuery.fn.mbGallery = function (NewOptions)
{
    return this.each (function () {
        var galleryId = !this.id ? Math.floor (Math.random () * 100): this.id;
        var gallery = this;

        this.options = {
            galleryWidth : 300,
            galleryHeight : 300,
            galleryMaxWidth : 0,
            galleryColor : "white",
            galleryFrameBorder : 30,
            galleryFrameColor : "white",

            startFrom : 0,
            headerOpacity : 0.5,
            thumbsBorder : 5,
            thumbHeight : 30,
            thumbStripColor : "black",
            thumbStripPos : "right",
						thumbStripWidth:250,
            thumbSelectColor : "black",
            thumbOverColor : "#cccccc",
            imageSelector : ".imgFull",
            thumbnailSelector : ".imgThumb",
            descSelector : ".imgDesc",
						descriptionWidth:300,

            labelColor : "yellow",
            labelColorDisactive:"white",
            labelTextColor : "black",
            labelTextSize : "9px",
            labelHeight : 25,
            iconFolder: "elements/black",
            fadeTime : 300,
            autoSlide : true,
            slideTimer : 100,
            autoSize : true,
            startTimer:0

        }

        $.extend (this.options, NewOptions);
				var opt= this.options;

				opt.thumbsBorder = opt.thumbsBorder + "px solid";
        var thumbSel = {
            thumbSel :
            {
                border : opt.thumbsBorder, borderColor : opt.thumbSelectColor
            },
            thumbUnsel :
            {
                border : opt.thumbsBorder, borderColor : opt.thumbStripColor
            },
            thumbOver :
            {
                border : opt.thumbsBorder, borderColor : opt.thumbOverColor
            }
        }
        $.extend (opt, thumbSel);
        if (opt.slideTimer < 2000)
            opt.slideTimer = 2000;
        var actualImg;
        var actualThumb;
        var thumbUnsel = opt.thumbUnsel;
        var thumbOver = opt.thumbOver;
        $ (this).hide ();

				// GETTING THE ELEMENTS FOR THE GALLERY FROM THE PAGE
        var thumbs = $ (this).find (opt.thumbnailSelector);
        var full = $ (this).find (opt.imageSelector);
        var imgDesc = $ (this).find (opt.descSelector);

        $ (this).empty ();
        if (opt.startFrom == "random")
            opt.startFrom = Math.floor (Math.random () * full.length);

        function preloadImg(i) {
            $ (thumbloading).find ("img").attr ("src", ""+opt.iconFolder+"/loader.gif");
            var IMG_URL = $ (full [i]).attr ("src");
            var IMGOBJ = new Image ();
            IMGOBJ.onload = function ()
            {
                $ (thumbloading).find ("img").attr ("src", ""+opt.iconFolder+"/loaded.gif");
                changePhoto (i);
            };
            IMGOBJ.onerror = function ()
            {
                //alert ("can't load " + IMG_URL)
            };
            IMGOBJ.src = IMG_URL;
        }

        var thumbPos = "";
				var pos;
				function setThumbPos(w) {
            switch (opt.thumbStripPos)
                {
                case "left" :
                    return pos = 0;
                    break;
                case "center" :
                    return pos = ((w / 2) - (opt.thumbStripWidth / 2));
                    break;
                case "right" :
                    return pos = (w - opt.thumbStripWidth);
                    break;
						default:
							return pos = 0;
							break;
						}
				};
        thumbPos = setThumbPos (opt.galleryWidth);

        $ (this).parent().append ("<table cellpadding='0' cellspacing='0' height='"+opt.galleryHeight+"'><tr><td id ='gallery_"+galleryId+"'></td></tr></table>");
        var galleryContainer= $ (this).parent().find('#gallery_'+galleryId);
        $ (galleryContainer).css(
        {
            border : opt.galleryFrameBorder + "px solid " + opt.galleryFrameColor,
						background: opt.galleryColor
				})
        $ (galleryContainer).append(this);

        // CREATE THE GALLERY STRUCTURE FOR FULLSIZE IMAGES
        $ (this).append ("<div class='FullImg'></div>");
        var fullImageArea = $ (this).find (" .FullImg");
			
				// CREATE THE GALLERY STRUCTURE FOR THUMBS IMAGES
        var headerH = opt.labelHeight > 0?opt.labelHeight : opt.galleryFrameBorder;

        $ (this).removeAttr ("title");

        // thumbnail container
        $ (galleryContainer).prepend ("<div class='thumbBox'></div>");
        var thumbBox = $ (galleryContainer).find (" .thumbBox");

        //thumbnail navigator
        $ (thumbBox).prepend ("<div class='header'><table cellpadding='0' cellspacing='0'><td class='thumbWinBtn pointer' ></td><td class='spacer' ></td><td class='slideShow pointer' ></td><td class='spacer' ></td><td class='prev pointer' ></td><td class='next pointer' ></td><td class='spacer' ></td><td class='loader'></td><td class='indexLabel' nowrap></td></div>");
        var header = $ (thumbBox).find (" .header");

        var thumbWinBtn = $ (header).find (".thumbWinBtn");
        $ (thumbWinBtn).append ("<img src='"+opt.iconFolder+"/thumb.gif' class='thumbIco'>");

        var slideShow = $ (header).find (".slideShow");
        $ (slideShow).append ("<img src='"+opt.iconFolder+"/play.gif' class='slideIco'>");

        var thumbloading = $ (header).find (".loader");
        $ (thumbloading).append ("<img src='"+opt.iconFolder+"/loaded.gif'>");

        var spacer = $ (header).find (".spacer");
        $ (spacer).append ("<img src='"+opt.iconFolder+"/separator.gif'>");

        var next = $ (header).find (".next");
        $ (next).append ("<img src='"+opt.iconFolder+"/next.gif'>");

        var prev = $ (header).find (".prev");
        $ (prev).append ("<img src='"+opt.iconFolder+"/prev.gif'>");

        var indexLabel = $ (thumbBox).find (" .indexLabel").html ((opt.startFrom + 1) + ".<b>" + full.length + "</b>");

        //Thumbnails
        $ (thumbBox).append ("<div class='ThumbImg'></div>");
        var thumbImages = $ (thumbBox).find (" .ThumbImg");
        $ (thumbImages).prepend ($ (thumbs));


        $ (thumbBox).append("<div class='descriptionBox'></div>");
        var descriptionBox= $ (galleryContainer).find(".descriptionBox");
        $ (descriptionBox).css(
        {
        	position:"absolute",
        	padding: 10,
        	zIndex:0,
        	opacity: opt.headerOpacity,
            width : opt.thumbStripWidth-20
        })


        $ (this).css (
        {
            width : opt.galleryWidth,
            height : opt.galleryHeight,
            overflow : "hidden"
        });

        $ (thumbs).css (
        {
            width : opt.thumbHeight,
            padding : "0px",
            border: "1px solid "+opt.labelColor,
            cursor : "pointer"
        });

        $ (thumbBox).css (
        {
            textAlign : "left",
            zindex : 1000,
            marginTop : "-" + headerH + "px",
            position : "absolute",
            width : opt.thumbStripWidth + "px",
            marginLeft : thumbPos + "px",
            zIndex:10000
        });

        $ (thumbImages).css (
        {
            opacity :opt.headerOpacity,
            backgroundColor : opt.thumbStripColor,
            border: "2px solid "+ opt.labelColor
        });

        $ (header).css (
        {
            opacity : opt.headerOpacity,
            textAlign : "left",
            color : opt.labelTextColor,
            padding : "0px",
            border : "0px",
            height : headerH
        });

        $ ("td", header).css (
        {
            background : opt.labelColorDisactive,
            padding : "2px",
            paddingRight : "10px",
            height:headerH,
            color : opt.labelTextColor,
            fontFamily : "Verdana, Arial",
            fontSize : opt.labelTextSize
        });

        $ (".pointer").css (
        {
            cursor : "pointer"
        });

        jQuery.fn.extend (
        {
            getW : function () {
                var ow = $ (this).width ();
                if (opt.galleryMaxWidth > 0 && ow > opt.galleryMaxWidth) {
                    $ (this).attr ("width", opt.galleryMaxWidth);
                    ow = opt.galleryMaxWidth;
                }
                return ow;
            }
        });
        function changePhoto (i) {
        	$ (descriptionBox).fadeTo (opt.fadeTime, 0);
            $ (fullImageArea).fadeTo (opt.fadeTime, 0, function () {
                //replacing the image
                $ (this).html (full [i]);
                $(descriptionBox).html(imgDesc[i]);
                //showing the new image
                setTimeout (function () {
                    $ (fullImageArea).fadeTo (opt.fadeTime, 1)
        			$ (descriptionBox).fadeTo (opt.fadeTime, .8);
                }, opt.fadeTime);
                // if autosize option resize the image frame
                if (opt.autoSize) {
                    //if a maxWith is set resize the image width
                    var w = $ (full [i]).getW ();
                    //resize frame
                    $ (gallery).animate (
                    {
                        height : full [i].offsetHeight,
                        width : w
                    }, opt.fadeTime);
                    //if the thumbstrip has no width set the width according ti the frame width
                    if (opt.thumbStripWidth == opt.galleryWidth) {
                        $ (thumbBox).animate (
                        {
                            width : full [i].offsetWidth
                        },
                            opt.fadeTime)
                    } else {
                        // if the thumbstrip has a width reposition it according to the image width
                        var l = setThumbPos ($ (full [i]).width ());
                        $ (thumbBox).animate (
                        {
                            marginLeft : l
                        }, opt.fadeTime);
                    }
                }
            });
            //redefine the indexLabeles
            $ (actualThumb).css (thumbUnsel);
            actualImg = full [i];
            actualThumb = thumbs [i];
            $ (actualThumb).css (opt.thumbSel);
            $ (indexLabel).html (i +1 + ".<b>" + full.length + "</b>");
        }
        thumbs.each (function (i) {
            $ (this).click (function () {
                x = i;
                stopShow ();
                preloadImg (i);
                setTimeout(function(){$ (thumbImages).hide (500);},500)
            })
        })
        $ (this).show ();

        // EVENTS
        var hideTumb, thumbOpen, headerMO;
        $ (thumbWinBtn).click (function () {
            if ( !thumbOpen) {
                $ (thumbImages).show (500);
                thumbOpen = true;
            } else {
                $ (thumbImages).hide (500);
                thumbOpen = false;
            }
            stopShow ();
        })
        $ (fullImageArea).click (function () {
            stopShow ();
        });
        $ (fullImageArea).dblclick (function () {
            startShow ();
        });
        $ (thumbBox).mouseover (function () {
            clearTimeout (hideTumb);
            clearTimeout (headerMO);
            $ ("td", header).css ({opacity :opt.headerOpacity, background: opt.labelColor})
            clearTimeout (closeThumbStrip);
        })

        $ (thumbBox).mouseout (function () {
            headerMO=setTimeout(function(){
                $ ("td", header).css ({opacity :opt.headerOpacity, background: opt.labelColor})
            },100)
            hideTumb = setTimeout (function () {
                $ (thumbImages).hide (500);
                thumbOpen = false;
            }, 1000);
        })
        $ (thumbs).mouseover (function () {
            if (this != actualThumb) {
                $ (this).css (thumbOver)
            }
        })
        $ (thumbs).mouseout (function () {
            if (this != actualThumb) {
                $ (this).css (thumbUnsel)
            }
        });
        $ (slideShow).click (function () {
            startSlide = ! startSlide;
            if (startSlide) {
                startShow ();
            } else
                stopShow ();
        })
        var goOn;
        $ (next).click ( function () {
            stopShow ();
            clearTimeout (goOn);
            x += 1;
            goOn = setTimeout (function () {
                if (x >= full.length) x = 0;
                preloadImg (x);
            }, 200);
        })
        $ (prev).click ( function () {
            stopShow ();
            clearTimeout (goOn);
            x -= 1;
            goOn = setTimeout (function () {
                if (x < 0) x = full.length - 1;
                preloadImg (x);
            }, 200);
        })

        actualImg = full [opt.startFrom];
        $ (thumbs).css (thumbUnsel);
        actualThumb = thumbs [opt.startFrom];
        $ (actualThumb).css (thumbSel);
        var closeThumbStrip = setTimeout (function () {
            $ (thumbImages).hide (500)
        }, 2000);
        var slideShowTimer, x = opt.startFrom, startSlide = opt.autoSlide, startShow = function () {
            $ (slideShow).find ("img").attr ("src", opt.iconFolder+"/stop.gif")
            if (x == full.length)
                x = 0;
            preloadImg (x);
            slideShowTimer = setTimeout (startShow, opt.slideTimer)
            x ++
        };
        function stopShow() {
            clearTimeout (slideShowTimer);
            $ (slideShow).find ("img").attr ("src", opt.iconFolder+"/play.gif");
            startSlide = false;
        }
        if (startSlide) {
            setTimeout (startShow, opt.startTimer);
        } else {
            setTimeout (function () {
                preloadImg (opt.startFrom)
            }, opt.startTimer);
        }
    })
}