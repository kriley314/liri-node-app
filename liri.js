//
// LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface,
// LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that
// takes in parameters and gives you back data.
//
// LIRI will search 'Spotify' for songs, 'Bands in Town' for concerts, and 'OMDB' for movies.
// 
require("dotenv").config();

var keys = require("./key.js");
var Spotify = require( "node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment")

// Be able to handle the following commands:
//    * `concert-this`
//    * `spotify-this-song`
//    * `movie-this`
//    * `do-what-it-says`
//

// A little house keeping..
if ( process.argv.length < 3 ) {
    console.log( "Use of this tool: Please specify a command: concert-this, spotify-this-song, movie-this, do-what-it-says");
    return;
}

var command = process.argv[ 2 ];
var objectString;

console.log( "Command: " + command + "   Length: " + command.length );
debugger;
if ( command === "concert-this" ) {
  if ( process.argv.length < 4 ) {
      // Not valid!!  Must specify all paraameters..
      console.log( "Use of this tool: Please specify a concert artist following concert-this." );
      return;
  }

  objectString = process.argv.slice( 3 ).join( " " );
  console.log( "objectString: " + objectString + "   Length: " + objectString.length );
  concertThis( objectString );
} else if ( command === "spotify-this-song" ) {

    if ( process.argv.length < 4 ) {
      // For this command, if they don't specify a song, default!!  
      objectString = "The Sign Ace of Base";
    } else {
      objectString = process.argv.slice( 3 ).join( " " );
    }

    spotifyThisSong( objectString );

} else if ( command === "movie-this" ) {
    if ( process.argv.length < 4 ) {
        // For this command, if they don't specify a song, default!!  
        objectString = "Mr.+Nobody";
    } else {
        objectString = process.argv.slice( 3 ).join( "+" );
    }
  
    console.log( "objectString: " + objectString + "   Length: " + objectString.length );
    movieThis( objectString );
} else if ( command === "do-what-it-says" ) {
  doWhatItSays( objectString );
} else {
    console.log( "Unrecognized input: " + command );
}

function concertThis( theArtist ) {
    axios.get( "https://rest.bandsintown.com/artists/" + theArtist + "/events?app_id=codingbootcamp" )
        .then( function( response ) {
            if ( response.data.length > 0 ) {
                for ( let nIndex = 0; nIndex < response.data.length; nIndex++ ) {
                    var dateTime = new Date( response.data[ nIndex ].datetime );
                    dateTime = moment( dateTime ).format( "MM/DD/YYYY");

                    console.log( response.data[ nIndex ].venue.name + "  " +
                                 response.data[ nIndex ].venue.city + "  " +
                                 dateTime );
                }
            }
    })
}

function spotifyThisSong( songName ) {

    spotify.search( { type: 'track', query: songName }, function( err, data ) {
        if ( err ) {
            return console.log( "Spotify Error occurred: " + err );
        } else {
            console.log( "Song Name: " +  data.tracks.items[ 0 ].name );
            console.log( "Artist Name: " + data.tracks.items[ 0 ].artists[ 0 ].name );
            console.log( "Album Name: " + data.tracks.items[ 0 ].album.name );
            console.log( "Preview: " + data.tracks.items[ 0 ].preview_url );
        }
    });
}

// This assumes the movie name is passed in tokenized..
function movieThis( theMovie ) {
debugger;
    var queryUrl = "http://www.omdbapi.com/?t=" + theMovie + "&y=&plot=short&apikey=trilogy";
console.log( "QueryURL: " + queryUrl + "  Trying again.." );

    axios.get( queryUrl ).then( function( response ) {
        console.log( "Title:           " + response.data.Title + "\n" );
        console.log( "Year:            " + response.data.Released + "\n" );

        for ( let i = 0; i < response.data.Ratings.length; i++ ) {
            if (( response.data.Ratings[ i ].Source === "Internet Movie Database" ) ||
                ( response.data.Ratings[ i ].Source === "IMDB" )) {
                // What the neck, allow for IMDB too..
                console.log( "IMDB Rating:     " + response.data.Ratings[ i ].Value );
            } else if ( response.data.Ratings[ i ].Source === "Rotten Tomatoes" ) {
                console.log( "Rotten Tomatoes: " + response.data.Ratings[ i ].Value );
            }
        }

        console.log( "Country:         " + response.data.Country + "\n" );
        console.log( "Language:        " + response.data.Language + "\n" );
        console.log( "Year:            " + response.data.Plot + "\n" );
        console.log( "Actors:          " + response.data.Actors + "\n" );
    })
    .catch ( function( error ) {
        console.error( error );
    });
}

