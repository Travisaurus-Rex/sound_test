// INITIALIZE SOUNDCLOUD APPLICATION WITH CLIENT ID

var clientID = '2ae6429035b560609550a45b7b8e7ebc';

( function() {


	SC.initialize({

  		client_id: clientID,
  		redirect_uri: 'http://localhost:3000/callback.html'

	});

	
	function counter() {
		var count = 0;

		for ( var i = 0; i < genres.length; i++ ) {

			for ( var j = 0; j < genres[ i ].length; j++ ) {
				count++;
			}
		}
		console.log( 'Total search terms: ' + count );
	}

	counter();

})();

/*
	-----------------------------------
	EVENT LISTENERS / HANDLERS
	-----------------------------------
*/

// CLICK BUTTON, GET MUSIC (PROGRAM STARTS WITH THIS BUTTON)

$( "#getMusic" ).click( findMusic );

/*
	-----------------------------------
	FUNCTIONS
	-----------------------------------
*/

// BEGINS THE PROCESS OF FINDING MUSIC

function findMusic () {

	var genre, query;

	subgenre = MusicFinder.searchTerm( genres );
	query    = MusicFinder.searchTerm( subgenre );
			
	MusicFinder.getSounds( query );

	//chngBtnTxt();

}

// CHANGES TEXT OF BUTTON

function chngBtnTxt () {

	var newText  = words[ MusicFinder.rand( words.length ) ];



	$( '#getMusic' ).html( newText );

}


 
/*
	-----------------------------------
	MODULES
	-----------------------------------
*/

// MODULE FOR SEARCHING/GETTING MUSIC

var MusicFinder = ( function() {

	return {

		rand : function ( n ) {

			n -= 1;
			return Math.round( Math.random() * n );

		},
		
		searchTerm : function ( list ) {

			return list[ this.rand( list.length ) ];

		},

		getSounds  : function ( query ) {

			console.log(query);
			UI.removeError();
			UI.addLoader();

			var page_size = 200;
			music = document.getElementById('music');
			music.pause();

			SC.get('/tracks', {

			  q     : query,	
			  kind  : "track",
			  limit : page_size, 
			  linked_partitioning : 1

			})

			.then ( function( tracks ) {

				var num, rand, track;

				num   = tracks.collection.length,
				rand  = MusicFinder.rand( num ),
				track = tracks.collection[rand];

				UI.update( track, query );
		
			})

			.catch ( function( error ) {

				console.error( error );
				UI.setError();				

			});
		}
	};

})();

// MODULE FOR UPDATING INFORMATION ON THE USER INTERFACE

var UI = ( function() {

	return {

		track: '',
		query: '',

		update: function ( t, q ) {

			track = t;
			query = q;

			this.loadPic();
			this.setTitle();
			this.setArtist();
			this.setGenre();
			this.loadMusic();
			this.createLikeButton();	
			this.removeLoader();
		},

		loadPic: function () {

			var imageSrc;

			if ( track.artwork_url ) {

				imageSrc = track.artwork_url;

			} else if ( track.user.avatar_url ) {

				imageSrc = track.user.avatar_url;

			} else {

				console.log( "No image" );

			}

			var image = "<img id='albumart' src='" + imageSrc + "' width='100%' height='100%' onerror='UI.get404pic()' />";

			$( '#image' ).fadeOut(400, function() {

				$('#image').html( image ).fadeIn(400);

			});

		},

		setTitle: function () {

			var link = "<a href='" + track.permalink_url + "' target='_blank'>" + track.title + "</a>";

			$('#song-text h1').fadeOut(200, function() {

				$( '#song-text h1' ).html( link ).fadeIn(300);

			});

			var icon = "<img href='" + track.permalink_url + "' src='public/images/soundcloud.png' />";

			$('#song-icon').fadeOut(300).html( icon ).fadeIn();
		},

		setArtist: function () {

			var link = "<a href='" + track.user.permalink_url + "' target='_blank'>" + track.user.username + "</a>";
			
			$( '#artist-name' ).fadeOut(450, function() {

				$( '#artist-name' ).html( link ).fadeIn(350);
			});
		},

		setGenre: function () {

			var genre;

			if ( track.genre ) {

				genre = '#' + track.genre;

			} else {

				genre = '#' + query;

			}

			$( '#info h3' ).fadeOut(500, function(){

				$( '#info h3' ).html(genre).fadeIn(400);

			});
		},

		loadMusic: function () {
			var sound_url = track.stream_url + '?client_id=' + clientID,
				source    = "<source id='source' src='" + sound_url + "' />",
				music     = document.getElementById('music');

			$( '#music' ).empty();
			$( '#music' ).html( source );
			document.getElementById('progress-bar').style.width = 0 + "%";
			music.load();
			music.play();
			$('#playpause').html('<i class="fa fa-pause"></i>');
		},

		createLikeButton: function () {

			$('#like').empty();

			var likeBtn = '<i id="' + track.id + '" onclick=UI.likeThis(this) class="fa fa-heart" aria-hidden="true"></i>';

			$('#like').html( likeBtn );
		},

		likeThis: function (e) {

			$(e).addClass('liked');	

			SC.connect().then(function() {

				SC.put('/me/favorites/' + e.id);

			});
			
		},

		setError: function () {

			$('#load-error').empty();
			var text = "<h1>Something went wrong, try again in a second.</h1";
			$('#load-error').html(text);

		},

		removeError: function() {
			$('#load-error').empty();
		},

		addLoader: function () {
			$('#getMusic').empty();
			var loader = "<div class='spinner'><div class='rect1'></div><div class='rect2'></div><div class='rect3'></div><div class='rect4'></div><div class='rect5'></div></div>";
			$('#getMusic').html(loader);
		},

		removeLoader: function () {
			$('#getMusic .spinner').fadeOut(200, function(){
				$('#getMusic').empty();
			chngBtnTxt();
			})
		},

		get404pic: function () {
			$('#albumart').attr('src', 'public/images/pic.jpg');
		}

	};

})();


// MODULE CREATES AN INTERACTIVE AUDIO PLAYER

var Player = ( function() {

	var playhead = document.getElementById( 'playhead' ),
		timeline = document.getElementById( 'progress-area' ),
		tWidth   = timeline.offsetWidth - playhead.offsetWidth;


		timeline.addEventListener("click", function (event) {
			//Player.moveplayhead(event);
			music.currentTime = music.duration * Player.clickPercent(event);
		}, false);

	return {

		music    : document.getElementById( 'music' ),

		updateState: function () {

			var time = (music.currentTime / music.duration) * 100;

			time = Math.round(time * 10) / 10;
			document.getElementById('progress-bar').style.width = time + "%";

		},

		playMusic: function () {
			var playpause = $('#playpause');
			
			if ( music.paused ) {

				music.play();
				playpause.html('<i class="fa fa-pause"></i>');

				
			} else {

				music.pause();
				playpause.html('<i class="fa fa-play"></i>');

			}

		}, 
		 
		// returns click as decimal (.77) of the total tWidth
		clickPercent: function (e) {
			return (e.pageX - timeline.offsetLeft) / tWidth;
		},
		 
		moveplayhead: function (e) {
			var newMargLeft = e.pageX - timeline.offsetLeft;
		        
			if (newMargLeft >= 0 && newMargLeft <= tWidth) {
				playhead.style.marginLeft = newMargLeft + "px";
			}
			if (newMargLeft < 0) {
				playhead.style.marginLeft = "0px";
			}
			if (newMargLeft > tWidth) {
				playhead.style.marginLeft = tWidth + "px";
			}
		}

	};

})();










