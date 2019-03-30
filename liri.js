//
// LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface,
// LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that
// takes in parameters and gives you back data.
//
// LIRI will search 'Spotify' for songs, 'Bands in Town' for concerts, and 'OMDB' for movies.
// 
require( "dotenv" ).config();
var fs = require( "fs" );

var keys = require( "./key.js" );
var Spotify = require( "node-spotify-api" );
var spotify = new Spotify( keys.spotify );
var axios = require( "axios" );
var moment = require( "moment" )

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

if ( command === "concert-this" ) {
  if ( process.argv.length < 4 ) {
      // Not valid!!  Must specify all parameters..
      console.log( "Use of this tool: Please specify a concert artist following concert-this." );
      return;
  }

  objectString = process.argv.slice( 3 ).join( " " );
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

    movieThis( objectString );
} else if ( command === "do-what-it-says" ) {
    // Go ahead and see if we have an arg3..  If so, let's use THAT as the filename.  Otherwise,
    // default to random.txt..
    var doWhatItSaysFilename = "random.txt";
    if ( process.argv.length > 3 ) {
      // Apparently they want to override random - let's use it!!  I'm not going to tokenize things..
      // Just see what they get..
      doWhatItSaysFilename = process.argv[ 3 ];
    }

    // And pass it in..
    doWhatItSays( doWhatItSaysFilename );
} else {
    console.log( "Unrecognized liri command: " + command );
    console.log( "Valid commands are: concert-this, spotify-this-song, movie-this, and do-what-it-says.")
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
    var queryUrl = "http://www.omdbapi.com/?t=" + theMovie + "&y=&plot=short&apikey=trilogy";

    axios.get( queryUrl ).then( function( response ) {
        // We got our response!!  Output everything we want!!
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

// This function will read the data from the file as specified by the input prameter.  The
// contents of the file will then be parsed - comma separated - fed to liri as a single command.
//   
function doWhatItSays( doWhatItSaysFilename ) {

    // Start by reading from the file, filename, passed in.
    fs.readFile( doWhatItSaysFilename, "utf8", function( error, data ) {
        if ( error ) {
            return console.log( error );
        }

        if ( data.length === 0 ) {
            console.log( "Input file must contain liri instrucion.\n" )
        }
                
        var liriArguments = data.split( "," );
        var command = liriArguments[ 0 ];    

        // Start with "concert-this"..
        if ( command  === "concert-this" ) {

            if ( liriArguments.length < 2 ) {
                // Not valid!!  Must specify all parameters..
                console.log( "Use of this tool: Please specify a concert artist following concert-this." );
                return;
            }

            // Since we broke apart based on commas, this will let it work if there
            // happened to be a comma in the actual text..
            objectString = liriArguments.slice( 1 ).join( "," );
            concertThis( objectString );

        } else if ( command === "spotify-this-song" ) {

            if ( liriArguments.length < 2 ) {
                // For this command, if they don't specify a song, default!!  
                objectString = "The Sign Ace of Base";
            } else {
                // Since we broke apart based on commas, this will let it work if there
                // happened to be a comma in the actual text..
                objectString = liriArguments.slice( 1 ).join( "," );
            }
        
            spotifyThisSong( objectString );
        
        } else if ( command === "movie-this" ) {

            if ( liriArguments.length < 2 ) {
                // For this command, if they don't specify a song, default!!  
                objectString = "Mr.+Nobody";
            } else {
                objectString = liriArguments.slice( 1 ).join( "+" );
            }
            
            console.log( "objectString: " + objectString + "   Length: " + objectString.length );
            movieThis( objectString );
        }
    });
}

