function findMusic(){var e;subgenre=MusicFinder.searchTerm(genres),e=MusicFinder.searchTerm(subgenre),MusicFinder.getSounds(e)}function chngBtnTxt(){var e=words[MusicFinder.rand(words.length)];$("#getMusic").html(e)}var clientID="2ae6429035b560609550a45b7b8e7ebc";!function(){function e(){for(var e=0,t=0;t<genres.length;t++)for(var r=0;r<genres[t].length;r++)e++;console.log("Total search terms: "+e)}SC.initialize({client_id:clientID,redirect_uri:"http://localhost:3000/callback.html"}),e()}(),$("#getMusic").click(findMusic);var MusicFinder=function(){return{rand:function(e){return e-=1,Math.round(Math.random()*e)},searchTerm:function(e){return e[this.rand(e.length)]},getSounds:function(e){console.log(e),UI.removeError(),UI.addLoader();var t=200;music=document.getElementById("music"),music.pause(),SC.get("/tracks",{q:e,kind:"track",limit:t,linked_partitioning:1}).then(function(t){var r,i,n;r=t.collection.length,i=MusicFinder.rand(r),n=t.collection[i],UI.update(n,e)}).catch(function(e){console.error(e),UI.setError()})}}}(),UI=function(){return{track:"",query:"",update:function(e,t){track=e,query=t,this.loadPic(),this.setTitle(),this.setArtist(),this.setGenre(),this.loadMusic(),this.createLikeButton(),this.removeLoader()},loadPic:function(){var e;track.artwork_url?e=track.artwork_url:track.user.avatar_url?e=track.user.avatar_url:console.log("No image");var t="<img id='albumart' src='"+e+"' width='100%' height='100%' onerror='UI.get404pic()' />";$("#image").fadeOut(400,function(){$("#image").html(t).fadeIn(400)})},setTitle:function(){var e="<a href='"+track.permalink_url+"' target='_blank'>"+track.title+"</a>";$("#song-text h1").fadeOut(200,function(){$("#song-text h1").html(e).fadeIn(300)});var t="<img href='"+track.permalink_url+"' src='public/images/soundcloud.png' />";$("#song-icon").fadeOut(300).html(t).fadeIn()},setArtist:function(){var e="<a href='"+track.user.permalink_url+"' target='_blank'>"+track.user.username+"</a>";$("#artist-name").fadeOut(450,function(){$("#artist-name").html(e).fadeIn(350)})},setGenre:function(){var e;e=track.genre?"#"+track.genre:"#"+query,$("#info h3").fadeOut(500,function(){$("#info h3").html(e).fadeIn(400)})},loadMusic:function(){var e=track.stream_url+"?client_id="+clientID,t="<source id='source' src='"+e+"' />",r=document.getElementById("music");$("#music").empty(),$("#music").html(t),document.getElementById("progress-bar").style.width="0%",r.load(),r.play(),$("#playpause").html('<i class="fa fa-pause"></i>')},createLikeButton:function(){$("#like").empty();var e='<i id="'+track.id+'" onclick=UI.likeThis(this) class="fa fa-heart" aria-hidden="true"></i>';$("#like").html(e)},likeThis:function(e){$(e).addClass("liked"),SC.connect().then(function(){SC.put("/me/favorites/"+e.id)})},setError:function(){$("#load-error").empty();var e="<h1>Something went wrong, try again in a second.</h1";$("#load-error").html(e)},removeError:function(){$("#load-error").empty()},addLoader:function(){$("#getMusic").empty();var e="<div class='spinner'><div class='rect1'></div><div class='rect2'></div><div class='rect3'></div><div class='rect4'></div><div class='rect5'></div></div>";$("#getMusic").html(e)},removeLoader:function(){$("#getMusic .spinner").fadeOut(200,function(){$("#getMusic").empty(),chngBtnTxt()})},get404pic:function(){$("#albumart").attr("src","public/images/pic.jpg")}}}(),Player=function(){var e=document.getElementById("playhead"),t=document.getElementById("progress-area"),r=t.offsetWidth-e.offsetWidth;return t.addEventListener("click",function(e){music.currentTime=music.duration*Player.clickPercent(e)},!1),{music:document.getElementById("music"),updateState:function(){var e=music.currentTime/music.duration*100;e=Math.round(10*e)/10,document.getElementById("progress-bar").style.width=e+"%"},playMusic:function(){var e=$("#playpause");music.paused?(music.play(),e.html('<i class="fa fa-pause"></i>')):(music.pause(),e.html('<i class="fa fa-play"></i>'))},clickPercent:function(e){return(e.pageX-t.offsetLeft)/r},moveplayhead:function(i){var n=i.pageX-t.offsetLeft;n>=0&&n<=r&&(e.style.marginLeft=n+"px"),n<0&&(e.style.marginLeft="0px"),n>r&&(e.style.marginLeft=r+"px")}}}();